KERNEL({ is: 'Layout',
    ctor(data, key = 'items', owner, saveKey) {
        this.data = data || {};
        this.key = key;
        this.$owner = this.owner = owner || this;
        this.saveKey = saveKey || this.id;
    },
    $expanded: false,
    checked: true,
    block: '',
    get items() {
        const items = this.data?.[this.key];
        if (items?.then) {
            return items.then(items => {
                this.items = items.map(i => new Layout(i, this.key, this))
            })
        }
        return items?.map(i => new Layout(i, this.key, this))
    },
    get label() {
        return this.data?.label || this.data?.name;
    },
    get id() { return this._id || this.data.id || this.data.name || this.data.label },
    set id(v) { this._id = v },
})

ODA({ is: 'oda-layout-designer', extends: 'oda-layout-designer-structure',
    template: `
        <style>
            :host{
                overflow-x: hidden;
                overflow-y: auto;
                font-family: system-ui;
            }
        </style>
    `,
    props: {
        designMode: false,
        keys: '',
        itree: false
    },
    data: null,
    get rootSaveKey() {
        return this.id || 'layout-designer';
    },
    get layout() {
        return this.data && new Layout(this.data, this.keys, null, 'root');
    },
    state: null,
    attached() {
        this.state = { selection: [] };
        this.state.layout = this.layout;
        setTimeout(() => {
            if (this._itree) {
                this._itree.layout = this.layout;
                this._itree.state = this.state;
            }
        }, 300);
    }
})

ODA({ is: 'oda-layout-designer-structure',
    template: `
        <style>
            :host{
                @apply --vertical;
                @apply --no-flex;
                overflow: visible;
                
            }
        </style>
        <oda-layout-designer-container ~for="layout?.items" :layout="item" :icon-size :structure="this"></oda-layout-designer-container>
    `,
    props: {
        actions: {
            type: Array,
            save: true,
            set(n) {
                if (!n || this.itree || this._init) return;
                this._init = true;
                n.forEach(i => execute(i, this, this.state, false));
                this.state.actions = this.state.actions || {};
                this.state.actions[this.saveKey] = n;
            }
        },
    },
    layout: null,
    iconSize: 32,
    editTemplate: 'span',
    structureTemplate: 'oda-layout-designer-structure',
    observers: [
        function setSaveKey(layout) {
            if (!layout) return;
            this.saveKey = this.rootSaveKey + '-' + layout.saveKey;
            layout.structure = this;
        }
    ]
})

