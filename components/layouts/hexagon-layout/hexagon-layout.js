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
                  position: relative;
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
          <div class="flex vertical">
            <oda-hexagon-row class="no-flex" :distance ~for="rows" :y="index" ~style="{marginLeft: \`\${index%2?0:(size / 2)+distance}px\`, marginTop: \`\${h/4+distance + 1}px\`, zIndex: + rows - index}"></oda-hexagon-row>          
          </div>
          <oda-icon class="error shadow" ~show="showTrash" :icon-size="size" icon="icons:delete" ~style="{right: size + 'px', bottom: size+'px'}" style="position: absolute; z-index: 10000; border-radius: 25%" ></oda-icon>   
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
            default: 'var(--header-background)',
            save: true,
            editor: '@oda/color-picker'
        },
        full: true,
        distance: 1,
        data: {
            default: [],
            save: true,
            readOnly: true,
            private: true,
        },
        tracking:{
            type: Boolean,
            reflectToAttribute: true,
            readOnly: true,
        }
    },
    get layout(){
        return this;
    },
    get rows(){
        return Math.ceil(this.height/this.size)+1
    },
    set showTrash(n){

    },
    listeners:{
        resize(e){
            if (this.height<this.offsetHeight)
                this.height = this.offsetHeight;
            if (this.width < this.offsetWidth)
                this.width = this.offsetWidth;
        },
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
        this.data?.remove(item);
        // let row = this.data.find(i=>(i.y === (item.y || 0)))
        // if (!row) return;
        // const idx = row.items.findIndex(i=>i.x === (item.x || 0))
        // row.items.splice(idx, 1);
    },
    __drop(e, hex){
        console.warn('method __drop not implemented!');
    }
})


ODA({is: 'oda-hexagon-row',
    template:`
          <style>
              :host{
                  position: relative;
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
          :host(:hover)>.container:after{
                transform: scale(1.5) !important;
                top: {{size}}px !important;
          }
          :host(:hover) .block{
                transform: scale(1.25) !important;
          }
          :host .block{
                transform: scale(1);
                transition: top .5s, transform  .5s;
          }
          :host([label])>.container:after{
            white-space: normal;
            overflow: hidden;
            transform: scale(1);
            transition: top .5s, transform  .5s;
            left: -{{size * .25}}px;
            max-height: {{size}}px;
            
            /*color: white;*/
            text-align: center;
            position: absolute;
            content: "{{label}}";
            top: {{size/2 * 1.5}}px;
            font-size: small;
            width: {{size * 1.5}}px;
            @apply --text-shadow;
            background-color: transparent;
          }
        </style>
        <div class="flex vertical container" style="overflow: visible; align-items: center; align-self: center;">
            <div ~if="full || item" class="no-flex block" ~is="item?.is" ~props="item?.props" :icon-size style="position: initial;"></div>
        </div>
        
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
        down(e) {
            e.stopPropagation();
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
            if (e.x < (this.layout.offsetWidth - this.size * 3)) return;
            if (e.y < (this.layout.offsetHeight - this.size * 3)) return;
            this.removeItem(this.item);
            this.domHost.items = undefined
        },
        dragstart(e) {
            const obj = {mime: 'oda/hexagon-item'}
            obj.data = Post['oda/hexagon-item'] = this.item;
            Post['host'] = this;
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
            this.showTrash = false;
            this.$removeClass('drag-hover');
            e.preventDefault()
            for (let type of e.dataTransfer.types){
                switch (type){
                    case 'oda/hexagon-item':{
                        const item = Post[type];
                        const host = Post['host'];
                        host.moveTo(this);
                        this.item = undefined;
                        host.item = undefined;
                        return;
                    } break;
                }
            }
            this.domHost.__drop(e, this);
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