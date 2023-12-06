// docker run -i -t -d -p 8080:80 --restart=always -e JWT_ENABLED=false onlyoffice/documentserver
// docker run -i -t -d -p 8080:80 --restart=always -e JWT_SECRET=my_jwt_secret onlyoffice/documentserver
// docker run -i -t -d -p 8080:80 --restart=always -v .:/var/log/onlyoffice -v .:/var/www/onlyoffice/Data -v .:/var/lib/onlyoffice -v .:/var/lib/postgresql -e JWT_ENABLED=false onlyoffice/documentserver
// docker run -i -t -d -p 8080:80 --restart=always -v .:/var/log/onlyoffice -v .:/var/www/onlyoffice/Data -v .:/var/lib/onlyoffice -v .:/var/lib/postgresql -e JWT_SECRET=my_jwt_secret onlyoffice/documentserver

ODA({ is: 'oda-onlyoffice-editor',
    template: `
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                position: relative;
            }
        </style>
        <script type="text/javascript" src="http://localhost:8080/web-apps/apps/api/documents/api.js"></script>
    `,
    $public: {
        url: 'https://odajs.org/components/editors/onlyoffice-editor/demo/demo.docx',
        key: 'demo.docx',
        title: 'ODA Document',
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
        autosave: false,
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
                autosave: this.autosave || false,
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
                title: this.title || 'ODA Document',
                url: this.url
            },
            documentType: this.documentType || 'word',
            height: '100%',
            width: '100%',
            editorConfig: this.editorConfig,
            type: this.type || '',
            events: {
                onDocumentStateChange: (e) => this.onDocumentStateChange(e)
            }
        }
    },
    attached() {
        this.async(()=>{
            this.docEditor = new DocsAPI.DocEditor(this, this.config);
        }, 100)
    },
    onDocumentStateChange(e) {
        if (e.data) {
            console.log('The document changed');
        }
    }
})
// const srcdoc = () => {
//     return `
// <meta charset="UTF-8">
// <meta http-equiv="X-UA-Compatible" content="IE=edge">
// <meta name="viewport" content="width=device-width, initial-scale=1.0">
// <script type="text/javascript" src="http://localhost:8080/web-apps/apps/api/documents/api.js"></script>
// <title>ODA ONLYOFFICE Editor</title>
//
// <oda-onlyoffice-editor></oda-onlyoffice-editor>
//
// <script type="module">
//     import '../../../oda.js';
//     import './onlyoffice-editor.js';
// </script>
//
// `
// }