const srcPath = import.meta.url.split('/').slice(0, -1).join('/') + '/src/';

ODA({ is: 'oda-html-editor', imports: './src/suneditor.min.js',
    template: `
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
            }
            .sun-editor {
                border: none;
            }
            .se-navigation, .se-resizing-bar {
                display: none!important;
            }
            .se-wrapper-code {
                min-height: 300px!important;
            }
        </style>
        <link :href rel="stylesheet">
        <div class="sun-editor-editable" ~if="!editMode" ~html="value"></div>
        <textarea id="html-editor" hidden></textarea>
    `,
    get href() {
        return srcPath + 'suneditor.min.css';
    },
    $public: {
        editMode: {
            $def: false,
            set(n) {
                this.init();
            }
        }
    },
    get value() {
        return this.editor?.getContet?.() || '';
    },
    setValue(v) {
        if (this.editor)
            this.editor.setContents(v);
    },
    async attached() {
        this.init();
    },
    init() {
        const ed = this.$('#html-editor');
        if (!ed || !this.editMode) {
            this.editor?.destroy();
            return;
        }
        this.editor = SUNEDITOR.create(ed, {
            maxHeight: '90vh',
            width: '100%',
            buttonList: [
                [
                    // 'undo', 'redo',
                    'formatBlock', 'font', 'fontSize',
                    'paragraphStyle', 'blockquote',
                    'bold', 'underline', 'italic', 'strike', 'subscript', 'superscript',
                    'fontColor', 'hiliteColor', 'textStyle',
                    'removeFormat',
                    'outdent', 'indent',
                    'align', 'horizontalRule', 'list', 'lineHeight',
                    'table', 'link', 'image', 'video', 'audio',
                    // 'math', // You must add the 'katex' library at options to use the 'math' plugin.
                    // 'imageGallery', // You must add the "imageGalleryUrl".
                    // 'fullScreen', 
                    'showBlocks', 'codeView',
                    // 'preview', 'print', 'save', 'template'
                ]
            ]
        })
        this.editor.setContents(this.value || '');
        this.editor.onChange = (e) => {
            this.value = e;
            this.fire('change', this.value);
        }
    }
})
