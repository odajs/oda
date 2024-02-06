ODA({ is: 'oda-jupyter', imports: '@oda/button',
    template: `
        <style>
            :host{
                @apply --vertical;
                @apply --flex;
                padding: 12px 6px;
                height: calc(100% - 24px);
            }
        </style>
        <oda-jupyter-divider idx="-1" :focused="!notebook?.cells?.length"></oda-jupyter-divider>
        <div ~for="notebook?.cells" class="vertical no-flex">
            <oda-jupyter-cell :idx="$for.index" :cell="$for.item" :focused="focusedIdx === $for.index" @tap.stop="focusedIdx = (_readOnly ? -1 : $for.index);"></oda-jupyter-cell>
            <oda-jupyter-divider :idx="$for.index" style="margin-top: 4px;"></oda-jupyter-divider>
        </div>
    `,
    $listeners: {
        tap(e) { this.focusedIdx = this.editIdx = -1; }
    },
    $public: {
        $pdp: true,
        iconSize: 24,
        editors: ['Код', 'Текст'],
        readOnly: false,
        get _readOnly() {
            return this.notebook?.readOnly || this.readOnly;
        },
        focusedIdx: {
            $def: -1,
            set(n) {
                this.editIdx = -1;
            },
        },
        editIdx: -1
    },
    notebook: {
        $pdp: true,
        $def: null
    },
    get focusedItem() { return this.notebook?.cells?.[this.focusedIdx] || undefined }

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
        this.focusedIdx = this.editIdx = -1;
        this.notebook ||= {};
        this.notebook.cells ||= [];
        this.notebook.cells.splice(1 + (+this.idx), 0, { cell_type });
        this.async(() => this.focusedIdx = 1 + (+this.idx));
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
            <div :idx ~is="this.cellType || 'div'" :cell ~class="{shadow: !_readOnly && focused}"></div>
        </div>
        <oda-jupyter-toolbar :idx ~if="!_readOnly && focused" ~style="{top: '-' + (iconSize - 4) + 'px'}"></oda-jupyter-toolbar>
    `,
    set cell(n) {
        if (n) {
            let type = n.cell_type;
            this.cellType = 'oda-jupyter-' + (type === 'Код' ? 'code' : 'text')  + '-editor';
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
        <oda-simplemde-editor ~if="!readOnly && editIdx===idx" style="max-width: 50%; min-width: 50%; padding: 0px; margin: 0px; " @change="onchange"></oda-simplemde-editor>
        <oda-md-viewer tabindex=0 class="flex" :srcmd="src" :pmargin="'0px'" @dblclick="editIdx = editIdx===idx ? -1 : idx" @keypress="_keyPress"></oda-md-viewer>
    `,
    idx: -2,
    src: 'Чтобы изменить содержимое ячейки, дважды нажмите на нее (или выберите "Ввод")',
    get opacity() {
        return this.src === 'Чтобы изменить содержимое ячейки, дважды нажмите на нее (или выберите "Ввод")' ? .3 : 1;
    },
    onchange(e) {
        this.src = e.detail.value;
        this.fire('change', this.src);
    },
    // $keyBindings: {
    //     enter(e) {
    //         this.editIdx = this.editIdx === this.idx ? -1 : this.idx;
    //     }
    // },
    _keyPress(e) {
        if (e.key === 'Enter')
        this.editIdx = this.editIdx === this.idx ? -1 : this.idx;
    }
})

ODA({ is: 'oda-jupyter-code-editor',
    template: `
        <style>
            :host {

            }
            .outline {
                outline: 1px solid var(--border-color);
            }
        </style>
        <div class="horizontal outline" style="padding: 4px">
            [ ]
        </div>
    `,
})
