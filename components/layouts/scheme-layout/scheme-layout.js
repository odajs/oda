ODA({ is: 'oda-scheme-layout', imports: '@oda/ruler-grid, @oda/button, @tools/containers', extends: 'oda-ruler-grid', template: /*html*/`
    <div slot="content" class="flex vertical" ~style="{zoom: zoom, cursor: _cursor}" style="position: relative">
        <!--<oda-button ~if="showRemoveLinesButton" ~style="{position: 'absolute', left: selection[selection.length - 1].rect.center.x + 'px', top: selection[selection.length - 1].rect.center.y + 'px', width: '34px', height: '34px'}" icon="icons:close" class="error" @tap.stop="removeSelection"></oda-button>-->
        <svg class="flex" :width :height>
            <path ~for="links" ~style="{visibility: item?.pin?.hasBlock ? 'visible' : 'hidden'}" :stroke="linkColor" :stroke-width="selection.includes(item) ? 2 : 1" :item fill="transparent" :d="item?.d" @tap.stop="select" @push.stop/>
            <path ~if="dashedLine" :stroke="linkColor" stroke-width="2" stroke-dasharray="5,5" fill="transparent" :d="dashedLine" />
        </svg>
        <oda-scheme-container ~wake="true" @tap.stop="select" ~for="itm in items" :item="itm" ~props="itm?.props" @down="onDown" @up="onUp" ~style="{transform: \`translate3d(\${itm?.x}px, \${itm?.y}px, 0px)\`, zIndex:selection.has(itm)?1:0}" :selected="selection.has(itm)"></oda-scheme-container>
        <!--<oda-scheme-link ~for="link in links?.filter(i=>(i && !i.link))" ~style="{transform: \`translate3d(\${link?.rect.x - iconSize / 4 + (link?.pos === 'left'?-linkMargin:0)}px, \${link?.rect.y - iconSize / 4 + (link?.pos === 'top'?-linkMargin:link?.pos === 'bottom'?linkMargin:0)}px, 0px)\`}"></oda-scheme-link>-->
        <oda-scheme-link ~for="link in filteredLinks" :link ~style="{left: link?.rect.x + (link?.pos === 'left'?-(16 + link.pin.size):link?.pos === 'right'?+(16 + link.pin.size):0) + 'px', top: link?.rect.y + (link?.pos === 'top'?-(16 + link.pin.size):link?.pos === 'bottom'?(16 + link.pin.size):0) + 'px'}"></oda-scheme-link>
    </div>
    `,
    // get showRemoveLinesButton () {
    //     return this.selection.length && this.selection[this.selection.length - 1].d;
    // },
    get filteredLinks() {
        return this.links?.filter(i=>(i && !i.link)) || [];
    },
    dashedLine: null,
    get srcPins() {
        return this.items.map(b => {
            let outputs = [];
            // Object.getOwnPropertyNames(b.interfaces).forEach(pos => {
            //     if(this.inputs[pos.slice(1)] === false) {
            //         outputs = outputs.concat(b.interfaces[pos]);
            //     }
            // });
            for(const pos in b.interfaces) {
                if(this.inputs[pos.slice(1)] === false) {
                    outputs = outputs.concat(b.interfaces[pos]);
                }
            }
            return outputs?.map?.((src, i) => {
                return { link: b.block, pin: i, src };
            });
        }).filter(i => i).flat();
    },
    hostAttributes: {
        tabindex: 1
    },
    keyBindings: {
        delete(e) {
            this.removeSelection();
        }
    },
    set focusedPin(n) {
        this.selection.clear();
    },
    findLink(pin) {
        // const block = this.items.find(i=>i.id === pin.link);
        // if (block) {

        // }
        return this.$$('oda-scheme-container').find(i => {
            return i.item?.id === link.block;
        })?.findPin(link);
    },
    get layout() {
        return this;
    },
    onDown(e) {
        this.lastdown = e.target;
    },
    onUp(e) {
        if (!this.inTrack)
            this.lastdown = null;
    },
    get links() {
        const containers = this.items?.filter(i => i.$$container);
        if (containers?.length)
            return containers.map(i => i.$$container.links).flat();
    },
    set links(n) {
        this.items?.filter(i => i.$$container).forEach(i => {
            i.$$container.links = undefined;
        });
    },
    iconSize: 12,
    props: {
        linkColor:{
            default: 'blue',
            save: true,
            editor: '@oda/color-picker'
        },
        inputs: {
            top: true,
            right: false,
            bottom: true,
            left: true
        },
        editMode: {
            type: Boolean,
            reflectToAttribute: true,
            set(n, o) {
                if (o) {
                    this.selection.clear();
                }
                this.focusedPin = null;
            },
            save: true
        },
        snapToGrid: {
            default: true,
            save: true,
        },
    },
    selection: [],
    items: [],
    attached() {
        this.async(() => {
            this.links = undefined;
        }, 100)
    },
    _cursor: 'auto',
    listeners: {
        dragover(e) {
            if( !this.editMode ) return;
            if( this.focusedPin ) {
                // const pinRect = this.focusedPin.getClientRect(this.focusedPin.block);
            	// const containerPos = { x: parseInt(this.focusedPin.container.item.x) , y: parseInt(this.focusedPin.container.item.y)  };
        		// const start = {x: containerPos.x + pinRect.center.x, y: containerPos.y + pinRect.center.y };
        		// const end = {x: (e.x) / this.zoom, y: (e.y) / this.zoom};

				// this.dashedLine = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
            }
            
            e.preventDefault();
        },
        contextmenu(e) {
            e.preventDefault();
            console.log('context menu in oda-scheme-layout: ', e);
        },
        resize(e) {
            this.links = undefined;
        },
        track(e) {
            // if (e.sourceEvent.which === 2) {
            //     switch (e.detail.state) {
            //         case 'start': {
            //             this._cursor = 'move';
            //         } break;
            //         case 'track': {
            //             this.$('#slot').scrollLeft -= e.detail.ddx;
            //             this.$('#slot').scrollTop -= e.detail.ddy;
            //         } break;
            //         case 'end': {
            //             this._cursor = 'auto';
            //         } break;
            //     }
            //     return;
            // }
            if (!this.lastdown) return;
            if (e.sourceEvent.ctrlKey) return;
            if (!this.editMode) return;
            switch (e.detail.state) {
                case 'start': {
                    if (!this.selection.has(this.lastdown.item)) {
                        this.selection.splice(0, this.selection.length, this.lastdown.item);
                    }
                    this.selection.forEach(i => {
                        Object.defineProperty(i, 'delta', {
                            writable: true,
                            enumerable: false,
                            configurable: true,
                            value: {
                                x: e.detail.start.x / this.zoom - i.x,
                                y: e.detail.start.y / this.zoom - i.y
                            }
                        })
                        // i.delta = {
                        //     x: e.detail.start.x / this.zoom - i.x,
                        //     y: e.detail.start.y / this.zoom - i.y
                        // };
                    })
                } break;
                case 'track': {
                    this.selection.forEach(i => {
                        // i.x = Math.round((e.detail.x / this.zoom - i.delta.x) / 10) * 10;
                        // i.y = Math.round((e.detail.y / this.zoom - i.delta.y) / 10) * 10;
                        // if (Math.abs(i.delta.x - e.detail.x) > 10 || Math.abs(i.delta.y - e.detail.y) > 10) {
                        const step = this.snapToGrid ? this.step : 1;
                        i.x = Math.round((e.detail.x / this.zoom - i.delta.x) / step) * step;
                        i.y = Math.round((e.detail.y / this.zoom - i.delta.y) / step) * step;
                        if (Math.abs(i.delta.x - e.detail.x) > step || Math.abs(i.delta.y - e.detail.y) > step) {
                            this.inTrack = true;
                        }
                    })
                    this.links = undefined;
                    this.async(() => {
                        this.links = undefined;
                    }, 200);
                } break;
                case 'end': {
                    this.lastdown = null;
                    this.async(() => {
                        this.inTrack = false;
                        this.changed();
                    });
                } break;
            }
        },
        tap(e) {
            this.selection.clear();
            this.focusedPin = null;
        },
    },
    changed(item) {
        this.interval('changed', () => {
            this.links = undefined;
        })
        this.fire('changed', item);
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
        await ODA.showConfirm('oda-dialog-message', { message: `Remove (${this.selection?.length})?` });
        this.selection.forEach(i => {
            this.items.remove(i);
            this.links.remove(i);
        });
        this.selection.clear();
    }
});
ODA({ is: 'oda-scheme-container-toolbar', template: /*html*/`
    <style>
        :host {
            @apply --horizontal;
            @apply --header;
            @apply --shadow;
            border-radius: {{iconSize/4}}px;
            justify-content: right;
            position: absolute;
            top: -{{topPosition}}px;
            right: 0;
            opacity: .3;
        }
        :host(:hover) {
            opacity: 1;
            transition: opacity ease-in-out .5s;
        }
    </style>
    <oda-button icon="icons:close" class="error" @tap.stop="removeBlock"></oda-button>
    `,
    async removeBlock(e) {
        if (this.selection.has(this.item))
            this.layout.removeSelection();
    },
    listeners: {
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
            /*@apply --content;*/
            left: {{-left}}px;
            top: {{-top}}px;
        }
        :host([selected]) .block {
            outline: 1px dotted gray !important;
            @apply --selected;
        }
        .block {
            border: 1px solid gray;
            @apply --content;
        }
    </style>
    <!--<oda-scheme-container-toolbar ~if="editMode && focused" ></oda-scheme-container-toolbar> не работает-->
    <oda-scheme-container-toolbar ~if="editMode && selection.last === item"></oda-scheme-container-toolbar>
    <div>
        <oda-scheme-interface ~if="item?.interfaces?.$top?.length" pos="top" :interface="item?.interfaces?.$top" class="horizontal"  ::height="top"></oda-scheme-interface>
        <div class="flex horizontal">
            <oda-scheme-interface class="vertical" ~if="item?.interfaces?.$left?.length" pos="left" :interface="item?.interfaces?.$left"  ::width="left"></oda-scheme-interface>
            <div class="flex shadow vertical content">
                <!-- <div :disabled="editMode" class="block flex" :is="item?.is || 'div'" ~props="item?.props"></div>-->
                <div @attached="blockReady" class="block flex" :is="item?.is || 'div'" ~props="item?.props"></div>
            </div>
            <oda-scheme-interface class="vertical" ~if="item?.interfaces?.$right?.length" pos="right" :interface="item?.interfaces?.$right"></oda-scheme-interface>
        </div>
        <oda-scheme-interface ~if="item?.interfaces?.$bottom?.length" pos="bottom" :interface="item?.interfaces?.$bottom" class="horizontal"></oda-scheme-interface>
    </div>
    `,
    attached() {
        this.style.visibility = 'hidden';
    },
    blockReady() {
        this.style.visibility = 'visible';
        this.async(() => {
            this.layout.links = undefined;
            this.hasBlock = true;
        }); // todo: delay for lines
    },
    hasBlock: false,
    // onResize(e) {
    //     switch (e.target.pos) {
    //         case 'left':
    //             this.left = e.target.offsetWidth;
    //             break;
    //         case 'top':
    //             this.top = e.target.offsetHeight;
    //             break;
    //     }
    //     console.dir(e.target)
    // },
    contextItem: null, // test
    get container() {
        return this;
    },
    left: 0,
    top: 0,
    set item(n) {
        if (n && typeof n === 'object') {
            Object.defineProperty(n, '$$container', {
                writable: true,
                configurable: true,
                enumerable: false,
                value: this
            })
        }
        this.links = undefined;
    },
    get links() {
        return this.$$('oda-scheme-interface').map(i => i.links).flat();
    },
    set links(n) {
        this.$$('oda-scheme-interface').forEach(i => {
            i.links = undefined;
        });
    },
    findPin(link) {
        return this.$$('oda-scheme-interface').find(i => {
            return i.findPin(link);
        })?.findPin?.(link);
    },
    get block() {
        return this.$$('.block')?.[0];
    }
});
ODA({ is: 'oda-scheme-interface', imports: '@oda/icon', template: /*html*/`
    <style>
        :host {
            justify-content: center;
        }
    </style>
    <oda-scheme-pin ~for="pinObj in interface" ~props="pinObj?.props" :draggable="editMode?'true':'false'"   :pin="pinObj"  ~style="{visibility: (editMode || pinObj?.reserved || pinObj?.link) && hasBlock?'visible':'hidden'}"   @down.stop :index :focused="pinObj === focusedPin?.pin"></oda-scheme-pin>
    `,
    pos: '',
    attached() {
        this.links = undefined;
    },
    findPin(link) {
        return this.$$('.pin').find(i => {
            return i.item.id === link.pin;
        })
    },
    get links() {
        return this.$$('oda-scheme-pin').map(i => i.link).filter(i => i);
    },
    set links(n) {
        this.$$('oda-scheme-pin').forEach(i => {
            i.link = undefined;
        });
    },
    interface: [],
    // dragstart(e) {
    //     e.dataTransfer.setData('pin', JSON.stringify({
    //         block: this.item.id,
    //         pin: e.target.item.id
    //     }))
    // },
    // dragover(e) {
    //     e.preventDefault();
    // },
    // drop(e) {
    //     e.stopPropagation();
    //     const pinFrom = JSON.parse(e.dataTransfer.getData('pin'));
    //     const pinTo = {
    //         block: e.target.domHost.item.id,
    //         pin: e.target.item.id
    //     };
    //     if (pinFrom.block === pinTo.block)
    //         return;
    //     const pin = this.layout.findPin(pinFrom);
    //     if (pin) {
    //         if (!pin.item.links)
    //             pin.item.links = [];
    //         pin.item.links.push(pinTo);
    //     }
    // },
    listeners: {
        resize(e) {
            this.width = undefined;
            this.height = undefined;
        }
    },
    get width() {
        return this.offsetWidth;
    },
    get height() {
        return this.offsetHeight;
    }
});
ODA({ is: 'oda-scheme-pin', extends: 'oda-icon', template: /*html*/`
    <style>
        :host {
            @apply --content;
            @apply --border;
            border-radius: 25%;
            /*min-width: {{iconSize}}px;
            min-height: {{iconSize}}px;*/
            margin: 2px;
            transition: transform ease-in-out .5s;
            cursor: pointer;
            background-color: {{color}};
            @apply --shadow;
            z-index: 1;
        }
        :host([focused]), :host(:hover) {
            transform: scale(1.5);
        }
    </style>
    `,
    props: {
        iconSize: 12
    },
    index: undefined,
    get _grid() {
        return this.container?.parentElement;
    },
    get size() {
        return this.iconSize * (this.index + 2);
    },
    get link() {
        const zoom = this.zoom;
        if (!this.inputs[this.pos] || !this.pin?.link) return '';
        const link = this.srcPins.find(i => {
            return i.link === this.pin.link && i.pin == this.pin.pin;
        });
        const inputRect = this.getClientRect(this._grid);
        const center = inputRect.center;
        let d = '';
        switch (this.pos) { // 64961
            case 'top': {
                d += !link ? `M ${center.x} ${inputRect.y}` :
                    `M ${center.x + 5} ${inputRect.y - 5} L ${center.x} ${inputRect.y} L ${center.x - 5} ${inputRect.y - 5} L ${center.x} ${inputRect.y}`;
                d += ` V ${inputRect.y - this.size}`;
            } break;
            case 'right': {
                d += !link ? `M ${inputRect.right} ${center.y}` :
                    `M ${inputRect.right + 5} ${center.y - 5} L ${inputRect.right} ${center.y} L ${inputRect.right + 5} ${center.y + 5} L ${inputRect.right} ${center.y}`;
                d += ` H ${inputRect.right + this.size}`;
            } break;
            case 'bottom': {
                d += !link ? `M ${center.x} ${inputRect.bottom}` :
                    `M ${center.x + 5} ${inputRect.bottom + 5} L ${center.x} ${inputRect.bottom} L ${center.x - 5} ${inputRect.bottom + 5} L ${center.x} ${inputRect.bottom}`;
                d += ` V ${inputRect.bottom + this.size}`;
            } break;
            case 'left': {
                d += !link ? `M ${inputRect.x} ${center.y}` :
                    `M ${inputRect.x - 5} ${center.y - 5} L ${inputRect.x} ${center.y} L ${inputRect.x - 5} ${center.y + 5} L ${inputRect.x} ${center.y}`;
                d += ` H ${inputRect.x - this.size}`;
            } break;
        }
        if (link) {
            const outputRect = link.src.$$pin.getClientRect(this._grid);
            link.src.reserved = true;
            switch (link.src.$$pin.pos) {
                case 'top': {
                    d += ` L ${outputRect.center.x} ${outputRect.center.y - link.src.$$pin.size} V ${outputRect.top}`;
                } break;
                case 'right': {
                    d += ` L ${outputRect.right + link.src.$$pin.size} ${outputRect.center.y} H ${outputRect.right}`;
                } break;
                case 'bottom': {
                    d += ` L ${outputRect.center.x} ${outputRect.center.y + link.src.$$pin.size} V ${outputRect.bottom}`;
                } break;
                case 'left': {
                    d += ` L ${outputRect.left - link.src.$$pin.size} ${outputRect.center.y} H ${outputRect.left}`;
                } break;
            }
        }
        return { d, link, pos: this.pos, rect: inputRect, pin: this };
    },
    listeners: {
        dragstart(e) {
            if (!this.editMode) return;
            this.focusedPin = this;
        },
        dragover(e) {
            if (!this.editMode) return;
            if (!this.focusedPin) return;
            if (this.focusedPin.container === this.container) return;
            if((!this.inputs[this.focusedPin.pos] && !this.inputs[this.pos]) ||
                (this.inputs[this.focusedPin.pos] && this.inputs[this.pos]))
                    return;
            e.preventDefault();
        },
        dragend(e) {
            this.focusedPin = null;
            this.layout.dashedLine = '';
        },
        drop(e) {
            this.prepareLink();
        },
        contextmenu(e) {
            e.preventDefault();
            if(this.pin.contextmenu) this.pin.contextmenu.call(this, e);
        },
        tap(e) {
            e.stopPropagation();
            if(this.pin.tap)
                this.pin.tap.call(this, e)
            else
                this.prepareLink();
            this.async(() => { this.layout.links = undefined }, 100);
        },
        dblclick(e) {
            e.stopPropagation();
            if(this.pin.dblclick)
                this.pin.dblclick.call(this, e)
            else
                this.layout?.onPinDblClick?.(this.pin);
        }
    },
    prepareLink() {
        if (!this.editMode) return;
        if (this.focusedPin && this.focusedPin.container !== this.container) {
            if(!this.inputs[this.focusedPin.pos]) {
                if(!this.inputs[this.pos]) {
                    this.focusedPin = this;
                    return;
                }
                this.setLink(this.focusedPin);
            } else {
                if(this.inputs[this.pos]) {
                    this.focusedPin = this;
                    return;
                }
                this.focusedPin.setLink(this);
            }
            this.focusedPin = null;
        }
        else
            this.focusedPin = this;
    },
    async setLink(pin) {
        if (!this.editMode) return;
        if (this.link) {
            await ODA.showConfirm('oda-dialog-message', { message: `Replace link?` })
        }
        this.pin.link = pin.container.item.block;
        this.pin.pin = pin.index;
        this.layout.changed(this.container.item); // TODO: контекст вызываемых методов провалившихся по pdp
    },
    get vertical() {
        switch (this.pos) {
            case 'left':
            case 'right':
                return true;
        }
        return false
    },
    set pin(n) {
        if (n && typeof n === 'object') {
            Object.defineProperty(n, '$$pin', {
                writable: true,
                configurable: true,
                enumerable: false,
                value: this
            });
        }

        this.link = undefined;
    },
    get color() {
        if (!this.focusedPin)
            return '';
        if (this.focusedPin === this)
            return 'var(--info-color)';
        if (this.focusedPin.container === this.container)
            return 'var(--disabled-color)';
        if (this.inputs[this.focusedPin.pos]) {
            if (this.inputs[this.pos])
                return 'var(--error-color)';
        }
        else {
            if (!this.inputs[this.pos])
                return 'var(--error-color)';
            if (this.pin.link)
                return 'var(--warning-color)';
        }
        return 'var(--success-color)';
    }
})
ODA({ is: 'oda-scheme-link', template: /*html*/`
    <style>
        :host {
            position: absolute;
            @apply --content;
            @apply --border;
            border-radius: 45%;
            width: {{iconSize}}px;
            height: {{iconSize}}px;
            cursor: pointer;
            @apply --shadow;
        }
    </style>
    `,
    iconSize: 12,
    set link(n) {
        this.style.visibility = n?.pin?.hasBlock ? 'visible':'hidden';
    },
    attached() {
        this.style.visibility = this.link?.pin?.hasBlock ? 'visible':'hidden';
    }
});