const path = import.meta.url.split('/').slice(0, -1).join('/');
ODA({
    is: 'oda-monaco-editor', import: '@oda/splitter', template: /*html*/`
    <link rel="stylesheet" data-name="vs/editor/editor.main" :href="cssHref" />
    <style>
        :host, :host > div {
            height: 100%;
            width: 100%;
        }
    </style>
    <div id="editor"></div>
    <script @load="_loaderReady" :src="loaderSrc"></script>
    `,
    get cssHref() {
        return `${path}/lib/min/vs/editor/editor.main.css`;
    },
    get loaderSrc() {
        return `${path}/lib/min/vs/loader.js`;
    },
    $public: {
        theme: {
            $type: String,
            $list: [
                'vs',
                'vs-dark',
                'hc-black',
            ],
            set(n, o) {
                if (this.editor) monaco.editor.setTheme(n);
            },
            $def: 'vs',
        },
        language: {
            $type: String,
            $list: [
                'bat', 'c', 'coffeescript', 'cpp', 'csharp', 'csp', 'css', 'dockerfile', 'fsharp',
                'go', 'handlebars', 'html', 'ini', 'java', 'javascript', 'json', 'less', 'lua', 'markdown',
                'msdax', 'mysql', 'objective-c', 'pgsql', 'php', 'plaintext', 'postiats', 'powershell',
                'pug', 'python', 'r', 'razor', 'redis', 'redshift', 'ruby', 'rust', 'sb', 'scss', 'sol',
                'sql', 'st', 'swift', 'typescript', 'vb', 'xml', 'yaml'
            ],
            set(n, o) {
                if (this.editor) monaco.editor.setModelLanguage(this.editor.getModel(), n);
            },
            $def: 'javascript',
        },
        readOnly: {
            $type: Boolean,
            set(n, o) {
                if (this.editor) this.editor.updateOptions({ readOnly: n });
            },
            $def: false,
        },
        value: {
            $type: String,
            set(n) {
                if (this.editor && n !== this.editor.getValue()) this.editor.setValue(n);
            }
        },
        externalLibrary: {
            $type: Array,
            $def: ['oda.d.ts']
        },
        preview: false
    },
    width: Number,
    editor: null,
    detached() {
        const monacoAriaContainer = document.body.querySelector('.monaco-aria-container');
        monacoAriaContainer?.remove();
    },
    _loaderReady() {
        const cnfg = require.getConfig();
        if(!cnfg.paths.vs) {
            require.config({ paths: { vs: `${path}/lib/min/vs` } });
            require(['vs/editor/editor.main'], async () => {
                // monaco.languages.registerCompletionItemProvider('javascript', {
                //     provideCompletionItems: async function(model, position) {
                //         const createDependencyProposals = (await import('./lib/monaco-oda.js')).default;
                //         return {
                //             suggestions: createDependencyProposals()
                //         };
                //     }
                // });
                // monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, libUri);
                await this._getExternalLibraryDefinitions();
                this._setEditor();

                require(['vs/base/browser/markdownRenderer'], async ({renderMarkdown}) => {
                    // const htmlResult = renderMarkdown({
                    //     value: samplemarkdownData
                    // }).innerHTML;
                });
            });
        } else {
            this._setEditor();
        }
    },
    async _getExternalLibraryDefinitions() {
        if (this.externalLibrary.length === 0) {
            return;
        }
        const _getDTSContent = async (name) => {
            return await (await fetch(`${path}/lib/types/${name}`)).text();
        };
        const promises = this.externalLibrary.map(libraryName => _getDTSContent(libraryName));
        const definitions = await Promise.all(promises);
        return definitions.map((def, idx) => (monaco.languages.typescript.javascriptDefaults.addExtraLib(def, `${this.externalLibrary[idx]}`)));
    },
    _setEditor() {
        this.editor = monaco.editor.create(this.$('#editor'), {
            automaticLayout: true,
            value: this.value || '',
            language: this.language,
            // folding: false,
            // lineNumbers: 'off',
            theme: this.theme,
            readOnly: this.readOnly
        });
        this.editor.getModel().onDidChangeContent((event) => {
            this.value = this.editor.getValue();
            this.fire('change', this.editor.getValue());
        });
    }
});