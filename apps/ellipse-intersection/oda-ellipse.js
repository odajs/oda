import '../../tools/property-grid/test/new/property-grid.js';
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
                <oda-button icon="icons:launch" @tap="scaleSvgUp" title="ScaleUp"></oda-button>
                <oda-button icon="icons:launch" @tap="scaleSvgDown" title="ScaleDown"></oda-button>
                <oda-button icon="icons:refresh" @tap="scaleSvgRefresh" title="ScaleRefresh"></oda-button>
            </div>
            <div slot="main" id="render-box">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" @tap="setCurrentPoint" ~ref="'svg'" @pointerdown="_down" @pointerup="_stopMove">
                    <ellipse id="ellipse1" :cx="ellipse1.coords.x" :cy="ellipse1.coords.y" :rx="ellipse1.radiuses.x" :ry="ellipse1.radiuses.y" :stroke="ellipse1.color" :fill="ellipse1.color" :fill-opacity="ellipse1.opacity" ~show="ellipse1.isShow" :stroke-width="ellipse1.borderWidth" :transform="\`scale(\${scale}) rotate(\${ellipse1.angle} \${ellipse1.coords.x} \${ellipse1.coords.y})\`"/>
                    <ellipse id="ellipse2" :cx="ellipse2.coords.x" :cy="ellipse2.coords.y" :rx="ellipse2.radiuses.x" :ry="ellipse2.radiuses.y" :stroke="ellipse2.color" :fill="ellipse2.color" :fill-opacity="ellipse2.opacity" ~show="ellipse2.isShow" :stroke-width="ellipse2.borderWidth" :transform="\`scale(\${scale}) rotate(\${ellipse2.angle} \${ellipse2.coords.x} \${ellipse2.coords.y})\`"/>
                    <line id="line" :x1="line.coords.x1" :y1="line.coords.y1" :x2="line.coords.x2" :y2="line.coords.y2" :stroke="line.color" ~show="line.isShow" :stroke-width="line.borderWidth" :transform="\`scale(\${scale}) rotate(\${line.angle} \${line.coords.x1} \${line.coords.y1})\`"/>
                    <circle id="circle1" :cx="line.coords.x1" :cy="line.coords.y1" :r="4" :stroke="line.color" :fill="line.color" ~show="line.isShow" :transform="\`scale(\${scale})\`"></circle>
                    <circle id="circle2" :cx="line.coords.x2" :cy="line.coords.y2" :r="4" :stroke="line.color" :fill="lastPoint.color" ~show="line.isShow" :transform="\`scale(\${scale})\`"></circle>
                </svg>
            </div>
            <oda-property-grid slot="right-panel" class="vertical flex border" label="Intersection ellipse" :inspected-object="this" style="padding:0" show-buttons="false" :categories></oda-property-grid>
            <div slot="bottom">
                <a target="_blank" style="margin: 4px; font-size: medium; font-weight: 600">Min distance: {{minDistance}}</a>
            </div>
            <div slot="bottom">
                <a target="_blank" style="margin: 4px; font-size: medium; font-weight: 600">Point1 ({{IntersectionLineToEllipse()}}, {{intersectionPoints.p1.y}}) Point2 ({{intersectionPoints.p2.x}}, {{intersectionPoints.p2.y}})</a>
            </div>
            <div slot="bottom">
                <a target="_blank" style="margin: 4px; font-size: medium; font-weight: 600">Cross(Point1 ({{intersectionPoints.pk1.x}}, {{intersectionPoints.pk1.y}}), Point2 ({{intersectionPoints.pk2.x}}, {{intersectionPoints.pk2.y}}))</a>
            </div>
            <div slot="bottom">
                <a target="_blank" style="margin: 4px; font-size: medium; font-weight: 600">({{C2.x}})</a>
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
            set (o, n) {
                console.log("Hello!");
            }
        },
        ellipse2: {
            coords: { x: 200, y: 200 }, // { x: 300, y: 300 },
            radiuses: { x: 100, y: 100 }, // { x: 100, y: 50 },
            angle: 45,
            isShow: true,
            color: 'blue',
            borderWidth: 2,
            opacity: 0.1,
        },
        line: {
            default: {
                coords: { x1: 50, y1: 50, x2: 200, y2: 200 },
                angle: 0,
                length: 150,
                isShow: true,
                color: 'green',
                borderWidth: 2,
            },
            set(n) {
                console.log(n)
            }
        },
        intersectionPoints: {
            p1: {
                x: 0,
                y: 0,
            },
            p2: {
                x: 0,
                y: 0,
            },
            pk1: {
                x: 0,
                y: 0,
            },
            pk2: {
                x: 0,
                y: 0,
            }
        },
        lastPoint: { color: 'yellow' },
        currentPoint: { x: 0, y: 0 },
        minDistance: 0,
        categories: {
            category: '...',
            type: Array,
            default: ['properties']
        },
        coords: {
            type: Object,
            get() { return { x1: Number(this.line.angle) } }
        },
        angle: 0,
        scale: 1,
    },
    listeners: {
        // 'pg-changed'(e) {
        //     if (['angle'].includes(e.detail.value.key)) {
        //         this.line.coords.x1 += 1;
        //     }
        // }
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
    },
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
    ToRad(angle) {
        return angle * Math.PI / 180;
    },
    setCurrentPoint(e, d) {
        this.currentPoint.x = d.sourceEvent.offsetX * this.$refs.svg.viewBox.baseVal.width / this.$refs.svg.width.baseVal.value;
        this.currentPoint.y = d.sourceEvent.offsetY * this.$refs.svg.viewBox.baseVal.height / this.$refs.svg.height.baseVal.value;
    },
    scaleSvgUp() {
        this.scale = this.scale*2;
    },
    scaleSvgDown() {
        this.scale = this.scale/2;
    },
    scaleSvgRefresh() {
        this.scale = this.scale/2;
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
    IntersectionLineToCircle() {

        const coords = {...this.line.coords};
        const A = coords.y1 - coords.y2;
        const B = coords.x2 - coords.x1;
        const C = coords.y2 * coords.x1 - coords.x2 * coords.y1 + A * parseFloat(this.ellipse1.coords.x) + B * parseFloat(this.ellipse1.coords.y);
        const M = A * A + B * B;
        const d = Math.sqrt(Math.pow(this.ellipse1.radiuses.x, 2) - C * C / M);

        // Прямая не пересекает круг
        if (d !== d) {
            this.intersectionPoints.p1.x = NaN;
            this.intersectionPoints.p1.y = NaN;
            this.intersectionPoints.p2.x = NaN;
            this.intersectionPoints.p2.y = NaN;
            this.minDistance = NaN;
            return NaN;
        }
        const K = Math.sqrt(d * d / M);
        const x0 = - A * C / M + parseFloat(this.ellipse1.coords.x);
        const y0 = - B * C / M + parseFloat(this.ellipse1.coords.y);

        this.minDistance = Math.hypot(x0 - coords.x1, y0 - coords.y1) - d;
        // Начальная точка находится внутри круга
        if (this.minDistance < 0 ) {
            this.intersectionPoints.p1.x = NaN;
            this.intersectionPoints.p1.y = NaN;
            this.intersectionPoints.p2.x = NaN;
            this.intersectionPoints.p2.y = NaN;
            return NaN;
        }

        this.intersectionPoints.p1.x = x0 + B * K;
        this.intersectionPoints.p1.y = y0 - A * K;
        this.intersectionPoints.p2.x = x0 - B * K;
        this.intersectionPoints.p2.y = y0 + A * K;

        const minX = Math.min( this.line.coords.x1, this.line.coords.x2);
        const maxX = Math.max( this.line.coords.x1, this.line.coords.x2);
        const minY = Math.min( this.line.coords.y1, this.line.coords.y2);
        const maxY = Math.max( this.line.coords.y1, this.line.coords.y2);

        // Отрезок пересекает круг
        if ( minX <=  this.intersectionPoints.p1.x && this.intersectionPoints.p1.x <= maxX &&
             minY <=  this.intersectionPoints.p1.y && this.intersectionPoints.p1.y <= maxY ||
             minX <=  this.intersectionPoints.p2.x && this.intersectionPoints.p2.x <= maxX &&
             minY <=  this.intersectionPoints.p2.y && this.intersectionPoints.p2.y <= maxY )
        {
            return this.intersectionPoints.p1.x;
        }
        // Прямая пересекает круг, но отрезок не пересекает круг
        else {
            this.intersectionPoints.p1.x = NaN;
            this.intersectionPoints.p1.y = NaN;
            this.intersectionPoints.p2.x = NaN;
            this.intersectionPoints.p2.y = NaN;
            return NaN;
        }
    },
    IntersectionLineToEllipse() {

        // Сдвиг системы координат
        const coords1 = {
            x1: this.line.coords.x1 - this.ellipse2.coords.x,
            y1: this.line.coords.y1 - this.ellipse2.coords.y,
            x2: this.line.coords.x2 - this.ellipse2.coords.x,
            y2: this.line.coords.y2 - this.ellipse2.coords.y,
        };

        // coords.x1 -= this.ellipse2.coords.x;
        // coords.y1 -= this.ellipse2.coords.y;
        // coords.x2 -= this.ellipse2.coords.x;
        // coords.y2 -= this.ellipse2.coords.y;

        // Поворот линии на угол поворота эллипса
        let angle = -this.ToRad(this.ellipse2.angle);

        const coords2 = {
            x1: coords1.x1*Math.cos(angle) - coords1.y1 * Math.sin(angle),
            y1: coords1.x1*Math.sin(angle) + coords1.y1 * Math.cos(angle),
            x2: coords1.x2*Math.cos(angle) - coords1.y2 * Math.sin(angle),
            y2: coords1.x2*Math.sin(angle) + coords1.y2 * Math.cos(angle),
        };

        // Сжатие линии, чтобы получить круг из эллипса

        const kr = this.ellipse2.radiuses.x/this.ellipse2.radiuses.y

        const coords = {
            x1: coords2.x1,
            y1: coords2.y1 * kr,
            x2: coords2.x2,
            y2: coords2.y2 * kr,
        };


        // Нахождение пересечения с окружностью

        const A = coords.y1 - coords.y2;
        const B = coords.x2 - coords.x1;
        // const C = coords.y2 * coords.x1 - coords.x2 * coords.y1 + A * parseFloat(this.ellipse2.coords.x) + B * parseFloat(this.ellipse2.coords.y);
        const C = coords.y2 * coords.x1 - coords.x2 * coords.y1;
        const M = A * A + B * B;
        const d = Math.sqrt(Math.pow(this.ellipse2.radiuses.x, 2) - C * C / M);
        if (d !== d) {
            this.intersectionPoints.p1.x = NaN;
            this.intersectionPoints.p1.y = NaN;
            this.intersectionPoints.p2.x = NaN;
            this.intersectionPoints.p2.y = NaN;
            this.minDistance = NaN;
            return NaN;
        }
        const K = Math.sqrt(d * d / M);

        //const x0 = - A * C / M + parseFloat(this.ellipse2.coords.x);
        const x0 = - A * C / M
        const y0 = - B * C / M;

        // координаты точек касания

        const touchPoint = {
            pk1: {
                x: - A * this.ellipse2.radiuses.x * Math.sqrt(M) / M,
                y: - B * this.ellipse2.radiuses.x * Math.sqrt(M) / M,
            },
            pk2: {
                x:  A * this.ellipse2.radiuses.x * Math.sqrt(M) / M,
                y:  B * this.ellipse2.radiuses.x * Math.sqrt(M) / M,
            },
        }



        //this.minDistance = Math.hypot(x0 - this.line.coords..x1, y0 - this.line.coords.y1) - d;
        this.minDistance = Math.hypot(x0 - coords.x1, y0 - coords.y1) - d;
        // if (this.minDistance < 0 ) {
        //     this.intersectionPoints.p1.x = NaN;
        //     this.intersectionPoints.p1.y = NaN;
        //     this.intersectionPoints.p2.x = NaN;
        //     this.intersectionPoints.p2.y = NaN;
        //     return NaN;
        // }

        // нахождение точек пересечения
        const coords3 = {
            x1: x0 + B * K,
            y1: y0 - A * K,
            x2: x0 - B * K,
            y2: y0 + A * K
        }

        // растяжение координат
        const coords4 = {
            x1: coords3.x1,
            y1: coords3.y1 / kr,
            x2: coords3.x2,
            y2: coords3.y2 / kr
        }

        touchPoint.pk1.y = touchPoint.pk1.y / kr;
        touchPoint.pk2.y = touchPoint.pk2.y / kr;

        // Поворот координат на угол поворота эллипса обратно
        angle = -angle;

        const coords5 = {
            x1: coords4.x1*Math.cos(angle) - coords4.y1 * Math.sin(angle),
            y1: coords4.x1*Math.sin(angle) + coords4.y1 * Math.cos(angle),
            x2: coords4.x2*Math.cos(angle) - coords4.y2 * Math.sin(angle),
            y2: coords4.x2*Math.sin(angle) + coords4.y2 * Math.cos(angle)
        };

        let x = touchPoint.pk1.x * Math.cos(angle) - touchPoint.pk1.y * Math.sin(angle);
        let y = touchPoint.pk1.x * Math.sin(angle) + touchPoint.pk1.y * Math.cos(angle);

        touchPoint.pk1.x = x;
        touchPoint.pk1.y = y;

        x = touchPoint.pk2.x * Math.cos(angle) - touchPoint.pk2.y * Math.sin(angle);
        y = touchPoint.pk2.x * Math.sin(angle) + touchPoint.pk2.y * Math.cos(angle);

        touchPoint.pk2.x = x;
        touchPoint.pk2.y = y;

         // Сдвиг системы координат обратно
         const coords6 = {
            x1: coords5.x1 + +this.ellipse2.coords.x,
            y1: coords5.y1 + +this.ellipse2.coords.y,
            x2: coords5.x2 + +this.ellipse2.coords.x,
            y2: coords5.y2 + +this.ellipse2.coords.y,
        };

        touchPoint.pk1.x = touchPoint.pk1.x + +this.ellipse2.coords.x;
        touchPoint.pk1.y = touchPoint.pk1.y + +this.ellipse2.coords.y;

        touchPoint.pk2.x = touchPoint.pk2.x + +this.ellipse2.coords.x;
        touchPoint.pk2.y = touchPoint.pk2.y + +this.ellipse2.coords.y;

        this.intersectionPoints.p1.x = coords6.x1;
        this.intersectionPoints.p1.y = coords6.y1;
        this.intersectionPoints.p2.x = coords6.x2;
        this.intersectionPoints.p2.y = coords6.y2;
        this.intersectionPoints.pk1.x = touchPoint.pk1.x;
        this.intersectionPoints.pk1.y = touchPoint.pk1.y;
        this.intersectionPoints.pk2.x = touchPoint.pk2.x;
        this.intersectionPoints.pk2.y = touchPoint.pk2.y;

        // this.intersectionPoints.p1.x = x0 + B * K;
        // this.intersectionPoints.p1.y = y0 - A * K;
        // this.intersectionPoints.p2.x = x0 - B * K;
        // this.intersectionPoints.p2.y = y0 + A * K;



        // coords.x1 -= this.ellipse2.coords.x;
        // coords.y1 -= this.ellipse2.coords.y;
        // coords.x2 -= this.ellipse2.coords.x;
        // coords.y2 -= this.ellipse2.coords.y;

        // Поворот линии на угол поворота эллипса
        // const angle = -this.ToRad(this.ellipse2.angle);

        // const coords = {
        //     x1: coords1.x1*Math.cos(angle) - coords1.y1 * Math.sin(angle),
        //     y1: coords1.x1*Math.sin(angle) + coords1.y1 * Math.cos(angle),
        //     x2: coords1.x2*Math.cos(angle) - coords1.y2 * Math.sin(angle),
        //     y2: coords1.x2*Math.sin(angle) + coords1.y2 * Math.cos(angle),
        // };


        // this.intersectionPoints.p1.x = x0 + B * K;
        // this.intersectionPoints.p1.y = y0 - A * K;
        // this.intersectionPoints.p2.x = x0 - B * K;
        // this.intersectionPoints.p2.y = y0 + A * K;
        return this.intersectionPoints.p1.x;

        // const minX = Math.min( this.line.coords.x1, this.line.coords.x2);
        // const maxX = Math.max( this.line.coords.x1, this.line.coords.x2);
        // const minY = Math.min( this.line.coords.y1, this.line.coords.y2);
        // const maxY = Math.max( this.line.coords.y1, this.line.coords.y2);

        // if ( minX <=  this.intersectionPoints.p1.x && this.intersectionPoints.p1.x <= maxX &&
        //      minY <=  this.intersectionPoints.p1.y && this.intersectionPoints.p1.y <= maxY ||
        //      minX <=  this.intersectionPoints.p2.x && this.intersectionPoints.p2.x <= maxX &&
        //      minY <=  this.intersectionPoints.p2.y && this.intersectionPoints.p2.y <= maxY )
        // {
        //     return this.intersectionPoints.p1.x;
        // }
        // else {
        //     this.intersectionPoints.p1.x = NaN;
        //     this.intersectionPoints.p1.y = NaN;
        //     this.intersectionPoints.p2.x = NaN;
        //     this.intersectionPoints.p2.y = NaN;
        //     return NaN;
        // }
    },


    get C2() {
        // const line = this.line;
        // const x1 = line.useAngel ? (Math.cos(this.inRad(line.angle)) >= 0 ? 1 : -1) * Math.abs(line.length * Math.cos(this.inRad(line.angle))) + line.coords.x1 : line.coords.x2; // Рассчитываем координаты конечной точки по оси x
        // const y1 = line.useAngel ? (Math.sin(this.inRad(line.angle)) >= 0 ? 1 : -1) * Math.abs(line.length * Math.sin(this.inRad(line.angle))) + line.coords.y1 : line.coords.y2; // Рассчитываем координаты конечной точки по оси y
        // const A = (this.line.coords.y1 - y1)/this.ellipse1.radiuses.y;
        // const B = (x1 - this.line.coords.x1)/this.ellipse1.radiuses.x;
        // const C = y1 * this.line.coords.x1 - x1 * this.line.coords.y1 + A * parseFloat(this.ellipse1.coords.x) + B * parseFloat(this.ellipse1.coords.y);
        // const M = A * A + B * B;
        // // const d = Math.sqrt(Math.pow(this.ellipse1.radiuses.x, 2) - C * C / M);
        // const d = Math.pow(this.ellipse1.radiuses.x, 2)  + Math.pow(this.ellipse1.radiuses.y, 2)- C * C / M;
        // const K = Math.sqrt(d / M);
        // const x0 = - A * C / M + parseFloat(this.ellipse1.coords.x);
        // const y0 = - B * C / M + parseFloat(this.ellipse1.coords.y);
        // return  Math.hypot(x0 - this.line.coords.x1, y0 - this.line.coords.y1) - d;
        // this.intersectionPoints.e1.x = x0 + B * K;
        // this.intersectionPoints.e1.y = y0 - A * K;
        // this.intersectionPoints.e2.x = x0 - B * K;
        // this.intersectionPoints.e2.y = y0 + A * K;
        // this.intersectionPoints.p1.x = Math.random(this.line.coords.x1);
        // this.intersectionPoints.p1.y = Math.random(10);
        // this.intersectionPoints.p2.x = 3;
        // this.intersectionPoints.p2.y = 4;
        // return {x: this.intersectionPoints.p1.x};
    }
})
