const jupyter_path = import.meta.url.split('/').slice(0, -1).join('/');
const path = window.location.href.split('/').slice(0, -1).join('/');

window.run_context = Object.create(null);
run_context.output_data = undefined;
function log_recurse (obj){
    if (obj === null) return 'null'
    if (obj === undefined) return 'undefined'
    switch (obj.constructor){
        case undefined:{
            obj = Object.assign({}, obj);
        }
        case Function:
        case Object:{
            try{
                return JSON.stringify(obj, 0, 2)
            }
            catch (e){
                return obj.toString()
            }
        } break;
        case Array:{
            return '['+obj.map(log_recurse)+']';
        } break;
        default:{
            if (typeof obj === 'object' || typeof obj === 'function')
                return obj.toString()
        }
    }
    return obj
}
window.log = (...e) => {
    e = e.map(log_recurse);
    run_context.output_data?.push([...e].join(''));
}
const console_warn = console.warn;
window.warning = window.warn =  console.warn = (...e) => {
    console_warn.call(window, ...e);
    run_context.output_data?.push('<b>warning</b>:\n'+[...e].join('\n'));
}
window.show = (...e) => {
    e = e.map(i=>{
        if (typeof i === 'string' && window.customElements.get(i))    
            i = document.createElement(i);
        else if (typeof i === 'string')
            i += '<!--isShow-->'
        return i;
    })
    run_context.output_data?.push(...e);
}
const console_error =  console.error;
window.err = window.error = console.error = (...e) => {
    console_error.call(window, ...e);
    run_context.output_data?.push( '<b>error:</b>\n'+ [...e].join('\n'));
}
window.run_context = run_context;

import { getLoader } from '../../components/tools/loader/loader.js';
// https://medium.com/@aszepeshazi/printing-selected-elements-on-a-web-page-from-javascript-a878ac873828
// https://github.com/szepeshazi/print-elements
import { PrintElements } from './print_elements.js';
ODA({ is: 'oda-jupyter', imports: '@oda/button, @oda/markdown',
    template: `
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                outline: none !important;
                overflow-y: auto !important;
                overflow-x: hidden !important;
                /*padding: 12px 6px 30px 6px;*/
                padding-top: 14px;
                opacity: 0;
                transition: opacity 1s;
                /*background-color: var(--content-background);*/
                scroll-behavior: smooth;
                position: relative;
                @apply --light;
            }
            @media print {
                .pe-preserve-print::-webkit-scrollbar { width: 0px; height: 0px; }
            }
        </style>
        <oda-jupyter-divider ~style="{zIndex: cells.length + 1}"></oda-jupyter-divider>
        <oda-jupyter-cell content @tap="cellSelect($for.item)" ~for="cells" :cell="$for.item" ~show="!$for.item.hidden"></oda-jupyter-cell>
        <div style="min-height: 90%"></div>
    `,
    command_replace(){
        const el = this.$$('oda-jupyter-cell').find(el => el.cell.id === this.selectedCell.id);
        el?.control?.editor?.editor?.execCommand?.('replace')

    },
    use_native_menu: true,
    output_data: [],
    cellSelect(item){
        this['selectedCell'] = item;
        // this.$render();
    },
    tabindex:{
        $def: 0,
        $attr: true
    },
    savedIndex:{
        $def: 0,
        $save: true
    },
    get $saveKey(){
        return this.notebook.url
    },
    $keyBindings:{
        "ctrl+home"(e){
            this.selectedCell = this.cells[0];
        },
        enter(e){
            this.editMode = true;
        },
        arrowup(e){
            e.preventDefault()
            if (!this.editMode && this.selectedCell.index > 0)
                this.selectedCell = this.cells[this.selectedCell.index - 1]
        },
        arrowdown(e){
            e.preventDefault();
            if (!this.editMode && this.cells.length - 1 > this.selectedCell.index)
                this.selectedCell = this.cells[this.selectedCell.index + 1]
        },
        async "ctrl+p"(e){
            e.stopPropagation();
            e.preventDefault();
            this.printValue();          
        }
    },
    $public: {
        $pdp: true,
        iconSize: 24,
        readOnly: false,
        file_path: String,
        get url() {
            if (this.file_path?.startsWith('http'))
                return this.file_path;
            if(this.file_path)
                return path + '/' + this.file_path;
            return '';
        },
        levelStep: {
            $def: 8,
            $save: true
        }
    },
    $listeners:{
        scroll(e){
            this.jupyter_scroll_top = this.scrollTop;
        },
        resize(e){
            this.jupyter_height = this.offsetHeight;
        }
    },
    $pdp: {
        jupyter_scroll_top: 0,
        get jupyter_height(){
            return this.offsetHeight;
        },
        showLoader: false,
        get jupyter() {
            return this;
        },
        get notebook() {
            this.style.visibility = 'hidden';
            this.style.opacity = 0;
            const nb = new JupyterNotebook(this.url);
            nb.listen('ready', async (e) => {
                await this.$render();
                this.style.scrollBehavior = 'auto';
                this.scrollTop = this.scrollHeight;
                this.async(async () => {
                    const auto_run = this.$$('oda-jupyter-cell').filter(i=>i.cell.autoRun).last
                    if(auto_run)
                        await auto_run.run(true);
                    await this.$render();
                    if (!this.selectedCell && this.cells?.[this.savedIndex]) {
                        this.selectedCell = this.cells[this.savedIndex];
                        await this.scrollToCell();
                    }
                    this.style.visibility = 'visible';
                    this.style.opacity = 1;
                    this.style.scrollBehavior = 'smooth';
                }, 1000);
            })
            nb.listen('changed', async (e) => {
                if(this.selectedCell) {
                    const selectedFromCells = this.cells.find(cell => cell.id === this.selectedCell.id);
                    if(selectedFromCells && this.selectedCell !== selectedFromCells)
                        this.selectedCell = selectedFromCells;
                }
                await this.$render();
                if (e.detail.value) {
                    const added = this.$$('oda-jupyter-cell').find(cell => cell.cell.id === this.selectedCell.id);
                    added.focus();
                }
                this.fire('changed');
            })
            if (!this.url) {
                this.style.visibility = 'visible';
                this.style.opacity = 1;
            }
            return nb;
        },
        editors: {
            code: { label: 'Code', editor: 'oda-jupyter-code-editor', type: 'code' },
            text: { label: 'Text', editor: 'oda-markdown', type: 'text' },
            sheet: { label: 'Sheet', editor: 'oda-jupyter-sheet-editor', type: 'sheet' }
        },
        selectedCell: {
            $def: null,
            set(n, o) {
                if (n){
                    this.editMode = false;
                    this.savedIndex = n.index;
                }
                else if (o){
                    this.selectedCell = o
                }
            }
        },
        get cells() {
            return this.notebook?.cells;
        },
        editMode: {
            $def: false,
            set(n){
                if (n && this.readOnly)
                    this.editMode = false;
            }
        }
    },
    async scrollToCell(cell = this.selectedCell, row = 0, delta = 0, toLastRange = false) {
        if (!cell) return;
        const cellElements = this.jupyter.$$('oda-jupyter-cell');
        const cellElement = cellElements.find(el => el.cell.id === cell.id);
        if (!cellElement?.control?.editor) return;
        const screenTop = this.jupyter.scrollTop,
            screenBottom = screenTop + this.jupyter.offsetHeight;
        if (cell.type === 'code' && !cell.hideCode) {
            if (toLastRange && cellElement.lastRange) {
                row = cellElement.lastRange.start.row;
                this.async(() => {
                    cellElement.control.ace.focus();
                }, 100)
            }
            const lineHeight = cellElement.control.editor.lineHeight,
                rowTop = cellElement.offsetTop + lineHeight * row,
                isVisible = rowTop >= screenTop && rowTop <= screenBottom - lineHeight * 2;
            if (isVisible && !delta)
                return;
            if (rowTop < screenTop || delta || toLastRange)
                delta = lineHeight * (row) - delta;
            else
                delta = lineHeight * (row + 2) - this.jupyter.offsetHeight - delta;
        } else {
            if (cellElement.offsetTop >= screenTop && cellElement.offsetTop  <= screenBottom) {
                return;
            }
        }
        this.jupyter.scrollTop = cellElement.offsetTop + delta;
        await new Promise(resolve => this.async(resolve, 100));
    },
    async attached() {
        await getLoader();
    },
    async printValue() {
        const scrollTop = this.scrollTop;
        const cellElements = this.jupyter.$$('oda-jupyter-cell');
        this.style.scrollBehavior = 'auto';
        this.scrollTop = this.scrollHeight;
        this.style.scrollBehavior = 'smooth';
        this.scrollTop = 0;
        while (this.scrollTop>0){
            await new Promise(resolve => this.async(resolve, 100));
        }
        this.ownerDocument.body.classList.add("pe-preserve-ancestor");
        PrintElements.print([this]);
        // this.ownerDocument.defaultView.print();
        this.ownerDocument.body.classList.remove("pe-preserve-ancestor");
        this.scrollTop = scrollTop;
        // this.scrollToCell(this.selectedCell);
    },
    setFullscreen() {
        const element = this;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    },
    createElement(...args){
        return ODA.createElement(...args);
    }
})

