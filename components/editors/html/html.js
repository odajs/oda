ODA({ is: 'oda-html', imports: '@oda/pell-editor, @oda/splitter2',
    template: `  
        <style>
            :host{
                @apply --horizontal;
                @apply --flex;
                min-height: 20px;
            }
        </style>
        <div style="display: flex; flex: 1; overflow: hidden;" ~style="{height: editMode ? editHeight : '100%' }">
            <div ~if="editMode" ~is="editors[type] || 'div'" style="width: 50%; overflow: auto;" :src @change="onchange"></div>
            <oda-splitter2 ~if="isReady && editMode" size="3"></oda-splitter2>
            <div ~html="source || ''" style="flex: 1; overflow: auto"></div>
        </div>
    `,
    props: {
        type: {
            default: 'pell',
            list: ['pell', 'ace'],
            save: true,
            set(v) {
                this.isReady = false,
                this.src = this.source;
                this.async(() => this.isReady = true, 100);
            }
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
        }
    },
    get editors() {
        return {
            pell: 'oda-pell-editor'
        }
    },
    isReady: true,
    src: '',
    set source(v) {
        if (v !== undefined && !this.src)
            this.src = v;
    },
    onchange(e) {
        this.source = e.detail.value;
    }
})
