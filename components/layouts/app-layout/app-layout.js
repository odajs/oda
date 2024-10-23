class PanelProps extends ROCKS({
    drawer: Object,
    $saveKey: '',
    $public: {
        layout: { localName: 'layout' },
        pos: 'left',
        showTitle: false,
        showPin: true,
        buttons: [],
        hideTabs: false,
        opened: null,
        width: {
            $def: 300,
            $save: true
        },
        pinned: {
            $def: false,
            $save: true
        },
    },
    get $savePath() {
        return `${this.layout.localName}/${this.constructor.name}/${this.pos}Panel`;
    }
}) {
    constructor(init) {
        super();
        Object.assign(this, init);
    }
    //??? реализовать миксин odaSavable
    $loadPropValue(key) {
        this[CORE_KEY].loaded ??= {};
        this[CORE_KEY].loaded[key] = true;
        const value = ODA.LocalStorage.create(this.$savePath).getItem(key);
        if (value && typeof value === 'object') {
            if (Array.isArray(value)) {
                return Array.from(value);
            }
            return { ...value };
        }
        return value;
    }
    $savePropValue(key, value) {
        if (!this[CORE_KEY].loaded?.[key]) return;
        ODA.LocalStorage.create(this.$savePath).setItem(key, value);
    }
    $resetSettings() {
        ODA.LocalStorage.create(this.$savePath).clear();
    }
}
ODA({is: 'oda-app-layout', imports: '@oda/form-layout, @oda/splitter', extends: 'oda-form-layout',
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
        :host app-layout-drawer[pos="right"]{
            order: 2;
        }
    </style>
    <div ~show="!isMinimized" id="appHeader" class="pe-no-print top title">
<!--        <slot name="title" class="horizontal"></slot>-->
        <slot name="header" class="vertical"></slot>
    </div>
    <div
        ~show="!isMinimized"
        class="main-container header flex"
        ~class="{'stop-pointer-events': sizeMode === 'min'}"
        ~style="{zoom: sizeMode === 'min' ? '50%' : '100%'}"
    >
        <div
            class="main vertical flex shadow"
            @wheel="_scroll"
            style="order:1"
            ~style="{filter: (allowCompact && compact && opened)?'brightness(.5)':'none', pointerEvents: (allowCompact && compact && opened)?'none':'auto'}"
        >
            <slot name="top" class="pe-no-print vertical no-flex"></slot>
            <slot name="main" class="vertical flex" style="overflow: hidden; z-index: 0"></slot>
            <slot name="bottom" class="pe-no-print vertical no-flex" style="overflow: visible;"></slot>
        </div>
        <app-layout-drawer
            class="pe-no-print"
            ~for="panels"
            :id="$for.item.pos + '-drawer'"
            :pos="$for.item.pos"
            :show-title="$for.item.showTitle"
            :show-pin="$for.item.showPin"
            :buttons="$for.item.buttons"
            ::width="$for.item.width"
            ::hide-tabs="$for.item.hideTabs"
            ::opened="$for.item.opened"
            ::pinned="$for.item.pinned"
        >
            <slot :name="$for.item.pos + '-header'" class="flex" slot="pe-no-print panel-header"></slot>
            <slot :name="$for.item.pos + '-panel'" class="pe-no-print"></slot>
        </app-layout-drawer>
    </div>
    <slot ~show="!isMinimized" name="footer" class="pe-no-print vertical no-flex" style="overflow: visible;"></slot>
    `,
    leftButtons: [],
    rightButtons: [],
    $public: {
        $pdp: true,
        get layoutHost() {
            return this;
        },
        panels: {
            $def() {
                return [
                    new PanelProps({
                        layout: this,
                        pos: 'left',
                    }),
                    new PanelProps({
                        layout: this,
                        pos: 'right',
                    })
                ];
            },
        },
        compact: false,
        compactThreshold: 500,
        allowCompact: true,
        autoCompact: true,
        opened: {
            $type: Boolean,
            get() {
                return this.panels.some(p => p.opened);
            }
        },
    },
    get appHeader() {
        return this.$('#appHeader');
    },
    get leftPanelElement() {
        return this.$('app-layout-drawer[pos=left]') || undefined;
    },
    get rightPanelElement() {
        return this.$('app-layout-drawer[pos=right]') || undefined;
    },
    $observers: {
        buttonsChanged(leftButtons, rightButtons) {
            this.panels[0].buttons = this.leftButtons;
            this.panels[1].buttons = this.rightButtons;
        }
    },
    $listeners: {
        'resize': 'updateCompact',
    },
    attached() {
        this.$super('oda-form-layout', 'attached');
    },
    updateCompact() {
        if (!this.autoCompact) return;
        this.compact = this.offsetWidth < this.compactThreshold;
    },
    _scroll(e) {
        if (!this.hideHeader || e.ctrlKey || e.shiftKey || e.altKey) return;
        this.throttle('hide-header', () => {
            const h = this.appHeader;
            const t = e.target;
            if (e.detail && e.detail.value === 'clearScroll') {
                h.style.marginTop = '0';
                return;
            }
            if (t.slot !== 'main') return;
            h.style.marginTop = e.wheelDelta >= 0 || e.detail > 0
                ? '0'
                : `-${h.offsetHeight}px`;
        });
    },
    closeDrawers() {
        [this.leftPanelElement, this.rightPanelElement].forEach(i => i?.close?.());
    }
});

ODA({is: 'app-layout-toolbar',
    template: /*html*/`
    <style>
        :host {
            @apply --no-flex;
            @apply --horizontal;
            /*@apply --shadow;*/
            align-items: center;
        }
        ::slotted(.raised) {
             @apply --raised;
        }
        .raised {
            @apply --raised;
        }
    </style>
    <slot :name="name+'-left'" class="horizontal no-flex" style="justify-content: flex-start; min-width: 1px;"></slot>
    <slot :name="name+'-center'" class="horizontal flex" style="justify-content: center;"></slot>
    <slot :name="name+'-right'" class="horizontal no-flex" style="justify-content: flex-end; flex-shrink: 0;"></slot>`,
    get name(){
        return this.slot;
    }
});

ODA({is: 'app-layout-drawer', imports: '@oda/tabs',
    template: /*html*/`
    <style>
        :host {
            @apply --no-flex;
            @apply --content;

            position: relative;
            @apply --horizontal;
            transition: opacity ease-in-out .5s, transform ease-in-out .2s;
            flex-direction: row{{pos === 'right'?'-reverse':''}};
            border-color: var(--border-color);
        }
        :host([pos="left"]) > #panel{
            border-right: 1px solid;
        }
        :host([pos="right"]) > #panel{
            border-left: 1px solid;
        }
        .drawer {
            height: 100%;
            position: relative;
            overflow: hidden;
            min-width: 150px;
            max-width: 80vw;
            z-index: 1;
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
        :host([hide-tabs]) .bt {
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
            padding: 0px !important;
            cursor: pointer;
        }
        .pin:hover {
            @apply --content;
            @apply --invert;
        }
        :host([hide-tabs]) .hider {
            position: absolute;
            {{pos}}: {{iconSize/3}}px;
            bottom: 50%;
        }
        :host .title-label{
            line-height: 2em;
            padding: 0 8px;
            align-self: center;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
        .hider > * {
            opacity: .2;
            cursor: pointer;
            transition: opacity ease-in-out .3s;
        }
        .hider:hover > * {
            opacity: .5;
        }
        [toggled] {
            @apply --success;
            border-color: var(--header-background, black);
        }
        .scroll-button{
            max-height: 8px;
        }
    </style>
    <div @touchmove="hideTabs=false" id="panel" class="raised buttons no-flex" ~if="!hidden" style="overflow: visible; z-index:1" ~style="{alignItems: pos ==='left'?'flex-start':'flex-end', maxWidth: hideTabs?'1px':'auto'}">
        <div class="vertical bt" style="height: 100%;"
            ~style="{ 'min-width': (controls?.length > 0 || buttons?.length > 0) ? (iconSize + 10) + 'px' : 'none' }">
            <oda-tabs :dimmed="!opened"
                ~show="!hideTabs"
                :content-align="({left: 'right', right: 'left'})[pos]"
                class="flex"
                :items="tabs"
                ::index="focusedIndex"
                @tab-tapped="setOpened(controls[focusedIndex])"
            ></oda-tabs>
            <div ~if="hideTabs"class="flex hider vertical" style="justify-content: center; margin: 8px 0px; align-items: center;filter: invert(1);" >
                <oda-icon @down.stop="hideTabs=false" class="border pin no-flex" :icon="({left: 'icons:chevron-right', right: 'icons:chevron-left'})[pos]" :icon-size></oda-icon>
            </div>
            <oda-button
                ~for="buttons"
                ~is="$for.item.is || 'oda-button'"
                ~show="!hideTabs"
                ~props="$for.item"
                ~text="$for.item.is && $for.item.text"
                style="padding: 4px; margin: 2px; border: 1px dotted transparent;"
                :icon-size
                :item="$for.item"
                :focused="$for.item.focused"
                default="icons:help"
                @down.stop="execTap($event, $for.item)"
            ></oda-button>
        </div>
    </div>
    <div @tap.stop class="horizontal shadow content drawer no-flex"
        ~style="_styles">
        <div class="flex vertical" style="overflow: hidden;">
            <div ~if="showTitle || showPin || openedTitle" invert class="horizontal content shadow" ~style="{flexDirection: \`row\${pos === 'right'?'-reverse':''}\`}" style="align-items: center; padding: 2px" @tap.stop>
                <oda-icon :icon-size ~if="opened?.titleIcon" :icon="opened?.titleIcon"></oda-icon>
                <label ~if="openedTitle || showPin" class="flex title-label" ~text="openedTitle"></label>
                <slot name="panel-header"></slot>
                <oda-button ~if="showPin" :icon="pinned ? 'icons:pin-fill:315' : 'icons:pin'" @mousedown.stop="pinned = !pinned" :icon-size style="transform: scale(.5)"></oda-button>
<!--                <oda-button :icon-size="iconSize*0.66" :icon="\`icons:chevron-right:\${pos === 'left' ? 180 : 0}\`" @tap.stop="opened = null"></oda-button>-->
            </div>
            <slot style="overflow: hidden;" @slotchange="slotchange" class="flex vertical"></slot>
        </div>
        <oda-splitter :sign ~if="!hideResize" ::width @touchstart.stop></oda-splitter>
    </div>
    `,
    get $saveKey() {
        return this.domHost.$savePath + this.pos;
    },
    buttons: [],
    delta: 0,
    showPin: {
        $type: Boolean
    },
    $public: {
        $pdp: true,
        iconSize: 24,
        pinned: {
            $def: false,
            set(n) {
                if (!n) {
                    this.close();
                }
            }
        },
        hideTabs: {
            $def: false,
            $attr: true,
        },
        pos: {
            $def: 'left',
            $list: ['left', 'right'],
            $attr: true
        },
        showTitle: true,
        hideResize: false,
        width: Number,
        hidden: {
            get() {
                return !this.controls?.length;
            },
            $def: true,
            $attr: true
        },
        controls: Array,
        get tabs() {
            if (!this.controls?.length) return;
            return this.controls.map(c => ({
                icon: c.getAttribute('bar-icon') || c.icon || c.getAttribute('icon') || 'icons:menu',
                subIcon: c.getAttribute('sub-icon'),
                label: c.label || c.getAttribute?.('label'),
                title: c.getAttribute('bar-title') || c.title || c.getAttribute('title') || '',
                order: c.order || c.getAttribute('order') || 0,
                $item: c,
            }));
        },
        controlsOverflow: false,
        opened: {
            $def: null,
            set(n, o) {
                if (n) {
                    n.titleIcon = n.getAttribute('title-icon');
                    n.hidden = false;
                }
                for (const i of (this.controls || [])) {
                    i.$sleep = i.hidden = i !== n;
                }
                const idx = this.controls.indexOf(n);
                if (~idx) {
                    this.focusedIndex = idx;
                }
                this.async(() => {
                    this.opened?.dispatchEvent(new CustomEvent('activate'));
                });
            }
        },
        get focused() {
            this.async(() => {
                const btn = this.$('oda-button.accent');
                if (!btn) return;
                if (btn.offsetTop < btn.parentElement.scrollTop || btn.offsetTop > btn.parentElement.scrollTop + btn.parentElement.offsetHeight){
                    btn.scrollIntoView({inline: 'center'});
                }
            }, 300);
            return this.controls?.[this.focusedIndex];
        },
        focusedIndex: {
            $def: 0,
            $save: true,
        },
        openedTitle: {
            $type: String,
            get() {
                return this.opened?.title;
            }
        },
    },
    get panel() {
        return this.$('#panel') || undefined;
    },
    get _styles() {
        const cpt = this.allowCompact && this.compact;
        const panelW = `${this.panel?.offsetWidth || 0}px`;
        return {
            flexDirection: `row${({ right: '-reverse', left: '' })[this.pos]}`,
            maxWidth: cpt ? '70vw' : `${this.width||0}px`,
            // minWidth: `${this.width||0}px`,
            width: `${this.width || 0}px`,
            display: (this.hideTabs || !this.opened) ? 'none' : '',
            position: cpt ? 'absolute' : 'relative',
            left: cpt && this.pos === 'left' ? panelW : 'unset',
            right: cpt && this.pos === 'right' ? panelW : 'unset',
        };
    },
    get sign() {
        return ({ left: -1, right: 1 })[this.pos];//this.pos === "left" ? 1 : -1;
    },
    $observers: {
        opening: 'focusedIndex, pinned, controls'
    },
    $listeners: {
        resize(e) {
            this.delta = this.panel?.firstElementChild?.offsetWidth || 0;
        },
        down(e) {
            e.stopPropagation();
        }
    },
    attached() {
        this.listen('keydown', '_onKeyDown', { target: document });
        if ('ontouchstart' in window) {
            /**@param {TouchEvent} e*/
            const touchStart = (e) => {
                if (e.touches.length > 1) {
                    return;
                }
                const touch = e.touches[0];
                const { screenX: x, screenY: y } = touch;
                const startPos = { x, y };
                const status = { dir: '', dist: 0 };
                let stopID = 0;
                /**@param {TouchEvent} e*/
                const touchMove = (e) => {
                    stopID = setTimeout(() => {
                        touchcancel();
                    }, 1000);
                    const touch = e.changedTouches[0];
                    const { screenX: x, screenY: y } = touch;
                    const curPos = { x, y };
                    const yDist = curPos.y - startPos.y;
                    const xDist = curPos.x - startPos.x;
                    status.dir = xDist > 0 ? 'right' : 'left';
                    status.xDist = Math.abs(xDist);
                    status.yDist = Math.abs(yDist);
                    if (status.yDist > status.xDist && status.yDist > 20) {
                        touchcancel();
                        return;
                    }
                }
                /**@param {TouchEvent} e*/
                const touchEnd = (e) => {
                    if (status.xDist > (this.opened ? 150 : 5) && status.dir === this.pos) {
                        this.hideTabs = true;
                        this.close();
                    }
                    touchcancel();
                };
                const touchcancel = () => {
                    clearTimeout(stopID);
                    stopID = 0;
                    status.dir = '';
                    status.xDist = 0;
                    ODA.top.removeEventListener('touchcancel', touchEnd);
                    ODA.top.removeEventListener('touchend', touchEnd);
                }
                ODA.top.addEventListener('touchmove', touchMove);
                ODA.top.addEventListener('touchcancel', touchEnd);
                ODA.top.addEventListener('touchend', touchEnd);
            };
            this.listen('touchstart', touchStart);
        }
    },
    detached() {
        this.unlisten('keydown', '_onKeyDown', { target: document });
    },
    getStyle(ctrl) {
        const label = ctrl?.label || ctrl.getAttribute('label');
        const res = { };
        res['max-width'] = (this.iconSize + 2) + 'px'; // для firefox
        if (label)
            res.transform = `rotate(180deg)`;
        return res;
    },
    execTap(e, item) {
        switch (e.button) {
            case 0: item?.execute?.(e); break;
            case 1:
            default: item?.contextMenu?.(e); break;
        }
    },
    smartClose() {
        if ((this.compact || !this.pinned) && this.opened) {
            this.close();
        }
    },
    close() {
        this.opened = null;
    },
    setOpened(item) {
        this.hideTabs = false;
        if (item?.isButton) {
            item.click();
        }
        else {
            this.opened = ((this.opened === item) ? null : item);
        }
    },
    slotchange(e) {
        if (e.target.domHost === this) return;
        this.controls = Array.from(e.target.assignedNodes()).sort((a, b) => {
            const a_order = a.order ?? a.getAttribute('order') ?? 0;
            const b_order = b.order ?? b.getAttribute('order') ?? 0;
            return a_order - b_order;
        });
        this.controls.forEach(c => {
            if (c.hasAttribute('close-event')) {
                this.allowPin = true;
                this.listen(c.getAttribute('close-event'), e => this.smartClose(), { target: c });
            }
        });
        this.hidden = this.controls.length === 0;
        // if (this.opened && !this.controls.some(c => c === this.opened))
        //     this.opened = undefined; // т.к. e.target.assignedNodes() возвращает новые узлы
        this.controls.forEach(el => {
            el.$sleep = el.hidden = true;
            if (this.opened === el || el.hasAttribute?.('bar-autofocus') || el.hasAttribute?.('bar-opened') || el.hasAttribute?.('opened')) {
                this.opened = this.opened || el;
                if (el === this.opened)
                    el.$sleep = el.hidden = false;
            }
        });
        this.delta = this.panel?.firstElementChild?.offsetWidth || 0;
        this.debounce('call-openeing', () => {
            this.opened = null;
            this.opening();
        }, 100);
        // this.throttle('opacity', ()=>{
        //     this.domHost.style.setProperty('opacity', 1);
        // })

    },
    opening() {
        if (this.pinned && !this.opened && this.controls.length) {
            this.setOpened(this.controls[this.focusedIndex]);
        }
        else {
            this.focused = undefined;
        }
    },
    _onKeyDown(e) {
        if (this.controls && e.ctrlKey && '123456789'.includes(e.key)) {
            e.preventDefault();
            e.stopPropagation();
            const idx = parseInt(e.key) - 1;
            if (e.altKey) {
                if (idx < this.buttons.sort((a, b) => parseInt(a.order || 0) < parseInt(b.order || 0) ? -1 : 1).length) {
                    this.buttons[idx]?.tap();
                }
            } else if (idx < this.controls.sort((a, b) => parseInt(a.getAttribute('order') || 0) < parseInt(b.getAttribute('order') || 0) ? -1 : 1).length) {
                this.setOpened(this.controls[idx]);
            }
        }
    },
    _onControlsPanelResize(e) {
        const { target } = e;
        this.controlsOverflow = target.offsetHeight < target.scrollHeight;
    }
});
ODA({is: 'oda-collapsed-buttons-menu-item',
    template: /*html*/`
    <style>
        :host{
            @apply --horizontal;
            width: 232px;
            padding: 4px;
        }
    </style>
    <oda-icon :icon="item.icon"></oda-icon>
    <span ~text="item.label"></span>
    `,
    item: null,
    focused: {
        $attr: true,
        get() {
            return this.item.focused;
        }
    }
});
ODA({is: 'app-layout-tabs',
    template: /* html*/`
    <style>
        :host{
            @apply --vertical;
            @apply --flex;
            overflow: hidden;
        }
        :host slot {
            min-width: 0px;
            overflow: hidden;
        }
    </style>
    <div ~if="tabs.length > 1" class="horizontal" style="border-bottom: 1px solid gray;">
        <oda-button
            ~for="tabs"
            ~props="$for.item"
            class="no-flex"
            :focused="focused === $for.item"
            :active="focused === $for.item"
            @tap="focused = $for.item"
        ></oda-button>
    </div>
    <slot @slotchange="onSlotchange" class="flex vertical" style="height: 0"></slot>
    `,
    tabs: [],
    focused: {
        set(n) {
            this.elements.forEach(e => {
                e.$sleep = e.hidden = e !== n.element;
            });
        }
    },
    elements: [],
    onSlotchange(e) {
        this.elements = [...e.target.assignedNodes()].map(e => {
            e.$sleep = e.hidden = true;
            return e;
        });
        this.tabs = this.elements.map(e => {
            const icon = e.getAttribute('icon') || e.icon;
            const subIcon = e.getAttribute('sub-icon') || e.subIcon;
            const label = e.getAttribute('label') || e.getAttribute('name') || e.getAttribute('title') || e.label || e.name || e.localName;
            return { element: e, icon, subIcon, label };
        });
        this.async(() => {
            if (!this.focused) {
                this.focused = this.tabs[0];
            }
        });
    },
});