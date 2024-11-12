const distPath = import.meta.url.split('/').slice(0, -1).join('/') + '/dist/';

ODA({ is: 'oda-spreadsheet-editor',
    template: `
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                position: relative;
            }
        </style>
        <iframe style="border: none; width: 100%; height: 100%;"></iframe>
    `,
    value: {
        $def: '',
        set(v) {
            if (this.mode === 'read') {
                this.setEditor();
            }
        }
    },
    defValue: `[
        {
            "name": "sheet1"
        },
        {
            "name": "sheet2"
        },
        {
            "name": "sheet3"
        }
    ]`,
    $public: {
        mode: {
            $def: 'edit',
            $list: ['edit', 'read'],
            set(n) {
                this.setEditor();
            }
        },
        showToolbar: {
            $def: true,
            set(n) {
                this.setEditor();
            }
        },
        showGrid: {
            $def: true,
            set(n) {
                this.setEditor();
            }
        }
    },
    isReady: false,
    attached() {
        this.setEditor();
    },
    setEditor() {
        const iframe = this.$('iframe');
        if (iframe) {
            this.async(() => {
                iframe.onload = () => {
                    iframe.contentDocument.addEventListener("change", (e) => {
                        this.value = e.detail;
                        this.fire('change', e.detal);
                    })
                    iframe.contentDocument.addEventListener("pointerdown", (e) => {
                        this.fire('sheet-tap');
                    })
                    this.editor = iframe.contentWindow.xspreadsheet;
                }
                const opt = {
                    mode: this.mode,
                    showToolbar: this.showToolbar,
                    showGrid: this.showGrid
                }
                iframe.srcdoc = this.srcdoc(this.value || this.defValue, opt);
            })
        }
    },
    srcdoc(value, options) {
        return `
<link rel="stylesheet" href="${distPath}xspreadsheet.css">
<script src="${distPath}xspreadsheet.js"></script>

<div id="xspreadsheet"></div>

<script>
    window.xspreadsheet = x_spreadsheet('#xspreadsheet', ${JSON.stringify(options)})
        .loadData(${value})
        .change(data => {
            document.dispatchEvent(new CustomEvent('change', { detail: JSON.stringify(window.xspreadsheet.getData()) }));
        })
        document.dispatchEvent(new Event('pointerdown'));
        window.xspreadsheet.validate();
</script>
        `
    }
})
