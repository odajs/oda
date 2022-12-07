Модификатор **type** используется для явного указания типа свойства.

Он задается при объявлении свойства следующим образом:

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button @tap="onTap">Счетчик: {{counter}} Тип: {{counter.constructor.name}}</button>
    `,
    props: {
        counter: {
            default: 0,
            type: Number
        }
    },
    onTap() {
        this.counter++;
    }
});
```

Если тип свойства можно однозначно определить по его начальному значению,
то модификатор **type** можно не указывать. Он будет задан автоматически по типу начального значения.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button @tap="onTap">Счетчик: {{counter}} Тип: {{counter.constructor.name}}</button>
    `,
    props: {
        counter: {
            default: 0
        }
    },
    onTap() {
        this.counter++;
    }
});
```

В этом примере начальное значение **0** позволяет однозначно отнести свойство **counter** к типу **Number**. Использовать для этого модификатор **type** не имеет никакого смысла.

Аналогично тип свойства будет задан по типу начального значения при использовании сокращенной формы записи, в которой не указываются никакие дополнительные модификаторы и фигурные скобки.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button @tap="onTap">Счетчик: {{counter}} Тип: {{counter.constructor.name}}</button>
    `,
    props: {
        counter: 0
    },
    onTap() {
        this.counter++;
    }
});
```

Если одновременно указать и тип свойства и начальное значение, то тип свойства будет иметь больший приоритет.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div>Значение: {{victoryDay}} Тип: {{victoryDay.constructor.name}}</div>
    `,
    props: {
        victoryDay: {
            default: '1945-05-09',
            type: Date
        }
    }
});
```

В этом примере у свойства явно указан тип **Date**, а в качестве начального значения задана строковая константа **'1945-05-09'**. Так как заданный тип имеет наибольший приоритет, то строковая константа будет автоматически преобразована к типу **Date**, а только затем присвоена свойству **victoryDay**. В результате этого свойство будет иметь тип **Date**, а не **String**.

Свойства с типами: Number, String, Boolean, Date и BigInt всегда имеют статическую типизацию. Это означает, что их тип после задания изменить уже будет нельзя. Если такому свойству присвоить значение другого типа, то оно сначала будет преобразовано к заданному типу свойства, а только потом присвоено ему.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button @tap="onTap">Значение: {{digit}} Тип: {{digit.constructor.name}}</button>
    `,
    props: {
        digit: {
            default: 1,
            type: Number
        }
    },
    onTap() {
        this.digit = this.digit === 1 ? 'Это строка' : 1;
    }
});
```

В этом примере у свойства **digit** явно задан тип **Number**. В обработчике нажатия кнопки этому свойству присваивается константа строкового типа **'Это строка'**, но из-за статической типизации эта константа перед присвоением будет автоматически преобразована к типу **Number**. В результате этого свойство будет иметь значение не **'Это строка'**, а **0**, преобразованное фреймворком в число. При присвоении числовых значений этому свойству никаких ошибки не возникнут. Числа будут оставаться числами.

Помимо типов: Number, String, Boolean, Date и BigInt в модификаторе **type** можно указать любые другие типы, предусмотренные в языке JavaScript. Однако для них механизм статической типизации работать уже не будет.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button @tap="onTap">Значение: {{collection}} Тип: {{collection.constructor.name}}</button>
    `,
    props: {
        collection: {
            default: ['Это массив'],
            type: Array
        }
    },
    onTap() {
        this.collection = this.collection !== 'Это строка' ? 'Это строка' : ['Это массив'];
    }
});
```

В этом примере свойство **collection** задано с типом **Array**. Однако при нажатии на кнопку ему будет присвоено значение строкового типа **'Это строка'**. В результате этого свойство динамически изменяет свой тип на **String**. При повторном нажатие на кнопку свойству будет присвоен массив и его тип опять измениться на **Array**.

Такой механизм работы со свойствами получил название динамической типизации, так как тип свойства изменяется динамически при очередном присвоении ему значения определенного типа.

Статическую типизацию принципиально нельзя задать у свойства с несколькими альтернативными типами.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button @tap="onTap">{{victoryDay.constructor.name}}: {{victoryDay}}</button>
    `,
    props: {
        victoryDay: {
            default: 1945,
            type: [Number, String]
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

Из этого примера видно, что свойство **victoryDay** начинает динамически изменяет свой тип в зависимости от последнего присвоенного значения не смотря на то, что у свойства заданы оба типа, относящиеся к статической типизации, т.е. статическая типизация в этом случае заменяется на  динамическую.

При работе со свойствами необходимо внимательно следить за их типом, особенно при использовании статической типизации.

```javascript _error_run_edit_[my-component.js]_h=40_
ODA({
    is: 'my-component',
    template: `
        <label><input type="checkbox" ::checked="isChecked">{{isChecked ? "Я отмечен" : "Я не отмечен"}}</label>
        <div> Тип: {{isChecked.constructor.name}} Значение: {{isChecked}}</div>
    `,
    props: {
        isChecked: {
            default: 'False',
            type: String
        }
    }
});
```

В данном случае происходит неожиданная ошибка.
В данном примере в теге **&lt;input&gt;** логический атрибут **checked** связан двунаправленным биндингом со свойством **isChecked**, имеющим тип **String**. Это изначально приводит к ошибке, так как не пустая строка **'False'** рассматривается как логическое значение **true**, и флажок будет отмечен. Пощелкайте по флажку и убедитесь, что поведение флажка отличается от ожидаемого. Так для его перевода в активное состояние достаточен один щелчок мышкой, а для сброса флажка по нему необходимо щелкнуть два раза. Такое поведение вызвано преобразованием возвращаемого флажком значения в строку **'true'** или **'false'** перед присвоением свойству **isChecked**, а непустая строка имеет значение **true** и удерживает флажок в активном состоянии.



<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/yHueM94LlbA?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>

