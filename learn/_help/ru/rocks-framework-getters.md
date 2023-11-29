**Геттер** (Getter) — это метод, который объявляется внутри свойства и вызывается автоматически при любом чтении его значения.

Геттер задается в расширенной форме объявления свойства, как функция с предопределенным именем **get**, которая вызывается автоматически при любом обращении к свойству для чтения.

Например:

```html run_edit_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id='button'></button>
<script type="module">
    class myClass extends ROCKS({
        count: 0,
        counter: {
            get() {
                return "Счетчик: " + this.count;
            }
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let button = document.getElementById("button");
    button.innerText = myObject.counter;
    button.onclick = function() {
        myObject.count++;
        button.innerText = myObject.counter;
    }
</script>
```

В данном примере значение счетчика **count** увеличивается на единицу при каждом нажатии на кнопку. Также при этом выводится новая надпись на кнопке, которая формируется геттером свойства **counter**.

```warning_md
Не рекомендуется использовать **геттер** вместе с модификатором **$def** при объявлении свойства. Это может привести к непредсказуемым результатам.
```

Во-первых, считываемое значение свойства всегда формируется только геттером, поэтому не имеет смысла указывать начальное значение. Во-вторых, тип возвращаемого геттером значения определяется типом свойства, а не кодом геттера. В свою очередь тип свойства может определяться заданным начальным значением. Таким образом начальное значение может влиять на тип значения возвращаемый геттером, что может отразиться на результатах операций со свойством.

Например:

```html run_edit_error_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id='button'></button>
<script type="module">
    class myClass extends ROCKS({
        count: 1,
        counter: {
            $def: "",
            get() {
                return this.count;
            }
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let button = document.getElementById("button");
    button.innerText = "Счетчик: " + myObject.count;
    button.onclick = function() {
        myObject.count = myObject.counter + 1;
        button.innerText = "Счетчик: " + myObject.count;
    }
</script>
```

В данном примере объявлены свойства **count** и **counter**. Фреймворк присвоил им статические типы **Number** и **String** в соответствии с их начальными значениями. При каждом нажатии на кнопку вычисляется новое значение счетчика **count** путем сложения его прежнего значения и единицы. Прежнее значение берется из геттера свойства **counter** напрямую, без всяких преобразований. Можно было бы ожидать, что будет происходить простой инкремент значения свойства **count**. Однако поскольку свойство **counter** имеет тип **String**, то возвращаемое геттером значение будет автоматически преобразовано из типа **Number** в тип **String**. В результате операция сложения будет осуществлять не арифметическое сложение, а склеивание строк.

```error_md
В теле геттера нельзя обращаться к собственному свойству. Это приведет к возникновению бесконечной рекурсии, так как геттер начнет вызывать самого себя в непрерывном цикле. В свою очередь это приведет к переполнению стека и прекращению выполнения программы. По этой причине для формирования возвращаемого значения в геттере можно обращаться только к другим свойствам, а не к своему собственному.
```

Например:

```html run_edit_error_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id='button'></button>
<script type="module">
    class myClass extends ROCKS({
        counter: {
            get() {
                return this.counter;
            }
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let button = document.getElementById("button");
    button.innerText = "Счетчик: 0";
    button.onclick = function() {
        ++myObject.counter;
        button.innerText = "Счетчик: " + myObject.counter;
    }
</script>
```

В данном примере код геттера свойства **counter** содержит обращение к самому свойству. При нажатии на кнопку происходит чтение значения свойства, при котором вызывается геттер, который опять же читает из этого свойства. Образуется бесконечный цикл, который приводит к переполнению стека. В результате браузер прерывает выполнение программы и генерирует исключение, которое выводит в консоль сообщение:

![Консоль браузера](learn/_help/ru/_images/rocks-framework-getters-1.png "Консоль браузера")

```info_md
Любой метод, объявленный в функции **ROCKS**, не имеющий параметров и возвращающий значение, можно превратить в геттер, поставив перед его именем ключевое слово **get**.
```

Например:

