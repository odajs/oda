ODA({ is: 'oda-layout-designer', imports: '@oda/icon',
    template: /*html*/`
        <style>
            :host{
                @apply --vertical;
                overflow-y: auto;
                padding: 16px 32px;
                background-color: {{paper.background}} !important;
            }
        </style>
        <oda-tree
            ~if="layout && designMode"
            slot="left-panel"
            icon="odant:fields"
            title="fields"
            icon-checked="icons:visibility"
            icon-unchecked="icons:visibility-off"
            allow-check="single"
            :label="label || 'structure'"
            cell-template="oda-layout-designer-table-cell"
            allow-selection="level"
            :data-set="[layout]"
            show-grouping-panel="false"
            :selected-rows="selection"
            hide-search
        ></oda-tree>
        <div class="flex vertical" style="overflow-x: hidden; overflow-y: auto;">
            <oda-layout-designer-structure ~is="structureTemplate" class="flex" ~class="{header: designMode}" :layout></oda-layout-designer-structure>
            <div class="flex"></div>
        </div>
        <oda-property-grid icon="icons:menu" ~if="designMode" slot="right-panel" group-expanding-mode="all" :inspected-object="selection"></oda-property-grid>
    `,
    async loadSettings(layout) {
        return this.settings[layout.path] ??= {};
    },
    async saveSettings(layout) {
        this.settings[layout.path] = layout.settings;
    },
    resetDesign() {
        this.designInfo.selected = [];
        this.layout.reset(true);
    },
    label: '',
    $pdp: {
        settings: {},
        get designer() {
            return this;
        },
        designInfo: {
            selected: [],
            dropTo: {
                target: null,
                align: ''
            }
        },
        editorTemplate: "input",
        dataKeys: '',
        iconSize: 24,
        structureTemplate: 'oda-layout-designer-structure',
        containerTemplate: 'oda-layout-designer-container',
        focusedField: null,
    },
    get selection() {
        return this.designInfo.selected;
    },
    data: {
        $type: Object
    },
    colors: {
        $public: true,
        $pdp: true,
        paper: {
            $def: {
                color: {
                    $def: 'var(--content-color)',
                    $editor: '@oda/color-picker[oda-color-picker]',
                },
                background: {
                    $def: 'var(--content-background)',
                    $editor: '@oda/color-picker[oda-color-picker]',
                    set(v) {
                        console.log(v);
                    }
                }
            },
            $save: true,
        },
        tools: {
            $def: {
                color: {
                    $def: 'var(--dark-color)',
                    $editor: '@oda/color-picker[oda-color-picker]',
                },
                background: {
                    $def: 'var(--dark-background)',
                    $editor: '@oda/color-picker[oda-color-picker]',
                }
            },
            $save: true,
        },
        content: {
            $def: {
                color: {
                    $def: 'var(--content-color)',
                    $editor: '@oda/color-picker[oda-color-picker]',
                    $save: true,
                },
                background: {
                    $def: 'var(--content-background)',
                    $editor: '@oda/color-picker[oda-color-picker]',
                    $save: true,
                }
            },
            $save: true,
        }
    },
    $public: {
        $pdp: true,
        get isDesignChanged() {
            const flatter = i => i.items && i.items.length ? i.items.flatMap(flatter) : [i];
            const itemsToSave = this.designer.layout.items.flatMap(flatter);
            return !!itemsToSave.filter(i => i.layer.isChanged).length;
        },
        designMode: {
            $def: false,
            async set(n) {
                if (n) {
                    await ODA.import('@oda/tree');
                    await ODA.import('@tools/property-grid');
                }
                this.designInfo = this.constructor.__rocks__.descrs.designInfo.$def();
            },
        }
    },
    $observers: {
        setLayout(data, dataKeys) {
            if (dataKeys) {
                this.style.visibility = 'hidden';
                this.layout = new LayoutItem(undefined, undefined, this.dataKeys, this.data);
                this.layout.hideExpander = true;
                this.layout.hideCheckbox = true;
                this.layout.__expanded__ = true;
                this.layout.designer = this;
            }
        },
        // restoreDesign(layout, settings){
        //     layout.settings.groups = [];
        //     layout.actions = settings;
        //     this.async(()=>{
        //         this.style.visibility = 'visible';
        //     }, 100)
        // }
    },
    layout: {
        $type: Object
    }
})

