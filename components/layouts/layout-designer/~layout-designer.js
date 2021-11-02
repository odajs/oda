ODA({ is: 'oda-layout-designer', imports: '@tools/property-grid, @oda/checkbox, @oda/menu',
    template: /*html*/`
        <style>
            :host{
                flex-grow: 0 !important;
                flex-shrink: 0!important;
            }
        </style>
        <oda-layout-designer-structure ~if="designMode" :design-mode :layout style="overflow: auto" :slot="designMode ? 'left-panel' : '?'" :itree></oda-layout-designer-structure>
        <oda-layout-designer-structure :design-mode :layout style="overflow: auto" slot="main" :doactions></oda-layout-designer-structure>
        <oda-property-grid ~if="designMode" :slot="designMode ? 'right-panel' : '?'" :inspected-object :expert-mode></oda-property-grid>
        <div ~if="designMode" :slot="designMode ? 'top-left' : '?'" class="horizontal">
            <oda-button ~show="item.showAlways || target" ~for="_buttons" :icon="item.icon" :title="item.label" @tap="_doAction(item)">{{item._label}}</oda-button>
        </div>  
    `,
    props: {
        keys: 'items',
        designMode: {
            type: Boolean,
            set(n) {
                if (!n && this.layout?.root) {
                    this.layout.root.selection = [];
                    this.layout.root.focused = undefined;
                }
            }
        },
        expertMode: true,
        itree: true,
        id: 'ld',
        doactions: ''
    },
    data: {},
    get target() { return this.layout?.root?.selection?.[0] || this.layout?.root?.focused || this.layout?.root?._hoverLayout || undefined },
    get _hideUndoLast() { return !this.layout?.root?.lastStuctures?.length },
    get _buttons() {
        return [
            { label: 'Create tab', icon: 'icons:tab', action: 'tab', act: { _type: 'tab', type: 'move', to: 'tab', drag: this.target, target: this.target } },
            { label: 'Group', icon: 'icons:radio-button-checked', action: 'group', act: { _type: 'group', type: 'move', to: 'top', drag: this.target, target: this.target } },
            { label: '.........................................' },
            { label: 'Ungroup', icon: 'icons:radio-button-unchecked', action: 'ungroup', act: { _type: 'ungroup', type: 'ungroup', target: this.target } },
            { label: '.........................................' },
            { label: 'Undo last operation', icon: 'icons:history', action: 'undoLast', hidden: this._hideUndoLast },
            { label: 'Clear view', icon: 'icons:autorenew', action: 'clearView', showAlways: true, _label: 'сброс' }
        ]
    },
    get layout() { return new Layout(this.data, this.keys, null, null, this.id) },
    get inspectedObject() { return this.layout?.root?.focused },
    attached() {
        document.addEventListener('keydown', this.__keyDown = this.__keyDown || this._keyDown.bind(this));
        document.addEventListener('contextmenu', this.__contextmenu = this.__contextmenu || this._contextmenu.bind(this));
    },
    detached() {
        document.removeEventListener('keydown', this.__keyDown);
        document.removeEventListener('contextmenu', this.__contextmenu);
    },
    _keyDown(e) {
        if (this.designMode && e.code === 'KeyA' && (e.metaKey || e.ctrlKey) && this.layout?.root?.focused) {
            this.layout.root.selection = [];
            (this.layout.root.focused?.owner.items || []).forEach(i => this.layout.root.selection.add(i));
            this.render();
        }
    },
    async _contextmenu(e) {
        if (!this.designMode) return;
        this._hoverStructure = e.target.layout?.structure;
        e.preventDefault();
        e.stopPropagation();
        const res = await ODA.showDropdown('oda-menu', { items: this._buttons });
        if (res?.focusedItem?.action) this._doAction(res.focusedItem);
    },
    _doAction(res) {
        const _structure = this.layout?.root?.focused?.structure || this._hoverStructure;
        if (res.action === 'clearView') {
            if (!confirm('Clear View ?')) return;
            this.doactions = res.action;
            this.async(() => {
                this.layout = undefined;
                this.doactions = '';
            }, 500);
        } else if (res.action === 'undoLast') {
            const structure = this.layout?.root?.lastStuctures?.pop() || _structure;
            let _actions = [...structure.actions];
            structure.actions = undefined;
            _actions.pop();
            structure.actions = _actions;
            this.layout = undefined;
            this.async(() => this.layout.structure.actions.forEach(i => execute(i, this.layout.structure, false)), 100);
        } else {
            execute(res.act, _structure, true);
        }
    }
})
ODA({ is: 'oda-layout-designer-structure',
    template: /*html*/`
        <style>
            :host{
                @apply --vertical;
                cursor: {{designMode && !itree ? 'pointer' : 'unset'}};
                outline: 1px dotted lightgray;
            }
        </style>
        <oda-layout-designer-container ~for="layout?.items" :layout="item" :design-mode :itree :structure="this" :doactions></oda-layout-designer-container>
    `,
    props: {
        designMode: false,
        itree: false,
        actions: {
            type: Array,
            save: true,
            set(n) {
                //if (!n || this.itree || this.layout.owner !== this.layout.$owner || this._init) return;
                if (!n || this.itree || this._init) return;
                this._init = true;
                n.forEach(i => execute(i, this, false));
                this.layout.root.actions = this.layout.root.actions || {};
                this.layout.root.actions[this.saveKey] = n;
            }
        },
        doactions: ''
    },
    _init: false,
    layout: undefined,
    observers: [
        function setSaveKey(layout) {
            this.saveKey = layout.saveKey;
            // console.log(this.saveKey)
            layout.structure = this;
        },
        function doActions(doactions) { if (fn[doactions]) fn[doactions](this) }
    ]
})
ODA({ is: 'oda-layout-designer-container', imports: '@oda/button',
    template: `
        <style>
            :host {
                @apply --vertical;
                box-shadow: {{designMode ? '-1px 1px 0 0 lightgray' : 'unset'}};
                position: relative;
                flex: {{layout?.checked && layout?.owner?.block === 'row' ? 1 : 0}};
                margin-right: 2px;
            }
            .focused { @apply --focused; }
            .active { @apply --active; }
            .selected { @apply --selected; }
            .structure {
                margin-left: 18px;
                overflow: hidden;
            }
            .block {
                flex-direction: {{layout.block}};
                flex: {{layout.block === 'row' ? 1 : 0}};
            }
            .row {
                position: relative;
                align-items: center;
                min-height: 36px;
                box-shadow: {{designMode ? '0 1px 0 0 lightgray' : 'unset'}};
            }
            .drag-to:after {
                text-align: center;
                content: attr(capture);
                pointer-events: none;
                position: absolute;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0,255,0,.25);
            }
            .drag-to-error:after {
                /* content: "not allow drop"; */
                pointer-events: none;
                background-color: rgba(255,0,0,.25) !important;
            }
            .drag-to-left:after { box-shadow: inset 2px 0 0 0 var(--success-color, green); }
            .drag-to-right:after { box-shadow: inset -2px 0 0 0 var(--success-color, green); }
            .drag-to-top:after { box-shadow: inset 0 2px 0 0 var(--success-color, green); }
            .drag-to-bottom:after { box-shadow: inset 0 -2px 0 0 var(--success-color, green); }
            label {
                display: flex;
                align-items: center;
                color: gray;
                width: 140px;
                height: 100%;
            }
            .tab {
                color: gray;
                min-width: 30px;
                align-items: center;
                border: 1px dotted gray;
                border-top-left-radius: 4px;
                border-top-right-radius: 4px;
                margin-top: 4px;
                padding: 2px 18px 2px 4px;
            }
            .focused-tab {
                border: 1px solid gray;
                background-color: lightgray;
            }
            .group {
                color: gray;
                align-items: center;
                border: 1px solid gray;
                margin-top: 4px;
                padding: 4px;
                background-color: #eee;
            }
            .close {
                position: absolute;
                right: 6px;
                top: 6px;
                display: {{designMode ? 'block' : 'none'}};
            }
            input {
                color: gray;
                font-size: 16px;
                border: none;
                background-color: transparent;
                padding: 0;
                margin: 0;
            }
            input:focus {
                outline: none;
            }
        </style>
        <div ~if="group" class="group" @dblclick.stop="_startEditLabel(layout)" @focusout.stop="_endEditLabel(layout)" @keydown="_keyEditLabel" :draggable ~class="{'drag-to': dragTo, [dragTo]: dragTo}">
            <span ~is="_editLabel ? 'input' : 'span'" ::value="layout.label" style="width: 100%">{{layout.label}}</span>
        </div>
        <div ~if="tabs" class="horizontal" style="width: 100%; margin-left: 4px">
            <div ~if="item.checked" ~for="layout.items" :draggable ~class="{'drag-to': dragTo, [dragTo]: dragTo}" style="position: relative">
                <div class="tab no-flex" ~class="{'focused-tab': focusedTab === index}" ~is="_editLabel && index === focusedTab? 'input' : 'div'" @dblclick.stop="_startEditLabel(item)" @focusout.stop="_endEditLabel" @focusout.stop="_endEditLabel" @keydown="_keyEditLabel" ::value="item.label" @tap="focusedTab=index">{{item.label}}</div>
                <oda-icon ~if="designMode" class="close" icon="icons:close" icon-size="12" @tap="_deleteTab(index)"></oda-icon>
            </div>
            <oda-icon ~if="designMode" icon="icons:add" icon-size="12" @tap="_addTab"></oda-icon>
        </div>
        <div ~if="show" class="row horizontal" :draggable ~class="{focused, active: selected, 'drag-to': dragTo, [dragTo]: dragTo}" :capture @click="_pointerdown" @contextmenu="layout.root._hoverLayout = this.layout">
            <oda-icon :icon="hasChildren?icon:''" @tap.stop="_tapExpand"></oda-icon>
            <oda-checkbox ~if="itree" :value="layout.checked" fill="gray" @tap="_tapCheckbox" ~style="{cursor: designMode ? 'pointer' : 'unset'}"></oda-checkbox>
            <label class="no-flex" ~is="_editLabel ? 'input' : 'label'" @dblclick.stop="_startEditLabel(layout)" @focusout.stop="_endEditLabel(layout)" @keydown="_keyEditLabel" ::value="layout.label">{{itree ? layout?.data?.label || layout?.data?.name || layout?.label : layout?.label}}</label>     
            <div class="flex" ~is="!itree && layout?.data?.template || 'span'" ~props="layout?.data?.props" ~style="{'padding-left': hasChildren ? 0 : iconSize / 2}"></div>
        </div>
        <oda-layout-designer-structure ~if="hasChildren && layout.expanded" ~class="strClass" :layout="tabs? layout.items[focusedTab] : layout" :design-mode :itree ~style="{'box-shadow': tabs || group?'inset 0 0 0 1px gray':''}" :doactions></oda-layout-designer-structure>
    `,
    props: { designMode: false, itree: false, structure: {}, doactions: '' },
    get icon() { return this.hasChildren ? (this.layout?.expanded ? 'icons:remove' : 'icons:add') : '' },
    get hasChildren() { return this.layout?.items?.length },
    get focused() { return this.layout?.root?.focused === this.layout },
    get selected() { return this.layout?.root?.selection?.includes(this.layout) },
    get draggable() { return this.designMode && !this.itree ? 'true' : 'false' },
    get show() { return this.itree || (!this.itree && this.layout?.checked && this.layout?.owner?.checked && !this.layout?.block) },
    get tabs() { return !this.itree && this.layout?.block === 'tabs' && this.layout?.checked && this.layout?.owner?.checked && this.layout?.expanded },
    get group() { return !this.itree && this.layout?.block === 'group' && this.layout?.checked && this.layout?.owner?.checked && this.layout?.expanded },
    get strClass() { return this.itree || !this.layout?.block ? 'structure' : 'block' },
    layout: undefined,
    dragTo: '',
    capture: '',
    _editLabel: false,
    focusedTab: 0 ,
    observers: [function setStructure(structure) { this.layout.structure = structure }],
    listeners: { 'dragstart': '_dragstart', 'dragover': '_dragover', 'dragleave': '_dragleave', 'dragend': '_dragend', 'drop': '_drop' },
    _dragstart(e) {
        if (this.itree || !this.designMode) return;
        e.stopPropagation();
        if (this.layout.root.selection.length > 1 && !this.layout.root.selection.has(this.layout))
            this.layout.root.selection = [];
        this.layout.root.dragLayout = this.layout;
        e.dataTransfer.setDragImage(this.layout.root.selection.length > 1 ? dragImage3 : dragImage, -20, 7);
    },
    _dragover(e) {
        if (this.itree || !this.designMode) return;
        e.stopPropagation();
        this.dragTo = 'drag-to-error';
        if (
            this.layout.$owner !== this.layout.root.dragLayout.$owner
            || this.layout === this.layout.root.dragLayout
            || this.layout.root.selection > 1 && this.layout.root.selection.includes(this.layout)
            || this.layout.root.dragLayout.block === 'tabs' && this.layout.owner.owner === this.layout.root.dragLayout
            || this.layout.root.dragLayout.block === 'group' && this.layout.owner === this.layout.root.dragLayout
        ) return;
        e.preventDefault();
        let x = e.layerX, y = e.layerY, w = e.target.offsetWidth, h = e.target.offsetHeight;
        x = (x - w / 2) / w * 2;
        y = (y - h / 2) / h * 2;
        let to = (Math.abs(x) > Math.abs(y)) ? (x < 0 ? 'left' : 'right') : (y < 0 ? 'top' : 'bottom');
        this.dragTo = 'drag-to-' + to;
        this.layout.root.to = to;
        let capt = this.layout.root.selection.length > 1 ? 'multiple rows' : 'row:' + this.layout.root.dragLayout.data?.name;
        this.capture = `${capt} to row:${this.layout.data.name} - ${to}`;
    },
    _dragleave(e) { this.dragTo = '' },
    _dragend(e) { this.dragTo = '' },
    _drop(e) {
        e.stopPropagation();
        this.dragTo = '';
        execute({ _type: 'move', type: 'move', to: this.layout.root.to, drag: this.layout.root.dragLayout, target: this.layout }, this.structure, true);
    },
    _tapExpand(e) {
        if (!this.hasChildren) return;
        this.layout.expanded = !this.layout.expanded;
        execute({ _type: 'expanded', type: 'expanded', target: this.layout, value: this.layout.expanded }, this.structure, true);
    },
    _tapCheckbox(e) {
        if (!this.designMode) return;
        execute({ _type: 'checked', type: 'checked', target: this.layout, value: !e.target.value }, this.structure, true);
    },
    _pointerdown(e) {
        if (!this.designMode) return;
        const _selection = [...[], ...(this.layout.root.selection || [])];
        this.layout.root.selection = [];
        if (e.metaKey || e.ctrlKey) {
            if (_selection.has(this.layout)) _selection.remove(this.layout);
            else if (!_selection.length || _selection[0].$owner === this.layout.$owner) {
                _selection.add(this.layout);
            }
            this.layout.root.selection = _selection;
        } else if (e.shiftKey) {
            if (!this.layout.root.focused || !_selection.length || this.layout.root.focused.$owner !== this.layout.$owner) {
                this.layout.root.focused = this.layout;
                this.layout.root.selection.add(this.layout);
            } else {
                this.layout.root.selection = [];
                let idx = this.layout.owner.items.indexOf(this.layout),
                    idxf = this.layout.owner.items.indexOf(this.layout.root.focused),
                    start = Math.min(idxf, idx),
                    end = Math.max(idxf, idx);
                for (let i = start; i <= end; i++) this.layout.root.selection.add(this.layout.owner.items[i]);
            }
        } else {
            this.layout.root.focused = this.layout;
            this.layout.root.selection = [this.layout];
        }
    },
    _deleteTab(idx) {
        execute({ _type: 'deleteTab', type: 'deleteTab', to: idx, drag: this.layout, target: this.layout }, this.structure, true);
    },
    _startEditLabel(target) {
        if (!this.designMode) return;
        this._editLabel = true;
        this._targetLayout = target || this.layout;
        this._oldLabelValue = this._targetLayout.label;
    },
    _endEditLabel(target = this._targetLayout) {
        if (!this.designMode) return;
        this._editLabel = false;
        if (this._oldLabelValue !== target.label) {
            execute({ _type: 'setLabel', type: 'setLabel', target, value: target.label }, this.structure, true);
            this._oldLabelValue = this._targetLayout.label;
        }
    },
    _keyEditLabel(e) {
        if (!this.designMode) return;
        if (e.key === 'Enter') {
            if (this._oldLabelValue !== this._targetLayout.label) {
                execute({ _type: 'setLabel', type: 'setLabel', target: this._targetLayout, value: this._targetLayout.label }, this.structure, true);
                this._oldLabelValue = this._targetLayout.label;
            }
        } else if (e.key === 'Escape') {
            this._editLabel = false;
            this._targetLayout.label = this._oldLabelValue;
        }
    },
    _addTab(e) {
        if (!this.designMode) return;
        execute({ _type: 'addTab', type: 'addTab', target: this.layout }, this.structure, true);
    }
})
KERNEL({ is: 'Layout',
    ctor(data, key, root, owner, id, saveKey) {
        this.data = data || {};
        this.key = key || 'items';
        this.root = root || { selection: [] };
        if ((data?.[this.key] && !this.root.data) || this.root.data) {
            this.root.data = this.root.data || data;
            this.root.layout = this.root.layout || this;
            this.root.saveKey = this.root.saveKey || id + '-actions-';
            this.$owner = this.owner = owner || this;
            this.saveKey = saveKey || (this.root.saveKey + (this.id || this.name || this.label || 'root'));
        }
    },
    root: {},
    expanded: false,
    checked: true,
    block: '',
    get items() { return this.data?.[this.key]?.map(i => new Layout(i, this.key, this.root, this)) },
    get id() { return this._id || this.data.id || this.data.name },
    set id(v) { this._id = v },
    get label() { return this._label || this.data.label || this.data.name || this.id },
    set label(v) { this._label = v }
})

