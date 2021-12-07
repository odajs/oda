ODA({ is: 'oda-layout-designer',
    template: `
        <style>
            :host{
                overflow-x: hidden;
                overflow-y: auto;
                @apply --vertical;
            }
        </style>
        <oda-layout-designer-structure class="flex content" :layout style="flex:0;"></oda-layout-designer-structure>
        <div class="flex"></div>
<!--        <div ~if="designMode" :slot="designMode?'left-panel':'?'">дерево</div>-->
    `,
    data: null,
    props: {
        designMode: {
            default: false,
            set(n) {
                if (this.data) {
                    this.data.focused = null;
                    this.data.selection = [];
                }
            }
        },
        keys: ''
    },
    get layout() {
        return this.data && new Layout(this.data, this.keys)
    },
    editTemplate: 'span',
    structureTemplate: 'oda-layout-designer-structure',

})
ODA({ is: 'oda-layout-designer-structure',
    template: /*html*/`
        <style>
            :host{
                @apply --horizontal;
                @apply --no-flex;
                overflow: visible;
                flex-wrap: wrap;
                justify-content: space-around;
                padding: 8px; /*//{{layout?.isGroup?'8px':''}};*/
                align-content: flex-start;
            }
        </style>
        <oda-layout-designer-container ~for="next in layout?.items" :layout="next" :icon-size></oda-layout-designer-container>
    `,
    layout: null,
    iconSize: 32,
    get $saveKey() {
        return this.layout.$owner.name;
    },
    props: {
        settings: {
            default: { acts: [] },
            save: true
        }
    }

})

