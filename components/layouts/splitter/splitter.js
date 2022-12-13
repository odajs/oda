ODA({is: 'oda-splitter',
    template: /*html*/`
    <style>
        :host([align=vertical]) {
            @apply --vertical;
            cursor: col-resize;
            width: {{size}}px;
            max-width: {{size}}px;
            min-width: {{size}}px;
            z-index: 1;
        }
        :host([align=horizontal]) {
            @apply --horizontal;
            cursor: row-resize;
            height: {{size}}px;
            max-height: {{size}}px;
            min-height: {{size}}px;
        }
        :host(:active) {
            z-index: 1;
            pointer-events: none;
        }
        :host {
            background-color: {{color}};
            /*@apply --dark;*/
            overflow: visible;
            /*opacity: .3;*/
            transition: background-color .4s;
            align-items: center;
            justify-content: center;
        }
        :host(:hover) {
            opacity: 1;
            z-index: 1;
        }
    </style>
    `,
    props: {
        color: 'var(--dark-background)',
        size: 4,
        max: {
            default: 0,
            reflectToAttribute: true
        },
        align: {
            default: 'vertical',
            reflectToAttribute: true,
            list: ['horizontal', 'vertical'],
        },
        reverse: false,
        width: {
            type: Number,
            get() {
                return this.parent?.offsetWidth;
            },
            set(n) {
                if (this.max && n > this.max)
                    this.width = this.max;
            }
        },
        height: Number
    },
    get _sign() {
        if (this.sign) return this.sign;
        const items = [...(this.parent?.children || []), ...(this.parent?.$core?.root.children || [])];
        return (items.indexOf(this) === items.length - 1) ? -1 : 1
    },
    get parent() {
        return this.parentElement || this.domHost;
    },
    listeners: {
        track: '_onTrack',
        pointerdown(e) {
            this._mover = this.create('oda-splitter-mover', { align: this.align });
            document.body.appendChild(this._mover);
        }
    },
    _onTrack(e, d) {
        switch (d.state) {
            case 'start': {
                this._mover.pos = d;
            } break;
            case 'end': {
                this._mover?.remove();
                switch (this.align) {
                    case 'horizontal': {
                        this.parent.style.height = this.parent.offsetHeight - d.dy * this._sign + 'px';
                    } break;
                    default: {
                        this.parent.style.width = this.parent.offsetWidth - d.dx * this._sign + 'px';
                    } break;
                }
            } break;
            case 'track': {
                switch (this.align) {
                    case 'horizontal': {
                        if (d.y > 0 && d.y < window.innerHeight) {
                            this._mover.pos = d;
                            this._mover.tracked = true;
                        }
                    } break;
                    default: {
                        if (d.x > 0 && d.x < window.innerWidth) {
                            this._mover.pos = d;
                            this._mover.tracked = true;
                        }
                    } break;
                }
            } break;
        }
    }
});

ODA({is: 'oda-splitter-mover',
    template: /*html*/`
    <style>
        :host {
            position: fixed;
            width: 100%;
            height: 100%;
            animation: fadin 5s ease-in-out;
            background-color: rgba(0, 0, 0, 0.4);
            z-index: 1000;
            cursor: col-resize;
        }
        :host div {
            position: absolute;
            z-index: 1001;
            @apply --header;
        }
        @keyframes fadin {
            from {background-color: rgba(0, 0, 0, 0)}
            to {background-color: rgba(0, 0, 0, 0.4)}
        }
    </style>
    <div class="border" ~style="_getStyle(pos)"></div>
    `,
    align: '',
    pos: null,
    attached() {
        this.async(() => {
            this.style.setProperty?.('visibility', 'visible');
        })
    },
    listeners: {
        mousedown(e) {
            this.remove();
        }
    },
    _getStyle(e) {
        if (e) {
            switch (this.align) {
                case 'vertical':
                    return `left:${(e.x - 2)}px; height: 100%; width: 2px; cursor: col-resize;`;
                case 'horizontal':
                    return `top:${(e.y - 2)}px; height: 2px; width: 100%; cursor: row-resize;`;
            }
        }
    }
});

