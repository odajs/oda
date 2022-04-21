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
        <div class="horizontal flex" style="align-items: center; overflow: hidden; border-bottom: 1px solid black">
            <oda-icon ~if="column?.items" :icon-size :icon="column?.$expanded?'icons:chevron-right:90':'icons:chevron-right'" @tap.stop="column.$expanded = !column.$expanded"></oda-icon>
            <span class="flex" style="text-overflow: ellipsis; overflow: hidden; margin: 8px;">{{column?.label || column?.name}}</span>
            <oda-button disabled :icon="column?.$sort?(column.$sort>0?'icons:arrow-drop-up':'icons:arrow-drop-down'):''" :icon-size>{{column.$sort}}</oda-button>
            <span class="no-flex" style="width: 4px; height: 100%; cursor: col-resize; border-right: 1px solid black;" @track="onTrack"></span>
        </div>
        <div ~if="column?.items" ~show="column?.$expanded" class="horizontal flex">
            <oda-grid-header-cell ~for="column?.items" :column="item"></oda-grid-header-cell>
        </div>
    `,
    onTrack(e){

    },
    column: null,
})