ODA({is: 'oda-code', imports: '@oda/splitter2, @oda/ace-editor, ../monaco-editor/monaco-editor.js',
    template:`  
        <style>
           :host{
                @apply --horizontal;
                @apply --flex;
                min-height: 20px;
            }
        </style>
        <div style="display: flex; flex: 1; overflow: hidden;" ~style="{height: editMode ? '80vh' : '100%', padding: editMode? '4px' : 0 }" >
            <div ~if="preview==='none' || showCode || editMode" style="overflow: hidden; position: relative" ~style="{width: preview!=='none' ? '50%' : '100%'}">
                <oda-ace-editor ~if="type==='ace'" :src @change="onchange" class="flex" highlight-active-line="false" show-print-margin="false" theme="cobalt" mode="html" min-lines=1></oda-ace-editor></oda-ace-editor>
                <oda-monaco-editor ~if="type==='monaco'" ::value="src" @change="onchange" class="flex" theme="vs-dark" language="html"></oda-monaco-editor>
            </div>
            <oda-splitter2 ~if="editMode && preview!=='none'" size="3"></oda-splitter2>
            <div ~if="preview!=='none'" class="flex" style="overflow: auto; flex: 1">
                <div ~html="source"></div>
            </div>
        </div>
    `,
    props:{
        type:{
            default: 'ace',
            list: ['ace', 'monaco'],
            set(n) {
                this.src = this.source;
                this.async(() => this.setArgs(), 100);
            }
        },
        preview: {
            default: 'none',
            list: ['none', 'preview'],
        },
        showCode: {
            default: false,
        },
        enableResize: true,
        label: ''
    },
    src: '',
    set source(v) {
        if (v !== undefined && !this.src)
            this.src = v;
    },
    editMode: false,
    onchange(e) {
        this.source = e.detail.value;
    },
    attached() {
        this.async(() => this.setArgs());
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
