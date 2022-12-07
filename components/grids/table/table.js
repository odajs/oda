ODA({is: "oda-table", imports: '@oda/button, @oda/checkbox, @oda/icon, @oda/splitter, @oda/menu',
    template: /*html*/`
        <style>
            :host {
                will-change: transform;
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
        <oda-table-body ::over-height ref="body" class="flex" :rows tabindex="0" :scroll-top="$scrollTop" :scroll-left="$scrollLeft" :even-odd :col-lines :row-lines></oda-table-body>
        <oda-table-footer :columns="rowColumns" ~show="showFooter" class="dark"></oda-table-footer>
    `,
    get visibleRows() {
        return [...this.fixedRows, ...this.raisedRows, ...this.rows];
    },
    hostAttributes: {
        tabindex: 0
    },
    overHeight: false,
    onDblClick(e) {
        const el = e.path.find(p => p.row);
        if (el)
            this.table.fire('row-dblclick', el.row);
    },
    async openSettings(e) {
        await ODA.import('@tools/containers');
        await ODA.showDropdown(
            'oda-table-settings',
            { table: this.table },
            { parent: e.target, intersect: true, align: 'left', title: 'Settings', hideCancelButton: true }
        );
    },
    get storage() {
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
    set focusedRow(n) {
        if (n) {
            this.debounce('focusedRow', () => {
                this.scrollToItem(n);
            })
        }
    },
    focusedCellEnd: {},
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
        const {col, item} = e.path.find(i=>{
            return i.col && i.item;
        })
        if (col.fix || col.$flex) return;
        if (this.focusedCell?.row === item && this.focusedCell?.col === col)
            return;
        this.focusedCell = {row: item, col };
    },
    get activeCols() {
        return this.rowColumns.filter(i => {
            return !i.fix && !i.treeMode && !i.$flex && !i.$hidden;
        }).sort((a, b) => {
            return a.$order > b.$order ? 1 : -1;
        })
    },
    get _fixWidth() {
        return this.headerColumns.filter(i => {
            return i.fix;
        }).reduce((res, i) => {
            return res += i.width || i.$width;
        }, 0)
    },


    movePointer(h = 0, v = 0) {
        this.interval('move', e => {
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
                if (!h)
                    return;
                this.focusedRow = this.focusedCell.row;
                this.selectedRows = [this.focusedRow];
            }
        }, 50)

    },
    props: {
        allowFocusCell:{
            default: 'none',
            list:['none', 'single', 'rows', 'cols', 'all']
        },
        allowFocusCellZone:{
            default: 'data',
            list:['data', 'tree', 'left', 'right'],
            multiselect: true
        },
        autoFixRows: false,
        noLazy: false,
        pivotMode: {
            default: false,
            save: true
        },
        rowFixLimit: {
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
        footerTemplate: {
            default: 'oda-table-footer-cell',
            category: 'templates'
        },
        groupTemplate: {
            default: 'oda-table-cell-group',
            category: 'templates'
        },
        headerTemplate: {
            default: 'oda-table-header-cell',
            category: 'templates'
        },
        cellTemplate: {
            default: 'oda-table-cell',
            category: 'templates'
        },
        evenOdd: {
            default: false,
            reflectToAttribute: true
        },
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
    },
    highlightedRow: Object,
    expandLevel: -1,
    expandAll: false,
    get size() {
        return this.items?.length || 0;
    },
    $width: 0,
    $height: 0,
    $scrollTop: 0,
    $scrollLeft: 0,
    $scrollWidth: 0,
    get $scrollHeight() {
        return (this.size + this.fixedRows.length) * this.rowHeight;
    },
    _selectedAll: false,

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
        const cols = this.columns.filter(i => !i.$hidden);
        if (!this.autoWidth)
            cols.push({ $flex: true, $order: 999 * maxColsCount, cellTemplate: 'div', headerTemplate: 'div', footerTemplate: 'div' });
        if (this.allowCheck !== 'none' && !this.columns.some(i => i.treeMode)) {
            cols.push({ width: 32, $order: -999 * maxColsCount, cellTemplate: 'oda-table-check', headerTemplate: 'div', fix: 'left' });
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
            return cols.filter(i => !i.$hidden).reduce((res, col) => {
                modifyColumn.call(this.table, col)
                if (col.$expanded && col.items?.length) {
                    const items = col.items.filter(i => !i.$hidden).map((c, i) => {
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
        if (!this.items?.length) return [];
        if (this.noLazy) return this.items;
        const rows = this.items.slice(this.screenFrom, this.screenFrom + this.screenLength + this.raisedRows.length);
        if (this.autoFixRows) {
            const raised = [];
            let top = rows[0];

            // Если hideTop не подниматься до самого верхнего $parent
            const getParent = (row) => {
                return this.hideTop && !row?.$parent?.$parent ? null : row?.$parent;
            }
            let $parent = getParent(top);
            while ($parent || top?.$expanded && top?.items?.length) {
                if (top?.$expanded && top?.items?.length) {
                    raised.add(top);
                    rows.shift();
                    top = rows[0];
                }
                else {
                    raised.unshift($parent)
                    if (raised && (rows[0]?.$parent === raised.at(-1))) {
                        rows.shift();
                        top = rows[0];
                    }
                    else {
                        raised.pop();
                    }
                    $parent = getParent($parent);
                }
            }
            this.raisedRows = raised;
        }
        else
            this.raisedRows ??= [];
        return rows;
    },
    selectedRows: [],
    fixedRows: [],
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
    get colStyles() {
        const result = this.rowColumns.map(col => {
            if (col.id === undefined)
                return '';
            let style = `.col-${col.id}{/*${col[this.columnId]}*/\n\t\n\torder: ${col.$order};`;
            if (col.$parent)
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
        arrowLeft(e) {
            e.preventDefault();
            this.movePointer(-1, 0)
        },
        arrowRight(e) {
            e.preventDefault();
            this.movePointer(1, 0)
        },
        arrowUp(e) {
            e.preventDefault();
            this.movePointer(0, -1)
        },
        arrowDown(e) {
            e.preventDefault();
            this.movePointer(0, 1)
        },
        pageUp(e) {
            e.preventDefault();
            this.movePointer(0, -this.screenLength);
        },
        pageDown(e) {
            e.preventDefault();
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
            if (this.focusedCell){
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
        if (!item || item.disabled) return;

        if (this.allowFocus && item && !item.$group && (item.$allowFocus !== false)) {
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
        // this.render();
    },
    scrollToItem(item) {
        return //todo
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

    // _onRowContextMenu(e) {
    //     const el = e.path.find(p => p.row);
    //     if (el)
    //         this.fire('row-contextmenu', el.row);
    // },
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
        .panel {
            margin: 2px;
            min-width: 50%;
        }
        label {
            @apply --flex;
            @apply --disabled
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
                <div class="item shadow content no-flex horizontal" ~for="column in groups">
                    <label class="label flex" ~text="column.$saveKey || column.label"></label>
                    <oda-icon class="closer" icon="icons:close" :icon-size @tap="_close" :column></oda-icon>
                </div>
            </div>
        </div>
    </div>
    <div ~show="pivotMode" class="horizontal border flex panel">
        <oda-icon disabled :icon-size icon="icons:dns:90"></oda-icon>
        <div class="flex horizontal">
            <label ~if="!pivotLabels.length">Drag here to set column labels</label>
            <div class="no-flex horizontal">
                <div class="item shadow content no-flex horizontal" ~for="column in pivotLabels">
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

// ODA({is: 'oda-table-settings', imports: '@oda/button',
//     template: /*html*/`
//     <style>
//         :host > div {
//             overflow: auto;
//             right: 0;
//             top:0;
//             position: absolute;
//             z-index: 10;
//             /*min-width: 280px;*/
//             width: {{width}}px;
//             height: 100%;
//             @apply --shadow;
//         }
//     </style>
//     <oda-button title="Settings" icon="icons:settings" @tap="_tap"></oda-button>
//     <div ~if="opened" class="vertical flex content">
//         <oda-table-hide-column></oda-table-hide-column>
//     </div>
//     `,
//     props: {
//         opened: {
//             type: Boolean,
//             reflectToAttribute: true,
//             value: false,
//         }
//     },
//     attached() {
//         this.listen('mousedown', '_leave', { target: window });
//         // this.listen('dragend', 'onDragEnd', { target: window });
//     },
//     _tap(e) {
//         this.opened = !this.opened;
//     },
//     _leave(e) {
//         if (e.path.includes(this)) {
//             e.stopPropagation();
//         } else {
//             this.opened = false;
//         }
//     },
//     detached() {
//         this.unlisten('mousedown', '_leave', { target: window });
//         // this.unlisten('dragend', 'onDragEnd', { target: window });
//     }
// });

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
    template: /*html*/`
    <style>
        :host {
            position: relative;
            border-color: white;
            @apply --horizontal;
            @apply --dark;
            margin: 1px 0px;
            z-index: 1;
        }
    </style>
    <div :scroll-left="$scrollLeft" class="horizontal flex" style="overflow-x: hidden;" ~style="{maxWidth: this.autoWidth?'100%':'auto'}">
        <div ~for="col in columns" ~is="getTemplate(col)" :item="getItem(col)"   :column="col"  ~class="['col-' + col.id, col.$flex?'flex':'auto']"></div>
    </div>
    <div ~if="$scrollHeight > $height" class="no-flex" style="overflow-y: scroll; visibility: hidden;"></div>
    `,
    getItem(col) {
        return col;
    },
    getTemplate(col) {
        return 'div'
    },
    columns: [],
})

ODA({is:'oda-table-header', extends: 'oda-table-cols',
    template: /*html*/`
    <oda-button ~if="allowSettings" style="position: absolute; top: 0px; right: 0px; z-index: 1;" icon="icons:settings" @tap.stop="openSettings"></oda-button>
    `,
    getTemplate(col) {
        return col.headerTemplate || this.headerTemplate
    }
})

ODA({is:'oda-table-footer', extends: 'oda-table-cols',
    getItem(col) {
        return this.footer;
    },
    getTemplate(col) {
        return col.footeTemplate || 'oda-table-footer-cell'
    }
})

ODA({is:'oda-table-body', extends: 'oda-table-part',
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
            max-height: {{autoRowHeight ? '' : rowHeight + 'px'}};
            @apply --no-flex;
            @apply --horizontal;
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
    <div class="no-flex  vertical" ~style="{maxHeight: $scrollHeight+'px', minHeight: $scrollHeight+'px'}">
        <div class="sticky" style="top: 0px; min-height: 1px; min-width: 100%;" @dblclick="onDblClick"  @pointerup="onTapRows" @pointerdown="focusCell($event)" @contextmenu="_onRowContextMenu" @dragleave="table._onDragLeave($event, $detail)" @dragover="table._onDragOver($event, $detail)"  @drop="table._onDrop($event, $detail)">
            <div ~for="(row, r) in visibleRows" class="row"  :row
                ~class="{'group-row':row.$group}"
                :drop-mode="row.$dropMode"
                :dragging="draggedRows.includes(row)"
                @dragstart="table._onDragStart($event, $detail)"
                :focused="allowFocus && isFocusedRow(row)"
                :highlighted="allowHighlight && isHighlightedRow(row)"
                :selected="allowSelection !== 'none' && isSelectedRow(row)">
                <div :focus="_getFocus(col, row)" @pointerenter="focusedMove"  :draggable="getDraggable(row, col)"    :item="row" class="cell" ~for="(col, c) in row.$group ? [row] : rowColumns" :role="row.$role" :fix="col.fix" ~props="col?.props" :col  ~class="[row.$group ? 'flex' : 'col-' + col.id, col.$flex ? 'flex':'no-flex']">
                    <div class="flex" ~class="{'group' : row.$group}" ~is="_getTemplateTag(row, col)"  :column="col" class="cell-content" :item="row" ></div>
                </div>
            </div>
        </div>
    </div>
    <div class="flex content empty-space" @drop.stop.prevent="table._onDropToEmptySpace($event, $detail)" @dragover.stop.prevent="table._onDragOverToEmptySpace($event, $detail)" @down="table._onDownToEmptySpace($event, $detail)"></div>
    `,
    focusedMove(e){
        if (e.buttons !== 1) return;
        this.focusedCellEnd = {row: e.target.row, col: e.target.col}
    },
    _onRowContextMenu(e) {
        const el = e.path.find(p => p.row);
        if (el)
            this.table.fire('row-contextmenu', el.row);
    },
    _getFocus(col, row) {
        this.focusedCellEnd = {};
        return this._cellSelection.rows.indexOf(row)>-1 && this._cellSelection.cols.indexOf(col)>-1;
    },
    get _cellSelection(){
        const selection = {rows: [], cols:[]};
        if (this.focusedCell?.row){
            let idx1 = this.items.indexOf(this.focusedCell.row);
            let idx2 = this.items.indexOf(this.focusedCellEnd?.row || this.focusedCell.row);
            let sign = Math.sign(idx2 - idx1) || 1;
            for (let i = idx1; i<=idx2 * sign; i+=sign){
                selection.rows.push(this.items[i]);
            }

            idx1 = this.rowColumns.indexOf(this.focusedCell.col);
            idx2 = this.rowColumns.indexOf(this.focusedCellEnd?.col || this.focusedCell.col);
            sign = Math.sign(idx2 - idx1) || 1;
            for (let i = idx1; i<=idx2 * sign; i+=sign){
                selection.cols.push(this.rowColumns[i]);
            }
        }


        return selection;
    },
    firstTop: 0,

    setScreen() {
        if (this.fix) return;

        this.$height = this.offsetHeight;
        this.$width = this.offsetWidth;
        this.overHeight = this.offsetHeight < this.scrollHeight;
        this.firstTop = Math.floor(this.$scrollTop / this.rowHeight) * this.rowHeight;
        this.$scrollWidth = this.scrollWidth;
        this.$scrollTop = this.scrollTop;
        this.$scrollLeft = this.scrollLeft;
    },
    overHeight: false,
    listeners: {
        resize(e) {
            this.setScreen();
        },
        scroll(e) {
            this.setScreen();
        },
        mousewheel(e) {
            if (e.ctrlKey || e.altKey) return;

            if (!e.shiftKey) {
                if (Math.round(this.offsetHeight) === Math.round(this.scrollHeight))
                    return;
                let y = Math.round(this.scrollTop) + e.deltaY;
                if (y < 0)
                    y = 0;
                this.$scrollTop = y;
                if (Math.round(this.scrollTop) !== Math.round(this.$scrollTop)){
                    this.scrollTop = this.$scrollTop;
                    e.preventDefault();
                }

            }
            else {
                if (Math.round(this.offsetWidth) === Math.round(this.scrollWidth))
                    return;
                let x = Math.round(this.scrollLeft) + e.deltaY;
                if (x < 0)
                    x = 0;
                this.$scrollLeft = x;
                if (Math.round(this.scrollLeft) !== Math.round(this.$scrollLeft)){
                    this.scrollLeft = this.$scrollLeft;
                    e.preventDefault();
                }

            }
        }
    },
    _getTemplateTag(row, col) {
        if (row.$group)
            return this.groupTemplate;
        if (col.treeMode)
            return 'oda-table-cell-tree';
        let template = row.templates?.[col] || col.cellTemplate || this.cellTemplate;
        if (typeof template === 'object')
            return template.tag || template.is || template.template;
        return template;
    },
    getDraggable(row, col) {
        return (col.treeMode && this.allowDrag && !this.compact && !row.$group && row.drag !== false) ? 'true' : false;
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
        label {
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
    ODA({is: 'oda-table-cell-base',
        template: /*html*/`
        <style>
            :host {
                will-change: transform;
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
        get fix() {
            return this.column?.fix;
        }
    });

    ODA({is: 'oda-table-cell', extends: 'oda-table-cell-base',
        template: /*html*/`
        <label class="flex" ~is="template" :column :item style="overflow: hidden">{{value}}</label>`,
        props: {
            template: 'label',
            value() {
                return getRowCellValue(this.item, this.column);
            }
        }
    });

    ODA({is: 'oda-table-expand', imports: '@oda/icon', extends: 'oda-table-cell-base',
        template: /*html*/`
            <oda-icon ~if="item?.$level !== -1" style="cursor: pointer" :icon :icon-size
                @dblclick.stop.prevent
                @down.stop.prevent
                @pointerdown.stop.prevent
                @pointerup.stop.prevent
                @tap.stop.prevent="_toggleExpand"
                class="no-flex expander" ~style="_style"></oda-icon>
        `,
        get _style(){
            return {opacity: (!this.icon)?0:(this.item?.disabled?.5:1)}
        },
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
                    this.fire('expand-changed', this.item.$expanded);
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
                    /*background-color: {{color || 'unset'}} !important;*/
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
                   bottom: -1px;
                   font-size: xx-small;
                   font-weight: bold;
                   background-color: transparent !important;
                   right: 0px;
                   left: 0px;
                   text-align: right;
                }
                /*:host([scrolled-children]){*/
                /*    @apply --dark;*/
                /*}         */
            </style>
            <div class="step no-flex" ~style="myStyle">
                <div class="end-step" ~style="endStepStyle"></div>
            </div>
            <oda-table-expand  class="no-flex" :item :scrolled-children></oda-table-expand>
            <oda-table-check class="no-flex" ~if="_showCheckBox" :column="column" :item="item"></oda-table-check>
            <div ::color  ~is="item?.[column[columnId]+'.template'] || item?.template || column?.cellTemplate || cellTemplate || 'label'" :column :item class="flex" @tap="_tap">{{item[column[columnId]]}}</div>`,
            columnId: '',
            props: {
                scrolledChildren: {
                    get() {
                        let idx = this.raisedRows.indexOf(this.item);
                        if (idx > -1) {
                            let next = this.raisedRows[idx + 1] || this.rows[0];
                            let counter = 0;
                            for (let i = 0; i < this.item?.items?.length || 0; i++) {
                                if (this.item?.items[i] === next)
                                    break;
                                counter++;
                            }
                            return counter || '';
                        }
                    },
                    reflectToAttribute: true
                },
            },
            get level() {
                return this.item?.$level;
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
                if (this.item.disabled) this.item.$expanded = !this.item.$expanded
                else this.item.$expanded = true
            }
        });


        ODA({is: 'oda-table-check', imports: '@oda/icon', extends: 'oda-table-cell-base',
            template: /*html*/`
            <oda-icon class="no-flex" @down.stop.prevent="_toggleChecked" @tap.stop.prevent :icon :icon-size ~style="{padding: Math.round(iconSize*.2)+'px'}"></oda-icon>`,
            props: {
                icon() {
                    if (this.item?.checked === true || this.item?.checked === 'checked')
                        return this.iconChecked;
                    if (!this.item?.checked || this.item?.checked === 'unchecked')
                        return this.iconUnchecked;
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
        <label class="label flex" ~text="item.error"></label>`
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
                width: {{column.$width}}px;
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
                @apply --horizontal
                padding: 2px;
                align-items: center;
                max-height: {{iconSize * .7}}px;
                min-height: {{iconSize * .7}}px;
            }
            label {
                text-align: center;
                margin: 4px 0px;
                text-overflow: ellipsis;
                white-space:break-spaces !important;
            }
        </style>
        <div class="flex vertical" style="cursor: pointer"  :disabled="!column.name">
            <div @tap.stop="setSort" class="flex horizontal"  ~style="{flexDirection: column.fix === 'right'?'row-reverse':'row', minHeight: rowHeight+'px', height: column?.$expanded?'auto':'100%'}">
                <div class="flex horizontal" style="align-items: center;">
                    <oda-table-expand ~if="column?.items?.length" :item class="no-flex"></oda-table-expand>
                    <label class="label flex" :title="column.label || column.name" ~text="column.label || column.name" draggable="true" @dragover="_dragover" @dragstart="_dragstart" @dragend="_dragend" @drop="_drop"></label>
                    <oda-icon :disabled="column?.$expanded && column?.items?.length" style="position: absolute; right: 0px; top: 0px;" ~if="allowSort && sortIndex" title="sort" :icon="sortIcon" :bubble="sortIndex"></oda-icon>
                </div>
                <slot name="tools"></slot>
                <div @dblclick="column.reset('$width')" class="split"  @tap.stop @track="_track"></div>
            </div>
            <div class="flex info horizontal filter-container" ~if="!column.$expanded && column.name && showFilter" style="align-items: center" @tap.stop>
                <input class="flex filter-input" ::value="filter" @tap.stop>
                <oda-button ~if="!filter" :icon-size="Math.round(iconSize * .3)+2" @tap.stop="showDD" icon="icons:filter" title="filter"></oda-button>
                <oda-button ~if="filter"  :icon-size="Math.round(iconSize * .5)+2" icon="icons:close" @tap.stop="filter = ''" title="clear"></oda-button>
            </div>
            <div class="flex sub-cols horizontal" ~if="expanded && column?.items?.length">
                <oda-table-header-cell  class="header-cell flex" ~for="col in subCols" :item="col" :column="col"  ref="subColumn"  ~class="['col-' + col.id]"></oda-table-header-cell>
            </div>
            <div class="flex" ~if="!column.name"></div>
        </div>`,
        get expanded() {
            return this.column.$expanded;
        },
        get subCols() {
            return this.column?.items?.map(i => {
                i.$parent ??= this.column;
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
        listeners: {
            contextmenu: '_menu',
            resize(e) {
                if (!this.active || !this.column || this.column.$expanded || this.column.$flex) return;
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
            const res = await ODA.showDropdown('oda-menu', { parent: this, iconSize: this.iconSize, items: menu, title: 'Column menu', allowClose: true });
            res?.focusedItem.execute();
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
                value: i.$expanded // todo: нужно возвращать undefined для expandAll
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
        if ((i.$expanded === undefined && (this.expandAll || (this.expandLevel >= i.$level))) || (level < 0 && !i.$expanded))
            i.$expanded = true;
        if (i.$expanded) {
            if (i.items?.length)
                res.push(...extract.call(this, i.items, level + 1, i));
            else
                i.items = undefined;
            this.expand(i);
        }
        return res;
    }, []);
}
settings:{
    ODA({is:'oda-table-settings', imports: '@tools/property-grid, @oda/tree, @oda/splitter',
        template: /*html*/`
        <style>
            :host {
                @apply --horizontal;
                width: {{width}}px;
                @apply --flex;
                min-height: 100vh;
                min-width: 200px;
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
        <oda-splitter></oda-splitter>
        <div @resize="width = this.offsetWidth" class="content flex vertical" style="overflow: hidden;">
            <oda-table-columns-tree class="border" ~show="focusedTab === 0"></oda-table-columns-tree>
            <oda-property-grid class="flex" ~if="focusedTab === 2" only-save :inspected-object="table"></oda-property-grid>
        </div>
        <div style="writing-mode: vertical-lr;" class="horizontal header">
            <div :focused="focusedTab === index" @tap="focusedTab = index" ~for="tabs"><oda-icon :icon="item.icon" :title="item.title"></oda-icon>{{item.title}}</div>
        </div>
        `,
        focusedTab: 0,
        tabs: [
            { icon: 'icons:tree-structure:90', title: 'columns' },
            { icon: 'icons:filter:90', title: 'filters' },
            { icon: 'icons:settings:90', title: 'properties' },
        ],
        props: {
            width: {
                default: 300,
                save: true,
            }
        },
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
            { name: 'fix', $hidden: true, $sortGroups: 1, $expanded: true }
        ],
        props: {
            allowCheck: 'double',
            allowDrag: true,
            allowDrop: true,
        },
        get dataSet() {
            return this.domHost.table.columns;
        },
        ready() {
            this.groups = [this.columns.find(c => c.name === 'fix')];
        }
    })
}
const maxColsCount = 1024;
function modifyColumn(col) {
    if (col.isModified) return;
    col.isModified = true;
    col.$saveKey = (col.$parent?.$saveKey ? col.$parent?.$saveKey + '/' : '') + (col[this.columnId] || 'empty-name');
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
            if (this.$expanded && col.items?.length) {
                let w = this.items?.filter(i => !i.$hidden).reduce((res, i) => {
                    i.$parent = i.$parent || col;
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
            if (this.$expanded && this.items?.length) {
                if (this.$version !== storage.version)
                    this.$version = storage.version;
                const result = this.items?.filter(i => !i.$hidden).reduce((res, i) => {
                    i.$parent ??= this;
                    modifyColumn.call(table, i);
                    i.$width ??= v / this.items?.filter(i => !i.$hidden).length;
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
            col.$hidden = !v;
        },
        get() {
            return !col.$hidden;
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
    if (!col.$parent)
        return;
    let parent = col.$parent;
    let size = maxColsCount;
    while (parent) {
        size /= col.$parent.items.length;
        parent = parent.$parent;
    }
    const idx = col.$parent.items.indexOf(col);
    const order = col.$parent.$order;
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
function getRowCellValue(row, col) {
    let path = col?.$saveKey || col;
    if (!path) return '';
    path = path.split('/');
    while (row && path.length > 1) {
        let key = '$' + path.shift();
        row = row[key];
        if (Array.isArray(row))
            row = row[0];
    }
    return row?.[path.shift()]
}