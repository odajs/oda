Фреймворк гарантирует, что операции записи в свойства, созданные с помощью функции **ROCKS**, являются идемпотентными. Т.е. многократное присваивание свойству одного и того же значения производит тот же эффект на систему, что и однократное присваивание. Идемпотентными являются как простые свойства, так и свойства с сеттерами.

Для реализации идемпотентности фреймворк перехватывает операции записи в свойства. Он анализирует контекст выполнения операции и вызывает сеттер свойства, только если в этом есть необходимость. Если свойству несколько раз подряд присваивается одно и то же значение, то сеттер будет вызван только во время первой операции присваивания. Фреймворк считает, что раз значение не изменилось, то и результат работы сеттера не принесет изменений в состояние системы, следовательно, нет смысла тратить время на его выполнение. Это позволяет снизить требования к вычислительным ресурсам и повысить отзывчивость разрабатываемого продукта.

Например:

```html run_edit_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id='button'>Текущее время</button>
<span id='span'></span>
<script type="module">
    class myClass extends ROCKS({
        text: "",
        set currentTime(n) {
            const d = new Date();
            this.text = d.toLocaleTimeString() + '.' + d.getMilliseconds();
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let button = document.getElementById("button");
    let span = document.getElementById("span");
    button.onclick = function() {
        myObject.currentTime = Math.floor(Date.now() / 10000);
        span.innerText = myObject.text;
    }
</script>
```

В данном примере объявлен сеттер **currentTime**. В коде сеттера запрашивается текущая дата, из которой выделяется время с точностью до миллисекунд. Это время присваивается другому свойству **text**, значение которого отображается на странице. При каждом нажатии на кнопку сеттеру присваивается количество десятков секунд прошедших с 1 января 1970 года. Операция присваивания, в свою очередь, должна вызывать выполнение сеттера и обновление времени на экране. Однако можно видеть, что время обновляется только с периодом 10 секунд, что соответствует периоду изменения значения, присваиваемого сеттеру. Это указывает на то, что фреймворк вызывает сеттер не при каждой операции присваивания, а только когда происходит смена присваиваемых данных.

```info_md
Благодаря вызову сеттера только при смене присваиваемого ему значению, передаваемые в сеттер прежнее и новое значения никогда не равны друг другу.
```

В отличие от геттера, свойства класса, используемые в коде сеттера, не рассматриваются как контекст его выполнения. Это значит, что факт изменения этих свойств не учитывается фреймворком при принятии решения о вызове сеттера.

Например:

```html run_edit_h=40_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id='button'>Текущее время</button>
<span id='span'></span>
<script type="module">
    class myClass extends ROCKS({
        text: "",
        counter: 0,
        set currentTime(n) {
            const d = new Date();
            this.text = d.toLocaleTimeString() + '.' + d.getMilliseconds() + ' — Счетчик: ' + myObject.counter;
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let button = document.getElementById("button");
    let span = document.getElementById("span");
    button.onclick = function() {
        myObject.counter++;
        myObject.currentTime = Math.floor(Date.now() / 10000);
        span.innerText = myObject.text;
    }
</script>
```

Данный пример аналогичен предыдущему, за исключением того, что добавлено свойство **counter** для подсчета нажатий на кнопку. Значение этого свойства используется в коде сеттера **currentTime** для формирования выводимой на экран строки. Хотя значение свойства **counter** меняется при каждом нажатии на кнопку, это не влияет на частоту вызова сеттера. Он по-прежнему вызывается только при смене присваиваемого ему значения. Значит фреймворк не учитывает используемые в сеттере свойства как часть контекста его выполнения.

Наличие или отсутствие у свойства с сеттером статического типа может влиять на принятие фремворком решения о вызове сеттера.

Например:

```html run_edit_h=60_
<!--script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js"></script-->
<script type="module" src="./rocks.js"></script>
<button id='button'>Текущее время</button>
<span id='span1'></span><br>
<span id='span2'></span>
<script type="module">
    class myClass extends ROCKS({
        text1: "",
        text2: "",
        counter: 0,
        currentTime1: {
            $type: Number,
            set(n) {
                const d = new Date();
                this.text1 = d.toLocaleTimeString() + '.' + d.getMilliseconds();
            }
        },
        currentTime2: {
            set(n) {
                const d = new Date();
                this.text2 = d.toLocaleTimeString() + '.' + d.getMilliseconds();
            }
        }
    }) {
        constructor() {
            super();
        }
    }

    let myObject = new myClass();
    let button = document.getElementById("button");
    let span1 = document.getElementById("span1");
    let span2 = document.getElementById("span2");
    button.onclick = function() {
        myObject.counter++;
        let seconds = Math.floor(Date.now() / 10000);
        if( myObject.counter % 2 )
            seconds = String(seconds);
        myObject.currentTime1 = seconds;
        span1.innerText = "Сеттер currentTime1: " + myObject.text1;
        myObject.currentTime2 = seconds;
        span2.innerText = "Сеттер currentTime2: " + myObject.text2;
    }
</script>
```

В этом примере свойство **currentTime1** с помощью модификатора **$type** объявлено со статическим типом **Number**. Также объявлено второе свойство **currentTime2**, но уже без фиксированного типа. Сеттеры в обоих свойствах выполняют одно и тоже действие — формируют строку с текущим временем в свойствах **text1** и **text2** соответственно. При каждом нажатии на кнопку обоим сеттерам присваивается количество десятков секунд прошедших с 1 января 1970 года. С помощью счетчика **counter** подсчитывается количество нажатий на кнопку, и в зависимости от его значения меняется тип значения, присваиваемого сеттерам. Оно может быт типа **String** при нечетном значении счетчика или **Number** — при четном. Можно было бы ожидать, что смена типа присваиваемого значения заставит фреймворк вызывать сеттеры при каждом нажатии на кнопку. Однако можно видеть, что при каждом нажатии вызывается только сеттер **currentTime2**, объявленное без типа. В свойстве **currentTime1**, имеющем статический тип **Number**, фреймворк перед принятием решения о вызове сеттера приводит присваиваемое значение к типу свойства и, в результате, не находит различий в пережнем и присваиваемом значении. Поэтому сеттер **currentTime1**, как и в предыдущих примерах, обновляет время только с периодом 10 секунд.

