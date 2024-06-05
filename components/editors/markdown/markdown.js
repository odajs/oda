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
        <div class="horizontal flex">
            <div flex vertical ~if="editMode">
                <oda-markdown-editor ::value></oda-markdown-editor>
                <oda-splitter></oda-splitter>
            </div>
            <div flex vertical style="padding: 8px;" @dblclick="editMode = true">
                <oda-markdown-viewer style="min-width: 100%;" :value></oda-markdown-viewer>
            </div>
            
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