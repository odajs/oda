ODA({is: 'oda-grid-row',
    template: `
        <style>
            :host{
                @apply --horizontal;
                position: sticky;
                position: -webkit-sticky;
            }
            :host([col-lines]) .cell{
                border-right: 1px solid var(--dark-background);
                box-sizing: border-box;
            }
            :host([col-lines]) .cell[fix=right]{
                border-width: 2px !important;
            }
        </style>
        <span ~for="col in cols" ~is="getCellTemplate(row, col)"  :col ~style="getStyle(col)">{{row?.[col?.name]}}</span>
    `,
    row: {},
    getCellTemplate(row, col) {
        if (row.$role)
            return row.template || col.template || this.defaultTemplate;
        if (row.$group)
            return this.defaultGroupTemplate;
        if (col.treeMode)
            return this.defaultTreeTemplate;
        let template = col.template || row.template || this.defaultTemplate;
        if (typeof template === 'object')
            return template.tag || template.is || template.template;
        return template;
    },
    getStyle(col) {
        const style = {width: col?.width + 'px'};
        if (this.rowLines)
            style.borderBottom = '1px solid'
        // {width: col?.width+'px', borderBottom: 1px solid }
        return style;
    }
})
ODA({is: 'oda-grid-header', extends: 'oda-grid-row',
    getCellTemplate(row, col) {
        return this.defaultHeader;
    },
})
ODA({is: 'oda-grid-footer', extends: 'oda-grid-header',
    getCellTemplate(row, col) {
        return this.defaultFooter;
    },
})