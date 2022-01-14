Реактивность геттера можно отключить. Для этого необходимо в свойство, в котором объявлен геттер, добавить модификатор **freeze** со значением **true**.

Например:

```javascript_run_line_edit_[my-component.js]_h=40_
ODA({
    is: 'my-component',
    template: `
        <input ::value="change">
        <div>Время из геттера: {{getterTime}}</div>
    `,
    props: {
        change: "Измени меня",
        getterTime: {
            freeze: true,
            get() {
                this.change;
                var d = new Date();
                return d.toLocaleTimeString() + '.' + d.getMilliseconds();
            }
        }
    }
});
```

В примере в свойство **getterTime** добавлен модификатор **freeze:true**, теперь изменение значения свойства **change** не влияет на очистку кэша геттера, и время на странице не обновляется.

```warning_md
Объявление модификатора **freeze** со значением **true** в свойстве превращает его геттер в константу.
```

```info_md
Если свойство компонента не объявлено явно в прототипе компонента, а создается динамически в процессе работы, то изменения его значения не контролируются фреймворком, поэтому не считаются изменениями контекста геттера и не приводят к сбросу его кэша.
```

Например:

```javascript_run_line_edit_[my-component.js]_h=40_
ODA({
    is: 'my-component',
    template: `
        <input ::value="change">
        <div>Значение из геттера: {{getterChange}}</div>
    `,
    props: {
        getterChange: {
            get() {
                return this.change;
            }
        }
    },
    methodChange() {
        return this.change;
    },
    created() {
        this.change = this.change || "Измени меня";
    }
});
```

В примере геттер **getterChange** выдает значение свойства **change**, которое создается в хуке **created**. Изменение значения этого свойства в строке ввода не считается изменением контекста геттера и не сбрасывает кэш геттера, поэтому выводимое из геттера значение не изменяется.
