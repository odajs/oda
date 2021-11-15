ODA({is: 'oda-scheme-layout', imports: '@oda/ruler-grid', extends: 'oda-ruler-grid',
    template: `
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                position: relative;
                overflow: auto;
            }
        </style>
        <svg :width :height style="z-index: 0">
            <line ~for="link in links" :props="link" stroke="black"></line>
        </svg>
        <oda-scheme-container ~wake="true" @tap.stop="select" ~for="itm in items" :item="itm" @down="dd" @up="uu" :focused="itm?.id === focusedItem?.id" ~style="{transform: \`translate3d(\${itm?.item?.x}px, \${itm?.item?.y}px, 0px)\`, zoom: zoom}" :selected="isSelected(itm)"></oda-scheme-container>
    `,
    isSelected(item) {
        const s = this.selection.find(i => i.id === item.id);
        if (s)
            return true;
        return false;
    },
    findPin(link){
        return this.$$('oda-scheme-container').find(i=>{
            return i.item?.id === link.block;
        })?.findPin(link);
    },
    findBlock(id) {
        return this.$$('oda-scheme-container').find(i=>{
            return i.item?.id === id;
        }).block;
    },
    get layout(){
        return this;
    },
    updateLinks(){
        this.$$('oda-scheme-container').forEach(i=>i.updateLinks())
    },
    dd(e){
        this.lastdown = e.target;
    },
    uu(e) {
        if (!this.inTrack)
            this.lastdown = null;
    },
    get links(){
        let links = this.$$('oda-scheme-container').reduce((res, i)=>{
            i.links && res.push(...i.links);
            return res;
        }, []);
        if(links.length)
            return links;
        return undefined;
    },
    props: {
        editMode: {
            type: Boolean,
            reflectToAttribute: true,
            set(n, o) {
                if (o) {
                    this.selection.clear();
                    this.focusedItem = null;
                }
            },
            save: true
        },
        linkColor: {
            default: 'orangered',
            save: true
        },
        snapToGrid: {
            default: true,
            save: true
        },
        zoom: {
            default: 1,
            set(n) {
                this.dispatchEvent(new Event('resize'));
                this.updateLinks();
            }
        }
    },
    focusedItem: null,
    selection: [],
    items: [],
    zoomKoef: 1.5,
    listeners: {
        contextmenu(e) {
            e.preventDefault();
            console.log('context menu in oda-scheme-layout: ', e);
        },
        resize(e) {
            this.width = e.target.clientWidth;
            this.height = e.target.clientHeight;
            this.interval('resize', ()=>{
                this.width = e.target.scrollWidth;
                this.height = e.target.scrollHeight;
                this.updateLinks();
            }, 100);
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
                            x: e.detail.start.x / this.zoom - i.item.x,
                            y: e.detail.start.y / this.zoom - i.item.y
                        };
                        // i.item.x = Math.round((+i.item.x + e.detail.ddx / this.zoom)/10) * 10;
                        // i.item.y = Math.round((+i.item.y + e.detail.ddy  / this.zoom)/10) * 10;
                    })
                } break;
                case 'track':{
                    this.selection.forEach(i=>{
                        i.item.x = e.detail.x / this.zoom  - i.delta.x;//Math.round(((e.detail.x + i.delta.x) / this.zoom)/10) * 10;
                        i.item.y = e.detail.y / this.zoom - i.delta.y;//Math.round(((e.detail.y + i.delta.y) / this.zoom)/10) * 10;
                        i.item.x = Math.round(i.item.x / 10) * 10;
                        i.item.y = Math.round(i.item.y / 10) * 10;

                        if (Math.abs(i.delta.x - e.detail.x) > 10 || Math.abs(i.delta.y - e.detail.y) > 10) {
                            this.inTrack = true;
                        }
                    })
                    this.async(() => {
                        this.updateLinks();
                    })

                } break;
                case 'end': {
                    this.lastdown = null;
                    this.async(() => {
                        this.inTrack = false;
                    });
                    this.save();
                } break;
            }

        },
        tap(e) {
            this.selection.clear();
            this.focusedItem = null;
        },
        wheel(e) {
            if (e.ctrlKey) {
                e.preventDefault();
                if (e.wheelDelta > 0)
                    this.zoomIn();
                else
                    this.zoomOut();
                return;
            }
            if (e.shiftKey) {
                e.preventDefault();
                this.scrollLeft -= e.wheelDelta;
                return;
            }

        },
    },
    select(e) {
        if (!this.editMode) return;
        if (this.inTrack) return;
        const item = e.target.item;
        if (!e.sourceEvent.ctrlKey) {
            this.focusedItem = item;
            this.selection.clear();
        } else {
            if (this.selection.has(item)) {
                this.selection.remove(item);
                return;
            }
        }
        this.items.remove(item);
        this.items.push(item);
        this.selection.add(item);
    },
    zoomIn() {
        this.zoom = this.zoom * this.zoomKoef;
    },
    zoomOut() {
        this.zoom = this.zoom / this.zoomKoef;
    },
    save() {

    },
    removeBlock(block) {
        this.items.remove(block);
        this.save();
    }
});

