Директива **~class** позволяет управлять значением атрибута **class** любого элемента компонента.

Способы ее использования были подробно рассмотрены в разделе [Директивы](https://odajs.org/#learn/docs/guide#learn/docs/guide/structure/template/jsx/directives/~class.md).

В качестве параметров этой директивы могут выступать: inline-выражение, свойство или метод компонента.

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            .my-class {
                background: yellow;
                color: green;
                padding: 10px;
            }
        </style>
        <div ~class="'my-class'">Inline-выражение</div>
        <div ~class="myStyle">Свойство</div>
        <div ~class="myMethod">Метод</div>
    `,
    props: {
        myStyle: 'my-class'
    },
    myMethod() {
        return this.myStyle;
    }
});
```

Директива **~class** поддерживает механизм реактивности. В результате этого любое изменение ее значения будет приводить к автоматическому изменению значения атрибута **class** того HTML-элемента, в котором она была указана.

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            .my-class1 {
                background: yellow;
                color: green;
                padding: 10px;
            }
            .my-class2 {
                background: green;
                color: yellow;
                padding: 10px;
            }
        </style>
        <div ~class="myStyle" @tap="_changeStyle">Щелкни по мне</div>
    `,
    props: {
        myStyle: 'my-class1'
    },
    _changeStyle() {
        this.myStyle = this.myStyle === 'my-class1' ?  'my-class2' : 'my-class1';
    }
});
```

Вследствие этого стиль отображения соответствующего элемента будет меняться динамически.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/VrZxvt-KsBA?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
