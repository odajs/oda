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

