const jupyter_path = import.meta.url.split('/').slice(0, -1).join('/');
const path = window.location.href.split('/').slice(0, -1).join('/');

window.run_context = Object.create(null);
run_context.output_data = undefined;
const console_log = console.log;
window.log = window.print = console.log = (...e) => {
    e = e.map(i=>{
        if (typeof i === 'object' || i.toJSON)
            return JSON.stringify(i, null,  4);
        return i;
    })
    console_log.call(window, ...e);
    run_context.output_data?.push([...e].join('\n'));
}
const console_warn=  console.warn;
window.warn =  console.warn = (...e) => {
    console_warn.call(window, ...e);
    run_context.output_data?.push('<b>warning</b>:\n'+[...e].join('\n'));
}
const console_error =  console.error;
window.err = console.error = (...e) => {
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
        </style>
        <oda-jupyter-divider ~style="{zIndex: cells.length + 1}"></oda-jupyter-divider>
        <oda-jupyter-cell  @tap="cellSelect($for.item)" ~for="cells" :cell="$for.item"  ~show="!$for.item.hidden"></oda-jupyter-cell>
        <div style="min-height: 50%"></div>
    `,
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
            if (!this.editMode && this.cells.length - 1 > this.selectedCell.index){}
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
                    if (!this.selectedCell && this.cells?.[this.savedIndex]) {
                        this.selectedCell = this.cells[this.savedIndex];
                        this.scrollToCell();
                    }
                    this.style.visibility = 'visible';
                    this.style.opacity = 1;
                }, 1000)
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
    }
})

ODA ({ is: 'oda-jupyter-cell-out', template: `
        <span :src="outSrc" ~is="outIs" ~html="outHtml" style="white-space: break-spaces; user-select: text;" :warning :error></span>
        <div ~if="row.item.length - max > 0" class="horizontal left info flex" style="padding: 0 4px; width: 100%; font-size: small; align-items: center;">
            <span style="padding: 9px;">Показано {{max * (step + 1)}} из {{row.item.length}}</span>
            <oda-button ~if="!showAll" :icon-size class="border info" style="margin: 4px; border-radius: 2px; cursor: pointer;" @tap="setStep($event, 1)">Показать следующие {{max}}</oda-button>
            <oda-button ~if="!showAll" :icon-size class="border info" style="margin: 4px; border-radius: 2px; cursor: pointer;" @tap="setStep($event, 0)">Показать все</oda-button>
        </div>
    `,
    row: undefined,
    showAll: false,
    max: 10000,
    step: 0,
    setStep(e, sign) {
        e.preventDefault();
        e.stopPropagation();
        this.step += sign;
        if (this.step > this.row.item.length / this.max - 1 || sign === 0) {
            this.step = this.row.item.length / this.max - 1;
            this.showAll = true;
        }
    },
    outSrc: '',
    outIs(i = this.row) {
        this.outSrc = '';
        if (i.key === 'image/png') {
            this.outSrc = 'data:image/png;base64,' + i.item;
            return 'img';
        } 
        return 'span';
    },
    outHtml() {
        return this.row?.item?.substring(0, this.max * (this.step + 1)) || '';
    },
    get warning() {
        return this.row?.item.startsWith('<b>warn');
    },
    get error() {
        return this.row?.item.startsWith('<b>err');
    },
    attached() {
        this.step = 0;
        this.showAll = false;
    }
})

ODA({ is: 'oda-jupyter-cell', imports: '@oda/menu',
    template: `
        <style>
            :host{
                @apply --vertical; 
                @apply --no-flex;
                position: relative;
                margin-bottom: 6px;
                width: 100%;
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
                @apply --active;
            }
        </style>
        <oda-jupyter-toolbar :icon-size="iconSize * .7" :cell></oda-jupyter-toolbar>
        <div class="horizontal">
            <div style="min-width: 32px; max-width: 32px; padding-top: 8px; font-size: xx-small; text-align: center; white-space: break-spaces;" :error-invert="status === 'error'">{{status}}</div>
            <div class="vertical flex">
                <div class="vertical flex">
                    <div class="horizontal" >
                        <oda-icon ~if="cell.allowExpand" :icon="expanderIcon" @dblclick.stop @tap.stop="this.cell.collapsed = !this.cell.collapsed"></oda-icon>
                        <div flex id="control" ~is="editor" :cell ::edit-mode ::value :read-only show-preview></div>
                    </div>
                    <div info ~if="cell.collapsed" class="horizontal" @tap="cell.collapsed = false">
                        <oda-icon  style="margin: 4px;" :icon="childIcon"></oda-icon>
                        <div style="margin: 8px;">Hidden {{cell.childrenCount}} cells</div>
                    </div>
                </div>
                <div ~if="cell?.outputs?.length" class="info border"  style="max-height: 100%;">
                    <oda-jupyter-outputs-toolbar :icon-size="iconSize * .7" :cell :cell-control></oda-jupyter-outputs-toolbar>
                    <div id="out" class="vertical flex" style="max-width: 100%; overflow: hidden; padding: 4px 0;">
                        <div flex vertical ~if="!cell?.metadata?.hideRun" style="overflow: hidden;">
                            <div ~for="cell.outputs.slice(0, maxOutputsRow * (outputsStep +1))" style="padding: 4px;  border-bottom: 1px dashed; font-family: monospace;" >
                                <oda-jupyter-cell-out ~for="$for.item.data" :row="$$for" :max="control.maxStr"></oda-jupyter-cell-out>
                            </div>
                        </div>
                        <div ~if="cell?.metadata?.hideRun" info style="cursor: pointer; margin: 4px; padding: 6px;" @tap="hideRun">Show hidden outputs data</div>
                    </div>
                </div>        
                <div class="horizontal left info flex" ~if="showOutInfo" style="padding: 0 4px; width: 100%; font-size: small; align-items: center;">
                    <span style="padding: 9px;">{{outInfo}}</span>
                    <oda-button ~if="!showAllOutputsRow" :icon-size class="border info" style="margin: 4px; border-radius: 2px; cursor: pointer;" @tap="setOutputsStep($event, 1)">Показать следующие {{maxOutputsRow}}</oda-button>
                    <oda-button ~if="!showAllOutputsRow" :icon-size class="border info" style="margin: 4px; border-radius: 2px; cursor: pointer;" @tap="setOutputsStep($event, 0)">Показать все</oda-button>
                </div>
            </div>
        </div>
        <oda-jupyter-divider></oda-jupyter-divider>
    `,
    get maxOutputsRow() {
        return this.control.maxRow;
    },
    get outInfo() {
        return `Показано ${this.showAllOutputsRow ? this.cell.outputs.length : Math.round(this.maxOutputsRow * (this.outputsStep + 1))} из ${this.cell?.outputs?.length}`;
    },
    get showOutInfo() {
        return this.cell?.outputs?.length > this.maxOutputsRow;
    },
    hideRun() {
        this.cell.metadata.hideRun = !this.cell.metadata.hideRun;
        this.$render();
    },
    get cellControl() {
        return this;
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
            this.editMode = true;
        }
    },
    get status(){
        return this.cell.status;
    },
    $pdp: {
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
                /*transition: opacity ease-out .1s;*/
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
            <div ~if="!readOnly && cells?.length > 0" style="width: 100%; position: absolute; top: 2px; height: 1px; border-bottom: 1px dashed;"></div>
            <oda-button ~if="!readOnly" :icon-size icon="icons:add" ~for="editors" @tap.stop="add($for.key)">{{$for.key}}</oda-button>
        </div>
    `,
    get visible(){
        if (!this.cells?.length)
            return true;
        if(this.cell?.isLast)
            return true;
        return false
    },
    add(key) {
        this.selectedCell = this.notebook.add(this.cell, key);
    }
})

