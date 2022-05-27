ODA({ is: 'oda-layout-designer',
    template: /*html*/`
        <style>
            :host {
                overflow-x: hidden;
                overflow-y: auto;
                @apply --vertical;
            }
        </style>
        <oda-layout-designer-structure class="flex content" :layout style="flex:0; padding-top: 16px;" :root-savekey="rootSaveKey"></oda-layout-designer-structure>
        <div class="flex"></div>
    `,
    data: null,
    selection: [],
    dragInfo: {},
    props: {
        designMode: {
            default: false,
            set(n) {
                this.selection = [];
            }
        },
        keys: '',
        iconSize: 24
    },
    get rootSaveKey() {
        return this.data?.savekey || 'root';
    },
    get layout() {
        return this.data && new Layout(this.data, this.keys);
    },
    editTemplate: 'span',
    structureTemplate: 'oda-layout-designer-structure',
    lays: null,
    async saveScript(layout, action) {
        // console.log('..... ', layout.root.saveKey, action)
        layout.root.lay.actions ||= [];
        layout.root.lay.actions.add(action);
        this.lays.add(layout);
    },
    clearSavedScripts() {
        this.lays.forEach(i => i.root.lay.actions = []);
        document.location.reload();
    }
})

ODA({ is: 'oda-layout-designer-structure',
    template: /*html*/`
        <style>
            :host {
                @apply --horizontal;
                @apply --no-flex;
                overflow: visible;
                flex-wrap: wrap;
                /*justify-content: space-around;*/
                align-content: flex-start;
                flex-direction: {{layout?.type==='vGroup' ? 'column' : 'row'}};
                border: {{!layout?.isGroup ? '' : designMode ? '2px solid blue' : (layout?.hideLabel || !layout?.$expanded) ? '' : '1px solid ' + borderColor || 'lightgray'}};
            }
            [selected] {
                background-color: var(--selection-background, hsla(192, 100%, 50%, 0.1));
            }
        </style>
        <oda-layout-designer-container ~for="next in layout?.items" :layout="next" :icon-size :selected="designMode && selection.has(next)"></oda-layout-designer-container>
    `,
    props: {
        layout: {
            default: null,
            set(n) {
                if (n)
                    n.lay = this;
            }
        },
        rootSavekey: '',
        actions: {
            default: [],
            save: true
        },
        saveKey: '',
        borderColor: 'lightgray'
    },
    observers: [
        async function execute(layout, actions) {
            if (layout) {
                this.saveKey = layout.saveKey = this.rootSavekey || (this.rootSaveKey + '_' + layout.id || layout.name || layout.showLabel);
                this.lays ||= new Set();
                if (actions?.length && !this.lays.has(this.layout)) {
                    await this.layout.execute(actions);
                    this.lays.add(this.layout); // for single execution - to remove looping
                }
            }
        }
    ]
})

