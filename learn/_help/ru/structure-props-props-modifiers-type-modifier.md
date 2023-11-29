Модификатор **type** используется для явного указания типа свойства.

Он задается следующим образом:

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button @tap="onTap">Счетчик: {{counter}} Тип: {{counter.constructor.name}}</button>
    `,
    $public: {
        counter: {
            $def: 0,
            $type: Number
        }
    },
    onTap() {
        this.counter++;
    }
});
```

Если тип свойства можно однозначно определить по его начальному значению, то модификатор **type** можно не указывать. Он будет задан в этом случае автоматически.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button @tap="onTap">Счетчик: {{counter}} Тип: {{counter.constructor.name}}</button>
    `,
    $public: {
        counter: {
            $def: 0
        }
    },
    onTap() {
        this.counter++;
    }
});
```

В этом примере начальное значение **0** позволяет однозначно отнести свойство **counter** к типу **Number**. Использовать для этого модификатор **type** не имеет никакого смысла.

При использовании сокращенной формы записи тип свойства также определяется автоматически по начальному значению.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button @tap="onTap">Счетчик: {{counter}} Тип: {{counter.constructor.name}}</button>
    `,
    $public: {
        counter: 0
    },
    onTap() {
        this.counter++;
    }
});
```

В этом случае модификатор **type** и фигурные скобки у свойства указывать не нужно.

Модификатор **type** имеет больший приоритет по сравнению с типом начального значения свойства.

Например, если у свойства указать начальное значение с типом, отличающимся от типа, указанного в модификаторе **type**, то это значение сначала будет приведено к указанному типу, а только затем присвоено самому свойству.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div>Значение: {{victoryDay}} Тип: {{victoryDay.constructor.name}}</div>
    `,
    $public: {
        victoryDay: {
            $def: '1945-05-09',
            $type: Date
        }
    }
});
```

В этом примере у свойства явно указан тип **Date**, а в качестве начального значения задана строковая константа **'1945-05-09'**. Так как заданный тип имеет наибольший приоритет, то строковая константа будет автоматически преобразована к типу **Date**, а только затем она будет присвоена свойству **victoryDay**. В результате этого свойство **victoryDay** будет иметь тип **Date**, а не **String**.

Свойства с типами: **Number**, **String**, **Boolean**, **Date** и **BigInt** всегда имеют статическую типизацию. Это означает, что изменить их тип после задания начального задания уже невозможно. Если такому свойству во время работы присвоить значение какого-либо другого типа, то оно сначала будет преобразовано к начальному типу свойства, а только затем присвоено ему.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button @tap="onTap">Значение: {{digit}} Тип: {{digit.constructor.name}}</button>
    `,
    $public: {
        digit: {
            $def: 1,
            $type: Number
        }
    },
    onTap() {
        this.digit = this.digit === 1 ? 'Это строка' : 1;
    }
});
```

В этом примере у свойства **digit** явно задан тип **Number**. В обработчике нажатия кнопки этому свойству присваивается константа строкового типа **'Это строка'**, но из-за статической типизации эта константа перед присвоением будет автоматически преобразована к типу **Number**. Фреймворк преобразует ее в число **0**.

Помимо типов: **Number**, **String**, **Boolean**, **Date** и **BigInt** в модификаторе **type** можно указать любые другие типы, предусмотренные в языке JavaScript. Однако в этом случае механизм статической типизации для них работать уже не будет.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button @tap="onTap">Значение: {{collection}} Тип: {{collection.constructor.name}}</button>
    `,
    $public: {
        collection: {
            $def: ['Это массив'],
            $type: Array
        }
    },
    onTap() {
        this.collection = this.collection !== 'Это строка' ? 'Это строка' : ['Это массив'];
    }
});
```

В этом примере свойство **collection** задано с типом **Array**. Однако при нажатии на кнопку ему будет присвоено значение **'Это строка'** строкового типа. В результате этого свойство динамически изменяет свой тип на **String**. При повторном нажатии на кнопку свойству будет присвоен массив и его тип опять станет **Array**.

Такой механизм работы со свойствами получил название динамической типизации, так как тип свойства изменяется динамически при каждом присвоении ему значения другого типа.

Статическую типизацию принципиально нельзя задать у свойства с несколькими альтернативными типами.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button @tap="onTap">{{victoryDay.constructor.name}}: {{victoryDay}}</button>
    `,
    $public: {
        victoryDay: {
            $def: 1945,
            $type: [Number, String]
        }
    },
    onTap() {
        switch( typeof this.victoryDay ) {
            case "number": this.victoryDay = "9 мая 1945";
                break;
            case "string": this.victoryDay = new Date("1945-05-09");
                break;
            case "object": this.victoryDay = 1945;
        }
    }
});
```

Из этого примера видно, что свойство **victoryDay** начинает динамически изменяет свой тип в зависимости от последнего присвоенного значения, не смотря на то, что оба типа, заданные у свойства, относятся к статической типизации, т.е. статическая типизация в этом случае автоматически заменяется на динамическую.

При работе со свойствами необходимо внимательно следить за их типом, особенно при использовании статической типизации.

```javascript _error_run_edit_[my-component.js]_h=40_
ODA({
    is: 'my-component',
    template: `
        <label><input type="checkbox" ::checked="isChecked">{{isChecked==='true' ? "Я отмечен" : "Я не отмечен"}}</label>
        <div>Тип: {{isChecked.constructor.name}} Значение: {{isChecked}}</div>
    `,
    $public: {
        isChecked: {
            $def: 'true',
            $type: String
        }
    }
});
```

В данном примере происходит неожиданная ошибка. Элемент **input** с типом **checkbox** возвращает значение логического типа **true** или **false** через атрибут **checked**. Это значение через механизм двойного биндинга передается свойству **isChecked**. При первом нажатии на флажок этому свойству передается логическое значение **false**, которое из-за механизма статической типизации преобразуется в строку **"false"**, а непустая строка уже не является логической ложью. Это значение передается как истина обратно элементу **input** и флажок опять фиксируется в активном состоянии, хотя само свойство имеет строковое значение **"false"**. В данном примере несогласованность типов атрибута **checked** и свойства **isChecked** приводит к несогласованности их значений и нарушению нормальной работы флажка.

Чтобы исправить эту ошибку необходимо у свойства **isChecked** указать правильный тип **Boolean**.

```javascript _run_edit_[my-component.js]_h=40_
ODA({
    is: 'my-component',
    template: `
        <label><input type="checkbox" ::checked="isChecked">{{isChecked ? "Я отмечен" : "Я не отмечен"}}</label>
        <div>Тип: {{isChecked.constructor.name}} Значение: {{isChecked}}</div>
    `,
    $public: {
        isChecked: {
            $def: 'true',
            $type: Boolean
        }
    }
});
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/yHueM94LlbA?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>

