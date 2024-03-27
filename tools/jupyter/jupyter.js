const path = import.meta.url.split('/').slice(0, -1).join('/');

ODA({ is: 'oda-jupyter', imports: '@oda/button',
    template: `
        <style>
            :host{
                @apply --vertical;
                @apply --flex;
                padding: 12px 6px;
            }
        </style>
        <div ~if="!isReady" class="horizontal flex" style="position: fixed;top: 50%;left: 50%;z-index: 100;transform: translate3d(-50%, -50%, 0);pointer-events: none;">
            <oda-icon icon="odant:spin" icon-size="64"></oda-icon>
        </div>
        <oda-jupyter-divider idx="-1" :hover="isReady && !cells?.length"></oda-jupyter-divider>
        <oda-jupyter-cell-container ~for="cells" :item="$for.item" :index="$for.index"></oda-jupyter-cell-container>
    `,
    $public: {
        $pdp: true,
        iconSize: 24,
        readOnly: false,
        set url(n) {
            if (n) {
                if (!n.startsWith('http'))
                    n = path + '/' + n;
                ODA.loadJSON(n).then(async res => {
                    this.notebook = res;
                })
            }
        }
    },
    $pdp: {
        get jupyter() {
            return this;
        },
        notebook: null,
        editors: {
            code: { label: 'Код', editor: 'oda-jupyter-code-editor', type: 'code' },
            text: { label: 'Текст', editor: 'oda-jupyter-text-editor', type: 'text' },
            markdown: { label: 'Текст', editor: 'oda-jupyter-text-editor', type: 'text', hide: true }
        },
        get selected() {
            return this.cells[this.selectedIdx];
        },
        set selected(n) {
            if (n)
                this.selectedIdx = this.cells.findIndex(i => i.id === n.id);
        },
        selectedIdx: {
            $def: -1,
            set(n) {
                this.editIdx = -1;
            }
        },
        editIdx: -1,
        get _readOnly() {
            return this.notebook?.readOnly || this.readOnly;
        },
        hasChanged(detail) {
            // console.log(detail);
            this.fire('changed', detail);
            this.isChanged = true;
        },
        isChanged: false,
        isAllCollapsed: false,
        get cells() {
            let level = 0, ids = {}, cells = [];
            this.notebook?.cells.map((i, idx) => {
                let src = '',
                    firstStr = '',
                    id = i.metadata?.id || this.getID(),
                    cell = { id, idx, $cell: i, levels: [] };
                if (Array.isArray(i.source)) {
                    src = i.source;
                } else if (typeof i.source === 'string') {
                    src = i.source.split('\n');
                }
                firstStr = src[0] || '';
                if (firstStr?.startsWith('#') && i.cell_type !== 'code') {
                    let str = firstStr.split(' ');
                    cell.label = src[0].replace(str[0], '').trim();
                    level = str[0].length;
                    cell.level = level = level > 6 ? 6 : level;
                    if (level === 1) ids = {};
                    ids[level] = id;
                } else if (firstStr?.startsWith('#@title ') ) {
                    cell.label = firstStr.replace('#@title ', '').trim();
                    cell.level = level = 3;
                    ids[level] = id;
                    cell.collapsed = true;
                }
                let _cell = new CELL(cell);
                for (let i = 1; i <= level; i++) {
                    if (ids[i]) {
                        let up = cells.filter(c => c.id === ids[i])[0];
                        if (up && !cell.level || i < cell.level) {
                            up.levels.push(_cell);
                        }
                    }
                }
                cells.push(_cell);
            })
            if (this.isAllCollapsed)
                cells.forEach(i => {
                    i.collapsed = true;
                })
            // console.log(cells);
            return cells;
        },
        isReady: false,
        get path() { return path },
        get pathODA() { return path.replace('tools/jupyter', 'oda.js') },
        scrollToCell(idx = this.selectedIdx) {
            this.async(() => {
                this.jupyter.$('#cell-' + this.cells[idx].id)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
            })
        }
    },
    $listeners: {
        tap(e) { this.selectedIdx = this.editIdx = -1 }
    },
    getID() {
        return Math.floor(Math.random() * Date.now()).toString(16);
    },
    attached() {
        this.async(e => {
            if (!this.notebook?.cells?.length) this.isReady = true;
        }, 100)
    }
})

