Модификатор **type** используется для явного указания типаё свойства.

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

Значением этого модификатора может быть любой из следующих типов языка JavaScript:

1. Number — любое целое или вещественное число с плавающей запятой.
2. String — любая строка в двойных, одинарных или обратных одинарных кавычках.
3. Boolean — логический тип, который может принимать только два значения **true** или **false**.
4. Date — объект даты и времени.
5. BigInt — целые числа произвольной длины (в текущей версии не реализовано).

Модификатор **type** можно не указывать, если тип свойства однозначно определяется по его начальному значению. Так в предыдущем примере начальное значение **0** однозначно относит свойство **_counter** к типу **Number**, и указывать явно модификатор **type** не имеет смысла. В этом случае удобнее использовать сокращенный синтаксис объявления свойства.

```javascript _run_edit_console_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button  @tap="_onTap">Счетчик: {{_counter}} Тип: {{typeof _counter}}</button>
    `,
    props: {
        _counter: 0
    },
    _onTap() {
        this._counter++;
    }
});
```

Этот пример будет работать абсолютно аналогично предыдущему.

```info_md
Если тип начального значения не совпадает с объявленным типом свойства, то начальное значение автоматически преобразуется к объявленным типу.
```

```javascript _run_edit_console_[my-component.js]
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
        this._counter = this._counter + 1;
    }
});
```

В этом примере у свойства явно указан тип **Number**, а в качестве начального значения задана константа строкового типа **'Строка'**. Фрамеворк преобразует эту строку в число **0**, которое становится начальным значением свойства.

При объявлении свойства необходимо тщательно следить за его типом, особенно если оно используется для передачи логических значений.

```javascript _error_run_edit_console_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <p><input type="checkbox" ::checked="isChecked">{{isChecked ? "Я отмечен" : "Я не отмечен"}}</p>
        <div> Тип: {{typeof isChecked}} Значение: {{isChecked}}</div>
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

