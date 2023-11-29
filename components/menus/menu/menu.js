ODA({ is: 'oda-menu', imports: '@oda/button',
    template: /*html*/`
    <style>
        :host {
            min-width: 100px;
            @apply --vertical;
            overflow: hidden;
            @apply --shadow;
        }
        :host > div {
            overflow-y: auto;
        }
        .row {
            align-items: center;
        }
        .header {
            @apply --header;
        }
    </style>
    <div class="vertical flex">
        <div style="overflow: hidden" ~for="items" ~if="!$for.item.hidden" :selected="selectedItem && ($for.item === selectedItem || $for.item?.value === selectedItem)"  class="menuitems horizontal item no-flex" @tap.stop.prev="_tap" :item="$for.item" :not-group="!$for.item.group" ~style="getStyle($for.item)">
            <div @tap="$for.item.group && $event.stopPropagation();" style="overflow: hidden" class="flex horizontal row" ~class="$for.item.group?'dark':'content'">
                <div style="overflow: hidden" ~is="getTemplate($for.item)" class="flex row horizontal" :icon-size :item="$for.item"></div>
                <oda-button ~if="$for.item?.items?.length" icon="icons:arrow-drop-up:90" :item="$for.item" @tap.stop.prev="showSubMenu"></oda-button>
            </div>
        </div>
    </div>
    `,
    top: 0,
    $public: {
        $pdp: true,
        icon: '',
        subIcon: '',
        title: '',
        showSubTitle: false,
        template: '',
        items: [],
        iconSize: 24,
        selectedItem: Object,
        focusedItem: {
            set(n) {
                if (n) {
                    if (this.root) this.root.focusedItem = n;
                    this.fire('ok');
                }
            }
        },
        closeAfterOk: true
    },
    $observers: {
        onItemsOrSelectedItemChanged(items, selectedItem) {
            if (!items || !selectedItem) return;

            const idx = items.findIndex(i => i.value === selectedItem)
            if (!~idx) return;

            this.$$('.menuitems')[idx-3]?.scrollIntoView?.();
        }
    },
    getStyle(item) {
        const s = {};
        if (item?.group) {
            s.position = 'sticky';
            s.top = '0px';
            s.zIndex = 1;
            s.fontSize = 'small';
            s.opacity = '.8';
        }
        else {
            s.position = 'relative';
            s.top = this.top + 'px';
            s.zIndex = 0;
            s.fontSize = 'normal';
        }
        return s;
    },
    getTemplate(item) {
        return item.is || item.template || (!item.group && this.template) || 'oda-menu-template';
    },
    async showSubMenu(e) {
        e.stopPropagation();
        await ODA.showDropdown('oda-menu', { items: e.target.item.items, root: this, template: this.template, showSubTitle: this.showSubTitle }, {anchor: 'right-top', fadein: true, parent: e.target, align: 'right', title: (this.showSubTitle ? e.target.item.label : undefined) });
    },
    _tap(e) {
        let res = e.currentTarget.item;
        res?.tap && res.tap();
        this.focusedItem = res;
    }
})

ODA({ is: 'oda-menu-template', imports: '@oda/icon',
    template: /*html*/`
    <style>
        :host([focused]) {
            @apply --focused;
            @apply --active;
            overflow: hidden;
        }
        :host(:hover) {
            @apply --active;
        }
        :host(:hover) div > oda-icon {
            opacity: 1;
        }
        label {
            padding: 4px 8px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        .icon-box {
            align-items: center;
            justify-content: center;
            height: {{iconSize * 1.5}}px;
            min-width: {{iconSize * 1.5}}px;
            max-width: {{iconSize * 1.5}}px;
            @apply --horizontal;
        }
        {}
    </style>
    <div ~if="!item?.group" class="no-flex dark icon-box">
        <oda-icon :icon-size="Math.floor(iconSize)" :icon="item?.icon" :sub-icon="item?.subIcon"></oda-icon>
    </div>
    <label class="flex" :title="item?.label">{{item.label}}</label>
    `,
    item: {},
})
