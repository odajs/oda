ODA({is: 'oda-table', imports: '@oda/button, @oda/checkbox, @oda/icon, @oda/splitter, @oda/menu',
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
        <oda-table-body ::over-height class="flex" :rows tabindex="0" :scroll-top="$scrollTop" :scroll-left="$scrollLeft" :even-odd :col-lines :row-lines></oda-table-body>
        <oda-table-footer :columns="rowColumns" ~if="showFooter" class="dark"></oda-table-footer>
    `,
    hostAttributes: {
        tabindex: 0
    },
    overHeight: false,
    onDblClick(e) {
        const el = e.path.find(p => p.row);
        if (el)
            this.table.fire('row-dblclick', el.row);
    },
    async openSettings(parent) {
        await ODA.import('@tools/containers');
        await ODA.showDropdown(
            'oda-table-settings',
            { table: this.table },
            { parent, align: 'left', minHeight: '100%', maxWidth: 300, title: 'Settings', hideCancelButton: true }
        );
    },
    get storage() {
        return ODA.LocalStorage.create(this.$savePath);
    },
    get screenFrom() {
        return Math.round(this.$scrollTop / this.rowHeight);
    },
    screenLength: {
        $pdp: true,
        get() {
            return (Math.round(this.$height / this.rowHeight) || 0) + 1;
        },
    },
    columns: [],
    dataSet: [],
    focusedCellEnd: {},

    get _fixWidth() {
        return this.headerColumns.filter(i => {
            return i.fix;
        }).reduce((res, i) => {
            return res += i.width || i.$width;
        }, 0)
    },
    movePointer(h = 0, v = 0) {
        this.throttle('move', e => {
            if (!this.focusedCell)
                this.focusedCell = { row: this.focusedRow || this.rows[0], col: this.activeCols[0] }
            else {
                if (h) {
                    let idx = this.activeCols.findIndex(i => i === this.focusedCell.col);
                    idx += h;
                    this.focusedCell = { col: this.activeCols[idx], row: this.focusedCell.row, _col: this.focusedCell.col }
                    if (this.focusedCell.col)
                        return;
                    if (!v) {
                        this.focusedCell.col = this.focusedCell._col;
                        return;
                    }
                    this.focusedCell.col = (h > 0) ? this.activeCols[0] : this.activeCols[this.activeCols.length - 1];
                }
                if (!v)
                    return;
                let idx = this.visibleRows.findIndex(i => i === this.focusedCell.row);
                idx += v;
                if (idx < 0 || idx >= Math.min(this.screenLength - 1, this.visibleRows.length)) {
                    idx -= v;
                    this.scrollTop += this.rowHeight * v;
                    if (this.scrollTop < 1) {
                        idx = 0;
                    }
                    else if (this.scrollTop >= (this.$scrollHeight - this.$height)) {
                        idx = Math.min(this.screenLength, this.visibleRows.length) - 1;
                    }
                    const col = this.focusedCell.col;
                    this.focusedCell = null;
                    this.async(() => { //todo при асинхронной подгрузке данных будут проблемы.
                        this.focusedCell = { row: this.visibleRows[idx], col };
                    }, 100)
                    return;
                }
                this.focusedCell = { row: this.visibleRows[idx], col: this.focusedCell.col };
                // понаблюдать 👀
                // if (!h)
                //     return;
                this.focusedRow = this.focusedCell.row;
                this.selectedRows = [this.focusedRow];
            }
        }, 50)

    },
    templates: {
        $public: true,
        $pdp: true,
        footerTemplate: 'oda-table-footer-cell',
        groupTemplate: 'oda-table-cell-group',
        headerTemplate: 'oda-table-header-cell',
        cellTemplate: 'oda-table-cell',
        checkTemplate: 'oda-table-check'
    },
    $public: {
        $pdp: true,
        selectByCheck: false,
        allowFocusCell: {
            $def: 'none',
            $list: ['none', 'single', 'rows', 'cols', 'all']
        },
        allowFocusCellZone: {
            $def: 'data',
            $list: ['data', 'tree', 'left', 'right'],
            $multiSelect: true
        },
        autoFixRows: false,
        noLazy: false,
        pivotMode: {
            $def: false,
            $save: true
        },
        rowFixLimit: {
            $def: 10,
            $save: true,
        },
        allowSettings: false,
        allowCheck: {
            $def: 'none',
            $list: ['none', 'single', 'down', 'up', 'double', 'clear-down', 'clear-up', 'clear-double']
        },
        allowDrag: false,
        allowDrop: false,
        allowFocus: false,
        allowHighlight: false,
        allowSelection: {
            $attr: true,
            $list: ['none', 'all', 'level', 'type', 'by-check'],
            $def: 'none',
            set(n, o) {
                if (o)
                    this.clearSelection();
            }
        },
        allowSort: false,
        autoRowHeight: false,
        autoWidth: {
            $def: false,
            $attr: true
        },
        colLines: {
            $def: false,
            $attr: true
        },
        columnId: 'name',

        evenOdd: {
            $def: false,
            $attr: true
        },
        groupExpandingMode: {
            $def: 'none',
            $list: ['none', 'first', 'auto', 'all']
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
            $def: false,
            $attr: true,
            $save: true
        },
        showBorders: {
            $type: Boolean,
            $attr: true
        },
        showFilter: {
            $type: Boolean,
            $def: false,
            $save: true,
            set(n) {
                console.log(n, n)
            }
        },
        showFooter: false,
        showGroupingPanel: {
            $def: false,
            $save: true
        },
        showGroupFooter: false,
        showHeader: false,
        showTreeLines: {
            $type: Boolean,
            $attr: true
        },
        treeLineStyle: {
            $type: Object,
            $def: {
                width: 1,
                color: 'rgba(0, 0, 0, 0.25)'
            }
        },
        treeStep: 24,
    },
    highlightedRow: Object,
    expandLevel: -1,
    expandAll: false,
    get size() {
        return this.sortedItems?.length || 0;
    },

    $pdp: {
        set focusedCell(v) {
            if (v?.col) {
                const idx = this.activeCols.findIndex(i => i === v?.col)
                let left = 0;
                for (let i = 0; i < idx; i++) {
                    const col = this.activeCols[i]
                    left += col?.width || col?.$width;
                }
                if (left < this.$scrollLeft)
                    this.$scrollLeft = left;
                else {
                    const right = left + (v.col?.width || v.col?.$width);
                    const width = this.$scrollLeft + this.$width - this._fixWidth;
                    if (right > width)
                        this.$scrollLeft += right - width;
                }
            }
            if (v?.row) {
                const idx = this.visibleRows.indexOf(v?.row);
                if ((idx + .8) * this.rowHeight > this.$height) {
                    this.$scrollTop += this.rowHeight;
                }
            }
        },
        focusCell(e) {
            const { col, item } = e.path.find(i => {
                return i.col && i.item;
            })
            if (col.fix || col.$flex) return;
            if (this.focusedCell?.row === item && this.focusedCell?.col === col)
                return;
            this.focusedCell = { row: item, col };
        },
        get activeCols() {
            return this.rowColumns.filter(i => {
                return !i.fix && !i.treeMode && !i.$flex && !i.$hidden;
            }).sort((a, b) => {
                return a.$order > b.$order ? 1 : -1;
            })
        },
        set focusedRow(n) {
            if (n) {
                this.debounce('focusedRow', () => {
                    this.scrollToRow(n);
                })
            }
        },
        get body() {
            return this.$('oda-table-body');
        },
        compareRows(row1, row2) { // вынесено в функцию для возможности переопределения
            if (!row1 || !row2) return false;
            return Object.equal(row1, row2);
        },
        isSelectedRow(row) { // вынесено в функцию для возможности переопределения
            return this.selectedRows.some(sr => this.compareRows(row, sr));
        },
        isFocusedRow(row) { // вынесено в функцию для возможности переопределения
            return this.compareRows(row, this.focusedRow);
        },
        get table() {
            return this;
        },
        $scrollLeft: 0,
        $scrollTop: {
            $def: 0,
            set(n) {
                this.$scrollTop = Math.ceil(n / this.rowHeight) * this.rowHeight;
            }
        },
        get rowHeight() {
            return Math.round(this.iconSize * 4 / 3);
        },
        get $scrollHeight() {
            return (this.size + this.fixedRows.length) * this.rowHeight;
        },
        $width: 0,
        $height: 0,
        get visibleRows() {
            const rows = this.rows;
            const raisedRows = this.raisedRows;
            const fixedRows = this.fixedRows;
            return [...fixedRows, ...raisedRows, ...rows];
        },
        draggedRows: [],
        selectedRows: [],
        raisedRows: [],
        checkedRows: [],
        get rows() {
            if (this.noLazy) return this.sortedItems;
            const rows = this.sortedItems.slice(this.screenFrom, this.screenFrom + this.screenLength + this.raisedRows.length);
            if (this.autoFixRows) {
                const raised = [];
                let top = rows[0];

                // Если hideTop не подниматься до самого верхнего __parent__
                const getParent = (row) => {
                    return this.hideTop && !row?.__parent__?.__parent__ ? null : row?.__parent__;
                }
                let __parent__ = getParent(top);
                while (__parent__ || top?.__expanded__ && top?.items?.length) {
                    if (top?.__expanded__ && top?.items?.length) {
                        raised.add(top);
                        rows.shift();
                        top = rows[0];
                    }
                    else {
                        raised.unshift(__parent__)
                        if (raised && (rows[0]?.__parent__ === raised.at(-1))) {
                            rows.shift();
                            top = rows[0];
                        }
                        else {
                            raised.pop();
                        }
                        __parent__ = getParent(__parent__);
                    }
                }
                this.raisedRows = raised;
            }
            else
                this.raisedRows ??= [];
            return rows;
        },
        set rows(v) {
            this.async(() => {
                this.$render();
            }, 100)
        },

        fixedRows: [],
        get rowColumns() {
            const convert = (cols) => {
                return cols.filter(i => !i.$hidden).reduce((res, col) => {
                    modifyColumn.call(this.table, col)
                    if (col.__expanded__ && col.items?.length) {
                        const items = col.items.filter(i => !i.$hidden).map((c, i) => {
                            c.id = col.id + '-' + i;
                            c.__parent__ ??= col;
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
        get sorts() {
            const find_sorts = (columns = []) => {
                modifyColumn.call(this, columns);
                return columns.reduce((res, i) => {
                    res.add(i);
                    let items = i.items;
                    if (items) {
                        if (items?.then) {
                            items?.then(r => {
                                if (r?.length)
                                    res.add(...r);
                            })
                        }
                        else {
                            items = find_sorts(items);
                            res.add(...items);
                        }
                    }
                    return res;
                }, []);
            }
            let result = find_sorts(this.columns);
            result = result.filter(i => {
                return i.$sort;
            })
            result = result.sort((a, b) => {
                return Math.abs(a.$sort) > Math.abs(b.$sort) ? 1 : -1;
            })
            return result;
        },
        groups: [],
        pivotLabels: [],
        get filters() {
            return this.columns?.filter(i => i.$filter) || [];
        },
        $scrollWidth: 0,

        _selectedAll: false,
        get items() {
            if (!this.dataSet?.length) return emptyRows;
            let array = Object.assign([], this.dataSet);
            array = extract.call(this, array, this.hideRoot || this.hideTop ? -1 : 0);
            this._useColumnFilters(array);
            return array;
        },
        get filteredItems() {
            if (this.items?.length)
                return this.items;
            return emptyRows;
        },
        get groupedItems() {
            if (this.filteredItems?.length) {
                const array = [...this.filteredItems]
                if (this.groups.length)
                    this._group(array);
                return array;
            }
            return emptyRows;
        },
        sortedItems: {
            $type: Array,
            get() {
                if (this.groupedItems?.length)
                    return [...this.groupedItems]
                return emptyRows;
            }
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
                        if (c.treeMode) {
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
    },

    get headerColumns() {
        this.columns?.forEach?.((col, i) => {
            modifyColumn.call(this, col);
            let order = i;
            if (col.treeMode)
                order -= 500;
            switch (col.fix) {
                case 'left':
                    order -= 1000;
                    break;
                case 'right':
                    order += 1000;
                    break;
            }
            const id = col[this.columnId];
            if (!id)
                order -= 1000;
            order *= maxColsCount;
            if (id)
                col.$order ??= order;
            else
                col.$order = order;
            col.index = col.order = col.$order;
        });
        const cols = this.columns?.filter?.(i => !i.$hidden) || [];
        if (!this.autoWidth)
            cols.push({ $flex: true, $order: 999 * maxColsCount, cellTemplate: 'div', headerTemplate: 'div', footerTemplate: 'div' });
        if (this.allowCheck !== 'none' && !this.columns.some(i => i.treeMode)) {
            cols.push({ width: 32, $order: -999 * maxColsCount, cellTemplate: this.checkTemplate, headerTemplate: 'div', fix: 'left' });
        }
        cols.filter(i => i.fix === 'left' || i.treeMode).reduce((res, i) => {
            i.left = res;
            res += i.width || i.$width || 0;
            return res;
        }, 0);

        cols.filter(i => i.fix === 'right').reduce((res, i) => {
            i.right = res;
            res += i.width || i.$width || 0;
            return res;
        }, 0);
        cols.forEach((c, i) => {
            c.id = i;
        });
        return cols;
    },

    colStyles: {
        $pdp: true,
        get() {
            const result = this.rowColumns.map(col => {
                if (col.id === undefined)
                    return '';
                let style = `.col-${col.id}{/*${col[this.columnId]}*/\n\t\n\torder: ${col.$order};`;
                if (col.__parent__)
                    style += '\n\tbackground-color: whitesmoke;';
                if (col.$flex)
                    style += '\n\tflex: 1;\n\tflex-basis: "100%";';
                else {
                    style += '\n\tposition: sticky;';
                    if (col.width) {
                        style += `\n\tmin-width: ${col.width}px; \n\tmax-width: ${col.width}px;\n\tflex: 0;`
                    }
                    else {
                        if (this.autoWidth && this.rowColumns.last === col)
                            style += `\n\tflex: 1 !important;`
                        style += `\n\tmin-width: 16px;`
                    }
                    col.$width = col.$width || col.width || 150;
                    style += `\n\twidth: ${col.$width}px;`;


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
            return result;
        }
    },

    focus() { this.body.focus?.() },
    $listeners: {
        dragend: 'onDragEnd',
        dragleave: 'onDragEnd',
    },
    isHighlightedRow(row) { // вынесено в функцию для возможности переопределения
        return this.compareRows(row, this.highlightedRow);
    },
    onTapRows(e) {
        if (e.button)
            return;
        const evt = e.sourceEvent || e;
        if (evt.which !== 1) return;
        this.highlightedRow = null;
        const item = e.target.item;
        this.selectRow(evt);
        this.focusRow(evt);
    },
    expand(row, force, old) {
        const items = this._beforeExpand(row, force);
        if (items?.then) {
            const id = setTimeout(() => {
                row.$loading = true;
                this.$render();
            })
            return items.then(async items => {
                clearTimeout(id)
                row.$loading = false;
                if (this.sorts.length)
                    this._sort(items)
                const node = old || row;
                if ((node.items && node.__expanded__)) {
                    for (let i in items) {
                        const n = items[i];
                        const o = (this.idName ? node.items.find(i => i[this.idName] === n[this.idName]) : node.items[i]) || node.items[i];
                        n.__expanded__ = !!o?.__expanded__;
                        if (n.__expanded__) {
                            this.expand(n, false, o);
                        }
                    }
                }
                if (items?.length) {
                    row.items = items
                }
                else if (row.items?.length > 0) {
                    items = row.items = []
                }
                else {
                    items = row.items
                }
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
    _checkChildren(node) {
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
    _groups: [],
    _group(array) {
        const grouping = (items, __level__ = 0, __parent__) => {
            const column = this.groups[__level__]
            const name = column[this.columnId]
            const label = column.label

            const oldGroups = [...(__parent__ || this)._groups]

            const groups = (__parent__ || this)._groups

            groups.splice(0, groups.length)


            const result = items.reduce((res, i) => {
                if (!i.__group__ && i.__level__ !== 0) return res
                const value = i[name]
                let group = res.find(r => r.value === value)
                if (!group) {
                    group = oldGroups.find(r => r.value === value)
                    if (group) {
                        group.items = []
                        groups.push(group)
                        res.push(group)
                    }
                }
                if (!group) {
                    group = {
                        __group__: true,
                        value,
                        name,
                        label,
                        __level__,
                        items: [],
                        __parent__,
                        _groups: [],
                        hideCheckbox: column.hideGroupCheckbox,
                        hideExpander: column.__expanded__
                    }
                    groups.push(group)
                    res.push(group)
                }
                i.__parent__ = group
                group.items.push(i)
                return res
            }, [])
            // if (newGroups.length > 0) {
            //     groups.splice(0, groups.length, ...newGroups)
            // }

            if (this.groups[0].$sortGroups) {
                this._sortGroups(result, this.groups[0].$sortGroups)
            }
            if (__level__ < this.groups.length - 1) {
                for (let i = 0; i < groups.length; i++) {
                    const group = groups[i];
                    group.items = grouping(group.items, __level__ + 1, group)
                }
            }
            for (let i = 0; i < groups.length; i++) {
                if ([true, false].includes(groups[i].__expanded__)) {
                    continue
                }
                let expanded = column.__expanded__;
                if (this.groupExpandingMode === 'auto' && (true)) {
                    expanded = true;
                }
                else if (this.groupExpandingMode === 'all') {
                    expanded = true;
                }
                else if (this.groupExpandingMode === 'first' && i === 0) {
                    expanded = true;
                }
                groups[i].__expanded__ = expanded;
            }
            return result
        }
        const expanding = (items) => {
            return items.reduce((res, group) => {
                res.push(group);
                if (group.__expanded__ && group.items?.length) {
                    // if (this.allowSort)
                    this._sort(group.items);
                    const subItems = expanding(group.items);
                    res.push(...subItems);
                }
                return res;
            }, []);
        }
        let result = grouping(array)
        result = expanding(result)
        array.splice(0, array.length, ...result);
        return array;
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
        if (!item || item.disabled) return;

        if (this.allowFocus && item && !item.__group__ && (item.$allowFocus !== false)) {
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
            if (this.selectByCheck) {
                if (!item.disabled) {
                    if (this.selectedRows.includes(item)) {
                        const idx = this.selectedRows.indexOf(item);
                        this.selectedRows.splice(idx, 1);
                    } else {
                        this.selectedRows.push(item);
                    }
                    this.selectedRows = [...this.selectedRows]
                }
                return;
            }
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
                    // this.fire('selected-rows-changed', this.selectedRows);
                    if (item === this.selectionStartRow) {
                        this.selectionStartRow = this.selectedRows[0] || null;
                    }
                    this.selectedRows = [...this.selectedRows];
                }
            } else if (!item.disabled) {
                this.selectionStartIndex = -1;
                this.selectedRows.clear();
                this.addSelection(item);
            }
            //this.render();
        }
    },
    addSelection(item) {
        if (!item || item.__group__ || item.$allowSelection === false) return;
        switch (this.allowSelection) {
            case 'all': break;
            case 'level':
                if (this.selectedRows.length) {
                    if (Object.equal(item.__parent__, this.selectedRows[0].__parent__))
                        break;
                    else return;
                } else break;
            case 'type':
                if (this.selectedRows.length) {
                    if (item.type === this.selectedRows[0].type)
                        break;
                    else return;
                } else break;
            case 'none':
            default:
                return;
        }
        this.selectedRows.push(item);
        this.selectedRows = [...this.selectedRows]
        // this.fire('selected-rows-changed', this.selectedRows);
    },
    clearSelection() {
        this._selectedAll = false;
        this.selectedRows = [];
        // this.fire('selected-rows-changed', this.selectedRows);
    },
    scrollToRow(item) {
        if (this.style.getPropertyValue('visibility') === 'hidden') {
            return this.async(() => this.scrollToRow(item), 100)
        }
        item ??= this.focusedRow;
        if (this.rows.some(r => r === item)) return;
        const idx = this.items.findIndex(i => {
            return Object.equal(i, item);
        });
        if (idx > -1) {
            const pos = idx * this.rowHeight;
            const shift = this.rowHeight * Math.floor(this.body.offsetHeight / (3 * this.rowHeight));
            if ((this.body.scrollTop + 0.8 * this.rowHeight > pos) || (this.body.offsetHeight + this.body.scrollTop - 1.5 * this.rowHeight < pos)) {
                this.throttle('changeScrollTop', () => { // for finishig of rendering
                    this.body.scrollTop = (pos - shift < 0) ? 0 : pos - shift;
                }, 100);
            }
        }
    },
    selectItem(item) {
        this.clearSelection();
        const items = this.items;
        if (item && items) {
            if (item.disabled || item.isGroup) {
                item.__expanded__ = !item.__expanded__;
            } else {
                this.selectedRows.push(item);
                // this.fire('selected-rows-changed', this.selectedRows);
                this.focusedRow = item;
                this.selectedRows = [...this.selectedRows]
                // this.scrollToRow(item);
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
            this.showGroupingPanel = true;
        }
    },
    removeGroup(col) {
        let idx = this.groups.indexOf(col);
        if (idx > -1)
            this.groups.splice(idx, 1);
        if (!this.groups.length)
            this.showGroupingPanel = false;
    },
    _getColumns(row) {
        if (row.__group__)
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
        const items = (row.__parent__?.items || this.dataSet);
        items.splice(items.indexOf(row), 0, ...rows);
    },
    insertAfterRow(row, rows) {
        if (!Array.isArray(rows))
            rows = [rows];
        const items = (row.__parent__?.items || this.dataSet);
        items.splice(items.indexOf(row) + 1, 0, ...rows);
    },
    appendChildRows(target, rows) {
        if (!Array.isArray(rows))
            rows = [rows];
        if (!target.items)
            target.items = rows;
        else
            target.items.push(...rows);
        target.__expanded__ = true;
    },
    removeRows(rows) {
        if (!Array.isArray(rows))
            rows = [rows];
        rows.forEach(row => {
            const items = (row.__parent__?.items || this.dataSet);
            items.splice(items.indexOf(row), 1);
        })
    },
    deleteItems(callback, once = false) {
        const items = once ? [this._find(callback)] : this._filter(callback);
        items.forEach(i => {
            const array = i.__parent__ && i.__parent__.items || this.dataSet;
            const idx = array.indexOf(i);
            if (~idx) {
                array.splice(idx, 1);
            }
        })
    },
    _getDragData(rows) {
        return rows.map(r => {
            return { mime: 'application/json', data: r }
        })
    },
    _onDragStart(e) {
        const el = e.path.find(p => p.row);
        if (el && (this.allowDrag || el.row.drag)) {
            this._setDragImage(e);
            this.draggedRows = this.selectedRows.includes(el.row) ? this.selectedRows : [el.row];
            this._getDragData(this.draggedRows).forEach(data => {
                e.dataTransfer.setData(data.mime, data.data);
            })
        }
    },
    _setDragImage(e) {
        try {
            const node = e.target.querySelector('.cell');
            e.dataTransfer.setDragImage(node || new Image(), 0, 0);
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
        let r = row;
        while (r) {
            if (this.draggedRows.includes(r)) return;
            r = r.__parent__;
        }
        if (this.draggedRows.some(i => i.__parent__ === row)) return;
        e.preventDefault();
        if (/* !row.__expanded__ &&  */!this._expandTimer) {
            this._expandTimer = setTimeout(() => {
                clearTimeout(this._expandTimer);
                this._expandTimer = null;
                row.__expanded__ = true;//!row.__expanded__;
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
        e.dataTransfer.dropEffect = this._getDropEffect(this.draggedRows, row, e);
        if (!e.dataTransfer.dropEffect || e.dataTransfer.dropEffect === 'none')
            row.$dropMode = ''
    },
    _getDropEffect(source, target, event) {
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
        e.preventDefault();
        try {
            this._doDrop(this.draggedRows, row, e)
        } catch (err) {
            console.error(err);
        } finally {
            row.$dropMode = '';
            this['#items'] = undefined;
        }
    },
    _doDrop(source, target, event) {
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

    // _onRowContextMenu(e) {
    //     const el = e.path.find(p => p.row);
    //     if (el)
    //         this.fire('row-contextmenu', el.row);
    // },
    _onDropToEmptySpace() {

    },
    _onDragOverToEmptySpace() {

    },
    _onDownToEmptySpace(e) {
        if (e.button)
            return;
        this.focusedRow = null
        this.clearSelection()
    }
});

ODA({is: 'oda-table-group-panel', imports: '@oda/icon',
    template: /*html*/`
    <style>
        :host {
            @apply --header;
            @apply --horizontal;
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
        .panel {
            margin: 2px;
            min-width: 50%;
        }
        label {
            @apply --flex;
            @apply --disabled;
        }
        :host > div > div{
            align-items: center;
            padding: 0px 4px;
        }
        oda-icon {
            transform: scale(.7);
        }

    </style>
    <div class="horizontal border flex panel">
        <oda-icon disabled :icon-size icon="icons:dns"></oda-icon>
        <div class="flex horizontal">
            <label ~if="!groups.length">Drag here to set row groups</label>
            <div class="no-flex horizontal">
                <div class="item shadow content no-flex horizontal" ~for="groups">
                    <label class="label flex" ~text="$for.item.$saveKey || $for.item.label"></label>
                    <oda-icon class="closer" icon="icons:close" :icon-size @tap="_close($event, $for.item)"></oda-icon>
                </div>
            </div>
        </div>
    </div>
    <div ~show="pivotMode" class="horizontal border flex panel">
        <oda-icon disabled :icon-size icon="icons:dns:90"></oda-icon>
        <div class="flex horizontal">
            <label ~if="!pivotLabels.length">Drag here to set column labels</label>
            <div class="no-flex horizontal">
                <div class="item shadow content no-flex horizontal" ~for="pivotLabels">
                    <label class="label flex" ~text="$for.item.$saveKey || $for.item.name"></label>
                    <oda-icon class="closer" icon="icons:close" :icon-size @tap="_close($event, $for.item)"></oda-icon>
                </div>
            </div>
        </div>
    </div>
    `,
    $listeners: {
        dragover: '_dragover',
        drop: '_drop'
    },
    _close(e, column) {
        e.stopPropagation();
        this.table.removeGroup(column);
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

ODA({is: 'oda-table-part',
    template: `
        <style>{{colStyles}}</style>
    `
})

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
        <oda-checkbox id="checker" :value="items.every(i=> !i.col.$hidden)" @tap="_onSelectAll"></oda-checkbox>
        <label class="flex label center" style="font-size: 10pt; padding: 0px 8px;">(show all)</label>
    </div>
    <div>
        <div ~for="items" class="list  no-flex horizontal">
            <oda-checkbox :value="!$for.item.col.$hidden"  @value-changed="_onChange($event, $for.item)"></oda-checkbox>
            <label class="label center" style="font-size: 10pt; padding: 0px 8px;">{{getLabel(item)}}</label>
        </div>
    </div>
    `,
    items: [],
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
            i.col.$hidden = !this.$('#checker').value;
        });
    },
});

