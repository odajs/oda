ODA({ is: 'oda-scheme-layout', imports: '@oda/ruler-grid, @oda/button, @tools/containers', extends: 'oda-ruler-grid', template: /*html*/`
    <div slot="content" class="flex vertical" ~style="{zoom: scale}" style="position: relative">
    <oda-scheme-container ~for="items" @resize="links = undefined" @tap.stop="select" :block="$for.item" ~props="$for.item?.props" @down="onDown" @up="onUp"></oda-scheme-container>
    </div>
    `,
    onLinkToBlock(e){
        let pos = alterPos[this.focusedPin.pos];
        this.block.pins ??= {};
        this.block.pins[pos] ??= [];
        const bind = {bind:[{block: this.items.indexOf(this.focusedPin.block), [this.focusedPin.pos]:this.focusedPin.pins.indexOf(this.focusedPin.pin)}]}
        this.block.pins[pos].push(bind);
        this.links = undefined;
    },
    onLinkToPin(e){
        console.log(this.focusedPin, this);
    },
    onTapPin(e){

    },
    onDblClickPin(e){

    },
    onContextMenuPin(e){

    },
    $wake: true,
    dragLink: '',
    get paths() {
        const paths =  this.links?.map(l => ({ is: 'path', props: { stroke: this.linkColor, 'stroke-width': '2', fill: 'transparent', d: l }}));
        if (this.dragLink)
            paths.push({ is: 'path', props: {stroke: 'red', 'stroke-width': '4', fill: 'transparent', d: this.dragLink}})
        return paths;
    },
    hostAttributes: {
        tabindex: 1
    },
    keyBindings: {
        delete(e) {
            this.removeSelection();
        }
    },
    onDown(e) {
        this.lastdown = e.target;
    },
    onUp(e) {
        if (!this.inTrack)
            this.lastdown = null;
    },
    get links() {
        return this.$$('oda-scheme-container').map(i => i.links).flat();
    },
    set links(n) {
        this.$$('oda-scheme-container').forEach(i => {
            i.links = undefined;
        });
    },
    $public: {
        lineSize:{
            $def: 30,
            $pdp: true,
        },
        blockTemplate: {
            $type: String,
            $pdp: true,
            $def: 'div'
        },
        linkColor: {
            $def: 'gray',
            $save: true,
            $editor: '@oda/color-picker[oda-color-picker]'
        },
        designMode: {
            $type: Boolean,
            $attr: true,
            $pdp: true,
            $save: true,
            set(n, o) {
                if (o) {
                    this.designInfo = undefined
                }
                this.focusedPin = null;
            }
        },
        allPinsVisible: {
            $save: true,
            $type: String,
            $pdp: true,
            $list: ['visible', 'half', 'invisible'],
            $def: 'half'
        },
        snapToGrid: {
            $def: false,
            $save: true,
        }
    },
    $pdp: {
        layout: {
            get() {
                return this;
            }
        },
        items: {
            $type: Array,
            set(n){
                this.links = undefined;
            }
        },
        iconSize: 24,
        get designInfo() {
            return {
                selected: []
            }
        },
        get selection() {
            return this.designInfo.selected
        },
        focusedPin: {
            set(n) {
                this.designInfo = undefined;
                this.dragLink = '';
            }
        }
    },
    $listeners: {
        contextmenu(e) {
            e.preventDefault();
            console.log('context menu in oda-scheme-layout: ', e);
        },
        resize(e) {
            this.links = undefined;
            // return this.links;
        },
        track(e) {
            if( !this.lastdown ) {
                if(this.mouseMode)
                    this.trackGrid(e);
            } else {
                this.trackBlock(e);
            }
        },
        tap(e) {
            this.designInfo = undefined
            this.focusedPin = null
        },
        dragover(e){
            e.preventDefault();
            if (!this.focusedPin) return;
            this.dragLink = `M ${e.layerX / this.scale} ${e.layerY / this.scale}` + endPoint.call(this.focusedPin);
        },
    },
    trackBlock(e) {
        if (!this.designMode) return;
        switch (e.detail.state) {
            case 'start': {
                if (!this.selection.has(this.lastdown.block)) {
                    this.selection.splice(0, this.selection.length, this.lastdown.block);
                }
                this.selection.forEach(i => {
                    Object.defineProperty(i, 'delta', {
                        writable: true,
                        enumerable: false,
                        configurable: true,
                        value: {
                            x: e.detail.start.x / this.scale - i.x,
                            y: e.detail.start.y / this.scale - i.y
                        }
                    })
                })
            } break;
            case 'track': {
                this.selection.forEach(i => {
                    const step = this.snapToGrid ? this.step : 1;
                    i.x = Math.round((e.detail.x / this.scale - i.delta.x) / step) * step;
                    i.y = Math.round((e.detail.y / this.scale - i.delta.y) / step) * step;
                    if (Math.abs(i.delta.x - e.detail.x) > step || Math.abs(i.delta.y - e.detail.y) > step) {
                        this.inTrack = true;
                    }
                })
                this.links = undefined;
            } break;
            case 'end': {
                this.lastdown = null;
                this.async(() => {
                    this.inTrack = false;
                    this.links = undefined;
                });
            } break;
        }
    },
    select(e) {
        if (!this.designMode) return;
        if (this.inTrack) return;
        const block = e.target.block;
        this.focusedPin = null;
        if (!e.ctrlKey)
            this.designInfo = undefined
        else {
            if (this.selection.has(block)) {
                this.selection.remove(block);
                return;
            }
        }
        this.selection.add(block);
    },
    async removeSelection() {
        await ODA.showConfirm(`Remove (${this.selection?.length})?`, {});
        this.selection.forEach(i => {
            this.items.remove(i);
            // this.links?.remove(i);
        });
        this.designInfo = undefined
        // this.links = undefined;
    }
});
ODA({ is: 'oda-scheme-container-toolbar', template: /*html*/`
    <style>
        :host {
            @apply --horizontal;
            @apply --header;
            @apply --shadow;
            @apply --border;
            border-radius: 25%;
            justify-content: right;
            position: absolute;
            right: 0;
            opacity: .5;
            z-index: 2;
        }
        :host(:hover) {
            opacity: 1;
            transition: opacity ease-in-out .5s;
        }
    </style>
    <oda-button :icon-size icon="icons:close" class="error" @tap.stop="removeBlock"></oda-button>
    `,
    async removeBlock(e) {
        if (this.selection.has(this.container.block))
            this.layout.removeSelection();
    },
    $listeners: {
        resize(e) {
            this.topPosition = this.offsetHeight;
        }
    },
    topPosition: 0
});
ODA({ is: 'oda-scheme-container', template: /*html*/`
    <style>
        :host {
            position: absolute;
            min-width: 8px;
            min-height: 8px;
            @apply --vertical;
        }
        :host([selected]) .block {
            outline: 1px dotted gray !important;
            @apply --selected;
        }
    </style>
    <style>
        :host{
            transform: translate3d({{block?.x || 0}}px, {{block?.y || 0}}px, 0px);
            z-index: {{(selection.includes(block)?1:0)}};
        }
    </style>
    <oda-scheme-container-toolbar ~if="designMode && selection.last === block"></oda-scheme-container-toolbar>
    <div>
        <oda-scheme-pins class="horizontal" pos="top" :style="'transform: translateY(' + pinsTranslate + '%)'"></oda-scheme-pins>
        <div class="flex horizontal">
            <oda-scheme-pins class="vertical" pos="left" :style="'transform: translateX(' + pinsTranslate + '%)'"></oda-scheme-pins>
            <div class="block shadow content flex horizontal" style="align-items: center; z-index: 1" :active="selection.has(block)" :focused="selection.has(block)">
                <div class="flex" ~is="block?.template || block?.is || blockTemplate || 'div'" ~props="block?.props"></div>
            </div>
            <oda-scheme-pins class="vertical" pos="right" :style="'transform: translateX(-' + pinsTranslate + '%)'"></oda-scheme-pins>
        </div>
        <oda-scheme-pins class="horizontal" pos="bottom" :style="'transform: translateY(-' + pinsTranslate + '%)'"></oda-scheme-pins>
    </div>
    `,
    $wake: true,
    contextItem: null, // bug pdp contextItem buble
    get pinsTranslate() {
        switch(this.allPinsVisible) {
            case 'visible':
                return 0;
            case 'half':
                return 40;
            case 'invisible':
                return 93;
        }
    },
    $pdp: {
        container: {
            get() {
                return this;
            }
        },
        get allPins(){
            return this.block?.pins;
        },
        block: {
            $type: Object,
            set(n){
                this.links = undefined
            }
        }
    },

    get links() {
        return this.$$('oda-scheme-pins').map(i => i.links).flat();
    },
    set links(n) {
        this.$$('oda-scheme-pins').forEach(i => {
            i.links = undefined;
        });
    },
    $listeners: {
        dragover(e) {
            if (!this.designMode) return;
            if (!this.focusedPin) return;
            if (this.focusedPin.container === this) return;
            // e.stopPropagation();
            e.preventDefault();
        },
        drop(e) {
            this.onLinkToBlock();
        },
        dragend(e) {
            this.focusedPin = null;
        }
    }
});
ODA({ is: 'oda-scheme-pins', imports: '@oda/icon', template: /*html*/`
    <style>
        :host {
            justify-content: center;
        }
    </style>
    <oda-scheme-pin ~for="pins" ~props="$for.item?.props" :draggable="designMode?'true':'false'" :pin="$for.item" ~style="{visibility: (designMode || $for.item?.bind)?'visible':'hidden'}" @down.stop :focused="$for.item === focusedPin?.pin"></oda-scheme-pin>
    `,
    $wake: true,
    attached() {
        this.links = undefined;
    },
    $pdp: {
        pos: String,
        get pins(){
            return this.allPins?.[this.pos]
        },
    },
    get links() {
        return this.$$('oda-scheme-pin').map(i => i.links).flat();
    },
    set links(n) {
        this.$$('oda-scheme-pin').forEach(i => {
            i.links = undefined;
        });
    },

});
ODA({ is: 'oda-scheme-pin', extends: 'oda-icon', template: /*html*/`
    <style>
        :host {
            @apply --content;
            @apply --border;
            border-radius: 50%;
            margin: 2px;
            transition: transform ease-in-out .5s;
            cursor: pointer;
            @apply --shadow;
            z-index: 1;
        }
        :host([focused]), :host(:hover) {
            @apply --active;
        }
    </style>
    `,
    $wake: true,
    get _grid() {
        return this.container?.parentElement;
    },
    get binds(){
        return this.pin?.bind;
    },
    get links() {
        const links = this.binds?.map(bind =>{
            const block = this.items[bind.block];
            if (block){
                return Object.keys(bind).map(dir=>{
                    const pin = block.pins?.[dir];
                    if (!pin)
                        return;
                    const pin_idx = bind[dir];
                    const target = pin[pin_idx];
                    if (target?.pin)
                        return (startPoint.call(this) + endPoint.call(target.pin));
                }).filter(i=>i);
            }
        }).filter(i=>i) || [];
        return links?.flat();
    },
    $listeners: {
        dragstart(e) {
            if (!this.designMode) return;
            this.focusedPin = this;
        },
        dragover(e) {
            if (!this.designMode) return;
            if (!this.focusedPin) return;
            if (this.focusedPin.container === this.container) return;
            if (this.focusedPin.pos === this.pos) return;
            // e.stopPropagation();
            e.preventDefault();
        },
        drop(e) {
            e.stopPropagation();
            this.onLinkToPin(e);
        },
        contextmenu(e) {
            e.preventDefault();
            e.stopPropagation();
            this.onContextMenuPin(e);
        },
        tap(e) {
            e.stopPropagation();
            this.onTapPin(e);
        },
        dblclick(e) {
            e.stopPropagation();
            this.onDblClickPin(e);
        }
    },
    set pin(n) {
        if (n && typeof n === 'object') n.pin = this;
        // this.links = undefined;
    }
})
const alterPos = {
    left: 'right',
    right: 'left',
    top: 'bottom',
    bottom: 'top',
}
function endPoint(){
    const rect = this.getClientRect(this._grid);
    const center = rect.center;
    const size = this.lineSize;
    switch (this.pos) {
        case 'top':
            return ` L ${center.x} ${center.y - size} V ${rect.top}`;
        case 'right':
            return ` L ${rect.right + size} ${center.y} H ${rect.right}`;
        case 'bottom':
            return ` L ${center.x} ${center.y + size} V ${rect.bottom}`;
        case 'left':
            return ` L ${rect.left - size} ${center.y} H ${rect.left}`;
    }
}
function startPoint(){
    const rect = this.getClientRect(this._grid);
    const center = rect.center;
    const size = this.lineSize;
    switch (this.pos) {
        case 'top':
            return `M ${center.x + 5} ${rect.y - 5} L ${center.x} ${rect.y} L ${center.x - 5} ${rect.y - 5} L ${center.x} ${rect.y}  L ${center.x} ${rect.y - size}`;
        case 'right':
            return `M ${rect.right + 5} ${center.y - 5} L ${rect.right} ${center.y} L ${rect.right + 5} ${center.y + 5} L ${rect.right} ${center.y} L ${rect.right + size} ${center.y}`;
        case 'bottom':
            return `M ${center.x + 5} ${rect.bottom + 5} L ${center.x} ${rect.bottom} L ${center.x - 5} ${rect.bottom + 5} L ${center.x} ${rect.bottom} L ${center.x} ${rect.bottom + size}`;
        case 'left':
            return `M ${rect.x - 5} ${center.y - 5} L ${rect.x} ${center.y} L ${rect.x - 5} ${center.y + 5} L ${rect.x} ${center.y}  L ${rect.x - size} ${center.y}`;
    }
}