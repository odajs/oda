ODA({is: 'oda-property-grid', imports: '@oda/table', extends: 'this, oda-table',
    template: /*html*/`
        <style>
            :host {
                max-height: 100%;
                border: 1px solid gray;
            }
        </style>
        <slot ~show="!inspectedObject" @slotchange="onSlot"></slot>
    `,
    get columns() {
        return [
            { name: 'name', cellTemplate: 'oda-pg-cell-name', headerTemplate: 'oda-property-grid-header-cell-name', label: 'Property', treeMode: true, fix: 'left', $sort: 1 },
            { name: 'value', cellTemplate: 'oda-pg-cell-value', headerTemplate: 'oda-property-grid-header-cell-value' },
            { name: 'category', $hidden: true, $sortGroups: 0 },
        ]
    },
    get groups() {
        return this.columns.filter(c => c.name === 'category');
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
    $final: {
        $readOnly: true,
        lazy: true,
        autoWidth: true,
        allowFocus: true,
        allowFocusCell: true,
        showHeader: true,
        showFooter: false,
        colLines: true,
        rowLines: true
    },

    $public: {
        $pdp: true,
        autoFixRows: true,
        inspectedObject: Object,
        icon: 'icons:settings',
        expertMode: false,
        allowExpertMode: false,
        filterByFlags: {
            $def: '',
            get $list() {
                return ROCKS.PROPERTY_FLAGS
            },
            $multiSelect: true
        },
        groupExpandingMode: 'first',
    },
    get dataSet() {
        if (this.inspectedObject) {
            const ds = this.PropertyGridDataSet;
            ds.__expanded__ = true;
            return ds.items;

        }
        return [];
    },
    get PropertyGridDataSet() {
        return new PropertyGridDataSet(this.inspectedObject, this.expertMode, this.filterByFlags)
    },
    onSlot(e) {
        this.inspectedObject ??= e.target.assignedElements();
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

class PropertyGridDataRowOwner extends ROCKS({
    __expanded__: {
        $def: false,
        get() {
            return false
        }
    },
    $hasChildren: undefined,
    get items() {
        if (this.mixed)
            return [];
        if (!this.__expanded__) {
            if (this.value && typeof this.value === 'object') {
                if (Object.keys(this.value).length) {
                    return [this.value];
                }
            }
            return [];
        }
        const items = {}
        for (let obj of this.inspectedObjects || []) {
            if (!(obj instanceof Object)) continue;

            if (!this.isRevoked && this.name) {
                obj = obj[this.name];
                if (!obj) continue;
            }
            if (!(obj instanceof Object)) continue;


            const isRocks = obj.constructor.__rocks__;
            let proto = obj;
            while (proto) {

                const descriptors = proto.constructor.__rocks__?.descrs || Object.getOwnPropertyDescriptors(proto);
                for (let name in descriptors) {
                    const d = descriptors[name];
                    if (d.value instanceof Function)
                        continue;
                    if (typeof d.$hidden === 'function') {
                        if (d.$hidden.call(obj))
                            continue;
                    } else if (d.$hidden)
                        continue;
                    if (!d.enumerable)
                        continue;
                    if (this.filter) { //todo множественный выбор
                        if (!this.filter.some(i => {
                            return d[i];
                        })) continue;
                    }

                    if (proto === obj && !this.dataSet.expert) {
                        if (!d.$public && !this.prop?.$public)
                            continue;
                    }
                    const row = items[name] ??= new PropertyGridDataRow(name, this.dataSet, proto, d);
                    row.inspectedObjects?.add(obj);
                }
                if (!this.dataSet.expert && !items.length)
                    break;
                proto = proto.__proto__;
            }
        }
        return Object.values(items);
    }
}) {}


class MixedArray extends Array {

}
class PropertyGridDataRow extends PropertyGridDataRowOwner.ROCKS({
    get io() {
        return this.dataSet.inspectedObjects[0];
    },
    get category() {
        let cat = this.prototype.constructor.name;
        if (this.prop?.$group)
            cat = this.prop?.$group;
        if (!this.prop?.enumerable)
            cat += ' (private)';
        return cat;
    },
    get mixed() {
        return this.value instanceof MixedArray;
    },
    _extractEditor(s) { // @path/path[component-name]
        const parts = s.split('[');
        if (parts.length === 2) {
            return { path: parts[0], tag: parts[1].slice(0, -1) };
        }
        return { path: undefined, tag: s };
    },
    _getDefaultEditor() {
        switch (this.prop?.$type || typeof this.value) {
            case Array:
            case Object:
            case Function:
            case 'object':
            case 'function':
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
        const editor = this.prop?.$editor || this.value?.$editor;
        if (editor) {
            const onError = (err) => {
                console.error(`Type editor to "${this.name}" prop not loaded.\n`, err);
                this.editor = this._getDefaultEditor();
            }
            try {
                const { path, tag } = this._extractEditor(editor);
                if (path) {
                    let url = this.inspectedObjects[0]?.url || '';
                    Promise.resolve(ODA.import((url ? (url + '/~/') : '') + path)).catch(onError);
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
        if (this.ro) return;
        for (let io of this.inspectedObjects) {
            if (io[this.name] !== n)
                io[this.name] = n;
        }
    },
    get ro() {
        if (this.prop) {
            if (this.prop?.$readOnly)
                return true;
            if (this.prop.getter && !this.prop.setter)
                return true;
            return false;
        }
        return true;
    },
    get list() {
        return this.prop?.$list;
    },
    get defaultValue() {
        if (typeof this.prop?.$def === 'function')
            return this.prop.$def.call(this.io);
        return this.prop?.$def;
    },
    __expanded__: {
        $def: false,
        set(n) {
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
}) {
    constructor(name, dataSet, prototype, prop) {
        super(name, dataSet, prototype)
        this.dataSet = dataSet;
        this.prototype = prototype;
        this.prop = prop;
        this.name = name;
        this.inspectedObjects = [];
    }
}

class PropertyGridDataSet extends PropertyGridDataRowOwner.ROCKS({
    get dataSet() {
        return this;
    },
    isRoot: true,

}) {
    constructor(inspectedObject, expert, filter) {
        super(inspectedObject, expert, filter);
        this.expert = expert;
        if (filter) {
            this.filter = str2arr(filter);
        }


        if (!Array.isArray(inspectedObject))
            this.inspectedObjects = [inspectedObject];
        else if (inspectedObject.every(i => typeof i === 'object'))
            this.inspectedObjects = inspectedObject;
        else
            this.inspectedObjects = [inspectedObject];
    }
}

cells: {
    ODA({is: 'oda-pg-cell-value', extends: 'oda-table-cell', imports: '@oda/menu',
        template: /*html*/`
        <style>
            :host {
                overflow: hidden;
                @apply --horizontal;
                user-select: text !important;
            }
            .editor {
                border: none !important;
            }
        </style>
        <oda-button ~if="list?.length" @tap.stop.prevent="showDD" icon="icons:chevron-right:90"></oda-button>
        `,
        disabled: {
            $attr: true,
            $type: Boolean,
            get() {
                return this.item?.ro;
            }
        },
        $public: {
            get template() {
                return this.item?.editor;
            },
            list: {
                $def: [],
                get() {
                    return this.item?.list;
                }
            }
        },
        $keyBindings: {
            ArrowLeft(e) { e.stopPropagation(); },
            ArrowRight(e) { e.stopPropagation(); },
            ArrowUp(e) { e.stopPropagation(); },
            ArrowDown(e) { e.stopPropagation(); },
        },
        attached() {
            this.listen('dblclick', '_dblclick', { target: this , capture: true })
        },
        detached() {
            this.unlisten('dblclick', '_dblclick', { target: this , capture: true })
        },
        _dblclick(e) {
            if (this.table?.activeCell === this) {
                e.stopPropagation();
            }
        },
        async showDD(e) {
            if (this.__dd_control) {
                this.__dd_control.fire('cancel');
            }
            else {
                this.__dd_control = ODA.createElement('oda-menu', { items: this.list.map(i => ({ label: i?.label ?? i?.name ?? i, value: i.value || i })), selectedItem: this.item.value });
                try {
                    const { control } = await ODA.showDropdown(this.__dd_control, {}, { parent: e.target.domHost, title: this.item.name, fadein: true });
                    this.item.value = control.focusedItem.value;
                }
                catch (e) {

                }
            }

            delete this.__dd_control;
            this.__dd_control = undefined;
        },
        resetValue() {
            this.item.value = this.item.default;
        },
        activate() {
            const control = this.$('.field-control');
            if (control) {
                control?.activate();
                this.listen('deactivate', () => {
                    this.async(() => {
                        this.fire('deactivate');
                    }, 300);
                }, { target: control, once: true });
            }
        },
        deactivate() {
            const control = this.$('.field-control');
            if (control) {
                control?.deactivate();
            }
        }
    })
    ODA({is: 'oda-pg-cell-name', extends: 'oda-table-cell',
        template: /*html*/`
            <oda-button :title="item.defaultValue" ~if="showDefaultButton" :disabled="disabledReset" @tap.stop.prevent="resetValue" icon="av:replay"></oda-button>
         `,
        get showDefaultButton() {
            return this.item.defaultValue !== undefined && typeof this.item.defaultValue !== 'object';
        },
        title: {
            get() {
                return this.item.name;
            },
            $attr: true,
        },
        get disabledReset() {
            return Object.equal(this.item.defaultValue, this.item.value, true);
        },
        disabled: {
            $attr: true,
            $type: Boolean,
            get() {
                return this.item?.ro;
            }
        },
        resetValue() {
            this.item.value = this.item.defaultValue;
        },
        get value() {
            return this.item.label || this.item.name;
        }
    })

    ODA({is: 'oda-property-grid-header-cell-name', extends: 'oda-table-header-cell',
        template: /*html*/`
            <style>
                :host {
                    @apply --horizontal;
                    align-items: center;
                }
            </style>
            <oda-button ~if="allow" class="no-flex"  @tap.stop.prevent="resetValue" icon="av:replay" slot="tools" title="Reset all defaults"></oda-button>
        `,
        get allow() {
            return this.items.filter(i => {
                return i.defaultValue !== undefined && i.defaultValue !== i.value;
            }).length > 0;
        },
        async resetValue() {
            let io = this.inspectedObject
            if (!Array.isArray(io)) {
                io = [io]
            }

            const changedItems = this.items.filter(i => i.value !== i.defaultValue)
                                           .map(i => ({ name: i.name }));
            await ODA.import('@oda/tree');
            const { control } = await ODA.showDialog('oda-tree',
                {
                    allowCheck: 'single',
                    allowSelection: 'level',
                    allowFocusCell: true,
                    selectByCheck: true,
                    dataSet: changedItems,
                    selectedRows: [...changedItems],
                    style: 'padding: 32px 16px 0px 16px;'
                },
                {
                    title: 'Check props to reset to default',
                }
            );

            this.items.forEach(item => {
                if ((item.defaultValue === undefined) || !control.selectedRows.some(r => (r.name === item.name)))
                    return;
                item.value = (typeof item.defaultValue === 'function') ? item.defaultValue() : item.defaultValue;
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
            <oda-button ~if="allowExpertMode" class="no-flex" allow-toggle ::toggled="expertMode" icon="social:school"></oda-button>
        `
    })
}
editors: {
    ODA({is: 'oda-pg-base',
        template: /*html*/`
        <style>
            :host input[disabled] {
                filter: unset;
                opacity: unset;
            }
        </style>
        `,
        // $listeners: {
        //     dblclick(e) {
        //         if (this.table?.activeCell === this.domHost) {
        //             e.stopPropagation();
        //         }
        //     },
        // },
        attached() {
            const input = this.$('input');
            if (input) {
                input.disabled = true;
            }
        },
        activate() {
            const input = this.$('input');
            if (input) {
                input.addEventListener('blur', () => { input.disabled = true; this.deactivate(); }, { once: true });
                input.disabled = false;

                this.async(() => {
                    input.focus();
                });
            }
        },
        deactivate() {
            const input = this.$('input');
            if (input) {
                input.blur();
                input.disabled = true;
            }
            this.fire('deactivate');
        }
    })
    ODA({is: 'oda-pg-object',
        template: /*html*/`
        <style>
            :host {
                @apply --disabled;
            }
        </style>
        {{text}}
        `,
        get text() {
            if (!this.value)
                return '[Object: undefined]';
            if (Array.isArray(this.value))
                return `[Array (${this.value.length})]`
            if (this.value instanceof Object)
                return '[' + (this.value?.constructor?.name || typeof this.value) + ']';
            return this.value;
        }
    })

    ODA({is: 'oda-pg-mixed', extends: 'oda-pg-base',
        template: /*html*/`
        <style>
            :host{
                @apply --flex;
                @apply --vertical;
                align-self: normal !important;
            }
        </style>
        <input :placeholder="'mixed: [' + item.value+']'" class="error flex content" type="text" style="border: none; outline: none; min-width: 0;width: 100%;" :readonly="item.ro === true"  @input="_input">
        `,
        _input(e) {
            this.item.value = e.target.value;
        }
    })

    ODA({is: 'oda-pg-string', extends: 'oda-pg-base',
        template: /*html*/`
        <style>
            :host > input {
                font-size: medium;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        </style>
        <input class="flex content" type="text" style="border: none; outline: none; min-width: 0;width: 100%;" ::value="item.value" :readonly="item.ro === true">
        `,
    })
    ODA({is: 'oda-pg-number', extends: 'oda-pg-base',
        template: /*html*/`
        <input class="flex content"  style="border: none; outline: none; min-width: 0;width: 100%;"  type="number" ::value :readonly="item.ro === true">
        `,
        get value() {
            return +this.item.value;
        },
        set value(n) {
            this.item.value = +n;
        }
    })
    ODA({is: 'oda-pg-bool', extends: 'oda-pg-base',
        template: /*html*/`
        <style>
            :host {
                @apply --horizontal;
                @apply --flex
                align-items: center;
                min-height: 100%;
            }
            input{
                min-height: 100%;
            }
        </style>
        <input class="flex content" type="checkbox" ::checked="item.value">
        `,
    })
    // ODA({is: 'oda-pg-bool', imports: '@oda/checkbox',
    //     template: /*html*/`
    //         <style>
    //             :host {
    //                 @apply --horizontal;
    //                 @apply --flex
    //                 align-items: center;
    //             }
    //         </style>
    //         <oda-checkbox class="flex" ::value="item.value" style="justify-content: center;" :readonly="item.ro === true"></oda-checkbox>
    //     `,
    // })
}
