const jupyter_path = import.meta.url.split('/').slice(0, -1).join('/');
const path = window.location.href.split('/').slice(0, -1).join('/');

const run_context = Object.create(null);
run_context.output_data = undefined;
const console_log= console.log;
window.log = window.print = console.log = (...e) => {
    console_log.call(window, ...e);
    run_context.output_data?.push([...e].join('\n'));
}
const console_warn=  console.warn;
window.warn =  console.warn = (...e) => {
    console_warn.call(window, ...e);
    run_context.output_data?.push('warn:\n'+[...e].join('\n'));
}
const console_error =  console.error;
window.err = console.error = (...e) => {
    console_error.call(window, ...e);
    run_context.output_data?.push( 'error:\n'+ [...e].join('\n'));
} 
window.run_context = run_context;

ODA({ is: 'oda-jupyter', imports: '@oda/button, @oda/markdown, @oda/html-editor',
    template: `
        <style>
            :host{
                @apply --horizontal;
                @apply --flex;
                outline: none !important;
                overflow: hidden;
            }
        </style>
        <div @tap="selectedCell = null" class="flex vertical" style="overflow: auto; border-bottom: 1px dotted gray; padding: 12px 6px 30px 6px;">
            <oda-jupyter-divider ~style="{zIndex: cells.length + 1}"></oda-jupyter-divider>
            <oda-jupyter-cell  @tap.stop="selectedCell = $for.item" ~for="cells" :cell="$for.item"  ~show="!$for.item.hidden"></oda-jupyter-cell>
        </div>

    `,
    tabindex:{
        $def: 0,
        $attr: true
    },
    $keyBindings:{
        enter(e){
            this.editMode = true;
        },
        arrowup(e){
            if (!this.editMode && this.selectedCell.index > 0)
                this.selectedCell = this.cells[this.selectedCell.index - 1]
        },
        arrowdown(e){
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
        get jupyter() {
            return this;
        },
        get notebook() {
            this.style.opacity = 0;
            const nb = new JupyterNotebook(this.url);
            nb.listen('changed', async (e) => {
                await this.$render();
                if (e.detail.value) {
                    const added = this.$$('oda-jupyter-cell').find(cell => cell.cell.id === this.selectedCell.id);
                    added.focus();
                }
                this.fire('changed');
            })
            this.async(() => {
                this.style.opacity = 1;
            }, 1000)
            return nb;
        },
        editors: {
            code: { label: 'Code', editor: 'oda-jupyter-code-editor', type: 'code' },
            text: { label: 'Text', editor: 'oda-markdown', type: 'text' },
            html: { label: 'HTML', editor: 'oda-html-editor', type: 'html' }
        },
        selectedCell: {
            $def: null,
            set(n) {
                this.editMode = false;
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
            }
            oda-button:hover{
                border-radius: 50%;
                @apply --active;
            }
        </style>
        <oda-jupyter-toolbar :icon-size="iconSize * .7" :cell ~if="!readOnly && selected"></oda-jupyter-toolbar>
        <div class="vertical flex" ~style="{marginLeft: (levelStep * cell.level)+'px'}">
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
            <div ~if="cell?.outputs?.length" class="horizontal" style="max-height: 100%;">
                <div style="width: 30px">
                    <oda-button class="sticky" :icon-size icon="icons:expand-tree" style="cursor: pointer; position: sticky; opacity: .5;" @tap="showMenu"></oda-button>
                </div>
                <div id="out" class="vertical content" style="width: 100%;">
                    <div ~if="!cell?.metadata?.hideRun">
                        <div ~for="cell.outputs" style="padding: 4px;">
                            <div :src="outSrc" :warning="console($$for.item, 'warn:')" :error="console($$for.item, 'error:')" ~for="$for.item.data" ~is="outIs($$for)" ~html="outHtml" style="white-space: break-spaces;"></div>
                        </div>
                    </div>
                    <div ~if="cell?.metadata?.hideRun" info ~if="cell?.metadata?.hideRun" style="cursor: pointer; margin: 4px; padding: 6px;" @tap="hideRun">Show hidden outputs data</div>
                </div>
                
            </div>        
        </div>
        <oda-jupyter-divider></oda-jupyter-divider>
    `,
    outSrc: '',
    outHtml: '',
    outIs(i) {
        this.outSrc = this.outHtml = '';
        if (i.key === 'image/png') {
            this.outSrc = 'data:image/png;base64,' + i.item;
            return 'img';
        }
        this.outHtml = i.item;
        return 'div';
    },
    hideRun() {
        this.cell.metadata.hideRun = !this.cell.metadata.hideRun;
        this.$render();
    },
    async showMenu(e){
        const {control} = await ODA.showDropdown('oda-menu', {items:[
                {label: "Hide/Show", icon: 'bootstrap:eye-slash', execute:()=>{
                        this.hideRun();
                    }},
                {label: "Clear", icon: 'icons:clear', execute:()=>{
                        this.cell.metadata.hideRun = false;
                        this.cell.outputs = []
                    }},
                {label: "Full screen", icon: 'icons:fullscreen', execute:()=>{
                        this.$('#out').requestFullscreen();
                    }}
            ]}, {parent: e.target, anchor: 'right-top'});
        control.focusedItem.execute();
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
                return !this.readOnly &&  (this.selectedCell === this.cell || this.selectedCell?.id === this.cell?.id);
            }
        }
        ,
        get control() {
            return this.$('#control');
        },
    },
    get expanderIcon() {
        return this.cell.collapsed ? 'icons:chevron-right' : 'icons:expand-more';
    },
    runConsoleStyle(i) {
        let colors = { log: 'black', info: 'blue', warn: 'orange', error: 'red' };
        return `color: ${colors[i.method]}`;
    },
})

ODA({ is: 'oda-jupyter-divider',
    template: `
        <style>
            :host {
                @apply --vertical;
                height: 3px;
                justify-content: center;
                opacity: {{cells?.length?0:1}};
                transition: opacity ease-out .1s;
                position: relative;
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
        <div class="horizontal center" style="z-index: 1">
            <div ~if="!readOnly && cells?.length > 0" style="width: 100%; position: absolute; top: 2px; height: 3px;"></div>
            <oda-button ~if="!readOnly" :icon-size icon="icons:add" ~for="editors" @tap.stop="add($for.key)">{{$for.key}}</oda-button>
        </div>
    `,
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
                position: absolute;
                right: 8px;
                padding: 1px;
                border-radius: 4px;
                margin-top: -20px;
            }
        </style>
        <div class="top">
            <oda-button :disabled="!cell.prev" :icon-size icon="icons:arrow-back:90" @tap.stop="cell.move(-1)"></oda-button>
            <oda-button :disabled="!cell.next" :icon-size icon="icons:arrow-back:270" @tap.stop="cell.move(1)"></oda-button>
            <oda-button :hidden="control?.type !== 'code'" :icon-size icon="icons:settings" @tap.stop="showSettings"></oda-button>
            <oda-button :icon-size icon="icons:delete" @tap.stop="deleteCell" style="padding: 0 8px;"></oda-button>
            <oda-button ~if="cell.type!=='code'" allow-toggle ::toggled="editMode"  :icon-size icon="editor:mode-edit"></oda-button>
        </div>
    `,
    cell: null,
    iconSize: 16,
    deleteCell() {
        if (!window.confirm(`Do you really want delete current cell?`)) return;
        this.cell.delete();
    },
    showSettings(e) {
        ODA.showDropdown('oda-property-grid', { inspectedObject: this.control, filterByFlags: '$public' }, { parent: e.target, anchor: 'top-right', align: 'left', title: 'Settings', hideCancelButton: true })
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
                margin: 16px;
            }
        </style>
        <div  class="horizontal light" @pointerover="isHover = true" @pointerout="isHover = false">
            <div vertical style="width: 30px; align-items: center;"> 
                <span class="sticky" ~if="!isReadyRun" style="text-align: center; font-family: monospace; font-size: small; padding-top: 4px;">[ ]</span>
                <oda-button class="sticky" ~style="{visibility: isReadyRun?'visible':'hidden'}" :icon-size :icon @tap="run" :fill="isRun ? 'green' : 'black'"></oda-button>
            </div>
            <oda-ace-editor :read-only @keypress="_keypress" :src="value" mode="javascript" font-size="12" class="flex" show-gutter="false" max-lines="Infinity" @change="editorValueChanged"></oda-ace-editor>                        
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
        return this.isHover || this.selected || this.isRun;
    },
    isHover: false,
    value: '',
    get icon() {
        return this.isRun ? 'spinners:8-dots-rotate':'av:play-circle-outline';
    },
    isRun: false,

    editorValueChanged(e) {
        this.value = e.detail.value;
    },
    async run() {
        this.cell.metadata.hideRun = false;
        this.isRun = true;
        try{

            run_context.output_data = [];
            const fn = new AsyncFunction(this.code);
            let res =  await fn();
            // let res = await eval.call(window, this.code);
            if (res){
                run_context.output_data.push(res);
            }

            this.cell.outputs = run_context.output_data.map(i=>({data:{"text/plain": i.toString()}}));
        }
        catch (e){
            this.cell.outputs = [{data:{"text/plain":e.message}}];
        }
        finally {
            this.isRun = false;
            this.async(()=>{
                this.$('oda-ace-editor').focus();
            })

        }
    },
    attached() {
        this.$('oda-ace-editor').$('div').classList.add("light");
    },
    get code(){
        let code = this.value.replace(/import\s+([\"|\'])(\S+)([\"|\'])/gm, 'await import($1$2$3)');
        code = code.replace(/import\s+(\{.*\})\s*from\s*([\"|\'])(\S+)([\"|\'])/gm, 'let $1 = await import($2$3$4)');
        code = code.replace(/\s(import\s*\()/gm, ' ODA.$1');
        return code;
    }
})

class JupyterNotebook extends ROCKS({
    data: { cells: [] },
    isChanged: false,
    get cells() {
        return this.data.cells.map(cell => new JupyterCell(cell, this));
    },
    get items() {
        return this.cells.filter(cell => cell.level === 0);
    },
    async load(url) {
        this.data = await ODA.loadJSON(url);
        this.url = url;
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
    type: {
        $def: 'text',
        $list: ['text', 'code'],
        get() {
            return this.data.cell_type;
        }
    },
    get items() {
        return this.notebook.cells.filter(cell => cell.parent === this || cell.parent?.id === this.id);
    },
    get parent() {
        let prev = this.prev;
        while(prev && prev.level !== this.level - 1){
            prev = prev.prev;
        }
        return prev;
    },
    get name() {
        switch (this.type) {
            case 'text':
            case 'markdown': return this.src.split('\n')[0] || (this.type + ' [empty]');
        }
        return this.type
    },
    get metadata() {
        return this.data.metadata;
    },
    get id() {
        return this.metadata?.id || getID();
    },
    get outputs() {
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
    },
    get collapsed() {
        return this.metadata?.collapsed;
    },
    set collapsed(n) {
        this['__expanded__'] = !n;
        this.setMetadata('collapsed', n);
    },
    get __expanded__() {
        return !this.collapsed;
    },
    set __expanded__(n) {
        this.collapsed = !n;
    },
    setMetadata(attr, val) {
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
        return this.notebook.cells[this.index - 1]
    },
    get next() {
        return this.notebook.cells[this.index + 1];
    },
    get allowExpand() {
        return (this.h && this.next && (this.next?.h > this.h || !this.next?.h));
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
