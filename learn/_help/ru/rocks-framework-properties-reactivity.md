По умолчанию свойства класса, создаваемые функцией **ROCKS**, обладают реактивностью, которая также обеспечивает работу встроенного механизма smart-кэширования результатов выполнения геттеров. Все это повышает отзывчивость разрабатываемого продукта, а также снижает требования к вычислительным ресурсам.

Например,

```html run_edit_h=75_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='React'></div>
<div id='Native'></div>
<button id='button'>Increment</button>
<script type="module">
    class myClass extends ROCKS({
        reactiveCounter: 0,
        get React() {
            return this.reactiveCounter;
        },
        get Native() {
            return this.nativeCounter;
        }
    }) {
        nativeCounter = 0;
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let divReact = document.getElementById("React");
    let divNative = document.getElementById("Native");
    divReact.innerText = "Reactive counter: " + myObject.React;
    divNative.innerText = "Native counter: " + myObject.Native;

    let button = document.getElementById("button");
    button.onclick = function() {
        ++myObject.reactiveCounter;
        ++myObject.nativeCounter;
        divReact.innerText = "Reactive counter: " + myObject.React;
        divNative.innerText = "Native counter: " + myObject.Native;
    }
</script>
```

В данном примере в классе объявлены геттеры **React** и **Native**, возвращающие значения счетчиков **reactiveCounter** и **nativeCounter**. Оба геттера объявлены в реактивной части класса. Это значит, что при обращении к ним будет проверяться необходимость повторного вычисления. Если вычислений не требуется, то значение будет браться из кэша. Счетчик **reactiveCounter** также объявлен в реактивной части класса, поэтому смена его значения будет триггером для пересчета зависимых от него элементов. Счетчик **nativeCounter** объявлен в нативной части класса, поэтому автоматическое отслеживание его зависимостей не осуществляется. Оба геттера вычисляются первый раз при загрузке страницы, и эти значения кэшируются. По нажатию кнопки **"Increment"** происходит инкремент обоих счетчиков и добавление в содержимое страницы информации из геттеров. Для геттера **React** фреймворк зафиксировал его зависимость от реактивного свойства **reactiveCounter**, поэтому его значение пересчитывается и обновляется на странице. В геттере **Native** нет обращений к свойствам, обладающим реактивностью, поэтому фреймворк не сформировал для него никаких зависимостей, и геттер не пересчитывается, несмотря на изменение счетчика **nativeCounter**, а из кэша берется его первоначальное значение равное **0**.

Реактивностью также обладают свойства объектов, объявленных в реактивной части класса.

Например,

```html run_edit_h=75_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='React'></div>
<div id='Native'></div>
<button id='button'>Increment</button>
<script type="module">
    class myClass extends ROCKS({
        reactive: {counter:0},
        get React() {
            return this.reactive.counter;
        },
        get Native() {
            return this.nativeCounter;
        }
    }) {
        nativeCounter = 0;
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let divReact = document.getElementById("React");
    let divNative = document.getElementById("Native");
    divReact.innerText = "Reactive counter: " + myObject.React;
    divNative.innerText = "Native counter: " + myObject.Native;

    let button = document.getElementById("button");
    button.onclick = function() {
        ++myObject.reactive.counter;
        ++myObject.nativeCounter;
        divReact.innerText = "Reactive counter: " + myObject.React;
        divNative.innerText = "Native counter: " + myObject.Native;
    }
</script>
```

Этот пример аналогичен предыдущему за исключением того, что счетчиком теперь является свойство **counter** объекта **reactive**.

В процессе выполнения кода к объектам, объявленным в реактивной части класса, могут динамически добавляться новые свойства, при этом они также будут обладать реактивностью. 

Например,

```html run_edit_h=75_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='React'></div>
<div id='Native'></div>
<button id='button'>Increment</button>
<script type="module">
    class myClass extends ROCKS({
        reactive: {},
        get React() {
            return this.reactive.counter;
        },
        get Native() {
            return this.nativeCounter;
        }
    }) {
        nativeCounter = 0;
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    myObject.reactive.counter = 0;
    let divReact = document.getElementById("React");
    let divNative = document.getElementById("Native");
    divReact.innerText = "Reactive counter: " + myObject.React;
    divNative.innerText = "Native counter: " + myObject.Native;

    let button = document.getElementById("button");
    button.onclick = function() {
        ++myObject.reactive.counter;
        ++myObject.nativeCounter;
        divReact.innerText = "Reactive counter: " + myObject.React;
        divNative.innerText = "Native counter: " + myObject.Native;
    }
</script>
```

Этот пример аналогичен предыдущему за исключением того, что свойство **counter** добавляется в объект **reactive** не функцией **ROCKS**, а в процессе выполнения кода, уже после создания класса и объекта на его основе.

Реактивностью также обладают элементы массивов, объявленных в реактивной части класса.

Например,

```html run_edit_h=75_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='React'></div>
<div id='Native'></div>
<button id='button'>Increment</button>
<script type="module">
    class myClass extends ROCKS({
        reactiveCounter: [0,1,2],
        get React() {
            return this.reactiveCounter[0];
        },
        get Native() {
            return this.nativeCounter;
        }
    }) {
        nativeCounter = 0;
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let divReact = document.getElementById("React");
    let divNative = document.getElementById("Native");
    divReact.innerText = "Reactive counter: " + myObject.React;
    divNative.innerText = "Native counter: " + myObject.Native;

    let button = document.getElementById("button");
    button.onclick = function() {
        ++myObject.reactiveCounter[0];
        ++myObject.nativeCounter;
        divReact.innerText = "Reactive counter: " + myObject.React;
        divNative.innerText = "Native counter: " + myObject.Native;
    }
</script>
```

Этот пример аналогичен предыдущему за исключением того, что свойство **reactiveCounter** теперь является массивом, и элемент с индексом **0** используется в качестве счетчика.
