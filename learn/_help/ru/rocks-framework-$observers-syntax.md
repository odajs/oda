Обозреватели — это специальные методы, которые вызываются автоматически после изменения значения любого из свойств объекта, указанных в списке их параметров.

Для создания обозревателя необходимо в объекте с предопределенным именем **$observers** создать метод, у которого в списке параметров через запятую указать имена контролируемых свойств.

```faq_md
На самом деле **$observers** является псевдообъектом, который указывает фреймворку, что объявленные в нем методы являются обозревателями.
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
        x1: 0,
        x2: 0,
        sum: 0,
        $observers: {
            sumUp(x1, x2) {
                this.sum = this.x1 + this.x2;
            },
            print(sum) {
                let div = document.getElementById("div");
                div.innerText = "Сумма: " + this.sum;
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

В данном примере в объекте **$observers** объявлены обозреватели **sumUp** и **print**. Первый обозреватель отслеживает свойства **x1** и **x2** суммирует их значения и записывает результат в свойство **sum**. Это свойство отслеживается вторым обозревателем, который выводит его значение на страницу. Изменение значений свойств **x1** и **x2** в строках ввода **«1-е слагаемое»** и **«2-е слагаемое»** приводит к автоматическому вызову обозревателя **sumUp**, который пересчитывает сумму и записывает ее в свойство **sum**. В свою очередь это приводит к вызову обозревателя **print**, который выводит новое значение суммы на экран.

Можно объявить несколько обозревателей, отслеживающих одни и те же свойства. При изменении значения таких свойств будут вызваны все связанные с ними обозреватели. Последовательность вызова обозревателей фреймворком не контролируется.

Например:

```html run_edit_h=75_
<!--script type="module" src='https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js'></script-->
<script type="module" src="./rocks.js"></script>
<label>1-е слагаемое: <input id='input1' type='number' value='0'></label>
<label>2-е слагаемое: <input id='input2' type='number' value='0'></label>
<div id='div1'></div>
<div id='div2'></div>
<script type="module">
    class myClass extends ROCKS({
        x1: 0,
        x2: 0,
        sum: 0,
        $observers: {
            sumUp(x1, x2) {
                this.sum = this.x1 + this.x2;
            },
            print(sum) {
                let div1 = document.getElementById("div1");
                div1.innerText = "Сумма: " + this.sum;
            },
            multiply(x1, x2) {
                let div2 = document.getElementById("div2");
                div2.innerText = "Произведение: " + this.x1 * this.x2;
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

В данном примере добавлен обозреватель **multiply**, который отслеживает те же свойства **x1** и **x2**, что и обозреватель **sumUp**. Можно видеть, что изменение значения любого из указанных свойств вызывает оба обозревателя.

Если обозреватель имеет большой объем кода, то его полное объявление в объекте **$observers** снижает читабельность программы и усложняет ее сопровождение. В этом случае объявление метода обозревателя целесообразно вынести за пределы объекта **$observers**, а в самом объекте указать ссылку на метод. Для этого в объекте **$observers** необходимо создать свойство одноименное методу, а в качестве его значения использовать сроку с именами отслеживаемых свойств, разделенных запятыми. В строку со списком свойств можно вставлять пробелы для улучшения зрительного восприятия списка, лишние пробелы будут проигнорированы.

Например:

```html run_edit_h=55_
<!--script type="module" src='https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js'></script-->
<script type="module" src="./rocks.js"></script>
<label>1-е слагаемое: <input id='input1' type='number' value='0'></label>
<label>2-е слагаемое: <input id='input2' type='number' value='0'></label>
<div id='div'></div>
<script type="module">
    class myClass extends ROCKS({
        x1: 0,
        x2: 0,
        sum: 0,
        $observers: {
            sumUp: "x1, x2",
            print(sum) {
                let div = document.getElementById("div");
                div.innerText = "Сумма: " + this.sum;
            }
        },
        sumUp(x1, x2) {
            this.sum = this.x1 + this.x2;
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

Данный пример аналогичен предыдущему, за исключением того, что объявление метода обозревателя **sumUp** вынесено за пределы объекта **$observers**. Вместо этого в самом объекте объявлено одноименное свойство **sumUp** со значением типа строка, содержащем имена отслеживаемых свойств **x1** и **x2**.

В предыдущих примерах в коде обозревателя использовался доступ непосредственно к отслеживаемым свойствам через указатель **this**. Также значения отслеживаемых свойств можно получить через одноименные параметры обозревателя.

Например:

```html run_edit_h=55_
<!--script type="module" src='https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js'></script-->
<script type="module" src="./rocks.js"></script>
<label>1-е слагаемое: <input id='input1' type='number' value='0'></label>
<label>2-е слагаемое: <input id='input2' type='number' value='0'></label>
<div id='div'></div>
<script type="module">
    class myClass extends ROCKS({
        x1: 0,
        x2: 0,
        sum: 0,
        $observers: {
            sumUp: "x1, x2",
            print(sum) {
                let div = document.getElementById("div");
                div.innerText = "Сумма: " + sum;
            }
        },
        sumUp(x1, x2) {
            this.sum = x1 + x2;
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

Данный пример аналогичен предыдущему, за исключение того, что значения свойств берутся из параметров **x1**, **x2** и **sum** обозревателей.

```warning_md
Переменные в параметрах обозревателя содержат те же значения, что и соответствующие им отслеживаемые свойства. Все же рекомендуется в коде обозревателя значения свойств брать непосредственно из самих свойств, обращаясь к ним через указатель **this**. Если метод обозревателя объявлен за пределами объекта **$observers**, то использование значений из параметров потенциально может привести к трудно обнаружимым ошибкам.
```

Например:

```html run_edit_error_h=55_
<!--script type="module" src='https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js'></script-->
<script type="module" src="./rocks.js"></script>
<label>1-е слагаемое: <input id='input1' type='number' value='0'></label>
<label>2-е слагаемое: <input id='input2' type='number' value='0'></label>
<div id='div'></div>
<script type="module">
    class myClass extends ROCKS({
        x1: 0,
        x2: 0,
        $observers: {
            sumUp: "x2, x1"
        },
        sumUp(x1, x2) {
            let div = document.getElementById("div");
            div.innerText = "1-е слагаемое: " + x1 + " — 2-е слагаемое: " + x2;
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

В данном примере метод обозревателя **sumUp** объявлен за пределами объекта **$observers**. В самом объекте для ссылки на этот метод объявлено одноименное свойство **sumUp**, которое инициализировано строкой с перечнем отслеживаемых свойств **x1** и **x2**. Однако порядок имен свойств в перечне не соответствует порядку имен в параметрах метода обозревателя. В результате на экран вместо значения 1-го слагаемого выводится значение 2-го слагаемого, и, наоборот, вместо значения 2-го слагаемого выводится значение 1-го слагаемого. Подобная ошибка не возникла бы, если бы значения свойств брались не из параметров обозревателя, а непосредственно из самих свойств.

Например:

```html run_edit_h=55_
<!--script type="module" src='https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js'></script-->
<script type="module" src="./rocks.js"></script>
<label>1-е слагаемое: <input id='input1' type='number' value='0'></label>
<label>2-е слагаемое: <input id='input2' type='number' value='0'></label>
<div id='div'></div>
<script type="module">
    class myClass extends ROCKS({
        x1: 0,
        x2: 0,
        $observers: {
            sumUp: "x2, x1"
        },
        sumUp(x1, x2) {
            let div = document.getElementById("div");
            div.innerText = "1-е слагаемое: " + this.x1 + " — 2-е слагаемое: " + this.x2;
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

Мы исправили предыдущий пример, заменив в обозревателе **sumUp** чтение значений из параметров на чтение значений непосредственно из свойств. В результате пример работает правильно, не смотря на несоответствие порядка имен свойств в списке в объекте **$observers** и в списке параметров метода обозревателя.

```info_md
Если метод обозревателя объявлен за пределами объекта **$observers**, то его можно объявить вообще без параметров. Привязка метода к отслеживаемым свойствам в любом случае осуществляется по списку свойств в указателе, объявленном в объекте **$observers**, а доступ к значениям свойств можно осуществляться с помощью указателя **this**.
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
        x1: 0,
        x2: 0,
        $observers: {
            sumUp: "x2, x1"
        },
        sumUp() {
            let div = document.getElementById("div");
            div.innerText = "1-е слагаемое: " + this.x1 + " — 2-е слагаемое: " + this.x2;
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

Данный пример аналогичен предыдущему, за исключение того, что метод обозревателя **sumUp** объявлен без параметров. Однако благодаря тому, что отслеживаемые свойства **x1** и **x2** перечислены в списке в свойстве **sumUp**, объявленном в объекте **$observers**, обозреватель вызывается при каждом изменении значения указанных свойств.

Для объявления обозревателей вместо объекта **$observers** можно использовать массив с тем же именем. В этом случае методы обозревателей задаются как массив анонимных функций, у которых в списке параметров через запятую указаны имена отслеживаемых свойств. В массиве **$observers** нельзя использовать ссылки на методы обозревателей, объявленные за пределами массива. В остальном объявление обозревателей в массиве ничем не отличается от объявления в объекте **$observers**.

Например:

```html run_edit_h=55_
<!--script type="module" src='https://cdn.jsdelivr.net/gh/odajs/oda/rocks.js'></script-->
<script type="module" src="./rocks.js"></script>
<label>1-е слагаемое: <input id='input1' type='number' value='0'></label>
<label>2-е слагаемое: <input id='input2' type='number' value='0'></label>
<div id='div'></div>
<script type="module">
    class myClass extends ROCKS({
        x1: 0,
        x2: 0,
        sum: 0,
        $observers: [
            function(x1, x2) {
                this.sum = this.x1 + this.x2;
            },
            function(sum) {
                let div = document.getElementById("div");
                div.innerText = "Сумма: " + this.sum;
            }
        ]
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

В данном примере в массиве **$observers** объявлены две анонимные функции. В параметрах первой функции указаны переменные **x1** и **x2**, соответственно первый обозреватель будет отслеживать свойства **x1** и **x2**. В параметрах второй функции указана переменная **sum**, т.е. второй обозреватель будет отслеживать свойство **sum**.

