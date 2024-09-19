ODA({is: 'oda-tree', imports: '@oda/table', extends: 'oda-table',
    $public: {
        icon: 'icons:tree-structure',
        focusedRow: Object,
        autoWidth: true,
        keyName: 'name',
        disableColumnsSave: true,
    },
    get columns() {
        return [{ name: this.keyName, treeMode: true }];
    }
});