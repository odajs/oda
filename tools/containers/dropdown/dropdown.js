ODA({ is: 'oda-dropdown', imports: '@oda/title',
    template: /*html*/`
        <style>
            @keyframes fadin {
                from {background-color: rgba(0, 0, 0, 0)}
                to {background-color: rgba(0, 0, 0, 0.1)}
            }
            :host {
                pointer-events: none;
                height: 100%;
            }
            :host([fadein]){
                animation: fadin 5s ease-in-out;
                background-color: rgba(0, 0, 0, 0.1);
            }
            :host>div{
                left: 0px;
                top: 0px;
                transform: translate({{_left}}px, {{_top}}px);
                pointer-events: {{isVisible ? 'auto' : 'none'}};
                visibility: {{isVisible ? 'visible' : 'hidden'}};
                position: fixed;
                overflow: hidden;
                max-height: {{maxHeight?maxHeight:'100%'}};
                max-width: {{maxWidth?maxWidth:'100%'}};
                min-width: {{minWidth?minWidth:'100px'}};
                min-height: {{minHeight?minHeight:'0px'}};
            }
        </style>
        <div :border="isVisible" class="vertical raised content" style="overflow: hidden;" @resize="onResize">
            <div ~if="title" class="horizontal no-flex accent-invert" style="align-items: center; overflow: hidden">
                <oda-icon ~if="icon" no-flex :icon :icon-size :sub-icon style="margin-left: 8px;"></oda-icon>
                <label ~if="title" class="flex" ~html="title" style="text-overflow: ellipsis; white-space: nowrap; padding: 8px; overflow: hidden;"></label>
                <div class="flex" style="overflow: hidden;">
                    <slot class="no-flex" name="modal-title"></slot>
                </div>
                <oda-button :icon-size="iconSize + 4" icon="icons:close" @tap.stop="cancel" style="background-color: red; align-self: flex-start;"></oda-button>
            </div>
            <div class="flex vertical" style="overflow: auto;" >
                <slot @slotchange="onSlotChange"></slot>
            </div>
        </div>
    `,
    get _left(){
        let left = 0;
        switch (this.align){
            case 'right':
                left =  this._startPoint.x;
                break;
            case 'left':
                left = this._startPoint.x - (this._contentRect?.width || 0);
                break;
        }
        if (left<0)
            left = 0;
        if (this._contentRect && left + this._contentRect.width>window.innerWidth){
            left = window.innerWidth - this._contentRect.width;
        }
        return left * this.zoom;
    },
    get _top(){
        let top = 0;
        switch (this.drop){
            case 'down':
                top = this._startPoint.y;
                break;
            case 'up':
                top = this._startPoint.y - (this._contentRect?.height || 0);
                break;
        }
        if (top < 0)
            top = 0;
        if (this.fixedTop)
            this.maxHeight = `calc(100% - ${this._startPoint.y + 2}px)`;
        else if (this._contentRect && top + this._contentRect.height>window.innerHeight)
            top = window.innerHeight - this._contentRect.height;
        return top * this.zoom;
    },
    get _startPoint(){
        const anchor = this.anchor || (this.align === 'left'?'right-bottom':'left-bottom');
        switch (anchor){
            case 'top-left':
            case 'left-top':
                return {x: this._parentRect.x, y: this._parentRect.y}
            case 'right-top':
            case 'top-right':
                return {x: this._parentRect.x + (this._parentRect.width || 0), y: this._parentRect.y}
            case 'left-bottom':
            case 'bottom-left':
                return {x: this._parentRect.x, y: this._parentRect.y + (this._parentRect.height || 0)}
            case 'right-bottom':
            case 'bottom-right':
                return {x: this._parentRect.x + (this._parentRect.width || 0), y: this._parentRect.y + (this._parentRect.height || 0)}
        }
    },
    get zoom(){
        let zoom = 1;
        if (this.parent){
            let p = this.parent;
            while(p){
                zoom *= +(getComputedStyle(p).zoom);
                p = (p.parentElement || p.domHost);
            }
        }
        return zoom;
    },
    get _parentRect(){
        const zoom = this.zoom;
        return this.parent?.getBoundingClientRect() || ODA.mousePos;
    },
    onResize(e){
        this._contentRect = e.target?.getBoundingClientRect();
        if (this.parent){
            if (this.useParentWidth || !this.anchor.includes(this.align))
                this.minWidth ??= this._parentRect.width + 'px';
            if (this.useParentWidth)
                this.maxWidth ??= this._parentRect.width + 'px';
        }
        this.debounce('isVisible', ()=>{
            this.isVisible = true;
        }, 100)
    },
    cancel(e){
        this.fire('cancel')
    },
    onSlotChange(e) {
        this.controls = e.target.assignedNodes();
    },
    isVisible: false,
    $public: {
        fadein: {
            $def: false,
            $attr: true
        },
        align: {
            $def: 'right',
            $list: ['left', 'right']
        },
        drop:{
            $def: 'down',
            $list: ['down', 'up']
        },
        anchor:{
            $def: 'left-bottom',
            $list: ['left-bottom', 'right-bottom', 'right-bottom', "right-top"]
        },
        useParentWidth: false,
        minWidth: undefined,
        maxWidth: undefined,
        minHeight: undefined,
        maxHeight: undefined,
        fixedTop: false
    },
    $pdp: {
        get control() {
            return this.controls?.[0];
        },
        iconSize: 24,
        title: undefined,
        icon: '',
        subIcon: '',
        parent: null,
    },
    _contentRect: null,
})