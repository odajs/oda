**Метод** – это функция, объявленная внутри класса и предназначенная для выполнения определенных действий.

Методы задаются внутри класса также, как и обычные функции языка JavaScript.

Например,

```html run_edit_h=35_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id="div"></div>
<script type="module">
    class myClass extends ROCKS({
        myMethod() {
            return "Привет! Я метод!";
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let div = document.getElementById("div");
    div.innerText = myObject.myMethod();
</script>
```

Также как и в языке JavaScript, метод можно объявить как свойство класса, указывающее на функцию.

Например,

```html run_edit_h=35_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id="div"></div>
<script type="module">
    class myClass extends ROCKS({
        myMethod: function() {
            return "Привет! Я метод!";
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let div = document.getElementById("div");
    div.innerText = myObject.myMethod();
</script>
```

```warning_md
Будьте внимательны при использовании модификатора **$def**. Он не позволяет объявить метод. Вместо ссылки на функцию он инициализирует свойство результатом выполнения этой функции.
```

Например,

```html run_edit_error_h=55_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id="div1"></div>
<div id="div2"></div>
<script type="module">
    class myClass extends ROCKS({
        myMethod: {
            $def: function() {
                return "Ой! Я просто свойство.";
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
    try {
        div1.innerText = myObject.myMethod();
    } catch(e) {
        div1.innerText = `${e.name}: ${e.message}`;
        div2.innerText = myObject.myMethod;
    }
</script>
```

В данном примере объявлено свойство **myMethod**, которое мы пытаемся инициализировать указателем на функцию с помощью модификатора **$def**. Для проверки работы вызов метода помещен в инструкцию **try…catch**, которая перехватывает исключение и выводит на экран сообщение, что свойство **myMethod** не является функцией. Также выводится реальное значение, которое модификатор **$def** присвоил свойству. Как видим свойство инициализировано строкой «Ой! Я просто свойство.», которая является результатом выполнения функция.

Но модификатор **$def** можно «обмануть». Для этого указанная после него функция должна возвращать указатель на другую функцию.

Например,

```html run_edit_h=35_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id="div"></div>
<script type="module">
    class myClass extends ROCKS({
        myMethod: {
            $def: function() {
                return function() {
                    return "Ура! Я снова метод.";
                }
            }
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let div = document.getElementById("div");
    div.innerText = myObject.myMethod();
</script>
```

С точки зрения языка JavaScript метод является свойством с типом Function, и этому свойству можно присвоить указатель на другую функцию. Однако фреймворк запрещает запись в такие свойства, чтобы защитить метод от случайного изменения.

Например,

```html run_edit_h=35_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id="div"></div>
<script type="module">
    class myClass extends ROCKS({
        myMethod() {
            return "Привет! Я метод!";
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let div = document.getElementById("div");
    try {
        myObject.myMethod = function() { return "Метод успешно заменен" };
        div.innerText = myObject.myMethod();
    } catch(e) {
        div.innerText = `${e.name}: ${e.message}`;
    }
</script>
```

В данном примере объявлен метод **myMethod**. Затем в инструкции **try…catch** указателю на метод пытаемся присвоить указатель на другую функцию. В результате возникает исключение, и на экран выводится сообщение о невозможности выполнить присваивание свойству **myMethod** доступному только по чтению.

Аналогичным образом фреймворк защищается от изменения методы, созданные с помощью ключевого слова *function*.

Например,

```html run_edit_h=35_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id="div"></div>
<script type="module">
    class myClass extends ROCKS({
        myMethod: function () {
            return "Привет! Я метод!";
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let div = document.getElementById("div");
    try {
        myObject.myMethod = function() { return "Метод успешно заменен" };
        div.innerText = myObject.myMethod();
    } catch(e) {
        div.innerText = `${e.name}: ${e.message}`;
    }
</script>
```

Однако методы, созданные с использованием модификатора **$def**, фреймворк от изменения не защищает.

Например,

```html run_edit_h=35_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id="div"></div>
<script type="module">
    class myClass extends ROCKS({
        myMethod: {
            $def: function() {
                return function() {
                    return "Привет! Я метод!";
                }
            }
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let div = document.getElementById("div");
    myObject.myMethod = function() { return "Метод успешно заменен" };
    div.innerText = myObject.myMethod();
</script>
```

Как видно на экране, указатель на новую функцию был успешно присвоен свойству **myMethod**, потому что метод был объявлен с использованием модификатора **$def**.

Методы, созданные с использованием простого синтаксиса или ключевого слова *function*, являются перечисляемыми по умолчанию.

Например,

```html run_edit_h=35_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='div'></div>
<script type="module">
    class myClass extends ROCKS({
        myMethod() {
            return "Привет! Я метод!";
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let div = document.getElementById("div");
    let descr = Object.getOwnPropertyDescriptor(myObject.__proto__.__proto__, "myMethod");
    div.innerText = "Значение дескриптора enumerable: " + descr.enumerable;
</script>
```

В данном примере объявлен метод **myMethod**. Можно видеть, что его дескриптор **enumerable** имеет значение **true**, что делает метод перечисляемым.

Чтобы сделать метод неперечисляемым, во фремворке **ROCKS** принято синтаксическое правило, что метод, имя которого начинается с символа подчеркивания «_», становится неперечисляемым по умолчанию.

Например,

```html run_edit_h=35_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='div'></div>
<script type="module">
    class myClass extends ROCKS({
        _myMethod() {
            return "Привет! Я метод!";
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let div = document.getElementById("div");
    let descr = Object.getOwnPropertyDescriptor(myObject.__proto__.__proto__, "_myMethod");
    div.innerText = "Значение дескриптора enumerable: " + descr.enumerable;
</script>
```

Данный пример аналогичен предыдущему, за исключением того, что имя метода начинается с символа подчеркивания. В результате дескриптор **enumerable** принял значение **false**, что делает метод неперечисляемым.

Обратите внимание, что методы, созданные с использованием модификатора **$def**, являются неперечисляемыми по умолчанию.

Например,

```html run_edit_h=35_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='div'></div>
<script type="module">
    class myClass extends ROCKS({
        myMethod: {
            $def: function() {
                return function() {
                    return "Привет! Я метод!";
                }
            }
        }    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let div = document.getElementById("div");
    let descr = Object.getOwnPropertyDescriptor(myObject.__proto__.__proto__, "myMethod");
    div.innerText = "Значение дескриптора enumerable: " + descr.enumerable;
</script>
```

В этом случае, чтобы метод стал перечисляемым, его необходимо объявить с модификатором **$public**, имеющим значение **true**.

