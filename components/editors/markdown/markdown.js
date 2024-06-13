import './markdown-editor/markdown-editor.js';
import './markdown-viewer/markdown-viewer.js';
ODA({is: 'oda-markdown', imports: '@oda/splitter',
    template:`
        <style>
            :host{
                @apply --vertical;
                overflow-x: hidden;
            }
            oda-markdown-viewer {
                width: {{editMode ? 0 : 'unset'}};
                margin: {{editMode ? '32px 8px 0px 8px' : '0 8px'}};
            }
        </style>
        <div class="flex horizontal">
            <div ~if="editMode" class="horizontal" style="min-width: 120px; width: 50%;  position: relative;">
                <oda-markdown-editor flex ::value style="overflow: hidden"></oda-markdown-editor>
                <oda-splitter></oda-splitter>
            </div>
            <oda-markdown-viewer flex :value="value || (!editMode ? '<b><u>Double click for Markdown edit...</u></b>' : '')"  @dblclick="_dblClick" style="text-wrap: wrap; min-width: 120px;"></oda-markdown-viewer>
        </div>
    `,
    $public:{
        value: '',
        url:{
            $type: String,
            async set(n) {
                this.value = await fetch(n).then(r => r.text());
            }
        },
        editMode: {
            $def: false,
            set(n){
                if (n) {
                    if(this.readOnly)
                        this.editMode = false
                    this.focus();
                }  
            }
        },
        readOnly: false
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
        // if (!this.value)
        this.editMode = !this.editMode;
    }
})