import '../../buttons/button/button.js';
ODA({is: 'oda-form-layout', template:`
    <style>
        :host{
            @apply --vertical;
            @apply --flex;
            @apply --content;
            position: relative;
            overflow: hidden;
            height: 100%;
            touch-action: manipulation;
        }
        :host([modal]){
            position: fixed;
            z-index: 10;
            @apply --shadow;
            min-width: 280px;
            min-height: 150px;
        }
        :host([modal][size='normal']){
            padding: 4px;
            background-color: silver;
        }
        @media (max-width: 600px){
            :host([modal]){
                left: 0px !important;
                top: 0px !important;
                width: 100% !important;
                height: 100% !important;
            }
        }
        .close:hover{
            cursor: pointer;
            background-color: red;
            color: white !important;
            fill: white !important;
        }
        :host .title{
            cursor: grab;
            cursor: -webkit-grab;
            cursor: -moz-grab;
        }
        :host .title:active{
            cursor: grabbing;
            cursor: -webkit-grabbing;
            cursor: -moz-grabbing;
        }
    </style>
    <div ~if="showTitle" class="horizontal no-flex dark between title" style="align-items: center; fill: white" @track="_move" @dblclick.stop="_max">
        <div class="horizontal">
            <oda-icon ~if="size !== 'min'" :icon="icon" :size="iconSize * .7" style="margin-left: 2px" @dblclick.stop="_close"></oda-icon>
        </div>

        <div class="flex horizontal" style="align-items: center; overflow: hidden; justify-content: center; font-size: large">
            <slot ~if="size !== 'min'" name="title">
                <span slot="title" style="font-size: small; text-align: center; text-overflow: ellipsis;">{{titleLabel}}</span>
            </slot>
        </div>

        <div class="horizontal">
            <oda-button  ~if="modal && size !== 'min'" icon="icons:remove" :size="iconSize /2" @tap="_min" :style="{padding: iconSize/8 + 'px ' + iconSize/4 + 'px'}"></oda-button>
            <oda-button ~if="modal" :icon="size === 'normal'?'icons:launch':'icons:check-box-outline-blank'" :size="iconSize / 2" @tap="_max" ~style="{padding: iconSize/8 + 'px ' + iconSize/4 + 'px'}"></oda-button>
            <oda-button class="close" icon="icons:close" :size="iconSize /2" @tap="_close" ~style="{padding: iconSize/8 + 'px ' + iconSize/4 + 'px'}"></oda-button>
        </div>
    </div>`,
    props: {
        unique: String,
        settingsId: {
            type: String,
            get(){
                return this.localName;
            }
        },
        titleLabel:{
            default: 'ODANT',
            reflectToAttribute: true
        },
        pos:{
            type: Object,
            default:{
                left: 50,
                top: 50,
                size: 'normal',
                width: 600,
                height: 400,
            },
        },
        maxWidth: 500,
        size:{
            default: 'normal',
            reflectToAttribute: true,
            list:['min', 'normal', 'max'],
            set(n){
                switch (n) {
                    case 'max':
                    case 'normal':{
                        this.getModals().forEach(form => {
                            form.size = n;
                            this.__write(this.settingsId + '/size', n);
                        })
                    } break;
                }
            }
        },
        icon: 'class',
        showTitle: false,
        modal: {
            type: Boolean,
            reflectToAttribute: true,
            set(n, o){
                if (n){
                    this.showTitle = true;
                }
            }
        },
        iconSize: 24,
        hidden: {
            default: true,
            reflectToAttribute: true,
        },
        _moving: false,
    },
    observers:[
        function _setTransform(modal, size){
            this._setTransform(this.pos);
        }
    ],
    _getPadding(){
        const styleMap = this.host.computedStyleMap();
        const left = styleMap.get('padding-left').value;
        const right = styleMap.get('padding-right').value;
        const top = styleMap.get('padding-top').value;
        const bottom = styleMap.get('padding-bottom').value;
        return { left, right, top, bottom};
    },
    listeners: {
        mousemove(e) {
            if (this.modal && this.size === 'normal' && !this._moving) {
                const y = e.y;
                const x = e.x;
                const padding = this._getPadding();
                if (x - this.host.offsetLeft < padding.left) {
                    if (y - this.host.offsetTop < padding.top)
                        this.style.cursor = 'nwse-resize';
                    else if (this.host.offsetTop + this.host.offsetHeight - y < padding.bottom)
                        this.style.cursor = 'nesw-resize';
                    else
                        this.style.cursor = 'ew-resize';
                }
                else if (this.host.offsetLeft + this.host.offsetWidth - x < padding.right) {
                    if (y - this.host.offsetTop < padding.top)
                        this.style.cursor = 'nesw-resize';
                    else if (this.host.offsetTop + this.host.offsetHeight - y < padding.bottom)
                        this.style.cursor = 'nwse-resize';
                    else
                        this.style.cursor = 'ew-resize';
                }
                else if (y - this.host.offsetTop < padding.top)
                    this.style.cursor = 'ns-resize';
                else if (this.host.offsetTop + this.host.offsetHeight - y < padding.bottom)
                    this.style.cursor = 'ns-resize';
                else
                    this.style.cursor = 'default';
            }
        },
        track(e){
            if (this.modal && this.size === 'normal'){
                this._moving = true;
                switch(e.detail.state){
                    case 'start':{
                        const padding = this._getPadding();
                        this._deltaX = this.offsetLeft + this.offsetWidth - e.detail.x;
                        if (this._deltaX > padding.left){
                            this._deltaX = this.offsetLeft - e.detail.x;
                            if (this._deltaX < -padding.right)
                                this._deltaX = 0;
                        }

                        this._deltaY = this.offsetTop + this.offsetHeight - e.detail.y;
                        if (this._deltaY > padding.top){
                            this._deltaY = this.offsetTop - e.detail.y;
                            if (this._deltaY < -padding.bottom)
                                this._deltaY = 0;
                        }
                    } break;
                    case 'track':{
                        if (this._deltaX>0)
                            this._setTransform({ width: e.detail.start.x + this._deltaX + e.detail.dx - this.offsetLeft });
                        else if (this._deltaX<0){
                            this._setTransform({ left: e.detail.x - this._deltaX, width: this.pos.width - e.detail.ddx });
                        }

                        if (this._deltaY>0)
                            this._setTransform({ height: e.detail.start.y + this._deltaY + e.detail.dy - this.offsetTop });
                        else if (this._deltaY<0){
                            this._setTransform({ top: e.detail.y - this._deltaY, height: this.pos.height - e.detail.ddy});
                        }

                    } break;
                    case 'end':{
                        this._setTransform(this.pos, true);
                        this.fire('resize');
                        this._moving = false;
                    } break;
                }
            }
        },
        resize (e) {
            if (this.modal && this.size !== 'max' && window.innerWidth < this.maxWidth){
                this._max();
            }
        },

        down: function (e) {
            this._top();
        },
    },
    _top(){
        if (this.modal){
            const my = Number(getComputedStyle(this.host)["zIndex"]);
            const z = this.getModals().reduce((res, el)=>{
                const z = Number(getComputedStyle(el)["zIndex"]);
                if (z>res)
                    res = z;
                return res;
            },0);
            if (my <= z){
                this.style.zIndex = z+1;
            }
        }
    },
    getModals(){
        if (this.parentElement)
            return Array.from(this.parentElement.children).filter(el=>el !== this.host && el.localName === this.localName);
        return [];
    },
    attached() {
        const me = this.unique && this.getModals().find(i=>i.unique === this.unique);
        if (me){
            me._top();
            this.remove();
            return;
        }
        this.fire('resize');
        if (this.modal){
            this.async(()=>{
                this.size = this.__read(this.settingsId + '/size', this.size);
                this.getModals().forEach(el=>{
                    if (el.modal){
                        if (el.pos.left === this.pos.left) {
                            this._setTransform({ left: this.pos.left + this.iconSize });
                        }
                        if (el.pos.top === this.pos.top) {
                            this._setTransform({ top: this.pos.top + this.iconSize });
                        }

                    }
                });
                this._top();
                this.hidden = false;
            }, 100);
        }else{
            this.hidden = false;
        }
        window.addEventListener('resize', ()=>{
            this._setTransform();
        });
    },
    _close(e){

    },
    _min(e){
        this._transition();
        this.size = 'min';
        this.fire('resize');
    },
    _max(e){
        this._transition();
        if(this.size === 'normal')
            this.size = 'max';
        else
            this.size = 'normal';
        this.fire('resize');
    },
    _move(e){
        if (this.modal && this.size === 'normal'){
            switch(e.detail.state){
                case 'track':{
                    this._setTransform({left: this.pos.left + e.detail.ddx, top: this.pos.top + e.detail.ddy});
                } break;
            }
        }
    },
    _transition(){
        this.style.transition = 'all 0.25s';
        this.async(() => {
            this.style.transition = '';
        }, 250);
    },
    _setTransform({ left = this.pos.left, top = this.pos.top, width = this.pos.width, height = this.pos.height } = this.pos, save = false) {
        if (this.modal && this.parentElement) {
            switch (this.size) {
                case 'normal':{
                    width = Math.min(window.innerWidth, Math.max(200, width));
                    height = Math.min(window.innerHeight, Math.max(200, height));
                    left = Math.min(window.innerWidth - width, Math.max(0 - this.parentElement.offsetLeft, left));
                    top = Math.min(window.innerHeight - height, Math.max(0 - this.parentElement.offsetTop, top));

                    this._styles = `:host{ left: ${this.pos.left}px !important; top: ${this.pos.top}px !important; width: ${this.pos.width}px !important; height: ${this.pos.height}px !important; }`;

                    this.pos.left = left;
                    this.pos.top = top;
                    this.pos.width = width;
                    this.pos.height = height;
                    if(save){
                        this.debounce('save-transform', ()=> {
                            this.__write(this.settingsId + '/left', left);
                            this.__write(this.settingsId + '/top', top);
                            this.__write(this.settingsId + '/width', width);
                            this.__write(this.settingsId + '/height', height);
                        }, 300);
                    }
                }break;
                case 'min':{
                    this._styles = `:host{
                                        min-width: 280px !important; 
                                        min-height: 150px !important;
                                        width: 280px !important; 
                                        height: 150px !important;
                                        top: calc(100vh - 150px - 32px);
                                        left: calc(100vw - 280px - 32px);
                                    }`;
                }break;
                case 'max':{
                    this._styles = `:host{ left: 0px; top: 0px; width: 100%; height: 100%; }`;
                }break;
                default:
                    break;
            }
        } else {
            this._styles = '';
        }
    },
    created(){
        this.pos.left = Math.max(this.__read(this.settingsId + '/left', this.pos.left), 10);
        this.pos.top =  Math.max(this.__read(this.settingsId + '/top', this.pos.top), 10);
        this.pos.width = this.__read(this.settingsId + '/width', this.pos.width);
        this.pos.height = this.__read(this.settingsId + '/height', this.pos.height);
        this._setTransform();
    }
});
