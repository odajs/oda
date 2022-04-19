ODA({is: 'oda-markdown', imports: '../simplemde/simplemde.js, @oda/splitter2, @oda/md-viewer',
    template:`  
        <style>
            ::-webkit-scrollbar { width: 4px; height: 4px; }
            ::-webkit-scrollbar-track { -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); }
            ::-webkit-scrollbar-thumb { border-radius: 10px; background: var(--body-background); -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); }
            :host{
                @apply --horizontal;
                @apply --flex;
                min-height: 20px;
            }
        </style>
        <div style="display: flex; flex: 1; overflow: hidden;" ~style="{height: editMode ? '80vh' : '100%' }">
            <div ~if="editMode && type === 'simplemde'" style="width: 50%; overflow: hidden; position: relative">
                <oda-simplemde :value="src" @change="onchange" max-h="calc(80vh - 106px)"></oda-simplemde>
            </div>
            <oda-splitter2 ~if="editMode" size="3px"></oda-splitter2>
            <div class="flex" style="overflow: auto; flex: 1">
                <oda-md-viewer class="flex" :srcmd="source" :edit-mode="editMode && !readOnly" padding="0"></oda-md-viewer>
            </div>
        </div>
    `,
    props:{
        type:{
            default: 'simplemde',
            list: ['simplemde', 'Второй'],
            save: true
        }
    },
    src: '',
    set source(v) {
        if (v !== undefined && !this.src)
            this.src = v;
    },
    editMode: false,
    onchange(e) {
        this.source = e.detail.value;
    }
})
