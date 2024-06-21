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
        // const selector = `oda-jupyter-cell[id="${e.target.item.id}"]`;
        // this.jupyter.$(selector)?.scrollIntoView();
        const cellElements = this.jupyter.$$('oda-jupyter-cell');
        const cellElement = cellElements.find(el => el.cell.id === e.target.item.id);
        cellElement?.scrollIntoView();
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
        <oda-icon ~if="!bold" :icon></oda-icon>
    `,
    bold:{
        $attr: true,
        get(){
            return !!this.item?.h
        }
    },
    header:{
        $attr: true,
        get(){
            return !!this.item?.h
        }
    },
    get icon(){
        switch (this.item.type){
            case 'code':
                return 'av:play-circle-outline';
            case 'html':
                return 'box:i-code-alt';
        }
        if (this.item.h)
            return 'bootstrap:type-h'+this.item.h
        return 'bootstrap:text-left';
    }
})