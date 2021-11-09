// import '../app-layout/app-layout.js';
// import '../../buttons/button/button.js';
import '../../menus/menu/menu.js';
import '../tabs/tabs.js';

ODA({
    is: 'oda-layout-designer',
    imports: '@oda/app-layout, @tools/property-grid',
    extends: "oda-app-layout",
    template: /*html*/`
        <oda-button slot="top-right" icon="image:tune:90" allow-toggle ::toggled="designMode" title="Design mode"></oda-button>
        <div :slot="designMode?'left-panel':'?'" style="overflow:auto">
            <oda-layout-toolbar class="set-bar" :layout style="border-bottom:1px solid gray;padding:2px;position:sticky;z-index:2;top:0;background:whitesmoke"></oda-layout-toolbar>
            <oda-layout-tree ref="tree" :data-set="layout?.items" :focused-row="focused" ::selection></oda-layout-tree>
        </div>
        <oda-layout-structure ~style="{padding: \`$\{iconSize/2\}px $\{iconSize/2\}px $\{iconSize/2\}px $\{iconSize/4\}px\`}" ref="struct" slot="main" :layout :selection style="overflow: auto;"></oda-layout-structure>
        <oda-property-grid ~if="designMode" :component="focused" :slot="designMode?'right-panel':'?'" expert-mode></oda-property-grid>
    `,
    props: {
        item: Object,
        layout: {
            type: Object,
            freeze: true
        },
        listKey: 'items',
        iconSize: {
            default: 24,
            shared: true
        },
        selection: {
            type: Array,
            freeze: true
        },
        focused: null,
        designMode: {
            default: false,
            set(n) {
                if (this.layout) this.layout.bs.designMode = n;
            }
        },
        layoutStorage: {
            type: Object,
            get() {
                return layoutStorage;
            }
        }
    },
    observers: [
        '_initLayout(item, listKey)'
    ],
    _initLayout(item, listKey) {
        this.uuid = this.item.id = this.item.id || this.id || getUUID();
        this.layout = new LayoutItem(item, listKey, undefined, this.uuid, this.layoutStorage);
        this.layout.$root = this.layout;
        baseItem._bus[this.uuid] = {
            fileName: 'oda-layout-designer-actions-' + this.uuid, enableSave: false,
            designMode: false, dragInfo: {}, selected: {}, selection: [], selectionID: [], actions: {}, showBorder: false,
            fnTreeRefresh: () => { if (this.$refs && this.$refs.tree) this.$refs.tree._refresh() }, root: this.layout, designer: this
        };
    },
    ready() {
        document.addEventListener('keydown', (e) => {
            if (e.code !== 'KeyA') return;
            if (this.layout.bs.designMode && this.layout.bs.selected && this.layout.bs.selected.$owner && (e.metaKey || e.ctrlKey)) {
                this.layout.bs.selection = [];
                this.layout.bs.selected.$owner.items.forEach(i => {
                    i.selected = true;
                    this.layout.bs.selection.push(i);
                })
                this.layout.bs.selectionID = this.layout.bs.selection.map(i => i.id);
                this.selection = this.layout.bs.selection;
            }
        });
    }
});

ODA({
    is: 'oda-layout-structure',
    template: /*html*/`
        <style>
            :host {
                overflow: hidden;
                @apply --vertical;
                flex-direction: {{align}};
                flex-wrap: {{align === 'row' ? 'wrap' : 'none' }};
            }
        </style>
        <oda-layout-container ~if="item?.checked" :is-selected="selection && selection.includes(item)" ~for="items" :item :align :selection @tap.stop="_focus"></oda-layout-container>
    `,
    props: {
        layout: {
            type: Object,
            freeze: true
        },
        items: {
            get() { return this.layout && this.layout.items || []; },
            freeze: true
        },
        align() { return this.layout && this.layout.align; },
        selection: {
            type: Array,
            freeze: true
        }
    },
    _focus(e) {
        this.selection = focus(e, this.layout, this.selection);
    }
})

