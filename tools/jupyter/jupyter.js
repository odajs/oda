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
        readOnly: {
            $def: false,
            $save: true
        },
        set url(n) {
            if (n) {
                if (!n.startsWith('http'))
                    n = path + '/' + n;
                ODA.loadJSON(n).then(async res => {
                    this.notebook = res;
                    // this.isReady = true;
                })
            }
        },
        showHiddenInfo: {
            $def: false,
            $save: true
        },
        levelMargin: {
            $def: 0,
            $save: true
        },
    },
    $pdp: {
        get jupyter() {
            return this;
        },
        notebook: Object,
        editors: {
            code: { label: 'Code', editor: 'oda-jupyter-code-editor', type: 'code' },
            text: { label: 'Text', editor: 'oda-jupyter-text-editor', type: 'text' },
            markdown: { label: 'Text', editor: 'oda-jupyter-text-editor', type: 'text', hide: true }
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
        editIdx: {
            $def: -1,
            set(n) {
                if (n >= 0) {
                    this.async(() => {
                        this.scrollToCell();
                        if (this.editIdx >= 0) {
                            const ace = this.cells[n].$cmp?.$('oda-ace-editor');
                            ace?.editor.focus();
                            const mde = this.cells[n].$cmp?.$('oda-simplemde-editor');
                            mde?.simpleMde.codemirror?.focus();
                            // mde && (mde.focus = true);
                        }
                    }, 300)
                }
            }
        },
        get _readOnly() {
            return this.notebook?.readOnly || this.readOnly;
        },
        hasChanged(detail) {
            this.fire('changed', detail);
            // this.isChanged = true;
        },
        // isChanged: false,
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
                cell._level = level > 6 ? 6 : level;
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
                    i.collapsed = true;
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
            let min = 6;
            if (this.isAllCollapsed) {
                cells.forEach(i => {
                    i.collapsed = true;
                    const l = (i.level || i._level);
                    min = l < min ? l : min;
                })
            } else {
                cells.forEach(i => {
                    if (i.$cell.cell_type)
                        i.collapsed = i.$cell.collapsed;
                    const l = (i.level || i._level);
                    min = l < min ? l : min;
                })
            }
            this.minLevel = min < 1 ? 1 : min;
            return cells;
        },
        isReady: false,
        get path() { return path },
        get pathODA() { return path.replace('tools/jupyter', 'oda.js') },
        scrollToCell(idx = this.selectedIdx) {
            this.jupyter.$('#cell-' + this.cells[idx]?.id)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
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
                height: 4px;
                justify-content: center;
                z-index: 99;
                opacity: 0;
                transition: opacity ease-out .5s;
                position: relative;
                padding: 4px;
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
                margin: -4px 4px 0 4px;
                @apply --content;
                @apply --border;
                padding: 0px 4px 0px 0px;
                border-radius: 4px;
            }
        </style>
        <div class="horizontal center">
            <div ~if="!_readOnly && cells?.length > 0" style="width: 100%; position: absolute; top: 2px; height: 1px; border-bottom: 2px solid gray;"></div>
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
        this.jupyter.hasChanged({ type: 'addCell', cell: this.cell });
        this.selectedIdx = idx;
        this.editIdx = idx;
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
            <oda-button :disabled="selectedIdx >= cells.length - 1" :icon-size icon="icons:arrow-back:270" @tap="moveCell(1)"></oda-button>
            <oda-button :hidden="cell?.$cell?.cell_type !== 'code'" :icon-size icon="icons:settings" @tap="showSettings"></oda-button>
            <oda-button :icon-size icon="icons:delete" @tap="deleteCell" style="padding: 0 8px;"></oda-button>
            <oda-button ~if="cell?.$cell?.cell_type !== 'code'" :icon-size :icon="editIdx===idx?'icons:close':'editor:mode-edit'" @tap="editIdx = editIdx===idx ? -1 : idx"> </oda-button>
        </div>
    `,
    idx: -2,
    cell: null,
    iconSize: 20,
    moveCell(v) {
        this.editIdx = -1;
        let idx = this.selectedIdx;
        const cells = this.notebook.cells.splice(idx, 1);
        idx = idx + v;
        idx = idx < 0 ? 0 : idx > this.notebook.cells.length ? this.notebook.cells.length : idx;
        this.notebook.cells.splice(idx, 0, cells[0])
        this.jupyter.hasChanged({ type: 'moveCell', cell: this.cell });
        this.async(() => this.selectedIdx = idx);
    },
    deleteCell() {
        if (window.confirm(`Do you really want delete current cell ?`)) {
            this.editIdx = -1;
            this.notebook.cells.splice(this.selectedIdx, 1);
            this.jupyter.hasChanged({ type: 'deleteCell', cell: this.cell });
        }
    },
    async showSettings() {
        if (this.cell.$cell.cell_type === 'code') {
            await ODA.showModal('oda-property-grid', { inspectedObject: this.cell.$cmp }, { minWidth: '400px', animation: 500, title: 'Настройки' })
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
                margin-left: {{marginLeft}};
            }
            oda-jupyter-toolbar {
                position: sticky;
                top: 21px;
                width: 120px;
                margin-left: auto;
                z-index: 100;
            }
            .collapsed {
                font-style: italic;
                opacity: .5;
                height: 12px; 
                background: #f7f7f7; 
                font-size: x-small;
                padding: 4px;
                border: 1px solid var(--border-color);
            }
        </style>
        <oda-jupyter-toolbar :cell :idx ~if="!_readOnly && selected"></oda-jupyter-toolbar>
    `,
    get marginLeft() {
        let lm = this.levelMargin || 0,
            min = this.jupyter.minLevel,
            level = (this.cell.level || this.cell?._level || min) - min;
        return  level * (lm < 0 ? 0 : lm) + 'px';
    },
    idx: -2,
    selected: false,
    get meta() {
        return this.cell?.$cell.metadata;
    },
    cell: {
        $def: null,
        set(n) {
            let src;    
            if (Array.isArray(n?.$cell?.source))
                src = n.$cell.source.join('');
            this.src = src || n?.$cell?.source || '';
            this.setCellMode && this.setCellMode(this.src);
            n.$cmp = this;
            if (n.$cell.metadata?.autoRun && this.run)
                this.run();
        }
    },
    src: '',
    opacity: 0,
    loaded(e) {
        this.cell.isLoaded = true;
        let isLoaded = this.cells.every(i => i.isLoaded || i.$cell.metadata?.hideCode);
        this.opacity = 1;
        if (isLoaded) {
            this.isReady = true;
            console.log('jupyter-loaded');
            this.jupyter.fire('jupyter-loaded');
        }
    },
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
                text-wrap: wrap;
                /* outline: {{cell?.collapsed && cell.levels.length ? '1px dotted var(--border-color)' :'none'}}; */
            }
            oda-markdown-wasm-viewer {
                opacity: {{noSrcOpacity}};
                padding: 0 8px;
            }
            .md {
                max-height: {{editIdx === idx ? 'calc(100vh - 100px)' : 'unset'}}; 
            }
        </style>
        <div class="horizontal flex">
            <div ~if="isReady && levelsCount" class="vertical" ~style="{width: iconSize+'px'}">
                <oda-icon :icon="expanderIcon" style="position: sticky; top: 0; cursor: pointer; padding: 4px; margin: auto 0; margin-left: -3px" @tap="toggleCollapse"></oda-icon>
            </div>
            <oda-simplemde-editor autofocus :sync-scroll-with="divMD" :value="src" ~if="!readOnly && editIdx===idx" style="max-height: calc(100vh - 100px); max-width: 50%; min-width: 50%; padding: 0px; margin: 0px;" @change="editorValueChanged"></oda-simplemde-editor>
            <div class="md md-result vertical flex" style="overflow-y: auto">
                <oda-markdown-wasm-viewer @loaded="loaded" :presetcss tabindex=0 class="flex" :src="src || _src" @dblclick="changeEditMode" @click="markedClick"></oda-markdown-wasm-viewer>
            </div>
        </div>
        <div class="collapsed horizontal flex" ~if="showHiddenInfo && cell?.collapsed && cell.levels.length">Скрыто {{levelsCount}} ячеек</div>
    `,
    _src: 'Чтобы изменить содержимое ячейки, дважды нажмите на нее',
    presetcss: path + '/preset.css',
    get divMD(){
        return this.$('div.md-result') || undefined;
    },
    get noSrcOpacity() {
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
                outline: {{border || '1px solid var(--border-color)'}};
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
                padding: 0 4px;
            }
            .cell-h3 {
                font-weight: 500;
                font-size: 1.44em;
                margin: 6px 6px 6px 12px;
            }
            .btns {
                border-right: {{border || '1px solid var(--border-color)'}}; 
                padding: 4px 0px;
                width: 27px;
            }
            .cell-select {
                position: absolute;
                width: 24px;
                height: 24px;
                right: -6px;
                top:-12px;
                /* border: 1px solid red; */
            }
            oda-ace-editor {
                opacity: 1;
                filter: unset;
            }
        </style>
        <div ~if="isReady && cell.label" class="horizontal" ~style="{borderBottom: cell?.collapsed ? 0 : 1 + 'px solid var(--border-color)'}" @dblclick="toggleCollapse">
            <div class="vertical" ~style="{width: iconSize+'px'}">
                <oda-icon :icon="expanderIcon" style="margin-left: -4px; margin-top: 6px; cursor: pointer;" @tap="toggleCollapse"></oda-icon>
            </div>
            <h3 class="cell-h3">{{cell.label}}</h3>
        </div>
        <div ~show="!cell.collapsed" class="horizontal">
            <div ~if="!hideCode && !hideRun" class="btns vertical">
                <oda-icon ~if="!hideRun" :icon-size="iconSize" :icon="iconRun" @pointerover="iconRunOver='av:play-circle-outline'" @tap="run" @pointerout="iconRunOver=''" style="cursor: pointer; position: sticky; top: 0" :fill="isRun ? 'green' : 'black'"></oda-icon>
                <oda-icon id="icon-close" ~if="!hideResult && !hideConsole && isRun && iconCloseShow" :icon-size="iconSize" icon="eva:o-close-circle-outline" @tap="isRun=false; runConsoleData = undefined;" style="cursor: pointer; position: sticky;"></oda-icon>
            </div>
            <div class="vertical flex">
                <oda-ace-editor ~if="!hideCode" :src :mode="mode || 'javascript'" :theme="theme || ''" font-size="12" class="flex" show-gutter="false" max-lines="Infinity" @change="editorValueChanged" @loaded="aceLoaded" :show-gutter="showGutter" :read-only></oda-ace-editor>
                <div id="splitter1" ~if="!hideCode && !hideResult && isRun && mode==='html'" ~style="{borderTop: isRun ? '1px solid var(--border-color)' : 'none'}"></div>
                <div id="result">
                    <iframe ~if="!hideResult && isRun && mode==='html'" :srcdoc></iframe>
                    <div id="splitter2" ~if="!hideResult && !hideConsole && isRun && runConsoleData?.length" ~style="{borderTop: isRun ? '1px solid var(--border-color)' : 'none'}"></div>
                    <div ~if="!hideConsole && isRun && runConsoleData?.length" style="min-height: 36px; margin: 2px 0;">
                        <div ~for="runConsoleData" style="padding: 4px;" ~style="runConsoleStyle($for.item)">{{$for.item.str}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="collapsed horizontal flex" ~if="showHiddenInfo && cell?.collapsed && cell.levels.length">Скрыто {{levelsCount+1}} ячеек</div>
        <div class="cell-select"></div>
    `,
    $public: {
        readOnly: {
            $def: false,
            set(n) { this.setMeta('readOnly', n) },
            get() { return this.meta?.readOnly;
            }
        },
        autoRun: {
            $def: false,
            set(n) { this.setMeta('autoRun', n) },
            get() { return this.meta?.autoRun;
            }
        },
        hideRun: {
            $def: false,
            set(n) { this.setMeta('hideRun', n) },
            get() { return this.meta?.hideRun}
        },
        hideCode: {
            $def: false,
            set(n) { this.setMeta('hideCode', n) },
            get() { return this.meta?.hideCode }
        },
        hideResult: {
            $def: false,
            set(n) { this.setMeta('hideResult', n) },
            get() { return this.meta?.hideResult }
        },
        hideConsole: {
            $def: false,
            set(n) { this.setMeta('hideConsole', n) },
            get() { return this.meta?.hideConsole }
        },
        showGutter: {
            $def: false,
            set(n) { this.setMeta('showGutter', n) },
            get() { return this.meta?.showGutter }
        },
        mode: {
            $def: '',
            $list: ['javascript', 'html', 'css', 'phyton'],
            set(n) { this.setMeta('mode', n) },
            get() { return this.meta?.mode }
        },
        theme: {
            $def: '',
            $list: ['ambiance', 'chaos', 'chrome', 'clouds', 'clouds_midnight', 'cobalt', 'crimson_editor', 'dawn', 'dracula', 'dreamweaver', 'eclipse', 'github', 'gob', 'gruvbox', 'idle_fingers', 'iplastic', 'katzenmilch', 'kr_theme', 'kuroir', 'merbivore', 'merbivore_soft', 'monokai', 'mono_industrial', 'pastel_on_dark', 'solarized_dark', 'solarized_light', 'sqlserver', 'tomorrow_night_bright', 'tomorrow_night_eighties', 'twilight', 'vibrant_ink', 'xcode'],
            set(n)  { this.setMeta('theme', n) },
            get() { return this.meta?.theme }
        },
        border: {
            $def: '',
            set(n) { this.setMeta('border', n) },
            get() { return this.meta?.border }
        },
    },
    setMeta(prop, n) {
        this.cell.$cell.metadata ||= {}; 
        this.cell.$cell.metadata[prop] = n;
        this.jupyter.hasChanged({ type: 'editCell', cell: this.cell });
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
        this.loaded();
        const ace = this.$('oda-ace-editor');
        ace?.editor.setOption('fontSize', '16px');
    },
    setCellMode(src = this.$('oda-ace-editor')?.value || this.src || '') {
        if (this.mode) return;
        if (this.meta?.colab) {
            this.mode = 'python';
            return;
        }
        this.mode = 'javascript';
        let arr = ['<!DOCTYPE html>', '<!--', '</script>', '</html>', '</body>', '</head>', '<link', '<meta ', '</'];
        let regx = new RegExp(arr.join('|'));
        if (regx.test(src))
            this.mode = 'html';
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
        if (this.mode !== 'html') {
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
                    if (cell.cell_type === 'code' && cell.metadata?.mode !== 'html') {
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
                        this.opacity = 1;
                    })
                    resizeObserver.observe(iframe.contentDocument.body);
                })
                this.srcdoc = srcdoc;
            })
        }
        if (!this.autoRun) {
            this.async(() => {
                this.iconCloseTop = (this.$('#splitter1')?.offsetTop || this.$('#splitter2')?.offsetTop || 28) - 28 + 'px';
                this.iconCloseShow = true;
                this.$('#result')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
            }, 100)
        }
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
            this.levels?.map(i => i.hidden = v);
            if (!v) {
                this.levels.forEach(i => {
                    if (i.collapsed) {
                        i.levels.forEach(l => {
                            l.hidden = true;
                        })
                    }
                })
            }
        }
    },
    _init(cell){
        this.hidden = cell.hidden;
        this.$cell = cell.$cell;
        this.levels = cell.levels;
        this.id = cell.$cell.metadata?.id || cell.id;
        this.label = cell.label;
        this._level = cell._level;
        this.level = cell.level;
        this.collapsed = cell.collapsed;
    }
}) {
    constructor(cell) {
        super();
        this._init(cell);
    }
}
