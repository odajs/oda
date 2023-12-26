Директива **~props** используется для динамического связывания свойств компонента с атрибутами HTML-элемента, в котором эта директива указана.

Связываемые свойства должны быть сгруппированы в одном объекте, который указывается как значение директивы **~props**. Директива создает в HTML-элементе из каждого свойства одноименный атрибут. Значение свойства становится значением этого атрибута.

Например,

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <input ~props="attr">
    `,
    attr: {
        type: 'range',
        min: 0,
        max: 100,
        value: 0,
        step: 50,
        'not-attribute': true
    }
});
```

В данном примере все атрибуты тега **input** заданы с помощью директивы **~props**. Если открыть инструменты разработчика в браузере, то можно убедиться, что в тег **input** перенесены все свойства из объекта **attr**.

```html
<my-component>
    #shadow-root (closed)
        <input type="range" min="0" max="100" step="50" not-attribute>
</my-component>
```

```info_md
Директива **~props** обеспечивает только однонаправленную связь от свойств компонента к атрибутам элемента. Изменение значений атрибутов элемента в процессе его функционирования в свойства компонента не передается.
```

Например,

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <input ~props="attr">
        <span>{{attr.value}}</span>
    `,
    attr: {
        type: 'range',
        min:0,
        max:100,
        value: 0,
        step: 50
    }
});
```

Данный пример аналогичен предыдущему, добавлен только вывод на экран значения свойства **value**. Подвигайте ползунок и убедитесь, что значение свойства не изменяется.








Директиву **~props** можно использовать совместно с директивой **~for**. В этом случае в ней указывается не один групповой объект, а массив объектов. В каждом объекте этого массива перечисляются необходимые имена свойств и их значения для соответствующих HTML-элементов, создаваемых директивой **~for**.

Пример 2
```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~for="items" ~is="$for.item.tag" ~props="$for.item" ~text="$for.item.title"></div>
    `,
    $public:{
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
        <div ~for="items" ~is="$for.item.tag" ~props="$for.item">Текст не меняется</div>
    `,
    $public:{
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
ODA({
    is: 'my-component',
    imports: '@oda/icon',
    template: `
        <div ~for="items" ~is="$for.item.tag" ~props="$for.item"></div>
    `,
    $public:{
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
