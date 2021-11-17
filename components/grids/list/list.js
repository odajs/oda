ODA({ is: 'oda-list', imports: '@oda/icon', template: /*html*/`
    <style>
        :host {
            overflow: auto;
        }
    </style>
    <ul ~is="tag" class="vertical shadow" :type="marker" style="overflow-x: hidden; margin: 0px;" ~style="{padding: (marker === 'none')?'4px':''}" >
        <li ~for="items" :item="item" :focused="item === focusedItem" ~class="marker==='none' && !numerable ? 'horizontal' : ''" @down.stop="_select($event, item)" style="text-overflow:ellipsis; overflow: hidden; box-sizing: border-box; border-bottom: 1px solid transparent" :type="item.marker" :style="{height: iconSize + 'px'}" :title="item.label">
            <span ~is="item?.template || itemTemplate" :item="item" class="horizontal" style="align-items: center;"><oda-icon ~if="item.icon" :icon="item.icon"></oda-icon>{{item}}</span>
        </li>
    </ul>`,
    props:{
        itemTemplate:'span',
        iconSize: {
            default: 24,
            shared: true
        },
        numerable: false,
        marker:{
            default: 'none',
            list: ('none|circle|disc|square').split('|')
        },
        tag:{
            get(){
                return this.numerable?'ol':'ul';
            }
        },
        focusedItem: {
            default: null
        },
        items: [],
        selection: []
    },
    down(){
        if (!this.focusedItem)
            this.focusedItem = this.items[0];
        else{
            const idx = this.items.indexOf(this.focusedItem)
            this.focusedItem = this.items[idx+1] || this.focusedItem;
        }
    },
    up(){
        if (!this.focusedItem)
            this.focusedItem = this.items[0];
        else{
            const idx = this.items.indexOf(this.focusedItem)
            this.focusedItem = this.items[idx-1] || this.focusedItem;
        }

    },
    pageUp(){

    },
    pageDown(){

    },
    home(){
        this.focusedItem = this.items[0];
    },
    end(){
        this.focusedItem = this.items[this.items.length-1];
    },
    _select(e, item){
        this.focusedItem = item;
        this.fire('ok');
    }
});