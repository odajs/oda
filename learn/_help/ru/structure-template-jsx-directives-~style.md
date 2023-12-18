Директива **~style** используется для реактивной стилизации любого HTML-элемента, объявленного внутри компонента.

Значение директивы **~style** автоматически связывается со значением атрибута **style** любого HTML-элемента, задавая стиль его отображения.

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

В отличие от обычного присвоения директива **~style** позволяет использовать механизм реактивности, т.е. позволяет автоматически изменяет стиль отображения соответствующего HTML-элемента при изменении значения связанного с ним свойства компонента.

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

При использовании шаблонных литералов необходимо экранировать каждый символ обратной одинарной кавычки (**`**), так как такие кавычки уже используются при задании свойства **template** самого компонента, а использование вложенных кавычек одного и того же типа без их экранирования в языке JavaScript запрещено.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="\`background: yellow; color: green; padding: 10px\`">Стиль, заданный в виде шаблонного литерала</div>
    `,
});
```

В качестве значения директивы **~style** вместо строковых литералов можно использовать обычный объект. В этом случае каждое свойство этого объекта будет соответствовать отдельному CSS-объявлению правила отображения HTML-элемента.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="{background: 'green', color: 'yellow', padding: '10px'}">Стиль, заданный в виде литерального объекта</div>
    `,
});
```

Обратите внимание, что в отличие от строковых литералов значения свойств у такого объекта необходимо указывать в кавычках, так как они обязательно должны иметь строковый тип (например, **'green'**).

Если имя в CSS-объявлении имеет неразрешенное с точки зрения языка JavaScript значение, то его тоже необходимо будет записать в кавычках.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="{'background-color': 'green', color: 'yellow', padding: '10px'}">Экранирование невалидных имен свойств объекта</div>
    `,
});
```

Однако если использовать верблюжью нотацию (Camel case), то неразрешенное имя будет автоматически преобразовано в правильную форму, с добавлением дефиса (**-**) между словами. Указывать его в апострофах в этом случае уже не нужно.

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

Следует отметить, что механизм реактивности работает только при изменении значения всего свойства компонента, а не при изменении его отдельных элементов.

Например,

```javascript _run_edit_[my-component.js]
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
        let style1 = {background: 'green', color: 'yellow', padding: '10px'};
        let style2 = {background: 'yellow', color: 'green', padding: '10px'};
        this.myStyle = JSON.stringify(this.myStyle)===JSON.stringify(style1)? style2 : style1;
    }
});
```

При изменении отдельных свойств связанного объекта механизм реактивности работать не будет.

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

Для его включения сам объект необходимо записать в литеральной форме, а в качестве значения его свойства нужно указать имя того свойства компонента, с которым это значение должно быть связанно.

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

В этом случае любое изменение свойства компонента, будет приводить к автоматическому изменению связанного с ним свойства CSS-объекта.

Если значение директивы **~style** записать в виде строки, то механизм реактивности будет работать только при использовании шаблонных литералов.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="\`background: \${myColor}; color: yellow; padding: 10px\`" @tap="changeStyle">Щелкни по мне</div>
    `,
    myColor: 'green',
    changeStyle() {
        this.myColor = this.myColor === 'green' ? 'red' : 'green';
    }
});
```

``` warning_md
В шаблонном литерале символ **$** обязательно нужно экранировать, иначе интерполяционное выражение будет применятся к свойству **template** компонента, а не к значению директивы **~style**.
```

В интерполяционном выражении можно использовать отдельные свойства объекта.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="\`background: \${myStyle.background}; color: yellow; padding: 10px\`" @tap="changeStyle">Щелкни по мне</div>
    `,
    myStyle: {
        background: 'green',
        color: 'yellow',
        padding: '10px'
    },
    changeStyle() {
       this.myStyle.background = this.myStyle.background === 'green' ? 'red' : 'green';
    }
});
```

Заметьте, что если шаблонный литерал записан внутри обычной строки, то механизм реактивности работать не будет.

Например,

```javascript error_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="'background: \`\${myColor}\`'" @tap="changeStyle">Щелкни по мне</div>
    `,
    myColor: 'green',
    changeStyle() {
        this.myColor = this.myColor === 'green' ? 'red' : 'green';
    }
});
```

В этом примере шаблонный литерал рассматривается лишь как часть строки и директивой **~style** не воспринимается как отдельное интерполяционное выражение.

В случае использования одновременно нескольких способов стилизации директива **~style** будет добавлять только новые CSS-объявления к уже существующим, не удаляя предыдущие.

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

Однако, если в атрибут **style** данные передаются с помощью биндинга, то директива **~style** игнорируется.

Например,

```javascript _run_edit_error_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div :style="'background: yellow; padding: 10px'" ~style="myStyle" @tap="changeStyle">Щелкни по мне</div>
    `,
    myStyle: "color: green",
    changeStyle() {
        this.myStyle = this.myStyle === 'color: green' ? 'color: red' : 'color: green';
    }});
```

В данном примере менять цвет шрифта с помощью директивы **~style** не удастся. Как видно на экране, задаваемые с помощью нее CSS-объявления игнорируются.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/RbZrBh4KWbk?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
