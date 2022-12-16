ODA({ is: 'oda-ace-editor', imports: './src/ace.js',
    template: `
        <style>
            :host {
                @apply --vertical;
            }
            .ace_content{
                min-height: 100%;
                min-width: 100%;
            }
            .ace_hidden-cursors { 
                opacity: {{showCursor ? 1 : 0}};
            }
        </style>
        <div @keydown.stop style="height: 100%;"></div>
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
            default: 'chrome',
            async set(n) { await this.setTheme(n) },
            list: ['ambiance', 'chaos', 'chrome', 'clouds', 'clouds_midnight', 'cobalt', 'crimson_editor', 'dawn', 'dracula', 'dreamweaver', 'eclipse', 'github', 'gob', 'gruvbox', 'idle_fingers', 'iplastic', 'katzenmilch', 'kr_theme', 'kuroir', 'merbivore', 'merbivore_soft', 'monokai', 'mono_industrial', 'pastel_on_dark', 'solarized_dark', 'solarized_light', 'sqlserver', 'tomorrow_night_bright', 'tomorrow_night_eighties', 'twilight', 'vibrant_ink', 'xcode']
        },
        mode: {
            default: 'javascript',
            async set(n) { await this.setMode(n) },
            list: ['abap', 'abc', 'actionscript', 'ada', 'apache_conf', 'apex', 'applescript', 'aql', 'asciidoc', 'asl', 'assembly_x86', 'autohotkey', 'batchfile', 'bro', 'c9search', 'cirru', 'clojure', 'cobol', 'coffee', 'coldfusion', 'crystal', 'csharp', 'c_cpp', 'd', 'dart', 'diff', 'django', 'dockerfile', 'dot', 'drools', 'edifact', 'eiffel', 'ejs', 'elixir', 'elm', 'erlang', 'forth', 'fortran', 'fsl', 'ftl', 'gcode', 'gherkin', 'gitignore', 'glsl', 'gobstones', 'golang', 'graphqlschema', 'groovy', 'haml', 'handlebars', 'haskell', 'haskell_cabal', 'haxe', 'hjson', 'html', 'html_elixir', 'html_ruby', 'ini', 'io', 'jack', 'jade', 'java', 'javascript', 'json', 'json5', 'jsoniq', 'jsp', 'jssm', 'jsx', 'julia', 'kotlin', 'latex', 'less', 'liquid', 'lisp', 'livescript', 'logtalk', 'live_script', 'logiql', 'lsl', 'lua', 'luapage', 'lucene', 'makefile', 'markdown', 'mask', 'matlab', 'maze', 'mel', 'mixal', 'mushcode', 'mysql', 'nix', 'nsis', 'objectivec', 'ocaml', 'pascal', 'perl', 'perl6', 'pgsql', 'php', 'php_laravel_blade', 'pig', 'plain_text', 'powershell', 'praat', 'prolog', 'properties', 'protobuf', 'puppet', 'python', 'r', 'razor', 'rdoc', 'red', 'redshift', 'rhtml', 'rst', 'ruby', 'rust', 'sass', 'scad', 'scala', 'scheme', 'scss', 'sh', 'sjs', 'slim', 'smarty', 'snippets', 'soy_template', 'space', 'sparql', 'sql', 'sqlserver', 'stylus', 'svg', 'swift', 'swig', 'tcl', 'tex', 'text', 'textile', 'toml', 'tsx', 'turtle', 'twig', 'typescript', 'vala', 'vbscript', 'velocity', 'verilog', 'vhdl', 'visualforce', 'wollok', 'xml', 'xquery', 'yaml', 'zeek']
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
        showCursor: true,
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
    async setTheme(theme = this.theme || 'chrome') {
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
