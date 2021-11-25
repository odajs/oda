
import './lib/simplemde.min.js'

ODA({
    is: 'oda-simplemde',
    template: `
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css">
        <link rel="stylesheet" href="./lib/simplemde.min.css">
        <textarea ref="editor"></textarea>
    `,
    props: {
        src: { type: String, default: '' },
        item: {
            type: Object,
            set(n) {
                if (this.editor) {
                    this.editor.value(n?.value);
                    if (this.item)
                        this.item.htmlValue = this.editor.options.previewRender(this.editor.value()) || '';
                }
            },
        },
        value: {
            default: '',
            get() {
                return this.editor.options.previewRender(this.editor.value()) || '';
            },
            set(n) {
                if (this.editor) {
                    this.editor.value(n);
                    if (this.item)
                    this.item.htmlValue = this.editor.options.previewRender(this.editor.value()) || '';
                }
            }
        }
    },
    attached() {
        setTimeout(() => {
            this._update();
        }, 100);
    },
    _update() {
        this.editor = new SimpleMDE({
            element: this.$refs.editor,
            blockStyles: {
                bold: "__",
                italic: "_"
            },
            hideIcons: ['side-by-side', 'fullscreen'],
            renderingConfig: {
                singleLineBreaks: true,
                codeSyntaxHighlighting: true,
            },
            showIcons: ['code', 'table', 'strikethrough', 'clean-block', 'horizontal-rule'],
            spellChecker: false,
            status: false,
            tabSize: 4,
            toolbarTips: true,
        });
        this.value = this.item?.value || this.src || '';
        if (this.item)
            this.item.htmlValue = this.editor.options.previewRender(this.editor.value()) || '';
        this.editor.codemirror.on('change', () => {
            if (this.item) {
                this.item.htmlValue = this.editor.options.previewRender(this.editor.value()) || '';
                this.item.value = this.editor.value();
            }
        });
    }
})
