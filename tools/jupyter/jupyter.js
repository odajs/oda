ODA({ is: 'oda-jupyter', imports: '@oda/button',
    template: `
        <style>
            :host{
                @apply --vertical;
                @apply --flex;
                padding: 12px 6px;
                height: calc(100% - 24px);
                opacity: 0;
                transition: opacity ease-out 1s;
            }
        </style>
        <oda-jupyter-divider idx="-1" :focused="!notebook?.cells?.length"></oda-jupyter-divider>
        <div ~for="notebook?.cells" class="vertical no-flex">
            <oda-jupyter-cell :idx="$for.index" :cell="$for.item" :focused="focusedIdx === $for.index" @tap.stop="focusedIdx = (_readOnly ? -1 : $for.index);"></oda-jupyter-cell>
            <oda-jupyter-divider :idx="$for.index" style="margin-top: 4px;"></oda-jupyter-divider>
        </div>
    `,
    $public: {
        $pdp: true,
        iconSize: 24,
        readOnly: false
    },
    $pdp: {
        notebook: null,
        editors: ['Код', 'Текст'],
        focusedIdx: {
            $def: -1,
            set(n) {
                this.editIdx = -1;
            }
        },
        editIdx: -1,
        get _readOnly() {
            return this.notebook?.readOnly || this.readOnly;
        }
    },
    attached() {
        this.async(() => {
            this.style.opacity = 1;
        }, 500)
    },
    $listeners: {
        tap(e) { this.focusedIdx = this.editIdx = -1 }
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
                position: relative;
                padding: 1px;
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
                font-size: 14px;
                margin: 0px 4px;
                @apply --content;
                @apply --border;
                padding: 0px 4px 0px 0px;
                border-radius: 4px;
            }
        </style>
        <div class="horizontal center">
            <div ~if="!_readOnly && idx!==-1" style="width: 100%; position: absolute; top: 2px; height: 1px; border-bottom: 2px solid gray;"></div>
            <oda-button ~if="!_readOnly" :icon-size icon="icons:add" ~for="editors" @tap.stop="addCell($for.item)">{{$for.item}}</oda-button>
        </div>
    `,
    idx: -2,
    addCell(cell_type) {
        let idx = this.idx + 1;
        this.focusedIdx = this.editIdx = -1;
        this.notebook ||= {};
        this.notebook.cells ||= [];
        this.notebook.cells.splice(idx, 0, { cell_type, source: '' });
        this.async(() => this.focusedIdx = idx);
    }
})

ODA({ is: 'oda-jupyter-cell',
    template: `
        <style>
            :host {
                @apply --no-flex;
                position: relative;
                padding: 1px;
                margin: 0 2px;
                transition: opacity ease-out 1s;
            }
        </style>
        <div class="vertical flex main" style="height: 100%; min-height: 22px;">
            <div ~is="this.cellType || 'div'" :idx :cell ~class="{shadow: !_readOnly && focused}"></div>
        </div>
        <oda-jupyter-toolbar :idx ~if="!_readOnly && focused" ~style="{top: '-' + (iconSize - 4) + 'px'}"></oda-jupyter-toolbar>
    `,
    set cell(n) {
        if (n) {
            let type = n.cell_type;
            this.cellType = 'oda-jupyter-' + (type === 'Код' ? 'code' : 'text') + '-editor';
        }
    },
    idx: -2,
    focused: false
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
                border-radius: 4px;
                z-index: 100;
            }
        </style>
        <oda-button :disabled="focusedIdx === 0" :icon-size icon="icons:arrow-back:90" @tap="moveCell(-1)"></oda-button>
        <oda-button :disabled="focusedIdx >= notebook?.cells?.length - 1" :icon-size icon="icons:arrow-back:270" @tap="moveCell(1)"></oda-button>
        <span style="width: 8px"></span>
        <oda-button :icon-size icon="icons:delete" @tap="deleteCell"></oda-button>
        <span style="width: 8px"></span>
        <oda-button :icon-size :icon="editIdx===idx?'icons:close':'editor:mode-edit'" @tap="editIdx = editIdx===idx ? -1 : idx"> </oda-button>
    `,
    iconSize: 20,
    cell: null,
    idx: -2,
    moveCell(v) {
        this.editIdx = -1;
        let idx = this.focusedIdx;
        const cells = this.notebook.cells.splice(idx, 1);
        idx = idx + v;
        idx = idx < 0 ? 0 : idx > this.notebook.cells.length ? this.notebook.cells.length : idx;
        this.notebook.cells.splice(idx, 0, cells[0])
        this.async(() => {
            this.focusedIdx = idx;
        })
    },
    deleteCell() {
        if (window.confirm(`Do you really want delete current cell ?`)) {
            this.editIdx = -1;
            this.notebook.cells.splice(this.focusedIdx, 1);
        }
    }
})

