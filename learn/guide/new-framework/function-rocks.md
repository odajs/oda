﻿Фреймворк **ROCKS** является неотъемлемой частью фреймворка **ODA**, добавляющей множество полезных функций в компоненты, например, реактивность, статическую типизацию свойств компонента, встроенную подсистему сохранения состояния и другие. Он подключается автоматически при подключении фреймворка **ODA**.

Также его можно использовать автономно для добавления расширенной функциональности в классы языка JavaScript. Для этого необходимо подключить модуль «**rocks.js**» одним из следующих способов:

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

Дополнительные возможности добавляются в JavaScript-класс с помощью функции **ROCKS** фреймворка. Аргументом функции является шаблон, на основе которого создается прототип класса с требуемой функциональностью. Чтобы перенеси эту функциональность в JavaScript-класс его необходимо унаследовать от созданного прототипа. В общем случае синтаксис создания класса имеет вид:

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

```html run_edit_h=45_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='Rocks'></div>
<div id='Native'></div>
<script type="module">
    class myClass extends ROCKS({
        rocks: 'Это свойство создано функцией ROCKS'
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

```javascript
class myClass extends ROCKS({
    rocks: 'Это свойство создано функцией ROCKS'
}) {
    native = "Это нативное свойство";
    constructor() {
        super();
    }
}

let myObject = new myClass();
myObject.newProperty = "Это тоже нативное свойство";
```
