ODA({is: "oda-ruler-grid", template: /*html*/`
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                /*overflow: hidden;*/
            }
        </style>
        <oda-ruler ~if="showScale"></oda-ruler>
        <div ref="main" class="horizontal flex">
            <oda-ruler ~if="showScale" vertical></oda-ruler>
            <div class="flex vertical" style="position:relative; overflow: hidden"  @resize="onResize">
                <svg ~if="showGrid" class="flex">
                    <defs>
                        <pattern id="smallLines" patternUnits="userSpaceOnUse" :width="sizeSmall" :height="sizeSmall">
                            <line x1="0" y1="0" x2="0" :y2="sizeSmall" fill="none" stroke="gray" stroke-width="0.5"></line>
                            <line x1="0" y1="0" y2="0" :x2="sizeSmall" fill="none" stroke="gray" stroke-width="0.5"></line>
                        </pattern>
                        <pattern id="bigLines" patternUnits="userSpaceOnUse" :width="sizeBig" :height="sizeBig">
                            <line x1="0" y1="0" x2="0" :y2="sizeBig" fill="none" stroke="gray" stroke-width="1"></line>
                            <line x1="0" y1="0" y2="0" :x2="sizeBig" fill="none" stroke="gray" stroke-width="1"></line>
                        </pattern>
                    </defs>
                    <rect class="flex" fill="url(#bigLines)" :width :height></rect>
                    <rect fill="url(#smallLines)" :width :height></rect>
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
        },
        iconSize: 32
    },
    zoom: 1,
    get sizeBig() {
        return this.sizeSmall * 10;
    },
    get sizeSmall() {
        return Math.round(this.step * this.zoom);
    },
    get unit() {
        if (this.step<1)
            return 'mm';
        if (this.step<1000)
            return 'cm';
        if (this.step<100000)
            return 'm';
        return 'km';
    },
    get unitVal() {
        if (this.step<1)
            return 1;
        if (this.step<1000)
            return this.step;
        if (this.step<100000)
            return this.step / 100;
        return this.step / 1000000;
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
        }
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
ODA({is: 'oda-ruler', template: /*html*/`
        <style>
            :host {
                @apply --horizontal;
                @apply --shadow;
                width: {{vertical?iconSize+'px':'auto'}};
                height: {{!vertical?iconSize+'px':'auto'}};
                {{vertical?'width: 24px;':'height: 24px;'}}
            }
        </style>
        <div style="font-size:12px; min-width: 24px; max-width: 24px; text-align: center" class="no-flex" ~if="!vertical">{{unit}}</div>
        <svg class="flex" style="width: 100%; height: 100%">
            <g ~for="count">
                <line ~props="getBigLine(index)" fill="none" stroke="gray" stroke-width="1"></line>
                <line ~props="getSmallLine(index)" fill="none" stroke="gray" stroke-width="1"></line>
                <text ~props="getTextLine(index)" style="font-size:12px;fill:gray">{{index * unitVal}}</text>
            </g>
        </svg>
    `,
    props: {
        vertical: {
            type: Boolean,
            reflectToAttribute: true
        }
    },
    get count() {
        return Math.ceil((this.vertical ? (this.height + this.domHost.scrollTop) : (this.width + this.domHost.scrollLeft)) / this.sizeBig) || 1;
    },
    getBigLine(index) {
        if (!this.vertical) {
            const x = index * this.sizeBig - this.domHost.scrollLeft;
            return {x1: x, x2: x, y1: 4, y2: 24};
        } else {
            const y = index * this.sizeBig - this.domHost.scrollTop;
            return {x1: 4, x2: 24, y1: y, y2: y};
        }
    },
    getSmallLine(index) {
        if (!this.vertical) {
            const x = index * this.sizeBig - this.domHost.scrollLeft + this.sizeBig / 2;
            return {x1: x, x2: x, y1: 14, y2: 30};
        } else {
            const y = index * this.sizeBig - this.domHost.scrollTop + this.sizeBig / 2;
            return {x1: 14, x2: 30, y1: y, y2: y};
        }
    },
    getTextLine(index) {
        if (!this.vertical) {
            const x = index * this.sizeBig + 4 - this.domHost.scrollLeft;
            return {x: x, y: 12};
        } else {
            const y = index * this.sizeBig + 14 - this.domHost.scrollTop;
            return {x: 0, y: y};
        }
    },
});