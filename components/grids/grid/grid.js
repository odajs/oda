ODA({is:'oda-grid', imports: '@oda/icon, @oda/button, @tools/containers, @oda/splitter',
    template:`
        <style>
            :host{
                @apply --vertical;
                @apply --flex;
                overflow: hidden;
            }
        </style>
        <oda-grid-groups class="header">GROUPS</oda-grid-groups>
        <div class="flex horizontal" style="overflow: hidden;">
            <div ~if="metadata[0].items.some(col=>col.checked)" class="raised horizontal header no-flex" style="overflow: hidden; max-width: 30%;filter: brightness(0.9);">
                <oda-grid-part fix="left"></oda-grid-part>
                <oda-splitter save-key="left-fix" :size="sizerWidth" :color="sizerColor"></oda-splitter>
            </div>
            <oda-grid-part @body-resize="_resize" style="overflow: hidden;"></oda-grid-part>
            <div ~if="metadata[2].items.some(col=>col.checked)" class="raised horizontal header no-flex" style="overflow: hidden; max-width: 30%;">
                <oda-splitter save-key="right-fix" :size="sizerWidth" :color="sizerColor"></oda-splitter>
                <oda-grid-part fix="right" style="filter: brightness(0.9);"></oda-grid-part>
            </div>
        </div>

    `,
    _resize(e, d){
        // this.interval('screenHeight', ()=>{
            this.screenHeight = d.value;
        // })
    },
    screenHeight: 0,
    coords:{},
    async showSettings(e){
        await ODA.showDropdown(
            'oda-grid-settings',
            {table: this.table},
            {parent: e.target, intersect: true, align: 'left', title: 'Settings', hideCancelButton: true}
        );
    },
    dragMode: '',
    dataSet: [],
    groups: [],
    labels: [],
    get items(){
        let items = [...this.dataSet || []];
        const extract = (items, level= 0, parent) => {
            return items?.reduce((res, v)=>{
                v.$level = level;
                v.$parent = parent;
                res.push(v);
                if (v.$expanded){
                    res.push(...extract(v.items, level + 1, v))
                }
                return res;
            }, []) || []
        }
        return extract(items);
    },
    get fullHeight(){
        return this.rowHeight * this.rowCount;
    },
    get rowCount(){
        return this.items?.length  || 0;
    },
    get rows(){
        const start = Math.max(Math.floor(this.rowsScrollTop / this.rowHeight), 0);
        const length = start + this.pageSize + 2;
        const rows = this.items.slice(start, length);
        return rows;
    },
    get table(){
        return this;
    },
    get tableWidth(){
        return this.clientWidth;
    },
    heightResize(control='oda-grid-header'){
        // if (this._hr) return;
        // this._hr = true;
        const parts = this.table.$$('oda-grid-part');
        const headers = parts.map(part=>{
            return part.$$(control);
        }).flat();
        let height = 0;

        for (let h of headers){
            h.style.minHeight = '';
            if (height < h.scrollHeight)
                height = h.scrollHeight;
        }
        for (let h of headers){
            h.style.minHeight = height+'px';
        }
        // this.debounce(control, ()=>{
        //     this._hr = false;
        // }, 100)
    },
    get metadata(){
        const columns = this.columns.map((col, idx)=>{
            col.checked = (col.checked === undefined && !col.hidden) || col.checked;
            return col;
        })
        return [
            {name: 'Left fix', $expanded: true, hideExpander: true, hideCheckbox: true, fix: 'left', iconExpanded: 'editor:border-left',
            items: columns?.filter(col => col.fix === 'left')},
            {name: 'Main', $expanded: true, hideExpander: true, hideCheckbox: true, fix: '',  iconExpanded: 'editor:border-all',
                items: columns?.filter(col => !col.fix)},
            {name: 'Right fix', $expanded: true, hideExpander: true, hideCheckbox: true, fix: 'right',  iconExpanded: 'editor:border-right',
            items: columns?.filter(col => col.fix === 'right')},
        ]
    },
    orderStep: 1000000,
    getTemplateTag(row, col) {
        if (row.$role)
            return row.template || col.template || this.defaultTemplate;
        if (row.$group)
            return this.defaultGroupTemplate;
        if (col.treeMode)
            return 'oda-grid-tree-cell';
        let template = col.template || row.template || this.defaultTemplate;
        if (typeof template === 'object')
            return template.tag || template.is || template.template;
        return template;
    },
    focusedRow: null,
    props:{
        allowFocus:{
            default: false,
            set(n){
                if (!n)
                    this.focusedRow = null;
            }
        },
        defaultTemplate: 'oda-grid-cell',
        pivotMode:{
            default: false,
            save: true
        },
        evenOdd: {
            default: false,
            save: true
        },
        rowLines:{
            default: false,
            save: true
        },
        colLines:{
            default: false,
            save: true
        },
        rowHeight:{
            default: 40,
            save: true,
        },
        sizer:{
            default:{
                props:{
                    width: 1,
                    color: {
                        default: 'var(--border-color)',
                        editor: '@oda/color-picker',
                        save: true
                    }
                }
            },
            save: true
        },
        sizerColor:{
            default: 'var(--border-color)',
            save: true,
            editor: '@oda/color-picker'
        },
        sizerWidth:{
            default: 1,
            save: true,
        },
        autoWidth: {
            default: false,
            save: true
        },
        iconSize:{
            default: 24,
            save: true
        },
        showFilter:{
            default: true,
            save: true,
        },
        showFooter:{
            default: false,
            save: true
        },
        showHeader:{
            default: true,
            save: true
        }
    },
    get pageSize(){
        return Math.ceil(this.screenHeight / this.rowHeight);
    },
    set rowsScrollTop(n){
        for (let part of this.$$('oda-grid-part')){
            part.$('oda-grid-body').scrollTop = n;
        }
    },
    rowsScrollTop: 0,
    sorts: [],
})
ODA({is: 'oda-grid-part',
    template: `
        <style>
            :host{
                @apply --header;
                @apply --vertical;
                @apply --flex;
                overflow: hidden;
                max-height: 100%;
            }
        </style>
        <oda-grid-header  ~if="showHeader"></oda-grid-header>
        <oda-grid-body @resize="_resize" :even-odd class="flex" :scroll-top="rowsScrollTop"></oda-grid-body>
        <oda-grid-footer  ~if="showFooter"></oda-grid-footer>
    `,
    _resize(e){
        this.fire('body-resize', e.currentTarget.getBoundingClientRect().height);
    },
    get part(){
        return this;
    },
    fix: '',
    get columns() {
        return this.metadata?.find(col => col.fix === this.fix)?.items.filter(col=> col.checked !== false && !this.groups.includes(col)) || [];
    },

    get cells() {
        const convertColumns = (items)=>{
            return items.reduce((res, col)=>{
                if (!col.items?.length || !col.$expanded){
                    res.push(col);
                }
                else{
                    const next = col.items.map(c=>{
                        c.fix = col.fix;
                        return c;
                    })
                    res.push(...convertColumns(next));
                }
                return res;
            }, [])
        }
        return convertColumns(this.columns).filter(col=> col.checked !== false && !this.groups.includes(col)) || [];
    },
    colsScrollLeft: 0,
})
ODA({is: 'oda-grid-body',
    template: `
        <style>
            :host([even-odd]) .row:not([selected]):nth-child(odd):not([role]):not([dragging]) {
                background-color: rgba(0,0,0,.05);
            }
            :host{
                position: relative;
                /*overflow-x: auto !important;*/
                @apply --vertical;
                @apply --flex;
                @apply --content;
                overflow: scroll !important;
            }
            .row{
                @apply --horizontal;
                @apply --content;
                min-height: {{rowHeight}}px;
                max-height: {{rowHeight}}px;
                height: {{rowHeight}}px;
                flex: {{(autoWidth || fix)?1:0}};
                border-bottom: {{rowLines?'1px solid var(--border-color)':'none'}};
            }
            .cell{
                @apply --no-flex;
                overflow: hidden;
                text-overflow: ellipsis;
                border-right: {{colLines?'1px solid var(--border-color)':'none'}};
            }
        </style>
        <style>
        {{cellsClasses}}
        </style>
        <div class="vertical no-flex" ~style="{minHeight: fullHeight+screenHeight}">
            <div class="vertical no-flex" ~style="{maxHeight: screenHeight, minHeight: screenHeight, width: offsetWidth + colsScrollLeft}" style="position: sticky; top: 0px;">
                <div class="row" ~for="row in rows" :focused="allowFocus && row === focusedRow" @tap.stop="_setFocus($event, row)">
                    <div ~show="col.$width" ~is="getTemplateTag(row, col)"  :tabindex="idx" style="box-sizing: border-box; overflow: hidden;" ~for="(col, idx) in cells"  :column="col" :row="row"  ~class="'C'+idx+' cell'"></div>
                </div>
            </div>
        </div>
    `,
    _setFocus(e, row){
        if (e.sourceEvent.ctrlKey || e.sourceEvent.altKey || e.sourceEvent.shiftKey) return;
        this.focusedRow = this.allowFocus?row:null;
    },
    get cellsClasses(){
        return this.cells.map((cell, idx)=>{
            const w = cell.$width;
            return `.C${idx}{
                min-width: ${w}px;
                max-width: ${w}px;
                width: ${w}px;
            }`;
        }).join('\r\n');
    },
    listeners:{
        scroll(e){
            // this.interval('scroll', ()=>{
                this.rowsScrollTop = this.scrollTop;
                this.colsScrollLeft = this.scrollLeft;
            // })
        }
    }
})
ODA({is:'oda-grid-settings', imports: '@tools/property-grid, @oda/tree, @oda/splitter',
    template:`
        <style>
            :host{
                @apply --horizontal;
                width: 300px;
                @apply --flex;
                bottom: 0px;
                height: 90vh;
            }
            div>div{
                align-items: center;
                @apply --horizontal;
                padding: 8px 4px;
                cursor: pointer;
            }
            div>div:hover{
                color: var(--focused-color) !important;
            }
            oda-icon{
                transform: scale(.7);
            }
        </style>
<!--        <oda-splitter align="vertical"></oda-splitter>-->
        <div class="content flex vertical" style="overflow: hidden;">
            <oda-tree class="border" allow-check="double" ~show="focusedTab === 0" allow-drag allow-drop :data-set="table.metadata"></oda-tree>
            <oda-property-grid class="flex" ~if="focusedTab === 2" only-save :inspected-object="table"></oda-property-grid>
        </div>
        <div style="writing-mode: vertical-lr;" class="horizontal header">
            <div :focused="focusedTab === index" @tap="focusedTab = index" ~for="tabs"><oda-icon :icon="item.icon" :title="item.title"></oda-icon>{{item.title}}</div>
        </div>
    `,
    focusedTab: 0,
    tabs: [
        {icon: 'icons:tree-structure:90', title: 'columns'},
        {icon: 'icons:filter:90', title: 'filters'},
        {icon: 'icons:settings:90', title: 'properties'},
    ],
    table: null,
})
header:{
    ODA({is:'oda-grid-header',
        template: `
        <style>
            :host{
                @apply --no-flex;
                position: relative;
                border-top: 1px solid var(--border-color);
                @apply --horizontal;
                overflow: hidden;
                @apply --raised;
                overflow-y: scroll;
                border-bottom: 1px solid var(--border-color);
            }
        </style>
        <div class="flex horizontal" style="overflow: hidden;" :scroll-left="colsScrollLeft">
            <div class="horizontal" style="min-width: 100%; position: relative;" ~class="{flex: fix}">
                <oda-grid-header-cell :order-step="orderStep/10" ~for="columns" :last="item === items.last" :column="item" :parent-items="items" ~class="getColumnClass(items, item, true)"></oda-grid-header-cell>
            </div>
        </div>
    `,
        getColumnClass(items, item, top){
            let flex;
            if (top && !this.fix && item === items.last)
                flex = this.autoWidth;
            else if (item === items.last)
                flex = true;
            else
                flex = !item.width && this.autoWidth;
            return {flex: flex, "no-flex": !flex};
        },
        get header(){
            return this;
        },
        listeners:{
            resize(e){
                this.heightResize(this.localName);
            }
        }
    })
    ODA({is: 'oda-grid-header-cell',
        template: `
        <style>
            :host{
                @apply --vertical;
                overflow: hidden;
                cursor: pointer;
                @apply --header;
                position: relative;
                font-weight: bold;
                box-sizing: border-box;
            }
            oda-button{
                font-size: x-small;
            }
            input{
                width: auto;
                /*padding: 2px;*/
                margin: 2px;
                width: 1px;
                outline: none;
            }
        </style>
        <div class="horizontal flex" style="align-items: center; overflow: hidden; border-bottom: 1px solid var(--border-color);" ~style="getStyle()" @tap="sort()" @track="onMove" ~class="{disabled: dragMode && !_allowDrop, success: _allowDrop}">
            <oda-icon ~if="column?.items" style="opacity: .3" @down.stop :icon-size :icon="column?.$expanded?'icons:chevron-right:90':'icons:chevron-right'" @tap.stop="expand"></oda-icon>
            <span class="flex" style="text-overflow: ellipsis; overflow: hidden; padding: 4px 0px 4px 8px;">{{title}}</span>
            <oda-icon style="opacity: .5" ~show="getBoundingClientRect().width > iconSize * 2"  :icon="column?.$sort?(column.$sort === 2?'icons:arrow-forward:270':'icons:arrow-forward:90'):''" :icon-size="iconSize/2" >{{column.$sort}}</oda-icon>
            <span style="position: absolute; top: 0px; right: 0px; font-size: xx-small; margin: 2px; opacity: .5">{{sortId}}</span>
            <span class="no-flex" style="height: 90%; cursor: col-resize;" ~style="{width: sizerWidth + 3 + 'px',visibility: hideSizer?'hidden':'visible', 'border-right': sizerWidth+'px solid ' + sizerColor}" @track="onColSizeTrack"></span>
        </div>
        <div ~if="column?.items" ~show="column?.$expanded" class="horizontal flex dark" >
            <oda-grid-header-cell  :order-step="orderStep/10" ~for="columns" :column="item" :parent-items="items" ~class="getColumnClass(items, item)" :last="item === items.last"></oda-grid-header-cell>
        </div>
        <div class="horizontal flex" style="align-items: center;" ~if="showFilter && !column?.$expanded" ~style="{maxHeight: iconSize+'px'}">
            <input class="flex" ::value="filter" ~style="{visibility: (getBoundingClientRect().width > iconSize * 2)?'visible':'hidden'}">
            <oda-icon  icon="icons:filter" :icon-size="iconSize * .3"></oda-icon>
            <span class="no-flex" style="height: 100%;" ~style="{width: sizerWidth + 3 + 'px', visibility: hideSizer?'hidden':'visible', 'border-right': sizerWidth+'px solid ' + sizerColor}"></span>
        </div>
    `,
        get _allowDrop(){
            return this.dragMode?.includes?.(this);
        },
        expand(){
            this.column.$expanded = !this.column.$expanded;
            this.$next(()=>{
                this.heightResize();
            })


            // this.debounce('expand', ()=>{
            //     if (this.column.$expanded){
            //         const width = this.getBoundingClientRect().width;
            //         this.column.items?.forEach(col=>{
            //             col.$width = col.$width || width / this.column.items.length;
            //         })
            //     }
            // }, 100)
        },
        get columns(){
            if (!this.column?.$expanded)
                return [];
            return this.column?.items?.map((col, idx)=>{
                col.$width = col.$width || 0;
                col.checked = (col.checked === undefined && !col.hidden) || col.checked
                return col
            }).filter(col=> col.checked !== false && !this.groups.includes(col))
        },
        orderStep: 0,
        sort(){
            switch (this.column.$sort){
                case 1:{
                    this.column.$sort++;
                } break;
                case 2:{
                    delete this.column.$sort;
                    this.sorts.splice(this.sorts.indexOf(this.column),1);
                } break;
                default:{
                    this.column.$sort = 1;
                    this.sorts.push(this.column);
                }
            }
            this.sortId = undefined;
        },
        filter: undefined,
        parentItems: null,
        get sortId(){
            return (this.sorts.indexOf(this.column) + 1) || '';
        },
        props:{
            title:{
                get(){
                    return (this.column?.label ||  this.column?.name)/*+(this.column.$width || '')+':'+(this.column.width || '')+':'+this.test*/;
                },
                reflectToAttribute: true
            }

        },
        column: null,
        listeners:{
            resize(e) {
                e.stopPropagation();
                // if (!this.column?.$expanded) return;
                const width = Math.round(this.getBoundingClientRect().width);
                // if (!width) return;
                // this.columns?.forEach(col => {
                //     col.$width = col.$width || width / this.columns.length;
                // })
                this.column.$width = this.column.$width || width;
            }
        },
        getStyle(){
            const min = this.iconSize / 2 *  (this.column?.items?.length || 1);
            const res  = {minWidth: min + 'px'};
            if (this.column.width){
                if (this.autoWidth && this.last){
                    res.width = 'auto';
                }
                else if (!this.column?.$expanded || this.getBoundingClientRect().width <= this.column.width)
                    res.width = this.column.width + 'px';
                else
                    res.width = 'auto';
            }
            else{
                res.width = 'auto';
            }
            return res;
        },
        test: '',
        get hideSizer(){
            return ((this.fix || this.autoWidth) && this.last && (this.domHost?.localName !== this.localName ||  (this.domHost?.last && this.domHost?.hideSizer)));
        },
        last: false,
        onColSizeTrack(e){
            const target = e.detail.target.parentElement;
            switch(e.detail.state){
                case 'start':{
                    if (this.autoWidth){
                        let stopElement = this;
                        let dom = this.domHost;
                        while (dom){
                            const columns = dom.$$(this.localName);
                            if (!columns.length)
                                break;
                            for (let col of columns){
                                if (col === stopElement) break;
                                col.style.maxWidth = col.style.width = col.column.$width + 'px';
                                col.column.$width = col.column.width = col.getBoundingClientRect().width;
                            }
                            stopElement = dom;
                            dom = dom.domHost;
                        }
                    }
                    let items = this.column.items;
                    while (items){
                        const last = items.last;
                        if (last)
                            last.width = 0;
                        items = last?.items;
                    }
                    if (this.last) {
                        let host = this.domHost;
                        while (host?.last) {
                            host.column.width = 0;
                            host = host.domHost;
                        }
                    }
                } break;
                case 'track':{
                    const pos = e.detail.target.getBoundingClientRect().x + e.detail.target.getBoundingClientRect().width;
                    if ((e.detail.ddx < 0 && e.detail.x < pos) || (e.detail.ddx > 0 && e.detail.x > pos)) {
                        if (this.column.items?.length){
                            target.style.width = this.getBoundingClientRect().width + e.detail.ddx + 'px';
                            target.style.width = this.getBoundingClientRect().width+'px';
                        }
                        else
                            target.style.width = target.getBoundingClientRect().width + e.detail.ddx + 'px';
                    }
                    this.column.$width = this.column.width = target.getBoundingClientRect().width;
                    target.style.width = undefined;
                } break;
                case 'end': {
                    if (this.autoWidth){
                        for (let col of this.domHost.$$(this.localName)){
                            col.style.width = col.style.maxWidth = col.style.minWidth = '';
                        }
                    }
                } break;
            }
        },
        onMove(e) {
            switch (e.detail.state) {
                case 'start': {
                    this.style.backgroundColor = 'white';
                    this._elements = Array.from(this.parentElement.children);
                    this._items = this.domHost.column?.items || this.table.columns;
                    this._proxy = this.create('oda-table-drag-proxy', {label: this.title, ...e.detail.start});
                    document.body.appendChild(this._proxy);
                    this._current = this;
                    this._parentRect = this.parentElement.getBoundingClientRect();
                } break;
                case 'track': {
                    this._proxy.mode = 'move';
                    this._proxy.x = e.detail.x;
                    this._proxy.y = e.detail.y;
                    for (let panel in this.coords)
                        this[panel].remove(this.column);
                    if (this._parentRect.y > e.detail.y) {
                        this.dragMode = 'drag-to-group-panel';
                        for (let panel in this.coords){
                            const pos = this.coords[panel];
                            if(e.detail.y < pos.y) continue;
                            if(e.detail.y > (pos.y + pos.height)) continue;
                            if(e.detail.x < pos.x) continue;
                            if(e.detail.x > (pos.x + pos.width)) continue;
                            this[panel].add(this.column);
                        }
                    }
                    else if (this._parentRect.bottom < e.detail.y) {
                        this._proxy.mode = 'delete';
                    }
                    else{
                        this.dragMode = this._elements;
                        for (let el of this._elements){
                            if (el === this._current) continue;
                            const pos = el.getBoundingClientRect();
                            if (pos.x > e.detail.x || (pos.x + pos.width) < e.detail.x) continue;
                            const idx1 = this._items.indexOf(this._current.column);
                            const idx2 = this._items.indexOf(el.column);
                            if (Math.sign(e.detail.ddx) !== Math.sign(idx2 - idx1)) continue;
                            this._current.style.backgroundColor = '';
                            this._items[idx1] = el.column;
                            this._items[idx2] = this._current.column;
                            this._current = el;
                            this._current.style.backgroundColor = 'white';
                            // this.interval('column-replace', ()=>{
                            this.domHost.columns = undefined;
                            this.metadata = undefined;
                            this.cells = undefined;
                            // })
                        }
                    }
                } break;
                case 'end': {
                    this.dragMode = ''
                    if (this._proxy.mode === 'delete'){
                        this.column.checked = false;
                    }
                    this._proxy.remove();
                    this._current.style.backgroundColor = '';
                    this.domHost.columns = undefined;
                    this.metadata = undefined
                    this.cells = undefined;
                } break;
            }
        }
    })
    ODA({is: 'oda-table-drag-proxy',
        template:`
        <style>
            :host{
                visibility: visible !important;
                @apply --horizontal;
                align-items: center;
                @apply --raised;
                @apply --no-flex;
                @apply --content;
                position: fixed;
                opacity: 1 !important;
                @apply --disabled;
                max-width: 200px;
                overflow: hidden;
                white-space: nowrap;
                top: 0px;
                left: 0px;
                transform: translate3d({{x}}px, {{y}}px, 0px);
                backgroundColor: {{backgroundColor}} !important;
            }
        </style>
        <oda-icon icon-size="16" :icon style="margin: 4px;"></oda-icon>
        <span style="margin-right: 4px; text-overflow: ellipsis; overflow: inherit;">{{label}}</span>
    `,
        get backgroundColor(){
            switch (this.mode) {
                case 'delete':
                    return  'var(--error-color)';
            }
            return  'var(--success-color)';
        },
        get icon(){
            switch (this.mode) {
                case 'delete':
                    return  'icons:close';
            }
            return  'icons:open-with';
        },
        label: 'PROXY',
        mode: 'move',
        x: 0,
        y: 0
    })
}
groups:{
    ODA({is: 'oda-grid-groups',
        template:`
        <style>
            :host{
                @apply --horizontal;
                opacity: .8;
            }
            :host>div>div{
                /*margin: 2px;*/
                align-items: center;
                @apply --horizontal;
                overflow: hidden;
                height: 100%;
            }
            label{
                @apply --flex;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                @apply --disabled;
            }
            oda-icon{
                transform: scale(.5);
                @apply --disabled;
            }
        </style>
        <div class="horizontal flex" style="align-items: center;">
            <div id="groups" class="no-flex content" ~class="{success: dragMode === 'drag-to-group-panel', header: !dragMode}" @resize="_resize" style="min-width: 50%;">
                <oda-icon icon="device:storage"></oda-icon>
                <oda-group-item ~for="groups" :item="item"></oda-group-item>
                <label ~if="!groups?.length">Drag here to set row groups</label>
            </div>
            <div id="labels" ~if="pivotMode" class="flex content" ~class="{success: dragMode === 'drag-to-group-panel', header: !dragMode}" @resize="_resize" style="border-left: 1px solid var(--border-color); min-width: 50%;">
                <oda-icon icon="device:storage:90"></oda-icon>
                <oda-group-item ~for="labels" :item="item"></oda-group-item>
                <label ~if="!labels?.length">Drag here to set column labels</label>
            </div>
        </div>

        <oda-button :icon-size icon="icons:settings" @tap="showSettings" style="border-radius: 50%;"></oda-button>
    `,
        _resize(e){
            this.coords[e.target.id] = e.target.getBoundingClientRect();
        }
    })
    ODA({is: 'oda-group-item',
        template:`
        <style>
            :host{
                @apply --content;
                @apply --horizontal;
                align-items: center;
                @apply --no-flex;
                @apply --shadow;
                margin-right: 4px;
                border-radius: {{iconSize/6}}px !important;
            }
            label{
                margin: 2px 0px 2px 8px;
            }
        </style>
        <label>{{title}}</label>
        <oda-button :icon-size="iconSize/2" icon="icons:close" @tap="_delete"></oda-button>
     `,
        _delete(e){
            this[this.parentElement.id].remove(this.item);
            this.metadata = undefined;
        },
        get title(){
            return this.item?.label || this.item?.name;
        },
        item: null,
        listeners:{
            track(e){
                switch (e.detail.state) {
                    case 'start': {
                        this._proxy = this.create('oda-table-drag-proxy', {label: this.title, ...e.detail.start});
                        document.body.appendChild(this._proxy);
                        this._parentRect = this.parentElement.getBoundingClientRect();
                    } break;
                    case 'track': {
                        this._proxy.x = e.detail.x;
                        this._proxy.y = e.detail.y;
                        if (this._parentRect.bottom < e.detail.y) {
                            this._proxy.mode = 'delete';
                        }
                        else{
                            this._proxy.mode = 'move';
                        }
                    } break;
                    case 'end': {
                        if (this._proxy.mode === 'delete') {
                            this._delete();
                        }
                        this._proxy.remove();
                    } break;
                }
            }
        }

    })
}
footer:{
    ODA({is: 'oda-grid-footer',
        template: `
            <style>
                :host{
                    @apply --horizontal;
                    @apply --no-flex;
                    @apply --header;
                    @apply --raised;
                    overflow-y: scroll;
                    overflow-x: hidden;
                    border-top: 2px solid var(--border-color);
                }
            </style>
            <style>
                {{cellsClasses}}
            </style>
            <div class="flex horizontal" style="overflow: hidden;" :scroll-left="colsScrollLeft">
                <div class="horizontal" style="min-width: 100%; position: relative;" ~class="{flex: fix}">
                    <oda-grid-footer-cell :tabindex="idx" style="box-sizing: border-box; overflow: hidden;" ~for="(col, idx) in cells"  :column="col" ~class="'C'+idx+' cell'"></oda-grid-footer-cell>
                </div>
            </div>
        `,
        get cellsClasses(){
            return this.cells.map((cell, idx)=>{
                const w = cell.$width;
                return `.C${idx}{
                min-width: ${w}px;
                max-width: ${w}px;
                width: ${w}px;
            }`;
            }).join('\r\n');
        },
        get header(){
            return this;
        },
        listeners:{
            resize(e){
                this.heightResize(this.localName);
            }
        }
    })
    ODA({is:'oda-grid-footer-cell',
        template:`
            <style>
                :host{
                    @apply --horizontal;
                    padding: 4px;
                    border-right: 1px solid var(--border-color);
                    height: 100%;
                    align-items: center;
                }
            </style>
            <div class="flex">
                footer {{column?.name}}
            </div>
        `
    })
}
cells: {
    ODA({is: 'oda-grid-cell-base', template: /*html*/`
        <style>
            :host {
                @apply --horizontal;
                align-items: center;
                overflow: hidden;
                text-overflow: ellipsis;
                min-height: 1px;
                min-width: 1px;
            }
            :host * {
                text-overflow: ellipsis;
                position: relative;
            }
            .expander {
                cursor: pointer;
            }
        </style>`,
        row: null,
        column: null,
        get value(){
            return this.row?.[this.column?.name]
        },
        props: {
            template: 'div',
        }
    });

    ODA({
        is: 'oda-grid-cell', extends: 'oda-grid-cell-base',
        template: /*html*/`
        <style>
            :host>div{
                white-space: nowrap;
                margin: 4px;
                width: 100%;
            }
        </style>
        <div class="flex" ~is="template" :column :row style="overflow: hidden">{{value}}</div>`,
    });

    ODA({is: 'oda-grid-tree-cell', extends: 'oda-icon, oda-grid-cell',
        template: /*html*/`
            <style>
                :host svg{
                    cursor: pointer;
                }
                :host{
                    padding-left: {{padding}}px;
                }
            </style>
        `,
        props:{
            icon(){
                return this.row.items?.length && (!this.row.$expanded?'icons:chevron-right':'icons:chevron-right:90') || '';
            }
        },
        get level(){
            return this.row?.$level || 0
        },
        get padding(){
            return this.level * this.iconSize;
        },
        listeners:{
            tap(e){
                if (e.sourceEvent.layerX > this.padding && e.sourceEvent.layerX < this.padding + this.iconSize){
                    e.stopPropagation();
                    this.row.$expanded = !this.row.$expanded;
                }
            }
        }
    })
}