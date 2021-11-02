KERNEL({ is: 'Layout',
    ctor(data, key = 'items', owner) {
        this.data = data || {};
        this.key = key;
    },
    $expanded: false,
    get items() {
        const items = this.data?.[this.key];
        if (items?.then){
            return items.then(items =>{
                this.items = items.map(i => new Layout(i, this.key, this))
            })
        }
        return items?.map(i => new Layout(i, this.key, this))
    },
    get label() {
        return this.data?.label || this.data?.name;
    }
})


ODA({is:'oda-layout-designer', extends: 'oda-layout-designer-structure',
    template:`
        <style>
            :host{
                overflow-x: hidden;
                overflow-y: auto;
                font-family: system-ui;
                padding-right: 8px;
            }
        </style>
    `,
    data: null,
    props:{
        designMode: false,
        keys: ''
    },
    get layout() {
        return this.data && new Layout(this.data, this.keys)
    },
})
ODA({is:'oda-layout-designer-structure',
    template:`
        <style>
            :host{
                @apply --vertical;
                @apply --no-flex;
                overflow: visible;
                
            }
        </style>
        <oda-layout-designer-container ~for="next in layout?.items" :layout="next" :icon-size></oda-layout-designer-container>
    `,
    layout: null,
    iconSize: 32,
    // editTemplate: 'span',
    // structureTemplate:'oda-layout-designer-structure'

})
ODA({is:'oda-layout-designer-container', imports: '@oda/icon',
    template: /*html*/`
        <style>
            :host{
                @apply --vertical;
                @apply --no-flex;
            }
            .structure{
                margin-left: {{iconSize/2}}px;
                border-left: 1px dashed 
            }
            label{
                width: 150px;
            }
        </style>
        <div class="horizontal" style="align-items: center;">
            <oda-icon ::icon-size :icon="(layout?.items?.length)?(layout?.$expanded?'icons:chevron-right:90':'icons:chevron-right'):''" @tap="expand()"></oda-icon>
            <label>{{layout?.label}}</label>
            <div class="flex" ~is="layout?.$template || editTemplate" :layout></div>
        </div>
        <div ~show="layout?.$expanded" ~if="layout?.items?.length" ~is="layout?.$structure || structureTemplate" :layout class="flex structure">
            
        </div>
    `,
    expand(){
        this.layout && (this.layout.$expanded = !this.layout.$expanded);
    },
    iconSize: 32,
    layout: null,
})