ODA({is: 'oda-table-cols', extends: 'oda-table-part',
    template: /*html*/`
    <style>
        :host {
            position: relative;
            border-color: white;
            @apply --horizontal;
            @apply --dark;
            margin-bottom: 1px;
            z-index: 1;
        }
    </style>
    <div :scroll-left="$scrollLeft" class="horizontal flex" style="overflow-x: hidden;" ~style="{maxWidth: this.autoWidth?'100%':'auto'}">
        <div ~for="columns" ~is="getTemplate($for.item)" :item="getItem($for.item)" :column="$for.item" ~class="['col-' + $for.item.id, $for.item.$flex?'flex':'auto']"></div>
    </div>
    <div ~if="$scrollHeight > $height" class="no-flex" style="overflow-y: scroll; visibility: hidden;"></div>
    `,
    getItem(col) {
        return col;
    },
    getTemplate(col) {
        return 'div'
    },
    columns: {
        $def: [],
        set(v) {
            this.async(() => {
                this.$render();
            })
        }
    },
})

ODA({is: 'oda-table-header', extends: 'oda-table-cols',
    template: /*html*/`
         <oda-button ~if="this.allowSettings" class="invert" style="position: absolute; top: 0px; right: 0px; z-index: 1;" icon="icons:settings" @tap.stop="openSettings($this)"></oda-button>
    `,
    getTemplate(col) {
        return col.headerTemplate || this.headerTemplate
    }
})

