Модификатор **type** используется для явного указания типа свойства.

Этот модификатор задается только в расширенной форме с помощью идентификатора **type**.

Например:

```javascript _run_edit_console_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button  @tap="_onTap">Счетчик: {{_counter}}</button>
    `,
    props: {
        _counter: {
            default: 0,
            type: Number
        }
    },
    _onTap() {
        this._counter++;
    }
});
```

Значение этого идентификатора может быть любым существующим типом языка JavaScript.

Для примитивных типов можно использовать следующие значения:

1. Number — любое целое или вещественное число с плавающей запятой.
2. String — любая строка в двойных, одинарных или обратных одинарных кавычках.
3. Boolean — логический тип, который может принимать только два значения **true** или **false**.
4. BigInt — целые числа произвольной длины.

Модификатор **type** можно не указывать, если тип свойства однозначно определяется по его начальному значению. Так в предыдущем примере начальное значение **0** однозначно относит свойство **_counter** к типу **Number**, и указывать явно модификатор **type** не имеет смысла.

```javascript _run_edit_console_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button  @tap="_onTap">Счетчик: {{_counter}} Тип: {{typeof _counter}}</button>
    `,
    props: {
        _counter: {
            default: 0
        }
    },
    _onTap() {
        this._counter++;
    }
});
```

Этот пример будет работать абсолютно аналогично предыдущему.

Если тип начального значения не будет совпадать с явным типом свойства, то текущий тип свойства будет задан по начальному значению. Однако при первом обращении к свойству текущий тип будет автоматически преобразован в тип, указанный в модификаторе **type**.

```javascript _error_run_edit_console_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button  @tap="_onTap">Счетчик: {{_counter}} Тип: {{typeof _counter}}</button>
    `,
    props: {
        _counter: {
            default: 'Строка',
            type: Number
        }
    },
    _onTap() {
        this._counter = this._counter+1;
    }
});
```

В этом примере явный тип свойства указан неправильно. Нажатие на кнопку приведет к изменению начального типа, и как следствие, к возникновению ошибки, так как значение **'Строка'** не является числом.

Однако если в предыдущем примере тип свойства не указать или записать его правильно, то ошибка исчезнет. Компонент будет работать корректно.

```javascript _run_edit_console_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button  @tap="_onTap">Счетчик: {{_counter}} Тип: {{typeof _counter}}</button>
    `,
    props: {
        _counter: {
            default: 'Строка',
            type: String
        }
    },
    _onTap() {
        this._counter = this._counter+1;
    }
});
```

Наиболее ярко данная особенность проявляется для логического типа **Boolean**. Любые формы записи логических констант **true** или **false** (кроме строчных букв) будут восприниматься как ошибка.

```javascript _error_run_edit_console_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <p><input type="checkbox" ::checked="isChecked">{{isChecked ? "Я отмечен" : "Я не отмечен"}} Тип: {{typeof isChecked}}</p>
    `,
    props: {
        isChecked: {
            default: False,
            type: Boolean
        }
    }
});
```

Однако начальное логическое значение можно указать в кавычках. В этом случае оно будет рассматриваться как строка. Так как не пустая строка рассматривается как логическое значение **true**, то изначально элемент **checkbox** будет отмечен по ошибке. Однако после первого присвоения начальный тип свойства изменится на реальный и состояние **checkbox** будет определяться правильно. **Такое поведение свойства является очень странным.**

```javascript _error_run_edit_console_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <p><input type="checkbox" ::checked="isChecked">{{isChecked ? "Я отмечен" : "Я не отмечен"}} Тип: {{typeof isChecked}}</p>
    `,
    props: {
        isChecked: {
            default: 'False',
            type: String
        }
    }
});
```

В этом примере изначально будет ошибка, которая при первом изменении свойства будет автоматически исправлена.

Помимо примитивных типов в модификаторе **type** также можно использовать тип **Object** или любой из его наследников.

```javascript _run_edit_console_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div>{{myObject.item1}}</div>
        <div>{{myObject.item2}}</div>
    `,
    props: {
        myObject: {
            default: {
                item1: "Элемент 1",
                item2: "Элемент 2"
            },
            type: Object
        }
    }
});
```

У свойства можно задать несколько альтернативных типов с помощью модификатора **type**. В этом случае их имена указываются в виде элементов массива в квадратных скобках.

```javascript _run_edit_console_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button @tap="_onTap">{{myItem}}: {{typeof myItem}}</button>
    `,
    props: {
        myNumber: 1,
        myArray: ["Элемент 1", "Элемент 2"],
        myItem: {
            default: 1,
            type: [Number, Array]
        }
    },
    _onTap() {
        this.myItem = Array.isArray(this.myItem) ? this.myNumber : this.myArray;
    }
});
```

В этом примере свойство **myItem** может иметь один из указанных типов: либо быть числом, либо быть массивом.

Если альтернативный тип не указан, то при попытке присвоения свойству несовместимого значения возникнет ошибка.

```javascript error_run_edit_console_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button @tap="_onTap">{{myItem}}: {{typeof myItem}}</button>
    `,
    props: {
        myNumber: 1,
        myArray: ["Элемент 1", "Элемент 2"],
        myItem: {
            default: 1,
            type: Number
        }
    },
    _onTap() {
        this.myItem = Array.isArray(this.myItem) ? this.myNumber : this.myArray;
    }
});
```

Здесь тип данных **Array** нельзя привести к типу **Number**. Поэтому при присвоении   свойству массива возникнет ошибка. Однако если указать альтернативный тип **Array**, как в предыдущем примере, то эта ошибка исчезнет, так как этот тип полностью соответствует присваиваемому значению.

Если присваиваемое значения можно привести к указанному типу, то альтернативные типы можно не задавать.

```javascript _run_edit_console_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button @tap="_onTap">{{myItem}}: {{typeof myItem}}</button>
    `,
    props: {
        myNumber: 1,
        myArray: ["Элемент 1", "Элемент 2"],
        myItem: {
            default: 1,
            type: Array
        }
    },
    _onTap() {
        this.myItem = Array.isArray(this.myItem) ? this.myNumber : this.myArray;
    }
});
```

Здесь массиву присваивается число. Тип **Number** можно привести к типу **Array**. Поэтому предыдущая ошибка в этом примере не возникает.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/yHueM94LlbA?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>

