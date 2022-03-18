/* * hexagon-layout.js v1.0
 * (c) 2021 R.A.Perepelkin
 * proman62@gmail.com
 * Under the MIT License.
 */

ODA({is: 'oda-hexagon-layout',
    template:`
          <style>
              :host{
                  @apply --vertical;
                  @apply --flex;
                  justify-content: start;
                  overflow: hidden;
                  background: {{background}};
                  margin:  -{{h / 2 }}px -{{size / 2 + distance}}px;
                  
                  
              }
              :host([tracking]):before{
                    content: "";
                    position: absolute;
                    left: {{tr.left}}px;
                    top: {{tr.top}}px;
                    width: {{tr.width}}px;
                    height: {{tr.height}}px;
                    @apply --content;
                    opacity: .5
                }
          </style>
          <oda-hexagon-row class="no-flex" :distance ~for="rows" :y="index" ~style="{marginLeft: \`\${index%2?0:(size / 2)+distance}px\`, marginTop: \`\${h/4+distance + 1}px\`, zIndex: + rows - index}"></oda-hexagon-row>
      `,
    width: 5,
    height: 5,
    tr: {},
    get size(){
        return Math.max(this.iconSize, 32) * 2;
    },
    get h(){
        return (this.size / (Math.sqrt(3)/2));
    },
    props:{
        iconSize: {
            default: 48,
            save: true,
        },
        color1: {
            default: 'whitesmoke',
            save: true,
            editor: '@oda/color-picker'
        },
        color2: {
            default: 'silver',
            save: true,
            editor: '@oda/color-picker'
        },
        background: {
            default: 'white',
            save: true,
            editor: '@oda/color-picker'
        },
        full: true,
        distance: 1,
        data: {
            default: [],
            save: true,
            readOnly: true,
        },
        tracking:{
            type: Boolean,
            reflectToAttribute: true,
            readOnly: true,
        }
    },
    get rows(){
        return Math.ceil(this.height/this.size)+1
    },
    set showTrash(n){
        this.trashItem.x = Math.floor(this.offsetWidth/(this.size + this.distance * 2))-2;
        this.trashItem.y =  Math.floor(this.offsetHeight/(this.h + this.distance * (Math.sqrt(3)/2) * 2))+1;
    },
    listeners:{
        resize(e){
            this.interval('resize', ()=>{
                this.height = this.offsetHeight;
                this.width = this.offsetWidth;
                //     this.height = Math.ceil(this.offsetHeight / this.size ) * this.size  + 1;
                // if (this.height<this.offsetHeight)
                //     this.height = Math.ceil(this.offsetHeight / this.size ) * this.size  + 1;
                // if (this.width<this.offsetWidth)
                //     this.width = Math.ceil(this.offsetWidth / this.size ) * this.size ;
            })
        },
        track(e){
            if(focusedHex) return;
            e.stopPropagation();
            switch (e.detail.state){
                case 'start':{
                    this.tracking = true;
                    this.tr = {left: e.detail.x, top: e.detail.y, width: 0, height: 0};
                } break;
                case 'track':{
                    this.tr.width =  e.detail.x-this.tr.left;
                    this.tr.height =  e.detail.y-this.tr.top;
                    this.render();
                } break;
                case 'end':{
                    this.tracking = false;
                    this.tr = {};
                } break;
            }
        }
    },
    addItem(item) {
        let row = this.data.find(i=>(i.y === (item.y || 0)))
        if (!row)
            this.data.push(row = {y:item.y || 0, items: []});
        if (row.items.find(i=>i.x === (item.x || 0))){
            return ODA.push(`item in cell[${item.x||0},${item.y || 0}]already exist!`)
        }
        return row.items.push(item);
    },
    removeItem(item) {
        let row = this.data.find(i=>(i.y === (item.y || 0)))
        if (!row) return;
        const idx = row.items.findIndex(i=>i.x === (item.x || 0))
        row.items.splice(idx, 1);
    },
    __drop(e, hex){
        console.warn('method __drop not implemented!');
    },
    get trashItem(){
        return {background: 'red', x:1,  y:1, allowDrop: true, is: 'oda-icon', props:{
                icon:'icons:delete', iconSize: this.size / 2
            }}
    }
})


ODA({is: 'oda-hexagon-row',
    template:`
          <style>
              :host{
                  @apply --horizontal;
                  @apply --no-flex;
                  justify-content: start;
                  
              }
          </style>
          <oda-hexagon ~style="{margin: '0px '+distance+'px'}" class="no-flex" ~for="cols" :x="index" :y></oda-hexagon>
      `,
    get items(){
        return this.data?.filter(i => (i.y === this.y)) || [];
    },
    props:{
        y:0,
        cols(){
            return Math.ceil(this.width/this.size)+1
        }
    },
    __drop(...e){
        this.domHost.__drop(...e);
    },
    add(item) {
        let res = this.data.add(item);
        // this.data = [...this.data]
        return res;
    },
    remove(item) {
        this.data?.remove(item);
        // this.data = [...this.data];
    }
})



