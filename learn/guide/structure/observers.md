Атрибут **observers** используется для объявления методов — обозревателей, вызывающихся автоматически при изменении любого из указанных свойств компонента в списке их параметров.

По своей структуре атрибут **observers** является массивом, элементы которого могут быть только именованными функциями. Эти функции называются обозревателями.

Обозреватели будут вызываться автоматически при изменении значения любого из свойств компонента, указанного в списке их параметров.

Пример 1:

```javascript _run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <label>Фамилия: <input ::value="lastName"></label>
        <label>Имя: <input ::value="firstName"></label>
        <div>Полное имя: {{fullName}}</div>
    `,
    props: {
        firstName: 'Николай',
        lastName: 'Иванов',
        fullName: '',
    },
    observers: [
        function nameObserver(lastName, firstName) {
            this.fullName = this.lastName + " " +  this.firstName;
        }
    ]
});
```

В данном примере изменение значений любого из свойств **lastName** или **firstName**  приведут к вызову обозревателя **nameObserver**, так как имена этих свойств указаны в его списке параметров. В результате этого он сформирует свойство **fullName**, все изменения которого будут динамически отображены в элементе **div** этого компонента.

``` warning_md
Имена параметров в обозревателе обязательно должны совпадать с именами свойств компонента.
```

``` error_md
Если хотя бы одно свойство, указанное в списке параметров, не будет существовать или его значение будет неопределенно, то обозреватель не будет вызываться.
```

Пример 2:

```javascript error_run_edit_console_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <label>Фамилия: <input ::value="lastName"></label>
        <label>Имя: <input ::value="firstName"></label>
        <div>Полное имя: {{fullName}}</div>
    `,
    props: {
        firstName: 'Николай',
        lastName: 'Иванов',
        fullName: '',
    },
    observers: [
        function nameObserver(lastName, firstName, middleName) {
            this.fullName = this.lastName + " " +  this.firstName + " " + this.middleName;
            console.log("Вызывался обозреватель");
        }
    ]
});
```

В этом примере свойство **middleName** не определено. Как следствие, обозреватель **nameObserver** не вызывается, а свойство **fullName** остается без инициализации — его значение будет пустым.

Такое поведение обозревателя гарантирует, что при создании компонента он будет вызван только один раз, когда всем указанным в нем свойствам будут присвоены их начальные значения.

В противном случае обозреватель вызывался бы неоднократно для каждого свойства при присвоении ему начального значения. Кроме этого в его теле могли оказаться свойства с неопределенным **undefined** значением, которые еще не были проинициализированы.

Пример 3:

```javascript _run_edit_console_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <label>Фамилия: <input ::value="lastName"></label>
        <label>Имя: <input ::value="firstName"></label>
        <div>Полное имя: {{fullName}}</div>
    `,
    props: {
        firstName: 'Николай',
        lastName: 'Иванов',
        fullName: '',
    },
    observers: [
        function nameObserver(lastName, firstName) {
            this.fullName = this.lastName + " " +  this.firstName;
            console.log("Вызывался обозреватель");
        }
    ]
});
```

Если открыть консоль в данном примере, то можно убедиться, что обозреватель **nameObserver** вызывается только один раз при создании компонента, а не два раза, как следовало бы ожидать при задании начального значения каждому из свойств: **lastName** и **firstName**. Уже после этого, обозреватель будет вызываться каждый раз при любом изменении значения этих свойств, так как их значения уже будут определены.

В качестве обозревателей можно использовать методы компонента. В этом случае их имена, включая список параметров, необходимо записать в одинарных или двойных кавычках, т.е. указывать в виде строковых литералов.

Пример 4:

```javascript _run_edit_console_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <label>Фамилия: <input ::value="lastName"></label>
        <label>Имя: <input ::value="firstName"></label>
        <div>Полное имя: {{fullName}}</div>
    `,
    props: {
        firstName: 'Николай',
        lastName: 'Иванов',
        fullName: '',
    },
    observers: [
        '_nameObserver(lastName, firstName)'
    ],
    _nameObserver(lastName, firstName) {
            this.fullName = this.lastName + " " +  this.firstName;
            console.log("Вызывался обозреватель");
    }
});
```

Результат работы этого примера будет аналогичен предыдущему, но обозреватель свойств в нем задается в виде отдельного метода компонента.

В массиве **observers** можно объявлять сразу несколько обозревателей. В этом случае они, как элементы массива, должны быть отделены друг от друга запятыми.

Пример 5:

```javascript _run_edit_console_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <label>Фамилия: <input ::value="lastName"></label>
        <label>Имя: <input ::value="firstName"></label>
        <div>Полное имя: {{fullName}}</div>
    `,
    props: {
        firstName: 'Николай',
        lastName: 'Иванов',
        fullName: '',
    },
    observers: [
        function nameObserver(lastName, firstName) {
            this.fullName = this.lastName + " " +  this.firstName;
            console.log("Вызывался обозреватель 1");
        },
        '_nameObserver(lastName, firstName)'
    ],
    _nameObserver(lastName, firstName) {
            this.fullName = this.lastName + " " +  this.firstName;
            console.log("Вызывался обозреватель 2");
    }
});
```

В данном примере один обозреватель задан в виде именованной функции, а другой — в виде метода компонента.

Если открыть консоль для этого примера, то можно убедиться, что оба обозревателя вызываются автоматически при любом изменении значения свойств, указанных в списке их параметров.

У любого свойства можно одновременно задать и наблюдатель и несколько обозревателей. В этом случае при изменении значения свойства сначала будут вызываться все его обозреватели, а только затем — наблюдатель.

Пример 6:

```javascript _run_edit_console_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <label>Фамилия: <input ::value="lastName"></label>
        <label>Имя: <input ::value="firstName"></label>
        <div>Полное имя: {{fullName}}</div>
    `,
    props: {
        firstName: 'Николай',
        lastName: {
            default: 'Иванов',
            set(n) {
                this.fullName = n;
                console.log("Вызывался наблюдатель");
            }
        },
        fullName: '',
    },
    observers: [
        function nameObserver(lastName, firstName) {
            this.fullName = this.lastName + " " +  this.firstName;
            console.log("Вызывался обозреватель");
        }
    ]
});
```