ODA({ is: 'oda-jupyter-toolbar', imports: '@tools/containers, @tools/property-grid',
    template: `
        <style>
            :host{
                position: sticky;
                top: 20px;
                z-index: 3;
            }
            .top {
                @apply --horizontal;
                @apply --no-flex;
                @apply --content;
                @apply --raised;
                @apply --shadow;
                position: absolute;
                right: 8px;
                padding: 1px;
                border-radius: 4px;
                margin-top: -20px;
            }
        </style>
        <div class="top" ~if="!readOnly && selected" >
            <oda-button :disabled="!cell.prev" :icon-size icon="icons:arrow-back:90" @tap.stop="cell.move(-1)"></oda-button>
            <oda-button :disabled="!cell.next" :icon-size icon="icons:arrow-back:270" @tap.stop="cell.move(1)"></oda-button>
            <oda-button ~show="cell?.type === 'code' || cell?.type === 'html'" :icon-size icon="icons:settings" @tap.stop="showSettings"></oda-button>
            <oda-button :icon-size icon="icons:delete" @tap.stop="deleteCell"></oda-button>
            <oda-button ~if="cell.type!=='code'" allow-toggle ::toggled="editMode"  :icon-size :icon="editMode?'icons:close':'editor:mode-edit'"></oda-button>
        </div>
    `,
    cell: null,
    iconSize: 16,
    deleteCell() {
        if (!window.confirm(`Do you really want delete current cell?`)) return;
        this.cell.delete();
    },
    showSettings(e) {
        ODA.showDropdown('oda-property-grid', { inspectedObject: this.control, filterByFlags: '' }, { minWidth: '480px', parent: e.target, anchor: 'top-right', align: 'left', title: 'Settings', hideCancelButton: true })
    }
})

