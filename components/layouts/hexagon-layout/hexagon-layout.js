/* * hexagon-layout.js v1.0
 * (c) 2021 R.A.Perepelkin
 * proman62@gmail.com
 * Under the MIT License.
 */

ODA({is: 'oda-hexagon-layout', imports: '@oda/button',
    template: /*html*/`
    <style>
        :host {
            @apply --vertical;
            @apply --flex;
            justify-content: start;
            overflow: hidden !important;
            position: relative;
            background: {{background}};
            margin:  -{{h / 2 }}px -{{size / 2 + distance}}px;
        }
        :host([tracking]):before {
            content: "";
            position: absolute;
            left: {{tr.left}}px;
            top: {{tr.top}}px;
            width: {{tr.width}}px;
            height: {{tr.height}}px;
            @apply --content;
            opacity: .5;
        }{}
        oda-hexagon-row{
            margin-top: {{h/4+distance}}px;
        }
        oda-hexagon-row:nth-child(odd){
            transform: translateX({{(size / 2)+distance}}px);
        }

    </style>
    <div class="flex vertical">
    <oda-hexagon-row class="no-flex" :distance ~for="rows" :y="$for.index" ~style="{zIndex: + rows - $for.index}"></oda-hexagon-row>
    </div>
    <oda-icon class="error shadow" ~show="showTrash" :icon-size="size" icon="icons:delete" ~style="{right: size + 'px', bottom: size+'px'}" style="position: absolute; z-index: 10000; border-radius: 25%" ></oda-icon>
    `,
    tr: {},

    $pdp: {
        $public: true,
        get width() {
            return this.offsetWidth;
        },
        get height() {
            return this.offsetHeight;
        },
        get size() {
            return Math.min(48, Math.max(this.iconSize, 24)) * 3;
        },
        get h() {
            return (this.size / (Math.sqrt(3) / 2));
        },
        iconSize: {
            $public: true,
            $def: 24,
            // $save: true,
        },
        color1: {
            $public: true,
            $def: 'var(--content-background)',
            $save: true,
            $editor: '@oda/color-picker[oda-color-picker]'
        },
        color2: {
            $public: true,
            $def: 'var(--section-background)',
            $save: true,
            $editor: '@oda/color-picker[oda-color-picker]'
        },
        background: {
            $public: true,
            $def: 'var(--dark-background)',
            $save: true,
            $editor: '@oda/color-picker[oda-color-picker]'
        },
        full: true,
        distance: {
            $def: 1,
            $save: true,
        },
        data: {
            $def: [],
            $save: true,
        },
        tracking: {
            $type: Boolean,
            $attr: true,
            $readOnly: true,
        },
        get layout() {
            return this;
        },
        get rows() {
            return Math.ceil(this.height / this.size) + 1
        },
        showTrash: false,
    },
    $listeners: {
        resize(e) {
            if (this.height < this.offsetHeight)
                this.height = this.offsetHeight;
            if (this.width < this.offsetWidth)
                this.width = this.offsetWidth;
        },
    },
    addItem(item) {
        let row = this.data.find(i => (i.y === (item.y || 0)))
        if (!row)
            this.data.push(row = { y: item.y || 0, items: [] });
        if (row.items.find(i => i.x === (item.x || 0))) {
            return ODA.push(`item in cell[${item.x || 0},${item.y || 0}]already exist!`)
        }
        return row.items.push(item);
    },
    removeItem(item) {
        this.data?.remove(item);
        this.data = [...this.data];
    },
    _drop(e, hex) {
        console.warn('method _drop not implemented!');
    },
})

