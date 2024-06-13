ODA({is: 'oda-html-editor', imports: '@oda/splitter, @oda/ace-editor, @oda/monaco-editor',
    template:`
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                position: relative;
            }
        </style>
        <div class="horizontal flex" style="width: 100%;">
            <div ~if="editMode" class="horizontal" style="min-width: 120px; position: relative;" ~style="{width: editMode && showPreview ? '50%' : '100%'}">
                <oda-ace-editor  ~if="type==='ace'" :src="value" @change="onchange" mode="html" theme="cobalt" font-size="12" class="flex" show-gutter="false" min-lines="3" max-lines="Infinity"></oda-ace-editor>                        
                <oda-monaco-editor ~if="type==='monaco'" :value @change="onchange" class="flex" theme="vs-dark" language="html"></oda-monaco-editor>
                <oda-splitter></oda-splitter>
            </div>
            <div ~if="!editMode || showPreview" class="vertical flex" style="overflow: auto;" @dblclick="_dblClick">
                <div ~html="value || (!editMode ? '<b><u>Double click for HTML edit...</u></b>' : '')" style="border: none; width: 100%;"></div>
            </div>
        </div>
    `,
    $public:{
        type:{
            $def: 'ace',
            $list: ['ace', 'monaco'],
            set(n) {
                this.src = this.value;
            }
        },
        showPreview: false,
        editMode: {
            $def: false,
            set(n){
                if (n) {
                    if(this.readOnly)
                        this.editMode = false
                    this.focus();
                }  
            }
        }
    },
    value: '',
    onchange(e) {
        this.value = e.detail.value;
    },
    focus() {
        this.async(() => {
            this.$('oda-ace-editor')?.focus();
        }, 500)
    },
    _dblClick() {
        // if (!this.value)
        this.editMode = !this.editMode;
    }
})