ODA({ is: 'oda-layout-designer-tabs', imports: '@oda/button',
    template: /*html*/`
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                height: 100%;
                margin-top: 8px;
                margin-left: {{iconSize + 'px'}};
            }
            [focused] {
                @apply --content;
            }
            .tab {
                white-space: nowrap;
                text-overflow: ellipsis;
                margin: 2px;
                padding: 8px;
                cursor: pointer; 
                font-size: {{fontSize}};
            }
            oda-button {
                transform: scale(.6);
                padding: 0px;
                margin-left: auto;
            }
        </style>
        <div ~if="layout.$expanded" class="horizontal flex header" style="flex-wrap: wrap; border: 1px solid gray;">
           <div @mousedown.stop.prev="ontap($event, item)" ~for="layout?.items" class="horizontal" style="align-items: start; border-right: 1px solid gray;" ~style="{'box-shadow': hoverItem === item ? 'inset 4px 0 0 0 var(--success-color)' : ''}"
                    :draggable :focused="item === layout.$focused" @dragstart.stop="ondragstart($event, item)" @dragover.stop="ondragover($event, item)"
                    @dragleave.stop="ondragleave" @drop.stop="ondrop($event, item)">
                <label class="tab" ~is="editTab===item ? 'input' : 'label'" class="flex" @dblclick="editTab = designMode ? item : undefined" ::value="item.label" @change="tabRename($event, item)" @blur="editTab=undefined">{{item?.label}}</label>
                <oda-button :icon-size ~if="designMode" icon="icons:close" @tap.stop="removeTab($event, item)"></oda-button>
            </div>
            <oda-button :icon-size @tap.stop="addTab" ~if="designMode" icon="icons:add"></oda-button>
        </div>
    `,
    props: {
        fontSize: 'small'
    },
    get draggable() {
        return this.layout && this.designMode ? 'true' : 'false';
    },
    hoverItem: undefined,
    editTab: undefined,
    addTab() {
        const tabID = getUUID();
        const blockID = getUUID();
        const action = { id: tabID, action: "addTab", props: { tabs: this.layout.id, tab: tabID, block: blockID } };
        this.layout.addTab(action, this.layout);
        this.saveScript(this.layout, action);
    },
    removeTab(e, item) {
        const action = { action: "removeTab", props: { tabs: this.layout.id, tab: item.id } };
        this.layout.removeTab(action, item);
        this.saveScript(this.layout, action);
    },
    ontap(e, item) {
        this.layout.$expanded = true;
        this.layout.$focused = item;
        if (this.designMode) {
            const action = { action: "selectTab", props: { tabs: this.layout.id, tab: item.id } };
            this.saveScript(this.layout, action);
        }
    },
    ondragstart(e, item) {
        e.stopPropagation();
        this.dragInfo.dragItem = item;
        this.dragInfo.isMoveTab = true;
    },
    ondragover(e, item) {
        e.stopPropagation();
        if (this.dragInfo.dragItem.root !== item.root || !this.dragInfo.isMoveTab) return;
        e.preventDefault();
        this.hoverItem = item;
    },
    ondragleave(e) {
        this.hoverItem = undefined;
    },
    ondrop(e, item) {
        e.stopPropagation();
        this.dragInfo.targetItem = item;
        this.dragInfo._action = { action: 'move', props: { item: this.dragInfo.dragItem.id, target: this.dragInfo.targetItem.id, to: 'left' } };
        this.layout.move(this.dragInfo);
        this.saveScript(this.layout, this.dragInfo._action);
        this.hoverItem = undefined;
        this.dragInfo.isMoveTab = false;
    },
    tabRename(e, item) {
        this.editTab = undefined;
        if (this.designMode) {
            const action = { action: "setLabel", label: item.label, props: { id: item.id } };
            this.saveScript(this.layout, action)
        }
    }
})

ODA({ is: 'oda-layout-designer-tabs-structure',
    template: `
        <style>
            :host {
                @apply --horizontal;
                @apply --flex;
                min-height: 32px;
                min-width: 32px;
                padding: 4px;
                position: relative;
                border: 1px solid darkgray;
                margin-left: {{iconSize}}px !important;
                border-top: none;
            }

        </style>
        <oda-layout-designer-structure ~if="item === layout.$focused" class="flex" ~for="layout?.items" :layout="item"></oda-layout-designer-structure>
    `
})

