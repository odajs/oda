import '../../../../components/buttons/button/button.js';
import '../../../../components/grids/list/list.js';
import '../../../containers/containers.js';

ODA({
    is: "oda-property-grid2", template: `
        <style>
            :host {
                display: flex;
                flex-direction: column;
                overflow-y: auto;
                border: 1px solid var(--dark-background);
            }
            .hheader {
                position: sticky;
                top: 0px;
                display: flex;
                align-items: center;
                border-bottom:1px solid var(--dark-background);
                z-index: 1;
            }
            .label {
                display: flex;
                flex: 1;
                align-items: center;
                font-size: large;
                color: var(--content-color);
            }
            .container {
                position: relative;
                flex: 1;
                overflow-y: auto;
                overflow-x: hidden;
            }            
            .header {
                position: sticky;
                top: 0px;
                display: flex;
                align-items: center;
                border-bottom:1px solid var(--dark-background);
                min-height: 28px;
                padding-left: 16px;
                z-index: 1;
            }
            .splitter {
                position: absolute;
                left: {{labelColumn + 24}}px;
                max-width: 4px;
                min-width: 4px;
                cursor: col-resize;
                z-index: 99;
                height: 100%;
            }
            .splitter:active {
                background: darkgray;
            }
            .splitter2 {
                position: absolute;
                left: {{labelColumn + 25}}px;
                width: 1px;
                border-right: 1px solid var(--dark-background);
                height: 100%;
            }
        </style>
        <div class="hheader dark">
            <div class="label dark" style="height:32px">{{item?.label || label}}</div>
            <div ~if="showButtons" class="horizontal">
                <oda-button class="flex" aloow-toggle :toggled="focus" icon="icons:radio-button-checked" title="view focused" @click="_focus"></oda-button>
                <oda-button class="flex" icon="icons:refresh" title="refresh" @tap="_expert"></oda-button>
                <oda-button class="flex" :icon="sort==='ascending'?'icons:sort:180':sort==='descending'?'icons:sort':'icons:menu'" title="sort" @tap="_sort"></oda-button>
                <oda-button class="flex" aloow-toggle :toggled="group" icon="icons:list" title="category" @tap="_group"></oda-button>
                <oda-button class="flex" aloow-toggle :toggled="expertMode" icon="icons:settings" title="expertMode" @tap="_expert('expert')"></oda-button>
            </div>
        </div>
        <div class="container" ref="cnt" @up="_splitter=false" @scroll="_scroll($event)">
            <div class="splitter2" ref="splitter2"></div>
            <div class="splitter" ref="splitter" @down="_splitter=true"></div>

            <div class="group" ~for="i in Object.keys(item || {})">
                <div ~show="group" class="header" @tap="focused=item[i][0].obj">{{i}} [{{item[i] && item[i].length}}]</div>
                <oda-property-tree class="tree" :item="item[i]" ::focused :args :label-column="labelColumn"></oda-property-tree>
            </div>
        </div>
        <div class="horizontal">
            <div class="hheader dark" style="height:28px" :style="{width:(labelColumn+26)+'px'}">
                <div style="padding-left:8px; color: var(--dark-color)">
                    {{ioLength}}
                </div>
            </div>
            <div class="hheader dark flex" style="margin-left:1px;height:28px;"></div>
        </div> 
    `,
    props: {
        label: 'PropertyGrid',
        io: {
            type: Object,
            set(n, o) {
                if (this._isReady)
                    this.getData();
            },
            freeze: true
        },
        ioLength: 0,
        expertMode: Boolean,
        group: true,
        item: Object,
        labelColumn: {
            type: Number,
            default: 150,
            save: true
        },
        sort: {
            type: String,
            default: 'none',
            list: ['none', 'ascending', 'descending'],
        },
        focused: Object,
        focus: false,
        _splitter: false,
        categories: Array,
        showButtons: true,
        args() { return { expert: this.expertMode, group: this.group, sort: this.sort, categories: this.categories } },
    },
    attached() {
        this.getData();
        this._isReady = true;
    },
    listeners: {
        track(e) {
            if (!this._splitter) return;
            requestAnimationFrame(() => {
                let w = this.labelColumn + e.detail.ddx;
                w = w <= 100 ? 100 : w;
                this.labelColumn = w;
            });
        },
        dblClick(e) {
            this.getData(e.detail.value.el);
            this.focus = true;
        }
    },
    _scroll(e) {
        if (!this.$refs?.splitter) return
        this._top = (e.target.scrollTop - 2) + 'px';
        requestAnimationFrame(() => {
            this.$refs.splitter.style.top = this._top;
            this.$refs.splitter2.style.top = this._top;
        })
    },
    getData(io = this.io, _io) {
        this.async(() => {
            if (!_io)
                this._io = makeData(io, this.args);
            const obj = {};
            this.ioLength = 0;
            this._io.items.map(i => {
                let cat = i.category || 'props';
                obj[cat] = obj[cat] || [];
                obj[cat].push(i);
                this.ioLength++;
            })
            this.item = obj;
            if (this.$refs?.cnt) this.$refs.cnt.scrollTop = 0;
            this.render();
        }, 100)
    },
    _expert(e) {
        if (e === 'expert') this.expertMode = !this.expertMode;
        const _io = this.focus ? this._io : undefined;
        this.getData(this.io, _io);
    },
    _sort(e) {
        this.sort = this.sort === 'none' ? 'ascending' : this.sort === 'ascending' ? 'descending' : 'none';
        const io = this.focus ? this.focused.el || this.focused : this.io;
        this.getData(io);
    },
    _group(e) {
        this.group = !this.group;
        this.getData();
    },
    _focus(e) {
        if (this.focused) {
            this.focus = !this.focus;
            const io = this.focus ? this.focused.el || this.focused : this.io;
            this.getData(io);
        }
    }
})

