const jupyter_path = import.meta.url.split('/').slice(0, -1).join('/');
const path = window.location.href.split('/').slice(0, -1).join('/');

window.run_context = Object.create(null);
run_context.output_data = undefined;
window.print = window.log = (...e) => {
    e = e.map(i=>{
        if (i && typeof i === 'object'){
            if (i === Object || Array.isArray(i))
                return JSON.stringify(i, undefined, 2)
            return i.toString();
        }
        return i
    })
    run_context.output_data?.push([...e].join('\n'));
}
const console_warn = console.warn;
window.warning = window.warn =  console.warn = (...e) => {
    console_warn.call(window, ...e);
    run_context.output_data?.push('<b>warning</b>:\n'+[...e].join('\n'));
}
window.show = (...e) => {
    e = e.map(i=>{
        if (typeof i === 'string' && window.customElements.get(i))
            return document.createElement(i);
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
ODA({ is: 'oda-jupyter', imports: '@oda/button, @oda/markdown',
    template: `
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                outline: none !important;
                overflow-y: auto;
                overflow-x: hidden;
                padding: 12px 6px 30px 6px;
                opacity: 0;
                transition: opacity 1s;
            }
            /* oda-jupyter-cell:hover{
                @apply --light;
            } */
        </style>
        <oda-jupyter-divider ~style="{zIndex: cells.length + 1}"></oda-jupyter-divider>
        <oda-jupyter-cell  @tap="cellSelect($for.item)" ~for="cells" :cell="$for.item"  ~show="!$for.item.hidden"></oda-jupyter-cell>
        <div style="min-height: 50%"></div>
    `,
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
    $pdp: {
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
                this.async(async () => {
                    const auto_run = this.$$('oda-jupyter-cell').filter(i=>i.cell.autoRun).last
                    if(auto_run)
                        await auto_run.run();
                    if (!this.selectedCell && this.cells?.[this.savedIndex]) {
                        this.selectedCell = this.cells[this.savedIndex];
                        this.scrollToCell();
                    }
                    this.style.visibility = 'visible';
                    this.style.opacity = 1;
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
            html: { label: 'HTML', editor: 'oda-jupyter-html-editor', type: 'html' }
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
    scrollToCell(cell = this.selectedCell) {
        if (!cell) return;
        const cellElements = this.jupyter.$$('oda-jupyter-cell');
        const cellElement = cellElements.find(el => el.cell.id === cell.id);
        if (!cellElement) return;
        cellElement.scrollIntoView();
    },
    async attached() {
        await getLoader();
        this.$wake = true;
    }
})

ODA ({ is: 'oda-jupyter-cell-out', template: `
        <style>
            [text-mode]{
                padding: 4px; 
                user-select: text; 
                overflow-x: auto;
            }
        </style>
        <div :src="outSrc" ~is="outIs" vertical  ~html="outHtml" ~style="{whiteSpace: (textWrap ? 'break-spaces': 'pre')}" :text-mode="typeof outHtml === 'string'" :warning :error></div>
        <div ~if="curRowsLength<maxRowsLength && !showAll" class="horizontal left header flex" style="font-size: small; align-items: center;">
            <span style="padding: 9px;">Rows: {{curRowsLength.toLocaleString()}} of {{maxRowsLength.toLocaleString()}}</span>
            <oda-button ~if="!showAll" :icon-size class="dark border" style="margin: 4px; border-radius: 2px;" @tap="setStep($event, 1)">Show next {{max.toLocaleString()}}</oda-button>
            <oda-button ~if="!showAll" :icon-size class="dark border" style="margin: 4px; border-radius: 2px;" @tap="showAll=true">Show all</oda-button>
        </div>
    `,
    get textWrap() {
        return this.cell?.metadata?.textWrap || false;
    },
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
        return this.max * (this.step + 1);
    },
    get split_out(){
        return this.row?.item?.split?.('\n') || [];
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
    },
    attached(){
        this.$wake = true;
    }
})

ODA({ is: 'oda-jupyter-cell', imports: '@oda/menu',
    template: `
        <style>
            :host{
                @apply --vertical; 
                @apply --no-flex;
                position: relative;
                padding-right: 4px;
                padding-top: 4px;
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
            :host(:hover) .left-panel {
                @apply --header;
            }
            
        </style>
       
        <div class="horizontal">
            <div class="left-panel vertical" :error-invert="status === 'error'">
                <div class="sticky" style="min-width: 40px; max-width: 40px; margin: -2px; margin-top: -4px; font-size: xx-small; text-align: center; white-space: break-spaces;" >
                    <oda-button  ~if="cell.type === 'code'"  :icon-size :icon @tap="run" style="margin: 4px;"></oda-button>
                    <div>{{time}}</div>
                    <div>{{status}}</div>
                </div>
            </div>
            <div  class="vertical no-flex" style="width: calc(100% - 34px); position: relative;">
                <div id="main" class="vertical">
                    <oda-jupyter-toolbar :icon-size="iconSize * .7" :cell :control="control()"></oda-jupyter-toolbar>
                    <div class="horizontal" >
                        <oda-icon ~if="cell.allowExpand" :icon="expanderIcon" @dblclick.stop @tap.stop="this.cell.collapsed = !this.cell.collapsed"></oda-icon>
                        <div flex id="control" ~is="editor" :cell ::edit-mode ::value :read-only show-preview :_value :show-border="editMode"></div>
                    </div>
                    <div info ~if="cell.collapsed" class="horizontal" @tap="cell.collapsed = false">
                        <oda-icon  style="margin: 4px;" :icon="childIcon"></oda-icon>
                        <div style="margin: 8px;">Hidden {{cell.childrenCount}} cells</div>
                    </div>
                </div>
                <div  ~if="cell?.outputs?.length || cell?.controls?.length" class="info border"  style="max-height: 100%;">
                    <oda-jupyter-outputs-toolbar :icon-size="iconSize * .7" :cell></oda-jupyter-outputs-toolbar>
                    <div class="vertical flex" style="overflow: hidden;">
                        <div flex vertical ~if="!cell?.metadata?.hideOutput" style="overflow: hidden;">
                            <div raised ~for="cell.controls" style="font-family: monospace;" >
                                <oda-jupyter-cell-out ~for="$for.item.data" :row="$$for" :max="control().maxRow"></oda-jupyter-cell-out>
                            </div>
                            <div raised ~for="cell.outputs.slice(0, maxOutputsRow * (outputsStep +1))" style="font-family: monospace;" >
                                <oda-jupyter-cell-out ~for="$for.item.data" :row="$$for" :max="control().maxRow"></oda-jupyter-cell-out>
                            </div>
                        </div>
                    </div>
                    <div ~if="cell?.metadata?.hideOutput" class="horizontal left header" style="padding: 0 4px; font-size: small;">
                        <oda-button :icon-size class="dark header no-flex" style="margin: 4px; border-radius: 2px; cursor: pointer;" @tap="showOutput">Show hidden outputs data</oda-button>
                    </div>
                </div>        
                <div class="horizontal left header flex" ~if="!cell?.metadata?.hideOutput && showOutInfo" style="padding: 0 4px; font-size: small; align-items: center; font-family: monospace;">
                    <span style="padding: 9px;">{{outInfo}}</span>
                    <oda-button ~if="!showAllOutputsRow" :icon-size class="dark" style="margin: 4px; border-radius: 2px; cursor: pointer;" @tap="setOutputsStep($event, 1)">Show next {{maxOutputsRow.toLocaleString()}}</oda-button>
                    <oda-button ~if="!showAllOutputsRow" :icon-size class="dark" style="margin: 4px; border-radius: 2px; cursor: pointer;" @tap="setOutputsStep($event, 0)">Show all</oda-button>
                </div>
            </div>
        </div>
        <oda-jupyter-divider></oda-jupyter-divider>
    `,
    _value: '<b><u>Double click for edit...</u></b>',
    get maxOutputsRow() {
        return this.control().maxRow;
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
        }
    },
    get time(){
        return this.cell?.time || '';
    },
    get status(){
        return this.cell?.status || '';
    },
    async run() {
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
                        if (code.time) continue;
                        await new Promise(async (resolve)=>{
                            await code.run(this.jupyter);
                            this.async(resolve)
                        })
                        await this.$render();
                    }
                    await this.cell.run(this.jupyter);
                    this.focus();
                } catch (error) {

                } finally {
                    ODA.removeTask(task);
                    resolve();
                }
            }, 50)
        })

    },
    $pdp: {
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
        control() {
            return this.$('#control');
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
        this.cell.metadata.hideOutput = false;
        this.jupyter.$render();
        this.notebook.change();
    },
    attached(){
        this.$wake = true;
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
        <div class="horizontal center" style="z-index: 2">
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
        this.selectedCell = this.notebook.add(this.cell, key);
    },
    showInsertBtn() {
        return top._jupyterCellData;
    },
    insert() {
        this.selectedCell = this.notebook.add(this.cell, '', top._jupyterCellData);
        top._jupyterCellData = undefined;
    }
})

