const url = import.meta.url;
ODA({ is: 'oda-mobile', template: /*html*/`
    <style>
        :host {
            top: 0px;
            left: 0px;
            @apply --vertical;
            overflow: hidden;
            @apply --header;
            height: 100%;
        }
        .mobile {
            box-sizing: border-box;
            align-self: center;
        }
        ::slotted(*) {
            @apply --flex;
        }
        .container {
            overflow: hidden;
            background-color: rgba(0, 0, 0, 0.1);
            justify-content: center;
        }
        .cnt{
            padding: 2px;
            overflow: hidden;
            @apply --horizontal;
            align-self: center;
            justify-content: center;
            max-width: 100%;
            max-height: 100%;
        }

    </style>
    <slot name="menu">
        <div class="no-flex horizontal header" style="justify-content: center;">
            <oda-button id="list-parent" :icon="_focused?.icon" @tap="showList">
                <span> {{size?.width}}x{{size?.height}} - {{currentDevice}} </span>
            </oda-button>
            <oda-button icon="device:screen-rotation" allow-toggle :toggled="rotate" @tap="rotate=!rotate"></oda-button>
            <oda-button ~if="showBtnClose" icon="icons:close" @tap="fire('cancel')" fill="red"></oda-button>
        </div>
    </slot>
    <div class="container flex horizontal">
        <div class="content mobile vertical shadow" style="overflow-y: auto;" ~style="_style">
            <div class="cnt flex horizontal">
                <slot class="vertical flex shadow" style="overflow: hidden; align-self: center; max-width: 100%; max-height: 100%;"></slot>
            </div>
        </div>
    </div>
    `,
    showBtnClose: false,
    devices: [],
    currentDevice: {
        $def: 'Galaxy SIII Mini',
        $save: true
    },
    get _style() {
        if (!this._focused) return {};
        const size = this.size;
        let border = this.border;
        const scale = Math.min(this._screen.h / size.height * 0.9, this._screen.w / size.width * 0.9);
        const style = { transform: `scale(${scale})` };
        style.minWidth = style.maxWidth = size.width + 'px';
        style.minHeight = style.maxHeight = size.height + 'px';
        style.borderLeft = Math.round(border.left) + 'px solid black';
        style.borderTop = Math.round(border.top) + 'px solid black';
        style.borderBottom = Math.round(border.bottom) + 'px solid black';
        style.borderRight = Math.round(border.right) + 'px solid black';
        style.borderRadius = Math.round(border.radius) + 'px';
        return style;
    },
    component: {
        set(n) {
            if (n) {
                this.appendChild(n);
                this.setComponentSize();
            }
        }
    },
    rotate: {
        $def: false,
        $save: true,
        set(n) {
            this.setComponentSize();
        }
    },
    _focused: {
        $type: Object,
        set(n) {
            if (n) {
                this.currentDevice = n.label;
            }
        }
    },
    setComponentSize() {
        if (this.component?.localName.includes('editor') && !this._setSize) {
            this._setSize = true;
            this.component.style.width = (this.rotate ? 640 : 360) + 'px';
            this.component.style.height = (this.rotate ? 340 : 700) + 'px';
            this._setSize = false;
        }
    },
    border: {
        $def: {},
        get() {
            if (!this._focused) return {};
            const size = this.size.width;
            let border = this._focused.border;
            border = Object.keys(border).reduce((res, i) => {
                res[i] = border[i] * size;
                return res;
            }, {})
            return this.rotate ? { left: border.top, bottom: border.left, right: border.bottom, top: border.right, radius: border.radius } : border;
        }
    },
    size: {
        $def: {},
        get() {
            return !this._focused ? {} : this.rotate ? { width: this._focused.size.height, height: this._focused.size.width } : this._focused.size;
        }
    },
    _screen: { w: 0, h: 0 },
    async attached() {
        this._screen = { h: this.offsetHeight, w: this.offsetWidth };
        this.devices = await ODA.loadJSON(url.replace('mobile.js', 'devices.json'));
        this._setFocused();
    },
    _setFocused(n = this.currentDevice) {
        if (n && this.devices) {
            const focused = this.devices.filter(i => i.label === n);
            if (!this._focused || this._focused.label !== focused[0].label)
                this._focused = focused[0];
        }
    },
    async showList() {
        await ODA.import('@tools/containers');
        await ODA.import('@oda/list');
        const result = await ODA.showDropdown('oda-list', { items: this.devices, itemTemplate: 'oda-mobile-list-template' }, { parent: this.$('#list-parent') })
        if (result)
            this._focused = result.focusedItem;
    },
    $listeners: {
        resize: '_resize'
    },
    _resize() {
        this._screen = { h: this.offsetHeight, w: this.offsetWidth };
    }
})

ODA({ is: 'oda-mobile-list-template', template: /*html*/`
    <style>
        :host {
            cursor: pointer;
        }
    </style>
    <div class="horizontal row">
        <oda-icon :icon="item.icon"></oda-icon>
        <div>{{item.label}}</div>
    </div>
    `,
    item: {}
})
