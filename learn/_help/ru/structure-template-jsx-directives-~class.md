Директива **~class** используется для реактивной стилизации HTML-элемента, в котором она указана. Директива автоматически добавляет новые классы в список CSS-классов, применяемых к HTML-элементу.

Значением директивы должно быть имя или список имен CSS-классов. Сами CSS-классы, указываемые в директиве, должны быть объявлены заранее в шаблоне компонента или его родителя в HTML-элементе **style**.

Например,

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
        <div ~class="'my-class'">Директива ~class</div>
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
                .class1 {
                    background: yellow;
                    padding: 10px;
                }
                .class2 {
                    color: green;
                }
            </style>
            <div ~class="'class1 class2'">Список классов в виде строки "class1 class2"</div>
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
                .class1 {
                    background: yellow;
                    padding: 10px;
                }
                .class2 {
                    color: green;
                }
            </style>
            <div ~class="['class1', 'class2']">Список классов в виде массива ['class1', 'class2']</div>
        `
    });
    ```
    
1. в виде объекта, в котором имена свойств совпадают с именами классов, а значениями свойств являются **true** (разрешает применение класса к элементу) или **false** (запрещает применение класса к элементу).
    
    Например,
    
    ```javascript_run_edit_[my-component.js]
    ODA({
        is: 'my-component',
        template: `
            <style>
                .class1 {
                    background: yellow;
                    padding: 10px;
                }
                .class2 {
                    color: green;
                }
            </style>
            <div ~class="{class1: true, class2: true}">Список классов в виде объекта {class1: true, class2: true}</div>
        `
    });
    ```
    
    Если имя CSS-класса содержит дефис (**-**), то в объекте его необходимо записывать в кавычках.
    
    Например,
    
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
            <div ~class="{'my-class': true}">Имя класса заключено в кавычки</div>
        `
    });
    ```
    
    ```warning_md
    Имя CSS-класса является чувствительным к регистру, поэтому директива **~class** не поддерживает преобразование имен классов, переданных ей через объект, из верблюжьей нотации (Camel case) в шашлычную (Kebab case). В результате, с помощью верблюжьей нотации нельзя передать в директиву имена классов, содержащие дефис (**-**).
    ```
    
    Например,
    
    ```javascript_run_edit_error_[my-component.js]
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
            <div ~class="{myClass: true}">Имя класса с дефисом не может задаваться в "Camel case"</div>
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
            .my-class {
                background: yellow;
                color: green;
                padding: 10px;
            }
        </style>
        <div ~class="'my-class'">inline-выражение</div>
        <div ~class="myStyle">Свойство</div>
        <div ~class="myMethod">Метод</div>
    `,
    myStyle: 'my-class',
    myMethod() {
        return this.myStyle;
    }
});
```

Директива **~class** поддерживает механизм реактивности, т.е. при любом изменении значения директивы автоматически будет изменяться набор классов применяемых, к HTML-элементу.

Например,

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            .class1 {
                background: yellow;
                color: green;
                padding: 10px;
            }
            .class2 {
                background: green;
                color: yellow;
                padding: 10px;
            }
        </style>
        <div ~class="myStyle" @tap="changeStyle">Щелкни по мне</div>
    `,
    myStyle: 'class1',
    changeStyle() {
        this.myStyle = this.myStyle == 'class1' ? 'class2' : 'class1';
    }
});
```

Следует отметить, что если список классов задан в виде массива, то механизм реактивности работает только при изменении значения указателя на массив, а не при изменении значений его отдельных элементов.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            .class1 {
                background: yellow;
                color: green;
                padding: 10px;
            }
            .class2 {
                background: green;
                color: yellow;
                padding: 10px;
            }
        </style>
        <div ~class="myStyle" @tap="changeStyle">Щелкни по мне</div>
    `,
    myStyle: [],
    style1: ['class1'],
    style2: ['class2'],
    ready() {
        this.myStyle = this.style1;
    },
    changeStyle() {
        this.myStyle = this.myStyle == this.style1? this.style2 : this.style1;
    }
});
```

При изменении отдельных элементов массива или их числа механизм реактивности работать не будет.

Например,

```javascript _error_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            .class1 {
                background: yellow;
                color: green;
                padding: 10px;
            }
            .class2 {
                background: green;
                color: yellow;
                padding: 10px;
            }
        </style>
        <div ~class="myStyle" @tap="changeStyle">Щелкни по мне</div>
    `,
    myStyle: ['class1'],
    changeStyle() {
        this.myStyle[0] = this.myStyle[0] == 'class1' ? 'class2' : 'class1';
    }
});
```