ODA({ is: 'oda-layout-designer-structure',
    template: /*html*/`
        <style>
            :host {
                pointer-events: all !important;
                filter: none !important;
                opacity: 1 !important;
                position: relative;
                @apply --horizontal;
                @apply --no-flex;
                flex-wrap: wrap;/*{{isBlock? 'none' : 'wrap'}};*/
                background-color: {{paper.background}} !important;
                @apply --header;
            }
            :host([is-tabs-container]){
                flex-wrap: nowrap !important;
                border: none !important;
                overflow: hidden;
            }
            :host([align=top]){
                flex-direction: column !important;
            }
            :host([is-block]){
                margin: 1px !important;
            }
            :host([align=bottom]){
                flex-direction: column !important;
            }
        </style>
        <div ~is="containerTemplate" ~for="items" :item="$for.item" :is-active-tab="isTabsContainer && layout?.focusedTab === $for.item"  :denied="_denied($for.item)" :allow="_allow($for.item)"  :outlined="_allowDrop($for.item)" :info="_allowDrop($for.item)"></div>
    `,
    _allowDrop(item) {
        return this.designMode && this.designInfo.selected.includes(item);
    },
    _denied(item) {
        const layer = this.designMode && this.designInfo.selected?.[0]?.layer;
        return layer && layer !== item.layer;
    },
    _allow(item) {
        return this.designMode && !!this.designInfo.selected.length && this.designInfo.selected?.[0]?.layer === item.layer;
    },
    isTabsContainer: {
        get() {
            return this.layout?.itemType === 'tabs';
        },
        $attr: true
    },
    get items() {
        return this.layout?.items;
    },
    isBlock: {
        $type: Boolean,
        $attr: true,
        get() {
            return this.designMode && this.layout?.itemType === 'block';
        }
    },
    layout: {
        $type: Object,
        async set(v) {
            if (v?.isLayerRoot) {
                this.style.visibility = 'hidden';
                v.settings ??= await this.loadSettings(v) || {};
                this.designer.debounce('show-layer', () => {
                    this.designer.style.visibility = 'visible';
                }, 200);
                this.async(() => {
                    this.style.visibility = 'inherit';
                });
            }
        }
    },
    $pdp: {
        align: {
            $type: '',
            $attr: true,
            get() {
                return this.layout?.align;
            }
        }
    }
})
ODA({ is: 'oda-layout-designer-container',
    template: /*html*/`
        <style>
            :host {
                position: relative;
                margin: {{isTab?'0px':'4px'}};
                padding: {{isGroup?'4px 2px': '0px 0px 2px 0px'}};
                max-height: {{(showExt || extendedMode || isGroup || isBlock || isTabs)?'initial':((iconSize * 2.2) +'px')}};
                max-width: {{maxWidth? (maxWidth + 8) + 'px':'calc(100% - 8px)'}};
                min-width: {{((extendedMode || isGroup) && !isBlock && !isTabs)?'calc(100% - 8px)':(item?.width?item?.width:'')}};
                box-sizing: border-box;
                @apply --horizontal;
                overflow: hidden;
                @apply --flex;
                flex: {{maxWidth ? '0 0 auto':'1000000000000000000000000000000 1 auto'}} !important;
                display: {{hidden && !designMode?'none':'flex'}};
            }
            :host([denied]) {
                background-color: rgba(255,0,0,.3);
                color: var(--dark-background);
                fill: var(--dark-background);
            }
            :host([allow]) {
                background-color: rgba(0, 255, 0,.3);
                color: var(--content-color);
            }
            :host([allow]) > fieldset, :host([denied]) > fieldset {
                background-color: transparent !important;
            }
            :host([is-group]) {
                @apply --dark;
                /*@apply --raised;*/
                border: 1px solid {{paper.background}};
                min-width: calc(100% - 8px) !important;
                border-radius: 6px;
            }
            :host([is-block]) {
                padding: 0px !important;
            }
            :host([info]) {
                @apply --info;
            }
            legend {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                text-align: left;
                font-size: small;
                /*font-weight: bold;*/
                /*opacity: .5;*/
                margin-left: 4px;
                max-width: 90%;
            }
            :host([drop-to]) {
                @apply --outlined;
            }

            :host([drop-to=top])::before {
               content: "";
               position: absolute;
               top: 0px;
               left: 0px;
               right: 0px;
               height: 3px;
               z-index: 1;
              background-color: var(--success-color);
            }

            :host([drop-to=bottom])::after {
               content: "";
               position: absolute;
               bottom: 0px;
               left: 0px;
               right: 0px;
               height: 3px;
               z-index: 1;
              background-color: var(--success-color);
            }
            :host([drop-to=left])::before {
               content: "";
               position: absolute;
               top: 0px;
               left: 0px;
               bottom: 0px;
               width: 3px;
               z-index: 1;
              background-color: var(--success-color);
            }
            :host([drop-to=right])::after {
               content: "";
               position: absolute;
               bottom: 0px;
               top: 0px;
               right: 0px;
               width: 3px;
               z-index: 1;
              background-color: var(--success-color);
            }
            :host([is-tab]) {
                padding: 0px !important;
                visibility: hidden;
                min-width: calc(100%-8px);
                order: 1;
            }
            :host([is-tabs]) {
                padding: 0px !important;
            }
            :host([is-active-tab]) {
                visibility: inherit;
                order: 0 !important;
            }
        </style>
        <fieldset
            ~is="fieldset"
            class="vertical flex"
            :title
            :content="!isGroup"
            style="border-radius: 4px; min-width: 0px;"
            ~style="_fieldsetStyle"
        >
            <legend ~if="isField" ~html="title" ~style="{color: isGroup?'inherit':item.textColor}"></legend>
            <div ~if="!isBlock" class="horizontal" style="overflow: hidden; justify-content: end;" ~show="!isTabs && !isTab">
                <oda-icon
                    ~if="expandIcon"
                    :icon="expandIcon"
                    :icon-size
                    style="cursor: pointer; opacity: .5"
                    @pointerdown.stop
                    @tap.stop="expand"
                ></oda-icon>
                <div
                    ~is="item?.editorTemplate || editorTemplate"
                    id="input"
                    :disabled="designMode && !isGroup"
                    class="flex"
                    :layout="item"
                    style="border: none; outline: none;"
                    :focused="item === focusedField"
                    @focusin="this.editorFocusIn($event, item)"
                ></div>
            </div>
            <div
                ~if="showExt"
                ~is="item?.structureTemplate || structureTemplate"
                :layout="item"
                style="position: relative;"
                :flex="isTab || isGroup"
            ></div>
        </fieldset>
    `,
    editorFocusIn(e, item) {
        this.focusedField = item;
        e.target.focus();
    },
    get showExt() {
        return this.item?.__expanded__ || this.isTab
    },
    get _fieldsetStyle() {
        return { border: (this.isGroup || !this.isField) ? 'none' : '1px solid ' + this.item.textColor, padding: !this.isField ? '0px' : '0px 0px;' }
    },
    get isField() {
        return !this.isTabs && !this.isBlock && !this.isTab;
    },
    get fieldset() {
        if (!this.isField)
            return 'div';
        return 'fieldset';
    },
    tabindex: {
        get() {
            if (this.designMode && this.designInfo.selected.includes(this.item)) {
                this.async(() => {
                    this.focus();
                })
                return 0;
            }
            this.blur();
            return '';
        },
        $attr: true,
    },
    isGroup: {
        $type: Boolean,
        $attr: true,
        get() {
            return this.item?.itemType === 'group';
        }
    },
    isBlock: {
        $type: Boolean,
        $attr: true,
        get() {
            return this.item?.itemType === 'block';
        }
    },
    isTabs: {
        $type: Boolean,
        $attr: true,
        get() {
            return this.item?.itemType === 'tabs';
        }
    },
    isTab: {
        $type: Boolean,
        $attr: true,
        get() {
            return this.item?.itemType === 'tab';
        }
    },
    // $pdp: {
    get maxWidth() {
        return this.$('#input')?.maxWidth || undefined;
    },
    // },
    // $pdp:{
    //     get maxWidth(){
    //         return this.item?.maxWidth;
    //     },
    // },
    dropTo: {
        $attr: true,
        get() {
            if (this.designMode)
                return this.designInfo.dropTo.target === this && this.designInfo.dropTo.align;
            return '';
        }
    },
    hidden: {
        $attr: true,
        get() {
            return this.item?.hidden;
        }
    },
    get title() {
        return this.item?.title;
    },
    get expandIcon() {
        return (this.extendedMode || this.isGroup) ? (this.item?.__expanded__ ? 'icons:chevron-right:90' : 'icons:chevron-right') : '';
    },
    get extendedMode() {
        return this.item?.items?.length;
    },
    expand() {
        if (!this.expandIcon) return;
        this.item.__expanded__ = !this.item.__expanded__;
    },
    $public: {
        label: {
            $def: {
                color: 'black',
                align: 'top',
                hidden: false
            },
        },
    },
    draggable: {
        $attr: true,
        get() {
            return this.designMode ? 'true' : 'false';
        }
    },
    item: {},
    $keyBindings: {
        escape(e) {
            if (!this.item?.owner?.name)
                return;
            e.stopPropagation();
            this.designInfo.selected = [this.item.owner];
            this.blur();
        }
    },
    $listeners: {
        dragover(e) {
            if (!this.designMode) return;
            e.stopPropagation();
            if (this.designInfo.selected[0]?.layer !== this.item.layer)
                return;
            if (this.designInfo.selected.includes(this.item))
                return;
            e.preventDefault();
            const w = e.target.offsetWidth;
            const h = e.target.offsetHeight;
            const min = Math.min(w, h) / 2
            const x = e.layerX;
            const y = e.layerY;
            this.designInfo.dropTo.target = e.target;
            let align = '';
            this.designInfo.dropTo.align = '';
            if (w > h) {
                if (x < min)
                    align = 'left';
                else if (x > w - min)
                    align = 'right';
                else if (y < min)
                    align = 'top';
                else
                    align = 'bottom';
            }
            else {
                if (y < min)
                    align = 'top';
                else if (y > h - min)
                    align = 'bottom';
                else if (x < min)
                    align = 'left';
                else
                    align = 'right';
            }
            this.designInfo.dropTo.align = align;
        },
        dragleave(e) {
            this.designInfo.dropTo.align = '';
            this.designInfo.dropTo.target = null;
        },
        drop(e) {
            if (!this.designInfo.dropTo.target)
                return;
            if (this.designInfo.dropTo.target?.item.itemType === 'tab')
                this.designInfo.dropTo.target.item.addItems({ items: this.designInfo.selected, align: this.designInfo.dropTo.align }, true);
            else
                this.designInfo.selected = [this.designInfo.dropTo.target.item.addBlock({ items: this.designInfo.selected, align: this.designInfo.dropTo.align }, true)];
            this.designInfo.dropTo.align = '';
            this.designInfo.dropTo.target = null;

        },
        dragstart(e) {
            if (!this.designMode) return;
            e.stopPropagation();
            if (!this.designInfo.selected.includes(this.item))
                this.$listeners.pointerdown.call(this, e)
        },
        pointerdown(e) {
            if (this.designMode) {
                selectItem.call(this, e)
                window.dispatchEvent(new PointerEvent('pointerdown', e))
                this.designer.$render();
            }
        },
        contextmenu(e) {
            if (!this.designInfo.selected.includes(this.item))
                return;
            contextMenu.call(this, e)
        }
    }
})
function selectItem(e) {
    if (!this.designMode) return;
    e.stopPropagation();
    if (e.button === 0) {
        if (!e.ctrlKey || !this.designInfo.selected.length) {
            if (!this.designInfo.selected.includes(this.item))
                this.designInfo.selected = [this.item];
        }
        else if (this.designInfo.selected[0].layer === this.item.layer) {
            if (this.designInfo.selected.includes(this.item))
                this.designInfo.selected.remove(this.item);
            else
                this.designInfo.selected.add(this.item);

        }
    }
    else if (!this.designInfo.selected.includes(this.item)) {
        if (!e.ctrlKey)
            this.designInfo.selected = [this.item];
        else
            this.designInfo.selected.add(this.item);
    }
}

