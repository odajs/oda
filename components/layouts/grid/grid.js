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
        <oda-grid-groups ~if="showGroups" :groups></oda-grid-groups>
        <oda-grid-body class="flex" :even-odd></oda-grid-body>
    `,
    listeners:{
        scroll(e){

        }
    },
    props:{
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
        // lazy: false,
        showFilter: false
    },
    get dataSet(){
        return  []
    },
    set dataSet(n){
        this.$('oda-grid-body').scrollTop = 0;
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
        const length = Math.round(this.bodyHeight / this.rowHeight) || 1;
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
            cols.push({ width: 32, index: -999, template: 'oda-grid-check', header: 'div', fix: 'left' });
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
            <div class="flex" ~style="{minHeight: '50px'}"></div>
        </div>
        <oda-grid-footer></oda-grid-footer>
    `,
    props:{
        evenOdd: {
            default: false,
            reflectToAttribute: true
        },
    }
})


cells: {
    ODA({is: "oda-grid-cell-base",
        template:/*html*/`
            <style>
                :host{
                    @apply --horizontal;
                    align-items: center;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    min-height: 1px;
                    min-width: 1px;
                }
                :host *{
                    text-overflow: ellipsis;
                    position: relative;
                }
                .expander{
                    cursor: pointer;
                }
            </style>
        `,
        col: null

    });
    ODA({is: 'oda-grid-cell-expand', extends: "oda-grid-cell-base",
        template:/*html*/`
            <oda-icon ~if="row?.$level !== -1" :icon :disabled="hideIcon" :icon-size @dblclick.stop.prevent @tap.stop.prevent="_toggleExpand" @down.stop.prevent  class="expander" ~style="{opacity: (hideIcon || !icon)?0:1}"></oda-icon>
        `,
        get hideIcon() {
            return this.row?.hideExpander || (!this.row?.items?.length && !this.row?.$hasChildren);
        },
        get icon() {
            if (!this.row || this.hideIcon)
                return '';
            if (this.row.$loading)
                return this.iconExpanding;
            if (this.row.$expanded)
                return this.iconExpanded;
            return this.iconCollapsed;
        },
        _toggleExpand(e, d) {
            if (!this.row.hideExpander) {
                this.row.$expanded = !this.row.$expanded;
                // this.fire('expanded-changed', this.row.$expanded);
            }
        }
    });

    tree: {
        ODA({is: 'oda-grid-cell-tree', extends: 'oda-grid-cell-base', template:/*html*/`
            <style>
                :host *{
                  --line-border: 1px solid silver;
                    /*align-items: center;*/
                    background-color: unset;
                }
                :host:last-child .step {
                    height: 50%;
                }
                .icon{
                    height: auto;
                    align-items: center;
                    align-content: center;
                }
                .step {
                    position: relative;
                    height: 100%;
                }
                .step > .end-step{
                    position: absolute;
                    right: 0;
                    height: 100%;
                }
            </style>
            <div class="step no-flex" ~style="{width: (row.$level || 0) * stepWidth + 'px', ...stepStyle}">
                <div class="end-step" ~style="endStepStyle"></div>
            </div>
            <oda-grid-cell-expand class="no-flex" :row></oda-grid-cell-expand>
            <oda-grid-check class="no-flex" ~if="(row?.allowCheck !== 'none') || (allowCheck && allowCheck !== 'none' && !row.hideCheckbox)" :col :row></oda-grid-check>
            <div ~is="row?.[col[columnId]+'.template'] || row?.template || col?.template || defaultTemplate || 'span'" :col :row class="flex">{{row[col[columnId]]}}</div>`,
            get endStepStyle() {
                if (!this.showTreeLines || !this.stepWidth) return {};
                const thickness = this.treeLineStyle.width || 1;
                const pre = `${Math.round((this.iconSize + thickness) / 2)}px`;
                const post = `${pre} + ${thickness}px`;
                const color = this.treeLineStyle.color || 'rgba(0, 0, 0, 0.25)';
                return {
                    width: this.stepWidth - Math.round((this.iconSize + thickness) / 2) + 'px',
                    background: `linear-gradient(0deg, transparent 0, transparent calc(${pre}), ${color} calc(${pre}), ${color} calc(${post}), transparent calc(${post}))`
                }
            },
            get stepStyle() {
                if (!this.showTreeLines || !this.iconSize) return {}
                const step = this.stepWidth;
                const thickness = this.treeLineStyle?.width || '1px';
                const color = this.treeLineStyle?.color || 'rgba(0, 0, 0, 0.25)';
                let str = '';
                const lineStart = Math.round((this.iconSize - thickness) / 2);
                const lineEnd = lineStart + thickness;
                str = `, transparent, transparent ${lineStart}px, ${color} ${lineStart}px, ${color} ${lineEnd}px, transparent ${lineEnd}px, transparent ${step}px`;
                return { background: `repeating-linear-gradient(90deg ${str})` };
            },
            get stepWidth() {
                return this.treeStep ?? this.iconSize ?? 0;
            }
        });

        ODA({is: "oda-empty-tree-cell", extends: "oda-icon, oda-grid-cell-base", template: `
        <label class="label flex">nothing</label>`,
            props: {
                icon: 'notification:do-not-disturb'
            }
        });

        ODA({is: "oda-grid-check", extends: 'oda-grid-cell-base', template: `
            <oda-icon class="no-flex" @down.stop.prevent="_toggleChecked" @tap.stop.prevent :icon :icon-size ~style="{padding: Math.round(iconSize*.2)+'px'}"></oda-icon>`,
            props: {
                icon() {
                    if (!this.row.checked || this.row.checked === 'unchecked')
                        return this.iconUnchecked;
                    if (this.row.checked === true || this.row.checked === 'checked')
                        return this.iconChecked;
                    return this.iconIntermediate;
                }
            },
            _toggleChecked(e) {
                if (this.allowCheck === 'none') return;

                const checkChildren = (row) => {
                    (row.items || []).forEach(i => {
                        if (row.checked !== 'intermediate') {
                            i.checked = row.checked;
                            updateCheckedRows(i);
                            checkChildren(i);
                        }
                    })
                };
                const updateChecked = (row) => {
                    row.checked = (row.items || []).reduce((res, i) => {
                        if (res === 'intermediate')
                            return res;
                        else if (res === undefined)
                            res = i.checked ? i.checked : false;
                        else if (res !== ((i.checked === undefined) ? false : i.checked))
                            res = 'intermediate';
                        return res;
                    }, undefined);
                    updateCheckedRows(row);
                };
                const updateCheckedRows = (row) => {
                    const i = this.checkedRows.indexOf(row);
                    if (row.checked && i === -1)
                        this.checkedRows.push(row);
                    else if (!row.checked && i !== -1)
                        this.checkedRows.splice(i, 1);
                };

                this.row.checked = !(!!this.row.checked);
                updateCheckedRows(this.row);
                if (this.allowCheck !== 'single') {
                    if (this.allowCheck === 'double' || this.allowCheck === 'down') {
                        checkChildren(this.row);
                    }
                    if (this.allowCheck === 'double' || this.allowCheck === 'up') {
                        let parent = this.row.$parent;
                        while (parent) {
                            updateChecked(parent);
                            parent = parent.$parent;
                        }
                    }
                }

                this.table.fire('checked-changed');
            }
        });
    }

    ODA({is: "oda-grid-error", extends: "oda-grid-cell-base", template: /*html*/`
            <oda-icon icon="icons:error"></oda-icon>
            <span class="label flex" :text="row.error"></span>`
    });

    const MHW = 24; //min header width
    ODA({is: "oda-grid-cell-header", extends: 'oda-grid-cell-base', template: /*html*/`
        <style>
            :host{
                font-weight: bold;
                @apply --header;
                @apply --flex;
                @apply --horizontal;
                cursor: pointer;
                justify-content: space-around;
                overflow: hidden;
                align-items: initial !important;
                box-sizing: border-box;
            }
            .split{
                cursor: col-resize;
                border: 2px solid transparent;
                transition: border-color .5s;
                /*border-color: silver;*/
            }
            .split:hover{
                border-color: silver;
            }
            oda-icon, oda-grid-cell-and {
                opacity: .5;
            }
            :host(:hover)>oda-icon{
                opacity: 1;
            }
            input{
                width: 0px;
                font-size: x-small;
                opacity: .8;
            }
            oda-button{
                padding: 0px;
                min-width: {{Math.round(iconSize * .5)+4}}px;
                min-height: {{Math.round(iconSize * .5)+4}}px;
            }
            span{
                margin: 4px 0px;
                text-overflow: ellipsis;
            }
            div{
                overflow: hidden;
            }
            oda-grid-cell-header{
                box-sizing: border-box;
                /*border: 1px solid red;*/
            }
            .sub-cols{
                border-top: 1px solid var(--dark-background);
                box-sizing: border-box;
            }
            .sub-cols>oda-grid-cell-header:not(:nth-child(1)){
                border-left: 1px solid var(--dark-background);
                box-sizing: border-box;
            }
            oda-icon:after{
                content: attr(sort);
                font-size: small;
                top: 0px;
                position: absolute;
                right: 0px;
            }
            :host .filter-container{
                @apply --content;
                @apply --border;
                padding: 2px;
            }
            :host .filter-input{
                border: none;
            }
        </style>
        <div class="flex vertical" style="cursor: pointer" @tap.stop="_sort">
            <div class="flex horizontal" ~if="col.name" ~style="{flexDirection: col.fix === 'right'?'row-reverse':'row'}">
                <div class="flex horizontal" style="align-items: center;">
                    <oda-grid-cell-expand :row="col"></oda-grid-cell-expand>
                    <span class="label flex" :text="col.label || col.name" draggable="true" @dragover="_dragover" @dragstart="_dragstart" @dragend="_dragend" @drop="_drop"></span>
                    <oda-icon :show="showSort && sortIcon" title="sort" :icon="sortIcon" :sort="sortIndex"></oda-icon>
                </div>
                <div class="split" @tap.stop @track="_track"></div>
            </div>
            <div class="flex horizontal filter-container" ~if="!col.$expanded && col.name && showFilter" style="align-items: center" @tap.stop>
                <input class="flex filter-input" ::value="filter" @tap.stop>
                <oda-button :icon-size="Math.round(iconSize * .5)+2" @tap.stop="showDD" icon="icons:filter" style="align-self: baseline;" title="filter"></oda-button>
                <oda-button :icon-size="Math.round(iconSize * .5)+2" icon="icons:close" @tap.stop="filter = ''" title="clear"></oda-button>
            </div>
            <div class="flex sub-cols horizontal" ~if="col.$expanded">
                <oda-grid-cell-header ~for="col in col.items" :col :show-filter="showFilter" ~style="{width: col.width?col.width+'px':'auto' }" :save-key="col.name ? (col.name || col.id) + col.name : ''" ref="subColumn"></oda-grid-cell-header>
            </div>
            <div class="flex" ~if="!col.name"></div>
        </div>`,
        props: {
            showSort() {
                return this.allowSort && !this.col$expanded && (!this.col.$parent || this.col.$parent.$expanded);
            },
            showFilter: false,
            filter: {
                type: String,
                set(val) {
                    this.col.$filter = val || null;
                }
            },
            sortIcon() {
                const sort = this.col.$sort;
                return sort === 1 ? 'icons:arrow-drop-down' : sort === -1 ? 'icons:arrow-drop-up' : '';
            },
            sortIndex() {
                return (this.sorts?.filter(s => !s.hidden).indexOf(this.col) + 1) || '';
            },
            minWidth(){
                let width = 15;
                if (this.col.$expanded && this.$refs.subColumn?.length){
                    width = this.$refs.subColumn.reduce((res, c) => {
                        res += Math.max(c.minWidth || 15, 15);
                        return res;
                    }, 0);
                }else if(this.col.items?.length){
                    width = getWidth(this.col);
                }
                return width;
            },
        },
        // updated() {
        //     if (this.table && this.table.set && this.col.$parent) {
        //         this.table.set(this.col, 'width', Math.round(this.offsetWidth));
        //     }
        // },
        listeners: {
            contextmenu: '_menu',
            resize(e){
                this.col.width = this.offsetWidth;
            }
        },
        _dragstart(e) {
            this.table._draggableColumn = this.col;
        },
        _dragend(e) {
            this.table._draggableColumn = null;
        },
        _dragover(e) {
            if (this.table._draggableColumn && this.table._draggableColumn !== this.col) {
                e.preventDefault();
            }
        },
        _drop(e) {
            this.table._swapColumns(this.table._draggableColumn, this.col);
            this.table._draggableColumn = null;
        },
        _track(e, d) {
            switch (e.detail.state) {
                case 'start': {
                    this.col.width = Math.round(this.offsetWidth);
                } break;
                case 'track': {
                    const delta = e.detail.ddx * (this.col.fix === 'right' ? -1 : 1);
                    const clientRect = this.getClientRects()[0];
                    if (delta > 0 && e.detail.x < (clientRect.x + clientRect.width) && this.col.fix !== 'right') return;
                    let p = this.col;

                    while (p) {
                        const w = Math.round(p.width + delta);
                        p.width = Math.max(w, this.minWidth);
                        p = p.$parent;
                    }
                    const setChildrenWidth = (col, delta) => {
                        if (col.items?.length) {
                            const d = Math.round((delta || 0) / col.items.length);
                            col.items.forEach(i => {
                                const w = i.width + d;
                                i.width = Math.max(getMinWidth(i), w);
                                setChildrenWidth(i, d);
                            });
                        }
                    };
                    setChildrenWidth(this.col, delta);
                } break;
                case 'end': {
                    let col = this.col;
                    const writeChildren = col => {
                        col.items?.forEach(c => {
                            // this.table.__write(this.table.settingsId + '/col/' + c.id + '/width', c.width);
                            writeChildren(c);
                        });
                    };
                    writeChildren(col);
                    while (col) {
                        // this.table.__write(this.table.settingsId + '/col/' + col.id + '/width', col.width);
                        col = col.$parent;
                    }
                } break;
            }
        },
        async _menu(e) {
            e.preventDefault();
            e.stopPropagation();
            const menu = [
                {
                    label: this.table.groups.includes(this.col) ? 'Ungrouping' : 'Grouping' + ' by this column',
                    icon: 'icons:open-in-browser',
                    execute: () => {
                        if (this.table.groups.includes(this.col))
                            this.table.removeGroup(this.col);
                        else
                            this.table.addGroup(this.col);
                    }
                },
                {
                    label: 'Hide this column',
                    icon: 'icons:visibility-off',
                    execute: () => {
                        this.col.hidden = !this.col.hidden;
                        // this.table.__write(this.table.settingsId + '/column/' + this.column.name + '/hidden', this.column.hidden);
                    }
                },
                {
                    label: (this.table.showGroupingPanel ? 'Hide' : 'Show') + ' grouping panel',
                    icon: 'icons:credit-card',
                    group: 'more', execute: () => {
                        this.table.showGroupingPanel = !this.table.showGroupingPanel;
                    }
                },
                {
                    label: (this.table.showFilter ? 'Hide' : 'Show') + ' filter row',
                    icon: 'icons:filter',
                    execute: () => {
                        this.table.showFilter = !this.table.showFilter;
                    }
                }
            ];
            const res = await ODA.showDropdown('oda-menu', { parent: this, iconSize: this.iconSize, items: menu, title: 'Column menu', allowClose: true });
            res?.focusedItem.execute();
        },
        _sort(e) {
            e.stopPropagation();
            if (this.allowSort) {
                const sort = this.col.$sort;
                this.col.$sort = sort === 1 ? -1 : sort === -1 ? 0 : 1;
            }
        },
        async showDD(e) {
            const dataSet = this.items.reduce((res, i) => {
                const value = i[this.row.name];
                if (value) {
                    res.add(i);
                }
                return res;
            }, []);
            const list = await ODA.createComponent('oda-grid', { columns: [this.row], dataSet });
            this.async(() => {
                list.focus();
            }, 300);
            const res = await ODA.showDropdown(list, {}, { parent: this });
            console.log(res);
        }
    });
    function getMinWidth(col) {
        if (col.items?.length) {
            return col.items.reduce((res, c) => res + Math.max(getMinWidth(c) || 0, 15), 0);
        } else {
            return 15;
        }
    }
    function getWidth(col){
        if (col.items?.length) {
            return col.items.reduce((res, c) => res + Math.max(getWidth(c) || 0, 15), 0);
        } else {
            return Math.max(col.width, 15);
        }
    }

    ODA({is: "oda-grid-cell-group", extends: 'oda-grid-cell-base',
        template: /*html*/`
            <style>
                :host{
                    justify-content: left;
                    @apply --header;
                    position: sticky;
                    position: -webkit-sticky;
                    left: 0px;
                    top: 0px;
                    position: sticky;
                }
                span{
                    @apply --flex;
                }
            </style>
            <oda-grid-cell-expand :item ~style="{marginLeft: row.$level * iconSize + 'px'}" @expanded-changed="expandedChanged"></oda-grid-cell-expand>
            <span :text="\`\${row.name}:\`" style="font-size: small; margin-right: 4px;" class="no-flex"></span>
            <span :text="row.value" style="font-weight: bold; margin-right: 4px;" class="no-flex"></span>
            <span ~if="row.items" :text="\`[\${row.items?.length}]\`" class="no-flex"></span>`,
        expandedChanged() {
            this.table.setScreenExpanded?.(this.item);
        }
    });

    ODA({is: "oda-grid-cell-footer", extends: 'oda-grid-cell-header', template:/*html*/`
        <style>
            :host{
                justify-content: flex-end;
                padding: 4px;
                @apply --dark;
                text-align: right;
                font-size: smaller;
            }
        </style>`
    });
}