import '../../../../components/buttons/button/button.js';
import '../../../../components/grids/list/list.js';

ODA({
    is: "oda-property-grid2", template: `
        <style>
            :host {
                display: flex;
                flex-direction: column;
                overflow-y: auto;
                border: 1px solid gray;
            }
            .hheader {
                position: sticky;
                top: 0px;
                display: flex;
                align-items: center;
                background-color: #a0a0a0;
                border-bottom:1px solid gray;
                z-index: 1;
            }
            .label {
                display: flex;
                flex: 1;
                align-items: center;
                font-size: large;
                color: white;
            }
            .container {
                position: relative;
                flex: 1;
                overflow-y: auto;
                overflow-x: hidden;
            }            
            .group-header {
                position: sticky;
                top: 0px;
                display: flex;
                align-items: center;
                background-color: #d0d0d0;
                border-bottom:1px solid gray;
                min-height: 28px;
                padding-left: 16px;
                z-index: 1;
                color: gray;
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
                border-right: 1px solid lightgray;
                height: 100%;
            }
        </style>
        <div class="hheader">
            <div class="label">{{item?.label || label}}</div>
            <div class="horizontal">
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

            <div class="group" ~for="key in Object.keys(item || {})">
                <div ~show="group" class="group-header" @tap="focused=item[key][0].obj">{{key}} [{{item[key].length}}]</div>
                <oda-property-tree class="tree" :item="item[key]" ::focused :args></oda-property-tree>
            </div>
        </div>
        <div class="horizontal">
            <div class="hheader" style="height:28px" :style="{width:(labelColumn+26)+'px'}">
                <div style="padding-left:8px; color: white">
                    {{ioLength}}
                </div>
            </div>
            <div class="hheader flex" style="margin-left:1px;height:28px;"></div>
        </div> 
    `,
    props: {
        label: 'PropertyGrid',
        io: {
            type: Object,
            set(n, o) {
                this.getData();
            }
        },
        ioLength: 0,
        expertMode: Boolean,
        group: true,
        item: {
            type: Object,
            freeze: true
        },
        labelColumn: {
            default: 150,
            shared: true,
            save: true
        },
        sort: {
            type: String,
            default: 'none',
            list: ['none', 'ascending', 'descending'],
        },
        focused: Object,
        focus: false,
        args: {
            type: Object,
            get() { return { expert: this.expertMode, group: this.group, sort: this.sort } },
            shared: true
        },
        _splitter: false
    },
    attached() {
        //this.getData();
    },
    listeners: {
        track(e) {
            if (!this._splitter) return;
            requestAnimationFrame(() => {
                let w = this.labelColumn + e.detail.ddx;
                w = w <= 0 ? 0 : w;
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
        if (!_io)
            this._io = makeData(io, this.args);
        const obj = {};
        this.ioLength = 0;
        this._io.items.map(i => {
            let cat = i.category || 'no category';
            obj[cat] = obj[cat] || [];
            obj[cat].push(i);
            this.ioLength++;
        })
        this.item = obj;
        if (this.$refs?.cnt) this.$refs.cnt.scrollTop = 0;
        this.render();
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
                background-color: hsla(90, 0%, 50%, .1);
                box-shadow: inset 0 -2px 0 0 gray;
                overflow: hidden;
            }
            .row:hover {
                background-color: lightyellow;
                cursor: pointer;
            }
            .row[isfocused] {
                box-shadow: inset 0 -1px 0 0 blue;
            }
            .input {
                font-size: 1em;
                color: gray;
                outline: none; 
                background: transparent; 
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
            <div class="row" :isfocused="focused === i" style="border-bottom: .5px solid lightgray" @tap="focused=i">
                <div style="display:flex;align-items:center;">
                    <oda-icon ~if="i.items?.length || i.is" :icon="i.expanded?'icons:chevron-right:90':'icons:chevron-right'" allow-toggle :toggled="i.expanded" :icon-size="iconSize - 2" fill="gray" @tap="_expanded(i)"></oda-icon>
                    <div ~if="!(i.items?.length || i.is)" style="min-width:22px"></div>
                    <div class="prop" style="color: gray;overflow:hidden;display:flex;padding:0 2px;white-space: nowrap;align-items: center;" @dblclick="_dblclick($event, i)">{{i.label||i.name}}</div>
                    <input class="input" :type="i.type||'text'" :checked="i.value" :value="i.value" ~style="{height:iconSize+'px'}" @change="_change($event, i)" :disabled="i.is || i.readOnly">
                    <oda-button ~if="i.list && !i.readOnly" icon="icons:chevron-right:90" @tap="_openDropdown($event, i)"></oda-button>
                </div>
            </div>
            <div class="complex">
                <oda-property-tree ~if="(i.el || i.items?.length) && i.expanded" :item="i.data || i.items" ::focused :args></oda-property-tree>
            </div>
        </div>
    `,
    props: {
        args: Object,
        item: {
            type: Object,
            freeze: true
        },
        labelColumn: {
            default: 150,
            shared: true
        },
        iconSize: 24,
        _items: {
            freeze: true,
            reactive: true,
            get() { return this.item?.map ? this.item : this.item?.items?.map ? this.item.items : [] }
        },
        focused: Object
    },
    _expanded(i) {
        i.expanded = !i.expanded;
        if (i.expanded)
            i.data = makeData(i.el, this.args);
        else
            i.data = [];
        this.render();
    },
    _change(e, i) {
        if (e.target.type === 'checkbox') i.obj[i.label] = e.target.checked;
        else i.obj[i.label] = e.target.value
        this.render();
    },
    async _openDropdown(e, i) {
        let res = await ODA.showDropdown('oda-list', { items: i.list, focusedItem: i.value }, { parent: e.target, useParentWidth: false });
        if (res?.focusedItem) i.obj[i.label] = res.focusedItem;
    },
    _dblclick(e, i) {
        this.fire('dblClick', i);
    }
})

function makeData(el, { expert, group, sort }) {
    const editors = {
        'boolean': 'checkbox',
        'number': 'number',
        'string': 'text'
    }
    let obj = el;
    const exts = /^(_|\$|#)/;
    const label = el?.constructor?.name || el?.localName || '';
    const data = { label, items: [] };
    const props = el?.props || el?.properties || undefined;

    function fn(key, category = 'no category', props) {
        if (!group) category = '...';
        try {
            let value = el[key], is, type;
            const _docs = undefined;
            if (el[key] && el[key]._docs) _docs = el[key]._docs;
            const item = { label: key, value, el: el[key], items: [], category, obj, _docs };
            if (value && Array.isArray(value)) {
                Object.defineProperty(item, 'value', { get() { return 'Array [' + (this?.obj && this.obj[this.label] ? this.obj[this.label].length : '') + ']'; } });
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
                Object.defineProperty(item, 'value', {
                    get() { try { return this.obj[this.label] } catch (err) { return value } },
                    set(v) { this.obj[this.label] = v; }
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
