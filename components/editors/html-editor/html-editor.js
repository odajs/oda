const distPath = import.meta.url.split('/').slice(0, -1).join('/') + '/dist/';

ODA({ is: 'oda-html-editor', imports: '@oda/code-editor',
    template: `
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                postiton: relative;
                opacity: 0;
            }
            iframe {
                border: {{showBorder?'1px solid var(--border-color)':'none'}};
                width: 100%;
                min-height: 80vh;
                display: flex;
                flex: 1;
            }
        </style>
        <iframe ~if="!readOnly && editMode && editType==='html'"></iframe>
        <oda-code-editor ~if="!readOnly && editMode && editType==='code'" show-gutter :src="value" mode="html" theme="solarized_light" font-size="12" class="flex" show-gutter="false" max-lines="Infinity" @change="codeValueChanged"></oda-code-editor>
        <div id="viewer" ~if="readOnly || !editMode" ~html="value || (readOnly ? '' : _value)" @dblclick="_dblClick"></div>
    `,
    $public: {
        editType: {
            $def: 'html',
            $list: ['html', 'code'],
            set(n) {
                this.init();
            }
        },
        editMode: {
            $def: false,
            set(n) {
                this.init();
            }
        },
        readOnly: {
            $def: false,
            set(n) {
                this.init();
            }
        },
        showBorder: false
    },
    value: '',
    _value: '',
    codeValueChanged(e) {
        this.value = e.detail.value;
    },
    _dblClick() {
        if (!this.value && !this.readOnly) {
            this.editMode = true;
            this.$render();
        }
    },
    async attached() {
        this.init();
    },
    init() {
        this.async(() => {
            if (!this.editMode || this.readOnly) {
                this.style.opacity = 1;
                return;
            }
            const iframe = this.$('iframe');
            if (iframe) {
                iframe.addEventListener('load', () => {
                    iframe.contentDocument.addEventListener('change', (e) => {
                        this.debounce('change', () => {
                            e.stopPropagation();
                            this.value = e.detail;
                            this.fire('change', this.value)
                        }, 300)
                    })
                    this.editor = iframe.contentDocument.editor;
                    this.editor.setData(this.value || '');
                    this.style.opacity = 1;
                })
                iframe.srcdoc = this.srcdoc(this.value || '');
            } else {
                this.style.opacity = 1;
            }
        })
    },
    srcdoc(src) {
        return `
<style>
    html::-webkit-scrollbar { width: 4px; height: 4px; } ::-webkit-scrollbar-track { -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); } ::-webkit-scrollbar-thumb { border-radius: 10px; }
</style>
<div id="editor" style="overflow: hidden">${src || this.src || ''}</div>
<script src="${distPath}ckeditor.js"></script>
<script>
let editor = CKEDITOR.replace('editor', { 
    versionCheck: false
    // readOnly: true
})
editor.on('change', (e) => {
    document.dispatchEvent(new CustomEvent('change', { detail: e.editor.getData() }));
})
editor.on('instanceReady', (e) => {
    if(e.editor.getCommand('maximize').state==CKEDITOR.TRISTATE_OFF) e.editor.execCommand('maximize');
})
document.editor = editor;
document.CKEDITOR = CKEDITOR;
</script>
        `
    }
})
