ODA({ is: 'oda-monaco',
    template: `
        <iframe style="border: none; width: 100%; height: 100%; overflow: hidden;"></iframe>
    `,
    props: {
        src: '',
        mode: {
            type: String,
            default: 'javascript',
            list: ['javascript', 'html', 'css', 'xml', 'json', 'markdown', 'python', 'php']
        },
        theme: {
            type: String,
            default: 'vs-dark',
            list: ['vs', 'vs-dark', 'vs-light']
        },
        fontSize: 16,
        wordWrap: true,
        readOnly: false,
        lineNumbers: 'on'
    },
    get value() { return this.editor?.getValue() },
    set value(v) { this.editor?.setValue(v || '') },
    get options() {
        return {
            language: this.mode || 'javascript',
            theme: this.theme || 'vs-dark',
            automaticLayout: true,
            lineNumbersMinChars: 3,
            mouseWheelZoom: true,
            fontSize: this.fontSize || 16,
            minimap: { enabled: false },
            wordWrap: this.wordWrap || true,
            // wordWrap: 'wordWrapColumn',
            // wordWrapColumn: 40,
            lineNumbers: this.lineNumbers || 'on',
            scrollBeyondLastLine: false,
            readOnly: this.readOnly || false,
            contextmenu: true,
            scrollbar: {
                useShadows: false,
                vertical: "visible",
                horizontal: "visible",
                horizontalScrollbarSize: 8,
                verticalScrollbarSize: 8
            }
        }
    },
    attached() {
        const iframe = this.$('iframe');
        iframe.src = URL.createObjectURL(new Blob([this.srcdoc], { type: 'text/html' }));
        setTimeout(() => {
            iframe.contentDocument.addEventListener("editor-ready", (e) => {
                this.editor = e.detail.editor;
                this.monaco = e.detail.monaco;
                this.updateOptions();
                this.value = this.src;


                iframe.onload = function() {
                    iframe.height = Math.max(
                      iframe.contentDocument.body.scrollHeight || 0,
                      iframe.contentDocument.body.offsetHeight || 0,
                      iframe.contentDocument.clientHeight  || 0,
                      iframe.contentDocument.scrollHeight  || 0,
                      iframe.contentDocument.offsetHeight  || 0
                    ) + 1000 + 'px';
                  };


            })
            setTimeout(() => iframe.contentDocument.addEventListener("change", (e) => this.fire('change', e.detail)), 300);
        }, 100);
    },
    observers: [
        function _src(src) {
            this.value = this.src || '';
        },
        function _props(mode, theme, fontSize, wordWrap, lineNumbers, readOnly) {
            this.updateOptions();
        }
    ],
    updateOptions() {
        if (!this.editor) return;
        this.editor.updateOptions(this.options);
        this.monaco.editor.setModelLanguage(this.editor.getModel(), this.options.mode || this.mode);
        this.value ||= this.src || '';
        this.editor.setValue(this.value);
    },
    get srcdoc() {
        return `
        <!doctype html>
        <html lang="en">
        <head>
        <meta charset="utf-8">
        <title>Monaco editor</title>
        <link rel="stylesheet" data-name="vs/editor/editor.main" href="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs/editor/editor.main.min.css">
        <style>
        html body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            max-height: 100%;
            overflow: hidden;
        }
        </style>
        </head>
        <body>
        <div id="container" style="height: 100vh; overflow: hidden"></div>
        <script>var require = { paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs' } }</script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs/loader.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs/editor/editor.main.nls.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs/editor/editor.main.js"></script>
        <script>
        const editor = monaco.editor.create(document.getElementById('container'), ${JSON.stringify(this.options)})
        setTimeout(() => document.dispatchEvent(new CustomEvent('editor-ready', { detail: { monaco, editor }})), 50);
        editor.getModel().onDidChangeContent((e) => {
            document.dispatchEvent(new CustomEvent('change', { detail: editor.getValue() }));
        })
        
        // https://github.com/brijeshb42/monaco-themes/tree/master/themes
        var data = 
        {
            "base": "vs",
            "inherit": true,
            "rules": [
              {
                "foreground": "CE9178",
                "token": "string"
              },
            ],
            "colors": {
            //   "editor.foreground": "#f8f8f2",
            "editor.background": "#ffffff",
            //   "editor.selectionBackground": "#44475a",
            //   "editor.lineHighlightBackground": "#44475a",
            //   "editorCursor.foreground": "#f8f8f0",
            //   "editorWhitespace.foreground": "#3B3A32",
            //   "editorIndentGuide.activeBackground": "#9D550FB0",
            //   "editor.selectionHighlightBorder": "#222218"
            }
          }
        monaco.editor.defineTheme('custom-theme', data);
        monaco.editor.setTheme('custom-theme');
        </script>
        </body>
        </html>
    `}
})
