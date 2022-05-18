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
            <div ~if="metadata[0].items.some(col=>col.checked)" class="raised horizontal header no-flex" style="overflow: hidden; max-width: 30%;">
                <oda-grid-part @resize="correctPanelSize" fix="left"></oda-grid-part>
                <oda-splitter save-key="left-fix" :size="sizerWidth" :color="sizerColor"></oda-splitter>
            </div>
            <oda-grid-part style="overflow: hidden;"></oda-grid-part>
            <div ~if="metadata[2].items.some(col=>col.checked)" class="raised horizontal header no-flex" style="overflow: hidden; max-width: 30%;">
                <oda-splitter save-key="right-fix" :size="sizerWidth" :color="sizerColor"></oda-splitter>
                <oda-grid-part fix="right"></oda-grid-part>
            </div>
        </div>
        
    `,
    coords:{},
    correctPanelSize(e){
        e.target.parentElement.style.minWidth =  e.target.getBoundingClientRect().width+'px';
    },
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
    get rows(){
        return this.dataSet;
    },
    get table(){
        return this;
    },
    get tableWidth(){
        return this.clientWidth;
    },
    headerResize(e){
        if (this._headerResize) return;
        this._headerResize = true;
        const parts = this.table.$$('oda-grid-part');
        const headers = parts.map(part=>{
            return part.$$('oda-grid-header');
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
        this.debounce('_headerResize', ()=>{
            this._headerResize = false;
        })
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
            return this.defaultTreeTemplate;
        let template = col.template || row.template || this.defaultTemplate;
        if (typeof template === 'object')
            return template.tag || template.is || template.template;
        return template;
    },
    props:{
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
                width: 1,
                color: 'red'
            },
            save: true
        },
        sizerColor:{
            default: 'gray',
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
            ::-webkit-scrollbar {
                width: {{!nextElementSibling?6:0}}px;
                height: 6px;
            }
            ::-webkit-scrollbar-thumb {          
                background: var(--header-background);
                -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
            }
            ::-webkit-scrollbar-thumb:hover {
                @apply --dark;
                width: 16px;
            }
            :host{
                @apply --header;
                @apply --vertical;
                @apply --flex;
                overflow: hidden;
                max-height: 100%;
            }
        </style>
        <oda-grid-header  ~if="showHeader"></oda-grid-header>
        <oda-grid-body :even-odd class="flex" :scroll-top="rowsScrollTop"></oda-grid-body>
        <oda-grid-footer  ~if="showFooter"></oda-grid-footer>
    `,
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

