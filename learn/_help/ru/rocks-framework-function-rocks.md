Фреймворк **ROCKS** является неотъемлемой частью фреймворка **ODA**. Он реализует реактивную парадигму разработки web-компонентов, смарт-кеширование их свойств на основе автоматического расчета взаимосвязей между ними в моделях данных любой сложности, а также позволяет использовать технологию внутреннего мониторинга состояния web-компонентов с целью автоматического исключения ошибок в коде программы при их наличии. Фреймворк позволяет декорировать свойства компонентов, управлять автоматическим сохранением их состояния, управлять приведением типов и следить за изменением сложных моделей данных. Он может применяться для оптимизации работы с любым видом данных как в клиентских, так и в серверных web-решениях. Значительно сокращает количество кода необходимое для реализации бизнес-логики любого web-приложения.

Также фреймворк **ROCKS** можно использовать автономно для добавления расширенной функциональности в классы языка JavaScript. Для этого необходимо подключить модуль «**rocks.js**» одним из следующих способов:

1. Скачать [ZIP](https://github.com/odajs/oda/archive/refs/heads/main.zip)-архив и подключить модуль с помощью директивы «**import**» 

2. Использовать CDN:

```html _hideGutter_
<script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script>
```

```html _hideGutter_
<script type="module" src="https://unpkg.com/browse/oda-framework@latest/rocks.js"></script>
```

3. Установить через NPM:

```html _hideGutter_
npm i oda-framework
```

4. Установить с помощью YARN:

```html _hideGutter_
yarn add oda-framework
```

Дополнительные возможности добавляются в JavaScript-класс с помощью функции **ROCKS** фреймворка. Аргументом функции является шаблон, на основе которого создается прототип класса с требуемой функциональностью. Чтобы перенеси эту функциональность в JavaScript-класс его необходимо унаследовать от созданного функцией **ROCKS** прототипа. В общем случае синтаксис объявления класса имеет вид:

```javascript_md
**class** *имяКласса* **extends ROCKS({**
    *шаблон прототипа класса с расширенной функциональностью*
**}) {**
    **constructor(** *[список параметров]* **) {**
        **super();**
        *[код инициализации класса]*
    **}**
    *[объявление нативных свойств и методов класса]*
**}**
```

Из синтаксиса видно, что объявление класса содержит две секции. Первая секция является аргументом для функции **ROCKS**, в ней объявляются свойства класса, обладающие расширенными возможностями. Вторая секция является стандартным объявлением класса в соответствии с нативной нотацией языка JavaScript. Вторая секция обязательно должна содержать конструктор, вызывающий конструктор родительского класса **super()**. В конструкторе можно обращаться к свойствам и методам, объявленным в шаблоне прототипа используя указатель **this**.

Например,

```html run_edit_h=55_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='Rocks'></div>
<div id='Native'></div>
<script type="module">
    class myClass extends ROCKS({
        rocks: "Это свойство создано функцией ROCKS"
    }) {
        native = "Это нативное свойство";
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let divRocks = document.getElementById("Rocks");
    let divNative = document.getElementById("Native");
    divRocks.innerText = myObject.rocks;
    divNative.innerText = myObject.native;
</script>
```

Данный пример показывает, что свойства, созданные функцией **ROCKS**, доступны в классе через точечную нотацию так же как и нативные свойства.

В процессе выполнения кода к объекту могут динамически добавляться новые свойства, однако расширенной функциональностью они обладать не будут.

Например,

```html run_edit_h=70_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='Rocks'></div>
<div id='Native'></div>
<div id='Native2'></div>
<script type="module">
    class myClass extends ROCKS({
        rocks: "Это свойство создано функцией ROCKS"
    }) {
        native = "Это нативное свойство";
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let divRocks = document.getElementById("Rocks");
    let divNative = document.getElementById("Native");
    let divNative2 = document.getElementById("Native2");
    myObject.newProperty = "Это тоже нативное свойство";
    divRocks.innerText = myObject.rocks;
    divNative.innerText = myObject.native;
    divNative2.innerText = myObject.newProperty;
</script>
```

Если в функции **ROCKS** и в нативной части класса объявлены свойства с одинаковыми именами, то нативное свойство перекроет свойство из функции **ROCKS**. Соответственно это свойство расширенной функциональностью обладать не будет.

Например,

```html run_edit_h=35_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='Rocks'></div>
<script type="module">
    class myClass extends ROCKS({
        rocks: "Это свойство создано функцией ROCKS"
    }) {
        rocks = "Это нативное свойство";
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let divRocks = document.getElementById("Rocks");
    divRocks.innerText = myObject.rocks;
</script>
```

Если функция **ROCKS** не может создать прототип класса из переданного ей шаблона, то она создает объект ошибки с типом **Error**, генерирует исключение и прекращает работу. В свойстве **message** объекта ошибки содержится описание проблемы, приведшей к прекращению работы функции.

Например,

```html run_edit_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id='button'>Создать класс</button>
<script type="module">
    let button = document.getElementById("button");
    button.onclick = function() {
        let myClass = class extends ROCKS({
            counter: {
                $def: 0,
                $def1: 1
            }
        }) {
            constructor() {
                super();
            }
        }
    }
</script>
```

В данном примере при нажатии на кнопку создается класс с расширенной функциональностью. Однако шаблон класса, переданный функции **ROCKS**, содержит ошибку в объявлении свойства **counter**. Во фреймворке не существует атрибута **$def1**, используемого в объявлении. В результате возникает исключение, которое выводит в консоль браузера соответствующее сообщение с описанием ошибки.

![Консоль браузера](learn/_help/ru/_images/rocks-framework-function-rocks-1.png "Консоль браузера")

Это исключение можно перехватить с помощью инструкции **try…catch**.

Например,

```html run_edit_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id='button'>Создать класс</button>
<span id='span'></span>
<script type="module">
    let button = document.getElementById("button");
    let span = document.getElementById("span");
    button.onclick = function() {
        try {
            let myClass = class extends ROCKS({
                counter: {
                    $def: 0,
                    $def1: 1
                }
            }) {
                constructor() {
                    super();
                }
            }
        } catch(e) {
            span.innerText = `Ошибка: ${e.name} -- Описание: ${e.message}`;
        }
    }
</script>
```

Данный пример аналогичен предыдущему, только объявление класса помещено в инструкцию **try…catch**, которая перехватывает исключение и выводит на экран сообщение «Ошибка: Error -- Описание: Unknown attribute "$def1" in description for property "counter"».

В отличие от нативного языка JavaScript, в объект, объявленный в функции **ROCKS**, нельзя в процессе выполнения кода динамически добавить новое свойство со значением **undefined**.

Например,

```html run_edit_h=55_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='Rocks'></div>
<div id='Native'></div>
<script type="module">
    class myClass extends ROCKS({
        rocks: {}
    }) {
        native = {};
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let divRocks = document.getElementById("Rocks");
    let divNative = document.getElementById("Native");
    myObject.rocks.newProperty = undefined;
    myObject.native.newProperty = undefined;
    divRocks.innerText = "ROCKS — Свойство существует? " + ('newProperty' in myObject.rocks);
    divNative.innerText = "NATIVE — Свойство существует? " + ('newProperty' in myObject.native);
</script>
```

В данном примере в функции **ROCKS** объявлен пустой объект **rocks**. В процессе выполнения кода в него добавляется свойство **newProperty** со значением **undefined**. По результату выполнения примера можно видеть, что свойство добавлено не было. Для сравнения в нативной части был объявлен объект **native**. В него добавление свойства со значением **undefined** прошло успешно.

Если вам всё-таки необходимо динамически добавлять в объекты свойства со значением **undefined**, используйте метод **Object.defineProperty**. 

Аналогичная ситуация с массивами. В массив, объявленный в функции **ROCKS**, нельзя в процессе выполнения кода динамически добавить ранее не существовавший элемент со значением **undefined**.

Например,

```html run_edit_h=55_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='Rocks'></div>
<div id='Native'></div>
<script type="module">
    class myClass extends ROCKS({
        rocks: []
    }) {
        native = [];
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let divRocks = document.getElementById("Rocks");
    let divNative = document.getElementById("Native");
    myObject.rocks[0] = undefined;
    myObject.native[0] = undefined;
    divRocks.innerText = "ROCKS — Индекс 0 существует? " + (0 in myObject.rocks);
    divNative.innerText = "NATIVE — Индекс 0 существует? " + (0 in myObject.native);
</script>
```

В данном примере в функции **ROCKS** объявлен пустой массив **rocks**. В процессе выполнения кода в него добавляется элемент с индексом **0** со значением **undefined**. По результату выполнения примера можно видеть, что элемент добавлен не был. Для сравнения в нативной части был объявлен массив **native**. В него добавление элемента со значением **undefined** прошло успешно.

```warning_md
Будьте внимательны при инициализации массива, объявленного в функции **ROCKS**. Результаты инициализации одними и теме же значениями при объявлении массива и в процессе выполнения кода могут различаться, если инициализирующий массив содержит пропущенные элементы.
```

Например,

```html run_edit_h=55_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='Rocks1'></div>
<div id='Rocks2'></div>
<script type="module">
    class myClass extends ROCKS({
        rocks: [,2,3]
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let divRocks1 = document.getElementById("Rocks1");
    let divRocks2 = document.getElementById("Rocks2");
    divRocks1.innerText = "Индекс 0 существует? — " + (0 in myObject.rocks);
    myObject.rocks = [,2,3];
    divRocks2.innerText = "Индекс 0 существует? — " + (0 in myObject.rocks);
</script>
```

В данном примере массив **rocks** дважды инициализируется массивом **[,2,3]**, в котором опущен элемент с индексом **0**. Первый раз массив инициализируется при объявлении в функции **ROCKS**. Можно видеть, что элемент с индексом **0** был создан в массиве. Затем массив инициализируется в процессе выполнения кода операцией присваивания. И можно видеть, что на это раз в нем отсутствует элемент с индексом **0**.

Если подставить на место пропущенного элемента значение **undefined**, то инициализация в обоих случаях приведет к одинаковому результату, в массиве будет создан элемент с соответствующим индексом.

Например,

```html run_edit_h=55_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='Rocks1'></div>
<div id='Rocks2'></div>
<script type="module">
    class myClass extends ROCKS({
        rocks: [undefined,2,3]
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let divRocks1 = document.getElementById("Rocks1");
    let divRocks2 = document.getElementById("Rocks2");
    divRocks1.innerText = "Индекс 0 существует? — " + (0 in myObject.rocks);
    myObject.rocks = [undefined,2,3];
    divRocks2.innerText = "Индекс 0 существует? — " + (0 in myObject.rocks);
</script>
```

Интересно себя ведет метод **push** при добавлении в массив, объявленный в функции **ROCKS**, значения **undefined**. Длина массива увеличивается, но новый элемент не создается.

Например,

```html run_edit_h=55_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='Rocks1'></div>
<div id='Rocks2'></div>
<script type="module">
    class myClass extends ROCKS({
        rocks: []
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let divRocks1 = document.getElementById("Rocks1");
    let divRocks2 = document.getElementById("Rocks2");
    divRocks1.innerText = "Индекс 0 существует? " + (0 in myObject.rocks) + " — Количество элементов: " + myObject.rocks.length;
    myObject.rocks.push( undefined );
    divRocks2.innerText = "Индекс 0 существует? " + (0 in myObject.rocks) + " — Количество элементов: " + myObject.rocks.length;
</script>
```

В данном примере в функции **ROCKS** объявлен пустой массив **rocks**. До и после выполнения метода **push** с аргументом **undefined** массив проверяется на наличие элемента с индексом **0** и на количество элементов. Можно видеть, что метод **push** увеличил длину массива, хотя никаких элементов в нем не создал.