ODA({ is: 'oda-layout-designer-container', imports: '@oda/icon, @oda/menu, @tools/containers',
    template: `
        <style>
            :host {
                box-sizing: border-box;
                @apply --vertical;
                overflow: hidden;
                @apply --flex;
                /* flex-grow: {{layout?.noFlex?'1':'100'}}; */
                flex: {{width?'0 0 auto':'1000000000000000000000000000000 1 auto'}};
                /* flex-basis: auto; */
                cursor: {{designMode ? 'pointer' : ''}};
                position: relative;
                order: {{layout?._order ?? 'unset'}};
                display: {{!designMode && (layout?.isHide || layout?.isVirtual) ? 'none' : 'unset'}};
                border: {{designMode && layout?.isVirtual ? '2px dotted blue' : designMode && layout?.isHide ? '2px dotted red' : designMode ? '1px dashed lightblue' : '1px solid transparent'}};
                min-width: {{layout?.minWidth ? layout?.minWidth : (layout.isGroup || layout.owner.type==='vGroup' ? '100%' : hasChildren && !layout?.isGroup && !layout?.owner.isGroup)?'100%':'32px'}};
                max-width: {{layout.maxWidth ? layout.maxWidth : 'unset'}};
                width: {{layout.width ? layout.width : 'unset'}};
            }

            [disabled] {
                pointer-events: none;
                opacity: .3;
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
                content: "";
                pointer-events: none;
                background-color: rgba(255,0,0,.3) !important;
            }
            .label {
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: {{fontSize}};
                cursor: {{designMode ? 'pointer' : 'unset'}};
                padding: {{!designMode && layout?.hideLabel ? '0' : '0px 4px'}} !important;
                margin: {{!designMode && layout?.hideLabel ? '0' : '1px'}} !important;
                width: 100%;
                color: {{designMode && layout?.isGroup ? layout?.hideLabel ? 'red' : 'blue' : layout?.isHide ? 'red' : ''}};
            }
            [contenteditable] {
                outline: 0px solid transparent;
            }
        </style>
        <div class="vertical flex" style="overflow: hidden" @mousedown.stop.prev @pointerdown="onpointerdown" :draggable ~class="{'drag-to':layout?.dragTo, [layout?.dragTo]:layout?.dragTo}">
            <div ~if="designMode || !layout?.hideLabel" class="horizontal flex" style="align-items: center" ~style="{ marginLeft: layout?.isTabs || layout?.isGroup ? '' : iconSize + 'px'}">
                <oda-icon ~if="layout?.isTabs || layout?.isGroup" style="cursor: pointer; opacity: .3" :icon-size :icon="hasChildren?(layout?.$expanded?'icons:chevron-right:90':'icons:chevron-right'):''" @pointerdown.stop @tap.stop="expand()"></oda-icon>
                <div class="horizontal no-flex" style="align-items: center;">
                    <label class="label" :contenteditable="designMode" @input="setLabel" @blur="setLabel($event, blur)">{{layout._label || layout.label}}</label>
                    <oda-button id="settings" ~if="designMode && selection.has(layout)" icon="icons:settings" icon-size="16" @tap="showSettings" style="padding: 0; margin: 0"></oda-button>
                </div>
            </div>
            <div ~if="!layout?.isGroup" class="horizontal flex" style="align-items: center;">
                <oda-icon ~if="!layout?.isTabs" style="cursor: pointer; opacity: .3" :icon-size :icon="hasChildren?(layout?.$expanded?'icons:chevron-right:90':'icons:chevron-right'):''" @pointerdown.stop @tap.stop="expand()"></oda-icon>
                <div class="vertical flex" style="overflow: hidden;"  :disabled="designMode && !layout?.isTabs" 
                        ~class="{tabs:layout?.isTabs}" 
                        ~style="{alignItems: (width && !layout?.type)?'center':''}">
                    <div class="flex" ~is="layout?.$template || editTemplate" :layout ::width></div>
                </div>
            </div>
        </div>
        <div ~if="hasChildren && layout?.$expanded" ~is="layout?.$structure || structureTemplate" :layout class="flex structure" style="" ~style="{marginBottom: layout?.hideLabel ? 0 : '4px', marginLeft: layout?.hideLabel ? 0 : iconSize/2+'px', paddingLeft: layout?.hideLabel ? 0 : iconSize/2+'px'}"></div>
    `,
    fontSize: 'small',
    width: undefined,
    get hasChildren() { return this.layout?.items?.length },
    expand() {
        this.layout && (this.layout.$expanded = !this.layout.$expanded);
        if (this.designMode) {
            const action = { action: "expanded", props: { target: this.layout.id, value: this.layout.$expanded } };
            this.saveScript(this.layout, action);
            this.render();
        }
    },
    listeners: {
        'contextmenu': 'showSettings',
        'dragstart': 'ondragstart',
        'dragend': 'ondragend',
        'dragover': 'ondragover',
        'dragleave': 'ondragleave',
        'drop': 'ondragdrop',
    },
    async showSettings(e) {
        if (!this.designMode) return;
        e.preventDefault();
        e.stopPropagation();
        const parent = e.target.id === 'settings' ? e.target : undefined;
        await ODA.showDropdown('oda-layout-designer-settings', { layout: this.layout, lay: this }, { parent, title: e.target.layout?.label });
    },
    labelPos: 'top',
    layout: null,
    get draggable() {
        return this.layout && this.designMode && !this.layout.isVirtual ? 'true' : 'false';
    },
    setLabel(e, blur) {
        if (this.designMode) {
            const tst = /\n|\r/g.test(e.target.innerText);
            if (tst)
                e.target.innerText = '';
            else
                this.layout._label = e.target.innerText?.replace(/\n|\r/g, "") || this.layout.label;
            if (blur) {
                const action = { action: "setLabel", label: this.layout._label, props: { id: this.layout.id } };
                this.saveScript(this.layout, action);
            }
            this.render();
        }
    },
    onpointerdown(e) {
        if (e.ctrlKey || e.metaKey)
            this.selection ||= [];
        else
            this.selection = [];
        if (this.selection?.[0] && this.selection[0].root !== this.layout.root) return;
        this.selection.push(this.layout);
    },
    ondragstart(e) {
        e.stopPropagation();
        this.dragInfo.isMoveTab = false;
        this.dragInfo.dragItem = this.layout;
        e.dataTransfer.setDragImage((this.selection && this.selection.includes(this.dragInfo.dragItem) && this.selection.length) > 1 ? img3 : img, -20, 7);
    },
    ondragend(e) {
        this.clearDragTo();
    },
    ondragover(e) {
        e.stopPropagation();
        this.clearDragTo();
        if (this.dragInfo?.dragItem && !this.dragInfo.isMoveTab) {
            this.layout.dragTo = 'drag-to-error';
            if (this.dragInfo.dragItem.root !== this.layout.root || this.dragInfo.dragItem === this.layout) return;
            this.clearDragTo();
            e.preventDefault();
            let to = '',
                x = e.layerX,
                w = e.target.offsetWidth;
            x = (x - w / 2) / w * 2;
            let y = e.layerY,
                h = e.target.offsetHeight;
            y = (y - h / 2) / h * 2;
            if (Math.abs(x) > Math.abs(y))
                to = x < 0 ? 'left' : 'right';
            else
                to = y < 0 ? 'top' : 'bottom';
            this.dragInfo.to = to;
            this.layout.dragTo = 'drag-to-' + to;
            this.dragInfo.targetItem = this.layout;
        }
    },
    ondragleave(e) {
        this.clearDragTo();
    },
    ondragdrop(e) {
        e.stopPropagation();
        this.dragInfo._action = { id: getUUID(), action: 'move', props: { item: this.dragInfo.dragItem.id, target: this.dragInfo.targetItem.id, to: this.dragInfo.to } };
        this.layout.move(this.dragInfo);
        this.saveScript(this.layout, this.dragInfo._action);
        this.clearDragTo();
    },
    clearDragTo() {
        this.capture = this.layout.dragTo = '';
        let owner = this.layout.owner;
        while (owner) {
            owner.dragTo = '';
            owner.items?.forEach(i => i.dragTo = '');
            owner = owner.owner;
        }
        this.render();
    }
})

