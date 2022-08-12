ODA({ is: 'oda-layout-designer', imports: '@tools/containers',
    template: /*html*/`
        <style>
            :host {
                overflow-x: hidden;
                overflow-y: auto;
                @apply --vertical;
            }
        </style>
        <oda-layout-designer-structure class="flex content" :is-root="true" :layout style="padding-top: 16px;"></oda-layout-designer-structure>
        <div class="flex"></div>
    `,
    data: null,
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
        keys: '',
        iconSize: 24,
        scriptsString: {
            default: '',
            save: true
        }
    },
    get layout() {
        return this.data && new this.layoutCtor(this.data, this.keys);
    },
    get layoutCtor() {
        return Layout;
    },
    editTemplate: 'span',
    structureTemplate: 'oda-layout-designer-structure',
    lays: null,
    scripts: null,
    needSave: false,
    async makeScript(layout, action) {
        this.scripts ||= new Map();
        const actions = this.scripts.get(layout.root._id) || [];
        actions.push(action);
        this.scripts.set(layout.root._id, actions);
        this.lays.add(layout._id);
        this.needSave = true;
    },
    saveScripts() {
        let obj = {};
        this.scripts.forEach((value, id) => {
            obj[id] = value;
        })
        this.scriptsString = JSON.stringify(obj);
        this.needSave = false;
    },
    clearSavedScripts() {
        this.scripts = null;
        this.lays.forEach(i => {
            i.str?.actions && (i.str.actions = []);
            i.root?.str && (i.root.str.actions = []);
        })
        this.scriptsString = '';
        this.lays = new Set();
        this.selection = [];
        this.hiddenLayouts = [];
        this.layout = undefined;
        this.needSave = true;
    },
    isLoadScript: false,
    loadScripts() {
        if (this.scriptsString) {
            return JSON.parse(this.scriptsString);
        }
    }
})

ODA({ is: 'oda-layout-designer-structure',
    template: /*html*/`
        <style>
            :host {
                position: relative;
                align-items: {{layout?.align ==='vertical' ? 'normal' : 'flex-end'}};
                @apply --horizontal;
                @apply --no-flex;
                overflow: visible;
                flex-wrap: wrap;
                justify-content: space-around;
                align-content: {{layout?.isBlock ? '' : 'flex-start'}};
                flex-direction: {{layout?.align === 'vertical' ? 'column' : 'row'}};
            }
        </style>
        <div ~if="!hiddenLayouts.includes(next)" @tap.stop="_select" ~is="next.isBlock?'oda-layout-designer-container':'oda-layout-designer-container'" ~for="next in layout?.items" :layout="next" :icon-size :selected="designMode && selection.has(next)" ~style="{order: next._order ?? 'unset'}"></div>
    `,
    _select(e) {
        if (!this.designMode) return;
        if (e.sourceEvent.ctrlKey) {
            const el = this.selection[0];
            if (el && !this.layout.items.includes(el)) return;
            if (this.selection.includes(e.target.layout))
                this.selection.remove(e.target.layout);
            else
                this.selection.add(e.target.layout);
        }
        else
            this.selection.splice(0, this.selection.length, e.target.layout)
    },
    props: {
        layout: {
            default: null,
            async set(n) {
                if (n) {
                    n.isRoot = this.isRoot;
                    n.str = this;
                    this.lays ||= new Set();
                    this.scripts ||= new Map();
                    let _scripts = {};
                    if (!this.isLoadScript) {
                        _scripts = await this.loadScripts();
                        if (_scripts) {
                            this.isLoadScript = true;
                            Object.keys(_scripts || {}).forEach(key => {
                                let actions = this.scripts.get(key) || [];
                                actions = [...actions, ..._scripts[key]];
                                this.scripts.set(key, actions);
                            })
                        }
                    }
                    if (!this.lays.has(this.layout._id)) {
                        let actions = this.scripts.get(this.layout._id)
                        this.layout.execute(actions).then(res => {
                            this.lays.add(this.layout._id); // for single execution - to remove looping
                        });
                    }
                }
            }
        }
    },
    isRoot: false
})

ODA({ is: 'oda-layout-designer-pages',
    template: /*html*/`
        <style>
            :host{
                @apply --flex;
            }
        </style>
        <oda-layout-designer-structure class="content" :layout="layout?.$focused"></oda-layout-designer-structure>
    `
})