const getUUID = function b(a) { return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b) };
const dragImage = new Image();
dragImage.src = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAQCAYAAABQrvyxAAAACXBIWXMAAAsSAAALEgHS3X78AAAAa0lEQVRIiWPU6v91RFv4jwIv+78/DEMIfP7JxHL1LcsDFpDjJ7p8kB5KjoeB/D0CDExDLeSRAcjtTIPHOeSBUQ8MNBj1wECDUQ8MNBj1wECDUQ8MNGACteqGquNBbgc3SUGtuiHZnH7L8gAAtichl6hs6rYAAAAASUVORK5CYII=`;
const dragImage3 = new Image();
dragImage3.src = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAAUCAYAAADC1B7dAAAACXBIWXMAAAsSAAALEgHS3X78AAAA4klEQVRYhWPU6v91RFv4jwIv+78/DEMIfP7JxHL1LcuDqwWsNsiuZgF5ZqLLB+mh5BkYyN8jwMDAwIoixjTUYgYZ8LL/Ew9b/P2J9oTfR2DCTIPCZWQCQfb/LKDUBUplMBNYhponsAFYTIHy1JCOIRhAjqlh4SEYAJUHw8pDDEO9UMAGRj002MGohwY7GH4eArVaB4E7yAIffzFiaAM3wUGtVlDzAVTjDgmfQD3z6SdmAmOB9CdYGUBtoRbbodmNQI4peIwMl5hi/P//P4oCUEwN4Q7fU4yYQIqpodclf8vyAAC+a17T0iNSKwAAAABJRU5ErkJggg==`;

