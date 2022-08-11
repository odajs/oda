ODA({ is: "oda-ruler-grid", template: /*html*/`
    <style>
        :host {
            position: relative;
            @apply --vertical;
            @apply --flex;
            overflow: hidden;
            background-color: {{backgroundColor}};
        }
    </style>
    <oda-ruler ~if="showScale"></oda-ruler>
    <div class="horizontal flex">
        <oda-ruler ~if="showScale" vertical></oda-ruler>
        <div class="flex vertical" style="overflow: hidden; position: relative;">
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
                <rect :transform="\`translate(\${-left} \${-top})\`" fill="url(#bigLines)" width="10000" height="10000"></rect>
                <rect :transform="\`translate(\${-left} \${-top})\`" fill="url(#smallLines)" width="10000" height="10000"></rect>
            </svg>
            <div id="slot" class="vertical" style="overflow: auto; position: absolute; top: 0px; left: 0px; right: 0px; bottom: 0px;" @scroll="onScroll" @resize="onResize">
                <slot class="flex vertical" name="content"></slot>
            </div>
        </div>
    </div>
    `,
    onScroll(e) {
        this.left = undefined;
        this.top = undefined;
    },
    onResize(e) {
        this.slotDiv.style.overflow = 'hidden';
        this.width = undefined;
        this.height = undefined;
        this.left = undefined;
        this.top = undefined;
        this.interval('rul-resize', () => {
            this.slotDiv.style.overflow = 'auto';
        });
    },
    get left() {
        return this.slotDiv?.scrollLeft || 0;
    },
    get top() {
        return this.slotDiv?.scrollTop || 0;
    },
    get width() {
        return this.slotDiv?.scrollWidth;
    },
    get height() {
        return this.slotDiv?.scrollHeight;
    },
    get slotDiv() {
        return this.$('#slot') || undefined;
    },
    props: {
        backgroundColor: {
            default: 'white',
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
        iconSize: 32,
        zoom: {
            default: 1,
            save: true
        },
    },
    get sizeBig() {
        return this.sizeSmall * 10;
    },
    get sizeSmall() {
        return Math.round(this.step * this.zoom);
    },
    get unit() {
        if (this.step === 1)
            return 'mm';
        if (this.step === 10)
            return 'cm';
        if (this.step === 100)
            return 'm';
        return 'km';
    },
    get unitVal() {
        if (this.step === 1)
            return 1;
        if (this.step === 10)
            return this.step;
        if (this.step === 100)
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
            // this.$('#slot').scrollBy(e.clientX, e.clientY);
        }
    },
    get step() {
        let step = 10;
        if (this.zoom === 1) {
            step = this.zoom * 10;
        } else {
            let zoom = this.zoom > 1 ? Math.min(400, this.zoom) : Math.max(1 / 100000000, this.zoom);
            if (zoom === 400 || zoom === 1 / 100000000) { // min & max zoom предел
                this.zoom = zoom;
                step = 1;
            } else {
                if ((step * zoom) > 50) // zoom in && step to lower
                    step = step / 10;
                else if ((step * zoom) < 5) // zoom out && step to high
                    step = step * 10;
            }
        }
        return step;
        // let step = this.zoom * 10;
        // step = Math.round((step < 5 ? 5 : step) / 10) * 10;
        // return step;
    }
})
ODA({ is: 'oda-ruler', template: /*html*/`
    <style>
        :host {
            @apply --horizontal;
            @apply --shadow;
            width: {{vertical?iconSize+'px':'auto'}};
            height: {{!vertical?iconSize+'px':'auto'}};
            {{vertical?'width: \${iconSize}px;':'height: \${iconSize}px;'}}
            @apply --header;
            z-index: 2;
        }
    </style>
    <div style="font-size: xx-small; min-width: 24px; max-width: 24px; text-align: center; align-self: center;" class="no-flex" ~if="!vertical">{{unit}}</div>
    <svg class="flex content">
        <pattern id="rullerBigLines" :width="!vertical?sizeBig:1" :height="vertical?sizeBig:1" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" :x2="vertical?1:0" :y2="vertical?0:1" fill="none" stroke="gray" stroke-width="1"></line>
        </pattern>
        <pattern id="rullerSmallLines" :width="!vertical?sizeSmall:1" :height="vertical?sizeSmall:1" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" :x2="vertical?1:0" :y2="vertical?0:1" fill="none" stroke="gray" stroke-width="0.5"></line>
        </pattern>
        <rect :transform fill="url(#rullerBigLines)" :width="vertical?iconSize:'10000'" :height="!vertical?iconSize:10000"></rect>
        <rect :transform fill="url(#rullerSmallLines)" :width="vertical?iconSize/2:'10000'" :height="!vertical?iconSize/2:10000"></rect>
        <!-- <g ~for="count">
            <text :transform="\`translate(\${vertical?0:-left} \${vertical?-top:0})\`" style="font-size: xx-small; fill: gray">{{index * unitVal}}</text>
        </g> -->
    </svg>
    `,
    get transform(){
        const size = this.iconSize/2;
        const x = this.vertical?size:-this.left;
        const y = this.vertical?-this.top:size;
        return `translate(${x} ${y})`;
    },
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
            const x = index * this.sizeBig - this.domHost.scrollLeft + 0.5;
            return { x1: x, x2: x, y1: 4, y2: 24 };
        } else {
            const y = index * this.sizeBig - this.domHost.scrollTop + 0.5;
            return { x1: 4, x2: 24, y1: y, y2: y };
        }
    },
    getSmallLine(index) {
        if (!this.vertical) {
            const x = index * this.sizeBig - this.domHost.scrollLeft + this.sizeBig / 2 + 0.5;
            return { x1: x, x2: x, y1: 14, y2: 30 };
        } else {
            const y = index * this.sizeBig - this.domHost.scrollTop + this.sizeBig / 2 + 0.5;
            return { x1: 14, x2: 30, y1: y, y2: y };
        }
    },
    getTextLine(index) {
        if (!this.vertical) {
            const x = index * this.sizeBig + 4 - this.domHost.scrollLeft;
            return { x: x, y: 12 };
        } else {
            const y = index * this.sizeBig + 14 - this.domHost.scrollTop;
            return { x: 5, y: y };
        }
    },
});