ODA({ is: 'oda-layout-designer-tabs', imports: '@oda/button',
    template: /*html*/`
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                margin: 4px 0px;
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
                padding: 0px;
            }
            [contenteditable] {
                outline: 0px solid transparent;
            }
        </style>
        <div class="horizontal flex header" style="flex-wrap: wrap;" ~style="{border: layout?.items?.length > 1 ? '1px solid gray' : ''}">
           <div ~if="!hiddenLayouts.includes(item)"  @mousedown.stop.prev="selectTab(item)" ~for="layout?.items" class="horizontal" style="align-items: start" ~style="{'border-right': layout?.items?.length > 1 ? '1px solid gray' : '', 'box-shadow': hoverItem === item ? 'inset 4px 0 0 0 var(--success-color)' : ''}"
                    :draggable :focused="item === layout.$focused && layout?.items?.length > 1" @dragstart.stop="ondragstart($event, item)" @dragover.stop="ondragover($event, item)"
                    @dragleave.stop="ondragleave" @drop.stop="ondrop($event, item)" @contextmenu="showContextMenu($event, item)">
                <label class="tab" :contenteditable="designMode" @blur="tabRename($event, item)" @tap="selectLabel" ~html="item.title"></label>
                <div class="vertical">
                    <oda-button ~if="designMode" icon="icons:close" @tap.stop="removeTab($event, item)" :icon-size="iconSize"></oda-button>
                </div>
            </div>
            <oda-button class="btn" @tap.stop="addTab" ~if="designMode" icon="icons:add" title="add tab" :icon-size="iconSize"></oda-button>
            <oda-button @tap.stop="selectTab(layout.$focused, true)" ~if="designMode && layout?.items?.length > 1 && layout.$focused" icon="icons:pin" title="pin current tab" :icon-size="iconSize / 1.2"></oda-button>
        </div>
    `,
    props: {
        fontSize: 'small'
    },
    get draggable() {
        return this.layout && this.designMode ? 'true' : 'false';
    },
    hoverItem: undefined,
    addTab() {
        const tabID = getUUID();
        const blockID = getUUID();
        const action = { id: tabID, action: "addTab", props: { tabs: this.layout.id, tab: tabID, block: blockID } };
        this.layout.addTab(action, this.layout);
        this.makeScript(this.layout, action);
    },
    removeTab(e, item) {
        const action = { action: "removeTab", props: { tabs: this.layout.id, tab: item.id } };
        this.layout.removeTab(action, item);
        this.makeScript(this.layout, action);
    },
    selectTab(item, force) {
        this.layout.$expanded = true;
        this.layout.$focused = item;
        if (this.designMode && force) {
            const action = { action: "selectTab", props: { tabs: this.layout.id, tab: item.id } };
            this.makeScript(this.layout, action);
        }
        this.render();
    },
    ondragstart(e, item) {
        if (!this.designMode) return;
        e.stopPropagation();
        this.dragInfo.dragItem = item;
        this.dragInfo.isMoveTab = true;
    },
    ondragover(e, item) {
        if (!this.designMode) return;
        e.stopPropagation();
        if (this.dragInfo.dragItem.root !== item.root || !this.dragInfo.isMoveTab) return;
        e.preventDefault();
        this.hoverItem = item;
    },
    ondragleave(e) {
        if (!this.designMode) return;
        this.hoverItem = undefined;
    },
    ondrop(e, item) {
        if (!this.designMode) return;
        e.stopPropagation();
        this.dragInfo.targetItem = item;
        this.dragInfo._action = { action: 'move', props: { item: this.dragInfo.dragItem.id, target: this.dragInfo.targetItem.id, to: 'left' } };
        this.layout.move(this.dragInfo);
        this.makeScript(this.layout, this.dragInfo._action);
        this.hoverItem = undefined;
        this.dragInfo.isMoveTab = false;
    },
    tabRename(e, item) {
        const label = e.target?.innerHTML || e;
        if (this.designMode && (!item.title || item.title !== label)) {
            item.title = label;
            const action = { action: "setLabel", label, props: { id: item.id } };
            this.makeScript(this.layout, action)
        }
    },
    async showContextMenu(e, tab) {
        if (!this.designMode || !tab) return;
        e.preventDefault();
        e.stopPropagation();
        await ODA.showDropdown('oda-layout-designer-contextMenu', { layout: tab, lay: this, isTab: true }, { title: tab.label });
    },
})

