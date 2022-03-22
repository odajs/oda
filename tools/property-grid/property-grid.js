ODA({ is: "oda-property-grid", extends: 'this, oda-table',
    imports: ['@oda/table'],
    template: /*html*/`
    <style>
        :host {
            max-height: 100%;
            height: 100vh;
            border: 1px solid gray;
        }
    </style>
    <slot ~show="false"  @slotchange="onSlot"></slot>`,
    get columns() {
        return [
            { name: 'name', width: 200, label: this.inspectedObject?.constructor?.name, treeMode: true, fix: 'left', $sort: 1 },
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

        // dataSet() {
        //     return parseInspectedObject.call(this, this.inspectedObject, this.expertMode, this.onlySave);
        // },
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
        if (!force && node?.items?.length)
            return node?.items || [];
        return (node.items = new PropertyGridDataSet(node.value, this.expertMode, this.onlySave).items);
        // return (node.items = parseInspectedObject.call(this, node.value, this.expertMode, this.onlySave));
    }
})
CLASS({is: 'PropertyGridDataSet',
    ctor(inspectedObject, expert, onlySave){
        this.expert = expert;
        this.onlySave = onlySave;
        this.inspectedObjects = Array.isArray(inspectedObject)?inspectedObject:[inspectedObject];
    },
    get items(){
        const items = []
        for (let obj of this.inspectedObjects || []) {
            if (!obj) continue
            const props = obj.props || {}
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

                    let d = descriptors[name]
                    const p = props[name]
                    const node = {name, category: proto.constructor.name, ro: typeof d.value === 'object', list: p?.list}
                    if (p) {
                        // исключение свойств помеченных как приватные
                        if (!this.expert && (p.private || (this.onlySave && !p.save))) continue
                        if (p.category) node.category = p.category
                        if (p.readOnly) node.ro = p.readOnly
                        let editor = p.editor
                        if (editor?.includes('/')) {
                            ODA.import(editor).then(async imp => {
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
            :host{
                padding-left: 4px;
            }
            :host>span{
                @apply --dimmed;
                user-select: text;
            }
        </style>
        <span :disabled="item?.ro" style="align-self: center;" class="flex horizontal" ~is="item?.editor" :value="item?.value || ''" @value-changed=" item.value = $event.detail.value || undefined">{{item?.value}}</span>
        <oda-button ~if="item.list?.length" @tap.stop.prevent="showDD" icon="icons:chevron-right:90"></oda-button>
        <oda-button ~if="item.default !== undefined && item.value !== item.default" @tap.stop.prevent="resetValue" icon="icons:autorenew"></oda-button>
    `,
    item: null,
    async showDD(e){
        const res = await ODA.showDropdown('oda-menu', {items: this.item.list.map(i => ({label: i?.label ?? i?.name ?? i , value: i}))}, {parent: e.target.domHost});
        this.item.value = res.focusedItem.value;
    },
    resetValue() {
        this.item.value = this.item.default;
    }
})
function parseInspectedObject(io, expertMode, onlySave) {
    const result = [];
    if (typeof io === 'object') {
        if (!io?.props)
            expertMode = true;
        const props = io?.props || {};
        let proto = io;
        while (proto) {
            const descriptors = Object.getOwnPropertyDescriptors(proto);
            for (let name in descriptors) {
                if (!expertMode && (name.startsWith('$obs$') || name === '$$savePath')) continue; //todo: найти другое решение
                const p = props[name];
                if (!expertMode && (!p || p.private || (onlySave && p && !p.save))) continue;
                let d = descriptors[name];
                if (typeof d.value === 'function') continue;
                if (name.startsWith('#') || name === 'props' || name === '__proto__' || name === '__op__') continue;
                if (result.some(i => i.name === name)) continue;
                const row = {name, category: p?.category || proto?.constructor?.name, ro: p?.readOnly || typeof d.value === 'object', list: p?.list };

                let editor = p?.editor;
                if (editor?.includes('/')){
                    ODA.import(editor).then(async imp=>{
                        row.editor =  (await imp?.default)?.is || getTypeEditor(p?.type || typeof d.value || typeof p.default);
                        this.render();
                    })
                }
                else{
                    row.editor = editor || getTypeEditor(p?.type || typeof d.value || typeof p.default)
                }
                const handler = {}

                Object.defineProperty(row, 'value', {
                    get(){
                        return io[name];
                    },
                    set(n){
                        io[name] = n;
                    }
                })
                // d = Object.assign({}, d)

                // if (d.get || d.set) {
                //     if (d.set) {
                //         d.set = function (value) {
                //             row.ro = row.ro || (typeof value === 'object');
                //             io[name] = value;
                //         }
                //     }
                //     else {
                //         row.ro = true;
                //     }
                //     d.get = function () {
                //         const value = io[name];
                //         row.ro = row.ro || (typeof value === 'object');
                //         return value || '';
                //     }
                // }
                // Object.defineProperty(row, 'value', d)
                result.push(row);
            }
            if (!expertMode && result.length)
                break;
            proto = proto.__proto__;
        }
    }
    return result;
}

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
            return 'oda-pg-string';
    }
    return 'span';
}

ODA({ is: 'oda-pg-object',
    template: `
        {{text}}
    `,
    value: null,
    get text() {
        if (Array.isArray(this.value))
            return `Array (${this.value.length})`
        return this.value?.constructor?.name || this.value
    }
})

ODA({ is: 'oda-pg-string',
    template: /*html*/`
        <style>
            input{
                font-size: medium;
                padding: 0px;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        </style>
        <input class="flex" type="text" style="border: none; outline: none; min-width: 0;width: 100%;" ::value="item.value" @tap.stop.prevent @keydown.stop>
    `,
})
ODA({ is: 'oda-pg-number',
    template: /*html*/`
        <input class="flex"  style="border: none; outline: none; min-width: 0;width: 100%;"  type="number" ::value="item.value" @tap.stop.prevent @keydown.stop>
    `,
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
        <oda-checkbox class="flex" ::value="item.value" style="justify-content: center;" @tap.stop.prevent></oda-checkbox>
    `,
})

ODA({ is: 'oda-property-grid-cell',
    template: /* html */`
    <style>
        :host{
            padding-left: 4px;
        }
        :host>span[disabled]{
            pointer-events: auto;
            user-select: text;
        }
    </style>
    <span :disabled="item?.ro || item?.editor === 'span'" style="align-self: center;" class="flex horizontal" ~is="item?.editor" ::value="item.value">{{item?.value}}</span>
    <oda-button ~if="item.list?.length" @tap.stop.prevent="showDD" icon="icons:chevron-right:90"></oda-button>
    `,
    item: null,
    async showDD(e){
        const res = await ODA.showDropdown('oda-menu', {items: this.item.list.map(i => ({label: i?.label ?? i?.name ?? i , value: i}))}, {parent: e.target.domHost});
        this.item.value = res.focusedItem.value;
    }
})

ODA({ is: 'oda-property-header-cell-label',
    template: `
        <label style="text-align: center;" class="flex">{{inspectedObject?.constructor?.name}}</label>
    `,
    item: null
})

ODA({ is: 'oda-property-grid-header-cell',
    template: `
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