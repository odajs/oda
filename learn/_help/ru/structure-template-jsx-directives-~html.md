Директива **~html** применяется для создания динамического дочернего узла-элемента в текущем HTML-элементе.

Например,

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~text="myText"></div>
        <div ~html="myText"></div>
    `,
    myText: '<span style="color: red"> Текст должен быть красным </span>'
});
```

В данном примере одно и то же сообщение, содержащее HTML-разметку, выводится с помощью директив **~text** и **~html**. Видно, что директива **~text** выводит HTML-разметку как часть текста сообщения. А директива **~html** использует ее для визуального оформления сообщения.

```warning_md
Важно помнить, что HTML-элементы, созданные директивой **~html**, являются нативными HTML-элементами, в них не работают инструменты фреймворка ODA.
```

Например,

```javascript_run_edit_error_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~html="myText"></div>
    `,
    myText: '<span ~style="myStyle"> Текст должен быть красным </span>',
    myStyle: 'color: red'
});
```

В данном примере в HTML-элементе создаваемом директивой **~html** указана директива **~style**, которая должна была изменить цвет сообщения на красный. Однако на экране видно, что она была проигнорирована.

Директива **~html** поддерживает механизм реактивности, т.е. автоматически изменяет дочерний HTML-элемент при изменении значения связанного с ней свойства компонента.

Например,

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~html="myText"></div>
        <button @tap="tap">Сменить цвет</button>
    `,
    myText: '<span style="color: red"> Важное сообщение </span>',
    tap() {
        if( this.myText.indexOf('red') == -1 )
            this.myText = this.myText.replace('green', 'red');
         else
            this.myText = this.myText.replace('red', 'green');
    }
});
```

В данном примере при нажатии на кнопку изменяется значение свойства **myText**. Можно видеть, что директива **~html** сразу отображает эти изменения на странице.

```warning_md
Динамическая отрисовка произвольного HTML-кода на сайте крайне опасна, так как может легко привести к XSS-уязвимостям. Используйте интерполяцию HTML только для доверенного кода, и никогда не подставляйте туда содержимое, создаваемое пользователями.
```

Если HTML-элемент уже содержит вложенные элементы, то директива **~html** вставляет свой элемент перед ними.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~html="myText">
            <div>Это вложенный HTML-элемент</div>
        </div>
    `,
    $public: {
        myText: '<span style="color: red"> Текст должен быть красным </span>'
     }
});
```

Директивы **~text** и **~html** несовместимы. Если они одновременно используются в одном элементе, то будет выполнена только одна из них.

Например,

```javascript_run_edit_error_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~html="myHTML" ~text="myText"></div>
    `,
    myHTML: 'Текст из директивы ~html',
    myText: 'Текст из директивы ~text'
});
```

В данном примере в теге **div** были использованы директивы **~text** и **~html**, но текст вывела только одна из них. То, какая директива сработает, может зависеть от версии фреймворка и браузера.

```info_md
Если одновременно использовать в одном HTML-элементе директиву **~html** и подстановку **{{ Mustache }}**, то подстановка **{{ Mustache }}** заблокирует действие директивы.
```

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~html="myText">{{mustache}}</div>
    `,
    myText: 'Привет, HTML!',
    mustache: 'Привет, Mustache!'
});
```

В данном примере своё сообщение вывела только подстановка **{{ Mustache }}**, а директива была проигнорирована.

Если HTML-элемент содержит текстовый узел без подстановки **{{ Mustache }}** и не содержит вложенных HTML-элементов, то директива **~html** заменит этот текстовый узел.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~html="myText">Hello world!</div>
    `,
    myText: 'Привет, HTML!'
});
```

В данном примере сообщение «Hello world!», заданное в шаблоне компонента, было заменено на значение свойства **myText**.

Однако, если HTML-элемент помимо текстового узла содержит вложенные HTML-элементы, то директива **~html** не будет удалять текстовый узел, а добавит свое сообщение в его начало, даже если в нем присутствует подстановка **{{ Mustache }}**.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~html="myText">используется вместе с {{mustache}} <strong>!</strong> </div>
    `,
    myText: 'HTML ',
    mustache: 'Mustache'
});
```

В данном примере благодаря наличию в элементе **div** вложенного элемента **strong** директива **~html** и подстановка **{{ Mustache }}** работают вместе.

```warning_md
Директиву **~html** использовать не рекомендуется. Явно указывайте все необходимые HTML-элементы в шаблоне компонента, управляйте их отображением с помощью директив **~show** и **~if / ~else / ~else-if** и модифицируйте их вид через управление стилями.
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/vZwCdAMvuqw?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
