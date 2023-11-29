Для добавления расширенной функциональности фреймворк **ROCKS** использует несколько механизмов.

Для расширения функциональности свойств элементарных типов, функция **ROCKS** добавляет к ним геттеры и сеттеры, в которых реализуется дополнительный функционал, указанный при описании свойств.

Например,

```html run_edit_h=35_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='div'></div>
<script type="module">
    class myClass extends ROCKS({
        counter: 0
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let div = document.getElementById("div");
    let descr = Object.getOwnPropertyDescriptor(myObject.__proto__.__proto__, "counter");
    div.innerText = "Дескрипторы: " + Object.getOwnPropertyNames( descr );
</script>
```

В данном примере с помощью метода **Object.getOwnPropertyDescriptor** были получены дескрипторы свойства **counter**. Можно видеть в списке дескрипторов методы **get** и **set**. Они были автоматически добавлены функцией **ROCKS** для расширения функционала свойства.

Для расширения функциональности вычисляемых свойств, таких как геттеры и сеттеры, функция **ROCKS** добавляет к ним дополнительный код, в котором реализуется дополнительный функционал.

Например,

```html run_edit_h=80_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='div1' style="position: absolute; width: 45%;"></div>
<div id='div2' style="position: absolute; left: 55%;"></div>
<script type="module">
    class myClass extends ROCKS({
        prop: 0,
        get counter() {
            return this.prop;
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let div1 = document.getElementById("div1");
    let div2 = document.getElementById("div2");
    let descr = Object.getOwnPropertyDescriptor(myObject.__proto__.__proto__, "counter");
    div1.innerText = "Объявленный геттер:\n" + descr.get.getter;
    div2.innerText = "Подставленный геттер:\n" + descr.get;
</script>
```

В данном примере для сравнения выводится код геттера **counter**, объявленного в классе, и код, который вместо него подставил фреймворк. Исходный код геттера сохраняется в объекте дескрипторов свойства **counter**. Он хранится в свойстве **getter** дескриптора **get** и вызывается в процессе выполнения подставленного кода.

Аналогичным образом происходит подмена сеттера:

Например,

```html run_edit_h=80_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='div1' style="position: absolute; width: 45%;"></div>
<div id='div2' style="position: absolute; left: 55%;"></div>
<script type="module">
    class myClass extends ROCKS({
        prop: 0,
        set counter( val ) {
            this.prop = val;
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let div1 = document.getElementById("div1");
    let div2 = document.getElementById("div2");
    let descr = Object.getOwnPropertyDescriptor(myObject.__proto__.__proto__, "counter");
    div1.innerText = "Объявленный сеттер:\n" + descr.set.setter;
    div2.innerText = "Подставленный сеттер:\n" + descr.set;
</script>
```

Аналогично предыдущему примеру, здесь для сравнения выводится код сеттера **counter**, объявленного в классе, и код, который вместо него подставил фреймворк. Исходный код сеттера сохраняется в объекте дескрипторов свойства **counter**. Он хранится в свойстве **setter** дескриптора **set** и вызывается в процессе выполнения подставленного кода.

Для добавления расширенной функциональности в объект, функция **ROCKS** автоматически оборачивает его в специальный объект **Proxy**, который перехватывает все выполняемые с его свойствами операции чтения и записи.

Например,

```html run_edit_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id='button'>Вывести объект в консоль</button>
<script type="module">
    class myClass extends ROCKS({
        test: {
            prop: 0
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

В данном примере по нажатию кнопки в консоль браузера выводится объект **test**, объявленный в функции **ROCKS**. Откройте консоль и исследуйте его. Видно, что объект **test** является **Proxy**-объектом с методами-ловушками **get** и **set**.

![Консоль браузера](learn/_help/ru/_images/rocks-framework-principle-of-operation-1.png "Консоль браузера")

Аналогичным образом функция **ROCKS** оборачивает массивы в специальный объект **Proxy**, для добавления расширенной функциональности.

Например,

```html run_edit_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id='button'>Вывести массив в консоль</button>
<script type="module">
    class myClass extends ROCKS({
        test: [0, 1, 2]
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

Данный пример аналогичен предыдущему, за исключение того, что по нажатию кнопки в консоль браузера выводится массив **test**, объявленный в функции **ROCKS**. Видно, что массив тоже является **Proxy**-объектом с методами-ловушками **get** и  **set**.

![Консоль браузера](learn/_help/ru/_images/rocks-framework-principle-of-operation-2.png "Консоль браузера")

После того как функция **ROCKS** обернула объект в **Proxy**, то все его свойства получают одинаковый базовый функционал, определяемый методами-ловушками **get** и **set**.

Если требуются индивидуальные настройки функциональности свойств объекта, то их необходимо объявлять с модификаторами свойств (см. раздел «Модификаторы свойств»). В этом случае функция **ROCKS** не оборачивает объект в **Proxy**, а добавляет к каждому свойству собственные геттеры и сеттеры, в которых реализуется дополнительный функционал, указанный при описании свойств.

Например,

```html run_edit_h=75_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='div1'></div>
<div id='div2'></div>
<button id='button'>Вывести объект в консоль</button>
<script type="module">
    class myClass extends ROCKS({
        test: {
            $def: {
                prop: {
                    $def: 0
                }
            }
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let div1 = document.getElementById("div1");
    let div2 = document.getElementById("div2");
    div1.innerText = "Прототип: " + myObject.test.constructor.name;
    let descr = Object.getOwnPropertyDescriptor(myObject.test.__proto__.__proto__, "prop");
    div2.innerText = "Дескрипторы: " + Object.getOwnPropertyNames( descr );
    button.onclick = function() {
        console.log( myObject.test );
    }
</script>
```

В данном примере в объекте **test** объявлено свойство **prop** с модификатором **$def**. Можно видеть в списке дескрипторов свойства методы **get** и **set**. Они были автоматически добавлены функцией **ROCKS** для расширения функционала свойства. Сам объект **test** создан функцией **ROCKS** на основе класса **RocksObject**. Нажмите кнопку, чтобы вывести в консоль браузера объект **test**. Откройте консоль и исследуйте его. Видно, что объект **test** не является **Proxy**-объектом.

![Консоль браузера](learn/_help/ru/_images/rocks-framework-principle-of-operation-3.png "Консоль браузера")

