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
        <oda-jupyter-divider index="-1" :focused="!notebook?.cells?.length"></oda-jupyter-divider>
        <div ~for="notebook?.cells" class="vertical no-flex">
            <oda-jupyter-cell :cell="$for.item" :focused="focusedIndex === $for.index" @tap.stop="focusedIndex = (_readOnly ? -1 : $for.index)"></oda-jupyter-cell>
            <oda-jupyter-divider :index="$for.index" style="margin-top: 4px;"></oda-jupyter-divider>
        </div>
    `,
    $listeners: {
        tap(e) { this.focusedIndex = -1; }
    },
    $public: {
        $pdp: true,
        iconSize: 24,
        editors: ['Код', 'Текст'],
        readOnly: false,
        get _readOnly() {
            return this.notebook?.readOnly || this.readOnly;
        }
    },
    notebook: {
        $pdp: true,
        $def: null
    },
    focusedIndex: {
        $pdp: true,
        $def: -1,
    },
    get focusedItem() { return this.notebook?.cells?.[this.focusedIndex] || undefined }

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
            <div ~if="!_readOnly && index!==-1" style="width: 100%; position: absolute; top: 2px; height: 1px; border-bottom: 2px solid gray;"></div>
            <oda-button ~if="!_readOnly" :icon-size icon="icons:add" ~for="editors" @tap.stop="addCell($for.item)">{{$for.item}}</oda-button>
        </div>
    `,
    index: -1,
    addCell(cell_type) {
        this.focusedIndex = -1;
        this.notebook ||= {};
        this.notebook.cells ||= [];
        this.notebook.cells.splice(1 + (+this.index), 0, { cell_type });
        this.async(() => this.focusedIndex = 1 + (+this.index));
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
            <div ~is="this.cellType || 'div'" :cell ~class="{shadow: !_readOnly && focused}" :edit-mode></div>
        </div>
        <oda-jupyter-toolbar ~if="!_readOnly && focused" ~style="{top: '-' + (iconSize - 4) + 'px'}"></oda-jupyter-toolbar>
    `,
    set cell(n) {
        if (n) {
            let type = n.cell_type;
            this.cellType = 'oda-jupyter-' + (type === 'Код' ? 'code' : 'text')  + '-editor';
        }
    },
    focused: false,
    editMode: {
        $pdp: true,
        $def: false,
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
                border-radius: 4px;
                z-index: 100;
            }
        </style>
        <oda-button :disabled="focusedIndex === 0" :icon-size icon="icons:arrow-back:90" @tap="moveCell(-1)"></oda-button>
        <oda-button :disabled="focusedIndex >= notebook?.cells?.length - 1" :icon-size icon="icons:arrow-back:270" @tap="moveCell(1)"></oda-button>
        <span style="width: 8px"></span>
        <oda-button :icon-size icon="icons:delete" @tap="deleteCell"></oda-button>
        <span style="width: 8px"></span>
        <oda-button allow-toggle ::toggled="editMode" :icon-size :icon="editMode?'icons:close':'editor:mode-edit'" @tap="editMode = !editMode"> </oda-button>
    `,
    iconSize: 20,
    cell: null,
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

ODA({ is: 'oda-jupyter-text-editor',
    template: `
        <style>

        </style>
        <div class="horizontal" style="padding: 4px">
            Чтобы изменить содержимое ячейки, дважды нажмите на нее (или выберите "Ввод")
        </div>
    `,
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
