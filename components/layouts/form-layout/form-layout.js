const ALL_FORMS = new Set();
ODA({
    is: 'oda-form-layout', imports: '@oda/button',
    template: /*html*/`
    <style>
        :host {
            --side-padding: {{sidePadding}}px;
        }
        :host #titleBar {
            flex-direction: row;
            background: {{focused ? 'var(--focused-color) !important':'linear-gradient(0deg, var(--header-background), var(--content-background), var(--content-background))'}};
            color: {{focused ? 'var(--content-background)':'var(--content-color)'}};
            fill: {{focused ? 'var(--content-background)':'var(--content-color)'}};
        }
    </style>
    <style>
        :host {
            @apply --vertical;
            @apply --flex;
            @apply --content;
            background-color: transparent !important;
            overflow: hidden;
            touch-action: manipulation;
            white-space: nowrap;
            position: absolute;
            box-sizing: border-box;
            filter: drop-shadow(0px 0px 4px var(--shadow-color));
            width: 100%;
            height: 100%;
        }
        :host([float]){
            margin-top: var(--side-padding);
            margin-left: var(--side-padding);
            width: calc(100% - var(--side-padding));
            height: calc(100% - var(--side-padding));
        }
        :host([dialog]) {
            margin: var(--side-padding);
            width: calc(100% - var(--side-padding)*2);
            height: calc(100% - var(--side-padding)*2);
        }
        :host > .body {
            @apply --flex;
        }
        :host #titleBar {
            display: flex;
            align-items: justify;
        }
    </style>
    <div id="titleBar" class="pe-no-print">
        <oda-icon ~if="title && icon" :icon :sub-icon style="margin-left: 8px;"></oda-icon>
        <slot class="horizontal"  flex  name="title-bar"></slot>
        <label ~if="title" ~html="title" style="margin-left: 8px; align-self: center; overflow: hidden; text-overflow: ellipsis;"></label>
        <slot id="titleButtons" class="horizontal no-flex" name="title-buttons"></slot>
        <oda-button :disabled="!focused" ~if="allowClose || (float && allowClose !== false)" class="close-btn" :icon-size="iconSize + 4" icon="icons:close" @mousedown.stop @tap.stop="_close" error-invert style="align-self: flex-start; padding: 2px; margin: 4px;"></oda-button>
    </div>`,
    /**@this {odaFormLayout} */
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
    $public: {
        $pdp: true,
        title: '',
        icon: '',
        subIcon: '',
        iconSize: {
            $pdp: true,
            $def: 24,
        },
        allowClose: {
            $type: Boolean,
            $def: null,
            $attr: true
        },
        get sidePadding() {
            const iconSize = this.iconSize || 24;
            const previousPadding = (this.domHost && this.domHost.float && this.domHost?.sidePadding) || 0;
            return previousPadding + iconSize / 2 + 8;
        },
        float: {
            $def: false,
            $attr: true
        },
        dialog: {
            $def: false,
            $attr: true
        },
        unique: String,
    },
    _parentWidth: {
        $type: Number,
        $def: 0
    },
    _parentHeight: {
        $type: Number,
        $def: 0
    },
    /**@this {odaFormLayout} */
    attached() {
        this._getAllForms().add(this);
        this._top();
        this.listen('pointerdown', '_top', { capture: true });
    },
    /**@this {odaFormLayout} */
    detached() {
        this._getAllForms().delete(this);
        Array.from(this._getAllForms()).forEach(f => f.focused = undefined);
    },
    show() {

    },
    /**@this {odaFormLayout} */
    get focused() {
        let forms = this._getAllForms();
        return (forms.size === 0) || Array.from(forms).every(m => m === this || m.zIndex < this.zIndex);
    },
    /**@this {odaFormLayout} */
    _top() {
        this._getAllForms().forEach(f => f.focused = false);
        this.focused = true;
    },
    /**@this {odaFormLayout} */
    get zIndex() {
        return Number(getComputedStyle(this)['z-index']) || 1;
    },
    /**@this {odaFormLayout} */
    set zIndex(v) {
        this.style.setProperty('z-index', String(v));
        Array.from(this._getAllForms()).forEach(e => e.focused = undefined);
    },
    /**@this {odaFormLayout} */
    _getAllForms() {
        return ALL_FORMS;
    },
    /**@this {odaFormLayout} */
    _getChildForms() {
        return Array.from(this._getAllForms()).filter(e => e.float);
    },
});

