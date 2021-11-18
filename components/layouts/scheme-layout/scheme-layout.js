ODA({is: 'oda-scheme-layout', imports: '@oda/ruler-grid, @oda/button', extends: 'oda-ruler-grid',
    template: /*html*/`
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                position: relative;
                overflow: auto;
            }
        </style>
        <svg :width :height style="z-index: 0">
            <path ~for="link in links" stroke="#666666" :stroke-width="Object.equal(link, focusedLink) ? 3 : 1" fill="transparent" :props="link" @tap.stop="focusLink(link)" @push.stop :focused="Object.equal(link, focusedLink)" />
        </svg>
        <oda-scheme-container ~wake="true" @tap.stop="select" ~for="itm in items" :item="itm" @down="dd" @up="uu" ~style="{transform: \`translate3d(\${itm?.item?.x}px, \${itm?.item?.y}px, 0px)\`, zoom: zoom}"></oda-scheme-container>
        <oda-button ~if="editMode && focusedLink" icon="icons:delete" style="position: absolute" ~style="linkButtonStyle" @tap.stop="removeLink(focusedLink)"></oda-button>
    `,
    focusedLink: null,
    focusLink(link) {
        this.focusedLink = link;
        this.focusedItem = null;
        this.selection.clear();
    },
    get linkButtonStyle() {
        if (!this.focusedLink) return {};
        return {
            top: Math.abs((this.focusedLink.y1 + this.focusedLink.y2 - this.iconSize) / 2) + 'px',
            left: Math.abs((this.focusedLink.x1 + this.focusedLink.x2 - this.iconSize) / 2) + 'px',
        }
    },
    removeLink(link) {
        if (!link?.from) return;
        const target = link.from.item?.links?.find?.(l => Object.equal(l, link.link))
        link.from.item?.links?.remove?.(target);
        this.focusedLink = null;
        link.from.domHost?.block?.save?.();
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
        this.focusedLink = null;
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
                    this.focusedLink = null;
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
            this.focusedLink = null;
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
            :host {
                position: absolute;
                min-width: 8px;
                min-height: 8px;
                @apply --vertical;
                @apply --content;
            }
            :host([selected]).block{
                outline: 1px dashed black !important;
            }
        </style>
        <!--<oda-scheme-container-toolbar ~if="editMode && focused" ></oda-scheme-container-toolbar> не работает-->
        <oda-scheme-container-toolbar ~if="editMode && focusedItem?.id === item?.id" ></oda-scheme-container-toolbar>
        <div>
            <oda-scheme-interface ~if="item?.interfaces?.top" align="t" :connectors="item?.interfaces?.top" class="horizontal"></oda-scheme-interface>
            <div class="flex horizontal">
                <oda-scheme-interface class="vertical" ~if="item?.interfaces?.left" align="l" :connectors="item?.interfaces?.left"></oda-scheme-interface>
                <div class="block" :is="item?.is || 'div'" ~props="item?.props" :focused="isFocused(item)"  :selected="isSelected(item)"></div>
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
    isFocused(item) {
        return item?.id === this.focusedItem?.id;
    },
    isSelected(item) {
        return (this.selection.find(i => i.id === item.id) ? true : false);
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
    <div ~for="con of [...connectors]" class="pin-space" style="margin:4px;">
        <div class="pin-space pin" ~if="editMode || con?.links?.length || isVisiblePin(con)"  ~is="con?.is || 'div'" :props="con?.props || {}" :item="con" @down.stop :draggable="editMode?'true':'false'" @dragstart="dragstart" @dragover="dragover" @drop="drop"></div>
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
        const SHIFT = 10;
        const SHOULDER = 30;
        const OUTSIDE_LINK_COLOR = '#bfbfbf';
        let pins = this.connectors?.length && this.$$('*') || [];
        pins = pins.filter(i=>{
            return i.item?.links?.length;
        });
        const links = pins.map(pin=>{
            const rect = pin.getClientRect(this.layout);
            return pin.item.links.map((link)=>{
                const result = {
                    from: pin,
                    link: link
                }
                const targetPin = this.layout.findPin(link)
                const r = {};
                r.xStart = r.x1 = Math.round((rect.left + rect.width / 2) * this.zoom + this.layout.scrollLeft);
                r.yStart = r.y1 = Math.round((rect.top + rect.height / 2) * this.zoom + this.layout.scrollTop);
                switch (this.align) {
                    case 't':{
                         r.yStart -= SHIFT;
                         r.y1 = r.yStart - SHOULDER;
                    } break;
                    case 'r':{
                        r.xStart += SHIFT;
                        r.x1 = r.xStart + SHOULDER;
                    } break;
                    case 'b':{
                        r.yStart += SHIFT;
                        r.y1 = r.yStart + SHOULDER;
                    } break;
                    case 'l':{
                        r.xStart -= SHIFT;
                        r.x1 = r.xStart - SHOULDER;
                    } break;
                }

                if (targetPin) {
                    result.to = targetPin;
                    const targetRect = targetPin.getClientRect(this.layout);
                    r.xEnd = (targetRect.left + targetRect.width / 2) * this.zoom + this.layout.scrollLeft;
                    r.yEnd = (targetRect.top + targetRect.height / 2) * this.zoom + this.layout.scrollTop;
                    switch (targetPin.domHost.align) {
                        case 't':{
                            r.yEnd -= SHIFT;
                            r.y2 = r.yEnd - SHOULDER;
                            r.x2 = r.xEnd;
                        } break;
                        case 'r':{
                            r.xEnd += SHIFT;
                            r.x2 = r.xEnd + SHOULDER;
                            r.y2 = r.yEnd;
                        } break;
                        case 'b':{
                            r.yEnd += SHIFT;
                            r.y2 = r.yEnd + SHOULDER;
                            r.x2 = r.xEnd;
                        } break;
                        case 'l':{
                            r.xEnd -= SHIFT;
                            r.x2 = r.xEnd - SHOULDER;
                            r.y2 = r.yEnd;
                        } break;
                    }
                }
                else {
                    result.stroke = OUTSIDE_LINK_COLOR;
                    switch (this.align){
                        case 't':{
                            r.xEnd = r.x2 = r.x1;;
                            r.y2 = r.yEnd = 0;
                        } break;
                        case 'r':{
                            r.yEnd = r.y2 = r.y1;
                            r.x2 = r.xEnd = this.layout?.width;
                        } break;
                        case 'b':{
                            r.xEnd = r.x2 = r.x1;
                            r.y2 = r.yEnd = this.layout.height;
                        } break;
                        case 'l':{
                            r.yEnd = r.y2 = r.y1;
                            r.x2 = r.xEnd = 0;
                        } break;
                    }
                }
                result.d = `M${r.xStart},${r.yStart} L${r.x1},${r.y1} L${r.x2},${r.y2} L${r.xEnd},${r.yEnd}`;
                Object.assign(result, r);
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