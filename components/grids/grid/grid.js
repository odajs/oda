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
        <div class="flex horizontal">
            <div ~if="columns?.some(i=>i.fix === 'left')" class="horizontal header no-flex">
                <div class="vertical flex" @resize="correctPanelSize">
                    <oda-grid-header fix="left" ~if="showHeader"></oda-grid-header>
                    <oda-grid-body fix="left" class="flex"></oda-grid-body>
                    <oda-grid-footer fix="left" ~if="showFooter"></oda-grid-footer>
                </div>
                <oda-splitter></oda-splitter>
            </div>
            <div class="vertical flex" style="overflow: hidden;">
                <oda-grid-header ~if="showHeader"></oda-grid-header>
                <oda-grid-body class="flex"></oda-grid-body>
                <oda-grid-footer  ~if="showFooter"></oda-grid-footer>
            </div>
            <div ~if="columns?.some(i=>i.fix === 'right')" class="horizontal header no-flex">
                <oda-splitter></oda-splitter>
                <div class="vertical flex">
                    <oda-grid-header fix="right" ~if="showHeader"></oda-grid-header>
                    <oda-grid-body fix="right" class="flex"></oda-grid-body>
                    <oda-grid-footer fix="right" ~if="showFooter"></oda-grid-footer>
                </div>
            </div>      
        </div>
        <oda-button :icon-size icon="icons:settings" @tap="showSettings" style="position: absolute; right: 0px; top: 0px; z-index: 1; border-radius: 50%;"></oda-button>
    `,
    correctPanelSize(e){
        e.target.parentElement.style.minWidth =  e.target.offsetWidth+'px';
    },
    async showSettings(e){
        await ODA.import('@tools/property-grid');
        try{
            await ODA.showDropdown(
                'oda-property-grid',
                { inspectedObject: this.table, onlySave: true, style: 'max-width: 500px; min-width: 300px;' },
                { parent: e.target, intersect: true, align: 'left', title: 'Settings', hideCancelButton: true }
            );
        }
        catch (e){}
    },
    metadata:[],
    dataSet: [],
    get table(){
        return this;
    },
    get tableWidth(){
        return this.clientWidth;
    },
    headerResize(e){
        // return;
        this.interval('header-resize',()=>{
            const headers = this.table.$$('oda-grid-header')
            let height = 0;
            headers.forEach(h=>{
                h.style.height = '';
                if (height<h.offsetHeight)
                    height = h.offsetHeight;
            })
            headers.forEach(h=>{
                h.style.height = height+'px';
            })
        })
    },
    get columns(){
        return this.metadata;
    },
    get visibleColumns(){
        const convertColumns = (items)=>{
            return items.reduce((res, col)=>{
                if (!col.items?.length || !col.$expanded){
                    res.push(col);
                }
                else{
                    res.push(...convertColumns(col.items));
                }
                return res;
            }, [])
        }
        return convertColumns(this.columns)
    },
    props:{
        sizerColor:{
            default: 'gray',
            save: true,
            editor: '@oda/color-picker'
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
            set(n){
                this.async(()=>{
                    this.headerResize();
                })
            }
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
    colsScrollLeft: 0,
    colsTrack(e){
        switch (e.detail.state){
            case 'track':{
                const w = e.detail.target.scrollWidth - e.detail.target.offsetWidth
                this.colsScrollLeft -= e.detail.ddx;
                if (this.colsScrollLeft<0)
                    this.colsScrollLeft = 0
                else if (this.colsScrollLeft > w)
                    this.colsScrollLeft = w;
            } break;
        }
    }
})
ODA({is:'oda-grid-header',
    template: `
        <style>
            :host{
                border-top: 1px solid gray;
                @apply --horizontal;
                @apply --dark;
                overflow: hidden;
                @apply --raised;
            }
        </style>
        <div class="flex horizontal" style="overflow: hidden;" :scroll-Left="colsScrollLeft" @track="colsTrack">
            <div class="horizontal" style="min-width: 100%;" ~class="{flex: fix}">
                <oda-grid-header-cell ~for="headColumns" :last="item === items.last" :column="item" ~class="{flex: item === items.last && (fix || autoWidth), 'no-flex': item !== items.last}"></oda-grid-header-cell>
            </div>
        </div>
    `,
    get headColumns(){
        return this.columns?.filter(col=>((col.fix || '') === (this.fix || '')));
    },
    fix: ''
})
ODA({
    is: 'oda-grid-header-cell',
    template: `
        <style>
            :host{
                @apply --vertical;
                overflow: hidden;   
                cursor: pointer;
                @apply --header;
                order: {{column?.index || 0}};
            }
            oda-button{
                font-size: xx-small;
            }
            input{
                width: auto;
                max-height: {{iconSize * .7}}px;
                margin: 4px;
                width: 1px;
                outline: none;
            }
        </style>
        <div class="horizontal flex" style="align-items: center; overflow: hidden; border-bottom: 1px solid gray;" ~style="_style">
            <oda-icon ~if="column?.items" style="opacity: .3" :icon-size :icon="column?.$expanded?'icons:chevron-right:90':'icons:chevron-right'" @tap.stop="column.$expanded = !column.$expanded"></oda-icon>
            <span class="flex" style="text-overflow: ellipsis; overflow: hidden; margin: 8px;">{{column?.label || column?.name}}</span>
            <oda-icon @track="onMove" :icon="column?.$sort?(column.$sort>0?'icons:arrow-drop-up':'icons:arrow-drop-down'):'icons:apps'" :icon-size="iconSize/2" ~style="{opacity: column?.$sort>0?1:.1}">{{column.$sort}}</oda-icon>
            <span class="no-flex" style="width: 4px; height: 100%; cursor: col-resize;" ~style="{visibility: hideSizer?'hidden':'visible', 'border-right': '2px solid ' + sizerColor}" @track="onColSizeTrack"></span>
        </div>       
        <div ~if="column?.items" ~show="column?.$expanded" class="horizontal flex dark" >
            <oda-grid-header-cell ~for="column?.items" :column="item" ~class="{flex: item === items.last}" :last="item  === items.last"></oda-grid-header-cell>
        </div>
        <div class="horizontal" ~if="showFilter && !column?.$expanded"  ~style="_style">
            <input  class="flex" ::value="filter">
            <oda-icon icon="icons:filter" :icon-size="iconSize/3"></oda-icon>
            <span class="no-flex" style="width: 4px; height: 100%; border-right: 1px solid gray;"></span>
        </div>
    `,
    listeners:{
        resize(e){
            this.headerResize();
        }
    },
    get _style(){
        const min = Math.max((this.iconSize *  (this.column?.items?.length || 1) * 2), this.column?.minWidth || 0);
        return {minWidth: min+'px', width: this.column?.width?this.column?.width+'px':'auto'};
    },
    get hideSizer(){
        return ((this.fix || this.autoWidth) && this.last && (this.domHost?.localName !== this.localName ||  (this.domHost?.last && this.domHost?.hideSizer)));
    },
    last: false,
    onColSizeTrack(e){
        const target = e.detail.target.parentElement;
        switch(e.detail.state){
            case 'start':{
                target.style.width = target.offsetWidth + 'px';
                this.column.minWidth = 0;
            } break;
            case 'track':{
                this.resetUp();
                this.resetDown();
                const pos = e.detail.target.offsetLeft + e.detail.target.offsetWidth;
                if ((e.detail.ddx < 0 && e.detail.x < pos) || (e.detail.ddx > 0 && e.detail.x > pos)) {
                    if (this.column.items?.length){
                        target.style.width = this.offsetWidth + e.detail.ddx + 'px';
                        target.style.width = this.offsetWidth+'px';
                    }
                    else
                        target.style.width = target.offsetWidth + e.detail.ddx + 'px';
                }
                this.column.width = target.offsetWidth;
            } break;
            case 'end':{
                this.column.minWidth = target.offsetWidth;
                if (this.column.items?.length){
                    this.$next(()=>{
                        target.style.width = '';
                    },1)
                }
            } break;
        }
    },
    resetUp(){
        if (!this.lastInColumn || !this.domHost?.column) return;
        this.domHost.column.minWidth = 0;
        this.domHost.column.width = 0;
        this.domHost.resetUp?.();
    },
    resetDown(){
        const col = this.$$('oda-grid-header-cell').last;
        if (!col) return;
        col.column.minWidth = 0;
        col.column.width = 0;
        col.resetDown();
    },
    onMove(e){
        switch (e.detail.state){
            case 'track':{
                this.style.zIndex = 1;
                this.style.transform = `translate(${e.detail.dx}px)`;
                this.classList.add('shadow');
            } break;
            case 'end':{
                this.style.zIndex = 0;
                this.style.transform = '';
                this.classList.remove('shadow');
            } break;
        }
    },
})