ODA({
    is: 'oda-jupyter-cell-container',
    template: `
        <style>
            :host{
                @apply --vertical; 
                @apply --no-flex;
            }
        </style>
        <div ~is="editors?.[item.$cell.cell_type || 'code'].editor" :idx="index" :cell="item" :shadow="selectedIdx === index" :selected="selectedIdx === index" @tap.stop="selectedIdx = (_readOnly ? -1 : index);"></div>
        <oda-jupyter-divider :idx="index" style="margin-top: 4px;"></oda-jupyter-divider>
    `,
    item: null,
    index: -1,
    id: {
        $attr: true,
        get(){
            return `cell-${this.item.id}`;
        }
    },
    hidden: {
        $attr: true,
        get(){
            return this.item?.hidden;
        }
    }
})

ODA({ is: 'oda-jupyter-divider',
    template: `
        <style>
            :host {
                @apply --vertical;
                height: 8px;
                justify-content: center;
                z-index: 99;
                opacity: 0;
                transition: opacity ease-out .5s;
                position: relative;
                padding: 1px;
            }
            :host([hover]) {
                box-shadow: none !important;
            }
            :host([hover]) {
                opacity: 1;
            }
            :host(:hover) {
                opacity: 1;
            }
            oda-button {
                font-size: 14px;
                margin: 0px 4px;
                @apply --content;
                @apply --border;
                padding: 0px 4px 0px 0px;
                border-radius: 4px;
            }
        </style>
        <div class="horizontal center">
            <div ~if="!_readOnly && idx!==-1" style="width: 100%; position: absolute; top: 2px; height: 1px; border-bottom: 2px solid gray;"></div>
            <oda-button ~if="!_readOnly && !$for.item.hide" :icon-size icon="icons:add" ~for="Object.values(editors)" @tap.stop="addCell($for.item)">{{$for.item.label}}</oda-button>
        </div>
    `,
    idx: -2,
    addCell(i) {
        let idx = this.idx + 1;
        this.selectedIdx = this.editIdx = -1;
        this.notebook ||= {};
        this.notebook.cells ||= [];
        this.notebook.cells.splice(idx, 0, { cell_type: i.type, source: '', metadata: { id: this.jupyter.getID() } });
        this.jupyter.hasChanged({ type: 'addCell', cell: this.notebook.cell });
        this.async(() => {
            this.selectedIdx = idx;
        }, 100)
    }
})

ODA({ is: 'oda-jupyter-toolbar', imports: '@tools/containers, @tools/property-grid',
    template: `
        <style>
            .top {
                @apply --horizontal;
                @apply --no-flex;
                @apply --content;
                @apply --shadow;
                position: absolute;
                right: 8px;
                padding: 1px;
                border-radius: 4px;
                z-index: 100;
                margin-top: -20px;
            }
        </style>
        <div class="top">
            <oda-button :disabled="selectedIdx === 0" :icon-size icon="icons:arrow-back:90" @tap="moveCell(-1)"></oda-button>
            <oda-button :disabled="selectedIdx >= notebook?.cells?.length - 1" :icon-size icon="icons:arrow-back:270" @tap="moveCell(1)"></oda-button>
            <oda-button :hidden="cell?.$cell?.cell_type !== 'code'" :icon-size icon="icons:settings" @tap="showSettings"></oda-button>
            <oda-button :icon-size icon="icons:delete" @tap="deleteCell" style="padding: 0 8px;"></oda-button>
            <oda-button ~if="cell?.$cell?.cell_type !== 'code'" :icon-size :icon="editIdx===idx?'icons:close':'editor:mode-edit'" @tap="editIdx = editIdx===idx ? -1 : idx"> </oda-button>
        </div>
    `,
    idx: -2,
    cell: null,
    cmp: null,
    iconSize: 20,
    moveCell(v) {
        this.editIdx = -1;
        let idx = this.selectedIdx;
        const cells = this.notebook.cells.splice(idx, 1);
        idx = idx + v;
        idx = idx < 0 ? 0 : idx > this.notebook.cells.length ? this.notebook.cells.length : idx;
        this.notebook.cells.splice(idx, 0, cells[0])
        this.jupyter.hasChanged({ type: 'moveCell', cell: this.notebook.cell });
        this.async(() => this.selectedIdx = idx);
    },
    deleteCell() {
        if (window.confirm(`Do you really want delete current cell ?`)) {
            this.jupyter.hasChanged({ type: 'deleteCell', cell: this.notebook.cells[this.selectedIdx] });
            this.editIdx = -1;
            this.notebook.cells.splice(this.selectedIdx, 1);
        }
    },
    async showSettings() {
        if (this.cmp.cell.$cell.cell_type === 'code') {
            await ODA.showModal('oda-property-grid', { inspectedObject: this.cmp }, { minWidth: '400px', animation: 500, title: 'Настройки' })
        }
    }
})

