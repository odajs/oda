ODA({is: "oda-ruler-grid", template: /*html*/`
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                /*overflow: hidden;*/
            }
        </style>
        <oda-ruler ~if="showScale" ></oda-ruler>

        <div ref="main" class="horizontal flex">
            <oda-ruler ~if="showScale" vertical></oda-ruler>
            <div ref="grid" class="flex vertical" style="position:relative; overflow: hidden" ~style="{height:_mainHeight(), width:_w}" @scroll="render"   @resize="onResize">
                <svg ~show="showGrid" :width :height class="flex">
                    <defs>
                        <pattern id="smallGrid" patternUnits="userSpaceOnUse" :width="sizeSmall" :height="sizeSmall">
                            <line x1="0" y1="0" x2="0" :y2="sizeSmall" fill="none" stroke="gray" stroke-width="0.5"></line>
                            <line x1="0" y1="0" y2="0" :x2="sizeSmall" fill="none" stroke="gray" stroke-width="0.5"></line>
                        </pattern>
                        <pattern id="grid" patternUnits="userSpaceOnUse" :width="sizeBig" :height="sizeBig">
                            <rect width="100%" height="100%" fill="url(#smallGrid)"></rect>
                            <line x1="0" y1="0" x2="0" :y2="sizeBig" fill="none" stroke="gray" stroke-width="1"></line>
                            <line x1="0" y1="0" y2="0" :x2="sizeBig" fill="none" stroke="gray" stroke-width="1"></line>
                        </pattern>
                    </defs>
                    <rect :width="_w" :height="_h" fill="url(#grid)"></rect>
                </svg>
                <div id="slot" class="vertical flex" style="overflow: visible; position: absolute; top: 0px; left: 0px;">
                    <slot class="flex vertical" name="content" ></slot>
                </div>
            </div>
        </div> 
    `,
    onResize(e){
        this.width = e.target.scrollWidth;
        this.height = e.target.scrollHeight;
    },
    width: 0,
    height: 0,
    props: {
        gridColor: {
            default: 'darkgray',
            editor: '@oda/color-picker',
            save: true,
        },
        showGrid: {
            default: true,
            save: true,
        },
        showScale: {
            default: true,
            save: true,
        }
    },
    zoom: 1,
    get sizeBig() {
        return this.sizeSmall * 10;
    },
    get sizeSmall() {
        return Math.round(this.step * this.zoom);
    },
    get unit() {
        return this.step === 0.1 ? 'mm'
            : (this.step === 1 || this.step === 10) ? 'cm'
                : (this.step === 100 || this.step === 1000 || this.step === 10000) ? 'm'
                    : 'km';
    },
    get unitVal() {
        return this.step === 0.1 ? 1
            : (this.step === 1 || this.step === 10) ? this.step
                : (this.step === 100 || this.step === 1000 || this.step === 10000) ? this.step / 100
                    : this.step / 100000;
    },
    get percent() {
        return this.zoom === 1 ? '100%'
            : this.zoom < 1 ? `${this.zoom < 0.0001 ? Math.round(this.zoom * 100000000) / 1000000 : Math.round(this.zoom * 10000) / 100}%`
                : `${Math.round(this.zoom * 100)}%`;
    },
    listeners: {
        mousewheel(e) {
            if (!(e.ctrlKey || e.optionKey)) return;
            e.stopPropagation();
            e.preventDefault();
            const k = 0.9;
            this.zoom = e.deltaY <= 0 ? Math.min(400, this.zoom / k) : Math.max(1 / 100000000, this.zoom * k);
            // this._setStep();
        }
    },
    _mainHeight() {
        return (window.innerHeight - (this.$refs?.main?.offsetTop || 0));
    },
    get _w() {
        return (this.$refs?.main?.offsetWidth + this.$refs?.grid?.scrollLeft - 30 || 0) / (this.zoom < 1 ? this.zoom : 1);
    },
    get _h() {
        return (this.$refs?.main?.offsetHeight + this.$refs?.grid?.scrollTop || 0) / (this.zoom < 1 ? this.zoom : 1);
    },
    // _scrollLeft() {
    //     return this.$refs?.grid?.scrollLeft;
    // },
    // _scrollTop() {
    //     return this.$refs?.grid?.scrollTop;
    // },
    _rulerHCount() {
        return Math.ceil((window.outerWidth + this.$refs?.grid?.scrollLeft) / this.sizeBig) || 1;
    },
    _rulerVCount() {
        return Math.ceil((window.outerHeight + this.$refs?.grid?.scrollTop) / this.sizeBig) || 1;
    },
    get step(){
        return this.zoom === 1?10:10;
    },
    // _setStep(zoom = this.zoom, step = this.step) {
    //     if (zoom === 1) {
    //         this.zoom = 1;
    //         this.step = 10;
    //     } else {
    //         zoom = zoom > 1 ? Math.min(400, zoom) : Math.max(1 / 100000000, zoom);
    //         if (zoom === 400 || zoom === 1 / 100000000) {
    //             this.zoom = zoom;
    //         } else {
    //             if ((step * zoom) > 50)
    //                 step = step / 10;
    //             else if ((step * zoom) < 5)
    //                 step = step * 10;
    //             if (step !== this.step)
    //                 this.step = step;
    //         }
    //     }
    // }
})
ODA({is: 'oda-ruler',
    template:`
        <style>
            :host{
                @apply --shadow;
                min-width: 24px;
                min-height: 24px;
            }
        </style>
        <div style="font-size:12px; min-width: 30px;max-width:30px ">{{unit}}</div>
        <svg class="flex">
            <g ~for="count">
                <line ~props="getBigLine(index)"  fill="none" stroke="gray" stroke-width="1"></line>
                <line ~props="getBigLine(index)" fill="none" stroke="gray" stroke-width="1"></line>
                <text :x="index * sizeBig + 4 - domHost.scrollLeft" y="12" style="font-size:12px;fill:gray">{{index * unitVal}}</text>
            </g>
        </svg>
    `,
    count: 10,
    getBigLine(index){
        if (!this.vertical){
            const x = index * this.sizeBig - this.domHost.scrollLeft;
            return {x1: x, x2: x, y1: 4, y2: 24}
        }
    },
    getSmallLine(index){
    //:x1="i * sizeBig - _scrollLeft() + sizeBig / 2" y1="14" :x2="i * sizeBig - _scrollLeft() + sizeBig / 2" y2="30"
        if (!this.vertical){
            const x = index * this.sizeBig - this.domHost.scrollLeft + this.sizeBig / 2;
            return {x1: x, x2: x, y1: 14, y2: 30}
        }
    },
    vertical: false
})

//:x1="i * sizeBig - _scrollLeft()" y1="4" :x2="i * sizeBig - scrollLeft()" y2="24"