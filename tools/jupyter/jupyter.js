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
                opacity: 0;
                animation: ani .5s .5s forwards;
            }
            @keyframes ani {
                0% {opacity: 0;}
                100% {opacity: 1;}
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
        showBorder: false
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
    },
    share(e) {
        const hideTopPanel = e?.altKey || e?.ctrlKey ? true : false;
        const readOnly = this.readOnly;
        const showBorder = this.showBorder;
        const str = JSON.stringify({...this.notebook, ...{hideTopPanel, readOnly, showBorder}});
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
                order: {{cell?.order || 0}};
                box-shadow: {{focusedCell!==cell && !readOnly && showBorder ? '0px 0px 0px 1px lightgray' : ''}};
            }
            .focused {
                box-shadow: 0 0 0 1px dodgerblue;
            }
        </style>
        <oda-jupyter-cell-toolbar ~if="!readOnly && focusedCell===cell" :cell></oda-jupyter-cell-toolbar>
        <div ~class="{focused: !readOnly && focusedCell===cell}" ~is="cellType" :id="'cell-'+cell?.order" @tap="focusedCell=cell" :cell></div>
        <oda-jupyter-cell-addbutton ~if="!readOnly && cell && focusedCell===cell" :cell></oda-jupyter-cell-addbutton>
        <oda-jupyter-cell-addbutton ~if="!readOnly && cell && focusedCell===cell" :cell position="bottom"></oda-jupyter-cell-addbutton>
    `,
    cell: {},
    get cellType() {
        if (this.cell?.cell_type === 'markdown') return 'oda-jupyter-cell-markdown';
        if (this.cell?.cell_type === 'html') return 'oda-jupyter-cell-html';
        if (this.cell?.cell_type === 'html-cde') return 'oda-jupyter-cell-html-cde';
        if (this.cell?.cell_type === 'code') return 'oda-jupyter-cell-code';
        if (this.cell?.cell_type === 'html-executable') return 'oda-jupyter-cell-html-executable';
        if (this.cell?.cell_type === 'ext') return this.cell?.cell_extType || 'div';
        return 'div';
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
                background: white;
                /* width: 200px; */
                height: 24px;
            }
            oda-button {
                border-radius: 3px;
                margin: 2px 0px;
            }
        </style>
        <oda-button icon="icons:close" :icon-size @tap="focusedCell=undefined"></oda-button>
        <oda-button icon="icons:arrow-back:90" :icon-size @tap="tapOrder($event, -1.1)" :disabled="cell.order<=0" title="move up"></oda-button>
        <oda-button icon="icons:arrow-forward:90" :icon-size @tap="tapOrder($event, 1.1)" :disabled="cell.order>=notebook?.cells?.length-1" title="move down"></oda-button>
        <oda-button icon="icons:select-all" :icon-size title="show cells border" @tap="showBorder=!showBorder" allow-tooglle ::toggled="showBorder"></oda-button>
        <oda-button icon="editor:mode-edit" :icon-size @tap="editedCell=editedCell===cell?undefined:cell" ~style="{fill: editedCell===cell ? 'red' : ''}" title="edit mode"></oda-button>
        <oda-button ~if="editedCell===cell" icon="icons:settings" :icon-size></oda-button>
        <div class="flex"></div>
        <oda-button ~if="!cell.noDelete" icon="icons:delete" :icon-size @tap="tapDelete" title="delete"></oda-button>
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

ODA({ is: 'oda-jupyter-cell-addbutton', imports: '@oda/button, @tools/containers',
    template: /*html*/`
        <style>
            .btn {
                display: flex;
                position: absolute;
                left: -8px;
                z-index: 21;
                border: 1px solid dodgerblue;
                border-radius: 50%;
                background: white;
                top: {{ position==='top' ? '-18px' : 'unset' }};
                bottom: {{ position!=='top' ? '-18px' : 'unset' }};
            }
            .cell {
                position: absolute;
                top: -12px;
                left: 20px;
                z-index: 21;
                font-size: 10px;
                cursor: pointer;
                color: dodgerblue;
            }
        </style>
        <oda-button class="btn" icon="icons:add" :icon-size title="add cell" @tap="showCellViews('add')"></oda-button>
        <div ~if="position==='top'" class="cell" @tap="showCellViews('select type')" title="select cell type">{{cell.label || cell.cell_type}}</div>
    `,
    props: {
        position: 'top'
    },
    iconSize: 14,
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
            { cell_type: 'markdown', cell_extType: 'md', source: '', label: 'md-showdown' },
            { cell_type: 'html', cell_extType: 'html', source: '', label: 'html-pell-editor' },
            { cell_type: 'html-cde', cell_extType: 'html-cde', source: '', label: 'html-CDEditor' },
            { cell_type: 'code', cell_extType: 'code', source: '', label: 'code' },
            { cell_type: 'html-executable', cell_extType: 'html-executable', source: '', label: 'code-html-executable' },
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
        },
        dblclick(e) {
            if (this.readOnly) return;
            this.editedCell = this.editedCell === this.cell ? undefined : this.cell;
        }
    },
    observers: [
        function setEditedCell(editedCell) {
            if (editedCell && editedCell === this.cell)
                this.$('oda-ace-editor').value = this.$('oda-md-viewer').source;
        }
    ]
})

ODA({ is: 'oda-jupyter-cell-code', imports: '@oda/ace-editor',
    template: /*html*/`
        <style>
            :host {
                position: relative;
                @apply --horizontal;
                @apply -- flex;
                border: 1px solid #eee;
            }
            .ace {
                height: unset;
            }
        </style>
        <oda-ace-editor class="flex ace" :value="cell?.source" highlight-active-line="false" show-print-margin="false" :theme="!readOnly&&editedCell===cell?'solarized_light':'dawn'" min-lines=1 :read-only="isReadOnly && editedCell!==cell"></oda-ace-editor>
    `,
    cell: {},
    listeners: {
        change(e) {
            if (!this.isReadOnly || this.editedCell === this.cell)
                this.cell.source = this.$('oda-ace-editor').value;
        },
        dblclick(e) {
            if (this.readOnly) return;
            this.editedCell = this.editedCell === this.cell ? undefined : this.cell;
        }
    },
    get isReadOnly() {
        return this.cell?.cell_props?.readOnly;
    }
})

ODA({ is: 'oda-jupyter-cell-html', imports: '@oda/pell-editor',
    template: /*html*/`
        <style>
            :host {
                @apply --horizontal;
                @apply --flex;
                min-height: 28px;
            }

        </style>
        <oda-pell-editor class="flex pell" ~show="!readOnly&&editedCell===cell" :pell></oda-pell-editor>
        <div  ~show="editedCell!==cell" :html="cell.source" style="width: 100%; padding: 8px;"></div>
    `,
    cell: {},
    listeners: {
        change(e) {
            if (this.readOnly || this.editedCell !== this.cell) return;
            this.cell.source = e.detail.value;
        },
        dblclick(e) {
            if (this.readOnly) return;
            this.editedCell = this.editedCell === this.cell ? undefined : this.cell;
        }
    },
    observers: [
        function setEditedCell(editedCell) {
            if (editedCell && editedCell === this.cell)
                this.$('oda-pell-editor').editor.content.innerHTML = this.cell.source;
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
            <div class="horizontal flex" style="overflow: hidden; height: 20em;">
                <div class="vertical left">
                    <div class="horizontal header" style="padding: 4px;">
                        <span @tap="mode='html'" :class="{mode: mode==='html'}">html</span>
                        <span @tap="mode='javascript'" :class="{mode: mode==='javascript'}">javascript</span>
                        <span @tap="mode='css'" :class="{mode: mode==='css'}">css</span>
                        <div class="flex"></div>
                        <span @tap="cell.source=cell.sourceJS=cell.sourceCSS=''; setValue()">clear</span>
                        <span @tap="_srcdoc = _srcdoc ? '' : ' '">refresh</span>
                    </div>
                    <oda-ace-editor class="flex ace" :mode :theme="mode==='html'?'cobalt':mode==='javascript'?'solarized_light':'dawn'" highlight-active-line="false" show-print-margin="false" min-lines=1 :read-only="isReadOnly && editedCell!==cell"></oda-ace-editor>
                </div>
                <oda-splitter2 :size="cell?.splitterV >= 0 ? cell.splitterV + 'px' : '3px'" color="dodgerblue" style="opacity: .3"></oda-splitter2>
                <div class="flex" style="overflow: auto; flex: 1">
                    <iframe :srcdoc style="border: none; width: 100%; height: 100%"></iframe>
                </div>
            </div>
            <oda-splitter2 direction="horizontal" :size="cell?.splitterH >= 0 ? cell.splitterH + 'px' : '3px'" color="dodgerblue" style="opacity: .3" resize></oda-splitter2>
            <div class="flex" style="overflow: auto; flex: 1; max-height: 0"></div>
        </div>
    `,
    props: {
        mode: {
            default: 'html',
            set(v) {
                this.setValue();
            }
        }
    },
    cell: {},
    _srcdoc: '',
    get srcdoc() {
        return `<style>${this.cell?.sourceCSS || ''}</style>${this.cell?.source || ''}<script type="module">${this.cell?.sourceJS || ''}</script>${this._srcdoc || ''}`
    },
    attached() {
        this.setValue();
    },
    listeners: {
        change(e) {
            if (this.focusedCell !== this.cell) return;
            const v = this.$('oda-ace-editor').value;
            if (this.mode === 'javascript')
                this.cell.sourceJS = v;
            if (this.mode === 'html')
                this.cell.source = v;
            if (this.mode === 'css')
                this.cell.sourceCSS = v;
        },
        dblclick(e) {
            if (this.readOnly) return;
            this.editedCell = this.editedCell === this.cell ? undefined : this.cell;
        },
        endSplitterMove(e) {
            if (!this.readOnly) {
                if (e.detail.value.direction === 'horizontal') {
                    this.cell.cell_h = e.detail.value.h;
                    this.cell.cell_h = this.cell.cell_h < 26 ? 26 : this.cell.cell_h;
                    // console.log('h = ', this.cell.cell_h);
                }
                if (e.detail.value.direction === 'vertical') {
                    this.cell.cell_w = e.detail.value.w;
                    this.cell.cell_w = this.cell.cell_w < 1 ? 0 : this.cell.cell_w;
                    // console.log('w = ', this.cell.cell_w);
                }
            }
            this._srcdoc = this._srcdoc ? '' : ' ';
        }
    },
    get isReadOnly() {
        return this.cell?.cell_props?.readOnly;
    },
    setValue(mode = this.mode) {
        let ed = this.$('oda-ace-editor');
        if (mode === 'javascript')
            ed.value = this.cell.sourceJS || '';
        if (mode === 'html')
            ed.value = this.cell.source || '';
        if (mode === 'css')
            ed.value = this.cell.sourceCSS || '';
    }
})

