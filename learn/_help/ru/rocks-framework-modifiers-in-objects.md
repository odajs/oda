В предыдущей статье описывалось применение модификаторов в объявлении неструктурных свойств, но их также можно применять к отдельным свойствам объектов.

Например,

```javascript_hideGutter
test: {
    $def: {
        greeting: {
            $def: "Hello word",
            $type: String
        },
        counter: {
            $def: 0,
            $type: Number
        }
    }
}
```

В данном примере у объекта **test** определены свойства **greeting** и **counter**. С помощью модификаторов **$def** и **$type** у них заданы начальное значение и тип.

Обратите внимание на группирующий модификатор **$def** во второй строке примера. Такая группировка свойств, имеющих модификаторы, внутри объекта необходима для их правильной интерпретации фреймворком. Группирующий модификатор **$def** является только синтаксической конструкцией фреймворка и не создает дополнительного уровня вложенности для свойств объекта, поэтому его необходимо опустить при обращении к свойствам с помощью точечной нотации. Например, обращение к свойствам из предыдущего примера должно выглядеть так:

```javascript_hideGutter
test.greeting
test.counter
```

А вариант с промежуточным звеном **$def** работать не будет:

```error_md
test.<span style="color:red;font-weight:bold">$def.</span>greeting
test.<span style="color:red;font-weight:bold">$def.</span>counter
```

Если в объекте одновременно объявлены свойства с модификаторами без них, то свойства без модификаторов также должны находиться в группе **$def**.

Например,

```javascript_hideGutter
test: {
    $def: {
        greeting: {
            $def: "Hello word",
            $type: String
        },
        counter: 0
    }
}
```

Данный пример аналогичен предыдущему, только для объявления свойства **counter** использован упрощенный синтаксис без модификаторов.

Если какое-либо свойство объявить вне группы **$def**, то фремворк выдаст в консоль сообщение об ошибке и прекратит работу.

Например, так делать нельзя,

```javascript_hideGutter_error
test: {
    counter: 0,
    $def: {
        greeting: {
            $def: "Hello word",
            $type: String
        }
    }
}
```

В этом примере объявление свойства **counter** находится на одном уровне с группирующим модификатором **$def**, поэтому фремворк будет считать лексему **"counter: 0"** объявлением модификатора, и выдаст в консоль браузера сообщение об ошибке:

<span style="color:red;">Uncaught Error: Unknown attribute "counter" in description for property "test".</span>

Если из объявления объекта убрать группирующий модификатор **$def**, то свойства с модификаторами превратятся во вложенные объекты.

Например,

```html run_edit_h=55_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id="div1"></div>
<div id="div2"></div>
<script type="module">
    class myClass extends ROCKS({
        test1: {
            $def: {
                greeting1: {
                    $def: "Hello word",
                    $type: String
                }
            }
        },
        test2: {
            greeting2: {
                $def: "Hello word",
                $type: String
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
    div1.innerText = "Тип свойства greeting1: " + typeof myObject.test1.greeting1 + " -- Значение: " + myObject.test1.greeting1;
    div2.innerText = "Тип свойства greeting2: " + typeof myObject.test2.greeting2 + " -- Значение: " + JSON.stringify(myObject.test2.greeting2);
</script>
```

В данном примере свойство **greeting1** включено в объект **test1** через группирующий модификатор **$def**, поэтому фреймворк правильно обработал модификаторы свойства, присвоив ему начальное значение строкового типа. А в объект **test2** свойство **greeting2** включено напрямую без группирующего модификатора, поэтому фреймворк посчитал его вложенным объектом, а модификаторы **$def** и **$type** его свойствами.

Объекты с модификаторами могут иметь много уровней вложенных свойств. В этом случае каждый уровень свойств должен включаться в объект через группирующий модификатор **$def**.

Например,