ODA({ is: 'oda-layout-designer-container', imports: '@oda/icon, @oda/menu, @tools/containers',
    template: /*html*/`
        <style>
            :host {
                /*align-self: end;*/
                /* padding-right: 4px; */
                box-sizing: border-box;
                @apply --vertical;
                overflow: hidden;
                @apply --flex;
                /* flex-grow: {{layout?.noFlex?'1':'100'}}; */
                flex: {{width ? '0 0 auto':'1000000000000000000000000000000 1 auto'}};
                /* flex-basis: auto; */
                cursor: {{designMode ? 'pointer' : ''}};
                position: relative;
                min-height: {{iconSize + 4}}px;
                border: {{designMode ? '1px dashed lightblue' : '1px solid transparent'}};
                /*min-width: {{layout?.minWidth ? (layout?.minWidth+'px' : isChildren ? '100%' : '32px')}};*/
                /*max-width: {{layout.maxWidth ? layout.maxWidth : isChildren ? '100%' : 'unset'}};*/
                width: {{layout.width ? layout.width : 'unset'}};
            }
            :host([is-group]) {
                @apply --border;
                @apply --header;
                /* @apply --shadow; */
                padding: 4px;
                margin: 2px;
            }
            :host([is-children]) .str {
                border-left: 1px dashed var(--border-color, silver);
                margin-left: {{iconSize / 2}}px;
                padding-left: {{iconSize / 2 - 1}}px;
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
                z-index: 1;
            }
            .drag-to-error:after {
                content: "";
                pointer-events: none;
                background-color: rgba(255,0,0,.3) !important;
            }
            .lbl {
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: {{fontSize}};
                cursor: {{designMode ? 'pointer' : 'unset'}};
            }
            [contenteditable] {
                outline: 0px solid transparent;
            }
        </style>
        <div class="vertical flex" style="overflow: hidden;" :draggable ~class="{'drag-to':layout?.dragTo, [layout?.dragTo]:layout?.dragTo}" ~style="layout?.style || ''">
            <div class="horizontal flex">
                <label class="lbl" ~if="layout?.title && !layout?.isBlock" :contenteditable="designMode" @blur="setLabel" @tap="selectLabel" ~html="layout?.title"></label>
                <div class="flex"></div>
                <!-- <oda-icon ~if="designMode && selection.has(layout)" icon="editor:vertical-align-center:90" icon-size="16" @track="resizeTrack"></oda-icon> -->
            </div>
            <div ~if="!layout?.isBlock" class="horizontal flex" style="align-items: center;">
                <oda-icon ~if="hasChildren" style="cursor: pointer" :icon-size :icon="layout?.$expanded?'icons:chevron-right:90':'icons:chevron-right'" @pointerdown.stop @tap.stop="expand()"></oda-icon>
                <div class="vertical flex" style="overflow: hidden;" :disabled="designMode && !isGroup"
                        ~style="{alignItems: (width && !layout?.type)?'center':''}">
                    <div class="flex" ~is="layout?.$template || (layout?.isVirtual ? 'span' : editorTemplate)" :layout ::width></div>
                </div>
            </div>
        </div>
        <div class="str" ~if="showStructure" ~is="layout?.$structure || structureTemplate" :layout style="marginBottom: 4px"></div>
    `,
    fontSize: 'small',
    width: undefined,
    get hasChildren() { return this.layout?.items?.length },
    expand() {
        this.layout && (this.layout.$expanded = !this.layout.$expanded);
        if (this.designMode) {
            const action = { action: "expanded", props: { target: this.layout.id, value: this.layout.$expanded } };
            this.makeScript(this.layout, action);
            this.render();
        }
    },
    props: {
        label: {
            default: {
                color: 'black',
                align: 'top',
                hidden: false
            },
            save: true
        },
        isGroup: {
            type: Boolean,
            get() {
                return this.layout?.isGroup;
            },
            reflectToAttribute: true
        },
        isChildren: {
            type: Boolean,
            get() {
                return this.hasChildren && (!this.layout?.isGroup && !this.layout?.isBlock);
            },
            reflectToAttribute: true
        }
    },
    get showStructure(){
        return (this.hasChildren || this.layout?.showStructure) && (this.layout?.$structure || this.structureTemplate) && this.layout?.$expanded;
    },
    listeners: {
        'contextmenu': 'showContextMenu',
        'dragstart': 'ondragstart',
        'dragend': 'ondragend',
        'dragover': 'ondragover',
        'dragleave': 'ondragleave',
        'drop': 'ondragdrop',
    },
    async showContextMenu(e) {
        if (!this.designMode) return;
        e.preventDefault();
        e.stopPropagation();
        const parent = e.target.id === 'settings' ? e.target : undefined;
        await ODA.showDropdown('oda-layout-designer-contextMenu', { layout: this.layout, lay: this }, { parent, title: e.target.layout?.label });
    },
    set layout(v) {
        this.layout.cnt = this;
    },
    get draggable() {
        return this.layout && this.designMode && !this.layout.isVirtual ? 'true' : 'false';
    },
    selectLabel() {
        document.execCommand('selectAll', false, null);
    },
    setLabel(e) {
        const label = e.target?.innerHTML || e;
        if (!this.designMode || this.layout.title?.toString() === label) return
        this.layout.title = label;
        const action = { action: "setLabel", label, props: { id: this.layout.id } };
        this.makeScript(this.layout, action);

    },
    ondragstart(e) {
        if (!this.designMode) return;
        e.stopPropagation();
        this.dragInfo.isMoveTab = false;
        this.dragInfo.dragItem = this.layout;
        e.dataTransfer.setDragImage((this.selection && this.selection.includes(this.dragInfo.dragItem) && this.selection.length) > 1 ? img3 : img, -20, 7);
    },
    ondragend(e) {
        if (!this.designMode) return;
        this.clearDragTo();
    },
    ondragover(e) {
        if (!this.designMode) return;
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
        if (!this.designMode) return;
        this.clearDragTo();
    },
    ondragdrop(e) {
        if (!this.designMode) return;
        e.stopPropagation();
        this.dragInfo._action = { id: getUUID(), action: 'move', props: { item: this.dragInfo.dragItem.id, target: this.dragInfo.targetItem.id, to: this.dragInfo.to } };
        this.layout.move(this.dragInfo);
        this.makeScript(this.layout, this.dragInfo._action);
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
    },
    createGroup() {
        const action = { tabsId: getUUID(), id: getUUID(), action: "createGroup", props: { target: this.layout.id, block: getUUID() } };
        this.layout.createGroup(action);
        this.makeScript(this.layout, action);
    },
    removeTab(tab) {
        const action = { action: "removeTab", props: { tabs: this.layout.id, tab: tab.id } };
        this.layout.removeTab(action, tab);
        this.makeScript(this.layout, action);
    },
    deleteGroup(layout = this.layout) {
        if (layout.items?.[0]?.isTab1) {
            this.removeTab(layout.items[0]);
        }
        const action = { action: "deleteGroup", props: { target: this.layout.id } };
        layout.deleteGroup(action, layout);
        this.makeScript(layout, action);
    },
    // resizeTrack(e) {
    //     switch(e.detail.state){
    //         case 'start':{
    //             this._prevX = e.sourceEvent.clientX;
    //             const rect = this.getBoundingClientRect();
    //             this._prevWidth = rect.width;
    //         } break;
    //         case 'track':{
    //             let w = this._prevWidth + e.sourceEvent.clientX - this._prevX;
    //             this.style.minWidth = '100%';
    //             w = (w * 100) / this.getBoundingClientRect().width;
    //             this.async(() => {
    //                 this.layout.minWidth = '';
    //                 this.style.minWidth = '0px';
    //                 this.style.maxWidth = `${w}%`;
    //                 this.style.width = `${w}%`;
    //             })
    //         } break;
    //         case 'end': {
    //             const action = { action: "setWidth", props: { target: this.layout.id, width: this.style.width } };
    //             this.makeScript(this.layout, action);
    //         } break;
    //     }
    // }
})

