Фреймворк имеет встроенные механизмы кэширования результатов выполнения геттеров. Это позволяет снизить требования к вычислительным ресурсам и повысить отзывчивость разрабатываемого продукта.

Совокупность значений свойств класса, используемых в коде геттера, образует контекст выполнения геттера. Кеширование геттера основано на принципе, что если его контекст не изменился, то и результат выполнения геттера не изменится.

Контекст могут образовывать только свойства, изменение которых отслеживает фреймворк. Такие свойства должны быть явно объявлены в шаблоне класса, передаваемом функции **ROCKS**. При этом, если свойство объявлено с модификатором **$freeze**, то оно не может влиять на выполнение геттера, так как модификатор запрещает отслеживать изменение его значения. Свойство с модификатором **$readOnly** также не может влиять на выполнение геттера, так как имеет фиксированное значение.

Механизм кэширования работает следующим образом:

1. На этапе создания компонента фреймворк анализирует от каких свойств компонента зависит геттер.

1. При первом обращении к геттеру, он вычисляется, и возвращенное значение запоминается в кэше.

1. При последующих вызовах геттера проверяется наличие изменений в контексте геттера. Если изменений не произошло, то геттер не выполняется, а значение берется из кэша. Если изменения произошли, расчет выполняется заново и новое значение опять запоминается в кэше.

```info_md
Каждый геттер имеет свой кэш, независимый от других геттеров.
```

Например:

```html run_edit_h=35_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='div'></div>
<script type="module">
    class myClass extends ROCKS({
        get currentTime() {
            const d = new Date();
            return d.toLocaleTimeString()+ '.' + d.getMilliseconds();
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let div = document.getElementById("div");
    setInterval( ()=>{
        div.innerText = "Текущее время: " + myObject.currentTime
    }, 1000);
</script>
```

В примере каждую секунду на экран должно выводиться текущее время с точностью до миллисекунд. Для получения времени используется геттер **currentTime**. Но на экран время выводится только при загрузке страницы и больше не обновляется. Это происходит потому, что геттер не имеет контекста, поэтому вычисляется один раз, а все следующие значения берутся из его кэша.

```warning_md
Обратите внимание, если код геттера не содержит обращений к свойствам объекта, то у него отсутствует контекст, поэтому такой геттер вычисляется один раз и превращается в константу.
```

Добавим в функцию **ROCKS** объявление свойства **counter** и будем его инкрементировать перед выводом текущего времени на страницу. В геттер **currentTime** добавим обращение к этому свойству:

```html run_edit_h=35_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='div'></div>
<script type="module">
    class myClass extends ROCKS({
        counter: 0,
        get currentTime() {
            this.counter;
            const d = new Date();
            return d.toLocaleTimeString()+ '.' + d.getMilliseconds();
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let div = document.getElementById("div");
    setInterval( ()=>{
        myObject.counter++;
        div.innerText = "Текущее время: " + myObject.currentTime;
    }, 1000);
</script>
```

Теперь геттер обновляет время на экране каждую секунду. Обратите внимание, что в коде геттера свойство **counter** просто упоминается, никаких операций с ним не производится. То есть для сброса кэша геттера и его выполнения достаточно изменить значение используемого в нем свойства класса.

В контекст геттера также включаются отдельные свойства объектов.

Например:

```html run_edit_h=35_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='div'></div>
<script type="module">
    class myClass extends ROCKS({
        change: {counter: 0},
        get currentTime() {
            this.change.counter;
            const d = new Date();
            return d.toLocaleTimeString()+ '.' + d.getMilliseconds();
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let div = document.getElementById("div");
    setInterval( ()=>{
        myObject.change.counter++;
        div.innerText = "Текущее время: " + myObject.currentTime;
    }, 1000);
</script>
```

В данном примере инкремент свойства **counter** объекта **change** сбрасывает кэш геттера. В результате текущее время на странице обновляется каждую секунду.

В контекст геттера также включаются отдельные элементы массивов.

Например:

```html run_edit_h=35_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='div'></div>
<script type="module">
    class myClass extends ROCKS({
        counter: [0],
        get currentTime() {
            this.counter[0];
            const d = new Date();
            return d.toLocaleTimeString()+ '.' + d.getMilliseconds();
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let div = document.getElementById("div");
    setInterval( ()=>{
        myObject.counter[0]++;
        div.innerText = "Текущее время: " + myObject.currentTime;
    }, 1000);
</script>
```

В данном примере инкремент нулевого элемента массива **counter** сбрасывает кэш геттера. В результате текущее время на странице обновляется каждую секунду.

Изменение свойств класса, имеющих модификатор **$freeze**, не отслеживается фреймворком, поэтому не может сбрасывать кэш геттера.

Например,

```html run_edit_h=35_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='div'></div>
<script type="module">
    class myClass extends ROCKS({
        counter: {
            $def: 0,
            $freeze: true
        },
        get currentTime() {
            this.counter;
            const d = new Date();
            return d.toLocaleTimeString()+ '.' + d.getMilliseconds();
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let div = document.getElementById("div");
    setInterval( ()=>{
        myObject.counter++;
        div.innerText = "Текущее время: " + myObject.currentTime;
    }, 1000);
</script>
```