ODA ({ is: 'oda-jupyter-cell-out', template: `
        <style>
            [text-mode]{
                padding: 4px;
                user-select: text;
                overflow-x: auto;
            }
            label {
                width: fit-content;
            }
            label:hover{
                text-decoration: underline;
                cursor: pointer !important;
            }
            label[selected]{
                @apply --content;
                text-decoration: underline;
            }
        </style>
        <div id="out-src" :src="outSrc" ~is="outIs" vertical  ~html="outHtml" ~style="{overflowWrap: (textWrap ? 'break-word': ''), whiteSpace: (textWrap ? 'break-spaces': 'pre')}" :text-mode="typeof outHtml === 'string'" :warning></div>
        <div ~if="curRowsLength<maxRowsLength && !showAll" class="horizontal left header flex" style="font-size: small; align-items: center;">
            <span style="padding: 9px;">Rows: {{curRowsLength.toLocaleString()}} of {{maxRowsLength.toLocaleString()}}</span>
            <oda-button ~if="!showAll" :icon-size class="dark border" style="margin: 4px; border-radius: 2px;" @tap="setStep($event, 1)">Show next {{(max*2).toLocaleString()}}</oda-button>
            <oda-button ~if="!showAll" :icon-size class="dark border" style="margin: 4px; border-radius: 2px;" @tap="showAll=true">Show all</oda-button>
        </div>
    `,
    textWrap: true,
    row: undefined,
    showAll: false,
    max: 50,
    step: 0,
    setStep(e, sign) {
        e.preventDefault();
        e.stopPropagation();
        this.step += sign;
    },
    outSrc: '',
    outIs(i = this.row) {
        this.outSrc = '';
        if (i.key === 'image/png') {
            this.outSrc = 'data:image/png;base64,' + i.item;
            return 'img';
        }
        return 'div';
    },
    get maxRowsLength(){
        return  this.split_out.length;
    },
    get curRowsLength(){
        return this.max * 2 * (this.step + 1);
    },
    get split_out(){
        const limit = 10000
        return this.row?.item?.split?.('\n').map(v=>{
            if(v.length>limit)
                return v.substring(0, limit);
            return v
        }) || [];
    },
    get outHtml() {
        if (this.row?.item instanceof HTMLElement)
            return this.row.item;
        if (this.showAll)
            return this.row?.item || ''
        let array = this.split_out.slice(0, this.curRowsLength);
        return array.join('\n');
    },
    get warning() {
        return this.cell?.status === 'warning';
    },
    get error() {
        return this.cell?.status === 'error';
    }
})