ODA({is: 'oda-hexagon',
    template:`
        <style>
        :host {
            position: relative;
            background: linear-gradient({{active?background:color1}}, {{active?background:color2}});
            justify-content: center;
            position: relative;
            width: {{size}}px;
            height: {{h/2}}px;
            margin: {{h/4}}px 0px;
            @apply --horizontal;
            overflow: visible !important;
            padding: 0 !important;
        }

        :host:before,
        :host:after {
            text-align: center;
            font-size: small;
            content: "";
            position: absolute;
            width: 0px;
            border-left: {{size/2}}px solid transparent;
            border-right: {{size/2}}px solid transparent;
        }

        :host:before {
            bottom: 100%;
            border-bottom: {{h/4}}px solid {{color1}};
            overflow: visible;
            /*z-index:1;*/
        }
        :host([active]):before {
            border-bottom: {{h/4}}px solid {{background}};
        }
        :host([active]):after {
            border-top: {{h/4}}px solid {{background}};
             z-index: -1;
        }
        :host:after {
            top: 100%;
            border-top: {{h/4}}px solid {{color2}};
            overflow: visible;
        }
          :host([active]) {
              filter: brightness(.9) !important;
              cursor: pointer;
             
          }
          :host>* {
              overflow: visible;
              /*z-index: 1;*/
          }
          :host(.drag-hover)>div {
              filter: brightness(.6) !important;
          }
          :host([label])>.block:after{
            left: -{{size/4}}px;
            max-height: {{size}}px;
            /*color: white;*/
            text-align: center;
            position: absolute;
            content: "{{label}}";
            top: {{size/2 * 1.3}}px;
            font-size: x-small;
            z-index: 1;
            width: {{size*1.5}}px;
            @apply --text-shadow;
            background-color: transparent;
          }
        </style>
        <div ~if="full || item" class="no-flex block" ~is="item?.is" ~props="item?.props"></div>
      `,
    get allowDrop(){
        return (this.x && this.y && (!this.active || this?.item?.allowDrop));
    },
    props:{
        selected:{
            default: false,
            reflectToAttribute: true
        },
        label:{
            get(){
                return this.item?.label;
            },
            reflectToAttribute: true
        },
        draggable:{
            default: '',
            reflectToAttribute: true
        },
        x:0,
        active:{
            default: false,
            get(){
                const active = !!this.item;
                this.draggable = active?'true':'';
                return active;
            },
            reflectToAttribute: true
        },
        item:{
            get (){
                return this?.items?.find(i=>(i?.x === this.x)) || null;
            },
        },
        title:{
            get (){
                return this.item?.title || this.label;
            },
            reflectToAttribute: true
        }
    },

    listeners:{
        down(e){
            if (this.active)
                focusedHex = this;
            else
                focusedHex = null;
        },
        tap(e){
            if (this.item?.tap){
                e.stopPropagation();
                this.item?.tap(e);
            }
        },
        dragenter(e){
            if (!this.x || !this.y) return;
            this.$addClass('drag-hover');
        },
        dragend(e){
            this.showTrash = false;
        },
        dragstart(e){
            const obj = {mime: 'oda/hexagon-item'}
            obj.data = Post['oda/hexagon-item'] = this.item;
            Post['host'] = this;
            // e.dataTransfer.setDragImage(this.$core.shadowRoot.firstElementChild, this.size/4*window.devicePixelRatio, this.size/4*window.devicePixelRatio);
            e.dataTransfer.setData(obj.mime, obj.data);
            this.showTrash = true;
        },
        dragover(e){
            e.preventDefault()
            if (!this.allowDrop)
                e.dataTransfer.dropEffect = 'none';
        },
        dragleave(e){
            this.$removeClass('drag-hover');
        },
        drop(e){
            this.showTrash = false
            this.$removeClass('drag-hover');
            e.preventDefault()
            for (let type of e.dataTransfer.types){
                switch (type){
                    case 'oda/hexagon-item':{
                        const item = Post[type];
                        const host = Post['host'];
                        host.moveTo(this);
                        // if (this.x !== this.trashItem.x && this.y !== this.trashItem.y){
                        //     item.x = this.x;
                        //     if (host.domHost.y !== this.y){
                        //         host.domHost.remove(item);
                        //         this.domHost.add(item);
                        //     }
                        // }
                        // else{
                        //     host.domHost.remove(item);
                        // }
                        this.item = undefined;
                        host.item = undefined;
                        return;
                    } break;
                }
            }
            this.domHost.__drop(e, this);
            // this.data = [...this.data];
        }
    },
    remove(){
        this.data.remove(this.item);
    },
    moveTo(hex){
        if (!hex.item){
            const item = this.item;
            item.y = hex.y;
            item.x = hex.x;
        }
    }
})


const Post = {};
let focusedHex;