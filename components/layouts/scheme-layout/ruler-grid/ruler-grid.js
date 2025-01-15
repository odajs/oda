ODA({ is: 'oda-ruler-grid', template: /*html*/`
    <style>
        :host {
            position: relative;
            @apply --vertical;
            @apply --flex;
            overflow: hidden;
            background-color: {{backgroundColor}};
        }
        path {
            stroke: gray;
            fill: none;
            stroke-width: 1.5;
        }
    </style>
    <oda-ruler ~if="showScale"></oda-ruler>
    <div class="horizontal flex">
        <oda-ruler ~if="showScale" vertical></oda-ruler>
        <div class="flex vertical" style="overflow: hidden; position: relative;">
            <svg class="flex">
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
                <rect ~if="showGrid" :transform fill="url(#bigLines)" :width :height></rect>
                <rect ~if="showGrid" :transform fill="url(#smallLines)" :width :height></rect>
                <path :transform ~for="paths" ~is="$for.item.is" ~props="$for.item.props"></path>
            </svg>
            <div id="slot" class="vertical" style="overflow: auto; position: absolute; top: 0px; left: 0px; right: 0px; bottom: 0px;" @scroll="onScroll" @resize="onResize">
                <slot class="flex vertical" name="content"></slot>
            </div>
        </div>
    </div>
    `,
    get transform(){
        return `translate(${-this.left} ${-this.top})`;
    },
    get transform1(){
        return (this.transform + ` scale(${this.scale})`);
    },
    attached() {
        this.async(() => { this.resetWH() }, 300)
    },
    onScroll(e) {
        this.resetWH()
        this.left = undefined;
        this.top = undefined;
    },
    onResize(e) {
        this.slotDiv.style.overflow = 'hidden';
        this.resetWH()
        this.left = undefined;
        this.top = undefined;
        this.throttle('rul-resize', () => {
            this.slotDiv.style.overflow = 'auto';
        });
    },
    resetWH() {
        this.throttle('reset-wh', () => {
            this.width = undefined;
            this.height = undefined;
        })
    },
    $public: {
        $pdp: true,
        zoomIntensity: 0.2,
        minScale: 0.05,
        maxScale: 20,
        backgroundColor: {
            $def: 'var(--content-background)',
            $editor: '@oda/color-picker[oda-color-picker]',
            $save: true,
        },
        showGrid: {
            $def: true,
            $save: true,
        },
        showScale: {
            $def: true,
            $save: true,
        },
        iconSize: 32,
        scale: {
            $def: 1,
            $save: true
        },
        mouseMode: {
            $save: true,
            $def: false
        }
    },
    $pdp: {
        left: {
            $type: Number,
            get() {
                return this.slotDiv?.scrollLeft || 0;
            }
        },
        top: {
            $type: Number,
            get() {
                return this.slotDiv?.scrollTop || 0;
            }
        },
        width: {
            $type: Number,
            get() {
                return this.slotDiv?.scrollWidth || 10000;
            }
        },
        height: {
            $type: Number,
            get() {
                return this.slotDiv?.scrollHeight || 10000;
            }
        },
        slotDiv: {
            $type: HTMLElement,
            get() {
                return this.$('#slot') || undefined;
            }
        },
        sizeBig: {
            $type: Number,
            get() {
                return this.sizeSmall * 10;
            }
        },
        sizeSmall: {
            $type: Number,
            get() {
                return Math.round(this.step * this.scale);
            }
        },
        unit: {
            $type: String,
            get() {
                if (this.step === 1)
                    return 'mm';
                if (this.step === 10)
                    return 'cm';
                if (this.step === 100)
                    return 'm';
                return 'km';
            }
        },
        step: {
            $type: Number,
            get() {
                let step = 10;
                if (this.scale === 1) {
                    step = this.scale * 10;
                } else {
                    let zoom = this.scale > 1 ? Math.min(400, this.scale) : Math.max(1 / 100000000, this.scale);
                    if (zoom === 400 || zoom === 1 / 100000000) { // min & max zoom предел
                        this.scale = zoom;
                        step = 1;
                    } else {
                        if ((step * zoom) > 50) // zoom in && step to lower
                            step = step / 10;
                        else if ((step * zoom) < 5) // zoom out && step to high
                            step = step * 10;
                    }
                }
                return step;
            }
        }
    },
    paths: [],
    $listeners: {
        track(e) {
            if( this.mouseMode ) return;
            this.trackGrid(e);
        },
        mousewheel(e) {
            e.stopPropagation();
            if (!this.mouseMode && !e.ctrlKey) return;
            e.preventDefault();
            const dir = e.deltaY < 0 ? 1 : -1;
            const zoom = Math.exp(dir * this.zoomIntensity * (e.shiftKey ? 0.1 : 1));
            const newScale = this.scale * zoom;
            if (newScale >= this.maxScale || newScale <= this.minScale) return;
            this.scale = newScale;

            const globalMouseX = (e.x + this.left);
            const globalMouseY = (e.y + this.top);
            const deltaX = -(globalMouseX * zoom - globalMouseX) / zoom;
            const deltaY = -(globalMouseY * zoom - globalMouseY) / zoom;

            this.resetWH();
            this.slotDiv.scrollLeft = this.left - deltaX;
            this.slotDiv.scrollTop = this.top - deltaY;
        }
    },
    trackGrid(e) {
        if(e.detail.state === 'track') {
            this.slotDiv.scrollLeft = this.left - e.detail.ddx;
            this.slotDiv.scrollTop = this.top - e.detail.ddy;
        }
    }
})
ODA({ is: 'oda-ruler',
    $public: {
        vertical: {
            $type: Boolean,
            $attr: true
        }
    },
    get transform() {
        const size = this.iconSize / 4;
        const x = this.vertical ? size : -this.left;
        const y = this.vertical ? -this.top : size;
        return `translate(${x} ${y})`;
    },
    get smalltransform() {
        const size = this.iconSize / 2;
        const x = this.vertical ? size : -this.left;
        const y = this.vertical ? -this.top : size;
        return `translate(${x} ${y})`;
    },
    template: /*html*/`
    <style>
        :host {
            @apply --horizontal;
            @apply --shadow;
            width: {{vertical ? iconSize + 'px' : 'auto'}};
            height: {{!vertical ? iconSize + 'px' : 'auto'}};
            @apply --header;
            z-index: 2;
        }
    </style>
    <div ~style="{minWidth: iconSize + 'px', maxWidth: iconSize + 'px'}" style="font-size: xx-small; text-align: center; align-self: center;" class="no-flex" ~if="!vertical">{{unit}}</div>
    <svg class="flex content">
        <pattern id="rullerBigLines" :width="!vertical ? sizeBig : 1" :height="vertical ? sizeBig : 1" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" :x2="vertical ? 1 : 0" :y2="vertical ? 0 : 1" fill="none" stroke="gray" stroke-width="1"></line>
        </pattern>
        <pattern id="rullerSmallLines" :width="!vertical ? sizeSmall : 1" :height="vertical? sizeSmall : 1" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" :x2="vertical? 1 : 0" :y2="vertical ? 0 : 1" fill="none" stroke="gray" stroke-width="0.5"></line>
        </pattern>
        <rect :transform fill="url(#rullerBigLines)" :width="vertical ? iconSize : width" :height="!vertical ? iconSize : height"></rect>
        <rect :transform="smalltransform" fill="url(#rullerSmallLines)" :width="vertical ? iconSize : width" :height="!vertical ? iconSize : height"></rect>
    </svg>
    `,
});