ODA({ is: 'oda-layout-designer-settings', imports: '@oda/icon',
    template: `
        <style>
            :host {
                @apply --vertical;
                background-color: white;
                border: 1px solid gray;
                margin: 2px;
                padding: 4px;
                min-width: 180px;
            }
            oda-icon {
                transform: scale(.8);
                padding: 0 4px 0 0;  
            }
            label {
                cursor: pointer;
                margin-right: auto;
            }
            .row {
                padding: 1px 0;
            }
            .row:hover {
                background: lightgray;
            }
            span {
                font-size: small;
                color: gray;
                border-bottom: 1px solid lightgray;
            }
        </style>

        <span>Layout</span>
        <div class="horizontal row" style="align-items: center" @tap="hideLayout(); render()">
            <oda-icon icon="maps:layers" :fill="layout.isHide ? 'red' : ''"></oda-icon>
            <label>{{layout.isHide ? 'unhide' : 'hide'}} layout</label>
        </div>
        <div class="horizontal row" style="align-items: center">
        <label>width</label>
            <input id="width" ::value="layout.width" @blur="setStyle">
        </div>
        <div class="horizontal row" style="align-items: center">
            <label>max-width</label>
            <input id="maxWidth" ::value="layout.maxWidth" @blur="setStyle">
        </div>
        <div class="horizontal row" style="align-items: center">
            <label>min-width</label>
            <input id="minWidth" ::value="layout.minWidth" @blur="setStyle">
        </div>
        <div class="horizontal row" style="align-items: center">
            <label>style</label>
            <input id="style" ::value="layout.style" @blur="setStyle">
        </div>

        <span ~if="layout.isGroup">Group</span>
        <div ~if="layout.isGroup" class="horizontal row" style="align-items: center" @tap="hideGroupLabel(); render()">
            <oda-icon icon="maps:layers" :fill="layout.hideLabel ? 'red' : ''"></oda-icon>
            <label>{{layout.hideLabel ? 'unhide' : 'hide'}} Group-label (Group-border)</label>
        </div>
        <div ~if="layout.isGroup" class="horizontal row" style="align-items: center" @tap="">
            <oda-icon icon="icons:delete"></oda-icon>
            <label>delete Group ...</label>
        </div>
        
        <span>Tabs</span>
        <div class="horizontal row" style="align-items: center" @tap="createTabs()">
            <oda-icon icon="icons:add"></oda-icon>
            <label>create tabs</label>
        </div>
        <div ~if="layout.isTabs" class="horizontal row" style="align-items: center" @tap="">
            <oda-icon icon="icons:delete"></oda-icon>
            <label>delete tabs ...</label>
        </div>
    `,
    layout: null,
    lay: null,
    createTabs() {
        const action = { tabsId: getUUID(), id: getUUID(), action: "createTabs", props: { target: this.layout.id, block: getUUID() } };
        this.layout.createTabs(action);
        this.lay.saveScript(this.layout, action);
    },
    hideLayout() {
        this.layout.isHide = !this.layout.isHide;
        const action = { action: "hideLayout", hideLayout: this.layout.isHide, props: { target: this.layout.id } };
        this.lay.saveScript(this.layout, action);
    },
    hideGroupLabel() {
        this.layout.hideLabel = !this.layout.hideLabel;
        const action = { action: "hideGroupLabel", hideGroupLabel: this.layout.hideLabel, props: { target: this.layout.id } };
        this.lay.saveScript(this.layout, action);
    },
    setStyle(e) {
        this.render();
    }
})

