ODA({ is: 'oda-layout-designer', imports: '@oda/icon',
    template: /*html*/`
        <style>
            :host {
                overflow-x: hidden;
                overflow-y: auto;
                @apply --vertical;
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
                align-items: {{layout?.align ==='vertical' ? 'normal' : 'flex-end'}};
                @apply --horizontal;
                @apply --no-flex;
                flex-wrap: wrap;
                justify-content: space-around;
            }
        </style>
        <oda-layout-designer-container ~for="layout?.items" :layout="item" :icon-size></oda-layout-designer-container>
    `,
    layout: {}
})
ODA({ is: 'oda-layout-designer-container',
    template: /*html*/`
        <style>
            :host {
                max-width: 100%;
                min-width: {{layout?.items?.length?'100%':'auto'}};
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
            }
            .ee{
                min-height: {{iconSize*1.5}}px;
            
            }
            
        </style>
        <div class="horizontal flex" style="align-items: end;" ~style="{minHeight: iconSize * 1.5}">
            <oda-icon style="cursor: pointer" :icon-size :icon="(layout?.items?.length)?(layout?.$expanded?'icons:chevron-right:90':'icons:chevron-right'):''" @tap.stop="expand"></oda-icon>
            <div class="horizontal flex" ~style="{flexDirection: label.align === 'left'?'row':'column', alignItems: label.align === 'left'?'center':''}">
                <label ~html="layout?.title" ~style="{padding: label.align === 'left'?'4px':'4px 4px 0px 0px'}"></label>
                <div ~is="layout?.editorTemplate || editorTemplate" class="flex ee"></div>
            </div>
        </div>
        <div ~if="layout?.$expanded" ~is="layout?.$structure || structureTemplate" :layout ~style="{marginLeft: iconSize/2}" style="border-left: 1px dashed; border-bottom: 1px dashed; padding-bottom: 4px; opacity: .9"></div>
        
    `,
    expand() {
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
    $expanded: false
})