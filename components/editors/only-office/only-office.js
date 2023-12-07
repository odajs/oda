const path = import.meta.url.split('only-office.js')[0];
ODA({
    is: 'oda-only-office',
    template: `
        <style>
            :host{
                @apply --vertical;
                position: relative;
                @apply --flex;
            }
        </style>
        <iframe class='flex'></iframe>      
    `,
    get url() {
        // return 'https://odajs.org/components/editors/onlyoffice-editor/demo/demo.docx';
        return path + 'document.docx';
    },
    key: '',
    attached() {
        this.iframe = this.$('iframe');
        this.iframe.addEventListener('load', () => {
            this.docEditor = new this.iframe.contentWindow.DocsAPI.DocEditor('placeholder',
                {
                    "document": {
                        "fileType": "docx",
                        "key": this.key || '', // this.url.split('/').pop(),
                        "title": this.url.split('/').pop(),
                        "url": this.url
                    },
                    "documentType": "word"
                }
            )
        })
        this.iframe.src = path + 'frame.html';
    }
})
