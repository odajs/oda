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
        <svg :width :height>
            <line ~for="link in links" :props="link" stroke="black"></line>
        </svg>
        <div ~if="item" class="vertical" style="position:absolute; justify-content:space-between;" ~style="{width: '100%', height: '100%'}">
            <oda-scheme-interface ~if="item.interfaces?.top" align="t" :connectors="item.interfaces?.top" min-width="30" min-height="30" class="horizontal"></oda-scheme-interface>
            <div class="horizontal" style="justify-content:space-between;">
                <oda-scheme-interface ~if="item.interfaces?.left" align="l" :connectors="item.interfaces?.left" class="vertical" :min-width="30" :min-height="30"></oda-scheme-interface>
                <oda-scheme-interface ~if="item.interfaces?.right" align="r" :connectors="item.interfaces?.right" class="vertical" :min-width="30" :min-height="30"></oda-scheme-interface>
            </div>
            <oda-scheme-interface ~if="item.interfaces?.bottom" align="b" :connectors="item.interfaces?.bottom" class="horizontal" :min-width="30" :min-height="30"></oda-scheme-interface>
        </div>
        <oda-scheme-container ~wake="true" @tap.stop="select" ~for="itm in items" :item="itm" @down="dd"  :focused="isFocused(itm)" ~style="{transform: \`translate3d(\${itm?.item?.x}px, \${itm?.item?.y}px, 0px)\`, zoom: zoom}" :selected="selection.includes(item)"></oda-scheme-container>
    `,
    isFocused(item) {
        return Object.equal(item, this.focusedItem);
    },
    findPin(link){
        return this.$$('oda-scheme-container').find(i=>{
            return i.item?.id === link.block;
        })?.findPin(link);
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
    item: null,
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
                        // this.focusedItem = this.lastdown.item;
                    }
                    // if (!this.selection.length && this.lastdown){
                    //
                    // }
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
                    })
                    this.async(() => {
                        this.updateLinks();
                    })

                } break;
                case 'end': {
                    if (this.selection.length === 1 && this.selection[0] === this.lastdown?.item)
                        this.selection.clear();
                    this.lastdown = null;
                    this.selection.forEach(i => {
                        if (Math.abs(i.delta.x - e.detail.x) > 10 || Math.abs(i.delta.y - e.detail.y) > 10) {
                            this.inTrack = true;
                            this.async(() => {
                                this.inTrack = false;

                            })
                        }
                    })
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

        }
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
});

ODA({
    is: 'oda-scheme-container',
    template: `
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
        <div>
            <oda-scheme-interface ~if="item?.interfaces?.top" align="t" :connectors="item?.interfaces?.top" class="horizontal"></oda-scheme-interface>
            <div class="flex horizontal">
                <oda-scheme-interface class="vertical" ~if="item?.interfaces?.left" align="l" :connectors="item?.interfaces?.left"></oda-scheme-interface>
                <div class="block" :is="item?.is || 'div'" :disabled="editMode" ~props="item?.props"></div>
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
});

ODA({is: 'oda-scheme-interface', imports: '@oda/icon',
    template: /*html*/`
    <style>
        :host{
            justify-content: center;
        }
        .pin-space {
            @apply --no-flex;
            width: {{minWidth}}px;
            height: {{minHeight}}px;
        }
        .pin {
            box-sizing: border-box;
            border: 1px solid gray;
            border-radius: 2px;
        }
    </style>
    <div ~for="con of [...connectors]" class="pin-space" style="margin:4px;">
        <div class="pin-space pin" ~if="editMode || con?.links?.length"  ~is="con?.is || 'div'" :item="con" @down.stop :draggable="editMode?'true':'false'" @dragstart="dragstart" @dragover="dragover" @drop="drop"></div>
    </div>
    `,
    minWidth: 10,
    minHeight: 10,
    findPin(link){
        return this.$$('div.pin').find(i=>{
            return i.item.id === link.pin;
        })
    },
    align: '',
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
                    y1: (rect.top + rect.height / 2) * this.zoom + this.layout.scrollTop
                }
                const targetPin = this.layout.findPin(link)
                if (targetPin){
                    const targetRect = targetPin.getClientRect(this.layout);
                    result.x2 = (targetRect.left + targetRect.width / 2) * this.zoom + this.layout.scrollLeft;
                    result.y2 = (targetRect.top + targetRect.height / 2) * this.zoom + this.layout.scrollTop;
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
            this.fire('linkCreated', { from: pinFrom, to: pinTo });
        }
    }
});