ODA({ is: 'oda-jupyter-outputs-toolbar',
    template: `
        <style>
            :host{
                position: sticky;
                top: 20px;
                z-index: 3;
            }
            .top {
                @apply --horizontal;
                @apply --no-flex;
                @apply --content;
                @apply --raised;
                @apply --shadow;
                position: absolute;
                left: -30px;
                padding: 1px;
                border-radius: 4px;
                margin-top: -20px;
            }
        </style>
        <div class="top" ~if="cell?.outputs?.length">
            <oda-button :icon-size icon="bootstrap:eye-slash" @tap="hideRun()" title="Hide/Show"></oda-button>
            <oda-button :icon-size icon="icons:clear" @tap="clearOutputs" title="Clear outputs"></oda-button>
            <oda-button :icon-size icon="icons:fullscreen" @tap="cellControl?.$('#out').requestFullscreen();" title="Full screen"></oda-button>
        </div>
    `,
    cell: null,
    iconSize: 16,
    cellControl: undefined,
    hideRun() {
        this.cellControl.hideRun();
        this.jupyter.scrollToCell(this.selectedCell);
    },
    clearOutputs() {
        this.cell.metadata.hideRun = false;
        this.cell.outputs = [];
        this.jupyter.scrollToCell(this.cell);
    }
})

