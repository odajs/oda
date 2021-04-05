import '../../components/grids/table/table.js';
import '../../components/inputs/basic/basic.js';

class InspectorItem {
    constructor({ name, obj, proto, desc = null, expert, owner = null }) {
        this.$level = undefined;
        this.$parent = undefined;
        this._owner = owner;
        this._expert = expert;
        this._expanded = undefined;
        this._items = [];
        this.name = name;
        this.label = name;
        this._io = obj;
        this.desc = desc;
        this.hidden = this.desc.hidden || this.desc.hide || this.desc.enumerable === false;
        this.editor = this.desc?.editor;
        this.editorUrl = this.desc?.editorUrl;
        // console.log(name);
        // console.log((this.desc?.category ? this.desc?.category : proto?.constructor?.__model__?.is || proto?.constructor?.name) || 'properties');
        // console.log('');
        this.category = (this.desc?.category ? this.desc?.category : proto?.constructor?.__model__?.is || proto?.constructor?.name) || 'properties';
        const val = this.value;
        this._isArray = Array.isArray(val);
        const type = this.desc?.type?.name || (this.desc?.value || this.desc?.default)?.constructor.name || typeof val || 'string';
        if (val instanceof Promise || val instanceof ODANTPromise) {
            this.type = `Promise<${type}>`
        } else {
            this.type = type;
        }
    }
    get readOnly() {
        return this.desc.readOnly || this.desc.disabled || (!('value' in this.desc) && !('set' in this.desc)) || this._owner?.readOnly;
    }
    get value() {
        const val = this._io[this.name];
        if (val instanceof Promise) {
            return new ODANTPromise(val, true);
        } else {
            return val ?? '';
        }
    }
    set value(v) {
        this._io[this.name] = v;
    }
    get isObject() {
        const val = this.value;
        return val && typeof val === 'object';
    }
    get isArray() { return Array.isArray(this.value); }
    get items() {
        if (this.isObject && !this.$expanded) {
            this._items.splice(0, this._items.length, ...extractProps(this.value, true, this._items, undefined, this));
            return this._items;
        } else {
            return this._items;
        }
    }
    set items(v) {
        this._items = v;
    }
    get $expanded() {
        return this._expanded;
    }
    set $expanded(v) {
        this._items = extractProps(this.value, true, this._items, undefined, this);
        this._expanded = v;
    }
}
class ODANTPromise {
    /**
     * 
     * @param {Promise} promise 
     * @param {Boolean} silent  - глушить ли ошибки
     */
    constructor(promise, silent) {
        this['[[Status]]'] = 'pending';
        this['[[Value]]'] = 'undefined';
        promise.then(
            (res) => {
                this['[[Status]]'] = 'resolved';
                this['[[Value]]'] = res;
            },
            (e) => {
                this['[[Status]]'] = 'rejected';
                this['[[Value]]'] = e;
                if (!silent) {
                    console.error(e);
                }
            }
        );
    }
}
function isValid(name) {
    if (!name) return false;
    return !(/^((o_)|_|\$|(outerHTML)|(innerHTML)|(properties)|(props))/.test(name));
}
function isFunction(desc) {
    if (!desc) return false;
    return typeof (desc.value || desc.default) === 'function';
}
/**
 * @param {Object} proto 
 * @param {Object} obj 
 * @param {Boolean=} expert 
 * @param {InspectorItem[]=} result
 * @param {InspectorItem=} owner
 */
