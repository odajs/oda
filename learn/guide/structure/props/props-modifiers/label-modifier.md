Модификатор **label** используется для задания надписи (метки) свойства.

Эта надпись будет отображаться в инспекторе свойств компонента (**property-grid**) вместо имени самого свойства.

Например:

```javascript _run_edit_console_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <p>{{caption+": "}} <input ::value></p>
    `,
    props: {
        value: {
            default: "Привет, label!",
            label: "Надпись"
        },
        caption: "Модификатор"
    }
});
```

В данном примере объявлены два свойства: первое из них **value** с модификатором **label**, а второе **caption** — без него.

```javascript _run_edit_console_[my-view.js]_{my-component.js}_h=200_
import 'https://odajs.org/tools/property-grid/property-grid.js';
 ODA({
    is: 'my-view',
    template: `
        <oda-property-grid>
            <my-component></my-component>
        </oda-property-grid>
    `
});
```

В результате этого первое свойство **value** в инспекторе **property-grid** будет отображаться по названию, указанному в модификаторе **label**, а второе свойство — по его имени **caption**, которое используется по умолчанию в качестве значения модификатора **label** в том случае, когда он явно у свойства не указан.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/xlUMn7DdY1M?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