CLASS({ is: 'Layout',
    ctor(data, key = 'items', owner, root, order) {
        this.data = data || {};
        // this.saveKey = data.saveKey || data.$class?.id || undefined;
        this.key = key;
        this.owner = owner;
        this.order = this._order = order || 0;
        this._root = root;
    },
    owner: undefined,
    type: undefined,
    $expanded: false,
    get root() { return this._root || this.owner || this },
    set root(v) { this._root = v },
    get items() {
        const items = this.data?.[this.key];
        if (items?.then) {
            return items.then(items => {
                this.items = items.map((i, idx) => new Layout(i, this.key, this, this, idx + 1))
            })
        }
        return this.items = items?.map((i, idx) => new Layout(i, this.key, this, this, idx + 1))
    },
    get id() {
        return this.data?.id || this.data?.name || 'root';
    },
    get name() {
        return this.data?.name || this.id;
    },
    get label() {
        return this.data?.label || this.name;
    },
    get $template() {
        return this.isTabs ? 'oda-layout-designer-tabs' : '';
    },
    get $structure() {
        return this.isTabs ? 'oda-layout-designer-tabs-structure' : '';
    },
    get isTabs() {
        return this.type === "tabs";
    },
    get isGroup() {
        return this.type === "vGroup" || this.type === "hGroup";
    },
    async createTabs(action) {
        const item = action ? await this.find(action.props.target) : this;
        if (!item) return;
        const myIdx = item.owner.items.indexOf(item);
        const tabs = new Layout({ id: action.tabsId, label: `Tabs-label` }, item.key, item.owner, item.root);
        const tab = new Layout({ id: action.id, label: `Tab 1` }, item.key, tabs, item.root);
        tabs.type = 'tabs';
        tabs.width = 0;
        tabs.items = [tab];
        tabs.$expanded = true;
        tabs.$focused = tab;
        tabs.order = item.order;
        tabs._order = item._order;
        tab.items = [item];
        tab.order = tab._order = 0;
        tab.type = 'tab';
        tab.blockID = action.props.block;
        item.owner.items.splice(myIdx, 1, tabs);
        item.owner = tab;
    },
    async addTab(action, layout) {
        const tabs = layout || await this.find(action.props.tabs);
        if (!tabs) return;
        const tab = new Layout({ id: action.id, label: `Tab ${tabs.items.length + 1}` }, tabs.key, tabs, tabs.root);
        tab.type = 'tab';
        tabs.items.push(tab)
        tabs.$focused = tab;
        const block = new Layout({ label: ` ` }, tabs.key, tab, tabs.root);
        block.isVirtual = true;
        tab.blockID = block.id = action.props.block;
        tab.items = [block];
        tab.order = tab._order = tabs.items.length
    },
    async removeTab(action, layout) {
        const tabs = layout ? this : await this.find(action.props.tabs);
        const tab = layout || await this.find(action.props.tab);
        if (!tabs || !tab) return;
        tab.root.items.splice(tab.owner.items.indexOf(tabs), 0, ...tab.items.filter(i => {
            i.owner = i.root;
            i._order = i.order;
            if (!i.isVirtual) return i;
        }));
        tabs.items.splice(tabs.items.indexOf(tab), 1);
        if (tabs.items.length === 0) {
            tabs.owner.items.splice(tabs.owner.items.indexOf(tabs), 1);
        }
    },
    async selectTab(action, layout) {
        const tabs = layout ? this : await this.find(action.props.tabs);
        const tab = layout || await this.find(action.props.tab);
        if (!tabs || !tab) return;
        tabs.$focused = tab;
    },
    async setLabel(action, layout) {
        // console.log(action.props.id)
        const lay = layout || await this.find(action.props.id);
        if (!lay) return;
        lay._label = action.label;
    },
    async hideLayout(action, layout) {
        const item = layout || await this.find(action.props.target);
        if (!item) return;
        item.isHide = action.hideLayout;
    },
    async hideGroupLabel(action, layout) {
        const item = layout || await this.find(action.props.target);
        if (!item) return;
        item.hideLabel = action.hideGroupLabel;
    },
    async move(dragInfo) {
        const action = dragInfo?._action || dragInfo;
        const dragItem = dragInfo.dragItem || await this.find(action.props.item);
        const targItem = dragInfo.targetItem || await this.find(action.props.target);
        await dragItem.items;
        await targItem.items;
        if (!dragItem || !targItem) return;
        if (targItem.owner.type === 'tabs' || action.props.to === 'left' || action.props.to === 'right') {
            if (targItem.owner.type !== 'hGroup' && (targItem.items?.length || dragItem.items?.length)) {
                this._createGroup(action, dragItem, targItem, 'hGroup');
            } else if (!targItem.owner.type || targItem.owner.type === 'tabs' || targItem.owner.type === 'hGroup' ) {
                this._makeMove(action, dragItem, targItem, action.props.to);
            } else {
                this._createGroup(action, dragItem, targItem, 'hGroup');
            }
        } else {
            if (targItem.owner.type === 'vGroup') {
                this._makeMove(action, dragItem, targItem, action.props.to);
            } else {
                this._createGroup(action, dragItem, targItem, 'vGroup');
            }
        }
    },
    _makeMove(action, dragItem, targItem, moveTo) {
        let idxTarg = targItem._order;
        dragItem._order = idxTarg = action.props.to === moveTo ? idxTarg - .1 : idxTarg + .1;
        if (targItem.owner !== targItem.root || dragItem.owner !== dragItem.root) {
            const idxDrag = dragItem.owner.items.indexOf(dragItem);
            const drag = dragItem.owner.items.splice(idxDrag, 1)[0];
            if (dragItem.owner.type === 'tab' && !dragItem.owner.items.length) {
                const block = new Layout({ label: ` ` }, dragItem.key, dragItem.owner, dragItem.root);
                block.isVirtual = true;
                block.id = dragItem.blockID;
                dragItem.owner.items = [block];
            }
            targItem.owner.items.splice(idxTarg, 0, drag);
            drag.owner = targItem.owner;
        }
        targItem.owner.items.sort((a, b) => a._order - b._order).map((i, idx) => {
            i._order = idx - .1 <= idxTarg ? idx : idx + 1;
        });
        if (targItem.isVirtual) {
            idxTarg = targItem.owner.items.indexOf(targItem);
            targItem.owner.items.splice(idxTarg, 1);
        }
    },
    _createGroup(action, dragItem, targItem, groupType) {
        const group = new Layout({ id: action.id || getUUID(), label: action.label || groupType + `-label` }, targItem.key, targItem.owner, targItem.root);
        const idxTarget = targItem.owner.items.indexOf(targItem);
        const target = targItem.owner.items.splice(idxTarget, 1, group)[0];
        const idxDrag = dragItem.owner.items.indexOf(dragItem);
        const drag = dragItem.owner.items.splice(idxDrag, 1)[0];
        drag.owner = target.owner = group;
        group.$expanded = true;
        group._order = target._order;
        group.type = groupType;
        group.items = [drag, target];
    },
    async expanded(action) {
        const item = await this.find(action?.props?.target);
        if (item)
            item.$expanded = action.props.value;
    },
    async execute(actions) {
        if (!actions || !Array.isArray(actions)) return;
        for (const i of actions)
            await this[i.action]?.(i);
    },
    async find(id, item = this.root) {
        let items = await item.items;
        items = item.items;
        if (!items?.length) return;
        return items.reduce(async (res, i) => {
            if ((i.id + '') === (id + '')) res = i;
            return await res || this.find(id, i);
        }, undefined);
    }
})

