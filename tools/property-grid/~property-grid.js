import '../../components/grids/table/table.js';
ODA({is: "oda-property-grid", extends: 'oda-table',
    props: {
        lazy: true,
        autoWidth: true,
        allowFocus: true,
        showHeader: true,
        showFooter: true,
        colLines: true,
        rowLines: true,
        contextItem: {
            type: Object,
            set(contextItem) {
                this.inspectedObject = contextItem;
            }
        },
        columns: {
            type: Array,
            default() {
                return [
                    { name: 'name', template: 'oda-property-grid-name-cell', treeMode: true, fix: 'left' },
                    { name: 'value', template: 'oda-property-grid-value-cell', header: 'oda-property-grid-value-header', width: 'auto' },
                    { name: 'category', hidden: true },
                ]
            },
        },
        inspectedObject: {
            type: [HTMLElement, Object, Element, Array],
        },
        expertMode: false,
        editMode: true,
        _emptyItem: {
            type: Object,
            default: { template: 'oda-table-loading' }
        },
        _categories: [],
        silent: true,
        items: {
            type: Array,
            observer: '_itemsChanged'
        },
    },
    listeners: {
        expand: "_onExpand",
        dragend: '_onDragEnd'
    },
    observers: [
        '_buildDataSet(inspectedObject, expertMode, editMode)',
    ],
    ODANTPromise: class ODANTPromise {
        constructor(promise, silent) {
            this['[[PromiseStatus]]'] = 'pending';
            this['[[PromiseValue]]'] = 'undefined';
            promise.then(
                (res) => {
                    this['[[PromiseStatus]]'] = 'resolved';
                    this['[[PromiseValue]]'] = res;
                },
                (e) => {
                    this['[[PromiseStatus]]'] = 'rejected';
                    this['[[PromiseValue]]'] = e;
                    if (!silent) {
                        console.error(e);
                    }
                }
            );
        }
    },
    _itemsChanged(items) {
        if (!this._categories || this._categories.length === 0) {
            this._categories = items.filter(i => i.$col);
            this._categories.forEach((cat, idx) => {
                cat.$expanded = idx === 0 || this.editMode;
            });
            this._refresh();
        }
        if (items && items.length > 0) {
            this.updateChanges(items);
        }
    },
    updateChanges(items = this.items) {
        items = items.filter((i) => i.hasOwnProperty('io'));
        // items.forEach(i =>{
        //     if(i.$expanded){
        //         const updatedItem = this._buildProp(i.owner, i.proto, i.name, i.descriptor, i.items);
        //         this._onExpand(true, { value: updatedItem });
        //         Object.assign(i, updatedItem);
        //     }else{
        //         const value = this._getValue(i.name, i.owner, true);
        //         i.io = value;
        //     }
        // });
        items.forEach((i, idx) => {
            if (!(i.io instanceof Error) && !(i.io instanceof Promise) && !(i.io instanceof this.ODANTPromise)) {
                const value = this._getValue(i.name, i.owner, true);
                if (typeof i.io === typeof value && (typeof i.io === 'number' || typeof i.io === 'string' || typeof i.io === 'boolean') && i.io !== value) {
                    i.io = value;
                } else {
                    const isObjects = typeof i.io === 'object' && typeof value === 'object';
                    if (!Object.is(i.io, value)) {
                        const isNoNulls = i.io !== null && value !== null;
                        const isDifferent = isObjects && isNoNulls && this._checkDifferent(i.io, value);
                        if (!isObjects || isDifferent) {
                            const updatedItem = this._buildProp(i.owner, i.proto, i.name, i.descriptor, i.items);
                            this._onExpand(true, { value: updatedItem });
                            Object.assign(i, updatedItem);
                            // this._onExpand(true, { value: i });
                        }
                    }
                    if (isObjects && !(i.items && i.items.length > 0 && i.items[0] && i.items[0] === this._emptyItem)) {
                        let ioNames = [];
                        let proto = i.io;
                        while (proto) {
                            Object.getOwnPropertyNames(proto).forEach(n => {
                                if (!this._validate(n) && !ioNames.includes(n)) {
                                    const desc = Object.getOwnPropertyDescriptor(proto, n);
                                    if (desc && typeof (desc.value) !== 'function') {
                                        ioNames.push(n);
                                    }
                                }
                            });
                            proto = Object.getPrototypeOf(proto);
                        }
                        // const updatedItem = this._buildProp(i.owner, i.proto, i.name, i.descriptor, i.items);
                        // this._onExpand(true, { value: updatedItem });
                        // const ioNames = Object.getOwnPropertyNames(updatedItem.items).filter(el => !['__ob__', 'length'].includes(el));

                        if (!Array.isArray(i.items)) i.items = [];
                        const itemsNames = Object.getOwnPropertyNames(i.items).filter(el => !['__ob__', 'length'].includes(el));
                        if (ioNames.length !== itemsNames.length) {
                            this._onExpand(true, { value: i });
                        }
                    }
                }
            }
        });
    },
    _checkDifferent(o1, o2) {
        if (o1 && o2) {
            try {
                const so1 = JSON.stringify(o1);
                const so2 = JSON.stringify(o2);
                return so1 !== so2;
            } catch (e) {
                return Object.keys(o1).some(k => o1[k] !== o2[k]) || Object.keys(o2).some(k => o1[k] !== o2[k]);
            }
        } else {
            return true;
        }
    },
    _buildProxy(objs) {
        const getProps = (arr) => {
            const props = new Set();
            arr.forEach(i => {
                let proto = i;
                while (proto) {
                    Object.getOwnPropertyNames(proto).forEach(p => {
                        if (this._validate(p) || p === 'properties') {
                            props.add(p);
                        }
                    });
                    proto = Object.getPrototypeOf(proto);
                }
            });
            arr.forEach(i => {
                let proto = i;
                while (proto) {
                    Object.getOwnPropertySymbols(proto).forEach(s => {
                        props.add(s);
                    });
                    proto = Object.getPrototypeOf(proto);
                }
            });
            arr.forEach((i, idx) => {
                [...props].forEach(p => {
                    if (!(p in i) && p !== 'properties') {
                        props.delete(p);
                    };
                });
            });
            return [...props];
        };
        const handler = {
            get: (obj, key) => {
                if (key === '__ob__') return objs[0][key];
                if (getProps(objs).includes(key)) {
                    const e = objs.find(i => {
                        if (typeof i[key] !== 'undefined') return true;
                    });
                    if (e) {
                        if (typeof e[key] === 'object') {
                            const arr = objs.reduce((res, i) => {
                                const o = i[key] || {};
                                i[key] = o;
                                res.push(i[key]);
                                return res;
                            }, []);
                            return this._buildProxy(arr);
                        } else return e[key];
                    }
                }
            },
            set(obj, key, v) {
                // if (key === '__ob__') {
                //     objs[0][key] = v;
                //     return true;
                // }
                // if (typeof v === 'object') {
                //     const p = new Proxy(v, {
                //         get(t, k) {
                //             return Reflect.get(t, k);
                //         },
                //         set(t, k, v) {
                //             return Reflect.set(t, k, v);
                //         }
                //     });
                //     objs.forEach(e => {
                //         e[key] = p;
                //     });
                //     return true;
                // }
                objs.forEach(e => {
                    if (typeof v === 'object') e[key] = Object.assign({}, v);
                    else e[key] = v;
                });
                return true;
            },
            deleteProperty(obj, key) {
                objs.forEach(e => {
                    delete e[key];
                });
                return true;
            },
            enumerate(obj, key) {
                return getProps(objs).filter(p => typeof objs[0][p] !== 'function');
            },
            ownKeys(obj, key) {
                return getProps(objs).filter(p => typeof objs[0][p] !== 'function');
            },
            has(obj, key) {
                return getProps(objs).includes(key);
            },
            defineProperty(obj, key, desc) {
                objs.forEach(e => {
                    Object.defineProperty(e, key, desc);
                });
                return true;
            },
            getOwnPropertyDescriptor(obj, key) {
                return Object.getOwnPropertyDescriptor(objs[0], key);
            },
        };
        const obj = {};
        return new Proxy(obj, handler);
    },
    _buildDataSet(io, expertMode, editMode) {
        this._categories = [];
        if (this.columns && (!this.groups || this.groups.length === 0)) {
            this.groups.push(this.columns.find(c => c.name === 'category'));
        }
        this.dataSet.splice(0, this.dataSet.length);
        if (Array.isArray(io)) io = this._buildProxy(io);
        this._onExpand(undefined, { value: { io: io, items: this.dataSet } });
        this._refresh();
    },
    _getDesc(obj, name, props) {
        return !props ? Object.getOwnPropertyDescriptor(obj, name) : props[name];
    },
    _onExpand(e, d) {
        if (d && d.value && d.value.items) {
            const prop = d.value;
            if (typeof prop.io === 'object') {
                const newItems = [];
                let proto = prop.io;
                while (proto) {
                    if (proto.properties) {
                        this._setProps(prop.io, proto, prop.items, newItems);
                    }
                    if (this.expertMode || (e && !proto.properties) || (proto === prop.io && proto && proto.constructor && proto.constructor.name === 'Object')) {
                        this._setExpertProps(prop.io, proto, prop.items, newItems);
                    }
                    proto = Object.getPrototypeOf(proto);
                }
                prop.items.splice(0, prop.items.length);
                Object.assign(prop.items, newItems);
                if (prop.items.length > 0)
                    prop.allowExpand = true;
                else
                    prop.allowExpand = false;
                if (prop.owner instanceof this.ODANTPromise || prop.readOnly) {
                    const lng = prop.items.find(i => i.name === 'length');
                    if (lng) lng.readOnly = lng.disabled = true;
                }
                prop.items.sort((a, b) => {
                    if (isNaN(a.name) || isNaN(b.name))
                        return (a.label.toLowerCase()).localeCompare(b.label.toLowerCase());
                    return Number(a.name) > Number(b.name) ? 1 : -1;
                });
            } else if (!['object', 'array'].includes(prop.type)) {
                delete prop.items;
            }

        }
    },
    _setProps(io, proto, props = [], newProps) {
        for (const name in proto.properties) {
            if (this._validate(name) && !(newProps.some(p => p.name === name))) {
                const desc = proto.properties[name];
                if (desc) {
                    if (desc.hide === true || (typeof desc.hide === 'function') && desc.hide()) continue;
                    if (this.editMode) if (!(desc.set || !desc.readOnly)) continue;
                }
                const oldProp = props.find(p => p.name === name) || {};
                const prop = this._buildProp(io, proto, name, desc, oldProp.items);
                newProps.push(Object.assign(oldProp, prop));
            }
        }
    },
    _setExpertProps(io, proto, props = [], newProps) {
        Object.getOwnPropertyNames(proto).forEach((name) => {
            if (this._validate(name) && !(newProps.some(p => p.name === name))) {
                const desc = Object.getOwnPropertyDescriptor(proto, name);
                if (desc && typeof (desc.value) !== 'function') {
                    if (this.editMode) if (!(desc.writable || desc.set || !desc.readOnly)) return;
                    const oldProp = props.find(p => p.name === name) || {};
                    const prop = this._buildProp(io, proto, name, desc, oldProp.items);
                    newProps.push(Object.assign(oldProp, prop));
                }
            }
        });
    },
    _buildProp(io, proto, name, desc, items) {
        let label = (io.properties && io.properties[name] && io.properties[name].label) || name || '';
        if (Array.isArray(io) && !isNaN(name))
            label = `[${label}]`;
        const value = this._getValue(name, io);
        let prop = {
            name: name,
            editor: desc && desc.editor,
            label: desc && desc.reflectToAttribute ? this.toKebabCase(label) : label,
            io: value,
            category: (desc
                ? (io !== proto
                    ? this.getConstructorName(proto)
                    : desc.category)
                : proto.properties && proto.properties[name] && proto.properties[name].category)
                || (' ' + (proto.localName ? proto.localName : this.getConstructorName(proto))),
            inherit: (proto && proto.constructor && this.getConstructorName(proto)) || (io && io.constructor && this.getConstructorName(io)),
            owner: io,
            descriptor: desc,
            proto: proto
        };
        if (value instanceof Error) {
            prop.type = 'Error';
            prop.readOnly = prop.disabled = false;
        } else {
            prop.type = (desc && desc.type && desc.type.name)
                ? desc.type.name.toLowerCase()
                : ((io && typeof prop.io !== 'undefined') ? typeof prop.io : 'string');
            prop.readOnly = prop.disabled = Boolean(desc) && !(desc.writable || desc.set || !desc.readOnly);
            if (name.startsWith('[[') && name.endsWith(']]')) prop.disabled = true;
            prop.enum = (desc && desc.enum) || [];
            // prop.editor = desc && desc.editor;
        }
        const check = this._checkItems(prop.io);
        if (check) prop.items = items || [this._emptyItem];
        return prop;
    },
    _checkItems(prop) {
        if (!prop || typeof prop !== 'object') return false;
        let proto = prop;
        while (proto) {
            for (const name in proto.properties) {
                if (this._validate(name)) {
                    const desc = proto.properties[name];
                    if (desc && !(desc.writable || desc.set || !desc.readOnly) && this.editMode)
                        continue;
                    return true;
                }
            }
            // if (proto.behaviors) {
            //     for (let i = 0; i < proto.behaviors.length; i++) {
            //         for (const name in proto.behaviors[i].properties) {
            //             if (!this._validate(name)) {
            //                 const desc = proto.behaviors[i][name];
            //                 if (desc && !(desc.writable || desc.set || !desc.readOnly) && this.editMode) continue;
            //                 return true;
            //             }
            //         }
            //     }
            // }
            const names = Object.getOwnPropertyNames(proto);
            for (let i = 0; i < names.length; i++) {
                if (this._validate(names[i])) {
                    const desc = Object.getOwnPropertyDescriptor(proto, names[i]);
                    if (desc && typeof (desc.value) !== 'function') {
                        if (desc && !(desc.writable || desc.set || !desc.readOnly) && this.editMode)
                            continue;
                        return true;
                    }
                }
            }
            proto = Object.getPrototypeOf(proto);
        }
        return false;
    },
    _validate(name, names = []) {
        if (!name) return false;
        if (names.includes(name)) return false;
        if (/^((o_)|_|(outerHTML)|(innerHTML)|(properties))/.test(name)) return false;
        return true;
    },
    _getValue(name, owner, silent = this.silent) {
        try {
            const value = owner[name];
            if (value instanceof Promise) {
                return new this.ODANTPromise(value, silent);
            }
            return value;
        } catch (e) {
            if (!silent) {
                console.error(e);
            }
            return e;
        }
    },
    toKebabCase(string) {
        return string.replace(/([a-z])([A-Z])/g, '$1-$2').trim().replace(/\s+/g, '-').toLowerCase();
    },
    getConstructorName(obj) {
        let p = obj.constructor;
        let name = p.name;
        while (!name && p.__proto__) {
            p = p.__proto__;
            name = p.name;
        }
        return name;
    }
})