ODA({ is: 'oda-jupyter-cell',
    template: `
        <style>
            :host {
                @apply --no-flex;
                position: relative;
                padding: 1px;
                margin: 0 2px;
                opacity: {{opacity}};
                transition: opacity ease-out .1s;
            }
            oda-jupyter-toolbar {
                position: sticky;
                top: 21px;
                width: 120px;
                margin-left: auto;
                z-index: 100;
            }
        </style>
        <oda-jupyter-toolbar :cmp :cell :idx ~if="!_readOnly && selected"></oda-jupyter-toolbar>
    `,
    idx: -2,
    selected: false,
    cell: null,
    src: '',
    opacity: 0,
    set cell(n) {
        let src;    
        if (Array.isArray(n?.$cell?.source))
            src = n.$cell.source.join('');
        this.src = src || n?.$cell?.source || '';
        this.setCellMode && this.setCellMode(this.src);
    },
    loaded(e) {
        this.cell.isLoaded = true;
        let isLoaded = this.cells.every(i => i.isLoaded);
        this.opacity = 1;
        if (isLoaded) {
            this.isReady = true;
            // console.log('jupyter-loaded');
            this.jupyter.fire('jupyter-loaded');
        }
    },
    get cmp() { return this },
    toggleCollapse() {
        this.cell.collapsed = !this.cell.collapsed;
    },
    get levelsCount() { 
        return this.cell?.levels?.length || ''
    },
    get expanderIcon(){
        return this.cell.collapsed ? 'icons:chevron-right' : 'icons:expand-more';
    }
})

ODA({ is: 'oda-jupyter-text-editor', imports: '@oda/simplemde-editor,  @oda/markdown-wasm-viewer', extends: 'oda-jupyter-cell',
    template: `
        <style>
            oda-md-viewer::-webkit-scrollbar { width: 0px; height: 0px; }
            :host {
                @apply --vertical;
                @apply --flex;
                position: relative;
            }
            oda-markdown-wasm-viewer {
                opacity: {{opacity}};
                border: none;
                outline: none;
            }
            .collapsed {
                font-style: italic;
                opacity: .5;
                position: absolute; 
                bottom: 0; 
                width: calc(100% - 18px); 
                height: 14px; 
                background: lightgray; 
                border: 1px stroke gray; 
                margin: 2px;
                font-size: x-small;
                padding: 4px 0 0 12px;
            }
            .md {
                max-height: {{editIdx === idx ? 'calc(100vh - 100px)' : 'unset'}}; 
            }
        </style>
        <div class="horizontal flex">
            <div class="vertical" ~style="{width: iconSize+8+'px'}">
                <oda-icon ~if="isReady && levelsCount" :icon="expanderIcon" style="cursor: pointer; padding: 4px" @tap="toggleCollapse"></oda-icon>
            </div>
            <oda-simplemde-editor :value="src" ~if="!readOnly && editIdx===idx" style="max-height: calc(100vh - 100px); max-width: 50%; min-width: 50%; padding: 0px; margin: 0px;" @change="editorValueChanged"></oda-simplemde-editor>
            <div class="md vertical flex" style="overflow-y: auto">
                <oda-markdown-wasm-viewer @loaded="loaded" tabindex=0 class="flex" :src="src || _src" :pmargin="'0px'" @dblclick="changeEditMode" @click="markedClick"></oda-markdown-wasm-viewer>
            </div>
            <div class="collapsed horizontal flex" ~if="cell?.collapsed && cell.levels.length">Скрыто {{levelsCount}} ячеек</div>
        </div>
    `,
    _src: 'Чтобы изменить содержимое ячейки, дважды нажмите на нее',
    get opacity() {
        return this.src ? 1 : .3;
    },
    editorValueChanged(e) {
        this.cell.$cell.source = this.src = e.detail.value;
        this.jupyter.hasChanged({ type: 'editCell', cell: this.cell });
    },
    markedClick(e) {
        this.selectedIdx = this.idx;
    },
    changeEditMode() {
        this.editIdx = this.editIdx === this.idx ? -1 : this.idx;
        if (this.editIdx === this.idx){
            this.scrollToCell(this.editIdx);
        }
    }
})

