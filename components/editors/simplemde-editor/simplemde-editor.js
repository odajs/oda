const url = import.meta.url;
ODA({ is: 'oda-simplemde-editor', imports: './lib/simplemde.min.js', template: /*html*/`
        <style>
            :host { @apply --vertical; height: 100%; }
            .CodeMirror-wrap { height: 100%; min-height: 24px; }
            .editor-toolbar { display: flex; flex-wrap: wrap; }
        </style>
        <link rel="stylesheet" type="text/css" :href="path + 'lib/simplemde.min.css'">
        <link rel="stylesheet" type="text/css" :href="path + 'lib/font-awesome.min.css'">
        <textarea></textarea>
    `,
    $public: {
        value: {
            $type: String,
            set(n) {
                if (this.simpleMde && this.simpleMde.value() !== n) this.simpleMde.value(n);
            },
            get() {
                return this.simpleMde.value();
            }
        }
    },
    get path() {
        return url.replace('simplemde-editor.js', '');
    },
    async attached() {
        ['woff', 'woff2', 'eot'].forEach(format => {
            document.fonts.add(new FontFace('FontAwesome', `url(${this.path}/lib/fonts/fontawesome-webfont.${format})`))
        })
        this.simpleMde ??= new SimpleMDE({
            autoDownloadFontAwesome: false,
            element: this.$('textarea'),
            spellChecker: false,
            toolbar: [
                "heading-1", 'heading-2', 'heading-3', 'heading-smaller', 'heading-bigger', 'bold', 'italic', '|',
                'quote', 'unordered-list', 'ordered-list', 'horizontal-rule', '|',
                'code', 'table', 'link', 'image', '|', 'clean-block'
            ],
            renderingConfig: {
                codeSyntaxHighlighting: true
            }
        })
        this.simpleMde.codemirror.on('change', () => this.fire('change', this.simpleMde.value()));
        if (this.value) this.simpleMde.value(this.value);
    }
})