ODA({
    is: 'oda-property-grid-value-header',
    extends: 'oda-table-cell-base', template:`
             <style>
                :host{
                    justify-content: flex-end;
                }
            </style>
            <oda-button allow-toggle ::toggled="table.expertMode" icon="social:school" title="Expert mode"></oda-button>`
})

// <link rel="import" href="/web/lib/lists/dropdown-list/dropdown-list.html">
// <link rel="import" href="/web/lib/button/button.html">
// <link rel="import" href="/web/lib/checkbox/checkbox.html">
// <link rel="import" href="/web/lib/inputs/number/number.html">
// <link rel="import" href="/web/lib/inputs/string/string.html">


ODA({
    is: 'oda-property-grid-value-cell',
    extends: 'oda-table-cell-base', template: `
            <style>
                :host{
                    @apply --flex;
                    justify-content: center;
                    align-self: stretch;
                }
                :host>*{
                    @apply --flex;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                :host>input{
                    border: none;
                    outline: none;
                    min-width: 0;
                    padding: 4px;
                }
                :host>input[readonly]{
                    opacity: .5;
                }
                .dropdown{
                    padding: 0px;
                    opacity: .5;
                }
                .dropdown:hover{
                    opacity: 1;
                }
            </style>
            <div ~if="item.type !== 'Error'" ref="editor" :is="editor" :value="value" :item="item" @input="_input" @value-changed="_valueChanged" :size="iconSize" class="flex" @focus="isFocused = true" @blur="isFocused = false" :readonly="disabled" style="align-self: stretch;"></div>
            <div :else :text="item && item.io && item.io.message" class="error"></div>
            <oda-button class="dropdown no-flex" ~if="!disabled && hasList" :size="iconSize" icon="icons:arrow-drop-down" @tap.stop="_showList(null)"></oda-button>
            `,
    props: {
        isFocused: false,
        disabled: false,
        editor: 'input',
        hasList: {
            default: false,
            get() {
                const item = this.item;
                return item.enum && item.enum.length > 0;
            }
        },
        item: {
            async set(item) {
                if (item) {
                    this.editor = await this._getEditor(item.type, item.editor);
                }
            }
        },
        value: {
            type: [String, Boolean, Number],
            get() {
                if (this.isFocused) return this.$refs.editor.value;
                if (this.item && this.item.owner && this.item.name) {
                    const val = this.item.owner[this.item.name];
                    if (!(val instanceof Object)) {
                        this.disabled = this.item.readOnly;
                        return val;
                    }
                    this.disabled = true;
                    return `${this.table.getConstructorName(val)}${Array.isArray(val) ? `[${val.length}]` : ''}`;
                }
                return undefined;
            },
        }
    },
    listeners: {
        focus(e) {
            this.$refs.editor.focus();
        }
    },
    keyBindings: {
        home: '_first',
        end: '_last',
        ArrowUp: '_before',
        ArrowDown: '_next',
        enter: '_result'
    },
    async _getEditor(type, src) {
        if (src) {
            try {
                return ODA.loadComponent(src);
            } catch (e) {
                return this._getEditorFromType(type);
            }
        }
        return this._getEditorFromType(type);
    },
    _getEditorFromType(type) {
        switch (type) {
            case 'boolean': return 'oda-checkbox';
            case 'number': return 'oda-number-input';
            case 'array':
            case 'object': return 'oda-object-editor';
            default: return 'oda-string-input';
        }
    },
    async _valueChanged(e) {
        if (this.item && this.editor === await this._getEditor(this.item.type, this.item.editor)) {
            const target = e.currentTarget || e.detail.src;
            if (target.localName === 'input') return;
            this._input(e);
        }
    },
    _first(e) {
        if (this.dd) {
            e.stopPropagation();
            this.dd.first();
        }
    },
    _last(e) {
        if (this.dd) {
            e.stopPropagation();
            this.dd.last();
        }
    },
    _result(e) {
        if (this.dd) {
            e.stopPropagation();
            this.dd._result();
        }
    },
    _next(e) {
        if (this.dd) {
            e.stopPropagation();
            this.dd.next();
        }
    },
    _before(e) {
        if (this.dd) {
            e.stopPropagation();
            this.dd.before();
        }
    },
    async _showList(filter) {
        if (filter === null && this.dd) {
            this._closeDropDown();
            return;
        }
        try {
            let list = this.item.enum;
            if (list.length) {
                if (!this.dd || !this.dd.opened) {
                    this.dd = ODA.createElement('oda-dropdown-list', { parent: this });
                    this.dd.filter = filter;
                    this.dd.items = list;
                    const res = await this.dd.show(this.value);
                    this.$refs.editor.value = res;
                    this._setValue(res);
                    this._closeDropDown();
                }
                else {
                    this.dd.filter = filter
                }
            }
            else {
                this._closeDropDown();
            }
        }
        catch (e) {
            this._closeDropDown();
        }
    },
    _input(e) {
        if (this.item.readOnly) return;
        if (this.$refs.editor.focused || this.$refs.editor.localName === 'oda-checkbox') {
            const target = e.currentTarget || e.detail.src;
            if (target) this._setValue(target.value);
            if (!this.hasList) return;

            if (target.value) this._showList(target.value);
            else this._closeDropDown();
        }
    },
    _closeDropDown() {
        if (this.dd) {
            this.dd.close();
            this.dd = null;
        }
    },
    _setValue(val) {
        if (!this.item || ['array', 'object'].includes(this.item.type)) return;
        if (this.item.owner && this.item.name && !this.item.readOnly) {
            const owner = this.item.owner;
            const name = this.item.name;
            if (owner[name] !== val) owner[name] = val;
        }
    }
})