В данном примере при изменении свойства **lastName** обозреватель будет вызван первым. Поэтому в свойстве **fullName** окажется только фамилия, заданная наблюдателем, а не полное имя, первоначально сформированное обозревателем.

Кроме этого, если открыть консоль, то можно убедиться, что наблюдатель **set** не вызывается первый раз во время создания компонента, когда его свойству присваивается начальное значение. По этой причине наблюдатели нельзя использовать для задания начальных значений ни у каких свойств, в отличие от обозревателей.

``` info_md
Обозреватели вызываются первый раз перед хуком **ready** (тему «Хуки» вы можете найти [здесь](https://odajs.org/#learn/docs#learn/docs/guide/structure/hooks.md)) во время создания компонента. Поэтому они могут задать или изменить начальное значение у любого свойства, не указанного в их списке параметров.
```

Значения свойств, которые указаны в списке параметров обозревателя, можно изменять внутри его тела при условии, что эти изменения будут носить конечный характер.

Пример 7:

```javascript _run_edit_console_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <label>Фамилия: <input ::value="lastName"></label>
        <label>Имя: <input ::value="firstName"></label>
        <div>Полное имя: {{fullName}}</div>
    `,
    props: {
        firstName: 'Николай',
        lastName:  'Иванов',
        fullName: '',
    },
    observers: [
        function nameObserver(lastName, firstName) {
            this.lastName = this.lastName.toLowerCase();
            this.fullName = this.lastName + " " +  this.firstName;
            console.log("Вызывался обозреватель");
        }
    ]
});
```

В данном примере символы фамилии приводятся к нижнему регистру. Из-за это обозреватель будет вызывать сам себя до тех пор, пока все изменения свойств, указанных в его списке параметров, не прекратятся. В данном случае обозреватель будет вызван только два раза, так как после второго вызова значение свойства **lastName** в его теле уже изменятся не будет, и обозреватель перестанет вызывать сам себя.

Однако если изменения свойств, указанных в списке параметров, в теле обозревателя будут носит постоянный характер, то это приведет к возникновению бесконечной рекурсии, когда обозреватель будет сам вызывать себя до тех пор, пока не произойдет переполнение стека вызовов в браузере.

Пример 8:

```javascript error_run_edit_console_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <label>Фамилия: <input ::value="lastName"></label>
        <label>Имя: <input ::value="firstName"></label>
        <div>Полное имя: {{fullName}}</div>
    `,
    props: {
        firstName: 'Николай',
        lastName:  'Иванов',
        fullName: '',
    },
    observers: [
        function nameObserver(lastName, firstName) {
            if (this.lastName[0] === this.lastName[0].toUpperCase())
                this.lastName = this.lastName.toLowerCase();
            else
                this.lastName = this.lastName.toUpperCase();
            this.fullName = this.lastName + " " +  this.firstName;
            console.log("Вызывался обозреватель");
        }
    ]
});
```

Здесь значение свойства **lastName** будет постоянно изменяться в теле обозревателя, что приведет к возникновению бесконечной рекурсии. Из-за этого стек вызова браузера переполнится и компонент будет неправильно отображен на HTML-странице.

Еще одной отличительной особенностью обозревателей является то, что они могут вызываться при изменении значений сразу у нескольких свойств, указанных в списке их параметров, а не у одного свойства, как это происходит в наблюдателях.

Однако в обозревателе нельзя узнать какое конкретное свойство было изменено и какое предыдущее значение было у этого свойства. Все свойства передаются обозревателю в списке параметров только с текущими значениями.

В отличие от обозревателей, в наблюдателях можно узнать как новое, так и старое значение свойства, в котором они были объявлены.

Пример 9:

```javascript _run_edit_console_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <label>Фамилия: <input ::value="lastName"></label><br>
        <label>Имя: <input ::value="firstName"></label>
        <div>Полное имя: {{fullName}}</div>
    `,
    props: {
        firstName: 'Николай',
        lastName: {
            default: 'Иванов',
            set(n, o) {
                this.fullName = 'Новая фамилия: ' + n + 'Старая фамилия: ' + o;
            }
        },
        fullName: '',
    },
    observers: [
        function nameObserver(lastName, firstName) {
            this.fullName = 'Изменилось полное имя: ' + this.lastName + " " +  this.firstName;
        }
    ]
});
```

В данном примере можно узнать как новую фамилию, так и старую — в наблюдателе свойства **lastName**. Но через обозреватель старое имя или фамилию узнать невозможно. Все значения свойств будут новыми.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/vbvbtfF84no?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>

