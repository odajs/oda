const url = import.meta.url;
ODA({ is: 'oda-simplemde-editor', imports: './lib/simplemde.min.js',
    template: `
        <style>
            :host { @apply --vertical; height: 100%; }
            .CodeMirror-wrap { height: 100%; min-height: 24px; }
        </style>
        <link rel="stylesheet" :href="path + 'lib/simplemde.min.css'">
        <link rel="stylesheet" type="text/css" :href="path + 'lib/font-awesome.min.css'">
        <textarea></textarea>
    `,
    $public: {
        value: {
            $type: String,
            set(n) {
                if (this.simpleMde) this.simpleMde.value(n);
            }
        }
    },
    get path() {
        return url.replace('simplemde-editor.js', '');
    },
    get element() {
        return this.$?.('textarea');
    },
    async attached() {
        this.async(() => {
            this.init();
        }, 10)
    },
    init() {
        if (!this.element) return;
        this.async(() => {
            this.simpleMde ||= new SimpleMDE({
                element: this.element,
                spellChecker: false,
                toolbar: [
                    'bold', 'italic', "heading", 'strikethrough', '|',
                    'quote', 'unordered-list', 'ordered-list', 'horizontal-rule', '|',
                    'code', 'table', 'link', 'image', '|',
                    //'preview'/*, 'side-by-side'*/
                ],
                codeSyntaxHighlighting: true
            })
            this.simpleMde.codemirror.on("change", () => this.fire('change', this.simpleMde.value()));
            if (this.value) this.simpleMde.value(this.value);
        })
    }
})
