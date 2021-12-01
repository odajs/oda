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
                overflow: auto;
            }
        </style>
        <oda-grid-groups a.b="444" ~if="showGroups" :groups></oda-grid-groups>
        <oda-grid-body class="flex" :even-odd></oda-grid-body>
    `,
    listeners:{
        scroll(e){

        }
    },
    props:{
        lines:{
            cols: false,
            rows: false
        },
        iconSize: 32,
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
        defaultFooter: 'oda-grid-cell-footer',
        defaultGroupTemplate: 'oda-grid-cell-group',
        defaultHeader: 'oda-grid-cell-header',
        defaultTemplate: 'span',
        defaultTreeTemplate: 'span',//'oda-grid-cell-tree',
        evenOdd: {
            default: false,
            category: 'decorate'
        },
        templates:{
            data: 'span',
            header: 'oda-grid-cell-header',
            footer: 'oda-grid-cell-footer',
            group: 'oda-grid-cell-group',
            tree: 'oda-grid-cell-tree',
        },
        showHeader: true,
        colLines: false,
        rowLines: false,
        lazy: false,
        showFilter: false,
        icon: 'odant:grid',
        iconChecked: 'icons:check-box',
        iconUnchecked: 'icons:check-box-outline-blank',
        iconCollapsed: 'icons:chevron-right',
        iconExpanded: 'icons:chevron-right:90',
        iconExpanding: 'odant:spin',
        iconIntermediate: 'icons:check-box-indeterminate',
    },
    get dataSet(){
        return  []
    },
    set dataSet(n){
        this.style.visibility = 'hidden';
        this.scrollTop = 0;
    },
    get bodyHeight(){
        return this.$('oda-grid-body').offsetHeight;
    },
    get rowHeight(){
        return 30;
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
        const from = Math.round(this.scrollTop / this.rowHeight);
        let length = (Math.round(this.bodyHeight / this.iconSize) || 100) / devicePixelRatio;
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
                col.order -= 500;
            switch (col.fix) {
                case 'left':
                     col.order -= 1000;
                    break;
                case 'right':
                    col.order += 1000;
                    break;
            }
            return col;
        }).filter(i => !i.hidden);

        if (this.checkMode !== 'none' && !this.columns.some(i => i.treeMode))
            cols.push({ width: 32, order: -999, template: 'oda-grid-check', header: 'div', fix: 'left' });
        cols.sort((a, b) => (a.order - b.order));
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

        if (!this.autoWidth)
            cols.push({ order: 999, template: 'span', free: true });
        return cols;
    },
    _beforeExpand(row) {
        return row.items;
    },
    applyColumnFilters(items){

    },
    applyGroups(items){

    },
    expand(row, force, old) {
        const items = this._beforeExpand(row, force);
        if (items?.then) {
            const timer = setTimeout(()=>{
                row.$loading = true;
                this.render();
            })
            return items.then(async items => {
                clearTimeout(timer)
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
                clearTimeout(timer)
                row.$loading = false;
            });
        }
        else{
            row.items = items;
        }
        return items;
    },
})
ODA({is: 'oda-grid-body', imports: './grid-rows.js',
    template:`
        <style>
            :host{
                overflow: visible;
                @apply --vertical;
                @apply --noflex;
            }
            :host([even-odd]) oda-grid-row:not([selected]):nth-child(odd):not([role]):not([dragging]) {
                background-color: rgba(0,0,0,.05);
            }
            :host([row-lines]) oda-grid-row{
                border-bottom: 1px  solid var(--dark-background);
                box-sizing: border-box;
            }
            :host>*{
                position: sticky;
                top: 0px;
                bottom: 0px;
            }
        </style>
        <oda-grid-header></oda-grid-header>
        <div class="flex vertical" style="z-index: -1;">
            <oda-grid-row ~for="row in rows" :row></oda-grid-row>
            <oda-grid-row class="disabled flex" :row="{}" ~style="{minHeight: iconSize+'px'}"></oda-grid-row>
        </div>
        <oda-grid-footer></oda-grid-footer>
    `,
    ready(){
        this.style.visibility = 'hidden';
    },
    onRender(){
        if (this.style.visibility){
            this.debounce('render', ()=>{
                this.style.visibility = '';
            },100)
        }
    },
    props:{
        evenOdd: {
            default: false,
            reflectToAttribute: true
        },
    }
})
