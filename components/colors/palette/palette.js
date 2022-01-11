ODA({ is: 'oda-palette', imports: '@oda/button',
    template: /*html*/`
        <style>
            :host {
                @apply --horizontal;
            }
            ::slotted(div){
                @apply --horizontal;
                @apply --flex;
            }
        </style>
        <div class="horizontal flex" style="overflow: hidden">
            <oda-color-line ::color ~for="_hues" :hue="item" saturation="100" :size :gradients :grays=false></oda-color-line>
            <oda-color-line ::color hue="0" saturation="0" :size :gradients :grays=true></oda-color-line>
            <oda-gradient-preview ref="preview" ~if="gradientMode" ::value :color></oda-gradient-preview>
        </div>
    `,
    props: {
        colors: 15,
        gradients: 20,
        size: 20,
        value: String,
        color: {
            type: String,
            default: '',
            set(n) {
                if (!this.gradientMode)
                    this.value = n;
            }
        },
        gradientMode: false,
        _hues: {
            type: Array,
            get() {
                const step = 360 / (this.colors || 1), hues = [];
                for (let i = 0; i < this.colors; i++) hues.push(step * i);
                return hues;
            }
        },
    }
});

ODA({ is: 'oda-gradient-preview', template: /*html*/`
        <style>
            :host {
                @apply --border;
                flex-grow: 0;
                flex-shrink: 0;
                width: 60px;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                cursor: pointer;
            }
            :host>div {
                margin: 2px;
                width: 24px;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
            }
        </style>
        <div ref="markers"></div>
        <oda-button icon="icons:close" @tap.stop="_removeMarker" size=16 style="height:16px;background:white;border-radius:50%;margin:2px"></oda-button>
    `,
    props: {
        markers: [],
        value: {
            type: String,
            set(n) { this.style.background = n; }
        },
        color: {
            default: '',
            set(n) {
                this.setColor(n);
            }
        }
    },
    listeners: {
        'tap': '_onTap',
        'tap-marker': '_onTapMarker'
    },
    attached() {
        if (this.value && this.value.startsWith('linear-gradient')) {
            let reg_expr = /(rgb\([0-9]{1,3}, [0-9]{1,3}, [0-9]{1,3}\))|(#[0-9a-f]{3,6})|(aqua|black|dodgerblue|lightblue|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow){1}/gi;
            let result = this.value.match(reg_expr);
            result.forEach(color => {
                if (color)
                    this.addMarker(color);
            });
        } else {
            this.addMarker(this.value);
        }
    },
    detached() {
        if (this.markers.length > 0) {
            this.markers.forEach(marker => marker.remove());
            this.markers = [];
        }
    },
    _onTap(e) {
        this.addMarker();
    },
    _onTapMarker(e) {
        this.markers.forEach(o => o.selected = false);
        this.markers[e.detail.value].selected = true;
        this.selected = e.detail.value;
    },
    _removeMarker() {
        if (this.markers.length > 1) {
            let m = this.markers.splice(this.selected, 1);
            m[0].remove();
            this.selected = this.markers.length - 1;
            let i = 0;
            this.markers.forEach(o => {
                o.selected = false;
                o.id = i++;
            });
            this.markers[this.selected].selected = true;
        }
        this.setPreviewColor();
    },
    addMarker(color) {
        if (this.markers.length > 5)
            return;
        if (!color && this.markers.length > 0)
            color = this.markers[this.markers.length - 1].color;
        this.selected = this.markers.length;
        this.markers.forEach(o => o.selected = false);
        let arrow = this.create('oda-gradient-preview-marker', { color: color, id: this.selected });
        this.markers.push(arrow);
        this.$refs.markers.appendChild(arrow);
        this.setPreviewColor();
    },
    setColor(color) {
        const marker = this.markers.find(m => m.selected);
        let m = marker || this.markers[0];
        m.color = color;
        this.setPreviewColor();
    },
    setPreviewColor() {
        if (this.markers.length > 1 && this.markers.filter(m => m.color).length > 1) {
            this.value = `linear-gradient(${this.markers.filter(m => m.color).map(m => m.color).join(', ')})`;
        } else {
            const markerWithColor = this.markers.find(m => m.color);
            if (markerWithColor)
                this.value = markerWithColor.color;
        }
    }
});

ODA({ is: 'oda-gradient-preview-marker', template: /*html*/`
        <style>
            :host {
                @apply --border;
                @apply --raised;
                border-radius: 50%;
                background: white;
            }
        </style>
    `,
    extends: 'oda-icon',
    props: {
        id: 0,
        size: 24,
        icon: { get() { return this.selected ? 'av:play-arrow' : 'icons:chevron-right' } },
        selected: true,
        fill: "",
        color: {
            type: String,
            set(n) { this.fill = n }
        }
    },
    listeners: {
        'tap': '_onTap'
    },
    _onTap(e) {
        e.stopPropagation();
        this.fire('tap-marker', this.id)
    }
});

ODA({ is: 'oda-color-line', template: /*html*/`
    <style>
        :host {
            display: flex;
            flex-direction: column;
        }
        div {
            margin: 1px;
            cursor: pointer;
            @apply --shadow;
        }
        div:hover {
            outline: 1px solid darkred;
            transform: scale(1.5);
        }
    </style>
    <div ~for="light in lightness" :style="_getStyle(light)" @tap="_tap"></div> `,
    props: {
        size: Number, hue: Number, saturation: Number, gradients: Number, grays: false,
        lightness: {
            type: Array,
            get() {
                const step = 100 / (this.gradients + (this.grays ? -1 : 1)), lightness = [];
                if (this.grays) for (let i = this.gradients - 1; i >= 0; i--) lightness.push(step * i);
                else for (let i = this.gradients; i > 0; i--) lightness.push(step * i);
                return lightness;
            }
        },
        color: ''
    },
    _getStyle(light) {
        return `background-color: hsl(${this.hue}, ${this.saturation}%, ${light}%); width: ${this.size}px; height: ${this.size}px;`;
    },
    _tap(e) {
        this.color = e.target.style.backgroundColor;
    }
});
