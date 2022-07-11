import '../../tools/property-grid/test/new/property-grid.js';
ODA({
    is: 'oda-ellipse',
    imports: '@oda/app-layout',
    template: `
        <style>
            :host {
                height: 100%;
                width: 100%;
            }
            svg {
                background-color: #ddd;
                height: 100%;
                width: 100%;
            }
            ellipse, line, circle {
                cursor: move;
            }
        </style>
        <oda-app-layout>
            <div slot="title" class="horizontal header border">
                <div class="flex"></div>
                <div>
                    <a target="_blank" style="margin: 4px; font-size: 40px; font-weight: 600; font-family: 'Comfortaa', cursive; ">Ellipse Intersection Test</a>
                </div>

                <div class="flex"></div>
                <oda-button icon="av:play-arrow" @tap="repaintSvg"></oda-button>
                <oda-button icon="icons:refresh" @tap="refreshSvg" title="Repaint"></oda-button>
                <oda-button icon="icons:launch" @tap="clearSvg" title="Clear"></oda-button>
                <oda-button icon="icons:launch" @tap="findOutIntersectionCircle" title="Find out intersection"></oda-button>
            </div>
            <div slot="main" id="render-box">
                <svg xmlns="http://www.w3.org/2000/svg" @pointerdown="_down" @pointerup="_stopMove">
                    <ellipse id="ellipse1" :cx="ellipse1.coords.x" :cy="ellipse1.coords.y" :rx="ellipse1.radiuses.x" :ry="ellipse1.radiuses.y" :stroke="ellipse1.color" :fill="ellipse1.color" :fill-opacity="ellipse1.opacity" ~show="ellipse1.isShow" :stroke-width="ellipse1.borderWidth" />
                    <ellipse id="ellipse2" :cx="ellipse2.coords.x" :cy="ellipse2.coords.y" :rx="ellipse2.radiuses.x" :ry="ellipse2.radiuses.y" :stroke="ellipse2.color" :fill="ellipse2.color" :fill-opacity="ellipse2.opacity" ~show="ellipse2.isShow" :stroke-width="ellipse2.borderWidth" />
                    <line id="line" :x1="line.coords.x1" :y1="line.coords.y1" :x2="line.coords.x2" :y2="line.coords.y2" :stroke="line.color" ~show="line.isShow" :stroke-width="line.borderWidth"/>
                    <circle id="circle1" :cx="line.coords.x1" :cy="line.coords.y1" :r="4" :stroke="line.color" :fill="line.color" ~show="line.isShow"></circle>
                    <circle id="circle2" :cx="line.coords.x2" :cy="line.coords.y2" :r="4" :stroke="line.color" :fill="line.color" ~show="line.isShow"></circle>
                </svg>
            </div>
            <oda-property-grid slot="right-panel" class="vertical flex border" label="Intersection ellipse" :inspected-object="this" style="padding:0" show-buttons="false"></oda-property-grid>
            <div slot="bottom">
                <a target="_blank" style="margin: 4px; font-size: medium; font-weight: 600">Min distance:  </a>
            </div>
            <div slot="bottom">
                <a target="_blank" style="margin: 4px; font-size: medium; font-weight: 600">Point 1 {{ellipse1.radiuses.x}}</a>
            </div>
        </oda-app-layout>
    `,
    props: {
        ellipse1: {
            coords: { x: 200, y: 200 },
            radiuses: { x: 100, y: 100 },
            angle: 0,
            isShow: true,
            color: 'red',
            borderWidth: 2,
            opacity: 0.1,
        },
        ellipse2: {
            coords: { x: 300, y: 300 },
            radiuses: { x: 100, y: 50 },
            angle: 45,
            isShow: true,
            color: 'blue',
            borderWidth: 2,
            opacity: 0.1,
        },
        line: {
            coords: { x1: 50, y1: 50, x2: 200, y2: 200 },
            angle: 45,
            length: 150,
            isShow: true,
            useAngle: false,
            color: 'green',
            borderWidth: 2,
        }
    },
    _down(e) {
        if (!e.target.id) return;
        this._id = e.target.id;
        this._x = e.pageX;
        this._y = e.pageY;
        document.documentElement.addEventListener("pointermove", this.__doMove = this.__doMove = this._doMove.bind(this), false);
        document.documentElement.addEventListener("pointerup", this.__stopMove = this.__stopMove = this._stopMove.bind(this), false);
        document.documentElement.addEventListener("pointercancel", this.__stopMove, false);
        this._isMove = true;
    },
    _doMove(e) {
        if (!this._isMove) return;
        const x = e.pageX - this._x, y = e.pageY - this._y;
        if (this._id === 'circle1') {
            this.line.coords.x1 = +this.line.coords.x1 + x;
            this.line.coords.y1 = +this.line.coords.y1 + y;
        } else if (this._id === 'circle2') {
            this.line.coords.x2 = +this.line.coords.x2 + x;
            this.line.coords.y2 = +this.line.coords.y2 + y;
        } else if (this._id === 'line') {
            this.line.coords.x1 = +this.line.coords.x1 + x;
            this.line.coords.y1 = +this.line.coords.y1 + y;
            this.line.coords.x2 = +this.line.coords.x2 + x;
            this.line.coords.y2 = +this.line.coords.y2 + y;
        } else if (this._id === 'ellipse1' || this._id === 'ellipse2') {
            this[this._id].coords.x = +this[this._id].coords.x + x;
            this[this._id].coords.y = +this[this._id].coords.y + y;
        }
        this._x = e.pageX;
        this._y = e.pageY;
        this.render();
    },
    _stopMove() {
        document.documentElement.removeEventListener("pointermove", this.__doMove, false);
        document.documentElement.removeEventListener("pointerup", this.__stopMove, false);
        document.documentElement.removeEventListener("pointercancel", this.__stopMove, false);
        this._isMove = false;
        console.log('Calculate');
    }
})
