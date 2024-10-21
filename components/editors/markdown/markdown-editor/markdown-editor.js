const PATH = import.meta.url.replace('markdown-editor.js', '');
ODA({ is: 'oda-markdown-editor', imports: './lib/simplemde.min.js', template: /*html*/`
    <style>
        :host {
            @apply --vertical;
        }
        .CodeMirror{
            padding: 0px 0px 4px 0px;
        }
        .CodeMirror-wrap {
            min-height: 24px; 
            height: 100%;
        }
        .CodeMirror-scroll {
            min-height: 0px; 
        }
        .CodeMirror-hscrollbar {
            display: none!important;
        }
        .editor-toolbar { 
            display: flex;
            position: sticky;
            flex-wrap: wrap;
            top: 0;
            border: none;
            border-bottom: 1px solid gray;
            background: white;
        }
    </style>
    <link rel="stylesheet" type="text/css" href="${PATH}lib/simplemde.min.css">
    <link rel="stylesheet" type="text/css" href="${PATH}lib/font-awesome.min.css">
    <textarea></textarea>
    `,
    $public: {
        status: false,
        url:{
            $type: String,
            async set(n) {
                this.value = await fetch(n).then(r => r.text());
            }
        },
        value: {
            $type: String,
            set(n) {
                if (!this.isReady && this.simpleMde && this.simpleMde.value() !== n) {
                    this.isReady = true;
                    this.simpleMde.value(n);
                }
            },
            get() {
                return this.simpleMde.value();
            }
        },
        autofocus: {
            $def: false,
            $attr: true
        }
    },
    get toolBar() {
        return this.$('.editor-toolbar');
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
            status: this.status,
            toolbar: [
                // "heading-1", 'heading-2', 'heading-3', 'heading-smaller', 'heading-bigger', 'bold', 'italic', '|',
                "heading", 'bold', 'italic', '|',
                'quote', 'unordered-list', 'ordered-list', 'horizontal-rule', '|',
                'code', 'table', 'link', 'image', '|', 'clean-block'
            ],
            renderingConfig: {
                codeSyntaxHighlighting: true
            },
            autofocus: this.autofocus
        })
        if (this.value) this.simpleMde.value(this.value);

        this.simpleMde.codemirror.on('change', () => {
            this.value = undefined;
            this.fire('change', this.value)
        });

        if (this.syncScrollWith && this.scrollableElement)
            this.listen('scroll', 'onScroll', { target: this.scrollableElement });

        if (this.autofocus)
            this.simpleMde.codemirror.on('focus', this.focus);
    },
    focus() {
        this.simpleMde.codemirror.focus();
    },
    detached() {
        this.unlisten('scroll', 'onScroll', { target: this.scrollableElement });
        this.simpleMde.codemirror.off('focus', this.focus);
    }
})
