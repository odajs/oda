import '../../oda.js';
ODA({
    is: 'oda-sierpinski',
    template: /*html*/`
        <style>
            .vertex {
                cursor: pointer;
            }
            text {
                font: {{fontSize}}px sans-serif;
            }
            button {
                height: 30px;
                width: 90px;
                position: absolute;
                left: {{($refs.svg?.getBoundingClientRect().width-90)/2}}px;
                top: {{($refs.svg?.getBoundingClientRect().height-30)/2}}px;
            }
            .outerDiv {
                min-width: 200px;
                min-height: 200px;
                width: 100vw;
                height: calc(100vh - 35px);
                display: flex;
                position: relative;
            }
        </style>
        <div class="outerDiv" ref="outerDiv">
            <button @tap="start" ~if="showButton"> <b>Start</b> </button>
            <svg ~ref="'svg'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" style="background: #ccc;">
                <text x="10" :y="fontSize" ~show="dots.length">Drag some vertex</text>
                <text x="10" :y="2.5*fontSize" ~show="dots.length" fill="#fff">Dots: {{dots.length}}</text>
                <text x="10" :y="4*fontSize" ~show="dotsPerSecond" fill="#fff">Dots per second: {{dotsPerSecond}}</text>
                <text x="10" :y="5.5*fontSize" ~show="dots.length" fill="#fff">Seconds: {{Math.round((currentTime-startTime)/1000)}}</text>
                <circle ~for="dots.length" :cx="dots[index].x" :cy="dots[index].y" :r="radiusDot" :style="'fill:'+dots[index].color"></circle>
                <circle ~for="triangleVertices.length" :id="index" :cx="triangleVertices[index].x" :cy="triangleVertices[index].y" :r="radiusVertex" 
                        :style="'fill:'+triangleVertices[index].color" @track="move" class="vertex"></circle>
            </svg>
        </div>
        `,
    props: { 
        radiusDot: 1,
        radiusVertex: 5,
        maxQuantityDots: 30000,
        quantityDotsPerTurn: 7,
    },

    triangleVertices: [], //Вершины треугольника. Вершина описывается экранными координатами "x", "y" и цветом "color".
    color_triangleVertices: [], //Вершины абстрактного равностороннего треугольника. Длина стороны 1. Используется для расчета цвета точек. Вершина описывается координатами "x", "y".
    color_currentPoint: {},  //Координаты последней рассчитанной точки абстрактного равностороннего треугольника.
    dots: [], //Рассчитанные точки треугольника. Точка описывается координатами "x", "y", цветом "color" и вершиной "associatedVertex", относительно которой она рассчитана.
              //Координаты первой точки совпадают с координатами одной из вершин, выбранной случайным образом.
    previousQuantityOfDots: 0,
    dotsPerSecond: undefined,
    showButton: true,
    fontSize: undefined,
    startTime: 0,
    currentTime: 0,

    attached() {
        const resizeObserver = new ResizeObserver( this.onSizeChanged.bind(this) );
        resizeObserver.observe(this.$refs.outerDiv);
    },
    onSizeChanged( entries ) {
        this.fontSize = 16 * (this.$refs.svg?.viewBox.baseVal.width / this.$refs.svg?.getBoundingClientRect().width);
        },
    start() {
        this.showButton = false;
        this.dots = [];
        this.previousQuantityOfDots = 0;
        this.dotsPerSecond = 0;
        this.drawTriangleVertices();
        this.loop();
        this.timerId = setInterval(this.measurement.bind(this), 1000);
        this.startTime = Date.now();
    },
    loop() {
        if( this.dots.length < this.maxQuantityDots) {
            this.createPoint();
            requestAnimationFrame(this.loop.bind(this));
        }
        else {
            this.showButton = true;
            clearTimeout( this.timerId );
        }
        this.currentTime = Date.now();
    },
    measurement() { //Расчет текущей скорости построения
        this.dotsPerSecond = this.dots.length - this.previousQuantityOfDots;
        this.previousQuantityOfDots = this.dots.length;
    },
    randomInteger(min, max) {
        return Math.floor(min + Math.random() * (max + 1 - min));
    },
    distance(start, stop) { //Расчет расстояния между точками
        return Math.sqrt( Math.pow(start.x-stop.x, 2) + Math.pow(start.y-stop.y, 2) );
    },
    createPoint() {
        for( let i=0 ; i<this.quantityDotsPerTurn ; ++i ) {
            const randomVertex = this.randomInteger(0, 2);
            //Рассчитываем цвет точки используя идеальный треугольник    
            this.color_currentPoint.x = (this.color_currentPoint.x + this.color_triangleVertices[randomVertex].x) / 2.0;
            this.color_currentPoint.y = (this.color_currentPoint.y + this.color_triangleVertices[randomVertex].y) / 2.0;    
            const red = 255 * (1 - this.distance(this.color_triangleVertices[0], this.color_currentPoint));
            const green = 255 * (1 - this.distance(this.color_triangleVertices[1], this.color_currentPoint));
            const blue = 255 * (1 - this.distance(this.color_triangleVertices[2], this.color_currentPoint));        
            const color = "rgb(" + red + "," + green + "," + blue  + ")";
            //Рассчитываем координаты реальной точки   
            var point = {};
            point.x = (this.dots[this.dots.length-1].x + this.triangleVertices[randomVertex].x) / 2.0;
            point.y = (this.dots[this.dots.length-1].y + this.triangleVertices[randomVertex].y) / 2.0;
            point.color = color;
            point.associatedVertex = this.triangleVertices[randomVertex];
            this.dots.push(point);
        }
    },
    drawTriangleVertices() { 
        const maxX = this.$refs.svg?.viewBox.baseVal.width;
        const maxY = this.$refs.svg?.viewBox.baseVal.height;
        this.triangleVertices[0] = { x: maxX / 2,    y: maxY * 0.05, color:"rgb(255,0,0)" };
        this.triangleVertices[1] = { x: maxX * 0.05, y: maxY * 0.95, color:"rgb(0,255,0)" };
        this.triangleVertices[2] = { x: maxX * 0.95, y: maxY * 0.95, color:"rgb(0,0,255)" };
        //Равносторонний треугольник с длинной стороны 1, используется как идеальный треугольник для расчета цвета точки
        this.color_triangleVertices[0] = { x: 0.5, y: 0, color:"rgb(255,0,0)" };
        this.color_triangleVertices[1] = { x: 0,   y: Math.sqrt(3/4), color:"rgb(0,255,0)" };
        this.color_triangleVertices[2] = { x: 1,   y: Math.sqrt(3/4), color:"rgb(0,0,255)" };
        const randomVertex = this.randomInteger(0, 2);
        this.dots.push( Object.assign({associatedVertex: this.triangleVertices[randomVertex]}, this.triangleVertices[randomVertex]) );
        this.color_currentPoint = Object.assign({}, this.color_triangleVertices[randomVertex]);
    },
    recalculateDots() {
        this.dots[0].x = this.dots[0].associatedVertex.x;
        this.dots[0].y = this.dots[0].associatedVertex.y;
        for(var i=1 ; i<this.dots.length; ++i ) {
            this.dots[i].x = (this.dots[i-1].x + this.dots[i].associatedVertex.x) / 2.0;
            this.dots[i].y = (this.dots[i-1].y + this.dots[i].associatedVertex.y) / 2.0;
        }
    },
    move(e,d) {
        //Расчет коэффициента отношения размера пикселя экрана размеров к пикселю SVG
        const svg = this.$refs.svg;
        const rect = svg?.getBoundingClientRect();
        const k = svg?.viewBox.baseVal.width / rect.width;

        const mouse = {};
        mouse.x = (d.x - rect.left) * k;
        mouse.y = (d.y - rect.top) * k;

        var vertex = d.target.id;
        if( mouse.x <= 0 )
            this.triangleVertices[vertex].x = 0;
        else
            if( mouse.x >= svg?.viewBox.baseVal.width )
                this.triangleVertices[vertex].x = svg?.viewBox.baseVal.width;
            else
                this.triangleVertices[vertex].x = mouse.x;
        if( mouse.y <= 0 )
            this.triangleVertices[vertex].y = 0;
        else
            if( mouse.y >= svg?.viewBox.baseVal.height )
                this.triangleVertices[vertex].y = svg?.viewBox.baseVal.height;
            else
                this.triangleVertices[vertex].y = mouse.y;
        this.interval( "key", this.recalculateDots.bind(this), 33);
    },
})