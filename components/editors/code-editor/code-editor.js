const componentPath = import.meta.url.split('/').slice(0, -1).join('/')+'/src/';
ODA({is: 'oda-code-editor',
    template: `
        <style>
            :host([read-only]){
                @apply --dimmed;
            }
            .ace_hidden-cursors {
                opacity: {{showCursor ? 1 : 0}};
            }
            .ace_editor .ace_marker-layer .ace_selection {
                background: {{marker?marker+'!important':''}};
            }
            .ace_gutter-cell.ace_breakpoint{ 
                border-radius: 20px 0px 0px 20px; 
                box-shadow: 0px 0px 1px 1px red inset; 
                background-color: lightyellow;
            }
            .ace_scrollbar-h {
                position: sticky;
                bottom: 0px;
                top: {{scrollCalculate}}px;
                width: unset !important;
            }
            .ace_search.right {
                position: sticky;
                top: 20px;
                width: fit-content;
                margin-left: auto;
            }
            .ace_scroller, .ace_editor {
                overflow: {{stickySearch?'unset':''}};
            }
        </style>
        <div @keydown.stop  style="min-height: 100%; font-size: large;"></div>
    `,
    $public: {
        scrollCalculate: 0,
        stickySearch: false,
        marker: '',
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
            $list: ['javascript', 'json', 'xml', 'html', 'abap', 'abc', 'actionscript', 'ada', 'apache_conf', 'apex', 'applescript', 'aql', 'asciidoc', 'asl', 'assembly_x86', 'autohotkey', 'batchfile', 'bro', 'c9search', 'cirru', 'clojure', 'cobol', 'coffee', 'coldfusion', 'crystal', 'csharp', 'c_cpp', 'd', 'dart', 'diff', 'django', 'dockerfile', 'dot', 'drools', 'edifact', 'eiffel', 'ejs', 'elixir', 'elm', 'erlang', 'forth', 'fortran', 'fsl', 'ftl', 'gcode', 'gherkin', 'gitignore', 'glsl', 'gobstones', 'golang', 'graphqlschema', 'groovy', 'haml', 'handlebars', 'haskell', 'haskell_cabal', 'haxe', 'hjson', 'html_elixir', 'html_ruby', 'ini', 'io', 'jack', 'jade', 'java', 'json5', 'jsoniq', 'jsp', 'jssm', 'jsx', 'julia', 'kotlin', 'latex', 'less', 'liquid', 'lisp', 'livescript', 'logtalk', 'live_script', 'logiql', 'lsl', 'lua', 'luapage', 'lucene', 'makefile', 'markdown', 'mask', 'matlab', 'maze', 'mel', 'mixal', 'mushcode', 'mysql', 'nix', 'nsis', 'objectivec', 'ocaml', 'pascal', 'perl', 'perl6', 'pgsql', 'php', 'php_laravel_blade', 'pig', 'plain_text', 'powershell', 'praat', 'prolog', 'properties', 'protobuf', 'puppet', 'python', 'r', 'razor', 'rdoc', 'red', 'redshift', 'rhtml', 'rst', 'ruby', 'rust', 'sass', 'scad', 'scala', 'scheme', 'scss', 'sh', 'sjs', 'slim', 'smarty', 'snippets', 'soy_template', 'space', 'sparql', 'sql', 'sqlserver', 'stylus', 'svg', 'swift', 'swig', 'tcl', 'tex', 'text', 'textile', 'toml', 'tsx', 'turtle', 'twig', 'typescript', 'vala', 'vbscript', 'velocity', 'verilog', 'vhdl', 'visualforce', 'wollok', 'xquery', 'yaml', 'zeek']
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
        focus(){
            this.editor?.focus();
        },
        // fontSize: { $def: 16, set(n) { this.editor?.setOption('fontSize', n) } },
        wrap: { $def: false, set(n) { this.editor?.setOption('wrap', n) } },
        minLines: { $def: 1, set(n) { this.editor?.setOption('minLines', n) } },
        maxLines: { $def: '', set(n) { this.editor?.setOption('maxLines', n) } },
        showGutter: { $def: true, set(n) { this.editor?.setOption('showGutter', n) } },
        highlightGutterLine: { $def: false, set(n) { this.editor?.setOption('highlightGutterLine', n) } },
        highlightActiveLine: { $def: true, set(n) { this.editor?.setOption('highlightActiveLine', n) } },
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
        enableBreakpoints: false
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
        this.editor.getSession().setUndoManager(new ace.UndoManager());
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


        this.editor.commands.addCommand({
            name: 'oda-removeline',
            bindKey: { win: "Ctrl-Y", mac: "Ctrl-y" },
            exec: () => {
                this.editor.execCommand('removeline')
            }
        });

        this.editor.commands.addCommand({
            name: 'oda-togglecomment',
            bindKey: { win: "Ctrl-/", mac: "Ctrl-/" },
            exec: () => {
                this.editor.execCommand('togglecomment');
                this.editor.execCommand('golinedown');
            }
        });

        this.editor.commands.addCommand({
            name: 'oda-replace',
            bindKey: { win: "Ctrl-R", mac: "Ctrl-r" },
            exec: () => {
                this.editor.execCommand('replace');
            }
        });

        this.editor.session.on('change', (e) => {
            this.checkBreakpoints(e);
            this['#value'] = undefined;
            this.isChanged = this.value !== this.src;
            this.fire('change', this.value);
        });
        this.editor.session.selection.on('changeCursor',  (e) => {
            this.fire('change-cursor', this.editor.session.selection.cursor);
        });
        this.editor.session.on('changeMode', (e, session) => {
            if ("ace/mode/javascript" === session.getMode().$id) {
                if (!!session.$worker) {
                    session.$worker.send("setOptions", [{
                        "esversion": 11,
                        "esnext": false,
                        "asi": true // This option suppresses warnings about missing semicolons.
                    }]);
                }
            }
        });
        this.editor.commands.removeCommand('find');
        // https://ourcodeworld.com/articles/read/1052/how-to-add-toggle-breakpoints-on-the-ace-editor-gutter#disqus_thread
        this.editor.on("guttermousedown", (e) => {
            if (!this.enableBreakpoints)
                return;
            const target = e.domEvent.target;
            if (target.className.indexOf("ace_gutter-cell") == -1)
                return;
            if (!e.editor.isFocused())
                return;
            // console.log(e.clientX > 25 + target.getBoundingClientRect().left);
            // console.log(e.clientX, 25 + target.getBoundingClientRect().left);
            if (e.clientX > 25 + target.getBoundingClientRect().left)
                return;
            const row = e.getDocumentPosition().row;
            let breakpoints = e.editor.session.getBreakpoints(row, 0);
            if (typeof breakpoints[row] === typeof undefined)
                e.editor.session.setBreakpoint(row);
            else
                e.editor.session.clearBreakpoint(row);
            e.stop();
            this.fireBreakpoints();
        })
        this.fire('loaded', this.editor);
    },
    fireBreakpoints() {
        const breakpoints = this.editor.session.getBreakpoints();
        let res = '';
        breakpoints.map((i, idx) => {
            if (i)
                res += idx + 1 + ' ';
        })
        this.fire('change-breakpoints', res);
    },
    checkBreakpoints(e) {
        let breakpoints = this.getBreakpoints();
        if (breakpoints && e.lines.length > 1) {
            breakpoints = breakpoints.trim().split(' ');
            let session = this.editor.session,
                lines = e.lines.length - 1,
                start = e.start.row,
                end = e.end.row;
            breakpoints.map(breakpoint => {
                breakpoint = +breakpoint;
                if (e.action === 'insert') {
                    if (breakpoint > start) {
                        session.clearBreakpoint(breakpoint);
                        session.setBreakpoint(breakpoint + lines);
                    }
                } else if (e.action === 'remove') {
                    if (breakpoint > start && breakpoint < end) {
                        session.clearBreakpoint(breakpoint);
                    }
                    if (breakpoint >= end) {
                        session.clearBreakpoint(breakpoint);
                        session.setBreakpoint(breakpoint - lines);
                    }
                }
            })
            this.fireBreakpoints();
        }
    },
    getBreakpoints() {
        const breakpoints = this.editor.session.getBreakpoints();
        let res = '';
        breakpoints.map((i, idx) => {
            res += idx + ' ';
        })
        return res;
    },
    setBreakpoints(rows) {
        const breakpoints = rows.split(' ');
        breakpoints.map((i) => {
            this.editor?.session?.setBreakpoint(i - 1);
        })
    },
    async exportValue() {
        await import(componentPath + 'ext-static_highlight.js');
        const highlight = ace.require(`ace/ext/static_highlight`);
        let res = highlight.renderSync(this.editor.getValue(), this.editor.session.getMode(), this.editor.renderer.theme);
        const div = document.createElement("div");
        div.innerHTML = res.html;
        res = { css: res.css, html: div.innerHTML, type: 'ace' };
        // console.log(res);
        return res;
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
