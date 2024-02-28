const path = import.meta.url.split('/').slice(0, -1).join('/');

ODA({ is: 'oda-jupyter', imports: '@oda/button',
    template: `
        <style>
            :host{
                @apply --vertical;
                @apply --flex;
                padding: 12px 6px;
                opacity: 0;
                transition: opacity ease-in .5s;
            }
        </style>
        <oda-jupyter-divider idx="-1" :hover="!notebook?.cells?.length"></oda-jupyter-divider>
        <div ~for="notebook?.cells" class="vertical no-flex">
            <div ~is="editors?.[$for.item.cell_type].editor" :idx="$for.index" :cell="$for.item" :shadow="selectedIdx === $for.index" :selected="selectedIdx === $for.index" @tap.stop="selectedIdx = (_readOnly ? -1 : $for.index);"></div>
            <oda-jupyter-divider :idx="$for.index" style="margin-top: 4px;"></oda-jupyter-divider>
        </div>
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
                    // console.log(res);
                    this.notebook = res;
                })
            }
        },
    },
    $pdp: {
        notebook: null,
        editors: {
            code: { label: 'Код', editor: 'oda-jupyter-code-editor', type: 'code' },
            text: { label: 'Текст', editor: 'oda-jupyter-text-editor', type: 'text' },
            markdown: { label: 'Текст', editor: 'oda-jupyter-text-editor', type: 'text', hide: true }
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
        }
    },
    attached() {
        this.style.opacity = 1;
    },
    $listeners: {
        tap(e) { this.selectedIdx = this.editIdx = -1 }
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
        this.notebook.cells.splice(idx, 0, { cell_type: i.type, source: '' });
        this.async(() => this.selectedIdx = idx);
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
                transition: opacity ease-out 1s;
            }
        </style>
        <oda-jupyter-toolbar :cell :idx ~if="!_readOnly && selected" ~style="{top: '-' + (iconSize - 4) + 'px'}"></oda-jupyter-toolbar>
    `,
    idx: -2,
    selected: false,
    cell: null
})

