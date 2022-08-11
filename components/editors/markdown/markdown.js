ODA({is: 'oda-markdown', imports: '../simplemde/simplemde.js, @oda/splitter2, @oda/md-viewer, @oda/ace-editor',
    template:`  
        <style>
           :host{
                @apply --horizontal;
                @apply --flex;
                min-height: 20px;
            }
        </style>
        <div style="display: flex; flex: 1; overflow: hidden;" ~style="{height: editMode ? editHeight : '100%' }">
            <div ~if="editMode" style="width: 50%; overflow: hidden; position: relative">
                <oda-simplemde ~if="type==='simplemde'" :value="src" @change="onchange" :max-h></oda-simplemde>
                <oda-ace-editor ~if="type==='ace'" :src="src" @change="onchange" class="flex" highlight-active-line="false" show-print-margin="false" theme="solarized_light" mode="markdown" min-lines=1></oda-ace-editor></oda-ace-editor>
            </div>
            <oda-splitter2 ~if="editMode" size="3"></oda-splitter2>
            <div style="overflow-x: hidden; flex: 1">
                <oda-md-viewer ~if="fount" class="flex" :src="fount" :edit-mode="editMode && !readOnly" padding="0 2px"></oda-md-viewer>
                <oda-md-viewer ~if="!fount" class="flex" :srcmd="source" :edit-mode="editMode && !readOnly" padding="0 2px"></oda-md-viewer>
            </div>
        </div>
    `,
    props:{
        type:{
            default: 'simplemde',
            list: ['simplemde', 'ace'],
            set(n) {
                this.src = this.source;
            },
            save: true
        },
        editMode: {
            default: false,
            set(n) {
                this.src = this.source;
            }
        },
        label: '',
        editHeight: {
            default: '80vh',
            save: true
        },
        readOnly: false
    },
    src: '',
    fount: '',
    set source(v) {
        if (v !== undefined && !this.src)
            this.src = v;
    },
    onchange(e) {
        this.source = e.detail.value;
    },
    get maxH() {
        return `calc(${this.editHeight} - 106px)`;
    }
})