ODA({
    is: "oda-property-tree", template: `
        <style>
            .complex {
                margin-left: 6px;
                border-left: 1px dotted var(--dark-background);
                overflow: hidden;
            }
            .row[isfocused] {
                box-shadow: inset 0 -2px 0 0 var(--focused-color);
            }
            .row:hover {
                cursor: pointer;
                box-shadow: inset 0 -2px 0 0 var(--dark-background);
            }
            .input {
                margin: 2px;
                font-size: 1em;
                outline: none; 
                background-color: var(--content-background);
                color: var(--content-color);
                border: none;
                flex:1;
                min-width: 0px;
                overflow: hidden;
                padding:0 4px;
            }
            .input[type="checkbox"] {
                max-height: 18px;
            }
            .prop {
                max-width: {{labelColumn}}px;
                width: {{labelColumn}}px;
                height: {{iconSize}}px;
            }
        </style>
        <div ~for="i in _items">
            <div class="row" :isfocused="focused === i" style="border-bottom: .5px solid var(--dark-background)" @tap="focused=i">
                <div style="display:flex;align-items:center;">
                    <oda-icon ~if="i.items?.length || i.is" :icon="i.expanded?'icons:chevron-right:90':'icons:chevron-right'" allow-toggle :toggled="i.expanded" :icon-size="iconSize - 2" fill="gray" @tap="_expanded(i)"></oda-icon>
                    <div ~if="!(i.items?.length || i.is)" style="min-width:22px"></div>
                    <div class="prop" style="overflow:hidden;display:flex;padding:0 2px;white-space: nowrap;align-items: center;" @dblclick="_dblclick($event, i)">{{i.label||i.name}}</div>
                    <input ~is="i.editor || 'input'" class="input" :type="i.type||'text'" :checked="i.value" ::value="i.value" ~style="{height:iconSize+'px'}" @change="_change($event, i)" :disabled="i.is || i.readOnly">
                    <oda-button ~if="i.list && !i.readOnly" icon="icons:chevron-right:90" @tap="_openDropdown($event, i)"></oda-button>
                </div>
            </div>
            <div class="complex">
                <oda-property-tree ~if="(i.el || i.items?.length) && i.expanded" :item="i.data || i.items" ::focused :args :label-column="labelColumn"></oda-property-tree>
            </div>
        </div>
    `,
    props: {
        args: Object,
        item: Object,
        labelColumn: 150,
        iconSize: 24,
        _items() { return this.item?.map ? this.item : this.item?.items?.map ? this.item.items : [] },
        focused: Object
    },
    _expanded(i) {
        i.expanded = !i.expanded;
        if (i.expanded)
            i.data = makeData(i.obj[i.key], this.args, true);
        else
            i.data = [];
    },
    _change(e, i) {
        if (e.target.type === 'checkbox') i.obj[i.key] = e.target.checked;
        else i.obj[i.key] = e.target.value
        this.fire('pg-changed', i);
    },
    async _openDropdown(e, i) {
        let res = await ODA.showDropdown('oda-list', { items: i.list, focusedItem: i.value }, { parent: e.target, useParentWidth: false });
        if (res?.focusedItem) i.obj[i.key] = res.focusedItem;
    },
    _dblclick(e, i) {
        this.fire('dblClick', i);
    }
})

function makeData(el, { expert, group, sort, categories }, sure = false) {
    const editors = {
        'boolean': 'checkbox',
        'number': 'number',
        'string': 'text'
    }
    let obj = el;
    const exts = /^(_|\$|#)/;
    const _label = el?.constructor?.name || el?.localName || '';
    const data = { _label, items: [] };
    const props = el?.props || el?.properties || undefined;

    function fn(key, category = 'props', props) {
        category = props?.category || category;
        const _ok = !categories || (categories && categories.includes(category)) || (categories && sure);
        if (!_ok) return;
        try {
            let value = el[key], is, type;
            const label = props && props[key] && props[key].label || key;
            const item = { label, key, value, el: el[key], items: [], category, obj };
            if (value && Array.isArray(value)) {
                Object.defineProperty(item, 'value', { get() { return 'Array [' + (this?.obj && this.obj[this.key] ? this.obj[this.key].length : '') + ']'; } });
                is = 'array';
                type = 'text';
            } else if (value !== null && typeof value === 'object') {
                Object.defineProperty(item, 'value', { get() { return '[Object]'; } });
                is = 'object';
                type = 'text';
            } else {
                type = props && props[key] && props[key].type ? props[key].type.name.toLowerCase() : undefined;
                if (!type)
                    type = typeof el[key];
                if (editors[type])
                    type = editors[type];
                item.type = type || 'text';
                item.editor = props && props[key] && props[key].editor || undefined;
                Object.defineProperty(item, 'value', {
                    get() { try { return this.obj[this.key] } catch (err) { return value } },
                    set(v) { this.obj[this.key] = v; }
                });
            }
            if (props && props[key] && props[key].list) item.list = props[key].list;
            item.is = is;
            data.items.push(item);
        } catch (err) { }
    }

    if (props)
        for (const key of Object.keys(props)) {
            if (!expert && exts.test(key)) continue;
            fn(key, props[key].category || 'properties', props);
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
    if (sort === 'ascending' || sort === 'descending') {
        data.items.sort((a, b) => {
            if (a.label > b.label) return sort === 'ascending' ? 1 : -1;
            if (b.label > a.label) return sort === 'ascending' ? -1 : 1;
        });
    }
    return data;
}
