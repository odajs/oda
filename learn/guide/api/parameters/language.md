**ODA.language** — это свойство, которое возвращает предпочитаемый пользователем язык.

Как правило это значение зависит от выбранного языка отображения элементов интерфейса браузера.

Это значение возвращается свойством **navigator.language** глобального объекта **window** в виде языкового тега в соответствии со стандартом [RFC 5646](https://tools.ietf.org/html/rfc5646). Например, "en", "EN-US", "RU", "ru-RU" и т.д.

Из этой строки свойство **ODA.language** извлекает только первые символы, идущие до знака дефиса, соответствующие предпочитаемому пользователю языку без учета страны, в которой этот язык используется.

Например,

```javascript run_edit_[my-component.js]
import '/components/buttons/button/button.js';
 ODA({
    is: 'my-component',
    template: `
        <oda-button ref="btn" :label @tap="onTap"></oda-button>
    `,
    props: {
        label: "Узнай мой предпочитаемый язык общения"
    },
    onTap() {
        this.label = ODA.language;
    }
});
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/JdWwWWeXwAY?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
