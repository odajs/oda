interface Table extends odaComponent {
    table: Table;
    iconSize: number;
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

    onTapEditMode: boolean;

    focusedCell: TableCellInfo;
    selectedRows: TableRow[];
    focusedRow: TableRow;
    activeCell: TableCellElement;

    _selectedAll: boolean;

    headerColumns: TableColumn[];
    filter: string;
    columnId: string;

    dataSet: TableRow[];

    items: TableRow[];
    filteredItems: TableRow[];
    sortedItems: TableRow[];
    rows: TableRow[];
    visibleRows: TableRow[];
    raisedRows: TableRow[];

    columns: TableColumn[];
    rowColumns: TableColumn[];
    activeCols: TableColumn[];

    size: number;
    screenFrom: number;
    screenLength: number;

    fillingNewLineMode: boolean;

    body: TableBody;

    selectByCheck: boolean;
    selectionStartIndex: number;

    onDblclick(e: TableMouseEvent): void;

    _beforeExpand(item: TableRow, force?: boolean): TableRow[]
    expand(row: TableRow, force?: boolean, old?: TableRow): Promise<TableRow[]>;

    moveCellPointer(h: number, v: number);
    focusCell(row: TableRow, column: TableColumn): void;
    focusRow(row: TableRow): void;
    getRowByIndex(rowIndex: number): TableRow;
    _applyFilter(items: TableRow[]): void;
    activateCell(elem: TableCellElement): void;
    deactivateCell(elem: TableCellElement): void;
    compareRows(row1: TableRow, row2: TableRow): boolean;
    scrollToRow(row: TableRow): void;
    scrollToRowIndex(index: number): void;
    selectAndFocusRow(row: TableRow): void;
    _cellIsFocused(row: TableRow, column: TableColumn, elem: TableCellElement): boolean;
    clearSelection(): void;
    selectAll(): void;
    selectRow(row: TableRow, { range = false, add = false } = {}): void;
    onSelectRow(e: TableMouseEvent, d?: { value: TableRow }): void;
    onfocusRow(e: TableMouseEvent, d?: { value: TableRow }): void
    getRowIndex(row: TableRow): number;
    addSelection(item: TableRow): void;


    arrowLeft(e: KeyboardEvent): void;
    arrowRight(e: KeyboardEvent): void;
    arrowUp(e: KeyboardEvent): void;
    arrowDown(e: KeyboardEvent): void;
    home(e: KeyboardEvent): void;
    end(e: KeyboardEvent): void;
    pageUp(e: KeyboardEvent): void;
    pageDown(e: KeyboardEvent): void;
    enter(e: KeyboardEvent): void;
}
//table $pdp interface

interface TableMouseEvent extends MouseEvent {
    target: EventTarget & { item: TableRow };
    path: HTMLElement & {row: TableRow }[];
}

interface TableCellInfo{
    row: TableRow;
    column: TableColumn;
}

interface TableCellElement extends odaComponent {
    cellCoordinates: TableCellInfo;
    column: TableColumn;
    activate?: function;
    deactivate?: function;
    readOnly?: boolean;
    readonly?: boolean;
}

interface TableBody extends odaComponent{
    activeCell: TableCellElement;

    getFocusedCellElement(): TableCellElement;
    findCellByCoordinates({row: TableRow, column: TableColumn}): TableCellElement
}

interface TableRow {
    items?: TableRow[];
    disabled?: boolean;
    __group__?: boolean;
    __expanded__?: boolean;
    $allowSelection?: boolean;
    __parent__?: TableRow;
    type?: string;
    isGroup?: boolean;
    hide?: boolean;
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