Аналогично, если список классов задан в виде объекта, то механизм реактивности работает только при изменении значения указателя на объект, а не при изменении значений его отдельных свойств.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            .class1 {
                background: yellow;
                color: green;
                padding: 10px;
            }
            .class2 {
                background: green;
                color: yellow;
                padding: 10px;
            }
        </style>
        <div ~class="myStyle" @tap="changeStyle">Щелкни по мне</div>
    `,
    myStyle: {},
    style1: {class1: true, class2: false },
    style2: {class1: false, class2: true },
    ready() {
        this.myStyle = this.style1;
    },
    changeStyle() {
        this.myStyle = this.myStyle == this.style1? this.style2 : this.style1;
    }
});
```

При изменении отдельных свойств объекта механизм реактивности работать не будет.

Например,

```javascript _error_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            .class1 {
                background: yellow;
                color: green;
                padding: 10px;
            }
            .class2 {
                background: green;
                color: yellow;
                padding: 10px;
            }
        </style>
        <div ~class="myStyle" @tap="changeStyle">Щелкни по мне</div>
    `,
    myStyle: {class1: true, class2: false },
    changeStyle() {
        this.myStyle.class1 = !this.myStyle.class1;
        this.myStyle.class2 = !this.myStyle.class2;
    }
});
```

Для включения реактивности внутри объекта, его необходимо записать в литеральной форме, а в качестве значений его свойств нужно использовать другие свойства компонента.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            .class1 {
                background: yellow;
                color: green;
                padding: 10px;
            }
            .class2 {
                background: green;
                color: yellow;
                padding: 10px;
            }
        </style>
        <div ~class="{class1: myStyle, class2: !myStyle }" @tap="changeStyle">Щелкни по мне</div>
    `,
    myStyle: true,
    changeStyle() {
        this.myStyle = !this.myStyle;
    }
});
```

В этом примере любое изменение свойства компонента **myStyle**, будет приводить к автоматической смене применяемого класса.

В HTML-элементе можно одновременно использовать атрибут **class** и директиву **~class**. В этом случае указанные в них классы объединяются в один список классов.

Например,

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            .class1 {
                background: yellow;
                padding: 10px;
            }
            .class2 {
                color: green;
            }
        </style>
        <div class="class1" ~class="'class2'">Список классов: "{{$this.parentElement.className}}"</div>
    `
});
```

В данном примере в элемент **div** с помощью атрибута **class** и директивы **~class** добавлены стилевые классы **class1** и **class2**. На экране видно, что оба класса работают одновременно, т.к. цвет фона берется из класса **class1**, а цвет шрифта из класса **class2**. Кроме того, на экран выводится список классов элемента **div**, в котором присутствуют оба класса.

Однако, если в атрибут **class** данные передаются с помощью биндинга, то директива **~class** игнорируется.

Например,

```javascript_run_edit_error_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            .class1 {
                background: yellow;
                padding: 10px;
            }
            .class2 {
                color: green;
            }
            .class3 {
                color: red;
            }
        </style>
        <div :class="'class1'" ~class="myStyle">Список классов: "{{$this.parentElement.className}}"</div>
        <button @tap="changeStyle">Изменить цвет шрифта</button>
    `,
    myStyle: 'class2',
    changeStyle() {
        this.myStyle = this.myStyle == 'class2' ? 'class3' : 'class2';
    }
});
```

В данном примере не удастся менять цвет шрифта с помощью директивы **~class**. Как видно на экране, задаваемые с помощью нее стилевые классы не добавляются в список классов элемента **div**.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/H43hAmTDLqM?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>