ODA({is: 'oda-table-footer', extends: 'oda-table-cols',
    getItem(col) {
        return this.footer;
    },
    getTemplate(col) {
        return col.footerTemplate || 'oda-table-footer-cell'
    }
})

ODA({is: 'oda-table-body', extends: 'oda-table-part',
    template: /*html*/`
    <style>
        :host {
            position: relative;
            overflow-x: {{autoWidth?'hidden':'auto'}};
            overflow-y: {{showHeader?'auto':'auto'}};
            @apply --vertical;
        }
        .row {
            position: relative;
            min-height: {{rowHeight}}px;
            min-width: {{autoWidth?0:$scrollWidth}}px;
            top: 0px;
            @apply --horizontal;
            max-height: {{autoRowHeight ? '' : rowHeight + 'px'}};
        }
       .group-row {
            position: sticky;
            z-index: 2;
            @apply --dark;
            max-width: {{$width}}px;
            left: 0px;
        }
    </style>
    <style>
        :host([even-odd]) .row:not([selected]):nth-child(odd):not([role]):not([dragging]) > .cell:not([fix]) {
            background-color: rgba(0,0,0,.05);
        }
        .cell {
            position: relative;
            @apply --horizontal;
            @apply --content;
            /*@apply --no-flex;*/
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            box-sizing: border-box;
            align-items: center;
            position: sticky;
        }
        :host([row-lines]) .cell {
            border-bottom: 1px  solid var(--dark-background);
        }
        :host([col-lines]) .cell {
            border-right: 1px solid var(--dark-background);
        }
        :host([col-lines]) .cell[fix] {
             border-right: 2px solid var(--dark-background);
             /*border-bottom: 1px  solid var(--content-background);*/
        }
        :host([col-lines]) .cell[fix = right] {
            border-left: 2px solid var(--dark-background);
            border-right: none;
        }
        .row[focused]>.cell::after {
            content: '';
            background-color: var(--focused-color);
            position: absolute;
            bottom: 0px;
            left: 0px;
            right: 0px;
            height: 1px;
            z-index: 1;
            pointer-events: none;
            @apply --shadow;
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
        .cell[fix] {
            @apply --header;
        }
        .group {
            border-color: transparent !important;
            @apply --dark;
            @apply --flex;
        }
        .sticky {
            position: sticky;
            position: -webkit-sticky;
        }
        .cell[focus]::before{
            content: '';
            pointer-events: none;
            position: absolute;
            height: 100%;
            width: 100%;
            outline: auto;
            top: 0px;
            right: 0px;
            left: 0px;
            /*outline-offset: -1px !important;*/
            outline-width: 1px !important;
            outline-color: var(--focused-color) ;
            z-index: 1;
        }

    </style>
    <div ~wake="true" class="no-flex  vertical" ~style="{maxHeight: $scrollHeight+'px', minHeight: $scrollHeight+'px'}">
        <div ~wake="true"  class="sticky" style="top: 0px; min-height: 1px; min-width: 100%;" @dblclick.stop="onDblClick" @tap="onTapRows" @pointerdown="focusCell($event)" @contextmenu="_onRowContextMenu" @dragleave="table._onDragLeave($event, $detail)" @dragover="table._onDragOver($event, $detail)"  @drop="table._onDrop($event, $detail)">
            <div ~for="visibleRows" class="row"  :row="$for.item"
                ~class="{'group-row':$for.item.__group__}"
                :drop-mode="$for.item.$dropMode"
                :dragging="draggedRows.includes($for.item)"
                @dragstart="table._onDragStart($event, $detail)"
                :focused="allowFocus && isFocusedRow($for.item)"
                :highlighted="allowHighlight && isHighlightedRow($for.item)"
                :selected="allowSelection !== 'none' && isSelectedRow($for.item)">
                <div :focus="_getFocus($$for.item, $for.item)" @pointerenter="focusedMove" :draggable="getDraggable($for.item, $$for.item)" :item="$for.item" class="cell" ~for="$for.item.__group__ ? [$for.item] : rowColumns" :role="$for.item.$role" :fix="$$for.item.fix" ~props="$$for.item?.props" :col="$$for.item" ~class="_getCellClasses($for.item, $$for.item)">
                    <div :dark="raisedRows.includes($for.item)" ~is="_getTemplateTag($for.item, $$for.item)" class="flex" ~class="{'group' : $for.item.__group__}" :column="$$for.item" class="cell-content" :item="$for.item"></div>
                </div>
            </div>
        </div>
    </div>
    <div class="flex" style="visibility: hidden;" @drop.stop.prevent="table._onDropToEmptySpace($event, $detail)" @dragover.stop.prevent="table._onDragOverToEmptySpace($event, $detail)"></div>
    `,
    attached() {
        this.setScreen();
    },
    _getCellClasses(row, col) {
        const res = [];
        res.push('col-' + col.id);
        if (row.__group__ || col.$flex) {
            res.push('flex');
        }
        else {
            res.push('no-flex');
        }
        return res;
    },
    focusedMove(e) {
        if (e.buttons !== 1) return;
        this.focusedCellEnd = { row: e.target.row, col: e.target.col }
    },
    _onRowContextMenu(e) {
        const el = e.path.find(p => p.row);
        if (el)
            this.table.fire('row-contextmenu', el.row);
    },
    _getFocus(col, row) {
        // this.focusedCellEnd = {};
        return this._cellSelection.rows.indexOf(row) > -1 && this._cellSelection.cols.indexOf(col) > -1;
    },
    get _cellSelection() {
        const selection = { rows: [], cols: [] };
        if (this.focusedCell?.row) {
            let idx1 = this.items.indexOf(this.focusedCell.row);
            let idx2 = this.items.indexOf(this.focusedCellEnd?.row || this.focusedCell.row);
            let sign = Math.sign(idx2 - idx1) || 1;
            for (let i = idx1; i <= idx2 * sign; i += sign) {
                selection.rows.push(this.items[i]);
            }

            idx1 = this.rowColumns.indexOf(this.focusedCell.col);
            idx2 = this.rowColumns.indexOf(this.focusedCellEnd?.col || this.focusedCell.col);
            sign = Math.sign(idx2 - idx1) || 1;
            for (let i = idx1; i <= idx2 * sign; i += sign) {
                selection.cols.push(this.rowColumns[i]);
            }
        }

        return selection;
    },
    // firstTop: 0,
    setScreen() {
        if (this.fix) return;

        this.$height = this.offsetHeight;
        this.$width = this.offsetWidth;
        this.overHeight = this.offsetHeight < this.scrollHeight;
        this.$scrollTop = Math.ceil(this.scrollTop / this.rowHeight) * this.rowHeight;;
        this.$scrollWidth = this.scrollWidth;
        this.$scrollLeft = Math.floor(this.scrollLeft);
    },
    overHeight: false,
    $listeners: {
        resize(e) {
            this.setScreen();
        },
        scroll(e) {
            this.setScreen();
        },
        mousewheel(e) {
            if (e.ctrlKey || e.altKey) return;
            if (!e.shiftKey) {
                if (Math.round(this.offsetHeight) >= Math.round(this.scrollHeight))
                    return;
                let y = Math.round(this.scrollTop) + e.deltaY / 3;
                if (y < 0)
                    y = 0;
                this.$scrollTop = Math.ceil(y / this.rowHeight) * this.rowHeight;;
                if (Math.round(this.scrollTop) !== Math.round(this.$scrollTop)) {
                    this.scrollTop = this.$scrollTop;
                    e.preventDefault();
                }
            }
            else {
                if (Math.round(this.offsetWidth) >= Math.round(this.scrollWidth))
                    return;
                let x = Math.round(this.scrollLeft) + e.deltaY / 3;
                if (x < 0)
                    x = 0;
                this.$scrollLeft = x;
                if (Math.round(this.scrollLeft) !== Math.round(this.$scrollLeft)) {
                    this.scrollLeft = this.$scrollLeft;
                    e.preventDefault();
                }

            }
        }
    },
    $keyBindings: {
        // arrowLeft(e) {
        //     e.preventDefault();
        //     this.movePointer(-1, 0)
        // },
        // arrowRight(e) {
        //     e.preventDefault();
        //     this.movePointer(1, 0)
        // },
        arrowUp(e) {
            // e.preventDefault();
            this.movePointer(0, -1)
        },
        arrowDown(e) {
            // e.preventDefault();
            this.movePointer(0, 1)
        },
        pageUp(e) {
            // e.preventDefault();
            this.movePointer(0, -this.screenLength);
        },
        pageDown(e) {
            // e.preventDefault();
            this.movePointer(0, this.screenLength);
        },
        tab(e) {
            e.preventDefault();
            const d = !e.shiftKey ? 1 : -1;
            this.movePointer(d, d);
        },
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
            if (this.focusedCell) {
                this.focusedRow = this.focusedCell.row;
            }

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
    _getTemplateTag(row, col) {
        if (row.__group__)
            return this.groupTemplate;
        if (col.treeMode)
            return 'oda-table-cell-tree';
        let template = row.templates?.[col] || col.cellTemplate || this.cellTemplate;
        if (typeof template === 'object')
            return template.tag || template.is || template.template;
        return template;
    },
    getDraggable(row, col) {
        return (col.treeMode && this.allowDrag && !this.compact && !row.__group__ && row.drag !== false) ? 'true' : false;
    },

})
ODA({is: 'oda-table-footer-cell', extends: 'oda-table-cell',
    template: /*html*/`
    <style>
        .split {
            opacity: .5 !important;
            border-right: {{fix === 'right'?'none':'1px solid var(--dark-color, white)'}};
            border-left: {{fix === 'right'?'2px solid var(--dark-color, white)':'none'}};
            border-width: {{fix?2:1}}px;
            border-color: {{fix?'black':'var(--dark-color, white)'}};
            height: 100%;
        }
        :host {
            padding: 4px;
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
    ODA({is: 'oda-table-cell-base',
        template: /*html*/`
        <style>
            :host {
                @apply --horizontal;
                align-items: center;
                overflow: hidden;
                text-overflow: ellipsis;
                min-height: 100%;
                min-width: 1px;
                white-space: {{autoRowHeight ? 'normal' : 'nowrap'}};
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
        item: {
            $def: null,
            $pdp: true
        },
        get fix() {
            return this.column?.fix;
        }
    });

    ODA({is: 'oda-table-cell', extends: 'oda-table-cell-base',
        template: /*html*/`
            <style>
                .field-control{
                    @apply --flex;
                }
            </style>
            <span class="field-control"  ~is="template" :column :item ::value style="overflow: hidden">{{value}}</span>`,
        focused: {
            $type: Boolean,
            $def: false,
            $attr: true,
        },
        $public: {
            $pdp: true,
            template: 'span',
            get value() {
                return this.item?.[this.column?.[this.columnId]] ?? '';
            },
            set value(n) {
                this.item[this.column[this.columnId]] = n;
            }
        }
    });

    ODA({is: 'oda-table-expand', imports: '@oda/icon', extends: 'oda-table-cell-base',
        template: /*html*/`
            <oda-icon ~if="showExpander" style="cursor: pointer" :icon :icon-size
                @dblclick.stop.prevent
                @down.stop.prevent
                @pointerdown.stop.prevent
                @pointerup.stop.prevent
                @tap.stop.prevent="_toggleExpand"
                class="no-flex expander" ~style="_style"></oda-icon>
        `,
        get showExpander() {
            return this.item?.__level__ !== -1 && !this.item?.$forceExpanded;
        },
        get _style() {
            return { opacity: (!this.icon) ? 0 : (this.item?.disabled ? .5 : 1) }
        },
        get hideIcon() {
            return this.item.hideExpander || (!this.item.items?.length && !this.item.$hasChildren);
        },
        get icon() {
            if (!this.item || this.hideIcon)
                return '';
            if (this.item.$loading)
                return this.item.iconExpanding || this.iconExpanding;
            if (this.item.__expanded__)
                return this.item.iconExpanded || this.iconExpanded;
            return this.item.iconCollapsed || this.iconCollapsed;
        },
        _toggleExpand(e, d) {
            this.async(() => {
                if (!this.item.hideExpander) {
                    this.item.__expanded__ = !this.item.__expanded__;
                    this.fire('expanded-changed', this.item.__expanded__);
                }
            })
        }
    });

    tree: {
        ODA({is: 'oda-table-cell-tree', extends: 'oda-table-cell-base',
            template: /*html*/`
            <style>
                :host {
                    height: 100%;
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

                oda-table-expand[scrolled-children]::after{
                   position: absolute;
                   content: attr(scrolled-children);
                   z-index: 2;
                   bottom: 0px;
                   font-size: x-small;
                   font-weight: bold;
                   /*background-color: transparent !important;*/
                   right: 0px;
                   left: 0px;
                   text-align: right;
                }
            </style>
            <div class="step no-flex" ~style="myStyle">
                <div class="end-step" ~style="endStepStyle"></div>
            </div>
            <oda-table-expand ~style="{backgroundColor: expBackground}" class="no-flex" :item :scrolled-children></oda-table-expand>
            <div ~is="item.checkTemplate || checkTemplate" class="no-flex" ~if="_showCheckBox" :column="column" :item="item"></div>
            <div :dark ::color  ~is="subTemplate" :column :item class="flex" @tap="_tap">{{item?.[column[columnId]]}}</div>`,
            get subTemplate() {
                return this.item?.[this.column[this.columnId] + '.template'] || this.item?.template || this.column?.cellTemplate || this.cellTemplate || 'label';
            },
            get expBackground() {
                return this.item?.['sys:color'] || 'transparent';
            },
            dark: {
                $attr: true,
                $type: Boolean
            },
            $public: {
                scrolledChildren: {
                    get() {
                        let idx = this.raisedRows.indexOf(this.item);
                        if (idx > -1) {
                            let next = this.raisedRows[idx + 1] || this.rows?.[0];
                            let counter = 0;
                            for (let i = 0; i < this.item?.items?.length || 0; i++) {
                                if (this.item?.items[i] === next)
                                    break;
                                counter++;
                            }
                            return counter || '';
                        }
                    },
                    $attr: true
                },
            },
            get level() {
                return this.item?.__level__;
            },
            get myStyle() {
                return { width: (+this.level * this.stepWidth) + 'px', ...this.stepStyle };
            },
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
            color: undefined,
            _tap() {
                if (this.item.disabled || this.item.isGroup) this.item.__expanded__ = !this.item.__expanded__
                //else this.item.__expanded__ = true
            },
            $keyBindings: {
                arrowLeft(e) {
                    e.preventDefault();
                    this.movePointer(-1, 0)
                },
                arrowRight(e) {
                    e.preventDefault();
                    this.movePointer(1, 0)
                },
            }
        });


        ODA({is: 'oda-table-check', imports: '@oda/icon', extends: 'oda-table-cell-base',
            template: /*html*/`
                <oda-icon class="no-flex" @tap.stop.prevent="_toggleChecked" :icon :icon-size ~style="{padding: Math.round(iconSize*.2)+'px'}"></oda-icon>
            `,
            get icon() {
                if (this.selectByCheck) {
                    return this.selectedRows.includes(this.item) ? this.iconChecked : this.iconUnchecked;
                }
                if (this.item?.checked === true || this.item?.checked === 'checked')
                    return this.iconChecked;
                if (!this.item?.checked || this.item?.checked === 'unchecked')
                    return this.iconUnchecked;
                return this.iconIntermediate;
            },

            _toggleChecked(e) {
                if (this.allowCheck === 'none') return;
                if (this.selectByCheck) return this.selectRow(e);

                const checkChildren = (item, clear = false) => {
                    (item.items || []).forEach(i => {
                        if (item.checked !== 'intermediate') {
                            i.checked = clear ? false : item.checked;
                            updateCheckedRows(i);
                            checkChildren(i, clear);
                        }
                    })
                };
                const updateChecked = (item, clear = false) => {
                    item.checked = (item.items || []).reduce((res, i) => {
                        if (res === 'intermediate')
                            return clear ? false : res;
                        else if (res === undefined)
                            res = i.checked || false;
                        else if (!clear && (res !== ((i.checked === undefined) ? false : i.checked)))
                            res = 'intermediate';
                        return clear ? (res || i.checked) : res;
                    }, undefined);
                    updateCheckedRows(item);
                };
                const updateCheckedRows = (item) => {
                    const i = this.checkedRows.indexOf(item);
                    if ((item.checked !== 'unchecked') && i === -1)
                        this.checkedRows.push(item);
                    else if ((item.checked === 'unchecked') && i !== -1)
                        this.checkedRows.splice(i, 1);
                };
                const updateUp = (item, clear = false) => {
                    let parent = item.__parent__;
                    while (parent) {
                        updateChecked(parent, clear);
                        parent = parent.__parent__;
                    }
                }
                switch (this.item.checked) {
                    case 'checked': {
                        this.item.checked = 'unchecked';
                    } break;
                    default: {
                        this.item.checked = 'checked';
                    }
                }
                // this.item.checked = !(!!this.item.checked);
                updateCheckedRows(this.item);
                // if (this.allowCheck !== 'single') {
                    switch (this.allowCheck) {
                        case 'clear-down':
                            checkChildren(this.item, true);
                            break;
                        case 'down':
                            checkChildren(this.item);
                            break;
                        case 'clear-up':
                            updateUp(this.item, true);
                            break;
                        case 'up':
                            updateUp(this.item);
                            break;
                        case 'clear-double':
                            checkChildren(this.item, true);
                            updateUp(this.item, true);
                            break;
                        case 'double':
                            checkChildren(this.item);
                            updateUp(this.item);
                            break;
                        default:
                            break;
                    }
                // }
                this.table.fire('checked-changed', this.item);
            }
        });
    }

    ODA({is: 'oda-table-error', imports: '@oda/icon', extends: 'oda-table-cell-base',
        template: /*html*/`
        <oda-icon icon="icons:error"></oda-icon>
        <label class="label flex" ~text="item.error"></label>`
    });

    ODA({is: 'oda-table-header-cell', imports: '@oda/button', extends: 'oda-table-cell-base',
        template: /*html*/`
        <style>{{colStyles}}</style>
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
                min-width: {{column.width || 16}}px;
                order: {{column.$order}};
                @apply --no-flex;
            }
            .split {
                margin: 4px 0px;
                width: 2px;
                opacity: .5;
                cursor: col-resize;
                border-right: {{fix === 'right'?'none':'1px solid var(--dark-color, white)'}};
                border-left: {{fix === 'right'?'1px solid var(--dark-color, white)':'none'}};
                border-width: {{fix?2:1}}px;
                border-color: {{fix?'black':'var(--dark-color, white)'}};
                @apply --no-flex;
                z-index: 1
            }
            .split::before{
                content: "";
                position: absolute;
                right: 0px;
                height: 100%;
                top: 0px;
                width: 4px;
                cursor: col-resize;
                z-index: 1;
                background-color: transparent;
            }
            .split::after{
                content: "";
                position: absolute;
                left: 0px;
                height: 100%;
                top: 0px;
                width: 4px;
                cursor: col-resize;
                z-index: 1;
                background-color: transparent;
            }
            .split:hover {
                opacity: 1;
            }
            oda-icon {
                transform: scale(.85);
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
            }
            .sub-cols > .header-cell :not(:nth-child(1)) {
                border-left: 1px solid var(--dark-color);
            }
            :host .filter-container {
                @apply --horizontal;
                align-items: center;
                max-height: {{iconSize}}px;
                min-height: {{iconSize}}px;
                border-bottom: 1px solid;
            }
            label {
                text-align: center;
                margin: 4px 0px;
                text-overflow: ellipsis;
                white-space:break-spaces !important;
            }
        </style>
        <div class="flex vertical" style="cursor: pointer"  :disabled="!column.name">
            <div @tap.stop="setSort" class="flex horizontal"  ~style="{flexDirection: column.fix === 'right'?'row-reverse':'row', minHeight: rowHeight+'px', height: column?.__expanded__?'auto':'100%'}">
                <div class="flex horizontal" style="align-items: center;">
                    <oda-table-expand ~if="column?.items?.length" :item class="no-flex"></oda-table-expand>
                    <label class="label flex" :title="column.label || column.name" ~text="column.label || column.name" draggable="true" @dragover="_dragover" @dragstart="_dragstart" @dragend="_dragend" @drop="_drop"></label>
                    <oda-icon :disabled="column?.__expanded__ && column?.items?.length" style="position: absolute; right: 0px; top: 0px;" ~if="allowSort && sortIndex" title="sort" :icon="sortIcon" :bubble="sortIndex"></oda-icon>
                </div>
                <slot name="tools"></slot>
                <div @dblclick="column.reset('$width')" class="split"  @tap.stop @track="_track"></div>
            </div>
            <div class="cell flex horizontal filter-container" ~if="!column.__expanded__ && column.name && showFilter" style="align-items: center" @tap.stop>
                <input class="flex filter-input" ::value="filter" @tap.stop style="margin-left: 8px; padding: 2px;">
                <oda-button ~if="!filter" :icon-size="Math.round(iconSize * .5)" @tap.stop="showDD" icon="icons:filter-list" title="filter"></oda-button>
                <oda-button ~if="filter"  :icon-size="Math.round(iconSize * .5)" icon="icons:close" @tap.stop="filter = ''" title="clear"></oda-button>
            </div>
            <div class="flex sub-cols horizontal" ~if="expanded && column?.items?.length">
                <oda-table-header-cell ~wake="true" ~is="headerTemplate"  class="header-cell flex" ~for="subCols" :item="$for.item" :column="$for.item" ~class="['col-' + $for.item.id]"></oda-table-header-cell>
            </div>
            <div class="flex" ~if="!column.name"></div>
        </div>`,
        get expanded() {
            return this.column.__expanded__;
        },
        get subCols() {
            return this.column?.items?.map(i => {
                i.__parent__ ??= this.column;
                modifyColumn.call(this.table, i);
                return i;
            })?.filter(i => !i.$hidden);
        },
        get sortIcon() {
            if (+this.column.$sort > 0)
                return 'icons:arrow-drop-down';
            if (+this.column.$sort < 0)
                return 'icons:arrow-drop-up';
            return ''
        },
        get sortIndex() {
            return Math.abs(+this.column?.$sort)
            // return (this.sorts?.filter(s => !s.$hidden && !s.__expanded__).indexOf(this.column) + 1) || 0;
        },

        filter: {
            $type: String,
            $def: '',
            set(val) {
                this.column.$filter = val || null;
            }
        },

        $listeners: {
            contextmenu: '_menu',
            resize(e) {
                if (!this.active || !this.column || this.column.__expanded__ || this.column.$flex) return;
                e.stopPropagation();
                modifyColumn.call(this.table, this.column);
                this.column.$width = Math.round(this.offsetWidth);
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
            const { control } = await ODA.showDropdown('oda-menu', { iconSize: this.iconSize, items: menu }, { title: 'Column menu', allowClose: true });
            control?.focusedItem.execute();
        },
        setSort(e) {
            if (!this.allowSort) return;
            const sort = this.column.$sort;
            if (this.column.$sort > 0) {
                this.column.$sort = -this.column.$sort;
            }
            else if (this.column.$sort < 0) {
                this.column.$sort = 0;
                this.async(() => {
                    this.sorts.forEach((i, idx) => {
                        i.$sort = (idx + 1) * Math.sign(i.$sort);
                    })
                })
            }
            else {
                this.column.$sort = this.sorts.length + 1;
                this.async(() => {
                    this.sorts.forEach((i, idx) => {
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
        <oda-table-expand class="no-flex" :item ~style="{marginLeft: item.__level__ * iconSize + 'px'}" @expanded-changed="expandedChanged"></oda-table-expand>
        <label ~if="item.label"  style="font-size: small; margin: 4px;" class="no-flex">{{item.label}}:</label>
        <label style="font-weight: bold; margin: 4px; overflow: hidden;" class="flex">{{item.value}}</label>
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
        if (!('__expanded__' in i))
            Object.defineProperty(i, '__expanded__', {
                enumerable: false,
                configurable: true,
                writable: true,
                value: i.__expanded__
            })
        Object.defineProperty(i, '$forceExpanded', {
            enumerable: false,
            configurable: true,
            writable: true,
            value: i.$forceExpanded
        })

        if (!('__parent__' in i))
            Object.defineProperty(i, '__parent__', {
                enumerable: false,
                configurable: true,
                writable: true,
                value: i.__parent__ || null
            })
        if (!('__level__' in i))
            Object.defineProperty(i, '__level__', {
                enumerable: false,
                configurable: true,
                writable: true,
                value: i.__level__ || 0
            })
        if (!('$hasChildren' in i))
            Object.defineProperty(i, '$hasChildren', {
                enumerable: false,
                configurable: true,
                writable: true,
                value: i.$hasChildren || false
            })
        if (parent) {
            i.__parent__ = parent;
        }
        else if (i.__parent__) {
            i.__parent__ = null;
        }
        i.__level__ = level;
        if (!this.hideTop || level > -1)
            res.push(i);

        const has_children = this._checkChildren(i);
        if (has_children?.then)
            has_children.then(res => i.$hasChildren = res);
        else
            i.$hasChildren = has_children;
        if ((i.__expanded__ === undefined && (this.expandAll || (this.expandLevel >= i.__level__))) || (level < 0 && !i.__expanded__)) {
            i.$forceExpanded = true;
        }
        else {
            i.$forceExpanded = false;
        }
        if (i.__expanded__ || i.$forceExpanded) {
            if (i.items?.length)
                res.push(...extract.call(this, i.items, level + 1, i));
            else
                i.items = undefined;
            this.expand(i);
        }
        return res;
    }, []);
}
settings: {
    ODA({is: 'oda-table-settings', imports: '@tools/property-grid, @oda/tree, @oda/splitter',
        template: /*html*/`
        <style>
            :host {
                @apply --horizontal;
                width: {{width}}px;
                @apply --flex;
                /*min-height: 100vh;*/
                min-width: 200px;
                overflow: hidden;
            }
            div > div {
                align-items: center;
                @apply --horizontal;
                padding: 8px 4px;
                cursor: pointer;
            }
            div > div:hover {
                color: var(--focused-color) !important;
            }
            oda-icon {
                transform: scale(.7);
            }
        </style>
        <oda-splitter ::width></oda-splitter>
        <div class="content flex vertical" style="overflow: auto;">
            <oda-table-columns-tree class="border" ~show="focusedTab === 0"></oda-table-columns-tree>
            <oda-property-grid class="flex" ~if="focusedTab === 2" only-save :inspected-object="table"></oda-property-grid>
        </div>
        <div style="writing-mode: vertical-lr;" class="horizontal header">
            <div :focused="focusedTab === $for.index" @tap="focusedTab = $for.index" ~for="tabs"><oda-icon :icon="$for.item.icon" :title="$for.item.title"></oda-icon>{{$for.item.title}}</div>
        </div>
        `,
        table: null,
        focusedTab: 0,
        tabs: [
            { icon: 'icons:tree-structure:90', title: 'columns' },
            { icon: 'icons:filter:90', title: 'filters' },
            { icon: 'icons:settings:90', title: 'properties' },
        ],
        $public: {
            width: {
                $def: 300,
                // $save: true,
            }
        },
        $listeners: {
            resize(e) {
                this.width = e.offsetWidth;
            }
        }
    })
    ODA({is: 'oda-table-columns-tree', imports: '@oda/tree, @oda/toggle', extends: 'this, oda-tree',
        template: /*html*/`
        <style>
            :host {
                font-size: small;
            }
            oda-toggle{
                transform: scale(.7);
            }
            label{
                align-self: center;
                @apply --flex;

            }
        </style>
        <div class="no-flex header vertical">
            <div class="horizontal">
                <oda-toggle ::toggled="domHost.table.showGroupingPanel"></oda-toggle><label>Group panel</label>
            </div>
            <div class="horizontal">
                <oda-toggle ::toggled="domHost.table.pivotMode"></oda-toggle><label>Pivot mode</label>
            </div>
        </div>
        `,
        columns: [
            { name: 'name', treeMode: true },
            { name: 'fix', $hidden: true, $sortGroups: 1, __expanded__: true }
        ],
        $public: {
            allowCheck: 'double',
            allowDrag: true,
            allowDrop: true,
        },
        get dataSet() {
            return this.domHost.table.columns;
        },
        ready() {
            const fix = this.columns.find(c => c.name === 'fix')
            if (fix) {
                this.groups = [fix];
            }
        }
    })
}
const maxColsCount = 1024;
function modifyColumn(col) {
    if (col.isModified) return;
    col.isModified = true;
    col.$saveKey = (col.__parent__?.$saveKey ? col.__parent__?.$saveKey + '/' : '') + (col[this.columnId] || 'empty-name');
    const storage = this.storage;
    const table = this;
    col['#$width'] = col.$width;
    Object.defineProperty(col, '$width', {
        configurable: false,
        enumerable: false,
        set(v) {
            if (!v) return;
            const min = this.items?.filter(i => !i.$hidden).length ? 32 : 16;
            v = Math.round(v);
            if (v < min)
                v = min;
            if (this['$width'] === v)
                return;
            if (this.__expanded__ && col.items?.length) {
                let w = this.items?.filter(i => !i.$hidden).reduce((res, i) => {
                    i.__parent__ = i.__parent__ || col;
                    modifyColumn.call(table, i);
                    i.$width ??= v / this.items?.filter(i => !i.$hidden).length;
                    res += i.$width;
                    return res;
                }, 0)
                if (w && v != w) {
                    w /= v;
                    this.items?.filter(i => !i.$hidden).forEach(i => {
                        i.$width = i.$width / w;
                    })
                }
            }
            else {
                this['#$width'] = v;
                storage.setToItem(this.$saveKey, 'w', v);
            }
        },
        get() {
            if (this.width)
                return this.width;
            if (this.__expanded__ && this.items?.length) {
                if (this.$version !== storage.version)
                    this.$version = storage.version;
                const result = this.items?.filter(i => !i.$hidden).reduce((res, i) => {
                    i.__parent__ ??= this;
                    modifyColumn.call(table, i);
                    i.$width ??= this.items?.filter(i => !i.$hidden).length;
                    res += i.$width;
                    return res;
                }, 0)
                return result;
            }
            else {
                return this['#$width'] ??= storage.getFromItem(this.$saveKey, 'w');
            }
        }
    })
    const props = ['expanded', 'hidden', 'sort', 'order', 'filter'];
    for (let i of props)
        addSaveProp.call(col, i, storage);
    if (col.checked !== undefined)
        col['#checked'] = col.checked;
    Object.defineProperty(col, 'checked', {
        configurable: true,
        enumerable: true,
        set(v) {
            col.$hidden = (v === 'unchecked');
        },
        get() {
            return col.$hidden ? 'unchecked' : 'checked';
        }
    })
    Object.defineProperty(col, '$version', {
        configurable: true,
        enumerable: true,
        set(v) {
            clear()
            col['#$version'] = v
        },
        get() {
            return col['#$version'];
        }
    })
    col.reset = function (attr) {
        storage.setItem(col.$saveKey, undefined);
        clear(attr);
    }
    function clear(attr) {
        if (attr)
            col['#' + attr] = undefined;
        else {
            col['#$width'] = undefined;
            for (let i of props)
                col['#$' + i] = undefined;
        }
    }
    if (!col.__parent__)
        return;
    let parent = col.__parent__;
    let size = maxColsCount;
    while (parent) {
        size /= col.__parent__.items.length;
        parent = parent.__parent__;
    }
    const idx = col.__parent__.items.indexOf(col);
    const order = col.__parent__.$order;
    col.$order ??= order + Math.floor(size) * idx;
}
function addSaveProp(name, storage) {
    const key = name[0];
    name = '$' + name;
    if (this[name] !== undefined) return;
    const vname = '#' + name;
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
            if (this.$version !== storage.version)
                this.$version = storage.version;
            let result = this[vname];
            if (result === undefined)
                this[vname] = result = storage.getFromItem(this.$saveKey, key);
            return result;
        }
    })
}
const emptyRows = [];