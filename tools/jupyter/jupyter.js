import { LZString } from './lib/lz-string.js';

ODA({ is: 'oda-jupyter',
    template: /*html*/`
        <style>
            :host {
                @apply --flex;
                @apply --vertical;
                padding: 16px 0;
                position: relative;
                min-height: 28px;
            }
        </style>
        <oda-jupyter-cell-addbutton ~show="isReady && !notebook?.cells?.length" style="position: absolute; top: 18px; left: 12px; z-index: 31;"></oda-jupyter-cell-addbutton>
        <oda-jupyter-cell ~show="isReady" ~for="cell in notebook?.cells" :cell></oda-jupyter-cell>
    `,
    props: {
        url: {
            default: '',
            async set(n) {
                await this.loadURL();
            }
        },
        lzs: {
            default: '',
            async set(n) {
                await this.loadURL();
            }
        },
        readOnly: false,
        isReady: false,
        focusedCell: {
            type: Object,
            set(v) {
                this.editedCell = undefined
            }
        },
        showBorder: false,
        collapsed: false
    },
    notebook: {},
    editedCell: undefined,
    attached() {
        this.loadURL();
    },
    async loadURL() {
        this.focusedCell = undefined;
        this._location = window.location.href;
        let _lzs = this._location.split('?lzs=')[1];
        _lzs = _lzs || this.lzs;
        if (_lzs) {
            try {
                _lzs = LZString.decompressFromEncodedURIComponent(_lzs)
                this.notebook = JSON.parse(_lzs);
            } catch (err) { }
        } else if (this.url) {
            const response = await fetch(this.url);
            const json = await response.json();
            this.notebook = json;
        }
        (this.notebook?.cells || []).map((i, idx) => i.order ||= idx);
        if (this.notebook) {
            this.readOnly = this.notebook.readOnly;
            this.showBorder = this.notebook.showBorder;
        }
    },
    ready() { 
        this.async(() => {
            this.isReady = true;
        }, 300)
        document.addEventListener('jupyterTapCell', () => {
            this.focusedCell = undefined;
        })
    },
    share(e, notebook) {
        const hideTopPanel = e?.altKey || e?.ctrlKey || e?.metaKey || this.notebook.hideTopPanel ? true : false;
        const readOnly = this.readOnly;
        const showBorder = this.showBorder;
        const str = JSON.stringify({...(notebook || this.notebook), ...{hideTopPanel, readOnly, showBorder}});
        if (str) {
            let url = this.$url.replace('jupyter.js', 'index.html#?lzs=') + LZString.compressToEncodedURIComponent(str);
            window.open(url, '_blank').focus();
        }
    },
    loadFile(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = async e => this.notebook = JSON.parse(e.target.result);
        reader.readAsText(file, 'UTF-8');
        if (this.notebook) {
            this.readOnly = this.notebook.readOnly;
            this.showBorder = this.notebook.showBorder;
        }
    },
    async saveFile(e) {
        let str = JSON.stringify(this.notebook);
        if (!str) return;
        const blob = new Blob([str], { type: "text/plain" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = (this.notebook.label || 'oda-jupyter') + '.json';
        a.click();
    }
})

ODA({ is: 'oda-jupyter-cell',
    template: /*html*/`
        <style>
            :host {
                display: block;
                position: relative;
                margin: 6px 12px;
                white-space: normal !important;
                order: {{cell?.order || 0}};
                box-shadow: {{showBorder && (readOnly || focusedCell !== cell) ? '0px 0px 0px 1px lightgray' : 'unset'}};
            }
            ._focused {
                box-shadow: 0 0 0 1px dodgerblue;
            }
        </style>
        <oda-jupyter-cell-toolbar-ace ~if="cell?.cell_type === 'code' && !readOnly && focusedCell===cell" :cell></oda-jupyter-cell-toolbar-ace>
        <oda-jupyter-cell-toolbar ~if="!readOnly && focusedCell===cell" :cell></oda-jupyter-cell-toolbar>
        <div ~show="collapsed && editedCell!==cell" ~class="{_focused: !readOnly && focusedCell===cell}" style="font-size: 14px; padding: 4px; color: lightgray; cursor: pointer" @tap="ontapcell">{{cell.label || cell.cell_type}}</div>
        <div ~show="!collapsed || editedCell===cell" ~class="{_focused: !readOnly && focusedCell===cell}" ~is="cellType" :id="'cell-'+cell?.order" @tap="ontapcell" :cell></div>
        <oda-jupyter-cell-addbutton ~if="!readOnly && cell && focusedCell===cell" :cell></oda-jupyter-cell-addbutton>
        <oda-jupyter-cell-addbutton ~if="!readOnly && cell && focusedCell===cell" :cell position="bottom"></oda-jupyter-cell-addbutton>
    `,
    cell: {},
    get cellType() {
        if (this.cell?.cell_type === 'html') return 'oda-jupyter-cell-html';
        if (this.cell?.cell_type === 'markdown') return 'oda-jupyter-cell-markdown';
        if (this.cell?.cell_type === 'code') return 'oda-jupyter-cell-code';
        if (this.cell?.cell_type === 'html-executable') return 'oda-jupyter-cell-html-executable';
        if (this.cell?.cell_type === 'html-cde') return 'oda-jupyter-cell-html-cde';
        if (this.cell?.cell_type === 'html-jodit') return 'oda-jupyter-cell-html-jodit';
        if (this.cell?.cell_type === 'html-tiny') return 'oda-jupyter-cell-html-tiny';
        if (this.cell?.cell_type === 'ext') return this.cell?.cell_extType || 'div';
        return 'div';
    },
    ontapcell(e) {
        if (!this.editedCell) {
            document.dispatchEvent(new CustomEvent('jupyterTapCell', { bubbles: true }));
        }
        this.async(() => {
            this.focusedCell = this.readOnly ? undefined : this.cell;
        })
    }
})

ODA({ is: 'oda-jupyter-cell-toolbar', imports: '@oda/button',
    template: /*html*/`
        <style>
            :host {
                display: flex;
                position: absolute;
                right: 8px;
                top: -18px;
                z-index: 41;
                box-shadow: 0 0 0 1px dodgerblue;
                border-radius: 2px;
                background: white;
                width: 160px;
                height: 24px;
            }
            oda-button {
                border-radius: 3px;
                margin: 2px 0px;
            }
        </style>
        <oda-button icon="editor:mode-edit" :icon-size @tap="editedCell=editedCell===cell?undefined:cell" ~style="{fill: editedCell===cell ? 'red' : ''}" title="edit mode"></oda-button>
        <oda-button icon="icons:arrow-back:90" :icon-size @tap="tapOrder($event, -1.1)" :disabled="cell.order<=0" title="move up"></oda-button>
        <oda-button icon="icons:arrow-forward:90" :icon-size @tap="tapOrder($event, 1.1)" :disabled="cell.order>=notebook?.cells?.length-1" title="move down"></oda-button>
        <div class="flex"></div>
        <oda-button ~if="!cell.noDelete" icon="icons:delete" :icon-size @tap="tapDelete" title="delete"></oda-button>
        <oda-button icon="social:share" :icon-size @click="share($event, { cells: [cell] })" title="share"></oda-button>
        <oda-button icon="icons:close" :icon-size @tap="focusedCell=undefined"></oda-button>
    `,
    iconSize: 14,
    cell: {},
    tapOrder(e, v) {
        if (this.focusedCell !== this.cell) return;
        const ord = this.cell.order = this.cell.order + v;
        this.notebook.cells.sort((a, b) => a.order - b.order).map((i, idx) => i.order = idx - 1.1 <= ord ? idx : idx + 1);
    },
    tapDelete() {
        if (this.cell?.source.trim() === '' || !this.cell.source || window.confirm(`Do you really want delete current cell ?`)) {
            this.notebook.cells.splice(this.cell.order, 1);
            this.notebook.cells.sort((a, b) => a.order - b.order).map((i, idx) => i.order = idx);
            this.focusedCell = this.notebook.cells[(this.cell.order > this.notebook.cells.length - 1) ? this.notebook.cells.length - 1 : this.cell.order];
        }
    }
})
ODA({ is: 'oda-jupyter-cell-toolbar-ace',
    template: /*html*/`
        <style>
            :host {
                display: flex;
                flex: 1;
                justify-content: center;
                align-items: center;
                position: absolute;
                right: 178px;
                top: -18px;
                z-index: 41;
                box-shadow: 0 0 0 1px dodgerblue;
                border-radius: 2px;
                background: white;
                height: 24px;
                font-size: 12px;
                padding: 0 4px;
                cursor: pointer;
                color: dodgerblue;
            }
        </style>
        <div @tap="ontap">{{cell?.mode || 'javascript'}}</div>
    `,
    cell: {},
    async ontap(e) {
        const res = await ODA.showDialog('oda-jupyter-cell-toolbar-ace-select-mode', { cell: this.cell });
    }
})

ODA({
    is: 'oda-jupyter-cell-toolbar-ace-select-mode',
    template: /*html*/`
        <style>
            ::-webkit-scrollbar { width: 4px; height: 4px; }
            ::-webkit-scrollbar-track { -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); }
            ::-webkit-scrollbar-thumb { border-radius: 10px; background: var(--body-background); -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); }
            :host {
                @apply --vertical;
                @apply --flex;
                position: relative;
            }
            .column {
                overflow: auto;
            }
            .cell {
                padding: 4px;
                cursor: pointer;
            }
            .cell:hover {
                background: lightgray;
            }
            .header {
                position: sticky;
                top: 0;
                padding: 4px;
                border-bottom: 1px solid gray;
            }
            b {
                color: dodgerblue;
            }
        </style>
        <div class="horizontal flex" style="max-width: 80vw; max-height: 80vh">
            <div class="vertical flex column">
                <div class="header">mode...<b>{{cell?.mode || 'javascript'}}</b></div>
                <div class="cell" ~for="mode" @tap="cell.mode=item" ~style="{color: cell.mode===item?'dodgerblue':''}">{{item}}</div>
            </div>
            <div class="vertical flex column">
                <div class="header">view theme...<b>{{cell?.viewTheme || 'solarized_light'}}</b></div>
                <div class="cell" ~for="theme" @tap="cell.viewTheme=item" ~style="{color: cell.viewTheme===item?'dodgerblue':''}">{{item}}</div>
            </div>
            <div class="vertical flex column">
                <div class="header">edit theme...<b>{{cell?.editTheme || 'dawn'}}</b></div>
                <div class="cell" ~for="theme" @tap="cell.editTheme=item" ~style="{color: cell.editTheme===item?'dodgerblue':''}">{{item}}</div>
            </div>
        </div>
    `,
    cell: {},
    theme: ['ambiance', 'chaos', 'chrome', 'clouds', 'clouds_midnight', 'cobalt', 'crimson_editor', 'dawn', 'dracula',
        'dreamweaver', 'eclipse', 'github', 'gob', 'gruvbox', 'idle_fingers', 'iplastic', 'katzenmilch', 'kr_theme', 'kuroir',
        'merbivore', 'merbivore_soft', 'monokai', 'mono_industrial', 'pastel_on_dark', 'solarized_dark',
        'solarized_light', 'sqlserver', 'terminal', 'textmate', 'tomorrow', 'tomorrow_night', 'tomorrow_night_blue',
        'tomorrow_night_bright', 'tomorrow_night_eighties', 'twilight', 'vibrant_ink', 'xcode'
    ],
    mode: [
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
        'vala', 'vbscript', 'velocity', 'verilog', 'vhdl', 'visualforce', 'wollok', 'xml', 'xquery', 'yaml', 'zeek'
    ]
})

ODA({ is: 'oda-jupyter-cell-addbutton', imports: '@oda/button, @tools/containers',
    template: /*html*/`
        <style>
            .btn {
                display: flex;
                position: absolute;
                z-index: 21;
                border: 1px solid dodgerblue;
                border-radius: 50%;
                background: white;
                top: {{ position==='top' ? '-16px' : 'unset' }};
                bottom: {{ position!=='top' ? '-16px' : 'unset' }};
            }
            .btn1 {
                fill: dodgerblue;
            }
            .btn2 {
                top: -16px;
                bottom: unset;
                left: 22px;
            }
            .btn3 {
                top: -16px;
                bottom: unset;
                left: 44px;
                fill: {{collapsed ? 'dodgerblue' : 'gray'}};
            }
            .btn4 {
                top: -16px;
                bottom: unset;
                left: 66px;
                fill: {{editedCell === cell ? 'red' : ''}};
            }
            .cell {
                position: absolute;
                top: -12px;
                left: 90px;
                z-index: 21;
                font-size: 10px;
                cursor: pointer;
                color: dodgerblue;
            }
        </style>
        <oda-button :icon-size class="btn btn1" icon="icons:add" :icon-size title="add cell" @tap="showCellViews('add')"></oda-button>
        <oda-button ~if="notebook?.cells?.length" class="btn btn2" icon="icons:close" :icon-size title="close cell" @tap="focusedCell=undefined"></oda-button>
        <oda-button ~if="notebook?.cells?.length" class="btn btn3" icon="icons:reorder" :icon-size title="collapsed" @tap="collapsed=!collapsed"></oda-button>
        <oda-button ~if="notebook?.cells?.length" class="btn btn4" icon="editor:mode-edit" :icon-size title="edit mode" @tap="editedCell=editedCell===cell?undefined:cell"></oda-button>
        <div ~if="position==='top'" class="cell" @tap="showCellViews('select type')" title="select cell type">{{cell.label || cell.cell_type}}</div>
    `,
    props: {
        position: 'top'
    },
    iconSize: 10,
    cell: {},
    async showCellViews(view) {
        const res = await ODA.showDropdown('oda-jupyter-list-views', { cell: this.cell, notebook: this.notebook, position: this.position, view }, { parent: this.$('oda-button') });
        if (res && view === 'add') this.editedCell = undefined;
    }
})

ODA({ is: 'oda-jupyter-list-views', imports: '@oda/button',
    template: /*html*/`
        <style>
            :host {
                @apply --vertical;
                min-width: 140px;
            }
        </style>
        <div class="header flex" style="text-align: center; padding: 1px; width: 100%">{{view}} cell</div>
        <oda-button class="horizontal flex" ~for="cellViews" @tap="addCell(item)" style="justify-content: start;">{{index + '. ' + item.label}}</oda-button>
    `,
    props: {
        position: 'top',
        view: 'add'
    },
    iconSize: 14,
    cell: {},
    notebook: {},
    get cellViews() {
        let views = [
            { cell_type: 'html', cell_extType: 'html', source: '', label: 'html-Pell-editor' },
            { cell_type: 'markdown', cell_extType: 'md', source: '', label: 'md-Showdown' },
            { cell_type: 'code', cell_extType: 'code', source: '', label: 'code' },
            { cell_type: 'html-executable', cell_extType: 'html-executable', source: '', label: 'code-html-executable' },
            { cell_type: 'html-cde', cell_extType: 'html-cde', source: '', label: 'html-CDEditor' },
            { cell_type: 'html-jodit', cell_extType: 'html-jodit', source: '', label: 'html-Jodit-editor' },
            { cell_type: 'html-tiny', cell_extType: 'html-tiny', source: '', label: 'html-TinyMCE-editor' },
        ]
        return views;
    },
    addCell(item) {
        const idx = this.cell?.order || 0;
        if (this.view === 'add') {
            const ord = this.position === 'top' ? idx - .1 : idx + .1;
            const cell = { order: ord, cell_type: item.cell_type, cell_extType: item.cell_extType, source: item.source, color: item.color, label: item.label };
            this.notebook.cells ||= [];
            this.notebook.cells.splice(idx, 0, cell);
            this.notebook.cells.sort((a, b) => a.order - b.order).map((i, idx) => i.order = idx - .1 <= ord ? idx : idx + 1);
        } else if (this.view === 'select type') {
            const cell = { ...this.cell, ...{ cell_type: item.cell_type, cell_extType: item.cell_extType, color: item.color, label: item.label } };
            this.notebook.cells.splice(idx, 1, cell);
        }
        this.fire('ok');
    }
})

ODA({ is: 'oda-jupyter-cell-markdown', imports: '@oda/md-viewer, @oda/ace-editor, @oda/splitter2',
    template: /*html*/`
        <style>
            ::-webkit-scrollbar { width: 4px; height: 4px; }
            ::-webkit-scrollbar-track { -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); }
            ::-webkit-scrollbar-thumb { border-radius: 10px; background: var(--body-background); -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); }
            :host {
                @apply --horizontal;
                @apply --flex;
                min-height: 28px;
                height: 100%;
                max-height: {{!readOnly&&editedCell===cell ? '80vh' : ''}};
            }
        </style>
        <div class="horizontal flex" style="overflow: hidden">
            <div ~show="!readOnly&&editedCell===cell" style="width: 50%; overflow: auto;">
                <oda-ace-editor class="flex" highlight-active-line="false" show-print-margin="false" theme="solarized_light" mode:markdown show-gutter="false" min-lines=1></oda-ace-editor></oda-ace-editor>
            </div>
            <oda-splitter2 ~show="!readOnly&&editedCell===cell" size="3px" color="dodgerblue" style="opacity: .3"></oda-splitter2>
            <div class="flex" style="overflow: auto; flex: 1">
                <oda-md-viewer class="flex" :srcmd="cell?.source" :src="cell?.src" :edit-mode="!readOnly&&editedCell===cell"></oda-md-viewer>
            </div>
        </div>
    `,
    cell: {},
    listeners: {
        change(e) {
            if (this.readOnly || this.editedCell !== this.cell) return;
            this.cell.source = this.$('oda-ace-editor').value;
        }
    },
    observers: [
        function setEditedCell(editedCell) {
            if (editedCell && editedCell === this.cell) {
                this.async((e) => {
                    this.$('oda-ace-editor').value = this.$('oda-md-viewer').source;
                }, 100)
            }
        }
    ]
})

ODA({ is: 'oda-jupyter-cell-code', imports: '@oda/ace-editor',
    template: /*html*/`
        <style>
            ::-webkit-scrollbar { width: 4px; height: 4px; }
            ::-webkit-scrollbar-track { -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); }
            ::-webkit-scrollbar-thumb { border-radius: 10px; background: var(--body-background); -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); }
            :host {
                position: relative;
                @apply --horizontal;
                @apply -- flex;
                border: 1px solid #eee;
                min-height: 22px;
            }
            .ace {
                height: unset;
            }
            .editor {
                overflow: hidden; 
                height: {{cell?.cell_h || 'unset'}};
            }
        </style>
        <div class="vertical flex editor" style="padding-top: 2px; min-height: 22px;">
            <oda-ace-editor class="flex ace" highlight-active-line="false" show-print-margin="false" :mode="cell?.mode || 'javascript'" :theme="!readOnly&&editedCell===cell?cell.editTheme||'solarized_light':cell.viewTheme||'dawn'" min-lines=1 :read-only="isReadOnly && editedCell!==cell"></oda-ace-editor>
            <oda-splitter2 direction="horizontal" :size="cell?.splitterH >= 0 ? cell.splitterH + 'px' : '2px'" color="transparent" style="opacity: .3" resize></oda-splitter2>
            <div class="flex" style="overflow: auto; flex: 1; max-height: 0"></div>
        </div>
    `,
    cell: {},
    attached() {
        this.$('oda-ace-editor').value = this.cell?.source;
    },
    listeners: {
        change(e) {
            if (!this.isReadOnly || this.editedCell === this.cell) {
                this.async((e) => {
                    this.cell.source = this.$('oda-ace-editor').value;
                }, 100)
            }
        },
        endSplitterMove(e) {
            if (!this.readOnly) {
                if (e.detail.value.direction === 'horizontal') {
                    this.cell.cell_h = e.detail.value.h;
                    this.cell.cell_h = this.cell.cell_h < 22 ? 22 : this.cell.cell_h;
                }
            }
        }
    },
    get isReadOnly() {
        return this.cell?.cell_props?.readOnly;
    }
})

ODA({ is: 'oda-jupyter-cell-html', imports: '@oda/pell-editor',
    template: /*html*/`
        <style>
            :host::-webkit-scrollbar { width: 4px; height: 4px; } :host::-webkit-scrollbar-track { -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); } :host::-webkit-scrollbar-thumb { border-radius: 10px; background: var(--body-background); -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); }
            :host {
                @apply --horizontal;
                @apply --flex;
                min-height: 28px;
                overflow: auto;
            }

        </style>
        <oda-pell-editor class="flex pell" ~show="!readOnly&&editedCell===cell" :pell style="height: 80vh"></oda-pell-editor>
        <div ~show="editedCell!==cell" ~html="cell.source" style="width: 100%; padding: 8px;"></div>
    `,
    cell: {},
    listeners: {
        change(e) {
            if (this.readOnly || this.editedCell !== this.cell) return;
            this.cell.source = e.detail.value;
        }
    },
    observers: [
        function setEditedCell(editedCell) {
            if (editedCell && editedCell === this.cell) {
                this.async((e) => {
                    this.$('oda-pell-editor').editor.content.innerHTML = this.cell.source;
                }, 100)
            }
        }
    ]
})

ODA({ is: 'oda-jupyter-cell-html-executable', imports: '@oda/ace-editor, @oda/splitter2',
    template: /*html*/`
        <style>
            ::-webkit-scrollbar { width: 4px; height: 4px; }
            ::-webkit-scrollbar-track { -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); }
            ::-webkit-scrollbar-thumb { border-radius: 10px; background: var(--body-background); -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); }
            :host {
                @apply --vertical;
                @apply --flex;
                min-height: 24px;
                padding: 2px 2px 0;
                height: 100%;
            }
            .box {
                width: 24px;
                cursor: pointer;
                align-self: flex-start;
                padding: 0 2px 0 4px;
            }
            .ace {
                height: unset;
            }
            span {
                cursor: pointer;
                font-size: 12px;
                padding: 0 4px;
            }
            span:hover {
                background: lightgray;
            }
            .mode {
                color: red;
                background: white;
            }
            .editor {              
                overflow: hidden; 
                height: {{cell?.cell_h || '200px'}};
            }
            .left {
                overflow: auto;
                width: {{cell?.cell_w >= 0 ? cell?.cell_w + '%' : '50%'}};
            }
        </style>
        <div class="vertical flex editor">
            <div class="horizontal flex" style="overflow: hidden;">
                <div ~if="!cell?.cell_w || cell?.cell_w > 2" class="vertical left">
                    <div class="horizontal header" style="padding: 4px;">
                        <span @tap="mode='html'" :class="{mode: mode==='html'}">html</span>
                        <span @tap="mode='javascript'" :class="{mode: mode==='javascript'}">javascript</span>
                        <span @tap="mode='css'" :class="{mode: mode==='css'}">css</span>
                        <span ~if="cell?.useJson" @tap="mode='json'" :class="{mode: mode==='json'}">json</span>
                        <div class="flex"></div>
                        <span @tap="cell.useJson=!cell.useJson">useJson</span>
                        <span @tap="cell.source=cell.sourceJS=cell.sourceCSS='';cell.sourceJSON='{}'; setAceValue()">clear</span>
                        <span @tap="listenIframe(true)">refresh</span>
                    </div>
                    <oda-ace-editor class="flex ace" :mode :theme="mode==='html'?'cobalt':mode==='javascript'?'solarized_light':mode==='css' ? 'dawn':'chrome'" highlight-active-line="false" show-print-margin="false" min-lines=1 :read-only="isReadOnly && editedCell!==cell"></oda-ace-editor>
                </div>
                <oda-splitter2 :size="cell?.splitterV >= 0 ? cell.splitterV + 'px' : '1px'" color="transparent" style="opacity: .3"></oda-splitter2>
                <div class="flex" style="overflow: hidden; flex: 1">
                    <iframe style="border: none; width: 100%; height: 100%; overflow: hidden"></iframe>
                </div>
            </div>
            <oda-splitter2 direction="horizontal" :size="cell?.splitterH >= 0 ? cell.splitterH + 'px' : '2px'" color="transparent" style="opacity: .3" resize></oda-splitter2>
            <div class="flex" style="overflow: auto; flex: 1; max-height: 0"></div>
        </div>
    `,
    props: {
        mode: {
            default: 'html',
            set(v) {
                this.setAceValue();
            }
        }
    },
    cell: {},
    get srcdoc() {
        return `
<style>
    ${this.cell?.sourceCSS || ''}
</style>
${this.cell?.sourceHTML || this.cell?.source  || ''}
<script type="module">
    ${this.sourceJSON}
    ${this.cell?.sourceJS || ''}
</script>
    `},
    get sourceJSON() {
        if (this.cell?.useJson || this.cell?.sourceJSON) return `
import { Observable } from 'https://libs.gullerya.com/object-observer/5.0.0/object-observer.min.js';
const json = Observable.from(${this.cell.sourceJSON} || '{}');
Observable.observe(json, e => {
    const detail = JSON.stringify(json, null, 4);
    document.dispatchEvent(new CustomEvent('changeJSON', { detail }));
})
        `;
        return '';
    },
    attached() {
        this.setAceValue();
        this.listenIframe(true);
    },
    listeners: {
        change(e) {
            if (this.focusedCell !== this.cell || this._setAceValue) return;
            const v = this.$('oda-ace-editor').value;
            if (this.mode === 'javascript')
                this.cell.sourceJS = v;
            if (this.mode === 'html')
                this.cell.source = v;
            if (this.mode === 'css')
                this.cell.sourceCSS = v;
            if (this.mode === 'json')
                this.cell.sourceJSON = v || '{}';
            this.listenIframe(true);
        },
        endSplitterMove(e) {
            if (!this.readOnly) {
                if (e.detail.value.direction === 'horizontal') {
                    this.cell.cell_h = e.detail.value.h;
                    this.cell.cell_h = this.cell.cell_h < 26 ? 26 : this.cell.cell_h;
                }
                if (e.detail.value.direction === 'vertical') {
                    this.cell.cell_w = e.detail.value.w;
                    this.cell.cell_w = this.cell.cell_w <= 3 ? 0 : this.cell.cell_w;
                }
            }
            this.listenIframe(true);
        }
    },
    get isReadOnly() {
        return this.cell?.cell_props?.readOnly;
    },
    setAceValue(mode = this.mode) {
        this._setAceValue = true;
        let ace = this.$('oda-ace-editor');
        if (mode === 'javascript')
            ace.value = this.cell.sourceJS || '';
        if (mode === 'html')
            ace.value = this.cell.source || '';
        if (mode === 'css')
            ace.value = this.cell.sourceCSS || '';
        if (mode === 'json')
            ace.value = this._sourceJSON || this.cell.sourceJSON || '{}';
        setTimeout(() => this._setAceValue = false, 100);
    },
    listenIframe(update) {
        const iframe = this.$('iframe');
        iframe.srcdoc = update ? this.srcdoc : iframe.srcdoc || this.srcdoc;
        setTimeout(() => {
            (iframe.contentDocument || iframe.contentWindow).addEventListener("changeJSON", (e) => {
                this._sourceJSON = this.cell.sourceJSON = e.detail;
                if (this.mode === 'json') this.setAceValue();
            })
        }, 500)
    }
})

ODA({ is: 'oda-jupyter-cell-html-temp',
    template: /*html*/`
        <style>
            :host {
                @apply --horizontal;
                @apply --flex;
                min-height: 28px;
            }
        </style>
        <iframe ~show="editedCell===cell" style="border: none; width: 100%; height: 80vh"></iframe>
        <div ~show="editedCell!==cell" :html="cell.source" style="width: 100%; padding: 8px;"></div>
    `,
    cell: {},
    observers: [
        function setEditedCell(editedCell) {
            if (editedCell && editedCell === this.cell) {
                this.async((e) => {
                    const iframe = this.$('iframe');
                    iframe.srcdoc = this.srcdoc;
                    this.async((e) => {
                        (iframe.contentDocument || iframe.contentWindow) .addEventListener("change", (e) => {
                            if (e.detail !== undefined)
                                this.cell.source = e.detail;
                        })
                    }, 300)
                })
            }
        }
    ]
})

ODA({ is: 'oda-jupyter-cell-html-cde', extends: 'oda-jupyter-cell-html-temp',
    get srcdoc() {
        return `
<style>
    ::-webkit-scrollbar { width: 4px; height: 4px; } ::-webkit-scrollbar-track { -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); } ::-webkit-scrollbar-thumb { border-radius: 10px; }
</style>
<div id="editor">${this.cell?.source || ''}</div>
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

ODA({ is: 'oda-jupyter-cell-html-jodit', extends: 'oda-jupyter-cell-html-temp',
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
<textarea id="editor" name="editor">${this.cell?.source || ''}</textarea>
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

ODA({ is: 'oda-jupyter-cell-html-tiny', extends: 'oda-jupyter-cell-html-temp',
    get srcdoc() {
        return `
<style> 
    ::-webkit-scrollbar { width: 4px; height: 4px; } ::-webkit-scrollbar-track { -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); } ::-webkit-scrollbar-thumb { border-radius: 10px; }
    body, html { 
        margin: 0; 
    }
</style>
<textarea name="content" id="mytextarea">${this.cell?.source || ''}</textarea>
<script src="https://cdn.tiny.cloud/1/0dmt0rtivjr59ocff6ei6iqaicibk0ej2jwub5siiycmlk84/tinymce/5/tinymce.min.js" referrerpolicy="origin"></script>
<script type="module">
    tinymce.init({
        selector: 'textarea#mytextarea',
        height: '100vh',
        menubar: true,
        plugins: [
            'advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker',
            'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media table powerpaste paste mediaembed nonbreaking',
            'table emoticons template help pageembed permanentpen advtable',
        ],
        toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | link | ' +
            'bullist numlist outdent indent | image | print preview media fullpage | ' +
            'forecolor backcolor emoticons | help' +
            'casechange checklist code formatpainter pageembed permanentpen paste powerpaste table | vanna',

        menubar: 'favs file edit view insert format tools table help',
        menu: {
            favs: {
                title: 'My Favorites',
                items: 'paste | powerpaste | code visualaid | searchreplace | spellchecker | emoticons',
            },
        },
        paste_webkit_styles: 'color font-size',
        extended_valid_elements: 'script[language|src|async|defer|type|charset]',
        setup: (editor) => {
            editor.on('change', () => { document.dispatchEvent(new CustomEvent('change', { detail: editor.getContent() })) });
            editor.on('keyup', () => { document.dispatchEvent(new CustomEvent('change', { detail: editor.getContent() })) });
        },
    });
</script>
    `}
})
