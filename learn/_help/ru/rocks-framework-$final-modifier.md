При использовании фреймворка **ROCKS** в составе фреймворка **ODA**, модификатор **$final** со значением **true** запрещает переопределять свойства базовых компонентов в наследных компонентах. Для этого функция **ROCKS** устанавливает у свойств с модификатором **$final** дескриптор **configurable** в значение **false**.

Например,

```html run_edit_h=35_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='div'></div>
<script type="module">
    class myClass extends ROCKS({
        counter: {
            $def: 0,
            $final: true
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let div = document.getElementById("div");
    let descr = Object.getOwnPropertyDescriptor(myObject.__proto__.__proto__, "counter");
    div.innerText = "Значение дескриптора configurable: " + descr.configurable;
</script>
```

В этом примере свойство **counter** объявлено с модификатором **$final**. С помощью метода **Object.getOwnPropertyDescriptor** были получены его дескрипторы. Можно видеть, что дескриптор **configurable** имеет значение **false**, что защищает свойство **counter** от переопределения.

Модификатор **$final** может использоваться в качестве группирующего модификатора, поэтому с его помощь можно объявить группу защищаемых свойств. Это упрощает синтаксис, т.к. не надо указывать модификатор отдельно у каждого свойства.

Например,

```html run_edit_h=35_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='div'></div>
<script type="module">
    class myClass extends ROCKS({
        $final: {
            counter: 0
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let div = document.getElementById("div");
    let descr = Object.getOwnPropertyDescriptor(myObject.__proto__.__proto__, "counter");
    div.innerText = "Значение дескриптора configurable: " + descr.configurable;
</script>
```

Этот пример аналогичен предыдущему, за исключением того, что модификатор **$final** убран из объявления свойства **counter** и использован для него как группирующий. Такой подход также позволил указать начальное значение непосредственно в свойстве и убрать из его описания модификатор **$def**, что сократило объем кода и сделало его более наглядным.

Если модификатор **$final** указать у отдельных свойств объекта, то функции **ROCKS** его проигнорирует.

Например,

```html run_edit_h=35_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='div'></div>
<script type="module">
    class myClass extends ROCKS({
        test: {
            counter: {
                $def: 0,
                $final: true
            }
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let div = document.getElementById("div");
    let descr = Object.getOwnPropertyDescriptor(myObject.__proto__.__proto__.test, "counter");
    div.innerText = "Значение дескриптора configurable: " + descr.configurable;
</script>
```

В данном примере свойство **counter** объекта **test** объявлено с модификатором **$final**, имеющим значение **true**, однако можно видеть, что оно не защищено от переопределения.

Геттеры и сеттеры также можно защитить от переопределения с помощью модификатора **$final**.

Например,

```html run_edit_h=55_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='div1'></div>
<div id='div2'></div>
<script type="module">
    class myClass extends ROCKS({
        _counter: 0,
        $final: {
            get getCounter() {
                return this._counter;
            },
            set setCounter(val) {
                this._counter = val;
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
    let descr = Object.getOwnPropertyDescriptor(myObject.__proto__.__proto__, "getCounter");
    div1.innerText = "Значение дескриптора configurable геттера: " + descr.configurable;
    descr = Object.getOwnPropertyDescriptor(myObject.__proto__.__proto__, "setCounter");
    div2.innerText = "Значение дескриптора configurable сеттера: " + descr.configurable;
</script>
```

В данном примере объявлены геттер **getCounter** и сеттер **setCounter** с модификатом **$final**. Можно видеть, что оба имеют дескриптор **configurable** со значением **false**, что делает их защищенными.

Аналогично методы также можно защитить от переопределения с помощью модификатора **$final**.

Например,

```html run_edit_h=35_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='div'></div>
<script type="module">
    class myClass extends ROCKS({
        $final: {
            counter() {
                return 0;
            }
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let div = document.getElementById("div");
    let descr = Object.getOwnPropertyDescriptor(myObject.__proto__.__proto__, "counter");
    div.innerText = "Значение дескриптора configurable: " + descr.configurable;
</script>
```

В данном примере объявлен метод **counter** с модификатором **$final**. Можно видеть, что он имеет дескриптор **configurable** со значением **false**, что делает его защищенным.

Чтобы упростить синтаксис объявления защищенного метода, во фремворке **ROCKS** принято синтаксическое правило, что метод, имя которого начинается с двух символов подчеркивания «**&lowbar;&lowbar;**», становится защищенным от переопределения.

Например,

```html run_edit_h=35_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='div'></div>
<script type="module">
    class myClass extends ROCKS({
        __counter() {
            return 0;
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let div = document.getElementById("div");
    let descr = Object.getOwnPropertyDescriptor(myObject.__proto__.__proto__, "__counter");
    div.innerText = "Значение дескриптора configurable: " + descr.configurable;
</script>
```

Данный пример аналогичен предыдущему, за исключением того, что отсутствует модификатором **$final**, а имя метода начинается с двух символов подчеркивания. В результате дескриптор **configurable** все равно принял значение **false**, что делает метод защищенным.

```warning_md
Если использовать два символа подчеркивания вначале имен обычных свойств, геттеров и сеттеров, то это не сделает их защищенными от переопределений. Для них обязательно использование модификатора **$final**.
```

Например,

```html run_edit_h=75_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='div1'></div>
<div id='div2'></div>
<div id='div3'></div>
<script type="module">
    class myClass extends ROCKS({
        __counter: 0,
        get __getCounter() {
            return this.__counter;
        },
        set __setCounter(val) {
            this.__counter = val;
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let div1 = document.getElementById("div1");
    let div2 = document.getElementById("div2");
    let div3 = document.getElementById("div3");
    let descr = Object.getOwnPropertyDescriptor(myObject.__proto__.__proto__, "__counter");
    div1.innerText = "Значение дескриптора configurable свойства: " + descr.configurable;
    descr = Object.getOwnPropertyDescriptor(myObject.__proto__.__proto__, "__getCounter");
    div2.innerText = "Значение дескриптора configurable геттера: " + descr.configurable;
    descr = Object.getOwnPropertyDescriptor(myObject.__proto__.__proto__, "__setCounter");
    div3.innerText = "Значение дескриптора configurable сеттера: " + descr.configurable;
</script>
```

В данном примере объявлены свойство **&lowbar;&lowbar;counter**, геттер **&lowbar;&lowbar;getCounter** и сеттер **&lowbar;&lowbar;setCounter**. Несмотря на то, что их имена начинаются с двух символов подчеркивания, можно видеть, что они имеют дескриптор **configurable** со значением **true**, т.е. не защищены от переопределения.

