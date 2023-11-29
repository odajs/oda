const path = import.meta.url.split('/').slice(0, -1).join('/');
ODA({ is: 'oda-jupyter', imports: '@oda/button, @tools/property-grid, @tools/containers',
    template: `
        <style>
            :host{
                @apply --vertical;
                @apply --flex;
                padding: 8px;
                height: auto;
                overflow-x: auto;
            }
            .outline {
                outline: 1px solid var(--border-color);
            }
        </style>
        <div ~if="readOnly || !isReady" style="height: 16px;"></div>
        <oda-jupyter-divider ~if="!readOnly && isReady" index="-1" style="padding: 6px 0 2px; 0" :focused="!notebook?.cells?.length"></oda-jupyter-divider>
        <div ~for="notebook?.cells" class="vertical no-flex">
            <oda-jupyter-cell ~class="{outline: showBorder}" :cell="$for.item" :focused="focusedIndex === $for.index" @tap.stop="focusedIndex = (readOnly ? -1 : $for.index)"></oda-jupyter-cell>
            <oda-jupyter-divider :index="$for.index" style="margin-top: 4px;"></oda-jupyter-divider>
        </div>
    `,
    $listeners: {
        tap(e) { this.focusedIndex = -1; }
    },
    $public: {
        $pdp: true,
        readOnly: {
            $def: false,
            get() {
                return this.notebook?.readOnly;
            }
        },
        collapsedMode: false,
        showBorder: {
            $def: false,
            $save: true
        },
        iconSize: 24,
        editors: ['pell', 'markdown', 'code', 'executable']
    },
    focusedIndex: {
        $pdp: true,
        $def: -1,
    },
    get focusedItem() { return this.notebook?.cells?.[this.focusedIndex] || undefined },
    set src(n) {
        if (n) {
            if (!n.startsWith('http'))
                n = path + '/' + n;
            ODA.loadJSON(n).then(res => {
                this.notebook = res;
            })
        }
    },
    notebook: {
        $pdp: true,
        $def: null
    },
    isReady: false,
    attached() {
        this.async(() => this.isReady = true, 300 );
    }
})
ODA({ is: 'oda-jupyter-divider',
    template: `
        <style>
            :host {
                @apply --vertical;
                height: 8px;
                justify-content: center;
                z-index: 99;
                opacity: 0;
                transition: opacity ease-out .5s;
            }
            :host([focused]) {
                box-shadow: none !important;
            }
            :host([focused]) {
                opacity: 1;
            }
            :host(:hover) {
                opacity: 1;
            }
            oda-button {
                font-size: x-small;
                margin: 0px 4px;
                @apply --content;
                @apply --border;
                padding: 0px 4px 0px 0px;
                border-radius: 4px;
            }
            div {
                opacity: 1;
                height: 10px;
                align-items: center;
                justify-content: start;
            }
        </style>
        <div class="horizontal">
            <oda-button :icon-size icon="icons:add" ~for="editors" @tap.stop="addCell($for.item)">{{$for.item}}</oda-button>
        </div>
    `,
    index: -1,
    addCell(cell_type) {
        this.focusedIndex = -1;
        this.notebook ||= {};
        this.notebook.cells ||= [];
        this.notebook.cells.splice(1 + (+this.index), 0, { cell_type, source: cell_type + '...' });
        this.async(() => {
            this.focusedIndex = 1 + (+this.index);
        })
    }
})

ODA({ is: 'oda-jupyter-cell', imports: '@oda/divider',
    template: `
        <style>
            :host {
                position: relative;
                @apply --no-flex;
                padding: 1px;
                height: {{editMode ? '80vh' : ''}};
                margin: 0 2px;
                opacity: 0;
                transition: opacity ease-out 1s;
            }
            .main {
                min-height: 22px;
            }
            .editor{
                height: {{editMode ? '80vh' : ((cell?.enableResize || control?.enableResize) && cell?.cell_h) ? cell.cell_h + 'px' : '100%'}};
                min-height: {{editMode ? '80vh' : ''}};
                max-height: {{editMode ? '80vh' : ''}};
            }
            .row {
                cursor: pointer;
                padding: 5px;
                color: gray;
                font-size: 12px;
                border: 1px solid lightgray;
            }
        </style>
        <div class="vertical flex main" ~if="!collapsedMode || (collapsedMode && editMode)" style="height: 100%;">
            <div class="vertical flex main">
                <h3 ~if="cell?.structure?.label">{{cell?.structure?.label}}</h3>
                <div ~if="isReady" ~is="cell?.cell_extType || cellType" class="editor" ~class="{shadow: !readOnly && focused}" :edit-mode="!readOnly && focused && editMode" :source="cell.source || ''"  :src="cell.source || ''" :args="cell.args" :fount="cell.fount" :label="cell.label" @change="onchange" :syspanel="!readOnly && focused && editMode" :read-only></div>
                <oda-divider size="0" direction="horizontal" resize use_px></oda-divider>
            </div>
        </div>
        <div class="row" ~if="collapsedMode && !editMode" ~class="{shadow: !readOnly && focused}">{{cell?.label || cell?.cell_type || ''}}</div>
        <oda-jupyter-toolbar ~if="!readOnly && focused" ~style="{top: '-' + iconSize + 'px'}"></oda-jupyter-toolbar>
    `,
    set cell(n) {
        if (n) {
            let type = n.cell_type;
            type = this.editors.includes(type) ? type : 'pell';
            ODA.import('@oda/' + type + '-editor').then(res => {
                this.cellType = 'oda-' + type + '-editor';
            })
        }
    },
    get control() {
        return this.$(this.cellType);
    },
    focused: false,
    editMode: {
        $pdp: true,
        $def: false,
    },
    cellType: 'div',
    $observers: [
        function _focused(focused) {
            if (focused) {
                this.focusedNode = this.cell.structure;
            }
            if (!focused) this.editMode = false;
        }
    ],
    $listeners: {
        endSplitterMove(e) {
            if (!this.readOnly) {
                if (e.detail.value.direction === 'horizontal') {
                    this.cell.cell_h = e.detail.value.h;
                    this.cell.cell_h = this.cell.cell_h < 20 ? 20 : this.cell.cell_h;
                    this.cell.enableResize = true;
                    this.async(() => this.$('.main').style.height = 'unset', 100);
                }
            }
        }
    },
    onchange(e) {
        if (this.isReady) return;
        this.cell.source = e.detail?.value;
        this.fire('change', this.cell.source);
    },
    isReady: false,
    attached() {
        this.async(() => {
            this.isReady = true;
            this.async(() => { this.style.opacity = 1 }, 300);
        }, 100);
    }
})

