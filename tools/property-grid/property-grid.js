ODA({is: 'oda-property-grid', extends: 'this, oda-table',
    imports: ['@oda/table'],
    template: /*html*/`
    <style>
        :host {
            max-height: 100%;
            border: 1px solid gray;
        }
    </style>
    <slot ~show="!inspectedObject" @slotchange="onSlot"></slot>`,
    get columns() {
        return [
            { name: 'name', template: 'oda-pg-cell-name', header: 'oda-property-grid-header-cell-name', label: 'Property', treeMode: true, fix: 'left', $sort: 1 },
            { name: 'value', template: 'oda-pg-cell-value', header: 'oda-property-grid-header-cell-value' },
            { name: 'category', $hidden: true, $sortGroups: 0 },
        ]
    },
    get label() {
        if (!this.inspectedObject) return;
        if (Array.isArray(this.inspectedObject)) {
            if (this.inspectedObject.length > 1)
                return this.inspectedObject[0]?.constructor?.name + ` [${this.inspectedObject.length}]`
            return this.inspectedObject[0]?.constructor?.name;
        }
        return this.inspectedObject?.constructor?.name
    },
    props: {
        inspectedObject: Object,
        icon: 'icons:settings',
        expertMode: false,
        lazy: true,
        autoWidth: true,
        allowFocus: true,
        showHeader: true,
        showFooter: true,
        colLines: true,
        rowLines: true,
        groupExpandingMode: 'first',
        onlySave: false,
    },
    get dataSet() {
        const items = this.PropertyGridDataSet.items;
        if (this.onlySave  && !this.expertMode)
            return items.filter(i => i.prop?.save);
        return items;
    },
    get PropertyGridDataSet() {
        return new PropertyGridDataSet(this.inspectedObject, this.expertMode, this.onlySave)
    },
    ready() {
        this.groups = [this.columns.find(c => c.name === 'category')];
    },
    onSlot(e) {
        this.inspectedObject = e.target.assignedElements();
    },
    _sort(array = []) {
        if (!this.sorts.length) return;
        array.sort((a, b) => {
            if (!a.prop !== !b.prop) {
                return a.prop ? -1 : 1;
            }
            let res = 0;
            this.sorts.some(col => {
                const _a = a[col[this.columnId]];
                const _b = b[col[this.columnId]];
                if (!isNaN(_a) && !isNaN(_b)) {
                    res = parseFloat(_a) > parseFloat(_b) ? 1 : -1
                } else {
                    res = (String(_a)).localeCompare(String(_b)) * col.$sort;
                }
                if (res) return true;
            });
            return res;
        });
    },
})

CLASS({is: 'PropertyGridDataRowOwner',
    props:{
        $expanded:{
            default: false,
            get(){
                return false
            }
        }
    },
    $hasChildren: undefined,
    get items() {
        if (this.mixed)
            return [];
        if (!this.$expanded){
            if (this.value && typeof this.value === 'object'){
                if (this.value.props){
                    if (Object.keys(this.value.props).length)
                        return [{}];
                }
                else if (Object.keys(this.value).length){
                    return [{}];
                }

            }
            return [];
        }
        const items = {}
        for (let obj of this.inspectedObjects || []) {
            if (typeof obj !== 'object') continue;
            if (!this.isRevoked && this.name) {
                obj = obj[this.name];
                if (!obj) continue;
            }
            if (typeof obj !== 'object') continue;
            const props = obj.props || Object.getOwnPropertyNames(obj).reduce((res, k, idx, keys) => {
                res[k] = { type: obj[k]?.constructor || res[keys[idx - 1]] || String }
                return res
            }, {})
            let proto = obj;
            while (proto) {
                const descriptors = Object.getOwnPropertyDescriptors(proto)
                for (let name in descriptors) {
                    if (name.startsWith('#'))
                        continue;
                    if (!this.dataSet.expert && (!(name in props) || props[name]?.private))
                        continue;
                    const d = descriptors[name];
                    if (!d.enumerable)
                        continue;
                    if (typeof d.value === 'function')
                        continue;
                    const p = props[name];
                    const row = items[name] ??= new PropertyGridDataRow(name, this.dataSet, proto, p);
                    row.inspectedObjects.add(obj);
                }
                proto = proto.__proto__;
            }
        }
        return Object.values(items);
    }
})
class MixedArray extends Array {

}

