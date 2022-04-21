ODA({is:'oda-grid', imports: '@oda/icon, @oda/button',
    template:`
        <style>
            :host{
                @apply --flex;
                @apply --vertical;
                overflow: hidden;
            }
        </style>   
        <oda-grid-header></oda-grid-header>
        <oda-grid-body></oda-grid-body>
        <oda-grid-footer></oda-grid-footer>
    `,
    metadata:[],
    dataSet: [],
    get columns(){
        return this.metadata;
    },
    props:{
        iconSize:{
            default: 24,
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
                <div class="no-flex horizontal">
                    <oda-grid-header-cell ~for="columns" :column="item"></oda-grid-header-cell>
                </div>
            </div>
            <oda-button :icon-size icon="icons:settings"></oda-button>
        </div>
    `,
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
ODA({is: 'oda-grid-cell',
    template:`
    
    `
})
ODA({is: 'oda-grid-header-cell',
    template:`
        <style>
            :host{
                @apply --vertical;
                overflow: hidden;   
                cursor: pointer;
                @apply --header;
            }
            oda-button{
                font-size: xx-small;
            }
        </style>
        <div class="horizontal flex" style="align-items: center; overflow: hidden; border-bottom: 1px solid black;" ~style="_style">
            <oda-icon ~if="column?.items" :icon-size :icon="column?.$expanded?'icons:chevron-right:90':'icons:chevron-right'" @tap.stop="column.$expanded = !column.$expanded"></oda-icon>
            <span class="flex" style="text-overflow: ellipsis; overflow: hidden; margin: 8px;">{{column?.label || column?.name}}</span>
            <oda-button disabled :icon="column?.$sort?(column.$sort>0?'icons:arrow-drop-up':'icons:arrow-drop-down'):''" :icon-size>{{column.$sort}}</oda-button>
            <span class="no-flex" style="width: 4px; height: 100%; cursor: col-resize; border-right: 1px solid black;" @track="onTrack"></span>
        </div>
        <div ~if="column?.items" ~show="column?.$expanded" class="horizontal flex" >
            <oda-grid-header-cell ~for="column?.items" :column="item" ~class="{flex: index === items.length-1, 'no-flex': index < items.length-1}" :last="index  === items.length-1"></oda-grid-header-cell>
        </div>
    `,
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