ODA({ is: 'oda-jupyter-cell', imports: '@oda/menu',
    template: `
        <style>
            :host{
                padding-top: 2px;
                /*padding-left: 2px;*/
                @apply --vertical;
                @apply --no-flex;
                position: relative;
                padding-right: 2px;
                margin-top: 4px;
                min-height: 24px;
            }
            .sticky{
                cursor: pointer;
                position: sticky;
                top: 0px;
            }
            oda-icon{
                cursor: pointer;
                max-height: 64px;
            }
            oda-button:hover{
                border-radius: 50%;
                @apply --success-invert;
            }
            :host([raised]) .left-panel {
                @apply --header;
            }
            :host(:hover) {
                outline: 1px dashed gray;
            }
            :host(:hover) oda-jupyter-toolbar, :host(:hover) oda-jupyter-outputs-toolbar{
                display: flex !important;
            }
            @media print {
                .pe-preserve-print {
                    width: 100%!important;
                }
            }
        </style>

        <div class="horizontal">
            <div class="pe-no-print left-panel vertical" :error-invert="status === 'error'" content style="z-index: 2;">
                <div class="sticky" style="min-width: 40px; max-width: 40px; margin: -2px; margin-top: 2px; min-height: 50px; font-size: xx-small; text-align: center; white-space: break-spaces;" >
                    <oda-button  ~if="cell.type === 'code'"  :icon-size :icon @tap="run()" :error="cell?.autoRun" :success="!cell?.time" style="margin: 4px; border-radius: 50%;"></oda-button>
                    <div>{{time}}</div>
                    <div>{{status}}</div>
                    <oda-icon id="go-lastrange" ~if="!cell?.hideCode && lastRange" :icon-size icon="box:s-edit-alt" @tap="scrollToLastRange" style="margin: 8px;" title="scroll to marked"></oda-icon>
                    <oda-icon id="go-breakpoint" no-flex ~if="!cell?.hideCode && cell?.breakpoints" :icon-size icon="icons:label-outline" @tap="goToBreakPoint" style="margin: 8px;" title="debugger"></oda-icon>
                </div>
            </div>
            <div class="pe-preserve-print vertical no-flex" style="width: calc(100% - 34px); position: relative;">
                <div id="main" class="vertical" >
                    <oda-jupyter-toolbar :icon-size="iconSize * .7" :cell :control ~show="selected"></oda-jupyter-toolbar>
                    <div class="horizontal" >
                        <oda-icon ~if="cell.type!=='code' && cell.allowExpand" :icon="expanderIcon" @dblclick.stop @tap.stop="this.cell.collapsed = !this.cell.collapsed"></oda-icon>
                        <div flex id="control" ~is="editor" :cell ::edit-mode ::value :read-only show-preview :_value :show-border="editMode"></div>
                    </div>
                    <div info ~if="cell.collapsed" class="horizontal" @tap="cell.collapsed = false">
                        <oda-icon  style="margin: 4px;" :icon="childIcon"></oda-icon>
                        <div style="margin: 8px;">Hidden {{cell.childrenCount}} cells</div>
                    </div>
                </div>
                <div id="outputs" ~if="cell?.outputs?.length || cell?.controls?.length" class="info border" flex style="z-index: 1;">
                    <oda-jupyter-outputs-toolbar :icon-size="iconSize * .7" :cell ~show="selected"></oda-jupyter-outputs-toolbar>
                    <div class="vertical flex" style="overflow: hidden;">
                        <div flex vertical ~if="!cell?.hideOutput" style="overflow: hidden;">
                            <div  ~for="cell.controls" style="font-family: monospace;" >
                                <oda-jupyter-cell-out  ~for="$for.item.data" :row="$$for" :max="control?.maxRow"></oda-jupyter-cell-out>
                            </div>
                            <div  ~for="outputFor" style="font-family: monospace;" >
                                <oda-jupyter-cell-out ~for="$for.item.data" :row="$$for" :max="control?.maxRow"></oda-jupyter-cell-out>
                            </div>
                        </div>
                    </div>
                    <div ~if="cell?.hideOutput" class="horizontal left header" style="padding: 0 4px; font-size: small;">
                        <oda-button :icon-size class="dark header no-flex" style="margin: 4px; border-radius: 2px; cursor: pointer;" @tap="showOutput">Show hidden outputs data</oda-button>
                    </div>
                </div>
                <div class="pe-no-print horizontal left header flex" ~if="!cell?.hideOutput && showOutInfo" style="padding: 0 4px; font-size: small; align-items: center; font-family: monospace;">
                    <span style="padding: 9px;">{{outInfo}}</span>
                    <oda-button ~if="!showAllOutputsRow" :icon-size class="dark" style="margin: 4px; border-radius: 2px; cursor: pointer;" @tap="setOutputsStep($event, 1)">Show next {{maxOutputsRow.toLocaleString()}}</oda-button>
                    <oda-button ~if="!showAllOutputsRow" :icon-size class="dark" style="margin: 4px; border-radius: 2px; cursor: pointer;" @tap="setOutputsStep($event, 0)">Show all</oda-button>
                </div>
            </div>
        </div>
        <oda-jupyter-divider></oda-jupyter-divider>
    `,
    outputFor: {
        get() {
            this.control = undefined;
            return this.cell?.outputs.slice(0, this.maxOutputsRow * (this.outputsStep + 1));
        }
    },
    get _value() {
        return `<b style="margin: 4px; cursor: pointer; align-self: center;"><u>Empty ${this.cell?.type}</u></b> <gray>(click for edit...)</gray>`
    },
    get maxOutputsRow() {
        return this.control?.maxRow;
    },
    get outInfo() {
        return `Blocks: ${this.showAllOutputsRow ? this.cell.outputs.length.toLocaleString() : Math.round(this.maxOutputsRow * (this.outputsStep + 1)).toLocaleString()} of ${this.cell?.outputs?.length.toLocaleString()}`;
    },
    get showOutInfo() {
        return this.cell?.outputs?.length > this.maxOutputsRow;
    },
    console(i, type) {
        i = Array.isArray(i) ? i.join('\n') : i;
        return i.startsWith(type);
    },
    focus() {
        this.async(() => {
            this.$('#control').focus();
        }, 300)
    },
    get childIcon() {
        return this.cell.childCodes.length ? 'av:play-circle-outline' : 'bootstrap:text-left';
    },
    get editor() {
        return this.editors[this.cell.type]?.editor ?? this.editors.text.editor;
    },
    value: {
        get() {
            return this.cell.src;
        },
        set(n) {
            this.cell.src = n
        }
    },
    $listeners:{
        dblclick(e){
            if (!this.readOnly) {
                this.editMode = true;
                this.$render();
            }
        },
        click(e){
            if (!this.readOnly && !this.value) {
                this.editMode = true;
                this.$render();
            }
        },
        resize(e) {
            this.control_height = undefined;
            this.cell_height = undefined;
        }
    },
    get time(){
        return this.cell?.time || '';
    },
    get status(){
        return this.cell?.status || '';
    },

    async run(autorun) {
        return new Promise(resolve => {
            const task = ODA.addTask();
            this.outputsStep = 0;
            this.showAllOutputsRow = false;
            const out = this.$$('oda-jupyter-cell-out');
            if (out?.length) {
                out.map(i => {
                    i.step = 0;
                    i.showAll = false;
                })
            }
            this.async(async () => {
                try {
                    for (let code of this.notebook.codes){
                        if (code === this.cell) break;
                        if (code.hideCode && !autorun) continue;
                        if (code.time) continue;
                        await new Promise(async (resolve)=>{
                            if (autorun !== true)
                                this.checkBreakpoints(code);
                            await code.run(this.jupyter);
                            this.async(resolve)
                        })
                        await this.$render();
                    }
                    if (autorun !== true)
                        this.checkBreakpoints(this.cell);
                    await this.cell.run(this.jupyter);

                } catch (error) {

                } finally {
                    ODA.removeTask(task);
                    if(autorun !== true)
                        this.notebook?.change();
                    resolve();
                    if(autorun !== true){
                        this.cell?.next?.clearTimes();
                        this.scrollToRunOutputs();
                    }
                }
            }, 50)
        })

    },
    checkBreakpoints(cell) {
        cell.srcWithBreakpoints = '';
        if (cell.hideCode || !cell.breakpoints)
            return;
        const control = this.jupyter.$$('oda-jupyter-cell').find(i => i.cell.id == cell.id)?.control,
            session = control?.session;
        if (!session)
            return;
        let src = '';
        const breakpoints = cell.breakpoints.split(' '),
            obj = {};
        breakpoints.map(i => obj[i - 1] = true);
        session.doc.getAllLines().map((i, idx) => {
            if (obj[idx]) {
                if (i?.trim().startsWith('>')) {
                    i= i.trim();
                    let count = 0;
                    while(i[0] === '>') {
                        count += 1;
                        i = i.slice(1);
                    }
                }
                src += 'debugger;\n' + i + '\n';
            } else {
                src += i + '\n';
            }
        })
        cell.srcWithBreakpoints = src;
    },
    goToBreakPoint(e) {
        let breakpoints = this.cell.breakpoints.split(' ');
        breakpoints = breakpoints.filter(i => i).sort((a, b) => a - b);
        let row = this._currentBreakPoints,
            isChange = false;
        if (!this._currentBreakPoints || breakpoints.length === 1) {
            row = +breakpoints[0];
        } else {
            for (let i = 0; i < breakpoints.length; i++) {
                const p = breakpoints[i];
                if (p > row) {
                    row = +p;
                    isChange = true;
                    break;
                }
            } if (!isChange) {
                row = +breakpoints[0];
            }
        }
        this._currentBreakPoints = row;
        row -= 1;
        const delta = this.$('#go-breakpoint').offsetTop + 10;
        this.jupyter.scrollToCell(this.cell, row, delta);
    },
    scrollToLastRange() {
        if (this.lastRange) {
            const delta = this.$('#go-lastrange').offsetTop + 10;
            this.jupyter.scrollToCell(this.cell, this.lastRange.start.row, delta, true);
        }
    },
    scrollToRunOutputs() {
        this.async(() => {
            if (this.control_bottom < (this.jupyter_height + this.jupyter_scroll_top) /*&& this.control_offsetBottom > this.jupyter_scroll_top*/)
                return;
            if (this.cell?.hideOutput)
                return;
            if (this.output_height>this.jupyter_height)
                this.jupyter.scrollTop = this.control_bottom - 64;
            else
                this.$('#outputs')?.scrollIntoView({block: "end"});
        })
    },
    get output_height() {
        return this.cell_height - this.control_height;
    },
    get control_height() {
        return this.control.offsetHeight;
    },
    get cell_height() {
        return this.offsetHeight;
    },
    $pdp: {
        lastRange: undefined,
        get control_bottom(){
            return this.offsetTop + this.control_height;
        },
        get icon(){
            return this.cell?.isRun? 'spinners:8-dots-rotate': 'av:play-circle-outline';
        },
        get isReadyRun(){
            return this.selected || this.cell?.isRun;
        },
        editMode: {
            $def: false,
            get() {
                return !this.readOnly && this.jupyter.editMode && this.selected;
            },
            set(n) {
                this.jupyter.editMode = n;
            }
        },
        cell: null,
        selected:{
            $def: false,
            $attr: 'raised',
            get() {
                return !this.readOnly &&  (this.selectedCell === this.cell/* || this.selectedCell?.id === this.cell?.id*/);
            }
        },
        get control() {
            return this.$('#control') || undefined;
        },
        showAllOutputsRow: false,
        outputsStep: 0
    },
    setOutputsStep(e, sign) {
        e.preventDefault();
        e.stopPropagation();
        this.outputsStep += sign;
        if (this.outputsStep > this.cell?.outputs?.length / this.maxOutputsRow - 1 || sign === 0) {
            this.outputsStep = this.cell.outputs.length / this.maxOutputsRow - 1;
            this.showAllOutputsRow = true;
        }
    },
    get expanderIcon() {
        return this.cell.collapsed ? 'icons:chevron-right' : 'icons:expand-more';
    },
    showOutput() {
        this.cell.hideOutput = false;
        this.jupyter.$render();
        this.notebook.change();
    }
})

