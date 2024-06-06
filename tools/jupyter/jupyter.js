const jupyter_path = import.meta.url.split('/').slice(0, -1).join('/');
const path = window.location.href.split('/').slice(0, -1).join('/');

const run_context = Object.create(null);
run_context.console_data = [];
const console_original = console.log;
console.log = (...e)=>{
    console_original.call(window.console, ...e);
    run_context.console_data.push({method: 'log', data: e})
    return e
}

run_context.print = (...e) => console.log(...e);
run_context.log = (...e) => console.log(...e);
run_context.info = (...e) => console.info(...e);
run_context.warn = (...e) => console.warn(...e);
run_context.error = (...e) => console.error(...e);

window.run_context = run_context;

ODA({ is: 'oda-jupyter', imports: '@oda/button, @oda/markdown, @oda/html-editor',
    template: `
        <style>
            :host{
                @apply --vertical;
                @apply --flex;
                padding: 12px 6px;
            }
        </style>
        <div class="no-flex vertical" style="overflow: visible;">
            <oda-jupyter-divider></oda-jupyter-divider>
            <oda-jupyter-cell :shadow="$for.item === selectedCell || $for.item.id === selectedCell?.id" ~for="cells" :cell="$for.item" ~show="!$for.item.hidden"></oda-jupyter-cell>
        </div>

    `,
    $public: {
        isChanged:{
            $type: Boolean,
            get(){
                return this.notebook.isChanged;
            },
            set(n){
                this.notebook.isChanged = n;
            }
        },
        $pdp: true,
        iconSize: 24,
        readOnly: false,
        file_path: String,
        get url() {
            if (this.file_path?.startsWith('http'))
                return this.file_path;
            return path + '/' + this.file_path;
        },
        showCollapsedInfo: {
            $def: false,
            $save: true
        },
        levelMargin: {
            $def: 0,
            $save: true
        }
    },
    $pdp: {
        get jupyter() {
            return this;
        },
        get notebook() {
            this.style.opacity = 0;
            const nb =  new JupyterNotebook(this.url);
            nb.listen('changed', (e)=>{
                this.$render();
            })
            this.async(()=>{
                this.style.opacity = 1;
            }, 1000)
            return nb;
        },
        editors: {
            code: { label: 'Code', editor: 'oda-jupyter-code-editor', type: 'code' },
            text: { label: 'Text', editor: 'oda-markdown', type: 'text' },
            html: { label: 'HTML', editor: 'oda-html-editor', type: 'html' }
        },
        selectedCell: null,
        get cells() {
            return this.notebook?.cells;
        }
    }
})

ODA({ is: 'oda-jupyter-cell',
    template: `
        <style>
            :host{
                @apply --vertical; 
                @apply --no-flex;
                position: relative;
                margin-bottom: 2px;
                width: 100%;
                min-height: 50px;
            }
            oda-icon:hover{
                @apply --success;
            }
        </style>
        <oda-jupyter-toolbar :cell ~if="!readOnly && selected"></oda-jupyter-toolbar>
        <div class="vertical" ~style="{marginLeft: (editMode?0:levelMargin * cell.level)+'px'}">
            <div class="horizontal" >
                <oda-icon ~if="cell.allowExpand" :icon="expanderIcon" @tap="this.cell.collapsed = !this.cell.collapsed"></oda-icon>
                <div flex id="control" ~is="editor" :cell  @tap.stop="selectedCell = cell" ::edit-mode ::value show-preview></div>
            </div>
            <div info ~if="cell.collapsed" class="horizontal" @tap="cell.collapsed = false">
                <oda-icon  style="margin: 4px;" :icon="childIcon"></oda-icon>
                <div style="margin: 8px;">Hidden {{cell.childrenCount}} cells</div>
            </div>
        </div>
  
        <oda-jupyter-divider></oda-jupyter-divider>
    `,
    get childIcon(){
        return this.cell.childCodes.length?'av:play-circle-outline':'bootstrap:text-left';
    },
    get editor() {
        return this.editors[this.cell.type]?.editor ?? this.editors.text.editor;
    },
    value:{
        get(){
            return this.cell.src;
        },
        set(n){
            this.cell.src = n
        }
    },
    $pdp: {
        editMode: false,
        cell: null,
        get selected() {
            return this.selectedCell === this.cell;
        },
        get control(){
            return this.$('#control');
        },
    },
    get expanderIcon(){
        return this.cell.collapsed ? 'icons:chevron-right' : 'icons:expand-more';
    }
})

