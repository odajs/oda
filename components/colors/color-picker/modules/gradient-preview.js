ODA({ is: 'oda-gradient-preview', imports: '@oda/icon',
    template: `
    <style>
        :host {
            @apply --border;
            flex-grow: 0;
            flex-shrink: 0;
            width: 60px;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
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
    <div ref="markers"></div>`,
    props: {
        markers: [],
        color: {
            type: String,
            set(color) {
                this.host.style.background = color;
            }
        }
    },
    hostAttributes: {
        tabindex: 1
    },
    listeners: {
        'tap': '_onTap',
        'keydown': '_onKeyDown'
    },
    attached() {
        if (this.color && this.color.startsWith('linear-gradient')) {
            let reg_expr = /(rgb\([0-9]{1,3}, [0-9]{1,3}, [0-9]{1,3}\))|(#[0-9a-f]{3,6})|(aqua|black|dodgerblue|lightblue|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow){1}/gi;
            let result = this.color.match(reg_expr);
            result.forEach(color => {
                if (color)
                    this.addMarker(color);
            });
        } else {
            this.addMarker(this.color);
        }
    },
    detached() {
        if (this.markers.length > 0) {
            this.markers.forEach(marker => marker.remove());
            this.markers = [];
        }
    },
    _onKeyDown(e) {
        if (e.keyCode === 46 || e.keyCode === 110 || e.keyCode === 8) {
            this.removeMarker(this.markers.find(m => m.selected));
        }
    },
    _onTap(e) {
        this.addMarker();
    },
    removeMarker(m) {
        if (this.markers.length > 1) {
            let i = this.markers.findIndex(marker => marker === m);
            this.markers.splice(i, 1);
            m.remove();
            if (i > 0) i--;
            m = this.markers[i];
            m.selected = true;
        }
        this.setPreviewColor();
    },
    addMarker(color) {
        if (this.markers.length > 5)
            return;
        if (!color && this.markers.length > 0)
            color = this.markers[this.markers.length - 1].color;
        let arrow = this.create('oda-gradient-preview-marker', { selected: true, color: color });

        this.$refs.markers.appendChild(arrow);
        this.markers.push(arrow);
        this.setPreviewColor();
    },
    setColor(color) {
        const marker = this.markers.find(m => m.selected);
        marker.color = color;
        this.setPreviewColor();
    },
    setPreviewColor() {
        if (this.markers.length > 1 && this.markers.filter(m => m.color).length > 1) {
            this.color = `linear-gradient(${this.markers.filter(m => m.color).map(m => m.color).join(', ')})`;
        } else {
            const markerWithColor = this.markers.find(m => m.color);
            if (markerWithColor)
                this.color = markerWithColor.color;
        }
    }
});

ODA({ is: 'oda-gradient-preview-marker', template: `
    <style>
        :host {
            @apply --border;
            @apply --raised;
            border-radius: 50%;
            background: white;
        }
    </style>`,
    extends: 'oda-icon',
    props: {
        icon: 'icons:chevron-right',
        size: 24,
        selected: {
            type: Boolean,
            set(selected) {
                this.icon = selected ? 'av:play-arrow' : 'icons:chevron-right';
                if (selected && this.domHost && this.domHost.markers) {
                    this.domHost.markers.forEach(m => {
                        m.selected = (m === this.host);
                    })
                }
            }
        },
        color: {
            type: String,
            set(color) {
                this.host.style.fill = color;
            }
        }
    },
    listeners: {
        'tap': '_onTap'
    },
    _onTap(e) {
        e.stopPropagation();
        this.selected = true;
    }
});