ODA({ is: 'oda-jupyter-divider',
    template: `
        <style>
            :host {
                @apply --vertical;
                height: 3px;
                justify-content: center;
                opacity: {{!visible?0:1}};
                margin-top: {{last?'12px':'0px'}};
                position: relative;
                z-index: 10;
            }
            :host(:hover) {
                opacity: 1 !important;
            }
            oda-button {
                font-size: 14px;
                margin: -4px 4px 0 4px;
                @apply --content;
                @apply --border;
                padding: 0px 4px 0px 0px;
                border-radius: 4px;
                opacity: 1;
            }
        </style>
        <div class="pe-no-print horizontal center" style="z-index: 2">
            <oda-button ~if="!readOnly" :icon-size icon="icons:add" ~for="editors" @tap.stop="add($for.key)">{{$for.key}}</oda-button>
            <oda-button ~if="showInsertBtn()" :icon-size icon="icons:add" @tap.stop="insert" style="color: red; fill: red">Insert cell</oda-button>
        </div>
    `,
    get last() {
        return this.cell?.isLast;
    },
    get visible(){
        if (!this.cells?.length)
            return true;
        if(this.cell?.isLast)
            return true;
        return false
    },
    add(key) {
        this.jupyter.editMode = false;
        this.selectedCell = this.notebook.add(this.cell, key);
    },
    showInsertBtn() {
        return top._jupyterCellData;
    },
    insert() {
        this.jupyter.editMode = false;
        this.jupyter.isMoveCell = true;
        const cells = JSON.parse(top._jupyterCellData);
        let lastCell = this.cell;
        Object.values(cells).map(i => {
            lastCell = this.notebook.add(lastCell, '', i);
            lastCell.id = getID();
        })
        top._jupyterCellData = undefined;
        this.selectedCell = lastCell;
        this.async(() => {
            this.scrollToCell(this.selectedCell);
            this.async(() => {
                this.jupyter.isMoveCell = false;
            }, 100)
        }, 500)
    }
})