```html run_edit_h=45_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id="div"></div>
<script type="module">
    class myClass extends ROCKS({
        test: {
            $def: {
                embedded: {
                    $def: {
                        greeting: {
                            $def: "Hello word",
                            $type: String
                        }
                    }
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
    div.innerText = "Тип свойства greeting: " + typeof myObject.test.embedded.greeting + " -- Значение: " + myObject.test.embedded.greeting;
</script>
```

В этом примере свойство **greeting** находится на третьем уровне вложенности. Чтобы фреймворк правильно интерпретировал его модификаторы, приходится использовать два группирующих модификатор **$def** на предыдущих уровнях (см. строки 7 и 9 листинга). Если убрать любой из них, то свойство **greeting** превратится во вложенный объект, а его модификаторы **$def** и **$type** станут его свойствами.

Использовать модификаторы можно не только на уровне свойств объекта, но и на уровне самого объекта. При этом модификаторы действуют только на тот уровень, на котором они объявлены. На нижерасположенные свойства эти модификаторы не действуют.

Например,

```html run_edit_h=45_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id="button1"></button>
<button id="button2"></button>
<script type="module">
    class myClass extends ROCKS({
        test: {
            $readOnly: true,
            $def: {
                counter: 0
            }
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let button1 = document.getElementById("button1");
    button1.innerText = "Счетчик: " + myObject.test.counter;
    button1.onclick = function() {
        try {
            ++myObject.test.counter;
            button1.innerText = "Счетчик: " + myObject.test.counter;
        } catch(e) {
            button1.innerText = "Счетчик: Инкремент запрещен";
        }
    }
    let button2 = document.getElementById("button2");
    button2.innerText = "Создать новый счетчик";
    button2.onclick = function() {
        try {
            myObject.test = new Object({counter: 0});
            button2.innerText = "Новый счетчик создан";
            button1.innerText = "Счетчик: " + myObject.test.counter;
        } catch(e) {
            button2.innerText = "Новый счетчик создать не удалось";
        }
    }
</script>
```

В данном примере объявлен объект **test** с единственным свойством **counter**. В объекте объявлен модификатор **$readOnly**, который запрещает запись. Однако при нажатии на кнопку **"Счетчик"** осуществляется инкремент свойства **counter**. Это происходит потому, что модификатор находится на уровень выше объявления свойства, и его действие распространяется только на указатель на объект **test**. Нажмите на кнопку **"Создать новый счетчик"**, чтобы присвоить указателю **test** другой объект. Поскольку у указателя есть модификатор **$readOnly** во время операции присваивания возникнет исключение, в котором надпись на кнопке будет заменена на **"Новый счетчик создать не удалось"**.

Чтобы запретить инкремент счетчика необходимо указать модификатор **$readOnly** в описание свойства **counter**.

Например,

```html run_edit_h=45_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id="button1"></button>
<button id="button2"></button>
<script type="module">
    class myClass extends ROCKS({
        test: {
            $def: {
                counter: {
                    $def:0,
                    $readOnly: true
                }
            }
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let button1 = document.getElementById("button1");
    button1.innerText = "Счетчик: " + myObject.test.counter;
    button1.onclick = function() {
        try {
            ++myObject.test.counter;
            button1.innerText = "Счетчик: " + myObject.test.counter;
        } catch(e) {
            button1.innerText = "Счетчик: Инкремент запрещен";
        }
    }
    let button2 = document.getElementById("button2");
    button2.innerText = "Создать новый счетчик";
    button2.onclick = function() {
        try {
            myObject.test = new Object({counter: 0});
            button2.innerText = "Новый счетчик создан";
            button1.innerText = "Счетчик: " + myObject.test.counter;
        } catch(e) {
            button2.innerText = "Новый счетчик создать не удалось";
        }
    }
</script>
```

