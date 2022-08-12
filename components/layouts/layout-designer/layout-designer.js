ODA({ is: 'oda-layout-designer', imports: '@oda/icon',
    template: /*html*/`
        <style>
            :host {
                overflow-x: hidden;
                overflow-y: auto;
                /*@apply --vertical;*/
            }
        </style>
        <oda-layout-designer-structure class="flex content" :layout style="padding: 16px;"></oda-layout-designer-structure>
        <div class="flex"></div>
    `,
    data: {},
    selection: [],
    dragInfo: {},
    hiddenLayouts: [],
    props: {
        designMode: {
            default: false,
            set(n) {
                this.selection = [];
            }
        },
        editorTemplate: "input",
        dataKeys: '',
        iconSize: 24,
    },
    get layout() {
        return new Layout(this.data, undefined, this.dataKeys);
    },
    structureTemplate: 'oda-layout-designer-structure',
})

ODA({ is: 'oda-layout-designer-structure',
    template: /*html*/`
        <style>
            :host {
                position: relative;
                border-left: 1px dashed var(--header-background);
                align-items: {{layout?.align ==='vertical' ? 'normal' : 'flex-end'}};
                @apply --horizontal;
                @apply --no-flex;
                flex-wrap: wrap;
                /*justify-content: space-around;*/
            }
        </style>
        <oda-layout-designer-container ~for="lay in layout?.items" :layout="lay"></oda-layout-designer-container>
    `,
    layout: {}
})
ODA({ is: 'oda-layout-designer-container',
    template: /*html*/`
        <style>
            :host {
                padding-top: 8px;
                max-width: 100%;
                min-width: {{extendedMode?'100%':(layout?.width?layout?.width:'')}};
                position: relative;
                box-sizing: border-box;
                @apply --vertical;
                overflow: hidden;
                @apply --flex;
                flex: {{layout?.width ? '0 0 auto':'1000000000000000000000000000000 1 auto'}};
            }
            label{
                font-size: small;
                font-weight: bold;
                opacity: .5;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            oda-icon{
                cursor: pointer;
                opacity: .5;
                padding-top: 8px;
                align-self: center;
            }
        </style>
        <div class="horizontal flex" style="align-items: center;">
            <oda-icon :icon-size ~style="{cursor: expandIcon ? 'pointer' : 'auto'}" :icon="expandIcon" @tap.stop="expand"></oda-icon>
            <div class="horizontal flex" ~style="{flexDirection: label.align === 'left'?'row':'column', alignItems: label.align === 'left'?'center':''}">
                <label ~html="layout?.title" style="padding-right: 4px;" :title="layout?.title"></label>
                <div ~is="layout?.editorTemplate || editorTemplate" class="flex editor" :layout></div>
            </div>
        </div>
        <div ~if="layout?.$expanded" ~is="layout?.structureTemplate || structureTemplate" :layout ~style="{marginLeft: iconSize/2 +'px'}" style="padding-bottom: 4px; opacity: .9;"></div>
    `,
    get expandIcon(){
        return this.extendedMode ? (this.layout?.$expanded ? 'icons:chevron-right:90' : 'icons:chevron-right') : '';
    },
    get extendedMode(){
        return this.layout?.items?.length;
    },
    expand() {
        if (!this.expandIcon) return;
        this.layout.$expanded = !this.layout.$expanded;
    },
    props: {
        label: {
            default: {
                color: 'black',
                align: 'top',
                hidden: false
            },
        },
    },
    layout: {},
})
const Layout = CLASS({
    ctor(data = {}, owner, dataKeys = 'items') {
        this.data = data;
        this.dataKeys = owner?.dataKeys || dataKeys;
        this.owner = owner;
    },
    get items() {
        const items = this.data?.[this.dataKeys];
        if (items?.then) {
            return items.then(items => {
                this.items = items.map(i => new Layout(i, this))
            })
        }
        return items?.map(item => new Layout(item, this))
    },
    get title() {
        return this._label || this.label;
    },
    set title(n) {
        this._label = n;
    },
    get label() {
        return this.data?.label || this.name;
    },
    get name() {
        return this.data?.name;
    },
    $expanded: false,
    width: undefined
})