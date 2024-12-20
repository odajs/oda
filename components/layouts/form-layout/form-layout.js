const ALL_FORMS = new Set();
ODA({
    is: 'oda-form-layout', imports: '@oda/button',
    template: /*html*/`
    <style>
        :host {
            @apply --vertical;
            @apply --flex;
            @apply --content;
            overflow: hidden;
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
        :host #titleBar {
            display: flex;
            flex-direction: {{_titleFlexDir}};
            align-items: justify;
            background: {{focused ? 'var(--focused-color) !important':'linear-gradient(0deg, var(--header-background), var(--content-background), var(--content-background))'}};
            color: {{focused ? 'var(--content-background)':'var(--content-color)'}};
            fill: {{focused ? 'var(--content-background)':'var(--content-color)'}};
        }
        :host #titleButtons{
            align-self: {{_titleButtonsAlign}};
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
            border: {{sizeMode === 'normal' ? \`\${_bw}px solid transparent\` : 'none'}};
            padding-bottom: {{statusBar.show ? iconSize : 0}}px;
            flex: {{sizeMode === 'normal' ? '0 0 auto' : '1 0 auto'}};
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
        :host(:not([autosize]):not([is-minimized])[float][size-mode=normal]){
            left: {{drawPos.l}}px;
            top: {{drawPos.t}}px;
            right: {{drawPos.r}}px;
            bottom: {{drawPos.b}}px;
        }
        :host(:not([autosize]):not([is-minimized])[float][size-mode=max]){
            /*padding: 8px;*/
            padding-top: var(--top-padding);
            backdrop-filter: blur(1px);
            background-color: rgba(0,0,0,0);
            width: 100%;
            height: 100%;
            /*padding-bottom: {{iconSize + 8}}px;*/
        }
        {{''}}
    </style>
    <div id="titleBar" @mouseenter="_in" @mouseleave="_out" class="pe-no-print">
        <oda-icon ~if="title && icon" :icon :sub-icon style="margin-left: 8px;"></oda-icon>
        <slot class="horizontal"  flex  name="title-bar"></slot>
        <label ~if="title" ~html="title" style="margin-left: 8px; align-self: center; overflow: hidden; text-overflow: ellipsis;"></label>
        <slot id="titleButtons" ~show="!isMinimized" class="horizontal no-flex" name="title-buttons"></slot>
        <oda-button :disabled="!focused" ~if="allowClose || (float && allowClose !== false)" class="close-btn" :icon-size="iconSize + 4" icon="icons:close" @mousedown.stop @tap.stop="_close" error-invert style="align-self: flex-start; padding: 2px; margin: 4px;"></oda-button>        
    </div>
    <form-status-bar ~show="!isMinimized" :icon-size="iconSize" ~props="statusBar"></form-status-bar>`,
    _in() {
        this.__allowMove = this.sizeMode !== 'max';
    },
    _out() {
        this.__allowMove = false;
    },
    _checkTitleIsSmall() {
        const titleButtons = this.$('slot[name=title-buttons]');
        const titleBar = this.$('#titleBar');
        if (titleButtons && titleBar) {
            return titleButtons.offsetWidth * 2 > titleBar.offsetWidth ? true : false;
        }
        else {
            return false;
        }
    },
    get _titleFlexDir() {
        return this._checkTitleIsSmall() ? 'column-reverse' : 'row';
    },
    get _titleButtonsAlign() {
        return this._checkTitleIsSmall() ? 'flex-end' : 'flex-start';
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
            return (this.domHost?.topPadding || this.iconSize || 24) + (this.iconSize || 24) / 2 + 4;
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
        __allowMove: {
            $def: false,
            set(v, o) {
                this._updateTrackListen();
            }
        },
        sizeMode: {
            $list: ['normal', 'max'],
            $def: 'normal',
            $save: true,
            $attr: true,
            set() {
                this._titleFlexDir = undefined;
                this._titleButtonsAlign = undefined;
            }
        },
        pos: {
            $def: {
                l: ~~(document.body.offsetWidth / 2 - 200),
                t: ~~(document.body.offsetHeight / 2 - 150),
                r: ~~(document.body.offsetWidth / 2 - 200),
                b: ~~(document.body.offsetHeight / 2 - 150),
            },
            $save: true
        },
        drawPos: {
            $def: {}
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
        _bw: 4, //border-width,
        _parentWidth: {
            $type: Number,
            $def: 0
        },
        _parentHeight: {
            $type: Number,
            $def: 0
        },
        hideMinMax: false,
        __trackListen: false
    },
    $listeners: {
        pointermove(e) {
            if (this.autosize || e.buttons || !this.float || this.sizeMode !== 'normal' || this.isMinimized)
                return;

            const bw = this._bw;
            const bw2 = bw * 2;
            const h = this.offsetHeight;
            const w = this.offsetWidth;

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
                this._updateTrackListen();
            });

        },
        resize: '_resize',
    },
    $observers: {
        _setTransform: ['float']
    },
    _updateTrackListen() {
        if (this.sizeMode === 'normal') {
            if (this.__trackListen) {
                if (!this.style.cursor.endsWith('resize') && !(this.__allowMove || (this.style.cursor === 'move'))) {
                    this.unlisten('track', 'track');
                    this.__trackListen = false;
                }
            }
            else {
                if (this.style.cursor.endsWith('resize') || this.__allowMove) {
                    this.listen('track', 'track');
                    this.__trackListen = true;
                    return;
                }
            }
        }
        else {
            this.unlisten('track', 'track');
        }
    },
    track(e, d) {
        d ??= e.detail;
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
                const x = d.ddx || 0;
                const y = d.ddy || 0;
                if (this.style.cursor === 'move') {
                    this.pos = {
                        l: this.pos.l + x,
                        t: this.pos.t + y,
                        r: this.pos.r - x,
                        b: this.pos.b - y
                    };
                    this._applyMove();
                }
                else if (this.style.cursor.endsWith('resize')) {
                    const directions = this.style.cursor.split('-')[0];
                    for (const dir of directions) {
                        switch (dir) {
                            case 'w': this.pos.l += x; break;
                            case 'n': this.pos.t += y; break;
                            case 'e': this.pos.r -= x; break;
                            case 's': this.pos.b -= y; break;
                        }
                    }
                    this._applyResize();
                }
            } break;
            case 'end': {
                this.style.cursor = '';
                this.pos = { ...this.drawPos };
            } break;
        }
    },
    _applyMove() {
        const width = this.offsetWidth;
        const height = this.offsetHeight;
        this.drawPos.l = Math.max(0, Math.min(this.pos.l || 0, this._parentWidth - width));
        this.drawPos.t = Math.max(0, Math.min(this.pos.t || 0, this._parentHeight - height));
        this.drawPos.r = Math.max(0, Math.min(this.pos.r || 0, this._parentWidth - width));
        this.drawPos.b = Math.max(0, Math.min(this.pos.b || 0, this._parentHeight - height));
    },
    _applyResize() {
        this.drawPos.l = Math.max(0, Math.min(this.pos.l || 0, this._parentWidth - this.minWidth - this.drawPos.r));
        this.drawPos.t = Math.max(0, Math.min(this.pos.t || 0, this._parentHeight - this.minHeight - this.drawPos.b));
        this.drawPos.r = Math.max(0, Math.min(this.pos.r || 0, this._parentWidth - this.minWidth - this.drawPos.l));
        this.drawPos.b = Math.max(0, Math.min(this.pos.b || 0, this._parentHeight - this.minHeight - this.drawPos.t));

        this.async(() => {
            this._titleFlexDir = undefined;
            this._titleButtonsAlign = undefined;
        }, 100);
    },
    _setTransform(float = this.float, pos = this.pos) {
        if (this.autosize) return;
        const parent = this.parentElement || this.domHost;
        if (!parent) return;
        this._parentWidth = parent.offsetWidth;
        this._parentHeight = parent.offsetHeight;
        this._applyMove();
        this._applyResize();
        this.pos = {...this.pos};
    },
    _resize() {
        if (this.autosize) return;
        if (this.float && this.sizeMode !== 'max' && window.innerWidth < this.maxWidth) {
            this.sizeMode = 'max';
        }
        this._setTransform();
    },
    attached() {
        if (!this.isMinimized) {
            if (this.float) {
                this.async(() => {
                    const forms = this._getFloatForms();
                    if (forms.length) {
                        if (!this.pos) this.pos = { ...this.drawPos };
                        for (const m of forms) {
                            if (
                                this.pos.l >= m.drawPos.l
                                && this.pos.l < m.drawPos.l + this.topPadding
                                && this.pos.t >= m.drawPos.t
                                && this.pos.t < m.drawPos.t + this.topPadding
                            ) {
                                this.pos.l = m.drawPos.l + this.topPadding;
                                this.pos.r = m.drawPos.r - this.topPadding;
                                this.pos.t = m.drawPos.t + this.topPadding;
                                this.pos.b = m.drawPos.b - this.topPadding;
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
        let floats = this._getFloatForms();
        return floats.length === 0  || floats.every(m => m === this || m.zIndex < this.zIndex);
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
ODA({
    is: 'form-status-bar',
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