ODA({ is: 'oda-layout-designer-container', imports: '@oda/icon, @oda/checkbox',
    template: `
        <style>
            :host{
                @apply --vertical;
                @apply --no-flex;
                position: relative;
                box-shadow: {{designMode ? '0 1px 0 0 lightgray' : 'unset'}};
                flex: {{!itree && layout?.owner?.block === 'row' ? 1 : 0}};
            }
            .structure{
                margin-left: {{!itree &&  (layout?.block || layout?.owner?.block) ? 0 : iconSize / 2}}px;
                border-left: {{!itree && (layout?.block || layout?.owner?.block) ? 0 : '1px dashed'}};
                flex-direction: {{itree ? 'column' : layout.block}};
                flex: {{!itree && layout.block === 'row' ? 1 : 0}};
            }
            .row {
                position: relative;
                align-items: center;
                box-shadow: {{designMode ? '0 1px 0 0 lightgray' : 'unset'}};
            }
            .focused { @apply --focused; }
            .active { @apply --active; }
            .selected { @apply --selected; }
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
                width: 150px;
            }
        </style>
        <div ~if="itree" class="row horizontal" ~class="{focused, active: selected}" @click="_pointerdown">
            <oda-icon ::icon-size :icon="(layout?.items?.length)?(layout?.$expanded?'icons:chevron-right:90':'icons:chevron-right'):''" @tap="_tapExpand"></oda-icon>
            <oda-checkbox :value="layout.checked" fill="gray" @tap="_tapCheckbox" ~style="{cursor: designMode ? 'pointer' : 'unset'}"></oda-checkbox>
            <label>{{layout?.label}}</label>
        </div>
        <div ~if="!itree && !layout?.block && layout?.checked" class="row horizontal" :draggable ~class="{focused, active: selected, 'drag-to': dragTo, [dragTo]: dragTo}" :capture @click="_pointerdown">
            <oda-icon ::icon-size :icon="(layout?.items?.length)?(layout?.$expanded?'icons:chevron-right:90':'icons:chevron-right'):''" @tap="_tapExpand"></oda-icon>
            <label>{{layout?.label}}</label>
            <div class="flex" ~is="layout?.$template || editTemplate" :layout>
                
            </div>
        </div>
        <div ~show="layout?.$expanded" ~if="layout?.items?.length" ~is="layout?.$structure || structureTemplate" :layout class="structure flex">
            
        </div>
    `,
    layout: null,
    structure: {},
    dragTo: '',
    capture: '',
    observers: [function setStructure(structure) { this.layout.structure = structure }],
    listeners: { 'dragstart': '_dragstart', 'dragover': '_dragover', 'dragleave': '_dragleave', 'dragend': '_dragend', 'drop': '_drop' },
    get draggable() {
        return this.designMode ? 'true' : 'false'
    },
    get focused() {
        return this.designMode && this.state?.focused === this.layout
    },
    get selected() {
        return this.designMode && this.state?.selection?.includes(this.layout)
    },
    get show() {
        return this.layout?.checked && this.layout?.owner?.checked && !this.layout?.block
    },
    _dragstart(e) {
        if (!this.designMode) return;
        e.stopPropagation();
        if (this.state.selection.length > 1 && !this.state.selection.has(this.layout))
            this.state.selection = [];
        this.state.dragLayout = this.layout;
        e.dataTransfer.setDragImage(this.state.selection.length > 1 ? dragImage3 : dragImage, -20, 7);
    },
    _dragover(e) {
        if (!this.designMode) return;
        e.stopPropagation();
        this.dragTo = 'drag-to-error';
        if (
            this.layout.$owner !== this.state.dragLayout.$owner
            || this.layout === this.state.dragLayout
            || this.state.selection > 1 && this.state.selection.includes(this.layout)
            || this.state.dragLayout.block === 'tabs' && this.layout.owner.owner === this.state.dragLayout
            || this.state.dragLayout.block === 'group' && this.layout.owner === this.state.dragLayout
        ) return;
        e.preventDefault();
        let x = e.layerX, y = e.layerY, w = e.target.offsetWidth, h = e.target.offsetHeight;
        x = (x - w / 2) / w * 2;
        y = (y - h / 2) / h * 2;
        let to = (Math.abs(x) > Math.abs(y)) ? (x < 0 ? 'left' : 'right') : (y < 0 ? 'top' : 'bottom');
        this.dragTo = 'drag-to-' + to;
        this.state.to = to;
        let capt = this.state.selection.length > 1 ? 'multiple rows' : 'row:' + this.state.dragLayout.data?.name;
        this.capture = `${capt} to row:${this.layout.data.name} - ${to}`;
    },
    _dragleave(e) { this.dragTo = '' },
    _dragend(e) { this.dragTo = '' },
    _drop(e) {
        e.stopPropagation();
        this.dragTo = '';
        execute({ _type: 'move', type: 'move', to: this.state.to, drag: this.state.dragLayout, target: this.layout }, this.structure, this.state, true);
    },
    _tapExpand(e) {
        if (!this.layout?.items?.length) return;
        this.layout.$expanded = !this.layout.$expanded;
        if (!this.designMode) return;
        execute({ _type: 'expanded', type: 'expanded', target: this.layout, value: this.layout.$expanded }, this.structure, this.state, true);
    },
    _tapCheckbox(e) {
        if (!this.designMode) return;
        execute({ _type: 'checked', type: 'checked', target: this.layout, value: !e.target.value }, this.structure, this.state, true);
    },
    _pointerdown(e) {
        if (!this.designMode) return;
        const _selection = [...[], ...(this.state.selection || [])];
        this.state.selection = [];
        if (e.metaKey || e.ctrlKey) {
            if (_selection.has(this.layout)) _selection.remove(this.layout);
            else if (!_selection.length || _selection[0].$owner === this.layout.$owner) {
                _selection.add(this.layout);
            }
            this.state.selection = _selection;
        } else if (e.shiftKey) {
            if (!this.state.focused || !_selection.length || this.state.focused.$owner !== this.layout.$owner) {
                this.state.focused = this.layout;
                this.state.selection.add(this.layout);
            } else {
                this.state.selection = [];
                let idx = this.layout.owner.items.indexOf(this.layout),
                    idxf = this.layout.owner.items.indexOf(this.state.focused),
                    start = Math.min(idxf, idx),
                    end = Math.max(idxf, idx);
                for (let i = start; i <= end; i++) this.state.selection.add(this.layout.owner.items[i]);
            }
        } else {
            this.state.focused = this.layout;
            this.state.selection = [this.layout];
        }
    }
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

const execute = (_action, structure, state, save = false) => {
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
    state.$ids = state.$ids || new Set();
    if (state.$ids.has(action.$id) || !fn[action.type]) return;
    fn[action.type](action, structure, state);
    // clearEmptyBlocks(structure.layout.$owner);
    state.$ids.add(action.$id);
    state.lastStuctures = state.lastStuctures || [];
    state.lastStuctures.push(structure);
    if (!structure.designMode || !save) return;
    if (action.drag) action.drag = action.drag.id;
    if (action.target) action.target = action.target.id;
    if (state.selection?.length > 1) action.selection = state.selection.map(i => i.id);
    structure.actions = undefined;
    state.actions = state.actions || {};
    state.actions[structure.saveKey] = state.actions[structure.saveKey] || [];
    state.actions[structure.saveKey].splice(state.actions[structure.saveKey].length, 0, action);
    structure.actions = state.actions[structure.saveKey];
}
const move = (action, structure, state) => {
    const drag = action?.drag,
        target = action?.target,
        owner = target?.owner;
    if (!drag || !target || drag.$owner !== target.$owner || (action.to === 'tab' && owner.block === 'tab')) return;
    const selection = action.selection?.length > 1 ? action.selection : state.selection?.length > 1 ? [...[], ...state.selection] : [drag];
    const idxd = owner.items.indexOf(drag);
    selection.forEach(i => i.owner.items.splice(i.owner.items.indexOf(i), 1));
    const idxt = owner.items.indexOf(target) >= 0 ? owner.items.indexOf(target) : idxd;
    owner.items.splice(idxt, 1);
    if (action.to === 'bottom' || action.to === 'right') {
        selection.unshift(target);
    } else {
        selection.push(target);
    }
    if (
        (action.to === 'top' || action.to === 'bottom') && owner?.block !== 'column'
        || (action.to === 'left' || action.to === 'right') && owner?.block !== 'row'
    ) {
        const lbl = 'block';
        const layout = new Layout('', '', null, structure.saveKey);
        layout.owner = owner;
        layout.$owner = target.$owner;
        layout.block = action.to === action.to === 'top' || action.to === 'bottom' ? 'column' : 'row';
        layout.label = action.label = action.to === 'tab' ? 'tab' : (action.to === 'top' || action.to === 'bottom') ? `${lbl} (v)` : `${lbl} (h)`;
        layout.id = action.id = action.id || getUUID();
        layout.$expanded = true;
        selection.forEach(i => i.owner = layout);
        layout.items = selection;
        owner.items.splice(idxt, 0, layout);
    } else {
        selection.forEach((i, idx) => {
            i.owner = owner;
            i.$owner = target.$owner;
            owner.items.splice(idxt + idx, 0, i);
        })
    }
}
const checked = (action) => {
    const target = action.target;
    setChildrenProps(target, 'checked', action.value);
}
const expanded = (action) => {
    const target = action.target;
    target.$expanded = action.value;
}

const fn = { move, checked, expanded };
