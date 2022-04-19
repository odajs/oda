const path = import.meta.url.split('/').slice(0, -1).join('/');
ODA({is:'oda-jupyter', imports: '@oda/button, @tools/property-grid, @tools/containers',
    template: `
        <style>
            :host{
                @apply --vertical;
                @apply --flex;
            }
        </style>
        <oda-jupyter-divider index="-1"></oda-jupyter-divider>
        <div ~for="notebook?.cells" class="vertical no-flex">
            <oda-jupyter-cell  :cell="item" :focused="focusedItem === item"  @tap.stop="focusedItem = item"></oda-jupyter-cell>
            <oda-jupyter-divider :index></oda-jupyter-divider>
        </div>
    `,
    listeners: {
        tap(e){
            this.focusedItem = null;
        }
    },
    props:{
        iconSize: {
            default: 16,
            save: true
        },
        readOnly: {
            default: false,
            get (){
                return this.notebook?.readOnly;
            }
        },
        editors:{
            default: ['html', 'code', 'markdown']
        }
    },
    focusedItem: null,
    set src(n){
        if (!n.startsWith('http'))
            n = path + '/' + n;
        ODA.loadJSON(n).then(res=>{
            this.notebook = res;
        })
    },
    notebook: {}
})
ODA({is: 'oda-jupyter-divider',
    template: `
        <style>
            :host{
                @apply --vertical;
                height: 16px;
                justify-content: center;
            }
            :host>div{
                transition: opacity ease-out .5s;
            }
            :host(:hover)>div{
                opacity: 1;
            }
            oda-button{
                font-size: x-small;
                margin: 0px 8px;
                @apply --content;
                @apply --border;
                padding: 0px 4px 0px 0px;
                border-radius: 4px;
            }
            div{
                opacity: 0;    
                height: 2px;
                align-items: center;
                justify-content: center;
            }
        </style>
        <div class="horizontal header">
            <oda-button :icon-size icon="icons:add" ~for="editors" >{{item}}</oda-button>
        </div>
    `
})

ODA({is:'oda-jupyter-cell',
    template:`
        <style>
            :host{
                position: relative;
                @apply --no-flex;
                padding: 1px;
            }
            .editor{
                padding: 4px;
            }
        </style>
        <div class="editor" ~is="editor" ~class="{shadow: focused}">
            {{cell?.label || '??'}}
        </div>
        <oda-jupyter-toolbar ~if="focused"></oda-jupyter-toolbar>
    `,
    set cell(n){
        if (n){
            this.src = n.cell_type;
        }
    },
    set src(n){
        ODA.import('@oda/'+n).then(res=>{
            console.log(res);
            this.editor = 'oda-'+n;
        })
    },
    get control(){
        return this.$(this.editor);
    },
    focused: false,
    editMode: false,
    editor: 'div'
})

ODA({is:'oda-jupyter-toolbar',
    template:`
        <style>
            :host{
                position: absolute;
                top: -{{iconSize}}px;
                right: 0px;
                @apply --horizontal;
                @apply --no-flex;
                padding: 1px;
                @apply --content;
                @apply --shadow;
            }
        </style>
        <oda-button :icon-size icon="icons:arrow-back:90"></oda-button>
        <oda-button :icon-size icon="icons:arrow-back:270"></oda-button>
        <span style="width: 8px"></span>
        <oda-button :icon-size icon="icons:settings" ~show="_getShowSettings(control)" @tap="showSettings"></oda-button>
        <oda-button :icon-size icon="icons:delete"></oda-button>
        <span style="width: 8px"></span>
        <oda-button allow-toggle ::toggled="editMode" :icon-size :icon="editMode?'icons:close':'editor:mode-edit'"></oda-button>
    `,
    _getShowSettings(control) {
        return Object.keys(control?.$core?.saveProps || {}).length > 0;
    },
    cell: null,
    showSettings: noDragWrap(async function (e) {
        await ODA.showDropdown(
            'oda-property-grid',
            { inspectedObject: this.control, onlySave: true, style: 'max-width: 500px' },
            { parent: e.target, intersect: true, align: 'right', title: 'Settings', hideCancelButton: true }
        );
    }),
})

function noDragWrap(f) {
    return function (e, ...args) {
        const se = e.detail.sourceEvent;
        if (this.size === 'max' || !this.modal || (!this._downEvent || se.x === this._downEvent.x && se.y === this._downEvent.y)) {
            return f.call(this, e, ...args);
        }
        this._downEvent = undefined;
    }
}