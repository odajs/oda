import '../form-layout/form-layout.js';
import '../splitter/splitter.js';
// const DEFAULT_DRAWER_WIDTH = 300;
ODA({is: 'oda-app-layout', imports: '@oda/form-layout, @oda/splitter, @tools/touch-router', extends: 'oda-form-layout, oda-touch-router',
    template: /*html*/`
    <style>
        .main {
            transition: margin, filter 0.2s;
            @apply --content;
            overflow: hidden;
            justify-content: space-around;
        }
        slot {
           min-width: 0px;
           overflow: hidden;
        }
        .stop-pointer-events * {
            pointer-events: none;
        }
        ::slotted(*) {
            @apply --flex;
        }
        .title {
            transition: margin-top 0.3s ease-in-out;
            align-items: center;
        }
        .main-container {
            @apply --flex;
            @apply --horizontal;
            overflow: hidden;
        }
        :host oda-pin-button {
            position: absolute;
            right: 0;
            top: 0;
        }
        ::slotted(*) {
            @apply --flex;
        }
    </style>
    <div ref="appHeader" class="top title">
        <slot name="title" class="horizontal"></slot>
        <slot name="header" class="vertical no-flex"></slot>
    </div>
    <div class="main-container content flex" ~class="{'stop-pointer-events': size === 'min'}" ~style="{zoom: size === 'min' ? '50%' : '100%'}">
        <div class="main vertical flex shadow" @wheel="_scroll"  style="order:1" ~style="{filter: (allowCompact && compact && opened)?'brightness(.5)':'none', pointerEvents: (allowCompact && compact && opened)?'none':'auto'}">
            <slot name="top" class="vertical no-flex"></slot>
            <slot name="main" class="vertical flex" style="overflow: hidden; z-index: 0"></slot>
            <slot name="bottom" class="vertical no-flex" style="overflow: visible;"></slot>
        </div>

        <app-layout-drawer ref="l_panel" pos="left" :show-title="leftTitle" :buttons="leftButtons" ::width="leftWidth" style="order:0" ::hide-tabs="leftHidden" ~show="!allowCompact || !compact || !r_opened" ::pinned="l_pinned">
            <slot name="left-header" class="flex" slot="panel-header"></slot>
            <slot name="left-panel"></slot>
        </app-layout-drawer>
        <app-layout-drawer ref="r_panel" pos="right" :show-title="rightTitle" :buttons="rightButtons" ::width="rightWidth"  style="order:2" ::hide-tabs="rightHidden" ~show="!allowCompact || !compact || !l_opened" ::pinned="r_pinned">
            <slot name="right-header" slot="panel-header"></slot>
            <slot name="right-panel"></slot>
        </app-layout-drawer>
    </div>
    <slot name="footer" class="vertical no-flex" style="overflow: visible;"></slot>
    `,
    leftButtons: [],
    rightButtons: [],
    get left() {
        return this.$refs.l_panel;
    },
    get right() {
        return this.$refs.r_panel;
    },
    props: {
        leftTitle: false,
        rightTitle: false,
        leftHidden: false,
        rightHidden: false,
        hideToolbar: true,
        hideOnScroll: {
            default: false,
            set(n) {
                if (n) {
                    if (!this._hideOnScroll)
                        this.listen('wheel', '_scroll', { target: window, useCapture: true });
                    this._hideOnScroll = true;
                }
            }
        },
        leftWidth: {
            type: Number,
            default: 300,
            save: true
        },
        rightWidth: {
            type: Number,
            default: 300,
            save: true
        },
        compact: false,
        allowCompact: true,
        autoCompact: true,
        l_pinned: {
            type: Boolean,
            save: true,
        },
        r_pinned: {
            type: Boolean,
            save: true,
        }
    },
    get l_opened() {
        return this.left?.opened;
    },
    get r_opened() {
        return this.right?.opened;
    },
    get opened() {
        return this.l_opened || this.r_opened;
    },
    attached() {
        this.listen('mousedown', 'smartClose', { target: window });
    },
    detached() {
        this.unlisten('mousedown', 'smartClose', { target: window });
    },
    updateCompact() {
        if (!this.autoCompact) return;
        this.compact = this.offsetWidth < this.offsetHeight;
    },
    afterLoadSettings() {
        this.updateCompact();
        const me = this.unique && this._getModals().find(i => i.unique === this.unique);
        if (me) {
            me._top();
            this.remove();
            return;
        }
        this._transition?.();
        if (this._getModals().some(el => el.modal)) {
            this.pos.x = this.pos.x + this.iconSize;
            this.pos.y = this.pos.y + this.iconSize;
            this._fixPos();
        }
        this._top();
    },
    _scroll(e) {
        if (e.ctrlKey || e.shiftKey || e.altKey) return
        this.interval('hide-header', () => {
            let h = this.$refs.appHeader;
            let t = e.target;
            if (e.detail && e.detail.value === 'clearScroll') {
                h.style.marginTop = '0';
                return;
            }
            if (t.slot !== 'main') return;
            if (e.wheelDelta >= 0 || e.detail > 0) {
                h.style.marginTop = '0';
            } else {
                h.style.marginTop = `-${h.offsetHeight}px`;
            }
        });
    },
    listeners: {
        'resize': 'updateCompact',
    },
    smartClose() {
        if (this.allowCompact && this.compact && this.opened) {
            this.close();
        } else if (this.allowPin) {
            if (!this.l_pinned) this.left?.close();
            if (!this.r_pinned) this.right?.close();
        }
    },
    close() {
        [this.left, this.right].forEach(i => i?.close?.());
    },
    onTouchMove(e) { //  swipeX
        const EDGE_INDENT = 20;
        const MOVING_THRESHOLD = 60;
        const touch = e.changedTouches[0];
        const router = window.top.$odaTouchRouter;
        if (!router || !router.startEvent)
            return 'finish';
        const startX = router.startEvent.changedTouches[0].screenX;
        if (startX < EDGE_INDENT || startX > window.top.screen.width - EDGE_INDENT)
            return 'finish';
        const shift = touch.screenX - startX;
        if (Math.abs(shift) < MOVING_THRESHOLD)
            return;

        const openPanelContent = target => {
            target.focused = target.last || target.controls[0];
        }
        const l = !this.left.hidden;
        const r = !this.right.hidden;

        if (!router.$startSide) {
            let startSide;
            if (this.allowCompact && this.compact)
                startSide = this.l_opened ? 'left' : this.r_opened ? 'right' : '';
            if (!startSide)
                startSide = startX <= Math.round(window.top.screen.width / 2) ? 'left' : 'right';
            router.$startSide = startSide;
        }
        const startedLeft = router.$startSide === 'left';

        if (!e.$phase) {
            if (startedLeft) {
                if (l) {
                    if (shift < 0) {
                        if (!this.leftHidden) {
                            this.leftHidden = true;
                        }
                    } else {
                        if (this.leftHidden) {
                            this.leftHidden = false;
                            // this.left.reduceSomeDrawers();
                        } else if (!this.l_opened) {
                            openPanelContent(this.left);
                        }
                    }
                }
            } else {
                if (r) {
                    if (shift < 0) {
                        if (this.rightHidden) {
                            this.rightHidden = false;
                            // this.right.reduceSomeDrawers();
                        } else if (!this.rightHidden && !this.r_opened) {
                            openPanelContent(this.right);
                        }
                    } else if (!this.rightHidden) {
                        this.rightHidden = true;
                    }
                }
            }
            return 'restart';
        } else if (e.$phase === 'capturing') {
            if (startedLeft) {
                if (l) {
                    if (shift < 0) {
                        if (!this.leftHidden) {
                            this.leftHidden = true;
                            return 'restart';
                        }
                    } else if (window === e.view) {
                        if (this.leftHidden) {
                            this.leftHidden = false;
                            // this.left.reduceSomeDrawers();
                            return 'restart';
                        } else if (!this.l_opened) {
                            openPanelContent(this.left);
                            return 'restart';
                        }
                    }
                }
            } else {
                if (r) {
                    if (shift < 0) {
                        if (window === e.view) {
                            if (this.rightHidden) {
                                this.rightHidden = false;
                                // this.right.reduceSomeDrawers();
                                return 'restart';
                            } else if (!this.r_opened) {
                                openPanelContent(this.right);
                                return 'restart';
                            }
                        }
                    } else if (!this.rightHidden) {
                        this.rightHidden = true;
                        return 'restart';
                    }
                }
            }
        } else if (e.$phase === 'bubbling') {
            if (startedLeft) {
                if (l) {
                    if (shift > 0) {
                        if (this.leftHidden) {
                            this.leftHidden = false;
                            // this.left.reduceSomeDrawers();
                            return 'restart';
                        } else if (!this.l_opened) {
                            openPanelContent(this.left);
                            return 'restart';
                        }
                    }
                }
            } else {
                if (r) {
                    if (shift < 0) {
                        if (this.rightHidden) {
                            this.rightHidden = false;
                            // this.right.reduceSomeDrawers();
                            return 'restart';
                        } else if (!this.r_opened) {
                            openPanelContent(this.right);
                            return 'restart';
                        }
                    }
                }
            }
        }

        delete router.$startSide;
        return 'pass';
    }
});

