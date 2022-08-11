ODA({is: 'oda-form-layout', imports: '@oda/button',
    template: /*html*/`
    <style>
        :host {
            @apply --vertical;
            @apply --flex;
            @apply --content;
            overflow: hidden;
            height: 100%;
            touch-action: manipulation;
            white-space: nowrap;
            --button-size: {{iconSize + 8}}px;
        }
        :host(:not([modal])) {
            position: relative;
        }
        :host([modal]) {
            position: absolute;
        }
        :host([modal][is-minimized]:not([hide-min-mode])) {
            position: initial;
        }
        form-status-bar{
            position: absolute;
            width: 100%;
            bottom: 0;
            left: 0;
        }
        :host>.body {
            @apply --flex;
        }
        :host .title-bar {
            align-items: center;
            background-color: {{isTopModal ? '#feff05 !important' : 'var(--content-background)'}};
        }
        :host([modal]) .title-bar, :host([show-close-btn]) .title-bar {
            min-height: {{iconSize + iconSize / 8 + 4}}px;
            max-height: {{iconSize + iconSize / 8 + 4}}px;
            line-height: {{iconSize + iconSize / 8}}px;
        }
        :host([modal]) .title-bar oda-button, :host([show-close-btn]) .title-bar oda-button {
                padding: {{iconSize / 8}}px;
        }
        :host(:not([autosize])[modal]:not([is-minimized])) {
            box-sizing: border-box;
            box-shadow: var(--box-shadow);
            filter: opacity(1);
            min-width: {{minWidth}}px;
            min-height: {{minHeight}}px;
            border: {{size === 'normal' ? '4px solid var(--border-color)' : 'none'}};
            padding-bottom: {{statusBar.show ? iconSize : 0}}px;
            width: {{_getSize('width')}};
            height: {{_getSize('height')}};
            flex: {{size === 'normal' ? '0 0 auto' : '1 0 auto'}};
            left: {{_getPosition('left')}};
            top: {{_getPosition('top')}};
        }
        :host(:not([autosize])[modal][is-minimized]) {
            box-sizing: border-box;
            box-shadow: var(--box-shadow);
            max-width: 400px;
            height: {{($refs.titleBar?.offsetHeight || 0)}}px;
            max-height: {{($refs.titleBar?.offsetHeight || 0)}}px;
            border: none;
            left: initial;
            top: initial;
            {{hideMinMode ? 'visibility: hidden;' : ''}}
        }
        :host([autosize]) {
            height: unset;
            width: unset;
            margin: 0 0 0 50%;
            transform: translate3d(-50%, 0, 0);
        }
        :host(:not([autosize]):not([is-minimized])[modal][size=max]){
            padding: 8px;
            padding-top: var(--button-size);
            background-color: rgba(0,0,0,.5);
            padding-bottom: var(--button-size);
        }
    </style>
    <div class="title-bar horizontal" invert @mouseenter="_flags.allowMove = true" @mouseleave="_flags.allowMove = false">
        <oda-icon ~if="title && icon" :icon style="margin-left: 8px;"></oda-icon>
        <slot class="horizontal" style="flex-shrink: 1" ref="titleBar" name="title-bar"></slot>
        <div ~if="title" ~html="title" style="margin-left: 8px;  overflow: hidden; text-overflow: ellipsis;"></div>
        <div class="flex"></div>
        <slot ~show="!isMinimized" class="horizontal no-flex" name="title-buttons"></slot>
        <div ~if="modal && !hideMinMax" class="horizontal no-flex">
            <oda-button ~if="modal && !isMinimized" :size="iconSize/2" :icon="isMinimized ? 'icons:check-box-outline-blank' : 'icons:remove'" @mousedown.stop  @tap="isMinimized = !isMinimized"></oda-button>
            <oda-button ~if="modal && !isMinimized" :size="iconSize/2" :icon="size === 'max' ? 'icons:content-copy:90' : 'icons:check-box-outline-blank'" :active="size === 'max'" @mousedown.stop @tap.stop="_toggleSize(['normal', 'max'])"></oda-button>
        </div>
        <oda-button ~if="allowClose || (modal && allowClose !== false)" class="close-btn" :size="iconSize/2" icon="icons:close" @mousedown.stop @tap.stop="_close" style="background-color: #00f4e1"></oda-button>
    </div>
    <form-status-bar ~show="!isMinimized" :icon-size="iconSize" :props="statusBar"></form-status-bar>`,
    _flags: {
        allowMove: false
    },
    props: {
        unique: String,
        icon: '',
        iconSize: {
            default: 24,
            shared: true
        },
        autosize: {
            default: false,
            reflectToAttribute: true
        },
        modal: {
            default: false,
            reflectToAttribute: true
        },
        isMinimized: {
            default: false,
            set(n) {
                if (n) {
                    this._minimizedFormPlace.appendChild(this);
                } else {
                    this.show();
                }
            },
            reflectToAttribute: true
        },
        hideMinMode: {
            type: Boolean,
            default: null,
            reflectToAttribute: true
        },
        allowClose: {
            type: Boolean,
            default: null,
            reflectToAttribute: true
        },
        size: {
            list: ['normal', 'max'],
            default: 'normal',
            save: true,
            reflectToAttribute: true
        },
        pos: {
            default: {
                x: Math.max(0, Math.round(document.body.offsetWidth / 2 - 200)),
                y: Math.max(0, Math.round(document.body.offsetHeight / 2 - 150)),
                width: 500,
                height: 300,
            },
            save: true
        },
        title: '',
        statusBar: {
            default: {
                show: false,
            },
        },
        minWidth: 400,
        minHeight: 300,
        _resizeDir: String,
        // _curPos: String,
        _bw: 4, //border-width,
        _parentWidth: {
            type: Number,
            default: 0
        },
        _parentHeight: {
            type: Number,
            default: 0
        },
        hideMinMax: false,
    },
    listeners: {
        mousemove(e) {
            if (this.autosize || e.buttons || !this.modal || this.size !== 'normal' || this.isMinimized)
                return;
            const bw = this._bw;
            const bw2 = bw * 2;
            const h = this.pos.height;
            const w = this.pos.width;

            let str = '';
            str += e.offsetY <= 0 ? 'n' : '';
            str += e.offsetY >= h - bw2 ? 's' : '';
            str += e.offsetX <= 0 ? 'w' : '';
            str += e.offsetX >= w - bw2 ? 'e' : '';

            this.async(() => {
                if (str) {
                    this.style.cursor = `${str}-resize`;
                } else {
                    return this.style.cursor = '';
                }
            })

        },
        track(e, d) {
            if (this.autosize) return;
            if (!this.modal || e.sourceEvent.button !== 0) return;
            // console.log(e)
            switch (d.state) {
                case 'start': {
                    if (!this.style.cursor && this._flags.allowMove)
                        this.style.cursor = `move`;
                } break;
                case 'track': {
                    let _pos = Object.assign({}, this.pos);
                    const x = d.ddx || 0;
                    const y = d.ddy || 0;
                    switch (this.style.cursor) {
                        case 'move': {
                            _pos = { ..._pos, ...{ x: _pos.x += x, y: _pos.y += y } }
                        } break;
                        case 'e-resize': {
                            _pos.width += x;
                        } break;
                        case 'w-resize': {
                            _pos.width -= x;
                            _pos.x += this.pos.width - _pos.width;
                        } break;
                        case 's-resize': {
                            _pos.height += y;
                        } break;
                        case 'n-resize': {
                            _pos.height -= y;
                            _pos.y += this.pos.height - _pos.height;
                        } break;

                        case 'ne-resize': {
                            _pos.width += x;
                            _pos.height -= y;
                            _pos.y += this.pos.height - _pos.height;
                        } break;
                        case 'nw-resize': {
                            _pos.width -= x;
                            _pos.x += this.pos.width - _pos.width;
                            _pos.height -= y;
                            _pos.y += this.pos.height - _pos.height;
                        } break;
                        case 'se-resize': {
                            _pos.width += x;
                            _pos.height += y;
                        } break;
                        case 'sw-resize': {
                            _pos.height += y;
                            _pos.width -= x;
                            _pos.x += this.pos.width - _pos.width;
                        } break;
                    }
                    this._fixPos(_pos);
                    this.pos = { ...this.pos, ..._pos };
                    // console.log(this.style.cursor)
                } break;
                case 'end': {
                    this.style.cursor = '';
                } break;
            }
        },
        resize: '_resize',
        mousedown() {
            this._top();
        },
    },
    observers: [
        '_setTransform(modal, pos)'
    ],
    _setTransform(modal = this.modal, pos = this.pos) {
        if (this.autosize) return;
        const parent = this.parentElement || this.domHost;
        if (!parent) return;
        this._parentWidth = parent.offsetWidth;
        this._parentHeight = parent.offsetHeight;
        this._fixPos();
    },
    _resize() {
        if (this.autosize) return;
        // this.interval('resize', ()=>{
        if (this.modal && this.size !== 'max' && window.innerWidth < this.maxWidth) {
            this.size = 'max';
        }
        const parent = this.parentElement;
        if (!parent) return;
        this._parentWidth = parent.offsetWidth;
        this._parentHeight = parent.offsetHeight;
        this._fixPos();
        // })

    },
    _fixPos(pos = this.pos) {
        if (this.autosize) return;
        pos.width = Math.min(Math.max(this.minWidth, pos.width || this.minWidth), this._parentWidth);
        pos.height = Math.min(Math.max(this.minHeight, pos.height || this.minHeight), this._parentHeight);
        const maxW = this._parentWidth - (this.isMinimized ? 300 : pos.width);
        const maxH = this._parentHeight - (this.isMinimized ? ((this.$refs.titleBar?.offsetHeight || 0) + 6) : pos.height);
        pos.x = Math.min(Math.max(0, pos.x || 0), maxW);
        pos.y = Math.min(Math.max(0, pos.y || 0), maxH);

    },
    _getSize(dir = 'width') {
        if (this.modal && this.size === 'normal') return `${this.pos[dir]}px`;
        else return '100%';
    },
    _getPosition(dir = 'left') {
        if (this.modal && this.size === 'normal') return `${this.pos[{ left: 'x', top: 'y' }[dir]]}px`;
        else return 0;
    },
    attached() {
        if (!this.isMinimized) {
            this._setTransform();
            const prop = this.style.getPropertyValue('--bw');
            this._bw = prop ? Number(prop.replace('px', '')) : this._bw;
            window.addEventListener('resize', () => {
                this._resize();
            });
            this._top();
        }
    },
    show() {

    },
    get isTopModal() {
        return this.modal;
    },
    _top() {
        if (this.modal) {
            const my = Number(getComputedStyle(this)["zIndex"]);
            const modals = this._getModals();
            const z = modals.reduce((res, el) => {
                const z = Number(getComputedStyle(el)["zIndex"]);
                if (z > res)
                    res = z;
                return res;
            }, 0);
            if (my <= z) {
                modals.forEach(el => el.isTopModal = false);
                this.isTopModal = true;
                this.style.zIndex = z + 1;
            }
            this.isMinimized = false;
        }
    },
    _getModals() {
        return [...document.body.querySelectorAll('odant-form'), ...this._minimizedFormPlace.querySelectorAll('odant-form')].filter(e => e.modal);
    },
    get _minimizedFormPlace() {
        let place = this.hideMinMode ? document.body : document.querySelector('.minimized-form-place');
        if (!place) {
            place = document.createElement('div');
            place.style.setProperty('position', 'relative');
            place.style.setProperty('z-index', '100000');
            place.classList.add('minimized-form-place');
            place.classList.add('horizontal');
            document.body.appendChild(place);
        }
        return place;
    },
    _toggleSize([state1, state2]) {
        this.size = this.size === state1 ? state2 : state1;
    },
});
ODA({is: 'form-status-bar',
    template: /*html*/`
    <style ~if="show">
        :host {
            @apply --header;
            @apply --horizontal;
            @apply --no-flex;
            min-height: {{iconSize}}px;
        }
    </style>
    <style ~if="!show">
        :host {
            display: none;
        }
    </style>
    `,
    props: {
        show: false,
        iconSize: 24
    }
});