CLASS({is: 'PropertyGridDataRow', extends: 'PropertyGridDataRowOwner',
    ctor(name, dataSet, prototype, prop) {
        this.dataSet = dataSet;
        this.prototype = prototype;
        this.prop = prop;
        if (this.io.$system?.lists?.[name]){
            Object.defineProperty(this, 'list', {
                get() {
                    return this.io.$system?.lists?.[name]();
                }
            })
        }else{
            this.list = prop?.list;
        }
        this.name = name;
        this.inspectedObjects = [];
    },
    get io(){
        return this.dataSet.inspectedObjects[0];
    },

    get category() {
        let cat = this.prototype.constructor?.name || '';
        if (this.prop){
            cat += ': public';
            if (this.prop.category)
                cat+= ` - ${this.prop?.category.toLowerCase()}`
        }
        else
            cat+=': private';
        return cat
    },
    get mixed() {
        return this.value instanceof MixedArray;
    },
    _extractEditor(s) { // @path/path[component-name]
        const parts = s.split('[');
        if (parts.length === 2){
            return { path: parts[0], tag: parts[1].slice(0, -1) };
        }
        return { path: undefined, tag: s };
    },
    _getDefaultEditor() {
        switch (this.prop?.type || (this.prop?.default !== undefined && typeof this.prop?.default) || typeof this.value) {
            case Array:
            case Object:
            case 'object':
                return 'oda-pg-object';
            case Number:
            case 'number':
                return 'oda-pg-number';
            case Boolean:
            case 'boolean':
                return 'oda-pg-bool';
            case String:
            case 'string':
            default:
                return 'oda-pg-string';
        }
    },
    get editor() {
        if (this.mixed)
            return 'oda-pg-mixed';
        const editor =  this.prop?.editor || this.value?.$typeEditor;
        if (editor){
            const onError = (err) => {
                console.error(`Type editor to "${this.name}" prop not loaded.\n`, err);
                this.editor = this._getDefaultEditor();
            }
            try {
                const { path, tag } = this._extractEditor(editor);
                if (path){
                    let url = this.dataSet.inspectedObjects[0]?.url || '';
                    ODA.import((url ? (url + '/~/') : '') + path).catch(onError);
                }
                return tag;
            } catch (err) {
                onError(err);
            }
        }
        return this._getDefaultEditor();
    },
    get value() {
        const list = this.inspectedObjects.map(io => io[this.name])
        const value = list[0];
        if (typeof value !== 'object' && list.some(v => v !== value))
            return new MixedArray(...list);
        return value;
    },
    set value(n) {
        if (n === undefined) return;
        for (let io of this.inspectedObjects) {
            io[this.name] = n;
        }
    },
    get ro() {
        return !!(this.prop?.readOnly)
    },
    props:{
        $expanded:{
            default: false,
            set(n){
                if (this.value?.then) {
                    this.value?.then(obj => {
                        const row = new PropertyGridDataRow('Resolve', this.dataSet)
                        row.isRevoked = true;
                        row.value = obj;
                        row.ro = true;
                        if (typeof obj === 'object')
                            row.inspectedObjects = [obj];
                        this.items = [row];
                    }).catch(e => {
                        const row = new PropertyGridDataRow('Reject', this.dataSet)
                        row.isRevoked = true;
                        row.value = e;
                        row.ro = true;
                        row.inspectedObjects = [e];
                        this.items = [row];
                    })
                }
            }
        }
    },
})
CLASS({is: 'PropertyGridDataSet', extends: 'PropertyGridDataRowOwner',
    ctor(inspectedObject, expert, onlySave) {
        this.$expanded = true;
        this.expert = expert;
        this.onlySave = onlySave;
        if (!Array.isArray(inspectedObject))
            this.inspectedObjects = [inspectedObject];
        else if (inspectedObject.every(i => typeof i === 'object'))
            this.inspectedObjects = inspectedObject;
        else
            this.inspectedObjects = [inspectedObject];
    },
    get dataSet() {
        return this;
    },
    isRoot: true,
})

