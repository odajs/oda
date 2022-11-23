ODA({is: "oda-table", imports: '@oda/button, @oda/checkbox, @oda/icon, @oda/splitter, @oda/menu',
    template: /*html*/`
    <style>
        :host {
            @apply --flex;
            @apply --vertical;
            overflow: hidden;
            position: relative;
        }
        :host([show-borders]) {
            border: 1px solid gray;
        }
    </style>
    <oda-table-group-panel ~if="showGroupingPanel" :groups></oda-table-group-panel>
    <oda-table-header :columns="headerColumns" ~if="showHeader"></oda-table-header>
    <oda-table-body :scroll-left="$scrollLeft" class="no-flex" fix :rows="raisedRows"></oda-table-body>
    <oda-table-body ref="body" :scroll-left="$scrollLeft" class="flex" :rows></oda-table-body>
    <oda-table-footer :columns="rowColumns" ~show="showFooter" class="dark"></oda-table-footer>
    `,
    onDblClick(e) {
        const el = e.path.find(p => p.row);
        if (el)
            this.table.fire('row-dblclick', el.row);
    },
    async openSettings(e){
        await ODA.showDropdown(
            'oda-table-settings',
            {table: this.table},
            {parent: e.target, intersect: true, align: 'left', title: 'Settings', hideCancelButton: true}
        );
    },
    get storage(){
        return ODA.LocalStorage.create(this.$savePath);
    },
    get screenFrom() {
        return Math.round(this.$scrollTop / this.rowHeight);
    },
    get screenLength() {
        return (Math.round(this.$height / this.rowHeight) || 0) + 1;
    },
    columns: [],
    dataSet: [],


    // get dataSet(){
    //     return  [];
    // },
    // set dataSet(n) {
    //     this.$refs.body && (this.$refs.body.scrollTop = 0);
    // },
    props: {
        noLazy: false,
        pivotMode:{
            default: false,
            save: true
        },
        rowFixLimit:{
            default: 10,
            save: true,
        },
        allowSettings: false,
        allowCheck: {
            default: 'none',
            list: ['none', 'single', 'down', 'up', 'double', 'cleardown']
        },
        allowDrag: false,
        allowDrop: false,
        allowFocus: false,
        allowHighlight: false,
        allowSelection: {
            reflectToAttribute: true,
            list: ['none', 'all', 'level', 'type'],
            default: 'none',
            set(n, o) {
                if (o)
                    this.clearSelection();
            }
        },
        allowSort: false,
        autoRowHeight: false,
        autoWidth: {
            default: false,
            reflectToAttribute: true
        },
        colLines: {
            default: false,
            reflectToAttribute: true
        },
        columnId: 'name',

        // customRows: false,

        defaultFooter: 'oda-table-footer-cell',
        defaultGroupTemplate: 'oda-table-cell-group',
        defaultHeader: 'oda-table-header-cell',
        defaultTemplate: 'oda-table-cell',
        defaultTreeTemplate: 'oda-table-cell-tree',
        evenOdd: {
            default: false,
            reflectToAttribute: true
        },
        focusedRow: {
            type: Object,
            freeze: true,
            set(n) {
                if (n){
                    this.debounce('focusedRow', ()=>{
                        this.scrollToItem(n);
                    })
                    // this.fire('focused-row-changed', n); // ToDo - temporary solution
                }
            }
        },
        highlightedRow: Object,
        groupExpandingMode: {
            default: 'none',
            list: ['none', 'first', 'auto', 'all']
        },


        hideRoot: false,
        hideTop: false,
        icon: 'odant:grid',
        iconChecked: 'icons:check-box',
        iconCollapsed: 'icons:chevron-right',
        iconExpanded: 'icons:chevron-right:90',
        iconExpanding: 'odant:spin',
        iconIntermediate: 'icons:check-box-indeterminate',
        iconSize: 24,
        iconUnchecked: 'icons:check-box-outline-blank',
        rowLines: {
            default: false,
            reflectToAttribute: true,
            save: true
        },
        showBorders: {
            type: Boolean,
            reflectToAttribute: true
        },
        showFilter: {
            type: Boolean,
            default: false,
            save: true,
        },
        showFooter: false,
        showGroupingPanel: {
            default: false,
            save: true
        },
        showGroupFooter: false,
        showHeader: false,
        showTreeLines: {
            type: Boolean,
            reflectToAttribute: true
        },
        treeLineStyle: {
            type: Object,
            default: {
                width: 1,
                color: 'rgba(0, 0, 0, 0.25)'
            }
        },
        treeStep: 24,
        expandLevel: -1,
        expandAll: false
    },
    get size() {
        return this.items?.length || 0;
    },
    $height: 0,
    $scrollTop: 0,
    $scrollWidth: 0,
    _selectedAll: false,
    $scrollLeft: 0,
    checkedRows: [],
    draggedRows: [],
    get filters() {
        return this.columns?.filter(i => i.$filter) || [];
    },
    get footer() {
        const obj = {};
        this.rowColumns.forEach(c => {
            switch (c.summary) {
                case 'count': {
                    obj[c[this.columnId]] = this.size;
                } break;
                case 'sum': {
                    obj[c[this.columnId]] = this.dataSet.reduce((res, r) => {
                        const v = r[c.name];
                        if (v)
                            res += parseFloat(v);
                        return res;
                    }, 0);
                } break;
                default: {
                    if (c.treeMode || c.showScreenInfo) {
                        let d = this.size;
                        if (this.screenFrom !== undefined && this.screenLength !== undefined) {
                            let to = this.screenFrom + this.screenLength;
                            if (to > d)
                                to = d;
                            if (d)
                                d = d.toLocaleString() + '  [ ' + (this.screenFrom).toLocaleString() + ' ... ' + to.toLocaleString() + ' ]';
                        }
                        obj[c[this.columnId]] = d || '';
                    }
                }
            }
        });
        return obj;
    },
    groups: [],
    pivotLabels: [],
    get headerColumns() {
        this.columns.forEach((col, i) => {
            modifyColumn.call(this, col);
            if (col[this.columnId]) {
                col.order = col.order || i + 1;
            } else {
                col.order = i + 1;
            }
            if (col.treeMode)
                col.index = col.order - 500;
            switch (col.fix) {
                case 'left':
                    col.index = col.order - 1000;
                    break;
                case 'right':
                    col.index = col.order + 1000;
                    break;
                default:
                    col.index = col.order;
                    break;
            }
        });
        const cols = this.columns.filter(i => !i.$hidden);
        if (!this.autoWidth)
            cols.push({ index: 999, template: 'div', header: 'div', footer: 'div' });
        if (this.allowCheck !== 'none' && !this.columns.some(i => i.treeMode)) {
            cols.push({ width: 32, index: -999, template: 'oda-table-check', header: 'div', fix: 'left' });
        }
        cols.sort((a, b) => (a.index - b.index));
        cols.filter(i => i.fix === 'left' || i.treeMode).reduce((res, i) => {
            i.left = res;
            res += i.width || i.$width || 0;
            return res;
        }, 0);

        cols.filter(i => i.fix === 'right').reverse().reduce((res, i) => {
            i.right = res;
            res += i.width || i.$width || 0;
            return res;
        }, 0);
        cols.forEach((c, i) => {
            c.id = i;
        });
        return cols;
    },
    get items() {
        if (!this.dataSet?.length) return [];
        let array = Object.assign([], this.dataSet);
        array = extract.call(this, array, this.hideRoot || this.hideTop ? -1 : 0);
        this._useColumnFilters(array);
        // this._filter(array);
        if (this.groups.length)
            this._group(array);
        return array;
    },
    raisedRows: [],
    get rowColumns() {
        const convert = (cols) => {
            return cols.filter(i=>!i.$hidden).reduce((res, col) => {
                modifyColumn.call(this.table, col)
                if (col.$expanded && col.items?.length) {
                    const items = col.items.filter(i=>!i.$hidden).map((c, i) => {
                        c.id = col.id + '-' + i;
                        c.$parent ??= col;
                        return c;
                    });
                    res.push(...convert(items));
                } else {
                    res.push(col);
                }
                return res;
            }, []);
        }
        return convert(this.headerColumns);
    },
    get rowHeight() {
        return Math.round(this.iconSize * 4 / 3);
    },
    get rows() {
        if (!this.items?.length) {
            return [];
        }
        if (this.noLazy) return this.items;
        const rows = this.items.slice(this.screenFrom, this.screenFrom + this.screenLength);
        const raised = [];
        let top = rows[0]?.$parent;
        while (top){
            raised.unshift(top);
            top = top.$parent;
        }
        if (!raised.length){
            top = rows[0];
            if (top?.items?.length && top.$expanded){
                raised.push(top);
                rows.shift();
            }
        }
        this.raisedRows = raised;
        return rows;
    },
    selectedRows: [],
    get sorts(){
        const find_sorts = (columns = [])=>{
            return columns.reduce((res, i)=>{
                res.add(i);
                let items = i.items;
                if (items){
                    if (items?.then){
                        items?.then(r=>{
                            if (r?.length)
                                res.add(...r);
                        })
                    }
                    else{
                        items = find_sorts(items);
                        res.add(...items);
                    }
                }
                return res;
            }, []);
        }
        let result = find_sorts(this.columns);
        result = result.filter(i=>{
            return i.$sort;
        })
        result = result.sort((a,b) =>{
            return Math.abs(a.$sort)>Math.abs(b.$sort)?1:-1;
        })
        return result;
    },
    get colStyles() {
        return this.rowColumns.map(col => {
            if (col.id === undefined)
                return '';
            let style = `.col-${col.id}{/*${col[this.columnId]}*/\n\t`;
            if (col.index === 999)
                style += '\n\tflex: 1;\n\tflex-basis: auto;';
            else{
                style += '\n\tposition: sticky;';
                if (col.width){
                    style+=`\n\tmin-width: ${col.width}px; \n\tmax-width: ${col.width}px;\n\tflex: 0;`
                }
                else{
                    if (this.autoWidth && this.rowColumns.last === col)
                        style+=`\n\tflex: 1;`
                    style+=`\n\tmin-width: 16px;`
                }
                col.$width = col.$width || col.width || 150;
                style+=`\n\twidth: ${col.$width}px;`;


                const min = (this.autoWidth && !col.fix) ? '10px' : (col.width + 'px');
                const max = col.$width + 'px';
                if (col.fix) {
                    style += `\n\tz-index: 1;`;
                    if (col.fix === 'left') {
                        style += `\n\tleft: ${col.left}px;`
                    }
                    else if (col.fix === 'right') {
                        style += `\n\tright: ${col.right}px;`
                    }
                }
            }
            style += '\n}\n';
            return style;
        }).join('\n');
    },
    get table() {
        return this;
    },
    focus() { this.$refs.body.focus?.() },
    observers: [
        function obs_selectAll(items, _selectedAll) {
            if (_selectedAll)
                this.selectAll();
        },
    ],

    keyBindings: {
        escape() {
            this.clearSelection();
        },
        'ctrl+a,ctrl+ф'(e) {
            if (this._selectedAll) {
                this.clearSelection();
                this.addSelection(this.focusedRow);
            } else {
                this._selectedAll = true;
            }
        },
        arrowUp(e) {
            // e.preventDefault();
            e.stopPropagation();
            const rows = this.rows;
            const row = this.allowHighlight && this.highlightedRow ? this.highlightedRow : this.focusedRow;
            let idx = rows.findIndex(r => this.compareRows(r, row));
            idx = idx > 0 ? idx - 1 : 0;
            this.highlightRow(e, { value: rows[idx] });
            if (!e.ctrlKey) {
                this.selectRow(e, { value: rows[idx]})
            }
            if (idx <= (rows.findIndex(r => r === this.raisedRows[0]) + 2)) {
                this.$refs.body.scrollTop -= (~~(this.screenLength / 2)) * this.rowHeight;
            }
        },
        arrowDown(e) {
            e.stopPropagation();
            const rows = this.rows;
            const row = this.allowHighlight && this.highlightedRow ? this.highlightedRow : this.focusedRow;
            let idx = rows.findIndex(r => this.compareRows(r, row));
            const max = rows.length - 1;
            idx = idx < max ? idx + 1 : max;
            this.highlightRow(e, { value: rows[idx] });
            if (!e.ctrlKey) {
                this.selectRow(e, { value: rows[idx]})
            }
            if (idx >= (this.screenLength - 1)) {
                this.$refs.body.scrollTop += (~~(this.screenLength / 2)) * this.rowHeight;
            }
        },
        arrowRight(e) {
            e.stopPropagation();
            const rows = this.rows;
            const row = this.allowHighlight && this.highlightedRow ? this.highlightedRow : this.focusedRow;
            let idx = rows.findIndex(r => this.compareRows(r, row));
            if (!~idx) return;
            if (rows[idx] && ('$expanded' in rows[idx] || rows[idx].$hasChildren)) {
                rows[idx].$expanded = true;
                this.setScreenExpanded?.(rows[idx])
            }
        },
        arrowLeft(e) {
            // e.preventDefault();
            e.stopPropagation();
            const rows = this.rows;
            const row = this.allowHighlight && this.highlightedRow ? this.highlightedRow : this.focusedRow;
            let idx = rows.findIndex(r => this.compareRows(r, row));
            if (!~idx) return;
            if (rows[idx]?.$expanded === true) {
                rows[idx].$expanded = false;
                this.setScreenExpanded?.(rows[idx])
            }
        },
        'ctrl+space'(e) {
            // e.preventDefault();
            e.stopPropagation();
            this.selectRow(e, { value: (this.allowHighlight && this.highlightedRow) || this.focusedRow });
        },
        'space'(e) {
            // e.preventDefault();
            e.stopPropagation();
            this.focusRow(e, { value: (this.allowHighlight && this.highlightedRow) || this.focusedRow });
        },
        enter(e) {
            e.preventDefault();
            e.stopPropagation();
            if (e.ctrlKey) {
                return this.selectRow(e, { value: (this.allowHighlight && this.highlightedRow) || this.focusedRow });
            }
            if (this.allowHighlight && this.allowFocus) {
                if (this.highlightedRow === this.focusedRow) {
                    this.onDblClick({ path: [{ row: this.focusedRow }] })
                } else {
                    this.focusRow(e, { value: (this.allowHighlight && this.highlightedRow) || this.focusedRow });
                }
            }
        },
    },
    listeners: {
        dragend: 'onDragEnd',
        dragleave: 'onDragEnd',
    },
    compareRows(row1, row2) { // вынесено в функцию для возможности переопределения
        if (!row1 || !row2) return false;
        return Object.equal(row1, row2);
    },
    isFocusedRow(row) { // вынесено в функцию для возможности переопределения
        return this.compareRows(row, this.focusedRow);
    },
    isHighlightedRow(row) { // вынесено в функцию для возможности переопределения
        return this.compareRows(row, this.highlightedRow);
    },
    isSelectedRow(row) { // вынесено в функцию для возможности переопределения
        return this.selectedRows.some(sr => this.compareRows(row, sr));
    },
    onTapRows(e) {
        const evt = e.sourceEvent || e;
        if (evt.which !== 1) return;
        this.highlightedRow = null;
        this.selectRow(evt);
        this.focusRow(evt);
    },
    expand(row, force, old) {
        const items = this._beforeExpand(row, force);
        if (items?.then) {
            const id = setTimeout(() => {
                row.$loading = true;
                this.render();
            })
            return items.then(async items => {
                clearTimeout(id)
                row.$loading = false;
                if (this.sorts.length)
                    this._sort(items)
                const node = old || row;
                if ((node.items && node.$expanded)) {
                    for (let i in items) {
                        const n = items[i];
                        const o = (this.idName ? node.items.find(i => i[this.idName] === n[this.idName]) : node.items[i]) || node.items[i];
                        n.$expanded = o?.$expanded;
                        if (n.$expanded) {
                            this.expand(n, false, o);
                        }
                    }
                }
                items = items.length ? row.items = items : row.items = undefined;
                return items;
            }).catch((err) => {
                clearTimeout(id)
                row.$loading = false;
            });
        }
        else {
            row.items = items;
        }
        return items;
    },
    _beforeExpand(item) {
        return item.items;
    },
    __checkChildren(node) {
        const items = this._beforeExpand(node);
        if (items?.then) {
            return items.then(res => (res?.length > 0))
        }
        return (items?.length > 0);
    },
    _useColumnFilters(array) {
        this.filters?.forEach(col => {
            let name = col[this.columnId];
            let filter = String(col.$filter).toLowerCase().replace('&&', '&').replace('||', '|');
            filter = filter.replaceAll(' and ', '&').replaceAll('&&', '&').replaceAll(' or ', '|').replaceAll('||', '|');
            filter = filter.split('&').reduce((res, and) => {
                let or = and.split('|').reduce((res, or) => {
                    let space = or.split(' ').reduce((res, space) => {
                        if (space.trim())
                            res.push(`String(val).toLowerCase().includes('${space.trim()}')`);
                        return res;
                    }, []).join(' || ');
                    if (space)
                        res.push(`(${space})`);
                    return res;
                }, []).join(' || ');
                if (or)
                    res.push(`(${or})`);
                return res;

            }, []).join(' && ');
            let func = new Function('val', `return (${filter})`);

            // array.splice(0, array.length, ...array.filter(item => { return func(item[name]) }));
            array.splice(0, array.length, ...array.filter(item => {
                return (func(item[name]) || item.items?.find(subItem => {
                    return func(subItem[name]);
                }));
            }));
        });
    },
    _group(array) {
        const doGrouping = (items, level, parent, oldGroups) => {
            oldGroups = oldGroups || !level && this.groups[0].$groups || undefined;
            const column = this.groups[level];
            const name = column[this.columnId];
            const result = items.reduce((res, item) => {
                if (!item.$group && item.$level !== 0) return res;
                const value = item[name];
                let group = res.find(r => r.value === value);
                if (!group) {
                    group = {
                        $old: oldGroups?.find(g => g.value === value),
                        value: value,
                        name: name,
                        label: column.label,
                        // $col: column,
                        $level: level,
                        items: [],
                        $expanded: column.$expanded,
                        $group: true,
                        $parent: parent,
                        hideCheckbox: column.hideGroupCheckbox,
                        hideExpander: column.$expanded
                    };
                    res.push(group);
                }
                item.$parent = group;
                group.items.push(item);
                return res;
            }, []);

            if (this.groups[0].$sortGroups) {
                this._sortGroups(result, this.groups[0].$sortGroups);
            }

            for (let i = 0; i < result.length; i++) {
                const old = result[i].$old;
                let expanded = column.$expanded;
                if (this.groupExpandingMode === 'auto' && (true)) {
                    expanded = true;
                } else if (old) {
                    expanded = old.$expanded;
                } else if (!old && this.groupExpandingMode === 'all') {
                    expanded = true;
                } else if (!old && this.groupExpandingMode === 'first' && i === 0) {
                    expanded = true;
                }
                result[i].$expanded = expanded;
            }

            if (level < this.groups.length - 1) {
                for (let i = 0; i < result.length; i++) {
                    const _oldGroups = oldGroups?.find(oG => oG.$group && oG.value === result[i].value)?.items;
                    result[i].items = doGrouping(result[i].items, level + 1, result[i], _oldGroups);
                }
            }
            return result;
        };
        const doExpanding = (items) => {
            return items.reduce((res, item) => {
                res.push(item);
                if (item.$expanded && item.items?.length) {
                    // if (this.allowSort)
                        this._sort(item.items);
                    const subItems = doExpanding(item.items);
                    res.push(...subItems);
                }
                return res;
            }, []);
        };

        let result = doGrouping(array, 0);

        for (let i = 0; i < this.rowColumns.length; i++) {
            delete this.rowColumns[i].$groups;
        }
        this.groups[0].$groups = result;

        result = doExpanding(result);

        array.splice(0, array.length, ...result);
    },
    _sort(array = []) {
        if (!this.sorts.length) return;
        array.sort((a, b) => {
            let res = 0;
            this.sorts.some(col => {
                const _a = a[col[this.columnId]];
                const _b = b[col[this.columnId]];
                res = (String(_a)).localeCompare(String(_b)) * col.$sort;
                if (res) return true;
            });
            return res;
        });
    },
    _sortGroups(array = [], sort) {
        array.sort((a, b) => {
            const _a = a.value || '';
            const _b = b.value || '';
            return (String(_a)).localeCompare(String(_b)) * sort;
        });
    },
    focusRow(e, d) {
        if (e.ctrlKey || e.shiftKey) return;
        const item = d?.value || e.target.item;
        if (!item) return;
        if (item.disabled) {
            item.$expanded = !item.$expanded;
        } else if (item.$hasChildren && !item.$expanded) {
            item.$expanded = true;
        } else if (this.allowFocus && item && !item.$group && item.$allowFocus !== false) {
            this.focusedRow = item;
        }
    },
    highlightRow(e, d) {
        if (!this.allowHighlight) return;
        const item = d?.value || e.target.item;
        this.highlightedRow = item;
    },
    selectRow(e, d) {
        if (this.allowSelection !== 'none') {
            const item = d?.value || e.target.item;
            if (!item) return;
            if (!~this.selectionStartIndex) this.selectionStartIndex = this.rows.indexOf(this.selectedRows[0] || item);
            if (e.shiftKey) {
                let from = this.selectionStartIndex;
                let to = this.rows.indexOf(item);
                this.clearSelection();
                if (from <= to) {
                    while (from <= to) {
                        this.addSelection(this.rows[from])
                        from++;
                    }
                } else {
                    while (from >= to) {
                        this.addSelection(this.rows[from])
                        from--
                    }
                }
            } else if (e.ctrlKey) {
                this._selectedAll = false;
                const idx = this.selectedRows.indexOf(item);
                if (idx < 0)
                    this.addSelection(item);
                else {
                    this.selectedRows.splice(idx, 1);
                    this.fire('selected-rows-changed', this.selectedRows);
                    if (item === this.selectionStartRow) {
                        this.selectionStartRow = this.selectedRows[0] || null;
                    }
                }
            } else if (!item.disabled) {
                this.selectionStartIndex = -1;
                this.clearSelection()
                this.addSelection(item);
            }
            this.render();
        }
    },
    addSelection(item) {
        if (!item || item.$group || item.$allowSelection === false) return;
        switch (this.allowSelection) {
            case 'all': break;
            case 'level':
                if (this.selectedRows.length) {
                    if (Object.equal(item.$parent, this.selectedRows[0].$parent)) break;
                    else return;
                } else break;
            case 'type':
                if (this.selectedRows.length) {
                    if (item.type === this.selectedRows[0].type) break;
                    else return;
                } else break;
            case 'none':
            default: return;
        }
        this.selectedRows.push(item);
        this.fire('selected-rows-changed', this.selectedRows);
    },
    clearSelection() {
        this.selectedRows.splice(0);
        this._selectedAll = false;
        this.fire('selected-rows-changed', this.selectedRows);
        this.render();
    },
    scrollToItem(item) {
        if (this.style.getPropertyValue('visibility') === 'hidden') {
            return this.async(() => this.scrollToItem(item), 100)
        }
        item ??= this.focusedRow;
        if (this.rows.some(r => r === item)) return;
        const idx = this.items.indexOf(item);
        if (idx > -1) {
            const pos = idx * this.rowHeight;
            const shift = this.rowHeight * Math.floor(this.$refs.body.offsetHeight / (3 * this.rowHeight));
            if ((this.$refs.body.scrollTop + 0.8 * this.rowHeight > pos) || (this.$refs.body.offsetHeight + this.$refs.body.scrollTop - 1.5 * this.rowHeight < pos)) {
                // this.interval('changeScrollTop', () => { // for finishig of rendering
                this.$refs.body.scrollTop = (pos - shift < 0) ? 0 : pos - shift;
                // }, 100);
            }
        }
    },
    selectItem(item) {
        this.clearSelection();
        const items = this.items;
        if (item && items) {
            if (item.disabled) {
                item.$expanded = !item.$expanded;
            } else {
                this.selectedRows.push(item);
                this.fire('selected-rows-changed', this.selectedRows);
                this.focusedRow = item;
                // this.scrollToItem(item);
            }
        }
    },

    selectAll() {
        if (!this._selectedAll)
            this._selectedAll = true;
        const items = this.items;
        if (items.length && this.allowSelection !== 'none') {
            for (let i = 0; i < items.length; i++) {
                this.addSelection(items[i]);
            }
        }
        this.render();
    },
    addGroup(col) {
        if (this.groups.indexOf(col) < 0) {
            this.groups.push(col);
            this.groups = [...this.groups]; // костыль
            this.showGroupingPanel = true;
        }
    },
    removeGroup(col) {
        let idx = this.groups.indexOf(col);
        if (idx > -1)
            this.groups.splice(idx, 1);
        this.groups = [...this.groups]; // костыль
        if (!this.groups.length)
            this.showGroupingPanel = false;
    },
    _getColumns(row) {
        if (row.$group)
            return [row.$col];
        return this.rowColumns;
    },
    _swapColumns(col1, col2) {
        const ord = col1.order;
        col1.order = col2.order;
        col2.order = ord;
    },
    insertBeforeRow(row, rows) {
        if (!Array.isArray(rows))
            rows = [rows];
        const items = (row.$parent?.items || this.dataSet);
        items.splice(items.indexOf(row), 0, ...rows);
    },
    insertAfterRow(row, rows) {
        if (!Array.isArray(rows))
            rows = [rows];
        const items = (row.$parent?.items || this.dataSet);
        items.splice(items.indexOf(row) + 1, 0, ...rows);
    },
    appendChildRows(target, rows) {
        if (!Array.isArray(rows))
            rows = [rows];
        if (!target.items)
            target.items = rows;
        else
            target.items.push(...rows);
        target.$expanded = true;
    },
    removeRows(rows) {
        if (!Array.isArray(rows))
            rows = [rows];
        rows.forEach(row => {
            const items = (row.$parent?.items || this.dataSet);
            items.splice(items.indexOf(row), 1);
        })
    },
    deleteItems(callback, once = false) {
        const items = once ? [this._find(callback)] : this._filter(callback);
        items.forEach(i => {
            const array = i.$parent && i.$parent.items || this.dataSet;
            const idx = array.indexOf(i);
            if (~idx) {
                array.splice(idx, 1);
            }
        })
    },
    __getDragData(rows) {
        const result = [];
        let obj = { mime: 'application/json' }
        obj.data = '[' + rows.map(row => {
            return JSON.stringify(row, (key, value) => {
                return (value instanceof Object) ? undefined : value;
            })
        }).join(',') + ']';
        result.push(obj)
        return result;
    },
    _onDragStart(e) {
        const el = e.path.find(p => p.row);
        if (el && (this.allowDrag || el.row.drag)) {
            this.__setDragImage(e);
            this.draggedRows = this.selectedRows.includes(el.row) ? this.selectedRows : [el.row];
            this.__getDragData(this.draggedRows).forEach(data => {
                e.dataTransfer.setData(data.mime, data.data);
            })
        }
    },
    __setDragImage(e) {
        try {
            const node = e.target.querySelector('.cell');
            e.dataTransfer.setDragImage(node, 0, 0);
        } catch (err) {
            e.dataTransfer.setDragImage(new Image(), 0, 0);
        }
    },
    _dropCheckWait: null,
    _onDragLeave(e) {
        const el = e.path.find(p => p.row);
        if (el)
            el.row.$dropMode = '';
        clearTimeout(this._expandTimer);
        this._expandTimer = null;
    },


    _onDragOver(e) {
        if (!this.allowDrop) return;
        e.stopPropagation();
        if (this._draggableColumn) return;
        const target = e.path.find(p => p.row);
        if (!target) return;
        const row = target.row;
        if (row.$role) return;
        let r = row;
        while (r) {
            if (this.draggedRows.includes(r)) return;
            r = r.$parent;
        }
        if (this.draggedRows.some(i => i.$parent === row)) return;
        e.preventDefault();
        if (/* !row.$expanded &&  */!this._expandTimer) {
            this._expandTimer = setTimeout(() => {
                clearTimeout(this._expandTimer);
                this._expandTimer = null;
                row.$expanded = true;//!row.$expanded;
            }, 1000);
        }
        if (this.sorts.length)
            row.$dropMode = 'in';
        else {
            let rect = target.getBoundingClientRect();
            rect = (e.y - rect.y) / rect.height;
            if (rect < .25)
                row.$dropMode = 'top';
            else if (rect < .75)
                row.$dropMode = 'in';
            else
                row.$dropMode = 'bottom';
        }
        e.dataTransfer.dropEffect = this.__getDropEffect(this.draggedRows, row, e);
        if (!e.dataTransfer.dropEffect || e.dataTransfer.dropEffect === 'none')
            row.$dropMode = ''
    },
    __getDropEffect(source, target, event) {
        return event.ctrlKey ? 'copy' : 'move';
    },

    _checkAllowDropIn(row) {
        const contains = !!(this.draggedRows && row.items && Array.isArray(row.items) && row.items.find(i => this.draggedRows.includes(i)));
        const isLoading = !!(row.items && row.items.length === 1 && !Object.keys(row.items[0]).length); // is not tested
        return contains || isLoading;
    },
    _onDrop(e) {
        e.stopPropagation();
        if (this._draggableColumn) return;
        const el = e.path.find(p => p.row);
        if (!el) return;
        const row = el.row;
        if (row.$role) return;
        e.preventDefault();
        try {
            this.__doDrop(this.draggedRows, row, e)
        } catch (err) {
            console.error(err);
        } finally {
            row.$dropMode = '';
            this['#items'] = undefined;
            this.render();
        }
    },
    __doDrop(source, target, event) {
        if (source?.length > 0) {
            if (!event.ctrlKey) {
                this.deleteItems(i => source.includes(i))
            }
            switch (target.$dropMode) {
                case 'top': {
                    this.insertBeforeRow(target, source);
                } break;
                case 'in': {
                    this.appendChildRows(target, source);
                } break;
                case 'bottom': {
                    this.insertAfterRow(target, source);
                } break;
            }
        }
    },
    _find(callback) {
        const find = (items) => {
            let res = items.find(callback);
            if (!res) {
                res = items.find(i => {
                    return i.items && i.items.length && find(i.items);
                });
                if (res)
                    res = find(res.items);
            }
            return res;
        };
        return find(this.dataSet);
    },
    _filter(callback) {
        const find = (items) => {
            const res = items.filter(i => i.items).reduce((res, item) => {
                res.push(...find(item.items));
                return res;
            }, []);
            res.push(...items.filter(callback));
            return res;
        };
        return find(this.dataSet);
    },

    onDragEnd(e) {
        this.draggedRows = [];
        this._dropCheckWait = null;
    },

    _onRowContextMenu(e) {
        const el = e.path.find(p => p.row);
        if (el)
            this.fire('row-contextmenu', el.row);
    },
    _onDropToEmptySpace() {

    },
    _onDragOverToEmptySpace() {

    },
    _onDownToEmptySpace() {
        this.focusedRow = null
        this.clearSelection()
    }

});