ODA({ is: 'oda-jupyter-toolbar', imports: '@tools/containers, @tools/property-grid',
    template: `
        <style>
            :host{
                position: sticky;
                top: 20px;
                z-index: 11;
            }
            .top {
                @apply --horizontal;
                @apply --no-flex;
                @apply --content;
                @apply --raised;
                position: absolute;
                right: 8px;
                padding: 1px;
                border-radius: 4px;
                margin-top: -20px;
            }
            oda-button{
                 border-radius: 4px;
            }
        </style>
        <div class="pe-no-print top" ~if="!readOnly" @down="tap">
            <oda-button ~if="cell?.type === 'code'" :icon-size icon="bootstrap:eye-slash" title="Hide/Show code"  allow-toggle ::toggled="hideCode"></oda-button>
            <oda-button :disabled="!cell.prev" :icon-size icon="icons:arrow-back:90" @tap.stop="move(-1)"></oda-button>
            <oda-button :disabled="!cell.next" :icon-size icon="icons:arrow-back:270" @tap.stop="move(1)"></oda-button>
            <oda-button ~show="cell?.type === 'code' || cell?.type === 'sheet'" :icon-size icon="icons:settings" @tap.stop="showSettings"></oda-button>
            <oda-button :icon-size icon="icons:delete" @tap.stop="deleteCell"></oda-button>
            <oda-button :icon-size icon="icons:content-copy" @tap.stop="copyCell" ~style="{fill: isCopiedCell ? 'red' : ''}"></oda-button>
            <oda-button ~if="cell.type!=='code'" allow-toggle ::toggled="editMode"  :icon-size :icon="editMode?'icons:close':'editor:mode-edit'"></oda-button>
        </div>
    `,
    get hideCode(){
        return this.cell?.hideCode;
    },
    set hideCode(n){
        let top = this.jupyter.scrollTop;
        if (n){
            if (top > this.domHost.offsetTop){
                this.async(()=>{
                    this.jupyter.scrollToCell(this.selectedCell);
                })

                //top -= this.domHost.$('#main').offsetHeight - (top - this.domHost.$('#main').offsetTop);

            }

        }
        else{

        }
        // this.cell.hideCode = this.cell.hideOutput = n;
        this.control.hideCode = this.cell.hideOutput = n;
    },
    move(direction){
        let top = this.jupyter.scrollTop;
        if(direction<0){
            top -= this.domHost.previousElementSibling.offsetHeight
        }
        else if(direction>0){
            top += this.domHost.nextElementSibling.offsetHeight
        }
        this.cell.move(direction);
        this.jupyter.scrollTop = top;
        this.setIsMoveCell();
    },
    cell: null,
    iconSize: 16,
    deleteCell() {
        if (!window.confirm(`Do you really want delete current cell?`)) return;
        this.cell.delete();
        this.setIsMoveCell();
    },
    setIsMoveCell() {
        this.jupyter.$$('oda-jupyter-cell').map(i => i.lastRange = undefined);
        this.jupyter.isMoveCell = true;
        this.async(() => this.jupyter.isMoveCell = false, 500);
    },
    control: null,
    showSettings(e) {
        ODA.showDropdown('oda-property-grid', { inspectedObject: this.control, filterByFlags: '' }, { minWidth: '480px', parent: e.target, anchor: 'top-right', align: 'left', title: 'Settings', hideCancelButton: true })
    },
    get isCopiedCell() {
        let cells = JSON.parse(top._jupyterCellData || '{}');
        return cells[this.cell.id];
    },
    copyCell() {
        let cells;
        if (top._jupyterCellData) {
            cells = JSON.parse(top._jupyterCellData);
            if (cells[this.cell.id]) {
                delete cells[this.cell.id];
                if (Object.keys(cells).length === 0) {
                    top._jupyterCellData = this.isCopiedCell = undefined;
                    this.jupyter.$render();
                    return;
                }
                top._jupyterCellData = JSON.stringify(cells);
                this.isCopiedCell = undefined;
                this.jupyter.$render();
                return;
            }
        }
        cells ||= {};
        cells[this.cell.id] = this.cell.data;
        top._jupyterCellData = JSON.stringify(cells);
        this.jupyter.$render();
    },
    tap(e) {
        this.selectedCell = this.cell;
    }
})

ODA({ is: 'oda-jupyter-outputs-toolbar',
    template: `
        <style>
            :host{
                position: sticky;
                top: 20px;
                z-index: 9;
                display: block;
            }
            .top {
                @apply --horizontal;
                @apply --no-flex;
                @apply --content;
                @apply --raised;
                right: 8px;
                position: absolute;
                padding: 1px;
                border-radius: 4px;
                margin-top: 4px;
            }
            oda-button{
                 border-radius: 4px;
            }
        </style>
        <div class="pe-no-print top info border" ~if="cell?.outputs?.length || cell?.controls?.length">
            <oda-button :icon-size icon="bootstrap:eye-slash"  title="Hide/Show" allow-toggle ::toggled="toggleOutput"></oda-button>
            <oda-button :icon-size icon="icons:clear" @tap="clearOutputs" title="Clear outputs"></oda-button>
        </div>
    `,
    cell: null,
    iconSize: 16,
    get toggleOutput(){
        return this.cell.hideOutput;
    },
    set toggleOutput(n){
        this.cell.hideOutput = n;
        this.jupyter.$render();
        this.notebook.change();
    },
    clearOutputs() {
        this.cell.hideOutput = false;
        this.cell.outputs = [];
    }
})

