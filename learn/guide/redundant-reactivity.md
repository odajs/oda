Все свойства, явно объявленные в компоненте, автоматически оборачиваются в специальный объект **Proxy**, который перехватывает все выполняемые с ними операции, включая операции чтения и записи. В обработчиках этих операции реализуется механизм реактивности, который запускает цепочку автоматических изменений значений всех свойств зависимых от измененного свойства.

Механизм реактивности значительно облегчает задачу разработчика по обеспечению согласованности значений взаимосвязанных свойств компонента, но требует дополнительных затрат вычислительных ресурсов на перехват операций **Proxy**-объектами.

При работе с большими массивами и сложными объектами через **Proxy**-объект может приводить к значительным затратам машинного времени. В этом случае рациональнее создавать массивы и объекты без механизма реактивности.

```javascript run_edit_[my-component.js]
import '../../oda.js';
ODA({
    is: 'my-component',
    template: `
        <style>
            .divInRow {
                float: left;
            }
        </style>
        <div class="divInRow">
            <button @tap="start" :disabled="!activeButton"> <b>Start</b> </button>
        </div>
        <div id="outerDiv" class="divInRow" ref="outerDiv" style="width: 100px; height: 100px;">
            <svg ~ref="'svg'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" style="background: #ccc;">
                <circle ~for="dots.length" :cx="dots[index].x" :cy="dots[index].y" :r="1" :style="'fill:'+dots[index].color"></circle>
            </svg>
        </div>
        <div class="divInRow">
            <div>Dots: {{dots.length}}</div>
            <div>Seconds: {{Math.round((currentTime-startTime)/1000)}}</div>
        </div>
        `,
    props: { 
        maxQuantityDots: 30000,
        quantityDotsPerTurn: 50,
        startTime: 0,
        currentTime: 0,
        activeButton: true,
        dots: [], //Рассчитанные точки треугольника. Точка описывается координатами "x", "y" и цветом "color".
    },
    attached() {
        this.tmp();
    },
    start() {
        this.activeButton = false;
        this.dots = [];
        this.drawTriangleVertices();
        this.loop();
        this.currentTime = this.startTime = Date.now();
    },
    loop() {
        if( this.dots.length < this.maxQuantityDots) {
            this.createPoint();
            requestAnimationFrame(this.loop.bind(this));
        }
        else {
            this.activeButton = true;
        }
        this.currentTime = Date.now();
    },
    randomInteger(min, max) {
        return Math.floor(min + Math.random() * (max + 1 - min));
    },
    distance(start, stop) { //Расчет расстояния между точками
        return Math.sqrt( Math.pow(start.x-stop.x, 2) + Math.pow(start.y-stop.y, 2) );
    },
    createPoint() {
        const max = this.$refs.svg?.viewBox.baseVal.width;
        for( let i=0 ; i<this.quantityDotsPerTurn ; ++i ) {
            const randomVertex = this.randomInteger(0, 2);
            let point = {};
            point.x = (this.dots[this.dots.length-1].x + this.dots[randomVertex].x) / 2.0;
            point.y = (this.dots[this.dots.length-1].y + this.dots[randomVertex].y) / 2.0;
            const red = 255 * (1 - this.distance(this.dots[0], point) / max);
            const green = 255 * (1 - this.distance(this.dots[1], point) / max);
            const blue = 255 * (1 - this.distance(this.dots[2], point) / max);        
            point.color = "rgb(" + red + "," + green + "," + blue  + ")";
            this.dots.push(point);
        }
    },
    drawTriangleVertices() { 
        const maxX = this.$refs.svg?.viewBox.baseVal.width;
        const maxY = this.$refs.svg?.viewBox.baseVal.height;
        this.dots[0] = { x: maxX / 2, y: 0,                     color:"rgb(255,0,0)" };
        this.dots[1] = { x: 0,        y: maxY * Math.sqrt(3/4), color:"rgb(0,255,0)" };
        this.dots[2] = { x: maxX,     y: maxY * Math.sqrt(3/4), color:"rgb(0,0,255)" };
    },
});
```
