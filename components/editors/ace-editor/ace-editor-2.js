ODA({ is: 'oda-ace-editor', imports: './src/ace.js',
    template: `
        <style>
            :host {
                display: block;
                position: relative;
                @apply --flex;
            }
        </style>
        <div @keydown.stop style="width: 100%; height: 100%;"></div>
    `,
    props: {
        src: {
            default: '',
            set(n) { this.setValue(n) }
        },
        value: {
            default: '',
            get() { return this.editor?.getValue() || '' },
            set(n) { this.setValue(n) }
        },
        theme: {
            default: 'cobalt',
            async set(n) { await this.setTheme(n) }
        },
        mode: {
            default: 'javascript',
            async set(n) { await this.setMode(n) }
        },
        fontSize: {
            default: 16,
            async set(n) { this.setOptions() }
        },
        wrap: {
            default: true,
            async set(n) { this.setOptions() }
        },
        minLines: {
            default: 3,
            async set(n) { this.setOptions() }
        },
        maxLines: {
            default: 0,
            async set(n) { this.setOptions() }
        },
        readOnly: {
            default: false,
            set(n) { this.editor?.setReadOnly(n) }
        },
    },
    text: '',
    isChanged: false,
    async attached() {
        this.init();
    },
    init() {
        this.async(async () => {
            this.ace = this.$('div');
            if (!this.ace)
                this.async(() => this.init(), 100);
            this.editor = ace?.edit(this.ace);
            this.editor.renderer.attachToShadowRoot();
            ['basePath', 'modePath', 'themePath', 'workerPath'].map(path => ace.config.set(path, ODA.rootPath + '/components/editors/ace-editor/src/'));
            await this.setTheme();
            await this.setMode();
            this.setOptions();
            this._value = this.value || this.src;
            this.setValue(this._value);
            this.editor.setReadOnly(this.readOnly);
            this.editor.session.on('change', (e) => {
                this.isChanged = this.value !== this._value;
                this.fire('change', this.value);
            })
        }, 500)
    },
    setValue(value) {
        this.editor?.setValue(value);
        this.editor?.session.selection.clearSelection();
    },
    async setTheme(theme = this.theme || 'cobalt') {
        await import(`./src/theme-${theme}.js`);
        this.editor?.setTheme(`ace/theme/${theme}`);
    },
    async setMode(mode = this.mode || 'javascript') {
        await import(`./src/mode-${mode}.js`);
        const _mode = ace.require(`ace/mode/${mode}`).Mode;
        this.editor?.session.setMode(new _mode());
    },
    setOptions(options) {
        this.editor?.setOptions(options || { fontSize: this.fontSize, wrap: this.wrap, maxLines: this.maxLine, minLines: this.minLines });
    },
    setOption(option, value) {
        this.editor?.setOption(option, value);
    }
})
