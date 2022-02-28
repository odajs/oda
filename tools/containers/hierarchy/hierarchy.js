import '../base/base.js'
ODA({is: 'oda-hierarchy', extends: 'oda-tree', imports: '@oda/tree',
    template: `
    <slot hidden @slotchange="onSlot"></slot>
    `,
    props: {
        expandAll: true,
        component: {
            set(n) {
                this.dataSet = [{ name: n.localName, items: [{ name: n.$url }] }];
                this._source = [];
                this._getSource();
                //this.expandAll();
            },
            _source: []
        }
    },
    onSlot(e) {
        if (this.component) return;
        const els = e.target.assignedElements();
        if (!els.length) return;
        this.component = els[0];
    },
    _getSource(n = this.component.$core, i = this.dataSet[0].items) {
        if (n.prototype && n.prototype.parents && n.prototype.parents.map)
            n.prototype.parents.map(o => {
                if (o.prototype) {
                    if (o.prototype.url) {
                        this._source.push({ label: o.prototype.is, src: o.prototype.url, title: 'source code ' + o.prototype.is });
                        i.push({ name: o.prototype.is, items: [{ name: o.prototype.url }] });
                    }
                    this._getSource(o.prototype, i.items);
                }
            })
    }
})