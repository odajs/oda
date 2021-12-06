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

В этом примере значение свойства **myStyle** через директиву **~style** задает значение атрибута **style** HTML-элемента **div**, в следствие чего он изменяет стиль своего отображения.

В отличие от обычного присвоения стиля, использование директивы **~style** позволяет включить механизм реактивности. В результате этого любое изменение свойства компонента будет автоматически приводить к изменению стиля его отображения.

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

Если для указания строковых литералов использовать обратные одинарные кавычки (**`**), называемые грависами, то их придется экранировать символом обратного слэша **\\**, так как такие кавычки уже используются для задания свойства **template** самого компонента и указывать другие такие же кавычки внутри них без экранирования уже нельзя.

Пример 4.

```javascript _run_line_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="\`background: green; color: yellow; padding: 10px\`">Стиль в виде шаблонного литерала</div>
    `,
});
```

Предыдущие примеры, использующие строковые литералы, можно записать с помощью обычного объекта, в котором каждое CSS-объявление задается в виде отдельного свойства.

Пример 5:

```javascript _run_line_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="{background: 'green', color: 'yellow', padding: '10px'}">Стиль в виде литерального объекта</div>
    `,
});
```

В этом случае значения CSS-свойств у такого объекта придется указывать в кавычках, так как они должны иметь строковый тип.

Если имя CSS-свойства имеет неразрешенное с точки зрения языка JavaScript значение, то его придется записывать тоже в одинарных кавычках.

Пример 6.

```javascript _run_line_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="{'background-color': 'green', color: 'yellow', padding: '10px'}">Экранирование невалидных имен в объекте</div>
    `,
});
```

Однако такое имя можно записать в **Сamel**-нотации. В этом случае оно будет автоматически преобразовано в **kebab**-нотацию при подстановке его в атрибут **style** соответствующего HTML-элемента.

Пример 7.

```javascript error_run_line_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="{backgroundColor: 'green', color: 'yellow', padding: '10px'}">Использование Camel-нотации</div>
    `,
});
```

Такое преобразование происходит не только при использовании строковых литералов, но и при задании CSS-свойств с помощью отдельного объекта.

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

Следует отметить, что механизм реактивности работает только при изменении ссылки на сам объект, указанный в директиве **~style**.

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

Если изменить значение отдельных свойств этого объекта, то механизм реактивности работать не будет.

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

Для его включения необходимо объект с CSS-стилями записать в литеральной форме и связать значения его свойств со свойства самого компонента. Для этого достаточно указать вместо значения CSS-свойства имя соответствующего свойства компонента.

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

В этом случае любое изменение такого свойства, будут приводить к автоматическому изменению значения связанного с ним CSS-объявления.

Если значение директивы **~style** указать в строковой нотации, то механизм реактивности можно будет включить только с использованием интерполяционных подстановок в шаблонных литералах.

Пример 12.

```javascript _run_line_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="\`background: ${myColor}, color: 'yellow', padding: '10px'\`" @tap="_changeStyle">Щелкни по мне</div>
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
В этом случае обязательно осуществить экранирование знаков грависа **`** (обратной кавычки) и доллара **$** с помощью символа обратного слэша **\\**.
```

Экранирование грависов связано с тем, что эти символы уже используются для задания самого шаблона компонента, а знак **$** перед фигурными скобками вызовет обработку интерполяционного выражения **${myColor}** еще до разбора самого шаблона компонента, когда свойство **myColor** компонента еще не определено.

Если же использовать экранирование, то директива **stуle** будет сформирована правильно, и после разбора шаблона она подставит свойство компонента вместо интерполяционного выражения. Это свойство будет динамически связано со значением CSS-объявления стиля компонента.

В интерполяционном выражении можно использовать и отдельные свойства объекта.

Пример 11:
```javascript _run_line_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~style="{background: \`\${myStyle.background}\`, color: 'yellow', padding: '10px'}" @tap="_changeStyle">Щелкни по мне</div>
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

В этом случае реактивность будет работать уже при изменении указанного свойства, а не всего объекта.

Все остальные варианты не будут приводить к возникновению реактивности у отдельных CSS-объявлений.

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

Здесь шаблонный литерал рассматривается как часть строки и он не будет обрабатываться директивой **~style**, как интерполяционное выражение.

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
