Все свойства, явно объявленные в компоненте, автоматически оборачиваются в специальный объект **Proxy**, который перехватывает все выполняемые с ними операции, включая операции чтения и записи. В обработчиках этих операции реализуется механизм реактивности, который запускает цепочку автоматических изменений значений всех свойств зависимых от измененного свойства.

Механизм реактивности значительно облегчает задачу разработчика по обеспечению согласованности значений взаимосвязанных свойств компонента, но требует дополнительных затрат вычислительных ресурсов на перехват операций **Proxy**-объектами.

При работе с большими массивами и сложными объектами через **Proxy**-объект может приводить к значительным затратам машинного времени. В этом случае рациональнее создавать массивы и объекты без механизма реактивности.

Для примера рассмотрим компонент, строящий треугольник Серпинского по точкам. Алгоритм построения следующий:

1. На плоскости задаются три вершины треугольника. Это первые три точки треугольника Серпинского.

2. Для построения каждой следующей точки берется отрезок между последней рассчитанной точкой и одной из вершин треугольника, выбранной случайным образом. Затем рассчитываются координаты середины указанного отрезка. Эти координаты являются координатами новой точки.

3. Шаг **2** повторяется до тех пор, пока не будет рассчитано заданное количество точек. В нашем примере это 50000 точек.

В примерах замеряется время расчета всех точек треугольника Серпинского, а затем измеряется время между операциями рендеринга этого треугольника. В примерах запускается 10 операций рендеринга и рассчитывается среднее время одной операции.

В первом примере координаты рассчитанных точек и их цвет хранятся в массиве **dots** явно объявленном в разделе **props**. Благодаря явному объявлению массив **dots** обернут в **Proxy**-объект.

```javascript run_edit_[my-component.js]_eh=250_h=110
ODA({
    is: 'my-component',
    template: `
        <div style="float:left">
            <button @tap="start" :disabled="!activeButton"> <b>Start</b> </button>
        </div>
        <div style="width:100px; height:100px; float:left">
            <svg ~ref="'svg'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" style="background: #ccc;">
                <circle ~for="dots.length" :cx="dots[index].x" :cy="dots[index].y" :r="1" :style="'fill:'+dots[index].color"></circle>
            </svg>
        </div>
        <div style="float:left">
            <div>Dots: {{dots.length}}</div>
            <div>Creating triangle time: {{creatingTriangleTime}} ms</div>
            <div>Rendering count: {{renderingCount}}</div>
            <div ~if="renderingCount">Average rendering time: {{Math.round(totalTime / renderingCount)}} ms</div>
        </div>
        `,
    props: { 
        maxQuantityDots: 50000,
        activeButton: true,
        dots: [], //Рассчитанные точки треугольника. Точка описывается координатами "x", "y" и цветом "color".
        renderingCount: 0, //Счетчик операций рендеринга
        creatingTriangleTime: 0,
        previousTime: 0,
        totalTime: 0
   },
    start() {
        this.activeButton = false;
        this.dots = [];
        this.creatingTriangleTime = 0;
        this.renderingCount = 0;
        this.totalTime = 0;
        this.$next( ()=>{
            this.createTriangle();
            this.$next( ()=>{ this.previousTime = Date.now(); 
                requestAnimationFrame( this.loop.bind(this) ); 
            }, 1 );
        }, 1 );
    },
    loop() {
        if( this.renderingCount < 10 ) {
            ++this.renderingCount;
            const currentTime = Date.now();
            this.totalTime += currentTime - this.previousTime;
            this.previousTime = currentTime;
            requestAnimationFrame(this.loop.bind(this));
        }
        else {
            this.activeButton = true;
        }
    },
    randomInteger(min, max) {
        return Math.floor(min + Math.random() * (max + 1 - min));
    },
    distance(start, stop) { //Расчет расстояния между точками
        return Math.sqrt( Math.pow(start.x-stop.x, 2) + Math.pow(start.y-stop.y, 2) );
    },
    createTriangle() { 
        const start = Date.now();
        const maxX = this.$refs.svg?.viewBox.baseVal.width;
        const maxY = this.$refs.svg?.viewBox.baseVal.height;
        //Создание вершин треугольника
        this.dots[0] = { x: maxX / 2, y: 0,                     color:"rgb(255,0,0)" };
        this.dots[1] = { x: 0,        y: maxY * Math.sqrt(3/4), color:"rgb(0,255,0)" };
        this.dots[2] = { x: maxX,     y: maxY * Math.sqrt(3/4), color:"rgb(0,0,255)" };
        //Расчет всех остальных точек треугольника
        for( let i=0 ; i<this.maxQuantityDots-3 ; ++i ) {
            const randomVertex = this.randomInteger(0, 2);
            let point = {};
            point.x = (this.dots[this.dots.length-1].x + this.dots[randomVertex].x) / 2.0;
            point.y = (this.dots[this.dots.length-1].y + this.dots[randomVertex].y) / 2.0;
            const red = 255 * (1 - this.distance(this.dots[0], point) / maxX);
            const green = 255 * (1 - this.distance(this.dots[1], point) / maxX);
            const blue = 255 * (1 - this.distance(this.dots[2], point) / maxX);        
            point.color = "rgb(" + red + "," + green + "," + blue  + ")";
            this.dots.push(point);
        }
        this.creatingTriangleTime = Date.now() - start;
    },
});
```

