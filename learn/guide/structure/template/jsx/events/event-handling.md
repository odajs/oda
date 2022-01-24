В качестве обработчиков событий могут выступать:

1. Методы компонента.
2. Любые inline-выражения.

Если в директиве **@** указано имя метода, то этот метод компонента и будет обработчиком события.

Например:

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <span>Счетчик: {{count + ' '}}</span>
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

Если в директиве **@** указано inline-выражение, то событию будет автоматически назначен обработчик, в теле которого и будет выполняться это выражение.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <span>Счетчик: {{count + ' '}}</span>
        <button @tap="count++">Кнопка</button>
    `,
    props: {
        count: 0
    }
});
```

Метод компонента можно вызвать в контексте inline-выражения. Для этого будет достаточно записать после его имени круглые скобки с параметрами или без.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <span>Счетчик: {{label}}</span>
        <button @tap="label = _onTap() + ' '">Кнопка</button>
    `,
    props: {
        count: 0,
        label: '0 '
    },
    _onTap() {
        return ++this.count;
    }
});
```

При такой форме записи в inline-выражение будет подставлено значение, возвращаемое методом при каждом нажатии на кнопку.

Если в inline-выражении у метода не указать круглые скобки, то этот метод вызываться не будет. Вместо этого будет возвращаться значение свойства компонента, в котором это метод был объявлен.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <span>Счетчик: {{label}}</span>
        <button @tap="label = _onTap + ' '">Кнопка</button>
    `,
    props: {
        count: 0,
        label: '0 '
    },
    _onTap() {
        return ++this.count;
    }
});
```

В inline-выражениях и в интерполяционной подстановке **{{}}** ключевое слово **this** можно не указывать. Оно подставляется автоматически ко всем элементам компонента с помощью инструкции **with**. Тем не менее, если указать **this** явно, то никакой ошибки не будет.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <span>Счетчик: {{this.label}}</span>
        <button @tap="label = this._onTap() + ' '">Кнопка</button>
    `,
    props: {
        count: 0,
        label: '0 '
    },
    _onTap() {
        return ++this.count;
    }
});
```

Однако такая форма записи будет более сложной и куда менее наглядной, поэтому использовать ее не рекомендуется.

Кроме того, имя метода с ключевым словом **this** и без указания круглых скобок будет восприниматься как inline-выражение, т.е. в данном случае метод не будет вызываться в качестве обработчика события.

```javascript error_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <span>Счетчик: {{label}}</span>
        <button @tap="this._onTap">Кнопка</button>
    `,
    props: {
        count: 0,
        label: '0 '
    },
    _onTap() {
        this.label = ++this.count + ' ';
    }
});
```

Если в директиве **@** убрать указатель **this**, то компонент начнет работать так, как это ожидалось, т.е. метод **_onTap** будет вызываться как обработчик соответствующего события.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <span>Счетчик: {{label}}</span>
        <button @tap="_onTap">Кнопка</button>
    `,
    props: {
        count: 0,
        label: '0 '
    },
    _onTap() {
        this.label = ++this.count + ' ';
    }
});
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/bUmIQhC8AvQ?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
