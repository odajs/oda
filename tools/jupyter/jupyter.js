ODA({ is: 'oda-jupyter',
    template: `
        <style>
            :host {
                @apply --flex;
                @apply --vertical;
                padding: 12px 0;
            }
            .focused {
                box-shadow: 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.4);
            }
        </style>
        <oda-jupyter-cell ~class="{focused:!readOnly&&focusedCell===cell}" ~for="cell in notebook?.cells" :cell :idx="index"></oda-jupyter-cell>
    `,
    props: {
        url: {
            default: '',
            async set(n) {
                if (n) {
                    fetch(n)
                        .then(response => response.json())
                        .then(json => this.notebook = json);
                }
            }
        },
        readOnly: false,
        focusedCell: {
            type: Object,
            set(v) {
                this.editedCell = undefined
            }
        },
        borderOnEdit: false
    },
    notebook: {},
    editedCell: undefined,
    reset() {
        this.focusedCell = undefined;
        fetch(this.url)
            .then(response => response.json())
            .then(json => this.notebook = json);
    }
})

ODA({ is: 'oda-jupyter-cell',
    template: `
        <style>
            :host {
                display: block;
                position: relative;
                margin: 6px 12px;
                order: {{cell?.order || 0}};
                box-shadow: {{readOnly || (!readOnly && !borderOnEdit) ? '' : 'inset 0px 0px 0px 1px lightgray'}};
            }

        </style>
        <oda-jupyter-cell-toolbar ~if="!readOnly && focusedCell===cell" :cell></oda-jupyter-cell-toolbar>
        <div ~is="cellType" :id="'cell-'+cell?.order" @tap="focusedCell=cell" :cell style="min-height: 24px;"></div>
    `,
    props: {
        idx: {
            type: Number,
            set(v) {
                this.cell._order = this.cell.order = v;
            }
        }
    },
    cell: {},
    get cellType() {
        if (this.cell?.cell_type === 'markdown') return 'oda-jupyter-cell-markdown';
        if (this.cell?.cell_type === 'code') return 'oda-jupyter-cell-code';
        return 'div';
    }
})

ODA({ is: 'oda-jupyter-cell-toolbar', imports: '@oda/button',
    template: `
        <style>
            :host {
                display: flex;
                position: absolute;
                right: 8px;
                top: -12px;
                z-index: 21;
                box-shadow: 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.4);
                background: white;
                width: 160px;
                height: 24px;
            }
            oda-button {
                border-radius: 3px;
            }
        </style>
        <oda-button icon="icons:arrow-back:90" :icon-size @tap="tapOrder($event, -1.1)" :disabled="cell.order<=0" title="move up"></oda-button>
        <oda-button icon="icons:arrow-forward:90" :icon-size @tap="tapOrder($event, 1.1)" :disabled="cell.order>=notebook?.cells?.length-1" title="move down"></oda-button>
        <oda-button icon="editor:mode-edit" :icon-size @tap="editedCell=editedCell===cell?undefined:cell" ~style="{fill: editedCell===cell ? 'red' : ''}" title="edit mode"></oda-button>
        <div class="flex"></div>
        <oda-button icon="icons:delete" :icon-size @tap="" title="delete"></oda-button>
    `,
    iconSize: 14,
    cell: {},
    tapOrder(e, v) {
        if (this.focusedCell !== this.cell) return;
        const ord = this.cell.order = this.cell.order + v;
        this.notebook.cells.sort((a, b) => a.order - b.order).map((i, idx) => i.order = idx - 1.1 <= ord ? idx : idx + 1);
    }
})

ODA({ is: 'oda-jupyter-cell-markdown', imports: '@oda/md-viewer, @oda/ace-editor, @oda/splitter',
    template: `
        <style>
            :host {
                @apply --horizontal;
                @apply --flex;
                min-height: 24px;
            }
            oda-ace-editor {
                height: unset;
                min-width: 50%;
            }
        </style>
        <oda-ace-editor class="flex" ~if="!readOnly&&editedCell===cell" :value="source || cell?.source" highlight-active-line="false" show-print-margin="false" theme="solarized_light" mode:markdown show-gutter="false" min-lines=1></oda-ace-editor></oda-ace-editor>
        <!-- <oda-splitter class="no-flex" ~if="!readOnly&&editedCell===cell" style="width: 4px;"></oda-splitter> -->
        <oda-md-viewer class="flex" :srcmd="cell?.source" :src="cell?.src"></oda-md-viewer>
    `,
    cell: {},
    source: '',
    listeners: {
        change(e) {
            this.source = this.$('oda-ace-editor').value;
            this.debounce('changeCellValue', () => {
                this.cell.source = this.source;
            }, 1000);
        },
        dblclick(e) {
            this.editedCell = this.editedCell === this.cell ? undefined : this.cell;
        }
    },
    observers: [
        function setEditedCell(editedCell) {
            if (editedCell === this.cell) {
                this.source = this.$('oda-md-viewer').source;
            }
        }
    ]
})

ODA({ is: 'oda-jupyter-cell-code', imports: '@oda/ace-editor',
    template: `
        <style>
            :host {
                position: relative;
                @apply --horizontal;
                @apply -- flex;
                border: 1px solid #eee;
                align-items: flex-start;
                padding: 4px;
            }
            .box {
                width: 24px;
                cursor: pointer;
                align-self: flex-start;
                padding-right: 4px;
            }
        </style>
        <div class="box vertical no-flex">[...]</div>
        <oda-ace-editor class="flex" :value="cell?.source" highlight-active-line="false" show-print-margin="false" :theme="!readOnly&&editedCell===cell?'solarized_light':'dawn'" min-lines=1 :read-only="isReadOnly"></oda-ace-editor>
    `,
    cell: {},
    listeners: {
        change(e) {
            this.cell.source = this.$('oda-ace-editor').value;
        },
        dblclick(e) {
            this.editedCell = this.editedCell === this.cell ? undefined : this.cell;
        }
    },
    get isReadOnly() {
        if (this.cell?.cell_props?.editable) return false;
        if (this.cell?.cell_props?.editable === false) return true;
        return this.editedCell !== this.cell || this.readOnly;
    }
})
