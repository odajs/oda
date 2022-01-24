**Метод** – это функция, объявленная внутри компонента и предназначенная для выполнения определенных действий.

Методы задаются внутри компонента также, как и обычные функции языка JavaScript.

Пример 1:

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button @tap="_onTap">{{text}}</button>
    `,
    props: {
        text: "Кнопка"
    },
    _onTap() {
        this.text = "Привет, метод!";
    }
});
```

Фактически любая функция, объявленная как свойство компонента, становится его методом. Однако можно не использовать полную форму записи с указанием ключевого слова **function** и двоеточия после имени метода.

Пример 2:

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button @tap="_onTap">{{text}}</button>
    `,
    props: {
        text: "Кнопка"
    },
    _onTap: function() {
        this.text = "Привет, метод!";
    }
});
```

Упрощенная форма, представленная в первом примере, является более предпочтительной, так как она проще и нагляднее. Тем не менее оба варианта являются практически одинаковыми.

При обращении к любому элементу компонента в теле метода всегда необходимо указывать ключевое слово **this** через оператор доступа **.** (точка).

Пример 3:

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button @tap="_onTap">{{text}}</button>
    `,
    props: {
        text: "Кнопка"
    },
    _onTap() {
        this.text = this.localName;
    }
});
```

Слово **this** внутри компонента всегда ссылается на его тэг, т.е. фактически является хостом компонента.

Этот указатель можно не использовать как в inline-выражениях, так и в интерполяционных подстановках **{{}}**. В них весь контент автоматически привязывается к хосту компонента с помощью инструкции **with**. Тем не менее если указать слово **this**, то никакой ошибки не будет.

Пример 4:

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button @tap="_onTap">{{this.text}}</button>
    `,
    props: {
        text: "Кнопка"
    },
    _onTap() {
        this.text = "Привет, метод!";
    }
});
```

Такая запись просто становится менее читаемой и поэтому ее лучше не использовать.

``` info_md
Обратите внимание, что при вызове метода обязательно нужно указывать круглые скобки, даже если у этого метода нет параметров.
```

Пример 5:

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button>{{_getText()}}</button>
    `,
    _getText() {
        return "Привет, метод!";
    }
});
```

Если круглые скобки не указать, то вместо вызова метода будет возвращено значение свойства компонента, в котором он был объявлен.

Пример 6:

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button>{{_getText}}</button>
    `,
    _getText() {
        return "Привет, this!";
    }
});
```

Если необходимо использовать имя метода в директивах, то ключевое слово **this** указывать нельзя. В противном случае имя метода будет рассматриваться как свойство компонента.

Пример 7:

```javascript error_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button>{{this._getText}}</button>
    `,
    _getText() {
        return "Привет, this!";
    }
});
```

Если метод указывается в директиве в качестве обработчика, то круглые скобки после его имени указывать не нужно. Они будут добавлены автоматически при вызове метода.

Пример 8:

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button :text="_getText"></button>
    `,
    _getText() {
        return "Привет, метод!";
    }
});
```

Если все же указать скобки, то никакой ошибки не будет, однако метод станет вызываться в контексте inline-выражения.

Пример 9:

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button :text="_getText()+'!'"></button>
    `,
    _getText() {
        return "Привет, метод";
    }
});
```

Если в этом контексте не указать круглые скобки, то при нахождении значения inline-выражения метод станет рассматриваться как свойство компонента.

Пример 10:

```javascript error_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button :text="_getText+'!'"></button>
    `,
    _getText() {
        return "Привет, метод";
    }
});
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/yHK2Vm5ghaA?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
