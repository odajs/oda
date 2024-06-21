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
            $type: Boolean,
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
        :host app-layout-drawer[pos="right"]{
            order: 2;
        }
    </style>
    <div ~show="!isMinimized" id="appHeader" class="top title">
        <slot name="title" class="horizontal"></slot>
        <slot name="header" class="vertical no-flex"></slot>
    </div>
    <div ~show="!isMinimized" class="main-container header flex" ~class="{'stop-pointer-events': sizeMode === 'min'}" ~style="{zoom: sizeMode === 'min' ? '50%' : '100%'}">
        <div class="main vertical flex shadow" @wheel="_scroll"  style="order:1" ~style="{filter: (allowCompact && compact && opened)?'brightness(.5)':'none', pointerEvents: (allowCompact && compact && opened)?'none':'auto'}">
            <slot name="top" class="vertical no-flex"></slot>
            <slot name="main" class="vertical flex" style="overflow: hidden; z-index: 0"></slot>
            <slot name="bottom" class="vertical no-flex" style="overflow: visible;"></slot>
        </div>
        <app-layout-drawer
            ~for="panels"
            :id="$for.item.pos + '-drawer'"
            :pos="$for.item.pos"
            :show-title="$for.item.showTitle"
            :show-pin="$for.item.showPin"
            :buttons="$for.item.buttons"
            ::width="$for.item.width"
            ::hide-tabs="$for.item.hideTabs"
            ::opened="$for.item.opened"
            ~show="!allowCompact || !compact || !$for.item.opened"
            ::pinned="$for.item.pinned"
        >
            <slot :name="$for.item.pos + '-header'" class="flex" slot="panel-header"></slot>
            <slot :name="$for.item.pos + '-panel'"></slot>
        </app-layout-drawer>
    </div>
    <slot ~show="!isMinimized" name="footer" class="horizontal no-flex" style="overflow: visible; border-top: 1px solid gray;"></slot>
    `,
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
            $type: Boolean
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
            let h = this.appHeader;
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
    closeDrawers() {
        [this.leftPanelElement, this.rightPanelElement].forEach(i => i?.close?.());
    },
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
    <slot name="left" class="horizontal no-flex" style="justify-content: flex-start; min-width: 1px;"></slot>
    <slot name="center" class="horizontal flex" style="justify-content: center;"></slot>
    <slot name="right" class="horizontal no-flex" style="justify-content: flex-end; flex-shrink: 0;"></slot>`,
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
        .outline {
            outline: gray dashed 1px;
            outline-offset: -2px;
        }
        [toggled] {
            @apply --success;
            border-color: var(--header-background, black);
        }
    </style>
    <div @touchmove="hideTabs=false" id="panel" class="raised buttons no-flex" ~if="!hidden" style="overflow: visible; z-index:1" ~style="{alignItems: pos ==='left'?'flex-start':'flex-end', maxWidth: hideTabs?'1px':'auto'}">
        <div class="vertical bt" style="height: 100%;"
            ~style="{ 'min-width': (controls?.length > 0 || buttons?.length > 0) ? (iconSize + 10) + 'px' : 'none' }">
            <div ~show="!hideTabs" class="no-flex vertical">
                <oda-button
                    ~for="controls"
                    ~style="getStyle($for.item)"
                    style="padding: 4px; writing-mode: tb; border: 1px dotted transparent;"
                    ~class="{outline: focused === $for.item}"
                    class="no-flex tab"
                    :error="$for.item?.error || $for.item.hasAttribute('error')"
                    :rotate="($for.item?.label || $for.item.getAttribute('label'))?90:0"
                    :label="$for.item?.label || $for.item?.getAttribute?.('label')"
                    :icon-size="iconSize *.8 "
                    default="icons:help"
                    :item="$for.item"
                    :title="$for.item?.getAttribute('bar-title') || $for.item?.title || $for.item?.getAttribute('title') || ''"
                    :icon="$for.item?.getAttribute('bar-icon') || $for.item?.icon || $for.item?.getAttribute('icon') || 'icons:menu'"
                    :sub-icon="$for.item?.getAttribute('sub-icon')"
                    :toggled="opened === $for.item"
                    :bubble="$for.item.bubble"
                    @down.stop="setOpened($for.item)"
                ></oda-button>
            </div>
            <div class="flex hider vertical" style="justify-content: center; margin: 8px 0px; align-items: center;" >
                <oda-icon @down.stop="hideTabs=!hideTabs" class="border pin no-flex" :icon="({left: 'icons:chevron-right', right: 'icons:chevron-left'})[pos]" :rotate="hideTabs?0:180" :icon-size ~style="{filter: hideTabs ? 'invert(1)' : ''}"></oda-icon>
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
            <slot name="panel-header" class="no-flex"></slot>
            <div ~if="showTitle || showPin || openedTitle" invert class="horizontal content shadow" ~style="{flexDirection: \`row\${pos === 'right'?'-reverse':''}\`}" style="align-items: center; padding: 2px" @tap.stop>
                <oda-icon :icon-size ~if="opened?.titleIcon" :icon="opened?.titleIcon"></oda-icon>
                <label ~if="openedTitle || showPin" class="flex title-label" ~text="openedTitle"></label>
                <oda-button ~if="showPin &&  domHost.offsetWidth > this.compactThreshold" :icon="pinned ? 'icons:pin-fill:315' : 'icons:pin'" @mousedown.stop="pinned = !pinned" :icon-size style="transform: scale(.5)"></oda-button>
