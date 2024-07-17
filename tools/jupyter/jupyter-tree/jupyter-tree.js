import '../../../components/grids/table/tree/tree.js';
ODA({ is: 'oda-jupyter-tree', extends: 'oda-tree',
    allowFocus: true,
    disallowFocusOnPointer: false,
    get dataSet() {
        return this.notebook?.items
    },
    cellTemplate: 'oda-jupyter-tree-cell',
    onTapRows(e) {
        this.$super('oda-table', 'onTapRows', e);
        this.scrollToCell?.(e.target.item);
    }
 });
ODA({
    is: 'oda-jupyter-tree-cell', extends: 'this, oda-table-cell',
    template: /*html*/`
        <style>
            span{
                padding: 0px 8px;
            }
            oda-icon{
                transform: scale(.7);
            }
        </style>
        <oda-icon :icon></oda-icon>
    `,
    bold:{
        $attr: true,
        get(){
            return !!this.item?.h
        }
    },
    get icon(){
        switch (this.item.type){
            case 'code':
                return 'bootstrap:code';
            case 'html':
                return 'box:i-code-alt';
        }
        if (this.item.h)
            return 'bootstrap:type-h'+this.item.h
        return 'bootstrap:text-left';
    }
})