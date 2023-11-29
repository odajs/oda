ODA({ is: 'oda-ruler-grid-vb', template: /*template*/`
    <style>
        :host {
            @apply --vertical;
            @apply --flex;
            position: relative;
            overflow: hidden;
            background-color: {{backgroundColor}};
        }
        :host svg {
            height: 100%;
        }
    </style>
    <oda-ruler-vb ~if="showScale"></oda-ruler-vb>
    <div class="flex horizontal">
        <oda-ruler-vb ~if="showScale" vertical></oda-ruler-vb>
        <div class="flex vertical" style="overflow: hidden; position: relative;" id="grid-div">
            <svg id="svggrid" xmlns="http://www.w3.org/2000/svg" :view-box="vb.x * scale + ' ' + vb.y * scale + ' ' + vb.w * scale + ' ' + vb.h * scale">
                <defs>
                    <pattern id="smallGrid" :width="gridSize" :height="gridSize" patternUnits="userSpaceOnUse">
                        <path :d="'M '+ gridSize + ' 0 L 0 0 0 ' + gridSize" fill="none" stroke="gray" :stroke-width="gridStrokeWidth * step / 5" />
                    </pattern>
                    <pattern id="bigGrid" :width="bigGridSize" :height="bigGridSize" patternUnits="userSpaceOnUse">
                        <rect :width="bigGridSize" :height="bigGridSize" fill="url(#smallGrid)" />
                        <path :d="'M '+ bigGridSize + ' 0 L 0 0 0 ' + bigGridSize" fill="none" stroke="gray" :stroke-width="bigGridStrokeWidth * step / 5" />
                    </pattern>
                </defs>

                <rect ~if="showGrid" :x="vb.x * scale" :y="vb.y * scale" :width="vb.w * scale" :height="vb.h * scale" fill="url(#bigGrid)" />
                <path ~for="elements" ~is="$for.item.is" ~props="$for.item.props"></path>
            </svg>
            <div ~style="{position: 'absolute', transform: 'scale('+(1 / scale)+')', left: -vb.x+'px', top: -vb.y+'px'}">
                <slot @slotchange="_slotchange" name="content"></slot>
            </div>
        </div>
    </div>
    `,
    svg: {
        $pdp: true,
        get() {
            return this.$('#svggrid')
        }
    },
    blockElements: null,
    _slotchange(e) {
        this.blockElements = e.target.assignedNodes();
    },
    $public: {
        vb: {
            $pdp: true,
            $def: { x: 0, y: 0, w: 0, h: 0 }
        },
        zoomIntensity: 0.2,
        minScale: 0.05,
        maxScale: 20,
        backgroundColor: {
            $def: 'white',
            $editor: '@oda/color-picker[oda-color-picker]',
            $save: true
        },
        showGrid: {
            $pdp: true,
            $def: true,
            $save: true
        },
        showScale: {
            $pdp: true,
            $def: false,
            $save: true
        },
        scale: {
            $pdp: true,
            $def: 1,
            $save: true
        },
        get _grid() {
            return this.$('#grid-div')
        },
        step: {
            $pdp: true,
            get() {
                return this.scale < 0.5 ? 1 : this.scale > 5 ? 100 : 10;
            }
        },
        gridSize: {
            $pdp: true,
            get() {
                return this.step;
            }
        },
        bigGridSize: {
            $pdp: true,
            get() {
                return this.gridSize * 10;
            }
        },
        unit: {
            $pdp: true,
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
        gridStrokeWidth: {
            $pdp: true,
            $def: 0.5
        },
        bigGridStrokeWidth: {
            $pdp: true,
            $def: 1
        },
    },
    elements: [],
    attached() {
        // this.reset();
    },
    $listeners: {
        resize(e) {
            this.vb.w = this.svg.clientWidth;
            this.vb.h = this.svg.clientHeight;
        },
        track(e) {
            this.onTrack?.(e);
            e.preventDefault();
            // if (e.sourceEvent.which !== 2) return;
            if (e.sourceEvent.ctrlKey !== true) return;
            switch (e.detail.state) {
                case 'start': {
                    this.svg.style.setProperty('cursor', 'grabbing');
                } break;
                case 'track': {
                    this.applyTransform({ x: -e.detail.ddx, y: -e.detail.ddy });
                } break;
                case 'end': {
                    this.svg.style.removeProperty('cursor');
                } break;
            }
        },
        wheel(e) {
            e.stopPropagation();

            const dir = e.deltaY < 0 ? -1 : 1;
            const zoom = Math.exp(dir * this.zoomIntensity * (e.shiftKey ? 0.1 : 1));
            const newScale = this.scale * zoom;

            if (newScale >= this.maxScale || newScale <= this.minScale) return;

            this.scale = newScale;

            const globalMouseX = (e.x + this.vb.x);
            const globalMouseY = (e.y + this.vb.y);

            const deltaX = -(globalMouseX * zoom - globalMouseX) / zoom;
            const deltaY = -(globalMouseY * zoom - globalMouseY) / zoom;

            this.applyTransform({ x: deltaX, y: deltaY });
            this.afterWheel?.(e);
        }
    },
    applyTransform({ x = 0, y = 0, w = 0, h = 0 } = { x: 0, y: 0, w: 0, h: 0 }) {
        this.vb.x += x;
        this.vb.y += y;
        this.vb.w += w;
        this.vb.h += h;
    },
    reset() {
        if(this.blockElements?.length) this.focusOnLayout();
        else {
            this.scale = 1;
            this.vb.x = 0;
            this.vb.y = 0;
        }
        this.vb.w = this.svg.clientWidth;
        this.vb.h = this.svg.clientHeight;
    },
    focusOnLayout() {
        // const slot = this.slotLayout;
        const layoutSize = {left: 0, top: 0, right: 0, bottom: 0};
        this.blockElements.forEach(i => {
            if(i.offsetLeft < layoutSize.left) layoutSize.left = i.offsetLeft;
            if(i.offsetTop < layoutSize.top) layoutSize.top = i.offsetTop;
            if(i.offsetLeft > layoutSize.right) layoutSize.right = i.offsetLeft + i.offsetWidth;
            if(i.offsetTop > layoutSize.bottom) layoutSize.bottom = i.offsetTop + i.offsetHeight;
        });
        this.scale = (layoutSize.bottom - layoutSize.top) / this.svg.clientHeight;
        const paddingH = this.svg.clientWidth / 2;
        const paddingV = this.svg.clientHeight / 2;
        this.vb.x = (layoutSize.left) / this.scale - paddingH + ((layoutSize.right - layoutSize.left) / this.scale / 2) || 0;
        this.vb.y = (layoutSize.top) / this.scale - paddingV + ((layoutSize.bottom - layoutSize.top) / this.scale / 2) || 0;
    }
});
ODA({ is: 'oda-ruler-vb', template: /*template*/`
    <style>
        :host {
            @apply --horizontal;
            @apply --shadow;
            @apply --header;
            {{vertical?'width: ' + 24 + 'px;':''}}
            {{!vertical?'height: ' + 24 + 'px;':''}}
        }
        :host svg {
            width: 100%;
            height: 100%;
        }
    </style>
    <div style="font-size: xx-small; width: 24px; text-align: center; align-self: center;" class="no-flex" ~if="!vertical">{{unit}}</div>
    <svg :view-box="vertical ? ('0 ' + ((vb.y-1) * scale) + ' ' + (24 * scale) + ' ' + (vb.h * scale)) : (((vb.x-1) * scale) + ' 0 ' + (vb.w * scale) + ' ' + (24 * scale))" class="content" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <pattern id="rullerSmallLines" :width="gridSize" :height="gridSize" patternUnits="userSpaceOnUse">
                <path :d="!vertical ? ('M ' + gridSize + ' ' + (12 * scale) + ' L ' + gridSize + ' 0') : ('M ' + (12 * scale) + ' ' + gridSize + ' L 0 ' + gridSize)" fill="none" stroke="gray" :stroke-width="gridStrokeWidth * step / 5" />
            </pattern>
            <pattern id="rullerBigLines" :width="bigGridSize" :height="bigGridSize" patternUnits="userSpaceOnUse">
                <rect :x="vertical ? (14 * scale) : 0" :y="!vertical ? (14 * scale) : 0" :width="!vertical ? bigGridSize : gridSize" :height="vertical ? bigGridSize : gridSize" fill="url(#rullerSmallLines)" />
                <path :d="!vertical ? ('M ' + bigGridSize + ' ' + (24 * scale) + ' L ' + bigGridSize + ' 0') : ('M ' + (24 * scale) + ' ' + bigGridSize + ' L 0 ' + bigGridSize)" fill="none" stroke="black" :stroke-width="bigGridStrokeWidth * step / 5" />
            </pattern>
        </defs>

        <rect ~if="showGrid" :x="vertical ? 0 : vb.x * scale" :y="!vertical ? 0 : vb.y * scale" :width="(vertical ? 24 : vb.w) * scale" :height="(vertical ? vb.h : 24) * scale" fill="url(#rullerBigLines)" />
    </svg>
    `,
    $public: {
        vertical: {
            $type: Boolean,
            $attr: true
        }
    }
});