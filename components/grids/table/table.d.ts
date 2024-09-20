interface Table extends odaComponent {
    table: Table;
    $height: number;
    rowHeight: number;
    $scrollTop: number;

    allowSelection: 'all' | 'level' | 'type' | 'none';
    allowFocus: boolean;
    allowFocusCell: 'none' | 'single' | 'rows' | 'cols' | 'all';

    focusedCell: {row: TableRow, col: TableColumn}
    selectedRows: TableRow[];
    focusedRow: TableRow;
    activeCell: HTMLElement;

    headerColumns: TableColumn[];
    filter: string;
    columnId: string;

    items: TableRow[];
    filteredItems: TableRow[];
    sortedItems: TableRow[];
    rows: TableRow[];
    visibleRows: TabRow[];
    raisedRows: TableRow[];

    columns: TableColumn[];
    rowColumns: TableColumn[];
    activeCols: TableColumn[];

    screenLength: number;

    fillingNewLineMode: boolean;

    body: TableBody;

    focusRow(e: MouseEvent): void;
    _applyFilter(items: TableRow[]);
}
//table $pdp interface

interface TableBody extends odaComponent{
    activeCell: HTMLElement;
}

interface TableRow {
    items?: TableRow[];
}

interface TableColumn {
    name: string;
    id?: string;
    $order?: number;
    className?: string;
    label?: string;
    treeMode?: boolean;
    items?: TableColumn[];
    fix?: 'left' | 'right';
    cellTemplate?: string;
    $flex?: boolean;
    width?: number;
    $width?: number;
    left?: number;
    right?: number;
    __expanded__?: boolean;
    __parent__?: TableColumn;
}