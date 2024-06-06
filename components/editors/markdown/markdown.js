import './markdown-editor/markdown-editor.js';
import './markdown-viewer/markdown-viewer.js';
ODA({is: 'oda-markdown', imports: '@oda/splitter',
    template:`
        <style>
            :host{
                @apply --vertical;
                overflow-x: hidden;
                
            }
        
        </style>
        <div class="flex horizontal" style="height: 100%; position: relative;">
            <div ~if="editMode" class="horizontal" style="min-width: 120px; width: 50%;  position: relative;">
                <oda-markdown-editor flex ::value style="overflow: hidden"></oda-markdown-editor>
                <oda-splitter></oda-splitter>
            </div>
            <oda-markdown-viewer flex :value  @dblclick="editMode = true" style="text-wrap: wrap; padding: 8px; min-width: 120px; width: 0"></oda-markdown-viewer>
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
        editMode: false
    },
    get editor(){
        return this.$('oda-markdown-editor');
    },
    get viewer(){
        return this.$('oda-markdown-viewer');
    },
    attached(){

    }
})