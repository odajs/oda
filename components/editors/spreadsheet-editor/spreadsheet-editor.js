const distPath = import.meta.url.split('/').slice(0, -1).join('/') + '/dist/';

ODA({ is: 'oda-spreadsheet-editor', imports: './dist/xspreadsheet.js',
    template: `
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                position: relative;
            }
        </style>
        <link rel="stylesheet" href="${distPath}xspreadsheet.css">
        <div></div>
    `,
    src: {
        $def: '',
        set(n) {
            if (this.isReady) this.setEditor();
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
    setEditor(src = this.src || this.defSrc) {
        this.editor ||= x_spreadsheet(this.$('div')).change(data => {
            this.fire('change', JSON.stringify(this.editor.getData()));
        })
        this.editor.loadData(JSON.parse(src));
        this.editor.validate();
    }
})
