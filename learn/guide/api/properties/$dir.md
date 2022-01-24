**$dir** — это свойство, которое содержит URL-путь к файлу модуля компонента.

Оно задается на основе свойства **$url** путем отбрасывания названия файла модуля компонента и его расширения.

```javascript run_edit_[my-component.js]
import '/components/buttons/button/button.js';
 ODA({
    is: 'my-component',
    template: `
        <oda-button ref="btn" label="Нажми на меня" icon="icons:android" @tap="onTap"></oda-button>
    `,
    onTap() {
        this.$refs.btn.label = this.$refs.btn.$dir;
    }
});
```

Если компонент создается динамически, то свойство **dir** будет возвращать ссылку на URL-адрес данной HTML-страницы, за исключением имени фрейма, в котором был создан компонент.

Например,

```javascript run_edit_[my-component.js]
import '/components/buttons/button/button.js';
 ODA({
    is: 'my-component',
    template: `
        <oda-button ref="btn" label="Нажми на меня" icon="icons:android" @tap="onTap"></oda-button>
    `,
    onTap() {
        this.$refs.btn.label = this.$dir;
    }
});
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/tKXZs868MU0?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
