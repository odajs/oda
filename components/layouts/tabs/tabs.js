ODA({
    is: 'oda-tabs', imports: '@oda/button',
    template: /*html*/`
        <style>
            :host, :host > .scroll-container{
                position: relative;
                display: flex;
                flex-direction: {{direction === 'horizontal' ? 'row' : 'column'}};
                overflow: hidden;
                max-{{direction === 'horizontal' ? 'height' : 'width'}}: {{iconSize + 14}}px;
                min-{{direction === 'horizontal' ? 'height' : 'width'}}: {{iconSize + 14}}px;
            }
            :host > .scroll-container{
                @apply --flex;
            }
            :host #container{
                @apply --flex;
                display: flex;
                flex-direction: {{direction === 'horizontal' ? 'row' : 'column'}};
                overflow: hidden;
                gap: 2px;
            }
            :host .pseudo-scroll {
                @apply --raised;
                position: absolute;
                background-color: var(--dark-color);
                opacity: 0;
                pointer-events: none;
            }
            :host .scrollButton{
                max-{{direction === 'horizontal' ? 'width' : 'height'}}: 12px;
            }
            :host .tab{
                opacity: 0.5;
                color: var(--content-color);
                display: flex;
                align-items: center;
                writing-mode: {{direction === 'horizontal' ? 'lr' : 'tb'}};
                cursor: pointer;
                outline-offset: -2px;
            }
            :host .tab[focused]{
                @apply --accent-invert;
                opacity: 1;
                box-shadow:
                    inset 0 2px 3px 0 rgba(0, 0, 0, 0.05),
                    inset 2px 0 3px 0 rgba(0, 0, 0, 0.05),
                    inset 0 -2px 3px 0 rgba(0, 0, 0, 0.05),
                    inset -2px 0 3px 0 rgba(0, 0, 0, 0.05);
            }
            :host .fixed-tab{
                opacity: 1;
                @apply --content;
                @apply --shadow;
                position: sticky !important; /* --focused */
                z-index: 10;
                {{direction === 'horizontal' ? 'left' : 'top'}}: 0px;
                margin-{{direction === 'horizontal' ? 'left' : 'top'}}: -4px;
            }
            {{''}}
        </style>
        <oda-button ~if="overflow" icon="icons:chevron-left" :disabled="scrollIsMin" :rotate="direction === 'vertical' ? '90' : '0'" @tap="_scroll(-1)" class="raised"></oda-button>
        <div class="scroll-container">
            <div id="container" ~if="direction" ~class="{horizontal: direction === 'horizontal', vertical: direction === 'vertical'}">
                <div ~for="items"
                    class="tab" :focused="index === $for.index"
                    ~class="calcTabClasses($for.item, index === $for.index)"
                    ~style="calcTabStyle($for.item, index === $for.index)"
                    @mousedown="_tabOnMouseDown($for.item, $event)">

                    <div ~is="$for.item.componentName || componentName" :item="$for.item" :icon-size="iconSize * 0.8" @tap="tabTapped($for.index)" style="padding: 8px;"></div>
                    <oda-icon ~if="typeof $for.item.close === 'function'" icon="icons:close" :icon-size="0.75 * iconSize" @tap.stop="$for.item.close()" style="margin-right: 4px;"></oda-icon>
                </div>
            </div>
            <div class="pseudo-scroll"></div>
        </div>
        <oda-button ~if="overflow" icon="icons:chevron-right" :disabled="scrollIsMax" :rotate="direction === 'vertical' ? '90' : '0'" @tap="_scroll(1)" class="raised"></oda-button>
        <oda-button ~if="items.some(i => typeof i.close === 'function')"  icon="icons:close" style="fill: red;" title="close all tabs" @tap="_closeAll"></oda-button>
    `,
    $public: {
        $pdp: true,
        contentAlign: {
            $type: String,
            $list: ['left', 'bottom', 'right', 'top'],
            $def: 'bottom'
        },
        direction: {
            $type: String,
            get() {
                switch (this.contentAlign) {
                    case 'left':
                    case 'right': return 'vertical';
                    case 'top':
                    case 'bottom':
                    default: return 'horizontal';
                }
            }
        },
        items: Array,
        index: 0,
        focused: null,
        autoScrollDelay: 100,
        componentName: 'oda-tabs-tab',
        iconSize: 24,
        closeCallback: null
    },
    overflow: false,
    scrollIsMin: false,
    scrollIsMax: false,
    get _sizeSuffix() {
        return this.direction === 'horizontal' ? 'Width' : 'Height';
    },
    get _scrollSuffix() {
        return this.direction === 'horizontal' ? 'Left' : 'Top';
    },
    get container() {
        return this.$('#container') || undefined;
    },
    get pseudoScroll() {
        return this.$('.pseudo-scroll') || undefined;
    },
    $observers: {
        update(items, direction, index) {
            if (!this.items.length) return false;
            if (!this.container) return false;
            this._updateOverflow();
            this.debounce('update-scroll', () => {
                if (this.overflow) {
                    const btn = this.$('.tab[focused]');
                    if (!btn) return;
                    if (!this._checkOnScreen(btn)) {
                        btn.scrollIntoView({ inline: 'center', block: 'center' });
                    }
                }
            }, this.autoScrollDelay);
        }
    },
    $listeners: {
        mousewheel: '_onScroll',
        resize: '_updateOverflow'
    },
    _updateOverflow() {
        if (!this.container) return;
        this.overflow = this.container[`scroll${this._sizeSuffix}`] > this.container[`offset${this._sizeSuffix}`];
    },
    /**
     * @param {WheelEvent} e
     */
    _onScroll(e) {
        if (this.direction === 'vertical') {
            this.container.scrollTop += e.deltaY / 3;

            if (this.container.scrollHeight > this.container.offsetHeight) {
                this.pseudoScroll.style.display = '';
                const k = this.container.offsetHeight / this.container.scrollHeight;
                this.pseudoScroll.style.right = '0px';
                this.pseudoScroll.style.width = '4px';
                this.pseudoScroll.style.height = `${Math.max(k * this.container.offsetHeight, 50)}px`;
                this.pseudoScroll.style.top = `${k * this.container.scrollTop}px`;
                this.pseudoScroll.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1000, iterations: 1 });
            }
            else {
                this.pseudoScroll.style.display = 'none';
            }
            this.scrollIsMin = this.container.scrollTop === 0;
            this.scrollIsMax = this.container.scrollHeight === this.container.scrollTop + this.container.offsetHeight;
        }
        else if (this.direction === 'horizontal') {
            this.container.scrollLeft += e.deltaY / 3;

            if (this.container.scrollWidth > this.container.offsetWidth) {
                this.pseudoScroll.style.display = ''; 'mousewheel'
                const k = this.container.offsetWidth / this.container.scrollWidth;
                this.pseudoScroll.style.bottom = '0px';
                this.pseudoScroll.style.height = '4px';
                this.pseudoScroll.style.width = `${Math.max(k * this.container.offsetWidth, 50)}px`;
                this.pseudoScroll.style.left = `${k * this.container.scrollLeft}px`;
                this.pseudoScroll.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1000, iterations: 1 });
            }
            else {
                this.pseudoScroll.style.display = 'none';
            }
            this.scrollIsMin = this.container.scrollLeft === 0;
            this.scrollIsMax = this.container.scrollWidth === this.container.scrollLeft + this.container.offsetWidth;
        }
    },
    /**
     * @param {{close?: function}} item
     * @param {MouseEvent} event
     */
    _tabOnMouseDown(item, event) {
        if (typeof item.close === 'function' && event.button === 1) {
            const target = event.target;
            const cancel = () => {
                target.removeEventListener('mouseup', onMouseUp);
                window.top.removeEventListener('mouseup', cancel);
            };
            const onMouseUp = () => {
                item.close();
                cancel();
            };
            target.addEventListener('mouseup', onMouseUp);
            window.top.addEventListener('mouseup', cancel);
        }
    },
    _scroll(dir = 1) {
        if (!this.container) return;
        this.container[`scroll${this._scrollSuffix}`] += dir * 100;
        this._onScroll(new WheelEvent('mousewheel'));
    },
    _checkOnScreen(element) {
        const offset = element[`offset${this._scrollSuffix}`];
        const size = element.parentElement[`offset${this._sizeSuffix}`];
        const elemSize = element[`offset${this._sizeSuffix}`];
        const scroll = element.parentElement[`scroll${this._scrollSuffix}`];
        return (offset >= scroll) && (offset + elemSize <= (scroll + size));
    },
    tabTapped(index) {
        this.index = index;
        this.focused = this.items[this.index];
        this.fire('tab-tapped', { value: this.focused });
    },
    async _closeAll() {
        await ODA.showConfirm('Close all tabs?');
        this.items.forEach(i => i.close?.());
    },
    calcTabStyle(item, focused) {
        const style = {
            transform: this.direction === 'vertical' && item.label ? 'rotate(180deg)' : 'none',
            order: item.order || 0,
        };
        if (focused) {
            switch (this.contentAlign) {
                case 'left': {
                    if (item.label) {
                        style['border-top-left-radius'] = '8px';
                        style['border-bottom-left-radius'] = '8px';
                        style['border-top-right-radius'] = '0px';
                        style['border-bottom-right-radius'] = '0px';
                    }
                    else {
                        style['border-top-right-radius'] = '8px';
                        style['border-bottom-right-radius'] = '8px';
                        style['border-top-left-radius'] = '0px';
                        style['border-bottom-left-radius'] = '0px';
                    }
                } break;
                case 'right': {
                    if (item.label) {
                        style['border-top-right-radius'] = '8px';
                        style['border-bottom-right-radius'] = '8px';
                        style['border-top-left-radius'] = '0px';
                        style['border-bottom-left-radius'] = '0px';
                    }
                    else {
                        style['border-top-left-radius'] = '8px';
                        style['border-bottom-left-radius'] = '8px';
                        style['border-top-right-radius'] = '0px';
                        style['border-bottom-right-radius'] = '0px';
                    }
                } break;
                case 'top': {
                    style['border-bottom-left-radius'] = '8px';
                    style['border-bottom-right-radius'] = '8px';
                    style['border-top-left-radius'] = '0px';
                    style['border-top-right-radius'] = '0px';
                } break;
                case 'bottom':
                default: {
                    style['border-top-left-radius'] = '8px';
                    style['border-top-right-radius'] = '8px';
                    style['border-bottom-left-radius'] = '0px';
                    style['border-bottom-right-radius'] = '0px';
                } break;
            }
        }
        else {
            style['border-top-left-radius'] = '0px';
            style['border-top-right-radius'] = '0px';
            style['border-bottom-left-radius'] = '0px';
            style['border-bottom-right-radius'] = '0px';
        }
        switch (this.contentAlign) {
            case 'left': {
                style['margin'] = item.label
                    ? '2px 2px 2px 0px'
                    : '2px 2px 2px 0px';
            } break;
            case 'right': {
                style['margin'] = item.label
                    ? '2px 0px 2px 2px'
                    : '2px 0px 2px 2px';
            } break;
            case 'top': {
                style['margin'] = '0px 2px 2px 2px';
            } break;
            case 'bottom': {
                style['margin'] = '2px 2px 0px 2px';
            } break;
        }
        return style;
    },
    calcTabClasses(item, focused) {
        const classes = [];
        if (item.fixed) {
            classes.push('fixed-tab');
        }
        if (focused) {
            switch (this.contentAlign) {
                case 'left': {
                    if (item.label) {
                        classes.push('focused-right');
                    }
                    else {
                        classes.push('focused-left');
                    }
                } break;
                case 'top': {
                    classes.push('focused-top');
                } break;
                case 'right': {
                    if (item.label) {
                        classes.push('focused-left');
                    }
                    else {
                        classes.push('focused-right');
                    }
                } break;
                case 'bottom':
                default: {
                    classes.push('focused-bottom');
                } break;
            }
        }
        return classes;
    }
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
        <div ~text="item.label" style="padding-bottom: 6px;"></div>
    `,
    item: null,
    iconSize: 24,
})