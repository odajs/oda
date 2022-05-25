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
    <svg xmlns="http://www.w3.org/2000/svg" :view-box="vb.x * scale + ' ' + vb.y * scale + ' ' + vb.w * scale + ' ' + vb.h * scale">
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
    </svg>
    <div ~style="{position: 'absolute', transform: 'scale('+(1 / scale)+')', left: -vb.x+'px', top: -vb.y+'px'}"><slot name="content"></slot></div>
    `,
    get svg() {
        return this.$('svg');
    },
    get slotLayout() {
        return this.$('div > slot');
    },
    props: {
        zoomIntensity: 0.2,
        minScale: 0.05,
        maxScale: 20,
        backgroundColor: {
            default: 'white',
            editor: '@oda/color-picker',
            save: true,
        },
        showGrid: {
            default: true,
            save: true,
        },
        scale: {
            default: 1,
            save: true
        }
    },
    vb: { x: 0, y: 0, w: 0, h: 0 },
    gridStrokeWidth: 0.5,
    bigGridStrokeWidth: 1,
    get step() {
        return this.scale < 0.5 ? 1 : this.scale > 5 ? 100 : 10;
    },
    get gridSize() {
        return this.step;
    },
    get bigGridSize() {
        return this.gridSize * 10;
    },
    attached() {
        this.reset();
    },
    listeners: {
        resize(e) {
            this.vb.w = this.svg.clientWidth;
            this.vb.h = this.svg.clientHeight;
        },
        track(e) {
            e.preventDefault();
            if (e.sourceEvent.which !== 2) return;
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
        }
    },
    applyTransform({ x = 0, y = 0, w = 0, h = 0 } = { x: 0, y: 0, w: 0, h: 0 }) {
        this.vb.x += x;
        this.vb.y += y;
        this.vb.w += w;
        this.vb.h += h;
    },
    reset() {
        if(this.slotLayout.assignedNodes().length) this.focusOnLayout();
        else {
            this.scale = 1;
            this.vb.x = 0;
            this.vb.y = 0;
        }
        this.vb.w = this.svg.clientWidth;
        this.vb.h = this.svg.clientHeight;
    },
    focusOnLayout() {
        const slot = this.slotLayout;
        const layoutSize = {left: 0, top: 0, right: 0, bottom: 0};
        slot.assignedNodes().forEach(i => {
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