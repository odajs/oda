Модификатор **$type** используется для явного указания типа свойства.

Например,

```html run_edit_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id="button"></button>
<script type="module">
    class myClass extends ROCKS({
        counter: {
            $def: 0,
            $type: Number
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let button = document.getElementById("button");
    button.innerText = "Счетчик: " + myObject.counter + " — Тип: " + typeof myObject.counter;
    button.onclick = function() {
        ++myObject.counter;
        button.innerText = "Счетчик: " + myObject.counter + " — Тип: " + typeof myObject.counter;
    }
</script>
```

Если тип свойства можно однозначно определить по его начальному значению, то модификатор **$type** можно не указывать. В этом случае он будет задан автоматически.

Например,

```html run_edit_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id="button"></button>
<script type="module">
    class myClass extends ROCKS({
        counter: {
            $def: 0,
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let button = document.getElementById("button");
    button.innerText = "Счетчик: " + myObject.counter + " — Тип: " + typeof myObject.counter;
    button.onclick = function() {
        ++myObject.counter;
        button.innerText = "Счетчик: " + myObject.counter + " — Тип: " + typeof myObject.counter;
    }
</script>
```

В этом примере начальное значение **0** позволяет однозначно отнести свойство **counter** к типу **Number**, поэтому модификатор **$type** был опущен.

При использовании сокращенной формы записи тип свойства также определяется автоматически по начальному значению.

Например,

```html run_edit_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id="button"></button>
<script type="module">
    class myClass extends ROCKS({
        counter: 0,
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let button = document.getElementById("button");
    button.innerText = "Счетчик: " + myObject.counter + " — Тип: " + typeof myObject.counter;
    button.onclick = function() {
        ++myObject.counter;
        button.innerText = "Счетчик: " + myObject.counter + " — Тип: " + typeof myObject.counter;
    }
</script>
```

В этом случае модификатор **$type** и фигурные скобки у свойства указывать не нужно.

Модификатор **$type** имеет более высокий приоритет по сравнению с типом начального значения свойства.

Например, если у свойства указать начальное значение с типом, отличающимся от типа, указанного в модификаторе **$type**, то это значение сначала будет приведено к указанному типу, а только затем присвоено самому свойству.

Например,

```html run_edit_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id="div"></div>
<script type="module">
    class myClass extends ROCKS({
        victoryDay: {
            $def: '1945-05-09',
            $type: Date
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let div = document.getElementById("div");
    div.innerText = "Значение: " + myObject.victoryDay + " — Тип: " + myObject.victoryDay.constructor.name;
</script>
```

В этом примере у свойства явно указан тип **Date**, а в качестве начального значения задана строковая константа **'1945-05-09'**. Так как заданный тип имеет наибольший приоритет, то строковая константа будет автоматически преобразована к типу **Date**, и только после этого она будет присвоена свойству **victoryDay**. В результате  свойство **victoryDay** будет иметь тип **Date**, а не **String**.

Свойства с типами: **Number**, **String**, **Boolean**, **Date** и **BigInt** всегда имеют статическую типизацию. Это означает, что изменить их тип после задания начального значения уже невозможно. Если такому свойству во время работы присвоить значение какого-либо другого типа, то сперва оно будет преобразовано к начальному типу свойства, а только затем присвоено ему.

Например,

```html run_edit_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id="button"></button>
<script type="module">
    class myClass extends ROCKS({
        digit: {
            $def: 1,
            $type: Number
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let button = document.getElementById("button");
    button.innerText = "Значение: " + myObject.digit + " — Тип: " + typeof myObject.digit;
    button.onclick = function() {
        myObject.digit = myObject.digit === 1 ? "Это строка" : 1;
        button.innerText = "Значение: " + myObject.digit + " — Тип: " + typeof myObject.digit;
    }
</script>
```

В этом примере у свойства **digit** явно задан тип **Number**. В обработчике нажатия кнопки этому свойству присваивается константа строкового типа **"Это строка"**, но из-за статической типизации эта константа перед присвоением будет автоматически преобразована к типу **Number** со значением **NaN**.

Помимо типов: **Number**, **String**, **Boolean**, **Date** и **BigInt** в модификаторе **$type** можно указать любые другие типы, предусмотренные в языке JavaScript. Однако в этом случае механизм статической типизации для них работать уже не будет.

Например,

