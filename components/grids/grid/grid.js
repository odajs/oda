ODA({
    is: 'oda-grid',
    template: /*html*/`
    <style>
        :host{
            @apply --vertical;
            overflow: auto;
        }
        :host > oda-grid-head{
            top: 0px;
            position: sticky;
        }
        :host > oda-grid-foot{
            bottom: 0px;
            position: sticky;
        }
        :host > oda-grid-pagination-panel{
            position: sticky;
            left: 0;
        }
    </style>
    <div style="display: table;" class="flex">
        <oda-grid-head></oda-grid-head>
        <oda-grid-body id="body"></oda-grid-body>
        <!-- <oda-grid-foot></oda-grid-foot> -->
    </div>
    <oda-grid-pagination-panel></oda-grid-pagination-panel>
    `,
    $pdp: {
        columns: {
            set(n) {
                this._columns = n?.map?.(c => ({ $column: c })) || [];
            }
        },
        _columns: [],
        rows: [],
        _rows: {
            get() {
                return this.rows.map(r => ({ $data: r }));
            }
        },
        rowHeight: 32,
        allRowsCount: 0,
        get screenLength() {
            return ~~((this.offsetHeight - 3 * this.rowHeight) / this.rowHeight);
        },
        screenFrom: 0,
        screen: {
            get() {
                return {
                    from: this.screenFrom,
                    length: this.screenLength
                };
            }
        },
        focusedRow: null,
        valueCellTemplate: 'oda-grid-cell-value',
        emptyRow: {},
        sorts: [],
        currentPage: {
            $def: 0,
            set(n) {
                this.currentPage = n;
                this.screenFrom = n * this.screenLength;
                this.screen = undefined;
            }
        },
    },
    get bodyHeight() {
        return this.$('#body')?.offsetHeight;
    },
    $listeners: {
        resize() {
            this.screenLength = undefined;
        }
    },
    onRowDblClick(row) {

    },
    onRowClick(row) {
        if (row === this.emptyRow) {
            this.focusedRow = null;
            return;
        }
        this.focusedRow = row;
    }
});
ODA({
    is: 'oda-grid-body',
    template: /*html*/`
    <style>
        :host{
            display: table-row-group;
        }
    </style>
    <oda-grid-row ~for="_rows" :row="$for.item" ~style="{outline: focusedRow === $for.item ? '1px solid var(--focused-color)' : ''}"></oda-grid-row>
    `
});
ODA({
    is: 'oda-grid-head',
    template: /*html*/`
    <style>
        :host{
            display: table-header-group;
        }
    </style>
    <oda-grid-head-row ~for="_rows" :row="$for.item" ~style="{outline: focusedRow === $for.item ? '1px solid var(--focused-color)' : ''}"></oda-grid-head-row>
    `,
    _rows: {
        get() {
            return [Object.fromEntries(this._columns.map(c => [c.$column.name, (c.$column.label || c.$column.name)]))].map(r => ({ $data: r }));
        }
    }
});
ODA({
    is: 'oda-grid-foot',
    template: /*html*/`
    <style>
        :host{
            display: table-footer-group;
        }
    </style>
    `,
    _rows: {
        get() {
            return [Object.fromEntries(this._columns.map(c => [c.$column.name, (c.$column.label || c.$column.name)]))].map(r => ({ $data: r }));
        }
    }
});
ODA({
    is: 'oda-grid-row',
    template: /*html*/`
    <style>
        :host{
            display: table-row;
        }
    </style>
    <oda-grid-cell ~for="cells" :column="_columns[$for.index]" :row></oda-grid-cell>
    `,
    row: null,
    get cells() {
        return this._columns.map(c => this.row[c.$column.name]);
    },
    $listeners: {
        dblclick(e) {
            this.onRowDblClick(this.row);
        },
        tap(e) {
            this.onRowClick(this.row);
        }
    }
});
ODA({
    is: 'oda-grid-head-row',
    template: /*html*/`
    <style>
        :host{
            display: table-row;
        }
    </style>
    <oda-grid-head-cell ~for="cells" :column="_columns[$for.index]" :row :value-cell-template="'oda-grid-cell-value'"></oda-grid-head-cell>
    `,
    row: null,
    get cells() {
        return this._columns.map(c => this.row[c.$column.name]);
    },
    $listeners: {
        dblclick(e) {
            this.onRowDblClick(this.row);
        },
        tap(e) {
            this.onRowClick(this.row);
        }
    },
    onRowDblClick() {
        return;
    }
});
ODA({
    is: 'oda-grid-cell',
    template: /*html*/`
    <style>
        :host{
            display: table-cell;
            border: {{isEmpty ? '1px solid transparent' : '1px solid gray'}};
            box-sizing: border-box;
            padding: 0px 8px;
            vertical-align: middle;
            background-color: var(--content-background);
            height: {{rowHeight}}px;
        }
        {{''}}
    </style>
    <div ~is="_cellValueTemplate" :column :row></div>
    `,
    column: null,
    row: null,
    isEmpty: {
        get() {
            return this.row === this.emptyRow;
        }
    },
    get _cellValueTemplate() {
        if (this.isEmpty) return 'div';
        return this.row?.cellValueTemplate || this.column?.cellValueTemplate || this.valueCellTemplate;
    }
});
ODA({
    is: 'oda-grid-head-cell',
    template: /*html*/`
    <style>
        :host{
            display: table-cell;
            border: 1px solid gray;
            box-sizing: border-box;
            padding: 0px 8px;
            vertical-align: middle;
            @apply --header;
            height: {{rowHeight}}px;
        }
        :host .dimmed{
            opacity: 0.3;
        }
        {{''}}
    </style>
    <div class="horizontal" style="align-items: center">
        <oda-grid-cell-value :column :row class="flex"></oda-grid-cell-value>
        <oda-icon :icon="sortIcon" @tap.stop="onSortTap" ~class="{dimmed: !column.sort}" :bubble="sortIndex" style="margin-left: 4px;"></oda-icon>
    </div>
    `,
    get sortIcon() {
        return this.column.sort === 'a'
            ? 'iconoir:sort-down'
            : this.column.sort === 'd'
                ? 'iconoir:sort-up'
                : 'iconoir:sort';
    },
    column: null,
    row: null,
    get _cellValueTemplate() {
        return this.row?.cellValueTemplate || this.column?.cellValueTemplate || this.valueCellTemplate;
    },
    onSortTap() {
        this.column.sort = this.column.sort === 'a'
            ? 'd'
            : this.column.sort === 'd'
                ? ''
                : 'a';
        const idx = this.sorts.indexOf(this.column);
        if (this.column.sort) {
            if (!~idx) {
                this.sorts.push(this.column);
            }
        }
        else {
            if (~idx) {
                this.sorts.splice(idx, 1);
            }
        }
    },
    get sortIndex() {
        return this.sorts.indexOf(this.column) + 1;
    },
    $listeners: {
        resize() {
            this.column.width = this.offsetWidth;
        }
    }
});
ODA({
    is: 'oda-grid-cell-value',
    template: /*html*/`
    <div>{{value}}</div>
    `,
    column: null,
    row: null,
    value: {
        get() {
            return this.row.$data[this.column.$column.name] || '';
        }
    }
});
ODA({
    is: 'oda-grid-pagination-panel', imports: '@oda/button, @oda/menu',
    template: /*html*/`
        <style>
            :host{
                @apply --horizontal;
                align-items: center;
            }
        </style>
        <oda-button :disabled="currentPage === 0" @tap="_toFirst" icon="bootstrap:chevron-double-left"></oda-button>
        <oda-button :disabled="currentPage === 0" @tap="_toPrevious" icon="bootstrap:chevron-left"></oda-button>
        <oda-button :label="currentPage + 1 + '/' + pageCount" @tap="showDD"></oda-button>
        <oda-button :disabled="currentPage === pageCount - 1 || pageCount === 0" @tap="_toNext" icon="bootstrap:chevron-right"></oda-button>
        <oda-button :disabled="currentPage === pageCount - 1 || pageCount === 0" @tap="_toLast" icon="bootstrap:chevron-double-right"></oda-button>
        <!-- <oda-button ~for="buttons" ~props="$for.item" :focused="currentPage === $for.item.index"></oda-button> -->
    `,
    pages: {
        get() {
            const result = [];
            for (let i = 0; i < this.pageCount; i++) {
                result.push({ label: String(i + 1), val: i });
            }
            return result;
        }
    },
    pageCount: {
        get() {
            return Math.ceil(this.allRowsCount / this.screenLength);
        }
    },
    async showDD() {
        const res = await ODA.showDropdown('oda-menu', { parent: this, items: this.pages });
        const page = res?.control?.focusedItem;
        if (!page) return;
        this.currentPage = page.val;
    },
    _toFirst() {
        this.currentPage = 0;
    },
    _toPrevious() {
        this.currentPage--;
    },
    _toNext() {
        this.currentPage++;
    },
    _toLast() {
        this.currentPage = this.pageCount - 1;
    },
});