В данном примере свойство **counter** объявлено с модификатором **$freeze**, который отключает у него реактивность. И хотя к коде геттера **currentTime** происходит обращение к этому свойству, оно исключено из контекста геттера. В результате значение геттера всегда берется из кэша, и время на странице не обновляется.

Если сам геттер объявить с модификатором **$freeze**, то фреймворк прекращает отслеживать изменения его контекста, и геттер превращается в константу.

Например,

```html run_edit_h=35_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='div'></div>
<script type="module">
    class myClass extends ROCKS({
        counter: 0,
        $freeze: {
            get currentTime() {
                this.counter;
                const d = new Date();
                return d.toLocaleTimeString()+ '.' + d.getMilliseconds();
            }
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let div = document.getElementById("div");
    setInterval( ()=>{
        myObject.counter++;
        div.innerText = "Текущее время: " + myObject.currentTime;
    }, 1000);
</script>
```

В данном примере геттер **currentTime** объявлен с модификатором **$freeze**. И хотя каждую секунду происходит инкремент свойства **counter**, являющегося контекстом геттера, кэш геттера не сбрасывается. В результате значение геттера всегда берется из кэша, и время на странице не обновляется.

В коде геттера обязательно должно быть обращение к какому-либо свойству, которое сбрасывает кэш геттера, иначе геттер превращается в константу. Обращение к свойству не обязательно должно быть непосредственно в коде геттера, обращение может находиться в одном из вызываемых геттером методов или функции.

Например:

```html run_edit_h=35_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='div'></div>
<script type="module">
    class myClass extends ROCKS({
        counter: 0,
        get currentTime() {
            hiddenChange();
            const d = new Date();
            return d.toLocaleTimeString()+ '.' + d.getMilliseconds();
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let div = document.getElementById("div");
    setInterval( ()=>{
        myObject.counter++;
        div.innerText = "Текущее время: " + myObject.currentTime;
    }, 1000);

    function hiddenChange() {
        myObject.counter;
    }
</script>
```

В данном примере геттер **currentTime** не содержит в своем коде обращение к свойству **counter**, но он вызывает функцию **hiddenChange**, в которой такое обращение присутствует. В результате текущее время на странице обновляется каждую секунду.

Изменение контекста в процессе выполнения геттера не приводит к повторному запуску этого геттера, так как запоминаемое в кэше значение уже соответствует контексту.

Например:

```html run_edit_h=35_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id='div'></div>
<script type="module">
    class myClass extends ROCKS({
        counter: 0,
        get currentTime() {
            ++this.counter;
            const d = new Date();
            return d.toLocaleTimeString()+ '.' + d.getMilliseconds();
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let div = document.getElementById("div");
    setInterval( ()=>{
        div.innerText = "Текущее время: " + myObject.currentTime;
    }, 1000);
</script>
```

В данном примере видно, что изменение свойства **counter** в геттере **currentTime** не приводит к его повторному выполнению. В результате время выводится на экран только при загрузке страницы и больше не обновляется.

```warning_md
Чтобы свойство начало управлять сбросом кэша геттера, необходимо при выполнении геттера обратиться к нему хотя бы один раз.
```

Например:

```html run_edit_h=55_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id='button'></button>
<div id='div'></div>
<script type="module">
    class myClass extends ROCKS({
        counter: 0,
        permission: false,
        get currentTime() {
            if( this.permission )
                this.counter;
            const d = new Date();
            return d.toLocaleTimeString()+ '.' + d.getMilliseconds();
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let div = document.getElementById("div");
    let button = document.getElementById("button");
    button.innerText = "Permit: " + myObject.permission;
    button.onclick = function() {
        myObject.permission = !myObject.permission;
        button.innerText = "Permit: " + myObject.permission;
    }
    setInterval( ()=>{
        myObject.counter++;
        div.innerText = "Текущее время: " + myObject.currentTime;
    }, 1000);
</script>
```

В данном примере сразу после загрузки страницы геттер **currentTime** выполняется один раз, и время на экране больше не обновляется. При первом выполнении геттера обращение к свойству **counter** было заблокировано условным оператором, управляемым свойством **permission**. Нажмите на кнопку **Permit**. В ее обработчике значение свойства **permission** изменится на противоположное и примет значение **true**. Так как свойство является частью контекста, это заставит геттер выполниться второй раз. При этом в условном операторе произойдет обращение к свойству **counter**. Теперь при каждом изменении свойства **counter** кэш геттера сбрасывается и происходит выполнение геттера, что видно по изменению времени на странице. Если повторно нажать на кнопку **Permit**, то условный оператор опять заблокирует обращение к свойству **counter**, однако отсчет времени не прекратится, так как свойство **counter** уже зарегистрировано для управления кэшем.
