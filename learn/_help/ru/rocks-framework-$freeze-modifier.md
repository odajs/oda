Модификатор **$freeze** используется для изменения механизма обработки реактивности свойств класса, создаваемых функцией **ROCKS**.

По умолчанию все свойства, созданные функцией **ROCKS**, имеют механизм реактивности. Этот механизм заставляет свойства автоматически пересчитывать свои значения, при изменении значений тех свойств, от которых они зависят.

В результате этого изменение значения одного свойства автоматически будет приводить к изменению значений всех зависящих от него свойств. Данный механизм применяется и для простых свойств, и для элементов структурных свойств, в качестве которых могут выступать как элементы массивов, так и свойства любых других объектов. Примеры работы механизма реактивности приведены в предыдущей статье **Реактивность свойств**.

Механизм реактивности существенно упрощает задачу отслеживания всех взаимосвязей в проекте, снижает количество ошибок и трудоемкость программирования. Но за удобства нужно платить. Механизм основан на перехвате всех операции чтения и записи, выполняемых со свойствами, что увеличивает нагрузку на вычислительную систему. Это может привести к значительным затратам машинного времени при решении реальных задач, когда осуществляется интенсивное обращение к свойству, а также когда в массивах находится большое количество элементов или когда объект имеет сложную структуру вложенных свойств. В этом случае механизм реактивности можно заблокировать. Для этого достаточно у свойства указать специальный модификатор **$freeze** со значением **true**.

Например,

```html run_edit_h=75_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='React'></div>
<div id='Frozen'></div>
<button id='button'>Increment</button>
<script type="module">
    class myClass extends ROCKS({
        reactiveCounter: 0,
        frozenCounter: {
            $def: 0,
            $freeze: true
        },
        get React() {
            return this.reactiveCounter;
        },
        get Frozen() {
            return this.frozenCounter;
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let divReact = document.getElementById("React");
    let divFrozen = document.getElementById("Frozen");
    divReact.innerText = "Reactive counter: " + myObject.React;
    divFrozen.innerText = "Frozen counter: " + myObject.Frozen;

    let button = document.getElementById("button");
    button.onclick = function() {
        ++myObject.reactiveCounter;
        ++myObject.frozenCounter;
        divReact.innerText = "Reactive counter: " + myObject.React;
        divFrozen.innerText = "Frozen counter: " + myObject.Frozen;
    }
</script>
```

В данном примере, механизм реактивности для свойства **frozenCounter** отключен. В результате этого нажатие на кнопку **Increment** не будет приводить к изменению значения этого счетчика на экране, несмотря на то, что само свойство **frozenCounter** будет инкрементироваться в обработчике нажатия кнопки. Также в примере объявлено свойство **reactiveCounter** без модификатора **$freeze**, поэтому оно сохранило реактивность и изменяет свое значение на экране при каждом нажатии кнопки.

Модификатор **$freeze** может использоваться в качестве группирующего модификатора, поэтому с его помощь можно объявить группу свойств с отключенной реактивностью. Это упрощает синтаксис, т.к. не надо указывать модификатор отдельно у каждого свойства.

Например,

```html run_edit_h=75_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='React'></div>
<div id='Frozen'></div>
<button id='button'>Increment</button>
<script type="module">
    class myClass extends ROCKS({
        reactiveCounter: 0,
        $freeze: {
            frozenCounter: 0
        },
        get React() {
            return this.reactiveCounter;
        },
        get Frozen() {
            return this.frozenCounter;
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let divReact = document.getElementById("React");
    let divFrozen = document.getElementById("Frozen");
    divReact.innerText = "Reactive counter: " + myObject.React;
    divFrozen.innerText = "Frozen counter: " + myObject.Frozen;

    let button = document.getElementById("button");
    button.onclick = function() {
        ++myObject.reactiveCounter;
        ++myObject.frozenCounter;
        divReact.innerText = "Reactive counter: " + myObject.React;
        divFrozen.innerText = "Frozen counter: " + myObject.Frozen;
    }
</script>
```

