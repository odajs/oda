import ODA from '../../oda.js';
import '../../components/grids/table/table.js';
import '../containers/dropdown/dropdown.js'
import '../../components/grids/list/list.js';
import '../../components/viewers/md-viewer/md-viewer.js';
class _Promise {
    constructor(promise, silent) {
        this.__promise = promise;
        Object.defineProperty(this, 'value', {
            get() {
                if (this.__value)
                    return this.__value;
                this.__promise.then(resolve => {
                    this.__value = resolve;
                })
            }
        });
        Object.defineProperty(this, 'status', {
            get() {
                return 'pending';
            }
        })
    }
}
function toBoolean(v) {
    switch (v) {
        case 'true':
        case 'True':
        case true: return true;
        case 'false':
        case 'False':
        case false: return false;
        default: return Boolean(v);
    }
}
function getOwnKeys(target) {
    let arr = [];
    for (let i of target.__io) {
        if (i) {
            if (!arr.length) {
                arr.add(...Object.getOwnPropertyNames(i));
                arr.add(...Object.getOwnPropertySymbols(i));
            }
            else {
                const array2 = [...Object.getOwnPropertyNames(i), ...Object.getOwnPropertySymbols(i)];
                arr = arr.filter(value => array2.includes(value))
            }
        }
    }
    return arr;
}
class ioSet {
    constructor(objects) {
        this.__io = objects;
    }
}
const proxyHandler = {
    set(target, p, value, receiver) {
        if (target instanceof ioSet) {
            for (let obj of target.__io)
                obj && (obj[p] = value);
        }
        else
            target[p] = value;
        return true;
    },
    get(target, p, receiver) {
        if (target instanceof ioSet) {
            const arr = [];
            for (let i of target.__io) {
                i && arr.add(i[p])
            }
            if (arr.length === 1)
                return arr[0];
            if (arr.find(i => i && typeof i === 'object')) {
                return new ioSet(arr.map(i => {
                    if (i instanceof Promise)
                        i = new _Promise(i);
                    return i;
                }))
            }
        }
        return target[p];
    },
    getOwnPropertyDescriptor(target, p) {
        if (target instanceof ioSet) {
            for (let i of target.__io) {
                if (i) {
                    let d = Object.assign({ configurable: true }, Object.getOwnPropertyDescriptor(i, p));
                    if (d.value !== undefined)
                        d.configurable = true;
                    d.enumerable = true;
                    return d;
                }
            }
        }
        return Object.assign({ configurable: true }, Object.getOwnPropertyDescriptor(target, p));
    },
    ownKeys(target) {
        if (target instanceof ioSet)
            return getOwnKeys(target);
        let arr = [];
        arr.add(...Object.getOwnPropertyNames(target));
        arr.add(...Object.getOwnPropertySymbols(target));
        return arr;
    }
};
const exts = /^(_|\$)/;
function parse(io = {}, expert) {
    if (io === null) return [];
    let props = Object.assign({}, io.properties || io.props);
    if (props.__io) {
        let keys = getOwnKeys(props);
        props = props.__io.reduce((res, p) => {
            if (keys.includes(p))
                res = Object.assign(res, p);
            return res;
        }, {})
    }
    let obj = io;
    while (obj) {
        let names = Object.getOwnPropertyNames(obj);
        for (let key of names) {
            if (!expert && exts.test(key)) continue;
            if (/^(__|props|properties)/.test(key)) continue;
            let d = Object.getOwnPropertyDescriptor(obj, key);
            if (!d || typeof d.value === 'function') continue;
            let prop = props[key];
            if (!prop)
                prop = { category: expert && obj.constructor.name, readOnly: exts.test(key) || d.get ? !d.set : !d.writable };
            props[key] = Object.assign({}, prop, d);
        }
        if (!expert) break;
        obj = obj.__proto__;
    }
    const res = [];
    for (let name of Object.keys(props)) {
        if (!expert && exts.test(name)) continue;
        let value = io[name];
        if (typeof value === 'function') continue;
        let prop = props[name];
        let label = prop.label || (!Number.isNaN(+name) ? `[${name}]` : name);
        let _docs = prop._docs || null;
        let row = Object.assign({ name, label, _docs }, prop);
        Object.defineProperty(row, '$value', {
            get() {
                let val = io[name];
                if (this.$group) {
                    console.log(name)
                }
                if (val && typeof val === 'object') {
                    if (val !== this.target || Array.isArray(val)) {
                        this.target = val;
                        if (val instanceof Promise)
                            val = new _Promise(val);
                        this.proxy = (!(val instanceof ioSet) || val.__io) ? new Proxy(val, proxyHandler) : val;
                        this.items = parse(val);
                    }
                    return this.proxy;
                }
                this.items = undefined;
                return val;
            }
        });
        Object.defineProperty(row, 'value', {
            get() {
                let val = this.$value;
                if (val && typeof val === 'object' && val.constructor) {
                    const n = val.constructor.name;
                    if (n === 'Array')
                        return `Array [${val.length}]`;
                    return `[${n}]`;
                }
                return val;
            },
            set(v) {
                // console.table([{ n: 'v', v }, { n: 'io', v: io[name]}])
                if (!Object.is(io[name], v)) {
                    const curV = io[name];
                    if (v?.constructor?.name === curV?.constructor?.name || (curV === undefined || curV === null) || (v === undefined || v === null)) {
                        io[name] = v;
                    } else {
                        //return;
                        if (curV !== undefined || curV !== null) {
                            switch (curV?.constructor?.name) {
                                case 'Number': return io[name] = isNaN(v) || !v ? 0 : parseFloat(v);
                                case 'String': return io[name] = typeof v !== 'object' && v?.toString ? v.toString() : v;
                                case 'Boolean': return io[name] = toBoolean(v);
                                case 'Array':
                                    return io[name] = typeof v === 'object' && v !== null
                                        ? curV.splice(0, curV.length, ...Array.from(v))
                                        : curV.splice(0, curV.length);
                            }
                            try {
                                io[name] = curV.constructor(v);
                            } catch (err) {
                                console.warn(`Bad type convert ${curV?.constructor?.name} to ${v?.constructor?.name}`);
                                io[name] = v;
                            }
                        } else {

                        }
                    }
                }
            }
        });
        // Object.defineProperty(row, 'items', {
        //     writable: true,
        //     value: []
        // });
        res.push(row);
    }
    return res;
};
let _propsFullPath = '';
ODA({
    is: "oda-property-grid", extends: 'this, oda-table', template: /*html*/`
    <style>
        :host {
            max-height: 100%;
            height: 100vh;
            border: 1px solid gray;
        }
    </style>
    <slot ~show="false"  @slotchange="onSlot"></slot>`,
    props: {
        title:{
            get(){
                if (this.io){
                    let nm = this.io?.label || this.io?.name || '';
                    if (nm)
                        nm = ` (${nm})`;
                    return (this.io?.constructor?.name + nm);
                }
                return ''
            }
        },
        icon: 'icons:settings',
        expertMode: false,
        editMode: true,
        lazy: true,
        autoWidth: true,
        allowFocus: true,
        showHeader: true,
        showFooter: true,
        colLines: true,
        rowLines: true,
        allowSort: true,
        io: {
            default: null,
            freeze: true,
        },
        component: {
            default: null,
            freeze: true,
            async set(n, o) {
                if (n && Array.isArray(n)) {
                    this.io = new Proxy(new ioSet(n), proxyHandler);
                }
                else this.io = n;

                if (n && n.$url) {
                    const path = n.$url.split('/').slice(0, -1).join('/');
                    const props = _propsFullPath = path + '/$info/props/_info.js';
                    try {
                        const res = await import(props);
                        const module = res.info || res.default;
                        module && module.map(o => {
                            o.src = o.src.replace('./', path + '/')
                            if (n.props[o.label])
                                n.props[o.label]._docs = o;
                        });
                        this.dataSet = parse(this.io, this.expertMode);
                    } catch (err) { };
                }
            }
        },
        columns: [
            { name: 'label', template: 'oda-property-grid-label-cell', header: 'oda-property-grid-label-header', treeMode: true, fix: 'left', $sort: 1 },
            { name: 'value', template: 'oda-property-grid-value-cell', header: 'oda-property-grid-value-header', width: 'auto' },
            { name: 'category', hidden: true },
        ],
        groups: {
            get() {
                return [this.columns.find(c => c.name === 'category')]
            }
        },
    },
    ready() {
        this.sorts.push(this.columns[0]);
    },
    observers: [
        function setDataSet(io, expertMode) {
            this.dataSet = parse(this.io, this.expertMode, true);
        },
    ],
    onSlot(e) {
        this.component = e.target.assignedElements();
    }
});
ODA({
    is: 'oda-property-grid-label-header', extends: 'oda-table-cell-base', template: `
         <style>
            :host{
                justify-content: flex-end;
            }
        </style>
        <oda-button ~if="_editMode" icon="office-set:contact" fill="gray" style="cursor:pointer" @tap="_tap" title="Edit _info.js"></oda-button>`,
    props: {
        _editMode: { get() { return document._editMode } }
    },
    _tap() {
        if (_propsFullPath) window.open(ODA.rootPath + '/components/editors/md-editor/md-editor.html?src=' + _propsFullPath);
    }
});
ODA({
    is: 'oda-property-grid-value-header', extends: 'oda-table-cell-base', template: /*html*/`
         <style>
            :host{
                justify-content: flex-end;
            }
        </style>
        <!-- <oda-button allow-toggle ::toggled="table?.expertMode" icon="social:school" title="Expert mode"></oda-button> -->
        <oda-button allow-toggle :toggled="table?.expertMode" @tap="this.table.expertMode = !this.table.expertMode" icon="social:school" title="Expert mode"></oda-button>`,
});
ODA({
    is: 'oda-property-grid-label-cell', extends: 'oda-table-cell-base, this', template: `
            <span style=";text-overflow: ellipsis;overflow: hidden" ~style="item._docs && item._docs.style">{{item.label}}</span>
            <div style="flex:1"></div>
            <oda-icon ~if="item._docs" :icon="item._docs.icon || 'icons:info-outline'" :blink="item._docs.blink || ''" fill="darkgray" :icon-size="iconSize/2" style="cursor:pointer" @tap="_tap" :title="item._docs.title"
                    :fill="item._docs && item._docs.color"></oda-icon>
`,
    _tap() {
        let src = this.item._docs.src || '';
        if (src) ODA.showModal('oda-md-viewer', { src: src }, { title: this.item.label, fullSize: true });
    }
});
const editors = {};
ODA({
    is: 'oda-property-grid-value-cell', extends: 'oda-table-cell-base', template: /*html*/`
        <style>
            :host{
                @apply --horizontal;
                @apply: --flex;
            }
            input{
                border: none;
                outline: none;
                padding: 4px;
                overflow: hidden;
                /*height: 100%;*/
            }
            oda-button{
                padding: 0px;
            }
            [disabled]{
               pointer-events: none;
            }
        </style>
    <!--    <div class="horizontal flex" :disabled="item.readOnly" style="overflow: hidden">-->
    <!--    <input ~is="tag || 'input'" :type="type" class="flex" ::value="item.value" :disabled="item.readOnly"> -->
            <input ~is="tag || 'input'"
                    :type="type"
                    class="flex"
                    :value="item.value"
                    @input="_setValue"
                    @value-changed="_setValue"
                    @tap="focused = true; async(()=>{focused = false}, 300)"
                    @focus="focused = true"
                    @blur="focused = false"
                    :disabled="item.readOnly">
    <!--    </div>-->
        <oda-button ~if="item.list && !item.readOnly" icon="icons:chevron-right:90" @tap="_openDropdown"></oda-button>
        `,
    props: {
        value() {
            return this.item.value;
        },
        type: {
            get() {
                switch (this.item.type) {
                    case Boolean:
                        return 'checkbox';
                    case Number:
                        return 'number';
                    case Date:
                        return 'date';
                }
                switch (typeof this.item.value) {
                    case 'boolean':
                        return 'checkbox';
                    case 'number':
                        return 'number';
                    case 'date':
                        return 'date';
                }
            }
        },
        tag: {
            get() {
                if (this.item.tag)
                    return this.item.tag;
                switch (this.type) {
                    case 'checkbox':
                        return 'oda-checkbox';
                }
            }
        },
        item: {
            default: {},
            async set(n, o) {
                if (n && n.editor) {
                    n.tag = editors[n.editor];
                    if (!n.tag) {
                        const module = await import(n.editor);
                        editors[n.editor] = n.tag = module.default.is;
                    }
                }
            }
        },
        focused: false
    },
    _setValue(e) {
        if (this.focused) {
            this.item.value =  e.currentTarget.value;
        }
    },
    _select(e) {
        this.item.value = e.target.focusedItem;
        this.dropdown = false;
    },
    async _openDropdown() {
        let res = await ODA.showDropdown('oda-list', { items: this.item.list, focusedItem: this.item.value }, { parent: this, useParentWidth: true });
        this.item.value = res.focusedItem;
    }
});