import './markdown-editor/markdown-editor.js';
import './markdown-viewer/markdown-viewer.js';
ODA({is: 'oda-markdown', imports: '@oda/splitter',
    template:`
        <style>
            :host{
                @apply --vertical;
                @apply --flex;
                border: {{showBorder?'1px solid var(--border-color)':'none'}};
                overflow: hidden;
            }
            oda-markdown-viewer {
                width: {{editMode ? '50%': 'unset'}};
                margin: 0 8px;
            }
        </style>
        <div class="flex horizontal">
            <div ~if="editMode && !readOnly" class="horizontal no-flex" style="max-height: 80vh; min-width: 120px; width: 50%">
                <oda-markdown-editor flex style="overflow: hidden" @change="onChange"></oda-markdown-editor>
                <oda-splitter></oda-splitter>
            </div>
            <oda-markdown-viewer flex :value="value || (!readOnly && !editMode ? _value : '')"  @dblclick="_dblClick" ~style="{maxHeight: editMode?'80vh':''}" style="overflow-y: auto; text-wrap: wrap; min-width: 120px;"></oda-markdown-viewer>
        </div>
    `,
    $public:{
        value: '',
        _value: '',
        url:{
            $type: String,
            async set(n) {
                this.value = await fetch(n).then(r => r.text());
            }
        },
        editMode: {
            $def: false,
            set(n){
                this._isReady = false;
                if (n) {
                    this.async(() => {
                        const editor = this.$('oda-markdown-editor');
                        if (editor) {
                            editor.value = this.value || '';
                            editor.focus();
                            this._isReady = true;
                        }
                    }, 100)
                }
            }
        },
        readOnly: false,
        showBorder: false
    },
    focus() {
        this.async(() => {
            this.$('oda-markdown-editor')?.focus();
        }, 300)
    },
    get editor(){
        return this.$('oda-markdown-editor');
    },
    get viewer(){
        return this.$('oda-markdown-viewer');
    },
    _dblClick() {
        if (!this.value && !this.readOnly)
            this.editMode = true;
    },
    onChange(e) {
        const val = e.detail.value;
        if (this._isReady && this.value !== val) {
            this.value = val || '';
            this.fire('change', this.value);
        }
    },
    async exportValue() {
        const viewer = this.$('oda-markdown-viewer');
        return await viewer.exportValue();
    }
})