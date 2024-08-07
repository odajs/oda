ODA({
    is: 'oda-tabs', imports: '@oda/button',
    template: /*html*/`
    <style>
        :host{
            display: flex;
            flex-direction: {{direction === 'horizontal' ? 'row' : 'column'}};
            overflow: hidden;
            max-{{direction === 'horizontal' ? 'height' : 'width'}}: {{iconSize + 14}}px;
            min-{{direction === 'horizontal' ? 'height' : 'width'}}: {{iconSize + 14}}px;
        }
        :host #container{
            display: flex;
            flex-direction: {{direction === 'horizontal' ? 'row' : 'column'}};
            overflow-{{direction === 'horizontal' ? 'x' : 'y'}}: auto;
            overflow-{{direction === 'horizontal' ? 'y' : 'x'}}: hidden;
            scrollbar-width: thin;
            scrollbar-color: var(--dark-color) var(--dark-background);
            gap: 2px;
        }
        :host .scrollButton{
            max-{{direction === 'horizontal' ? 'width' : 'height'}}: 12px;
        }
        :host .tab{
            @apply --content;
            display: flex;
            align-items: center;
            padding: 4px;
            writing-mode: {{direction === 'horizontal' ? 'lr' : 'tb'}};
            cursor: pointer;
            padding: 8px;
            outline-offset: -2px;
        }
        :host .fixed-tab{
            position: sticky;
            z-index: 10;
            {{direction === 'horizontal' ? 'left' : 'top'}}: -4px;
            @apply --shadow;
        }
        {{''}}
    </style>
    <div id="container" ~class="{horizontal: direction === 'horizontal', vertical: direction === 'vertical'}">
        <div
            ~for="items"
            class="tab"
            ~class="{accent: index === $for.index, 'fixed-tab': !!$for.item.fixed}"
            ~style="{transform: direction === 'vertical' && $for.item.label ? 'rotate(180deg)' : 'none', order: $for.item.order || 0}"
        >
            <oda-tabs-tab ~is="$for.item.componentName || componentName" :item="$for.item" :icon-size="iconSize * 0.8" @tap="tabTapped($for.index)"></oda-tabs-tab>
            <oda-icon ~if="typeof $for.item.close === 'function'" icon="icons:close" @tap.stop="$for.item.close()"></oda-icon>
        </div>
    </div>
    `,
    $public: {
        $pdp: true,
        direction: {
            $def: 'horizontal',
            $list: ['horizontal', 'vertical']
        },
        items: Array,
        index: 0,
        focused: null,
        autoScrollDelay: 100,
        componentName: 'oda-tabs-tab',
        iconSize: 24,
        closeCallback: null
    },
    get _sizeSuffix() {
        return this.direction === 'horizontal' ? 'Width' : 'Height';
    },
    get _scrollSuffix() {
        return  this.direction === 'horizontal' ? 'Left' : 'Top';
    },
    get container() {
        return this.$('#container') || undefined;
    },
    $observers: {
        update(items, direction, index) {
            if (!this.items.length) return false;
            if(!this.container) return false;
            this.overflow = this.container[`scroll${this._sizeSuffix}`] > this.container[`offset${this._sizeSuffix}`];
            this.debounce('update-scroll', () => {
                if (this.overflow) {
                    const btn = this.$('.tab.accent');
                    if (!btn) return;
                    if (!this._checkOnScreen(btn)){
                        btn.scrollIntoView({inline: 'center', block: 'center'});
                    }
                }
            }, this.autoScrollDelay);
        }
    },
    $listeners: {
        mousewheel(e) {
            if (this.direction === 'horizontal') {
                this.container.scrollLeft += e.deltaY/3;
            }
        }
    },
    overflow: false,
    _scroll(dir = 1) {
        if (!this.container) return;
        this.container[`scroll${this._scrollSuffix}`] += dir * 100;
    },
    _checkOnScreen(element){
        const offset = element[`offset${this._scrollSuffix}`];
        const size = element.parentElement[`offset${this._sizeSuffix}`];
        const scroll =element.parentElement[`scroll${this._scrollSuffix}`];
        return (offset >= scroll) && (offset <= (scroll + size));
    },
    tabTapped(index) {
        this.index = index;
        this.focused = this.items[this.index];
        this.fire('tab-tapped', { value: this.focused });
    },
})

ODA({
    is: 'oda-tabs-tab',
    template: /*html*/`
    <style>
        :host{
            @apply --horizontal;
            align-items: center;
            gap: 2px;
        }
        :host oda-icon{
            margin: 2px;
        }
    </style>
    <oda-icon ~if="item.icon" :icon="item.icon + (direction === 'vertical' && item.label ? ':90' : '')" :sub-icon="item.subIcon" :icon-size></oda-icon>
    <div ~text="item.label"></div>
    `,
    item: null,
    iconSize: 24,
})