const findById = (item, id) => {
    let items = item?.items;
    if (!items?.length) return;
    return items.reduce((res, i) => {
        if (i.id + '' === id + '') res = i;
        return res || findById(i, id);
    }, undefined);
}
const clearEmptyBlocks = (item) => {
    let items = item?.items;
    if (!items) return;
    items.map(i => {
        if (i.block && i.items?.length === 0) {
            i.owner.items.splice(i.owner.items.indexOf(i), 1);
            clearEmptyBlocks(item);
        }
        clearEmptyBlocks(i);
    })
    items.map(i => { if (i.block && i.items?.length === 0) i.owner.items.splice(i.owner.items.indexOf(i), 1) });
    return;
}
const setChildrenProps = (item, prop, value) => {
    item[prop] = value;
    (item.items || []).forEach(i => setChildrenProps(i, prop, value));
}
const getAllProps = (item, prop, value, arr = []) => {
    (item.items || []).forEach(i => {
        if (i[prop] === value) arr.add(i.id);
        getAllProps(i, prop, value, arr)
        return arr;
    });
    return arr;
}

const execute = (_action, structure, save = false) => {
    // if (_action?.id && findById(structure.layout.$owner, _action.id) || !_action?.target) return;
    if (!_action?.target) return;
    const action = { ..._action };
    if (action.drag && !(action.drag instanceof Layout)) action.drag = findById(structure.layout.$owner, action.drag);
    if (action.target && !(action.target instanceof Layout)) action.target = findById(structure.layout.$owner, action.target);
    if (!action.target) return;
    if (action.selection?.length) {
        let _selection = [];
        if (action.selection?.length > 1)
            action.selection.forEach(id => {
                let item = findById(structure.layout.$owner, id);
                if (item) _selection.push(item);
            })
        action.selection = _selection;
    }
    action.$id = action.$id || getUUID();
    structure.layout.root.$ids = structure.layout.root.$ids || new Set();
    if (structure.layout.root.$ids.has(action.$id) || !fn[action.type]) return;
    fn[action.type](action, structure);
    clearEmptyBlocks(structure.layout.$owner);
    structure.layout.root.$ids.add(action.$id);
    structure.layout.root.lastStuctures = structure.layout.root.lastStuctures || [];
    structure.layout.root.lastStuctures.push(structure);
    if (!structure.designMode || !save) return;
    if (action.drag) action.drag = action.drag.id;
    if (action.target) action.target = action.target.id;
    if (structure.layout.root.selection?.length > 1) action.selection = structure.layout.root.selection.map(i => i.id);
    structure.actions = undefined;
    structure.layout.root.actions = structure.layout.root.actions || {};
    structure.layout.root.actions[structure.saveKey] = structure.layout.root.actions[structure.saveKey] || [];
    structure.layout.root.actions[structure.saveKey].splice(structure.layout.root.actions[structure.saveKey].length, 0, action);
    structure.actions = structure.layout.root.actions[structure.saveKey];
}
const move = (action, structure) => {
    const drag = action?.drag,
        target = action?.target,
        owner = target?.owner;
    if (!drag || !target || drag.$owner !== target.$owner || (action.to === 'tab' && owner.block === 'tab')) return;
    const selection = action.selection?.length > 1 ? action.selection : target.root.selection?.length > 1 ? [...[], ...drag.root.selection] : [drag];
    const idxd = owner.items.indexOf(drag);
    selection.forEach(i => i.owner.items.splice(i.owner.items.indexOf(i), 1));
    const idxt = owner.items.indexOf(target) >= 0 ? owner.items.indexOf(target) : idxd;
    if (target !== drag) {
        owner.items.splice(idxt, 1);
        if (action.to === 'bottom' || action.to === 'right') selection.unshift(target);
        else selection.push(target);
    }
    if (
        (action.to === 'top' || action.to === 'bottom') && owner?.block !== 'column'
        || (action.to === 'left' || action.to === 'right') && owner?.block !== 'row'
        || action.to === 'tab' && owner?.block !== 'tab'
    ) {
        const lbl = action._type === 'group' ? 'group' : 'block';
        const layout = new Layout('', '', drag.root, null, null, structure.saveKey);
        layout.owner = owner;
        layout.$owner = target.$owner;
        layout.block = action.to === 'tab' ? 'tab' : (action.to === 'top' || action.to === 'bottom') ? 'column' : 'row';
        layout.block = action._type === 'group' ? 'group' : layout.block;
        layout.label = action.label = action.to === 'tab' ? 'tab' : (action.to === 'top' || action.to === 'bottom') ? `${lbl} (v)` : `${lbl} (h)`;
        layout.id = action.id = action.id || getUUID();
        layout.expanded = true;
        selection.forEach(i => i.owner = layout);
        layout.items = selection;
        if (action.to === 'tab') {
            const tab = new Layout('', '', drag.root, null, null, structure.saveKey);
            tab.block = 'tabs';
            tab.label = 'tabs';
            tab.expanded = true;
            tab.id = action.tabId || getUUID();
            action.tabId = tab.id;
            tab.owner = owner;
            tab.$owner = target.$owner;
            layout.owner = tab;
            tab.items = [layout];
            owner.items.splice(idxt, 0, tab);
        } else {
            owner.items.splice(idxt, 0, layout);
        }
    } else {
        selection.forEach((i, idx) => {
            i.owner = owner;
            i.$owner = target.$owner;
            owner.items.splice(idxt + idx, 0, i);
        })
    }
}
const ungroup = (action) => {
    const target = action.target,
        block = target?.owner,
        owner = block?.owner;
    if (!target || !block?.block || !owner) return;
    const selection = action.selection || target.root.selection?.length ? [...[], ...target.root.selection] : [target];
    const idxt = owner.items.indexOf(block);
    selection.forEach(i => {
        block.items.splice(block.items.indexOf(i), 1);
        i.owner = owner
    });
    owner.items.splice(idxt, 0, ...selection);
}
const deleteTab = (action) => {
    const target = action.target,
        tabs = target?.block,
        owner = target?.owner;
    if (!target || !tabs || !owner) return;
    let idxt = owner.items.indexOf(target);
    if (target.items?.[action.to]) {
        (target.items[action.to].items || []).forEach((i, idx) => {
            target.items[action.to].items.splice(idx, 1);
            i.owner = owner;
            owner.items.splice(idxt + idx, 0, i);
        })
        target.items.splice(target.items.indexOf(target.items?.[action.to]), 1);
    }
    idxt = owner.items.indexOf(target);
    if (target.items.length === 0) owner.items.splice(idxt, 1);
}
const addTab = (action) => {
    const target = action.target;
    const tab = new Layout('', '', target.root);
    tab.block = 'tab';
    tab.label = 'tab';
    tab.expanded = true;
    tab.id = action.tabId || getUUID();
    action.tabId = tab.id;
    tab.owner = target;
    tab.$owner = target.$owner;
    target.items.splice(target.items.length, 0, tab);
}
const checked = (action) => {
    const target = action.target;
    setChildrenProps(target, 'checked', action.value);
}
const expanded = (action) => {
    const target = action.target;
    target.expanded = action.value;
}
const clearView = (structure) => {
    structure.actions = undefined;
    localStorage.removeItem('oda-layout-designer-structure/' + structure.saveKey);
}
const setLabel = (action) => {
    action.target.label = action.value;
}

const fn = { move, ungroup, deleteTab, addTab, checked, expanded, clearView, setLabel };