ODA({is: 'oda-hexagon-row',
    template: /*html*/`
    <style>
        :host {
            position: relative;
            @apply --horizontal;
            @apply --no-flex;
            justify-content: start;

        }
    </style>
    <oda-hexagon ~style="{margin: '0px '+distance+'px'}" class="no-flex" ~for="cols" :x="$for.index" :y></oda-hexagon>
    `,
    $pdp: {
        get items() {
            return this.data?.filter(i => (i.y === this.y)) || [];
        }
    },
    $public: {
        y: 0,
        get cols() {
            return Math.ceil(this.width / this.size) + 1
        }
    },
    _drop(...e) {
        this.domHost._drop(...e);
    },
    add(item) {
        return this.data.add(item);
    },
    remove(item) {
        this.data?.remove(item);
    }
})
ODA({is: 'oda-hexagon',
    template: /*html*/`
    <style>
        :host {
            position: relative;
            background: linear-gradient({{active?background:color1}}, {{active?background:color2}});
            justify-content: center;
            position: relative;
            width: {{size}}px;
            height: {{h/2}}px;
            margin: {{h/4}}px 0px;
            overflow: visible !important;
            padding: 0 !important;
            @apply --horizontal;
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
            border-bottom: {{Math.floor(h/4)}}px solid {{color1}};
            overflow: visible;
            /*z-index:1;*/
        }
        :host([active]):before {
            border-bottom: {{h/4}}px solid {{background}};
        }
        :host([active]):after {
            border-top: {{Math.floor(h/4)}}px solid {{background}};
                z-index: -1;
        }
        :host:after {
            top: 100%;
            border-top: {{Math.floor(h/4)}}px solid {{color2}};
            overflow: visible;
        }
        :host([active]) {
            filter: brightness(.9) !important;
            cursor: pointer;

        }
        :host > * {
            overflow: visible;
        }
        :host(.drag-hover) > div {
            filter: brightness(.6) !important;
        }
        :host(:hover) > .container > label {
            transform: scale(1.5) !important;
            top: {{size}}px !important;
        }
        :host(:hover) .block {
            transform: scale(2) !important;
        }
        :host .block {
            transform: scale(1.5);
            transition: top .5s, transform  .5s;
            position: initial;
        }
        :host([label]) > .container > label {
            white-space: normal;
            overflow: hidden;
            transform: scale(1);
            transition: top .5s, transform  .5s;
            left: -{{size * .25}}px;
            max-height: {{size}}px;

            text-align: center;
            position: absolute;
            content: "{{label}}";
            top: {{size/2 * 1.5}}px;
            font-size: small;
            width: {{size * 1.5}}px;
            @apply --text-shadow;
            background-color: transparent;
            @apply --raised;
        }{}
        .container{
            overflow: visible; 
            align-items: center; 
            align-self: center;
            z-index: 1;
        }
        label{
            border-radius: 8px;
            padding: 4px;
            @apply --info;
        }
    </style>
    <div class="flex vertical container">
        <div ~if="full || item" class="no-flex block" ~is="item?.is" ~props="item?.props"></div>
        <label ~html="label"></label>
    </div>
    `,
    $public: {
        selected: {
            $def: false,
            $attr: true
        },
        label: {
            get() {
                return this.item?.label;
            },
            $attr: true
        },
        draggable: {
            $def: '',
            $attr: true
        },
        x: Number,
        y: Number,
        active: {
            $def: false,
            get() {
                const active = !!this.item;
                this.draggable = active ? 'true' : '';
                return active;
            },
            $attr: true
        },
        item: {
            $pdp: true,
            get() {
                return this?.items?.find(i => (i?.x === this.x)) || null;
            },
        },
        title: {
            get() {
                return this.item?.title || this.label;
            },
            $attr: true
        }
    },
    get allowDrop() {
        return (this.x && this.y && (!this.active || this?.item?.allowDrop));
    },
    $listeners: {
        down(e) {
            e.stopPropagation();
            if (this.active)
                focusedHex = this;
            else
                focusedHex = null;
        },
        tap(e) {
            if (this.item?.tap) {
                e.stopPropagation();
                this.item?.tap(e);
            }
        },
        dragenter(e) {
            if (!this.x || !this.y) return;
            this.classList.add('drag-hover');
        },
        dragend(e) {
            this.showTrash = false;
            if (e.x < (this.layout.offsetWidth - this.size * 3)) return;
            if (e.y < (this.layout.offsetHeight - this.size * 3)) return;
            this.removeItem(this.item);
            this.domHost.items = undefined
        },
        dragstart(e) {
            const obj = { mime: 'oda/hexagon-item' }
            obj.data = Post['oda/hexagon-item'] = this.item;
            Post['host'] = this;
            e.dataTransfer.setData(obj.mime, obj.data);
            this.showTrash = true;
        },
        dragover(e) {
            e.preventDefault()
            if (!this.allowDrop)
                e.dataTransfer.dropEffect = 'none';
        },
        dragleave(e) {
            this.classList.remove('drag-hover')
        },
        drop(e) {
            this.showTrash = false;
            this.classList.remove('drag-hover')
            e.preventDefault()
            for (let type of e.dataTransfer.types) {
                switch (type) {
                    case 'oda/hexagon-item': {
                        const item = Post[type];
                        const host = Post['host'];
                        host.moveTo(this);
                        this.item = undefined;
                        host.item = undefined;
                        this.data = [...this.data];
                        return;
                    } break;
                }
            }
            this.domHost._drop(e, this);
        }
    },
    remove() {
        this.data.remove(this.item);
    },
    moveTo(hex) {
        if (!hex.item) {
            const item = this.item;
            item.y = hex.y;
            item.x = hex.x;
        }
    }
})

const Post = {};
let focusedHex;