<!--                <oda-button :icon-size="iconSize*0.66" :icon="\`icons:chevron-right:\${pos === 'left' ? 180 : 0}\`" @tap.stop="opened = null"></oda-button>-->
            </div>
            <slot style="overflow: hidden;" @slotchange="slotchange" class="flex vertical"></slot>
        </div>
        <oda-splitter :sign ~if="!hideResize" ::width></oda-splitter>
    </div>
    `,
    get $saveKey() {
        return this.domHost.$savePath + this.pos;
    },
    buttons: [],
    delta: 0,
    showPin: true,
    $public: {
        $pdp: true,
        iconSize: 24,
        pinned: {
            $type: Boolean,
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
        opened: {
            $def: null,
            set(n, o) {
                if (n) {
                    n.titleIcon = n.getAttribute('title-icon');
                    n.hidden = false;
                }
                for (let i of (this.controls || [])) {
                    i.$sleep = i.hidden = i !== n;
                }
                const idx = this.controls.indexOf(n);
                this.focusedIndex = ~idx ? idx : 0;
                this.async(() => {
                    this.opened?.dispatchEvent(new CustomEvent('activate'));
                });
            }
        },
        get focused() {
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
        }
    },
    get panel() {
        return this.$('#panel') || undefined;
    },
    get _styles() {
        const cpt = this.allowCompact && this.compact;
        const panelW = `${this.panel?.offsetWidth || 0}px`;
        return {
            flexDirection: `row${({ right: '-reverse', left: '' })[this.pos]}`,
            // maxWidth: cpt ? '70vw' : `${this.width||0}px`,
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
        opening: 'pinned, controls'
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
    },
    detached() {
        this.unlisten('keydown', '_onKeyDown', { target: document });
    },
    getStyle(ctrl) {
        const label = ctrl?.label || ctrl.getAttribute('label');
        const order = ctrl?.order || ctrl.getAttribute('order') || 0;
        const res = { order };
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
        if (item.isButton) {
            item.click();
        }
        else {
            this.opened = ((this.opened === item) ? null : item);
        }
    },
    slotchange(e) {
        if (e.target.domHost === this) return;
        this.controls = e.target.assignedNodes();
        this.controls.forEach(c => {
            if (c.hasAttribute('close-event')) {
                this.allowPin = true;
                this.listen(c.getAttribute('close-event'), e => this.smartClose(), { target: c });
            }
        });
        this.hidden = this.controls.length === 0;
        if (this.opened && !this.controls.some(c => c === this.opened))
            this.opened = undefined; // т.к. e.target.assignedNodes() возвращает новые узлы
        this.controls.forEach(el => {
            el.$sleep = el.hidden = true;
            if (this.opened === el || el.hasAttribute?.('bar-autofocus') || el.hasAttribute?.('bar-opened') || el.hasAttribute?.('opened')) {
                this.opened = this.opened || el;
                if (el === this.opened)
                    el.$sleep = el.hidden = false;
            }
        });
        this.delta = this.panel?.firstElementChild?.offsetWidth || 0;
        // this.throttle('opacity', ()=>{
        //     this.domHost.style.setProperty('opacity', 1);
        // })

    },
    opening(pinned, controls) {
        if (pinned && !this.opened && !this.opened && controls.length) {
            this.setOpened(controls[this.focusedIndex]);
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
            } else {
                if (idx < this.controls.sort((a, b) => parseInt(a.getAttribute('order') || 0) < parseInt(b.getAttribute('order') || 0) ? -1 : 1).length) {
                    this.setOpened(this.controls[idx]);
                }
            }
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
        <oda-button ~for="tabs" ~props="$for.item" @tap="focused = $for.item" class="no-flex" :focused="focused === $for.item" :active="focused === $for.item"></oda-button>
    </div>
    <slot @slotchange="onSlotchange" class="flex vertical" style="height: 0"></slot>
    `,
    tabs: [],
    focused: {
        set(n) {
            this.elements.forEach(e => {
                if (e === n.element) {
                    e.$sleep = e.hidden = false;
                }
                else {
                    e.$sleep = e.hidden = true;
                }
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
            const element = e;
            const icon = e.getAttribute('icon') || e.icon;
            const subIcon = e.getAttribute('sub-icon') || e.subIcon;
            const label = e.getAttribute('label') || e.getAttribute('name') || e.getAttribute('title') || e.label || e.name || e.localName;
            return { element, icon, subIcon, label };
        });
        this.async(() => {
            if (!this.focused) {
                this.focused = this.tabs[0];
            }
        });
    },
});