ODA({ is: 'oda-jupyter-text-editor', imports: '@oda/simplemde-editor,  @oda/md-viewer',
    template: `
        <style>
            oda-md-viewer::-webkit-scrollbar { width: 0px; height: 0px; }
            :host {
                @apply --horizontal;
                @apply --flex;
            }
            oda-md-viewer {
                opacity: {{opacity}};
                border: none;
                outline: none;
            }
        </style>
        <oda-simplemde-editor ~if="!readOnly && editIdx===idx" style="max-width: 50%; min-width: 50%; padding: 0px; margin: 0px;" @change="_onchange"></oda-simplemde-editor>
        <oda-md-viewer tabindex=0 class="flex" :srcmd="src || _src" :pmargin="'0px'" @dblclick="_setEditMode" @keypress="_keyPress"></oda-md-viewer>
    `,
    set cell(n) {
        this.src = n?.source || '';
    },
    idx: -2,
    src: '',
    _src: 'Чтобы изменить содержимое ячейки, дважды нажмите на нее (или выберите "Ввод")',
    get opacity() {
        return this.src ? 1 : .3;
    },
    _onchange(e) {
        this.cell.source = this.src = e.detail.value;
        this.fire('change', this.cell);
        console.log(this.cell)
    },
    _keyPress(e) {
        if (e.key === 'Enter')
            this._setEditMode();
    },
    _setEditMode() {
        this.editIdx = this.editIdx === this.idx ? -1 : this.idx;
        this.async(() => {
            this.$('oda-simplemde-editor').value = this.src;
        })
    }
})

ODA({ is: 'oda-jupyter-code-editor', imports: '@oda/ace-editor',
    template: `
        <style>
            :host {
                @apply --horizontal;
                @apply --flex;
                outline: 1px solid var(--border-color);
            }
            oda-icon {
                padding: 4px;
                height: {{iconSize}};
            }
            #icon-close {
                margin-top: {{_top}};
            }
            #icon-close:hover {
                fill: red;
            }
        </style>
        <div class="vertical"  style="border-right: 1px solid var(--border-color); padding: 4px 0px">
            <oda-icon :icon-size="iconSize" :icon @pointerover="_icon='av:play-circle-outline'" @tap="_run" @pointerout="_icon=''" style="cursor: pointer; position: sticky; top: 0" :fill="run ? 'green' : 'black'"></oda-icon>
            <oda-icon id="icon-close" ~if="run" :icon-size="iconSize" :icon="_iconClose" @tap="run=false" style="cursor: pointer; position: sticky; top: 24px"></oda-icon>
        </div>
        <div class="vertical flex">
            <oda-ace-editor :src mode="html" class="flex" show-gutter="false" max-lines="Infinity" :read-only style="padding: 8px 0" @change="_onchange"></oda-ace-editor>   
            <iframe ~if="run" :srcdoc style="width: 100%; border: none; border-top: 1px solid var(--border-color); opacity: 0; min-height: 32px; height: 32px;"></iframe>
        </div>
    `,
    src: '',
    set cell(n) {
        this.src = n?.source || '';
    },
    run: false,
    _icon: '',
    _iconClose: 'eva:o-close-circle-outline',
    get _top() {
        return this.$('oda-ace-editor')?.editor.container.style.height || '0px';
    },
    srcdoc: '',
    get icon() {
        return this.run ? 'av:play-circle-outline' : this._icon || 'bootstrap:code-square';
    },
    _onchange(e) {
        this._top = undefined;
        this.cell.source = e.detail.value;
        this.fire('change', this.cell);
    },
    _run() {
        this._top = undefined;
        this._iconClose = 'spinners:180-ring-with-bg';
        this.srcdoc = '';
        this.run = true;
        this.async(() => {
            const iframe = this.$('iframe');
            this.srcdoc = `
<style>
    html, body {
        margin: 0;
        padding: 0;
        position: relative;
        font-family: monospace;
        font-size: 18px;
    }
    * *, *:before, *:after {  
        box-sizing: border-box;
    }
</style>
            ` + this.$('oda-ace-editor').value;
            this.async(() => {
                iframe.style.height = iframe.contentDocument.body.scrollHeight + 'px';
                iframe.style.opacity = 1;
                this._iconClose = 'eva:o-close-circle-outline';
            }, 300)
        }, 100)
    }
})
