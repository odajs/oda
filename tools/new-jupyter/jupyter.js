const path = import.meta.url.split('/').slice(0, -1).join('/');
ODA({
    is: 'oda-jupyter', imports: '@oda/button, @tools/property-grid, @tools/containers',
    template: `
        <style>
            :host{
                @apply --vertical;
                @apply --flex;
            }
        </style>
        <oda-jupyter-divider ~if="!readOnly" index="-1"></oda-jupyter-divider>
        <div ~for="notebook?.cells" class="vertical no-flex">
            <oda-jupyter-cell  :cell="item" :focused="focusedIndex === index" @tap.stop="focusedIndex = (readOnly ? -1 : index)"></oda-jupyter-cell>
            <oda-jupyter-divider ~if="!readOnly" :index></oda-jupyter-divider>
        </div>
    `,
    listeners: {
        tap(e) {
            this.focusedIndex = -1;
        }
    },
    props: {
        iconSize: 16,
        readOnly: {
            default: false,
            get() {
                return this.notebook?.readOnly;
            }
        },
        editors: {
            default: ['html', 'code', 'markdown']
        }
    },
    focusedIndex: -1,
    get focusedItem() { return this.notebook?.cells?.[this.focusedIndex] || undefined },
    set src(n) {
        if (!n.startsWith('http'))
            n = path + '/' + n;
        ODA.loadJSON(n).then(res => {
            this.notebook = res;
        })
    },
    notebook: {}
})
ODA({
    is: 'oda-jupyter-divider',
    template: `
        <style>
            :host{
                @apply --vertical;
                height: 16px;
                justify-content: center;
            }
            :host>div{
                transition: opacity ease-out .5s;
            }
            :host(:hover)>div{
                opacity: 1;
            }
            oda-button{
                font-size: x-small;
                margin: 0px 8px;
                @apply --content;
                @apply --border;
                padding: 0px 4px 0px 0px;
                border-radius: 4px;
            }
            div{
                opacity: 0;    
                height: 2px;
                align-items: center;
                justify-content: center;
            }
        </style>
        <div class="horizontal header">
            <oda-button :icon-size icon="icons:add" ~for="editors" @tap.stop="addCell(item)">{{item}}</oda-button>
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

ODA({
    is: 'oda-jupyter-cell',
    template: `
        <style>
            :host{
                position: relative;
                @apply --no-flex;
                padding: 1px;
            }
            .editor{
                padding: 4px;
            }
        </style>
        <div class="editor" ~is="cellType" ~class="{shadow: !readOnly && focused}" :edit-mode="!readOnly && focused && editMode" ::source="cell.source" ::args="cell.args"></div>
        <oda-jupyter-toolbar ~if="!readOnly && focused"></oda-jupyter-toolbar>
    `,
    set cell(n) {
        if (n) {
            this.src = n.cell_type;
        }
    },
    set src(n) {
        if (n) {
            ODA.import('@oda/' + n).then(res => {
                this.cellType = 'oda-' + n;
            })
        }
    },
    get control() {
        return this.$(this.cellType);
    },
    focused: false,
    editMode: false,
    cellType: 'div'
})

import './icaro.js';
ODA({
    is: 'oda-jupyter-toolbar',
    template: `
        <style>
            :host{
                position: absolute;
                top: -{{iconSize}}px;
                right: 8px;
                @apply --horizontal;
                @apply --no-flex;
                padding: 1px;
                @apply --content;
                @apply --shadow;
                border-radius: 2px;
            }
        </style>
        <oda-button :disabled="focusedIndex === 0" :icon-size icon="icons:arrow-back:90" @tap="moveCell(-1)"></oda-button>
        <oda-button :disabled="focusedIndex >= notebook?.cells?.length - 1" :icon-size icon="icons:arrow-back:270" @tap="moveCell(1)"></oda-button>
        <span style="width: 8px"></span>
        <oda-button :icon-size icon="icons:settings" ~show="_getShowSettings(control)" @tap="showSettings($event, control)"></oda-button>
        <oda-button :icon-size icon="icons:settings" ~show="_getShowSettings2(control)" @tap="showSettings($event, control?.usedControl, true)"></oda-button>
        <oda-button :icon-size icon="icons:delete" @tap="deleteCell"></oda-button>
        <span style="width: 8px"></span>
        <oda-button allow-toggle ::toggled="editMode" :icon-size :icon="editMode?'icons:close':'editor:mode-edit'" @tap="editMode = !editMode"></oda-button>
    `,
    _getShowSettings(control) {
        return Object.keys(control?.props || {}).length > 0;
    },
    _getShowSettings2(control) {
        return Object.keys(control?.usedControl?.props || {}).length > 0;
    },
    cell: null,
    async showSettings(e, control, setArgs) {
        const props = icaro({ props: {} });
        Object.keys(control.props).forEach(key => {
            props[key] = control[key];
            props.props[key] = {
                default: control[key],
                type: typeof control[key],
                list: control.props[key].list || []
            }
        })
        props.listen((e) => {
            for (const [key, value] of e.entries()) {
                control[key] = value;
                this.control.controlSetArgs && this.control.controlSetArgs({ key, value, setArgs });
            }
        })
        await ODA.showDropdown(
            'oda-property-grid',
            { inspectedObject: props, style: 'min-width: 360px', showHeader: false },
            { parent: e.target, align: 'bottom', title: control.localName }
        )
    },
    moveCell(v) {
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
        this.notebook.cells.splice(this.focusedIndex, 1);
    }
})
