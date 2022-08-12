ODA({is: 'oda-list-box', imports: '@oda/icon, @oda/checkbox',
    template: /*html*/`
    <style>
        :host {
            height: 100%;
            min-width: 150px;
            /*max-width: 300px;*/
            overflow: hidden;
            text-overflow: ellipsis;
            @apply --vertical;
            @apply --content;
        }
        :host > .listcontainer {
            overflow: auto;
            overflow-x: hidden;
            text-overflow: ellipsis;
            position: relative;
        }
        :host > .label {
            opacity: 0.5;
            padding: 4px 8px;
        }
        oda-list-box-item {
            padding: {{_itemPadding}}px;
        }{}
    </style>
    <div ref="listcontainer" class="listcontainer flex" @scroll="_onScroll" tabindex="0">
        <div class="flex" :style="{height: \`\${ rows.length * rowSize }px\`}">
            <div class="flex" style="position: sticky; top: 0px;" :style="{maxHeight: \`\${(rowCount + 1) * rowSize}px\`}">
                <div ~is="item.template || defaultTemplate || 'oda-list-box-item'" ~for="(item, i) in visibleRows" :key="i" :item="item" :icon-size="iconSize" :focused="focusedItem === item" :selected="_getSelected(multiple, selection, item)" :hide-icon="hideIcons" :combo-mode="comboMode" @tap="_tap($event, true)" @check="_check" ~style="{paddingLeft: !comboMode && hasIcons && !item.icon ? ((_itemPadding + iconSize) + 'px') : ''}"></div>
            </div>
        </div>
    </div>
    <div ref="buttons" ~if="comboMode" class="horizontal" style="align-items: center;">
        <oda-button class="near" icon="icons:check-box" @tap="selectAll"></oda-button>
        <oda-button class="near" icon="icons:check-box-outline-blank" @tap="clearSelection"></oda-button>
        <div class="flex"></div>
        <oda-button style="width: 50%; justify-self: flex-end; margin-right: 2px;" class="raised" label="Apply" @tap="_result"></oda-button>
    </div>
    <span ref="counter" class="header label no-flex" :style="{height: counterHeight}" ~if="showCount" ~text="\`items count: \${ count }\`"></span>`,
    props: {
        iconSize: 24,
        _itemPadding: 8,
        rowSize: {
            type: Number,
            get() {
                return this.iconSize + this._itemPadding * 2;
            }
        },
        rowCount: 0,
        filter: {
            default: '',
            set() {
                this._setVisibleRows();
            }
        },
        orderBy: {
            type: String,
            default: 'none',
            list: ['none', 'ascending', 'descending'],
            reflectToAttribute: true,
            set() {
                this._setVisibleRows();
            }
        },
        items: [],
        rows: {
            type: Array,
            default: [],
            set(n) {
                if (n?.length) {
                    this._calcSize();
                    this._setVisibleRows();
                }
            }
        },
        visibleRows: [],
        pagesCount: 0,
        count: {
            type: Number,
            get() {
                return this.rows?.length ? this.rows.length : 0;
            }
        },
        multiple: true,
        comboMode: {
            type: Boolean,
            default: false,
            set(n, o) {
                if (o) this.bottomOffset -= this.iconSize;
                if (n) this.bottomOffset += this.iconSize;
            }
        },
        showCount: {
            type: Boolean,
            default: false,
            set(n, o) {
                if (o) this.bottomOffset -= this.counterHeight;
                if (n) this.bottomOffset += this.counterHeight;
            }
        },
        focusedItem: {
            type: [Object, String],
            default: null
        },
        selection: [],
        _startSelection: {
            type: [Object, String],
        },
        autofocus: false,
        hideIcons: {
            type: Boolean,
            get() {
                return this.items?.every(i => !i.icon);
            }
        },
        defaultTemplate: 'oda-list-box-item',
        bottomOffset: {
            default: 0,
            set(n, o) {
                if (n) {
                    this._calcSize();
                    this._setVisibleRows();
                }
            }
        },
        counterHeight: 24,
        hasIcons: false
    },
    listeners: {
        resize(e) {
            this._calcSize();
            this._setVisibleRows();
        },
    },
    _getSelected(multiple, selection, item) {
        return multiple && selection.includes(item);
    },
    observers: [
        function prepare(items, orderBy, filter) {
            let rows = [...items];
            this.hasIcons = items.some(i => i.icon);
            if (filter) {
                filter = filter.toLowerCase().split(' ');
                rows = rows.filter(r => {
                    if (typeof r === 'object') {
                        r = [r.key, r.name, r.label, r.value, r.description].filter(i => i).join(' ');
                    }
                    r = r.toLowerCase();
                    return filter.reduce((res, v) => {
                        res = res || (!!v && r.includes(v));
                        return res;
                    }, false);
                });
            }
            if (orderBy && orderBy !== 'none') {
                orderBy = (orderBy || '').toLowerCase();
                let s1, s2;
                if (orderBy.startsWith('a')) { s1 = 1; s2 = -1; }
                else { s1 = -1; s2 = 1; }
                rows.sort((a, b) => {
                    let aa = a.label || a.value || a.name || a.key || a;
                    let bb = b.label || b.value || b.name || b.key || a;
                    if (!isNaN(aa) && !isNaN(bb)) [aa, bb] = [parseFloat(aa), parseFloat(bb)];
                    return (aa === bb) ? 0 : (aa > bb ? s1 : s2);
                });
            };
            this.rows.splice(0, this.rows.length, ...rows);
        }
    ],
    attached() {
        this._calcSize();
        this._setVisibleRows();
        if (this.autofocus) this.async(() => this.focus(), 100);
    },
    _calcSize() {
        if (!this.rows || !this.rows.length) return;
        this.style.height = '';
        const ph = this.offsetHeight || this.rows.length * this.rowSize - this.bottomOffset;
        this.rowCount = Math.floor(ph / this.rowSize);
        this.pagesCount = Math.ceil(this.rows.length / this.rowCount);
        const rowsLength = (this.rows.length < this.rowCount) ? this.rows.length : this.rowCount;
        this.style.height = `${((rowsLength * this.rowSize) || this.iconSize) + this.bottomOffset}px`;
    },
    _prepare() {

    },
    _setVisibleRows() {
        const topIdx = Math.floor((this.$refs.listcontainer.scrollTop) / this.rowSize);
        this.visibleRows = this.rows.slice(topIdx, topIdx + this.rowCount + 2);;
    },
    _tap(e, fireResult = false) {
        const ctrlKey = this.comboMode || e.detail && e.detail.sourceEvent && e.detail.sourceEvent.ctrlKey;
        const shiftKey = !this.comboMode && e.detail && e.detail.sourceEvent && e.detail.sourceEvent.shiftKey;
        const item = e.target.item;
        const idx = this.rows.indexOf(item);
        if (!ctrlKey && !shiftKey) {
            this._startSelection = item;
            this.selection.splice(0, this.selection.length, item);
            this.focusedItem = item;
        } else {
            if (shiftKey) {
                let from = this.rows.indexOf(this._startSelection);
                let to = idx;
                if (from > to) [to, from] = [from, to];
                this.selection.splice(0, this.selection.length, ...this.rows.slice(from, to + 1));
            } else if (ctrlKey) {
                const s_idx = this.selection.indexOf(item);
                if (~s_idx) this.selection.splice(s_idx, 1);
                else this.selection.push(item);
            }
        }
        if (fireResult && !this.comboMode) {
            this._result();
        }
    },
    _check(e) {
        const item = e.target.item;
        const s_idx = this.selection.indexOf(item);
        if (~s_idx) this.selection.splice(s_idx, 1);
        else this.selection.push(item);
    },
    _onScroll() {
        this._setVisibleRows();
    },
    focus() {
        this.$refs.listcontainer.focus();
    },
    keyBindings: {
        home: 'first',
        end: 'last',
        ArrowUp: 'before',
        ArrowDown: 'next',
        PageUp: 'beforePage',
        PageDown: 'nextPage',
        enter: '_result',
        ' ': '_space',
        'ctrl+a,ctrl+ф': 'selectAll',
        'ctrl+i,ctrl+ш': 'invertSelection',
    },
    _space(e) {
        e.preventDefault();
        const fakeEvent = {
            detail: { sourceEvent: e },
            target: { item: this.focusedItem }
        }
        this._tap(fakeEvent);
        if (this.comboMode) this._check(e);
    },
    _result() {
        this.fire('result', { focused: this.focusedItem, selection: this.selection });
    },
    _setFocus(item, d) {
        this._goTo({ item });
    },
    _goTo({ idx = undefined, item = undefined } = {}) {
        this.async(() => {
            idx = idx || idx === 0 ? idx : item ? this.rows.indexOf(item) : this.focusedItem ? this.rows.indexOf(this.focusedItem) : 0;
            idx = Math.min(this.rows.length - 1, Math.max(0, idx));
            item = item || this.rows[idx];
            this.focusedItem = item;
            const topIdx = Math.ceil(this.$refs.listcontainer.scrollTop / this.rowSize);
            const bottomIdx = topIdx + this.rowCount;
            const middleIdx = bottomIdx - Math.floor(this.rowCount / 2) - 1;
            if (idx < topIdx) {
                this.$refs.listcontainer.scrollTop = (idx) * this.rowSize;
                this._setVisibleRows();
            } else if (idx > middleIdx) {
                this.$refs.listcontainer.scrollTop = (idx - Math.floor(this.rowCount / 2)) * this.rowSize;
                this._setVisibleRows();
            }
        });
    },
    _preventEvent(e) {
        if (e) e.preventDefault();
    },
    first(e) {
        this._preventEvent(e);
        this._goTo({ idx: 0 });
    },
    last(e) {
        this._preventEvent(e);
        this._goTo({ idx: this.rows.length - 1 });
    },
    next(e) {
        this._preventEvent(e);
        this._goTo({ idx: this.rows.indexOf(this.focusedItem) + 1 });
    },
    nextPage(e) {
        this._preventEvent(e);
        this._goTo({ idx: this.rows.indexOf(this.focusedItem) + 1 + this.rowCount });
    },
    before(e) {
        this._preventEvent(e);
        this._goTo({ idx: this.rows.indexOf(this.focusedItem) - 1 });
    },
    beforePage(e) {
        this._preventEvent(e);
        this._goTo({ idx: this.rows.indexOf(this.focusedItem) + 1 - this.rowCount });
    },
    selectAll() {
        if (!this.multiple) return;
        this.selection.splice(0, this.selection.length, ...this.rows);
    },
    clearSelection() {
        if (!this.multiple) return;
        this.selection.splice(0, this.selection.length);
    },
    invertSelection() {
        if (!this.multiple) return;
        this.selection.splice(0, this.selection.length, ...this.rows.filter(i => !this.selection.includes(i)));
    },
    confirmSelection() {
        this.domHost?.fire('confirm-selection', this.focusedItem);
    }
});
ODA({is: 'oda-list-box-item', extends: 'oda-icon', imports: '@oda/icon',
    template: /*html*/`
    <style>
        :host {
            @apply --horizontal;
            @apply --flex;
            align-items: center;
            justify-content: left;
            cursor: pointer;
            position: relative;
            background: white;
            opacity: 0.8;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        :host(:hover) {
            outline: 1px dotted silver;
            outline-offset: -1px;
            opacity: 0.9;
        }
        :host([focused])::after {
            content: '';
            box-shadow: 0px 2px 0px blue;
            position: absolute;
            bottom: 1px;
            left: 0px;
            right: 0px;
            height: 2px;
            z-index: 1;
        }
        .label {
            @apply --flex;
            justify-self: flex-end;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    </style>
    <oda-checkbox ~if="comboMode" :size="size" :value="selected" style="order: -1;" @tap.stop="fire('check')"></oda-checkbox>
    <span class="label" ~text="label"></span>`,
    props: {
        item: {
            type: [Object, String],
            set(n, o) {
                if (o) {
                    this.label = '';
                    this.icon = '';
                }
                if (n) {
                    this.label = n.value || n.label || n.name || n.key || n.oid || n.cid || n.bid || n;
                    this.icon = n.icon;
                }
            }
        },
        label: '',
        iconSize: {
            type: Number,
            set(n) {
                this.size = n || 0;
            }
        },
        comboMode: false,
        focused: {
            type: Boolean,
            reflectToAttribute: true
        },
        selected: {
            type: Boolean,
            reflectToAttribute: true
        },
    },
});