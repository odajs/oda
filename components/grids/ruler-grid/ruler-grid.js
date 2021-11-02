ODA({
    is: "oda-ruler-grid", template: /*html*/`
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                position: absolute;
                overflow: hidden;
                width: 100%;
                height: 100%;
            }
        </style>
        <div ~show="showGrid" ~for="lineType in ['horizontal big', 'vertical big', 'horizontal', 'vertical']" style="position:absolute; width:100%; height:100%;" ~style="_getLineStyle(lineType)"></div>
    `,
    props: {
        gridColor: {
            default: 'darkgray',
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
        zoom: 1,
        step: 10,
        width: 0,
        height: 0
    },
    _getLineStyle(lineType = '') {
        if (!lineType || !this.gridColor) return '';
        let res = 'background:repeating-linear-gradient(';

        if (lineType.includes('vertical'))
            res += 'to right,';

        const step = lineType.includes('big') ? this.sizeBig : this.sizeSmall;
        res += `${this.gridColor} 0px, ${this.gridColor} 1px, transparent 1px, transparent ${step}px);`

        if (!lineType.includes('big'))
            res += 'opacity: 0.5;';

        res += `min-width:${this.width}px; min-height:${this.height}px;`;

        return res;
    },
    get sizeBig() {
        return this.sizeSmall * 10;
    },
    get sizeSmall() {
        // return this.step === 0.1 ? 0 : this.sizeBig / 10;
        return Math.round(this.step * this.zoom);
    },
    // get _unit() {
    //     return this.step === 0.1 ? 'mm'
    //         : (this.step === 1 || this.step === 10) ? 'cm'
    //             : (this.step === 100 || this.step === 1000 || this.step === 10000) ? 'm'
    //                 : 'km';
    // },
    // get _unitVal() {
    //     return this.step === 0.1 ? 1
    //         : (this.step === 1 || this.step === 10) ? this.step
    //             : (this.step === 100 || this.step === 1000 || this.step === 10000) ? this.step / 100
    //                 : this.step / 100000;
    // },
    // get _percent() {
    //     return this.zoom === 1 ? '100%'
    //         : this.zoom < 1 ? `${this.zoom < 0.0001 ? Math.round(this.zoom * 100000000) / 1000000 : Math.round(this.zoom * 10000) / 100}%`
    //             : `${Math.round(this.zoom * 100)}%`;
    // },
    // listeners: {
    //     mousewheel(e) {
    //         if (!(e.ctrlKey || e.optionKey)) return;
    //         e.stopPropagation();
    //         e.preventDefault();
    //         const k = 0.9;
    //         this.zoom = e.deltaY <= 0 ? Math.min(400, this.zoom / k) : Math.max(1 / 100000000, this.zoom * k);
    //         this._setStep();
    //     }
    // },
    attached() {
        this._resize = () => this._setStep();
        window.addEventListener('resize', this._resize);
    },
    detached() {
        window.removeEventListener('resize', this._resize);
    },
    _mainHeight() {
        return (window.innerHeight - (this.$refs?.main?.offsetTop || 0));
    },
    _w() {
        return (this.$refs?.main?.offsetWidth + this.$refs?.grid?.scrollLeft - 30 || 0) / (this.zoom < 1 ? this.zoom : 1);
    },
    _h() {
        return (this.$refs?.main?.offsetHeight + this.$refs?.grid?.scrollTop || 0) / (this.zoom < 1 ? this.zoom : 1);
    },
    _scrollLeft() {
        return this.$refs?.grid?.scrollLeft || 0;
    },
    _scrollTop() {
        return this.$refs?.grid?.scrollTop || 0;
    },
    _rulerHCount() {
        return Math.ceil((window.outerWidth + this.$refs?.grid?.scrollLeft) / this.sizeBig) || 1;
    },
    _rulerVCount() {
        return Math.ceil((window.outerHeight + this.$refs?.grid?.scrollTop) / this.sizeBig) || 1;
    },
    _setStep(zoom = this.zoom, step = this.step) {
        if (zoom === 1) {
            this.zoom = 1;
            this.step = 10;
        } else {
            zoom = zoom > 1 ? Math.min(400, zoom) : Math.max(1 / 100000000, zoom);
            if (zoom === 400 || zoom === 1 / 100000000) {
                this.zoom = zoom;
            } else {
                if ((step * zoom) > 50) step = step / 10;
                else if ((step * zoom) < 5) step = step * 10;
                if (step !== this.step) this.step = step;
            }
        }
        this.render();
    }
})


{/* <div ~show="showGrid && showScale" class="horizontal" style="height:24px;margin-bottom:5px">
    <div style="font-size:12px;min-width:30px;max-width:30px">{{_unit}}</div>
    <svg class="flex">
        <g ~for="(it,i) in _rulerHCount()">
            <line :x1="i * sizeBig - _scrollLeft()" y1="4" :x2="i * sizeBig - _scrollLeft()" y2="24" fill="none" stroke="gray" stroke-width="1"></line>
            <line :x1="i * sizeBig - _scrollLeft() + sizeBig / 2" y1="14" :x2="i * sizeBig - _scrollLeft() + sizeBig / 2" y2="30" fill="none" stroke="gray" stroke-width="1"></line>
            <text :x="i * sizeBig + 4 - _scrollLeft()" y="12" style="font-size:12px;fill:gray">{{i * _unitVal}}</text>
        </g>
    </svg>
</div>
<div ref="main" class="horizontal">
    <svg ~show="showGrid && showScale" style="min-width:30px;width:30px">
        <g ~for="(it,i) in _rulerVCount()">
            <line x1="2" :y1="i * sizeBig - _scrollTop()" x2="28" :y2="i * sizeBig - _scrollTop()" fill="none" stroke="gray" stroke-width="1"></line> -->
            <line x1="16" :y1="i * sizeBig - _scrollTop() + sizeBig / 2" x2="28" :y2="i * sizeBig - _scrollTop() + sizeBig / 2" fill="none" stroke="gray" stroke-width="1"></line>
            <text :x="i * sizeBig + 4 - _scrollTop()" y="0" style="font-size:12px;fill:gray;transform: rotate(90deg);">{{i * _unitVal}}</text>
        </g>
    </svg>
    <div ref="grid" style="position:relative;overflow:auto" ~style="{height:_mainHeight(), width:_w()}" @scroll="render">
        <svg ~show="showGrid" :width=_w() :height="_h()">
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
            <rect :width="_w()" :height="_h()" fill="url(#grid)"></rect>
        </svg>
        <div class="vertical" style="position: absolute; top: 0px; width: 100%; height: 100%" >
            <slot class="flex vertical" name="content" ></slot>
        </div>
    </div>
</div> */}
