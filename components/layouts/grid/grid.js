ODA({is: 'oda-grid', imports: '@oda/button, @oda/checkbox, @oda/menu',
    template:`
        <style>
            ::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }
            ::-webkit-scrollbar-track {
                -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
            }
            ::-webkit-scrollbar-thumb {
                border-radius: 3px;
                background: var(--header-background);
                -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
            }
            ::-webkit-scrollbar-thumb:hover {
                @apply --dark;
                width: 16px;
            }
            :host{
                @apply --flex;
                @apply --vertical;
                overflow: hidden;
                position: relative;
            }
        </style>
        <oda-grid-groups ~if="showGroups" :groups></oda-grid-groups>
        <oda-grid-body></oda-grid-body>
    `,
    props:{
        showGroups: {
            default: false,
            save: true
        },
        columnId: name,
        autoWidth:{
            default: false,
            save: true
        },
        checkMode: {
            default: 'none',
            list: ['none', 'single', 'down', 'up', 'double']
        },
        hideRoot: false,
        hideTop: false,
        idName: '',
        expandAll: false,
        defaultFooter: 'oda-table-footer',
        defaultGroupTemplate: 'oda-table-cell-group',
        defaultHeader: 'oda-table-header',
        defaultTemplate: 'oda-table-cell',
        defaultTreeTemplate: 'oda-table-cell-tree',
        evenOdd: {
            default: false,
            reflectToAttribute: true
        },
    },
    get dataSet(){
        return  []
    },
    set dataSet(n){
        this.$('oda-grid-body').scrollTop = 0;
    },
    groups: [],
    metadata: [],
    get states() {
        const states = {}
        // const post = {
        //     expanded: this.screenExpanded,
        //     groups: this.groups.map(g => ({name: g.name, label: g.label})),
        //     sort: this.sorts.map(i => {
        //         return {name: i.name, order: i.$sort === 1 ? 'asc' : 'desc' }
        //     }),
        //     filter: this.filters.map(i => {
        //         return { [i.name]: i.$filter }
        //     })
        // };
        const from = Math.round(this._scrollTop / this._rowHeight);
        const length = Math.round(this._height / this._rowHeight) || 1;
        return {from, length};
    },
    get items() {
        if (!this.dataSet?.length) return [];
        const extract = (items, level, parent) => {
            if (!this.groups.length && this.allowSort && this.sorts.length)
                this._sort(items);
            return items.reduce((res, i) => {
                i.$parent = parent;
                i.$level = level;
                // if (!this.hideTop || level > -1)
                    res.push(i);
                const child = this._beforeExpand(i);
                if (child?.then)
                    child.then(res => i.$hasChildren = res);
                else
                    i.$hasChildren = child?.length;

                if ((i.$expanded === undefined && (this.expandAll || (this.expandLevel < i.level))) || (level < 0 && !i.$expanded))
                    i.$expanded = true;
                if (i.$expanded) {
                    if (i.items?.length)
                        res.push(...extract(i.items, level + 1, i));
                    else
                        i.items = undefined;
                    this.expand(i);
                }
                return res;
            }, []);
        };

        let array = Object.assign([], this.dataSet);
        array = extract(array, this.hideRoot || this.hideTop ? -1 : 0);
        this.applyColumnFilters(array);
        if (this.groups.length)
            this.applyGroups(array);
        return array;
    },
    get rows(){
        if (!this.lazy || !this.items?.length)
            return this.items || [];
        const raised = [];
        const rows = this.items.slice(this.states.from, this.states.from + this.states.length);
        if (rows.length) {
            while (rows[0].$parent && this.items.includes(rows[0].$parent)) {
                raised.push(rows[0].$parent);
                rows.unshift(rows[0].$parent);
                if (rows.length > this.states.length)
                    rows.pop();
            }
        }
        this.raisedRows = raised;
        return rows;
    },
    get cols() {
        const cols = this.metadata.map((col, i) => {
            col.order = i+1;
            if (col.treeMode)
                col.order - 500;
            switch (col.fix) {
                case 'left':
                     col.order - 1000;
                    break;
                case 'right':
                    col.order + 1000;
                    break;
            }
            col.index = col.order;
            return col;
        }).filter(i => !i.hidden);
        if (!this.autoWidth)
            cols.push({ index: 999, template: 'span' });
        if (this.checkMode !== 'none' && !this.columns.some(i => i.treeMode))
            cols.push({ width: 32, index: -999, template: 'oda-table-check', header: 'div', fix: 'left' });
        cols.sort((a, b) => (a.index - b.index));
        cols.filter(i => i.fix === 'left' || i.treeMode).reduce((res, i) => {
            i.left = res;
            res += i.width || 0;
            return res;
        }, 0);

        cols.filter(i => i.fix === 'right').reverse().reduce((res, i) => {
            i.right = res;
            res += i.width || 0;
            return res;
        }, 0);
        // cols.forEach((c, i) => {
        //     c.id = i;
        // });
        return cols;
    },
    _beforeExpand(item) {
        return item.items;
    },
    applyColumnFilters(items){

    },
    applyGroups(items){

    },
    expand(row, force, old) {
        const items = this._beforeExpand(row, force);
        if (items?.then) {
            const id = setTimeout(()=>{
                row.$loading = true;
                this.render();
            })
            return items.then(async items => {
                clearTimeout(id)
                row.$loading = false;
                const node = old || row;
                if ((node.items && node.$expanded)){
                    if(this.allowSort && this.sorts.length)
                        this._sort(items)
                    for (let i in items){
                        const n = items[i];
                        const o = (this.idName?node.items.find(i=>i[this.idName] === n[this.idName]):node.items[i]) || node.items[i];
                        n.$expanded = o?.$expanded;
                        if (n.$expanded){
                            this.expand(n, false, o);
                        }
                    }
                }
                items = items.length?row.items = items:row.items = undefined;
                return items;
            }).catch(() => {
                clearTimeout(id)
                row.$loading = false;
            });
        }
        else{
            row.items = items;
        }
        return items;
    },
})
ODA({is: 'oda-grid-body',
    template:`
        <style>
        
        </style>
        <oda-grid-header></oda-grid-header>
        <div>
            <oda-grid-row ~for="rows" :row="item"></oda-grid-row>
        </div>
        <oda-grid-footer></oda-grid-footer>
    `,

})
ODA({is: 'oda-grid-row',
    template: `
        <span ~for="cols" ~is="getCellTemplate(row, item)"></span>
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
})
ODA({is: 'oda-grid-header',
    template: `
    `
})
ODA({is: 'oda-grid-footer', extends: 'oda-grid-header',
    template: `
    `
})