ODA({ is: 'oda-jupyter-divider',
    template: `
        <style>
            :host {
                @apply --vertical;
                height: 3px;
                justify-content: center;
                z-index: 99;
                opacity: 0;
                transition: opacity ease-out .1s;
                position: relative;
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
            <div ~if="!readOnly && cells?.length > 0" style="width: 100%; position: absolute; top: 2px; height: 1px; border-bottom: 2px solid gray;"></div>
            <oda-button ~if="!readOnly" :icon-size icon="icons:add" ~for="editors" @tap.stop="add(cell, $for.key)">{{$for.key}}</oda-button>
        </div>
    `,
    add(cell, key){
        this.selectedCell = this.notebook.add(cell, key);
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
            <oda-button :disabled="!cell.prev" :icon-size icon="icons:arrow-back:90" @tap="cell.move(-1)"></oda-button>
            <oda-button :disabled="!cell.next" :icon-size icon="icons:arrow-back:270" @tap="cell.move(1)"></oda-button>
            <oda-button :hidden="control?.type !== 'code'" :icon-size icon="icons:settings" @tap="showSettings"></oda-button>
            <oda-button :icon-size icon="icons:delete" @tap="deleteCell" style="padding: 0 8px;"></oda-button>
            <oda-button allow-toggle ::toggled="editMode" :icon-size icon="editor:mode-edit"></oda-button>
        </div>
    `,
    cell: null,
    deleteCell() {
        if (!window.confirm(`Do you really want delete current cell?`)) return;
        this.cell.delete();
    },
    showSettings(e) {
        ODA.showDropdown('oda-property-grid', { inspectedObject: this.control, filterByFlags: '$public'}, { parent: e.target, anchor: 'top-right', align: 'left', title: 'Settings', hideCancelButton: true })
    }
})

ODA({
    is: 'oda-jupyter-code-editor', imports: '@oda/ace-editor',
    template: `
        <style>
            :host {
                --border-color: lightgray;
                @apply --vertical;
                @apply --flex;
                outline: {{border || '1px solid var(--border-color)'}};
                position: relative;
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
                margin: 16px;
            }
            oda-icon{
                margin: 4px;
                cursor: pointer; 
                position: sticky;
                top: 0px;
            }
        </style>
        <div  class="horizontal header" @pointerover="iconRunOver='av:play-circle-outline'" @pointerout="iconRunOver=''">
            <div border>
                <oda-icon ~if="!hideRun" :icon-size :icon="iconRun" @tap="run" :fill="isRun ? 'green' : 'black'"></oda-icon>
            </div>
            <oda-ace-editor ~if="!hideCode" :src="value" :mode="mode || 'javascript'" :theme="theme || ''" font-size="12" class="flex" show-gutter="false" max-lines="Infinity" :show-gutter="showGutter" :read-only @change="editorValueChanged"></oda-ace-editor>                        
        </div>
        <div ~if="!hideResult && !hideConsole && isRun && iconCloseShow" class="horizontal info">
            <div border>
                <oda-icon  :icon-size icon="eva:o-close-circle-outline" @tap="isRun=false; runConsoleData = undefined;"></oda-icon>
            </div>
        </div>
<!--        <div class="horizontal">-->
<!--            <div ~if="!hideCode && !hideRun" class="btns vertical">-->
<!--                -->
<!--                <oda-icon id="icon-close" ~if="!hideResult && !hideConsole && isRun && iconCloseShow" :icon-size icon="eva:o-close-circle-outline" @tap="isRun=false; runConsoleData = undefined;" style="cursor: pointer; position: sticky;"></oda-icon>-->
<!--            </div>-->
<!--            <div class="vertical flex">-->
<!--                -->
<!--                <div id="splitter1" ~if="!hideCode && !hideResult && isRun && mode==='html'" ~style="{borderTop: isRun ? '1px solid var(&#45;&#45;border-color)' : 'none'}"></div>-->
<!--                <div id="result">-->
<!--                    <iframe ~if="!hideResult && isRun && mode==='html'" :srcdoc></iframe>-->
<!--                    <div id="splitter2" ~if="!hideResult && !hideConsole && isRun && runConsoleData?.length" ~style="{borderTop: isRun ? '1px solid var(&#45;&#45;border-color)' : 'none'}"></div>-->
<!--                    <div ~if="!hideConsole && isRun && runConsoleData?.length" style="min-height: 36px; margin: 2px 0;">-->
<!--                        <div ~for="runConsoleData" style="padding: 4px;" ~style="runConsoleStyle($for.item)">{{$for.item.str}}</div>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->
<!--        <div class="collapsed horizontal flex" ~if="showCollapsedInfo && cell?.collapsed && cell.levels.length">Скрыто ??? ячеек</div>-->
<!--        <div class="cell-select"></div>-->
    `,
    value: '',
    $public: {
        readOnly: {
            $def: false,
            set(n) {
                this.setMeta('readOnly', n)
            },
            get() {
                return this.meta?.readOnly;
            }
        },
        autoRun: {
            $def: false,
            set(n) {
                this.setMeta('autoRun', n)
            },
            get() {
                return this.meta?.autoRun;
            }
        },
        hideRun: {
            $def: false,
            set(n) {
                this.setMeta('hideRun', n)
            },
            get() {
                return this.meta?.hideRun
            }
        },
        hideCode: {
            $def: false,
            set(n) {
                this.setMeta('hideCode', n)
            },
            get() {
                return this.meta?.hideCode
            }
        },
        hideResult: {
            $def: false,
            set(n) {
                this.setMeta('hideResult', n)
            },
            get() {
                return this.meta?.hideResult
            }
        },
        hideConsole: {
            $def: false,
            set(n) {
                this.setMeta('hideConsole', n)
            },
            get() {
                return this.meta?.hideConsole
            }
        },
        showGutter: {
            $def: false,
            set(n) {
                this.setMeta('showGutter', n)
            },
            get() {
                return this.meta?.showGutter
            }
        },
        mode: {
            $def: '',
            $list: ['javascript', 'html', 'css', 'phyton'],
            set(n) {
                this.setMeta('mode', n)
            },
            get() {
                return this.meta?.mode
            }
        },
        theme: {
            $def: '',
            $list: ['ambiance', 'chaos', 'chrome', 'clouds', 'clouds_midnight', 'cobalt', 'crimson_editor', 'dawn', 'dracula', 'dreamweaver', 'eclipse', 'github', 'gob', 'gruvbox', 'idle_fingers', 'iplastic', 'katzenmilch', 'kr_theme', 'kuroir', 'merbivore', 'merbivore_soft', 'monokai', 'mono_industrial', 'pastel_on_dark', 'solarized_dark', 'solarized_light', 'sqlserver', 'tomorrow_night_bright', 'tomorrow_night_eighties', 'twilight', 'vibrant_ink', 'xcode'],
            set(n) {
                this.setMeta('theme', n)
            },
            get() {
                return this.meta?.theme
            }
        },
        border: {
            $def: '',
            set(n) {
                this.setMeta('border', n)
            },
            get() {
                return this.meta?.border
            }
        },
    },
    setMeta(prop, n) {
        this.cell.metadata ||= {};
        this.cell.metadata[prop] = n;
    },
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
        let colors = {log: 'gray', info: 'blue', warn: 'orange', error: 'red'};
        return `color: ${colors[i.method]}`;
    },
    editorValueChanged(e) {
        this.value = e.detail.value;
    },
    async run() {
        let src = this.value;
        let fn = new Function('context', `try { ${src} } catch (e) { console.error(e) }`);
        const result = run_context.console_data = [];
        console.log(result);
        console.log(...run_context.console_data);
    }
})

//         fn(run_context)
//         this.iconCloseShow = false;
//         this.runConsoleData = undefined;
//         this.iconCloseTop = undefined;
//         this.srcdoc = '';
//         let src = this.cell.src;
//         if (this.mode !== 'html') {
//             let fn = Function('w', this.fnStr);
//             fn();
//             this.runConsoleData = [...window._runConsoleData];
//             window.runConsoleData = this.runConsoleData;
//             this.isRun = true;
//             try {
//                 fn = new Function(`try { ${src} } catch (e) { console.error(e) }`);
//                 fn();
//             } catch (e) { console.error(e) }
//             if (src.includes('import(')) {
//                 window.runConsoleData = this.runConsoleData = [];
//                 this.async(() => fn(), 300);
//             }
//             src = src.split('\n').filter(i => i).at(-1);
//             window[src] && console.log(window[src]);
//             this.iconCloseShow = true;
//         } else {
//             this.isRun = true;
//             this.async(() => {
//                 let source = this.cell.source;
//                 const iframe = this.$('iframe');
//                 let code = '',
//                     _code = source.matchAll(new RegExp('</oda-' + '(.*)' + '>', 'g'));
//                 _code = Array.from(_code, x => x[1]);
//                 _code = _code.map(i => 'oda-' + i);
//                 // console.log(_code)
//                 // for (let i = 0; i < this.idx; i++) {
//                 //     const cell = this.cells[i]; // .$cell;
//                 //     let src = cell.source,
//                 //         _path = path.replace('tools/jupyter', '');
//                 //     if (src.includes('import ')) {
//                 //         Object.keys(aliases).forEach(k => {
//                 //             if (src.includes(k)) {
//                 //                 src = src.replaceAll(k, _path + aliases[k]);
//                 //             }
//                 //         })
//                 //     }
//                 //     if (cell.cell_type === 'code' && cell.metadata?.mode !== 'html') {
//                 //         if (_code.some(v => source.includes(v))) {
//                 //             code += src + '\n';
//                 //         }
//                 //     }
//                 // }
//                 let srcdoc = `
// <!DOCTYPE html>
// <style>
//     html, body {
//         margin: 0;
//         padding: 0;
//         position: relative;
//         font-family: monospace;
//         font-size: 18px;
//     }
//     * *, *:before, *:after {
//         box-sizing: border-box;
//     }
// </style>
// <script async>
//     window._runConsoleData = [];
//     var overrideСonsole = () => {
//         ${this.fnStr}
//     }
//     overrideСonsole();
// </script>
// <script type="module">
//     import '${this.pathODA}';
//     ${code || ''}
// </script>` + this.cell?.src;
//                 iframe.addEventListener('load', () => {
//                     this.runConsoleData = [...(iframe.contentWindow._runConsoleData || [])];
//                     iframe.contentWindow.runConsoleData = this.runConsoleData;
//                     const resizeObserver = new ResizeObserver((e) => {
//                         iframe.style.height = iframe.contentDocument.body.scrollHeight + 'px';
//                         iframe.style.opacity = 1;
//                         this.opacity = 1;
//                     })
//                     resizeObserver.observe(iframe.contentDocument.body);
//                 })
//                 this.srcdoc = srcdoc;
//             })
//         }
//         if (!this.autoRun) {
//             this.async(() => {
//                 this.iconCloseTop = (this.$('#splitter1')?.offsetTop || this.$('#splitter2')?.offsetTop || 28) - 28 + 'px';
//                 this.iconCloseShow = true;
//                 this.$('#result')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
//             }, 100)
//         }
//     },
//     fnStr: `
// w = window;
// let console = w.console;
// if (!console) return;
// this.runConsoleData = [];
// w.runConsoleData = undefined;
// w._runConsoleData = [];
// if (!w.useJConsole) {
//     w.useJConsole = true;
//     w.print = (e) => console.log(e);
//     w.log = (e) => console.log(e);
//     w.info = (e) => console.info(e);
//     w.warn = (e) => console.warn(e);
//     w.error = (e) => console.error(e);
//     let intercept = (method) => {
//         let original = console[method];
//         console[method] = function () {
//             let message = arguments;
//             if (original.apply) {
//                 original.apply(console, arguments);
//             } else {
//                 message = Array.prototype.slice.apply(arguments).join(' ');
//                 original(message);
//             }
//             if (w.runConsoleData) {
//                 w.runConsoleData.push({ method, str: Array.prototype.slice.apply(message).join(' ') });
//             } else {
//                 w._runConsoleData.push({ method, str: Array.prototype.slice.apply(message).join(' ') });
//             }
//         }
//     }
//     ['log', 'info', 'warn', 'error'].forEach(i => intercept(i));
//}
// //        `
// }
// )
class JupyterNotebook extends ROCKS({
    data: { cells: [] },
    isChanged: false,
    get cells() {
        return this.data.cells.map(cell => new JupyterCell(cell, this));
    },
    async load(url) {
        this.data = await ODA.loadJSON(url);
        this.url = url;
    },
    save(url) {
        //todo save
        this.isChanged = false;
    },
    add(cell, cell_type='text'){
        let id = getID()
        const data = {
            cell_type,
            metadata:{
                id
            }
        }
        const idx = cell?.index || cell.index === 0 ? cell.index + 1 : 0;
        this.data.cells.splice(idx, 0, data);
        this.async(()=>{
            this.change();
        })
        this.cells = undefined;
        return this.cells.find(i=>i.id === id)
    },
    change(){
        this.isChanged = true;
        this.fire('changed');
    }
}) {
    url = '';
    constructor(url) {
        super();
        this.load(url);
    }
}

class JupyterCell extends ROCKS({
    data: null,
    notebook: null,
    type: {
        $def: 'text',
        $list: ['text', 'code'],
        get() {
            return this.data.cell_type;
        }
    },
    get metadata() {
        return this.data.metadata;
    },
    get id() {
        return this.metadata?.id;
    },
    get sources() {
        return this.data?.source || [];
    },
    get src() {
        return this.sources.join('');
    },
    set src(n) {
        this.data.source = [n];
        this.notebook.change();
    },
    get collapsed() {
        return this.metadata?.collapsed;
    },
    set collapsed(n){
        this.setMetadata('collapsed', n);
    },
    setMetadata(attr, val){
        const metadata = this.metadata ??= Object.create(null);
        metadata[attr] = val;
        this.notebook.change();
    },
    get childrenCount(){
        let next = this.next;
        let cnt = 0;
        while(next && next.h > this.h){
            cnt++;
            next = next.next;
        }
        return cnt;
    },
    get index() {
        return this.notebook.cells.indexOf(this);
    },
    get prev() {
        return this.notebook.cells[this.index - 1]
    },
    get next() {
        return this.notebook.cells[this.index + 1];
    },
    get allowExpand(){
        return (this.h < 7 && this.next?.h > this.h);
    },
    get h(){
        let h = this.sources[0]?.trim().toLowerCase();
        if (h?.startsWith('#')){
            let i = -1;
            while(h[++i] === '#' && i<7){}
            return i;
        }
        return 7;
    },
    level:{
        $def: 0,
        get(){
            return this.h - 1;
        }
    },
    get childCodes(){
        let next = this.next;
        const codes = [];
        while(next && next.h > this.h){
            if (next.type === 'code')
                codes.push(next);
            next = next.next;
        }
        return codes;
    },
    hidden:{
        $def: false,
        get(){
            let prev = this.prev;
            while (prev && prev.h >= this.h){
                prev = prev.prev;
            }
            return prev?.collapsed || prev?.hidden;
        }
    },
    delete() {
        this.notebook.data.splice(this.index, 1);
        this.notebook.change();
    },
    move(direct) {
        //todo move
    }
})
{
    constructor(data, notebook) {
        super();
        this.notebook = notebook;
        this.data = data;
    }
}
function getID() {
    return Math.floor(Math.random() * Date.now()).toString(16);
}