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

Используя возможности языка JavaScript, любое количество подстановок можно объединить в одну.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div>{{mustache1 + " " + mustache2}}</div>
    `,
    mustache1: 'Привет,',
    mustache2: 'Mustache!'
});
```

Данный пример аналогичен предыдущему, только сообщение стоится с помощью одной подстановки **{{ Mustache }}**, в коде которой значения свойств **mustache1** и **mustache2** объединяются операцией конкатенации.

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

В данном примере при нажатии на кнопку изменяется значение свойства **mustache**. Можно видеть, что новое значение сразу отображается на странице.

С точки зрения браузера CSS-правила в элементе **style** являются обычным текстовым узлом, поэтому их также можно динамически формировать с помощью подстановки **{{ Mustache }}**.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            {{selector}} {
                background: yellow;
                color: green;
                padding: 10px;
            }
        </style>
        <div id="div1" @tap="onTap">Щелкни по мне</div>
        <div id="div2" @tap="onTap">Щелкни по мне</div>
    `,
    selector: '#div1',
    onTap() {
        this.selector = this.selector == "#div1" ? "#div2" : "#div1";
    }
});
```

В данном примере в качестве селектора CSS-правила используется значение свойства **selector**, указанного в подстановке **{{ Mustache }}**. В обработчике нажатия левой клавиши мыши этому свойству поочередно присваивается идентификатор первого или второго элемента **div**. В результате, щелчком мыши можно переключать подсветку между первой и второй строками примера.

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

В данных примерах приведены варианты неправильного использования символа апострофа (**’**) совместно с подстановкой **{{ Mustache }}**. При нажатии на кнопку ее обработчик создет компонент, в HTML-шаблоне которого одновременно используются **{{ Mustache }}** и апостроф (или его эквивалентное представление). В результате в консоль браузера выдается сообщение:

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
