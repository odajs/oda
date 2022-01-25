**Переменные** – это приватные свойства компонента, предназначенные хранения данных и обмена данными между элементами компонента.

Переменные объявляются в корневом разделе компонента также как обычные свойства внутри объекта языка JavaScript. Переменные задаются в виде пары **«ключ: значение»**, где **ключ** выступает в качестве имени переменной, а второй параметр задает начальное значение переменной.

```warning_md
1. Имя переменной должно удовлетворять требования спецификации [ECMAScript](https://ecma-international.org/ecma-262/6.0/#sec-object-initializer), т.е. быть валидным JS-идентификатором.
2. Имя переменной не должно совпадать с зарезервированными именами свойств компонента *is*, *extends*, *props* и т.д..
3. Имена переменных и имена свойств в разделе **props** не должны совпадать.
```

Например:

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div>{{myProperty}}</div>
        <div>{{myVariable}}</div>
    `,
    props: {
        myProperty: 'Hello, property!'
    },
    myVariable: 'Hello, variable!'
});
```

Переменные можно объявлять, используя kebab-нотацию. Для этого имя переменной необходимо заключить в кавычки, а обращаться к ней с помощью оператора квадратных скобок **this['my-variable']**.

Например,

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div>{{this['my-variable']}}</div>
    `,
     'my-variable': 'Невалидное JS-имя переменной'
});
```

Переменные, также как и свойства в разделе в разделе **props**, обладают полной реактивностью. Переменные могут использоваться в директивах биндинга и двойного биндинга для обмена данными с элементами компонента. Для переменных можно создавать обозреватели.

Например,

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        Текущее время: <input :value>
    `,
    value: '',
    time: undefined,
    ready() {
        setInterval(()=>{this.time = new Date()},1000);
    },
    observers: [
        function observer(time) {
            this.value = time.toTimeString().substr(0,8);
        }
    ]
});
```

В данном примере каждую секунду переменной **time** присваивается текущее время. Фреймворк отслеживает изменение переменной **time** и вызывает метод-обозреватель **observer**, в котором переменной **value** присваивается новое время. Механизм биндинга отслеживает изменение переменной **value** и передает новое значение в HTML-элемент **input** для отображения.

Переменные, в отличие от свойств в разделе **props**, не могут иметь гетеры, сетеры и модификаторы свойств.

Переменные могут использоваться только внутри компонента. Им нельзя с помощью директивы биндинга передавать значения при вызове компонента.

Например:

```javascript edit_[base-component.js]
ODA({
    is: 'base-component',
    template: `
        <div>{{myProperty}}</div>
        <div>{{myVariable}}</div>
    `,
    props: {
        myProperty: 'Значение свойства по умолчанию'
    },
    myVariable: 'Значение переменной по умолчанию'
});
```

```javascript run_edit_blob_[my-component.js]_{base-component.js}
ODA({
    is: 'my-component',
    template: `
            <base-component :my-property="'Значение свойства изменено'"
                            :my-variable="'Значение переменной изменено'"></base-component>
    `
});
```

Из примера видно, что биндинг выполнен только для свойства **myProperty**, а для переменной **myVariable** не выполнен.

Переменные не отображаются в инспекторе свойств компонента.

Например:

```javascript edit_[base-component2.js]
ODA({
    is: 'my-component',
    template: `
        <div>{{myProperty}}</div>
        <div>{{myVariable}}</div>
    `,
    props: {
        myProperty: 'Hello, property!'
    },
    myVariable: 'Hello, variable!'
});
```

```javascript run_edit_blob_[my-view.js]_{base-component2.js}_h=200_
import 'https://odajs.org/tools/property-grid/property-grid.js';
ODA({
    is: 'my-view',
    template: `
        <oda-property-grid>
            <my-component></my-component>
        </oda-property-grid>
    `
});
```
