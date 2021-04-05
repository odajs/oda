import ODA from '../../../oda.js';
import '../../../components/grids/table/table.js';
import '../../containers/dropdown/dropdown.js'
import '../../../components/grids/list/list.js';
import '../../../components/viewers/md-viewer/md-viewer.js';

function makeData(el, expert) {
    let obj = el;

    const fn = (key, category = 'no category') => {
        let value = el[key],
            is = false;
        if (value && Array.isArray(value)) {
            value = 'Array [' + value.length + ']';
            is = true;
        }
        else if (value !== null && typeof value === 'object') {
            value = '[Object]';
            is = true;
        }
        const _docs = undefined;
        if (el[key] && el[key]._docs) _docs = el[key]._docs;
        data.items.push({ label: key, value, is, el: el[key], items: [], category, obj, _docs });
    }
    const exts = /^(_|\$)/;
    const label = el?.constructor?.name || el?.localName || '';
    const data = { label, items: [] };
    const props = el?.props || el?.properties || undefined;
    if (props)
        for (const key of Object.keys(props)) {
            if (!expert && exts.test(key)) continue;
            fn(key, 'properties');
        }

    while (obj) {
        let names = Object.getOwnPropertyNames(obj);
        for (let key of names) {
            if (!expert && exts.test(key)) continue;
            if (/^(__|props|properties|\$props)/.test(key)) continue;
            const d = Object.getOwnPropertyDescriptor(obj, key);
            if (!d || typeof d.value === 'function') continue;
            fn(key, obj.constructor.name);
        }
        if (!expert) break;
        obj = obj.__proto__;
    }

    const res = [];
    for (let key of Object.keys(data.items)) {
        const prop = data.items[key];
        prop.key = prop.label;
        const label = prop.label || (!Number.isNaN(+key) ? `[${key}]` : key);
        const _docs = prop._docs || null;
        const _obj = prop.obj;
        const row = Object.assign({ key, label, _docs, _obj }, prop);
        Object.defineProperty(row, 'value', {
            get() {
                return this._obj[this.label];
            },
            set(v) {
                this._obj[this.label] = v;
            }
        });
        res.push(row);
    }
    return res;
}

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
        title: {
            get() {
                if (this.io) {
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



                if (n && n.$url) {
                    const path = n.$url.split('/').slice(0, -1).join('/');
                    const props = path + '/$info/props/_info.js';
                    try {
                        const res = await import(props);
                        const module = res.info || res.default;
                        module && module.map(o => {
                            o.src = o.src.replace('./', path + '/')
                            if (n.props[o.label])
                                n.props[o.label]._docs = o;
                        });
                        //this.dataSet = makeData(this.io, this.expertMode);
                    } catch (err) { };
                }
                if (n && Array.isArray(n)) {
                    this.io = new Proxy(new ioSet(n), proxyHandler);
                }
                else this.io = n;
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
            this.dataSet = makeData(this.io, this.expertMode, true);
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
            <oda-icon ~if="item.is" :icon="item.expanded?'icons:chevron-right:90':'icons:chevron-right'" allow-toggle :toggled="item.expanded" :icon-size="iconSize - 2" style="color:gray" @tap="_expanded(item)"></oda-icon>
            <span style=";text-overflow: ellipsis;overflow: hidden" ~style="item._docs && item._docs.style">{{item.label}}</span>
            <div style="flex:1"></div>
            <oda-icon ~if="item._docs" :icon="item._docs.icon || 'icons:info-outline'" :blink="item._docs.blink || ''" fill="darkgray" :icon-size="iconSize/2" style="cursor:pointer" @tap="_tap" :title="item._docs.title"
                    :fill="item._docs && item._docs.color"></oda-icon>
`,
    _tap() {
        let src = this.item._docs.src || '';
        if (src) ODA.showModal('oda-md-viewer', { src: src }, { title: this.item.label, fullSize: true });
    },
    _expanded(i) {
        i.is = false;
        i.expanded = !i.expanded;
        if (i.expanded)
            i.items = makeData(i.el, this.expertMode);
        else
            i.items = [];
        this.render();
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
            this.item.value = e.currentTarget.value;
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