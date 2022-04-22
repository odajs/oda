ODA({is:'oda-grid', imports: '@oda/icon, @oda/button, @tools/containers',
    template:`
        <style>
            :host{
                @apply --flex;
                @apply --vertical;
                overflow: hidden;
                justify-content: space-between;
            }
        </style>   
        <oda-grid-header ~if="showHeader"></oda-grid-header>
        <oda-grid-body class="flex"></oda-grid-body>
        <oda-grid-footer ~if="showFooter"></oda-grid-footer>
    `,
    metadata:[],
    dataSet: [],
    get table(){
        return this;
    },
    get columns(){
        return this.metadata.map((col, idx)=>{
            col.order = col.order || (idx + 1);
            if (col.treeMode)
                col.index = col.order - 500;
            switch (col.fix) {
                case 'left':
                    col.index = col.order - 1000;
                    break;
                case 'right':
                    col.index = col.order + 1000;
                    break;
                default:
                    col.index = col.order;
                    break;
            }
            return col;
        }).sort((a,b)=>{
            return a.index>b.index?1:-1
        })
    },
    get visibleColumns(){
        return this.columns;
    },
    props:{
        iconSize:{
            default: 24,
            save: true
        },
        showFilter:{
            default: true,
            save: true
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

})
ODA({is:'oda-grid-header',
    template: `
        <style>
            :host{
                @apply --vertical;
                @apply --dark;
                overflow: hidden;
            }
        </style>
        <oda-grid-groups></oda-grid-groups>
        <div class="flex horizontal">
             <div class="flex horizontal" style="overflow: hidden;" :scroll-Left="colsScrollLeft" @track="onTrack">
                <div class="no-flex shadow horizontal">
                    <oda-grid-header-cell ~for="columns" :column="item"></oda-grid-header-cell>
                </div>
            </div>
            <oda-button :icon-size icon="icons:settings" @tap="showSettings"></oda-button>
        </div>
    `,
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
    onTrack(e){
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


ODA({is: 'oda-grid-header-cell',
    template:`
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
        <div is="style" ~if="column?.fix === 'left'">
            :host{
                border-right: 1px solid gray;
                z-index: 2;
                position: sticky;
                left: {{left}}px;
            }
        </div>
        <div is="style" ~if="column?.fix === 'right'">
            :host{
                border-left: 1px solid gray;
                z-index: 1;
                position: sticky;
                right: {{right}}px;
            }
        </div>
        <div class="horizontal flex" style="align-items: center; overflow: hidden; border-bottom: 1px solid gray;" ~style="_style">
            <oda-icon ~if="column?.items" style="opacity: .3" :icon-size :icon="column?.$expanded?'icons:chevron-right:90':'icons:chevron-right'" @tap.stop="column.$expanded = !column.$expanded"></oda-icon>
            <span class="flex" style="text-overflow: ellipsis; overflow: hidden; margin: 8px;">{{column?.label || column?.name}}</span>
            <oda-icon @track="onMove" :icon="column?.$sort?(column.$sort>0?'icons:arrow-drop-up':'icons:arrow-drop-down'):'icons:apps'" :icon-size="iconSize/2" ~style="{opacity: column?.$sort>0?1:.1}">{{column.$sort}}</oda-icon>
            <span class="no-flex" style="width: 4px; height: 100%; cursor: col-resize; border-right: 1px solid gray;" @track="onTrack"></span>
        </div>       
        <div ~if="column?.items" ~show="column?.$expanded" class="horizontal flex dark" >
            <oda-grid-header-cell ~for="column?.items" :column="item" ~class="{flex: index === items.length-1, 'no-flex': index < items.length-1}" :last="index  === items.length-1"></oda-grid-header-cell>
        </div>
        <div class="horizontal" ~if="showFilter && !column?.$expanded"  ~style="_style">
            <input  class="flex" ::value="filter">
            <oda-icon icon="icons:filter" :icon-size="iconSize/3"></oda-icon>
            <span class="no-flex" style="width: 4px; height: 100%; border-right: 1px solid gray;"></span>
        </div>
    `,
    get left(){
        const pr = this.previousElementSibling;

        if (pr && this.colsScrollLeft){
            pr.column.width;
            return (pr.left + pr.offsetWidth);
        }

        return 0;
    },
    get right(){
        const pr = this.nextElementSibling;
        if (pr && this.colsScrollLeft){
            pr.column.width;
            return (pr.right + pr.offsetWidth);
        }
        return 0;
    },
    onMove(e){
        switch (e.detail.state){
            case 'track':{
                this.style.zIndex = 1;
                this.style.transform = `translate(${e.detail.dx}px)`;
                this.classList.add('shadow');
            } break;
            case 'end':{
                this.style.zIndex = ''
                this.style.transform = ''
                this.classList.remove('shadow')
            } break;
        }
    },
    filter: '',
    get _style(){
        return {minWidth: (this.column?.minWidth || (this.iconSize * ((this.column?.items)?3:2)))+'px', width: this.column?.width || ''};
    },
    last: false,
    onTrack(e){
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
        if (!this.last || !this.domHost?.column) return;
        this.domHost.column.minWidth = 0;
        this.domHost.column.width = 0;
        this.domHost.resetUp?.();
    },
    resetDown(col){
        if (col){
            col.minWidth = 0;
            col.width = 0
        }
        else{
            col = this.column;
        }
        col = col?.items?.[this.column.items.length-1];
        if (col)
            this.resetDown(col)
    },
    column: null,
})

ODA({is: 'oda-grid-footer',
    template: `
        <style>
            :host{
                @apply --horizontal;
                @apply --dark;
                overflow: hidden;
            }
        </style>
        <div class="horizontal" :scroll-Left="colsScrollLeft">
            <oda-grid-footer-cell ~for="columns" :column="item"></oda-grid-footer-cell>
        </div>
        
    `
})

ODA({is: 'oda-grid-footer-cell',
    template: `
        <style>
            :host{
                @apply --horizontal;
                align-items: center;
                min-width: {{(column?.minWidth || (iconSize * ((column?.items)?3:2)))}}px;
                width: {{column?.width}}px;
                order: {{column?.index || 0}};
                /*overflow: hidden;*/
            }
        </style>
        <div class="flex" style="padding: 4px;">f:{{column?.label || column?.name || ''}}</div>
        <span class="no-flex" style="width: 4px; height: 100%;  border-right: 1px solid white; text-overflow: ellipsis;"></span>
    `,
    column: null,
})