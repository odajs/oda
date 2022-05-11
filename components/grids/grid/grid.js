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
            <div ~if="columns?.some(i=>i.fix === 'left')" class="raised horizontal header no-flex" style="overflow: hidden; max-width: 30%;">
                <oda-grid-part @resize="correctPanelSize" fix="left"  ></oda-grid-part>
                <oda-splitter save-key="left-fix" :size="sizerWidth" :color="sizerColor"></oda-splitter>
            </div>
            <oda-grid-part style="overflow: hidden;"></oda-grid-part>
            <div ~if="columns?.some(i=>i.fix === 'right')" class="raised horizontal header no-flex" style="overflow: hidden; max-width: 30%;">
                <oda-splitter save-key="right-fix" :size="sizerWidth" :color="sizerColor"></oda-splitter>
                <oda-grid-part fix="right"></oda-grid-part>
            </div>
        </div>
        
    `,
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
    metadata:[],
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
        this.interval('header-resize',()=>{
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
        })
    },
    get columns(){
        return this.metadata.map((col, idx)=>{
            col.$order = /*col.$order || */((idx + 1) * this.orderStep);
            return col
        });
    },
    orderStep: 1000000,
    get cells(){
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
        return convertColumns(this.columns)
    },
    props:{
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
ODA({
    is: 'oda-grid-part',
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
    fix: '',
    get columns() {
        return this.table.columns?.filter(col => ((col.fix || '') === (this.fix || '')));
    },
    get cells() {
        return this.table.cells?.filter(col => ((col.fix || '') === (this.fix || '')));
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
                <oda-grid-header-cell ~show="item?.checked" :order-step="orderStep/10" ~for="columns" :last="item === items.last" :column="item" :parent-items="items" ~style="{order: item.$order}" ~class="getColumnClass(items, item, true)"></oda-grid-header-cell>
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
        <div class="horizontal flex" style="align-items: center; overflow: hidden; border-bottom: 1px solid gray;" ~style="getStyle()" @tap="sort()" @track="onMove">
            <oda-icon ~if="column?.items" style="opacity: .3" :icon-size :icon="column?.$expanded?'icons:chevron-right:90':'icons:chevron-right'" @tap.stop="column.$expanded = !column.$expanded"></oda-icon>
            <span class="flex" style="text-overflow: ellipsis; overflow: hidden; padding: 4px 0px 4px 8px;">{{title}}</span>
            <oda-icon style="opacity: .5" ~show="getBoundingClientRect().width > iconSize * 2"  :icon="column?.$sort?(column.$sort === 2?'icons:arrow-forward:270':'icons:arrow-forward:90'):''" :icon-size="iconSize/2" >{{column.$sort}}</oda-icon>
            <span style="position: absolute; top: 0px; right: 0px; font-size: xx-small; margin: 2px; opacity: .5">{{sortId}}</span>
            <span class="no-flex" style="height: 90%; cursor: col-resize;" ~style="{width: sizerWidth + 3 + 'px',visibility: hideSizer?'hidden':'visible', 'border-right': sizerWidth+'px solid ' + sizerColor}" @track="onColSizeTrack"></span>
        </div>
        <div ~if="column?.items" ~show="column?.$expanded" class="horizontal flex dark" >
            <oda-grid-header-cell ~show="item?.checked" :order-step="orderStep/10" ~for="columns" :column="item" :parent-items="items" ~class="getColumnClass(items, item)" :last="item === items.last" ~style="{order: item.$order}" ></oda-grid-header-cell>
        </div>
        <div class="horizontal flex" style="align-items: center;" ~if="showFilter && !column?.$expanded" ~style="{maxHeight: iconSize+'px'}">
            <input class="flex" ::value="filter" ~style="{visibility: (getBoundingClientRect().width > iconSize * 2)?'visible':'hidden'}">
            <oda-icon  icon="icons:filter" :icon-size="iconSize * .5" style="padding: 0px;"></oda-icon>
            <span class="no-flex" style="height: 100%;" ~style="{width: sizerWidth + 3 + 'px', visibility: hideSizer?'hidden':'visible', 'border-right': sizerWidth+'px solid ' + sizerColor}"></span>
        </div>
    `,
    get columns(){
        return this.column?.items?.map((col, idx)=>{
            col.$order = /*col.$order || */((idx+1) * this.orderStep + this.column.$order);
            return col
        })
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
            this.interval('column-resize', ()=>{
                this.headerResize();
                this.column.$width = this.getBoundingClientRect().width;
            })

        }
    },
    getStyle(){
        const min = this.iconSize / 2 *  (this.column?.items?.length || 1);
        const res  = {minWidth: min + 'px'};
        if (this.column.width){
            if (this.autoWidth && this.last){
                res.width = 'auto';
                // res.minWidth = this.column.width +'px';
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
                this._proxy = this.create('oda-table-drag-proxy', {label: this.title, ...e.detail.start});
                document.body.appendChild(this._proxy);
            } break;
            case 'track': {
                this._proxy.x = e.detail.x;
                this._proxy.y = e.detail.y;
                if (this.parentElement.getBoundingClientRect().y > e.detail.y) {

                }
                else{
                    for (let el of this._elements){
                        if (el === this) continue;
                        const pos = el.getBoundingClientRect();
                        if (pos.x > e.detail.x || (pos.x + pos.width) < e.detail.x) continue;
                        if (Math.sign(e.detail.ddx) !== Math.sign(el.column.$order - this.column.$order)) continue;
                        const order = this.column.$order;
                        this.column.$order = el.column.$order;
                        el.column.$order = order;
                    }
                }
            } break;
            case 'end': {
                this._proxy.remove();
                this.style.backgroundColor = '';
                this.style.opacity = '';
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
                align-items: center;
                opacity: .8;
            }
            div{
                align-items: center;
                @apply --horizontal;
            }
            oda-icon{
                transform: scale(.5);
            }
        </style>
        <div class="flex">
            <oda-icon class="disabled" icon="device:storage"></oda-icon>
            <label class="disabled" if="groups.length">Drag here to set row groups</label>
            <div ~for="groups">{{item}}</div>
        </div>
        <div ~if="pivotMode" class="flex" style="border-left: 1px solid var(--border-color)">
            <oda-icon class="disabled" icon="device:storage:90"></oda-icon>
            <label class="disabled" if="groups.length">Drag here to set column labels</label>
            <div ~for="labels">{{item}}</div>
        </div>
        <oda-button :icon-size icon="icons:settings" @tap="showSettings" style="border-radius: 50%;"></oda-button>

    `,
})
ODA({is: 'oda-grid-body',
    template: `
        <style>
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
            }
            .cell{
                border-bottom: {{rowLines?'1px solid gray':'none'}};
                @apply --no-flex;
                overflow: hidden;
                text-overflow: ellipsis;
                border-right: {{colLines?'1px solid gray':'none'}};
            }
        </style>
        <div is="style">
        {{getCellsClasses()}}
        </div>
        <div class="vertical no-flex">
            <div class="row" ~for="row in rows">
                <div ~show="col?.checked" :tabindex="col.$order" style="box-sizing: border-box; overflow: hidden;" ~for="col in cells" :col="col"  ~class="'C'+col.$order+' cell'">{{row[col.name]}}</div>
            </div>
        </div>
    `,
    getCellsClasses(){
        return this.cells.map(cell=>{
            return `.C${cell.$order}{
                order: ${cell.$order};
                min-width: ${cell.$width}px;
                max-width: ${cell.$width}px;
                width: ${cell.$width}px;
            }`;
        }).join('\r\n');
    },
    listeners:{
        scroll(e){
            this.rowsScrollTop = this.scrollTop;
            this.colsScrollLeft = this.scrollLeft;
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
ODA({is:'oda-grid-settings', imports: '@tools/property-grid, @oda/tree',
    template:`
        <style>
            :host{
                @apply --horizontal;
                width: 300px;
                min-height: 100vh;
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
                /*border-left: 2px solid var(--focused-color);*/
                background-color: var(--content-background) !important;
                box-shadow: inset 2px 0 0 0  var(--focused-color) !important;
            }
        </style>
        <oda-tree allow-check="double" ~show="focusedTab === 0" :data-set="table.columns"></oda-tree>
        <oda-property-grid ~show="focusedTab === 2" only-save :inspected-object="table"></oda-property-grid>
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