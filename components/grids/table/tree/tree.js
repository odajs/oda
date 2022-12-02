ODA({ is: 'oda-tree', imports: '@oda/table', extends: 'oda-table',
    props: {
        icon: 'icons:tree-structure',
        focusedNode: Object,
        autoWidth: true,
        keyName: 'name',
    },
    attached() {
        if (!this.columns?.length) this.columns = [{name: this.keyName, treeMode: true/*, $sort: 1*/}];
    },
    observers: [
        function setFocusedNode(focusedRow) {
            if (focusedRow !== this.focusedNode) {
                this.focusedNode = focusedRow;
            }
        },
        function setFocusedRow(focusedNode) {
            if (focusedNode !== this.focusedRow) {
                this.focusedRow = focusedNode;
            }
        }
    ],
    // async expandAll() {
    // },
    // async collapseAll() {
    // }
});