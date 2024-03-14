Директива **~style** используется для реактивной стилизации HTML-элемента, в котором она указана. Значение директивы автоматически связывается со значением атрибута **style** HTML-элемента, задавая стиль его отображения.

Значением директивы должен быть список CSS-объявлений. Список может быть представлен:

1. в виде строки, в которой CSS-объявления разделены символом точки с запятой (**;**);
    
    Например,
    
    ```javascript _run_edit_[my-component.js]
    ODA({
        is: 'my-component',
        template: `
            <div ~style="'background: yellow; color: green; padding: 10px'">Список в виде строки</div>
        `
    });
    ```
    
1. в виде массива строк с CSS-объявлениями;
    
    Например,
    
    ```javascript _run_edit_[my-component.js]
    ODA({
        is: 'my-component',
        template: `
            <div ~style="['background: yellow', 'color: green', 'padding: 10px']">Список в виде массива</div>
        `
    });
    ```
    
1. в виде объекта, в котором свойства соответствуют CSS-объявлениям.
    
    Например,
    
    ```javascript _run_edit_[my-component.js]
    ODA({
        is: 'my-component',
        template: `
            <div ~style="{background: 'yellow', color: 'green', padding: '10px'}">Список в виде объекта</div>
        `
    });
    ```
    
    Обратите внимание, что в отличие от строковых литералов значения свойств у такого объекта необходимо указывать в кавычках.
    
    Если имя свойства CSS-объявления содержит дефис (**-**), то в объекте его необходимо записывать в кавычках.

    Например,
    
    ```javascript _run_edit_[my-component.js]
    ODA({
        is: 'my-component',
        template: `
            <div ~style="{'background-color': 'yellow', color: 'green', padding: '10px'}"> Экранирование невалидного имени свойства 'background-color'</div>
        `
    });
    ```
    

    Вместо использования кавычек можно записать такое имя в верблюжьей нотации (Camel case). При построении CSS-правила фреймворк автоматически преобразует его в форму с дефисом (**-**) между словами.
    
    Например,
    
    ```javascript run_edit_[my-component.js]
    ODA({
        is: 'my-component',
        template: `
            <div ~style="{backgroundColor: 'yellow', color: 'green', padding: '10px'}">Использование верблюжьей нотации в имени свойства backgroundColor</div>
        `,
    });
    ```

При формировании списка CSS-объявлений можно использовать inline-выражение, свойство или метод компонента.

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
        <div ~style="{background: 'yellow', color: 'green', padding: '10px'}">inline-выражение</div>
        <div ~style="myStyle">Свойство</div>
        <div ~style="myMethod">Метод</div>
    `,
    myStyle: {background: 'yellow', color: 'green', padding: '10px'},
    myMethod() {
        return this.myStyle;
    }
});
```

Директива **~style** поддерживает механизм реактивности, т.е. автоматически изменяет стиль отображения HTML-элемента при изменении значения связанного с ней свойства компонента.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="myStyle" @tap="changeStyle">Щелкни по мне</div>
    `,
    myStyle: "background: yellow; color: green; padding: 10px",
    changeStyle() {
        let style1 = "background: yellow; color: green; padding: 10px";
        let style2 = "background: green; color: yellow; padding: 10px";
        this.myStyle = this.myStyle === style1 ? style2 : style1;
    }
});
```

Здесь при щелчке изменяется значение свойства компонента **myStyle**, что приводит к автоматическому изменению стиля отображения HTML-элемента **div**, в котором была указана директива **~style**.

Следует отметить, что если список CSS-объявлений задан в виде массива, то механизм реактивности работает только при изменении значения указателя на массив, а не при изменении значений его отдельных элементов.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="myStyle" @tap="changeStyle">Щелкни по мне</div>
    `,
    myStyle: [],
    style1: ['background: yellow', 'color: green', 'padding: 10px'],
    style2: ['background: green', 'color: yellow', 'padding: 10px'],
    ready() {
        this.myStyle = this.style1;
    },
    changeStyle() {
        this.myStyle = this.myStyle === this.style1? this.style2 : this.style1;
    }
});
```

