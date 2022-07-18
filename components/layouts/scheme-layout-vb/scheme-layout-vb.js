ODA({ is: 'oda-scheme-layout-vb', imports: '@oda/ruler-grid-vb, @oda/button, @tools/containers', extends: 'oda-ruler-grid-vb', template: /*template*/`
        <oda-scheme-container slot="content" @tap.stop="select" ~for="itm in items" :item="itm" ~props="itm?.props" @down="onDown" @up="onUp" ~style="{left: \`\${itm?.x}px\`, top: \`\${itm?.y}px\`, zIndex:selection.has(itm)?1:0}" :selected="selection.has(itm)"></oda-scheme-container>
        <oda-scheme-link slot="content" ~for="link in filteredLinks" :link ~style="{
            left: ((link?.rect.x + vb.x) * scale + (link?.pos === 'left'?-(iconSize * 1.3 + link.pin.size):link?.pos === 'right'?(iconSize * 1.3 + link.pin.size):0)) + 'px',
            top: ((link?.rect.y + vb.y) * scale + (link?.pos === 'top'?-(iconSize * 1.3 + link.pin.size):link?.pos === 'bottom'?(iconSize * 1.3 + link.pin.size):0)) + 'px'
        }"></oda-scheme-link>
    `,
    get filteredLinks() {
        return this.links?.filter(i=>(i && !i.link)) || [];
    },
    dashedLine: null,
    get srcPins() {
        return this.items.map(b => {
            let outputs = [];
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
    get layout() {
        return this;
    },
    onDown(e) {
        this.lastdown = e.target;
    },
    onUp(e) {
        if (!this.inTrack) this.lastdown = null;
    },
    get links() {
        const containers = this.items?.filter(i => i.$$container);
        if (containers?.length)
            return containers.map(i => i.$$container.links).flat();
    },
    get elements() {
        return this.links?.map(l => ({is: 'path', props: {...l, stroke: this.linkColor, fill: 'transparent'}}));
    },
    set links(n) {
        this.items?.filter(i => i.$$container).forEach(i => {
            i.$$container.links = undefined;
        });
    },
    iconSize: 12,
    props: {
        linkColor: {
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
        		// const end = {x: (e.x) / this.scale, y: (e.y) / this.scale};

				// this.dashedLine = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
            }
            
            e.preventDefault();
        },
        contextmenu(e) {
            e.preventDefault();
            console.log('context menu in oda-scheme-layout: ', e);
        },
        resize(e) {
            this.vb.w = this.svg.clientWidth;
            this.vb.h = this.svg.clientHeight;
            this.links = undefined;
        },
        tap(e) {
            this.selection.clear();
            this.focusedPin = null;
        }
    },
    onTrack(e) {
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
                            x: e.detail.start.x - i.x / this.scale,
                            y: e.detail.start.y - i.y / this.scale
                        }
                    })
                })
            } break;
            case 'track': {
                this.selection.forEach(i => {
                    const step = this.snapToGrid ? this.step : 1;
                    i.x = Math.round((e.detail.x - i.delta.x) / step) * step * this.scale;
                    i.y = Math.round((e.detail.y - i.delta.y) / step) * step * this.scale;
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
    afterWheel(e) {
        this.async(() => {
            this.links = undefined;
        }, 50);
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
ODA({ is: 'oda-scheme-container-toolbar', template: /*template*/`
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
ODA({ is: 'oda-scheme-container', template: /*template*/`
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
        .block {
            border: 1px solid gray;
            @apply --content;
        }
    </style>
    <oda-scheme-container-toolbar ~if="editMode && selection.last === item"></oda-scheme-container-toolbar>
    <div>
        <oda-scheme-interface ~if="item?.interfaces?.$top?.length" pos="top" :interface="item?.interfaces?.$top" class="horizontal"></oda-scheme-interface>
        <div class="flex horizontal">
            <oda-scheme-interface class="vertical" ~if="item?.interfaces?.$left?.length" pos="left" :interface="item?.interfaces?.$left"></oda-scheme-interface>
            <div class="flex shadow vertical content">
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
        });
    },
    hasBlock: false,
    contextItem: null,
    get container() {
        return this;
    },
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
ODA({ is: 'oda-scheme-interface', imports: '@oda/icon', template: /*template*/`
    <style>
        :host {
            justify-content: center;
        }
    </style>
    <oda-scheme-pin ~for="pinObj in interface" ~props="pinObj?.props" :draggable="editMode?'true':'false'" :pin="pinObj" ~style="{visibility: (editMode || pinObj?.reserved || pinObj?.link) && hasBlock?'visible':'hidden'}" @down.stop :index :focused="pinObj === focusedPin?.pin"></oda-scheme-pin>
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
    interface: []
});
ODA({ is: 'oda-scheme-pin', extends: 'oda-icon', template: /*template*/`
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
        return this.layout.$refs.grid;
    },
    get size() {
        return this.iconSize * (this.index + 2);
    },
    scaleX(val) {
        return (val + this.vb.x) * this.scale;
    },
    scaleY(val) {
        return (val + this.vb.y) * this.scale;
    },
    get link() {
        const zoom = this.scale;
        if (!this.inputs[this.pos] || !this.pin?.link) return '';
        const link = this.srcPins.find(i => {
            return i.link === this.pin.link && i.pin == this.pin.pin;
        });
        const inputRect = this.getClientRect(this._grid);
        const center = inputRect.center;
        let d = '';
        switch (this.pos) { // 64961
            case 'top': {
                d += !link ? `M ${this.scaleX(center.x)} ${this.scaleY(inputRect.y)}` :
                    `M ${this.scaleX(center.x) + 5} ${this.scaleY(inputRect.y) - 5} L ${this.scaleX(center.x)} ${this.scaleY(inputRect.y)} L ${this.scaleX(center.x) - 5} ${this.scaleY(inputRect.y) - 5} L ${this.scaleX(center.x)} ${this.scaleY(inputRect.y)}`;
                d += ` V ${this.scaleY(inputRect.y) - this.size}`;
            } break;
            case 'right': {
                d += !link ? `M ${this.scaleX(inputRect.right)} ${this.scaleY(center.y)}` :
                    `M ${this.scaleX(inputRect.right) + 5} ${this.scaleY(center.y) - 5} L ${this.scaleX(inputRect.right)} ${this.scaleY(center.y)} L ${this.scaleX(inputRect.right) + 5} ${this.scaleY(center.y) + 5} L ${this.scaleX(inputRect.right)} ${this.scaleY(center.y)}`;
                d += ` H ${this.scaleX(inputRect.right) + this.size}`;
            } break;
            case 'bottom': {
                d += !link ? `M ${this.scaleX(center.x)} ${this.scaleY(inputRect.bottom)}` :
                    `M ${this.scaleX(center.x) + 5} ${this.scaleY(inputRect.bottom) + 5} L ${this.scaleX(center.x)} ${this.scaleY(inputRect.bottom)} L ${this.scaleX(center.x) - 5} ${this.scaleY(inputRect.bottom) + 5} L ${this.scaleX(center.x)} ${this.scaleY(inputRect.bottom)}`;
                d += ` V ${this.scaleY(inputRect.bottom) + this.size}`;
            } break;
            case 'left': {
                d += !link ? `M ${this.scaleX(inputRect.x)} ${this.scaleY(center.y)}` :
                    `M ${this.scaleX(inputRect.x) - 5} ${this.scaleY(center.y) - 5} L ${this.scaleX(inputRect.x)} ${this.scaleY(center.y)} L ${this.scaleX(inputRect.x) - 5} ${this.scaleY(center.y) + 5} L ${this.scaleX(inputRect.x)} ${this.scaleY(center.y)}`;
                d += ` H ${this.scaleX(inputRect.x) - this.size}`;
            } break;
        }
        if (link) {
            const outputRect = link.src.$$pin.getClientRect(this._grid);
            link.src.reserved = true;
            switch (link.src.$$pin.pos) {
                case 'top': {
                    d += ` L ${this.scaleX(outputRect.center.x)} ${this.scaleY(outputRect.center.y) - link.src.$$pin.size} V ${this.scaleY(outputRect.top)}`;
                } break;
                case 'right': {
                    d += ` L ${this.scaleX(outputRect.right) + link.src.$$pin.size} ${this.scaleY(outputRect.center.y)} H ${this.scaleX(outputRect.right)}`;
                } break;
                case 'bottom': {
                    d += ` L ${this.scaleX(outputRect.center.x)} ${this.scaleY(outputRect.center.y) + link.src.$$pin.size} V ${this.scaleY(outputRect.bottom)}`;
                } break;
                case 'left': {
                    d += ` L ${this.scaleX(outputRect.left) - link.src.$$pin.size} ${this.scaleY(outputRect.center.y)} H ${this.scaleX(outputRect.left)}`;
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
ODA({ is: 'oda-scheme-link', template: /*template*/`
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