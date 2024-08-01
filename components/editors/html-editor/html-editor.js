ODA({is: 'oda-html-editor', imports: '@oda/splitter, @oda/ace-editor, @oda/monaco-editor',
    template:`
        <style>
            .editor {
                display: flex;
                flex-direction: {{direction}};
                @apply --flex;
                position: relative;
                overflow: auto;
                width: 100%;
            }
            .monaco {
                height: {{direction === 'row' ? '100%' : monacoHeight}}px;
            }
        </style>
        <div class="editor" style="overflow: auto;">
            <div ~if="editMode" class="horizontal" style="overflow: hidden; min-width: 120px; position: relative" ~style="{width: editMode && showPreview && direction==='row' ? '50%' : '100%'}">
                <oda-ace-editor  ~if="type==='ace'" :src="value" @change="onchange" mode="html" theme="cobalt" font-size="12" class="flex" show-gutter="false" min-lines="3" max-lines="Infinity" :wrap="!noWrap"></oda-ace-editor>                        
                <oda-monaco-editor class="monaco" ~if="type==='monaco'" :value @change="onchange" class="flex" theme="vs-dark" language="html"></oda-monaco-editor>
                <oda-splitter></oda-splitter>
            </div>
            <div ~if="!editMode || showPreview" class="vertical flex" style="overflow: hidden; min-height: 24px" @dblclick="_dblClick">
                <div ~if="previewMode === 'html'" ~html="value || (!editMode ? '<b><u>Double click for HTML edit...</u></b>' : '')" style="border: none; width: 100%;"></div>
                <iframe ~if="previewMode === 'iframe'" style="border: none; width: 100%; overflow: hidden;"></iframe>
            </div>
        </div>
    `,
    $public:{
        type:{
            $def: 'ace',
            $list: ['ace', 'monaco'],
            set(n) {
                this.src = this.value;
            }
        },
        monacoHeight: 200,
        direction: {
            $def: 'row',
            $list: ['row', 'column'],
        },
        noWrap: false,
        showPreview: false,
        previewMode: {
            $def: 'html',
            $list: ['html', 'iframe'],
            set(n){
                this.async(() => {
                    this.setIframe();  
                }, 100)
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
        }
    },
    value: {
        $def: '',
        set(n) {
            this.isReady && this.setIframe();
        }
    },
    onchange(e) {
        this.value = e.detail.value;
    },
    focus() {
        this.async(() => {
            this.$('oda-ace-editor')?.focus();
        }, 500)
    },
    _dblClick() {
        // if (!this.value)
        this.editMode = !this.editMode;
    },
    attached() {
        this.setIframe();
    },
    setIframe() {
        const iframe= this.$('iframe');
        if (!iframe || !this.previewMode === 'iframe') return;
        if (!iframe) return;
        iframe.addEventListener('load', () => {
            const resizeObserver = new ResizeObserver((e) => {
                iframe.style.height = iframe.contentDocument.body.scrollHeight + 'px';
            })
            resizeObserver.observe(iframe.contentDocument.body);
            this.isReady = true;
        })
        iframe.srcdoc = this.value || (this.editMode ? '' : '<b><u>Double click for HTML edit...</u></b>');
    }
})
