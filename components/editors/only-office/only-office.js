const path = import.meta.url.split('only-office.js')[0];
ODA({ is: 'oda-only-office',
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
    $public: {
        apiUrl: 'https://docker-office.odant.org/web-apps/apps/api/documents/api.js',
        url: path + 'document.docx',
        // url: 'https://odajs.org/components/editors/onlyoffice-editor/demo/demo.docx',
        key: '',
        title: '',
        mode: {
            $def: 'edit',
            $list: ['view', 'edit']
        },
        documentType: {
            $def: 'word',
            $list: ['word', 'cell', 'slide']
        },
        fileType: {
            $def: 'docx',
            $list: ['.djvu', '.doc', '.docm', '.docx', '.docxf', '.dot', '.dotm', '.dotx', '.epub', '.fb2', '.fodt', '.htm', '.html', '.mht', '.mhtml', '.odt', '.oform', '.ott', '.oxps', '.pdf', '.rtf', '.stw', '.sxw', '.txt', '.wps', '.wpt', '.xml', '.xps', '.csv', '.et', '.ett', '.fods', '.ods', '.ots', '.sxc', '.xls', '.xlsb', '.xlsm', '.xlsx', '.xlt', '.xltm', '.xltx', '.xml', '.dps', '.dpt', '.fodp', '.odp', '.otp', '.pot', '.potm', '.potx', '.pps', '.ppsm', '.ppsx', '.ppt', '.pptm', '.pptx', '.sxi']
        },
        autosave: true,
        compactHeader: false,
        compactToolbar: false,
        type: {
            $def: 'desktop',
            $list: ['desktop', 'embedded', 'mobile']
        },
        lang: {
            $def: 'ru',
            $list: ['en', 'ru', 'de', 'fr']
        },
        region: {
            $def: 'ru-RU',
            $list: ['en-US', 'ru-RU', 'de-DE', 'fr-FR']
        }
    },
    get words() { return '.djvu, .doc, .docm, .docx, .docxf, .dot, .dotm, .dotx, .epub, .fb2, .fodt, .htm, .html, .mht, .mhtml, .odt, .oform, .ott, .oxps, .pdf, .rtf, .stw, .sxw, .txt, .wps, .wpt, .xml, .xps' },
    get cells() { return '.csv, .et, .ett, .fods, .ods, .ots, .sxc, .xls, .xlsb, .xlsm, .xlsx, .xlt, .xltm, .xltx, .xml' },
    get slides() { return '.dps, .dpt, .fodp, .odp, .otp, .pot, .potm, .potx, .pps, .ppsm, .ppsx, .ppt, .pptm, .pptx, .sxi' },
    get editorConfig() {
        return {
            customization: {
                autosave: this.autosave,
                comments: false,
                compactHeader: this.compactHeader || false,
                compactToolbar: this.compactToolbar || false
            },
            mode: this.mode || 'edit',
            lang: this.lang || 'ru',
            region: this.region || 'ru-RU',
            // callbackUrl : ''
        }
    },
    get config() {
        return {
            document: {
                fileType: this.fileType || 'docx',
                key: this.key || '',
                title: this.title || 'document.' + this.fileType,
                url: this.url
            },
            documentType: this.documentType || 'word',
            height: '100%',
            width: '100%',
            editorConfig: this.editorConfig,
            type: this.type || '',
            events: {
                onDocumentStateChange: (e) => this._onDocumentStateChange(e)
            }
        }
    },
    attached() {
        this.iframe = this.$('iframe');
        this.iframe.addEventListener('load', () => {
            this.docEditor = new this.iframe.contentWindow.DocsAPI.DocEditor('placeholder', this.config);
        })
        const blob = new Blob([html(this.apiUrl)], { type: 'text/html' });
        this.iframe.src = URL.createObjectURL(blob);
    },
    _onDocumentStateChange(e) {
        // console.log(e);
        this.isChanged = true;
    }
})

const html = (apiUrl) => {
    return `
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script type="text/javascript" src="${apiUrl}"></script>
<div style="height: 100%; width: 100%; position: relative;" id="placeholder"></div>
`
}
