// docker run -i -t -d -p 8080:80 --restart=always -e JWT_ENABLED=false -v "d:\d":"/var/lib/onlyoffice/documentserver/App_Data/cache/files/" onlyoffice/documentserver

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
        <iframe class='flex' style="border: none"></iframe>      
    `,
    $public: {
        key: '',
        // url: 'https://odajs.org/components/editors/only-office/document.docx',
        // ooUrl: 'http://localhost:8080/',
        url: path + 'document.docx',
        get ooUrl() { return location.origin + '/docker/onlyoffice/' },
        get path() { return path },
        get apiUrl() { return this.ooUrl + 'web-apps/apps/api/documents/api.js' },
        get commandServiceUrl() { return this.ooUrl + 'coauthoring/CommandService.ashx' },
        title: '',
        mode: {
            $def: 'edit',
            $list: ['view', 'edit']
        },
        ext: {
            $def: '',
            $list: ['djvu', 'doc', 'docm', 'docx', 'docxf', 'dot', 'dotm', 'dotx', 'epub', 'fb2', 'fodt', 'htm', 'html', 'mht', 'mhtml', 'odt', 'oform', 'ott', 'oxps', 'pdf', 'rtf', 'stw', 'sxw', 'txt', 'wps', 'wpt', 'xml', 'xps', 'csv', 'et', 'ett', 'fods', 'ods', 'ots', 'sxc', 'xls', 'xlsb', 'xlsm', 'xlsx', 'xlt', 'xltm', 'xltx', 'xml', 'dps', 'dpt', 'fodp', 'odp', 'otp', 'pot', 'potm', 'potx', 'pps', 'ppsm', 'ppsx', 'ppt', 'pptm', 'pptx', 'sxi']
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
            $list: ['en', 'ru', 'de', 'fr'],
            get() {
                return ODA.language.split('-')[0];
            }
        },
        region: {
            $def: 'ru-RU',
            $list: ['en-US', 'ru-RU', 'de-DE', 'fr-FR'],
            get() {
                return ODA.language
            }
        },
        userName: '',
        userID: '',
        callbackUrl: ''
    },
    get fileType() {
        this.ext ||= this.url?.split('.').at(-1).split('?')[0];
        return this.ext;
    },
    get documentType() {
        return Object.keys(types).map(key => {
            if (types[key].includes(this.ext))
                return key;
        }).filter(Boolean)[0];
    },
    get types() {
        return types;
    },
    get editorConfig() {
        return {
            customization: {
                autosave: this.autosave,
                // forcesave: true,
                comments: false,
                compactHeader: this.compactHeader || false,
                compactToolbar: this.compactToolbar || false
            },
            mode: this.mode || 'edit',
            lang: this.lang || 'ru',
            region: this.region || 'ru-RU',
            user: {
                id: this.userID || '',
                name: this.userName || 'anonymous'
            },
            callbackUrl: this.callbackUrl || ''
        }
    },
    get config() {
        return {
            document: {
                fileType: this.fileType || 'docx',
                key: this.key || '',
                title: this.title || 'document.' + this.fileType,
                url: this.url,
                permissions: {
                    chat: true,
                    copy: true,
                    deleteCommentAuthorOnly: false,
                    download: true,
                    edit: true,
                    editCommentAuthorOnly: false,
                    fillForms: true,
                    modifyContentControl: true,
                    modifyFilter: true,
                    print: true,
                    protect: true,
                    review: true
                }
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
        this.init()
    },
    init() {
        // if (this.iframe)
        //     return;
        this.iframe = this.$('iframe');
        this.iframe.addEventListener('load', () => {
            this.docEditor = new this.iframe.contentWindow.DocsAPI.DocEditor('placeholder', this.config);
        })
        const blob = new Blob([html(this.apiUrl)], { type: 'text/html' });
        this.iframe.src = URL.createObjectURL(blob);
    },
    _onDocumentStateChange(e) {
        this.isChanged = true;
    }
})

const types = {
    // word: 'djvu,doc,docm,docx,docxf,dot,dotm,dotx,epub,fb2,fodt,htm,html,mht,mhtml,odt,oform,ott,oxps,pdf,rtf,stw,sxw,txt,wps,wpt,xml,xps'.split(','),
    word: 'djvu,doc,docm,docx,docxf,dot,dotm,dotx,epub,fb2,fodt,odt,oform,ott,oxps,pdf,rtf,stw,sxw,txt,wps,wpt,xps'.split(','),
    cell: 'csv,et,ett,fods,ods,ots,sxc,xls,xlsb,xlsm,xlsx,xlt,xltm,xltx,xml'.split(','),
    slide: 'dps,dpt,fodp,odp,otp,pot,potm,potx,pps,ppsm,ppsx,ppt,pptm,pptx,sxi'.split(',')
}

const html = (apiUrl) => {
    return `
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style> body { margin: 0; padding: 0; }</style>
<script type="text/javascript" src="${apiUrl}"></script>
<div style="height: 100%; width: 100%; position: relative;" id="placeholder"></div>
`
}