async function contextMenu(e) {
    if (!this.designMode) return;
    e.preventDefault();
    if (!this.designInfo.selected.includes(this.item))
        this.$listeners.pointerdown?.call(this, e)
    await ODA.import('@tools/containers');
    await ODA.import('@oda/menu');
    const menu = [
        {
            label: `Grouping`,
            icon: 'fontawesome:s-object-group',
            execute: () => {
                this.item.group({ items: this.designInfo.selected, align: '' }, true);
            }
        }
    ];
    if (this.item.itemType) {
        menu.push({
            label: `Ungrouping`,
            icon: 'fontawesome:s-object-ungroup',
            execute: () => {
                this.item.ungroup({ items: this.designInfo.selected }, true);
            }
        })
    }
    menu.push({
        label: this.item.hidden ? `Show` : 'Hide',
        icon: this.item.hidden ? 'icons:visibility' : 'icons:visibility-off',
        execute: () => {
            const hidden = !this.item.hidden
            this.designInfo.selected.add(this.item);
            for (let item of this.designInfo.selected) {
                item.hidden = hidden;
            }
        }
    })

    const res = await ODA.showDropdown('oda-menu', { iconSize: this.iconSize, items: menu }, { title: `Design menu [${this.designInfo.selected.length}]`, allowClose: true });
    res?.focusedItem.execute();
}
ODA({is:'oda-layout-designer-tabs',
    template:/*html*/`
        <style>
            :host {
                background-color: transparent !important;
                @apply --horizontal;
                overflow: hidden;
            }
            .tab {
                @apply --border;
                @apply --horizontal;
                @apply --raised;
                border-bottom: none;
                border-top-left-radius: 4px;
                border-top-right-radius: 4px;
                font-size: small;
                margin-top: 2px;
                cursor: pointer;
                padding: 0px 2px;
                @apply --dark;
            }
            .tab[focused]{
                color: {{tools.background}} !important;
                fill: {{tools.background}} !important;
                background-color: {{tools.color}} !important;
            }
            .tab[focused] oda-button{
                color: {{tools.background}} !important;
                fill: {{tools.background}} !important;
            }
            oda-button{
                fill: {{tools.color}};
                color: {{tools.color}};
            }
        </style>
        <div class="flex horizontal" style="overflow: hidden; flex-wrap: wrap;" @pointerdown.stop>
            <div class="tab flex horizontal" :focused="getFocusedTab($for.item)" ~for="tabs" @tap.stop="selTab($for.item)" ~show="isShow($for.item)">
                <div class="horizontal flex" style="justify-content: center; min-width: 100px; align-items: center; margin: 4px;">
                    <oda-icon :icon="$for.item.icon" :icon-size ~if="$for.item.icon"></oda-icon>
                    <label style="text-align: center; margin: 4px; max-width: 90%;">{{$for.item.label}}</label>
                </div>
                <oda-button icon="icons:close" class="no-flex" ~if="designMode" :icon-size  @tap.stop="removeTab($for.item)"></oda-button>
            </div>
        </div>
        <oda-button icon="icons:add" class="no-flex" ~if="designMode" @pointerdown.stop :icon-size @tap="addTab"></oda-button>
    `,
    isShow(item){
        return !item.hidden;
    },
    getFocusedTab(item){
        return this.tabsItem?.focusedTab === item;
    },
    removeTab(item){
        item.remove(true);
    },
    selTab(item){
        this.designInfo.selected = [item];
        this.tabsItem.focusedTab =  item;
        this.domHost.$render();
        this.$render();
    },
    get tabsItem(){
        return this.layout.items.find(i=>i.itemType === 'tabs');
    },
    get tabs(){
        return this.tabsItem?.items;
    },
    set disabled(n){
        this.disabled = false;
    },
    addTab(e){
        e.stopPropagation();
        this.layout.addTab({}, true);
    },
    layout: null,
})
ODA({is:'oda-layout-designer-table-cell', extends: 'oda-icon, oda-table-cell',
    template: /*html*/`
        <style>
            .icon {
                padding: 2px;
                opacity: .5;
                transform: scale(.5);
                display: none;
            }
            :host([icon]) .icon {
                display: block !important;
            }
            label {
                padding: 4px;
            }
            :host([is-dark]) > label {
                @apply --dark;
                border-radius: 4px;
            }
            :host([drop-to]) {
                @apply --outlined;
            }
            :host([drop-to=top])::before {
               content: "";
               position: absolute;
               top: 0px;
               left: 0px;
               right: 0px;
               height: 3px;
               z-index: 1;
               background-color: var(--success-color);
            }

            :host([drop-to=bottom])::after {
               content: "";
               position: absolute;
               bottom: 0px;
               left: 0px;
               right: 0px;
               height: 3px;
               z-index: 1;
              background-color: var(--success-color);
            }
            :host([drop-to=left])::before {
               content: "";
               position: absolute;
               top: 0px;
               left: 0px;
               bottom: 0px;
               width: 3px;
               z-index: 1;
              background-color: var(--success-color);
            }
            :host([drop-to=right])::after {
               content: "";
               position: absolute;
               bottom: 0px;
               top: 0px;
               right: 0px;
               width: 3px;
               z-index: 1;
              background-color: var(--success-color);
            }
        </style>
        <oda-button
            ~if="isDesigned"
            @down.stop
            @up.stop icon="carbon:reset"
            @pointerdown.stop
            @pointerup.stop
            @tap.stop="item.reset()"
        ></oda-button>
        <oda-button
            :disabled="isLayerRoot && !item?.isChanged"
            :icon="buttonIcon"
            @down.stop
            @up.stop
            @pointerdown.stop
            @pointerup.stop
            @tap.stop="buttonTap"
        ></oda-button>
    `,
    get isDesigned() {
        return this.item?.settings?.actions?.length || Object.keys(this.item?.settings?.states || {}).length;
    },
    dropTo: {
        $attr: true,
        get() {
            if (this.designMode)
                return this.designInfo.dropTo.target?.item === this.item && this.designInfo.dropTo.align;
            return '';
        }
    },
    async buttonTap(e) {
        switch (this.item.itemType) {
            case 'group': {
                this.item.addTab(true);
            } break;
            case 'tab': {
                this.item.remove(true);
            } break;
            default: {
                if (this.isLayerRoot && this.item.isChanged) {
                    await this.saveSettings(this.item);
                    this.item.isChanged = false;
                    this.$render();
                }
            }
        }
    },
    disabled: {
        $attr: true,
        get() {
            return this.item?.hidden;
        }
    },
    header: {
        $attr: true,
        get() {
            return this.isLayerRoot;
        }
    },
    isDark: {
        $attr: true,
        get() {
            return this.item?.itemType && this.item?.itemType !== 'block';
        }
    },
    get isLayerRoot() {
        return this.item.isLayerRoot;
    },
    get buttonIcon() {
        switch (this.item.itemType) {
            case 'group':
                return 'icons:add';
            case 'tab':
                return 'icons:close';
            default: {
                if (this.isLayerRoot)
                    return 'icons:save';
            }
        }
    },

    icon: {
        $attr: true,
        get() {
            return this.item?.icon;
        }
    },
    get value() {
        return this.item.label + ' [' + this.item.name + ']'
    },
    $listeners: {
        contextmenu(e) {
            contextMenu.call(this, e)
        },
        pointerdown(e) {
            if (e.button === 2) {
                selectItem.call(this, e)
            }
            else if (this.item.itemType === 'tab') {
                this.item.owner.focusedTab = this.item;
            }
            window.dispatchEvent(new PointerEvent('pointerdown', e))
        }
    }
})

