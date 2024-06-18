import '../../../components/grids/table/tree/tree.js';
ODA({ is: 'oda-jupyter-tree', extends: 'oda-tree',
    get dataSet() {
        return this.notebook?.items
    },
    attached() {
        this.jupyter.addEventListener('changed', (e) => {
            this.async(()=>{ this.items = undefined; });
        });
    }
 });