ODA({
    is: 'oda-property-grid-name-cell',
    extends: 'oda-table-cell-base', template:`
              <style>
                :host {
                    @apply --flex;
                }
                span{
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            </style>
            <span :style="{opacity: item.disabled ? '.5' : ''}" :title="label">{{label}}</span>
            `,
    props: {
        label: {
            type: String,
            get() {
                if (this.item) {
                    return this.item.label;
                }
                return '';
            },
        },
    }
})

ODA({
    is: 'oda-object-editor', template: `
            
            <style>
                :host{
                    @apply --horizontal;
                }
                div{
                    @apply --flex;
                    padding: 4px;
                    font-size: 13px;
                    opacity: .5;
                    align-self: center;
                }
            </style>
            <div v-text="value"></div>`,
    props: {
        value: String,
        item: {
            type: Object,
            set(v) {
                if (v) {
                    this.io = v.io;
                } else {
                    this.io = null;
                }
            }
        },
        table: Object,
        io: {
            type: [Array, Object, Number, String],
        },
    },
    observers: [
        function changes(value, io) {
            this.debounce('debounce', () => {
                if (this.table) {
                    const i = this.item;
                    const updatedItem = this.table._buildProp(i.owner, i.proto, i.name, i.descriptor, i.items);
                    if (i.$expanded) this.table._onExpand(true, { value: updatedItem });
                    Object.assign(i, updatedItem);

                    // this.table.updateChanges();
                    this.table._refresh();
                    // this.async(() => {
                    //     this.table._refresh();
                    // }, 100);
                }
            }, 10);
        }
    ],
    attached() {
        // this.item = this.domHost.item;
        // this.io = this.item.io;
        this.table = this.domHost.table;
    }
})