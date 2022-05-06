ODA({ is: 'oda-html', imports: '@oda/pell-editor, @oda/splitter2',
    template: `  
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
            <div ~if="editMode" ~is="editors[type] || 'div'" style="width: 50%; overflow: auto;" :src @change="onchange"></div>
            <oda-splitter2 ~if="isReady && editMode" size="3"></oda-splitter2>
            <div ~html="source || ''" style="flex: 1; overflow: auto"></div>
        </div>
    `,
    props: {
        type: {
            default: 'pell',
            list: ['pell', 'jodit'],
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
        label: ''
    },
    get editors() {
        return {
            pell: 'oda-pell-editor',
            jodit: 'oda-jodit-editor'
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

ODA({ is: 'oda-tmp-editor',
    template: /*html*/`
        <iframe style="border: none; width: 100%; height: 100%"></iframe>
    `,
    src: '',
    get srcDoc() { return '' },
    observers: [
        function setSrcdoc(srcdoc) {
            this.async((e) => {
                const iframe = this.$('iframe');
                iframe.srcdoc = srcdoc;
                this.async((e) => {
                    iframe.contentDocument.addEventListener("change", (e) => {
                        if (e?.detail !== undefined)
                            this.fire('change', e.detail);
                    })
                }, 300)
            })
        }
    ]
})

ODA({ is: 'oda-jodit-editor', extends: 'oda-tmp-editor',
    get srcdoc() {
        return `
<style>
    ::-webkit-scrollbar { width: 4px; height: 4px; } ::-webkit-scrollbar-track { -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); } ::-webkit-scrollbar-thumb { border-radius: 10px; }
    body, html { 
        margin: 0;
        min-width: 100%;
        min-height: 100%;
    }
</style>
<textarea id="editor" name="editor">${this.src || ''}</textarea>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jodit/3.13.4/jodit.es2018.min.css"/>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jodit/3.13.4/jodit.es2018.min.js"></script>
<script type="module">
    const editor = Jodit.make('#editor', {
        toolbarButtonSize: "small",
        fullsize: true
    });
    editor.events.on('change.textLength', (e) => {
        document.dispatchEvent(new CustomEvent('change', { detail: e }));
    })
</script>
    `}
})
