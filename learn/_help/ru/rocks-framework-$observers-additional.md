```error_md
Параметрами обозревателя могут быть только имена свойств, объявленных в шаблоне класса. В противном случае при создании объекта из класса фреймворк сгенерирует исключение и прекратит работу.
```

Например:

```html run_edit_error_h=40_
<!--script type="module" src='https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js'></script-->
<script type="module" src="./rocks.js"></script>
<button id="button">Создать объект</button>
<script type="module">
    let myClass = class extends ROCKS({
        $observers: {
            myObserver( propertyName ) {},
        }
    }) {
        constructor() {
            super();
        }
    }
    let button = document.getElementById("button");
    button.onclick = function() {
        let myObject = new myClass();
    }
</script>
```

В данном примере создается класс **myClass** с обозревателем **myObserver**, который должен отслеживать свойство **propertyName**. Однако в создаваемом классе свойство с таким именем отсутствует. При нажатии на кнопку на основе класса **myClass** создается объект **myObject**. Так как шаблон класса выполнен с нарушениями, то возникнет исключение, которое выведет в консоль браузера сообщение с описанием ошибки:

![Консоль браузера](learn/_help/ru/_images/rocks-framework-$observers-additional-1.png "Консоль браузера")

```info_md
Если значение хотя бы одно из отслеживаемых обозревателем свойств имеет значение **undefined**, то обозреватель не будет вызываться.
```

Например:

```html run_edit_h=55_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<label>Фамилия: <input id='input1'></label>
<label>Имя: <input id='input2'></label>
<div id='div'>Полное имя:</div>
<script type="module">
    class myClass extends ROCKS({
        firstName: '',
        lastName: '',
        $observers: {
            nameObserver(lastName, firstName) {
                let div = document.getElementById("div");
                div.innerText = "Полное имя: " + this.lastName + " " + this.firstName;
            }
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let input1 = document.getElementById("input1");
    let input2 = document.getElementById("input2");
    input1.oninput = function() {
        myObject.lastName = input1.value;
    }
    input2.oninput = function() {
        myObject.firstName = input2.value=='undefined' ? undefined : input2.value;
    }
</script>
```

В данном примере обозреватель **nameObserver** отслеживает свойства **firstName** и **lastName**, создает из них строку с полным именем и выводит на страницу. Значение указанных свойств можно изменить в полях ввода **Имя** и **Фамилия**. При вводе строки «undefined» в поле **Имя** свойству **firstName** присваивается значение **undefined**. Можно видеть, что после этого изменения значения свойства **lastName** в поле **Фамилия** не отображаются в строке «Полное имя», т.к. обозреватель не вызывается. Чтобы обозревать опять начал работу необходимо изменить строку **undefined** в поле **Имя**.

```info_md
Модификатор не может отслеживать свойство, объявленное с модификатором **$freeze**.
```

Например:

```html run_edit_h=55_
<!--script type="module" src='https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js'></script-->
<script type="module" src="./rocks.js"></script>
<label>1-е слагаемое: <input id='input1' type='number' value='0'></label>
<label>2-е слагаемое: <input id='input2' type='number' value='0'></label>
<div id='div'></div>
<script type="module">
    class myClass extends ROCKS({
        x1: {
            $def: 0,
            $freeze: true
        },
        x2: 0,
        $observers: {
            sumUp(x1, x2) {
                let div = document.getElementById("div");
                div.innerText = "Сумма: " + (this.x1 + this.x2);
            }
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let input1 = document.getElementById("input1");
    let input2 = document.getElementById("input2");
    input1.oninput = function() {
        myObject.x1 = input1.value;
    }
    input2.oninput = function() {
        myObject.x2 = input2.value;
    }
</script>
```

В данном примере в объекте **$observers** объявлен обозреватель **sumUp**, который должен отслеживать свойства **x1** и **x2** и выводить их сумму на страницу с помощью HTML-элемента **div**. Изменение значений свойств **x1** и **x2** в строках ввода «1-е слагаемое» и «2-е слагаемое» должно приводить к автоматическому вызову обозревателя. При изменении значения свойства **x2** так и происходит. Однако свойство **x1** объявлено с модификатором **$freeze**, поэтому изменение его значения не приводит к вызову обозревателя, и сумма на экране не обновляется. Чтобы обновить сумму необходимо изменить значение свойства **x2**.

```info_md
При изменении значения отслеживаемого свойства, вызов обозревателя помещается в конец текущего потока задач. Поэтому выполнение обозревателя происходит не сразу после изменения свойства, а только после того как до него дойдет очередь. За время ожидания свойство может измениться. Если это произошло, то прежний вызов обозревателя удаляется из потока задач и добавляется новый вызов в конец потока. Таким образом, в потоке задач может находиться только один вызов конкретного обозревателя, и каждое изменение отслеживаемого свойства переносит вызов в конец потока задач.
```

Например:

