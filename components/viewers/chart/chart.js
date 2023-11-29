ODA({ is: 'oda-chart', imports: './lib/chart.umd.min.js',
    template: `
        <style>
            :host {
                display: flex;
                flex: 1;
                width: 100%;
                height: 100%;
            }
        </style>
        <canvas style="position: relative; flex: 1; max-width: 100%; max-height: 100%"></canvas>
    `,
    $public: {
        type: {
            $def: 'line',
            $list: ['line', 'bar', 'pie', 'radar', 'doughnut', 'polarArea'],
            $attr: true,
            set(v) { this.init() }
        },
        data: { $type: Object, set(v) { this.init() } },
        options: { $type: Object, set(v) { this.init() } }
    },
    get defaultOptions() { return { responsive: true, maintainAspectRatio: false } },
    get canvas() {
        return this.$?.('canvas');
    },
    attached() {
        this.init()
    },
    init() {
        this.async(() => {
            if (this.canvas) {
                this.chart?.destroy() && this.chart.destroy();
                const ctx = this.canvas.getContext('2d');
                this.chart = new Chart(ctx, { type: this.type, data: this.data, options: { ...this.defaultOptions, ...this.options } });
            }
        }, 50)
    }
})
