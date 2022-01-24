Атрибут **class** позволяет использовать CSS-классы для стилизации любого элемента компонента.

```info_md
В значениях этого атрибута нужно указывать только CSS-классы, которые были объявлены внутри теневого дерева компонента.
```

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            .my-class {
                background-color: yellow;
                color: blue;
                padding: 10 px;
            }
        </style>
        <div class="my-class">{{text}}</div>
    `,
    props: {
        text: 'Hello, Class!'
    }
});
```

```warning_md
Внешние CSS-классы не доступны для элементов компонента.
```

Например, CSS-класс **my-class**, заданный в разделе **head**, не будет виден внутри компонента.

```xml_css_edit_[my-component.css]
<style>
    .my-class {
        background-color: red;
        color: yellow;
        padding: 10 px;
    }
</style>
```

В результате этого к элементу **span** не будут применены CSS-объявления, заданные во внешнем классе **my-class**.

```javascript_error_run_edit_[my-component.js]_{my-component.css}
ODA({
    is: 'my-component',
    template: `
        <span class="my-class">{{text}}</span>
    `,
    props: {
        text: 'Goodbye, Class!'
    }
});

```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/egVMac3ccuY?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