Этот пример аналогичен предыдущему, за исключение того, что модификатор **$freeze** убран из объявления свойства **frozenCounter** и использован для него как группирующий. Такой подход также позволил указать начальное значение непосредственно в свойстве и убрать из его описания модификатор **$def**, что сократило объем кода и сделало его более наглядным.

Аналогичным образом, с помощью модификатора **$freeze**, реактивность отключается у отдельных свойств объектов.

Например,

```html run_edit_h=75_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='React'></div>
<div id='Frozen'></div>
<button id='button'>Increment</button>
<script type="module">
    class myClass extends ROCKS({
        test: {
            $def: {
                frozenCounter: {
                    $def: 0,
                    $freeze: true
                },
                reactiveCounter: 0
            }
        },
        get React() {
            return this.test.reactiveCounter;
        },
        get Frozen() {
            return this.test.frozenCounter;
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let divReact = document.getElementById("React");
    let divFrozen = document.getElementById("Frozen");
    divReact.innerText = "Reactive counter: " + myObject.React;
    divFrozen.innerText = "Frozen counter: " + myObject.Frozen;

    let button = document.getElementById("button");
    button.onclick = function() {
        ++myObject.test.reactiveCounter;
        ++myObject.test.frozenCounter;
        divReact.innerText = "Reactive counter: " + myObject.React;
        divFrozen.innerText = "Frozen counter: " + myObject.Frozen;
    }
</script>
```

В данном примере, механизм реактивности для свойства **frozenCounter** объекта **test** отключен модификатором **$freeze**. В результате этого нажатие на кнопку **Increment** не будет приводить к изменению значения этого счетчика на экране, несмотря на то, что само свойство **frozenCounter** будет инкрементироваться в обработчике нажатия кнопки. Также у объекта **test** объявлено свойство **reactiveCounter** без модификатора **$freeze**, поэтому оно сохранило реактивность и изменяет свое значение на экране при каждом нажатии кнопки.

Аналогичным образом, с помощью модификатора **$freeze**, реактивность отключается у элементов массива.

Например,

```html run_edit_h=75_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='React'></div>
<div id='Frozen'></div>
<button id='button'>Increment</button>
<script type="module">
    class myClass extends ROCKS({
        reactive: [0, 1, 2],
        frozen: {
            $def: [0, 1, 2],
            $freeze: true
        },
        get React() {
            return this.reactive[0];
        },
        get Frozen() {
            return this.frozen[0];
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let divReact = document.getElementById("React");
    let divFrozen = document.getElementById("Frozen");
    divReact.innerText = "Reactive counter: " + myObject.React;
    divFrozen.innerText = "Frozen counter: " + myObject.Frozen;

    let button = document.getElementById("button");
    button.onclick = function() {
        ++myObject.reactive[0];
        ++myObject.frozen[0];
        divReact.innerText = "Reactive counter: " + myObject.React;
        divFrozen.innerText = "Frozen counter: " + myObject.Frozen;
    }
</script>
```

Данный пример аналогичен предыдущему, только вместо свойства **counter** в объектах, инкрементируется первый элемент в массивах.

Если модификатор **$freeze** используется в качестве группирующего при объявлении объекта, то функция **ROCKS** не оборачивает его в **Proxy**-объект. В результате все свойства объекта теряют реактивность.

Например,


```html run_edit_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id='button'>Вывести объект в консоль</button>
<script type="module">
    class myClass extends ROCKS({
        $freeze: {
            test: {
                prop: 0
            }
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let button = document.getElementById("button");
    button.onclick = function() {
        console.log( myObject.test );
    }
</script>
```

В данном примере по нажатию кнопки в консоль браузера выводится объект **test**, объявленный в функции **ROCKS**. Откройте консоль и исследуйте его. Так как объект объявлен с модификатором **$freeze**, то функция **ROCKS** оставила его без изменений.

![Консоль браузера](learn/_help/ru/_images/rocks-framework-$freeze-modifier-1.png "Консоль браузера")