import aliases from '../../aliases.js';
ODA({ is: 'oda-jupyter-code-editor', imports: '@oda/ace-editor', extends: 'oda-jupyter-cell',
    template: `
        <style>
            :host {
                --border-color: lightgray;
                @apply --vertical;
                @apply --flex;
                outline: 1px solid var(--border-color);
                position: relative;
            }
            oda-icon {
                padding: 4px;
                height: {{iconSize}}px;
            }
            #icon-close {
                margin-top: {{iconCloseTop}};
                top: {{iconSize}}px;
            }
            #icon-close:hover {
                fill: red;
            }
            iframe {
                width: 100%; 
                border: none;
                min-height: 36px;
                height: 36px;
                overflow: auto;
            }
        </style>
        <div ~if="isReady && cell.label" class="horizontal" ~style="{borderBottom: cell?.collapsed ? 0 : 1 + 'px solid var(--border-color)'}">
            <div class="vertical" ~style="{width: iconSize+8+'px'}">
                <oda-icon :icon="expanderIcon" style="margin-left: -4px; margin-top: 16px; cursor: pointer;" @tap="toggleCollapse"></oda-icon>
            </div>
            <h3 @dblclick="toggleCollapse">{{cell.label}}</h3>
        </div>
        <div ~show="!cell.collapsed" class="horizontal">
            <div class="vertical" style="border-right: 1px solid var(--border-color); padding: 4px 0px; width: 27px;">
                <oda-icon ~if="!hideRun" :icon-size="iconSize" :icon="iconRun" @pointerover="iconRunOver='av:play-circle-outline'" @tap="run" @pointerout="iconRunOver=''" style="cursor: pointer; position: sticky; top: 0" :fill="isRun ? 'green' : 'black'"></oda-icon>
                <oda-icon id="icon-close" ~if="!hideResult && !hideConsole && isRun && iconCloseShow" :icon-size="iconSize" icon="eva:o-close-circle-outline" @tap="isRun=false; runConsoleData = undefined;" style="cursor: pointer; position: sticky;"></oda-icon>
            </div>
            <div class="vertical flex">
                <oda-ace-editor @loaded="loaded" ~if="!hideCode" :src :mode="cell?.mode || 'javascript'" :theme="cell?.theme || ''" font-size="12" class="flex" show-gutter="false" max-lines="Infinity" @change="editorValueChanged" @loaded="aceLoaded" :show-gutter="showGutter"></oda-ace-editor>   
                <div id="splitter1" ~if="!hideResult && isRun && cell?.mode==='html'" ~style="{borderTop: isRun ? '1px solid var(--border-color)' : 'none'}"></div>
                <div id="result">
                    <iframe ~if="!hideResult && isRun && cell?.mode==='html'" :srcdoc></iframe>
                    <div id="splitter2" ~if="!hideResult && !hideConsole && isRun && runConsoleData?.length" ~style="{borderTop: isRun ? '1px solid var(--border-color)' : 'none'}"></div>
                    <div ~if="!hideConsole && isRun && runConsoleData?.length" style="min-height: 36px; margin: 2px 0;">
                        <div ~for="runConsoleData" style="padding: 4px;" ~style="runConsoleStyle($for.item)">{{$for.item.str}}</div>
                    </div>
                </div>
            </div>
        </div>
    `,
    $public: {
        autoRun: {
            $def: false,
            set(n) { this.cell.autoRun = n },
            get() { return this.cell.autoRun }
        },
        hideRun: {
            $def: false,
            set(n) { this.cell.hideRun = n },
            get() { return this.cell.hideRun }
        },
        hideCode: {
            $def: false,
            set(n) { this.cell.hideCode = n },
            get() { return this.cell.hideCode }
        },
        hideResult: {
            $def: false,
            set(n) { this.cell.hideResult = n },
            get() { return this.cell.hideResult }
        },
        hideConsole: {
            $def: false,
            set(n) { this.cell.hideConsole = n },
            get() { return this.cell.hideConsole }
        },
        showGutter: {
            $def: false,
            set(n) { this.cell.showGutter = n },
            get() { return this.cell.showGutter }
        },
        mode: {
            $def: '',
            $list: ['javascript', 'html', 'css', 'phyton'],
            set(n) { this.cell.mode = n },
            get() { return this.cell.mode }
        },
        theme: {
            $def: '',
            $list: ['ambiance', 'chaos', 'chrome', 'clouds', 'clouds_midnight', 'cobalt', 'crimson_editor', 'dawn', 'dracula', 'dreamweaver', 'eclipse', 'github', 'gob', 'gruvbox', 'idle_fingers', 'iplastic', 'katzenmilch', 'kr_theme', 'kuroir', 'merbivore', 'merbivore_soft', 'monokai', 'mono_industrial', 'pastel_on_dark', 'solarized_dark', 'solarized_light', 'sqlserver', 'tomorrow_night_bright', 'tomorrow_night_eighties', 'twilight', 'vibrant_ink', 'xcode'],
            set(n) { this.cell.theme = n },
            get() { return this.cell.theme }
        }
    },
    iconSize: 18,
    srcdoc: '',
    get iconRun() {
        return this.isRun ? 'av:play-circle-outline' : this.iconRunOver || 'bootstrap:code-square';
    },
    iconRunOver: '',
    iconCloseTop: '',
    iconCloseShow: false,
    isRun: false,
    runConsoleData: undefined,
    runConsoleStyle(i) {
        let colors = { log: 'gray', info: 'blue', warn: 'orange', error: 'red' };
        return `color: ${colors[i.method]}`;
    },
    aceLoaded(e) {
        this.$('oda-ace-editor').editor.setOption('fontSize', '16px');
    },
    setCellMode(src = this.$('oda-ace-editor')?.value || '') {
        if (this.cell.mode) return;
        if (this.cell?.metadata?.colab) {
            this.cell.mode = 'python';
            return;
        }
        this.cell.mode = 'javascript';
        let arr = ['<!DOCTYPE html>', '<!--', '</script>', '</html>', '</body>', '</head>', '<link', '<meta ', '</'];
        let regx = new RegExp(arr.join('|'));
        if (regx.test(src))
            this.cell.mode = 'html';
    },
    editorValueChanged(e) {
        this.iconCloseTop = undefined;
        this.cell.$cell.source = this.src = e.detail.value;
        this.jupyter.hasChanged({ type: 'editCell', cell: this.cell });
        this.setCellMode();
    },
    async run() {
        this.iconCloseShow = false;
        this.runConsoleData = undefined;
        this.iconCloseTop = undefined;
        this.srcdoc = '';
        let src = this.src;
        if (this.cell.mode !== 'html') {
            let fn = Function('w', this.fnStr);
            fn();
            this.runConsoleData = [...window._runConsoleData];
            window.runConsoleData = this.runConsoleData;
            this.isRun = true;
            try {   
                fn = new Function(`try { ${src} } catch (e) { console.error(e) }`);
                fn();
            } catch (e) { console.error(e) }
            if (src.includes('import(')) {
                window.runConsoleData = this.runConsoleData = [];
                this.async(() => fn(), 300);
            }
            src = src.split('\n').filter(i => i).at(-1);
            window[src] && console.log(window[src]);
            this.iconCloseShow = true;
        } else {
            this.isRun = true;
            this.async(() => {
                let source = this.cell.$cell.source;
                const iframe = this.$('iframe');
                let code = '',
                    _code = source.matchAll(new RegExp('</oda-' + '(.*)' + '>', 'g'));
                _code = Array.from(_code, x => x[1]);
                _code = _code.map(i => 'oda-' + i);
                // console.log(_code)
                for (let i = 0; i < this.idx; i++) {
                    const cell = this.cells[i].$cell;
                    let src = cell.source,
                        _path = path.replace('tools/jupyter', '');
                    if (src.includes('import ')) {
                        Object.keys(aliases).forEach(k => {
                            if (src.includes(k)) {
                                src = src.replaceAll(k, _path + aliases[k]);
                            }
                        })
                    }
                    if (cell.cell_type === 'code' && cell.mode !== 'html') {
                        if (_code.some(v => source.includes(v))) {
                            code += src + '\n';
                        } 
                    }
                }
                let srcdoc = `
<!DOCTYPE html>
<style>
    html, body {
        margin: 0;
        padding: 0;
        position: relative;
        font-family: monospace;
        font-size: 18px;
    }
    * *, *:before, *:after {  
        box-sizing: border-box;
    }
</style>
<script async>
    window._runConsoleData = [];
    var overrideСonsole = () => {
        ${this.fnStr}
    }
    overrideСonsole();
</script>
<script type="module">
    import '${this.pathODA}';
    ${code || ''}
</script>` + this.src;
                iframe.addEventListener('load', () => {
                    this.runConsoleData = [...(iframe.contentWindow._runConsoleData || [])];
                    iframe.contentWindow.runConsoleData = this.runConsoleData;
                    const resizeObserver = new ResizeObserver((e) => {
                        iframe.style.height = iframe.contentDocument.body.scrollHeight + 'px';
                        iframe.style.opacity = 1;
                    })
                    resizeObserver.observe(iframe.contentDocument.body);
                })
                this.srcdoc = srcdoc;
            })
        }
        this.async(() => {
            this.iconCloseTop = (this.$('#splitter1')?.offsetTop || this.$('#splitter2')?.offsetTop || 28) - 28 + 'px';
            this.iconCloseShow = true;
            this.$('#result')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }, 100)
    },
    fnStr: `
w = window;
let console = w.console;
if (!console) return;
this.runConsoleData = [];
w.runConsoleData = undefined;
w._runConsoleData = [];
if (!w.useJConsole) {
    w.useJConsole = true;
    w.print = (e) => console.log(e);
    w.log = (e) => console.log(e);
    w.info = (e) => console.info(e);
    w.warn = (e) => console.warn(e);
    w.error = (e) => console.error(e);
    let intercept = (method) => {
        let original = console[method];
        console[method] = function () {
            let message = arguments;
            if (original.apply) {
                original.apply(console, arguments);
            } else {
                message = Array.prototype.slice.apply(arguments).join(' ');
                original(message);
            }
            if (w.runConsoleData) {
                w.runConsoleData.push({ method, str: Array.prototype.slice.apply(message).join(' ') });
            } else {
                w._runConsoleData.push({ method, str: Array.prototype.slice.apply(message).join(' ') });
            }
        }
    }
    ['log', 'info', 'warn', 'error'].forEach(i => intercept(i));
}
        `
})