```html run_edit_h=55_
<!--script type="module" src='https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js'></script-->
<script type="module" src="./rocks.js"></script>
<button id='button'>Прибавить 2</button>
<div id='div'></div>
<script type="module">
    class myClass extends ROCKS({
        counter: 0,
        sum: 0,
        $observers: {
            print(sum) {
                div.innerText += " - Сумма: " + sum;
            },
            observer1(counter) {
                this.sum++;
                div.innerText += " - observer1 ";
            },
            observer2(counter) {
                this.sum++;
                div.innerText += " - observer2 ";
            }
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let div = document.getElementById("div");
    let button = document.getElementById("button");
    button.onclick = function() {
        myObject.counter++;
    }
</script>
```

В данном примере при нажатии на кнопку инкрементируется свойство **counter**. Его изменение отслеживается в двух обозревателях **observer1** и **observer2**, которые соответственно вызываются и инкрементируют свойство **sum**. В результате, при однократном изменении свойства **counter** свойство **sum** инкрементируется два раза. Оно отслеживается обозревателем **print**, и можно было бы ожидать, что обозреватель будет вызван два раза. После нажатия на кнопку можно видеть, что вызываются оба обозревателя **observer1** и **observer2**, значит, свойство **sum** изменяется два раза. Однако обозреватель **print** вызывается только один раз, и мы видим на экране только четные значения, т.е. мы видим только последние изменение свойства **sum**.

```info_md
Фреймворк автоматически помещает вызовы обозревателей в очередь заданий после создания объекта из класса, в котором они объявлены.
```

Например:

```html run_edit_h=40_
<!--script type="module" src='https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js'></script-->
<script type="module" src="./rocks.js"></script>
<button id="button">Создать объект</button>
<span id="span"></span>
<script type="module">
    let myClass = class extends ROCKS({
        x1: 0,
        x2: 0,
        $observers: {
            observer1(x1) {
                span.innerText += '-обозреватель 1-';
            },
            observer2(x2) {
                span.innerText += '-обозреватель 2-';
            }
        }
    }) {
        constructor() {
            super();
        }
    }

    let span = document.getElementById("span");
    let button = document.getElementById("button");
    button.onclick = function() {
        let myObject = new myClass();
    }
</script>
```

В данном примере создается класс **myClass** с обозревателями **observer1** и **observer2**, которые отслеживает свойства **x1** и **x2** соответственно. Обозреватели выводит на страницу сообщения «-обозреватель 1-» и «-обозреватель 2-». При нажатии на кнопку на основе класса **myClass** создается объект **myObject**. Видно, что при каждом нажатии на кнопку срабатывают оба обозревателя и выводят на экран сообщение о своем вызове. Если в коде примера изменить начальное значение свойства **x1** или **x2** на **undefined**, то соответствующий обозреватель вызываться не будет.

```error_md
Поскольку **$observers** является псевдообъектом, то методы класса будут переопределяться методами обозревателя при совпадении имен. Т.е. при обращении к методам класса будут вызываться одноименные методы обозревателей.
```

Например:

```html run_edit_error_h=40_
<!--script type="module" src='https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js'></script-->
<script type="module" src="./rocks.js"></script>
<button id="button">Вызвать метод</button>
<span id="span"></span>
<script type="module">
    let myClass = class extends ROCKS({
        x1: undefined,
        $observers: {
            print(x1) {
                span.innerText += '-Обозреватель-';
            }
        },
        print() {
            span.innerText += '-Метод-';
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let span = document.getElementById("span");
    let button = document.getElementById("button");
    button.onclick = function() {
        myObject.print();
    }
</script>
```

В данном примере объявлены одноименные метод и обозреватель с именем **print**. Метод **print** должен вызываться при нажатии на кнопку. Однако по сообщениям, выводимым на экран, видно, что вызывается обозреватель.

```error_md
Если одноименный метод объявлен в нативной части класса, то он переопределит метод обозревателя в объекте **$observers**. Поэтому при изменении отслеживаемого свойства будет вызываться метод класса.
```

Например:

```html run_edit_error_h=40_
<!--script type="module" src='https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js'></script-->
<script type="module" src="./rocks.js"></script>
<button id="button">Вызвать обозреватель</button>
<span id="span"></span>
<script type="module">
    let myClass = class extends ROCKS({
        x1: undefined,
        $observers: {
            print(x1) {
                span.innerText += '-Обозреватель-';
            }
        }
    }) {
        constructor() {
            super();
        }
        print() {
            span.innerText += '-Метод-';
        }
    }

    let myObject = new myClass();
    let span = document.getElementById("span");
    let button = document.getElementById("button");
    button.onclick = function() {
        myObject.x1++;
    }
</script>
```

В данном примере объявлены одноименные метод в нативной часи класса и обозреватель с именем **print**. При нажатии на кнопку инкрементируется отслеживаемое свойство **x1**, что приводи к вызову обозревателя. Однако по сообщениям, выводимым на экран, видно, что вызывается метод класса.

