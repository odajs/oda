Директива **~props** используется для динамического связывания группы свойств определенного объекта с атрибутами или со свойствами HTML-элемента, в котором эта директива указана.

Групповое связывание осуществляется только для тех свойств или атрибутов HTML-элемента, имена которых перечислены внутри заданного объекта.

Сам объект группового связывания можно указать в inline-выражении, либо в литеральной форме, либо в виде отдельного свойства с типом **Object**, как это сделано в следующем примере:

Пример 1
```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button ~props="item" @tap="_onTap">1 2 3 4</button>
    `,
    props:{
        item: {
            title: 'Направление справа налево',
            dir: 'rtl'
        }
    },
    _onTap () {
        this.item.dir = this.item.dir==='rtl' ? 'ltr' : 'rtl';
        this.item.title = this.item.dir==='rtl' ? 'Направление справа налево' : 'Направление слева направо';
    }
});
```

В этом примере у HTML-элемента **button** одновременно связываются два атрибута **title** и **dir** с одноименными свойствами объекта **item**. При любом изменении значений этих свойств динамически будут меняться соответствующие атрибуты элемента **button**. В результате этого последовательность цифр и текст всплывающей подсказки будут меняться при каждом нажатии на кнопку.

Директиву **~props** можно использовать совместно с директивой **~for**. В этом случае в ней указывается не один групповой объект, а массив объектов. В каждом объекте этого массива перечисляются необходимые имена свойств и их значения для соответствующих HTML-элементов, создаваемых директивой **~for**.

Пример 2
```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~for="items" ~is="item.tag" ~props="item" ~text="item.title"></div>
    `,
    props:{
        items:[
            {tag: 'input', placeholder: 'Введите значение'},
            {tag: 'textarea', value: 'Text'},
            {tag: 'button', title: 'Я кнопка'}
        ]
    }
});
```

Эти значения динамически присваиваются свойствам созданных HTML-элементов. Например, первый HTML-элемент получит тэг **input** с замещающим текстом **Введите значение**. Второй элемент получит тэг **textarea** с содержимым **Текст**. Третий элемент станет кнопкой с текстом всплывающей подсказки **Я кнопка**.

```error_md
Если в групповых объектах указать свойства, которые не являются атрибутами HTML-элементов, то никакого связывания не произойдет.
```

Пример 3

```javascript_error_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~for="items" ~is="item.tag" ~props="item">Текст не меняется</div>
    `,
    props:{
        items:[
            {tag: 'span', contentText: 'span'},
            {tag: 'button', innerHTML: 'Кнопка'},
        ]
    }
});
```

В этом примере свойства **contentText** и **innerHTML** будут добавлены в атрибуты соответствующих элементов, но их текстовое содержимое не изменится, так как ни у **span**, ни у **button** таких атрибутов нет, хотя свойства с такими именами существуют.

Для пользовательских компонентов этот вариант будет рабочим, так как их атрибуты непосредственно связаны с их свойствами.

Пример 4

```javascript_run_edit_[my-component.js]_h=200_
import 'https://odajs.org/components/buttons/icon/icon.js';
ODA({
    is: 'my-component',
    template: `
        <div ~for="items" ~is="item.tag" ~props="item"></div>
    `,
    props:{
        items:[
            {tag: 'oda-icon', icon: 'tools:magnify', iconSize: 96},
            {tag: 'oda-icon', icon: 'icons:android', iconSize: 64, fill: 'lime'},
            {tag: 'oda-icon', icon: 'icons:alarm', iconSize: 32, fill: 'orange'}
        ]
    }
});
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/JU-T3ZRUhqM?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
