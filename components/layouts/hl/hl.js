ODA({ is: 'oda-hl', imports: '@oda/button',
    template: `
        <style>
            :host {
                overflow: hidden;
                background: {{background}};
            }
        </style>
        <canvas :width="document.body.offsetWidth" :height="document.body.offsetHeight" id="hexmap" @mouseup="_up"></canvas>
        <oda-hexagon ~for="hex.data" :item="$for.item"></oda-hexagon>
    `,
    color1: {
        $public: true,
        $def: 'var(--border-color)',
        $save: true,
        $editor: '@oda/color-picker[oda-color-picker]'
    },
    background: {
        $public: true,
        $def: 'var(--content-background)',
        $save: true,
        $editor: '@oda/color-picker[oda-color-picker]'
    },
    $pdp: {
        $pdp: true,
        selected: null,
        hexSize: 48,
        hexLineWidth: 4,
        get hexWidth() {
            return this.hexSize * .866 * 2;
        },
        get hexHeight() {
            return this.hexSize * 1.5;
        },
    },
    attached() {
        this.drawHex();
    },
    $listeners: {
        resize(e) {
            this.drawHex();
        },
        dragover(e) {
            e.preventDefault()
        },
        drop(e) {
            e.preventDefault()
            let x = e.offsetX,
                y = e.offsetY;
            y = Math.round(y / this.hexHeight);
            x = Math.round((x + (y%2 === 0 ? 0 : this.hexWidth  / 2)) / this.hexWidth);
            x = x < 1 ? 1 : x > this.maxX ? this.maxX : x;
            y = y < 1 ? 1 : y > this.maxY ? this.maxY : y;
            this.selected.item.x = x;
            this.selected.item.y = y;
            this.selected.style.opacity = 1;
        }
    },
    _up(e) {
        this.selected && (this.selected.style.opacity = 1);
    },
    drawHex() {
        let hexHeight,
            hexRadius,
            hexRectangleHeight,
            hexRectangleWidth,
            hexagonAngle = 0.523598776, // 30 degrees in radians
            size = this.hexSize,
            width = Math.round(document.body.offsetWidth / this.hexWidth) + 2,
            height = Math.round(document.body.offsetHeight / this.hexHeight) + 2;
        this.maxX = width - 3;
        this.maxY = height - 2;
        hexHeight = Math.sin(hexagonAngle) * size;
        hexRadius = Math.cos(hexagonAngle) * size;
        hexRectangleHeight = size + 2 * hexHeight;
        hexRectangleWidth = 2 * hexRadius;
        const canvas = this.$('#hexmap');
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = this.color1;
        ctx.lineWidth = this.hexLineWidth;
        for (let i = 0; i < width; ++i) {
            for (let j = 0; j < height; ++j) {
                drawHexagon(
                    i * hexRectangleWidth + ((j % 2) * hexRadius),
                    j * (size + hexHeight)
                )
            }
        }
        function drawHexagon(x, y) {
            ctx.beginPath();
            ctx.moveTo(x + hexRadius, y);
            ctx.lineTo(x + hexRectangleWidth, y + hexHeight);
            ctx.lineTo(x + hexRectangleWidth, y + hexHeight + size);
            ctx.lineTo(x + hexRadius, y + hexRectangleHeight);
            ctx.lineTo(x, y + size + hexHeight);
            ctx.lineTo(x, y + hexHeight);
            ctx.closePath();
            ctx.stroke();
        }
    }
})

ODA({ is: 'oda-hexagon',
    template: `
        <style>
            div {
                @apply --vertical;
                @apply --text-shadow;
                justify-content: center;
                align-items: center;
                max-width: {{hexWidth}}px;
                min-width: {{hexWidth}}px;
                overflow: hidden;
                white-space: wrap;
                text-align: center;
                position: absolute;
                z-index: 1;
                top: 0;
                left: 0;
                transform: translate({{(item.y%2===0 ? hexWidth/2:0) + (item.x-1)*hexWidth}}px, {{hexSize + (item.y-1)*hexHeight}}px);
                font-size: small;
                cursor: pointer;
                /* transition: all 2.2s ease-in-out; */
            }
            .elem:hover {
                zoom: 1.1;
            }
        </style>
        <div draggable="true">
            <div class="elem" ~if="item" class="no-flex block" ~is="item?.is" ~props="item?.props"></div>
            <label ~html="item?.label"></label>
        </div>
    `,
    item: null,
    $listeners: {
        dragstart(e) {
            this.style.opacity = 0;
            this.selected = this;
        }
    }
})