ODA({ is: 'oda-jupyter-toolbar', imports: '@tools/containers, @tools/property-grid',
    template: `
        <style>
            :host{
                position: sticky;
                top: 20px;
                z-index: 9;
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
        <div class="top" ~if="!readOnly && selected" >
            <oda-button ~if="cell?.type === 'code'" :icon-size icon="bootstrap:eye-slash" title="Hide/Show code" allow-toggle ::toggled="hideCode"></oda-button>
            <oda-button :disabled="!cell.prev" :icon-size icon="icons:arrow-back:90" @tap.stop="move(-1)"></oda-button>
            <oda-button :disabled="!cell.next" :icon-size icon="icons:arrow-back:270" @tap.stop="move(1)"></oda-button>
            <oda-button ~show="cell?.type === 'code' || cell?.type === 'html'" :icon-size icon="icons:settings" @tap.stop="showSettings"></oda-button>
            <oda-button :icon-size icon="icons:delete" @tap.stop="deleteCell"></oda-button>
            <oda-button :icon-size icon="icons:content-copy" @tap.stop="copyCell" ~style="{fill: top._jupyterCellData ? 'red' : ''}"></oda-button>
            <oda-button ~if="cell.type!=='code'" allow-toggle ::toggled="editMode"  :icon-size :icon="editMode?'icons:close':'editor:mode-edit'"></oda-button>
        </div>
    `,
    get hideCode(){
        return this.cell?.metadata?.hideCode || false;
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
        this.cell.writeMetadata('hideCode', n);
       // this.jupyter.scrollTop = top;
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
    },
    cell: null,
    iconSize: 16,
    deleteCell() {
        if (!window.confirm(`Do you really want delete current cell?`)) return;
        this.cell.delete();
    },
    control: null,
    showSettings(e) {
        ODA.showDropdown('oda-property-grid', { inspectedObject: this.control, filterByFlags: '' }, { minWidth: '480px', parent: e.target, anchor: 'top-right', align: 'left', title: 'Settings', hideCancelButton: true })
    },
    copyCell() {
        top._jupyterCellData = this.cell.data;
        this.jupyter.$render();
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
        <div class="top info border" ~if="cell?.outputs?.length || cell?.controls?.length">
            <oda-button :icon-size icon="bootstrap:eye-slash"  title="Hide/Show" allow-toggle ::toggled="toggleOutput"></oda-button>
            <oda-button :icon-size icon="editor:wrap-text" @tap="textWrap" title="Wrap text" allow-toggle :toggled="cell?.metadata?.textWrap"></oda-button>
            <oda-button :icon-size icon="icons:clear" @tap="clearOutputs" title="Clear outputs"></oda-button>
        </div>
    `,
    cell: null,
    iconSize: 16,
    textWrap() {
        this.cell.metadata.textWrap = !this.cell.metadata.textWrap;
        this.cell?.writeMetadata('textWrap', this.cell.metadata.textWrap);
    },
    get toggleOutput(){
        return this.cell.metadata.hideOutput;
    },
    set toggleOutput(n){
        this.cell.metadata.hideOutput = n;
        this.jupyter.$render();
        this.notebook.change();
    },
    clearOutputs() {
        this.cell.metadata.hideOutput = false;
        this.cell.outputs = [];
        this.jupyter.scrollToCell(this.cell);
    }
})

ODA({ is: 'oda-jupyter-html-editor', imports: '@oda/html-editor', extends: 'oda-html-editor',
    $public: {
        editType:{
            $def: 'html',
            get(){
                return this.cell?.readMetadata('editType', 'html');
            },
            set(n){
                this.cell?.writeMetadata('editType', n);
            }
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
                z-index: 1;
            }
        </style>
        <div  class="horizontal" :border="!hideCode" style="min-height: 32px;">
            <oda-code-editor  ~if="!hideCode" show-gutter :read-only @keypress="_keypress" :src="value" mode="javascript" font-size="12" class="flex" show-gutter="false" max-lines="Infinity" @change="editorValueChanged"></oda-code-editor>   
            <div ~if="hideCode" class="horizontal left content flex" style="padding: 4px 4px; text-decoration: underline;">
                <span style="margin-top: 4px;cursor: pointer;" @tap="hideCode=false">Show hidden code...</span>
            </div>                  
        </div>
 
    `,
    focus() {
        this.$('oda-code-editor')?.focus();
    },
    _keypress(e){
        if (e.ctrlKey && e.keyCode === 10){
            this.run();
        }
    },
    value: '',
    editorValueChanged(e) {
        this.value = e.detail.value;
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
        hideCode: {
            $def: false,
            get(){
                return this.cell?.readMetadata('hideCode', false)
            },
            set(n){
                this.cell?.writeMetadata('hideCode', n)
            }
        },
        maxRow:{
            $group: 'output',
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
    // attached() {
    //     if (this.autoRun)
    //         this.run();
    // }
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
        let id = getID();
        if (data?.metadata) {
            data.metadata.id = id;
        }
        data ||= {
            cell_type,
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
    }
}) {
    url = '';
    constructor(url) {
        super();
        if (url)
            this.load(url);
    }
}

class JupyterCell extends ROCKS({
    data: null,
    notebook: null,
    isRun: false,
    time: '',
    status: {
        get(){
            return this.readMetadata('status', '')
        },
        set(n){
            this.writeMetadata('status', n)
        }
    },
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
        let clear = false;
        for (let codeCell of this.notebook.codes){
            if (codeCell === this)
                clear = true;
            if (clear)
                codeCell.status = '';
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
    get time(){

    },
    set time(n){
        this.writeMetadata('time', n);
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
        $def: 0,
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
    hidden: {
        $def: false,
        get() {
            let prev = this.prev;
            while (prev && prev.level >= this.level) {
                prev = prev.prev;
            }
            return prev?.collapsed || prev?.hidden;
        }
    },
    delete() {
        this.notebook.data.cells.splice(this.index, 1);
        this.notebook.change();
    },
    move(direct) {
        direct = this.index + direct;
        const cells = this.notebook.data.cells.splice(this.index, 1);
        this.notebook.data.cells.splice(direct, 0, cells[0]);
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
        this.metadata.hideOutput = false;
        this.time = '';
        this.isRun = true;
        try{
            let time = Date.now();
            run_context.output_data = jupyter.output_data = [];
            const fn = new AsyncFunction('context', this.code);
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
            this.status = time_str;
            if (res){
                jupyter.output_data.push(res);
            }
            this.outputs = jupyter.output_data.filter(i=>!(i instanceof HTMLElement)).map(i=>({data:{"text/plain": i}}));
            this.controls = jupyter.output_data.filter(i=>i instanceof HTMLElement).map(i=>({data:{"text/plain": i}}));
        }
        catch (e){
            let error = e.toString();//e.stack.split('\n');
            // let pos = error[1];
            // if (pos){
            //     pos = pos.substring(pos.indexOf('>') + 1);
            //     pos = pos.split(':');
            //     pos[1] = +pos[1] - 2;
            //     pos.shift();
            //     pos = pos.join(':');
            //     error = error[0].replace(': ', ':\n') + '\n(' +  pos;
            // }

            this.outputs = [{data:{"text/plain": error}}];
            this.status = 'error';
        }
        finally {
            this.isRun = false;
            run_context.output_data = [];
        }
    }
    get code(){
        let code = this.src.replace(/import\s+([\"|\'])(\S+)([\"|\'])/gm, 'await import($1$2$3)');
        code = code.replace(/import\s+(\{.*\})\s*from\s*([\"|\'])(\S+)([\"|\'])/gm, '__v__ =  $1 = await import($2$3$4); for(let i in __v__) run_context.i = __v__[i]');
        code = code.replace(/\s(import\s*\()/gm, ' ODA.$1');
        code = 'with (context) {\n\t' + code + '\n\n}';
        return code;
    }
}
function getID() {
    return Math.floor(Math.random() * Date.now()).toString(16);
}