Аналогичным образом модификатор **$freeze** запрещает оборачивать массив в **Proxy**-объект. Причем в случае с массивами модификатор может находиться не только в позиции группирующего, но и быть расположен внутри объявления массива.

Например,

```html run_edit_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id='button'>Вывести массив в консоль</button>
<script type="module">
    class myClass extends ROCKS({
        $freeze: {
            test1: [0, 1]
        },
        test2: {
            $def: [5, 6],
            $freeze: true
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let button = document.getElementById("button");
    button.onclick = function() {
        console.log( myObject.test1 );
        console.log( myObject.test2 );
    }
</script>
```

Этот пример аналогичен предыдущему, только вместо объекта в консоль выводятся два массива с разным расположением модификаторов **$freeze**. Видно, что функция **ROCKS** оставила их без изменений.


![Консоль браузера](learn/_help/ru/_images/rocks-framework-$freeze-modifier-2.png "Консоль браузера")

Механизм реактивности значительно облегчает задачу разработчика по обеспечению согласованности значений взаимосвязанных свойств класса, но требует дополнительных затрат вычислительных ресурсов на перехват операций **Proxy**-объектами.

Работа с большими массивами и сложными объектами через **Proxy**-объект может приводить к значительным затратам машинного времени. В этом случае рациональнее создавать массивы и объекты без механизма реактивности.

Для оценки влияния модификатора **freeze** на скорость вычислений создадим класс, строящий треугольник Серпинского по точкам. Алгоритм построения следующий:

1. На плоскости задаются три вершины треугольника. Это первые три точки треугольника Серпинского.

2. Для построения каждой следующей точки берется отрезок между последней рассчитанной точкой и одной из вершин треугольника, выбранной случайным образом. Затем рассчитываются координаты середины указанного отрезка. Эти координаты являются координатами новой точки.

3. Шаг **2** повторяется до тех пор, пока не будет рассчитано заданное количество точек. В нашем примере это 50000 точек.

Время расчета всех точек треугольника замеряется.

В первом примере координаты рассчитанных точек и их цвет хранятся в массиве **dots**, объявленном без использования модификаторов. Благодаря такому объявлению массив **dots** обернут в **Proxy**-объект.

```html run_edit_eh=250_h=115_maxLines=13_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id="button" style="float:left"> <b>Start</b> </button>
<div style="width:100px; height:100px; float:left">
    <svg id="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" style="background: #ccc;"></svg>
</div>
<div style="float:left">
    <div id="dotsLength">Dots: 0</div>
    <div id="creatingTime">Creating triangle time: 0 ms</div>
</div>
<script type="module">
    class myClass extends ROCKS({
        maxQuantityDots: 50000,
        dots: [], //Рассчитанные точки треугольника. Точка описывается координатами "x", "y" и цветом "color".
        start() {
            document.querySelector("#svg").querySelectorAll("circle").forEach( (item,index)=>{item.remove()} );
            document.querySelector("#button").disabled = true;
            document.querySelector("#dotsLength").innerText = "Dots: 0";
            document.querySelector("#creatingTime").innerText = "Creating triangle time: 0 ms";
            this.dots = [];
            setTimeout( ()=>this.createTriangle(), 0);
        },
        randomInteger(min, max) {
            return Math.floor(min + Math.random() * (max + 1 - min));
        },
        distance(start, stop) { //Расчет расстояния между точками
            return Math.sqrt( Math.pow(start.x-stop.x, 2) + Math.pow(start.y-stop.y, 2) );
        },
        createTriangle() {
            const startTime = Date.now();
            let svg = document.querySelector("#svg");
            const maxX = svg.viewBox.baseVal.width;
            const maxY = svg.viewBox.baseVal.height;
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
            document.querySelector("#creatingTime").innerText = "Creating triangle time: " + (Date.now() - startTime) + " ms";
            document.querySelector("#dotsLength").innerText = "Dots: " + this.dots.length;
            setTimeout( ()=>this.visualize(), 0);
            },
        visualize() {
            let svg = document.querySelector("#svg");
            for( let i=0 ; i<this.maxQuantityDots ; ++i ) {
                let circle = document.createElementNS( 'http://www.w3.org/2000/svg', 'circle' );
                circle.setAttributeNS(null, "cx", this.dots[i].x);
                circle.setAttributeNS(null, "cy", this.dots[i].y);
                circle.setAttributeNS(null, "r", 1);
                circle.setAttributeNS(null, "fill", this.dots[i].color);
                svg.appendChild( circle );
            }
            document.querySelector("#button").disabled = false;
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    document.querySelector("#button").onclick = myObject.start.bind(myObject);
</script>
```

