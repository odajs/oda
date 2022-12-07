Модификатор **type** используется для явного указания типа свойства.

Он задается только в расширенной формате объявления свойства с помощью идентификатора **type**.

Например:

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

Значение этого модификатора может быть один из следующих типов языка JavaScript:

1. Number — любое целое или вещественное число с плавающей запятой.
2. String — любая строка в двойных, одинарных или обратных одинарных кавычках.
3. Boolean — логический тип, который может принимать только два значения **true** или **false**.
4. Date — объект даты и времени.
5. BigInt — целые числа произвольной длины (в текущей версии не реализовано).

Модификатор **type** можно не указывать, если тип свойства однозначно определяется по его начальному значению. Так в предыдущем примере начальное значение **0** однозначно относит свойство **counter** к типу **Number**, и указывать явно модификатор **type** не имеет смысла. В этом случае удобнее использовать сокращенный синтаксис объявления свойства.

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

Свойства, объявленные с перечисленными выше типами, имеют статическую типизацию. Их тип нельзя изменить присвоением значения другого типа. При этом неважно, как изначально был задан тип, с помощью модификатора **type** или неявным образом через начальное значение.

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

В этом примере у свойства **digit** явно задан тип **Number**. В обработчике нажатия кнопки этому свойству присваивается константа строкового типа **'Это строка'**, но из-за статической типизации эта константа будет преобразована к типу **Number** перед присвоением. В результате свойство будет иметь значение **0**.

```info_md
Если тип начального значения не совпадает с объявленным типом свойства, то начальное значение автоматически преобразуется к объявленному типу.
```

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

В этом примере у свойства явно указан тип **Date**, а в качестве начального значения задана константа строкового типа **'1945-05-09'**. Фрамеворк преобразует эту строку в тип **Date** перед присвоением начального значения свойству.

При объявлении свойства необходимо тщательно следить за его типом, особенно если оно используется для передачи логических значений.

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

В данном примере в теге **&lt;input&gt;** логический атрибут **checked** связан двунаправленным биндингом со свойством **isChecked**, имеющим тип **String**. Это изначально приводит к ошибке, так как не пустая строка **'False'** рассматривается как логическое значение **true**, и флажок будет отмечен. Пощелкайте по флажку и убедитесь, что поведение флажка отличается от ожидаемого. Так для его перевода в активное состояние достаточен один щелчок мышкой, а для сброса флажка по нему необходимо щелкнуть два раза. Такое поведение вызвано преобразованием возвращаемого флажком значения в строку **'true'** или **'false'** перед присвоением свойству **isChecked**, а непустая строка имеет значение **true** и удерживает флажок в активном состоянии.

Помимо вышеперечисленных типов в модификаторе **type** можно указать любые другие типы, существующие в JavaScript. Однако в этом случае свойство получит динамическую типизацию, и его тип будет определяться типом последнего присвоенного ему значения.

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

В этом примере у свойства **collection** явно задан тип **Array**. По нажатию кнопки происходит присвоение свойству константы строкового типа **'Это строка'**, что меняет его тип на **String**. Повторное нажатие кнопки возвращает свойству тип **Array** из-за присвоения ему соответствующего значения.

У свойства нельзя задать статическую типизацию, указав несколько альтернативных типов в виде массива с помощью модификатора **type**.

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

Из примера видно, что свойство **victoryDay** динамически изменяет свой тип в зависимости от последнего присвоенного значения. В результате этого статическая типизация заменяется на динамическое определение типа.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/yHueM94LlbA?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>