ODA({ is: 'oda-jupyter-cell-html-cde',
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
    get srcdoc() {
        return `
<style>
    ::-webkit-scrollbar { width: 4px; height: 4px; };
    ::-webkit-scrollbar-track { -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); }
    ::-webkit-scrollbar-thumb { border-radius: 10px; background: var(--body-background); }
</style>
<div id="editor">
    <p>${this.cell?.source || ''}</p>
</div>
<script src="https://cdn.ckeditor.com/4.13.0/full/ckeditor.js"></script>
<script>
    let editor = CKEDITOR.replace('editor');
    editor.on('change', (e) => {
        document.dispatchEvent(new CustomEvent('change', { detail: e.editor.getData() }));
    })
    editor.on('instanceReady', (e) => {
        if(e.editor.getCommand('maximize').state==CKEDITOR.TRISTATE_OFF) e.editor.execCommand('maximize');
    })    
</script>
    `},
    listeners: {
        dblclick(e) {
            if (this.readOnly) return;
            this.editedCell = this.editedCell === this.cell ? undefined : this.cell;
        }
    },
    observers: [
        function setEditedCell(editedCell) {
            if (editedCell && editedCell === this.cell) {
                const iframe = this.$('iframe');
                iframe.srcdoc = this.srcdoc;
                this.async(() => (iframe.contentDocument || iframe.contentWindow)
                    .addEventListener("change", (e) => this.cell.source = e.detail));
            }
        }
    ]
})
