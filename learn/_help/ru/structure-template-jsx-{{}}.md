Интерполяционная подстановка используется для динамического формирования содержимого текстового узла HTML-элемента.

Интерполяционная подстановка указывается в двойных фигурных скобках **{{}}** (Mustache). В скобках можно записать любое выражение на языке JavaScript, в том числе содержащее свойства и методы компонента.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div>Привет, {{mustache}}</div>
    `,
    mustache: 'Mustache!'
});
```

Интерполяционная подстановка может многократно использоваться в текстовом узле.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div>{{mustache1}} {{mustache2}}</div>
    `,
    mustache1: 'Привет,',
    mustache2: 'Mustache!'
});
```

Данный пример аналогичен предыдущему, только сообщение выводится с помощью двух подстановок **{{ Mustache }}**, а не одной.

Интерполяционная подстановка поддерживает механизм реактивности, т.е. автоматически изменяет содержимое текстового узла при изменении значений используемых в ней свойств компонента.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div>{{mustache}}</div>
        <button @tap="onTap">Нажми меня</button>
    `,
    mustache: 'Привет, Mustache!',
    onTap() {
        this.mustache = this.mustache=='Привет, Mustache!' ? 'Mustache, привет!': 'Привет, Mustache!';
    }
});
```

В данном примере при нажатии на кнопку изменяется значение свойства **mustache**. Можно видеть, что подстановка **{{ Mustache }}** сразу отображает эти изменения на странице.

В HTML-шаблоне можно применять нативные интерполяционные подстановки языка JavaScript — фигурные скобки со знаком доллара:

```text hideGutter_md
**${** *JS-выражение* **}**
```

В такой подстановке можно использовать все возможности языка JavaScript, но свойства и методы компонента в них будут не доступны, так как выражение в фигурных скобках будет выполняться интерпретатором языка JavaScript до создания компонента.

Например,

```javascript _run_edit_error_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div>Указатель на компонент: ${this}</div>
    `
});
```

Как видно из примера, в момент вычисления интерполяционной подстановки **${}** указатель **this** не определён, т.к. компонент еще не создан.

```warning_md
В текущей версии фреймворка нельзя использовать одновременно символ апострофа (**’**) и подстановку **{{ Mustache }}** в одном текстовом узле. Использование экранированного апострофа **\’**, его мнемоники **&amp;apos;** и кода **&amp;#39;** также недопустимо.
```

Например,

```html run_edit_error_h=30_
<script type="module" src="./oda.js"></script>
<button id="button">Создать компонент</button>
<script type="module">
    button.onclick = function() {
        ODA({
            is: 'my-component',
            template: `
                <div>{{mustache}} ' </div>
            `,
            mustache: 'Символ апострофа:'
        });
    }
</script>
```

```html run_edit_error_h=30_
<script type="module" src="./oda.js"></script>
<button id="button">Создать компонент</button>
<script type="module">
    button.onclick = function() {
        ODA({
            is: 'my-component',
            template: `
                <div>{{mustache}} \' </div>
            `,
            mustache: 'Экранированный апостроф:'
        });
    }
</script>
```

```html run_edit_error_h=30_
<script type="module" src="./oda.js"></script>
<button id="button">Создать компонент</button>
<script type="module">
    button.onclick = function() {
        ODA({
            is: 'my-component',
            template: `
                <div>{{mustache}} &apos; </div>
            `,
            mustache: 'Мнемоника апострофа:'
        });
    }
</script>
```

```html run_edit_error_h=30_
<script type="module" src="./oda.js"></script>
<button id="button">Создать компонент</button>
<script type="module">
    button.onclick = function() {
        ODA({
            is: 'my-component',
            template: `
                <div>{{mustache}} &#39; </div>
            `,
            mustache: 'Код апострофа:'
        });
    }
</script>
```

В данных примерах приведены варианты неправильного использования символа апострофа (**’**) совместно с подстановкой **{{ Mustache }}**. При нажатии на кнопку ее обработчик пытается создать компонент, в HTML-шаблоне которого одновременно используются **{{ Mustache }}** и апостроф (или его эквивалентное представление). В результате возникает исключение:

![Консоль браузера](learn/_help/ru/_images/structure-template-jsx-{{}}-1.png "Консоль браузера")

Чтобы обойти это ограничение необходимо вынести апостроф за пределы текстового узла. Например, поместить его в собственные теги.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div>
            <span>'</span>{{mustache}}<span>'</span>
        </div>
    `,
    mustache: "Я заключен в апострофы"
});
```

Также апостроф можно заключить в двойные кавычки **" ' "** и сделать частью JavaScript-выражения внутри интерполяционной подстановки.

Например так,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div>{{"'" + mustache + "'"}}</div>
    `,
    mustache: "Я заключен в апострофы"
});
```

Или так,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div>{{"'"}}{{mustache}}{{"'"}}</div>
    `,
    mustache: "Я заключен в апострофы"
});
```

