ODA({ is: 'oda-html-editor', imports: '@oda/pell-editor, @oda/ace-editor, @oda/divider',
    template: `
        <style>
            :host{
                @apply --horizontal;
                @apply --flex;
                min-height: 20px;
                height: 100%;
            }
        </style>
        <div style="display: flex; flex: 1; overflow: hidden; height: 100%">
            <div ~if="editMode" ~is="editors[type] || 'div'" style="width: 50%;" :src="src || source" @change="onchange" :edit-mode></div>
            <oda-divider ~if="isReady && editMode" size="2"></oda-divider>
            <div ~html="source || src || ''" style="flex: 1; overflow: auto"></div>
        </div>
    `,
    $public: {
        type: {
            $def: 'pell',
            $list: ['pell', 'ace'],
            $save: true,
            set(v) {
                this.isReady = false;
                this.src = this.source || this.src;
                this.async(() => this.isReady = true, 100);
            }
        },
        editMode: {
            $def: false,
            set(n) {
                this.src = this.source;
            }
        }
    },
    get editors() {
        return {
            pell: 'oda-pell-editor',
            ace: 'oda-ace-editor'
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