ODA({ is: 'oda-jupyter-sheet-editor', imports: '@oda/spreadsheet-editor', extends: 'oda-spreadsheet-editor',
    template:`
        <style>
            :host {
                height: {{height}};
            }
        </style>
    `,
    $public: {
        height: {
            $def: '400px',
            get(){
                return this.cell?.readMetadata('height', '400px');
            },
            set(n){
                this.cell?.writeMetadata('height', n);
            }
        }
    },
    set editMode(v) {
        this.showToolbar = this.mode = undefined;
    },
    get mode() {
        return this.editMode ? 'edit' : 'read';
    },
    get showToolbar() {
        return this.editMode;
    },
    $listeners: {
        'sheet-tap'(e) {
            this.selectedCell = this.cell;
        }
    }
})

const AsyncFunction = async function () {}.constructor;
ODA({ is: 'oda-jupyter-code-editor', imports: '@oda/code-editor',
    template: `
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                position: relative;
            }
            .sticky{
                cursor: pointer;
                position: sticky;
                top: 0px;
            }
            oda-button:hover{
                border-radius: 50%;
                @apply --active;
            }
            oda-code-editor {
                opacity: 1;
                filter: unset;

            }
        </style>
        <div  class="horizontal" :border="!hideCode"  style="min-height: 64px;">
            <oda-code-editor :scroll-calculate="getScrollCalculate()" :wrap ~if="!hideCode" show-gutter :read-only @change-cursor="on_change_cursor" @change-breakpoints="on_change_breakpoints" @keypress="_keypress" :src="value" mode="javascript" font-size="12" class="flex" max-lines="Infinity" @change="editorValueChanged" @pointerdown="on_pointerdown" enable-breakpoints sticky-search></oda-code-editor>
            <div dimmed ~if="hideCode" class="horizontal left content flex" style="cursor: pointer; padding: 8px 4px;" @dblclick="hideCode=false">
                <oda-icon icon="bootstrap:eye-slash" style="align-self: baseline; cursor: pointer;" @tap="hideCode = false"></oda-icon>
                <h1 flex  vertical style="margin: 0px 16px; font-size: large; cursor: pointer; text-overflow: ellipsis;" ~html="cell.name +'... <u disabled style=\\\'font-size: x-small; right: 0px;\\\'>(Double click to show...)</u>'" ></h1>
            </div>
        </div>
        <div ~if="syntaxError"  border vertical style="padding: 4px; z-index: 1;">
            <div border style="padding: 4px; font-family: monospace; white-space: pre" border error style="white-space: pre-wrap" ~html="syntaxError"></div>
        </div>
        

    `,
    on_pointerdown(e) {
        this.ace?.focus();
    },
    on_change_cursor(e) {
        this.throttle('change_cursor', () => {
            if (!this.jupyter.isMoveCell) {
                this.lastRange = this.ace?.getSelectionRange();
                this.jupyter.scrollToCell(this.cell, this.lastRange.start.row);
            }
        }, 100)
    },
    on_change_breakpoints(e){
        this.cell.breakpoints = e.detail.value;
    },
    get syntaxError(){
        let error =  this.editor?.editor?.session?.getAnnotations();
        error = error?.filter((e, i)=>{
            if(e.type !== 'error') return false;
            if(e.text.startsWith('Expected an identifier and instead saw \'>')) return false;
            if(e.text.startsWith('Unexpected early end of program.')) return false;
            if(e.text.startsWith('Missing ";" before statement')) return false;
            if(e.text.startsWith(`Expected an identifier and instead saw '='.`) && error[i+1]?.text.startsWith(`Unexpected '{a}'.`)) return false;
            if(e.text.startsWith(`Unexpected '{a}'.`) && error[i-1]?.text.startsWith(`Expected an identifier and instead saw '='.`)) return false;
            return true;
        }).map(err =>{
            return '    '+err.text + ` <u row="${err.row}" column="${err.column}" onclick="_findErrorPos(this)" style="cursor: pointer; color: -webkit-link">(${err.row+1}:${err.column})</u>`
        }).join('\n');
        if(error)
            error = '<span bold style="padding: 2px; font-size: large; margin-bottom: 4px; white-space: pre-wrap;">SyntaxError:</span><br>'+error;
        return error;
    },
    get editor(){
        return this.$('oda-code-editor');
    },
    get ace(){
        return this.editor?.editor;
    },
    get session(){
        return this.ace?.session;
    },
    focus() {
        this.editor?.focus();
    },
    _keypress(e){
        if (e.ctrlKey && e.keyCode === 10){
            this.domHost.run();
        }
    },
    value: '',
    editorValueChanged(e) {
        this.syntaxError = undefined;
        this.value = e.detail.value;
        this.debounce('erros', () => {
            this.syntaxError = undefined;
            this.$render();
        }, 700)
    },

    $public:{
        autoRun:{
            $type: Boolean,
            get(){
                return this.cell?.autoRun;
            },
            set(n){
                this.cell.autoRun = n;
            }
        },
        wrap: {
            $def: false,
            get(){
                return this.cell?.readMetadata('wrap', false)
            },
            set(n){
                this.cell?.writeMetadata('wrap', n)
            }
        },
        hideCode: {
            $def: false,
            get(){
                return this.cell?.hideCode
            },
            set(n){
                this.cell.hideCode = n;
                this.editor = undefined;
                this.setBreakpoints();
            }
        },
        maxRow:{
            // $group: 'output',
            $pdp: true,
            $def: 50,
            get(){
                return this.cell?.readMetadata('maxRow', 50)
            },
            set(n){
                this.cell?.writeMetadata('maxRow', n)
            }
        }
    },
    getScrollCalculate(){
        return this.jupyter_height - 22 - 13;
    },
    attached() {
        this.setBreakpoints();
    }, 
    setBreakpoints() {
        this.async(() => {
            if (this.cell.breakpoints)
                this.editor?.setBreakpoints(this.cell.breakpoints);
        }, 700)
    }
})

