import 'https://cdn.jsdelivr.net/npm/chart.js@2.9.4/dist/Chart.min.js';
ODA({
    is: 'oda-chart', template: `
        <style>
            :host {
                display: flex;
                flex: 1;
                width: 100%;
            }
        </style>
        <div ref="canvas" style="position:relative; flex:1; max-width:100%"></div>   
    `,
    props: {
        type: {
            default: 'line',
            list: ['line', 'bar', 'pie', 'radar', 'doughnut', 'polarArea']
        },
        data: Object,
        options: Object,
    },
    get defaultOptions() { return { responsive: true, maintainAspectRatio: false } },
    observers: [
        function createChart(type, data, options) {
            if (!this.$refs?.canvas) return;
            if (this.chart?.destroy) {
                this.chart.destroy();
                this.$refs.canvas.removeChild(this.canvas);
            }
            this.canvas = document.createElement('canvas');
            this.$refs.canvas.appendChild(this.canvas);
            const ctx = this.canvas.getContext('2d');
            this.chart = new Chart(ctx, { type, data, options: { ...this.defaultOptions, ...options } });
        }
    ]
})
