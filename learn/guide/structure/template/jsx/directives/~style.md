Директива **~style** используется для реактивной стилизации любого HTML-элемента, объявленного внутри компонента.

Значение директивы **~style** автоматически связывается со значение атрибута **style** любого HTML-элемента, задавая стиль его отображения.

Пример 1.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="myStyle">Директива ~style</div>
    `,
    props: {
        myStyle: "background: yellow; color: green ; padding: 10px"
    }
});
```

В этом примере значение свойства компонента **myStyle** передается через директиву **~style** атрибуту **style** элемента **div**, в следствие чего у него изменяется стиль отображения.

В отличие от обычного присвоения директива **~style** позволяет использовать механизм реактивности, т.е. позволяет автоматически изменяет стиль отображения соответствующего HTML-элемента при изменении значения связанного с ним свойства компонента.

Пример 2.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="myStyle" @tap="_changeStyle">Щелкни по мне</div>
    `,
    props: {
        myStyle: "background: green; color: yellow; padding: 10px"
    },
    _changeStyle() {
        let myStyle1 = "background: green; color: yellow; padding: 10px";
        let myStyle2 = "background: yellow; color: green; padding: 10px";
        this.myStyle = this.myStyle === myStyle1 ? myStyle2 : myStyle1;
    }
});
```

Здесь при щелчке изменяется значение свойства компонента **myStyle**, что приводит к автоматическому изменению стиля отображения HTML-элемента **div**, в котором была указана эта директива **~style**.

Значение директивы **~style** можно задать не только в виде свойства компонента, но в виде обычной строки.

Пример 3.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="'background: green; color: yellow; padding: 10px'">Стиль, заданный в виде строкового литерала</div>
    `,
});
```

При использовании шаблонных литералов придется экранировать каждый символ обратной одинарной кавычки (**`**), так как такие кавычки уже используются при задании свойства **template** самого компонента, а использование вложенных кавычек одного и того же типа без их экранирования в языке JavaScript запрещено.

Пример 4.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="\`background: yellow; color: green; padding: 10px\`">Стиль, заданный в виде шаблонного литерала</div>
    `,
});
```

В качестве значения директивы **~style** вместо строковых литералов можно использовать обычный объект. В этом случае каждое свойство этого объекта будет соответствовать отдельному CSS-объявлению правила отображения HTML-элемента.

Пример 5:

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="{background: 'green', color: 'yellow', padding: '10px'}">Стиль, заданный в виде литерального объекта</div>
    `,
});
```

Обратите внимание, что в отличие от строковых литералов значения свойств у такого объекта необходимо указывать в кавычках, так как они обязательно должны иметь строковый тип. Например, **'green'**.

Если имя в CSS-объявлении имеет неразрешенное с точки зрения языка JavaScript значение, то его тоже необходимо будет записать в кавычках.

Пример 6.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="{'background-color': 'green', color: 'yellow', padding: '10px'}">Экранирование невалидных имен свойств объекта</div>
    `,
});
```

Однако если использовать верблюжью нотацию (Camel case), то неразрешенное имя будет автоматически преобразовано в правильную форму, с добавлением дефиса (**-**) между словами. Указывать его в апострофах в этом случае уже будет не нужно.

Пример 7.

```javascript run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="{backgroundColor: 'green', color: 'yellow', padding: '10px'}">Использование верблюжьей нотации</div>
    `,
});
```

Также автоматическое преобразование невалидных имен свойств из верблюжьей нотацию в шашлычную (Kebab case) происходит для любого объекта, указанного в директиве **~style**.

Пример 8.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="myStyle">Верблюжья нотация для свойств объекта</div>
    `,
    props: {
        myStyle: {
            backgroundColor: 'green',
            color: 'yellow',
            padding: '10px'
        }
    }
});
```

Следует отметить, что механизм реактивности работает только при изменении значения всего свойства компонента, а не при изменение его отдельных элементов.

Пример 9.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="myStyle" @tap="_changeStyle">Щелкни по мне</div>
    `,
    props: {
        myStyle: {
            background: 'green',
            color: 'yellow',
            padding: '10px'
        }
    },
    _changeStyle() {
        let a = {background: 'green', color: 'yellow', padding: '10px'};
        let b = {background: 'yellow', color: 'green', padding: '10px'};
        this.myStyle = JSON.stringify(this.myStyle)===JSON.stringify(a)? b : a;
    }
});
```

При изменение отдельных свойств связанного объекта механизм реактивности работать не будет.

Пример 10.

