
const libPath = import.meta.url.split('/').slice(0, -1).join('/') + '/lib/';

ODA({ is: 'oda-canvas-table',
    template: `
        <style>
            :host {
                overflow: hidden;
                position: relative;
                height: 100%;
            }
            iframe {
                border: none;
                outline: none;
                padding: 0;
                margin: 0;
                width: 100%;
                height: 100%;
            }
        </style>
        <iframe></iframe>
    `,
    attached() {
        this.async(() => {
            this.iframe = this.$('iframe');
            this.iframe.addEventListener("load", async () => {
                const doc = this.iframe.contentDocument;
                this.grid = doc.$grid.grid;
                this.grid.header = this.header;
                this.grid.records = this.records;
                this.grid.frozenColCount = this.frozenColCount;
                const materialDesignTheme = doc.$grid.cheetahGrid.themes.MATERIAL_DESIGN;
                this.grid.theme = materialDesignTheme.extends({
                    defaultBgColor({ row, grid }) {
                        return row % 2 ? null : "#f5f5f5";
                    }
                })
                setTimeout(() => this.isReady = true, 100);
            })
            this.iframe.srcdoc = srcDoc;
        }, 100)
    }
})

const srcDoc = `
<style>
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: #f0f0f0; }
    ::-webkit-scrollbar-thumb { background-color: #d0d0d0; }
    html, body { margin: 0; padding: 0; width: 100%; height: 100%; position: relative; }
</style>
<div id="grid" style="height: 100%;"></div>
<script type="module">
    import '${libPath}/cheetahGrid.es5.min.js';
    const grid = new cheetahGrid.ListGrid({
        parentElement: document.querySelector("#grid")
    })
    document.$grid = { grid, cheetahGrid };
</script>
`
