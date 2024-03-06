Директива **~style** используется для реактивной стилизации HTML-элемента, в котором она указана.

Значение директивы **~style** автоматически связывается со значением атрибута **style** HTML-элемента, задавая стиль его отображения.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="myStyle">Директива ~style</div>
    `,
    myStyle: "background: yellow; color: green; padding: 10px"
});
```

В этом примере значение свойства компонента **myStyle** передается через директиву **~style** атрибуту **style** элемента **div**, вследствие чего у него изменяется стиль отображения.

Значение директивы **~style** можно задать не только в виде свойства компонента, но и в виде обычной строки.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="'background: green; color: yellow; padding: 10px'">Стиль, заданный в виде строкового литерала</div>
    `,
});
```

В качестве значения директивы **~style** вместо строковых литералов можно использовать обычный объект, в котором свойства соответствуют CSS-объявлениям.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="{background: 'green', color: 'yellow', padding: '10px'}">Стиль, заданный в виде литерального объекта</div>
    `,
});
```

Обратите внимание, что в отличие от строковых литералов значения свойств у такого объекта необходимо указывать в кавычках.

Если CSS-объявление имеет имя, содержащее дефис (**-**), то его тоже необходимо записывать в кавычках.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="{'background-color': 'green', color: 'yellow', padding: '10px'}">Экранирование невалидных имен свойств объекта</div>
    `,
});
```

Вместо использования кавычек можно записать такое имя в верблюжьей нотации (Camel case). При построении CSS-правила фреймворк автоматически преобразует его в форму с дефисом (**-**) между словами.

Например,

```javascript run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="{backgroundColor: 'green', color: 'yellow', padding: '10px'}">Использование верблюжьей нотации</div>
    `,
});
```

Также автоматическое преобразование невалидных имен свойств из верблюжьей нотацию в шашлычную (Kebab case) происходит для любого объекта, указанного в директиве **~style**.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="myStyle">Верблюжья нотация для свойств объекта</div>
    `,
    myStyle: {
        backgroundColor: 'green',
        color: 'yellow',
        padding: '10px'
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
    myStyle: "background: green; color: yellow; padding: 10px",
    changeStyle() {
        let style1 = "background: green; color: yellow; padding: 10px";
        let style2 = "background: yellow; color: green; padding: 10px";
        this.myStyle = this.myStyle === style1 ? style2 : style1;
    }
});
```

Здесь при щелчке изменяется значение свойства компонента **myStyle**, что приводит к автоматическому изменению стиля отображения HTML-элемента **div**, в котором была указана директива **~style**.

Следует отметить, что если CSS-объявления сгруппированы в объекте, то механизм реактивности работает только при изменении значения указателя на объект, а не при изменении значений его отдельных свойств.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="myStyle" @tap="changeStyle">Щелкни по мне</div>
    `,
    myStyle: {},
    style1: {background: 'green', color: 'yellow', padding: '10px'},
    style2: {background: 'yellow', color: 'green', padding: '10px'},
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
        background: 'green',
        color: 'yellow',
        padding: '10px'
    },
    changeStyle() {
        this.myStyle.background = this.myStyle.background === 'green' ? 'yellow' : 'green';
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

В случае использования одновременно нескольких способов стилизации, директива **~style** будет добавлять только новые CSS-объявления к уже существующим, не удаляя предыдущие.

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

```warning_md
Если какое-либо CSS-объявление, указанное в директиве **~style**, совпадет с уже существующим, то оно перекроет его значение.
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

В этом примере цвет фона будет не зеленым, а желтым, так как директива **~style** перекрыла значение CSS-объявления **background**, указанное в атрибуте **style** HTML-элемента, своим собственным значением, заданным в свойстве **myStyle**.

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

