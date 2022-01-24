Директива **~text** применяется для замены текстового значения HTML-элемента и является альтернативой для интерполяционной подстановки, указываемой в двойных фигурных скобках **{{}}** (Mustache).

```info_md
Директива **~text** изменяет содержимое того HTML-элемента, в котором она указана в качестве атрибута.
```

Пример 1

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <p ~text="myText">Hello world!</p>
        <p>{{myText}}</p>
    `,
    props: {
        myText: 'Привет, text!'
    }
});
```

В данном примере содержимое **Hello world!** первого элемента **p** будет заменено на значение свойства **myText**, указанного в директиве **~text**. Содержимое второго элемента **p** будет также сформировано из значения свойства **myText**, но с использованием текстовой интерполяции **{{ Mustache }}**.

```faq_md
Эти два варианта фактически одинаковые, но предпочтительней использовать подстановку **{{ Mustache }}**:
- повышается удобочитаемость кода компонента.
- подстановку **{{ Mustache }}** можно использовать внутри HTML-элемента многократно, а директиву **~text** можно указывать в атрибутах тега только один раз.
- директива **~text** заменяет содержимое элемента полностью, а подстановка **{{ Mustache }}** дополняет содержимое элемента.
```

Пример 2

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <p ~text="myText" ~text="myText"></p>
        <p>{{myText}} и еще раз {{myText}}</p>
    `,
    props: {
        myText: 'Привет, text!'
     }
});
```

```info_md
Если одновременно использовать в одном HTML-элементе директиву **~text** и подстановку **{{ Mustache }}**, то подстановка **{{ Mustache }}** заблокирует действие директивы **~text**.
```

Пример 3

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <p ~text="myText">{{mustache}}</p>
    `,
    props: {
        myText: 'Привет, text!',
        mustache: 'Привет, Mustache!'
     }
});
```

Директива **~text** заменяет только текстовое значение HTML-элемента. Если HTML-элемент содержит одновременно текстовое значение и вложенные HTML-элементы, то вложенные HTML-элементы не заменяются.

Пример 4

```javascript _run_edit_[my-component.js]_h=50_
ODA({
    is: 'my-component',
    template: `
        <div ~text="myText">
            Заменяемый текст
            <div>Это HTML-элемент, он не заменяется</div>
        </div>
    `,
    props: {
        myText: 'Привет, text!',
     }
});
```

Важно обратить внимание, что заменяется только текстовое значение, стоящее перед вложенным HTML-элементом. Замещение текстового значения, стоящего после вложенного HTML-элемента, не происходит.

Пример 5

```javascript _run_edit_[my-component.js]_h=50_
ODA({
    is: 'my-component',
    template: `
        <div ~text="myText">
            <div>Это HTML-элемент, он не заменяется</div>
            Текст после HTML-элемента также не заменяется
        </div>
    `,
    props: {
        myText: 'Привет, text!',
     }
});
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/VRX8CG8Wa3E?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
