По умолчанию свойства, создаваемые функцией **ROCKS**, являются неперечисляемыми. Модификатор **$pdp** во фреймворке ROCKS делает свойство перечисляемым. Во фреймворке ODA он делает свойство компонента-владельца доступным во вложенных компонентах без использования специальных конструкций двойного биндинга.

Если фреймворк **ROCKS** используется отдельно от фреймворка ODA, то функционирование модификатора **$pdp** полностью аналогично функционированию модификатора **$public**, с которым можно ознакомиться в статье «$public: Модификатор доступности свойства».

При совместном использовании модификаторов **$pdp** и **$public** свойство становится перечисляемым, если хотя бы один из них имеет значение **true**.

Например,

```html run_edit_h=35_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='div'></div>
<script type="module">
    class myClass extends ROCKS({
        counter: {
            $def: 0,
            $public: false,
            $pdp: true
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

В этом примере свойство **counter** объявлено с модификаторами **$public: false** и **$pdp: true**. Поскольку один из них имеет значение **true**, то дескриптор **enumerable** тоже имеет значение **true**, что делает свойство перечисляемым.

