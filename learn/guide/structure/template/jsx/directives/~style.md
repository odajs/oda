Директива **~style** используется для связывания одного или нескольких CSS-правил с атрибутом **style** любого HTML-элемента.

Значение директивы **~style** автоматически формирует значение атрибута **style** соответствующего HTML-элемента, задавая стиль его отображения.

Пример 1.

```javascript _run_line_edit_[my-component.js]
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

В этом примере значение свойства **myStyle** передается через директиву **~style** атрибуту **style** элемента **div**, в следствие чего он изменяет стиль своего отображения.

В отличие от обычного присвоения директива **~style** позволяет использовать механизм реактивности фреймворка. В результате этого любое изменение связанного свойства компонента будет автоматически приводить к изменению стиля отображения соответствующего HTML-элемента.

Пример 2.

```javascript _run_line_edit_[my-component.js]
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

Значение директивы **~style** можно задать разными способами. Например, с помощью строковых литералов, указанных в одинарных прямых кавычках (**'**), называемых апострофами.

Пример 3.

```javascript _run_line_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="'background: green; color: yellow; padding: 10px'">Стиль в виде строкового литерала</div>
    `,
});
```

Если для указания строки использовать обратные одинарные кавычки (**`**), называемые грависами, то их придется экранировать символом обратного слэша **\\**, так как такие кавычки уже используются для задания свойства **template** самого компонента и указывать другие такие же кавычки внутри первых без экранирования уже невозможно.

Пример 4.

```javascript _run_line_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="\`background: green; color: yellow; padding: 10px\`">Стиль в виде шаблонного литерала</div>
    `,
});
```

Вместо строковых литералов в директиве **~style** можно указать обычный объекта, в котором каждое его свойство будет задавать отдельное объявление CSS-стиля.

Пример 5:

```javascript _run_line_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="{background: 'green', color: 'yellow', padding: '10px'}">Стиль в виде литерального объекта</div>
    `,
});
```

В этом случае значения свойств у такого объекта придется указывать в кавычках, так как они должны иметь строковый тип. Например, **'green'**.

Если имя CSS-свойства имеет неразрешенное с точки зрения языка JavaScript значение, то его придется тоже записать в одинарных кавычках.

Пример 6.

```javascript _run_line_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="{'background-color': 'green', color: 'yellow', padding: '10px'}">Экранирование невалидных имен в объекте</div>
    `,
});
```

Однако для записи такого имени можно использовать **сamel** нотацию. В этом случае указывать имя в апострофах будет уже не нужно. Оно будет автоматически преобразовано в правильную **kebab**-нотацию при его записи в атрибуты HTML-элемента.

Пример 7.

```javascript error_run_line_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="{backgroundColor: 'green', color: 'yellow', padding: '10px'}">Использование Camel-нотации</div>
    `,
});
```

Такое преобразование происходит не только для строковых литералов, но и для свойств отдельных объектов.

Пример 8.

```javascript _run_line_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="myStyle">Стиль в виде объектного свойства</div>
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

Следует отметить, что механизм реактивности будет работать только тогда, когда непосредственно изменяется значение связанного свойства компонента.

Пример 9.

```javascript _run_line_edit_[my-component.js]
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
        let b = {background: 'yellow', color: 'green', padding: '5px'};
        this.myStyle = JSON.stringify(this.myStyle)===JSON.stringify(a)? b : a;
    }
});
```

Если изменить значение у отдельных свойств этого объекта, то механизм реактивности не сработает.

Пример 10.

```javascript _run_line_edit_[my-component.js]
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

Для его включения необходимо будет объект записать в литеральной форме и указать отдельное свойство компонента в качестве значения связанного с ним свойства объекта.

Пример 11.

```javascript _run_line_edit_[my-component.js]
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

В этом случае любое изменение свойства компонента, будут приводить к автоматическому изменению значения связанного с ним свойства заданного объекта.

Если значение директивы **~style** указать в строковой нотации, то механизм реактивности можно будет включить только с использованием шаблонных строк.

Пример 12.

```javascript _run_line_edit_[my-component.js]
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
В этом случае обязательно необходимо экранировать символ **$**, иначе интерполяционное выражение будет применено к шаблонному литералу, заданному в свойстве **template** самого компонента, а не к значению директивы **~style**.
```

В интерполяционном выражении можно также использовать отдельные свойства объекта.

Пример 11.

```javascript _run_line_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="\`background: \${myColor.background}; color: yellow; padding: 10px\`" @tap="_changeStyle">Щелкни по мне</div>
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

Если шаблонный литерал указать внутри обычной строки, то механизм реактивности работать не будет.

Пример 12:

```javascript error_run_line_edit_[my-component.js]
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

Здесь шаблонный литерал рассматривается как часть строки и он не будет обрабатываться директивой **~style** как интерполяционное выражение.

```warning_md
В разделе **props** компонента нельзя задать свойство с именем **style**, так как все компоненты являются наследниками класса **HTMLElement**, в котором уже задано свойство **style**. Оно используется для хранения CSS-объявлений. При задание свойства с тем же самым именем оно перекроет унаследованное родительское свойство **style** со всеми его установленными стилями.
```

Пример 13:

```javascript _run_line_edit_error_[my-component.js]
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

В данном примере свойство **style** компонента перекрывает родительское свойство с тем же самым именем **style**. В результате этого желтый цвет шрифта на желтом фоне становится невидимым. Однако если щелкнуть по первому элементу **div**, то его фон изменится и текст надписи можно будет прочитать.

Директива **~style** только добавляет CSS-правила к уже существующим, не удаляя предыдущие.

Пример 14:

```javascript _run_line_edit_[my-component.js]
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

```error_md
Если CSS-правило в директиве **~style** совпадет с уже существующим в атрибуте **style** HTML-элемента, то оно перекроет его.
```

Пример 15:

 ```javascript _run_line_edit_[my-component.js]
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

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/RbZrBh4KWbk?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
