**Сеттер** (Setter) — это метод, который объявляется внутри свойства и вызывается автоматически при изменении его значения. В нем можно предусмотреть дополнительные действия, которые должны быть выполнены в процессе присвоения значения свойству.

```faq_md
Фреймворк **ROCKS** значительно расширяет функциональность сеттеров по сравнению с нативными сеттерами языка JavaScript. Это позволяет писать более простой и наглядный код с использованием сеттеров.
```

Сеттер можно задать в расширенной форме объявления свойства, как функцию с предопределенным именем **set**.

Например:

```html run_edit_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id='button'>Текущее время</button>
<span id='span'></span>
<script type="module">
    class myClass extends ROCKS({
        text: "",
        currentTime: {
            set(n) {
                this.text = n.toLocaleTimeString() + '.' + n.getMilliseconds();
            }
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let button = document.getElementById("button");
    let span = document.getElementById("span");
    button.onclick = function() {
        myObject.currentTime = new Date();
        span.innerText = myObject.text;
    }
</script>
```

В данном примере у свойства **currentTime** объявлен сеттер. При каждом нажатии на кнопку этому свойству будет присваиваться новая дата. При этом вызывается сеттер, которому передается новое значение свойства. В коде сеттера из даты выделяется время с точностью до миллисекунд и присваивается другому свойству **text**, значение которого отображается на странице.

Также сеттер можно задать в упрощенной форме, указав перед именем свойства ключевое слово **set**. По синтаксису такое объявление сеттера выглядит как объявление метода, перед именем которого находится ключевое слово **set**.

Например:

```html run_edit_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id='button'>Текущее время</button>
<span id='span'></span>
<script type="module">
    class myClass extends ROCKS({
        text: "",
        set currentTime(n) {
            this.text = n.toLocaleTimeString() + '.' + n.getMilliseconds();
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let button = document.getElementById("button");
    let span = document.getElementById("span");
    button.onclick = function() {
        myObject.currentTime = new Date();
        span.innerText = myObject.text;
    }
</script>
```

Данный пример аналогичен предыдущему, за исключением того, что для объявления сеттера использовалось ключевое слово **set** перед именем свойства.

```info_md
В отличие от нативного сеттера языка JavaScript, сеттер, создаваемый функцией **ROCKS**, хранит присвоенное ему значение. Это значение можно из сеттера считать, обратившись к нему как к обычному свойству.
```

Например:

```html run_edit_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id='button'>Текущее время</button>
<span id='span'></span>
<script type="module">
    class myClass extends ROCKS({
        text: "",
        set currentTime(n) {
            this.text = n.toLocaleTimeString() + '.' + n.getMilliseconds();
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let button = document.getElementById("button");
    let span = document.getElementById("span");
    button.onclick = function() {
        myObject.currentTime = new Date();
        span.innerText = myObject.currentTime.toLocaleTimeString() + '.' + myObject.currentTime.getMilliseconds();
    }
</script>
```

Данный пример аналогичен предыдущему, за исключением того, что для получения значений секунд и миллисекунд происходит чтение из самого сеттера, а не из свойства **text**. Фактически сеттер ведет себя как обычное свойство, которое хранит последнее присвоенное ему значение.

```info_md
Способность сеттера хранить присвоенное значение позволила добавить в него еще одну функциональную возможность, отсутствующую в нативном сеттере языка JavaScript. В сеттер, созданный функцией **ROCKS**, при записи передается помимо нового, его предыдущее значение. Для доступа к нему необходимо объявить сеттер с двумя параметрами. Через первый параметр передается новое значение, через второй — предыдущее.
```

Например:

```html run_edit_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id='button'>Нажми меня</button>
<script type="module">
    class myClass extends ROCKS({
        text: "",
        currentTime: {
            $def: Date.now(),
            set(newValue, oldValue) {
                this.text = "Время между нажатиями (мс): " + (newValue - oldValue);
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
        myObject.currentTime = Date.now();
        button.innerText = myObject.text;
    }
</script>
```

В данном примере использовано расширенная форма объявления свойства **currentTime** с сеттером. В объявлении сеттера добавлен второй параметр **oldValue**. Через него в сеттер передается значение, присвоенное свойству предыдущей операцией присваивания. В этом примере, благодаря доступу к предыдущему значению, организация вычисления задержек между нажатиями кнопки сводится к одной операции вычитания.

В нативном языке JavaScript для организации хранения предыдущего значения сеттера программисту потребуется написать дополнительные строки кода:

1. объявить в объекте дополнительное свойство, в котором будет храниться предыдущее значение, переданное сеттеру;

