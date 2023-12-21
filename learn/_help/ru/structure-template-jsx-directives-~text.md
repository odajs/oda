Директива **~text** и интерполяционная подстановка, указываемая в двойных фигурных скобках **{{}}** (Mustache), применяются для создания текстовых узлов в HTML-элементе.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~text="myText"></div>
        <div>{{mustache}}</div>
    `,
    myText: 'Привет, text!',
    mustache: 'Привет, Mustache!'
});
```

В данном примере содержимое первого элемента **div** будет создано директивой **~text** из значения свойства **myText**. Содержимое второго элемента **div** будет сформировано из значения свойства **mustache**, но с использованием текстовой интерполяции **{{ Mustache }}**.

```faq_md
Эти два варианта фактически одинаковые, но предпочтительней использовать подстановку **{{ Mustache }}**:
- повышается удобочитаемость кода компонента.
- подстановку **{{ Mustache }}** можно использовать внутри HTML-элемента многократно, а директиву **~text** можно указывать в атрибутах тега только один раз.
- директива **~text** формирует текстовый узел полностью, а подстановка **{{ Mustache }}** дополняет его содержимое.
```

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~text="myText" ~text="myText"></div>
        <div>{{mustache}} и еще раз {{mustache}}</div>
    `,
    myText: 'Привет, text!',
    mustache: 'Привет, Mustache!'
});
```

В данном примере директива **~text** и подстановка **{{ Mustache }}** используются два раза, однако директива **~text** выводит свое сообщение «Привет, text!» только один раз, тогда как сообщение «Привет, Mustache!» выводится два раза.

Директива **~text** и подстановка **{{ Mustache }}** поддерживают механизм реактивности, т.е. автоматически изменяют содержимое текстового узла при изменении значения связанного с ними свойства компонента.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~text="myText"></div>
        <div>{{mustache}}</div>
        <button @tap="tap">Больше восторга</button>
    `,
    myText: 'Привет, text!',
    mustache: 'Привет, Mustache!',
    tap(){
        this.myText += "!!!";
        this.mustache += "!!!";
    }
});
```

В данном примере при нажатии на кнопку изменяются значения свойств **myText** и **mustache**. Можно видеть, что директива **~text** и подстановка **{{ Mustache }}** сразу отражают эти изменения на странице.

```info_md
Если одновременно использовать в одном HTML-элементе директиву **~text** и подстановку **{{ Mustache }}**, то подстановка **{{ Mustache }}** заблокирует действие директивы **~text**.
```

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~text="myText">{{mustache}}</div>
    `,
    myText: 'Привет, text!',
    mustache: 'Привет, Mustache!'
});
```

В данном примере своё сообщение вывела только подстановка **{{ Mustache }}**, а директива **~text** была проигнорирована.

Если HTML-элемент содержит текстовый узел без подстановки **{{ Mustache }}** и не содержит вложенных HTML-элементов, то директива **~text** заменит этот текстовый узел.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~text="myText">Hello world!</div>
    `,
    myText: 'Привет, text!'
});
```

В данном примере сообщение «Hello world!», заданное в шаблоне компонента, было заменено на значение свойства **myText**.

Однако, если HTML-элемент помимо текстового узла содержит вложенные HTML-элементы, то директива **~text** не будет удалять текстовый узел, а добавит свое сообщение в его начало, даже если в нем присутствует подстановка **{{ Mustache }}**.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~text="myText">используется вместе с {{mustache}} <strong>!</strong> </div>
    `,
    myText: 'Text ',
    mustache: 'Mustache'
});
```

В данном примере благодаря наличию в элементе **div** вложенного элемента **strong** директива **~text** и подстановка **{{ Mustache }}** работают вместе.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/VRX8CG8Wa3E?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>

