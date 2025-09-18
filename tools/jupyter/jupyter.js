const jupyter_path = import.meta.url.split('/').slice(0, -1).join('/');
const path = window.location.href.split('/').slice(0, -1).join('/');

window.run_context = Object.create(null);
run_context.output_data = undefined;
function log_recurse(obj) {
    if (obj === null) return 'null';
    if (obj === undefined) return 'undefined';
    switch (obj.constructor) {
        case undefined: {
            if (obj instanceof JupyterProxyElement)
                return obj;
            obj = Object.assign({}, obj);
        }
        case Function:
        case Object: {
            try {
                return JSON.stringify(obj, 0, 2);
            }
            catch (e) {
                return obj.toString();
            }
        }
        case Array: {
            return '[' + obj.map(log_recurse) + ']';
        }
        default: {
            if (obj instanceof HTMLElement) {

            }
            else if (typeof obj === 'object' || typeof obj === 'function')
                return obj.toString();
        }
    }
    return obj;
}
window.log = (...e) => {
    e = e.map(log_recurse);
    run_context.output_data?.push(...e.map(v => {
        let mimeType = 'text/plain';
        if (v instanceof HTMLElement)
            mimeType = 'html/text';
        else if (v instanceof JupyterProxyElement) {
            return { 'jupyter/iframe': v };
        }
        else
            v = v.toString();
        return { [mimeType]: v };
    }))
}
const console_warn = console.warn;
window.warning = window.warn =  console.warn = (...e) => {
    console_warn.call(window, ...e);
    run_context.output_data?.push(...e.map(v => {
        return { 'html/text': '<span style="font-size: large;" info><b>warning: </b>' + v.toString() +'</span>' };
    }))
}
const console_error =  console.error;
window.err = window.error = console.error = (...e) => {
    console_error.call(window, ...e);
    run_context.output_data?.push(...e.map(v => {
        return { 'html/text': '<span style="font-size: large;" error><b>error: </b>' + v.toString() +'</span>' };
    }))
}
window.run_context = run_context;

