import '../form-layout/form-layout.js';
import '../splitter/splitter.js';
const DEFAULT_DRAWER_WIDTH = 300;
ODA({is: 'oda-app-layout', imports: '@oda/form-layout, @oda/splitter, @tools/touch-router', extends: 'oda-form-layout, oda-touch-router', template: /*html*/`
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
        ::slotted(*){
            @apply --flex;
        }
        .title{
            transition: margin-top 0.3s ease-in-out;
            align-items: center;
        }
        .main-container{
            @apply --flex;
            @apply --horizontal;
            overflow: hidden;
        }
        :host oda-pin-button{
            position: absolute;
            right: 0;
            top: 0;
        }
    </style>
    <div ref="appHeader" class="top title">
        <slot name="title" class="horizontal"></slot>
        <slot name="header" class="horizontal no-flex"></slot>
    </div>
    <div class="main-container content" ~class="{'stop-pointer-events': size === 'min'}" ~style="{'zoom': size === 'min' ? '50%' : ''}">
        <div class="main vertical flex shadow"   @wheel="_scroll"  style="order:1" ~style="{filter: (allowCompact && compact && opened)?'brightness(.5)':'none', pointerEvents: (allowCompact && compact && opened)?'none':'auto'}">
            <slot name="top" class="vertical no-flex"></slot>
            <slot name="main" class="vertical flex" style="overflow: hidden; z-index: 0"></slot>
            <slot name="bottom" class="vertical no-flex" style="overflow: visible;"></slot>
        </div>

        <app-layout-drawer pos="left" :show-title="leftTitle" :buttons="leftButtons" ::width="leftWidth" style="order:0" ::hide-tabs="leftHidden" ~show="!allowCompact || !compact || !r_opened">
            <slot name="left-header" class="flex" slot="panel-header"></slot>
            <slot name="left-panel"></slot>
        </app-layout-drawer>
        <app-layout-drawer pos="right" :show-title="rightTitle" :buttons="rightButtons" ::width="rightWidth"  style="order:2" ::hide-tabs="rightHidden" ~show="!allowCompact || !compact || !l_opened">
            <slot name="right-header" slot="panel-header"></slot>
            <slot name="right-panel"></slot>
        </app-layout-drawer>
    </div>
    <slot name="footer" class="horizontal no-flex"></slot>`,
    leftButtons: [],
    rightButtons:[],
    get left(){
        return this.$$('app-layout-drawer')[0] || undefined
    },
    get right(){
        return this.$$('app-layout-drawer')[1] || undefined
    },
    props: {
        allowPin: false,
        leftTitle: false,
        rightTitle: false,
        leftHidden: false,
        rightHidden: false,
        max: {
            type: Number,
            get() {
                return ~~(window.innerWidth * 0.938);
            }
        },
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
            save: true,
            set(n){
                if (this.offsetWidth && n > this.offsetWidth *.8){
                    this.leftWidth =  this.offsetWidth *.8;
                }
                else if (n<100)
                    this.leftWidth =  100;
            }
        },
        rightWidth: {
            type: Number,
            default: 300,
            save: true,
            set(n){
                if (this.offsetWidth && n > this.offsetWidth *.8){
                    this.rightWidth =  this.offsetWidth *.8;
                }
                else if (n<100)
                    this.rightWidth =  100;
            }
        },
        compact: false,
        allowCompact: true,
        autoCompact: true,
        pin: {
            save: true,
            set (v) {
                this.autoCompact = !v;
                this.compact = v;
            },
            get () {
                return !this.autoCompact && this.compact;
            },
        }
    },
    // ready(){
    //     this.listen('app-layout-swipe', 'swipeX', {target: window});
    // },
    get l_opened(){
        return this.$$('app-layout-drawer')[0].opened || undefined;
    },
    get r_opened(){
        return this.$$('app-layout-drawer')[1].opened || undefined;
    },
    get opened(){
        return this.$$('app-layout-drawer').some(i=>i.opened) || undefined;
    },
    attached() {
        this.async(() => { //todo: найти решение без async, выполнять после загрузки настроек

        }, 300);
    },
    updateCompact() {
        if(!this.autoCompact) return;
        this.compact = this.offsetWidth < this.offsetHeight;
    },
    afterLoadSettings(){
                // window.top.odaAppLayoutDrawers = window.top.odaAppLayoutDrawers || {left: new Set(), right: new Set()};
        // window.top.odaAppLayoutDrawers.left.add(this.left);
        // window.top.odaAppLayoutDrawers.right.add(this.right);
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
        // detached() {
    //     const drawers = window.top.odaAppLayoutDrawers;
    //     if (!drawers)
    //         return;
    //     drawers.left.delete(this.left);
    //     drawers.right.delete(this.right);
    //     if (!drawers.left.size)
    //         delete  window.top.odaAppLayoutDrawers;
    // },
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
    listeners:{
        'resize': 'updateCompact',
        down(e){
            if (this.allowCompact && this.compact && this.opened){
                this.close();
            }
        },
    },
    close(){
        this.$$('app-layout-drawer').forEach(i=>i.close());
    },
            // swipeX(e){
    //     e = e.detail?.sourceEvent || e;
    //     if (e.changedTouches[0].clientX<150){
    //         if (this.leftHidden){
    //             this.leftHidden = false;
    //             return;
    //         }
    //         else if (!this.l_opened){
    //             this.left.focused = this.left.last;
    //         }
    //     }
    //     if (e.changedTouches[0].screenX+150>this.offsetWidth){
    //         if (this.rightHidden){
    //             this.rightHidden = false;
    //             return;
    //         }
    //         else if (!this.r_opened){
    //             this.right.focused = this.right.last;
    //         }
    //     }

    //     if (window.parent === window)
    //         return;
    //     window.parent.dispatchEvent(new CustomEvent('app-layout-swipe', {detail:{sourceEvent: e}}))
    // },
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
                startSide = this.l_opened ? 'left' : this.r_opened ? 'right': '';
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

ODA({
    is: 'app-layout-toolbar', template: /*html*/`
    <style>
        :host{
            @apply --no-flex;
            @apply --horizontal;
            border-bottom: 1px solid silver;
            align-items: center;
        }
        ::slotted(.raised){
             @apply --raised;
        }
        .raised{
            @apply --raised;
        }
    </style>
    <slot :name="pref+'-left'" class="horizontal no-flex" style="justify-content: flex-start;"></slot>
    <slot :name="pref+'-center'" class="horizontal flex" style="justify-content: center;"></slot>
    <slot :name="pref+'-right'" class="horizontal no-flex" style="justify-content: flex-end; flex-shrink: 0;"></slot>`,
    props: {
        iconSize: {
            default: 24,
            shared: true
        },
        pref(){
            return this.getAttribute('slot') || ''
        }
    }
});

ODA({is: 'app-layout-drawer', template: /*html*/`
    <style>
        :host {
            @apply --no-flex;
            @apply --content;
            position: relative;
            transition: transform 0.2s;
            @apply --horizontal;
            transition: opacity 0.3s;
            flex-direction: row{{pos === 'right'?'-reverse':''}};
        }
        .drawer{
            height: 100%;
            position: relative;
            overflow: hidden;
        }
        .buttons{
            /*@apply --header; */
            z-index: 1;
            @apply --vertical;
            justify-content: space-around;
            background: linear-gradient({{pos === 'left'?90:270}}deg, var(--header-background), var(--content-background), var(--content-background));
        }
        slotted(:not([focused])){
            display: none;
        }
        :host([hidden]){ /* todo: должно работать от глобального стиля */
            display: none !important;
        }
        .bt{
            transition: margin ease-in-out .1s;
        }
        :host([hide-tabs]) .bt{
            transition: margin ease-in-out .5s !important;
            margin-left: {{(pos === 'left')?-delta:1}}px !important;
            margin-right: {{(pos === 'left')?1:-delta}}px !important;
        }
        :host([hide-tabs]){
            transition: opacity ease-in-out .5s !important;
        }
        :host([hide-tabs]):hover{
            opacity: 1 !important;
        }
        .bt>oda-button{
            border-radius: 15%;
        }
        .pin{
            transform: scale(.5);
            border: 1px solid transparent;
            position: absolute;
            @apply --content;
            opacity: .5;
            height: 194px;
            border-radius: 8px;
            margin-left: {{(pos === 'left')?(8 * (hideTabs?-1:1)):0}}px;
            margin-right: {{(pos === 'right')?(8 * (hideTabs?-1:1)):0}}px;
            padding: 0px !important;
            cursor: pointer;
        }
        .pin:hover{
            @apply --content;
            @apply --invert;
        }
        .hider>*{
            opacity: 0;
            cursor: pointer;
            transition: opacity ease-in-out .3s;
        }
        .hider:hover>*{
            opacity: .5;
        }
    </style>

    <div @touchmove="hideTabs=false"  @down.stop="hideTabs=!hideTabs" ref="panel" class="raised buttons no-flex" ~if="!hidden" style="overflow: visible; z-index:1" ~style="{alignItems: pos ==='left'?'flex-start':'flex-end', maxWidth: hideTabs?'1px':'auto'}">
        <div class="vertical bt" style="height: 100%;">
            <oda-button  style="padding: 4px; margin: 2px" :icon-size="iconSize*1.2" class="tab" default="icons:help" ~for="controls" :rotate="-sign*90" ~style="{transform: \`rotate(\${sign*90}deg)\`}" @down.stop="setFocus(item)" :title="item?.getAttribute('bar-title') || item?.title || item?.getAttribute('title')" :icon="item?.getAttribute('bar-icon') || item?.icon || item?.getAttribute('icon') || 'icons:menu'"  :sub-icon="item?.getAttribute('sub-icon')" :toggled="focused === item"></oda-button>
            <div @down.stop="hideTabs = true" class="flex hider vertical" style="justify-content: center; margin: 8px 0px; align-items: center;" ></div>
            <oda-button  style="padding: 4px; margin: 2px" :icon-size="iconSize*1.2" ~for="buttons"  @down.stop="execTap($event, item)" ~props="item" :item="item" :focused="item.focused" default="icons:help"></oda-button>
        </div>
        <oda-icon class="border pin no-flex" :icon="pos ==='left'?'icons:chevron-right':'icons:chevron-left'" :rotate="hideTabs?0:180" :icon-size="iconSize" ~style="{filter: hideTabs ? 'invert(1)' : ''}"></oda-icon>
    </div>
    <div @touchmove="swipePanel" @touchstart="swipePanel" @touchend="swipeEnd" @tap.stop class="horizontal content drawer no-flex"
        ~style="{flexDirection: \`row\${pos === 'right'?'-reverse':''}\`,
                maxWidth: allowCompact && compact?'70vw':(width + 'px'),
                minWidth: width + 'px',
                display: (hideTabs || !focused) ? 'none' : '',
                position: allowCompact && compact?'absolute':'relative',
                left: (allowCompact && compact && pos === 'left'?($refs.panel?.offsetWidth||0)+'px':''),
                right: (allowCompact && compact && pos === 'right'?($refs.panel?.offsetWidth||0)+'px':''),
                transform: \`translateX(\${-sign*swipe}px)\`}">

        <div class="flex vertical" style="overflow: hidden;">
            <slot name="panel-header" class="no-flex"></slot>
            <div ~if="showTitle || focused?.title" class="horizontal shadow" ~style="{flexDirection: \`row\${pos === 'right'?'-reverse':''}\`}" style="background-color: black; color: white; fill: white; align-items: center;font-size: 80%">
                <div ~if="focused?.title" style="padding: 0 8px; align-self: center; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;" class="flex" >{{focused?.title}}</div>
                <oda-button ~if="allowPin && domHost.offsetWidth > domHost.offsetHeight" :icon="pin ? 'icons:pin' : 'icons:pin-fill:315'" @tap="pin = !pin" :icon-size="iconSize*0.66"></oda-button>
                <oda-button :icon-size="iconSize*0.66" icon="icons:chevron-right:180" @tap="focused = null"></oda-button>
            </div>
            <slot style="overflow: hidden;" @slotchange="slotchange" class="flex vertical"></slot>
        </div>
        <oda-splitter :sign="pos==='left'?-1:1" :max="allowCompact && compact?max:0" ~if="!hideResize" ::width></oda-splitter>
    </div>
    `,
    buttons: [],
    delta: 0,
    swipe: 0,
    props: {
        hideTabs:{
            default: false,
            reflectToAttribute: true,
        },
        pos: {
            default: 'left',
            enum: ['left', 'right']
        },
        showTitle: false,
        hideResize: false,
        width: {
            type: Number,
            set(n) {
                if (this.max && n > this.max) {
                    this.width = this.max;
                }
            },
        },
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
                    this.last = n;
                    // this.reduceSomeDrawers();
                }
                for (let i of (this.controls || [])) {
                    i.$sleep = i.hidden = i !== n;
                }
                this.async(()=>{
                    n?.dispatchEvent(new CustomEvent('activate'));
                })
            }
        }
    },
    get sign(){
        return this.pos === "left"?1:-1;
    },
    get opened(){
        return (!this.hideTabs && this.$$('oda-button.tab').some(i=>i.toggled)) || undefined;
    },
    execTap(e, item) {
        switch (e.detail.sourceEvent.button) {
            case 0: item?.tap?.(e); break;
            case 1:
            default: item?.contextMenu?.(e); break;
        }
    },
    close(){
        this.focused = null;
    },
    setFocus(item) {
        this.hideTabs = false;
        if (item.isButton) {
            item.fire('click');
        }
        else {
            this.focused = ((this.focused === item) ? null : item)
        }
    },
    slotchange(e) {
        if (e.target.domHost === this) return;
        // this.domHost.style.setProperty('opacity', 0);
        this.controls = e.target.assignedNodes();
        this.hidden = this.controls.length === 0;
        if (this.focused && !this.controls.some(c => c === this.focused))
            this.focused = undefined; // т.к. e.target.assignedNodes() возвращает новые узлы
        this.controls.forEach(el => {
            el.$sleep = el.hidden = true;
            if(el.hasAttribute?.('bar-autofocus')  || el.hasAttribute?.('bar-opened')|| el.hasAttribute?.('opened')){
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
    listeners:{
        resize(e) {
            this.delta = this.$refs.panel?.firstElementChild?.offsetWidth || 0;
        },
        down(e){
            e.stopPropagation();
        }
    },
    swipePanel(e){
        if(this.__sw){
            this.swipe += this.sign>0?(this.__sw.touches[0].screenX - e.touches[0].screenX):(e.touches[0].screenX - this.__sw.touches[0].screenX);
            if (this.swipe<0)
                this.swipe = 0;
            else
                e.$executed = true;
        }
        this.__sw = e;
    },
    swipeEnd(e){
        delete this.__sw;
        if (Math.abs(this.swipe)>e.target.offsetWidth/2)
            this.focused = null;
        this.swipe = 0;
    },
});