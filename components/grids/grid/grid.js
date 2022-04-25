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
            <div ~if="columns?.some(i=>i.fix === 'left')" class="horizontal header">
                <div class="vertical flex">
                    <oda-grid-header fix="left" ~if="showHeader"></oda-grid-header>
                    <oda-grid-body fix="left" class="flex"></oda-grid-body>
                    <oda-grid-footer fix="left" ~if="showFooter"></oda-grid-footer>
                </div>
                <oda-splitter></oda-splitter>
            </div>
            <div class="vertical flex">
                <oda-grid-header ~if="showHeader"></oda-grid-header>
                <oda-grid-body class="flex"></oda-grid-body>
                <oda-grid-footer  ~if="showFooter"></oda-grid-footer>
            </div>
            <div ~if="columns?.some(i=>i.fix === 'right')" class="horizontal header">
                <oda-splitter></oda-splitter>
                <div class="vertical flex">
                    <oda-grid-header fix="right" ~if="showHeader"></oda-grid-header>
                    <oda-grid-body fix="right" class="flex"></oda-grid-body>
                    <oda-grid-footer fix="right" ~if="showFooter"></oda-grid-footer>
                </div>
            </div>      
        </div>
    `,
    metadata:[],
    dataSet: [],
    get table(){
        return this;
    },
    get tableWidth(){
        return this.clientWidth;
    },
    get columns(){
        return this.metadata;
        // const convertMetadata = (items)=>{
        //     return items?.map((col, idx)=>{
        //         col.order = col.order || (idx + 1);
        //         if (col.treeMode)
        //             col.index = col.order - 500;
        //         switch (col.fix) {
        //             case 'left':
        //                 col.index = col.order - 1000;
        //                 break;
        //             case 'right':
        //                 col.index = col.order + 1000;
        //                 break;
        //             default:
        //                 col.index = col.order;
        //                 break;
        //         }
        //         convertMetadata(col.items)
        //         return col;
        //     }).sort((a,b)=>{
        //         return a.index>b.index?1:-1
        //     })
        // }
        // return convertMetadata(this.metadata);
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
                @apply --horizontal;
                @apply --dark;
                overflow: hidden;
            }
        </style>
        <div class="flex horizontal" style="overflow: hidden;" :scroll-Left="colsScrollLeft" @track="colsTrack">
            <div class="horizontal" style="min-width: 100%;">
                <oda-grid-header-cell ~for="headColumns" :column="item"></oda-grid-header-cell>
            </div>
        </div>
    `,
    get headColumns(){
        return this.columns?.filter(col=>col.fix == this.fix);
    },
    fix: '',
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
    get _style(){
        return {minWidth: (this.column?.minWidth || (this.iconSize * ((this.column?.items)?3:2)))+'px', width: this.column?.width || ''};
    },
})