```html run_edit_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id="button"></button>
<script type="module">
    class myClass extends ROCKS({
        collection: {
            $def: ['Это массив'],
            $type: Array
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let button = document.getElementById("button");
    button.innerText = "Значение: " + myObject.collection + " — Тип: " + myObject.collection.constructor.name;
    button.onclick = function() {
        myObject.collection = myObject.collection !== "Это строка" ? "Это строка" : ['Это массив'];
        button.innerText = "Значение: " + myObject.collection + " — Тип: " + myObject.collection.constructor.name;
    } 
</script>
```

В этом примере свойство **collection** задано с типом **Array**. Однако при нажатии на кнопку ему будет присвоено значение **"Это строка"** строкового типа. В результате этого свойство динамически изменяет свой тип на **String**. При повторном нажатии на кнопку свойству будет присвоен массив и его тип опять станет **Array**.

Такой механизм работы со свойствами получил название динамической типизации, так как тип свойства изменяется динамически при каждом присвоении ему значения другого типа.

Статическую типизацию принципиально нельзя задать у свойства с несколькими альтернативными типами.

Например,

```html run_edit_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id="button"></button>
<script type="module">
    class myClass extends ROCKS({
        victoryDay: {
            $def: 1945,
            $type: [Number, String]
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let button = document.getElementById("button");
    button.innerText = myObject.victoryDay.constructor.name + ": " + myObject.victoryDay;
    button.onclick = function() {
        switch( typeof myObject.victoryDay ) {
            case "number": myObject.victoryDay = "9 мая 1945";
                break;
            case "string": myObject.victoryDay = new Date("1945-05-09");
                break;
            case "object": myObject.victoryDay = 1945;
        }
        button.innerText = myObject.victoryDay.constructor.name + ": " + myObject.victoryDay;
    } 
</script>
```

В данном примере у свойства **victoryDay** директивой **$type** заданы два альтернативных типа **Number** и **String**, относящиеся к статической типизации. По нажатию кнопки этому свойству поочередно присваиваются значения указанных типов и типа **Date**. Из примера видно, что свойство **victoryDay** изменяет свой тип в зависимости от последнего присвоенного значения включая тип **Date**, хотя его нет в списке альтернативных типов. Это значит, что при попытке объявления альтернативных типов свойство автоматически получает динамическую типизацию.

По умолчанию свойства объектов имеют динамическую типизацию.

Например,

```html run_edit_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id="button"></button>
<script type="module">
    class myClass extends ROCKS({
        test: {
            digit: 1
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let button = document.getElementById("button");
    button.innerText = "Значение: " + myObject.test.digit + " — Тип: " + typeof myObject.test.digit;
    button.onclick = function() {
        myObject.test.digit = myObject.test.digit === 1 ? "Это строка" : 1;
        button.innerText = "Значение: " + myObject.test.digit + " — Тип: " + typeof myObject.test.digit;
    }
</script>
```

В этом примере начальное значение свойства **digit** объекта **test** имеет тип **Number**. Однако при нажатии на кнопку ему будет присвоено значение **"Это строка"** строкового типа. В результате этого свойство динамически изменяет свой тип на **String**. При повторном нажатии на кнопку свойству будет присвоено число **1** и его тип опять станет **Number**.

Чтобы свойство объекта получило статическую типизацию, его необходимо объявить с модификатором **$type** или с модификатором **$def**, если тип свойства можно однозначно определить по его начальному значению.

Например,

```html run_edit_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id="button"></button>
<script type="module">
    class myClass extends ROCKS({
        test: {
            $def: {
                digit: {
                    $def: 1,
                    $type: Number
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
    button.innerText = "Значение: " + myObject.test.digit + " — Тип: " + typeof myObject.test.digit;
    button.onclick = function() {
        myObject.test.digit = myObject.test.digit === 1 ? "Это строка" : 1;
        button.innerText = "Значение: " + myObject.test.digit + " — Тип: " + typeof myObject.test.digit;
    }
</script>
```

Этот пример аналогичен предыдущему, только у свойства **digit** объекта **test** явно задан тип **Number**. В обработчике нажатия кнопки этому свойству присваивается константа строкового типа **"Это строка"**, но из-за статической типизации эта константа перед присвоением будет автоматически преобразована к типу **Number** со значением **NaN**.