class CELL extends ROCKS({
    levels: undefined,
    hidden: {
        $def: false,
    },
    collapsed: {
        $def: false,
        set(v) {
            this.levels?.map(i => {
                i.hidden = v;
            })
        }
    },
    _init(cell){
        this.hidden = cell.hidden;
        this.$cell = cell.$cell;
        this.levels = cell.levels;
        this.id = cell.id;
        this.label = cell.label;
        this.level = cell.level;
        this.collapsed = cell.collapsed;
    }
}) {
    constructor(cell) {
        super();
        this._init(cell);
    }
    get autoRun() { return this.$cell.autoRun }
    set autoRun(v) { this.$cell.autoRun = v }
    get hideRun() { return this.$cell.hideRun }
    set hideRun(v) { this.$cell.hideRun = v }
    get hideCode() { return this.$cell.hideCode }
    set hideCode(v) { this.$cell.hideCode = v }
    get hideResult() { return this.$cell.hideResult }
    set hideResult(v) { this.$cell.hideResult = v }
    get hideConsole() { return this.$cell.hideConsole }
    set hideConsole(v) { this.$cell.hideConsole = v }
    get showGutter() { return this.$cell.showGutter }
    set showGutter(v) { this.$cell.showGutter = v }
    get mode() { return this.$cell.mode }
    set mode(v) { this.$cell.mode = v }
    get theme() { return this.$cell.theme }
    set theme(v) { this.$cell.theme = v }

}