ODA({is: 'oda-table-group-panel', imports: '@oda/icon',
    template: /*html*/`
    <style>
        :host {
            @apply --header;
            @apply --horizontal
            font-size: small;
        }
        .item {
            max-width: 120px;
            margin: 0px 4px;
            padding-left: 4px;
            align-items: center;
            border-radius: 4px;
        }
        .closer {
            cursor: pointer;
        }
        .panel{
            margin: 2px;
        }
        label{
            @apply --flex;
            @apply --disabled
        }
        :host>div>div{
            align-items: center;
            padding: 0px 4px;
        }
        oda-icon{
            transform: scale(.7);
        }
        
    </style>
    <div class="horizontal border flex panel">
        <oda-icon disabled :icon-size icon="icons:dns"></oda-icon>
        <div class="flex horizontal">
            <label ~if="!groups.length">Drag here to set row groups</label>
            <div class="no-flex horizontal">
                <div class="item shadow content no-flex horizontal" ~for="column in groups">
                    <label class="label flex" ~text="column.$saveKey || column.label"></label>
                    <oda-icon class="closer" icon="icons:close" :icon-size @tap="_close" :column></oda-icon>
                </div>
            </div>
        </div>
    </div>
    <div class="horizontal border flex panel">
        <oda-icon disabled :icon-size icon="icons:dns:90"></oda-icon>
        <div class="flex horizontal">
            <label ~if="!pivotLabels.length">Drag here to set column labels</labeldisabled>
            <div class="no-flex horizontal">
                <div class="item shadow content no-flex horizontal" ~for="column in groups">
                    <label class="label flex" ~text="column.$saveKey || column.name"></label>
                    <oda-icon class="closer" icon="icons:close" :icon-size @tap="_close" :column></oda-icon>
                </div>
            </div>
        </div>
    </div>
    `,
    listeners: {
        dragover: '_dragover',
        drop: '_drop'
    },
    _close(e) {
        e.stopPropagation();
        this.table.removeGroup(e.target.column);
    },
    _dragover(e) {
        if (this.table._draggableColumn && !this.groups.includes(this.table._draggableColumn)) {
            e.preventDefault();
        }
    },
    _drop(e) {
        this.table.addGroup(this.table._draggableColumn);
    }
});