ODA({ is: 'oda-layout-designer-group', imports: '@oda/button',
    template: `
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
    ungroup(e) {

    },
    addTab() {
        this.layout.addTab();
    }
})

ODA({ is: 'oda-layout-designer-group-structure',
    template: `
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


ODA({ is: 'oda-layout-designer-container', imports: '@oda/icon, @oda/menu',
    template: /*html*/`
        <style>
            :host{
                box-sizing:border-box;
                @apply --vertical;
                overflow: hidden;
                @apply --flex;
                min-width: {{hasChildren?'100%':'32px'}};
                /*flex-grow: {{layout?.noFlex?'1':'100'}};*/
                flex: {{width?'0 0 auto':'1000000000000000000000000000000 1 auto'}};
                /*flex-basis: auto;*/
                cursor: {{designMode ? 'pointer' : ''}};
                position: relative;
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
            .selected {
                @apply --focused;
                background-color: lightyellow;
            }
            .drag-to-left:after {
                box-shadow: inset 4px 0 0 0 var(--success-color);
            }
            .drag-to-right:after {
                box-shadow: inset -4px 0 0 0 var(--success-color);
            }
            .drag-to-top:after {
                box-shadow: inset 0 4px 0 0 var(--success-color);
            }
            .drag-to-bottom:after {
                box-shadow: inset 0 -4px 0 0 var(--success-color);
            }
            .drag-to:after {
                text-align: center;
                font-size: smaller;
                font-weight: bolder;
                content: attr(capture);
                pointer-events: none;
                position: absolute;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0,255,0,.3);
            }
            .drag-to-error:after {
                content: "not allow drop";
                pointer-events: none;
                background-color: rgba(255,0,0,.3) !important;
            }
        </style>
        <div ~if="designMode" ~is="designMode?'style':'div'">
             :host{
                outline: 1px dashed blue;
            }
        </div>
        <div class="horizontal flex" style="align-items: end; overflow: hidden" @pointerdown="_tap" :draggable
                ~class="{selected: designMode && data?.selection?.includes(layout), 'drag-to':layout?.dragTo, [layout?.dragTo]:layout?.dragTo}">
            <oda-icon style="cursor: pointer;" :icon-size :icon="hasChildren?(layout?.$expanded?'icons:chevron-right:90':'icons:chevron-right'):''" @tap="expand()"></oda-icon>
            <div class="vertical flex" style="overflow: hidden;"  :disabled="designMode && !layout?.isGroup" 
                    ~class="{group:layout.isGroup}" 
                    ~style="{alignItems: (width && !layout?.type)?'center':''}">
<!--            <div class="vertical flex" style="overflow: hidden;"  :disabled="designMode && !layout?.isGroup" ~class="{group:layout.isGroup}" ~style="{flexDirection: labelPos==='top'?'column':'row', textAlign:  labelPos ==='top'?'start':'end'}">-->
                <label ~if="showLabel" class="no-flex">{{layout?.label}}</label>
                <div class="flex" ~is="layout?.$template || editTemplate" :layout ::width></div>
            </div>
        </div>
        <div ~if="hasChildren && layout?.$expanded" ~is="layout?.$structure || structureTemplate" :layout class="flex structure" style="margin-bottom: 16px; margin-right: 1px;"></div>
    `,
    width: undefined,
    get hasChildren() {
        return this.layout?.items?.length;
    },
    expand() {
        this.layout && (this.layout.$expanded = !this.layout.$expanded);
    },
    listeners: {
        async contextmenu(e) {
            e.preventDefault();
            e.stopPropagation();
            if (!this.designMode) return;
            const res = await ODA.showDropdown('oda-menu', {
                items: [{
                    label: 'grouping', run: () => {
                        const action = { acts: "grouping", target: this.layout.id }
                        this.settings.acts.push(action);
                        action.id = this.toGroup(action);
                    }
                }, { label: 'hide' }]
            }, { title: e.target.layout?.label });
            res.focusedItem.run.call(this)
        },
        'dragstart': '_dragstart',
        'dragend': '_dragend',
        'dragover': '_dragover',
        'dragleave': '_dragleave',
        'drop': '_dragdrop',
    },
    labelPos: 'top',
    get showLabel() {
        return !this.layout.isGroup;
    },
    layout: null,
    get draggable() {
        return this.layout && this.designMode ? 'true' : 'false';
    },
    toGroup() {
        return this.layout.toGroup();
    },
    _tap(e) {
        if (e.ctrlKey || e.metaKey) {
            this.data.selection ||= [];
            if (this.data.focused && (e.target.domHost.layout.owner !== this.data.focused.owner)) return;
        } else {
            this.data.selection = [];
        }
        this.data.focused = this.layout;
        this.data.selection.add(this.layout);
    },
    _dragstart(e) {
        e.stopPropagation();
        this.data.dragItem = this.layout;
        e.dataTransfer.setDragImage((this.data.selection && this.data.selection.includes(this.data.dragItem) && this.data.selection.length) > 1 ? img3 : img, -20, 7);
    },
    _dragend(e) {
        this._clearDragTo();
    },
    _dragover(e) {
        e.stopPropagation();
        this._clearDragTo();
        if (this.data?.dragItem) {
            this.layout.dragTo = 'drag-to-error';
            if (this.data.dragItem.$owner !== this.layout.$owner || this.data.dragItem === this.layout) return;
            this._clearDragTo();
            e.preventDefault();
            let to = '',
                x = e.layerX,
                y = e.layerY,
                w = e.target.offsetWidth,
                h = e.target.offsetHeight;
            x = (x - w / 2) / w * 2;
            y = (y - h / 2) / h * 2;
            if (Math.abs(x) > Math.abs(y))
                to = x < 0 ? 'left' : 'right';
            else
                to = y < 0 ? 'top' : 'bottom';
            this.data.action = 'move';
            this.data.to = to;
            this.layout.dragTo = 'drag-to-' + to;
            this.data.targetItem = this.layout;
        }
    },
    _dragleave(e) {
        this._clearDragTo();
    },
    _dragdrop(e) {
        e.stopPropagation();
        this._clearDragTo();
    },
    _clearDragTo() {
        this.capture = '';
        this.layout.dragTo = '';
        this.layout.owner.items.forEach(i => i.dragTo = '');
        if (this.data.last) this.data.last.layout.dragTo = '';
        if (this.domHost && this.domHost.layout) this.domHost.layout.dragTo = '';
        this.render();
    }
})
KERNEL({
    is: 'Layout',
    ctor(data, key = 'items', owner, $owner) {
        this.data = data || {};
        this.key = key;
        this.owner = owner;
        this._owner = $owner;
    },
    owner: undefined,
    type: undefined,
    $expanded: false,
    get $owner() { return this._owner || this.owner?.$owner || this.owner || this },
    get items() {
        const items = this.data?.[this.key];
        if (items?.then) {
            return items.then(items => {
                this.items = items.map(i => new Layout(i, this.key, this, this))
            })
        }
        return items?.map(i => new Layout(i, this.key, this, this))
    },
    get id() {
        return this.data?.id || this.data?.name;
    },
    get name() {
        return this.data?.name || this.id;
    },
    get label() {
        return this.data?.label || this.name;
    },
    get $template() {
        return this.isGroup ? 'oda-layout-designer-group' : '';
    },
    get $structure() {
        return this.isGroup ? 'oda-layout-designer-group-structure' : '';
    },
    get isGroup() {
        return this.type === "group";
    },
    toGroup() {
        const myIdx = this.owner.items.indexOf(this);
        const group = new Layout({ label: `Group for ${this.label}` }, this.key, this);
        const block = new Layout({ label: `Group for ${this.label}` }, this.key, group);
        group.type = 'group';
        group.width = 0;
        group.items = [block];
        group.$expanded = true;
        group.$focused = block;
        block.items = [this];
        this.owner.items.splice(myIdx, 1, group);
    },
    addTab() {
        const tab = new Layout({ label: `Tab ${this.items.length + 1}` }, this.key, this);
        this.items.push(tab)
        this.$focused = tab;
    }
})

const getUUID = function b(a) { return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b) };
const img = new Image();
img.src = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAQCAYAAABQrvyxAAAACXBIWXMAAAsSAAALEgHS3X78AAAAa0lEQVRIiWPU6v91RFv4jwIv+78/DEMIfP7JxHL1LcsDFpDjJ7p8kB5KjoeB/D0CDExDLeSRAcjtTIPHOeSBUQ8MNBj1wECDUQ8MNBj1wECDUQ8MNGACteqGquNBbgc3SUGtuiHZnH7L8gAAtichl6hs6rYAAAAASUVORK5CYII=`;
const img3 = new Image();
img3.src = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAAUCAYAAADC1B7dAAAACXBIWXMAAAsSAAALEgHS3X78AAAA4klEQVRYhWPU6v91RFv4jwIv+78/DEMIfP7JxHL1LcuDqwWsNsiuZgF5ZqLLB+mh5BkYyN8jwMDAwIoixjTUYgYZ8LL/Ew9b/P2J9oTfR2DCTIPCZWQCQfb/LKDUBUplMBNYhponsAFYTIHy1JCOIRhAjqlh4SEYAJUHw8pDDEO9UMAGRj002MGohwY7GH4eArVaB4E7yAIffzFiaAM3wUGtVlDzAVTjDgmfQD3z6SdmAmOB9CdYGUBtoRbbodmNQI4peIwMl5hi/P//P4oCUEwN4Q7fU4yYQIqpodclf8vyAAC+a17T0iNSKwAAAABJRU5ErkJggg==`;
