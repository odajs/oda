ODA({ is: 'oda-chart', imports: './lib/chart.js',
    template: `
        <style>
            :host {
                display: flex;
                flex: 1;
                width: 100%;
                height: 100%;
            }
        </style>
        <div id="wrap" style="position: relative; flex: 1; max-width: 100%; max-height: 100%"></div>
    `,
    $public: {
        type: {
            $def: 'line',
            $list: ['line', 'bar', 'pie', 'radar', 'doughnut', 'polarArea'],
            $attr: true,
            // $save: true
        },
        data: undefined,
        options: {},
        src: {
            $def: '',
            set(n) {
                if (n) {
                    try { 
                        const src = JSON.parse(n);
                        this.data = src;
                    } catch (error) {}
                }
            },
            // $save: true
        },
        source: {
            get() {
                return this.data ? JSON.stringify(this.data) : this.src || '{}';
            },
            // $save: true
        }
    },
    get defaultOptions() { return { responsive: true, maintainAspectRatio: false } },
    $observers: {
        async chartChanged(type, data, options) {
            let wrap = this.$('#wrap');
            if (type && data && options && wrap) {
                wrap.innerHTML = '<canvas style="position: relative; flex: 1; max-width: 100%; max-height: 100%"></canvas>';
                this.async(() => {
                    const canvas = this.$?.('canvas');
                    // this.chart?.destroy();
                    const ctx = canvas.getContext('2d');
                    this.chart = new Chart(ctx, { type: this.type, data: this.data, options: { ...this.defaultOptions, ...this.options } });
                }, 300)
            }
        }
    }
})