```info_md
Метод обозревателя создается с дескриптором **ReadOnly**, поэтому его нельзя заменить в процессе работы программы.
```

Например:

```html run_edit_h=40_
<!--script type="module" src='https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js'></script-->
<script type="module" src="./rocks.js"></script>
<button id="button">Заменить обозреватель</button>
<span id="span"></span>
<script type="module">
    let myClass = class extends ROCKS({
        x1: undefined,
        $observers: {
            print(x1) {
                span.innerText = '-Обозреватель-';
            }
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let span = document.getElementById("span");
    let button = document.getElementById("button");
    button.onclick = function() {
        try {
            myObject.print = function() {
                span.innerText = '-Новый метод-';
            }
        } catch(e) {
            span.innerText = `Ошибка: ${e.name} — Описание: ${e.message}`;
        }
    }
</script>
```

В данном примере при нажатии на кнопку, указателю на обозреватель **print** должен быть присвоен новый метод. Команда присваивания помещена в инструкцию **try…catch**, поэтому можно видеть, что возникает исключение из-за попытки присвоить новый метод указателю, имеющему дескриптор **ReadOnly**.

```warning_md
Если в обозревателе изменяется значение отслеживаемого свойства, то эти изменения должны иметь конечный характер. Иначе возникнет бесконечная рекурсия из-за того, что обозреватель будет вызывать сам себя. Поскольку обозреватели всегда выполняются асинхронно, этот бесконечный цикл не блокирует работу web-страницы, но отвлекает ресурсы процессора на свое обслуживание.
```

Например:

```html run_edit_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id='button'>Счетчик: 0</button>
<script type="module">
    class myClass extends ROCKS({
        counter: undefined,
        $observers: {
            increment( counter ) {
                button.innerText = "Счетчик: " + counter;
                if( this.counter < 1000 )
                    this.counter++;
            }
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let button = document.getElementById("button");
    button.onclick = function() {
        myObject.counter = 0;
    }
</script>
```

В данном примере обозреватель **increment** отслеживает свойство **counter**. При нажатии на кнопку происходит обнуление значения свойства **counter**, и, следовательно, первый вызов обозревателя. При каждом вызове обозреватель инкрементирует значение отслеживаемого свойства, тем самым запуская свой повторный вызов. Однако благодаря наличию в его коде ограничения, цикл вызовов прерывается при достижении свойством **counter** значения 1000.

Аналогичным образом необходимо избегать взаимного изменения двух свойств внутри их обозревателей, так как это также может привести к возникновению бесконечной рекурсии.

Например:

```html run_edit_error_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id='button'>Счетчик: 0</button>
<script type="module">
    class myClass extends ROCKS({
        text: undefined,
        counter: undefined,
        $observers: {
            newCounter( counter ) {
                this.text = "Счетчик: " + counter;
                button.innerText = this.text;
            },
            newText( text ) {
                this.counter++;
            }
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let button = document.getElementById("button");
    button.onclick = function() {
        myObject.counter = 0;
    }
</script>
```

В данном примере объявлены два обозревателя. Причем обозреватель **newCounter** отслеживает свойство **counter** и изменяет свойство **text**, которое в свою очередь отслеживается обозревателем **newText**, изменяющим свойство **counter**. Взаимное изменение свойств создает бесконечный цикл, который запускается присваиванием нового значения свойству **counter** после нажатия на кнопку.

Обозреватели являются одним из способов отслеживания изменений значений свойств. Другим способом — являются сеттеры. Сравним их:

1. Сеттеры вызываются сразу при изменении значения, что обеспечивает оперативную реакцию объекта. А обозреватели выполняются асинхронно, что повышает отзывчивость страницы в целом, но время реакции объекта на изменение предсказать невозможно. Поэтому, если свойство имеет и сеттер и обозреватель, то сеттер будет вызван раньше обозревателя.
2. Сеттер вызывается при любых изменениях значения свойства, в том числе при присваивании значения **undefined**. Обозреватели присваивание значения **undefined** игнорируют.
3. Сеттер обрабатывает каждое изменение свойства. Обозреватель игнорирует те изменения, которые произошли с момента постановки его в очередь задач до начала его выполнения и обрабатывает только самое последнее.
4. В сеттер передается и новое, и предыдущее значения свойства. Например, это удобно, когда необходимо отслеживать величину изменения свойства. Обозреватель получает только самое новое значение, то которое свойство имеет на момент выполнения обозревателя, а не то, которое оно имело на момент включения обозревателя в очередь задач.
5. Сеттер может отслеживать изменение только одного свойства, а обозреватель может отслеживать несколько свойств. Однако в обозревателе нельзя узнать какое конкретное свойство было изменено и какое предыдущее значение было у этого свойства. Все свойства передаются обозревателю в списке параметров только с текущими значениями.
6. Обозреватель вызывается во время создания объекта, когда свойство инициализируется начальным значением. А сеттер не реагирует на первоначальную инициализацию свойства.

