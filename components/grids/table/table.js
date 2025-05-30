const PROP_PREFIX = 'table-prop:';
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
        <oda-table-body
            class="flex"
            ::over-height
            :rows
            tabindex="0"
            :scroll-top="$scrollTop"
            :scroll-left="$scrollLeft"
            :even-odd
            :col-lines
            :row-lines
        ></oda-table-body>
        <oda-table-footer :columns="rowColumns" ~if="showFooter" class="dark"></oda-table-footer>
    `,
    hostAttributes: {
        tabindex: 0
    },
    onTapEditMode: {
        $pdp: true,
        $def: false,
    },
    overHeight: false,
    /**
     * @type {Table["onDblclick"]}
     * @this {Table}
     */
    onDblclick(e) {
        const el = e.path.find(p => p.row);
        if (el) {
            this.table.fire('cell-dblclick', el.row);
        }
    },
    /**
     * @type {Table["arrowLeft"]}
     * @this {Table}
     */
    arrowLeft(e) {
        this.body.$keys.arrowLeft(e);
    },
    /**
     * @type {Table["arrowRight"]}
     * @this {Table}
     */
    arrowRight(e) {
        this.body.$keys.arrowRight(e);
    },
    /**
     * @type {Table["arrowUp"]}
     * @this {Table}
     */
    arrowUp(e) {
        this.body.$keys.arrowUp(e);
    },
    /**
     * @type {Table["arrowDown"]}
     * @this {Table}
     */
    arrowDown(e) {
        this.body.$keys.arrowDown(e);
    },
    /**
     * @type {Table["home"]}
     * @this {Table}
     */
    home(e) {
        this.body.$keys.home(e);
    },
    /**
     * @type {Table["end"]}
     * @this {Table}
     */
    end(e) {
        this.body.$keys.end(e);
    },
    /**
     * @type {Table["pageUp"]}
     * @this {Table}
     */
    pageUp(e) {
        this.body.$keys.pageUp(e);
    },
    /**
     * @type {Table["pageDown"]}
     * @this {Table}
     */
    pageDown(e) {
        this.body.$keys.pageDown(e);
    },
    /**
     * @type {Table["enter"]}
     * @this {Table}
     */
    enter(e) {
        this.body.$keys.enter(e);
    },
    // async openSettings(parent) {
    //     this.showSettings = !this.showSettings;
    //     // await ODA.import('@tools/containers');
    //     // await ODA.showDropdown(
    //     //     'oda-table-settings',
    //     //     { table: this.table },
    //     //     { parent, align: 'left', minHeight: '100%', title: 'Settings', hideCancelButton: true }
    //     // );
    // },
    /** @this {Table} */
    get storage() {
        return ODA.LocalStorage.create(this.$savePath);
    },
    screenLength: {
        $pdp: true,
        /** @this {Table} */
        get() {
            return (Math.round(this.$height / this.rowHeight) || 0) + 1;
        },
    },
    columns: [],
    dataSet: [],
    focusedCellEnd: {},
    /** @this {Table} */
    get _fixWidth() {
        return this.headerColumns.filter(i => {
            return i.fix;
        }).reduce((res, i) => {
            return res += i.width || i.$width;
        }, 0);
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
        showSettings: false,
        selectByCheck: false,
        allowFocusCell: true,
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
        size: {
            $type: Number,
            get() {
                return this.items?.length || 0;
            }
        },
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
        iconUnchecked: 'icons:check-box-outline-blank',
        iconCollapsed: 'icons:chevron-right',
        iconExpanded: 'icons:chevron-right:90',
        iconExpanding: 'odant:spin',
        iconIntermediate: 'icons:check-box-indeterminate',
        iconSize: 24,
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
        get scrollBoxWidth() {
            const div = document.createElement('div');
            div.style.setProperty('overflow-y', 'scroll');
            div.style.setProperty('overflow-x', 'hidden');
            div.style.setProperty('min-height', '1px');
            div.style.setProperty('position', 'fixed');
            div.style.setProperty('visibility', 'hidden');
            document.body.appendChild(div);
            requestAnimationFrame(() => {
                div.remove();
            });
            return div.offsetWidth;
        },
        activeCell: null,
        fillingNewLineMode: false,
        /** @this {Table} */
        get screenFrom() {
            return Math.round(this.$scrollTop / this.rowHeight);
        },
    },
    pointerRow: Object,
    expandLevel: -1,
    expandAll: false,
    filter: {
        $def: '',
        $public: true
    },

    $pdp: {
        /**
         * @this {Table}
         * @param {TableCellInfo} v
        */
        set focusedCell(v) {
            if (!v || v.column.$flex || !this.body) return;

            const elem = this.body.findCellByCoordinates(v);

            if (!v.column.fix) {
                const { left: leftFixColsWidth, right: rightFixColsWidth } = this.activeCols
                    .reduce((res, c) => (res[c.fix] += c.$width, res), { left: 0, right: 0 });

                const bodyRect = this.body.getBoundingClientRect();
                const cellRect = elem.getBoundingClientRect();

                if (cellRect.x + cellRect.width - bodyRect.x > bodyRect.width - rightFixColsWidth) {
                    this.body.scrollLeft += (cellRect.x + cellRect.width + rightFixColsWidth) - bodyRect.width;
                }
                else if (cellRect.x - bodyRect.x < leftFixColsWidth) {
                    this.body.scrollLeft -= leftFixColsWidth - (cellRect.x - bodyRect.x);
                }

            }

            const rowIndex = this.rows.findIndex(r => this.compareRows(r, v.row));
            if ((rowIndex + .8) * this.rowHeight > this.$height) {
                this.$scrollTop += this.rowHeight;
            }

            if (this.activeCell) {
                this.activateCell(elem);
            }
        },
        /**@this {Table} */
        focusCell(row, column) {
            if (!row || !column || column.$flex) return;

            if (this.compareRows(this.focusedCell?.row, row) && this.focusedCell?.column === column) return;

            if (this.focusedCell && (!this.compareRows(this.focusedCell.row, row) || column === this.activeCols.at(-1)) && this.activeCell && this.fillingNewLineMode) {
                this.fillingNewLineMode = false;
            }

            this.focusedCell = { row, column };
        },
        get activeCols() {
            return this.rowColumns.filter(i => {
                return !i.$flex && !i.$hidden;
            }).sort((a, b) => a.$order - b.$order);
        },
        set focusedRow(n) {
            if (n) {
                this.debounce('focusedRow', () => {
                    this.scrollToRow(n);
                });
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
            // set(n) {
            //     this.$scrollTop = Math.ceil(n / this.rowHeight) * this.rowHeight;
            // }
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
                };
                let __parent__ = getParent(top);
                while (__parent__ || top?.__expanded__ && top?.items?.length) {
                    if (top?.__expanded__ && top?.items?.length) {
                        raised.add(top);
                        rows.shift();
                        top = rows[0];
                    }
                    else {
                        raised.unshift(__parent__);
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
            }, 100);
        },
        disableColumnsSave: false,
        fixedRows: [],
        modifyColumn(col) {
            if (!this.disableColumnsSave)
                modifyColumn(this.table, col);
        },
        get rowColumns() {
            const convert = (cols) => {
                return cols.filter(i => !i.$hidden).reduce((res, col) => {
                    this.modifyColumn(col);
                    if (col.__expanded__ && col.items?.length) {
                        const items = col.items.filter(i => !i.$hidden).map((c, i) => {
                            c.id = `${col.id}-${i}`;
                            c.__parent__ ??= col;
                            return c;
                        });
                        res.push(...convert(items));
                    } else {
                        res.push(col);
                    }
                    return res;
                }, []);
            };
            return convert(this.headerColumns);
        },
        get sorts() {
            const find_sorts = (col = []) => {
                this.modifyColumn(col);
                return col.reduce((res, i) => {
                    res.add(i);
                    let items = i.items;
                    if (items) {
                        if (items?.then) {
                            items?.then(r => {
                                if (r?.length)
                                    res.add(...r);
                            });
                        }
                        else {
                            items = find_sorts(items);
                            res.add(...items);
                        }
                    }
                    return res;
                }, []);
            };
            let result = find_sorts(this.columns);
            result = result.filter(i => {
                return i.$sort;
            });
            return result.sort((a, b) => {
                return Math.abs(a.$sort) > Math.abs(b.$sort) ? 1 : -1;
            });
        },
        groupColPaths: {
            $def: [],
            $save: true
        },
        get groups() {
            if (!this.columns?.length) return [];

            const getColByPath = (columns, path) => {
                const steps = path.split('/');
                const step = steps.pop();
                const col = columns.find(c => c.name === step);
                if (col) {
                    if (steps.length) {
                        return getColByPath(col.items, steps.join('/'));
                    }
                    return col;
                }
            };
            return this.groupColPaths.map(p => getColByPath(this.columns, p)).filter(Boolean);
        },
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
            return array;
        },
        get filteredItems() {
            if (this.items?.length) {
                const items = [...this.items];
                this._useColumnFilters(items);
                this._applyFilter(items);
                return items;
            }
            return emptyRows;
        },
        get groupedItems() {
            if (this.filteredItems?.length) {
                const array = [...this.filteredItems];
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
                    return [...this.groupedItems];
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
                                    d = `${d.toLocaleString()}  [ ${(this.screenFrom).toLocaleString()} ... ${to.toLocaleString()} ]`;
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
            this.modifyColumn(col);
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

        cols.filter(i => i.fix === 'right').toReversed().reduce((res, i) => {
            i.right = res;
            res += i.width ?? i.$width ?? 0;
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
                col.className = `col-${col.id}`;
                let style = `.${col.className}{/*${col[this.columnId]}*/\n\t\n\torder: ${col.$order};`;
                if (col.__parent__)
                    style += '\n\tbackground-color: whitesmoke;';
                if (col.$flex)
                    style += '\n\tflex: 1;\n\tflex-basis: "100%";';
                else {
                    style += '\n\tposition: sticky;';
                    if (col.width) {
                        style += `\n\tmin-width: ${col.width}px; \n\tmax-width: ${col.width}px;\n\tflex: 0;`;
                    }
                    else {
                        if (this.autoWidth && this.rowColumns.last === col)
                            style += `\n\tflex: 1 !important;`;
                        style += `\n\tmin-width: 16px;`;
                    }
                    col.$width = col.$width || col.width || 150;
                    style += `\n\twidth: ${col.$width}px;`;


                    const min = (this.autoWidth && !col.fix) ? '10px' : (col.width + 'px');
                    const max = col.$width + 'px';
                    if (col.fix) {
                        style += `\n\tz-index: 1;`;
                        if (col.fix === 'left') {
                            style += `\n\tleft: ${col.left}px;`;
                        }
                        else if (col.fix === 'right') {
                            style += `\n\tright: ${col.right}px;`;
                        }
                    }
                }
                style += '\n}\n';
                return style;
            }).join('\n');
            return result;
        }
    },

    focus() { this.body.focus?.(); },
    $listeners: {
        dragend: 'onDragEnd',
        // dragleave: 'onDragEnd',
    },
    /**
     * @type {Table["onTapRows"]}
     * @this {Table}
     * */
    onTapRows(e) {
        if (e.button) return;
        const evt = e.sourceEvent || e;
        if (evt.which !== 1) return;
        this.onSelectRow(evt);
    },
    /**@type {Table["expand"]}*/
    expand(row, force, old) {
        const items = this._beforeExpand(row, force);
        if (items?.then) {
            const id = setTimeout(() => {
                row.$loading = true;
                this.$render();
            });
            return items.then(async items => {
                clearTimeout(id);
                row.$loading = false;
                if (this.sorts.length)
                    this._sort(items);
                const node = old || row;
                if ((node.items && node.__expanded__)) {
                    for (const i in items) {
                        const n = items[i];
                        const o = (this.idName ? node.items.find(i => i[this.idName] === n[this.idName]) : node.items[i]) || node.items[i];
                        n.__expanded__ = !!o?.__expanded__;
                        if (n.__expanded__) {
                            this.expand(n, false, o);
                        }
                    }
                }
                if (items?.length) {
                    row.items = items;
                }
                else if (row.items?.length > 0) {
                    items = row.items = [];
                }
                else {
                    items = row.items;
                }
                return items;
            }).catch((err) => {
                clearTimeout(id);
                row.$loading = false;
            });
        }
        row.items = items;
        return items;
    },
    _beforeExpand(item) {
        return item.items;
    },
    _checkChildren(node) {
        const items = this._beforeExpand(node);
        if (items?.then) {
            return items.then(res => (res?.length > 0));
        }
        return (items?.length > 0);
    },
    _useColumnFilters(array) {
        this.filters?.forEach(col => {
            const name = col[this.columnId];
            let filter = String(col.$filter).toLowerCase().replace('&&', '&').replace('||', '|');
            filter = filter.replaceAll(' and ', '&').replaceAll('&&', '&').replaceAll(' or ', '|').replaceAll('||', '|');
            filter = filter.split('&').reduce((res, and) => {
                const or = and.split('|').reduce((res, or) => {
                    const space = or.split(' ').reduce((res, space) => {
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
            const func = new Function('val', `return (${filter})`);

            // array.splice(0, array.length, ...array.filter(item => { return func(item[name]) }));
            array.splice(0, array.length, ...array.filter(item => {
                return (func(item[name]) || item.items?.find(subItem => {
                    return func(subItem[name]);
                }));
            }));
        });
    },
    /**
     * @param {TableRow[]} items
     * @this {Table}
     */
    _applyFilter(items) {
        if (!this.filter) return;
        try {
            const filter = new RegExp(this.filter);
            items.splice(0, items.length, ...items.filter(item => {
                return this.rowColumns.some(col => {
                    const name = col[this.columnId];
                    return (filter.test(item[name]) || item.items?.find(subItem => {
                        return filter.test(subItem[name]);
                    }));
                })
            }));
        }
        catch (err) {
            console.warn(err);
        }
    },
    _groups: [],
    _group(array) {
        const grouping = (items, __level__ = 0, __parent__) => {
            const column = this.groups[__level__];
            const name = column[this.columnId];
            const label = column.label;

            const oldGroups = [...(__parent__ || this)._groups];

            const groups = (__parent__ || this)._groups;

            groups.splice(0, groups.length);


            const result = items.reduce((res, i) => {
                if (!i.__group__ && i.__level__ !== 0) return res;
                const value = i[name];
                let group = res.find(r => r.value === value);
                if (!group) {
                    group = oldGroups.find(r => r.value === value);
                    if (group) {
                        group.items = [];
                        groups.push(group);
                        res.push(group);
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
                    };
                    groups.push(group);
                    res.push(group);
                }
                i.__parent__ = group;
                group.items.push(i);
                return res;
            }, []);
            // if (newGroups.length > 0) {
            //     groups.splice(0, groups.length, ...newGroups)
            // }

            if (this.groups[0].$sortGroups) {
                this._sortGroups(result, this.groups[0].$sortGroups);
            }
            if (__level__ < this.groups.length - 1) {
                for (const group of groups) {
                    group.items = grouping(group.items, __level__ + 1, group);
                }
            }
            for (let i = 0; i < groups.length; i++) {
                if ([true, false].includes(groups[i].__expanded__)) {
                    continue;
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
            return result;
        };
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
        };
        let result = grouping(array);
        result = expanding(result);
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
    /**
     * @type {Table["onfocusRow"]}
     * @this {Table}
     */
    onfocusRow(e, d) {
        if (e.ctrlKey || e.shiftKey) return;

        const row = d?.value || e?.target?.item || d.value;
        if (!row) return;

        this.focusRow(row);
    },
    /**
     * @type {Table["focusRow"]}
     * @this {Table}
     */
    focusRow(row) {
        if (this.allowFocus && row && !row.__group__ && (!row.disabled && row.$allowFocus !== false)) {
            this.focusedRow = row;
        }
        if (row.disabled) {
            row.__expanded__ = !row.__expanded__;
            this.table.expand(row);
        }
    },
    /**
     * @type {Table["onSelectRow"]}
     * @this {Table}
     */
    onSelectRow(e, d) {
        const row = d?.value || e.target.item;
        if (!row) return;

        this.selectRow(row, { range: e.shiftKey, add: e.ctrlKey });
    },
    /**
     * @type {Table["selectRow"]}
     * @this {Table}
     */
    selectRow(row, { range = false, add = false } = {}) {
        if (this.allowSelection === 'none') {
            this.focusRow(row);
            return;
        }

        if (this.selectByCheck) {
            if (!row.disabled) {
                if (this.selectedRows.includes(row)) {
                    const idx = this.selectedRows.indexOf(row);
                    this.selectedRows.splice(idx, 1);
                } else {
                    this.selectedRows.push(row);
                }
                this.selectedRows = [...this.selectedRows];
            }
            return;
        }

        if (!~this.selectionStartIndex) {
            this.selectionStartIndex = this.getRowIndex(this.selectedRows[0] || row);
        }

        if (range) {
            let from = this.selectionStartIndex;
            const to = this.getRowIndex(row);
            this.clearSelection();
            if (from <= to) {
                while (from <= to) {
                    this.addSelection(this.rows[from]);
                    from++;
                }
            } else {
                while (from >= to) {
                    this.addSelection(this.rows[from]);
                    from--;
                }
            }
            return;
        }

        if (add) {
            this._selectedAll = false;
            const idx = this.selectedRows.indexOf(row);
            if (idx < 0)
                this.addSelection(row);
            else {
                this.selectedRows.splice(idx, 1);
                // this.fire('selected-rows-changed', this.selectedRows);
                if (row === this.selectionStartRow) {
                    this.selectionStartRow = this.selectedRows[0] || null;
                }
                this.selectedRows = [...this.selectedRows];
            }
            return;
        }

        if (row.disabled) {
            return;
        }
        this.focusRow(row);
        this.selectionStartIndex = -1;
        this.selectedRows.clear();
        this.addSelection(row);

    },
    /**
     * @type {Table["moveCellPointer"]}
     * @this {Table}
     */
    moveCellPointer(h = 0, v = 0) {
        if (!this.allowFocusCell) return;

        const maxRowIndex = Math.min(this.visibleRows.length, Math.trunc(this.$height/this.rowHeight));

        if (!this.focusedCell) {
            this.focusedCell = { row: this.focusedRow || this.visibleRows[0], column: this.activeCols[0] };
        }
        const rowIndex = this.visibleRows.findIndex(r => this.compareRows(this.focusedCell.row, r));
        if (rowIndex === -1) {
            const globalRowIndex = this.items.findIndex(r => this.compareRows(this.focusedCell.row, r));
            const scrollToItem = globalRowIndex * this.rowHeight;
            const halfScreenTop = Math.trunc(maxRowIndex / 2) * this.rowHeight;
            this.$scrollTop = Math.max(0, Math.min(scrollToItem - halfScreenTop, this.scrollHeight - this.$height));
            return;
        }
        const columnIndex = this.activeCols.indexOf(this.focusedCell.column);

        const newPos = {
            row: rowIndex + v,
            col: columnIndex + h
        };

        //row
        if (v < 0) {
            if (newPos.row < 0) {
                if (this.$scrollTop > 0) {
                    this.$scrollTop += this.rowHeight * v;
                    this.$scrollTop = Math.max(0, this.$scrollTop);
                }
                newPos.row = rowIndex;
            }
        }
        else if (v > 0) {
            if ((newPos.row >= maxRowIndex)) {
                if (this.$scrollTop < this.scrollHeight - this.$height) {
                    this.$scrollTop += this.rowHeight * v;
                }
                newPos.row = Math.min(this.visibleRows.length - 1, rowIndex);
            }
        }

        //col
        if(!this.activeCols[newPos.col]){
            newPos.col = columnIndex;
        }

        this.debounce('moveCellPointer', () => {
            this.focusCell(this.visibleRows[newPos.row], this.activeCols[newPos.col]);
        });
    },
    getRowIndex(row) {
        return this.rows.findIndex(r => Object.equal(r, row));
    },
    /**
     * @type {Table["addSelection"]}
     * @this {Table}
     */
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
        this.selectedRows = [...this.selectedRows];
        // this.fire('selected-rows-changed', this.selectedRows);
    },
    /**
     * @type {Table["clearSelection"]}
     * @this {Table}
     */
    clearSelection() {
        this._selectedAll = false;
        this.selectedRows = [];
        // this.fire('selected-rows-changed', this.selectedRows);
    },
    /**
     * @type {Table["scrollToRowIndex"]}
     * @this {Table}
     */
    scrollToRowIndex(index) {
        if (this.style.getPropertyValue('visibility') === 'hidden') {
            return this.async(() => this.scrollToRowIndex(index), 100);
        }

        if (index <= -1) {
            return;
        }
        this.throttle('changeScrollTop', () => { // for complete of rendering
            if (!this.body) return;
            const pos = index * this.rowHeight;
            const shift = this.rowHeight * Math.floor(this.body.offsetHeight / (3 * this.rowHeight));
            if ((this.body.scrollTop + 0.8 * this.rowHeight > pos) || (this.body.offsetHeight + this.body.scrollTop - 1.5 * this.rowHeight < pos)) {
                this.body.scrollTop = (pos - shift < 0) ? 0 : pos - shift;
            }
        }, 100);
    },
    /**
     * @type {Table["scrollToRow"]}
     * @this {Table}
     */
    scrollToRow(item) {
        if (this.style.getPropertyValue('visibility') === 'hidden') {
            return this.async(() => this.scrollToRow(item), 100);
        }

        item ??= this.focusedRow;
        if (this.rows.some(r => r === item)) return;
        const index = this.items.findIndex(i => {
            return Object.equal(i, item);
        });
        this.scrollToRowIndex(index);
    },
    /**
     * @type {Table["selectAndFocusRow"]}
     * @this {Table}
     */
    selectAndFocusRow(item) {
        this.clearSelection();
        const items = this.items;
        if (item && items) {
            if (item.disabled || item.isGroup) {
                item.__expanded__ = !item.__expanded__;
            } else {
                this.selectedRows.push(item);
                // this.fire('selected-rows-changed', this.selectedRows);
                // this.focusedRow = item;
                this.focusRow(item);
                this.selectedRows = [...this.selectedRows];
                // this.scrollToRow(item);
            }
        }
    },
    /**
     * @type {Table["selectAll"]}
     * @this {Table}
     */
    selectAll() {
        if (!this._selectedAll)
            this._selectedAll = true;
        const items = this.items;
        if (items.length && this.allowSelection !== 'none') {
            for (const item of items) {
                this.addSelection(item);
            }
        }
        this.$render();
    },
    getColPath(col) {
        if (col.$parent)
            return `${this.getColPath(col.__parent__)}/${col.name}`;
        return col.name;
    },
    addGroup(col) {
        const path = this.getColPath(col);
        if (this.groupColPaths.includes(path)) {
            return;
        }
        this.groupColPaths.push(path);
        this.groupColPaths = Array.from(this.groupColPaths);
        this.showGroupingPanel = true;
    },
    removeGroup(col) {
        const path = this.getColPath(col);
        const idx = this.groupColPaths.indexOf(path);
        if (idx > -1) {
            this.groupColPaths.splice(idx, 1);
            this.groupColPaths = Array.from(this.groupColPaths);
        }
        if (!this.groupColPaths.length)
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
        });
    },
    deleteItems(callback, once = false) {
        const items = once ? [this._find(callback)] : this._filter(callback);
        items.forEach(i => {
            const array = i.__parent__?.items || this.dataSet;
            const idx = array.indexOf(i);
            if (~idx) {
                array.splice(idx, 1);
            }
        });
    },
    //#region drag & drop
    _onDragStart(e) {
        const el = e.path.find(p => p.row);
        if (!(el && (this.allowDrag || el.row.drag))) {
            return;
        }
        e.dataTransfer.clearData();
        this._setDragImage(e);
        this.draggedRows = this.selectedRows.includes(el.row) ? this.selectedRows : [el.row];
        this._getDragData(this.draggedRows).forEach(data => {
            e.dataTransfer.setData(data.mime, data.data);
        });
    },
    _setDragImage(e) {
        try {
            const node = e.target.querySelector('.cell');
            e.dataTransfer.setDragImage(node || new Image(), 0, 0);
        } catch (err) {
            e.dataTransfer.setDragImage(new Image(), 0, 0);
        }
    },
    _getDragData(rows) {
        return rows.map(r => {
            return { mime: 'application/json', data: r };
        });
    },
    _onDragLeave(e) {
        const el = e.path.find(p => p.row);
        if (el)
            el.row.$dropMode = '';
        clearTimeout(this._expandTimer);
        this._expandTimer = null;
    },
    _checkDropWait: null,
    _onDragOver(e) {
        if (!this.allowDrop) return;
        e.stopPropagation();
        if (this._draggableColumn) return;

        const target = e.path.find(p => p.row);
        if (!target) return;

        const row = target.row;
        if (this.draggedRows?.length) {
            let r = row;
            while (r) {
                if (this.draggedRows.includes(r)) return;
                r = r.__parent__;
            }
            if (this.draggedRows.some(i => i.__parent__ === row)) return;
        }

        e.preventDefault();

        if (!this._expandTimer) {
            this._expandTimer = setTimeout(() => {
                clearTimeout(this._expandTimer);
                this._expandTimer = null;
                row.__expanded__ = true;
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
            row.$dropMode = '';
    },
    _getDropEffect(source, target, event) {
        return event.ctrlKey ? 'copy' : 'move';
    },
    _onDrop(e) {
        e.stopPropagation();
        if (this._draggableColumn) return;
        const el = e.path.find(p => p.row);
        if (!el) return;
        const row = el.row;
        e.preventDefault();
        try {
            this._doDrop(this.draggedRows, row, e);
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
                this.deleteItems(i => source.includes(i));
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
    onDragEnd(e) {
        this.draggedRows = [];
        this._checkDropWait = null;
        e.dataTransfer.clearData();
    },
    _onDropToEmptySpace() {

    },
    _onDragOverToEmptySpace() {

    },
    //#endregion & drop
    _find(callback) {
        const find = (items) => {
            let res = items.find(callback);
            if (!res) {
                res = items.find(i => {
                    return i.items?.length && find(i.items);
                });
                if (res)
                    return find(res.items);
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
    // _onRowContextMenu(e) {
    //     const el = e.path.find(p => p.row);
    //     if (el)
    //         this.fire('row-contextmenu', el.row);
    // },
    /**@this {Table}*/
    _onDownToEmptySpace(e) {
        if (e.button)
            return;
        this.focusedRow = null;
        this.clearSelection();
    },
    /**
     * @type {Table['activateCell']}
     * @this {Table}
     */
    activateCell(cellElement) {
        if (this.activeCell) {
            this.deactivateCell(this.activeCell);
            if (this.activeCell === cellElement) {
                return this.deactivateCell(cellElement);
            }
        }
        if (typeof cellElement?.activate === 'function' && (cellElement.column?.treeMode || !(cellElement.readOnly || cellElement.readonly))) {
            this.listen('deactivate', () => {
                if (this.activeCell === cellElement) {
                    if (this.fillingNewLineMode) {
                        this.focus();
                        this.moveCellPointer(1, 0);
                    }
                    else {
                        this.activeCell = null;
                    }
                }
            }, { target: cellElement, once: true });
            this.activeCell = cellElement;
            return cellElement.activate();
        }
        const row = cellElement.cellCoordinates.row;
        if (row && this.compareRows(row, this.focusedRow)) {
            const treeColumn = this.activeCols.find(c => c.treeMode);
            if (treeColumn) {
                const treeCell = this.body.findCellByCoordinates({ row, column: treeColumn });
                if (treeCell) {
                    return this.activateCell(treeCell);
                }
            }
        }
        this.activeCell = null;
    },
    /**
     * @type {Table['deactivateCell']}
     * @this {Table}
     */
    deactivateCell(cellElement) {
        if (typeof cellElement.deactivate === 'function') {
            cellElement.deactivate();
        }
        else {
            cellElement.fire('deactivate');
        }
    },
    /**@this {Table}*/
    onCellPointerDown(row, col, cell) {
        this.table.focusCell(row, col);
        if (this.onTapEditMode && !this.activeCell) {
            this.activateCell(cell)
        }
    },
    /**@this {Table}*/
    onCellDoubleClick(e, cell) {
        this.onDblclick(e);
        if (!this.onTapEditMode) {
            this.activateCell(cell)
        }
    },
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
            };
        });
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
        <div
            ~for="columns"
            ~is="getTemplate($for.item)"
            :item="getItem($for.item)"
            :column="$for.item"
            ~class="[$for.item.className]"
        ></div>
    </div>
    <div ~if="$scrollHeight > $height" class="no-flex" style="overflow-y: scroll; visibility: hidden;"></div>
    `,
    getItem(col) {
        return col;
    },
    getTemplate(col) {
        return 'div';
    },
    columns: {
        $def: [],
        set(v) {
            this.async(() => {
                this.$render();
            });
        }
    },
});

