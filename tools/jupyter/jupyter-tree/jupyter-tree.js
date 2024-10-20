import '../../../components/grids/table/tree/tree.js';
ODA({ is: 'oda-jupyter-tree', extends: 'oda-tree',
    allowFocus: true,
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
    error:{
        $attr: true,
        get(){
            return this.item?.status === 'error'
        }
    },
    get icon(){
        switch (this.item.type){
            case 'code': {
                if (this.item.autoRun)
                    return 'carbon:executable-program';
                return 'carbon:cics-program';
             }
                
            case 'html':
                return 'box:i-code-alt';
        }
        if (this.item.h)
            return 'bootstrap:type-h'+this.item.h
        return 'bootstrap:text-left';
    }
})