```javascript _error_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="myStyle" @tap="_changeStyle">Щелкни по мне</div>
    `,
    props: {
        myStyle: {
            background: 'green',
            color: 'yellow',
            padding: '10px'
        }
    },
    _changeStyle() {
        this.myStyle.background = this.myStyle.background === 'green' ? 'yellow' : 'green';
    }
});
```

Для его включения сам объект необходимо записать в литеральной форме, а в качестве значения его свойства нужно указать имя того свойства компонента, с которым это значение должно быть связанно.

Пример 11.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="{background: myColor, color: 'yellow', padding: '10px'}" @tap="_changeStyle">Щелкни по мне</div>
    `,
    props: {
        myColor: 'green'
    },
    _changeStyle() {
        this.myColor = this.myColor === 'green' ?  'red' : 'green';
    }
});
```

В этом случае любое изменение свойства компонента, будет приводить к автоматическому изменению связанного с ним свойства CSS-объекта.

Если значение директивы **~style** записать в виде строки, то механизм реактивности будет работать только при использовании шаблонных литералов.

Пример 12.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="\`background: \${myColor}; color: yellow; padding: 10px\`" @tap="_changeStyle">Щелкни по мне</div>
    `,
    props: {
        myColor: 'green'
    },
    _changeStyle() {
        this.myColor = this.myColor === 'green' ?  'red' : 'green';
    }
});
```

``` warning_md
В этом случае символ **$** обязательно нужно экранировать, иначе интерполяционное выражение будет применятся к свойству **template** компонента, а не к значению директивы **~style**.
```

В интерполяционном выражении можно использовать отдельные свойства объекта.

Пример 11.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="\`background: \${myStyle.background}; color: yellow; padding: 10px\`" @tap="_changeStyle">Щелкни по мне</div>
    `,
    props: {
        myStyle: {
            background: 'green',
            color: 'yellow',
            padding: '10px'
        }
    },
    _changeStyle() {
        this.myStyle.background = this.myStyle.background === 'green' ? 'red' : 'green';
    }
});
```

Заметьте, что если шаблонный литерал записан внутри обычной строки, то механизм реактивности работать не будет.

Пример 12.

```javascript error_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="'background: \`\${myColor}\`'" @tap="_changeStyle">Щелкни по мне</div>
    `,
    props: {
        myColor: 'green'
    },
    _changeStyle() {
        this.myColor = this.myColor === 'green' ? 'red' : 'green';
    }
});
```

В этом примере шаблонный литерал рассматривается лишь как часть строки и директивой **~style** как интерполяционное выражение отдельно не воспринимается.

```warning_md
Не задавайте у самого компонента свойство с именем **style**, так как такое свойство уже задано в классе **HTMLElement**, наследниками которого являются все компоненты. Если это будет сделано по ошибке, то такое свойство перекроет унаследованное родительское свойство **style** со всеми его CSS-объявлениями.
```

Пример 13.

```javascript _run_edit_error_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="myStyle" @tap="_changeStyle">Не делайте так</div>
        <div>Свойство style компонента перекрыто по ошибке</div>
    `,
    props: {
        myStyle: "background: yellow",
        style: {
            default: "background: red; color: yellow",
            reflectToAttribute: true
        }
    },
    _changeStyle() {
        this.myStyle = this.myStyle === "background: yellow" ?  "background: green" : "background: yellow";
    }
});
```

В данном примере свойство **style** компонента перекрывает родительское свойство с тем же самым именем. В результате этого желтый цвет шрифта на желтом фоне становится невидимым. Однако если щелкнуть по первому элементу **div**, то его фон изменится и текст надписи станет читаемым.

В этом примере цвет фона будет не зеленым, а желтым, так как директива **~style** перекрыла значение CSS-объявления **background**, указанное в атрибуте **style** HTML-элемента, своим значением, заданным в свойстве **myStyle**.

В случае использования одновременно нескольких способов стилизации директива **~style** будет добавлять только новые CSS-объявления к уже существующим, не удаляя предыдущие.

Пример 14.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div style="background: green" ~style="myStyle" @tap="_changeStyle">Директива ~style добавила CSS-свойство color</div>
    `,
    props: {
        myStyle: "color: yellow",
    },
    _changeStyle() {
        this.myStyle = this.myStyle ==="color: yellow" ?  "color: white" : "color: yellow";
    }
});
```

```warning_md
Если какое-либо CSS-объявление, указанное  в директиве **~style**, совпадет с уже существующим, то оно перекроет его значение.
```

Пример 15.

 ```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div style="background: green" ~style="myStyle">Директива ~style перекрыла существующее CSS-свойство</div>
    `,
    props: {
        myStyle: "background: yellow"
    }
});
```

В этом примере цвет фона будет не зеленым, а желтым, так как директива **~style** перекрыла значение CSS-объявления **background**, указанное в атрибуте **style** HTML-элемента, своим собственным значением, заданным в свойстве **myStyle**.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/RbZrBh4KWbk?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
