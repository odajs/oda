Модификатор **$readOnly** используется для запрета изменения значения, первоначально присвоенного свойству.

То есть если у свойства указать модификатор **$readOnly** со значением **true**, то оно фактически превращается в константу.

При попытке записи в свойство с модификатором **$readOnly** генерируется объект ошибки с типом **Error** и возникает исключение. В свойстве **message** объекта ошибки содержится сообщение о попытке записи в свойство доступное только для чтения, а также имя этого свойства:

<span style="color:red;">Read only!!! &lt;имя свойства&gt;</span>

Например,

```html run_edit_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id='button'></button>
<script type="module">
    class myClass extends ROCKS({
        counter: {
            $def: 0,
            $readOnly: true
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

В данном примере свойство **counter** объявлено с модификатором **$readOnly**. При нажатии на кнопку осуществляется попытка инкрементировать его значение. В результате возникает исключение, которое выводит в консоль браузера сообщение «Uncaught Error: Read only!!! counter».

![Консоль браузера](learn/_help/ru/_images/rocks-framework-$readonly-modifier-1.png "Консоль браузера")

Это исключение можно перехватить с помощью инструкции **try…catch**.

Например,

```html run_edit_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id='button'></button>
<span id='span'></span>
<script type="module">
    class myClass extends ROCKS({
        counter: {
            $def: 0,
            $readOnly: true
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let button = document.getElementById("button");
    let span = document.getElementById("span");
    button.innerText = "Счетчик: " + myObject.counter;

    button.onclick = function() {
        try {
            ++myObject.counter;
            button.innerText = "Счетчик: " + myObject.counter;
        } catch(e) {
            span.innerText = `Ошибка: ${e.name} -- Описание: ${e.message}`;
        }
    }
</script>
```

Данный пример аналогичен предыдущему, только операция инкремента свойства **counter** помещена в инструкцию **try…catch**, которая перехватывает исключение и выводит на экран сообщение «Ошибка: Error -- Описание: Read only!!! counter».

Модификатор **$readOnly** может использоваться в качестве группирующего модификатора, поэтому с его помощь можно объявить группу свойств с фиксированными значениями. Это упрощает синтаксис, т.к. не надо указывать модификатор отдельно у каждого свойства.

Например,

```html run_edit_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id='button'></button>
<span id='span'></span>
<script type="module">
    class myClass extends ROCKS({
        $readOnly: {
            counter: 0
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let button = document.getElementById("button");
    let span = document.getElementById("span");
    button.innerText = "Счетчик: " + myObject.counter;

    button.onclick = function() {
        try {
            ++myObject.counter;
            button.innerText = "Счетчик: " + myObject.counter;
        } catch(e) {
            span.innerText = `Ошибка: ${e.name} -- Описание: ${e.message}`;
        }
    }
</script>
```

Этот пример аналогичен предыдущему, за исключением того, что модификатор **$readOnly** убран из объявления свойства **counter** и использован для него как группирующий. Такой подход также позволил указать начальное значение непосредственно в свойстве и убрать из его описания модификатор **$def**, что сократило объем кода и сделало его более наглядным.

Аналогичным образом, с помощью модификатора **$readOnly**, в константу можно превратить отдельные свойства объектов.

Например,

```html run_edit_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id='button'></button>
<span id='span'></span>
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
    let button = document.getElementById("button");
    let span = document.getElementById("span");
    button.innerText = "Счетчик: " + myObject.test.counter;

    button.onclick = function() {
        try {
            ++myObject.test.counter;
            button.innerText = "Счетчик: " + myObject.test.counter;
        } catch(e) {
            span.innerText = `Ошибка: ${e.name} -- Описание: ${e.message}`;
        }
    }
</script>
```

Этот пример аналогичен предыдущему, за исключением того, что модификатор **$readOnly** применен к отдельному свойству объекта **test**.

С помощью модификатора **$readOnly** невозможно запретить изменение элементов массива. Действие модификатора относится только на указатель на массив. На элементы массива модификаторы не действуют.

Например,

```html run_edit_h=40_
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

В данном примере объявлен массив **test** с тремя элементами. В массиве объявлен модификатор **$readOnly**, который запрещает запись. Однако при нажатии на кнопку **"Счетчик"** осуществляется инкремент нулевого элемента массива, т.е. на элементы массива модификатор не действует. Нажмите на кнопку **"Создать новый счетчик"**, чтобы присвоить указателю **test** другой массив. Но модификатор превратил указатель в константу, поэтому во время операции присваивания возникнет исключение, в котором надпись на кнопке будет заменена на **"Новый счетчик создать не удалось"**.

Если свойство имеет сеттер, то модификатор **$readOnly** игнорируется.

Например,

```html run_edit_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id='button'></button>
<span id='span'></span>
<script type="module">
    class myClass extends ROCKS({
        _count: 0,
        counter: {
            $readOnly: true,
            set(val) {
                this._count = val;
            }
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let button = document.getElementById("button");
    let span = document.getElementById("span");
    button.innerText = "Счетчик: " + myObject._count;

    button.onclick = function() {
        myObject.counter = myObject._count + 1;
        button.innerText = "Счетчик: " + myObject._count;
    }
</script>
```

В данном примере свойство **counter** объявлено с модификатором **$readOnly**. Однако, оно также имеет сеттер, поэтому при нажатии на кнопку ему успешно присваивается новое значение, не смотря на наличие запрещающего модификатора.

