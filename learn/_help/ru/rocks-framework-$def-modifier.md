Модификатор **$def** используется для указания начального значения свойства.

Например,

```html run_edit_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id="button"></button>
<script type="module">
    class myClass extends ROCKS({
        counter: {
            $def: 100
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let button = document.getElementById("button");
    button.innerText = "Счетчик: " + myObject.counter;
    button.onclick = function() {
        ++myObject.counter;
        button.innerText = "Счетчик: " + myObject.counter;
    }
</script>
```

В данном примере с помощью модификатора **$def** свойство **counter** объявляется с начальным значением **100**.

```warning_md
Если по ошибке указать несколько модификаторов **$def**, то начальное значение свойства будет определяться последним из них.
```

Например,

```html run_edit_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id="button"></button>
<script type="module">
    class myClass extends ROCKS({
        counter: {
            $def: 0,
            $def: 1,
            $def: 2
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let button = document.getElementById("button");
    button.innerText = "Счетчик: " + myObject.counter;
    button.onclick = function() {
        ++myObject.counter;
        button.innerText = "Счетчик: " + myObject.counter;
    }
</script>
```

В данном примере начальное значение счетчика будет равно **2**.