ODA({
    is: 'oda-layout-container',
    template: /*html*/`
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                flex: 0;
                min-width: {{iconSize}}px;
                /*flex: {{align === 'row' ? '1' : '0'}};*/
                position: relative;
                /*margin: {{item?.bs?.showBorder && (item?.bs?.designMode || isGroup) ? '1px' : '0'}};*/
            }
            .complex {
                border-left: 1px dashed darkgray;
                margin-left: 12px;
                overflow: hidden;
            }
            .group {
                overflow: hidden;
                border: {{item?.bs?.showBorder && (item?.bs?.designMode || isGroup) ? '1px solid var(--border-color, darkslategray)' : '' }};
            }
            .tabs {
                overflow: hidden;
                @apply --border;
                border-top-color: transparent;
            }
            .icon {
                cursor: pointer;
            }
            .row {
                border: 1px dotted transparent;
                flex: 0;
                align-items: {{vertical ? '' : 'center'}};
            }
            .design-row {
                border: 1px dotted lightgray;
                cursor: move;
            }
            .design-row:hover {
                box-shadow: inset 0 0 0 1px var(--info-color);
            }
            .header {
                @apply --header;
            }
            .label-group {
                cursor: pointer;
            }
            .drag-to-left:after {
                box-shadow: inset 2px 0 0 0 var(--success-color);
            }
            .drag-to-right:after {
                box-shadow: inset -2px 0 0 0 var(--success-color);
            }
            .drag-to-top:after {
                box-shadow: inset 0 2px 0 0 var(--success-color);
            }
            .drag-to-bottom:after {
                box-shadow: inset 0 -2px 0 0 var(--success-color);
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
            .active {
                @apply --active;
            }
            .shadow {
                @apply --shadow;
            }
            .is-dragged {
                filter: opacity(25%);
            }
            .disabled {
                @apply --disabled;
            }
            .focused {
                @apply --focused;
            }
        </style>
        <div ~if="isGroup" class="group horizontal active" style="align-items:center">
            <oda-icon class="icon" :rotate="item && item.$expanded?90:0" icon="icons:chevron-right" @tap.stop="_toggleExpand"></oda-icon>
            <label @dblclick.stop="_editGroupLabel" @blur.stop="_closeEditGroupLabel" @keydown="_keydownGroupLabel">{{item.label || item.id}}</label>
        </div>
        <div ~if="!isGroup || (isGroup && item && item.$expanded)" ~class="{tabs: isGroup && item?.checked, group: isGroups && item?.checked && item.bs.designMode, 'drag-to':item?.dragTo, [item?.dragTo]:item?.dragTo}"
                 :capture ~style="{'flex-direction': vertical ? 'row' : 'column'}" style="display:flex">
            <div class="flex horizontal row" ~class="{header:isGroups, active: isSelected, 'design-row': item.bs.designMode, 'is-dragged': item?.isDragged}" 
                    ~if="item?.checked && !isBlock" :draggable  ~style="{marginBottom: isGroups?'1px':''}">
                <oda-icon ~if="!isGroup && item?.items.length && !item?.hideExpander" ~class="{icon:item?.items.length}" :rotate="item && item.$expanded?90:0" icon="icons:chevron-right" @tap.stop="_toggleExpand"></oda-icon>
                <div ~if="!isGroup && !item?.items?.length || item?.hideExpander" style="min-width: 24px"></div>
                <div ~if="!isGroup" class="horizontal" style="min-width: 120px;overflow: hidden;text-overflow: ellipsis;">
                    <div class="horizontal no-flex">
                        <label ~class="{'label-group':isGroups}">
                            {{isGroup && item?.items?.length ? '' : (item.label || item.id)}}
                        </label>
                    </div>
                </div>
                <div ref="simple" ~if="!isGroups || (item && item.$expanded && item.checked)" ~is="simple" class="horizontal flex" ~class="{disabled: item.bs.designMode && !isGroup}" :items="item?.items" ::focused-index="tabIndex" :design-mode="item.bs.designMode" 
                    ::action ~style="{margin:isGroup?'2px':''}" style="min-width: 140px;min-height:32px;border:1px solid lightgray;" :vertical="item.vertical"></div>
            </div>
            <div ~is="item?.complex || (item?.items?.length ? 'oda-layout-structure' : 'div')" ~class="{complex:!isGroups, flex: 1}" :selection
                ~if="item && item.$expanded && item.checked" :layout="(isGroup && item?.items[tabIndex]) || item" ~style="{order: item.order || 0}"></div>
        </div>
    `,
    props: {
        item: {
            type: Object,
            freeze: true
        },
        capture: String,
        isGroups() { return this.item instanceof GroupItem || this.item instanceof BlockItem; },
        isGroup() { return this.item instanceof GroupItem; },
        isBlock() { return this.item instanceof BlockItem; },
        draggable: {
            reactive: true,
            get() { return this.item && this.item.bs.designMode ? 'true' : 'false' }
        },
        align: '',
        selection: {
            type: Array,
            freeze: true
        },
        isSelected: false,
        tabs() { return this.item.items; },
        tabIndex: 0,
        action: {
            type: Object,
            set(n) {
                if (n) {
                    switch (n.action) {
                        case 'addTab':
                            this.item.items.splice(-1);
                            this.execute({ action: 'addTab', props: { item: this.item.id, target: this.item.id, type: 'tab' } });
                            break;
                        case 'deleteTab':
                            if (this._grouping) {
                                this._grouping = false;
                                return;
                            }
                            this.execute({ action: 'deleteTab', props: { item: this.item.id, target: this.item.id, index: n.index } });
                            break;
                        case 'dragover':
                            this._clearDragTo();
                            break;
                        case 'dragstart':
                            this.item.bs.dragInfo.dragItem = n.item;
                            break;
                        case 'dragdrop':
                            this.item.bs.dragInfo.targetItem = n.item;
                            const action = { action: 'move', props: { item: this.item.bs.dragInfo.dragItem.id, target: n.item.id, to: 'right' } };
                            n.item.actions.push(action);
                            fn[action.action](n.item, action.props, true);
                            break;
                        case 'save':
                            let item;
                            this.item.actions.forEach(i => {
                                if (n.item.id === i.props.id) {
                                    i.props.label = n.item.label;
                                    item = n.item;
                                }
                            });
                            if (item)
                                item.save(true);
                            break;
                        case 'setTabPosition':
                            this.execute({ action: 'setTabPosition', props: { item: this.item.id, target: this.item.id, to: n.to } });
                            break;
                        case 'moveTab':
                            let a = { action: 'moveTab', props: { item: n.item.id, target: n.target.id, to: n.to } };
                            this.item.actions.push(a);
                            this.item.save(true);
                            break;
                        default:
                            break;
                    }
                }
            }
        },
        simple() { return this.isGroup ? 'oda-tabs' : this.isBlock ? 'div' : this.item.simple; },
        vertical() { return this.isGroup && this.item && this.item.vertical },
        simpleEl() { return this.$refs?.simple }
    },
    listeners: {
        'dragstart': '_dragstart',
        'dragend': '_dragend',
        'dragover': '_dragover',
        'dragleave': '_dragleave',
        'drop': '_dragdrop',
        async contextmenu(e) {
            e.stopPropagation();
            e.preventDefault();
            const selection = this.item.bs.selection.includes(this.item) ? this.item.bs.selectionID : [this.item.id];
            if (!this.item.bs.designMode) return;
            const res = await ODA.showDropdown('oda-layout-menu', { _item: this.item });
            let action;
            if (res && res.focusedItem) {
                switch (res.focusedItem.label) {
                    case 'grouping':
                        this._grouping = this._grouping === undefined ? false : true;
                        action = { action: 'move', props: { item: this.item.id, target: this.item.id, to: 'grouping', selection } };
                        this.execute(action);
                        break;
                    case 'unblocking':
                        action = { action: 'unblocking', props: { item: this.item.id, target: this.item.id, to: 'unblocking', selection } };
                        this.execute(action);
                        break;
                    default:
                        break;
                }
            }
        }
    },
    execute(action) {
        this.item.actions.push(action);
        fn[action.action](this.item, action.props, true);
    },
    _toggleExpand(e) {
        if (e.target.hideIcon) return;
        this.item.$expanded = !this.item.$expanded;
        this.render();
    },
    _clearDragTo() {
        this.capture = '';
        this.item.dragTo = '';
        if (this.item.bs.indxs) {
            this.item.bs.indxs.forEach(i => {
                i.dragTo = '';
            })
            this.item.bs.indxs = [];
        }
        this.item.$owner.items.forEach(i => i.dragTo = '');
        if (this.item.bs.dragInfo.last) this.item.bs.dragInfo.last.item.dragTo = '';
        if (this.domHost && this.domHost.layout) this.domHost.layout.dragTo = '';
    },
    _clearIsDragged() {
        if (this.item.bs.dragInfo && this.item.bs.dragInfo.dragItem) {
            this.item.bs.dragInfo.dragItem.isDragged = false;
            if (this.item.bs.selection && this.item.bs.selection.length) this.item.bs.selection.forEach(i => i.isDragged = '');
        }
    },
    _dragstart(e) {
        e.stopPropagation();
        this.item.bs.dragInfo.dragItem = this.item;
        if (this.item.bs.selection && this.item.bs.selection.includes(this.item.bs.dragInfo.dragItem)) this.item.bs.selection.forEach(i => i.isDragged = true);
        else this.item.isDragged = this.item.bs.dragInfo.dragItem === this.item;
        e.dataTransfer.setDragImage((this.item.bs.selection && this.item.bs.selection.includes(this.item.bs.dragInfo.dragItem) && this.item.bs.selection.length) > 1 ? img3 : img, -20, 7);
    },
    _dragend(e) {
        this._clearDragTo();
        this._clearIsDragged();
    },
    _dragover(e) {
        e.stopPropagation();
        this._clearDragTo();
        if (this.item.bs.dragInfo && this.item.bs.dragInfo.dragItem) {
            this.item.dragTo = 'drag-to-error';
            if ((this.item.bs.selection && this.item.bs.selection.includes(this.item.bs.dragInfo.dragItem) && this.isSelected) || this.item.bs.dragInfo.dragItem === this.item) return;
            if (this.item.bs.dragInfo.dragItem.$root !== this.item.$root) return;
            this._clearDragTo();
            e.preventDefault();
            this.capture = dragOver(this.item, e);
            this.item.bs.dragInfo.last = this;
        }
    },
    _dragleave(e) {
        this._clearDragTo();
    },
    _dragdrop(e) {
        e.stopPropagation();
        const action = { action: this.item.bs.dragInfo.action, props: { item: this.item.bs.dragInfo.dragItem.id, target: this.item.bs.dragInfo.targetItem.id, to: this.item.bs.dragInfo.to } };
        if (e.ctrlKey)
            action.props.ctrlKey = true;
        this.item.bs.indxsOk = undefined;
        if (this.item.bs.indxs && this.item.bs.indxs.length) {
            this.item.bs.indxsOk = [];
            let indxs = [],
                item = this.item.bs.dragInfo.dragItem,
                selection = this.item.bs.selection;
            if (selection && selection.includes(item)) {
                this.item.bs.indxs.forEach(i => {
                    if (i !== item && !selection.includes(i)) {
                        indxs.push(i.id);
                        this.item.bs.indxsOk.push(i);
                    }
                })
            } else {
                this.item.bs.indxs.forEach(i => {
                    if (i !== item) {
                        indxs.push(i.id);
                        this.item.bs.indxsOk.push(i);
                    }
                })
            }
            if (indxs.length)
                action.props.indxs = indxs;
        }
        this._clearDragTo();
        this._clearIsDragged();
        this.execute(action);
    },
    _editGroupLabel(e) {
        if (!this.item.bs.designMode) return;
        const t = e.target;
        this._oldLabel = t.innerText;
        t.setAttribute('contentEditable', '');
        t.focus();
        t.style.outline = "0px solid transparent";
        window.getSelection().selectAllChildren(t)
    },
    _closeEditGroupLabel(e) {
        if (!this.item.bs.designMode) return;
        e.target.removeAttribute('contentEditable');
        this.item.label = e.target.innerText;
        this.item.actions.forEach(i => {
            if (this.item.id === i.props.owid) i.props.owLabel = this.item.label;
        });
        this.item.save(true);
    },
    _keydownGroupLabel(e) {
        if (e.key === 'Enter') this._closeEditGroupLabel(e);
        else if (e.key === 'Escape') {
            e.target.innerText = this._oldLabel;
            this._closeEditGroupLabel(e);
        }
    }
})