ODA({ is: 'oda-layout-designer-contextMenu', imports: '@oda/icon, @oda/pell-editor, @oda-menu', extends: 'oda-menu',
    attached() {
        let items = [
            { label: 'Group', group: true },
            { icon: 'av:library-add', label: 'create group', tap: () => { this._createGroup() } }
        ]
        if (this.layout.owner?.isBlock) items.push({ icon: 'icons:delete', label: 'ungroup layout', tap: () => { this._deleteGroup() } });
        if (!this.layout.title) items.push({ icon: 'material:format-text', label: 'restore label', tap: () => { this._restoreLabel() } });
        items.push(
            { label: 'Label', group: true },
            { icon: 'image:edit', label: 'edit ' + (this.isTab ? 'tab ' : '') + 'label', tap: () => { this._editLabel() } },
            { label: 'Layout', group: true },
            { icon: 'icons:aspect-ratio', label: (this.layout.minWidth === '100%' ? 'unset' : 'set') + ' width 100%', tap: () => { this._setWidth() } },
            { icon: 'icons:close', label: 'hide layout', tap: () => { this._hideLayout() } }
        )
        if (this.lay?.hiddenLayouts.length) {
            items.push(
                { label: 'unhide Layouts', group: true },
                { icon: 'icons:more-horiz', label: 'unhide All layouts', tap: () => { this._unhideAllLayout(this.layout) } }
            )
            this.lay.hiddenLayouts.forEach(i => items.push({ icon: 'image:remove-red-eye', label: 'unhide ' + i.label, tap: () => { this._unhideLayout(i) } }));
        }
        this.items = items;
    },
    layout: null,
    lay: null,
    isTab: false,
    _createGroup() {
        this.lay.createGroup();
    },
    _deleteGroup() {
        if (this.layout.owner?.isBlock) {
            this.lay.deleteGroup(this.layout.owner);
        }
        this.lay.deleteGroup();
    },
    _restoreLabel() {
        this.layout.title = this.layout.label || 'label';
    },
    async _editLabel() {
        const res = await ODA.showDialog('oda-pell-editor', { src: this.layout.title }, { title: this.layout.label });
        if (res !== undefined) {
            this.layout.title = res.editor?.content?.innerHTML || '';
            if (this.isTab) {
                this.lay.tabRename(this.layout.title, this.layout)
            } else {
                this.lay.setLabel(this.layout.title)
            }
        }
    },
    _hideLayout() {
        this.lay.hiddenLayouts.add(this.layout);
        const action = { action: "hideLayout", hideLayout: true, props: { target: this.layout.id } };
        this.lay.makeScript(this.layout, action);
    },
    _unhideLayout(item) {
        this.lay.hiddenLayouts.remove(item);
        const action = { action: "hideLayout", hideLayout: false, props: { target: item.id } };
        this.lay.makeScript(this.layout, action);
    },
    _unhideAllLayout() {
        this.lay.hiddenLayouts = [];
        const action = { action: "unhideAllLayout", props: { target: this.layout.id } };
        this.lay.makeScript(this.layout, action);
    },
    _setWidth() {
        this.lay.style.width = this.lay.style.maxWidth = this.layout.minWidth = this.layout.minWidth === '100%' ? '' : '100%';
        this.lay.render();
        const action = { action: "setMinWidth", props: { target: this.layout.id, width: this.layout.minWidth } };
        this.lay.makeScript(this.layout, action);
    }
})