ODA({is:'oda-table-part',
    template:`
        <style>{{colStyles}}</style>
    `
})

ODA({is: 'oda-table-settings', imports: '@oda/button',
    template: /*html*/`
    <style>
        :host > div {
            overflow: auto;
            right: 0;
            top:0;
            position: absolute;
            z-index: 10;
            /*min-width: 280px;*/
            width: 300px;
            height: 100%;
            @apply --shadow;
        }
    </style>
    <oda-button title="Settings" icon="icons:settings" @tap="_tap"></oda-button>
    <div ~if="opened" class="vertical flex content">
        <oda-table-hide-column></oda-table-hide-column>
    </div>
    `,
    props: {
        opened: {
            type: Boolean,
            reflectToAttribute: true,
            value: false,
        }
    },
    attached() {
        this.listen('mousedown', '_leave', { target: window });
        // this.listen('dragend', 'onDragEnd', { target: window });
    },
    _tap(e) {
        this.opened = !this.opened;
    },
    _leave(e) {
        if (e.path.includes(this)) {
            e.stopPropagation();
        } else {
            this.opened = false;
        }
    },
    detached() {
        this.unlisten('mousedown', '_leave', { target: window });
        // this.unlisten('dragend', 'onDragEnd', { target: window });
    }
});

ODA({is: 'oda-table-hide-column', imports: '@oda/checkbox',
    template: /*html*/`
    <style>
        :host {
            flex: 1;
        }
        .list {
            padding: 5px;
        }
    </style>
    <div class="horizontal no-flex header list">
        <oda-checkbox ref="check" :value="items.every(i=> !i.col.$hidden)" @tap="_onSelectAll"></oda-checkbox>
        <label class="flex label center" style="font-size: 10pt; padding: 0px 8px;">(show all)</label>
    </div>
    <div>
        <div ~for="item in items" class="list  no-flex horizontal">
            <oda-checkbox :value="!item.col.$hidden"  @value-changed="_onChange($event, item)"></oda-checkbox>
            <label class="label center" style="font-size: 10pt; padding: 0px 8px;">{{getLabel(item)}}</label>
        </div>
    </div>
    `,
    props: {
        items: []
    },
    attached() {
        this.items = this.table.columns.map(i => {
            return {
                label: i.label,
                name: i.name,
                $hidden: i.$hidden,
                col: i
            }
        })
    },
    getLabel(item) {
        return item.label || item.name;
    },
    _onChange(e, item) {
        item.col.$hidden = !e.detail.value;
    },
    _onSelectAll(e) {
        this.items.forEach(i => {
            i.col.$hidden = !this.$refs.check.value;
        });
    },
});