ODA({
    is: 'oda-layout-block', extends: 'oda-layout-structure'
})

ODA({
    is: 'oda-layout-group', extends: 'oda-layout-structure'
})

ODA({
    is: 'oda-layout-toolbar',
    template: /*html*/`
        <style>
            :host {
                @apply --horizontal;
            }
        </style>
        <oda-button ~if="designMode" icon="editor:border-outer" allow-toggle ::toggled="showBorder" title="Show border"></oda-button>
        <oda-button ~if="designMode" icon="icons:select-all" allow-toggle ::toggled="multiSelect" title="Multi select"></oda-button>
        <div style="flex:1"></div>
        <oda-button ~if="designMode" icon="icons:settings-backup-restore" title="Refresh" @tap="_refresh"></oda-button>
        <oda-button ~if="designMode" icon="icons:save" allow-toggle ::toggled="enableSave" title="Enable Save"></oda-button>
    `,
    props: {
        layout: {
            type: Object,
            set(n) {
                if (n) {
                    this.layout.bs.enableSave = this.enableSave;
                    this.layout.bs.multiSelect = this.multiSelect;
                }
            }
        },
        enableSave: {
            default: 'false',
            save: true,
            set(n) { if (this.layout) this.layout.bs.enableSave = n; }
        },
        designMode() { return this.layout?.bs?.designMode },
        multiSelect: {
            default: 'false',
            save: true,
            set(n) { if (this.layout) this.layout.bs.multiSelect = n; }
        },
        showBorder: {
            default: 'false',
            save: true,
            set(n) { if (this.layout) this.layout.bs.showBorder = n; }
        }
    },
    _refresh() {
        this.layout.reset();
        document.location.reload();
    }
});