class JupyterNotebook extends ROCKS({
    data: { cells: [] },
    isChanged: false,
    get cells() {
        return this.data.cells.map(cell => new JupyterCell(cell, this));
    },
    get codes() {
        return this.cells.filter(i=>i.type === 'code');
    },
    get items() {
        return this.cells.filter(cell => cell.level === 0);
    },
    async load(url) {
        try {
            this.data = await ODA.loadJSON(url);
            this.data.cells.forEach(c=>c.time = '');
            this.url = url;
        } catch (err) {

        } finally {
            this.fire('ready');
        }
    },
    save(url) {
        //todo save
        this.isChanged = false;
    },
    add(cell, cell_type = 'text', data) {
        try {
            data = data ? JSON.parse(data) : null;
        } catch (err) { }
        let id = getID();
        if (data?.metadata) {
            data.metadata.id = id;
        }
        data ||= {
            cell_type,
            source: '',
            metadata: {
                id
            }
        }
        if (cell === undefined){
            this.data.cells.splice(0, 0, data);
        }
        else{
            const idx = cell.index + 1;
            this.data.cells.splice(idx, 0, data);
        }
        this.async(() => {
            this.change(true);
        })
        this.cells = undefined;
        return this.cells.find(i => i.id === id)
    },
    change(add_new) {
        this.isChanged = true;
        this.fire('changed', add_new);
    },
    name: 'NOTEBOOK',
    get label(){
        return this.name;
    },
    icon: 'fontawesome:s-book'
}) {
    url = '';
    constructor(url) {
        super();
        if (url){

            this.load(url);
            this.name = url.split('/').pop();
        }

    }
}
class JupyterCell extends ROCKS({
    data: null,
    notebook: null,
    isRun: false,

    type: {
        $def: 'text',
        $list: ['text', 'code'],
        get() {
            return this.data.cell_type;
        }
    },
    get items() {
        return this.notebook.cells.filter(cell => cell.parent?.id === this.id);
    },
    get parent() {
        let prev = this.prev;
        while(prev && prev.level !== this.level - 1) {
            prev = prev.prev;
        }
        return prev;
    },
    get name() {
        const firstSource = this.src.trim().split('\n')[0];
        let t = this.type;
        switch (this.type) {
            case 'text':
            case 'markdown': return firstSource.substring(this.h).trim() || (t + ' [empty]');
            case 'code': return firstSource ?? ' [empty]';
        }
        return '???'
    },
    get time(){
        return this.data.time;
    },
    set time(n){
        return this.data.time = n;
    },
    get metadata() {
        return this.data.metadata;
    },
    get id() {
        return this.metadata?.id || getID();
    },
    get controls() {
        return this.data?.controls || [];
    },
    set controls(n) {
        Object.defineProperty(this.data, 'controls', {
            value: n,
            enumerable: false,
            configurable: true,
            writable: false,
        })
    },
    autoRun:{
        get(){
            return this.readMetadata('autoRun', false)
        },
        set(n){
            this.writeMetadata('autoRun', n)
        }
    },
    get outputs() {
        return this.data?.outputs || [];
    },
    set outputs(n) {
        this.data.outputs = n;
    },
    get sources() {
        return this.data?.source || [];
    },
    get src() {
        return Array.isArray(this.sources) ? this.sources.join('') : this.sources;
    },
    set src(n) {
        this.data.source = [n];
        this.notebook.change();
        if (this.type !== 'code') return;
        this.clearTimes();
    },
    get breakpoints() {
        return this.data.breakpoints;
    },
    set breakpoints(n) {
        this.data.breakpoints = n || '';
        this.notebook.change();
        this.clearTimes();
    },
    clearTimes(all = false){
        let clear = all;
        for (let cell of this.notebook.cells){
            if (cell === this)
                clear = true;
            if (clear && cell.type === 'code')
            cell.status = cell.time = '';
        }
    },
    get collapsed() {
        return this.metadata?.collapsed;
    },
    set collapsed(n) {
        this.writeMetadata('collapsed', n);
    },
    get __expanded__() {
        return !this.collapsed;
    },
    set __expanded__(n) {
        this.collapsed = !n;
    },
    readMetadata(attr, def = ''){
        return this.metadata?.[attr] ?? def;
    },
    writeMetadata(attr, val) {
        const metadata = this.metadata ??= Object.create(null);
        metadata[attr] = val;
        this.notebook.change();
    },
    get childrenCount() {
        let next = this.next;
        let cnt = 0;
        while (next && next.level > this.level) {
            cnt++;
            next = next.next;
        }
        return cnt;
    },
    get index() {
        return this.notebook.cells.indexOf(this);
    },
    get prev() {
        return this.notebook.cells[this.index - 1];
    },
    get next() {
        return this.notebook.cells[this.index + 1];
    },
    get allowExpand() {
        return (this.h && this.next && (this.next?.h > this.h || !this.next?.h));
    },
    status: {
        get(){
            return this.data.state || '';
        },
        set(n){
            this.data.state = n;
        }
    },
    get h() {
        let h = this.sources[0]?.trim().toLowerCase();
        if (h?.startsWith('#')) {
            let i = -1;
            while (h[++i] === '#' && i < 7) { }
            return i;
        }
        return 0;
    },
    level: {
        get() {
            let prev = this.prev;
            while (prev) {
                if (this.h === 1) return 0;
                if(this.h === 0) {
                    if(prev.h) return prev.level + 1;
                    return prev.level;
                } else {
                    if(prev.h && prev.h < this.h) return prev.level + 1;
                }
                prev = prev.prev;
            }
            return 0;
        }
    },
    get childCodes() {
        let next = this.next;
        const codes = [];
        while (next && next.h > this.h) {
            if (next.type === 'code')
                codes.push(next);
            next = next.next;
        }
        return codes;
    },
    hideCode: {
        get() {
            return this.readMetadata('hideCode') || false;
        },
        set(n){
            this.writeMetadata('hideCode', n);
            this.hideOutput = n
        }
    },
    hideOutput: {
        get() {
            return this.readMetadata('hideOutput') || false;
        },
        set(n){
            this.writeMetadata('hideOutput', n);
        }
    },
    hidden: {
        get() {
            let prev = this.prev;
            while (prev && prev.level >= this.level) {
                prev = prev.prev;
            }
            return prev?.collapsed || prev?.hidden;
        }
    },
    delete() {
        const cell = this.notebook.data.cells.splice(this.index, 1)[0];
        if (!cell) return
        this.clearTimes();
        this.notebook.change();
    },
    move(direct) {
        direct = this.index + direct;
        const cell = this.notebook.data.cells.splice(this.index, 1)[0];
        if (!cell) return
        this.notebook.data.cells.splice(direct, 0, cell);
        this.clearTimes();
        this.notebook.change();
    },
    get isLast(){
        return this.notebook.cells.last === this;
    }
})
{
    constructor(data, notebook) {
        super();
        this.notebook = notebook;
        this.data = data;
    }
    async run(jupyter){
        this.hideOutput = false;
        this.time = '';
        this.status = '';
        this.isRun = true;
        try{

            run_context.output_data = jupyter.output_data = [];
            let fn = new AsyncFunction('context', this.code);
            let time = Date.now();
            let res =  await fn.call(jupyter, run_context);
            time = new Date(Date.now() - time);
            let time_str = '';
            let t = time.getMinutes();
            if (t)
                time_str += t + ' m\n';
            t = time.getSeconds();
            if (time_str  || t)
                time_str += t + ' s\n';
            t = time.getMilliseconds();
            time_str += t + ' ms';
            this.time = time_str;
            if (res){
                jupyter.output_data.push(res);
            }
        }
        catch (e){
            let error = '<span bold style=\'padding: 2px; font-size: large; margin-bottom: 4px; white-space: pre-wrap;\'>'+e.toString()+'</span>';
            jupyter.output_data.push('<div style="padding: 4px;" border error>'+error+'</div>');
            this.status = 'error';
            this.time = '0 ms';
        }
        finally {
            this.outputs = jupyter.output_data.filter(i=>!(i instanceof HTMLElement) && !i.includes('<!--isShow-->')).map(i=>({data:{"text/plain": i}}));
            this.controls = jupyter.output_data.filter(i=>i instanceof HTMLElement || i.includes('<!--isShow-->')).map(i=>({data:{"text/plain": i}}));
            this.isRun = false;
            run_context.output_data = [];
        }
    }
    get code(){
        let src = this.srcWithBreakpoints || this.src;
        let code = src.replace(/import\s+([\"|\'])(\S+)([\"|\'])/gm, 'await import($1$2$3)');
        code = code.replace(/import\s+(\{.*\})\s*from\s*([\"|\'])(\S+)([\"|\'])/gm, '__v__ =  $1 = await import($2$3$4); for(let i in __v__) run_context.i = __v__[i]');
        code = code.replace(/(import\s*\()/gm, ' ODA.$1');
        code = code.replace(/^\s*print\s*\((.*)\)/gm, ' log($1)');
        code = code.split('\n').map(row =>{

            let s = row.trim();
            if (s[0] === '[' || s[0] === '{')
                s = ';' + s;
            let cnt = 0;
            while(s[0] === '>'){
                cnt++;
                s = s.slice(1);
            }
            if (cnt){
                cnt = s.lastIndexOf('//')
                if (cnt > 0)
                    s = s.substring(0, cnt);
                cnt = s.lastIndexOf('/*')
                if (cnt > 0)
                    s = s.substring(0, cnt);
                if(s.match(/(^'*')|(^"*")/g)) {
                    s = s.substring(1, s.length - 1);
                    s = s.replaceAll('"', '\\\"');
                    s = 'log(\"<div style=\'cursor: pointer\' onclick=\'_findCodeEntry(this)\'>' + s + '</div>\")';
                }
                else{
                    cnt = s.lastIndexOf(';')
                    if (cnt > 0)
                        s = s.substring(0, cnt);
                    s = 'log(\"<label bold onclick=\'_findCodeEntry(this)\' style=\'text-decoration: underline; padding: 2px; font-size: large; margin-bottom: 4px; cursor: pointer; color: -webkit-link\'>'+s.replaceAll('"', '\\\"')+'</label>\\\n\", '+s+')';
                }
                row = s;
            }
            return row;
        }).join('\n');
        code = `with (context) {try{
${code}
        }catch(e){
            let idx = e.stack.indexOf('<anonymous>:');
            if(idx>-1){
                  let stack = e.stack;
                stack = stack.split('<anonymous>:')[1] || '';
                stack = stack.split(')')[0] || ''
                stack = stack.split(':');
                let row = (stack[0] || 0) - 3;
                let column = stack[1];
                let mess = e.message + \` <u row="\$\{row-1\}" column="\$\{column\}" onclick="_findErrorPos(this)" style="cursor: pointer; color: -webkit-link">(\$\{row\}:\$\{column\})</u>\`
                throw new Error(mess)
            }
            throw new Error(e.stack)
        }}`;
        return code;
    }
}
function getID() {
    return Math.floor(Math.random() * Date.now()).toString(16);
}
window._findCodeEntry = async (e) => {
    // const text = '>'+e.innerText;
    const text = e.innerText;

    const cellElement = e.parentElement.domHost
    const codeEditor = cellElement.control?.$('oda-code-editor');
    const aceEditor = codeEditor.editor;
    const row = aceEditor.session.doc.$lines.findIndex(r=>r.trim().startsWith('>') && r.includes(text));
    const range = new ace.Range(row, 1000, row, 0);
    aceEditor.session.selection.setRange(range);
    aceEditor.focus();
}
window._findErrorPos = async (e) => {
    const row = +e.getAttribute('row');
    const column = +e.getAttribute('column');

    let cellElement = e.parentElement;
    while(cellElement && !cellElement.domHost){
        cellElement = cellElement.parentElement;
    }
    cellElement = cellElement.domHost
    const codeEditor = cellElement.control?.$('oda-code-editor') || cellElement.$('oda-code-editor');
    const aceEditor = codeEditor.editor;
    const range = new ace.Range(row, 0, row, column);
    aceEditor.session.selection.setRange(range);
    aceEditor.focus();
}
window.addEventListener('keydown', e => {
    if (e.code === 'KeyR' && e.ctrlKey) {
        e.stopPropagation();
        e.preventDefault();
        e.target?.command_replace?.();
    }

}, true)