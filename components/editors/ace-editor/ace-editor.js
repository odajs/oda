const componentPath = import.meta.url.split('/').slice(0, -1).join('/')+'/src/';
ODA({is: 'oda-ace-editor',
    template: `
        <style>
            :host([read-only]){
                @apply --dimmed;
            }
            .ace_hidden-cursors {
                opacity: {{showCursor ? 1 : 0}};
            }
        </style>
        <div @keydown.stop  style="min-height: 100%; font-size: large;"></div>
    `,
    $public: {
        value: {
            $def: '',
            get() {
                return this.editor?.getValue() || '';
            },
            set(n) {
                this.setValue(n);
            }
        },
        theme: {
            $def: 'chrome',
            set(n) {
                if (n)
                    this.setTheme(n);
            },
            $list: ['ambiance', 'chaos', 'chrome', 'clouds', 'clouds_midnight', 'cobalt', 'crimson_editor', 'dawn', 'dracula', 'dreamweaver', 'eclipse', 'github', 'gob', 'gruvbox', 'idle_fingers', 'iplastic', 'katzenmilch', 'kr_theme', 'kuroir', 'merbivore', 'merbivore_soft', 'monokai', 'mono_industrial', 'pastel_on_dark', 'solarized_dark', 'solarized_light', 'sqlserver', 'tomorrow_night_bright', 'tomorrow_night_eighties', 'twilight', 'vibrant_ink', 'xcode']
        },
        mode: {
            $def: 'javascript',
            set(n) {
                if (n)
                    this.setMode(n);
            },
            $list: ['abap', 'abc', 'actionscript', 'ada', 'apache_conf', 'apex', 'applescript', 'aql', 'asciidoc', 'asl', 'assembly_x86', 'autohotkey', 'batchfile', 'bro', 'c9search', 'cirru', 'clojure', 'cobol', 'coffee', 'coldfusion', 'crystal', 'csharp', 'c_cpp', 'd', 'dart', 'diff', 'django', 'dockerfile', 'dot', 'drools', 'edifact', 'eiffel', 'ejs', 'elixir', 'elm', 'erlang', 'forth', 'fortran', 'fsl', 'ftl', 'gcode', 'gherkin', 'gitignore', 'glsl', 'gobstones', 'golang', 'graphqlschema', 'groovy', 'haml', 'handlebars', 'haskell', 'haskell_cabal', 'haxe', 'hjson', 'html', 'html_elixir', 'html_ruby', 'ini', 'io', 'jack', 'jade', 'java', 'javascript', 'json', 'json5', 'jsoniq', 'jsp', 'jssm', 'jsx', 'julia', 'kotlin', 'latex', 'less', 'liquid', 'lisp', 'livescript', 'logtalk', 'live_script', 'logiql', 'lsl', 'lua', 'luapage', 'lucene', 'makefile', 'markdown', 'mask', 'matlab', 'maze', 'mel', 'mixal', 'mushcode', 'mysql', 'nix', 'nsis', 'objectivec', 'ocaml', 'pascal', 'perl', 'perl6', 'pgsql', 'php', 'php_laravel_blade', 'pig', 'plain_text', 'powershell', 'praat', 'prolog', 'properties', 'protobuf', 'puppet', 'python', 'r', 'razor', 'rdoc', 'red', 'redshift', 'rhtml', 'rst', 'ruby', 'rust', 'sass', 'scad', 'scala', 'scheme', 'scss', 'sh', 'sjs', 'slim', 'smarty', 'snippets', 'soy_template', 'space', 'sparql', 'sql', 'sqlserver', 'stylus', 'svg', 'swift', 'swig', 'tcl', 'tex', 'text', 'textile', 'toml', 'tsx', 'turtle', 'twig', 'typescript', 'vala', 'vbscript', 'velocity', 'verilog', 'vhdl', 'visualforce', 'wollok', 'xml', 'xquery', 'yaml', 'zeek']
        },
        readOnly: {
            $def: false,
            $attr: true,
            set(n) {
                this.editor?.setReadOnly(n);
            }
        },
        format: {
            $def: false,
            set(n) {
                if (n) {
                    this.editor?.execCommand('format');
                    // this.format = false;
                }
            }
        },
        // fontSize: { $def: 16, set(n) { this.editor?.setOption('fontSize', n) } },
        wrap: { $def: true, set(n) { this.editor?.setOption('wrap', n) } },
        minLines: { $def: 1, set(n) { this.editor?.setOption('minLines', n) } },
        maxLines: { $def: '', set(n) { this.editor?.setOption('maxLines', n) } },
        showGutter: { $def: true, set(n) { this.editor?.setOption('showGutter', n) } },
        highlightGutterLine: { $def: false, set(n) { this.editor?.setOption('highlightGutterLine', n) } },
        highlightActiveLine: { $def: false, set(n) { this.editor?.setOption('highlightActiveLine', n) } },
        enableSnippets: {
            $def: true,
            set(n) {
                this.editor?.setOption('enableSnippets', n)
            },
            get() {
                return this.editor?.getOption('enableSnippets')
            }
        },
        enableBasicAutocompletion: {
            $def: true,
            set(n) {
                this.editor?.setOption('enableBasicAutocompletion', n)
            },
            get() {
                return this.editor?.getOption('enableBasicAutocompletion')
            }
        },
        enableLiveAutocompletion: {
            $def: true,
            set(n) {
                this.editor?.setOption('enableLiveAutocompletion', n)
            },
            get() {
                return this.editor?.getOption('enableLiveAutocompletion')
            }
        },
        showCursor: true,
        isChanged: false,

    },
    src: {
        $def: '',
        set(v) {
            this.value = v;
        },
    },

    get srcPatch() {
        return componentPath;
    },
    get container() {
        return this.$?.('div');
    },
    async attached() {
        // if (!window.ace){
            const imp = await import(componentPath+'/ace.js');
            window.ace.componentPath = componentPath;
        // }
        if (!this.container) return;
        this.editor = ace?.edit(this.container);
        this.editor.renderer.attachToShadowRoot();
        await import('./src/ext-language_tools.js');
        await import('./src/beautify-html.js');
        ['basePath', 'modePath', 'themePath', 'workerPath'].map(path => {
            ace.config.set(path, this.srcPatch)
        });
        this.setTheme();
        this.setMode();
        this.setOptions();
        this.setValue(this.src || this.value || '');
        this.src ||= this.editor.getValue();
        this.editor.setReadOnly(this.readOnly);
        this.editor.commands.addCommand({
            name: 'format',
            bindKey: { win: "Shift+Alt-F", mac: "Shift-Option-f" },
            exec: async () => {
                // https://github.com/beautify-web/js-beautify
                await import('./src/beautify.js');
                await import('./src/beautify-css.js');
                await import('./src/beautify-html.js');
                const session = this.editor.getSession();
                const mode = session.$modeId;
                const fn = mode.includes('html') ? html_beautify : mode.includes('css') ? css_beautify : js_beautify;
                session.setValue(fn(session.getValue(), { "end_with_newline": true, }));
            }
        });
        this.editor.session.on('change', (e) => {
            this['#value'] = undefined;
            this.isChanged = this.value !== this.src;
            this.fire('change', this.value);
        });
        this.editor.session.on('changeMode', (e, session) => {
            if ("ace/mode/javascript" === session.getMode().$id) {
                if (!!session.$worker) {
                    session.$worker.send("setOptions", [{
                        "esversion": 11,
                        "esnext": false,
                    }]);
                }
            }
        });
        this.fire('loaded', this.editor);
    },
    setValue(value) {
        this.editor?.setValue(value);
        this.editor?.session.selection.clearSelection();
    },
    setTheme(theme = this.theme || 'chrome') {
        if (!window.ace) return;
        import(`${this.srcPatch}theme-${theme}.js`).then(res=>{
            this.editor?.setTheme(`ace/theme/${theme}`);
        })
    },
    setMode(mode = this.mode || 'javascript') {
        if (!window.ace) return;
        import(`${this.srcPatch}mode-${mode}.js`).then(res=>{
            const _mode = ace.require(`ace/mode/${mode}`).Mode;
            this.editor?.session.setMode(new _mode());
        })
    },
    setOptions(options = this.options || {}) {
        this.editor?.setOptions(options);
    },
    get options() {
        const options = { showPrintMargin: false };
        [/* 'fontSize', */ 'maxLines', 'minLines', 'wrap', 'showGutter', 'highlightGutterLine', 'highlightActiveLine',
            'enableSnippets', 'enableBasicAutocompletion', 'enableLiveAutocompletion'].forEach(i => options[i] = this[i]);
        return options;
    }
})