ODA({
    is: 'oda-layout-tree', extends: "oda-tree",
    imports: '@oda/tree',
    props: {
        allowFocus: true,
        allowSelection: true,
        allowCheck: 'single'
    }
});

ODA({
    is: 'oda-layout-menu', extends: 'oda-menu',
    props: {
        _item: Object,
        items() {
            const _items = [];
            if (this._item) {
                if (!(this._item instanceof GroupItem) && !(this._item.$owner instanceof GroupItem) && !(this._item.$owner.$owner instanceof GroupItem))
                    _items.splice(0, 0, { label: 'grouping' });
                if (this._item.$owner && this._item.$owner instanceof BlockItem && !(this._item.$owner.$owner instanceof GroupItem))
                    _items.splice(0, 0, { label: 'unblocking' });
            }
            if (!_items.length)
                _items.splice(0, 0, { label: 'no actions...' });
            return _items;
        }
    }
})




export class layoutStorage {
    static save(item, save) {
        saveToLocalStorage(item, save);

        try {
            item.bs.fnTreeRefresh();
        } catch (err) { }
    }
    static load(item) {
        const actions = loadFromLocalStorage(item);
        item.bs.actions['' + item.level] = actions?.['' + item.level] || [];
        item.constructor.loadActions(item);
    }
    static reset(item) {
        localStorage.removeItem(item.bs.fileName);
    }
}

