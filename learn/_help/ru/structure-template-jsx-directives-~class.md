Директива **~class** используется для связывания атрибута **class** HTML-элемента с одним или несколькими CSS-классами его стилевого оформления или с CSS-классами стилевого оформления родительского компонента.

Значением директивы должно быть имя или список имен CSS-классов. Сами CSS-классы, указываемые в директиве, должны быть объявлены заранее в разделе шаблона **style** компонента или его родителя.

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

Список имен классов может быть представлен:

1. в виде строки, в которой имена классов разделены пробелами;
    
    Например,
    
    ```javascript_run_edit_[my-component.js]
    ODA({
        is: 'my-component',
        template: `
            <style>
                .my-css-class1 {
                    background: yellow;
                    padding: 10px;
                }
                .my-css-class2 {
                    color: green;
                }
            </style>
            <div ~class="'my-css-class1 my-css-class2'">Список классов в виде строки "my-css-class1 my-css-class2"</div>
        `
    });
    ```

1. в виде массива строк с именами классов;
    
    Например,
    
    ```javascript_run_edit_[my-component.js]
    ODA({
        is: 'my-component',
        template: `
            <style>
                .my-css-class1 {
                    background: yellow;
                    padding: 10px;
                }
                .my-css-class2 {
                    color: green;
                }
            </style>
            <div ~class="['my-css-class1', 'my-css-class2']">Список классов в виде массива ['my-css-class1', 'my-css-class2']</div>
        `
    });
    ```

1. в виде объекта, в котором имена классов являются ключами со значениями **true** (разрешает применение класса к элементу) или **false** (запрещает применение класса к элементу).
    
    Например,
    
    ```javascript_run_edit_[my-component.js]
    ODA({
        is: 'my-component',
        template: `
            <style>
                .my-css-class1 {
                    background: yellow;
                    padding: 10px;
                }
                .my-css-class2 {
                    color: green;
                }
            </style>
            <div ~class="{'my-css-class1': true, 'my-css-class2': true}">Список классов в виде объекта {'my-css-class1': true, 'my-css-class2': true}</div>
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

















В HTML-элементе можно одновременно использовать атрибут **class** и директиву **~class**. В этом случае указанные в них классы объединяются в один список классов.

Например,

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            .my-css-class1 {
                background: yellow;
                padding: 10px;
            }
            .my-css-class2 {
                color: green;
            }
        </style>
        <div class="my-css-class1" ~class="'my-css-class2'">Список классов: "{{$this.parentElement.className}}"</div>
    `
});
```

В данном примере в элемент **div** с помощью атрибута **class** и директивы **~class** добавлены стилевые классы **my-css-class1** и **my-css-class2**. На экране видно, что оба класса работают одновременно, т.к. цвет фона берется из класса **my-css-class1**, а цвет шрифта из класса **my-css-class2**. Кроме того, на экран выводится список классов элемента **div**, в котором присутствуют оба класса.

Однако, если в атрибут **class** данные передаются с помощью биндинга, то директива **~class** игнорируется.

Например,

```javascript_run_edit_error_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            .my-css-class1 {
                background: yellow;
                padding: 10px;
            }
            .my-css-class2 {
                color: green;
            }
            .my-css-class3 {
                color: red;
            }
        </style>
        <div :class="'my-css-class1'" ~class="myStyle">Список классов: "{{$this.parentElement.className}}"</div>
        <button @tap="changeStyle">Изменить цвет шрифта</button>
    `,
    myStyle: 'my-css-class2',
    changeStyle() {
        this.myStyle = this.myStyle === 'my-css-class2' ? 'my-css-class3' : 'my-css-class2';
    }
});
```

В данном примере менять цвет шрифта с помощью директивы **~class** не удастся. Как видно на экране, задаваемые с помощью нее стилевые классы не добавляются в список классов элемента **div**.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/H43hAmTDLqM?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>