ODA({is: 'app-layout-toolbar',
    template: /*html*/`
    <style>
        :host {
            @apply --no-flex;
            @apply --horizontal;
            border-bottom: 1px solid silver;
            align-items: center;
        }
        ::slotted(.raised) {
             @apply --raised;
        }
        .raised {
            @apply --raised;
        }
    </style>
    <slot name="left" class="horizontal no-flex" style="justify-content: flex-start;"></slot>
    <slot name="center" class="horizontal flex" style="justify-content: center;"></slot>
    <slot name="right" class="horizontal no-flex" style="justify-content: flex-end; flex-shrink: 0;"></slot>`,
    props: {
        iconSize: {
            default: 24,
            shared: true
        },
    }
});

ODA({is: 'app-layout-drawer',
    template: /*html*/`
    <style>
        :host {
            @apply --no-flex;
            @apply --content;
            position: relative;
            @apply --horizontal;
            transition: opacity ease-in-out .5s, transform ease-in-out .2s;
            flex-direction: row{{pos === 'right'?'-reverse':''}};
        }
        .drawer {
            height: 100%;
            position: relative;
            overflow: hidden;
            min-width: 270px;
            max-width: 80vw;
        }
        .buttons {
            /*@apply --header; */
            z-index: 1;
            @apply --vertical;
            justify-content: space-around;
            background: linear-gradient({{ ({left: 90, right: 270})[pos]}}deg, var(--header-background), var(--content-background), var(--content-background));
        }
        slotted(:not([focused])) {
            display: none;
        }
        :host([hidden]) { /* todo: должно работать от глобального стиля */
            display: none !important;
        }
        .bt {
            transition: margin ease-in-out .2s;
        }
        :host([hide-tabs]) .bt {
            transition: margin ease-in-out .2s !important;
            margin-left: {{(pos === 'left')?-delta:1}}px !important;
            margin-right: {{(pos === 'left')?1:-delta}}px !important;
        }
        :host([hide-tabs]) {
            transition: opacity ease-in-out .5s !important;
        }
        :host([hide-tabs]):hover {
            opacity: 1 !important;
        }
        .bt > oda-button {
            border-radius: {{iconSize/4}}px;
        }
        .pin {
            transform: scale(.5);
            border: 1px solid transparent;
            position: absolute;
            @apply --content;
            opacity: .5;
            height: 194px;
            border-radius: 8px !important;
            margin-left: {{(pos === 'left')?(8 * (hideTabs?-1:1)):0}}px;
            margin-right: {{(pos === 'right')?(8 * (hideTabs?-1:1)):0}}px;
            padding: 0px !important;
            cursor: pointer;
        }
        .pin:hover {
            @apply --content;
            @apply --invert;
        }
        :host([hide-tabs]) .hider{
            position: absolute;
            {{pos}}: {{iconSize/2}}px;
            bottom: 50%;
        }
        .hider > * {
            opacity: .1;
            cursor: pointer;
            transition: opacity ease-in-out .3s;
        }
        .hider:hover > * {
            opacity: .5;
        }
        .outline {
            outline: gray dashed 1px;
            outline-offset: -2px;
        }
        [toggled]{
            @apply --success;
            border-color: var(--header-background, black);
        }

    </style>
    <div @touchmove="hideTabs=false" ref="panel" class="raised buttons no-flex" ~if="!hidden" style="overflow: visible; z-index:1" ~style="{alignItems: pos ==='left'?'flex-start':'flex-end', maxWidth: hideTabs?'1px':'auto'}">
        <div class="vertical bt" style="height: 100%;">
            <div class="no-flex vertical">
                <oda-button :rotate="(ctrl?.label || ctrl.getAttribute('label'))?90:0" :label="ctrl?.label || ctrl?.getAttribute?.('label')" style="padding: 4px; writing-mode: tb; border: 1px dotted transparent;" :icon-size="iconSize*1.2" class="no-flex tab" default="icons:help" :item="ctrl" ~style="getStyle(ctrl)" ~for="ctrl in controls" @down.stop="setFocus(ctrl)" :title="ctrl?.getAttribute('bar-title') || ctrl?.title || ctrl?.getAttribute('title') || ''" :icon="ctrl?.getAttribute('bar-icon') || ctrl?.icon || ctrl?.getAttribute('icon') || 'icons:menu'"  :sub-icon="ctrl?.getAttribute('sub-icon')" :toggled="focused === ctrl" :bubble="ctrl.bubble" ~class="{outline: lastFocused === ctrl}"></oda-button>
            </div>
            <div class="flex hider vertical" style="justify-content: center; margin: 8px 0px; align-items: center;" >
                <oda-icon @down.stop="hideTabs=!hideTabs" class="border pin no-flex" :icon="({left: 'icons:chevron-right', right: 'icons:chevron-left'})[pos]" :rotate="hideTabs?0:180" :icon-size="iconSize" ~style="{filter: hideTabs ? 'invert(1)' : ''}"></oda-icon>
            </div>
            <oda-button style="padding: 4px; margin: 2px; border: 1px dotted transparent;" :icon-size="iconSize*1.2" ~for="buttons" @down.stop="execTap($event, item)" ~props="item" :item="item" :focused="item.focused" default="icons:help"></oda-button>
        </div>

    </div>
    <div @touchmove="swipePanel" @touchstart="swipePanel" @touchend="swipeEnd" @tap.stop class="horizontal content drawer no-flex"
        ~style="_styles">

        <div class="flex vertical" style="overflow: hidden;">
            <slot name="panel-header" class="no-flex"></slot>
            <div ~if="showTitle || focused?.title" invert class="horizontal shadow" ~style="{flexDirection: \`row\${pos === 'right'?'-reverse':''}\`}" style="align-items: center; padding: 1px; background-color: var(--content-background);" @tap.stop>
                <div ~if="focused?.title || allowPin" style="line-height: 2em; padding: 0 8px; align-self: center; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;" class="flex">{{focused?.title}}</div>
                <oda-button ~if="allowPin &&  domHost.offsetWidth > domHost.offsetHeight" :icon="pinned ? 'icons:pin-fill:315' : 'icons:pin'" @mousedown.stop="pinned = !pinned" :icon-size style="transform: scale(.5)"></oda-button>
<!--                <oda-button :icon-size="iconSize*0.66" :icon="\`icons:chevron-right:\${pos === 'left' ? 180 : 0}\`" @tap.stop="focused = null"></oda-button>-->
            </div>
            <slot style="overflow: hidden;" @slotchange="slotchange" class="flex vertical"></slot>
        </div>
        <oda-splitter :sign="({left: -1, right: 1})[pos]" ~if="!hideResize" ::width></oda-splitter>
    </div>
    `,
    getStyle(ctrl){
        const label = ctrl?.label || ctrl.getAttribute('label');
        const order = ctrl?.order || ctrl.getAttribute('order') || 0;
        const res = {order}
        if (label)
            res.transform = `rotate(180deg)`;
        return res;
    },
    buttons: [],
    delta: 0,
    swipe: 0,
    allowPin: false,
    props: {
        pinned: {
            default: false,
            set(n) {
                if (!n) {
                    this.close();
                }
            }
        },
        hideTabs: {
            default: false,
            reflectToAttribute: true,
        },
        pos: {
            default: 'left',
            enum: ['left', 'right']
        },
        showTitle: false,
        hideResize: false,
        width: Number,
        hidden: {
            get() {
                return !this.controls?.length
            },
            default: true,
            reflectToAttribute: true
        },
        controls: Array,
        focused: {
            default: null,
            set(n, o) {
                if (n) {
                    // this.last = n; // swipeX
                    // this.reduceSomeDrawers();
                    this.lastFocused = null;
                    n.hidden = false;
                } else {
                    this.lastFocused = o;
                }
                for (let i of (this.controls || [])) {
                    i.$sleep = i.hidden = i !== n;
                }
                this.async(() => {
                    this.focused?.dispatchEvent(new CustomEvent('activate'));
                });
            }
        },
        lastFocused: null
    },
    attached() {
        this.listen('keydown', '_onKeyDown', { target: document });
    },
    detached() {
        this.unlisten('keydown', '_onKeyDown', { target: document });
    },
    get _styles() {
        const cpt = this.allowCompact && this.compact;
        const panelW = `${this.$refs.panel?.offsetWidth || 0}px`;
        return {
            flexDirection: `row${({ right: '-reverse', left: '' })[this.pos]}`,
            // maxWidth: cpt ? '70vw' : `${this.width||0}px`,
            // minWidth: `${this.width||0}px`,
            width: `${this.width||0}px`,
            display: (this.hideTabs || !this.focused) ? 'none' : '',
            position: cpt ? 'absolute' : 'relative',
            left:  cpt && this.pos === 'left' ? panelW : 'unset',
            right: cpt && this.pos === 'right' ? panelW : 'unset',
            transform: `translateX(${-this.sign*this.swipe}px)`
        };
        /* {flexDirection: \`row\${pos === 'right'?'-reverse':''}\`,
                maxWidth: allowCompact && compact?'70vw':(width + 'px'),
                minWidth: width + 'px',
                display: (hideTabs || !focused) ? 'none' : '',
                position: allowCompact && compact?'absolute':'relative',
                left: (allowCompact && compact && pos === 'left'?($refs.panel?.offsetWidth||0)+'px':'') || 'unset',
                right: (allowCompact && compact && pos === 'right'?($refs.panel?.offsetWidth||0)+'px':'') || 'unset',
                transform: \`translateX(\${-sign*swipe}px)\`} */
    },
    get sign() {
        return this.pos === "left" ? 1 : -1;
    },
    get opened() {
        return (!this.hideTabs && this.$$('oda-button.tab').some(i => i.toggled)) || undefined;
    },
    execTap(e, item) {
        switch (e.detail.sourceEvent.button) {
            case 0: item?.tap?.(e); break;
            case 1:
            default: item?.contextMenu?.(e); break;
        }
    },
    close() {
        this.focused = null;
    },
    setFocus(item) {
        this.hideTabs = false;
        if (item.isButton) {
            item.click();
        }
        else {
            this.focused = ((this.focused === item) ? null : item)
        }
    },
    slotchange(e) {
        if (e.target.domHost === this) return;
        // this.domHost.style.setProperty('opacity', 0);
        this.controls = e.target.assignedNodes();
        this.controls.forEach(c => {
            if (c.hasAttribute('close-event')) {
                this.allowPin = true;
                const type = c.getAttribute('close-event');
                this.listen(type, () => {
                    if (this.focused === c && !this.pinned) this.close();
                }, { target: c });
            }
        });
        this.hidden = this.controls.length === 0;
        if (this.focused && !this.controls.some(c => c === this.focused))
            this.focused = undefined; // т.к. e.target.assignedNodes() возвращает новые узлы
        this.controls.forEach(el => {
            el.$sleep = el.hidden = true;
            if (this.focused === el || el.hasAttribute?.('bar-autofocus') || el.hasAttribute?.('bar-opened') || el.hasAttribute?.('opened')) {
                this.focused = this.focused || el;
                if (el === this.focused)
                    el.$sleep = el.hidden = false;
            }
        });
        this.delta = this.$refs.panel?.firstElementChild?.offsetWidth || 0;
        // this.interval('opasity', ()=>{
        //     this.domHost.style.setProperty('opacity', 1);
        // })

    },
    listeners: {
        resize(e) {
            this.delta = this.$refs.panel?.firstElementChild?.offsetWidth || 0;
        },
        down(e) {
            e.stopPropagation();
        }
    },
    swipePanel(e) {
        if (this.__sw) {
            this.swipe += this.sign > 0 ? (this.__sw.touches[0].screenX - e.touches[0].screenX) : (e.touches[0].screenX - this.__sw.touches[0].screenX);
            if (this.swipe < 0)
                this.swipe = 0;
            else
                e.$executed = true;
        }
        this.__sw = e;
    },
    swipeEnd(e) {
        delete this.__sw;
        if (Math.abs(this.swipe) > e.target.offsetWidth / 2)
            this.focused = null;
        this.swipe = 0;
    },
    observers: [
        'opening(pinned, controls, controls?.length)'
    ],
    opening(pinned, controls, length) {
        if (pinned && !this.opened && !this.focused && length) {
            this.setFocus(controls[0]);
        }
    },
    _onKeyDown(e) {
        if (this.controls && e.ctrlKey && '123456789'.includes(e.key)) {
            e.preventDefault();
            e.stopPropagation();
            const idx = parseInt(e.key) - 1;
            if(e.altKey){
                if (idx < this.buttons.sort((a, b) => parseInt(a.order || 0) < parseInt(b.order || 0) ? -1 : 1).length) {
                    this.buttons[idx]?.tap()
                }
            }else{
                if (idx < this.controls.sort((a, b) => parseInt(a.getAttribute('order') || 0) < parseInt(b.getAttribute('order') || 0) ? -1 : 1).length) {
                    this.setFocus(this.controls[idx])
                }
            }
        }
    }
});