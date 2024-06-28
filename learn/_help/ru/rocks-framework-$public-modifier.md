По умолчанию свойства, создаваемые функцией **ROCKS**, являются неперечисляемыми. При использовании фреймворка **ROCKS** в составе фреймворка **ODA**, такой подход позволяет ограничить внешний доступ к свойствам компонента.

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
    div.innerText = "Значение дескриптора enumerable: " + descr.enumerable;
</script>
```

В данном примере с помощью метода **Object.getOwnPropertyDescriptor** были получены дескрипторы свойства **counter**. Можно видеть, что дескриптор **enumerable** имеет значение **false**, что делает свойство **counter** неперечисляемым.

Чтобы свойство стало перечисляемым, его необходимо объявить с модификатором **$public**, имеющим значение **true**.

Например,

```html run_edit_h=35_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='div'></div>
<script type="module">
    class myClass extends ROCKS({
        counter: {
            $def: 0,
            $public: true
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let div = document.getElementById("div");
    let descr = Object.getOwnPropertyDescriptor(myObject.__proto__.__proto__, "counter");
    div.innerText = "Значение дескриптора enumerable: " + descr.enumerable;
</script>
```

В этом примере свойство **counter** объявлено с модификатором **$public**. В результате дескриптор **enumerable** имеет значение **true**, что делает свойство перечисляемым.

Модификатор **$public** может использоваться в качестве группирующего модификатора, поэтому с его помощь можно объявить группу перечисляемых свойств. Это упрощает синтаксис, т.к. не надо указывать модификатор отдельно у каждого свойства.

Например,

```html run_edit_h=35_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='div'></div>
<script type="module">
    class myClass extends ROCKS({
        $public: {
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
    div.innerText = "Значение дескриптора enumerable: " + descr.enumerable;
</script>
```

Этот пример аналогичен предыдущему, за исключением того, что модификатор **$public** убран из объявления свойства **counter** и использован для него как группирующий. Такой подход также позволил указать начальное значение непосредственно в свойстве и убрать из его описания модификатор **$def**, что сократило объем кода и сделало его более наглядным.

Свойства объектов, объявленных в функции **ROCKS**, по умолчанию являются перечисляемыми.

Например,

```html run_edit_h=55_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='div1'></div>
<div id='div2'></div>
<script type="module">
    class myClass extends ROCKS({
        test: {
            counter: 0
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let div1 = document.getElementById("div1");
    let div2 = document.getElementById("div2");
    let descr = Object.getOwnPropertyDescriptor(myObject.__proto__.__proto__, "test");
    div1.innerText = "Значение дескриптора enumerable у объекта: " + descr.enumerable;
    descr = Object.getOwnPropertyDescriptor(myObject.test, "counter");
    div2.innerText = "Значение дескриптора enumerable у свойства: " + descr.enumerable;
</script>
```

В данном примере на экран выводятся дескрипторы объекта **test** и его свойства **counter**. Можно видеть, что по умолчанию объекты являются неперечисляемыми, а его свойства перечисляемыми.







Однако, если у свойства объекта указать модификатор **$public** со значением **false**, то свойство тоже станет неперечисляемым.

Например,

```html run_edit_h=55_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='div1'></div>
<div id='div2'></div>
<script type="module">
    class myClass extends ROCKS({
        test: {
            $def: {
                counter: {
                    $def: 0,
                    $public: false
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
    let descr = Object.getOwnPropertyDescriptor(myObject.__proto__.__proto__, "test");
    div1.innerText = "Значение дескриптора enumerable у объекта: " + descr.enumerable;
    descr = Object.getOwnPropertyDescriptor(myObject.test.__proto__.__proto__, "counter");
    div2.innerText = "Значение дескриптора enumerable у свойства: " + descr.enumerable;
</script>
```

Этот пример аналогичен предыдущему, за исключением того, что свойство **counter** объекта **test** объявлено с модификатором **$public** со значением **false**. Видно, что оно стало неперечисляемым.

Геттеры и сеттеры, объявленные в функции **ROCKS**, являются неперечисляемыми по умолчанию.

Например,

```html run_edit_h=55_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='div1'></div>
<div id='div2'></div>
<script type="module">
    class myClass extends ROCKS({
        _counter: 0,
        get getCounter() {
            return this._counter;
        },
        set setCounter(val) {
            this._counter = val;
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
    div1.innerText = "Значение дескриптора enumerable геттера: " + descr.enumerable;
    descr = Object.getOwnPropertyDescriptor(myObject.__proto__.__proto__, "setCounter");
    div2.innerText = "Значение дескриптора enumerable сеттера: " + descr.enumerable;
</script>
```

В данном примере объявлены геттер **getCounter** и сеттер **setCounter**. Можно видеть, что оба имеют дескриптор **enumerable** со значением **false**, что делает их неперечисляемыми.

Но их можно сделать перечисляемыми с помощью модификатора **$public**.

Например,

```html run_edit_h=55_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='div1'></div>
<div id='div2'></div>
<script type="module">
    class myClass extends ROCKS({
        _counter: 0,
        $public: {
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
    div1.innerText = "Значение дескриптора enumerable геттера: " + descr.enumerable;
    descr = Object.getOwnPropertyDescriptor(myObject.__proto__.__proto__, "setCounter");
    div2.innerText = "Значение дескриптора enumerable сеттера: " + descr.enumerable;
</script>
```

Данный пример аналогичен предыдущему, за исключением того, что геттер и сеттер объявлены внутри группирующего модификатора **$public**. В результате у обоих дескриптор **enumerable** имеет значение **true**, что делает их перечисляемыми.

В отличие от свойств, методы создаваемого функцией **ROCKS** класса являются перечисляемыми по умолчанию.

Например,

```html run_edit_h=35_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='div'></div>
<script type="module">
    class myClass extends ROCKS({
        counter() {
            return 0;
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let div = document.getElementById("div");
    let descr = Object.getOwnPropertyDescriptor(myObject.__proto__.__proto__, "counter");
    div.innerText = "Значение дескриптора enumerable: " + descr.enumerable;
</script>
```

В данном примере объявлен метод **counter**. Можно видеть, что его дескриптор **enumerable** имеет значение **true**, что делает метод перечисляемым.

Чтобы сделать метод неперечисляемым, можно объявить его с модификатором **$public**, имеющим значение **false**, но синтаксическая конструкция получится громоздкой и неудобочитаемой.

Например,

```javascript_hideGutter_error
methodName: {
    $def: function() {
              //тело метода
          },
    $public: false
}
```

Чтобы упростить синтаксис объявления неперечисляемого метода, во фремворке **ROCKS** принято синтаксическое правило, что метод, имя которого начинается с символа подчеркивания «_», становится неперечисляемым по умолчанию.

Например,

```html run_edit_h=35_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='div'></div>
<script type="module">
    class myClass extends ROCKS({
        _counter() {
            return 0;
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let div = document.getElementById("div");
    let descr = Object.getOwnPropertyDescriptor(myObject.__proto__.__proto__, "_counter");
    div.innerText = "Значение дескриптора enumerable: " + descr.enumerable;
</script>
```

Данный пример аналогичен предыдущему, за исключением того, что имя метода начинается с символа подчеркивания. В результате дескриптор **enumerable** принял значение **false**, что делает метод неперечисляемым.

Модификатор **$public** имеет приоритет над именем с символом подчеркивания. Поэтому если такой метод объявить с модификатором **$public**, то он будет перечисляемым.

Например,

```html run_edit_h=35_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='div'></div>
<script type="module">
    class myClass extends ROCKS({
        $public: {
            _counter() {
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
    let descr = Object.getOwnPropertyDescriptor(myObject.__proto__.__proto__, "_counter");
    div.innerText = "Значение дескриптора enumerable: " + descr.enumerable;
</script>
```

Данный пример аналогичен предыдущему, за исключением того, что метод объявлен внутри группирующего модификатора **$public**. Хотя имя метода начинается с символа подчеркивания, дескриптор **enumerable** имеет значение **true**, что делает метод перечисляемым. Это показывает, что модификатор **$public** имеет приоритет над символом подчеркивания в начале имени.

```faq_md
В отличие от методов, свойства являются неперечисляемыми по умолчанию, поэтому символ подчеркивания в начале имени не оказывает на дескриптор **enumerable** никакого влияния. Однако рекомендуется начинать с символа подчеркивания имена свойств, которые разработчик рассматривает как приватные, доступные только внутри кода объекта. Это сделает код объекта более легким для понимания.
```