cells: {
    ODA({is: 'oda-pg-cell-value',
        template: /*html*/`
        <style>
            :host {
                overflow: hidden;
                @apply --horizontal;
            }
            :host > span {
                @apply --dimmed;
                user-select: text;
            }
            .editor {
                border: none !important;
            }
        </style>
        <span :readonly="item?.ro" style="align-self: center;" class="editor flex horizontal" ~is="item?.editor" :value="item?.value" @value-changed="item.value = $event.detail.value" :item>{{item?.value}}</span>
        <oda-button ~if="list?.length" @tap.stop.prevent="showDD" icon="icons:chevron-right:90"></oda-button>
        `,
        item: null,
        get list(){
            if (this.item?.list?.then){
                this.item.list.then(list=>{
                    this.list = list;
                })
                return undefined;
            }
            return this.item?.list;
        },
        async showDD(e) {
            if (this.__dd_control){
                this.__dd_control.fire('cancel');
                delete this.__dd_control;
                this.__dd_control = undefined;
                return;

            }
            else{
                this.__dd_control = ODA.createElement('oda-menu', { items: this.list.map(i => ({ label: i?.label ?? i?.name ?? i, value: i.value || i })), selectedItem: this.item.value });
                try {
                    const res = await ODA.showDropdown(this.__dd_control, {}, { useParentWidth: true, parent: e.target.domHost, fadein: true});
                    this.item.value = res.focusedItem.value;
                }
                catch (e) {

                }
            }

        },
        resetValue() {
            this.item.value = this.item.default;
        }
    })
    ODA({is: 'oda-pg-cell-name', extends: 'oda-table-cell',
        template: /*html*/`
        <style>
            :host {
                font-weight: {{(item?.prop)?'bold':'normal'}};
            }
        </style>
        <oda-button title="defaultValue" ~if="showDefault" @tap.stop.prevent="resetValue" icon="av:replay" style="opacity: .3;"></oda-button>
    `,
        props: {
            title: {
                get() {
                    return this.item.name;
                },
                reflectToAttribute: true,
            }
        },
        get defaultValue() {
            if (typeof this.item.prop?.default === 'function')
                return this.item.prop.default();
            return this.item.prop?.default;
        },
        get showDefault() {
            if (this.defaultValue !== undefined) {
                return !Object.equal(this.item.value, this.defaultValue);
            }
        },
        resetValue() {
            this.item.value = this.defaultValue;
        },
        get value() {
            return this.item?.prop?.label ? this.item?.prop?.label : this.item?.name?.toKebabCase();
        }
    })

    ODA({is: 'oda-property-grid-header-cell-name', extends:'oda-table-header-cell',
        template: /*html*/`
        <style>
            :host {
                @apply --horizontal;
                align-items: center;
            }
        </style>
        <oda-button ~if="onlySave" class="no-flex" @tap.stop.prevent="resetValue" icon="av:replay" slot="tools" title="Reset settings"></oda-button>
        `,
        resetValue() {

            this.items.forEach(item => {
                if (item.prop?.default === undefined) return;
                item.value = (typeof item.prop.default === 'function') ? item.prop.default() : item.prop.default;
            })
        }
    })
    ODA({is: 'oda-property-grid-header-cell-value',
        template: /*html*/`
        <style>
            :host {
                @apply --horizontal;
                align-items: center;
                font-size: small;
            }
        </style>
        <div style="padding: 4px;" class="flex horizontal">
            <label style="text-align: center;" class="flex">Value</label>
        </div>
        
        <oda-button class="no-flex" allow-toggle ::toggled="expertMode" icon="social:school"></oda-button>
        `
    })
}
editors: {
    ODA({is: 'oda-pg-object',
        template: /*html*/`
        <style>
            :host {
                @apply --disabled;
            }
        </style>
        {{text}}
        `,
        value: null,
        get text() {
            if (!this.value)
                return '[Object: undefined]';
            if (Array.isArray(this.value))
                return `[Array (${this.value.length})]`
            if (typeof this.value === 'object')
                return '[' + (this.value?.constructor?.name || typeof this.value) + ']';
            return this.value;
        }
    })

    ODA({is: 'oda-pg-mixed',
        template: /*html*/`
        <input :placeholder="'mixed: [' + item.value+']'" class="error flex content" type="text" style="border: none; outline: none; min-width: 0;width: 100%;" :readonly="item.ro === true"  @input="_input" @keydown.stop>
        `,
        _input(e) {
            this.item.value = e.target.value;
        }
    })

    ODA({is: 'oda-pg-string',
        template: /*html*/`
        <style>
            :host > input {
                font-size: medium;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            :host > input[readonly] {
                @apply --dimmed;
            }
        </style>
        <input class="flex content" type="text" style="border: none; outline: none; min-width: 0;width: 100%;" ::value="item.value" :readonly="item.ro === true" @keydown.stop>
        `,
    })
    ODA({is: 'oda-pg-number',
        template: /*html*/`
        <style>
            :host > input[readonly] {
                @apply --dimmed;
            }
        </style>
        <input class="flex content"  style="border: none; outline: none; min-width: 0;width: 100%;"  type="number" ::value="vv" :readonly="item.ro === true" @keydown.stop>
        `,
        set vv(n) {
            this.value = +n;
        },
        get vv() {
            return this.value;
        },
        get value() {
            return +this.item.value;
        },
        set value(n) {
            this.vv = n;
            this.item.value = +n;
        }
    })
    ODA({is: 'oda-pg-bool', imports: '@oda/checkbox',
        template: /*html*/`
        <style>
            :host {
                @apply --horizontal;
                @apply --flex
                align-items: center;
            }
        </style>
        <oda-checkbox class="flex" ::value="item.value" style="justify-content: center;" :readonly="item.ro === true"></oda-checkbox>
        `,
    })
}
