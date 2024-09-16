interface Table extends odaComponent {
    table: Table;
    $height: number;
    rowHeight: number;
    $scrollTop: number;
    doubleClickFocusMode: boolean;
    allowSelection: 'all' | 'level' | 'type' | 'none';
    selectedRows: TableRow[];
    headerColumns: TableColumn[];
    filter: string;
    columnId: string;
    items: TableRow[];
    filteredItems: TableRow[];
    columns: TableColumn[];
    rowColumns: TableColumn[];

    focusRow(e: MouseEvent): void;
    _applyFilter(items: TableRow[]);
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