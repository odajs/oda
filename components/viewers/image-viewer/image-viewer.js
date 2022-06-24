ODA({is: 'oda-image-viewer', imports: '@oda/button',
    template: /*html*/`
    <style>
        :host {
            @apply --vertical;
            @apply --flex;
            background-color: #242424;
            overflow: hidden;
        }
        :host > .img {
            cursor: grab;
        }
        :host > .img:active {
            cursor: grabbing;
        }
        :host .image{
            width: 100%;
            height: 100%;
            background: no-repeat center;
            background-size: contain;
        }
    </style>
    <div class="horizontal center" style="z-index: 1;" @dblclick.stop>
        <oda-button icon="image:rotate-left" fill="white" @tap="_rotateLeft"></oda-button>
        <oda-button icon="image:rotate-right" fill="white" @tap="_rotateRight"></oda-button>
        <oda-button icon="icons:file-download" fill="white" @tap="_download"></oda-button>
    </div>
    <div ref="img" class="img flex" :style="_imageStyle">
        <div class="image" :style="\`background-image: url('\${src}');\`"></div>
    </div>
    `,
    props: {
        src: {
            set() {
                this._reset();
            },
            default: ''
        },
        alt: '',
        title: '',
        _x: 0,
        _y: 0,
        _scale: 1,
        _rotate: 0,
        _imageStyle: {
            type: String,
            get() {
                return `transform: translate3d(${this._x || 0}px, ${this._y || 0}px, 0) scale(${this._scale || 0}) rotate(${this._rotate || 0}deg)`;
            }
        }
    },
    listeners: {
        'track': '_onTrack',
        'wheel': '_onScroll',
        'dblclick': '_reset'
    },
    _onTrack(e, d) {
        switch (d.state) {
            case 'start': {
                this._x += d.ddx || 0;
                this._y += d.ddy || 0;
            }
                break;
            case 'track': {
                this._x += d.ddx || 0;
                this._y += d.ddy || 0;
            }
                break;
            case 'end': {
                const img = this.$refs.img;
                const halfWidth = img.offsetWidth * 0.5 * this._scale;
                const halfHeight = img.offsetHeight * 0.5 * this._scale;
                const x = Math.max(Math.min(this._x + (d.ddx || 0), halfWidth), -halfWidth);
                const y = Math.max(Math.min(this._y + (d.ddy || 0), halfHeight), -halfHeight);
                this._x = x;
                this._y = y;
            }
        }
    },
    _onScroll(e) {
        const img = this.$refs.img;
        const scale = Math.max(1, this._scale + -e.deltaY * 0.005);
        if (scale === 1) {
            this._reset();
        } else {
            this._x = this._x / (img.offsetWidth * this._scale / (img.offsetWidth * scale) || 1);
            this._y = this._y / (img.offsetHeight * this._scale / (img.offsetHeight * scale) || 1);
        }
        this._scale = scale;
    },
    _rotateLeft() {
        this._rotate -= 90;
    },
    _rotateRight() {
        this._rotate += 90;
    },
    _download() {
        const link = document.createElement('a');
        link.setAttribute('href', `${this.src}?method=download`);
        link.setAttribute('download', 'download');
        link.click();
    },
    _reset(withRotate) {
        this._x = 0;
        this._y = 0;
        this._scale = 1;
        if (withRotate) this.rotate = 0;
    }
})