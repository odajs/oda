import '../../../components/grids/table/tree/tree.js';
ODA({ is: 'oda-jupyter-tree', extends: 'oda-tree',
    allowFocus: true,
    disallowFocusOnPointer: false,
    get dataSet() {
        return this.notebook?.items
    },
    onTapRows(e) {
        this.$super('oda-table', 'onTapRows', e);
        // const selector = `oda-jupyter-cell[id="${e.target.item.id}"]`;
        // this.jupyter.$(selector)?.scrollIntoView();
        const cellElements = this.jupyter.$$('oda-jupyter-cell');
        const cellElement = cellElements.find(el => el.cell.id === e.target.item.id);
        cellElement?.scrollIntoView();
    }
 });