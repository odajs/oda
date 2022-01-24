**$url** — это свойство, которое возвращает унифицированный указатель на ресурс (URL), по которому располагается файл модуля компонента.

С его помощью можно узнать по какому адресу располагается файл модуля. Например, компонента **oda-button**.

```javascript run_edit_[my-component.js]
import '/components/buttons/button/button.js';
 ODA({
    is: 'my-component',
    template: `
        <oda-button ref="btn" label="Нажми на меня" icon="icons:android" @tap="onTap"></oda-button>
    `,
    onTap() {
        this.$refs.btn.label = this.$refs.btn.$url;
    }
});
```

Если компонент создается динамически, то свойство **$url** будет возвращать ссылку на страницу, внутри которой был создан данный компонент.

Например,

```javascript run_edit_[my-component.js]
import '/components/buttons/button/button.js';
 ODA({
    is: 'my-component',
    template: `
        <oda-button ref="btn" label="Нажми на меня" icon="icons:android" @tap="onTap"></oda-button>
    `,
    onTap() {
        this.$refs.btn.label = this.$url;
    }
});
```

В данном примере компонент **my-component** создается в контексте фрейма текущей страницы, имя которого задается в виде универсального уникального идентификатора **UUID**. Это имя добавляется к URL-адресу HTML-страницы и становится эквивалентом адреса модуля самого компонента.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/HhW9EH3K4dc?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