На компьютере, на котором написана данная статья, для расчета 50000 точек требуется 788 миллисекунд. Среднее время, затрачиваемое на рендеринг всех точек треугольника, составляет примерно 659 миллисекунд.

Изменим наш пример. Уберем объявление массива **dots** из раздела **props**. Теперь массив будет создаваться динамически в методе **Start**, который выполняется при нажатии на кнопку **Start**. Динамически создаваемые массивы не оборачиваются в объект **Proxy**.

```javascript run_edit_[my-component.js]_eh=250_h=110
ODA({
    is: 'my-component',
    template: `
        <div style="float:left">
            <button @tap="start" :disabled="!activeButton"> <b>Start</b> </button>
        </div>
        <div style="width:100px; height:100px; float:left">
            <svg ~ref="'svg'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" style="background: #ccc;">
                <circle ~for="dots.length" :cx="dots[index].x" :cy="dots[index].y" :r="1" :style="'fill:'+dots[index].color"></circle>
            </svg>
        </div>
        <div style="float:left">
            <div>Dots: {{dots.length}}</div>
            <div>Creating triangle time: {{creatingTriangleTime}} ms</div>
            <div>Rendering count: {{renderingCount}}</div>
            <div ~if="renderingCount">Average rendering time: {{Math.round(totalTime / renderingCount)}} ms</div>
        </div>
        `,
    props: { 
        maxQuantityDots: 50000,
        activeButton: true,
        renderingCount: 0, //Счетчик операций рендеринга
        creatingTriangleTime: 0,
        previousTime: 0,
        totalTime: 0
   },
    start() {
        this.activeButton = false;
        this.dots = []; //Рассчитанные точки треугольника. Точка описывается координатами "x", "y" и цветом "color".
        this.creatingTriangleTime = 0;
        this.renderingCount = 0;
        this.totalTime = 0;
        this.$next( ()=>{
            this.createTriangle();
            this.$next( ()=>{ this.previousTime = Date.now(); 
                requestAnimationFrame( this.loop.bind(this) ); 
            }, 1 );
        }, 1 );
    },
    loop() {
        if( this.renderingCount < 10 ) {
            ++this.renderingCount;
            const currentTime = Date.now();
            this.totalTime += currentTime - this.previousTime;
            this.previousTime = currentTime;
            requestAnimationFrame(this.loop.bind(this));
        }
        else {
            this.activeButton = true;
        }
    },
    randomInteger(min, max) {
        return Math.floor(min + Math.random() * (max + 1 - min));
    },
    distance(start, stop) { //Расчет расстояния между точками
        return Math.sqrt( Math.pow(start.x-stop.x, 2) + Math.pow(start.y-stop.y, 2) );
    },
    createTriangle() { 
        const start = Date.now();
        const maxX = this.$refs.svg?.viewBox.baseVal.width;
        const maxY = this.$refs.svg?.viewBox.baseVal.height;
        //Создание вершин треугольника
        this.dots[0] = { x: maxX / 2, y: 0,                     color:"rgb(255,0,0)" };
        this.dots[1] = { x: 0,        y: maxY * Math.sqrt(3/4), color:"rgb(0,255,0)" };
        this.dots[2] = { x: maxX,     y: maxY * Math.sqrt(3/4), color:"rgb(0,0,255)" };
        //Расчет всех остальных точек треугольника
        for( let i=0 ; i<this.maxQuantityDots-3 ; ++i ) {
            const randomVertex = this.randomInteger(0, 2);
            let point = {};
            point.x = (this.dots[this.dots.length-1].x + this.dots[randomVertex].x) / 2.0;
            point.y = (this.dots[this.dots.length-1].y + this.dots[randomVertex].y) / 2.0;
            const red = 255 * (1 - this.distance(this.dots[0], point) / maxX);
            const green = 255 * (1 - this.distance(this.dots[1], point) / maxX);
            const blue = 255 * (1 - this.distance(this.dots[2], point) / maxX);        
            point.color = "rgb(" + red + "," + green + "," + blue  + ")";
            this.dots.push(point);
        }
        this.creatingTriangleTime = Date.now() - start;
    },
});
```

На компьютере, на котором написана данная статья, во втором примере для расчета 50000 точек требуется 110 миллисекунды и 472 миллисекунд для рендеринга. Таким образом, при отсутствии механизма реактивности у массива **dots** на построение треугольника Серпинского требуется почти в семь раз меньше времени, а рендеринг осуществляется почти в полтора раза быстрее.

Сравнение этих примеров показывает, что наличие реактивности у массива **dots** значительно повышает нагрузку на вычислительные ресурсы компьютера, так как все обращения к элементам массива перехватываются и обрабатываются **Proxy**-объектом. Причем повышение нагрузки происходит не только в процессе однократной операции по формированию массива, но и во время периодических операций рендеринга, при которых данные из массива считываются для отображения HTML-элементов.

```faq_md
**СОВЕТ**. Оцените необходимость реактивности у свойств компонента, интенсивно используемых в большом количестве вычислений, как при инициализации компонента, так и при его отображении. Если реактивность не требуется, создавайте эти свойства динамически. Это повысит отзывчивость разрабатываемых HTML-страниц.
```

