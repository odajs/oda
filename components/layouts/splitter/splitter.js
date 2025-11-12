ODA({ is: 'oda-splitter',
    template: /*html*/`
    <style>
        :host([align=vertical]) {
            @apply --vertical;
            cursor: col-resize;
            width: {{size}}px;
            max-width: {{size}}px;
            min-width: {{size}}px;
            z-index: 1;
            position: relative;
        }
        :host([align=horizontal]) {
            @apply --horizontal;
            cursor: row-resize;
            height: {{size}}px;
            max-height: {{size}}px;
            min-height: {{size}}px;
        }
        :host([align=vertical])::after, :host([align=horizontal])::after, :host([align=vertical])::before, :host([align=horizontal])::before {
            position: absolute;
            content: "";
            z-index: 1;
            background-color: transparent;
        }
        :host([align=vertical])::after, :host([align=vertical])::before {
            top: 0; bottom: 0; width: {{pseudo}}px;
         }
        :host([align=vertical])::after { left: 100%; }
        :host([align=vertical])::before { right: 100%; }
        :host([align=horizontal])::after, :host([align=horizontal])::before {
            left: 0; right: 0; height: {{pseudo}}px;
        }
        :host([align=horizontal])::after { top: 100%; }
        :host([align=horizontal])::before { bottom: 100%; }
        :host {
            position: relative;
            z-index: 1;
            background-color: {{color}};
            overflow: visible;
            /*transition: background-color .4s;*/
            align-items: center;
            justify-content: center;
            max-width: {{align === 'vertical' ? (+this.size >= 0 ? this.size + 'px' : '1px') : '100%'}};
            max-height: {{align === 'vertical' ? '100%' : (+this.size >= 0 ? this.size + 'px' : '1px')}};
        }
        :host(:hover){
            background-color: black;
            @apply --shadow;
        }

    </style>
    `,
    $public: {
        color: 'var(--dark-background)',
        size: 1,
        pseudo: 4,
        max: {
            $def: 0,
            $attr: true
        },
        align: {
            $def: 'vertical',
            $attr: true,
            $list: ['horizontal', 'vertical'],
        },
        reverse: false,
        width: {
            $type: Number,
            set(n) {
                if (this.max && n > this.max)
                    this.width = this.max;
            }
        },
        height: {
            $type: Number,
            set(n) {
                if (this.max && n > this.max)
                    this.height = this.max;
            }
        }
    },
    sign: {
        $type: Number,
        $attr: true
    },
    get _sign() {
        if (this.sign) return this.sign;
        const items = [...(this.parent?.children || []), ...(this.parent?.[CORE_KEY]?.shadowRoot?.children || [])];
        return (items.indexOf(this) === items.length - 1) ? -1 : 1
    },
    get parent() {
        return this.parentElement || this.domHost;
    },
    $listeners: {
        track: '_onTrack',
        pointerdown() { this.isDragged = true }
    },
    attached(){
        this.addEventListener('dragstart', e=>{
            e.stopPropagation();
            e.preventDefault();
        }, true)
    },
    _onTrack(e, d) {
        if (!this.isDragged) return;
        switch (d.state) {
            case 'start': {
                this._mover = ODA.createElement('oda-splitter-mover', { align: this.align });
                document.body.appendChild(this._mover);
                this._mover.pos = d;
            } break;
            case 'end': {
                this._mover?.remove();
                switch (this.align) {
                    case 'horizontal': {
                        this.height = this.parent.offsetHeight - d.dy * this._sign;
                        this.parent.style.height = this.height + 'px';
                    } break;
                    default: {
                        this.width = this.parent.offsetWidth - d.dx * this._sign;
                        this.parent.style.width = this.width + 'px';
                    } break;
                }
                this.isDragged = false;
            } break;
            case 'track': {
                switch (this.align) {
                    case 'horizontal': {
                        if (d.y >= 0 && d.y <= window.innerHeight) {
                            this._mover.pos = d;
                            this._mover.tracked = true;
                        }
                    } break;
                    default: {
                        if (d.x >= 0 && d.x <= window.innerWidth) {
                            this._mover.pos = d;
                            this._mover.tracked = true;
                        }
                    } break;
                }
            } break;
        }
    }
})

ODA({ is: 'oda-splitter-mover',
    template: /*html*/`
    <style>
        :host {
            position: fixed;
            width: 100%;
            height: 100%;
            animation: fadin 5s ease-in-out;
            background-color: rgba(0, 0, 0, 0.4);
            z-index: 1000000000;
            cursor: col-resize;
            pointer-events: none;
        }
        :host div {
            position: absolute;
            z-index: 1000000001;
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
    $listeners: {
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
})
