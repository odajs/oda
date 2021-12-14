ODA({is: 'oda-scheme-layout', imports: '@oda/ruler-grid, @oda/button', extends: 'oda-ruler-grid',
    template: /*html*/`
        <div ref="content" slot="content" class="flex vertical" ~style="{zoom: zoom}">
            <svg class="flex">
                <path ~for="link in links" :stroke="link?.link?'blue':'gray'" :stroke-width="selection.has(link?.d) ? 2 : 1" :item="link?.d" fill="transparent" :d="link?.d" @tap.stop="select" @push.stop :selected="selection.has(link?.d)"/>
            </svg>
            <oda-scheme-container ~wake="true" @tap.stop="select" ~for="itm in items" :item="itm" @down="onDown" @up="onUp" ~style="{transform: \`translate3d(\${itm?.x}px, \${itm?.y}px, 0px)\`, zIndex:selection.has(itm)?1:0}" :selected="selection.has(itm)"></oda-scheme-container>
            <oda-scheme-link ~for="link in links?.filter(i=>!i?.link)" :link></oda-scheme-link>      
        </div>
    `,
    get srcPins(){
        return this.items.map(b=>{
            return b.interfaces?.right?.map((src,i)=>{
                return {link: b.id, pin: i, src};
            });
        }).filter(i=>i).flat();
    },
    __delete: '',
    hostAttributes:{
        tabindex: 1
    },
    keyBindings:{
        delete(e){
            this.removeSelection();
        }
    },
    set focusedPin(n){
        this.selection.clear();
    },
    findLink(pin){
        const block = this.items.find(i=>i.id === pin.link);
        if (block) {

        }
        return this.$$('oda-scheme-container').find(i=>{
            return i.item?.id === link.block;
        })?.findPin(link);
    },
    get layout(){
        return this;
    },
    onDown(e){
        this.lastdown = e.target;
    },
    onUp(e) {
        if (!this.inTrack)
            this.lastdown = null;
    },
    get links(){
        const containers = this.items.filter(i=>i.$$container);
        if (containers.length)
            return containers.map(i=>i.$$container.links).flat();
    },
    set links(n){
        this.items.filter(i=>i.$$container).forEach(i=>{
            i.$$container.links = undefined;
        });
    },
    props: {
        pinSize:{
            default: 20,
            save: true,
        },
        editMode: {
            type: Boolean,
            reflectToAttribute: true,
            set(n, o) {
                if (o) {
                    this.selection.clear();
                }
            },
            // save: true
        },
    },
    selection: [],
    items: [],
    listeners: {
        contextmenu(e) {
            e.preventDefault();
            console.log('context menu in oda-scheme-layout: ', e);
        },
        resize(e) {
            this.interval('my-resize', ()=>{
                this.width = e.target.scrollWidth;
                this.height = e.target.scrollHeight;
                this.links = undefined;
            });
        },
        track(e) {
            if (!this.lastdown) return;
            if (e.sourceEvent.ctrlKey) return;
            if (!this.editMode) return;
            switch(e.detail.state ){
                case 'start':{
                    if(!this.selection.has(this.lastdown.item)){
                        this.selection.splice(0, this.selection.length, this.lastdown.item);
                    }
                    this.selection.forEach(i=>{
                        i.delta = {
                            x: e.detail.start.x / this.zoom - i.x,
                            y: e.detail.start.y / this.zoom - i.y
                        };
                    })
                } break;
                case 'track':{
                    this.selection.forEach(i=>{
                        i.x = e.detail.x / this.zoom  - i.delta.x;//Math.round(((e.detail.x + i.delta.x) / this.zoom)/10) * 10;
                        i.y = e.detail.y / this.zoom - i.delta.y;//Math.round(((e.detail.y + i.delta.y) / this.zoom)/10) * 10;
                        i.x = Math.round(i.x / 10) * 10;
                        i.y = Math.round(i.y / 10) * 10;
                        if (Math.abs(i.delta.x - e.detail.x) > 10 || Math.abs(i.delta.y - e.detail.y) > 10) {
                            this.inTrack = true;
                        }
                    })
                    this.changed();
                } break;
                case 'end': {
                    this.lastdown = null;
                    this.async(() => {
                        this.inTrack = false;
                    });
                } break;
            }
        },
        tap(e) {
            this.selection.clear();
            this.focusedPin = null;
        },
    },
    changed(){
        this.interval('changed', () => {
            this.links = undefined;
        })
        this.fire('changed');
    },
    select(e) {
        if (!this.editMode) return;
        if (this.inTrack) return;
        const item = e.target.item;
        this.focusedPin = null;
        if (!e.sourceEvent.ctrlKey)
            this.selection.clear();
        else {
            if (this.selection.has(item)) {
                this.selection.remove(item);
                return;
            }
        }
        this.selection.add(item);
    },
    async removeSelection() {
        try{
            this.__delete = true;
            this.render();
            await ODA.showConfirm('oda-dialog-message',{message: `Remove (${this.selection?.length})?`});
            this.selection.forEach(i=>this.items.remove(i));
            this.selection.clear();
        }
        finally {
            this.__delete = false;
        }
    }
});

