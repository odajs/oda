ODA({ is: "oda-property-grid", extends: 'this, oda-table',
    imports: ['@oda/table'],
    template: /*html*/`
    <style>
        :host {
            max-height: 100%;
            border: 1px solid gray;
        }
    </style>
    <slot ~show="false"  @slotchange="onSlot"></slot>`,
    get columns() {
        return [
            { name: 'name', width: 200, template: 'oda-pg-cell-name', label: this.inspectedObject?.constructor?.name, treeMode: true, fix: 'left', $sort: 1 },
            { name: 'value', template: 'oda-pg-cell-value', header: 'oda-property-grid-header-cell', width: 'auto' },
            { name: 'category', hidden: true, $sortGroups: 0 },
        ]
    },
    props: {
        inspectedObject: Object,
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
        groupExpandingMode: 'first',
        dataSet(){
            return this.PropertyGridDataSet.items;
        },
        onlySave: false,
    },
    get PropertyGridDataSet(){
        return new PropertyGridDataSet(this.inspectedObject, this.expertMode, this.onlySave)
    },
    ready() {
        this.groups = [this.columns.find(c => c.name === 'category')];
    },
    onSlot(e) {
        this.inspectedObject = e.target.assignedElements();
    },
    _beforeExpand(node, force) {
        if (typeof node.value !== 'object') return;
        if (!force && node?.items?.length)
           return node?.items || [];
        return (node.items = new PropertyGridDataSet(node.value, this.expertMode, false, false).items);
    },
    _sort(array = []) {
        if (!this.sorts.length) return;
        array.sort((a, b) => {
            let res = 0;
            this.sorts.some(col => {
                const _a = a[col[this.columnId]];
                const _b = b[col[this.columnId]];
                if (!isNaN(_a) && !isNaN(_b)){
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
CLASS({is: 'PropertyGridDataSet',
    ctor(inspectedObject, expert, onlySave, isArray){
        this.expert = expert;
        this.onlySave = onlySave;
        this.inspectedObjects = isArray ? inspectedObject : [inspectedObject];
    },
    get items(){
        const items = []
        for (let obj of this.inspectedObjects || []) {
            if (!obj) continue
            let props = obj.props
            if (!props) {
                props = Object.getOwnPropertyNames(obj).reduce((res, k, idx, keys) => {
                    res[k] = { type: obj[k]?.constructor || res[keys[idx-1]] || String}
                    return res
                }, {})
            }


            const propsNames = Object.keys(props)
            let proto = obj
            while (proto) {
                const descriptors = Object.getOwnPropertyDescriptors(proto)
                for (let name in descriptors) {
                    if (!this.expert) {
                        // исключение свойств не описанных в props, вне экспертного режима
                        const idx = propsNames.indexOf(name)
                        if (!~idx) continue
                        else propsNames.splice(idx, 1)
                    }
                    // исключение системных и скрытых свойств
                    if (name.startsWith('_') ||
                        name.startsWith('#') ||
                        name.startsWith('$obs$') ||
                        name === 'props' || name === '__proto__' ||
                        name === '__op__' || name === '$$savePath'
                    ) continue

                    const d = descriptors[name];
                    if (!d.enumerable) continue;
                    if (typeof d?.value === 'function') continue;
                    const p = props[name]
                    const node = {label: p?.label, name, category: p?.category || ((p?'!':'') + (proto.constructor?.name || '')), ro: p?.readOnly || typeof d.value === 'object', list: p?.list}
                    if (p) {
                        if (!this.expert && (p.private || (this.onlySave && !p.save))) continue
                        const editor = p.editor
                        if (editor?.includes('/')) {
                            let url = this.inspectedObjects[0]?.url || '';
                            ODA.import((url?(url+'/~/'):'') + editor).then(async imp => {
                                node.editor = (await imp?.default)?.is || getTypeEditor(p.type || typeof d.value || typeof p.default)
                                this.render?.()
                            })
                        }
                        else {
                            node.editor = editor || getTypeEditor(p?.type || typeof d.value || typeof p.default)
                        }
                        node.default = p.default;
                    }
                    Object.defineProperty(node, 'value', {
                        get() {
                            const value = obj[name]
                            node.ro = node.ro || typeof value === 'object';
                            return value;
                        },
                        set(n) {
                            node.ro = node.ro || typeof n === 'object'
                            obj[name] = n
                        }
                    })

                    items.push(node)
                }
                proto = proto.__proto__
            }
        }
        return items;
    }
})
ODA({ is: 'oda-pg-cell-value',
    template: /* html */`
        <style>
            :host>span{
                @apply --dimmed;
                user-select: text;
            }
            .editor{
                border: none !important;
            }
            [disabled]{
                @apply --disabled;
            }
        </style>
        <span :disabled="item?.ro" style="align-self: center;" class="editor flex horizontal" ~is="item?.editor" :value="item?.value || ''" @value-changed=" item.value = $event.detail.value || undefined">{{item?.value}}</span>
        <oda-button ~if="item.list?.length" @tap.stop.prevent="showDD" icon="icons:chevron-right:90"></oda-button>
    `,
    item: null,
    async showDD(e){
        const res = await ODA.showDropdown('oda-menu', {items: this.item.list.map(i => ({label: i?.label ?? i?.name ?? i , value: i}))}, {parent: e.target.domHost, pointerEvents: 'none' });
        this.item.value = res.focusedItem.value;
    },
    resetValue() {
        this.item.value = this.item.default;
    }
})
ODA({ is: 'oda-pg-cell-name', extends: 'oda-table-cell',
    template: /* html */`
        <oda-button ~if="item.default !== undefined && item.value !== item.default" @tap.stop.prevent="resetValue" icon="av:replay" style="opacity: .3;"></oda-button>
    `,
    resetValue() {
        this.item.value = this.item.default;
    },
    get value(){
        return this.item?.label?this.item?.label:this.item?.name;
    }
})

function getTypeEditor(type) {
    switch (type) {
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
}

ODA({ is: 'oda-pg-object',
    template: `
        <style>
            :host{
                @apply --disabled;
                padding: 4px;
            }
        </style>
        {{text}}
    `,
    value: null,
    get text() {
        if (!this.value)
            return '[Object: udefined]';
        if (Array.isArray(this.value))
            return `[Array (${this.value.length})]`
        if (typeof this.value === 'object')
            return '[' + (this.value?.constructor?.name || typeof this.value) + ']';
        return this.value;
    }
})

ODA({ is: 'oda-pg-string',
    template: /*html*/`
        <style>
            :host > input {
                font-size: medium;
                padding: 0px;
                overflow: hidden;
                text-overflow: ellipsis;
                padding: 4px;
            }
            :host > input[readonly] {
                @apply --dimmed;
            }
        </style>
        <input class="flex content" type="text" style="border: none; outline: none; min-width: 0;width: 100%;" ::value="item.value" :readonly="item.ro === true" @tap.stop.prevent @keydown.stop>
    `,
})
ODA({ is: 'oda-pg-number',
    template: /*html*/`
        <style>
            :host > input[readonly] {
                @apply --dimmed;
            }
        </style>
        <input class="flex content"  style="border: none; outline: none; min-width: 0;width: 100%;"  type="number" ::value :readonly="item.ro === true" @tap.stop.prevent @keydown.stop>
    `,
    get value(){
        return +this.item.value;
    },
    set(n){
        this.item.value = +n;
    }

})
ODA({ is: 'oda-pg-bool', imports: '@oda/checkbox',
    template: /*html*/`
        <style>
            :host{
                @apply --horizontal;
                @apply --flex
                align-items: center;
            }
        </style>
        <oda-checkbox class="flex" ::value="item.value" style="justify-content: center;" :readonly="item.ro === true" @tap.stop.prevent></oda-checkbox>
    `,
})
ODA({ is: 'oda-property-grid-cell',
    template: /* html */`
    <style>
        :host{
            padding-left: 4px;
        }
        :host > span[disabled]{
            pointer-events: auto;
            user-select: text;
        }
        .editor{
            align-self: center;
            border: none !important;
        }
    </style>
    <span  :disabled="item?.ro || item?.editor === 'span'" class="editor flex horizontal" ~is="item?.editor" ::value="item.value">{{item?.value}}</span>
    <oda-button ~if="item.list?.length" @tap.stop.prevent="showDD" icon="icons:chevron-right:90"></oda-button>
    `,
    item: null,
    async showDD(e){
        const res = await ODA.showDropdown('oda-menu', {items: this.item.list.map(i => ({label: i?.label ?? i?.name ?? i , value: i}))}, {parent: e.target.domHost, pointerEvents: 'none' });
        this.item.value = res.focusedItem.value;
    }
})
ODA({ is: 'oda-property-header-cell-label',
    template: /* html */`
        <label style="text-align: center;" class="flex">{{inspectedObject?.constructor?.name}}</label>
    `,
    item: null
})
ODA({ is: 'oda-property-grid-header-cell',
    template: /* html */`
        <style>
            :host{
                @apply --horizontal;
                align-items: center;
                @apply --flex;
                justify-content: flex-end;
            }
        </style>
        <oda-button class="no-flex" allow-toggle ::toggled="expertMode" icon="social:school"></oda-button>
    `
})