ODA({ is: 'oda-jupyter-toolbar',
    template: `
        <style>
            :host {
                @apply --horizontal;
                @apply --no-flex;
                @apply --content;
                @apply --shadow;
                position: absolute;
                top: 0;
                right: 8px;
                padding: 1px;
                border-radius: 4px;
                z-index: 100;
            }
        </style>
        <oda-button :disabled="selectedIdx === 0" :icon-size icon="icons:arrow-back:90" @tap="moveCell(-1)"></oda-button>
        <oda-button :disabled="selectedIdx >= notebook?.cells?.length - 1" :icon-size icon="icons:arrow-back:270" @tap="moveCell(1)"></oda-button>
        <oda-button :icon-size icon="icons:delete" @tap="deleteCell" style="padding: 0 8px;"></oda-button>
        <oda-button ~if="cell?.cell_type !== 'code'" :icon-size :icon="editIdx===idx?'icons:close':'editor:mode-edit'" @tap="editIdx = editIdx===idx ? -1 : idx"> </oda-button>
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
        this.async(() => this.selectedIdx = idx);
    },
    deleteCell() {
        if (window.confirm(`Do you really want delete current cell ?`)) {
            this.editIdx = -1;
            this.notebook.cells.splice(this.selectedIdx, 1);
        }
    }
})

ODA({ is: 'oda-jupyter-text-editor', imports: '@oda/simplemde-editor,  @oda/marked-viewer', extends: 'oda-jupyter-cell',
    template: `
        <style>
            oda-md-viewer::-webkit-scrollbar { width: 0px; height: 0px; }
            :host {
                @apply --horizontal;
                @apply --flex;
                max-height: {{editIdx >= 0 ? 'calc(100vh - 32px)' : 'unset'}};
            }
            oda-marked-viewer {
                opacity: {{opacity}};
                border: none;
                outline: none;
            }
        </style>
        <oda-simplemde-editor ~if="!readOnly && editIdx===idx" style="max-width: 50%; min-width: 50%; padding: 0px; margin: 0px;" @change="editorValueChanged"></oda-simplemde-editor>
        <oda-marked-viewer tabindex=0 class="flex" :src="src || _src" :pmargin="'0px'" @dblclick="changeEditMode" @click="markedClick"></oda-marked-viewer>
    `,
    set cell(n) {
        let src;    
        if (n?.source?.length && n.source.join)
            src = n.source.join('');
        this.src = src || n?.source || '';
    },
    idx: -2,
    src: '',
    _src: 'Чтобы изменить содержимое ячейки, дважды нажмите на нее',
    get opacity() {
        return this.src ? 1 : .3;
    },
    editorValueChanged(e) {
        this.cell.source = this.src = e.detail.value;
        this.fire('change', this.cell);
    },
    // keyPress(e) {
    //     if (e.key === 'Enter')
    //         this.changeEditMode();
    // },
    markedClick(e) { 
        this.selectedIdx = this.idx;
    },
    changeEditMode() {
        this.editIdx = this.editIdx === this.idx ? -1 : this.idx;
        if (this.editIdx === this.idx ) {
            this.async(() => {
                this.$('oda-simplemde-editor').value = this.src;
            })
        }
    }
})

ODA({ is: 'oda-jupyter-code-editor', imports: '@oda/ace-editor', extends: 'oda-jupyter-cell',
    template: `
        <style>
            :host {
                --border-color: lightgray;
                @apply --horizontal;
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
        <div class="vertical"  style="border-right: 1px solid var(--border-color); padding: 4px 0px">
            <oda-icon :icon-size="iconSize" :icon="iconRun" @pointerover="iconRunOver='av:play-circle-outline'" @tap="run" @pointerout="iconRunOver=''" style="cursor: pointer; position: sticky; top: 0" :fill="isRun ? 'green' : 'black'"></oda-icon>
            <oda-icon id="icon-close" ~if="isRun && iconCloseShow" :icon-size="iconSize" icon="eva:o-close-circle-outline" @tap="isRun=false; runConsoleData = undefined;" style="cursor: pointer; position: sticky;"></oda-icon>
        </div>
        <div class="vertical flex">
            <div style="display: none; padding: 2px; font-size: xx-small">{{cell?.mode + ' - ' + (cell?.isODA ? 'isODA' : 'noODA')}}</div>
            <oda-ace-editor :src :mode="cell?.mode || 'javascript'" font-size="12" class="flex" show-gutter="false" max-lines="Infinity" style="padding: 8px 0" @change="editorValueChanged" @loaded="aceLoaded"></oda-ace-editor>   
            <div id="splitter1" ~if="isRun && cell?.mode==='html'" ~style="{borderTop: isRun ? '1px solid var(--border-color)' : 'none'}"></div>
            <div id="result">
                <iframe ~if="isRun && cell?.mode==='html'" :srcdoc></iframe>
                <div id="splitter2" ~if="isRun && runConsoleData" ~style="{borderTop: isRun ? '1px solid var(--border-color)' : 'none'}"></div>
                <div ~if="isRun && runConsoleData" style="min-height: 36px; margin: 2px 0;">
                    <div ~for="runConsoleData" style="padding: 4px;" ~style="runConsoleStyle($for.item)">{{$for.item.str}}</div>
                </div>
            </div>
        </div>
    `,
    iconSize: 18,
    set cell(n) {
        let src;    
        if (n?.source?.length && n.source.join)
            src = n.source.join('');
        this.src = src || n?.source || '';
        this.setCellMode(this.src);
    },
    src: '',
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
        if (this.cell?.metadata?.colab) {
            this.cell.mode = 'python';
            return;
        }
        this.cell.mode = 'javascript';
        this.cell.isODA = false;
        let oda = src.match(/ODA\b[^(]*\([\s\S]*}\s*?\)/gm);
        if (oda?.length)
            this.cell.isODA = true;
        let arr = ['</script>', '</html>', '</body>', '</head>', '<link', '<!DOCTYPE html>', '<meta '];
        let regx = new RegExp(arr.join('|'));
        if (regx.test(src))
            this.cell.mode = 'html';
        if (this.cell.mode !== 'html' && !this.cell.isODA) {
            regx = src.match(/<\b[^>]*>[\s\S]*?/gm);
            this.cell.mode = src.match(regx)?.length ? 'html' : 'javascript';
        }
    },
    editorValueChanged(e) {
        this.iconCloseTop = undefined;
        this.cell.source = this.src = e.detail.value;
        this.fire('change', this.cell);
        this.setCellMode();
    },
    run() {
        this.iconCloseShow = false;
        this.runConsoleData = undefined;
        this.iconCloseTop = undefined;
        this.srcdoc = '';
        if (this.cell.mode !== 'html') {
            let fn = Function('w', this.fnStr);
            fn();
            this.runConsoleData = [...window._runConsoleData];
            window.runConsoleData = this.runConsoleData;
            this.isRun = true;
            try {   
                fn = new Function(`try { ${this.src} } catch (e) { console.error(e) }`);
                fn();
            } catch (e) { console.error(e) }
            let str = this.src;
            str = str.split('\n').filter(i => i).at(-1);
            window[str] && console.log(window[str]);
        } else {
            this.isRun = true;
            this.async(() => {
                const iframe = this.$('iframe');
                this.srcdoc = `
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
<script type="module">import '../../oda.js'</script>
                ` + this.src;
                iframe.addEventListener('load', () => {
                    this.runConsoleData = [...iframe.contentWindow._runConsoleData];
                    iframe.contentWindow.runConsoleData = this.runConsoleData;
                    const resizeObserver = new ResizeObserver((e) => {
                        iframe.style.height = iframe.contentDocument.body.scrollHeight + 'px';
                        iframe.style.opacity = 1;
                    })
                    resizeObserver.observe(iframe.contentDocument.body);
                })
            })
        }
        this.async(() => {
            this.iconCloseTop = (this.$('#splitter1')?.offsetTop || this.$('#splitter2')?.offsetTop || 36) - 36 + 'px';
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
