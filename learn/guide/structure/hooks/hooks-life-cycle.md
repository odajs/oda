Хуки (**Hooks**) – это функции, которые позволяют вызывать пользовательские методы в определенные моменты жизненного цикла компонента.

Имена пользовательских методов и места их вызова строго определены жизненным циклом компонента, который можно представить в виде следующей диаграммы:

![Диаграмма жизненного цикла компонента](./learn/images/life-cycle-title.svg "Жизненный цикл компонента")

Хуки позволяют расширять функциональные возможности фреймворка за счет вызова пользовательских методов в определенных местах, предусмотренных разработчиками платформы, без необходимости модификации его ядра.

Имена предопределенных хуков и их назначение представлены в следующей таблице.

| Имя хука           | Назначение |
|:------------------:|:----------:|
| created           | Выполняется после инициализации свойств, но до обработки шаблона в конструкторе класса компонента. |
| ready            | Вызывается в самом конце конструктора класса компонента после рендеринга его шаблона. |
| attached              | Выполняется в конце колбэка **connectedCallback**, вызываемого во время вставки компонента в DOM. |
| detached              | Выполняется в процессе удаления компонента из DOM в конце колбэка **disconnectedCallback**. |

Если у компонента есть методы с указанными именами, то эти методы будут вызываться соответствующими хуками.

Например:

```javascript _run_edit_console_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div>Привет, Hooks! Открой консоль.</div>
    `,
    created() {
        console.log('created');
    },
    ready() {
        console.log('ready');
    },
    attached() {
        console.log('attached');
    },
    detached() {
        console.log('detached');
    }
});
```

При вызове метода каждый хук дополнительно генерирует пользовательское событие с именем соответствующего хука, которое можно обработать слушателем компонента.

```javascript _run_edit_console_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div>Привет, Hooks! Открой консоль.</div>
    `,
    created() {
        window.addEventListener('attached', e =>{
                  console.log('Event ready');
        });
        console.log('Хук created');
    },
    ready() {
        console.log('Хук ready');
    },
    attached() {
        console.log('Хук attached');
    },
    detached() {
        console.log('Хук detached');
    },
    listeners: {
        created() {
            console.log('Event created');
        },
        ready() {
            console.log('Event created');
        },
        attached() {
            console.log('Event attached');
        },
        detached() {
           console.log('Event detached');
        }
    }
});
```

Однако в слушателях можно отловить только событие **attached**, так как во всех остальных случаях события не будут доходить до компонента, а его слушатели еще или уже не будут зарегистрированы.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/jtPY3SU4HWM?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
