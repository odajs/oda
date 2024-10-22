interface Table extends odaComponent {
    table: Table;
    $width: number;
    _fixWidth: number;
    $height: number;
    rowHeight: number;
    $scrollTop: number;
    $scrollLeft: number;

    noLazy: boolean;

    allowSelection: 'all' | 'level' | 'type' | 'none';
    allowFocus: boolean;
    allowFocusCell: boolean;
    allowDrag: boolean;

    focusedCell: TableCellInfo;
    selectedRows: TableRow[];
    focusedRow: TableRow;
    activeCell: TableCellElement;

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

    size: number;
    screenFrom: number;
    screenLength: number;

    fillingNewLineMode: boolean;

    body: TableBody;

    moveCellPointer(h: number, v: number);
    focusCell(row: TableRow, column: TableColumn): void;
    focusRow(e: MouseEvent): void;
    getRowByIndex(rowIndex: number): TableRow;
    _applyFilter(items: TableRow[]): void;
    activateCell(elem: TableCellElement): void;
    deactivateCell(elem: TableCellElement): void;
    compareRows(row1: TableRow, row2: TableRow): boolean;
    scrollToRowIndex(index: number): void;
    _cellIsFocused(row: TableRow, column: TableColumn, elem: TableCellElement): boolean;
    clearSelection(): void;
}
//table $pdp interface

interface TableCellInfo{
    row: TableRow;
    column: TableColumn;
}

interface TableCellElement extends HTMLElement {
    cellCoordinates: TableCellInfo;
    activate?: function;
    deactivate?: function;
}

interface TableBody extends odaComponent{
    activeCell: TableCellElement;

    getFocusedCellElement(): TableCellElement;
    findCellByCoordinates({row: TableRow, column: TableColumn}): TableCellElement
}

interface TableRow {
    items?: TableRow[];
    __group__: boolean;
}

interface TableColumn {
    name: string;
    id?: number;
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