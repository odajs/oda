**ODA.origin** — это свойство, которое возвращает источник загрузки URL-ресурса, сериализованный в виде строки.

Эта строка формируется на основе кортежа, состоящего из трех элементов:

1. Протокол (scheme).
1. Хост (host).
1. Порт (port).

Значения этих элементов берутся из URL-адреса загруженного ресурса и отделяются друг от друга спец.символами.

Например, https://odajs.org:80

Если в происхождении URL-ресурса не указан порт, то по умолчанию он выводится не будет.

Например,

```javascript run_edit_[my-component.js]
import '/components/buttons/button/button.js';
 ODA({
    is: 'my-component',
    template: `
            <oda-button ref="btn" :label icon="icons:android" @tap="onTap"></oda-button>
    `,
    props: {
        label: "Нажми на меня"
    },
    onTap() {
        this.label = ODA.origin;
    }
});
```

Если в источнике загрузки используется URL-cхема **file** (указан протокол: **file://**), то свойство **origin** вернет строку со значением **"null"**.

Более подробную информацию о объекте **origin** можно найти в стандарте [HTML Living Standard](https://html.spec.whatwg.org/multipage/origin.html#concept-origin).

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/3yHacLaIK7g?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