class baseItem {
    constructor(layoutStorage) {
        this._layoutStorage = layoutStorage;
        this._checked = true;
        this._expanded = false;
    }
    static _bus = {};
    get uuid() { return this._uuid || this.$root && this.$root.uuid }
    get bs() { return this.constructor._bus[this.uuid] || {} }
    get level() { return this._level || this.$root.level || this.id || 'main' }
    get level$r() { return this._level$r || this.level }
    get actions() { return this.bs.actions[this.level$r] }
    get name() { return this.label || this.id }
    get checked() { return this._checked }
    get vertical() { return this._vertical || this.$owner._vertical || false }
    set vertical(v) { this._vertical = v }
    get order() { return this._order || this.$owner._order || 0 }
    set order(v) { this._order = v }
    set checked(v) {
        this._checked = v;
        //if (this instanceof BlockItem) return;
        this.applyAction('hide', v);
    }
    get $expanded() { return this._expanded }
    set $expanded(v) {
        this._expanded = v;
        this.applyAction('expanded', v);
        if (this.bs && this.bs.fnTreeRefresh)
            this.bs.fnTreeRefresh();
    }
    get layoutStorage() { return this._layoutStorage }
    setChecked(v) { this._checked = v }
    setExpanded(v) { this._expanded = v }
    applyAction(name, v) {
        if (!this.uuid || !this.bs.designMode || !this.bs.enableSave) return;
        const item = { action: name, props: { item: this.id + '', value: v } }
        this.bs.actions[this.level$r].splice(this.bs.actions[this.level$r].length, 0, item);
        this.save(this, true);
    }
    insert(target, item, to) {
        const selection = this.bs.selection;
        let idx = this.items.indexOf(target);
        if (['right', 'bottom'].includes(to))
            ++idx;
        if (selection && selection.includes(item)) {
            selection.reverse().forEach(i => {
                i.$owner.items.splice(i.$owner.items.indexOf(i), 1);
                this.items.splice(idx, 0, i);
                deleteRecursive(i.$owner);
                i.$owner = this;
            })
        }
        else {
            item.$owner.items.splice(item.$owner.items.indexOf(item), 1);
            this.items.splice(idx, 0, item);
            deleteRecursive(item.$owner);
            item.$owner = this;
        }
        if (to === 'grouping' && !(this.$owner instanceof GroupItem)) {
            new GroupItem({ id: this.owid, label: this.owLabel }, this);
        }
        deleteRecursive(this.$owner);
    }
    save(save) {
        this.layoutStorage.save(this, save)
    }
    load() {
        this.layoutStorage.load(this);
    }
    reset() {
        this.layoutStorage.reset(this);
    }
}
export class LayoutItem extends baseItem {
    constructor(item, listKey = 'items', parent, uuid, layoutStorage) {
        super(layoutStorage);
        if (uuid) {
            this._uuid = uuid;
            this._id = 'main';
        }
        this.$item = item;
        this.$owner = this.$root = parent;
        this._listKey = listKey;
    }
    get id() { return this._id || this.$item.id || this.$item.name || 'main' }
    get items() {
        if (!this._items) {
            this._items = (this.$item[this._listKey] || []).map(i => {
                return new this.constructor(i, this._listKey, this, undefined, this.layoutStorage);
            })
            if (this._items.length) {
                this._items.forEach(i => {
                    i._level = this.id;
                    i._uuid = this._uuid;
                })
                this._level = this.id;
                this._level$r = this.$root.level;
                this.bs.actions[this.id] = [];
                if (!this.bs.actions[this.level$r])
                    this.bs.actions[this.level$r] = [];

                const item = this._items[0];
                item.load();
            }
        }
        return this._items;
    }
    static loadActions(item) {
        if (!item.actions) return;
        item.actions.forEach(act => {
            if (act.props.selection && act.props.selection.length) {
                item.bs.selection = [];
                item.bs.selectionID = [];
                act.props.selection.forEach(i => {
                    const obj = findRecursive.call(item.$root, i);
                    if (obj) {
                        item.bs.selection.push(obj);
                        item.bs.selectionID.push(obj.id);
                    }
                })
            }
            if (act.props.indxs && act.props.indxs.length) {
                item.bs.indxsOk = [];
                act.props.indxs.forEach(i => {
                    const obj = findRecursive.call(item.$root, i);
                    if (obj) {
                        item.bs.indxsOk.push(obj);
                    }
                })
            }
            if (fn[act.action])
                fn[act.action](item, act.props);
        })
    }
}
class BlockItem extends baseItem {
    constructor(props, target, owner, layoutStorage) {
        super(layoutStorage);
        this._expanded = true;
        this.hideExpander = true;
        this.complex = 'oda-layout-block';
        this.align = ['left', 'right'].includes(props.to) ? 'row' : 'column';
        this.id = props.id || getUUID();
        this.owid = props.owid;
        this.owLabel = props.owLabel;
        this.label = props.label || 'block (' + { row: 'h', column: 'v' }[this.align] + ')';
        this.type = props.type || '';
        if (!target) {
            this.$owner = owner;
            this.$root = owner.$root;
            return;
        }
        target.$owner.items.splice(target.$owner.items.indexOf(target), 1, this);
        this.$root = target.$root;
        this.$owner = target.$owner;
        target.$owner = this;
        this.items = [target];
    }
}
class GroupItem extends baseItem {
    constructor(props, target, layoutStorage) {
        super(layoutStorage);
        this._expanded = true;
        //this._checked = true;
        this.hideExpander = false;
        this.complex = 'oda-layout-group';
        this.label = props.label || 'group';
        this.id = props.id || getUUID();
        target.$owner.items.splice(target.$owner.items.indexOf(target), 1, this);
        this.$root = target.$root
        this.$owner = target.$owner;
        target.$owner = this;
        this.items = [target];
    }
}

