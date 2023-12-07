const path = import.meta.url.split('only-office.js')[0] + 'frame.html';
ODA({ is: 'oda-only-office',
    template: `
        <style>
            :host{
                @apply --vertical;
                position: relative;
                @apply --flex;
            }
        </style>
        <iframe class="flex"></iframe>      
    `,
    get url() {
        return "https://odajs.org/components/editors/onlyoffice-editor/demo/demo.docx";
    },
    attached() {
        this.iframe = this.$('iframe');
        this.iframe.addEventListener('load', () => {
            this.docEditor = new this.iframe.contentWindow.DocsAPI.DocEditor("placeholder",
                {
                    "document": {
                        "fileType": "docx",
                        "url": this.url,
                        "title": this.url.split('/').pop(),
                    },
                    "documentType": "word",
                    // "type": "embedded",
                    "editorConfig": {
                        // "mode": 'view',
                    }
                }
            )
        })
        this.iframe.src = path;
    }
})