const LayoutItem = class extends ROCKS({
    settings: {
        $type: Object,
        async set(n) {
            for (let step of n?.actions || []) {
                let context = await this.findItem(step.context);
                if (!context)
                    continue;
                const params = {};
                for (let p in step.params) {
                    let value = step.params[p];
                    switch (p) {
                        case 'items': {
                            value = await Promise.all(value.map(async i => {
                                return await this.findItem(i);
                            }))
                        } break;
                        case 'old':
                        case 'item': {
                            value = await this.findItem(value);
                        }
                    }
                    params[p] = value;
                }
                context[step.action](params);
            }
        }
    },
    get states() {
        const layer = this.layer || this;
        return layer.settings?.states?.[this.name];
    },
    groups: [],
    get path() {
        if (this.isLayerRoot)
            return !this.layer ? ('ROOT') : this.layer.path + '/' + this.name;
    },
    async findItem(name) {
        const items = (this.items?.then ? await this.items : this.items) || []
        for (let i of items) {
            if (i.layer === this || this.layer) {
                if (i.name == name)
                    return i;
                const res = await i.findItem(name);
                if (res)
                    return res;
            }
        }
    },
    align: '',
    get checked() {
        return this.hidden ? 'unchecked' : 'checked';
    },
    set checked(v) {
        this.hidden = v === 'unchecked';
        this.layer.isChanged = true;
    },
    group(params = { items: [], align }, inLog) {
        let items = [...params.items];
        let align = params.align;
        let idx = this.owner.items.indexOf(this);
        const layer = this.layer;
        const name = this.generateName(align ? 'block' : 'group');
        const data = { itemType: (align ? 'block' : 'group'), name: name, [this.dataKeys]: [] }
        layer.groups.push(data);
        const grp = new LayoutItem(this.owner, this.layer, this.dataKeys, data)
        this.owner?.items.splice(idx, 0, grp);
        grp.align = align;
        if (!align) {
            grp.editorTemplate = 'oda-layout-designer-tabs';
        }
        while (items.length) {
            grp.addItem({ item: items.shift() });
        }
        grp.__expanded__ = true;
        if (inLog)
            this.addAction({ action: 'group', context: this.name, params: { items: params.items.map(i => i.name), align } });
        return grp;
    },
    addBlock(params = { items: [], align: '' }, inLog) {
        let toItem = this;
        let items = [...params.items];
        const align = params.align;
        if (items.length > 1) {
            let grp = items[0].group({ items, align: items[0].owner.align || align });
            items = [grp];
        }
        switch (align) {
            case 'left':
            case 'top': {
                items.push(toItem);
            } break;
            default: {
                items.unshift(toItem);
            }
        }
        if (inLog)
            this.addAction({ action: 'addBlock', context: this.name, params: { items: params.items.map(i => i.name), align } });
        return toItem.group({ items, align });
    },
    generateName(type) {
        return type + (this.layer.groups.filter(i => i.itemType === type).length + 1);
    },
    addTab({ }, inLog) {
        if (this.itemType !== 'group')
            return;
        let tabs = this.items.find(i => {
            return i.itemType === 'tabs'
        })
        let items = [];
        if (!tabs) {
            items = this.items;
            const name = this.generateName('tabs');
            const data = { itemType: 'tabs', name, [this.dataKeys]: [], label: 'tabs' }
            this.layer.groups.push(data);
            tabs = new LayoutItem(this, this.layer, this.dataKeys, data);
            this.items = [tabs];
            tabs.__expanded__ = true;
            tabs.hideExpander = true;
        }
        const name = this.generateName('tab');
        const data = { itemType: 'tab', name, [this.dataKeys]: [] }
        this.layer.groups.push(data);
        const tab = new LayoutItem(tabs, this.layer, this.dataKeys, data);
        tab.addItems({ items });
        tabs.addItem({ item: tab });
        tab.__expanded__ = true;
        data.label = 'Tab ' + (tabs.items.length);
        if (inLog) {
            tabs.focusedTab = tab;
            this.addAction({ action: 'addTab', context: this.name });
        }
        else if (tabs.items.length === 1)
            tabs.focusedTab = tab;
    },
    ungroup(params = { items }, inLog) {
        let items = params.items;
        if (!this.itemType) return;
        this.owner.replaceItems({ item: this, items: this.items });
        items?.forEach(i => {
            i.ungroup({});
        })
        if (inLog)
            this.addAction({ action: 'ungroup', context: this.name, params: { items: params.items.map(i => i.name) } });
    },
    removeItem(params = { item }, inLog) {
        let item = params.item;
        if (!this.items.includes(item))
            return;
        const res = this.items.remove(item);
        switch (this.itemType) {
            case 'block': {
                if (this.items.length === 1) {
                    this.owner.replaceItem({ old: this, item: this.items[0] });
                }
            } break;
            case 'tabs':
            case 'group': {
                if (this.items.length === 0) {
                    this.owner.removeItem({ item: this });
                }
            }
        }
        if (inLog)
            this.addAction({ action: 'removeItem', context: this.name, params: { item: item.name } });
    },
    remove(inLog) {
        if (this.itemType === 'tab') {
            let nextFocus = this.owner.items.indexOf(this);
            const grp = this.owner.owner;
            const grp_idx = grp.owner.items.indexOf(grp) + 1;
            grp.owner.items.splice(grp_idx, 0, ...this.items)
            // this.layer.addItems({items: this.items});
            this.owner.removeItem({ item: this });
            while (nextFocus > -1) {
                const next = this.owner.items[nextFocus];
                if (next?.itemType === 'tab') {
                    this.owner.focusedTab = next;
                    break;
                }
                nextFocus--;
            }
        }
        else {
            this.owner.replaceItems({ item: this, items: this.items });
            this.owner.removeItem({ item: this });
        }
        if (inLog)
            this.addAction({ action: 'remove', context: this.name });
    },
    addItems(params = { items }, inLog) {
        let items = params.items;
        for (let item of items) {
            this.addItem({ item });
        }
        if (inLog)
            this.addAction({ action: 'addItems', context: this.name, params: { items: params.items.map(i => i.name) } });
    },
    addItem(params = { item }, inLog) {
        let item = params.item;
        item.owner?.removeItem({ item });
        this.items.push(item);
        item.owner = this;
        if (inLog)
            this.addAction({ action: 'addItem', context: this.name, params: { item: item.name } });
    },
    replaceItems(params = { item, items }, inLog) {
        let items = params.items;
        let item = params.item;
        const idx = this.items.indexOf(item);
        if (idx < 0) return;
        this.items.splice(idx, 1, ...items);
        for (let i of items)
            i.owner = this;
        if (inLog)
            this.addAction({ action: 'replaceItems', context: this.name, params: { item, items: params.items.map(i => i.name) } });
    },
    replaceItem(params = { old, item }, inLog) {
        let old = params.old;
        let item = params.item;
        const idx = this.items.indexOf(old);
        this.items.splice(idx, 1, item);
        item.owner = this;
        if (inLog)
            this.addAction({ action: 'replaceItem', context: this.name, params: { old: old.name, item: item.name } });
    },
    items: {
        $def: [],
        get() {
            const items = this.data?.[this.dataKeys];
            const layer = this.itemType === 'group' ? this.layer : this;
            if (items?.then) {
                return items.then(items => {
                    return items.map(i => new LayoutItem(this, layer, this.dataKeys, i))
                })
            }
            return items?.map(item => new LayoutItem(this, layer, this.dataKeys, item))
        }
    },
    addAction(action) {
        const layer = this.layer || this;
        layer.settings.actions ??= [];
        layer.settings.actions.push(action);
        layer.isChanged = true;
        this.root.designer.$render();
    },
    get isLayerRoot() {
        return !!((this.items?.[0]?.layer === this) || this.items?.then);
    },
    title: {
        $readOnly: true,
        get() {
            return this.label;
        }
    },
    get root() {
        return this.owner?.root || this;

    },
    $public: {
        label: {
            $type: String,
            get() {
                return this.states?.label || this.data.label || this.name || (!this.owner && 'ROOT');
            },
            set(n) {
                this.setPropValue('label', n)
            }
        },
        hidden: {
            $type: Boolean,
            get() {
                return this.states?.hidden || this.data.hidden || false;
            },
            set(n) {
                this.setPropValue('hidden', n)
            }
        },
        textColor: {
            $type: String,
            $editor: '@oda/color-picker[oda-color-picker]',
            get() {
                return this.states?.textColor || 'var(--dark-background)';
            },
            set(n) {
                this.setPropValue('textColor', n)
            }
        }
    },

    setPropValue(prop, val) {
        const layer = this.layer || this;
        layer.settings ??= {};
        layer.settings.states ??= {};
        layer.settings.states[this.name] ??= {};
        this.states[prop] = val;
        layer.isChanged = true;
        this.root.designer.$render();
    },
    get name() {
        return this.data?.name;
    },
    isChanged: false,
    get itemType() {
        return this.data?.itemType;
    },
    data: Object,
    __expanded__: false,
    width: undefined,
    get icon() {
        return this.data?.icon;
    },
    reset(deep) {
        if (deep) {
            for (let item of ((this.items?.length && this.items) || [])) {
                item.reset(deep);
            }
        }
        if (this.settings?.actions?.length) {
            const exp = this.__expanded__;
            this.items = undefined;
            this.settings.actions = [];
            this.isChanged = true;
            this.__expanded__ = exp;
        }
    }
}) {
    constructor(owner, layer, dataKeys = 'items', data) {
        super(...arguments);
        this.data = data;
        this.owner = owner;
        this.dataKeys = layer?.dataKeys || dataKeys;
        this.layer = layer;
    }
}