function findRecursive(id) {
    if (!this.items) return;
    let items = this.items.filter(i => i.$root.id === this.$root.id);
    if (!items || !items.length) items = this.items;
    return items.reduce((res, i) => {
        if (i.id + '' === id + '')
            res = i;
        return res || findRecursive.call(i, id);
    }, undefined);
}
function deleteRecursive(item) {
    if (!item) return;
    if ((!item.items || !item.items.length) && item.type !== 'tab') {
        let i = item.$owner || item.$root;
        if (!i) return;
        if (item instanceof BlockItem || item instanceof GroupItem)
            i.items.splice(i.items.indexOf(item), 1);
        let _item = i;
        i = i.$owner || i.$root;
        while (i) {
            if ((_item instanceof BlockItem || _item instanceof GroupItem) && (!_item.items || !_item.items.length))
                i.items.splice(i.items.indexOf(_item), 1);
            _item = i;
            i = i.$owner;
        }
        return;
    } else if (!(item instanceof LayoutItem) && !(item instanceof GroupItem) && item.items && item.items.length === 1 && (item.items[0] instanceof BlockItem || item.items[0] instanceof GroupItem)) {
        item.items[0].$owner = item.$owner;
        item.items[0].$root = item.$root;
        item.$owner.items.splice(item.$owner.items.indexOf(item), 1, item.items[0]);
    }
    if (item.items && item.items.length)
        item.items.forEach(i => deleteRecursive(i))
}

export function loadFromLocalStorage(item) {
    let actions = localStorage.getItem(item.bs.fileName);
    actions = actions ? JSON.parse(actions) : {};
}
function saveToLocalStorage(item, save) {
    if (save && item.bs.enableSave && item.bs.designMode && item.bs.actions) {
        localStorage.setItem(item.bs.fileName, JSON.stringify(item.bs.actions));
    }
}

