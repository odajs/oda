ODA({is: 'oda-html-editor', imports: '@oda/splitter, @oda/ace-editor, @oda/monaco-editor',
    template:`
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                position: relative;
            }
        </style>
        <div class="horizontal flex" style="width: 100%;">
            <div ~if="editMode" class="horizontal" style="min-width: 120px; position: relative;" ~style="{width: editMode && showPreview ? '50%' : '100%'}">
                <oda-ace-editor  ~if="type==='ace'" :src @change="onchange" mode="html" theme="cobalt" font-size="12" class="flex" show-gutter="true" max-lines="Infinity"></oda-ace-editor>                        
                <oda-monaco-editor ~if="type==='monaco'" ::value="src" @change="onchange" class="flex" theme="vs-dark" language="html"></oda-monaco-editor>
                <oda-splitter></oda-splitter>
            </div>
            <div ~if="!editMode || showPreview" class="vertical flex" style="overflow: auto;">
                <iframe :srcdoc="source" style="border: none; width: 100%;"></iframe>
            </div>
        </div>
    `,
    $public:{
        type:{
            $def: 'ace',
            $list: ['ace', 'monaco'],
            set(n) {
                this.src = this.source;
                this.async(() => this.setArgs(), 100);
            }
        },
        showPreview: false,
        editMode: false
    },
    src: '',
    set source(v) {
        if (v !== undefined && !this.src)
            this.src = v;
    },
    onchange(e) {
        this.source = e.detail.value;
    },
    attached() {
        this.async(() => this.setArgs());
        // const iframe= this.$('iframe');
        // if (!iframe) return;
        // iframe.addEventListener('load', () => {
        //     this.runConsoleData = [...(iframe.contentWindow._runConsoleData || [])];
        //     iframe.contentWindow.runConsoleData = this.runConsoleData;
        //     const resizeObserver = new ResizeObserver((e) => {
        //         iframe.style.height = iframe.contentDocument.body.scrollHeight + 'px';
        //         iframe.style.opacity = 1;
        //         this.opacity = 1;
        //     })
        //     resizeObserver.observe(iframe.contentDocument.body);
        // })
    },
    args: '',
    get argsType() { return 'args-' + this.type },
    setArgs(v = this.args) {
        if (v) {
            const args = JSON.parse(v);
            for (let [key, value] of Object.entries(args)) {
                if (this.usedControl && key === (this.argsType)) {
                    for (let [k, v] of Object.entries(args[key]))
                        this.usedControl[k] = v;
                } else {
                    this[key] = value;
                }
            }
        }
    },
    controlSetArgs(v) {
        if (v) {
            const args = this.args ? JSON.parse(this.args) : Object.create(null);;
            if (v.setArgs) {
                args[this.argsType] ||= Object.create(null);
                args[this.argsType][v.key] = v.value;
            } else {
                args[v.key] = v.value;
            }
            this.args = JSON.stringify(args);
            this.setArgs();
        }
    },
    get usedControl() {
        return this.type === 'ace' ? this.$('oda-ace-editor') : this.type === 'monaco' ? this.$('oda-monaco') : undefined;
    }
})
