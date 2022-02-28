ODA({is: 'oda-base-container',
    template: /*html*/`
        <style>
            :host {
                /*visibility: {{opened?'visible':'hidden'}};*/
                /*position: fixed;*/
                /*z-index: 100;*/
                /*left: 0;*/
                /*top: 0;*/
                /*width: 100%;*/
                /*height: 100%;*/
                overflow: hidden;
                /*background-color: rgba(0, 0, 0, 0.5);*/
                pointer-events: auto;
                @apply --vertical;
            }
            :host .container {
                transform: scale({{_zoom}});
                transition: transform {{animation}}ms;
                max-width: 100%;
                max-height: 100%;
            }
            ::slotted(*) {
                @apply --flex;
            }
        </style>
        <slot name="title">
            <oda-modal-title :title :slot="(fullSize || titleMode === 'full')?'title':(titleMode === 'auto'?'title1':'?')" class="no-flex content horizontal" ~style="{alignItems: fullSize?'initial':'center'}" style="color: white; text-align: center;"></oda-modal-title>
        </slot>
        <div class="flex vertical" style="justify-content: center;">
            <div class="container vertical shadow" ~class="fullSize?'flex':'no-flex'"  ~style="{alignSelf: fullSize?'initial':'center'}">
                <slot name="title1"></slot>
                <slot @slotchange="onSlot" @tap.stop class="shadow content vertical" ~class="fullSize?'flex':'no-flex'"></slot>
            </div>
        </div>
    `,
    props: {
        _zoom: 0,
        title: '',
        titleMode: {
            default: 'none',
            list: ['none', 'auto', 'full']
        },
        fullSize: false,
        opened: false,
        animation: 0,
        iconSize: {
            default: 24,
        },
        control: {
            set(n, o) {
                if (o)
                    this.removeChild(o);
                if (n)
                    this.appendChild(n);
            }
        }
    },
    listeners: {
        tap: 'close'
    },
    show(ctrl, props = {}) {
        for (let p in props) {
            this[p] = props[p];
        }
        this.control = ctrl;
        this.opened = true;
        this._zoom = 1;
        if (!this.parentElement)
            document.body.appendChild(this);
    },
    close() {
        this._zoom = 0;
        this.async(() => {
            this.opened = false;
            this._control = null;
            this.remove();
        }, this.animation)
    },
    onSlot(e) {
        if (this.component) return;
        const els = e.target.assignedElements();
        if (!els.length) return;
        this.component = els[0];
    }
})
ODA({is: 'oda-modal-title', imports: '@oda/button',
    template: /*html*/`
        <div class="flex">{{title}}</div>
        <oda-button @tap="domHost.close()" class="no-flex content" icon="icons:close"></oda-button>
    `,
    props: {
        title: ''
    }
})