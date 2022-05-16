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
            list: ['pell', 'cde', 'jodit', 'tiny'],
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
            cde: 'oda-cde-editor',
            jodit: 'oda-jodit-editor',
            tiny: 'oda-tiny-editor'
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

ODA({ is: 'oda-cde-editor', extends: 'oda-tmp-editor',
    get srcdoc() {
        return `
<style>
    ::-webkit-scrollbar { width: 4px; height: 4px; } ::-webkit-scrollbar-track { -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); } ::-webkit-scrollbar-thumb { border-radius: 10px; }
</style>
<div id="editor">${this.src || ''}</div>
<script src="https://cdn.ckeditor.com/4.17.2/full/ckeditor.js"></script>
<script>
    let editor = CKEDITOR.replace('editor');
    editor.on('change', (e) => {
        document.dispatchEvent(new CustomEvent('change', { detail: e.editor.getData() }));
    })
    editor.on('instanceReady', (e) => {
        if(e.editor.getCommand('maximize').state==CKEDITOR.TRISTATE_OFF) e.editor.execCommand('maximize');
    }) 
</script>
    `}
})

ODA({ is: 'oda-tiny-editor', extends: 'oda-tmp-editor',
    get srcdoc() {
        return `
<style> 
    ::-webkit-scrollbar { width: 4px; height: 4px; } ::-webkit-scrollbar-track { -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); } ::-webkit-scrollbar-thumb { border-radius: 10px; }
    body, html { 
        margin: 0; 
    }
</style>
<textarea name="content" id="mytextarea">${this.src || ''}</textarea>
<script src="https://cdn.tiny.cloud/1/no-api-key/tinymce/6/tinymce.min.js" referrerpolicy="origin"></script>

<script type="module">
    const useDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    tinymce.init({
        selector: 'textarea#mytextarea',
        plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
        editimage_cors_hosts: ['picsum.photos'],
        menubar: 'file edit view insert format tools table help',
        toolbar: 'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
        height: '100vh',
        image_caption: true,
        quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
        noneditable_class: 'mceNonEditable',
        toolbar_mode: 'sliding',
        contextmenu: 'link image table',
        skin: useDarkMode ? 'oxide-dark' : 'oxide',
        content_css: useDarkMode ? 'dark' : 'default',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
        setup: (editor) => {
            editor.on('change', () => { document.dispatchEvent(new CustomEvent('change', { detail: editor.getContent() })) });
            editor.on('keyup', () => { document.dispatchEvent(new CustomEvent('change', { detail: editor.getContent() })) });
        },
    });
</script>
    `}
})