const getUUID = function b(a) { return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b) };
const img = new Image();
img.src = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAQCAYAAABQrvyxAAAACXBIWXMAAAsSAAALEgHS3X78AAAAa0lEQVRIiWPU6v91RFv4jwIv+78/DEMIfP7JxHL1LcsDFpDjJ7p8kB5KjoeB/D0CDExDLeSRAcjtTIPHOeSBUQ8MNBj1wECDUQ8MNBj1wECDUQ8MNGACteqGquNBbgc3SUGtuiHZnH7L8gAAtichl6hs6rYAAAAASUVORK5CYII=`;
const img3 = new Image();
img3.src = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAAUCAYAAADC1B7dAAAACXBIWXMAAAsSAAALEgHS3X78AAAA4klEQVRYhWPU6v91RFv4jwIv+78/DEMIfP7JxHL1LcuDqwWsNsiuZgF5ZqLLB+mh5BkYyN8jwMDAwIoixjTUYgYZ8LL/Ew9b/P2J9oTfR2DCTIPCZWQCQfb/LKDUBUplMBNYhponsAFYTIHy1JCOIRhAjqlh4SEYAJUHw8pDDEO9UMAGRj002MGohwY7GH4eArVaB4E7yAIffzFiaAM3wUGtVlDzAVTjDgmfQD3z6SdmAmOB9CdYGUBtoRbbodmNQI4peIwMl5hi/P//P4oCUEwN4Q7fU4yYQIqpodclf8vyAAC+a17T0iNSKwAAAABJRU5ErkJggg==`;