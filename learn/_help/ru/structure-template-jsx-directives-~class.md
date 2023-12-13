Директива **~class** используется для связывания атрибута **class** HTML-элемента с одним или несколькими CSS-классами его стилевого оформления или с CSS-классами стилевого оформления родительского компонента.

```info_md
Значение этой директивы должно быть именем или списком имен CSS-классов, разделенных пробелами. Сами CSS-классы, указываемые в директиве, должны быть объявлены заранее в разделе шаблона **style** компонента.
```

Например,

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            .my-css-class {
                background: yellow;
                color: green;
                padding: 10px;
            }
        </style>
        <div ~class="'my-css-class'">Директива ~class</div>
    `
});
```

При формировании имени или списка CSS-классов можно использовать inline-выражение, свойство или метод компонента.

Например,

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            .my-css-class {
                background: yellow;
                color: green;
                padding: 10px;
            }
        </style>
        <div ~class="'my-css-class'">inline-выражение</div>
        <div ~class="myStyle">Свойство</div>
        <div ~class="myMethod">Метод</div>
    `,
    myStyle: 'my-css-class',
    myMethod() {
        return this.myStyle;
    }
});
```

Директива **~class** поддерживает механизм реактивности, т.е. при любом изменении значения директивы автоматически будет изменяться значение атрибута **class** HTML-элемента, в котором она указана.

Например,

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            .my-css-class1 {
                background: yellow;
                color: green;
                padding: 10px;
            }
            .my-css-class2 {
                background: green;
                color: yellow;
                padding: 10px;
            }
        </style>
        <div ~class="myStyle">Образец стиля</div>
        <button @tap="changeStyle">Изменить стиль</button>
    `,
    myStyle: 'my-css-class1',
    changeStyle() {
        this.myStyle = this.myStyle === 'my-css-class1' ? 'my-css-class2' : 'my-css-class1';
    }
});
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/H43hAmTDLqM?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>

