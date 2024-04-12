const ALL_FORMS = new Set();
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
            --top-padding: {{topPadding}}px;
        }
        :host(:not([float])) {
            position: relative;
        }
        :host([float]) {
            position: absolute;
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
            background-color: {{focused ? 'var(--focused-color) !important' : 'var(--content-color)'}};
            color: var(--content-background);
            fill: var(--content-background);
        }
        /*:host([float]) .title-bar, :host([show-close-btn]) .title-bar {*/
        /*    min-height: {{iconSize * 1.5}}px;*/
        /*    max-height: {{iconSize * 1.5}}px;*/
        /*}*/
        /*:host([float]) .title-bar oda-button, :host([show-close-btn]) .title-bar oda-button {*/
        /*        padding: {{iconSize / 8}}px;*/
        /*}*/
        :host(:not([autosize])[float]) {
            box-sizing: border-box;
            box-shadow: var(--box-shadow);
            filter: opacity(1);
            min-width: {{minWidth}}px;
            min-height: {{minHeight}}px;
            border: {{sizeMode === 'normal' ? \`\${_bw}px solid transparent\` : 'none'}};
            padding-bottom: {{statusBar.show ? iconSize : 0}}px;
            width: {{_getSize('width')}};
            height: {{_getSize('height')}};
            flex: {{sizeMode === 'normal' ? '0 0 auto' : '1 0 auto'}};
            left: {{_getPosition('left')}};
            top: {{_getPosition('top')}};
        }
        :host(:not([autosize])[float][is-minimized]) {
            min-height: {{iconSize * 1.5}}px;
            max-height: {{iconSize * 1.5}}px;
            {{hideMinMode ? 'visibility: hidden;' : ''}}
        }
        :host([autosize]) {
            height: unset;
            width: unset;
            margin: 0 0 0 50%;
            transform: translate3d(-50%, 0, 0);
        }
        :host(:not([autosize]):not([is-minimized])[float][size-mode=max]){
            /*padding: 8px;*/
            padding-top: var(--top-padding);
            background-color: rgba(0,0,0,.25);
            /*padding-bottom: {{iconSize + 8}}px;*/
        }
        {{''}}
    </style>
    <div class="title-bar horizontal" @mouseenter="_in" @mouseleave="_out">
        <oda-icon ~if="title && icon" :icon :sub-icon style="margin-left: 8px;"></oda-icon>
        <slot class="horizontal" style="flex-shrink: 1" name="title-bar"></slot>
        <label ~if="title" ~html="title" style="margin-left: 8px;  overflow: hidden; text-overflow: ellipsis;"></label>
        <div class="flex"></div>
        <slot ~show="!isMinimized" class="horizontal no-flex" name="title-buttons" style="align-self: flex-start;height: 100%;"></slot>
        <div ~if="float && !hideMinMax" style="align-self: flex-start;" class="horizontal no-flex">
            <oda-button ~if="float" :icon-size :icon="isMinimized ? 'icons:check-box-outline-blank' : 'icons:remove'" @mousedown.stop  @tap="isMinimized = !isMinimized"></oda-button>
            <oda-button ~if="float && !isMinimized" :icon-size :icon="sizeMode === 'max' ? 'icons:content-copy:90' : 'icons:check-box-outline-blank'" @mousedown.stop @tap.stop="_toggleSize(['normal', 'max'])"></oda-button>
        </div>
        <oda-button ~if="allowClose || (float && allowClose !== false)" class="close-btn" :icon-size="iconSize + 4" icon="icons:close" @mousedown.stop @tap.stop="_close" style="background-color: red; align-self: flex-start;"></oda-button>
    </div>
    <form-status-bar ~show="!isMinimized" :icon-size="iconSize" ~props="statusBar"></form-status-bar>`,
    _in() {
        this.__allowMove = this.sizeMode !== 'max';
    },
    _out() {
        this.__allowMove = false;
    },
    $public: {
        unique: String,
        icon: '',
        subIcon: '',
        iconSize: {
            $pdp: true,
            $def: 24,
        },
        get topPadding() {
            return (this.domHost?.topPadding || this.iconSize || 24) + (this.iconSize || 24) / 2;
        },
        autosize: {
            $def: false,
            $attr: true
        },
        float: {
            $def: false,
            $attr: true
        },
        isMinimized: {
            $def: false,
            $attr: true,
        },
        hideMinMode: {
            $type: Boolean,
            $def: false,
            $attr: true
        },
        allowClose: {
            $type: Boolean,
            $def: null,
            $attr: true
        },
        sizeMode: {
            $list: ['normal', 'max'],
            $def: 'normal',
            $save: true,
            $attr: true
        },
        pos: {
            $def: {
                x: Math.max(0, Math.round(document.body.offsetWidth / 2 - 200)),
                y: Math.max(0, Math.round(document.body.offsetHeight / 2 - 150)),
                width: 500,
                height: 300,
            },
            $save: true
        },
        title: '',
        statusBar: {
            $def: {
                show: false,
            },
        },
        minWidth: {
            $pdp: true,
            $def: 400
        },
        minHeight: 300,
        _resizeDir: String,
        // _curPos: String,
        _bw: 2, //border-width,
        _parentWidth: {
            $type: Number,
            $def: 0
        },
        _parentHeight: {
            $type: Number,
            $def: 0
        },
        hideMinMax: false,
    },
    $listeners: {
        pointermove(e) {
            if (this.autosize || e.buttons || !this.float || this.sizeMode !== 'normal' || this.isMinimized)
                return;

            const bw = this._bw;
            const bw2 = bw * 2;
            const h = this.pos.height;
            const w = this.pos.width;

            let str = '';
            if (e.currentTarget === e.target) {
                str += e.offsetY <= 0 ? 'n' : '';
                str += e.offsetY >= h - bw2 ? 's' : '';
                str += e.offsetX <= 0 ? 'w' : '';
                str += e.offsetX >= w - bw2 ? 'e' : '';
            }

            this.async(() => {
                if (str) {
                    this.style.cursor = `${str}-resize`;
                } else {
                    this.style.cursor = '';
                }
            });

        },
        track(e, d) {
            if (this.sizeMode === 'max') return;
            if (this.autosize) return;
            if (!this.float/*  || e.sourceEvent.button !== 0 */) return;
            // console.log(e)
            switch (d.state) {
                case 'start': {
                    if (!this.style.cursor && this.__allowMove)
                        this.style.cursor = `move`;
                } break;
                case 'track': {
                    let _pos = Object.assign({}, this.pos);
                    const x = d.ddx || 0;
                    const y = d.ddy || 0;
                    switch (this.style.cursor) {
                        case 'move': {
                            _pos = { ..._pos, ...{ x: _pos.x += x, y: _pos.y += y } };
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
    },
    $observers: {
        _setTransform: ['float', 'pos']
    },
    _setTransform(float = this.float, pos = this.pos) {
        if (this.autosize) return;
        const parent = this.parentElement || this.domHost;
        if (!parent) return;
        this._parentWidth = parent.offsetWidth;
        this._parentHeight = parent.offsetHeight;
        this._fixPos();
    },
    _resize() {
        if (this.autosize) return;
        // this.throttle('resize', ()=>{
        if (this.float && this.sizeMode !== 'max' && window.innerWidth < this.maxWidth) {
            this.sizeMode = 'max';
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
        const maxH = this._parentHeight - (this.isMinimized ? ((this.iconSize) + 6) : pos.height);
        pos.x = Math.min(Math.max(0, pos.x || 0), maxW);
        pos.y = Math.min(Math.max(0, pos.y || 0), maxH);

    },
    _getSize(dir = 'width') {
        if (this.float && this.sizeMode === 'normal') return `${this.pos[dir]}px`;
        else return '100%';
    },
    _getPosition(dir = 'left') {
        if (this.float && this.sizeMode === 'normal') return `${this.pos[{ left: 'x', top: 'y' }[dir]]}px`;
        else return 0;
    },
    attached() {
        if (!this.isMinimized) {
            if (this.float) {
                this.async(() => {
                    const forms = this._getFloatForms();
                    if (forms.length) {
                        for (const m of forms) {
                            if (
                                this.pos.x >= m.pos.x
                                && this.pos.x < m.pos.x + this.topPadding
                                && this.pos.y >= m.pos.y
                                && this.pos.y < m.pos.y + this.topPadding
                            ) {
                                this.pos.x = this.pos.x + this.topPadding;
                                this.pos.y = this.pos.y + this.topPadding;
                                this._setTransform();
                                return;
                            }
                        }
                    }
                });
            }
            const prop = this.style.getPropertyValue('--bw');
            this._bw = prop ? Number(prop.replace('px', '')) : this._bw;
            window.addEventListener('resize', () => {
                this._resize();
            });
            this._getAllForms().add(this);
            this._top();
            this.listen('pointerdown', '_top', { capture: true });
        }
    },
    detached() {
        this._getAllForms().delete(this);
        Array.from(this._getAllForms()).forEach(f => f.focused = undefined);
    },
    show() {

    },
    get focused() {
        return this._getFloatForms().every(m => m === this || m.zIndex < this.zIndex);
    },
    _top() {
        if (this.float) {
            const z = this._getFloatForms().reduce((res, m) => m.zIndex > res ? m.zIndex : res, this.zIndex);
            this.zIndex = z + 1;
        }
        if (this.float) {
            this._getAllForms().forEach(f => f.focused = undefined);
        }
        else {
            this._getAllForms().forEach(f => f.focused = false);
            this.focused = true;
        }
    },
    get zIndex() {
        return Number(getComputedStyle(this)['z-index']) || 1;
    },
    set zIndex(v) {
        this.style.setProperty('z-index', v);
        this._getFloatForms().forEach(e => e.focused = undefined);
    },
    _getAllForms() {
        return ALL_FORMS;
    },
    _getFloatForms() {
        return Array.from(this._getAllForms()).filter(e => e.float && !e.isMinimized);
    },
    _toggleSize([state1, state2]) {
        this.sizeMode = this.sizeMode === state1 ? state2 : state1;
        this._getFloatForms().forEach(f => f !== this && (f.sizeMode = this.sizeMode));
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
    $pdp: {
        show: false,
        iconSize: 24
    }
});