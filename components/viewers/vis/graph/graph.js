import '../lib/vis-graph3d/dist/vis-graph3d.min.js';
ODA({ is: 'oda-graph', template: /*html*/`
        <style>
            :host > div {
                @apply --flex;
                height: 100%;
                border: 1px solid lightgray;
            }
        </style>
        <div ref="mygraph"></div>
    `,
    props: {
        _graph: {
            type: Object,
            default: {}
        },
        _data: Object,
        options: {
            type: Object,
            default: {
                width: '600px',
                height: '600px',
                style: 'surface',
                showPerspective: true,
                showGrid: true,
                showShadow: false,
                keepAspectRatio: true,
                verticalRatio: 0.5
            }
        }
    },
    attached() {
        this.data = this.data || new vis.DataSet();
        this._graph = new vis.Graph3d(this.$refs.mygraph, this.data, this.options);
    }
});