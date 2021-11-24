[**:slotted()**](https://drafts.csswg.org/css-scoping/#selectordef-slotted) — это псевдоэлемент CSS, использующийся для стилизации элементов теневого дерева, попавших в слоты внутри него.

В круглых скобках у этого псевдоэлемента указывается список селекторов, определяющий к каким элементам, попавшим в слоты, необходимо применить данный CSS-стиль.

```javascript _run_edit_line[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            ::slotted(*) {
                background-color: yellow;
                color: blue;
            }
        </style>
        <span slot="my-slot">Я в слоте</span>
        <span>Я не в слоте</span>
        <slot name="my-slot">Слот в компоненте</slot>
    `
});
```

В приведенном примере используется селектор *****, говорящий о том, что указанный стиль будет применен ко всем элементам, находящихся в слотах данного компонента. Однако с помощью определенного селектора можно указать к какому конкретному элементу в слоте нужно применить данный стиль.

```javascript _run_edit_line[my-component.js]_h=40_
ODA({
    is: 'my-component',
    template: `
        <style>
            ::slotted(span) {
                background-color: yellow;
                color: blue;
            }
            ::slotted(div) {
                background-color: green;
                color: yellow;
            }
        </style>
        <span slot="my-slot">Span в слоте</span>
        <div slot="my-slot">Div в слоте</div>
        <slot name="my-slot">Слот в компоненте</slot>
    `
});
```

Для стилизации элементов внутри определенного слота можно использовать стандартные правила формирования селекторов, с учетом того, что у всех элементов, попавших в один и тот же слот, должно быть одно и тоже значение атрибута **slot**.

```javascript _run_edit_line[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            ::slotted(span[slot="my-slot1"]) {
                background-color: yellow;
                color: red;
            }
            ::slotted(span[slot="my-slot2"]) {
                background-color: red;
                color: yellow;
            }
        </style>
        <span slot="my-slot1">Span в слоте 1</span>
        <span slot="my-slot2">Span в слоте 2</span>
        <slot name="my-slot1">Слот 1 в компоненте</slot>
        <slot name="my-slot2">Слот 2 в компоненте</slot>
    `
});
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/mvVEcWapQj0?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen 
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