ODA({ is: 'oda-jupyter-toolbar',
    template: `
        <style>
            :host {
                @apply --horizontal;
                @apply --no-flex;
                @apply --content;
                @apply --shadow;
                position: absolute;
                top: 0;
                right: 8px;
                padding: 1px;
                border-radius: 2px;
                z-index: 100;
            }
        </style>
        <oda-button :disabled="focusedIndex === 0" :icon-size icon="icons:arrow-back:90" @tap="moveCell(-1)"></oda-button>
        <oda-button :disabled="focusedIndex >= notebook?.cells?.length - 1" :icon-size icon="icons:arrow-back:270" @tap="moveCell(1)"></oda-button>
        <span style="width: 8px"></span>
        <oda-button :icon-size icon="icons:settings" ~show="enableSettings" @tap="showSettings"></oda-button>
        <oda-button :icon-size icon="icons:delete" @tap="deleteCell"></oda-button>
        <span style="width: 8px"></span>
        <oda-button allow-toggle ::toggled="editMode" :icon-size :icon="editMode?'icons:close':'editor:mode-edit'" @tap="editMode = !editMode"> </oda-button>
    `,
    enableSettings() {
        return Object.keys(this.control?.props || {}).length > 0;
    },
    enableSettings2() {
        return Object.keys(this.control?.usedControl?.props || {}).length > 0;
    },
    cell: null,
    async showSettings(e) {
        if (!this.enableSettings()) return;
        let control = this.control;
        let io = {};
        let props = {};
        Object.keys(control.props).forEach(key => {
            io[key] = control[key];
            props[key] = {
                default: control[key],
                type: typeof control[key],
                list: control.props[key].list || [],
                category: 'cell - ' + control.localName
            }
        })
        let control2;
        if (this.enableSettings2()) {
            control2 = control.usedControl;
            Object.keys(control2.props).forEach(key => {
                io[key] = control2[key];
                props[key] = {
                    default: control2[key],
                    type: typeof control2[key],
                    list: control2.props?.[key]?.list || [],
                    category: 'editor - ' + control2.localName
                }
            })
        }
        io.props = props;
        io = new Proxy(io, {
            set: function(target, key, value) {
                if (target.props[key].category === 'cell - ' + control.localName) {
                    control[key] = value;
                    control.controlSetArgs?.({ key, value, setArgs: true });
                } else if (target.props[key].category === 'editor - ' + control2.localName) {
                    control2[key] = value;
                    control.controlSetArgs?.({ key, value, setArgs: false });
                }
                target[key] = value;
                return true;
            }
        })
        await ODA.showDropdown(
            'oda-property-grid',
            { inspectedObject: io, style: 'min-width: 360px', showHeader: false },
            { parent: e.target, align: 'left', intersect: true, title: control.localName }
        )
    },
    moveCell(v) {
        this.editMode = false;
        let idx = this.focusedIndex;
        const cells = this.notebook.cells.splice(idx, 1);
        idx = idx + v;
        idx = idx < 0 ? 0 : idx > this.notebook.cells.length ? this.notebook.cells.length : idx;
        this.notebook.cells.splice(idx, 0, cells[0])
        this.async(() => {
            this.focusedIndex = idx;
        })
    },
    deleteCell() {
        if (window.confirm(`Do you really want delete current cell ?`)) {
            this.editMode = false;
            this.notebook.cells.splice(this.focusedIndex, 1);
        }
    }
})