function getProps(proto, obj, expert, result = [], owner = undefined) {
    const descriptors = Object.getOwnPropertyDescriptors(proto);
    if (proto.props) {
        Object.getOwnPropertyNames(proto.props).forEach(name => {
            if (isValid(name) && !result.some(p => p.name === name)) {
                let desc = proto.props[name] || obj.props?.[name] || descriptors[name];
                desc = (typeof desc === 'function' ? null : desc) || Object.getOwnPropertyDescriptor(proto, name);
                const hidden = desc?.hidden || desc?.hide || desc?.enumerable === false;
                const isFn = isFunction(desc);
                if (hidden || isFn) return;
                const prop = new InspectorItem({ name, obj, proto, desc, expert, owner });
                const p = result.find(p => p.name === name);
                if (p) {
                    p.category = prop.category;
                } else {
                    result.push(prop);
                }
            }
        });
    }
    if (expert) {
        Object.getOwnPropertyNames(proto).forEach(name => {
            if (isValid(name)) {
                let desc = proto.props?.[name] || obj.props?.[name] || descriptors[name];
                desc = (typeof desc === 'function' ? null : desc) || Object.getOwnPropertyDescriptor(proto, name);
                const hidden = desc?.hidden || desc?.hide || desc?.enumerable === false;
                const isFn = isFunction(desc);
                if (hidden || isFn) return;
                const prop = new InspectorItem({ name, obj, proto, desc, expert, owner });
                const p = result.find(p => p.name === name);
                if (p) {
                    p.category = prop.category;
                } else {
                    result.push(prop);
                }
            }
        });
    } else if (!obj.props) {
        return getProps(proto, obj, true, result, owner);
    }
    return result;
}
/**
 * 
 * @param {Object} obj
 * @param {Boolean=} expert
 * @param {InspectorItem[]=} oldProps
 * @param {Boolean=} editMode
 * @param {InspectorItem=} owner
 */