ODA({is:'oda-grid-header',
    template: `
        <style>
            :host{
                @apply --no-flex;
                position: relative;
                border-top: 1px solid gray;
                @apply --horizontal;
                overflow: hidden;
                @apply --raised;
                overflow-y: scroll;
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
            this.headerResize();
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
        <div class="horizontal flex" style="align-items: center; overflow: hidden; border-bottom: 1px solid gray;" ~style="getStyle()" @tap="sort()" @track="onMove" ~class="{disabled: dragMode && !_allowDrop, success: _allowDrop}">
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
        if (!this.column.$expanded){
            const width = this.getBoundingClientRect().width;
            this.column.items?.forEach(col=>{
                col.$width = col.$width || width / this.column.items.length;
            })
        }
        this.column.$expanded = !this.column.$expanded;
    },
    get columns(){
        return this.column?.items?.map((col, idx)=>{
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
        resize(e){
            e.stopPropagation();
            const width = this.getBoundingClientRect().width;
            if (!width) return;
            this.column.items?.forEach(col=>{
                col.$width = col.$width || width / this.column.items.length;
            })
            this.column.$width = width;
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
            } break;
            case 'track': {
                this._proxy.x = e.detail.x;
                this._proxy.y = e.detail.y;
                for (let panel in this.coords)
                    this[panel].remove(this.column);
                if (this.parentElement.getBoundingClientRect().y > e.detail.y) {
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
                        this.cells = undefined;
                        this.domHost.columns = undefined;
                        this.metadata = undefined;
                        this._current.style.backgroundColor = 'white';
                    }
                }
            } break;
            case 'end': {
                this.dragMode = ''
                this._proxy.remove();
                this._current.style.backgroundColor = '';
                this.domHost.columns = undefined;
                this.metadata = undefined;
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
            }
        </style>
        <oda-icon icon-size="16" :icon style="margin: 4px;"></oda-icon>
        <span style="margin-right: 4px; text-overflow: ellipsis; overflow: inherit;">{{label}}</span>
    `,
    icon: 'icons:open-with',
    label: 'PROXY',
    x: 0,
    y: 0
})
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
        <label>{{item?.label || item?.name}}</label>
        <oda-button :icon-size="iconSize/2" icon="icons:close" @tap="_delete"></oda-button>
     `,
    _delete(e){
        this[this.parentElement.id].remove(this.item);
        this.metadata = undefined;
    },
    item: null,
    listeners:{
        track(e){
            switch (e.detail.state) {
                case 'start': {
                } break;
                case 'track': {
                } break;
                case 'end': {
                } break;
            }
        }
    }

})
ODA({is: 'oda-grid-body',
    template: `
        <style>
            /*:host([even-odd]) .row:not([selected]):nth-child(odd):not([role]):not([dragging])!*>.cell:not([fix])*! {*/
            /*    background-color: rgba(0,0,0,.05);*/
            /*}*/
            :host([even-odd]) .row:not([selected]):nth-child(odd):not([role]):not([dragging])>.cell:not([fix]) {
                background-color: rgba(0,0,0,.05);
            }
            :host{
                overflow-x: auto !important;
                @apply --vertical;
                @apply --flex;
                @apply --content;
                overflow-y: scroll;
            }
            .row{
                @apply --horizontal;
                @apply --content;
                min-height: {{rowHeight}}px;
                max-height: {{rowHeight}}px;
                height: {{rowHeight}}px;
                flex: {{(autoWidth || fix)?1:0}};
                /*border-bottom: {{rowLines?'1px solid gray':'none'}};*/
            }
            .cell{
                @apply --no-flex;
                overflow: hidden;
                text-overflow: ellipsis;
                border-right: {{colLines?'1px solid gray':'none'}};
                border-bottom: {{rowLines?'1px solid gray':'none'}};
            }
        </style>
        <style>
        {{cellsClasses}}
        </style>
        <div class="vertical no-flex">
            <div class="row" ~for="row in rows">
                <div ~is="getTemplateTag(row, col)"  :tabindex="idx" style="box-sizing: border-box; overflow: hidden;" ~for="(col, idx) in cells"  :column="col" :row="row"  ~class="'C'+idx+' cell'"></div>
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
    listeners:{
        scroll(e){
            this.rowsScrollTop = this.scrollTop;
            this.colsScrollLeft = this.scrollLeft;
        },
        wheel(e){
            if (e.ctrlKey || e.altKey) return;
            e.preventDefault();
            if (e.shiftKey){
                this.colsScrollLeft += e.deltaY;
                this.scrollLeft = this.colsScrollLeft;
            }
            else{
                this.rowsScrollTop += e.deltaY;
                this.scrollTop = this.rowsScrollTop;
            }
        }
    }
})
ODA({is: 'oda-grid-footer',
    template: `
        <style>
            :host{
                @apply --no-flex;
                @apply --header;
                @apply --raised;
                overflow-y: scroll;
            }
        </style>
            footer
    `
})
ODA({is:'oda-grid-settings', imports: '@tools/property-grid, @oda/tree, @oda/splitter',
    template:`
        <style>
            :host{
                @apply --horizontal;
                width: 300px;
                @apply --flex;
                height: 100vh;
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
            div>div[focused]{
                background-color: var(--content-background) !important;
            }
        </style>
        <oda-splitter align="vertical"></oda-splitter>
        <div class="content flex vertical" style="padding: 4px; overflow: hidden;">
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
        column: null
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
        get value(){
            return this.row?.[this.column?.name]
        },
        props: {
            template: 'div',
        }
    });
}