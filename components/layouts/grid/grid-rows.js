ODA({is: 'oda-grid-row', imports: './grid-cells.js',
    template: `
        <style>
            :host{
                @apply --horizontal;
                position: sticky;
                position: -webkit-sticky;
                justify-content: start;
            }
            :host>*{
                box-sizing: border-box; 
            }
        </style>
        <span class="flex" ~for="col in cols" ~is="getTemplate(col)" :col ~style="getStyle(col)">{{row?.[col?.name]}}</span>
    `,
    props:{

    },
    row: {},
    getTemplate(col) {
        if (this.row.$role)
            return this.row.template || col.template || this.defaultTemplate;
        if (this.row.$group)
            return this.defaultGroupTemplate;
        if (col.treeMode)
            return this.defaultTreeTemplate;
        let template = col.template || this.row.template || this.defaultTemplate;
        if (typeof template === 'object')
            return template.tag || template.is || template.template;
        return template;
    },
    getStyle(col) {
        const w = col.width + 'px';
        const style = {width: col.width + 'px', minWidth: col.width + 'px', order: col.order};
        if (this.colLines){
            switch (col?.fix){
                case 'right':{
                    style['border-left'] = '1px solid var(--dark-background)';
                } break;
                default:{
                    style['border-right'] = '1px solid var(--dark-background)';
                }
            }

        }
        if (this.rowLines)
            style['border-bottom'] = '1px solid var(--dark-background)';
        if(col?.fix){
            style['background-color'] = 'var(--header-background)';
            style['border-color'] = 'var(--content-background)';
            style.right = '0px';
            style.left = (col.left || 0)+'px';
            style['border-left-width'] = style['border-right-width'] = '2px';
            style['max-width'] = style.width;
        }
        else{
            style['z-index'] = -1;
            if (!this.autoWidth && !col.free)
                style['max-width'] = style.width;

        }
        style.position = 'sticky';

        return style;
    }
})
ODA({is: 'oda-grid-header', extends: 'oda-grid-row',
    getTemplate(col) {
        return this.defaultHeader;
    },
})
ODA({is: 'oda-grid-footer', extends: 'oda-grid-header',
    getTemplate(col) {
        return this.defaultFooter;
    },
})