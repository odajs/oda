import '../base/base.js';
import '../../../components/grids/list/list.js';
import '../containers.js';
const url = import.meta.url;
ODA({is: 'oda-mobile', template: /*html*/`
    <style>
        :host {
            top: 0px;
            left: 0px;
            @apply --vertical;
            overflow: hidden;
            @apply --header;
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
    </style>
    <slot name="menu">
        <div class="no-flex horizontal header" style="justify-content: center;">
            <oda-button ref="btn" :icon="_focused?.icon" @tap="showList">
                <span> {{size?.width}}x{{size?.height}} - {{currentDevice}} </span>
            </oda-button>
            <oda-button icon="device:screen-rotation" allow-toggle :toggled="rotate" @tap="rotate=!rotate"></oda-button>
        </div>
    </slot>
    <div class="container flex horizontal">
        <div class="mobile vertical shadow" style="overflow-y: auto;" ~style="_style">
            <div class="content flex vertical" style="padding: 2px">
                <slot></slot>
            </div> 
        </div>
    </div>
    `,
    props: {
        devices: [],
        currentDevice: {
            default: 'Galaxy SIII Mini',
            save: true,
            set(n) {
                this._setFocused();
            }
        },
        _style: {
            get() {
                if (!this._focused) return {};
                const size = this.size;
                let border = this.border;
                const scale = Math.min(this._screen.h / size.height * 0.9, this._screen.w / size.width * 0.9);
                const style = { transform: `scale(${scale})` };
                style.minWidth = style.maxWidth = size.width + 'px';
                style.minHeight = style.maxHeight = size.height + 'px';
                style.borderLeft = border.left + 'px solid black';
                style.borderTop = border.top + 'px solid black';
                style.borderBottom = border.bottom + 'px solid black';
                style.borderRight = border.right + 'px solid black';
                style.borderRadius = border.radius + 'px';
                return style;
            }
        },
        component: { set(n) { if (n) this.appendChild(n); } },
        rotate: false,
        _focused: {
            type: Object,
            set(n) {
                if (n) {
                    this.currentDevice = n.label;
                }
            }
        },
        border: {
            default: {},
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
            default: {},
            get() {
                return !this._focused ? {} : this.rotate ? { width: this._focused.size.height, height: this._focused.size.width } : this._focused.size;
            }
        },
        _screen: { w: 0, h: 0 }
    },
    async attached() {
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
        const result = await ODA.showDropdown('oda-list', { items: this.devices, itemTemplate: 'oda-mobile-template' }, { parent: this.$refs.btn })
        if (result)
            this._focused = result.focusedItem;
    },
    listeners: {
        resize: '_resize'
    },
    _resize() {
        this._screen = { h: this.offsetHeight, w: this.offsetWidth };
    }
})

ODA({is: 'oda-mobile-template', template: /*html*/`
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
