const jupyter_path = import.meta.url.split('/').slice(0, -1).join('/');
const path = window.location.href.split('/').slice(0, -1).join('/');

const run_context = Object.create(null);
run_context.output_data = undefined;
let console_original = console.log;
window.log = window.print = console.log = (...e) => {
    console_original.call(window, ...e);
    run_context.output_data?.push([...e].join('\n'));
}
console_original =  console.warning;
window.warn =  console.warning = (...e) => {
    console_original.call(window, ...e);
    run_context.output_data?.push('warning:\n'+[...e].join('\n'));
}
console_original =  console.error;
window.err = console.error = (...e) => {
    console_original.call(window, ...e);
    run_context.output_data?.push( 'error:\n'+ [...e].join('\n'));
} 
window.run_context = run_context;

ODA({ is: 'oda-jupyter', imports: '@oda/button, @oda/markdown, @oda/html-editor',
    template: `
        <style>
            :host{
                @apply --vertical;
                @apply --flex;
                padding: 12px 6px;
                outline: none !important;
            }
        </style>
        <div class="no-flex vertical" style="overflow: visible; border-bottom: 1px dotted gray; padding-bottom: 30px">
            <oda-jupyter-divider ~style="{zIndex: cells.length + 1}"></oda-jupyter-divider>
            <oda-jupyter-cell  @tap="selectedCell = $for.item" @blur="editMode = false" :shadow="$for.item === selectedCell || $for.item.id === selectedCell?.id" ~for="cells" :cell="$for.item"  ~show="!$for.item.hidden"></oda-jupyter-cell>
        </div>

    `,
    tabindex:{
        $def: 0,
        $attr: true
    },
    $keyBindings:{
        enter(e){
            this.editmode = true;
        },
        arrowup(e){
            if (this.selectedCell.index>0)
                this.selectedCell = this.cells[this.selectedCell.index - 1]
        },
        arrowdown(e){
            if (this.cells.length - 1 > this.selectedCell.index)
                this.selectedCell = this.cells[this.selectedCell.index + 1]
        }
    },
    $public: {
        $pdp: true,
        isChanged: {
            $type: Boolean,
            get() {
                return this.notebook.isChanged;
            },
            set(n) {
                this.notebook.isChanged = n;
            }
        },
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
            const nb = new JupyterNotebook(this.url);
            nb.listen('changed', async (e) => {
                await this.$render();
                if (e.detail.value) {
                    const added = this.$$('oda-jupyter-cell').find(cell => cell.cell.id === this.selectedCell.id);
                    added.focus();
                }
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
        selectedCell: null,
        get cells() {
            return this.notebook?.cells;
        },
        editMode: false
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
                min-height: 66px;
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
        <oda-jupyter-toolbar :icon-size="iconSize * .66" :cell ~if="!readOnly && selected"></oda-jupyter-toolbar>
        <div class="vertical" ~style="{marginLeft: (levelMargin * cell.level)+'px'}">
            <div class="vertical">
                <div class="horizontal" >
                    <oda-icon ~if="cell.allowExpand" :icon="expanderIcon" @tap="this.cell.collapsed = !this.cell.collapsed"></oda-icon>
                    <div flex id="control" ~is="editor" :cell ::edit-mode ::value show-preview></div>
                </div>
                <div info ~if="cell.collapsed" class="horizontal" @tap="cell.collapsed = false">
                    <oda-icon  style="margin: 4px;" :icon="childIcon"></oda-icon>
                    <div style="margin: 8px;">Hidden {{cell.childrenCount}} cells</div>
                </div>
            </div>
            <div ~if="cell?.outputs?.length" class="horizontal" style="max-height: 100%;">
                <div style="width: 30px">
                    <oda-button class="sticky" :icon-size icon="icons:expand-tree" style="cursor: pointer; position: sticky; opacity: .5;"></oda-button>
                </div>
                <div  class="vertical">
                    <div ~for="cell.outputs" style="padding: 4px;">
                        <object :warning="console($$for.item, 'warning:')" :error="console($$for.item, 'error:')" ~for="$for.item.data" :type="$$for.key" ~html="$$for.item" style="white-space: break-spaces;"></object>
                    </div>
                </div>
                
            </div>        
        </div>
        <oda-jupyter-divider></oda-jupyter-divider>
    `,
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

    $pdp: {
        editMode: {
            $def: false,
            get() {
                return this.jupyter.editMode && this.selected
            },
            set(n) {
                this.jupyter.editMode = n
            }
        },
        cell: null,
        get selected() {
            return this.selectedCell === this.cell;
        },
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
        <div class="horizontal center" style="z-index: 1">
            <div ~if="!readOnly && cells?.length > 0" style="width: 100%; position: absolute; top: 2px; height: 3px;"></div>
            <oda-button ~if="!readOnly" :icon-size icon="icons:add" ~for="editors" @tap.stop="add($for.key)">{{$for.key}}</oda-button>
        </div>
    `,
    add(key) {
        this.editMode = false;
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
                @apply --shadow;
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
            <oda-button allow-toggle ::toggled="editMode"  :icon-size icon="editor:mode-edit"></oda-button>
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
            <oda-ace-editor @keypress="_keypress" :src="value" mode="javascript" font-size="12" class="flex" show-gutter="false" max-lines="Infinity" @change="editorValueChanged"></oda-ace-editor>                        
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
        this.isRun = true;
        try{

            run_context.output_data = [];
            const fn = new AsyncFunction(this.value);
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
        return ` ${this.value} `;
    }
})

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
    add(cell, cell_type = 'text') {
        let id = getID()
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
    get metadata() {
        return this.data.metadata;
    },
    get id() {
        return this.metadata?.id;
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
        return this.sources.join('');
    },
    set src(n) {
        this.data.source = [n];
        this.notebook.change();
    },
    get collapsed() {
        return this.metadata?.collapsed;
    },
    set collapsed(n) {
        this.setMetadata('collapsed', n);
    },
    setMetadata(attr, val) {
        const metadata = this.metadata ??= Object.create(null);
        metadata[attr] = val;
        this.notebook.change();
    },
    get childrenCount() {
        let next = this.next;
        let cnt = 0;
        while (next && next.h > this.h) {
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
        return (this.h < 7 && this.next?.h > this.h);
    },
    get h() {
        let h = this.sources[0]?.trim().toLowerCase();
        if (h?.startsWith('#')) {
            let i = -1;
            while (h[++i] === '#' && i < 7) { }
            return i;
        }
        return 7;
    },
    level: {
        $def: 0,
        get() {
            return this.h - 1;
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
            while (prev && prev.h >= this.h) {
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
