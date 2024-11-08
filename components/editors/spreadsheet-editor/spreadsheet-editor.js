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
    src: {
        $def: '',
        set(n) {
            if (this.isReady) {
                this.editor = undefined;
                this.setEditor();
            }
        }
    },
    defSrc: `[
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
    isReady: false,
    attached() {
        this.isReady = true;
        this.setEditor();
    },
    setEditor() {
        if (this.editor) return;
        const iframe = this.$('iframe');
        if (iframe) {
            iframe.onload = () => {
                iframe.contentDocument.addEventListener("change", (e) => {
                    this.fire('change', e.detal);
                })
                this.editor = iframe.contentWindow.xspreadsheet;
            }
            iframe.srcdoc = this.srcdoc(this.src || this.defSrc);
        }
    },
    srcdoc(src) {
        return `
<link rel="stylesheet" href="${distPath}xspreadsheet.css">
<script src="${distPath}xspreadsheet.js"></script>

<div id="xspreadsheet"></div>

<script>
    window.xspreadsheet = x_spreadsheet('#xspreadsheet')
        .loadData(${src})
        .change(data => {
            document.dispatchEvent(new CustomEvent('change', { detail: JSON.stringify(window.xspreadsheet.getData()) }));
        })
        window.xspreadsheet.validate();
</script>
        `
    }
})