export const Layout = CLASS({
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
                this.items = items.map((i, idx) => new this.constructor(i, this.key, this, this, idx + 1))
            })
        }
        return this.items = items?.map((i, idx) => new this.constructor(i, this.key, this, this, idx + 1))
    },
    get title() {
        return this._label || this.label;
    },
    set title(n) {
        this._label = n;
    },
    get _id() {
        return this.isRoot ? 'root' : '' + this.id;
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
        return this.isGroup ? 'oda-layout-designer-tabs' : '';
    },
    get $structure() {
        return this.isGroup ? 'oda-layout-designer-pages' : '';
    },
    get isGroup() {
        return this.type === "group";
    },
    get isBlock() {
        return this.type === "block";
    },
    async createGroup(action) {
        const item = action ? await this.find(action.props.target) : this;
        if (!item) return;
        const myIdx = item.owner.items.indexOf(item);
        const tabs = new this.constructor({ id: action.tabsId, label: `Group-label` }, item.key, item.owner, item.root);
        const tab = new this.constructor({ id: action.id, label: `Label` }, item.key, tabs, item.root);
        tabs.type = 'group';
        tabs.width = 0;
        tabs.items = [tab];
        tabs.$expanded = true;
        tabs.$focused = tab;
        tabs.order = item.order;
        tabs._order = item._order;
        tab.$expanded = true;
        tab.items = [item];
        tab.order = tab._order = 0;
        tab.type = 'tab';
        tab.isTab1 = true;
        tab.blockID = action.props.block;
        item.owner.items.splice(myIdx, 1, tabs);
        item.owner = tab;
    },
    async addTab(action, layout) {
        let tabs = layout || await this.find(action.props.tabs);
        if (!tabs) return;
        const tab = new this.constructor({ id: action.id, label: `Tab ${tabs.items.length + 1}` }, tabs.key, tabs, tabs.root);
        tab.type = 'tab';
        tabs.items.push(tab)
        tabs.$focused = tab;
        const block = new this.constructor({ label: ` ` }, tabs.key, tab, tabs.root);
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
        const lay = layout || await this.find(action.props.id);
        if (!lay) return;
        lay.title = action.label;
    },
    async deleteGroup(action, layout) {
        const group = layout || await this.find(action.props.target);
        if (!group) return;
        const idx = group.owner.items.indexOf(group);
        if (group.items?.length) {
            group.items.forEach(i => {
                i.owner = group.owner;
                i._order = i.order;
            })
            group.owner.items.splice(idx, 1, ...group.items);
        }
    },
    async move(dragInfo) {
        const action = dragInfo?._action || dragInfo;
        const dragItem = dragInfo.dragItem || await this.find(action.props.item);
        const targItem = dragInfo.targetItem || await this.find(action.props.target);
        if (!dragItem || !targItem) return;
        await dragItem.items;
        await targItem.items;
        if (action.props.to === 'left' || action.props.to === 'right') {
            if (targItem.owner.align === 'vertical') {
                this._createBlock(action, dragItem, targItem, 'horizontal');
            } else {
                this._makeMove(action, dragItem, targItem);
            }
        } else {
            if (targItem.owner.align === 'vertical') {
                this._makeMove(action, dragItem, targItem);
            } else {
                this._createBlock(action, dragItem, targItem, 'vertical');
            }
        }
    },
    _makeMove(action, dragItem, targItem) {
        const moveTo = action.props.to;
        let idxTarg = targItem._order;
        dragItem._order = idxTarg = (moveTo === 'left' || moveTo === 'top') ? idxTarg - .1 : idxTarg + .1;
        if (targItem.owner !== targItem.root || dragItem.owner !== dragItem.root) {
            const idxDrag = dragItem.owner.items.indexOf(dragItem);
            const drag = dragItem.owner.items.splice(idxDrag, 1)[0];
            if (dragItem.owner.type === 'tab' && !dragItem.owner.items.length) {
                const block = new this.constructor({ label: ` ` }, dragItem.key, dragItem.owner, dragItem.root);
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
    _createBlock(action, dragItem, targItem, align = 'horizontal') {
        const moveTo = action.props.to;
        const block = new this.constructor({ id: action.id || getUUID() }, targItem.key, targItem.owner, targItem.root);
        let idxTarg = targItem.owner.items.indexOf(targItem);
        const target = targItem.owner.items.splice(idxTarg, 1, block)[0];
        const idxDrag = dragItem.owner.items.indexOf(dragItem);
        const drag = dragItem.owner.items.splice(idxDrag, 1)[0];
        drag.owner = target.owner = block;
        block.$expanded = true;
        block.order = target.order;
        block._order = target._order;
        block.type = 'block';
        block.align = align
        block.items = [drag, target];
        if (moveTo === 'left' || moveTo === 'top') {
            drag._order = 0;
            target._order = 1;
        } else {
            drag._order = 1;
            target._order = 0;
        }
        if (targItem.isVirtual) {
            idxTarg = targItem.owner.items.indexOf(targItem);
            targItem.owner.items.splice(idxTarg, 1);
        }
    },
    async expanded(action) {
        const item = await this.find(action?.props?.target);
        if (item)
            item.$expanded = action.props.value;
    },
    async hideLayout(action, layout) {
        const item = layout || await this.find(action.props.target);
        if (!item) return;
        const hidden = this.str?.hiddenLayouts || this.cnt?.hiddenLayouts;
        if (action.hideLayout) hidden.add(item);
        else hidden.remove(item);
    },
    unhideAllLayout() {
        if (this.str) this.str.hiddenLayouts = [];
        if (this.cnt) this.cnt.hiddenLayouts = [];
    },
    async setMinWidth(action, layout) {
        const item = layout || await this.find(action.props.target);
        if (!item) return;
        item.minWidth = action.props.width;
        this.async(() => {
            item.cnt.style.minWidth = item.cnt.style.width = item.cnt.style.maxWidth = action.props.width;
        }, 300)
    },
    async setWidth(action, layout) {
        const item = layout || await this.find(action.props.target);
        if (!item) return;
        this.async(() => {
            item.minWidth = '';
            item.cnt.style.minWidth = '0px';
            item.cnt.style.width = item.cnt.style.maxWidth = action.props.width;
        }, 300)
    },
    async execute(actions) {
        if (!actions || !Array.isArray(actions)) return;
        for (const i of actions)
            await this[i.action]?.(i);
    },
    async find(id, item = this.root) {
        if (item.id === id) return item;
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
