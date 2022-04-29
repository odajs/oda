import './src/ace.js';
import './src/ext-language_tools.js';
import snippet from './src/snippets/oda-snippet.js';

// https://github.com/beautify-web/js-beautify
import './src/beautify.js';
// import './src/beautify-css.js';
import './src/beautify-html.js';

ODA({ is: 'oda-ace-editor', template: /*html*/`
        <style>
            ::-webkit-scrollbar { width: 4px; height: 4px; } ::-webkit-scrollbar-track { background: lightgray; } ::-webkit-scrollbar-thumb { background-color: gray; }
            :host {
                display: block;
                position: relative;
                height: 100%;
                overflow: auto;
            }
            .ace_content{
                min-height: 100%;
                min-width: 100%;
            }
            :host>div {
                border-radius: 2px;
                width: inherit !important;
                min-height: 100%;
            }
            .ace_hidden-cursors { opacity: 0; }
        </style>
        <div @keydown.stop></div>
    `,
    isChanged: false,
    text: '',
    props: {
        readOnly: {
            type: Boolean,
            default: false,
            set(n) {
                if (this.editor) {
                    this.editor.setReadOnly(n);
                }
            }
        },
        value: { //todo: возможно есть другое решение
            set(n) {
                if (this.editor) {
                    this.editor?.setValue(n);
                    this.text = n;
                    this.editor?.session.selection.clearSelection();
                } else {
                    this.async(() => {
                        this.value = n;
                    }, 100);
                }
            },
            get() {
                return this.editor?.getValue() || ' ';
            }
        },
        mode: {
            default: 'javascript',
            list: [
                'abap', 'abc', 'actionscript', 'ada', 'apache_conf', 'apex', 'applescript', 'aql', 'asciidoc', 'asl', 'assembly_x86',
                'autohotkey', 'batchfile', 'bro', 'c9search', 'cirru', 'clojure', 'cobol', 'coffee', 'coldfusion',
                'crystal', 'csharp', 'csound_document', 'csound_orchestra', 'csound_scope', 'csp', 'css', 'curly',
                'c_cpp', 'd', 'dart', 'diff', 'django', 'dockerfile', 'dot', 'drools', 'edifact',
                'eiffel', 'ejs', 'elixir', 'elm', 'erlang', 'forth', 'fortran', 'fsl', 'ftl', 'gcode', 'gherkin', 'gitignore',
                'glsl', 'gobstones', 'golang', 'graphqlschema', 'groovy', 'haml', 'handlebars', 'haskell', 'haskell_cabal', 'haxe',
                'hjson', 'html', 'html_elixir', 'html_ruby', 'ini', 'io', 'jack', 'jade', 'java', 'javascript', 'json', 'json5',
                'jsoniq', 'jsp', 'jssm', 'jsx', 'julia', 'kotlin', 'latex', 'less', 'liquid', 'lisp', 'livescript', 'logtalk',
                'live_script', 'logiql', 'lsl', 'lua', 'luapage', 'lucene', 'makefile', 'markdown', 'mask', 'matlab',
                'maze', 'mel', 'mixal', 'mushcode', 'mysql', 'nix', 'nsis', 'objectivec', 'ocaml', 'pascal',
                'perl', 'perl6', 'pgsql', 'php', 'php_laravel_blade', 'pig', 'plain_text', 'powershell', 'praat', 'prolog', 'properties',
                'protobuf', 'puppet', 'python', 'r', 'razor', 'rdoc', 'red', 'redshift', 'rhtml', 'rst', 'ruby', 'rust', 'sass', 'scad', 'scala',
                'scheme', 'scss', 'sh', 'sjs', 'slim', 'smarty', 'snippets', 'soy_template', 'space', 'sparql', 'sql', 'sqlserver',
                'stylus', 'svg', 'swift', 'swig', 'tcl', 'tex', 'text', 'textile', 'toml', 'tsx', 'turtle', 'twig', 'typescript',
                'vala', 'vbscript', 'velocity', 'verilog', 'vhdl', 'visualforce', 'wollok', 'xml', 'xquery', 'yaml', 'zeek'],
                async set(n) {
                    if (n) {
                        try {
                            let s = n.replace('ace/mode/', '');
                            await import(`./src/snippets/${s}.js`);
                        } catch (e) { 
                            console.error(e)
                        }
                        this.editor?.session?.setMode('ace/mode/' + n);
                    }
                }
        },
        theme: {
            default: 'chrome',
            list: ['ambiance', 'chaos', 'chrome', 'clouds', 'clouds_midnight', 'cobalt', 'crimson_editor', 'dawn', 'dracula',
                'dreamweaver', 'eclipse', 'github', 'gob', 'gruvbox', 'idle_fingers', 'iplastic', 'katzenmilch', 'kr_theme', 'kuroir',
                'merbivore', 'merbivore_soft', 'monokai', 'mono_industrial', 'pastel_on_dark', 'solarized_dark',
                'solarized_light', 'sqlserver', 'terminal', 'textmate', 'tomorrow', 'tomorrow_night', 'tomorrow_night_blue',
                'tomorrow_night_bright', 'tomorrow_night_eighties', 'twilight', 'vibrant_ink', 'xcode'],
                async set(n) {
                    if (n) {
                        this.editor?.setTheme('ace/theme/' + n);
                    }
                }
        },
        highlightActiveLine: true,
        highlightSelectedWord: true,
        // readOnly: false,
        cursorStyle: {
            default: 'slim',
            list: ['ace', 'slim', 'smooth', 'wide']
        },
        autoScrollEditorIntoView: true,
        copyWithEmptySelection: false,
        useSoftTabs: false,
        navigateWithinSoftTabs: false,
        enableMultiselect: true,
        hScrollBarAlwaysVisible: false,
        vScrollBarAlwaysVisible: false,
        highlightGutterLine: false,
        animatedScroll: true,
        showInvisibles: false,
        showPrintMargin: true,
        printMarginColumn: 80,
        fadeFoldWidgets: false,
        showFoldWidgets: true,
        showLineNumbers: true,
        showGutter: true,
        displayIndentGuides: true,
        fontSize: {
            default: 16,
            save: true
        },
        maxLines: Infinity,
        minLines: 3,
        fixedWidthGutter: false,
        firstLineNumber: 1,
        newLineMode: {
            default: 'auto',
            list: ['auto', 'unix', 'windows']
        },
        useWorker: false,
        tabSize: {
            default: 4,
            save: true
        },
        wrap: true,
        foldStyle: {
            default: 'markbeginend',
            list: ['markbegin', 'markbeginend', 'manual']
        },
        enableSnippets: true,
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        //mergeUndoDeltas: false | true | "always"
        //behavioursEnabled: boolean,
        //wrapBehavioursEnabled: boolean,
        //printMargin: false | number
        //fontFamily: css font-family value
        //scrollPastEnd: number | boolean // number of page sizes to scroll after document end (typical values are 0, 0.5, and 1)
        //overwrite: boolean,
        commands: {
            type: String,
            list: ['showSettingsMenu', 'openCommandPalette', 'find'],
            set(n) {
                if (n) {
                    this.editor?.execCommand(n);
                }
            }
        },
    },
    set src(v) {
        this.value = v;
    },
    attached() {
        ['basePath', 'modePath', 'themePath', 'workerPath'].map(o => ace.config.set(o, ODA.rootPath + '/components/editors/ace-editor/src/'));
        this.editor = ace.edit(this.$('div'));
        this.editor.session.on('change', (e)=>{
            this['#value'] = undefined;
            this.isChanged = this.value !== this.text;
            this.fire('change');
        })

        const snippetManager = ace.require('ace/snippets').snippetManager;
        const snippets = snippetManager.parseSnippetFile(snippet, this.mode);
        snippetManager.register(snippets, this.mode);
    },
    focus(){ this.editor?.focus() },
    // updated(e) {
    //     this.editor?.setOptions(this.options);
    // },
    observers: [
        function _observer(fontSize, tabSize, wrap, showPrintMargin, showLineNumbers, showGutter, minLines, maxLines, displayIndentGuides, printMarginColumn, firstLineNumber) {
            this.editor?.setOptions(this.options);
        },
    ],
    set editor(editor) {
        editor.renderer.attachToShadowRoot();
        editor.setOptions(this.options);
        editor.setValue(this.value);
        editor.session.selection.clearSelection();
        editor.getSession().on('change', (e) => this.fire('change', this.value));
        editor.commands.addCommand({
            name: 'format',
            bindKey: {win: "Ctrl-Q", mac: "Cmd-Q"},
            exec: () => {
                // https://github.com/beautify-web/js-beautify
                const 
                    mode = this.editor.session.getMode().$id,
                    fn = mode.includes('html') ? html_beautify : js_beautify,
                    // fn = mode.includes('html') ? html_beautify : mode.includes('css') ? css_beautify : js_beautify,
                    session = this.editor.getSession();
                session.setValue(fn(session.getValue(), {
                    // "indent_size": 4,
                    // "indent_char": " ",
                    // "indent_with_tabs": false,
                    // "editorconfig": false,
                    // "eol": "\n",
                    // "end_with_newline": false,
                    // "indent_level": 0,
                    // "preserve_newlines": true,
                    // "max_preserve_newlines": 10,
                    // "space_in_paren": false,
                    // "space_in_empty_paren": false,
                    // "jslint_happy": false,
                    // "space_after_anon_function": false,
                    // "space_after_named_function": false,
                    // "brace_style": "collapse",
                    // "unindent_chained_methods": false,
                    // "break_chained_methods": false,
                    // "keep_array_indentation": false,
                    // "unescape_strings": false,
                    // "wrap_line_length": 0,
                    // "e4x": false,
                    // "comma_first": false,
                    // "operator_position": "before-newline",
                    // "indent_empty_lines": false,
                    // "templating": ["auto"]
                }));
            }
        })
        editor.setReadOnly(this.readOnly);
    },
    get options() {
        const options = {
            mode: 'ace/mode/' + this.mode,
            theme: 'ace/theme/' + this.theme
        }, props = [
            'highlightActiveLine', 'highlightSelectedWord', 'cursorStyle', 'autoScrollEditorIntoView',
            'copyWithEmptySelection', 'useSoftTabs', 'navigateWithinSoftTabs', 'enableMultiselect',
            'hScrollBarAlwaysVisible', 'vScrollBarAlwaysVisible', 'highlightGutterLine', 'animatedScroll', 'showInvisibles',
            'showPrintMargin', 'printMarginColumn', 'fadeFoldWidgets', 'showFoldWidgets', 'showLineNumbers', 'showGutter',
            'displayIndentGuides', 'fontSize', 'maxLines', 'minLines', 'fixedWidthGutter', 'firstLineNumber',
            'newLineMode', 'useWorker', 'tabSize', 'wrap', 'foldStyle',
            'enableSnippets', 'enableBasicAutocompletion', 'enableLiveAutocompletion',
            //mergeUndoDeltas', behavioursEnabled', wrapBehavioursEnabled', printMargin', fontFamily' scrollPastEnd', overwrite,
        ];
        props.forEach(i => options[i] = this[i]);
        return options;
    },
    set options(n) {
        for (let i in n || {}) {
            this[i] = n[i];
        }
    }
});