function extractProps(obj, expert, oldProps = [], editMode, owner = undefined) {
    if (!obj || typeof obj !== 'object') return [];
    let proto = obj;
    const props = [];
    while (proto) {
        getProps(proto, obj, expert, props, owner);
        proto = Object.getPrototypeOf(proto);
    }
    for (const k in props) {
        const p = props[k];
        const op = oldProps.find(op => p.name === op.name);
        if (op) {
            props[k] = Object.assign(p, op);
            // Object.assign(p, op);
            // p.$level = op.$level;
            // p.$expanded = op.$expanded;
            // p._items = op._items;
        }
    }
    return editMode ? props.filter(p => !p.readOnly) : props;
}
ODA({
    is: 'oda-inspector',
    extends: 'oda-table',
    template: /*html*/``,
    props: {
        io: {
            type: Object,
            set(n) {
                this._inspect(n, this.expert, this.editMode);
            }
        },
        expert: false,
        editMode: false,
        // lazy: true,
        autoWidth: true,
        allowFocus: true,
        showHeader: true,
        colLines: true,
        rowLines: true,
        allowSort: true,
        columns: [
            { name: 'label',/*  template: 'oda-inspector-label', */ header: 'oda-inspector-label-header', treeMode: true, fix: 'left', $sort: 1 },
            { name: 'value', template: 'oda-inspector-value', header: 'oda-inspector-value-header', width: 'auto' },
            { name: 'category', hidden: true }
        ],
    },
    listeners: {},
    keyBindings: {},
    observers: [
        '_inspect(io, expert, editMode)', 
        '_expandGroups(items)'
    ],
    _inspect(io, expert, editMode) {
        this.dataSet = extractProps(io, expert, undefined, editMode);
        this._expandGroups();
    },
    _expandGroups() { // todo: удалить когда появится соответствующий механизм в таблице
        this.debounce('expandGroups', async() => {
            (await this.items).forEach(i => { if (i.$group) { i.$expanded = true; } });
        }, 10);
    },
    ready() {
        // todo: вернуть когда в таблице заработает раскрытие групп
        // const col = this.columns.find(c => c.name === 'category');
        // this.removeGroup(col);
        // this.addGroup(col);
        // this.showGroupingPanel = false;
    }
});
ODA({
    is: 'oda-inspector-label',
    extends: 'oda-table-cell-base',
    template: /*html*/`
    <div ~text="item?.label"></div>
    `,
});
ODA({
    is: 'oda-inspector-value',
    extends: 'oda-table-cell-base',
    template: /*html*/`
    <div ~if="!item.editor && !editor" class="horizontal flex" :read-only="item.readOnly">
        <div ~if="item?.isObject" class="horizontal" style="color: lightseagreen;">
            <div ~text="\`[\${item.type}\`"></div><div ~if="item.isArray" ~text="\`[\${item.value.length}]\`"></div>]
        </div>
        <div ~if="!item?.isObject && !item?.isArray" class="flex">
            <oda-basic-input class="flex" :type="item.type" :value="value" @value-changed.stop="_changed" ::focused></oda-basic-input>
        </div>
    </div>
    <div ~if="item.editor || editor" :is="item.editor || editor" class="flex" :value @value-changed.stop="_changed" ::focused :disabled="item.readOnly"></div>
    `,
    props: {
        focused: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            get() {
                return !this.item || this.item.readOnly;
            },
            reflectToAttribute: true
        },
        editor: '',
        value() {
            return this.item.value;
        },
        item: Object
    },
    observers: [
        async function itemChanged(item) {
            if (item?.editorUrl) {
                const importResult = await import(item.editorUrl);
                const defaultImport = await importResult.default
                this.editor = defaultImport.is;
            }
        },
    ],
    _changed(evt) {
        if (this.focused && !Object.equal(this.item.value, evt.detail.value)) this.item.value = toType(this.item.type, evt.detail.value);
    }
});
ODA({
    is: 'oda-inspector-label-header',
    extends: 'oda-table-cell-base',
    template: /*html*/`
    <style>
        .split{
            cursor: col-resize;
            border: 2px solid transparent;
            transition: border-color .5s;
        }
    </style>
    <div class="flex" style="box-shadow: inset 0 0 0 1px gray; display: flex; align-items: center; margin-left: 5px;">
        <oda-basic-input class="flex" ::value></oda-basic-input>
        <oda-icon icon="icons:search" icon-size="32"></oda-icon>
    </div>
    <div class="split" @tap.stop @track="_track" ~style="{minHeight: iconSize+'px'}"></div>
    `,
    props: {
        value: {
            set(v) {
                this.table.columns[0].$filter = v === '*' ? '' : v;
                if (!v || v === '*') {
                    this?.table._expandGroups();
                }
            }
        }
    },
    _track(e) {
        switch (e.detail.state) {
            case 'start': {
                this.column.width = Math.round(this.offsetWidth);
            } break;
            case 'track': {
                const delta = e.detail.ddx * (this.column.fix === 'right' ? -1 : 1);
                let p = this.column;

                while (p) {
                    const w = Math.round(p.width + delta);
                    p.width = (w < this.minWidth) ? this.minWidth : w;
                    p = p.$parent;
                }
                const setChildrenWidth = (col) => {
                    if (col.items) {
                        const w = col.items.reduce((res, a) => { res += (a.width || 0); return res; }, 0);
                        if (w && col.width !== w) {
                            const k = col.width / w;
                            col.items.forEach(c => {
                                c.width = c.width * k;
                                setChildrenWidth(c);
                            })
                        }
                    }
                };
                setChildrenWidth(this.column);
                this.table._updateStyles();
            } break;
            case 'end': {
                let col = this.column;
                while (col) {
                    this.table.__write(this.table.settingsId + '/column/' + col.name + '/width', col.width);
                    col = col.$parent;
                }
            } break;
        }
    },
});
ODA({
    is: 'oda-inspector-value-header',
    extends: 'oda-table-cell-base',
    template: /*html*/`
    <div class="flex"></div>
    <oda-button icon="social:school" allow-toggle :toggled="table?.expert" @tap="table.expert = !table.expert"></oda-button>
    <oda-button icon="image:edit" allow-toggle :toggled="table?.editMode" @tap="table.editMode = !table.editMode"></oda-button>
    `,
});
function toBool(v, def = false) {
    if (!v)
        return def;
    switch (typeof v) {
        case 'object': return true;
        case 'string': return v.toLowerCase() === 'true';
        case 'boolean': return v;
        case 'number': return v !== 0;
    }
    return false;
}
function toType(type, value) {
    switch (type) {
        case 'Boolean':
        case 'boolean':
        case 'checkbox':
        case Boolean: return toBool(value);
        case 'Number':
        case 'number':
        case Number: return parseFloat(value) || 0;
        case 'String':
        case 'string':
        case String: return value?.toString() || '';
        case 'Date':
        case 'date':
        case Date: return Date.parse(value) || new Date(value);
        default: return value;
    }
}