ODA({
    is: 'oda-scheme-container',
    template: /*html*/`
        <style>
            :host([selected]){
                /*@apply --shadow;*/
                outline: 1px dashed black;
            }
            :host {
                position: absolute;
                min-width: 8px;
                min-height: 8px;
                @apply --vertical;
                @apply --content;
                background: transparent;
            }
        </style>
        <!--<oda-scheme-container-toolbar ~if="editMode && focused" ></oda-scheme-container-toolbar>-->
        <oda-scheme-container-toolbar ~if="editMode && Object.equal(focusedItem, item)" ></oda-scheme-container-toolbar>
        <div>
            <oda-scheme-interface ~if="item?.interfaces?.top" align="t" :connectors="item?.interfaces?.top" class="horizontal"></oda-scheme-interface>
            <div class="flex horizontal">
                <oda-scheme-interface class="vertical" ~if="item?.interfaces?.left" align="l" :connectors="item?.interfaces?.left"></oda-scheme-interface>
                <div class="block" :is="item?.is || 'div'" ~props="item?.props"></div>
                <oda-scheme-interface class="vertical" ~if="item?.interfaces?.right" align="r" :connectors="item?.interfaces?.right"></oda-scheme-interface>
            </div>
            <oda-scheme-interface ~if="item?.interfaces?.bottom" align="b" :connectors="item?.interfaces?.bottom" class="horizontal"></oda-scheme-interface>
        </div>
    `,
    attached(){
        this.async(() => {
            this.updateLinks();
        }, 300);
    },
    focused: false,
    updateLinks(){
        this.$$('oda-scheme-interface').forEach(i=>i.updateLinks());
    },
    item: null,
    get links(){
        const links =  this.$$('oda-scheme-interface').reduce((res, i)=>{
            i.links && res.push(...i.links);
            return res;
        }, []);
        if(links.length)
            return links;
        return undefined;
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

ODA({is: 'oda-scheme-interface', imports: '@oda/icon',
    template: /*html*/`
    <style>
        :host{
            justify-content: center;
        }
        .pin-space {
            @apply --no-flex;
            min-width: {{minWidth}}px;
            min-height: {{minHeight}}px;
        }
        .pin {
            box-sizing: border-box;
            border: 1px solid gray;
            border-radius: 2px;
        }
    </style>
    <div ~for="con of [...connectors]" class="pin-space" style="margin:4px;" :focused="editMode && Object.equal(con, focusedItem)">
        <div class="pin-space pin" ~if="editMode || con?.links?.length || isVisiblePin(con)"  ~is="con?.is || 'div'" :props="con?.props || {}" :item="con" @down.stop :draggable="editMode?'true':'false'" @dragstart="dragstart" @dragover="dragover" @drop="drop" @tap.stop="onTap"></div>
        <oda-scheme-pin-links-toolbar ~if="editMode && Object.equal(con, focusedItem)" :interface="this" :item="con"></oda-scheme-pin-links-toolbar>
    </div>
    `,
    observers: [
        function addPinMethods(connectors) {
            if (!this.connectors?.length) return;
            this.async(()=> {
                const sCons = this.connectors.filter(c => {return (Object.keys(c).find(k => typeof c[k] === 'function'))}) || [];
                sCons.forEach(con => {
                    const pin = this.$$('.pin').find(p => p.item.id === con.id);
                    if (pin) {
                        Object.keys(con).forEach(key => {
                            if (key !== 'id' && key !== 'props')
                                pin[key] = con[key];
                        });
                    }
                });
            }, 300);
        }
    ],
    isVisiblePin(con) {
        if (!this.layout?.links?.length)
            return false;
        const target = this.layout?.links?.find?.(l => l.to?.item?.id === con.id);
        return !!target;
    },
    onTap(e) {
        // focusedItem = con
        this.focusedItem = e.target.item;
    },
    minWidth: 10,
    minHeight: 10,
    findPin(link){
        return this.$$('.pin').find(i=>{
            return i.item.id === link.pin;
        })
    },
    props:{
        align: '',
    },
    updateLinks(){
        this.links = undefined;
    },
    get links(){
        let pins = this.connectors?.length && this.$$('*') || [];
        pins = pins.filter(i=>{
            return i.item?.links?.length;
        });
        const links = pins.map(pin=>{
            const rect = pin.getClientRect(this.layout);
            return pin.item.links.map((link)=>{
                const result = {
                    x1: (rect.left + rect.width / 2) * this.zoom + this.layout.scrollLeft,
                    y1: (rect.top + rect.height / 2) * this.zoom + this.layout.scrollTop,
                    from: pin,
                    link: link
                }
                const targetPin = this.layout.findPin(link)
                if (targetPin){
                    const targetRect = targetPin.getClientRect(this.layout);
                    result.x2 = (targetRect.left + targetRect.width / 2) * this.zoom + this.layout.scrollLeft;
                    result.y2 = (targetRect.top + targetRect.height / 2) * this.zoom + this.layout.scrollTop;
                    result.to = targetPin;
                }
                else {
                    switch (this.align){
                        case 't':{
                            result.x2 = result.x1;
                            result.y2 = 0;
                        } break;
                        case 'r':{
                            result.y2 = result.y1;
                            result.x2 = 10000;
                        } break;
                        case 'b':{
                            result.x2 = result.x1;
                            result.y2 = 10000;
                        } break;
                        case 'l':{
                            result.y2 = result.y1;
                            result.x2 = 0;
                        } break;
                    }
                }
                return result;
            })
        }).flat();
        if(links.length)
            return links;
        return undefined;
    },
    connectors: [],
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
            // this.fire('linkCreated', { from: pinFrom, to: pinTo });
            this.layout.findBlock(pinFrom.block)?.save?.();
        }
    },
});
ODA({is:'oda-scheme-container-toolbar',
    template:`
        <style>
            :host{
                justify-content: right;
                z-index: 100;
                position:absolute;
                top: -{{offsetHeight}}px;
                width: 100%;
                left: 0px;
                @apply --horizontal;
                /*@apply --shadow;    */
            }
        </style>
        <oda-button icon="icons:delete" @tap.stop="onTap"></oda-button>
    `,
    onTap(e) {
        this.layout.removeBlock(this.item);
    }
});

ODA({is:'oda-scheme-pin-links-toolbar',
    template:`
        <oda-button ~for="link of links" icon="icons:delete" @tap.stop="removeLink(link)" style="position: absolute; z-index: 100;" ~style="getButtonStyle(link)"></oda-button>
    `,
    item: null,
    interface: null,
    get links() {
        return this.item?.links;
    },
    getButtonStyle(link) {
        const result = {};
        const iLink = this.interface.links.find(l => Object.equal(l.link, link));
        result.left = iLink.x2 - iLink.x1 + this.layout.scrollLeft + this.layout.offsetLeft;
        result.top = iLink.y2 - iLink.y1 + this.layout.scrollTop + this.layout.offsetTop;
        return result;
    },
    removeLink(link) {
        this.links?.remove(link);
        this.block?.save?.();
    }
});