ODA({ is: 'oda-jupyter-tree', imports: '@oda/tree', extends: 'oda-tree',
    allowFocus: true,
    get dataSet() {
        return [this.notebook];
    },
    cellTemplate: 'oda-jupyter-tree-cell',
    onTapRows(e) {
        this.$super('oda-table', 'onTapRows', e);
        this.scrollToCell?.(e.target.item);
    },
    autoFixRows : true,
    hideRoot: true
 });
ODA({is: 'oda-jupyter-tree-cell', extends: 'this, oda-table-cell',
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
            return !!this.item?.h || this.item?.constructor.name === 'JupyterNotebook';
        }
    },
    error:{
        $attr: true,
        get(){
            return this.item?.status === 'error'
        }
    },
    warning:{
        $attr: true,
        get(){
            return this.item?.hideCode;
        }
    },
    successInvert:{
        $attr: true,
        get(){
            return this.item?.autoRun;
        }
    },
    get icon(){
        let icon = this.item.icon;
        if (!icon){
            switch (this.item.type){
                case 'code': {
                    if (this.item.autoRun)
                        return 'av:play-circle-filled';
                    return 'av:play-circle-outline';
                }

                case 'html':
                    return 'box:i-code-alt';
            }
            if (this.item.h)
                return 'bootstrap:type-h'+this.item.h
            return 'bootstrap:text-left';
        }
        return icon;
    }
})