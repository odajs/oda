ODA({ is: 'oda-mind-map', template: /*html*/`
    <style>
        :host{
            @apply --vertical;
            @apply --flex;
            overflow: auto;
            position: relative;
        }

        :host>div>div>oda-mind-map-container{
            min-width: 45%;
        }
        svg{
            position: absolute;
            top: 0px;
            left: 0px;
        }
    </style>
    <svg width="12000" height="12000" class="no-flex">
        <path ~for="line in lines" :d="_line(line)" stroke="silver" fill="transparent"/>
    </svg>
    <div class="horizontal no-flex" style="z-index: 1; min-height: 100%; justify-content: center;">
        <div class="vertical no-flex" style="justify-content: center;">
            <oda-mind-map-container :allow-drag ref="left" ~for="item in leftItems" :align="'left'" :root="item" :main></oda-mind-map-container>
        </div>
        <oda-mind-map-item :item="data" :main="main" align="center"></oda-mind-map-item>
        <div class="vertical no-flex" style="justify-content: center;">
            <oda-mind-map-container :allow-drag ref="right" ~for="item in rightItems" :align="'right'" :root="item" :main></oda-mind-map-container>
        </div>
    </div>`,
    props: {
        allowDrag: Boolean,
        zoom: {
            type: Number,
            default: 1,
            set(zoom) {
                this.style.zoom = zoom;
                // this.style.transform = `scale(${zoom})`;
            }
        },
        main: {
            type: Object,
            get() {
                return this;
            }
        },
        data: Object,
        focusedItem: Object,
    },
    get leftItems() {
        return (this.data?.items || []).filter((item, i) => {
            return item.align === 'left' || i % 2 === 0;
        });
    },
    get rightItems() {
        return (this.data?.items || []).filter((item, i) => {
            return item.align === 'right' || i % 2 !== 0;
        });
    },
    get lines() {
        const getLines = (root) => {
            if (this.data && root && (this.data === root || root?.$expanded)) {
                const pe = root.$item;
                if (pe && root.items && root.items.length) {
                    return root.items.filter(i => i.$item).reduce((res, i) => {
                        const ce = i.$item;
                        res.push({ x1: pe.pOut.x, y1: pe.pOut.y, x2: ce.pIn.x, y2: ce.pIn.y, x3: ce.pOut.x });
                        res.push(...getLines(i));
                        return res;
                    }, []);
                }
            }
            return [];
        };
        const lines = getLines(this.data);
        return lines;
    },
    _line(l) {
        return `M ${l.x1} ${l.y1}
                Q ${l.x1} ${l.y2} , ${l.x2} ${l.y2} L ${l.x2} ${l.y2}, ${l.x3} ${l.y2}`
    },
    listeners: {
        resize(e) {
            // this.render();
        },
        down(e) {
            this.focusedItem = null;
        },
        mousewheel(e) {
            if (e.ctrlKey) {
                e.preventDefault();
                const k = .9;
                this.zoom = Math.min(80, e.deltaY > 0 ? this.zoom * k : this.zoom / k);
                // this.render();
            }
        }
    },
    removeItem(item) {
        const remove = (items) => {
            if (items && items.length) {
                const idx = items.indexOf(item);
                if (idx > -1) {
                    items.splice(idx, 1);
                }
                else {
                    items.forEach(i => {
                        remove(i.items);
                    })
                }
            }
        };
        // this.data.items = [];
        remove(this.data.items);
        this.data.items = Object.assign([], this.data.items);
        // this.render();
    },
    addChildItem(parent, idx = -1) {
        parent = parent || this.data;
        if (!parent.items)
            parent.items = [];
        const item = { label: '' };
        if (idx < 0)
            parent.items.push(item);
        else
            parent.items.splice(idx + 1, 0, item);
        parent.$expanded = true;
        parent.items = Array.from(parent.items);
        this.focusedItem = item;
        // this.render();
        // this.$nextTick().then(()=>{
        item.$item.host.focus();
        item.$item.isEditable = true;
        this.async(() => {
            item.$item.$refs.input.focus();
        });
        // })
    },
    addSiblingItem(item) {
        const find = (root) => {
            if (root.items && root.items.length) {
                const idx = root.items.indexOf(item);
                if (idx > -1) {
                    return this.addChildItem(root, idx);
                }
                return root.items.reduce((res, i) => {
                    res = res || find(i);
                    return res;
                }, null)
            }
        };
        return find(this.data);
    }
});

ODA({ is: 'oda-mind-map-container', template: /*html*/`
    <style>
        :host{
            @apply --no-flex;
            @apply --horizontal;
            background-color: transparent;
            padding: 4px 16px;
        }
        :host([align=left]){
            flex-direction: row-reverse;
        }
    </style>
    <oda-mind-map-item :draggable="allowDrag" :item="root" :main :align></oda-mind-map-item>
    <div class="vertical">
        <oda-mind-map-container :allow-drag ~for="item in ((root.$expanded && root.items) || [])" :root="item" :align :main></oda-mind-map-container>
    </div>`,
    props: {
        allowDrag: false,
        align: {
            default: '',
            reflectToAttribute: true
        },
        root: Object
    }
});

