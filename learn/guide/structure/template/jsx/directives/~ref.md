Директива **~ref** предназначена для создания прямой ссылки на HTML-элемент. Для создания ссылки в директиве необходимо указать уникальный идентификатор элемента. Идентификатор представляет собой символьную строку, формируемую JavaScript-выражением. Все ссылки сохраняются в специальном объекте **$refs**, и обращение к ссылке осуществляется через вызов объекта **$refs** с указанием идентификатора ссылки:

Пример 1
```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <span ~ref="firstName+lastName" @tap="_changeSpan">{{myText}}</span>
    `,
    props: {
        firstName: "my",
        lastName : "Span",
        myText: "Нажми на меня"
    },
    _changeSpan() {
        this.myText = this.$refs.mySpan.textContent === 'Нажми на меня' ? 'Щелкни по мне' : 'Нажми на меня';
    }
});
```

```info_md
Используйте ссылки, созданные директивой **~ref**, только для получения текущего значения свойств элементов. **Никогда** не изменяйте значения свойств элементов c использованием ссылок. Значения свойств элементов можно менять только изменяя связанные с ними свойства самого компонента. Всякое прямое воздействия на DOM во фреймворке **запрещено**.
```

Пример 2
```javascript_error_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <span ~ref="firstName+lastName" @tap="_changeSpan">Нажми на меня</span>
    `,
    props: {
        firstName: "my",
        lastName : "Span"
    },
    _changeSpan() {
        this.$refs.mySpan.textContent = this.$refs.mySpan.textContent === 'Нажми на меня' ? 'Щелкни по мне' : 'Нажми на меня';
    }
});
```

```error_md
В данном примере изменение свойства textContent элемента **span** осуществляется через ссылку, созданную директивой **~ref**. Пример очень простой, поэтому работает правильно, но в реальном проекте прямое воздействия на DOM может привести к непредсказуемой и трудно обнаружимой ошибке.
```

```warning_md
Директиву **~ref** нужно использовать крайне аккуратно. Она формирует список всех связанных элементов и хранит их в отдельном объекте. Если компонент будет сложным, и количество ссылок **~ref** в нем будет велико, то это может привести к неоправданно большим затратам памяти и времени на формирование списка. Для отдельных элементов, где это вообще возможно, более эффективной стратегией будет использование обычных свойств.
```
Пример 3
```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <span @tap="_changeSpan">{{mySpan}}</span>
    `,
    props: {
        mySpan: 'Нажми на меня',
    },
    _changeSpan() {
        this.mySpan = this.mySpan === 'Нажми на меня' ? 'Щелкни по мне' : 'Нажми на меня';
    }
});
```

Этот пример хоть и будет работать аналогично предыдущему, но использовать память он будет в значительно меньших объемах.

Ссылки можно использовать для обмена данным между элементами компонента.

Пример 4
```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <input ~ref="'myInput'">
        <div>{{textDiv}}</div>
        <button @tap="textDiv = $refs.myInput.value">Изменить значение</button>
    `,
    props: {
        textDiv: "Мое значение меняется в поле ввода"
    }
});
```

Однако для экономии памяти можно осуществлять обмен данными и без использования ссылок.

Пример 5
```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <input ::value="textInput">
        <div>{{textDiv}}</div>
        <button @tap="textDiv = textInput">Изменить значение</button>
    `,
    props: {
        textInput: "",
        textDiv: "Мое значение меняется в поле ввода"
    }
});
```

Для поклонников фреймворка [Vue](https://ru.vuejs.org/v2/api/#ref) предусмотрена возможность использования директивы **~ref** с упрощенным синтаксисом. В нем идентификатор ссылки задается простым строковым литералом, а перед именем директивы отсутствует префикс **~** (**ref**).

Пример 6
```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <span ref="mySpanTag"></span>
        <div ~ref="'myDivTag'"></div>
        <p>{{$refs.mySpanTag.tagName}}</p>
        <p>{{$refs.myDivTag.tagName}}</p>
    `
});
```

В элементе **span** в директиве **ref** идентификатор ссылки указан как простой набор символов. А в элементе **div** в директиве **~ref** идентификатор указан как символьная константа JavaScript.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/MEkicBcGy7w?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>

