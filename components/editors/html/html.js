ODA({is: 'oda-html', imports: '@oda/pell-editor, @oda/splitter2',
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
            <oda-pell-editor ~if="editMode && type === 'pell'" style="width: 50%; overflow: auto;" :src @change="onchange"></oda-pell-editor>
            <oda-splitter2 ~if="editMode" size="3px"></oda-splitter2>
            <div ~html="source || ''" style="flex: 1; overflow: auto"></div>
        </div>
    `,
    props:{
        type:{
            default: 'pell',
            list: ['pell', 'Второй'],
            save: true,
            set(v) {
                this.src = this.source;
            }
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