ODA({is: 'oda-table-cols', extends: 'oda-table-part',
    template:  `
        <style>
            :host{
                position: relative;
                border-color: white;
                @apply --horizontal;
                @apply --dark;
                margin: 1px 0px;
                @apply --shadow;
                z-index: 1;
            }
        </style>
        <div :scroll-left="$scrollLeft" class="horizontal flex" style="overflow-x: hidden;">
            <div ~for="col in columns" ~is="getTemplate(col)" :item="getItem(col)"   :column="col"  ~class="['col-' + col.id]"></div>
        </div>
        <div @resize="scr = $event.target.offsetWidth" class="no-flex" style="overflow-y: scroll; visibility: hidden;"></div>
    `,
    getItem(col){
        return col;
    },
    getTemplate(col){
        return 'div'
    },
    columns: [],
    src: 0
})

ODA({is:'oda-table-header', extends: 'oda-table-cols',
    template:`
        <oda-button ~if="allowSettings" style="position: absolute; top: 0px; right: 0px; z-index: 1;" icon="icons:settings" @tap.stop="openSettings"></oda-button>
    `,
    getTemplate(col){
        return col.header || this.defaultHeader
    },
    scr: 0
})
ODA({is:'oda-table-footer', extends: 'oda-table-cols',
    getItem(col){
        return this.footer;
    },
    getTemplate(col){
        return col.footer || this.defaultFooter
    }
})

