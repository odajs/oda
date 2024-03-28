const PATH = import.meta.url.replace('simplemde-editor.js', '');
ODA({ is: 'oda-simplemde-editor', imports: './lib/simplemde.min.js', template: /*html*/`
    <style>
        :host { @apply --vertical; height: 100%; }
        .CodeMirror-wrap { height: 100%; min-height: 24px; }
        .editor-toolbar { display: flex; flex-wrap: wrap; }
    </style>
    <link rel="stylesheet" type="text/css" href="${PATH}lib/simplemde.min.css">
    <link rel="stylesheet" type="text/css" href="${PATH}lib/font-awesome.min.css">
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
    get scrollableElement() {
        return this.$('.CodeMirror-scroll') || undefined;
    },
    simpleMde: null,
    syncScrollWith: null,
    onScroll(e) {
        this.syncScrollWith.scrollTop = (this.scrollableElement.scrollTop / this.scrollableElement.scrollHeight) * this.syncScrollWith.scrollHeight;
    },
    async attached() {
        ['woff', 'woff2', 'eot'].forEach(format => {
            document.fonts.add(new FontFace('FontAwesome', `url(${PATH}lib/fonts/fontawesome-webfont.${format})`))
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
        if(this.syncScrollWith && this.scrollableElement)
            this.listen('scroll', 'onScroll', {target: this.scrollableElement});
    },
    detached() {
        this.unlisten('scroll', 'onScroll', {target: this.scrollableElement});
    }
})