```html run_edit_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id='button1'></button>
<button id='button2'></button>
<script type="module">
    class myClass extends ROCKS({
        _count1: 0,
        _count2: 0,
        method() {
            return this._count1;
        },
        get getter() {
            return this._count2;
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let button1 = document.getElementById("button1");
    let button2 = document.getElementById("button2");
    button1.innerText = "Метод: "+ myObject.method();
    button2.innerText = "Геттер: " + myObject.getter;
    button1.onclick = function() {
        myObject._count1++;
        button1.innerText = "Метод: "+ myObject.method();
    }
    button2.onclick = function() {
        myObject._count2++;
        button2.innerText = "Геттер: " + myObject.getter;
    }
</script>
```

```faq_md
В данном простом примере может показаться, что геттер отличается от метода только синтаксисом объявления и вызова. Однако главное их отличие в механизме выполнения. Код метода выполняется при каждом вызове, а результаты выполнения геттера кэшируются, позволяя во многих случаях избежать повторного выполнения кода. Это снижает нагрузку на вычислительные ресурсы и повышает отзывчивость разрабатываемого продукта.
```

Геттер, объявленный в функции **ROCKS**, обладает интересной особенностью, в отличие от нативного геттера JavaScript ему можно присваивать новые значения. Операция присваивания изменяет значение кэша геттера, и при последующих обращениях к геттеру возвращается новое значение из кэша. На контекст геттера операция присваивания не влияет.

Например,

```html run_edit_h=75_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='div1'></div>
<div id='div2'></div>
<button id='button1'>Инкремент геттера</button>
<button id='button2'>Декремент свойства "prop"</button>
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
    let button1 = document.getElementById("button1");
    let button2 = document.getElementById("button2");
    div1.innerText = "Значение геттера: " + myObject.counter;
    div2.innerText = "Значение свойства 'prop': " + myObject.prop;
    button1.onclick = function() {
        ++myObject.counter;
        div1.innerText = "Значение геттера: " + myObject.counter;
        div2.innerText = "Значение свойства 'prop': " + myObject.prop;
    }
    button2.onclick = function() {
        --myObject.prop;
        div1.innerText = "Значение геттера: " + myObject.counter;
        div2.innerText = "Значение свойства 'prop': " + myObject.prop;
    }
</script>
```

В данном примере геттер **counter** выдает значение свойства **prop**. В обработчике нажатия первой кнопки инкрементируется сам геттер. Можно видеть, что инкрементируется только значение геттера, а значение связанного с ним свойства **prop** не изменяется. Поэтому выводимые на экран значения геттера и свойства рассинхронизируются. Это говорит о том, что инкрементируется значение только кэша геттера. При нажатии второй кнопки декрементируется свойство **prop**. Можно видеть, что факт его изменения очищает кэш и заставляет геттер пересчитывать свое значение, поэтому выводимые на экран значения геттера и свойства изменяются синхронно.

Чтобы отключить возможность записи в геттер, его необходимо объявить с модификатором **$readOnly**.

Например,

```html run_edit_h=75_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='div1'></div>
<div id='div2'></div>
<button id='button1'>Инкремент геттера</button>
<button id='button2'>Декремент свойства "prop"</button>
<script type="module">
    class myClass extends ROCKS({
        prop: 0,
        $readOnly: {
            get counter() {
                return this.prop;
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
    let button1 = document.getElementById("button1");
    let button2 = document.getElementById("button2");
    div1.innerText = "Значение геттера: " + myObject.counter;
    div2.innerText = "Значение свойства 'prop': " + myObject.prop;
    button1.onclick = function() {
        ++myObject.counter;
        div1.innerText = "Значение геттера: " + myObject.counter;
        div2.innerText = "Значение свойства 'prop': " + myObject.prop;
    }
    button2.onclick = function() {
        --myObject.prop;
        div1.innerText = "Значение геттера: " + myObject.counter;
        div2.innerText = "Значение свойства 'prop': " + myObject.prop;
    }
</script>
```

В этом примере в описание геттера **counter** добавлен модификатор **$readOnly**, который запрещает прямую запись в геттер. В результате инкремент геттера уже не выполняется, а возвращаемое им значение зависит только от свойства **prop**.