```warning_md
Обратите внимание, что при присвоении свойству со статическим типом **Boolean** значения строкового типа, используется алгоритм преобразования типов, который отличается от используемого в конструкторе **Boolean()**. Этот конструктор преобразует любую непустую строку в логическое значение **true**, а пустую – в **false**. Во фреймворке в значение **true** преобразуется только строка **"true"**, причем регистр символов роли не играет. Например, строка **"tRUe"** тоже примет значение истина. Все остальные строки фреймворк преобразует в значение **false**.
```

Например,

```html run_edit_h=55_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id="div1"></div>
<div id="div2"></div>
<script type="module">
    class myClass extends ROCKS({
        rocksBool: {
            $def: true,
            $type: Boolean
        }
    }) {
        nativeBool = 0;
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let div1 = document.getElementById("div1");
    let div2 = document.getElementById("div2");
    myObject.rocksBool = "Абракадабра";
    myObject.nativeBool = Boolean("Абракадабра");
    div1.innerText = "Значение свойства из ROCKS: " + myObject.rocksBool + " — Тип: " + typeof myObject.rocksBool;
    div2.innerText = "Значение нативного свойства: " + myObject.nativeBool + " — Тип: " + typeof myObject.nativeBool;
</script>
```

В данном примере в функции **ROCKS** объявлено свойство **rocksBool**. С помощью модификатора **$type** ему задан статический тип **Boolean**. В коде примера ему присваивается значение строкового типа "Абракадабра". Для выполнения операции присваивания фреймворк преобразует эту строку в значение **false**. Для сравнения в нативной части класса объявлено свойство **nativeBool**, которому тоже присваивается строка "Абракадабра". Предварительно эта строка преобразуется в логический тип с помощью конструктора **Boolean()**. Как видно по результатам выполнения примера, конструктор преобразует непустую строку в значение **true**.

Фреймворк позволяет объявлять свойства со статическим типом **BigInt**. При присвоении новых значений таким свойствам, фреймворк, в случае необходимости, преобразует присваиваемое значение к типу **BigInt**. Для преобразования он использует собственный алгоритм, который отличается от используемого в конструкторе **BigInt()**. Отличия приведены в таблице:

| Исходное значение | Фреймворк | Конструктор BigInt() |
| :---------------- | :-------- | :------------------- |
| Число с дробной частью | Округляет до целого | Вызывает исключение |
| NaN | undefined | Вызывает исключение |
| Infinity | undefined | Вызывает исключение |
| undefined | undefined | Вызывает исключение |
| null | 0n | Вызывает исключение |
| Object() | undefined | Вызывает исключение |
| Array(2) | undefined | Вызывает исключение |
| function(){} | undefined | Вызывает исключение |
| Cтрока, начинающаяся с числа с последующими не цифровыми символами | Выделенное число | Вызывает исключение |
| Срока, не содержащая числа | undefined | Вызывает исключение |

Как видите, в отличие от конструктора **BigInt()**, во фреймворке преобразование к типу **BigInt** никогда не вызывает исключение.

Например,

```html run_edit_h=55_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<div id="div1"></div>
<div id="div2"></div>
<script type="module">
    class myClass extends ROCKS({
        rocksCounter: {
            $def: 0n,
            $type: BigInt
        }
    }) {
        nativeCounter = 0n;
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let div1 = document.getElementById("div1");
    let div2 = document.getElementById("div2");
    myObject.rocksCounter = "Абракадабра";
    div1.innerText = "Значение свойства из ROCKS: " + myObject.rocksCounter;
    try {
        myObject.nativeCounter = BigInt("Абракадабра");
        div2.innerText = "Значение нативного свойства: " + myObject.nativeCounter;
    } catch(e) {
        div2.innerText = `Это исключение: ${e.name} — Описание: ${e.message}`;
    }
</script>
```

В данном примере в функции **ROCKS** объявлено свойство **rocksCounter**. С помощью модификатора **$type** ему задан статический тип **BigInt**. В коде примера ему присваивается значение строкового типа "Абракадабра". Фреймворк не может преобразовать эту строку к типу **BigInt**, поэтому свойству присваивается значение **undefined**. Для сравнения в нативной части класса объявлено свойство **nativeCounter**, которому тоже присваивается строка "Абракадабра". Предварительно эту строку пытаемся преобразовать в тип **BigInt** с помощью конструктора **BigInt()**. Команда присваивания обернута в инструкцию **try…catch**. Как видно по результатам выполнения примера, попытка преобразования строки с помощью этого конструктора вызвала исключение.