ODA({ is: 'oda-mind-map-item', template: /*html*/`
    <style>
        :host{
            @apply --shadow;
            cursor: pointer;
            align-self: center;
            @apply --no-flex;
            margin: 8px;
            border-radius: 16px;
            text-align: initial;
            max-width: 150px;
            @apply --horizontal;
            align-items: center;
            @apply --content;
            padding: 4px;
        }

        :host>span{
            text-overflow: ellipsis;
            overflow: hidden;
            padding: 4px;
            min-width: 20px;
            border: 1px solid transparent;
        }
        :host([align=left]){
            flex-direction: row-reverse;
        }
        :host([allow-drop=true]){
            background-color: lightgreen;
        }
        :host([allow-drop=false]){
            background-color: lightpink;
        }
    </style>
    <span ref="input" @blur="_blur" @focus="_focus"  :contenteditable="isEditable" @down.stop="_down" @keydown="main.render()">{{item?.label || ' '}}</span>
    <oda-icon fill="gray" @down.stop @tap.stop="_expand" ~show="item?.items?.length && align !== 'center'" :size="iconSize" :icon="item?.$expanded?'icons:radio-button-unchecked':'icons:radio-button-checked'"></oda-icon>`,
    // hostAttributes:{
    //     tabindex: 0
    // },
    props: {
        allowDrop: {
            type: String,
            default: '',
            reflectToAttribute: true
        },
        draggable: {
            type: String,
            default: 'false',
            reflectToAttribute: true
        },
        iconSize: 24,
        align: {
            type: String,
            default: 'center',
            reflectToAttribute: true
        },
        main: Object,
        item: {
            type: Object,
            set(item) {
                if (item) {
                    if (item.items) {
                        item.items.forEach(i => {
                            i.$parent = this;
                        })
                    }
                    item.$item = this;

                }
            }
        },
        isFocused: {
            type: Boolean,
            default: false,
            get() {
                return this.main.focusedItem === this.item;
            }
        },
        isEditable: {
            type: Boolean,
            default: false,
            set(e) {
                if (e === false) {
                    this.item.label = this.$refs.input.innerText;
                    // this.$nextTick().then(()=>{
                    if (!this.item.label)
                        this.main.removeItem(this.item);
                    // })
                }
                // this.main.render();
            }
        }
    },
    listeners: {
        dragstart(e) {
            this.isEditable = false;
            this.main.dragEl = this;
        },
        dragenter(e) {
            if (this === this.main.dragEl || (this.item.items && this.item.items.includes(this.main.dragEl.item)) || this.main.dragEl.includes(this.item))
                this.allowDrop = 'false';
            else
                this.allowDrop = 'true';
            this.async(() => {
                if (this.allowDrop && this.item.items && this.item.items.length && !this.item.$expanded) {
                    this.item.$expanded = true;
                    // this.main.render();
                }
            }, 1000)
        },
        dragleave(e) {
            this.allowDrop = ''
        },
        dragover(e) {
            e.stopPropagation();
            e.preventDefault();
        },
        drop(e) {
            const test = this.main.dragEl.includes(this.item);
            if (this.allowDrop === 'true') {
                e.stopPropagation();
                e.preventDefault();
                this.main.dragEl.moveTo(this.item);
                this.allowDrop = '';
            }
        }
    },
    moveTo(item) {
        if (!item.items)
            item.items = [];
        this.main.removeItem(this.item);
        item.items.push(this.item);
        item.$expanded = true;
        this.main.focusedItem = this.item;
    },
    keyBindings: {
        enter(e) {
            if (this.isEditable) {
                this.isEditable = false;
                this.main.focusedItem = this.item;
                this.focus();
            }
            else {
                this.main.addSiblingItem(this.item);
            }
        },
        escape(e) {
            this.isEditable = false;
        },
        insert(e) {
            this.main.addChildItem(this.item);
        }
    },
    includes(item) {
        const includes = (root) => {
            if (root && root.items) {
                if (root.items.includes(item))
                    return true;
                return root.items.reduce((res, i) => {
                    res = res || includes(i);
                    return res;
                }, false)
            }
            return false;
        };
        return includes(this.item)
    },
    get pIn() {
        switch (this.align) {
            case 'left':
                return { x: this.offsetLeft + this.offsetWidth, y: this.offsetTop + this.offsetHeight / 2 };
            case 'right':
                return { x: this.offsetLeft, y: this.offsetTop + this.offsetHeight / 2 };
        }
    },
    get pOut() {
        switch (this.align) {
            case 'center':
                return { x: this.offsetLeft + this.offsetWidth / 2, y: this.offsetTop + this.offsetHeight / 2 };
            case 'left':
                return { x: this.offsetLeft, y: this.offsetTop + this.offsetHeight / 2 };
            case 'right':
                return { x: this.offsetLeft + this.offsetWidth, y: this.offsetTop + this.offsetHeight / 2 };
        }

    },
    _expand() {
        this.item.$expanded = !this.item.$expanded;
        // this.main.render();
    },
    _down(e) {
        if (!this.isFocused)
            this.main.focusedItem = this.item;
        else {
            this.isEditable = true;
            this.async(() => {
                this.$refs.input.focus();
            })
        }
    },
    _iconStyle() {
        const style = {};
        switch (this.align) {
            case 'right': {
                style.transform = `translateX(2px)`;
            } break;
            case 'left': {
                style.transform = `translateX(-2px)`;
            } break;
        }
        return style;
    },
    _focus(e) {
        document.execCommand('selectAll', false, null)
    },
    _blur(e) {
        this.isEditable = false;
    }
});