// ODA({
//     is: 'oda-movable-resizable',
//     _bw: 4,
//     pos: {
//         $def: {
//             l: ~~(document.body.offsetWidth / 2 - 200),
//             t: ~~(document.body.offsetHeight / 2 - 150),
//             r: ~~(document.body.offsetWidth / 2 - 200),
//             b: ~~(document.body.offsetHeight / 2 - 150),
//         },
//         $save: true
//     },
//     drawPos: {
//         $def: {}
//     },
//     $listeners: {
//         /**
//          * @this {odaFormLayout}
//          * @param {PointerEvent} e
//          */
//         pointermove(e) {
//             if (e.buttons) return;

//             const bw = this._bw;
//             const bw2 = bw * 2;
//             const h = this.offsetHeight;
//             const w = this.offsetWidth;

//             let str = '';
//             if (e.currentTarget === e.target) {
//                 str += e.offsetY <= 0 ? 'n' : '';
//                 str += e.offsetY >= h - bw2 ? 's' : '';
//                 str += e.offsetX <= 0 ? 'w' : '';
//                 str += e.offsetX >= w - bw2 ? 'e' : '';
//             }

//             this.async(() => {
//                 if (str) {
//                     this.style.cursor = `${str}-resize`;
//                 } else {
//                     this.style.cursor = '';
//                 }
//                 this._updateTrackListen();
//             });

//         },
//         resize: '_resize',
//     },
//     $observers: {
//         _setTransform: ['float']
//     },
//     _updateTrackListen() {
//         if (this.float) {
//             if (this.__trackListen) {
//                 if (!this.style.cursor.endsWith('resize') && !(this.__allowMove || (this.style.cursor === 'move'))) {
//                     this.unlisten('track', 'track');
//                     this.__trackListen = false;
//                 }
//             }
//             else {
//                 if (this.style.cursor.endsWith('resize') || this.__allowMove) {
//                     this.listen('track', 'track');
//                     this.__trackListen = true;
//                     return;
//                 }
//             }
//         }
//         else {
//             this.unlisten('track', 'track');
//         }
//     },
//     _applyMove() {
//         const width = this.offsetWidth;
//         const height = this.offsetHeight;
//         this.drawPos.l = Math.max(0, Math.min(this.pos.l || 0, this._parentWidth - width));
//         this.drawPos.t = Math.max(0, Math.min(this.pos.t || 0, this._parentHeight - height));
//         this.drawPos.r = Math.max(0, Math.min(this.pos.r || 0, this._parentWidth - width));
//         this.drawPos.b = Math.max(0, Math.min(this.pos.b || 0, this._parentHeight - height));
//     },
//     _applyResize() {
//         this.drawPos.l = Math.max(0, Math.min(this.pos.l || 0, this._parentWidth - this.minWidth - this.drawPos.r));
//         this.drawPos.t = Math.max(0, Math.min(this.pos.t || 0, this._parentHeight - this.minHeight - this.drawPos.b));
//         this.drawPos.r = Math.max(0, Math.min(this.pos.r || 0, this._parentWidth - this.minWidth - this.drawPos.l));
//         this.drawPos.b = Math.max(0, Math.min(this.pos.b || 0, this._parentHeight - this.minHeight - this.drawPos.t));
//     },
//     _setTransform(float = this.float, pos = this.pos) {
//         const parent = this.parentElement || this.domHost;
//         if (!parent) return;
//         this._parentWidth = parent.offsetWidth;
//         this._parentHeight = parent.offsetHeight;
//         this._applyMove();
//         this._applyResize();
//         this.pos = { ...this.pos };
//     },
//     _resize() {
//         this._setTransform();
//     },
//     track(e, d) {
//         d ??= e.detail;
//         if (!this.float) return;
//         switch (d.state) {
//             case 'start': {
//                 if (!this.style.cursor && this.__allowMove)
//                     this.style.cursor = `move`;
//             } break;
//             case 'track': {
//                 const x = d.ddx || 0;
//                 const y = d.ddy || 0;
//                 if (this.style.cursor === 'move') {
//                     this.pos = {
//                         l: this.pos.l + x,
//                         t: this.pos.t + y,
//                         r: this.pos.r - x,
//                         b: this.pos.b - y
//                     };
//                     this._applyMove();
//                 }
//                 else if (this.style.cursor.endsWith('resize')) {
//                     const directions = this.style.cursor.split('-')[0];
//                     for (const dir of directions) {
//                         switch (dir) {
//                             case 'w': this.pos.l += x; break;
//                             case 'n': this.pos.t += y; break;
//                             case 'e': this.pos.r -= x; break;
//                             case 's': this.pos.b -= y; break;
//                         }
//                     }
//                     this._applyResize();
//                 }
//             } break;
//             case 'end': {
//                 this.style.cursor = '';
//                 this.pos = { ...this.drawPos };
//             } break;
//         }
//     },
// })