import { getLoader } from '../../components/tools/loader/loader.js';
// https://medium.com/@aszepeshazi/printing-selected-elements-on-a-web-page-from-javascript-a878ac873828
// https://github.com/szepeshazi/print-elements
import { PrintElements } from './lib/print_elements.js';
ODA({ is: 'oda-jupyter', imports: '@oda/button, @oda/markdown',
    template: `
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                outline: none !important;
                overflow-y: auto !important;
                overflow-x: hidden !important;
                padding-top: 14px;
                scroll-behavior: smooth;
                position: relative;
                @apply --light;
                z-index: 1;
            }
            @media print {
                .pe-preserve-print::-webkit-scrollbar { width: 0px; height: 0px; }
            }
        </style>
        <oda-jupyter-divider ~style="{zIndex: cells.length + 1}"></oda-jupyter-divider>
        <oda-jupyter-cell content @tap="focusedCell = $for.item" ~for="cells" :cell="$for.item" ~show="!$for.item.hidden"></oda-jupyter-cell>
        <div style="min-height: 90%"></div>
    `,

    command_replace(){
        const el = this.getCell(this.focusedCell.id);
        el?.control?.editor?.editor?.execCommand?.('replace')

    },
    connect(target){
        if (this.connected_target === target)
            return;
        if (this.connected_target){
            this.connected_target.unlisten('progress-changed');
            this.unlisten('stop');
        }
        this.connected_target = target;
        target.listen('progress-changed', async progress=>{
            await this.setProgress(progress);
        })
        this.listen('stop', e=>{
            target.stop = true;
            setTimeout(()=>{
                target.stop = false;
            }, 100)
        })
    },
    use_native_menu: true,
    output_data: [],
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
            this.focusedCell = this.cells[0];
        },
        enter(e){
            this.editMode = true;
        },
        arrowup(e){
            e.preventDefault()
            if (!this.editMode && this.focusedCell.index > 0)
                this.focusedCell = this.cells[this.focusedCell.index - 1]
        },
        arrowdown(e){
            e.preventDefault();
            if (!this.editMode && this.cells.length - 1 > this.focusedCell.index)
                this.focusedCell = this.cells[this.focusedCell.index + 1]
        },
        async "ctrl+p"(e){
            e.stopPropagation();
            e.preventDefault();
            this.printValue();          
        }
    },
    set stop(n){
        this.fire('stop', n)
    },
    async setProgress(percent){
        return await new Promise(resolve=>{
            this.progress = percent;
            requestAnimationFrame(()=>{
                resolve(this.progress)
            })
        })

    },
    $public: {
        progress: 0,
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
        },
        maxOutputRows: {
            $def: 20,
            $save: true
        },
    },
    $listeners:{
        scroll(e){
            this.jupyter_scroll_top = this.scrollTop;
            this.isScroll = true;
            this.debounce('isScroll', () => {
                this.isScroll = false;
            }, 300)
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
            const nb = new JupyterNotebook(this.url);
            nb.listen('ready', async (e) => {
                await this.$$('oda-jupyter-cell').filter(i=>i.cell.autoRun).last?.auto_run();
                await this.$render();
                this.async(() => {
                    this.focusedCell = this.cells?.[this.savedIndex];
                    this.async(()=>{
                        this.style.visibility = 'visible';
                    }, 100)
                }, 1000);

            })
            nb.listen('changed', (e) => {
                // if(this.focusedCell) {
                //     const selectedFromCells = this.cells.find(cell => cell.id === this.focusedCell.id);
                //     if(selectedFromCells && this.focusedCell !== selectedFromCells)
                //         this.focusedCell = selectedFromCells;
                // }
                // await this.$render();
                if (e.detail.value) {
                    this.getCell(this.focusedCell?.id)?.focus?.();
                }
                this.fire('changed');
            })
            return nb;
        },
        editors: {
            code: { label: 'Code', editor: 'oda-jupyter-code-editor', type: 'code' },
            text: { label: 'Text', editor: 'oda-markdown', type: 'text' },
        },
        focusedCell: {
            $def: null,
            set(n, o) {
                if (n){
                    this.editMode = false;
                    this.savedIndex = n.index;
                    let el = this.getCell(n.id);
                    el?.scrollToCell(o && o.index < n.index);
                    if (el?.cell?.lastRange && el?.control) {
                        if (el.scrollCancel || this.isMoveCell)
                            return;
                        this.async(() => {
                            el.control.scrollToCursor(el.cell.lastRange.start.row, 10);
                            this.isMoveCell = 1;
                            el.control.focus();
                        }, 100)
                    }
                }
                else if (o){
                    this.focusedCell = o
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
    set isMoveCell(v) {
        if (this.isMoveCell === 0)
            return;
        // console.log(v)
        this._isMoveCell?.clearTimeout?.();
        this._isMoveCell = setTimeout(() => {
            this.isMoveCell = 0;
        }, 500)
    },
    getCell(id){
        return this.$$('oda-jupyter-cell').find(i => i.cell.id === id);
    },
    async attached() {
        await getLoader();
        this.listen('cell-action-run-next', e => {
            const cell = e.detail?.value;
            if (cell) {
                // console.log(cell.id)
                cell.jupyter ||= this;
                let next = cell.next;
                next?.execute?.(cell);
            }
        })
    },
    async printValue() {
        const scrollTop = this.scrollTop;
        this.style.scrollBehavior = 'auto';
        this.scrollTop = this.scrollHeight;
        this.style.scrollBehavior = 'smooth';
        this.scrollTop = 0;
        while (this.scrollTop>0){
            await new Promise(resolve => this.async(resolve, 100));
        }
        this.ownerDocument.body.classList.add("pe-preserve-ancestor");
        PrintElements.print(this.$$('oda-jupyter-cell'));
        // this.ownerDocument.defaultView.print();
        this.ownerDocument.body.classList.remove("pe-preserve-ancestor");
        this.scrollTop = scrollTop;
        this.focusedCell.scrollToCell();
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
            iframe {
                border: none;
                width: 100%;
                height: 40px;
            }
        </style>
        <div :src="image" light ~is="out_tag" :srcdoc vertical  ~html="outHtml" ~style="{overflowWrap: (textWrap ? 'break-word': ''), whiteSpace: (textWrap ? 'break-spaces': 'pre')}" :text-mode="typeof outHtml === 'string'" :warning @load="iframe_loaded"></div>
        <div ~if="curRowsLength<maxRowsLength && !showAll" class="horizontal left header flex" style="font-size: small; align-items: center;">
            <span style="padding: 9px;">Rows: {{curRowsLength.toLocaleString()}} of {{maxRowsLength.toLocaleString()}}</span>
            <oda-button ~if="!showAll" :icon-size class="dark border" style="margin: 4px; border-radius: 2px;" @tap="setStep($event, 1)">Show next {{(max).toLocaleString()}}</oda-button>
            <oda-button ~if="!showAll" :icon-size class="dark border" style="margin: 4px; border-radius: 2px;" @tap="showAll=true">Show all</oda-button>
        </div>
    `,
    $listeners:{
        down(e){
            this.domHost.scrollCancel = true;
        }
    },
    $wake: true,
    textWrap: true,
    row: undefined,
    showAll: false,
    get max() {
        return this.maxOutputRows;
    },
    step: 1,
    setStep(e, sign) {
        e.preventDefault();
        e.stopPropagation();
        this.step += sign;
    },
    iframe_loaded(e){
        const iframe = e.target;
        if (!iframe.contentDocument) return;
        iframe.style.height = '40px';
        this.row.item.elem = iframe.contentDocument.body.firstChild;
        // console.log(this.row.item.elem);
        const resizeObserver = new ResizeObserver((e) => {
            let h = iframe.contentDocument.body.scrollHeight;
            iframe.style.height = h + 'px';
            // if (h === iframe.contentDocument.body.scrollHeight) {
            //     resizeObserver.unobserve(iframe.contentDocument.body);
            // }
        })     
        resizeObserver.observe(iframe.contentDocument.body);
        this.async(() => {
            this.$('#out-frame')?.scrollIntoView({ block: "end" });
        }, 500)
    },
    get srcdoc(){
        if (this.row?.key !== 'jupyter/iframe') return '';
        let tag_name = this.row.item.tag_name, src = '';
        try {
            src = JSON.stringify(ODA.telemetry.prototypes[tag_name] || {});
        } catch (err) {
            console.log(err);
        }
        src = `
<${tag_name}></${tag_name}>
<script type="module">
    import '${jupyter_path.replace('tools/jupyter', 'oda.js')}';
    ODA(
        ${src}
    )
<\/script>
`
        return src;
    },
    get image(){
        if (this.row?.key === 'image/png')
            return 'data:image/png;base64,' + this.row.item;
    },
    get out_tag() {
        switch (this.row?.key){
            case 'image/png':
                return 'img';
            case 'jupyter/iframe':
                return 'iframe';
        }
        return 'div';
    },
    get maxRowsLength(){
        return  this.split_out().length;
    },
    get curRowsLength() {
        return this.max * 1 * (this.step + 1);
    },
    split_out(out =  this.row?.item || '') {
        const limit = 10000
        return out.split?.('\n').map(v => {
            if(v.length>limit)
                return v.substring(0, limit);
            return v
        }) || [];
    },
    replaceAngleBrackets(htmlString) {
        if (typeof htmlString !== 'string') return;
        const validHtmlTags = new Set(['img', 'input', 'button']);
        const regex = /<([^>\s]+)([^>]*)>/g;
        function hasClosingTag(tag, str) {
            const closingTag = `</${tag}>`;
            return str.includes(closingTag);
        }
        return htmlString.replace(regex, (match, tagName, attributes) => {
            if (tagName.startsWith('/')) {
                const actualTagName = tagName.slice(1);
                if (validHtmlTags.has(actualTagName) || actualTagName.match(/^[a-zA-Z][a-zA-Z0-9-_]*$/)) {
                    return match;
                }
            }
            if (validHtmlTags.has(tagName))
                return match;
            if (tagName.match(/^[a-zA-Z][a-zA-Z0-9-_]*$/) && hasClosingTag(tagName, htmlString))
                return match;
            return `&lt;${tagName}${attributes}&gt;`;
        })
    },
    get outHtml() {
        if (this.row?.item instanceof HTMLElement)
            return this.row.item;
        
        let out = this.row.item;
        if (!out.startsWith?.("<label bold onclick='_findCodeEntry(this)'"))
            out = this.replaceAngleBrackets(out);

        if (this.showAll)
            return out || ''
        let array = this.split_out(out).slice(0, this.curRowsLength);
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
                /*margin-top: 4px;*/
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
                @apply --shadow;
            }
            :host(:hover) oda-jupyter-toolbar, :host(:hover) oda-jupyter-outputs-toolbar{
                display: flex !important;
            }
            @media print {
                .pe-preserve-print {
                    width: 100%!important;
                }
            }
            .circular-progress-container {
                margin: 4px 0px 4px 4px;
            }
            .hidden-progress {
                position: absolute;
                opacity: 0;
                width: 0;
                height: 0;
            } 
            .circular-progress {
                --size: 32px;
                --border-width: 3px;
                --progress: 0;
                
                width: var(--size);
                height: var(--size);
                border-radius: 50%;
                background: conic-gradient(
                #3498db calc(var(--progress) * 3.6deg),
                #eee 0deg
                );
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
            }     
            .circular-progress::before {
                content: '';
                position: absolute;
                width: calc(100% - var(--border-width) * 2);
                height: calc(100% - var(--border-width) * 2);
                background: white;
                border-radius: 50%;
            }
            .progress-text {
                position: relative;
                font-family: Arial, sans-serif;
                font-size: 10px;
                color: #333;
                z-index: 1;
            }
            [highlighted] {
                animation: highlight .2s ease-in-out;
            }
            @keyframes highlight {
                0% {
                    filter: brightness(1);
                }
                50% {
                    filter: brightness(0.5);
                }
                100% {
                    filter: unset;
                }
            }
        </style>
        <div class="pe-preserve-print vertical no-flex" style="position: relative;" :focused="selected" :highlighted="highlighted">
              <div class="horizontal">
                    <div class="pe-no-print left-panel vertical" :error-invert="cell.type === 'code' && status === 'error'" content style="z-index: 2;">
                        <div class="sticky" style="min-width: 40px; max-width: 40px; margin: -2px; margin-top: 2px; min-height: 50px; font-size: xx-small; text-align: center; white-space: break-spaces;" >
                            <oda-button ~if="!showProgress && cell.type === 'code'"  :icon-size :icon :error="!!fn" @tap="run()" :info-invert="cell?.autoRun" :success="!fn && !cell?.time" style="margin: 4px; border-radius: 50%;">
                            </oda-button>
                            <div ~if="showProgress && cell.type === 'code'" class="circular-progress-container" @tap="run()">
                                <progress class="hidden-progress" max="100" :value="jupyter.progress"></progress>
                                <div class="circular-progress" :style="progressStyle">
                                    <span class="progress-text">{{jupyter.progress}}%</span>
                                </div>
                            </div>
                            <div ~if="cell.type === 'code'" >{{time}}</div>
                            <div ~if="cell.type === 'code'" >{{status}}</div>
                        </div>
                    </div>
                    <div id="main" class="vertical flex">
                        <oda-jupyter-toolbar :icon-size="iconSize * .7" :cell :control ~show="selected"></oda-jupyter-toolbar>
                        <div class="horizontal" >
                            <oda-icon ~if="cell.type!=='code' && cell.allowExpand && !editMode" :icon="expanderIcon" @dblclick.stop @tap.stop="this.cell.collapsed = !this.cell.collapsed"></oda-icon>
                            <div flex id="control" ~is="editor" :cell ::edit-mode ::value :read-only show-preview :_value :show-border="editMode"></div>
                        </div>
                        <div info ~if="cell.collapsed" class="horizontal" @tap="cell.collapsed = false">
                            <oda-icon style="margin: 4px;" :icon="childIcon"></oda-icon>
                            <div style="margin: 8px;">Hidden {{cell.childrenCount}} cells</div>
                        </div>
                    </div>
            </div>
<!--            <div horizontal ~if="showProgress" style="align-items: center;">-->
<!--                <progress  max="100" :value="jupyter.progress">{{jupyter.progress}}%</progress>-->
<!--                <oda-button icon="icons:clear" @tap="run()" style="transform: scale(0.8); fill: red;"></oda-button>-->
<!--            </div>-->
            <div id="outputs" ~if="outputs?.length && !cell?.hideCode" class="info border" flex style="z-index: 1;">
                <oda-jupyter-outputs-toolbar :icon-size="iconSize * .7" :cell ~show="selected" :cell-control="this"></oda-jupyter-outputs-toolbar>
                <div class="vertical flex" style="overflow: hidden;">
                    <div flex vertical ~if="!cell?.hideOutput" style="overflow: hidden;">
                        <div ~for="outputs" style="font-family: monospace;" >
                            <oda-jupyter-cell-out ~for="$for.item.data || $for.item.text" :row="$$for" :max="control?.maxRow"></oda-jupyter-cell-out>
                        </div>
                    </div>
                </div>
            </div>
            <div class="pe-no-print horizontal left header flex" ~if="!cell?.hideOutput && showOutInfo" style="padding: 0 4px; font-size: small; align-items: center; font-family: monospace;">
                <span style="padding: 9px;">{{outInfo}}</span>
                <oda-button ~if="!showAllOutputsRow" :icon-size class="dark" style="margin: 4px; border-radius: 2px; cursor: pointer;" @tap="setOutputsStep($event, 1)">Show next {{maxOutputsRow.toLocaleString()}}</oda-button>
                <oda-button ~if="!showAllOutputsRow" :icon-size class="dark" style="margin: 4px; border-radius: 2px; cursor: pointer;" @tap="setOutputsStep($event, 0)">Show all</oda-button>
            </div>
        </div>
        <oda-jupyter-divider></oda-jupyter-divider>
    `,
    highlighted: {
        $def: false,
        set(v) {
            if (v) {
                this.async(() => this.highlighted = false, 200);
            }
        }
    },
    set scrollCancel(n){
        if (n){
            this.async(()=>{
                this.scrollCancel = false;
            }, 500)
        }
    },
    scrollToCell(forward = undefined){
        if(this.scrollCancel){
            this.scrollCancel = false;
            return;
        }
        switch (forward){
            case true:{
                if (this.jupyter.scrollTop + this.jupyter.offsetHeight/2 > this.offsetTop)
                    return;

                if ((this.offsetTop + this.offsetHeight) >= Math.floor(this.jupyter.scrollTop + this.jupyter.offsetHeight)){
                    if(this.offsetHeight>this.jupyter.offsetHeight && this.previousElementSibling?.offsetHeight <this.jupyter.offsetHeight / 2){
                        this.previousElementSibling.scrollIntoView(true);
                    }
                    else
                        this.scrollIntoView(this.offsetHeight>this.jupyter.offsetHeight);
                }
            } break;
            case false:{
                if (this.jupyter.scrollTop + this.jupyter.offsetHeight/2 < this.offsetTop + this.offsetHeight)
                    return;
                if (this.offsetTop <= Math.ceil(this.jupyter.scrollTop)){
                    if (this.previousElementSibling?.offsetHeight <this.jupyter.offsetHeight / 3)
                        this.previousElementSibling.scrollIntoView(true);
                    else
                        this.scrollIntoView(true);
                }
            } break;
            default:{
                this.scrollIntoView(true);
            }
        }
    },

    progressStyle() {
        return`--progress: ${this.jupyter.progress}`
    },
    showProgress: false,
    get outputs(){
        this.control = undefined;
        return this.cell?.controls?.slice(0, this.maxOutputsRow * (this.outputsStep + 1)) || [];
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
    async run(){
        try{
            this.showProgress = true;
            this.checkBreakpoints();
            this.scrollToRunOutputs();
            await this.auto_run();
        }
        finally {
            this.notebook?.change();
            this.cell?.next?.clearTimes();
            // this.scrollToRunOutputs();
            this.showProgress = false;
        }
    },
    async auto_run(autorun) {
        if (this.fn) {
            this.fn = null;
            this.jupyter.stop = true;
            return;
        }
        this.jupyter.stop = false;
        // const task = ODA.addTask();
        await new Promise(resolve =>{
            this.async(async () => {
                try {
                    for (let code of this.notebook.codes) {
                        if (code === this.cell) break;
                        if (code.time) continue;
                        const control = this.jupyter.getCell(code.id)?.control;
                        if (code.hideCode && !control.showProgress) continue;
                        control.checkBreakpoints();
                        await code.execute(control);
                    }
                    await this.cell.execute(this);

                }
                finally {
                    // ODA.removeTask(task);
                    resolve();
                    this.jupyter.progress = 0;
                    this.async(()=>{
                        this.$render();
                    })
                }
            }, 100)

        })
        // await this.$render();
            // this.async(async () => {

            // }, 50)
    },
    checkBreakpoints() {
        let cell = this.cell;
        cell.srcWithBreakpoints = '';
        if (cell.hideCode || !cell.breakpoints)
            return;
        const control = this.control,
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
    scrollToRunOutputs() {
        this.async(() => {
            if (this.control_bottom < (this.jupyter_height + this.jupyter_scroll_top) /*&& this.control_offsetBottom > this.jupyter_scroll_top*/)
                return;
            if (this.output_height < 12 || this.output_height>this.jupyter_height) {
                this.jupyter.scrollTop = this.control_bottom - 64;
                return;
            }
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
    fn: null,
    $pdp: {
        get jupyter(){
            return this.domHost?.jupyter || this.domHost;
        },
        get control_bottom(){
            return this.offsetTop + this.control_height;
        },
        get icon(){
            return this.fn? 'av:stop': 'av:play-circle-outline';
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
                return !this.readOnly &&  (this.focusedCell === this.cell/* || this.focusedCell?.id === this.cell?.id*/);
            }
        },
        get control() {
            return this.$('#control') || undefined;
        },
        showAllOutputsRow: false,
        outputsStep: 1,
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
    },
    create(tag_name, props = {}){
        return new JupyterProxyElement(tag_name, props = {});
    }
})

class JupyterProxyElement{
    #props = {};
    #tag_name = '';
    #elem = {};
    constructor(tag_name, props = {}) {
        this.#props = props;
        this.#tag_name = tag_name;
        return new Proxy(this,  {
            get(target, p) {
                if (p !== 'constructor') {
                    return target.elem?.[p] || target[p];
                }
            },
            set(target, p, value) {
                target[p] = value;
                if (target.elem)
                    target.elem[p] = value;
                return true;
            }
        })
    }
    get tag_name() {
        return this.#tag_name;
    }
    get elem() {
        return this.#elem;
    }
    set elem(n) {
        this.#elem = n;
        for (p in this.#props)
            this.elem[p] = p;
    }
}

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
            <oda-button ~if="showInsertBtn()" :icon-size icon="icons:add" @tap.stop="insert" style="color: red; fill: red">Insert cell - {{showInsertBtn()}} </oda-button>
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
        this.jupyter.isMoveCell = (this.jupyter.isMoveCell || 0) + 1;
        this.focusedCell = this.notebook.add(this.cell, key);
    },
    showInsertBtn() {
        return !this.readOnly && JSON.parse(top._jupyterCellData || '[]')?.length;
    },
    insert() {
        const cells = JSON.parse(top._jupyterCellData || '[]');
        this.focusedCell = this.cell;
        let lastCell;
        cells.map(i => {
            this.jupyter.isMoveCell = (this.jupyter.isMoveCell || 0) + 1;
            lastCell = this.notebook.add(lastCell || this.cell, '', i);
            lastCell.id = lastCell.metadata.id = getID();
        })
        this.focusedCell ||= lastCell;
        top._jupyterCellData = undefined;
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
        <div class="pe-no-print top" ~if="!readOnly">
            <oda-button :disabled="!cell.prev" :icon-size icon="icons:arrow-back:90" @tap.stop="move(-1)"></oda-button>
            <oda-button :disabled="!cell.next" :icon-size icon="icons:arrow-back:270" @tap.stop="move(1)"></oda-button>
            <oda-button :icon-size icon="icons:delete" @tap.stop="deleteCell"></oda-button>
            <oda-button :icon-size icon="icons:content-copy" @tap.stop="copyCell" ~style="{fill: isCopiedCell ? 'red' : ''}"></oda-button>
            <oda-button ~if="cell.type!=='code'" allow-toggle ::toggled="editMode"  :icon-size :icon="editMode?'icons:close':'editor:mode-edit'"></oda-button>
            <oda-button ~if="cell?.type === 'code'" :icon-size :icon="iconEye" title="Hide/Show code" @tap="toggleShowCode"></oda-button>
        </div>
    `,
    get iconEye() {
        return this.cell.hideCode ? 'bootstrap:eye-slash' : 'bootstrap:eye';
    },
    toggleShowCode() {
        this.control.hideCode = this.cell.hideOutput = !this.cell.hideOutput;
        this.jupyter.$render();
        this.notebook.change();
        if (this.control.hideCode) {
            this.domHost.scrollToCell();
        }
    },
    move(direction){
        let top = this.jupyter.scrollTop;
        let id = this.cell.id;
        if(direction<0){
            top -= this.domHost.previousElementSibling.offsetHeight
        }
        else if(direction>0){
            top += this.domHost.nextElementSibling.offsetHeight
        }
        this.jupyter.isMoveCell = (this.jupyter.isMoveCell || 0) + 1;
        this.cell.move(direction);
        this.jupyter.scrollTop = top;
        this.async(() => {
            this.jupyter.focusedCell = this.jupyter.getCell(id)?.cell;
        }, 10)
    },
    cell: null,
    iconSize: 16,
    deleteCell() {
        if (!window.confirm(`Delete cell?`)) return;
        let id = null;
        if (this.cell.prev) {
            id = this.cell.prev.id;
        }
        else if(this.cell.next) {
            id = this.cell.next.id;
        }
        this.jupyter.isMoveCell = (this.jupyter.isMoveCell || 0) + 1;
        this.cell.delete();
        this.async(() => {
            this.jupyter.focusedCell = this.jupyter.getCell(id)?.cell;
        }, 10)
    },
    control: null,
    showSettings(e) {
        ODA.showDropdown('oda-property-grid', { inspectedObject: this.control, filterByFlags: '' }, { minWidth: '480px', parent: e.target, anchor: 'top-right', align: 'left', title: 'Settings', hideCancelButton: true })
    },
    get isCopiedCell() {
        let cells = JSON.parse(top._jupyterCellData || '[]');
        return cells.find(i => i.metadata.id === this.cell.metadata.id);
    },
    copyCell() {
        let cell,
            cells = JSON.parse(top._jupyterCellData || '[]');
        if (cells?.length) { 
            cell = cells.find(i => i.metadata.id === this.cell.metadata.id);
            if (cell) {
                cells = cells.filter(i => i.metadata.id !== this.cell.metadata.id);
                if (cells.length === 0) {
                    top._jupyterCellData = this.isCopiedCell = undefined;
                } else {
                    top._jupyterCellData = JSON.stringify(cells);
                    this.isCopiedCell = undefined;
                }
            }
        }
        if (!cell) {
            cells.push(this.cell.data);
            top._jupyterCellData = JSON.stringify(cells);
        }
        this.jupyter.$render();
    }
})

ODA({ is: 'oda-jupyter-outputs-toolbar',
    template: `
        <style>
            :host{
                opacity: .5;
                position: sticky;
                top: 20px;
                z-index: 9;
                display: block;
            }
            :host(:hover){
                opacity: 1;
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
            <oda-button :icon-size icon="carbon:up-to-top" title="scroll to Up" @tap="scrollUp"></oda-button>
            <oda-button :icon-size icon="carbon:down-to-bottom" title="scroll to Down" @tap="scrollDown"></oda-button>
            <oda-button :icon-size icon="icons:clear" @tap="clearOutputs" title="Clear outputs"></oda-button>
        </div>
    `,
    cell: null,
    cellControl: null,
    iconSize: 16,
    clearOutputs() {
        this.cell.hideOutput = false;
        this.cell.outputs = [];
        this.cell.controls = [];
        // this.domHost.scrollToCell();
    },
    scrollUp() {
        this.parentElement.scrollIntoView({block: "start"});
    },
    scrollDown() {
        const outs = this.cellControl.$$('oda-jupyter-cell-out');
        if (outs?.length) {
            outs.map(i => {
                i.showAll = true;
            })
        }
        this.async(() => {
            this.parentElement.scrollIntoView({block: "end"});
        }, 100)
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
            .err {
                cursor: pointer;
                color: red;
                opacity: 0;
                font-size: larger;
                font-weight: bold;
            }
            .err:hover {
                opacity: 1;
            }
        </style>
        <div  class="horizontal" :border="!hideCode"  style="min-height: 64px;">
            <oda-code-editor :scroll-calculate="getScrollCalculate()" :wrap ~if="!hideCode" show-gutter :read-only @change-cursor="on_change_cursor" @change-breakpoints="on_change_breakpoints" @keypress="_keypress" :src="value" mode="javascript" font-size="12" class="flex" max-lines="Infinity" @change="editorValueChanged" @pointerdown="on_pointerdown" enable-breakpoints sticky-search use-global-find></oda-code-editor>
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
        this.domHost.scrollCancel = true;
        this.ace?.focus();
    },
    on_change_cursor(e) {
        if (this.jupyter.isMoveCell)
            return;
        let range = this.ace?.getSelectionRange();
        try{
            if (this.cell.lastRange){
                let currentRow = range.start.row;
                let lastRow = this.cell.lastRange.start.row;
                if (currentRow === lastRow) return;

                this.throttle('scrollToCursor', () => {
                    this.scrollToCursor(currentRow);
                }, 10)
            }
        }
        finally {
            this.cell.lastRange = range;
        }
    },
    scrollToCursor(currentRow, shift = 1) {
        let h = this.editor.lineHeight;
        let lineTop = this.domHost.offsetTop + currentRow * h;
        let lineBottom = this.domHost.offsetTop + (currentRow + 1) * h;
        let visibleTop = this.jupyter.scrollTop;
        let visibleBottom = this.jupyter.scrollTop + this.jupyter.offsetHeight;
        let needScrollUp = lineTop < visibleTop + h;
        let needScrollDown = lineBottom > visibleBottom - h;
        if (needScrollUp) {
            let targetScroll = Math.max(0, lineTop - h * shift);
            this.jupyter.scrollTop = targetScroll;
        } else if (needScrollDown) {
            let targetScroll = lineBottom - this.jupyter.offsetHeight + h * shift;
            this.jupyter.scrollTop = targetScroll;
        }
    },
    on_change_breakpoints(e){
        this.cell.breakpoints = e.detail.value;
    },
    get syntaxError(){
        let error =  this.editor?.editor?.session?.getAnnotations();
        error = error?.filter((e, i)=>{
            if(e.type !== 'error') return false;
            if (this.jupyter?.notebook?.data?.hiddenErrors?.some(s => s.startsWith(e.text.replace(/\s*from\s*line\s*\d*\s*/gm, '')))) return false;
            if(e.text.startsWith('Expected an identifier and instead saw \'>')) return false;
            if(e.text.startsWith('Unexpected early end of program.')) return false;
            if(e.text.startsWith('Missing ";" before statement')) return false;
            if(e.text.startsWith(`Expected an identifier and instead saw '='.`) && error[i+1]?.text.startsWith(`Unexpected '{a}'.`)) return false;
            if(e.text.startsWith(`Unexpected '{a}'.`) && error[i-1]?.text.startsWith(`Expected an identifier and instead saw '='.`)) return false;
            return true;
        }).map(err =>{
            return `<span class="err" onclick="_hideError(this)">  x  </span><span>${err.text}</span><u row="${err.row}" column="${err.column}" onclick="_findErrorPos(this)" style="cursor: pointer; color: -webkit-link">(${err.row+1}:${err.column})</u>`
        }).join('\n');
        if(error)
            error = '<span style="padding: 2px; font-size: large; margin-bottom: 4px; white-space: pre-wrap;">SyntaxError:</span><br>'+error;
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
        get maxRow() {
            // // $group: 'output',
            // $pdp: true,
            // $def: 50,
            // get(){
            //     return this.cell?.readMetadata('maxRow', 50)
            // },
            // set(n){
            //     this.cell?.writeMetadata('maxRow', n)
            // }
            return this.maxOutputRows;
        },
        clearHiddenErros: {
            $def: '',
            get() {
                let l = this.jupyter?.notebook?.data?.hiddenErrors?.length;
                return l ? l + ' hidden errors' : '';
            },
            set(n) {
                let l = this.jupyter?.notebook?.data?.hiddenErrors?.length;
                if (l && l !== l + ' hidden errors') {
                    this.jupyter.notebook.clearHiddenErrors();
                }
            }
        }
    },
    getScrollCalculate(){
        return this.jupyter_height - 22 - 5;
    },
    attached() {
        this.setBreakpoints();
        this.cell.listen('change-breakpoints', () => this.setBreakpoints());
    }, 
    setBreakpoints() {
        this.async(() => {
            if (this.cell.breakpoints) {
                this.editor?.setBreakpoints(this.cell.breakpoints, true);
                this.$render();
            }
        }, 700)
    }
})

class JupyterNotebook extends ROCKS({
    data: { cells: [], hiddenErrors: [] },
    isChanged: false,
    get cells() {
        this.data.cells ||= [];
        return this.data.cells?.map(cell => new JupyterCell(cell, this)) || [];
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
    addHiddenError(err) {
        this.data.hiddenErrors ||= [];
        this.data.hiddenErrors.add(err);
        this.change();
    },
    clearHiddenErrors() {
        this.data.hiddenErrors = [];
        this.change();
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
        return this.data?.controls || this.outputs;
    },
    set controls(n) {
        this.outputs = n;
        Object.defineProperty(this.data, 'controls', {
            value: this.outputs,
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
        return this._outputs || this.data?.outputs || [];
    },
    set outputs(n) {
        this._outputs = n;
        if (n && Array.isArray(n)) {
            this.data.outputs = [];
            n.map(item => {
                if (item.data && typeof item.data === 'object') {
                    for (const key in item.data) {
                        const newItem = { data: {} };
                        if (item.data[key] instanceof HTMLElement) {
                            newItem.data[key] = 'HTMLElement ...';
                        } else {
                            newItem.data[key] = item.data[key];
                        }
                        this.data.outputs.push(newItem);
                    }
                }
            })
            this.notebook.change();
        }
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
        this.fire('change-breakpoints');
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

    async execute(cell){
        let jupyter = cell?.jupyter;
        this.hideOutput = false;
        this.time = '';
        this.status = '';
        this.isRun = true;
            try{
                run_context.output_data = jupyter.output_data = [];
                cell.fn = new AsyncFunction('JUPYTER', this.code);

                // let time = Date.now();
                // let res =  await cell.fn.call(cell);
                // time = new Date(Date.now() - time);
                // let time_str = '';
                // let t = time.getMinutes();
                // if (t)
                //     time_str += t + ' m\n';
                // t = time.getSeconds();
                // if (time_str  || t)
                //     time_str += t + ' s\n';
                // t = time.getMilliseconds();
                // time_str += t + ' ms';
                // this.time = time_str;

                let startTime = performance.now();
                let res = await cell.fn.call(cell, jupyter);
                let elapsed = performance.now() - startTime;
                let time_str = '';
                let minutes = Math.floor(elapsed / 60000);
                if (minutes) {
                    time_str += minutes + ' m\n';
                }
                let seconds = Math.floor((elapsed % 60000) / 1000);
                if (time_str || seconds) {
                    time_str += seconds + ' s\n';
                }
                let milliseconds = Math.floor(elapsed % 1000);
                time_str += milliseconds + ' ms';
                this.time = time_str;

                if (res){
                    jupyter.output_data.push({ 'text/plain': res });
                }
            }
            catch (e){
                let error = '<span bold style=\'padding: 2px; font-size: large; margin-bottom: 4px; white-space: pre-wrap;\'>'+e.toString()+'</span>';
                jupyter.output_data.push({ 'html/text': '<div style="padding: 4px;" border error>'+error+'</div>' });
                this.status = 'error';
                this.time = '0 ms';
            }
            finally {
                this.controls = jupyter.output_data.map(val => ({ data: val }));
                this.isRun = false;
                run_context.output_data = [];
                cell.fn = null;
            }

    }
    get code(){
        let src = this.srcWithBreakpoints || this.src;
        let code = src.replace(/import\s+([\"|\'])(\S+)([\"|\'])/gm, 'await import($1$2$3)');
        code = code.replace(/import\s+(\{.*\})\s*from\s*([\"|\'])(\S+)([\"|\'])/gm, '__v__ =  $1 = await import($2$3$4); for(let i in __v__) run_context.i = __v__[i]');
        code = code.replace(/(import\s*\()/gm, ' ODA.$1');
        code = code.replace(/^\s*print\s*\((.*)\)/gm, ' log($1)');
        code = code.replace(/^\s*runNext\s*\((.*)\)/gm, `
    this.jupyter.fire("cell-action-run-next", this.cell);
        `);
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
        code = `try{
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
                let mess = e.stack + \` <u row="\$\{row-1\}" column="\$\{column\}" onclick="_findErrorPos(this)" style="cursor: pointer; color: -webkit-link">(\$\{row\}:\$\{column\})</u>\`
                throw new Error(mess)
            }
            throw new Error(e.stack)
        }`;
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
window._hideError = async (e) => {
    let cellElement = e.parentElement;
    while(cellElement && !cellElement.domHost){
        cellElement = cellElement.parentElement;
    }
    cellElement = cellElement.domHost
    cellElement.jupyter.notebook.addHiddenError(e.nextElementSibling.innerText.replace(/\s*from\s*line\s*\d*\s*/gm, ''));
}
window.addEventListener('keydown', e => {
    if (e.code === 'KeyR' && e.ctrlKey) {
        e.stopPropagation();
        e.preventDefault();
        e.target?.command_replace?.();
    }
}, true)