ODA({is:'oda-table-body', extends: 'oda-table-part',
    template:`
        <style>
            :host{
                position: relative;
                overflow-x: {{autoWidth?'hidden':'auto'}};
                overflow-y: {{showHeader?'scroll':'auto'}};
                scroll-behavior: smooth;
                @apply --vertical;
            }
            :host([fix]){
                overflow-x: clip !important;
                overflow-y: scroll !important;
                height: {{_bodyHeight}}px;
                /*margin-bottom: 1px;*/
                /*border-bottom: 1px  solid var(--dark-background);*/
            }
            :host([fix]) .cell{
               @apply --header;
            }
            .row{
                min-height: {{rowHeight}}px;
                max-height: {{autoRowHeight?'':rowHeight+'px'}};
                @apply --no-flex;
            }
        </style>
        <style>
            :host([even-odd]) .row:not([selected]):nth-child(odd):not([role]):not([dragging])>.cell:not([fix]) {
                background-color: rgba(0,0,0,.05);
            }
            .cell {
                position: relative;
                @apply --content;
                @apply --no-flex;
                @apply --horizontal;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                box-sizing: border-box;
                align-items: center;
            }
            :host([row-lines]) .cell {
                border-bottom: 1px  solid var(--dark-background);
                box-sizing: border-box;
            }
    
            :host([col-lines]) .cell {
                border-right: 1px solid var(--dark-background);
                box-sizing: border-box;
            }
            .row[focused]::after {
                content: '';
                background-color: var(--focused-color);
                position: absolute;
                bottom: 0px;
                left: 0px;
                right: 0px;
                height: 2px;
                z-index: 1;
                pointer-events: none;
            }
            .row[highlighted]::before {
                content: '';
                position: absolute;
                bottom: 0px;
                left: 0px;
                right: 0px;
                top: 0px;
                outline: 1px dashed gray;
                outline-offset: -3px;
                z-index: 2;
                pointer-events: none;
            }
            .row[drop-mode]:before {
                position: absolute;
                left: 0px;
                content: '';
                pointer-events: none;
                background-color: var(--info-color);
                z-index: 10;
                top: 0px;
                bottom: 0px;
            }
            .row[drop-mode=top]:before {
                top: -1px;
                right: 0px;
                bottom: unset;
                height: 2px;
            }
            .row[drop-mode=bottom]:before {
                bottom: -2px;
                right: 0px;
                top: unset;
                height: 2px;
            }
            .row[drop-mode=in]:before {
                width: 2px;
            }
            .row[dragging] > .cell {
                @apply --error;
            }
            .cell[role=group] {
                z-index: 2;
                @apply --header;
                border-color: transparent;
            }
            .cell[role=footer],
            .row[role=group],
            .cell[fix] {
                @apply --header;
            }
            .cell:focus{
                outline: 2px dotted black !important;
                outline-offset: -1px !important;
            }
            .group {
                position: sticky;
                position: -webkit-sticky;
                left: 0px;
                border-color: transparent !important;
                @apply --dark;
                @apply --flex;
            }
            .sticky {
                position: sticky;
                position: -webkit-sticky;
                /*z-index: 1;*/
            }
            .group-row {
                z-index: 10;
                position: sticky;
                position: -webkit-sticky;
                @apply --dark;
            }
            .row {
                position: sticky;
                left: 0px;
                @apply --horizontal;
            }
        </style>
        <div class="no-flex  vertical" ~style="{height: _bodyHeight+'px', minWidth: (autoWidth?'auto':($scrollWidth - 20))+'px'}">
            <div class="sticky" style="top: 0px; min-height: 1px; min-width: 100%;" @dblclick="onDblClick" @tap="onTapRows" @contextmenu="_onRowContextMenu" @dragleave="table._onDragLeave" @dragover="table._onDragOver"  @drop="table._onDrop">
                <div :draggable="getDraggable(row)" ~for="(row, r) in rows" :row="row" :role="row.$role" class="row"
                    ~class="{'group-row':row.$group}"
                    :drop-mode="row.$dropMode"
                    :dragging="draggedRows.includes(row)"
                    @dragstart="table._onDragStart"
                    :focused="allowFocus && isFocusedRow(row)"
                    :highlighted="allowHighlight && isHighlightedRow(row)"
                    :selected="allowSelection !== 'none' && isSelectedRow(row)">
                    <div :tabindex="getTabIndex(col, row, c, r)"  :item="row" class="cell" ~for="(col, c) in row.$group ? [row] : rowColumns" :role="row.$role" :fix="col.fix" ~props="col?.props" :scrolled-children="(col.treeMode) ? (items?.indexOf(rows[r + 1]) - r - 1) + '↑' : ''" ~class="[row.$group ? 'flex' : 'col-' + col.id, col.fix?'shadow':'']">
                        <div class="flex" ~class="{'group' : row.$group}" ~is="_getTemplateTag(row, col)"  :column="col" class="cell-content" :item="row" ></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex content empty-space" @drop.stop.prevent="table._onDropToEmptySpace" @dragover.stop.prevent="table._onDragOverToEmptySpace" @down="table._onDownToEmptySpace"></div>
    `,
    firstTop: 0,
    get autoWidth(){
        return this.table.autoWidth;
    },
    get showHeader(){
        return this.table.showHeader;
    },
    rows: [],
    props:{
        fix:{
            type: Boolean,
            reflectToAttribute: true
        },
        evenOdd:{
            type: Boolean,
            get(){
                return this.table.evenOdd;
            },
            reflectToAttribute: true
        },
        rowLines:{
            type: Boolean,
            get(){
                return this.table.rowLines;
            },
            reflectToAttribute: true
        },
        colLines:{
            type: Boolean,
            get(){
                return this.table.colLines;
            },
            reflectToAttribute: true
        }
    },
    setScreen(){
        if (this.fix) return;
        this.$scrollLeft = this.scrollLeft;
        this.$scrollTop = this.scrollTop;
        this.$scrollWidth = this.scrollWidth;
        this.$height = this.offsetHeight;
        // const h = this.$scrollTop / this.rowHeight;
        // if (this.$scrollTop + this.$height + this.rowHeight < this.scrollHeight)
        //     this.firstTop = Math.ceil(Math.floor(h) - h);
        // else
        //     this.firstTop = 0;

        this.firstTop = Math.floor(this.$scrollTop / this.rowHeight) * this.rowHeight;
    },
    listeners:{
        resize(e){
            this.setScreen();
        },
        scroll(e){
            this.setScreen();
        }
    },
    _getTemplateTag(row, col) {
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
    getTabIndex(col, row, c, r) {
        if (row.$group || !this.allowFocus)
            return null;
        return (col[this.columnId] && !col.fix && !col.treeMode) ? ((r + 1) * 10000 + c + 1) : '';
    },
    getDraggable(row) {
        return (this.allowDrag && !this.compact && !row.$group && row.drag !== false) ? 'true' : false;
    },
    get _bodyHeight() {
        return (this.fix?this.rows.length:this.items.length) * this.rowHeight;
    },
})


ODA({is: 'oda-table-footer-cell', extends: 'oda-table-cell',
    template: /*html*/`
        <style>
            .split {
                border-right: {{fix === 'right'?'none':'1px solid var(--dark-color, white)'}};
                border-left: {{fix === 'right'?'1px solid var(--dark-color, white)':'none'}};
                height: 100%;
            }
            label{
                padding: 4px;
            }
            :host {
                box-sizing: border-box;
                border-color: white !important;
                @apply --horizontal;
                @apply --no-flex;
                justify-content: flex-end;
                @apply --dark;
                text-align: right;
                font-size: smaller;
                flex-direction: {{column.fix === 'right'?'row-reverse':'row'}};
            }
        </style>
        <div class="split"></div>
    `
});

cells: {
    ODA({is: 'oda-table-cell-base', template: /*html*/`
        <style>
            :host {
                @apply --horizontal;
                align-items: center;
                overflow: hidden;
                text-overflow: ellipsis;
                min-height: 1px;
                min-width: 1px;
            }
            :host * {
                text-overflow: ellipsis;
                position: relative;
            }
            .expander {
                cursor: pointer;
            }
        </style>`,
        column: null,
        item: null,
        get fix(){
            return this.column?.fix;
        }
    });

    ODA({is: 'oda-table-cell', extends: 'oda-table-cell-base',
        template: /*html*/`
        <label class="flex" ~is="template" :column :item style="overflow: hidden">{{value}}</label>`,
        props: {
            template: 'label',
            value() {
                return this.item?.[this.column?.name]
            }
        }
    });

    ODA({is: 'oda-table-expand', imports: '@oda/icon', extends: 'oda-table-cell-base',
        template: /*html*/`
            <style>
                :host{
                    @apply --no-flex;
                }
            </style>
            <oda-icon ~if="item?.$level !== -1" style="cursor: pointer" :icon :disabled="hideIcon || item?.disabled" :icon-size @dblclick.stop.prevent @tap.stop.prevent="_toggleExpand" @down.stop.prevent  class="no-flex expander" ~style="{opacity: (!icon)?0:1}"></oda-icon>
        `,
        get hideIcon() {
            return this.item.hideExpander || (!this.item.items?.length && !this.item.$hasChildren);
        },
        get icon() {
            if (!this.item || this.hideIcon)
                return '';
            if (this.item.$loading)
                return this.iconExpanding;
            if (this.item.$expanded)
                return this.iconExpanded;
            return this.iconCollapsed;
        },
        _toggleExpand(e, d) {
            this.async(() => {
                if (!this.item.hideExpander) {
                    this.item.$expanded = !this.item.$expanded;
                    this.fire('expanded-changed', this.item.$expanded);
                }
            })
        }
    });

    tree: {
        ODA({is: 'oda-table-cell-tree', extends: 'oda-table-cell-base',
            template: /*html*/`
            <style>
                :host{
                    height: 100%;
                    background-color: {{color || 'unset'}} !important;
                }
                :host * {
                  --line-border: 1px solid silver;
                }
                :host:last-child .step {
                    height: 50%;
                }
                .icon {
                    height: auto;
                    align-items: center;
                    align-content: center;
                }
                .step {
                    position: relative;
                    height: 100%;
                }
                .step > .end-step {
                    position: absolute;
                    right: 0;
                    height: 100%;
                }
            </style>
            <div class="step no-flex" ~style="{width: (item.$level || 0) * stepWidth + 'px', ...stepStyle}">
                <div class="end-step" ~style="endStepStyle"></div>
            </div>
            <oda-table-expand class="no-flex" :item></oda-table-expand>
            <oda-table-check class="no-flex" ~if="_showCheckBox" :column="column" :item="item"></oda-table-check>
            <div ::color  ~is="item?.[column[columnId]+'.template'] || item?.template || column?.template || defaultTemplate || 'label'" :column :item class="flex">{{item[column[columnId]]}}</div>`,
            columnId: '',
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
            get _showCheckBox() {
                return ((this.allowCheck && this.allowCheck !== 'none' && !this.item.hideCheckbox) || (this.item?.allowCheck && this.item?.allowCheck !== 'none')) && !this.item?.disabled;
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
            },
            color: undefined
        });

        ODA({is: 'oda-empty-tree-cell', imports: '@oda/icon', extends: 'oda-icon, oda-table-cell-base',
            template: /*html*/`
            <label class="label flex">nothing</label>`,
            props: {
                icon: 'notification:do-not-disturb'
            }
        });

        ODA({is: 'oda-table-check', imports: '@oda/icon', extends: 'oda-table-cell-base',
            template: /*html*/`
            <oda-icon class="no-flex" @down.stop.prevent="_toggleChecked" @tap.stop.prevent :icon :icon-size ~style="{padding: Math.round(iconSize*.2)+'px'}"></oda-icon>`,
            props: {
                icon() {
                    if (!this.item.checked || this.item.checked === 'unchecked')
                        return this.iconUnchecked;
                    if (this.item.checked === true || this.item.checked === 'checked')
                        return this.iconChecked;
                    return this.iconIntermediate;
                }
            },
            _toggleChecked(e) {
                if (this.allowCheck === 'none') return;

                const checkChildren = (item, clear = false) => {
                    (item.items || []).forEach(i => {
                        if (item.checked !== 'intermediate') {
                            i.checked = clear ? false : item.checked;
                            updateCheckedRows(i);
                            checkChildren(i, clear);
                        }
                    })
                };
                const updateChecked = (item) => {
                    item.checked = (item.items || []).reduce((res, i) => {
                        if (res === 'intermediate')
                            return res;
                        else if (res === undefined)
                            res = i.checked ? i.checked : false;
                        else if (res !== ((i.checked === undefined) ? false : i.checked))
                            res = 'intermediate';
                        return res;
                    }, undefined);
                    updateCheckedRows(item);
                };
                const updateCheckedRows = (item) => {
                    const i = this.checkedRows.indexOf(item);
                    if (item.checked && i === -1)
                        this.checkedRows.push(item);
                    else if (!item.checked && i !== -1)
                        this.checkedRows.splice(i, 1);
                };

                this.item.checked = !(!!this.item.checked);
                updateCheckedRows(this.item);
                if (this.allowCheck !== 'single') {
                    if (this.allowCheck === 'cleardown') {
                        checkChildren(this.item, true);
                    } else {
                        if (this.allowCheck === 'double' || this.allowCheck === 'down') {
                            checkChildren(this.item);
                        }
                        if (this.allowCheck === 'double' || this.allowCheck === 'up') {
                            let parent = this.item.$parent;
                            while (parent) {
                                updateChecked(parent);
                                parent = parent.$parent;
                            }
                        }
                    }
                }

                this.table.fire('checked-changed', this.item);
            }
        });
    }

    ODA({is: 'oda-table-error', imports: '@oda/icon', extends: 'oda-table-cell-base',
        template: /*html*/`
        <oda-icon icon="icons:error"></oda-icon>
        <label class="label flex" :text="item.error"></label>`
    });

    ODA({is: 'oda-table-header-cell', imports: '@oda/button', extends: 'oda-table-cell-base',
        template: /*html*/`
        <style>
            :host {
                min-height: 32px !important;
                box-sizing: border-box;
                position: sticky;
                /*font-weight: bold;*/
                font-size: small;
                @apply --horizontal;
                @apply --dark;
                cursor: pointer;
                justify-content: space-around;
                overflow: hidden;
                align-items: initial !important;
                box-sizing: border-box;
                max-width: {{column.width || '100%'}};
                min-width: {{column.width || '16px'}};
                width: {{column.$width}};

                @apply --no-flex;
            }
            .split {
                cursor: col-resize;
                border-right: {{fix === 'right'?'none':'1px solid var(--dark-color, white)'}};
                border-left: {{fix === 'right'?'1px solid var(--dark-color, white)':'none'}};
                width: 1px;
                @apply --no-flex;
            }
            .split:hover {
                @apply --content;
            }
            oda-icon, oda-table-expand {
                opacity: .5;
            }
            oda-icon{
                transform: scale(.7);
                /*@apply --content;*/
                border-radius: 50%;
            }
            :host(:hover) > oda-icon {
                opacity: 1;
            }
            input {
                width: 0px;
                font-size: x-small;
                opacity: .8;
            }
            oda-button {
                padding: 0px;
                min-width: {{Math.round(iconSize * .5)+4}}px;
                min-height: {{Math.round(iconSize * .5)+4}}px;
            }
            div {
                overflow: hidden;
            }
            .sub-cols {
                border-top: 1px solid var(--dark-color);
                box-sizing: border-box;
            }
            .sub-cols > .header-cell :not(:nth-child(1)) {
                border-left: 1px solid var(--dark-color);
                box-sizing: border-box;
            }
            :host .filter-container {
                @apply --horizontal
                padding: 2px;
                align-items: center;
                max-height: {{iconSize * .7}}px;
                min-height: {{iconSize * .7}}px;
            }
            label{
                text-align: center;
                margin: 4px 0px;
                text-overflow: ellipsis;
                white-space:break-spaces !important;
            }
        </style>
        <div class="flex vertical" style="cursor: pointer"  :disabled="!column.name">
            <div @tap.stop="setSort" class="flex horizontal"  ~style="{flexDirection: column.fix === 'right'?'row-reverse':'row', minHeight: rowHeight+'px', height: column?.$expanded?'auto':'100%'}">
                <div class="flex horizontal" style="align-items: center;">
                    <oda-table-expand ~if="column?.items?.length" :item></oda-table-expand>
                    <label class="label flex" :title="column.label || column.name" :text="column.label || column.name" draggable="true" @dragover="_dragover" @dragstart="_dragstart" @dragend="_dragend" @drop="_drop"></label>
                    <oda-icon :disabled="column?.$expanded && column?.items?.length" style="position: absolute; right: 0px; top: 0px;" ~if="allowSort && sortIndex" title="sort" :icon="sortIcon" :bubble="sortIndex"></oda-icon>
                </div>
                <slot name="tools"></slot>
                <div class="split"  @tap.stop @track="_track"></div>
            </div>
            <div class="flex info horizontal filter-container" ~if="!column.$expanded && column.name && showFilter" style="align-items: center" @tap.stop>
                <input class="flex filter-input" ::value="filter" @tap.stop>
                <oda-button ~if="!filter" :icon-size="Math.round(iconSize * .3)+2" @tap.stop="showDD" icon="icons:filter" title="filter"></oda-button>
                <oda-button ~if="filter"  :icon-size="Math.round(iconSize * .5)+2" icon="icons:close" @tap.stop="filter = ''" title="clear"></oda-button>
            </div>
            <div class="flex sub-cols horizontal" ~if="expanded">
                <oda-table-header-cell  class="header-cell flex" ~for="col in subCols" :item="col" :column="col"  ref="subColumn"  ~class="['col-' + col.id]"></oda-table-header-cell>
            </div>
            <div class="flex" ~if="!column.name"></div>
        </div>`,
        get expanded(){
            return this.column.$expanded;
        },
        get subCols(){
            return this.column?.items?.map(i=>{
                i.$parent ??= this.column;
                modifyColumn.call(this.table, i);
                return i;
            })?.filter(i=>!i.$hidden);
        },
        get sortIcon() {
            if (+this.column.$sort>0)
                return 'icons:arrow-back:270';
            if (+this.column.$sort<0)
                return 'icons:arrow-back:90';
            return ''
        },
        get sortIndex() {
            return Math.abs(+this.column?.$sort)
            // return (this.sorts?.filter(s => !s.$hidden && !s.$expanded).indexOf(this.column) + 1) || 0;
        },
        props: {
            filter: {
                type: String,
                set(val) {
                    this.column.$filter = val || null;
                }
            }
        },
        listeners:{
            contextmenu: '_menu',
            resize(e) {
                if (!this.column || this.column.$expanded || this.column.id === 999) return;
                modifyColumn.call(this.table, this.column);
                e.stopPropagation();
                this.column.$width = Math.round(this.offsetWidth);
                let parent = this.column.$parent;
                if (parent){
                    modifyColumn.call(this.table, parent);
                    parent.$width = parent.items.filter(i=>!i.$hidden).reduce((res, i)=>{
                        modifyColumn.call(this.table, i);
                        return res += +i.$width;
                    }, 0)
                }
                const width = this.column.items?.reduce((res,i)=>{
                    modifyColumn.call(this.table, i);
                    i.$width = i.width ||  i.$width || this.column.$width/this.column.items.length;
                    return res += i.$width;
                }, 0);
                if (width){
                    const correct = this.column.$width/width;
                    this.column.items?.filter(i=>!i.$hidden).forEach(i=>{
                        modifyColumn.call(this.table, i);
                        i.$width = i.$width * correct;
                    })
                }
            }
        },
        _dragstart(e) {
            this.table._draggableColumn = this.column;
        },
        _dragend(e) {
            this.table._draggableColumn = null;
        },
        _dragover(e) {
            if (this.table._draggableColumn && this.table._draggableColumn !== this.column) {
                e.preventDefault();
            }
        },
        _drop(e) {
            e.preventDefault();
            // this.table._swapColumns(this.table._draggableColumn, this.column);
            this.table._draggableColumn = null;
        },
        _track(e, d) {
            switch (e.detail.state) {
                case 'start': {
                    this.active = true;
                    this.__sign = (this.column.fix === 'right' ? -1 : 1);
                    this.column.$width = Math.round(this.offsetWidth);
                } break;
                case 'track': {
                    this.column.$width = +this.column.$width + this.__sign * e.detail.ddx;
                } break;
                case 'end': {
                    this.active = false;
                } break;
            }
        },
        async _menu(e) {
            e.preventDefault();
            e.stopPropagation();
            if (!this.column.name) return;
            await ODA.import('@tools/containers');
            await ODA.import('@oda/menu');
            const menu = [
                {
                    label: this.table.groups.includes(this.column) ? 'Ungrouping' : 'Grouping' + ' by this column',
                    icon: 'icons:open-in-browser',
                    execute: () => {
                        if (this.table.groups.includes(this.column))
                            this.table.removeGroup(this.column);
                        else
                            this.table.addGroup(this.column);
                    }
                },
                {
                    label: 'Hide this column',
                    icon: 'icons:visibility-off',
                    execute: () => {
                        this.column.$hidden = !this.column.$hidden;
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
                    label: (this.showFilter ? 'Hide' : 'Show') + ' filter row',
                    icon: 'icons:filter',
                    execute: () => {
                        this.showFilter = !this.showFilter;
                    }
                }
            ];
            const res = await ODA.showDropdown('oda-menu', { parent: this, iconSize: this.iconSize, items: menu, title: 'Column menu', allowClose: true });
            res?.focusedItem.execute();
        },
        setSort(e) {
            if (!this.allowSort) return ;
            const sort = this.column.$sort;
            if (this.column.$sort>0){
                this.column.$sort = -this.column.$sort;
            }
            else if (this.column.$sort<0){
                this.column.$sort = 0;
                this.async(()=>{
                    this.sorts.forEach((i, idx)=>{
                        i.$sort = (idx + 1) * Math.sign(i.$sort);
                    })
                })
            }
            else{
                this.column.$sort = this.sorts.length + 1;
                this.async(()=>{
                    this.sorts.forEach((i, idx)=>{
                        i.$sort = (idx + 1) * Math.sign(i.$sort);
                    })
                })
            }

        },
        async showDD(e) {
            const dataSet = this.items.reduce((res, i) => {
                const value = i[this.item.name];
                if (value) {
                    res.add(i);
                }
                return res;
            }, []);
            const list = await ODA.createComponent('oda-table', { columns: [this.item], dataSet });
            this.async(() => {
                list.focus();
            }, 300);
            const res = await ODA.showDropdown(list, {}, { parent: this });
            console.log(res);
        }
    });
    ODA({is: 'oda-table-cell-group', extends: 'oda-table-cell-base',
        template: /*html*/`
        <style>
            :host {
                justify-content: left;
                @apply --dark;
                position: sticky;
                position: -webkit-sticky;
                left: 0px;
                top: 0px;
                position: sticky;
                height: 100%;
            }
            label {
                @apply --flex;
            }
        </style>
        <oda-table-expand :item ~style="{marginLeft: item.$level * iconSize + 'px'}" @expanded-changed="expandedChanged"></oda-table-expand>
        <label ~if="item.label"  style="font-size: small; margin: 4px;" class="no-flex">{{item.label}}:</label>
        <label style="font-weight: bold; margin: 4px;" class="flex">{{item.value}}</label>
        <label ~if="item.items" class="no-flex" style="font-size: small; margin: 4px;">[{{item.items?.length}}]</label>`,
        expandedChanged() {
            this.table.setScreenExpanded?.(this.item);
        }
    });

}


function extract(items, level, parent) {
    if (!this.groups.length && this.sorts.length) {
        items.sort((a, b) => {
            for (let col of this.sorts) {
                const va = a[col.name];
                const vb = b[col.name];
                if (va > vb) return col.$sort;
                if (va < vb) return -col.$sort;
            }
            return 0;
        })
    }
    return items.reduce((res, i) => {
        if (!('$expanded' in i))
            Object.defineProperty(i, '$expanded', {
                enumerable: false,
                configurable: true,
                writable: true,
                value: i.$expanded || false
            })

        if (!('$parent' in i))
            Object.defineProperty(i, '$parent', {
                enumerable: false,
                configurable: true,
                writable: true,
                value: i.$parent || null
            })
        if (!('$level' in i))
            Object.defineProperty(i, '$level', {
                enumerable: false,
                configurable: true,
                writable: true,
                value: i.$level || 0
            })
        if (!('$hasChildren' in i))
            Object.defineProperty(i, '$hasChildren', {
                enumerable: false,
                configurable: true,
                writable: true,
                value: i.$hasChildren || false
            })
        if (parent) {
            i.$parent = parent;
        }
        else if (i.$parent) {
            delete i.$parent;
        }
        i.$level = level;
        if (!this.hideTop || level > -1)
            res.push(i);

        const has_children = this.__checkChildren(i);
        if (has_children?.then)
            has_children.then(res => i.$hasChildren = res);
        else
            i.$hasChildren = has_children;

        if ((i.$expanded === undefined && (this.expandAll || (this.expandLevel < i.level))) || (level < 0 && !i.$expanded))
            i.$expanded = true;
        if (i.$expanded) {
            if (i.items?.length)
                res.push(...extract.call(this,  i.items, level + 1, i));
            else
                i.items = undefined;
            this.expand(i);
        }
        return res;
    }, []);
}
settings:{
    ODA({is:'oda-table-settings', imports: '@tools/property-grid, @oda/tree, @oda/splitter',
        template:`
        <style>
            :host{
                @apply --horizontal;
                width: 300px;
                @apply --flex;
                bottom: 0px;
                height: 90vh;
            }
            div>div{
                align-items: center;
                @apply --horizontal;
                padding: 8px 4px;
                cursor: pointer;
            }
            div>div:hover{
                color: var(--focused-color) !important;
            }
            oda-icon{
                transform: scale(.7);
            }
        </style>
        <oda-splitter></oda-splitter>
        <div class="content flex vertical" style="overflow: hidden;">
            <oda-table-columns-tree class="border" ~show="focusedTab === 0"></oda-table-columns-tree>
            <oda-property-grid class="flex" ~if="focusedTab === 2" only-save :inspected-object="table"></oda-property-grid>
        </div>
        <div style="writing-mode: vertical-lr;" class="horizontal header">
            <div :focused="focusedTab === index" @tap="focusedTab = index" ~for="tabs"><oda-icon :icon="item.icon" :title="item.title"></oda-icon>{{item.title}}</div>
        </div>
    `,
        focusedTab: 0,
        tabs: [
            {icon: 'icons:tree-structure:90', title: 'columns'},
            {icon: 'icons:filter:90', title: 'filters'},
            {icon: 'icons:settings:90', title: 'properties'},
        ],
    })
    ODA({is: 'oda-table-columns-tree', imports: '@oda/tree, @oda/toggle', extends: 'this, oda-tree',
        template:`
            <style>
                :host{
                    font-size: small;
                }
            </style>
            <div class="no-flex header horizontal" style="align-items: center">
                <oda-toggle ::toggled="pivotMode"></oda-toggle><label>Pivot mode</label>
            </div>  
        `,
        columns: [
            {name: 'name', treeMode: true},
            {name: 'fix', $hidden: true, $sortGroups: 1, $expanded: true }
        ],
        props:{
            allowCheck: 'double',
            allowDrag: true,
            allowDrop: true,
        },
        get dataSet(){
            return this.domHost.table.columns;
        },
        ready(){
            this.groups = [this.columns.find(c => c.name === 'fix')];
        }
    })
}




function modifyColumn(col){
    if (col.isModified) return;
    col.isModified = true;
    col.$saveKey = (col.$parent?.$saveKey?col.$parent?.$saveKey + '/':'') + (col[this.columnId] || 'empty-name');
    const storage = this.storage;
    const table = this;
    col['#$width'] = col.$width;
    let checkWidth = false
    Object.defineProperty(col, '$width', {
        configurable: false,
        enumerable: false,
        set(v) {
            if (!v) return;
            const min = this.items?.filter(i=>!i.$hidden).length?32:16;
            v = Math.round(v);
            if (v<min)
                v = min;
            if(this['$width'] === v)
                return;
            this['#$width'] = v;

            if (this.$parent){
                let  w = this.$parent.items?.filter(i=>!i.$hidden).reduce((res, i)=>{
                    modifyColumn.call(table, i);
                    i.$width = i.$width || v / this.items?.filter(i=>!i.$hidden).length;
                    res += i.$width;
                    return res;
                },0)
                this.$parent.$width = w;
            }
            if (this.$expanded && col.items?.length){
                let  w = col.items?.filter(i=>!i.$hidden).reduce((res, i)=>{
                    i.$parent = i.$parent || col;
                    modifyColumn.call(table, i);
                    i.$width = i.$width || v / this.items?.filter(i=>!i.$hidden).length;
                    res += i.$width ;
                    return res;
                },0)
                if (w && v != w){
                    w /= v;
                    this.items?.filter(i=>!i.$hidden).forEach(i=>{
                        i.$width = i.$width / w;
                    })
                }
            }
            else{
                if (!checkWidth) return;
                storage.setToItem(col.$saveKey, 'w', v);
            }
        },
        get() {
            if (this.width)
                return this.width;
            if (!checkWidth){
                let result = storage.getFromItem(col.$saveKey, 'w');
                if (result > 16)
                    this['#$width'] = result;
                else
                    this['#$width'] = 150;
                checkWidth = true;

            }
            return this['#$width'];
        }
    })
    const props = ['expanded', 'hidden', 'sort', 'order', 'filter'];
    for (let i  of props)
        addSaveProp.call(col, i, storage);
    if (col.checked !== undefined)
        col['#checked'] = col.checked;
    Object.defineProperty(col, 'checked',{
        configurable: true,
        enumerable: true,
        set(v) {
            col.$hidden = !v ;
        },
        get() {
            return !col.$hidden;
        }
    })
}
function addSaveProp(name, storage){
    const key = name[0];
    name = '$'+name;
    const vname = '#'+name;
    if (this[name] !== undefined)
        this[vname] = this[name];
    Object.defineProperty(this, name, {
        configurable: true,
        enumerable: true,
        set(v) {
            if (this[name] === v)
                return;
            this[vname] = v;
            storage.setToItem(this.$saveKey, key, v || undefined);
        },
        get() {
            let result = this[vname];
            if(result === undefined)
                this[vname] = result = storage.getFromItem(this.$saveKey, key);
            return result;
        }
    })
}