const move = (item, props, save = false) => {
    if (item.bs._lastAction === props) return;
    item.bs._lastAction = props;
    const dragItem = findRecursive.call(item.$root, props.item);
    const targItem = findRecursive.call(item.$root, props.target);
    if (!dragItem || !targItem) return;
    if (targItem.type === 'tab') {
        targItem.items = targItem.items || [];
        const selection = item.bs.selection
        let idx = dragItem.$owner.items.indexOf(dragItem);
        if (selection && selection.includes(dragItem)) {
            selection.reverse().forEach(i => {
                targItem.items.splice(idx, 0, i);
                i.$owner.items.splice(i.$owner.items.indexOf(i), 1);
                deleteRecursive(i.$owner);
                i.$owner = targItem;
            })
        } else {
            targItem.items.splice(targItem.items.length, 0, dragItem);
            dragItem.$owner.items.splice(idx, 1);
            deleteRecursive(dragItem.$owner);
            dragItem.$owner = targItem;
        }
    } else {
        let align = ['left', 'right'].includes(props.to) ? 'row' : 'column';
        if (item.bs.indxsOk && item.bs.indxsOk.length) {
            let selection = [...[], ...item.bs.selection];
            item.bs.selection = [...[], ...item.bs.indxsOk];
            let target = item.bs.selection[0];
            item.bs.selection.splice(0, 1);
            target.$owner = new BlockItem(props, target, this.layoutStorage);
            if (item.bs.selection.length)
                target.$owner.insert(target, item.bs.selection[0], props.to);
            if (target.$owner.$owner)
                deleteRecursive(target.$owner.$owner);
            item.bs.selection = [...[], ...selection];
            target.$owner.$owner = new BlockItem(props, target.$owner);
            target.$owner.$owner.insert(target.$owner, dragItem, props.to, this.layoutStorage);
        } else {
            if (!(targItem.$owner instanceof BlockItem) || (targItem.$owner && targItem.$owner.align !== align)) {
                if (!props.ctrlKey)
                    targItem.$owner = new BlockItem(props, targItem, this.layoutStorage);
            }
            if (props.to === 'grouping' || targItem !== dragItem || targItem.type === 'tab')
                targItem.$owner.insert(targItem, dragItem, props.to);
        }
    }
    item.actions.last.props.label = item.actions.last.props.label || targItem.$owner.label;
    item.actions.last.props.id = item.actions.last.props.id || targItem.$owner.id;
    if (props.to === 'grouping' && targItem.$owner.$owner) {
        item.actions.last.props.owid = item.actions.last.props.owid || targItem.$owner.$owner.id;
        item.actions.last.props.owLabel = item.actions.last.props.owLabel || targItem.$owner.$owner.label;
    }
    item.actions.last.props.selection = item.actions.last.props.selection || item.bs.selectionID;
    item.save(save);
}
const hide = (item, props) => {
    const propsItem = findRecursive.call(item.$root, props.item);
    if (propsItem)
        propsItem.setChecked(props.value);
}
const expanded = (item, props) => {
    const propsItem = findRecursive.call(item.$root, props.item);
    if (propsItem)
        propsItem.setExpanded(props.value);
}
const addTab = (item, props, save = false) => {
    const propsItem = findRecursive.call(item.$root, props.item);
    if (!propsItem) return;
    const block = new BlockItem(props, null, item, item.layoutStorage);
    block.$owner = propsItem;
    propsItem.items.splice(propsItem.items.length, 0, block);
    item.actions.last.props.id = item.actions.last.props.id || block.id;
    item.save(save);
}
const deleteTab = (item, props, save = false) => {
    const propsItem = findRecursive.call(item.$root, props.item);
    if (!propsItem) return;
    let items = propsItem.items[props.index].items;
    if (items && items.length)
        items.forEach(i => {
            i.$owner = propsItem.$owner || propsItem.$root;
            propsItem.$owner.items.splice(propsItem.$owner.items.indexOf(propsItem), 0, i);
        })
    propsItem.items.splice(props.index, 1);
    if (propsItem.items.length === 0) {
        propsItem.$owner.items.splice(propsItem.$owner.items.indexOf(propsItem), 1);
    }
    //deleteRecursive(item.$owner);
    item.save(save);
}
const unblocking = (item, props, save = false) => {
    const propsItem = findRecursive.call(item.$root, props.item);
    if (!propsItem) return;
    const selection = item.bs.selection;
    if (selection && selection.includes(propsItem)) {
        selection.reverse().forEach(i => {
            const owner = i.$owner;
            owner.items.splice(owner.items.indexOf(i), 1);
            owner.$owner.items.splice(owner.$owner.items.indexOf(owner), 0, i);
            i.$owner = owner.$owner;
            deleteRecursive(i.$owner);
        })
    } else {
        const owner = propsItem.$owner;
        owner.items.splice(owner.items.indexOf(propsItem), 1);
        owner.$owner.items.splice(owner.$owner.items.indexOf(owner), 0, item);
        propsItem.$owner = owner.$owner;
        deleteRecursive(propsItem.$owner);
    }
    deleteRecursive(item.$root);
    item.save(save);
}
const focus = (e, item, selection = []) => {
    if (!item.bs.designMode) return;
    const source = e.target.item;
    if (!item.bs.selected || selection.length === 0) item.bs.selected = source;
    if (e.detail.sourceEvent.ctrlKey || e.detail.sourceEvent.metaKey) {
        if (item.bs.selected.$root !== source.$root) return;
        if (selection.includes(source)) {
            selection.splice(selection.indexOf(source), 1);
            return;
        }
        selection.splice(selection.length, 0, source)
    } else if (e.detail.sourceEvent.shiftKey) {
        if (item.bs.selected.$root !== source.$root) return;
        const from = item.bs.selected.$root.items.indexOf(item.bs.selected);
        const to = item.bs.selected.$root.items.indexOf(source);
        const arr = item.bs.selected.$root.items.slice((from < to ? from : to), (from > to ? from : to) + 1)
        selection.splice(0, selection.length, ...arr);
    } else {
        item.bs.selected = source;
        selection.splice(0, selection.length, source)
    }
    item.bs.selection = selection;
    item.bs.selectionID = selection.map(i => i.id);
    item.bs.designer.focused = e.target.simpleEl;
    return item.bs.selection;
}
const setTabPosition = (item, props, save = false) => {
    const propsItem = findRecursive.call(item.$root, props.item);
    if (!propsItem) return;
    propsItem._vertical = ['right', 'left'].includes(props.to);
    propsItem._order = ['top', 'left'].includes(props.to) ? 0 : -1;
    item.save(save);
}
const moveTab = (item, props, save = false) => {
    const propsItem = findRecursive.call(item.$root, props.item);
    const propsTarget = findRecursive.call(item.$root, props.target);
    if (!propsItem || !propsTarget) return;
    propsItem.$owner.items.splice(propsItem.$owner.items.indexOf(propsItem), 1);
    propsTarget.$owner.items.splice(propsTarget.$owner.items.indexOf(propsTarget) + (props.to === 'right' ? 1 : 0), 0, propsItem);
}
const fn = { move, hide, expanded, addTab, deleteTab, unblocking, setTabPosition, moveTab }