ODA({is: 'oda-table-header', extends: 'oda-table-cols',
    template: /*html*/`
         <oda-button ~if="this.allowSettings" class="invert" style="position: absolute; top: 0px; right: 0px; z-index: 1;" icon="icons:settings" allow-toggle ::toggled="showSettings"></oda-button>
    `,
    getTemplate(col) {
        return col.headerTemplate || this.headerTemplate;
    }
});

ODA({is: 'oda-table-footer', extends: 'oda-table-cols',
    getItem(col) {
        return this.footer;
    },
    getTemplate(col) {
        return col.footerTemplate || 'oda-table-footer-cell';
    }
});

ODA({is: 'oda-table-body', extends: 'oda-table-part',
    template: /*html*/`
    <style>
        :host {
            position: relative;
            overflow-x: {{autoWidth?'hidden':'auto'}};
            overflow-y: auto;
            @apply --vertical;
            outline: none;
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
            @apply --light;
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
        /*.row[focused]>.cell::after {*/
        /*    content: '';*/
        /*    background-color: var(--focused-color);*/
        /*    position: absolute;*/
        /*    bottom: 0px;*/
        /*    left: 0px;*/
        /*    right: 0px;*/
        /*    height: 1px;*/
        /*    z-index: 1;*/
        /*    pointer-events: none;*/
        /*    @apply --shadow;*/
        /*}*/
        .row[pointer]::before {
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
        .cell.focused-cell::before{
            content: "";
            pointer-events: none;
            position: absolute;
            top: 0px;
            bottom: 1px;
            right: 0px;
            left: 0px;
            outline-offset: -2px;
            outline-style: auto;
            outline-color: var(--pointer-color);
            outline-style: dashed;
            z-index: 1;
            outline-width: 1px !important;
        }
    </style>
    <div ~wake="true" class="no-flex vertical" ~style="{height: $scrollHeight + rowHeight + 'px'}">
        <div
            ~wake="true"
            class="sticky"
            style="top: 0px; min-height: 1px; min-width: 100%;"
            @mousedown="onTapRows"
            @contextmenu.catch="_onRowContextMenu"
            @dragleave="table._onDragLeave($event, $detail)"
            @dragover="table._onDragOver($event, $detail)"
            @drop="table._onDrop($event, $detail)"
        >
            <div
                ~for="visibleRows"
                ~class="{'group-row':$for.item.__group__}"
                class="row"
                :row="$for.item"
                :drop-mode="$for.item.$dropMode"
                :dragging="draggedRows.includes($for.item)"
                :focused="allowFocus && isFocusedRow($for.item)"
                :selected="allowSelection !== 'none' && isSelectedRow($for.item)"
                @dragstart="table._onDragStart($event, $detail)"

                :raised="raisedRows.includes($for.item)"
            >
                <div
                    ~for="$for.item.__group__ ? [$for.item] : rowColumns"
                    ~class="_getCellClasses($for.item, $$for.item, $this)"
                    ~props="$$for.item?.props"
                    :draggable="getDraggable($for.item, $$for.item)"
                    :item="$for.item"
                    :fix="$$for.item.fix"
                    :col="$$for.item"
                    @pointerenter="focusedMove"
                >
                    <div
                        ~is="_getTemplateTag($for.item, $$for.item)"
                        ~class="{'group' : $for.item.__group__}"
                        ~style="{'min-height': iconSize + 'px'}"
                        class="flex cell-content"
                        :header="raisedRows.includes($for.item)"
                        :border-bottom="raisedRows.last === $for.item"
                        :column="$$for.item"
                        :item="$for.item"
                        @mousedown="onCellPointerDown($for.item, $$for.item, $this)"
                        @dblclick.stop.capture="onCellDoubleClick($event, $this)"
                        :cell-coordinates="{row: $for.item, column: $$for.item}"
                    ></div>
                </div>
            </div>
        </div>
    </div>
    <div
        class="flex empty-space"
        style="visibility: hidden;"
        @drop.stop.prevent="table._onDropToEmptySpace($event, $detail)"
        @dragover.stop.prevent="table._onDragOverToEmptySpace($event, $detail)"
    ></div>
    `,
    overHeight: false,
    $listeners: {
        resize(e) {
            this.setScreen();
            this.scrollBoxWidth = undefined;
        },
        scroll(e) {
            this.setScreen();
        },
    },
    $keyBindings: {
        arrowLeft(e) {
            if (this.activeCell) return;
            e.stopPropagation();
            e.preventDefault();

            this.moveCellPointer(-1, 0);
        },
        arrowRight(e) {
            if (this.activeCell) return;
            e.stopPropagation();
            e.preventDefault();

            this.moveCellPointer(1, 0);
        },
        arrowUp(e) {
            if (this.activeCell) return;
            e.stopPropagation();
            e.preventDefault();

            this.moveCellPointer(0, -1, e);
            if (e.shiftKey) {
                this.onSelectRow(e, { value: this.focusedCell.row });
            }
        },
        arrowDown(e) {
            if (this.activeCell) return;
            e.stopPropagation();
            e.preventDefault();

            this.moveCellPointer(0, 1, e);
            if (e.shiftKey) {
                this.onSelectRow(e, { value: this.focusedCell.row });
            }
        },
        /** @this {Table} */
        home(e) {
            if (this.activeCell) return;
            e.stopPropagation();
            e.preventDefault();

            const h = this.activeCols[0].id - this.focusedCell.column.id;

            let v = 0;
            if (e.ctrlKey) {
                this.scrollToRowIndex(0);
                v = -this.visibleRows.findIndex(r => this.compareRows(r, this.focusedCell.row));
            }

            this.moveCellPointer(h, v);
        },
        /** @this {Table} */
        end(e) {
            if (this.activeCell) return;
            e.stopPropagation();
            e.preventDefault();

            const h = this.rowColumns.at(-1).id - this.focusedCell.column.id;

            let v = 0;
            if (e.ctrlKey) {
                this.scrollToRowIndex(this.visibleRows.length - 1);
                v = this.visibleRows.length - this.visibleRows.findIndex(r => this.compareRows(r, this.focusedCell.row)) - 1;
            }

            this.moveCellPointer(h, v);
        },
        pageUp(e) {
            if (this.activeCell) return;
            e.stopPropagation();
            e.preventDefault();

            this.moveCellPointer(0, -this.screenLength);
        },
        pageDown(e) {
            if (this.activeCell) return;
            e.preventDefault();
            this.moveCellPointer(0, this.screenLength);
        },
        tab(e) {
            e.preventDefault();
            const dir = e.shiftKey ? -1 : 1;
            const _ = this.focusedCell;
            this.moveCellPointer(dir, 0);
        },
        escape(e) {
            if (this.activeCell) {
                e.preventDefault();
                e.stopPropagation();
                this.deactivateCell(this.activeCell);
                //const elem = this.body.getFocusedCellElement();
                //this.deactivateCell(elem);
            }
            this.clearSelection();
        },
        'ctrl+a,ctrl+ф'(e) {
            if (this.activeCell) return;
            if (this._selectedAll) {
                this.clearSelection();
                this.addSelection(this.focusedRow);
            } else {
                this._selectedAll = true;
            }
        },
        'ctrl+space'(e) {
            if (this.activeCell) return;
            e.preventDefault();
            e.stopPropagation();

            if (!this.focusedCell) return;

            this.onSelectRow(e, { value: this.focusedCell.row });
        },
        space(e) {
            if (this.activeCell) return;
            e.stopPropagation();
            e.preventDefault();

            if (!this.focusedCell) return;

            const row = this.focusedCell.row;

            if (row.$hasChildren) {
                row.__expanded__ = !row.__expanded__;
                this.table.expand(row);
            }
        },
        enter(e) {
            if (!this.focusedCell) return;
            e.preventDefault();
            e.stopPropagation();

            const row = this.focusedCell.row;
            const col = this.focusedCell.column;

            if (col.treeMode) {
                if (this.compareRows(this.focusedRow, row)) {
                    const elem = this.body.getFocusedCellElement();
                    if (row.$hasChildren && !row.__expanded__) {
                        row.__expanded__ = true;
                    }
                    else {
                        this.activateCell(elem);
                    }
                }
                else {
                    this.onSelectRow(e, { value: row });
                }
            }
            else {
                if (this.activeCell && this.fillingNewLineMode) {
                    this.moveCellPointer(1, 0);
                }
                else {
                    const elem = this.body.getFocusedCellElement();
                    this.activateCell(elem);
                }
                this.onSelectRow(e, { value: row });
            }
        },
    },
    _getTemplateTag(row, col) {
        if (row.__group__)
            return this.groupTemplate;
        if (col.treeMode)
            return 'oda-table-cell-tree';
        if (row.templates) {
            console.warn('!!!row.templates', row);
        }
        const template = row[`${PROP_PREFIX}templates`]?.[col[this.columnId]] || col.cellTemplate || this.cellTemplate;
        if (typeof template === 'object')
            return template.tag || template.is || template.template;
        return template;
    },
    getDraggable(row, col) {
        return (col.treeMode && this.allowDrag && !this.compact && !row.__group__ && row.drag !== false) ? 'true' : false;
    },
    attached() {
        this.setScreen();
    },
    /**@this {Table} */
    _getCellClasses(row, column, elem) {
        const res = ['cell'];
        if (column) {
            res.push(`col-${column.id}`);
        }
        if (row?.__group__ || column?.$flex) {
            res.push('flex');
        }
        else {
            res.push('no-flex');
        }
        if (this._cellIsFocused(row, column, elem)) {
            res.push('focused-cell');
        }
        return res;
    },
    focusedMove(e) {
        if (e.buttons !== 1) return;
        this.focusedCellEnd = { row: e.target.row, col: e.target.col };
    },
    _onRowContextMenu(e) {
        const el = e.path.find(p => p.row);
        if (el) {
            this.table.fire('row-contextmenu', el.row);
        }

    },
    /** @this {Table} */
    _cellIsFocused(row, column, elem) {
        if (!this.allowFocusCell || (column.treeMode && this.compareRows(this.focusedRow, row))) return false;
        return this.focusedCell && this.compareRows(this.focusedCell.row, row) && this.focusedCell.column === column;
    },
    setScreen() {
        if (this.fix) return;
        this.$height = this.offsetHeight;
        this.$width = this.offsetWidth;
        this.overHeight = this.offsetHeight < this.scrollHeight;
        this.$scrollTop = this.scrollTop;
        this.$scrollWidth = this.scrollWidth;
        this.$scrollLeft = this.scrollLeft;
    },
    findCellByCoordinates({ row, column }) {
        const cellContents = this.$$('.cell-content');
        return cellContents.find(e => this.compareRows(e.cellCoordinates?.row, row) && e.cellCoordinates?.column === column);
    },
    /** @this {Table} */
    getFocusedCellElement() {
        if (!this.focusedCell) return null;
        return this.findCellByCoordinates(this.focusedCell);
    },
    /**@this {Table} */
    getRowByIndex(index) {
        if (index < this.raisedRows.length) {
            return this.raisedRows[index];
        }
        else {
            return this.rows[index - this.raisedRows.length];
        }
    }
});
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
                /*min-width: 1px;*/
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
            <span class="field-control" ~is="template" :column :item ::value style="overflow: hidden">{{value ?? ''}}</span>`,
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
            <oda-icon
                ~if="showExpander"
                ~style="_style"
                style="cursor: pointer;"
                class="no-flex expander"
                :icon
                :icon-size
                @dblclick.stop.prevent
                @down.stop.prevent
                @pointerdown.stop.prevent
                @pointerup.stop.prevent
                @tap.stop.prevent="_toggleExpand"
            ></oda-icon>
        `,
        get showExpander() {
            return this.item?.__level__ !== -1 && !this.item?.$forceExpanded;
        },
        get _style() {
            return { opacity: this.icon ? (this.item?.disabled ? .2 : .5) : 0 };
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
                if (!this.item.hideExpander && !this.hideIcon) {
                    this.item.__expanded__ = !this.item.__expanded__;
                    this.fire('expanded-changed', this.item.__expanded__);
                }
            });
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
            <div id="subcell" :dark ::color ~is="subTemplate" :column :item class="flex" @tap="_tap" @deactivate="fire('deactivate', $event)">{{item?.[column[columnId]] || ''}}</div>`,
            get subcell() {
                return this.$('#subcell');
            },
            get subTemplate() {
                if (this.item.template) {
                    console.warn('!!!item.template', this.item);
                }
                return this.item?.[`${this.column[this.columnId]}.${PROP_PREFIX}subTemplate`] || this.item?.[`${PROP_PREFIX}subTemplate`] || this.column?.cellTemplate || this.cellTemplate || 'label';
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
                        const idx = this.raisedRows.indexOf(this.item);
                        if (idx <= -1) {
                            return;
                        }
                        const next = this.raisedRows[idx + 1] || this.rows?.[0];
                        let counter = 0;
                        for (let i = 0; i < this.item?.items?.length || 0; i++) {
                            if (this.item?.items[i] === next)
                                break;
                            counter++;
                        }
                        return counter || '';
                    },
                    $attr: true
                },
            },
            get level() {
                return this.item?.__level__;
            },
            get myStyle() {
                return { width: `${+this.level * this.stepWidth}px`, ...this.stepStyle };
            },
            get endStepStyle() {
                if (!this.showTreeLines || !this.stepWidth) return {};
                const thickness = this.treeLineStyle.width || 1;
                const pre = `${Math.round((this.iconSize + thickness) / 2)}px`;
                const post = `${pre} + ${thickness}px`;
                const color = this.treeLineStyle.color || 'rgba(0, 0, 0, 0.25)';
                return {
                    width: `${this.stepWidth - Math.round((this.iconSize + thickness) / 2)}px`,
                    background: `linear-gradient(0deg, transparent 0, transparent calc(${pre}), ${color} calc(${pre}), ${color} calc(${post}), transparent calc(${post}))`
                };
            },
            get _showCheckBox() {
                return ((this.allowCheck && this.allowCheck !== 'none' && !this.item.hideCheckbox) || (this.item?.allowCheck && this.item?.allowCheck !== 'none')) && !this.item?.disabled;
            },
            get stepStyle() {
                if (!this.showTreeLines || !this.iconSize) return {};
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
                if (this.item.disabled || this.item.isGroup) this.item.__expanded__ = !this.item.__expanded__;
                //else this.item.__expanded__ = true
            },
            $keyBindings: {
                arrowLeft(e) {
                    e.preventDefault();
                    this.moveCellPointer(-1, 0);
                },
                arrowRight(e) {
                    e.preventDefault();
                    this.moveCellPointer(1, 0);
                },
            },
            activate() {
                return this.subcell?.activate?.();
            },
            deactivate() {
                return this.subcell?.deactivate?.();
            }
        });


        ODA({
            is: 'oda-table-check', imports: '@oda/icon', extends: 'oda-table-cell-base',
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
                if (this.selectByCheck) return;// this.onSelectRow(e); //👀

                const checkChildren = (item, clear = false) => {
                    (item.items || []).forEach(i => {
                        if (item.checked === 'intermediate') {
                            return;
                        }
                        i.checked = clear ? false : item.checked;
                        updateCheckedRows(i);
                        checkChildren(i, clear);
                    });
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
                };
                if (this.item.checked === 'checked') {
                    {
                        this.item.checked = 'unchecked';
                    }
                } else {
                    this.item.checked = 'checked';
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
                min-width: {{+column.width || 16}}px;
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
            .split::before {
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
            .split::after {
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
        <div class="flex vertical" style="cursor: pointer" :disabled="!column.name">
            <div @tap.stop="setSort" class="flex horizontal" ~style="{flexDirection: column.fix === 'right'?'row-reverse':'row', minHeight: rowHeight+'px', height: column?.__expanded__?'auto':'100%'}">
                <div class="flex horizontal" style="align-items: center;">
                    <oda-table-expand ~if="showExpander" :item class="no-flex"></oda-table-expand>
                    <label
                        class="label flex"
                        :title="column.label || column.name"
                        ~html="column.label || column.name"
                        draggable="true"
                        @dragover="_dragover"
                        @dragstart="_dragstart"
                        @dragend="_dragend"
                        @drop="_drop"
                    ></label>
                    <oda-icon
                        ~if="allowSort && sortIndex"
                        style="position: absolute; right: 0px; top: 0px;"
                        :disabled="column?.__expanded__ && column?.items?.length"
                        :icon="sortIcon"
                        :bubble="sortIndex"
                        title="sort"
                    ></oda-icon>
                </div>
                <slot name="tools"></slot>
                <div @dblclick="column.reset('$width')" class="split" @tap.stop @track="_track"></div>
            </div>
            <div class="cell flex horizontal filter-container" ~if="!column.__expanded__ && column.name && showFilter" style="align-items: center" @tap.stop>
                <input class="flex filter-input" ::value="filter" @tap.stop style="margin-left: 8px; padding: 2px;">
                <oda-button ~if="!filter" :icon-size="Math.round(iconSize * .5)" @tap.stop="showDD" icon="icons:filter-list" title="filter"></oda-button>
                <oda-button ~if="filter"  :icon-size="Math.round(iconSize * .5)" icon="icons:close" @tap.stop="filter = ''" title="clear"></oda-button>
            </div>
            <div class="flex sub-cols horizontal" ~if="expanded && column?.items?.length">
                <oda-table-header-cell ~wake="true" ~is="headerTemplate"  class="header-cell flex" ~for="subCols" :item="$for.item" :column="$for.item" ~class="[$for.item.className]"></oda-table-header-cell>
            </div>
            <div class="flex" ~if="!column.name"></div>
        </div>`,
        get showExpander() {
            return this.column?.items?.length;
        },
        get fix() {
            return this.column?.fix;
        },
        get expanded() {
            return this.column.__expanded__;
        },
        get subCols() {
            return this.column?.items?.map(col => {
                col.__parent__ ??= this.column;
                this.modifyColumn(col);
                return col;
            })?.filter(col => !col.$hidden);
        },
        get sortIcon() {
            if (+this.column.$sort > 0)
                return 'icons:arrow-drop-down';
            if (+this.column.$sort < 0)
                return 'icons:arrow-drop-up';
            return '';
        },
        get sortIndex() {
            return Math.abs(+this.column?.$sort);
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
                this.modifyColumn(this.column);
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
                    label: this.table.groups.includes(this.column) ? 'Ungrouping' : 'Grouping by this column',
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
                    label: `${this.table.showGroupingPanel ? 'Hide' : 'Show'} grouping panel`,
                    icon: 'icons:credit-card',
                    group: 'more', execute: () => {
                        this.table.showGroupingPanel = !this.table.showGroupingPanel;
                    }
                },
                {
                    label: `${this.showFilter ? 'Hide' : 'Show'} filter row`,
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
            if (this.column.$sort > 0) {
                this.column.$sort = -this.column.$sort;
            }
            else {
                this.column.$sort = this.column.$sort < 0 ? 0 : this.sorts.length + 1;
                this.async(() => {
                    this.sorts.forEach((i, idx) => {
                        i.$sort = (idx + 1) * Math.sign(i.$sort);
                    });
                });
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
            for (const col of this.sorts) {
                const va = a[col.name];
                const vb = b[col.name];
                if (va > vb) return col.$sort;
                if (va < vb) return -col.$sort;
            }
            return 0;
        });
    }
    /**@typedef {[!string, any?]} KeysDefs */
    /**@type {KeysDefs[]} */
    const keys = [['__expanded__'], ['$forceExpanded'], ['__parent__', null], ['__level__', 0], ['$hasChildren', false]];
    return items.reduce((res, i) => {
        keys.forEach(([k, def]) => {
            if (!(k in i)) {
                Object.defineProperty(i, k, {
                    enumerable: false,
                    configurable: true,
                    writable: true,
                    value: i[k] || def
                });
            }
        });
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
        i.$forceExpanded = (i.__expanded__ === undefined && (this.expandAll || (this.expandLevel >= i.__level__))) || (level < 0 && !i.__expanded__) ? true : false;
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
                min-width: 300px;
                @apply --flex;
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
                $save: true,
            }
        },
        $listeners: {
            resize(e) {
                this.width = e.offsetWidth;
            }
        }
    });
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
            const fix = this.columns.find(c => c.name === 'fix');
            if (fix) {
                this.groups = [fix];
            }
        }
    });
}
const maxColsCount = 1024;
const saveColProps = ['__expanded__', '$hidden', '$sort', '$order', '$filter'];
function modifyColumn(table, col) {
    if (col.isModified) return;
    col.isModified = true;
    col.$saveKey = (col.__parent__?.$saveKey ? (`${col.__parent__?.$saveKey}/`) : '') + (col[table.columnId] || 'empty-name');
    const storage = table.storage;
    col['#$width'] = col.$width;
    Object.defineProperties(col, {
        'visibleItems': {
            configurable: false,
            enumerable: false,
            get() {
                return col['#visibleItems'] ??= col.items?.filter(i => !i.$hidden);
            },
        },
        '$width': {
            configurable: false,
            enumerable: false,
            set(v) {
                if (!v) return;
                const min = col.visibleItems?.length ? 32 : 16;
                v = Math.round(v);
                if (v < min)
                    v = min;
                if (col.$width === v)
                    return;
                if (col.__expanded__ && col.items?.length) {
                    let w = col.visibleItems?.reduce((res, i) => {
                        i.__parent__ = i.__parent__ || col;
                        modifyColumn(table, i);
                        i.$width ??= v / col.visibleItems?.length;
                        res += i.$width;
                        return res;
                    }, 0);
                    if (w && v != w) {
                        w /= v;
                        col.visibleItems?.forEach(i => {
                            i.$width /= w;
                        });
                    }
                }
                else {
                    col['#$width'] = v;
                    storage.setToItem(col.$saveKey, '$width', v);
                }
            },
            get() {
                if (+col.width)
                    return col.width;
                if (col.__expanded__ && col.items?.length) {
                    if (col.$version !== storage.version)
                        col.$version = storage.version;
                    return col.visibleItems?.reduce((res, i) => {
                        i.__parent__ ??= col;
                        modifyColumn(table, i);
                        i.$width ??= col.visibleItems?.length;
                        res += i.$width;
                        return res;
                    }, 0);
                }
                else {
                    return col['#$width'] ??= storage.getFromItem(col.$saveKey, '$width');
                }
            }
        },
        'checked': {
            configurable: true,
            enumerable: true,
            set(v) {
                col.$hidden = (v === 'unchecked');
            },
            get() {
                return col.$hidden ? 'unchecked' : 'checked';
            }
        },
        '$version': {
            configurable: true,
            enumerable: true,
            set(v) {
                clear();
                col['#$version'] = v;
            },
            get() {
                return col['#$version'];
            }
        },
        'reset': {
            value(attr) {
                storage.setItem(col.$saveKey, undefined);
                clear(attr);
            }
        }
    })
    for (const i of saveColProps)
        addSaveProp.call(col, i, storage);

    if (col.checked !== undefined)
        col['#checked'] = col.checked;

    function clear(attr) {
        if (attr)
            col[`#${attr}`] = undefined;
        else {
            col['#$width'] = undefined;
            for (const i of saveColProps)
                col[`#$${i}`] = undefined;
        }
    }

    if (!col.__parent__) return;

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
    if (this[name] !== undefined) return;
    const vname = `#${name}`;
    if (this[name] !== undefined)
        this[vname] = this[name];
    Object.defineProperty(this, name, {
        configurable: true,
        enumerable: true,
        set(v) {
            if (this[name] === v)
                return;
            this[vname] = v;
            storage.setToItem(this.$saveKey, name, v || undefined);
        },
        get() {
            if (this.$version !== storage.version)
                this.$version = storage.version;
            let result = this[vname];
            if (result === undefined)
                this[vname] = result = storage.getFromItem(this.$saveKey, name);
            return result;
        }
    });
}
const emptyRows = [];