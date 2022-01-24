Атрибут **listeners** используется для объявления обработчиков различных событий на уровне хоста компонента.

По своей структуре атрибут **listeners** является объектом. Его методы называются слушателями и выступают в качестве обработчиков соответствующих событий.

Имена слушателей **обязательно** должны совпадать с именами событий, для обработки которых эти слушатели предназначены.

Пример 1:

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button>{{text}}</button>
    `,
    props: {
        text: 'Нажми на меня левой или правой кнопкой мыши'
    },
    listeners: {
        tap() {
            this.text = "Нажата левая кнопка";
        },
        contextmenu() {
            this.text = "Нажата правая кнопка";
        }
    }
});
```

В отличии от директивы **@**, слушатели осуществляют обработку событий на уровне хоста компонента, а не на уровне его отдельных элементов. Поэтому установить действительный источник возникновения события в слушателе невозможно. В качестве него всегда будет выступать хост компонента вне зависимости от того, где на самом деле произошло событие.

Пример 2:

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div>{{text}}</div>
        <button>{{text}}</button>
    `,
    props: {
        text: 'Нажми на меня левой или правой кнопкой мыши'
    },
    listeners: {
        tap(e) {
            this.text = "Нажата левая кнопка на " + e.target.localName;
        },
        contextmenu(e) {
            this.text = "Нажата правая кнопка на " + e.target.localName;
        }
    }
});
```

Нажатие левой или правой кнопки мыши на любом элементе **div** или **button** в этом примере приведет к обработке соответствующего события, но узнать какой конкретно элемент вызвал генерацию этого события невозможно. Целевой элемент **target** внутри объекта события будет всегда указывать на хост компонента.

``` info_md
Такое поведение является естественным, так как при выходе за границу теневого дерева внутреннее содержимое компонента должно оставаться закрытым.
```

Если необходимо исключить какой-либо внутренний элемент компонента из обработки слушателем, то у него можно задать собственный обработчик того же самого события с помощью директивы **@** и предотвратить в нем дальнейшее всплытие события с помощью метода **stopPropagation**.

Пример 3:

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div @tap="$event.stopPropagation();">{{text}}</div>
        <button>{{text}}</button>
    `,
    props: {
        text: 'Нажми на меня левой или правой кнопкой мыши'
    },
    listeners: {
        tap() {
            this.text = "Нажата левая кнопка мыши";
        },
        contextmenu() {
            this.text = "Нажата правая кнопка мыши";
        }
    }
});
```

Вместо явного вызова метода **stopPropagation** можно использовать модификатор события **stop**. В этом случае предыдущий пример можно переписать следующим образом:

Пример 4:

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div @tap.stop>{{text}}</div>
        <button>{{text}}</button>
    `,
    props: {
        text: 'Нажми на меня левой или правой кнопкой мыши'
    },
    listeners: {
        tap() {
            this.text = "Нажата левая кнопка мыши";
        },
        contextmenu() {
            this.text = "Нажата правая кнопка мыши";
        }
    }
});
```

При щелчке левой кнопки мыши по элементу **div** слушатель компонента вызываться уже не будет.

В качестве слушателей можно использовать методы компонента. Для этого у объекта **listeners** необходимо объявить свойство — имя этого свойства будет определять имя события, для обработки которого этот слушатель назначается, а значение свойства будет задавать имя метода его обработчика.

Пример 5:

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div>{{text}}</div>
        <button>{{text}}</button>
    `,
    props: {
        text: 'Нажми на меня левой или правой кнопкой мыши'
    },
    _tap() {
        this.text = "Нажата левая кнопка мыши";
    },
    _contextmenu() {
        this.text = "Нажата правая кнопка мыши";
    },
    listeners: {
        'tap': '_tap',
        'contextmenu': '_contextmenu'
    }
});
```

``` warning_md
В одном свойстве нельзя объединить несколько разных событий, когда для них необходимо использовать один и тот же обработчик. Следующий пример будет содержать ошибку.
```

Пример 6:

```javascript error_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div>{{text}}</div>
        <button>{{text}}</button>
    `,
    props: {
        text: 'Нажми на меня левой или правой кнопкой мыши'
    },
    _click() {
        this.text = "Нажата кнопка мыши";
    },
    listeners: {
        'tap, contextmenu': '_click'
    },
});
```

Тем не менее у разных событий можно указывать один и тот же обработчик. Никакой ошибки в этом не будет.

Пример 7:

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div>{{text}}</div>
        <button>{{text}}</button>
    `,
    props: {
        text: 'Нажми на меня левой или правой кнопкой мыши'
    },
    _click(e) {
        this.text = "Нажата " + (e.type==="tap"? " левая " : " правая ") + "кнопка мыши";
    },
    listeners: {
        'tap': '_click',
        'contextmenu': '_click'
    }
});
```

Слушатели можно добавлять и удалять динамически с помощью специальных методов **listen** и **unlisten**.

Пример 8:

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div>{{text}}</div>
        <button>{{text}}</button>
        <p><input type="checkbox" ::checked="checked">{{checkboxLabel}}</p>
    `,
    _tap() {
            this.text = "Нажата левая кнопка мыши";
    },
    _contextmenu() {
            this.text = "Нажата правая кнопка мыши";
    },
    _addListeners()
    {
        this.listen('tap', '_tap');
        this.listen('contextmenu', '_contextmenu');
    },
    _deleteListeners()
    {
        this.unlisten('tap', '_tap');
        this.unlisten('contextmenu', '_contextmenu');
    },
    props: {
        text: 'Нажми на меня левой или правой кнопкой мыши',
        checked: {
            default: false,
            set(n) {
                n ? this._addListeners() : this._deleteListeners();
                this.checkboxLabel = n ? 'Удалить слушателей' : 'Назначить слушателей';
            }
        },
        checkboxLabel: 'Назначить слушателей'
    }
});
```

Этим методам передаются три параметра:

1. item — элемент, для которого назначается или удаляется слушатель.
1. event — имя события, для которого назначается или удаляется слушатель.
1. callback — имя обработчика события.

В этом примере нажатия на кнопки мыши изначально не будут обрабатываться. После добавления к компоненту слушателей, обработка событий появится. А после удаления слушателей, реакция на нажатия кнопок мыши вновь исчезнет.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/GxRfh9Ayuh8?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
