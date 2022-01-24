Модификатор **category** используется для группировки свойств компонента.

По умолчанию все свойства компонента отображаются в инспекторе **property-grid** в одной общей группе без названия.

Модификатор **category** позволяет размещать свойства компонента в разных группах, объединяя их как по функциональному, так и по какому-либо другому назначению.

Например:

```javascript _run_edit_console_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <p>{{caption+": "}} <input ::value></p>
    `,
    props: {
        value: {
            default: "Привет, category!",
            category: "Значение"
        },
        caption: {
            default: "Модификатор",
            category: "Надпись"
        }
    }
});
```

В данном примере свойства **value** и **caption** объявляются с модификаторами, которые имеют разные значения.

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

В результате этого в инспекторе **property-grid** каждое из них будет помещено в свою категорию, отличную от категории по умолчанию.

Основанием объединения свойств в группу является значение модификатора **category**. Если это значение одинаковое у разных свойств, то они будут размещены в одну и ту же группу.

Например:

```javascript _run_edit_console_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <p>{{caption+": "}} <input ::value></p>
    `,
    props: {
        value: {
            default: "Привет, category!",
            category: "Мой редактор"
        },
        caption: {
            default: "Модификатор",
            category: "Мой редактор"
        }
    }
});
```

В данном примере оба свойства: **value** и **caption** будут помещены в одну и ту же группу с именем **Мой редактор**.

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

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/v4vUdahafPk?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>

