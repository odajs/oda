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
            .editors {
                height: {{editorHeight ? editorHeight : '100%'}};
            }
            .monaco, .ace {
                width: 100%;
                height: 100%;
            }
        </style>
        <div class="editor" style="overflow: auto; width: 100%; position: relative;">
            <div class="editors" ~if="isEditMode" class="horizontal" style="overflow: hidden;overflow-y: auto; min-width: 120px; position: relative" ~style="{width: isEditMode && showPreview && direction==='row' ? '50%' : '100%'}">
                <oda-ace-editor  class="ace" ~if="editorType==='ace'" :src="value" @change="onchange" mode="html" theme="cobalt" font-size="12" class="flex" show-gutter="false" min-lines="3" max-lines="Infinity" :wrap="!noWrap"></oda-ace-editor>                        
                <oda-monaco-editor class="monaco" ~if="editorType==='monaco'" :value @change="onchange" class="flex" theme="vs-dark" language="html"></oda-monaco-editor>
                <oda-splitter></oda-splitter>
            </div>
            <div ~if="!isEditMode || showPreview" class="vertical flex" style="overflow: hidden; min-height: 24px" @dblclick="_dblClick">
                <div ~if="previewMode === 'html'" ~html="value || (!isEditMode ? '<b><u>Double click for HTML edit...</u></b>' : '')" style="border: none; width: 100%;"></div>
                <iframe ~if="previewMode === 'iframe'" style="border: none; width: 100%; overflow: hidden;"></iframe>
            </div>
        </div>
    `,
    $public:{
        editorType:{
            $def: 'ace',
            $list: ['ace', 'monaco'],
            set(n) {
                this.src = this.value;
            }
        },
        editorHeight: '',
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
        isEditMode: {
            $def: false,
            set(n){
                if (n) {
                    if(this.readOnly)
                        this.isEditMode = false
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
        this.isEditMode = !this.isEditMode;
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
        iframe.srcdoc = this.value || (this.isEditMode ? '' : '<b><u>Double click for HTML edit...</u></b>');
    }
})
