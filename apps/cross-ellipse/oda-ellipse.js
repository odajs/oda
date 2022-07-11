import '../../components/layouts/app-layout/app-layout.js';
import '../../tools/property-grid/test/new/property-grid.js';
ODA({
    is: 'oda-ellipse',
    template: `
        <style>
            :host {
                height: 100%;
            }
        </style>
        <oda-app-layout>
            <div slot="title" class="horizontal no-flex header border">
                <div class="flex"></div>
                <div>
                    <a target="_blank" style="margin: 4px; font-size: 40px; font-weight: 600; font-family: 'Comfortaa', cursive; ">Ellipse Intersection Test</a>
                </div>

                <div class="flex"></div>
                <oda-button icon="av:play-arrow" @tap="repaintCanvas"></oda-button>
                <oda-button icon="icons:refresh" @tap="refreshCanvas" title="Repaint"></oda-button>
                <oda-button icon="icons:launch" @tap="clearCanvas" title="Clear"></oda-button>
                <oda-button icon="icons:launch" @tap="findOutIntersectionCircle" title="Find out intersection"></oda-button>
            </div>
            <div slot="main" id="render-box">
                <canvas ref="canvas" :width="innerWidth" :height="innerHeight" @tap="setCurrentPoint" style="display:block; margin:0 auto; border:1px solid black" @resize="refreshCanvas()"></canvas>
            </div>
            <oda-property-grid slot="right-panel" class="vertical flex border" label="Intersection ellipse" :inspected-object="this" style="padding:0" show-buttons="false" :categories></oda-property-grid>
            <div slot="bottom">
                <a target="_blank" style="margin: 4px; font-size: medium; font-weight: 600">Min distance: {{minDistance.toFixed(2)}} </a>
            </div>
            <div slot="bottom">
                <a target="_blank" style="margin: 4px; font-size: medium; font-weight: 600">Point 1 ({{intersectionPoints.e1.x.toFixed(2)}}, {{intersectionPoints.e1.y.toFixed(2)}}) : Point 2 ({{intersectionPoints.e2.x.toFixed(2)}}, {{intersectionPoints.e2.y.toFixed(2)}}): Current point ({{currentPoint.x.toFixed(2)}} , {{currentPoint.y.toFixed(2)}})</a>
            </div>
        </oda-app-layout>
    `,
    props: {
        ellipse1: {
            type: Object,
            default: {
                coords: { x: 200, y: 100 },
                sizes: { x: 100, y: 100 },
                angle: 0,
                isDraw: true,
                color: 'red',
                lineWidth: 2
            }
        },
        ellipse2: {
            coords: { x: 300, y: 300 },
            sizes: { x: 100, y: 50 },
            angle: 45,
            isDraw: true,
            color: 'blue',
            lineWidth: 2
        },
        line: {
            coords: { x1: 50, y1: 50, x2: 200, y2: 200 },
            angle: 45,
            length: 150,
            isDraw: true,
            useAngle: false,
            color: 'green',
            lineWidth: 2,
        },
        intersectionPoints: { e1: { x: 0, y: 0 }, e2: { x: 0, y: 0, } },
        currentPoint: { x: 0, y: 0 },
        minDistance:{
            get(){
                    return this.findOutIntersectionCircle();
            },
            set(){
                this.refreshCanvas();
            }
        },
        categories: {
            category: '...',
            type: Array,
            default: ['properties']
        }
    },
    attached() {
        // this.canvas = this.$refs.canvas;
        // setTimeout(() => {
            this.canvas = this.$refs.canvas;
            this.ctx = this.canvas.getContext('2d');
            if (this.ellipse1.isDraw)
                this.drawEllipse(this.ellipse1);
            if (this.ellipse1.isDraw)
                this.drawEllipse(this.ellipse2);
            if (this.line.isDraw)
                this.drawLine(this.line);
        // });
    },
    drawEllipse(ellipse) {
        if (!this.ctx) return;
        this.ctx.beginPath(); // Начинаем новый путь
        this.ctx.save(); // Сохраняем стейт контекста
        this.ctx.translate(ellipse.coords.x, ellipse.coords.y); // Перемещаем координаты в центр эллипса
        this.ctx.rotate(this.inRad(ellipse.angle)); // Поворачиваем координатную сетку на нужный угол
        this.ctx.scale(1, ellipse.sizes.y / ellipse.sizes.x); // Сжимаем по вертикали
        this.ctx.arc(0, 0, ellipse.sizes.x, 0, Math.PI * 2); // Рисуем круг
        this.ctx.restore(); // Восстанавливаем стейт, иначе обводка и заливка будут сплющенными и повёрнутыми
        this.ctx.strokeStyle = ellipse.color; // Задаем цвет контура
        this.ctx.lineWidth = ellipse.lineWidth; // Задаем толщину контура
        this.ctx.stroke(); // Обводим
        this.ctx.closePath();
    },
    drawLine(line) {
        if (!this.ctx) return;
        if (line.length) { }
        this.ctx.beginPath(); // Начинаем новый путь
        const x1 = line.useAngel ? (Math.cos(this.inRad(line.angle)) >= 0 ? 1 : -1) * Math.abs(line.length * Math.cos(this.inRad(line.angle))) + line.coords.x1 : line.coords.x2; // Рассчитываем координаты конечной точки по оси x
        const y1 = line.useAngel ? (Math.sin(this.inRad(line.angle)) >= 0 ? 1 : -1) * Math.abs(line.length * Math.sin(this.inRad(line.angle))) + line.coords.y1 : line.coords.y2; // Рассчитываем координаты конечной точки по оси y
        this.ctx.moveTo(line.coords.x1, line.coords.y1); // Передвигаем перо в начальную точку
        this.ctx.lineTo(x1, y1) // Рисует линию до конечной точки
        this.ctx.strokeStyle = line.color; // Задаем цвет контура
        this.ctx.lineWidth = line.lineWidth; // Задаем толщину контура
        this.ctx.stroke(); // Обводим
        this.ctx.closePath();
    },
    inRad(angle) {
        return angle * Math.PI / 180;
    },
    setCurrentPoint(e, d) {
        this.currentPoint.x = d.sourceEvent.offsetX;
        this.currentPoint.y = d.sourceEvent.offsetY;
    },
    repaintCanvas() {
        if (this.ellipse1.isDraw)
            this.drawEllipse(this.ellipse1);
        if (this.ellipse1.isDraw)
            this.drawEllipse(this.ellipse2);
        if (this.line.isDraw)
            this.drawLine(this.line);
    },
    refreshCanvas() {
        this.clearCanvas();
        if (this.ellipse1.isDraw)
            this.drawEllipse(this.ellipse1);
        if (this.ellipse1.isDraw)
            this.drawEllipse(this.ellipse2);
        if (this.line.isDraw)
            this.drawLine(this.line);
    },
    clearCanvas() {
        if (this.canvas)
            this.canvas.width = this.canvas.width;
    },
    findOutIntersectionCircle() {
        const line = this.line;
        const x1 = line.useAngel ? (Math.cos(this.inRad(line.angle)) >= 0 ? 1 : -1) * Math.abs(line.length * Math.cos(this.inRad(line.angle))) + line.coords.x1 : line.coords.x2; // Рассчитываем координаты конечной точки по оси x
        const y1 = line.useAngel ? (Math.sin(this.inRad(line.angle)) >= 0 ? 1 : -1) * Math.abs(line.length * Math.sin(this.inRad(line.angle))) + line.coords.y1 : line.coords.y2; // Рассчитываем координаты конечной точки по оси y
        const A = this.line.coords.y1 - y1;
        const B = x1 - this.line.coords.x1;
        const C = y1 * this.line.coords.x1 - x1 * this.line.coords.y1 + A * parseFloat(this.ellipse1.coords.x) + B * parseFloat(this.ellipse1.coords.y);
        const M = A * A + B * B;
        const d = Math.sqrt(Math.pow(this.ellipse1.sizes.x, 2) - C * C / M);
        const K = Math.sqrt(d * d / M);
        const x0 = - A * C / M + parseFloat(this.ellipse1.coords.x);
        const y0 = - B * C / M + parseFloat(this.ellipse1.coords.y);
        return  Math.hypot(x0 - this.line.coords.x1, y0 - this.line.coords.y1) - d;
        // this.intersectionPoints.e1.x = x0 + B * K;
        // this.intersectionPoints.e1.y = y0 - A * K;
        // this.intersectionPoints.e2.x = x0 - B * K;
        // this.intersectionPoints.e2.y = y0 + A * K;
    }
})