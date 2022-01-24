Атрибут **style** позволяет задать inline-стиль у любого элемента компонента.

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div style="background-color: yellow; color: green; padding: 10px;">{{text}}</div>
    `,
    props: {
        text: 'Hello, Style!'
    }
});
```

В значениях этого атрибута можно использовать CSS-свойства, подключаемые с помощью функции **var()**.

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div style="background-color: var(--dark-background); color: var(--dark-color);">{{text}}</div>
    `,
    props: {
        text: 'Hello, CSS-свойства!'
    }
});
```

```warning_md
Однако применять миксины внутри атрибута **style** нельзя.
```

```javascript_error_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div style="@apply --dark;">{{text}}</div>
    `,
    props: {
        text: 'Goodbay, Mixin!'
    }
});
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/WCJrJ5dbJao?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