ODA({ is: 'oda-jupyter-html-editor', imports: '@oda/html-editor', extends: 'oda-html-editor',
    $public:{
        editorType:{
            $def: 'ace',
            $list: ['ace', 'monaco'],
            get(){
                return this.cell?.readMetadata('editorType', 'ace');
            },
            set(n) {
                this.src = this.value;
                this.cell?.writeMetadata('editorType', n);
            }
        },
        editorHeight: {
            $def: '',
            get(){
                return this.cell?.readMetadata('editorHeight', '');
            },
            set(n) {
                this.cell?.writeMetadata('editorHeight', n);
            }
        },
        direction: {
            $def: 'row',
            $list: ['row', 'column'],
            get(){
                return this.cell?.readMetadata('direction', 'row');
            },
            set(n) {
                this.src = this.value;
                this.cell?.writeMetadata('direction', n);
            }
        },
        noWrap: {
            $def: false,
            get(){
                return this.cell?.readMetadata('noWrap', false);
            },
            set(n) {
                this.cell?.writeMetadata('noWrap', n);
            }
        },
        showPreview: {
            $def: false,
            get(){
                return this.cell?.readMetadata('showPreview', false);
            },
            set(n) {
                this.cell?.writeMetadata('showPreview', n);
            }
        },
        previewMode: {
            $def: 'html',
            $list: ['html', 'iframe'],
            get(){
                return this.cell?.readMetadata('previewMode', 'html');
            },
            set(n){
                this.async(() => {
                    this.setIframe();  
                }, 100)
                this.cell?.writeMetadata('previewMode', n);
            }
        },
        isEditMode: {
            $def: false,
            get() {
                return this.cell?.readMetadata('isEditMode', false) || this.editMode;
            },
            set(n) {
                this.editMode = n;
                this.cell?.writeMetadata('isEditMode', n);
            }
        }
    }
})
const AsyncFunction = async function () {}.constructor;
ODA({ is: 'oda-jupyter-code-editor', imports: '@oda/ace-editor',
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
            oda-ace-editor {
                opacity: 1;
                filter: unset;
                z-index: 1;
            }
        </style>
        <div  class="horizontal border" @pointerover="isHover = true" @pointerout="isHover = false">
            <div vertical style="width: 30px; align-items: center;"> 
                <span class="sticky" ~if="!isReadyRun" style="text-align: center; font-family: monospace; font-size: small; padding: 8px 0px 10px 0px;">[ ]</span>
                <oda-button class="sticky" ~if="!!isReadyRun"  :icon-size :icon @tap="run"></oda-button>
            </div>
            <oda-ace-editor show-gutter :read-only @keypress="_keypress" :src="value" mode="javascript" font-size="12" class="flex" show-gutter="false" max-lines="Infinity" @change="editorValueChanged"></oda-ace-editor>                        
        </div>
 
    `,
    focus() {
        this.$('oda-ace-editor').focus();
    },
    _keypress(e){
        if (e.ctrlKey && e.keyCode === 10){
            this.run();
        }
    },
    get isReadyRun(){
        return this.isHover || this.selected || this.cell?.isRun;
    },
    isHover: false,
    value: '',
    get icon(){
        return this.cell?.isRun? 'spinners:8-dots-rotate': 'av:play-circle-outline';
    },
    editorValueChanged(e) {
        this.value = e.detail.value;
    },
    async run() {
        const taskID = getID();
        ODA.top.__loader.addTask({ id: taskID });
        await this.$render();
        this.outputsStep = 0;
        this.showAllOutputsRow = false;
        try {
            for (let code of this.notebook.codes){
                if (code === this.cell) break;
                if (code.status) continue;
                await new Promise(async (resolve)=>{
                    await code.run(this.jupyter);
                    this.async(resolve)
                })
                await this.$render();
            }
            await this.cell.run(this.jupyter);
            this.async(() => {
                this.jupyter.$$('oda-jupyter-cell').map(i => {
                    if (i.control.cell.type === 'html') {
                        i.control.refreshPreview();
                    }
                })
            }, 500)
            this.focus();
        } catch (error) {
            
        } finally {
            ODA.top.__loader.removeTask({ id: taskID });
        }

    },
    $public:{
        autoRun:{
            $def: false,
            get(){
                return this.cell?.readMetadata('autoRun', false)
            },
            set(n){
                this.cell?.writeMetadata('autoRun', n)
            }
        },
        maxStr:{
            $pdp: true,
            $def: 10000,
            get(){
                return this.cell?.readMetadata('maxStr', 10000)
            },
            set(n){
                this.cell?.writeMetadata('maxStr', n)
            }
        },
        maxRow:{
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
    attached() {
        if (this.autoRun)
            this.run();
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
    add(cell, cell_type = 'text') {
        let id = getID();
        const data = {
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
    status: '',
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
    get metadata() {
        return this.data.metadata;
    },
    get id() {
        return this.metadata?.id || getID();
    },
    get outputs() {
        // return [ ...Array(40000).keys() ];
        return this.data?.outputs || [];
    },
    set outputs(n) {
        this.data.outputs = n;
        this.notebook.change();
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
        this.outputs = []
        this.metadata.hideRun = false;
        this.status = '';
        this.isRun = true;
        try{
            let time = Date.now();
            run_context.output_data = [];
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
                run_context.output_data.push(res);
            }
            this.outputs = run_context.output_data.map(i=>({data:{"text/plain": i.toString()}}));
        }
        catch (e){
            let error = e.stack.split('\n');
            let pos = error[1];
            if (pos){
                pos = pos.substring(pos.indexOf('>') + 1);
                pos = pos.split(':');
                pos[1] = +pos[1] - 2;
                pos.shift();
                pos = pos.join(':');
                error = error[0].replace(': ', ':\n') + '\n(' +  pos;
            }

            this.outputs = [{data:{"text/plain": error}}];
            this.status = 'error';
        }
        finally {
            this.isRun = false;
            // run_context.output_data = [];
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
