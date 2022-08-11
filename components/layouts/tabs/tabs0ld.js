import '../../buttons/button/button.js';
import '../../menus/menu/menu.js';
ODA({ is: 'oda-tabs', template: /*html*/`
    <style>
        :host {
            display: flex;
            width: 100%;

        }
        .tabs {
            width: 100%;
            display: flex;
            flex-direction: {{vertical?'column':'row'}};
            overflow: auto;
        }
        .tabs::-webkit-scrollbar {
            display: none;
        }
        .tabs:hover {
            cursor: pointer;
        }
        .list {
            @apply --vertical;
            display: none;
        }
    </style>
    <div class="vertical" ~if="vertical" style="width: 100%">
        <div class="horizontal flex" style="margin:4px; justify-content: flex-end;">
            <oda-button icon="icons:chevron-left" title="previous" @tap="fire('action', {event: $event, action: 'prev'})"></oda-button>
            <oda-button icon="icons:chevron-right" title="next" @tap="fire('action', {event: $event, action: 'next'})"></oda-button>
            <oda-tabs-buttons :design-mode="designMode" :items></oda-tabs-buttons>
        </div>
        <div class="tabs">   
            <oda-tabs-tab ~for="items" :item :index :focused="items[focusedIndex]===item" :design-mode="('designMode' in item) ? item.designMode : designMode" @tap="_focused"></oda-tabs-tab>
        </div>
    </div>

    <div class="horizontal" ~if="!vertical" style="width:100%">
        <oda-tabs-tab ~for="items.filter(i => i.pinned)" :item :index :focused="items[focusedIndex]===item"
                :design-mode="('designMode' in item) ? item.designMode :designMode" @tap.stop="_focused" :_length></oda-tabs-tab>
        <oda-button ~if="overflow && mode==='arrow'" :icon-size="iconSize*.7" icon="icons:chevron-left" title="previous" @tap="fire('action', {event: $event, action: 'prev'})"></oda-button>
        <div ref="tabs" class="tabs" ~style="{'flex-wrap':mode==='wrap'?'wrap':'none'}">    
            <oda-tabs-tab ~for="items.filter(i => !i.pinned)" :item :index :focused="items[focusedIndex]===item" @down="_move=true" @up="_move=false" :move-tab="moveTab"
                    :design-mode="('designMode' in item) ? item.designMode :designMode" @tap.stop="_focused" :scroll-tabs="scrollTabs" :_length></oda-tabs-tab>
        </div>
        <oda-button ~if="overflow && mode==='arrow'" :icon-size="iconSize*.7" icon="icons:chevron-right" title="next" @tap="fire('action', {event: $event, action: 'next'})"></oda-button>
        <oda-tabs-buttons :design-mode="designMode" :items :overflow :mode></oda-tabs-buttons>
    </div>
        
    <div ref="list" class="list" style="overflow: auto;">
        <oda-tabs-tab ~for="_items" :item :index :focused="items[focusedIndex]===item" :design-mode="false" @tap="_focused"></oda-tabs-tab>
    </div>
    `,
    props: {
        template: 'label',
        items: [],
        _items: [],
        _length: {
            reactive: true,
            get() { return this.items?.length },
            set(n) { this._setPositionScroll() }
        },
        focusedIndex: {
            default: 0,
            set(n) { this._setPositionScroll(n) }
        },
        iconSize: {
            default: 18,
            shared: true
        },
        vertical: {
            default: false,
            reflectToAttribute: true
        },
        designMode: true,
        action: {
            type: Object,
            set(n) { if (n) { setTimeout(() => { this.action = undefined }, 300) } }
        },
        overflow: {
            get() {
                return this.$refs?.tabs && (this.$refs.tabs.scrollWidth > this.$refs.tabs.clientWidth || this.$refs.tabs.scrollHeight > this.$refs.tabs.clientHeight)
            }
        },
        moveTab: false,
        scrollTabs: true,
        _move: false,
        mode: {
            default: 'list',
            list: ['arrow', 'list', 'wrap']
        }
    },
    listeners: {
        track(e) {
            if (this.overflow && e.detail.state === 'track' && this._move && this.scrollTabs && this.mode !== 'wrap')
                this.$refs.tabs.scrollLeft -= e.detail.ddx;
        },
        action: async function(e) {
            switch (e.detail.value.action) {
                case 'dropdownList':
                    if (!this.items || !this.items.length || !this.$refs?.tabs?.children) return;
                    this._items = [];
                    let c = 0;
                    this.items.forEach((i, indx) => {
                        if (!i.pinned) {
                            let el = this.$refs?.tabs?.children[c];
                            const { left, right } = el.getBoundingClientRect();
                            if (!(left >= this.$refs.tabs.offsetLeft && right < (this.$refs.tabs.offsetWidth + this.$refs.tabs.offsetLeft))) this._items.push(this.items[indx]);
                            c++;
                        }
                    })
                    await ODA.showDropdown(this.$refs.list, {}, { parent: e.detail.value.event.target });
                    requestAnimationFrame(() => this.$refs.tabs.scrollLeft = this.$refs.tabs.children[this._focusedIndex()].offsetLeft - this.$refs.tabs.offsetLeft);
                    return;
                case 'showSettings':
                    let items = [
                        { label: "Top tabs", action: 'setTabPosition', icon: 'editor:border-top', to: 'top' },
                        { label: "Bottom tabs", action: 'setTabPosition', icon: 'editor:border-bottom', to: 'bottom' },
                        { label: "Left tabs", action: 'setTabPosition', icon: 'editor:border-left', to: 'left' },
                        { label: "Right tabs", action: 'setTabPosition', icon: 'editor:border-right', to: 'right' }
                    ];
                    const val = await ODA.showDropdown('oda-menu', { items }, { parent: e.detail.value.event.target });
                    if (val && val.focusedItem) {
                        this.vertical = ['right', 'left'].includes(val.focusedItem.to);
                        if (this.items[0] && this.items[0].$owner) {
                            this.items[0].$owner._vertical = this.vertical;
                            this.items[0].$owner._order = ['top', 'left'].includes(val.focusedItem.to) ? 0 : -1;
                        }
                        this.action = val.focusedItem;
                    }
                    return;
                case 'addTab':
                    this.items.push({ label: 'new-tab' });
                    this.action = { action: 'addTab' };
                    this.focusedIndex = this.items.length - 1;
                    setTimeout(() => { this.$refs.tabs.scrollLeft = this.$refs.tabs.scrollWidth - this.$refs.tabs.offsetLeft }, 10);
                    return;
                case 'prev':
                    requestAnimationFrame(() => this.$refs.tabs.scrollLeft -= this.$refs.tabs.offsetWidth);
                    return;
                case 'next':
                    requestAnimationFrame(() => this.$refs.tabs.scrollLeft += this.$refs.tabs.offsetWidth);
                    return;
            }
            if (this.items.length !== this._lastLength)
                setTimeout(() => { this.$refs.tabs.scrollLeft = this.$refs.tabs.offsetWidth - this.$refs.tabs.offsetLeft }, 10);
            this._lastLength = items.length;
        }
    },
    _focused(e) {
        this.items.forEach(el => el.focused = false);
        e.target.item.focused = true;
        this.focusedIndex = this.items.indexOf(e.target.item)
    },
    _down(e) {
        e.stopPropagation()
    },
    _setPositionScroll(n = this._focusedIndex()) {
        setTimeout(() => {
            if (this.$refs?.tabs?.children[n]) {
                const { left, right } = this.$refs?.tabs.children[n].getBoundingClientRect()
                if (!(left >= this.$refs.tabs.offsetLeft && right < (this.$refs.tabs.offsetWidth + this.$refs.tabs.offsetLeft)))
                    requestAnimationFrame(() => this.$refs.tabs.scrollLeft = this.$refs.tabs.children[n].offsetLeft - this.$refs.tabs.offsetLeft);
            }
        }, 100);
    },
    _focusedIndex(i = this.focusedIndex) {
        let items = [];
        this.items.forEach(i => { if (!i.pinned) items.push(i) });
        return items.indexOf(this.items[i]);
    },
})

