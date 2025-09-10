ODA({
    is: 'oda-jupyter-tree', imports: '@oda/tree', extends: 'oda-tree',
    allowFocus: true,
    get dataSet() {
        return [this.notebook];
    },
    cellTemplate: 'oda-jupyter-tree-cell',
    autoFixRows: true,
    hideRoot: true,
    hideTop: true,
    allowSelection: 'level'
});
ODA({
    is: 'oda-jupyter-tree-cell', extends: 'oda-table-cell-base',
    template: /*html*/`
        <style>
            span{
                padding: 0px 8px;
            }
            .btn-code:hover{
                border-radius: 50%;
                @apply --success-invert;
            }
        </style>
        <oda-button class="btn-code" ~if="item.type ==='code'" :icon @down.stop="onTap" :error="!!item?.fn" :info-invert="item?.autoRun" :success="!item?.time" style="border-radius: 50%;  transform: scale(.8);"></oda-button>
        <span class="field-control flex" ~is="template" :column :item ::value style="overflow: hidden">{{value ?? ''}}</span>
        <oda-button ~if="item.type ==='code'" :icon="iconEye" title="Hide/Show" style="border-radius: 50%; transform: scale(0.8);" @tap="toggleOutput" scale=".5"></oda-button>
    `,
    focused: {
        $type: Boolean,
        $def: false,
        $attr: true,
    },
    $public: {
        $pdp: true,
        template: 'span',
        get value() {
            return this.item?.[this.column?.[this.columnId]] ?? '';
        },
        set value(n) {
            this.item[this.column[this.columnId]] = n;
        }
    },
    bold: {
        $attr: true,
        get() {
            return !!this.item?.h || this.item?.constructor.name === 'JupyterNotebook';
        }
    },
    error: {
        $attr: true,
        get() {
            let error = (this.item?.type === 'code' && this.item?.status === 'error');
            if (error)
                this.domHost.setAttribute('error', '');
            else
                this.domHost.removeAttribute('error');
            return error;
        }
    },
    dimmed: {
        $attr: true,
        get() {
            return this.item?.hideCode;
        }
    },
    get icon() {
        return this.cell?.fn ? 'av:stop' : 'av:play-circle-outline';
    },
    get iconEye() {
        return this.cell?.cell?.hideCode ? 'bootstrap:eye-slash' : 'bootstrap:eye';
    },
    onTap(e) {
        this.cell?.run();
    },
    get cell() {
        return  this.jupyter.getCell(this.item.id);
    },
    toggleOutput() {
        this.cell.cell.hideCode = !this.cell.cell.hideCode;
    },
    $listeners: {
        tap(e) {
            this.jupyter._lastId ||= this.jupyter?.focusedCell?.id;
            if (this.jupyter._lastId === this.jupyter?.focusedCell?.id)
                this.cell?.scrollToCell?.();
            this.jupyter._lastId = e.target.cell?.cell?.id;
        }
    }
})
