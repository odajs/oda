import '../../tools/property-grid/test/new/property-grid.js';
KERNEL({
    is: 'LineClass',
    props: {
        coords: {
            type: Object,
            get() {
                const self = this;
                this.length;
                return {
                    x1: 50,
                    y1: 50,
                    x2: parseFloat(self.length),
                    y2: parseFloat(self.length)
                }
            },
            set(v) {
                this.length = v.x2;
            }
        },
        angle: 45,
        length: {
            type: Number,
            default: 0,
            get() {
                this.coords.y2;
                return this.coords.x2;
            },
            set(v) {
                this['#coords'] = undefined;
            }
        },
        isShow: true,
        useAngle: false,
        color: 'green',
        borderWidth: 2,
    }
})
ODA({
    is: 'oda-ellipse',
    imports: '@oda/app-layout',
    template: `
        <style>
            :host {
                height: 100%;
            }
            svg {
                background-color: #ddd;
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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" @tap="setCurrentPoint">
                    <ellipse :cx="ellipse1.coords.x" :cy="ellipse1.coords.y" :rx="ellipse1.radiuses.x" :ry="ellipse1.radiuses.y" :stroke="ellipse1.color" :fill="ellipse1.color" :fill-opacity="ellipse1.opacity" ~show="ellipse1.isShow" :stroke-width="ellipse1.borderWidth" :transform="\`rotate(\${ellipse1.angle} \${ellipse1.coords.x} \${ellipse1.coords.y})\`"/>
                    <ellipse :cx="ellipse2.coords.x" :cy="ellipse2.coords.y" :rx="ellipse2.radiuses.x" :ry="ellipse2.radiuses.y" :stroke="ellipse2.color" :fill="ellipse2.color" :fill-opacity="ellipse2.opacity" ~show="ellipse2.isShow" :stroke-width="ellipse2.borderWidth" :transform="\`rotate(\${ellipse2.angle} \${ellipse2.coords.x} \${ellipse2.coords.y})\`"/>
                    <line :x1="_coords?.x1" :y1="line.coords.y1" :x2="line.coords.x2" :y2="line.coords.y2" :stroke="line.color" ~show="line.isShow" :stroke-width="line.borderWidth"/>
                </svg>
            </div>
            <oda-property-grid slot="right-panel" class="vertical flex border" label="Intersection ellipse" :inspected-object="this" style="padding:0" show-buttons="false" :categories></oda-property-grid>
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
            type: Object,
            default: {
                coords: { x: 200, y: 200 },
                radiuses: { x: 100, y: 100 },
                angle: 0,
                isShow: true,
                color: 'red',
                borderWidth: 2,
                opacity: 0.1,
            },
            set(o, n) {
                console.log("Hello!");
            }
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
            type: Object,
            get() {
                return new LineClass()
            }
            // default: new LineClass(),
            // set(n) {
            //     console.log(n)
            // }
        },
        intersectionPoints: {
            get() {
                return this.C1
            }
        },
        currentPoint: { x: 0, y: 0 },
        minDistance: {
            get() {
                return this.findOutIntersectionCircle();
            },
            set() {
                this.refreshSvg();
            }
        },
        categories: {
            category: '...',
            type: Array,
            default: ['properties']
        },
        coords: {
            type: Object,
            get() { return { x1: Number(this.line.angle) } }
        },
        angle: 0
    },
    get _coords() {
        return { x1: this.angle }
    },
    // listeners: {
    //     'pg-changed'(e) {
    //         if (['angle'].includes(e.detail.value.key)) {
    //             this.line.coords.x1 += 1;
    //         }
    //     }
    // },
    // ready() {
    //     // this.canvas = this.$refs.svg;
    //     // if (!this.canvas)
    //     //     alert("Hello, bug");
    //     setTimeout(() => {
    //         // this.svg = this.$refs.svg;
    //         // this.drawEllipse(this.ellipse1);
    //         // this.drawEllipse(this.ellipse2);
    //         //this.drawLine(this.line);
    //     }, 100);
    // },
    // drawEllipse(ellipse) {
    //     const newEllipse =  document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    //     newEllipse.setAttribute("cx", ellipse.coords.x);
    //     newEllipse.setAttribute("cy", ellipse.coords.x);
    //     newEllipse.setAttribute("rx", ellipse.radiuses.x);
    //     newEllipse.setAttribute("ry", ellipse.radiuses.y);
    //     newEllipse.classList.add(ellipse.class);
    //     this.svg.append(newEllipse);
    // },
    // drawLine(line) {
    //     const newLine =  document.createElementNS("http://www.w3.org/2000/svg", "line");
    //     const x1 = line.useAngel ? (Math.cos(this.inRad(line.angle)) >= 0 ? 1 : -1) * Math.abs(line.length * Math.cos(this.inRad(line.angle))) + line.coords.x1 : line.coords.x2; // Рассчитываем координаты конечной точки по оси x
    //     const y1 = line.useAngel ? (Math.sin(this.inRad(line.angle)) >= 0 ? 1 : -1) * Math.abs(line.length * Math.sin(this.inRad(line.angle))) + line.coords.y1 : line.coords.y2; // Рассчитываем координаты конечной точки по оси y
    //     newLine.setAttribute("x1", line.coords.x1);
    //     newLine.setAttribute("y1", line.coords.y1);
    //     newLine.setAttribute("x2", x1);
    //     newLine.setAttribute("y2", y1);
    //     newLine.classList.add("line");
    //     this.svg.append(newLine);
    // },
    inRad(angle) {
        return angle * Math.PI / 180;
    },
    setCurrentPoint(e, d) {
        this.currentPoint.x = d.sourceEvent.offsetX * this.svg.viewBox.baseVal.width * this.svg.width.baseVal.value;
        this.currentPoint.y = d.sourceEvent.offsetY * this.svg.viewBox.baseVal.height * this.svg.height.baseVal.value;
    },
    // repaintSvg() {
    //     this.clearSvg();
    //     if (this.ellipse1.isDraw)
    //         this.drawEllipse(this.ellipse1);
    //     if (this.ellipse1.isDraw)
    //         this.drawEllipse(this.ellipse2);
    //     if (this.line.isDraw)
    //         this.drawLine(this.line);
    // },
    // refreshSvg() {
    //     this.clearSvg();
    //     if (this.ellipse1.isDraw)
    //         this.drawEllipse(this.ellipse1);
    //     if (this.ellipse2.isDraw)
    //         this.drawEllipse(this.ellipse2);
    //     if (this.line.isDraw)
    //         this.drawLine(this.line);
    // },
    // clearSvg() {
    //     //this.svg?.parentNode.replaceChild(this.svg.cloneNode(false), this.svg);
    //     while (this.svg.lastChild) {
    //         this.svg.removeChild(this.svg.lastChild);
    //     }
    // },
    get Intersection() {
        const line = this.line;
        const x1 = line.useAngel ? (Math.cos(this.inRad(line.angle)) >= 0 ? 1 : -1) * Math.abs(line.length * Math.cos(this.inRad(line.angle))) + line.coords.x1 : line.coords.x2; // Рассчитываем координаты конечной точки по оси x
        const y1 = line.useAngel ? (Math.sin(this.inRad(line.angle)) >= 0 ? 1 : -1) * Math.abs(line.length * Math.sin(this.inRad(line.angle))) + line.coords.y1 : line.coords.y2; // Рассчитываем координаты конечной точки по оси y
        const A = this.line.coords.y1 - y1;
        const B = x1 - this.line.coords.x1;
        const C = y1 * this.line.coords.x1 - x1 * this.line.coords.y1 + A * parseFloat(this.ellipse1.coords.x) + B * parseFloat(this.ellipse1.coords.y);
        const M = A * A + B * B;
        const d = Math.sqrt(Math.pow(this.ellipse1.radiuses.x, 2) - C * C / M);
        const K = Math.sqrt(d * d / M);
        const x0 = - A * C / M + parseFloat(this.ellipse1.coords.x);
        const y0 = - B * C / M + parseFloat(this.ellipse1.coords.y);
        //return  Math.hypot(x0 - this.line.coords.x1, y0 - this.line.coords.y1) - d;
        return { x1: x0 + B * K, y1: y0 - A * K, x2: x0 - B * K, y2: y0 + A * K }
    },

    get C2() {
        const line = this.line;
        const x1 = line.useAngel ? (Math.cos(this.inRad(line.angle)) >= 0 ? 1 : -1) * Math.abs(line.length * Math.cos(this.inRad(line.angle))) + line.coords.x1 : line.coords.x2; // Рассчитываем координаты конечной точки по оси x
        const y1 = line.useAngel ? (Math.sin(this.inRad(line.angle)) >= 0 ? 1 : -1) * Math.abs(line.length * Math.sin(this.inRad(line.angle))) + line.coords.y1 : line.coords.y2; // Рассчитываем координаты конечной точки по оси y
        const A = (this.line.coords.y1 - y1) / this.ellipse1.radiuses.y;
        const B = (x1 - this.line.coords.x1) / this.ellipse1.radiuses.x;
        const C = y1 * this.line.coords.x1 - x1 * this.line.coords.y1 + A * parseFloat(this.ellipse1.coords.x) + B * parseFloat(this.ellipse1.coords.y);
        const M = A * A + B * B;
        // const d = Math.sqrt(Math.pow(this.ellipse1.radiuses.x, 2) - C * C / M);
        const d = Math.pow(this.ellipse1.radiuses.x, 2) + Math.pow(this.ellipse1.radiuses.y, 2) - C * C / M;
        const K = Math.sqrt(d / M);
        const x0 = - A * C / M + parseFloat(this.ellipse1.coords.x);
        const y0 = - B * C / M + parseFloat(this.ellipse1.coords.y);
        return Math.hypot(x0 - this.line.coords.x1, y0 - this.line.coords.y1) - d;
        // this.intersectionPoints.e1.x = x0 + B * K;
        // this.intersectionPoints.e1.y = y0 - A * K;
        // this.intersectionPoints.e2.x = x0 - B * K;
        // this.intersectionPoints.e2.y = y0 + A * K;
    }
})