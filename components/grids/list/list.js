ODA({ is: 'oda-list', imports: '@oda/icon',
    template: /*html*/`
    <style>
        :host {
            overflow: auto;
        }
    </style>
    <ul ~is="tag" class="vertical shadow" :type="marker" style="overflow-x: hidden; margin: 0px;" ~style="{padding: (marker === 'none')?'4px':''}" >
        <li ~for="items" :item="$for.item" :focused="$for.item === focusedItem" ~class="marker==='none' && !numerable ? 'horizontal' : ''" @down.stop="_select($event, $for.item)" style="text-overflow:ellipsis; overflow: hidden; box-sizing: border-box; border-bottom: 1px solid transparent" :type="$for.item.marker" ~style="{height: iconSize + 'px'}" :title="$for.item.label">
            <span ~is="$for.item?.template || itemTemplate" :item="$for.item" class="horizontal" style="align-items: center;"><oda-icon ~if="$for.item.icon" :icon="$for.item.icon"></oda-icon>{{$for.item}}</span>
        </li>
    </ul>`,
    $public: {
        itemTemplate: 'span',
        iconSize: {
            $def: 24,
            $pdp: true // share = pdp?
        },
        numerable: false,
        marker: {
            $def: 'none',
            $list: ('none|circle|disc|square').split('|')
        },
        tag: {
            get() {
                return this.numerable ? 'ol' : 'ul';
            }
        },
        focusedItem: {
            $def: null
        },
        items: [],
        selection: []
    },
    down() {
        if (!this.focusedItem) {
            this.focusedItem = this.items[0];
        } else {
            const idx = this.items.indexOf(this.focusedItem)
            this.focusedItem = (this.items[idx + 1] || this.focusedItem);
        }
    },
    up() {
        if (!this.focusedItem) {
            this.focusedItem = this.items[0];
        } else {
            const idx = this.items.indexOf(this.focusedItem)
            this.focusedItem = (this.items[idx - 1] || this.focusedItem);
        }

    },
    pageUp() {

    },
    pageDown() {

    },
    home() {
        this.focusedItem = this.items[0];
    },
    end() {
        this.focusedItem = this.items[this.items.length - 1];
    },
    _select(e, item) {
        this.focusedItem = item;
        this.fire('ok');
    }
});