На компьютере, на котором написана данная статья, для расчета 50000 точек требуется от 790 до 950 миллисекунд.

Изменим наш пример. Добавим в объявление массива **dots** модификатор **$freeze**. Теперь массив не будет оборачиваться в **Proxy**-объект.

```html run_edit_eh=250_h=115_maxLines=13_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id="button" style="float:left"> <b>Start</b> </button>
<div style="width:100px; height:100px; float:left">
    <svg id="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" style="background: #ccc;"></svg>
</div>
<div style="float:left">
    <div id="dotsLength">Dots: 0</div>
    <div id="creatingTime">Creating triangle time: 0 ms</div>
</div>
<script type="module">
    class myClass extends ROCKS({
        maxQuantityDots: 50000,
        dots: { //Рассчитанные точки треугольника. Точка описывается координатами "x", "y" и цветом "color".
            $def: [],
            $freeze: true
        },
        start() {
            document.querySelector("#svg").querySelectorAll("circle").forEach( (item,index)=>{item.remove()} );
            document.querySelector("#button").disabled = true;
            document.querySelector("#dotsLength").innerText = "Dots: 0";
            document.querySelector("#creatingTime").innerText = "Creating triangle time: 0 ms";
            this.dots = [];
            setTimeout( ()=>this.createTriangle(), 0);
        },
        randomInteger(min, max) {
            return Math.floor(min + Math.random() * (max + 1 - min));
        },
        distance(start, stop) { //Расчет расстояния между точками
            return Math.sqrt( Math.pow(start.x-stop.x, 2) + Math.pow(start.y-stop.y, 2) );
        },
        createTriangle() {
            const startTime = Date.now();
            let svg = document.querySelector("#svg");
            const maxX = svg.viewBox.baseVal.width;
            const maxY = svg.viewBox.baseVal.height;
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
            document.querySelector("#creatingTime").innerText = "Creating triangle time: " + (Date.now() - startTime) + " ms";
            document.querySelector("#dotsLength").innerText = "Dots: " + this.dots.length;
            setTimeout( ()=>this.visualize(), 0);
            },
        visualize() {
            let svg = document.querySelector("#svg");
            for( let i=0 ; i<this.maxQuantityDots ; ++i ) {
                let circle = document.createElementNS( 'http://www.w3.org/2000/svg', 'circle' );
                circle.setAttributeNS(null, "cx", this.dots[i].x);
                circle.setAttributeNS(null, "cy", this.dots[i].y);
                circle.setAttributeNS(null, "r", 1);
                circle.setAttributeNS(null, "fill", this.dots[i].color);
                svg.appendChild( circle );
            }
            document.querySelector("#button").disabled = false;
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    document.querySelector("#button").onclick = myObject.start.bind(myObject);
</script>
```

На компьютере, на котором написана данная статья, во втором примере для расчета 50000 точек требуется от 100 до 110 миллисекунд. Таким образом, при отсутствии механизма реактивности у массива **dots** на построение треугольника Серпинского требуется почти в восемь раз меньше времени.

Сравнение этих примеров показывает, что наличие реактивности у массива **dots** значительно повышает нагрузку на вычислительные ресурсы компьютера, так как все обращения к элементам массива перехватываются и обрабатываются **Proxy**-объектом.

```faq_md
**СОВЕТ**. Оцените необходимость реактивности у свойств класса, интенсивно используемых в большом количестве вычислений. Если реактивность не требуется, отключайте ее. Это повысит отзывчивость разрабатываемых HTML-страниц.
```

