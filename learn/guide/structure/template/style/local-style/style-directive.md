Директива **~style** позволяет управлять значением атрибута **style** любого элемента компонента.

Способы ее использования были подробно рассмотрены в разделе [Директивы](https://odajs.org/#learn/docs/guide#learn/docs/guide/structure/template/jsx/directives/~style.md).

Указанное в ней значение автоматически добавляется в атрибут **style** соответствующего HTML-элемента компонента.

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="myStyle">Hello, ~style!</div>
    `,
    props: {
        myStyle: "background: yellow; color: green; padding: 10px;"
    }
});
```

Директива **~style** поддерживает механизм реактивности. В результате этого любое изменение ее значения будет автоматически приводить к изменению значения атрибута **style** того HTML-элемента, в котором она была указана.

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="myStyle" @tap="_changeStyle">Щелкни по мне</div>
    `,
    props: {
        myStyle: "background: green; color: yellow; padding: 10px;"
    },
    _changeStyle() {
        this.myStyle = this.myStyle === "background: green; color: yellow; padding: 10px;" ?  "background: yellow; color: green; padding: 10px;" : "background: green; color: yellow; padding: 10px;";
    }
});
```

В результате этого стиль отображения соответствующего элемента будет изменяться динамически.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/Uku9FfTUVdk?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
