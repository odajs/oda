// https://simplemde.com/
// https://github.com/sparksuite/simplemde-markdown-editor

ODA({ is: 'oda-simplemde', imports: './dist/simplemde.min.js',
    template: /*html*/`
        <style>
            :host {
                @apply --flex;
                height: 100%;
            }
            .CodeMirror,
            .CodeMirror-scroll {
                max-height: {{maxH}};
            }
        </style>
        <link rel="stylesheet" :href="path + 'dist/simplemde.min.css'">
        <link rel="stylesheet" type="text/css" :href="path + 'dist/font-awesome.min.css'">
        <textarea ref="mde"></textarea>
    `,
    props: {
        simpleMde: Object,
        value: {
            type: String,
            set(n) {
                if (this.simpleMde) this.simpleMde.value(n);
            }
        },
        maxH: {
            default: '',
            save: true
        }
    },
    get path() {
        return this.$url.replace('simplemde.js', '');
    },
    async attached() {
        this.simpleMde = new SimpleMDE({
            element: this.$refs.mde,
            spellChecker: false,
            toolbar: [
                'bold', 'italic', "heading", 'strikethrough', '|',
                'quote', 'unordered-list', 'ordered-list', 'horizontal-rule', '|',
                'code', 'table', 'link', 'image', '|',
                'preview'/*, 'side-by-side'*/
            ],
            codeSyntaxHighlighting: true
        });
        if (this.value) this.simpleMde.value(this.value);
        this.simpleMde.codemirror.on("change", () => this.fire('change', this.simpleMde.value()));
    }
});