1. добавить в конце кода сеттера команду присваивания этому дополнительному свойству значения из аргумента сеттера. Если код сеттера имеет ветвления, то может потребоваться несколько команд присваивания в разных ветвях.

Кроме того, дополнительные строки кода снижают читабельность текста программы, усложняют сопровождение и служат источником потенциальных ошибок.

```warning_md
Обратите внимание! Объявить метод сеттера с двумя параметрами можно только в расширенной форме объявления свойства. При использовании упрощенной формы (когда перед именем метода ставится ключевое слово **set**) возникает исключение, которое выводит в консоль браузера соответствующее сообщение.
```

Например, если переписать объявление сеттера из предыдущего примера в упрощенной форме:

```javascript_hideGutter_error_
    class myClass extends ROCKS({
        text: "",
        set currentTime(newValue, oldValue) {
            this.text = "Время между нажатиями (мс): " + (newValue - oldValue);
        }
    }) {
        constructor() {
            super(); 
        }
    }
```

то при загрузке примера интерпретатор языка JavaScript выведет в консоль браузера сообщение:

![Консоль браузера](learn/_help/ru/_images/rocks-framework-setters-1.png "Консоль браузера")

```info_md
Если у свойства с сеттером задан статический тип с помощью модификатора **$type** или **$def**, то присваиваемые свойству значения будут преобразованы к указанному типу перед передачей в функцию, реализующую сеттер.
```

Например:

```html run_edit_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id='button'>Текущее время</button>
<span id='span'></span>
<script type="module">
    class myClass extends ROCKS({
        text: "",
        currentTime: {
            $type: String,
            set(newValue) {
                this.text = "Тип: " + typeof newValue + " — " + /[0-2][0-9]:[0-5][0-9]:[0-5][0-9]/.exec(newValue)[0];
            }
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let button = document.getElementById("button");
    let span = document.getElementById("span");
    button.onclick = function() {
        myObject.currentTime = new Date();
        span.innerText = myObject.text;
    }
</script>
```

В данном примере при каждом нажатии на кнопку на экран выводится текущее время. В примере объявлено свойство **currentTime** с сеттером. С помощью модификатора **$type** у свойства установлен тип **String**. При каждом нажатии на кнопку создается объект **Date** и присваивается этому свойству. Однако, как видно по результатам выполнения программы, в сеттер через параметр **newValue** передается значение типа строка. Это приводит к тому, что для выделения текущего времени из даты приходится использовать операции работы со строками.

```error_md
В сеттере нельзя присваивать значение свойству, в котором этот сеттер был объявлен. Это приведет к возникновению бесконечной рекурсии, когда сеттер будет вызывать самого себя до бесконечности.
```

Например:

```html run_edit_error_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id='button'></button>
<script type="module">
    class myClass extends ROCKS({
        text: "Счетчик: 0",
        counter: {
            $def: 0,
            set( n ) {
                this.counter++;
                this.text = "Счетчик: " + n;
            }
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let button = document.getElementById("button");
    button.innerText = myObject.text;
    button.onclick = function() {
        myObject.counter++;
        button.innerText = myObject.text;
    }
</script>
```

В данном примере код сеттера свойства **counter** изменяет значение самого свойства. Поэтому при нажатии на кнопку сеттер будет вызывать сам себя. Образуется бесконечный цикл, который приводит к переполнению стека. В результате браузер прерывает выполнение программы и генерирует исключение, которое выводит в консоль сообщение: 

![Консоль браузера](learn/_help/ru/_images/rocks-framework-setters-2.png "Консоль браузера")

Аналогичным образом необходимо избегать взаимного изменения двух свойств внутри их сеттеров, так как это также приводит к возникновению бесконечной рекурсии.

Например:

```html run_edit_error_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id='button'></button>
<script type="module">
    class myClass extends ROCKS({
        text: {
            $def: "Счетчик: 0",
            set( n ) {
                this.counter++;
            }
        },
        counter: {
            $def: 0,
            set( n ) {
                this.text = "Счетчик: " + n;
            }
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let button = document.getElementById("button");
    button.innerText = myObject.text;
    button.onclick = function() {
        myObject.counter++;
        button.innerText = myObject.text;
    }
</script>
```

В данном примере объявлены два свойства с сеттерами. Причем сеттер **text** изменяет свойство **counter**, сеттер которого в свою очередь изменяет свойство **text**. Взаимное изменение свойств создает бесконечный цикл, который приводит к переполнению стека со всеми вытекающими последствиями. В этом можно убедиться, нажав на кнопку.