ODA({is: 'oda-scheme-container',
    template: /*html*/`
        <style>
            :host {
                position: absolute;
                min-width: 8px;
                min-height: 8px;
                @apply --vertical;
                /*@apply --content;*/
            }
            :host([selected]).block{
                outline: 1px dotted gray !important;
            }
            .block{
                border: 1px solid gray;
                @apply --content;
            }
        </style>
        <!--<oda-scheme-container-toolbar ~if="editMode && focused" ></oda-scheme-container-toolbar> не работает-->
        <oda-scheme-container-toolbar ~if="editMode && selection.last === item"></oda-scheme-container-toolbar>
        <div>
            <oda-scheme-interface ~if="item?.interfaces?.top" align="t" :interface="item?.interfaces?.top" class="horizontal"></oda-scheme-interface>
            <div class="flex horizontal">
                <oda-scheme-interface class="vertical" ~if="item?.interfaces?.left" align="l" :interface="item?.interfaces?.left"></oda-scheme-interface>
                    <div class="flex shadow vertical content">
                        <div disabled="editMode" class="block flex" :is="item?.is || 'div'" ~props="item?.props"></div>
                    </div>
                <oda-scheme-interface class="vertical" ~if="item?.interfaces?.right" align="r" :interface="item?.interfaces?.right"></oda-scheme-interface>
            </div>
            <oda-scheme-interface ~if="item?.interfaces?.bottom" align="b" :interface="item?.interfaces?.bottom" class="horizontal"></oda-scheme-interface>
        </div>
    `,
    get container(){
        return this;
    },
    set item(n){
        if (n)
            n.$$container = this;
        this.links = undefined;

    },
    get links(){
        return this.$$('oda-scheme-interface').map(i => i.links).flat();
    },
    set links(n){
        this.$$('oda-scheme-interface').forEach(i=>{
            i.links = undefined;
        });
    },
    findPin(link){
        return this.$$('oda-scheme-interface').find(i=>{
            return i.findPin(link);
        })?.findPin?.(link);
    },
    get block() {
        return this.$$('.block')?.[0];
    }
});
ODA({is:'oda-scheme-pin', template: /*html*/`
        <style>
            :host{
                @apply --content;
                @apply --border;
                border-radius: 25%;
                min-width: {{iconSize/2}}px;
                min-height: {{iconSize/2}}px;
                margin: 2px;
                transition: transform ease-in-out .5s;
                cursor: pointer;
                background-color: {{color}};
                @apply --shadow;
            }
            :host([focused]), :host(:hover){
                transform: scale(1.5);
                z-index: 1;
            }
        </style>
    `,
    index: undefined,
    get link(){
        const zoom = this.zoom;
        if (this.align === 'r' || !this.pin?.link) return '';
        const link = this.srcPins.find(i=>{
            return i.link === this.pin.link && i.pin === this.pin.pin;
        })
        const container = this.layout.$refs.content;
        let rect = this.getClientRect(container);
        // let rect = this.getClientRect(this.layout);
        const center = rect.center;
        // let d = `M${center.x * this.zoom} ${center.y * this.zoom}`;
        let d = '';
        switch (this.align) {
            case 'l': {
                d += `M${(rect.x - 4)} ${center.y} H ${(link?(center.x):0)}`;
            } break;
            case 't': {
                d += `M${center.x} ${rect.y - 4} V ${(link?(rect.y):0)}`;
            } break;
            case 'b': {
                d += `M${center.x} ${(rect.bottom + 4)} V ${(link?(rect.bottom):'999999')}`;
            } break;
        }
        if (link){
            // rect = link.src.$$pin.getClientRect(link.src.$$pin.container.parentElement);
            rect = link.src.$$pin.getClientRect(container);
            d += `L ${(rect.right + this.pinSize)} ${rect.center.y} H ${rect.right + 4}`;
        }
        console.log(d)
        return {d, link, align: this.align};
    },
    listeners:{
        dragstart(e) {
            this.focusedPin = this;
        },
        dragover(e) {
            if (!this.focusedPin) return;
            if (this.focusedPin.container === this.container) return;
            switch (this.focusedPin.align){
                case 'r':{
                    if (this.align === 'r')
                        return;
                } break;
                default :{
                    if (this.align !== 'r')
                        return;
                } break;
            }
            e.preventDefault();
        },
        dragend(e) {
            this.focusedPin = null;
        },
        drop(e) {
            this._link();
        },
        tap(e){
            e.stopPropagation();
            this._link();
        }
    },
    _link(){
        if (this.focusedPin && this.focusedPin.container !== this.container){
            switch (this.focusedPin.align){
                case 'r':{
                    if (this.align === 'r'){
                        this.focusedPin = this;
                        return;
                    }
                    this.__link(this.focusedPin);
                } break;
                default:{
                    if (this.align !== 'r'){
                        this.focusedPin = this;
                        return;
                    }
                    this.focusedPin.__link(this);
                } break;
            }
            this.focusedPin = null;
        }
        else
            this.focusedPin = this;
    },
    async __link(pin){
        if (this.link){
            await ODA.showConfirm('oda-dialog-message',{message: `Replace link?`})
        }
        this.pin.link = pin.container.item.id;
        this.pin.pin = pin.index;
    },
    get vertical(){
        switch (this.align){
            case 'l':
            case 'r':
                return true;
        }
        return false
    },
    set pin(n){
        if (typeof n === 'object')
            n.$$pin = this;
        this.link = undefined;
    },
    get color(){
        if (!this.focusedPin)
            return '';
        if (this.focusedPin === this)
            return 'var(--info-color)';
        if (this.focusedPin.container === this.container)
            return 'var(--disabled-color)';
        switch (this.focusedPin.align){
            case 'r':{
                if (this.align === 'r')
                    return 'var(--error-color)';
                if (this.pin.link)
                    return 'var(--warning-color)';
            } break;
            default:{
                if (this.align !== 'r')
                    return 'var(--error-color)';
            } break;
        }
        return 'var(--success-color)';
    }
})
ODA({is: 'oda-scheme-interface', imports: '@oda/icon',
    template: /*html*/`
        <style>
            :host{
                justify-content: center;
            }
        </style>
        <oda-scheme-pin ~for="pin in interface" :draggable="editMode?'true':'false'"  ~if="editMode || pin?.link" :pin @down.stop :index :focused="pin === focusedPin?.pin"></oda-scheme-pin>
    `,
    attached(){
        this.links = undefined;
    },
    isVisiblePin(con) {
        if (!this.layout?.links?.length)
            return false;
        const target = this.layout?.links?.find?.(l => l.to?.item?.id === con.id);
        return !!target;
    },
    findPin(link){
        return this.$$('.pin').find(i=>{
            return i.item.id === link.pin;
        })
    },
    align: '',
    get links(){
        return this.$$('oda-scheme-pin').map(i =>i.link).filter(i=>i);
    },
    set links(n){
        this.$$('oda-scheme-pin').forEach(i=> {
            i.link = undefined;
        });
    },
    set interface(n){
        if (typeof n ==='object')
            n.$$interface = this;
        // this.links = undefined;
    },
    dragstart(e) {
        e.dataTransfer.setData('pin', JSON.stringify({
            block: this.item.id,
            pin: e.target.item.id
        }))
    },
    dragover(e) {
        e.preventDefault();
    },
    drop(e) {
        e.stopPropagation();
        const pinFrom = JSON.parse(e.dataTransfer.getData('pin'));
        const pinTo = {
            block: e.target.domHost.item.id,
            pin: e.target.item.id
        };
        if (pinFrom.block === pinTo.block)
            return;
        const pin = this.layout.findPin(pinFrom);
        if (pin) {
            if (!pin.item.links)
                pin.item.links = [];
            pin.item.links.push(pinTo);
        }
    },
});
ODA({is:'oda-scheme-container-toolbar',
    template:`
        <style>
            :host{
                border-radius: {{iconSize/4}}px;
                justify-content: right;
                position: absolute;
                top: -{{offsetHeight}}px;
                right: 0px;
                @apply --horizontal;
                @apply --header;
                @apply --shadow;    
                opacity: .3;
            }
            :host(:hover){
                opacity: 1;
                transition: opacity ease-in-out .5s;
            }
        </style>
        <oda-button icon="icons:close" class="error" @tap.stop="removeBlock"></oda-button>
    `,
    async removeBlock(e) {
        if (this.selection.has(this.item))
            this.removeSelection();
    }
});
ODA({is:'oda-scheme-link',
    template:`
    EXT
    `,
});