При изменении отдельных элементов массива или их числа механизм реактивности работать не будет.

Например,

```javascript _run_edit_error_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="myStyle" @tap="changeStyle">Щелкни по мне</div>
    `,
    myStyle: ['background: yellow', 'color: green', 'padding: 10px'],
    changeStyle() {
        this.myStyle[0] = this.myStyle[0] === 'background: yellow'? 'background: pink' : 'background: yellow';
    }
});
```

Аналогично, если список CSS-объявлений задан в виде объекта, то механизм реактивности работает только при изменении значения указателя на объект, а не при изменении значений его отдельных свойств.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="myStyle" @tap="changeStyle">Щелкни по мне</div>
    `,
    myStyle: {},
    style1: {background: 'yellow', color: 'green', padding: '10px'},
    style2: {background: 'green', color: 'yellow', padding: '10px'},
    ready() {
        this.myStyle = this.style1;
    },
    changeStyle() {
        this.myStyle = this.myStyle === this.style1? this.style2 : this.style1;
    }
});
```

При изменении отдельных свойств объекта механизм реактивности работать не будет.

Например,

```javascript _error_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="myStyle" @tap="changeStyle">Щелкни по мне</div>
    `,
    myStyle: {
        background: 'yellow',
        color: 'green',
        padding: '10px'
    },
    changeStyle() {
        this.myStyle.background = this.myStyle.background === 'yellow' ? 'green' : 'yellow';
    }
});
```

Для включения реактивности внутри объекта, его необходимо записать в литеральной форме, а в качестве значений его свойств нужно использовать другие свойства компонента.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="{background: myColor, color: 'yellow', padding: '10px'}" @tap="changeStyle">Щелкни по мне</div>
    `,
    myColor: 'green',
    changeStyle() {
        this.myColor = this.myColor === 'green' ? 'red' : 'green';
    }
});
```

В этом примере любое изменение свойства компонента **myColor**, будет приводить к автоматическому изменению связанного с ним свойства **background** CSS-объекта.

Для включения реактивности внутри строкового литерала, свойства компонента необходимо включать в него с помощью операции конкатенации.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="'background:' + myColor + ';color: yellow; padding: 10px'" @tap="changeStyle">Щелкни по мне</div>
    `,
    myColor: 'green',
    changeStyle() {
        this.myColor = this.myColor === 'green' ? 'red' : 'green';
    }
});
```

Данный пример аналогичен предыдущему, только значение директивы **~style** задано не объектом, а строкой, формируемой с помощью операции конкатенации. В результате цвет фона берется из свойства **myColor**.

В HTML-элементе можно одновременно использовать атрибут **style** и директиву **~style**. В этом случае их CSS-объявления будут объединяться.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div style="background: green; padding: 10px" ~style="myStyle">Директива ~style добавила CSS-свойство "color: yellow"</div>
    `,
    myStyle: "color: yellow"
});
```

```info_md
Если какое-либо CSS-объявление, указанное в директиве **~style**, совпадет с объявлением в атрибуте **style**, то оно перекроет его значение.
```

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div style="background: green; padding: 10px" ~style="myStyle">Директива ~style перекрыла существующее CSS-свойство "background"</div>
    `,
    myStyle: "background: yellow"
});
```

В этом примере цвет фона будет не зеленым, а желтым, так как директива **~style** перекрыла значение CSS-объявления **background**, указанное в атрибуте **style** HTML-элемента, своим собственным значением, заданным в свойстве компонента **myStyle**.

```warning_md
Если в атрибут **style** данные передаются с помощью биндинга, то директива **~style** игнорируется.
```

Например,

```javascript _run_edit_error_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div :style="'background: yellow; padding: 10px'" ~style="myStyle" @tap="changeStyle">Щелкни по мне</div>
        <div>{{myStyle}}</div>
    `,
    myStyle: "color: green",
    changeStyle() {
        this.myStyle = this.myStyle == 'color: green' ? 'color: red' : 'color: green';
    }});
```

В данном примере менять цвет шрифта с помощью директивы **~style** не удастся. Как видно на экране, задаваемый с помощью нее цвет шрифта игнорируется.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/RbZrBh4KWbk?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>