function dragOver(item, e) {
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

    item.bs.dragInfo.action = 'move';
    item.bs.dragInfo.to = to;

    if (item.bs.multiSelect) {
        const ow = item.$owner || item.$root;
        let step = 2,
            count = 0,
            maxCount = 0,
            indxs = [],
            indx = ow.items.indexOf(item);
        if (ow instanceof BlockItem && ow.align === 'row' && (to === 'top' || to === 'bottom')) {
            y = (1 - Math.abs(y)) * h / 2 | 0;
            maxCount = h / step / 2;
            count = y / step | 0;
        } else if ((!(ow instanceof BlockItem) || (ow instanceof BlockItem && ow.align === 'column')) && (to === 'left' || to === 'right')) {
            step = 6;
            x = (1 - Math.abs(x)) * w / 2 | 0;
            maxCount = w / step / 2;
            count = x / step | 0;
        }
        indxs.push(indx);
        count = count <= maxCount ? count : maxCount;
        let i = indx >= (ow.items.length / 2 | 0) ? indx : ow.items.length - indx;
        count = count <= i ? count : i;
        i = 1;
        while (count) {
            if (indx - i >= 0)
                if (!ow.items[indx - 1].isDragged)
                    indxs.push(indx - i);
            if (indx + i < ow.items.length)
                if (!ow.items[indx + 1].isDragged)
                    indxs.push(indx + i);
            ++i;
            --count;
        }
        item.bs.indxs = [];
        indxs.forEach(i => {
            if (ow.items[i]) {
                ow.items[i].dragTo = 'drag-to-' + to;
                item.bs.indxs.push(ow.items[i]);
            }
        })
    } else {
        item.bs.indxs = undefined;
        item.dragTo = 'drag-to-' + to;
    }

    item.bs.dragInfo.targetItem = item;

    // здесь можно устанавливать отладочные сообщения на псевдоэлементы
    // в релизе тоже можно выводить пояснения для пользователей
    //return Math.round(Math.abs(e.layerX / 3) * 3);
}

const getUUID = function b(a) { return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b) };
const img = new Image();
img.src = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAQCAYAAABQrvyxAAAACXBIWXMAAAsSAAALEgHS3X78AAAAa0lEQVRIiWPU6v91RFv4jwIv+78/DEMIfP7JxHL1LcsDFpDjJ7p8kB5KjoeB/D0CDExDLeSRAcjtTIPHOeSBUQ8MNBj1wECDUQ8MNBj1wECDUQ8MNGACteqGquNBbgc3SUGtuiHZnH7L8gAAtichl6hs6rYAAAAASUVORK5CYII=`;
const img3 = new Image();
img3.src = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAAUCAYAAADC1B7dAAAACXBIWXMAAAsSAAALEgHS3X78AAAA4klEQVRYhWPU6v91RFv4jwIv+78/DEMIfP7JxHL1LcuDqwWsNsiuZgF5ZqLLB+mh5BkYyN8jwMDAwIoixjTUYgYZ8LL/Ew9b/P2J9oTfR2DCTIPCZWQCQfb/LKDUBUplMBNYhponsAFYTIHy1JCOIRhAjqlh4SEYAJUHw8pDDEO9UMAGRj002MGohwY7GH4eArVaB4E7yAIffzFiaAM3wUGtVlDzAVTjDgmfQD3z6SdmAmOB9CdYGUBtoRbbodmNQI4peIwMl5hi/P//P4oCUEwN4Q7fU4yYQIqpodclf8vyAAC+a17T0iNSKwAAAABJRU5ErkJggg==`;


