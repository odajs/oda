ODA({is:'oda-layout-designer',
    template:`
        <style>
            :host{
                overflow-x: hidden;
                overflow-y: auto;
                @apply --vertical;
            }
        </style>
        <oda-layout-designer-structure class="flex content" :layout style="flex:0"></oda-layout-designer-structure>
        <div class="flex"></div>
<!--        <div ~if="designMode" :slot="designMode?'left-panel':'?'">дерево</div>-->
    `,
    data: null,
    props:{
        designMode: false,
        keys: ''
    },
    get layout() {
        return this.data && new Layout(this.data, this.keys)
    },
    editTemplate: 'span',
    structureTemplate: 'oda-layout-designer-structure',

})
ODA({is:'oda-layout-designer-structure',
    template:`
        <style>
            :host{
                @apply --horizontal;
                @apply --no-flex;
                overflow: visible;
                flex-wrap: wrap;
                justify-content: space-around;
                padding: 8px; /*//{{layout?.isGroup?'8px':''}};*/
            }
        </style>
        <oda-layout-designer-container ~for="next in layout?.items" :layout="next" :icon-size></oda-layout-designer-container>
    `,
    layout: null,
    iconSize: 32,
    get $saveKey(){
        return this.layout.name;
    },
    props:{
        settings:{
            default: {acts:[]},
            save: true
        }
    }

})

ODA({is:'oda-layout-designer-group', imports: '@oda/button',
    template:`
        <style>
            :host{
                @apply --horizontal;
                @apply --flex;
                height: 100%;
            }
            [focused]{
                @apply --content;
            }
            label{
                white-space: nowrap;
                text-overflow: ellipsis;
                font-weight: bold;
                padding: 4px;
            }
            oda-button{
                transform: scale(.7);
                padding: 0px;
            }
        </style>
        <div class="horizontal flex" style="flex-wrap: wrap;">
           <div @tap="layout.$focused = item" ~for="layout?.items" class="horizontal"  style="align-items: center; " :focused="item === layout.$focused">
                <label class="flex">{{item?.label}}</label>
                <oda-button :icon-size @tap.stop="ungroup" ~if="designMode" icon="icons:close"></oda-button>
            </div>
        </div>
        <oda-button :icon-size @tap.stop="addTab" ~if="designMode" icon="icons:add"></oda-button>
    `,
    ungroup(e){

    },
    addTab(){
        this.layout.addTab();
    }
})

ODA({is:'oda-layout-designer-group-structure',
    template:`
        <style>
            :host{
                @apply --horizontal;
                @apply --flex;
                min-height: 32px;
                min-width: 32px;
                /*@apply --header;*/
                padding: 4px;
                position: relative;
                margin-left: {{iconSize}}px !important;
                @apply --shadow;
            }
        </style>
        <oda-layout-designer-structure ~if="item === layout.$focused" class="flex" ~for="layout?.items" :layout="item"></oda-layout-designer-structure>
    `
})


ODA({is:'oda-layout-designer-container', imports: '@oda/icon, @oda/menu',
    template: /*html*/`
        <style>
            :host{
                box-sizing:border-box;
                @apply --vertical;
                overflow: hidden;
                @apply --flex;
                min-width: {{hasChildren?'100%':'32px'}};
                /*flex-grow: {{layout?.noFlex?'1':'100'}};*/
                flex: {{layout?.noFlex?'0 0 auto':'1000000000000000000000000000000 1 auto'}};
                /*flex-basis: auto;*/
            }
            .structure{
                margin-left: {{layout?.isGroup?0:iconSize}}px;
                @apply --shadow; 
            }
            label{
                font-size: small;
                font-weight: bold;
                padding: 8px;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .group{
                @apply --header;
            }
        </style>
        <div ~if="designMode" ~is="designMode?'style':'div'">
             :host{
                outline: 1px dashed blue;
            }
        </div>
        <div class="horizontal flex" style="align-items: end; overflow: hidden">
            <oda-icon style="cursor: pointer;" :icon-size :icon="hasChildren?(layout?.$expanded?'icons:chevron-right:90':'icons:chevron-right'):''" @tap="expand()"></oda-icon>
            <div class="vertical flex" style="overflow: hidden;"  :disabled="designMode && !layout?.isGroup" ~class="{group:layout.isGroup}">
<!--            <div class="vertical flex" style="overflow: hidden;"  :disabled="designMode && !layout?.isGroup" ~class="{group:layout.isGroup}" ~style="{flexDirection: labelPos==='top'?'column':'row', textAlign:  labelPos ==='top'?'start':'end'}">-->
                <label ~if="showLabel" class="no-flex">{{layout?.label}}</label>
                <div class="flex" ~is="layout?.$template || editTemplate" :layout></div>
            </div>
        </div>
        <div ~if="hasChildren && layout?.$expanded" ~is="layout?.$structure || structureTemplate" :layout class="flex structure" style="margin-bottom: 16px; margin-right: 1px;"></div>
    `,
    get hasChildren(){
        return this.layout?.items?.length;
    },
    expand(){
        this.layout && (this.layout.$expanded = !this.layout.$expanded);
    },
    listeners:{
        async contextmenu(e){
            e.preventDefault();
            e.stopPropagation();
            if (!this.designMode) return;
            const res = await ODA.showDropdown('oda-menu', {items: [{label: 'grouping', run:()=>{
                const action = {acts: "grouping", target: this.layout.id}
                this.settings.acts.push(action);
                action.id = this.toGroup(action);
            }}, {label: 'hide'}]},{title: e.target.layout?.label});
            res.focusedItem.run.call(this)
        }
    },
    labelPos: 'top',
    get showLabel(){
        return !this.layout.isGroup;
    },
    layout: null,
    toGroup(){
        return this.layout.toGroup();
    }
})
KERNEL({ is: 'Layout',
    ctor(data, key = 'items', owner) {
        this.data = data || {};
        this.key = key;
        this.owner = owner;
    },
    owner: undefined,
    type: undefined,
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
    get id() {
        return this.data?.id || this.data?.name;
    },
    get name() {
        return this.data?.name || this.id;
    },
    get noFlex() {
        return this.data?.width || this.data?.noFlex;
    },
    get label() {
        return this.data?.label || this.name;
    },
    get $template(){
        return this.isGroup?'oda-layout-designer-group':'';
    },
    get $structure(){
        return this.isGroup?'oda-layout-designer-group-structure':'';
    },
    get isGroup() {
        return this.type === "group";
    },
    toGroup(){
        const myIdx = this.owner.items.indexOf(this);
        const group = new Layout({label: `Group for ${this.label}`}, this.key, this);
        const block = new Layout({label: `Group for ${this.label}`}, this.key, group);
        group.type = 'group';
        group.items = [block];
        group.$expanded = true;
        group.$focused = block;
        block.items = [this];
        this.owner.items.splice(myIdx, 1, group);
    },
    addTab(){
        const tab = new Layout({label: `Tab ${this.items.length+1}`}, this.key, this);
        this.items.push(tab)
        this.$focused = tab;
    }
})