const img = new Image();
img.src = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAQCAYAAABQrvyxAAAACXBIWXMAAAsSAAALEgHS3X78AAAAa0lEQVRIiWPU6v91RFv4jwIv+78/DEMIfP7JxHL1LcsDFpDjJ7p8kB5KjoeB/D0CDExDLeSRAcjtTIPHOeSBUQ8MNBj1wECDUQ8MNBj1wECDUQ8MNGACteqGquNBbgc3SUGtuiHZnH7L8gAAtichl6hs6rYAAAAASUVORK5CYII=`;

ODA({ is: 'oda-tabs-buttons', template: /*html*/`
    <div class="horizontal" style="overflow:auto;justify-content: flex-end;">
        <oda-button ~if="overflow && mode==='list'" icon="icons:arrow-drop-down" @tap.stop="fire('action', {event: $event, action: 'dropdownList'})"></oda-button>
        <oda-button ~if="designMode" icon="icons:add" @tap="fire('action', {event: $event, action: 'addTab'})"></oda-button>
        <oda-button ~if="designMode" icon="icons:settings" @tap.stop="fire('action', {event: $event, action: 'showSettings'})"></oda-button>
    </div >
    `,
    props: {
        designMode: false,
        items: [],
        overflow: false,
        iconSize: {
            shared: true
        },
        mode: 'list'
    }
})

ODA({ is: 'oda-tabs-tab', template: /*html*/`
    <style>
        :host {
            display: flex;
            align-items: center;
            cursor: pointer;
            box-shadow: inset 0 0 0 .03em var(--section-background);
        }
        .drag-to:after {
            content: "";
            pointer-events: none;
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            box-shadow: 0 0 0 1px var(--success-color);
            background-color: rgba(0,255,0,.3);
        }
        .drag-to-error:after {
            content: "";
            pointer-events: none;
            background-color: rgba(255,0,0,.3) !important;
        }
        .drag-to-left:after {
            box-shadow: inset 3px 0 0 0 var(--success-color);
        }
        .drag-to-right:after {
            box-shadow: inset -3px 0 0 0 var(--success-color);
        }
    </style>
    <div class="tab horizontal" ~if="item?.checked || (item && !item.$root)" ~class="{'drag-to':item?.dragTo, [item?.dragTo]:item?.dragTo}"
            style="margin: 0px 4px; display:flex;align-items:center;flex:1;" :draggable>
            <div class="horizontal flex" style="white-space: nowrap; text-overflow: ellipsis; max-width: 150px; overflow: hidden;">
                <label :item class="no-flex" ~is="item?.template || template">{{item?.label}}</label>
            </div>
        <oda-icon ~if="designMode" @down.stop="_del" @tap.stop :icon-size="iconSize*.7" icon="icons:close"></oda-icon>
    </div>
    `,
    props: {
        template() {
            return this.domHost?.template || '';
        },
        item: Object,
        index: Number,
        designMode: true,
        iconSize: {
            default: 24,
            shared: true
        },
        draggable() { return this.designMode && this.item?.bs && this.moveTab && !this.scrollTabs ? 'true' : 'false'; },
        moveTab: false,
        scrollTabs: true
    },
    listeners: {
        'dragstart': '_dragstart',
        'dragend': '_dragend',
        'dragover': '_dragover',
        'dragleave': '_dragleave',
        'drop': '_dragdrop',
    },
    _del(e) {
        e.stopPropagation();
        const del = this.domHost.items.indexOf(this.item);
        const cur = this.domHost.focusedIndex;
        this.domHost.items.splice(del, 1);
        const last = this.domHost.items.length - 1;
        this.domHost.focusedIndex = del < cur ? cur - 1 : Math.max(0, Math.min(last, cur));
    },
    _dragstart(e) {
        if (this.item.bs && !this.scrollTabs && this.moveTab) {
            e.stopPropagation();
            e.dataTransfer.setDragImage(img, -20, -16);
            this.domHost.dragInfo = { dragItem: this.item };
        }
    },
    _dragover(e) {
        if (this.item.bs && !this.scrollTabs && this.moveTab) {
            e.stopPropagation();
            e.preventDefault();
            this.item.dragTo = 'drag-to-error';
            this.domHost.focusedIndex = (this.index);
            if (this.domHost.dragInfo) {
                let x = e.layerX,
                    w = e.target.offsetWidth;
                x = (x - w / 2) / w * 2;
                this.item.dragTo = this.domHost.dragInfo.dragItem === this.item ? 'drag-to-error' : x < 0 ? 'drag-to-left' : 'drag-to-right';
            } else {
                this.domHost.action = { action: 'dragover' };
                if (this.item.bs && this.item.bs.dragInfo && this.item.bs.dragInfo.dragItem && this.item.bs.dragInfo.dragItem.$root === this.item.$root && this.item.bs.dragInfo.dragItem.complex !== 'oda-layout-group') {
                    this.item.dragTo = 'drag-to';
                } else {
                    this.item.dragTo = 'drag-to-error';
                }
            }
            this.render();
        }
    },
    _dragend(e) {
        this._clearDragTo(true);
    },
    _dragleave(e) {
        this._clearDragTo();
    },
    _dragdrop(e) {
        if (this.item.bs && !this.scrollTabs && this.moveTab) {
            e.stopPropagation();
            e.preventDefault();
            if (this.domHost.dragInfo) {
                let t = e.target.item,
                    i = this.domHost.dragInfo.dragItem;
                if (i === t) return;
                this.domHost.items.splice(this.domHost.items.indexOf(i), 1);
                this.domHost.items.splice(this.domHost.items.indexOf(t) + (this.item.dragTo === 'drag-to-right' ? 1 : 0), 0, i);
                this.domHost.action = { action: 'moveTab', target: this.item, item: this.domHost.dragInfo.dragItem, to: this.item.dragTo.replace('drag-to-', '') };
            } else if (this.item.bs && this.item.bs.dragInfo && this.item.bs.dragInfo.dragItem && (this.item.bs.dragInfo.dragItem.$root === this.item.$root && this.item.bs.dragInfo.dragItem.complex !== 'oda-layout-group')) {
                this.domHost.action = { action: 'dragdrop', item: this.item };
            }
            this._clearDragTo(true);
        }
    },
    _clearDragTo(clearDragInfo = false) {
        if (clearDragInfo) this.domHost.dragInfo = undefined;
        this.item.dragTo = '';
        this.render();
    },
    _editGroupLabel(e) {
        if (!this.designMode) return;
        const t = e.target;
        this._oldLabel = t.innerText;
        t.setAttribute('contentEditable', '');
        t.focus();
        t.style.outline = "0px solid transparent";
        window.getSelection().selectAllChildren(t)
    },
    _closeEditGroupLabel(e) {
        if (!this.designMode) return;
        e.target.removeAttribute('contentEditable');
        this.item.label = e.target.innerText;
        this.domHost.action = { action: 'save', item: this.item };
    },
    _keydownGroupLabel(e) {
        if (e.key === 'Enter') this._closeEditGroupLabel(e);
        else if (e.key === 'Escape') {
            e.target.innerText = this._oldLabel;
            this._closeEditGroupLabel(e);
        }
    }
})