В этом примере, в отличие от предыдущего, модификатор **$readOnly** перенесен с уровня указателя на объект **test** на уровень свойства **counter**. Поэтому изменилось поведение объекта **test** и связанных с ним кнопок на противоположное. Теперь, в обработчике кнопки **"Счетчик"** во время выполнения операции инкремента свойства **counter**, возникнет исключение, в котором надпись на кнопке заменится на **"Счетчик: Инкремент запрещен"**. В свою очередь с указателя **test** сняты все ограничения, поэтому нажатием кнопки **"Создать новый счетчик"** ему буден присвоен новый объект со счетчиком. Так как у нового счетчика нет ограничений на изменение значения, то операция инкремента свойства **counter** больше не будет вызывать исключения, и работа счетчика восстановится.

Если объект объявлен внутри группирующего модификатора, то действие этого модификатора будет распространяться только на первый уровень объявления, т.е. на указатель на объект.

Например,

```html run_edit_h=45_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id="button1"></button>
<button id="button2"></button>
<script type="module">
    class myClass extends ROCKS({
        $readOnly: {
            test: {
                counter: 0
            }
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let button1 = document.getElementById("button1");
    button1.innerText = "Счетчик: " + myObject.test.counter;
    button1.onclick = function() {
        try {
            ++myObject.test.counter;
            button1.innerText = "Счетчик: " + myObject.test.counter;
        } catch(e) {
            button1.innerText = "Счетчик: Инкремент запрещен";
        }
    }
    let button2 = document.getElementById("button2");
    button2.innerText = "Создать новый счетчик";
    button2.onclick = function() {
        try {
            myObject.test = new Object({counter: 0});
            button2.innerText = "Новый счетчик создан";
            button1.innerText = "Счетчик: " + myObject.test.counter;
        } catch(e) {
            button2.innerText = "Новый счетчик создать не удалось";
        }
    }
</script>
```

В данном примере объявлен объект **test** с единственным свойством **counter**. Объект находится внутри группирующего модификатора **$readOnly**, который действует только на указатель **test**. В этом можно убедиться нажав на кнопку **"Создать новый счетчик"**, чтобы присвоить указателю **test** другой объект. Во время операции присваивания возникнет исключение, в котором надпись на кнопке будет заменена на **"Новый счетчик создать не удалось"**. На уровень свойств группирующий модификатор не действует, поэтому при нажатии на кнопку **"Счетчик"** будет происходить инкремент свойства **counter**.

При объявлении массивов также можно использовать модификаторы. Как и в случае объектов, действие модификатора относится только на указатель на массив. На элементы массива модификаторы не действуют.

Например,

```html run_edit_h=45_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id="button1"></button>
<button id="button2"></button>
<script type="module">
    class myClass extends ROCKS({
        test: {
            $def: [0, 1, 2],
            $readOnly: true
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let button1 = document.getElementById("button1");
    button1.innerText = "Счетчик: " + myObject.test[0];
    button1.onclick = function() {
        try {
            ++myObject.test[0];
            button1.innerText = "Счетчик: " + myObject.test[0];
        } catch(e) {
            button1.innerText = "Счетчик: Инкремент запрещен";
        }
    }
    let button2 = document.getElementById("button2");
    button2.innerText = "Создать новый счетчик";
    button2.onclick = function() {
        try {
            myObject.test = new Array(0, 1, 2);
            button2.innerText = "Новый счетчик создан";
            button1.innerText = "Счетчик: " + myObject.test[0];
        } catch(e) {
            button2.innerText = "Новый счетчик создать не удалось";
        }
    }
</script>
```

В данном примере объявлен массив **test** с тремя элементами. В массиве объявлен модификатор **$readOnly**, который запрещает запись. Однако при нажатии на кнопку **"Счетчик"** осуществляется инкремент нулевого элемента массива. Это происходит потому, что модификатор находится на уровень выше объявления элементов массива, и его действие распространяется только на указатель на массив **test**. Нажмите на кнопку **"Создать новый счетчик"**, чтобы присвоить указателю **test** другой массив. Поскольку у указателя есть модификатор **$readOnly** во время операции присваивания возникнет исключение, в котором надпись на кнопке будет заменена на **"Новый счетчик создать не удалось"**.


