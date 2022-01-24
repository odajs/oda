Для обработки различных событий у внутренних элементов компонента используется директива **@**.

Имя обрабатываемого события указывается сразу после этой директивы, а его обработчик записывается после имени события через знак равенства в одинарных или двойных кавычках.

Например:

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <span>Счетчик: {{count+" "}}</span>
        <button @tap="_onTap">Кнопка</button>
    `,
    props: {
        count: 0
    },
    _onTap() {
        this.count++;
    }
});
```

При возникновении указанного события обработчик будет вызываться автоматически, благодаря чему компонент получает возможность реагировать на действия пользователя.

Например, при нажатии на кнопку **button** счетчик **count** будет увеличиваться на единицу, так как в обработчике **_onTap** события **tap** задана операция инкремента его значения.

В качестве обработчиков события могут выступать:

1. Методы компонента.
2. Любое JS-выражение.

Если, как и в предыдущем примере, в кавычках указано имя метода, то обработчиком события будет метод компонента.

В списке его параметров можно указать ссылку на объект, используя которую можно получить дополнительную информации о событии.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <span>Счетчик: {{count+" "}}</span>
        <button @tap="_onTap">{{text}}</button>
        <div>Внутренний источник: {{innerTarget}}</div>
    `,
    props: {
        count: 0,
        text: 'Кнопка',
        innerTarget: ''
    },
    _onTap(e) {
        this.count++;
        this.innerTarget = e.target.localName;
    }
});
```

В этом компоненте выводится имя элемента, который при щелчке левой кнопкой мыши по элементу **button** стал источником возникновения события.

В процессе всплытия целевой источник события автоматически изменяется при переходе через теневое дерево компонента. Источником всегда становится сам компонент.

Например:

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <span>Счетчик: {{count+" "}}</span>
        <button @tap="_onTap">{{text}}</button>
        <div>Внутренний источник: {{innerTarget}}</div>
        <div>Внешний источник: {{outerTarget}}</div>
    `,
    props: {
        count: 0,
        text: 'Кнопка',
        innerTarget: '',
        outerTarget: ''
    },
    _onTap(e) {
        this.count++;
        this.innerTarget = e.target.localName;
    },
    listeners: {
        tap(e) {
            this.outerTarget = e.target.localName;
        }
    }
});
```

Эта особенность (**retargeting**) определяется самим браузером и позволяет скрыть внутреннюю детализацию компонента. В результате этого невозможно узнать какой элемент стал источником возникновения события за границами теневого дерева. В качестве него всегда будет выступать сам компонент.

``` info_md
Обратите внимание, что исходные события автоматически оборачиваются в пользовательское событие с типом **odaCustomEvent**.
```

Из-за этого узнать часть информации об исходном событии явно не удастся. Например, в объекте события нельзя непосредственно узнать координаты щелчка мыши: **clientX** и **clientY**, левая или правая кнопка была нажата и т.д.

```javascript error_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <span>Счетчик: {{count+" "}}</span>
        <button @tap="_onTap">{{text}}</button>
        <div>Координата X: {{clientX}}</div>
        <div>Координата Y: {{clientY}}</div>
    `,
    props: {
        count: 0,
        text: 'Кнопка',
        clientX: '',
        clientY: ''
    },
    _onTap(e, d) {
        this.count++;
        this.clientX = e.clientX;
        this.clientY = e.clientY;
    }
});
```

Если в этом есть особая необходимость, то исходное событие можно найти в свойстве **detail** пользовательского события под именем **sourceEvent**.

Получить доступ к нему можно через второй параметр **$detail** метода обработчика события, которому он передается автоматически.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <span>Счетчик: {{count+" "}}</span>
        <button @tap="_onTap">{{text}}</button>
        <div>Координата X: {{clientX}}</div>
        <div>Координата Y: {{clientY}}</div>
    `,
    props: {
        count: 0,
        text: 'Кнопка',
        clientX: '',
        clientY: ''
    },
    _onTap(e, d) {
        this.count++;
        this.clientX = d.sourceEvent.clientX;
        this.clientY = d.sourceEvent.clientY;
    },
    listeners: {
        tap(e) {
            this.text = e.target.localName;
        }
    }
});
```

Свойство **sourceEvent** есть у самого события, и обратиться к нему явно можно через сам указатель на объект.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <span>Счетчик: {{count+" "}}</span>
        <button @tap="_onTap">{{text}}</button>
        <div>Координата X: {{clientX}}</div>
        <div>Координата Y: {{clientY}}</div>
    `,
    props: {
        count: 0,
        text: 'Кнопка',
        clientX: '',
        clientY: ''
    },
    _onTap(e) {
        this.count++;
        this.clientX = e.sourceEvent.clientX;
        this.clientY = e.sourceEvent.clientY;
    }
});
```

В этом случае не нужно явно указывать второй параметр у обработчика события.

При переходе через теневое дерево свойство **sourceEvent** тоже изменяется.

```javascript error_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <span>Счетчик: {{count+" "}}</span>
        <button @tap="_onTap">{{text}}</button>
        <div>Координата X: {{clientX}}</div>
        <div>Координата Y: {{clientY}}</div>
    `,
    props: {
        count: 0,
        text: 'Кнопка',
        clientX: '',
        clientY: ''
    },
    listeners: {
        tap(e) {
            this.count++;
            this.clientX = e.sourceEvent.clientX;
            this.clientY = e.sourceEvent.clientY;
        }
    }
});
```

Координаты щелчка будут отображаться относительно компонента, а не кнопки. В результате этого узнать внутренний источник события снова будет невозможно. Информационная защищенность компонента не пострадает.

У каждого события можно через точку указать специальные модификаторы.

В настоящее время используется два таких модификатора:

1. stop — останавливает дальнейшей всплытие события.
2. prevent — запрещает обработку события по умолчанию.

Модификатор **stop** останавливает дальнейшее всплытие, фактически вызывая для события метод **stopPropagation**.

```javascript _run_edit_console_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <label>Меня нажали {{count}} раз <input type="checkbox" @click="_onTap"/> </label>
    `,
    props: {
        count: 0
    },
    _onTap(e) {
        this.count++;
        console.log(e.target);
    },
    listeners : {
        click(e) {
           this.count++;
           console.log(e.target);
        }

    }
});
```

В этом примере задан обработчик **_onTap**, который срабатывает при возникновения события **tap**.

Вместо метода можно указывать inline-выражение. Например:

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <span>{{count}}</span>
        <button @tap="count++">Кнопка</button>
    `,
    props: {
        count: 0
    }
});
```

Данный пример будет работать аналогично предыдущему, но inline-выражение в нем будет выполняться при каждом возникновении указанного события.
