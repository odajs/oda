Модификатор **notify** используется для создания у свойства события с именем «**имя-свойства-changed**», которое будет автоматически генерироваться при любом изменении значения свойства.

Например:

```javascript _run_edit_console_[my-input.js]
 ODA({
    is: 'my-input',
    template: `
        <label>{{label+": "}} <input ::value></label>
    `,
    props: {
        value: {
            default: "Наберите что-нибудь",
            notify: true
        },
        label: "Надпись"
    }
});
```

Любое изменение содержимого элемента **input** этого компонента будет передаваться свойству **value**. Так как у этого свойства задан модификатор **notify** со значением **true**, то при каждом изменение значения этого свойства автоматически будет генерироваться событие с именем **value-changed**. Это событие можно будет обработать во внешнем компоненте, узнав, что во вложенном компоненте произошли какие-то изменения.

```javascript _run_edit_console_[full-name.js]_{my-input.js}
ODA({
    is: 'full-name',
    template: `
        <my-input ref="lastName" :label="'Фамилия'" @value-changed="onChanged"></my-input>
        <my-input ref="firstName" :label="'Имя'" @value-changed="onChanged"></my-input>
        <div>Полное имя {{fullName}}</div>
    `,
    props: {
        fullName: "Иванов Иван"
    },
    onChanged() {
        this.fullName = this.$refs.lastName.value + " " + this.$refs.firstName.value;
    }
});
```

В этом примере при возникновении изменений в фамилии или имени в пользовательском компоненте **my-input** в обработчике события **value-changed** будет сформировано полное имя **fullName**.

Узнать какие изменения произошли можно с помощью параметра события **detail**. В этом случае у обработчика необходимо указать входящий параметр для самого объекта события.

```javascript _run_edit_console_[full-name.js]_{my-input.js}
ODA({
    is: 'full-name',
    template: `
        <my-input ref="lastName" :label="'Фамилия'" @value-changed="onChanged"></my-input>
        <my-input ref="firstName" :label="'Имя'" @value-changed="onChanged"></my-input>
        <div>Полное имя {{fullName}}</div>
    `,
    props: {
        fullName: "Иванов Иван"
    },
    onChanged(e) {
        let names = this.fullName.split(' ');
        this.fullName = e.target.label==='Имя' ? names[0] + " " + e.detail.value : e.detail.value + " " + names[1];
    }
});
```

В объекте события хранится информация об изменениях, совершенных в свойства **detail** параметра **value**. Узнать в каком компоненте произошли эти изменения можно с помощью свойства **target** события по метке указанной внутри компонента **my-input**. В этом случае не нужно будет использовать ссылки на компоненты **ref** или задавать уникальные идентификаторы компонентов.

Внутри самого компонента событие **\*\*-changed** можно отловить в его слушателях.

```javascript _run_edit_console_[my-color-input.js]
 ODA({
    is: 'my-color-input',
    template: `
        <style>
            .my-class1 {
                background-color: yellow;
                color: blue;
            }
            .my-class2 {
                background-color: blue;
                color: yellow;
            }
        </style>
       <label :class="myClass">{{label+": "}} <input ::value></label>
    `,
    props: {
        value: {
            default: "Наберите что-нибудь",
            notify: true
        },
        label: "Надпись",
        myClass: "my-class1"
    },
    listeners: {
        'value-changed'() {
            this.myClass = this.myClass==="my-class1" ? "my-class2" : "my-class1";
        }
    }
});
```

Здесь задан слушатель **value-changed**, в котором при каждом изменении свойства **value** компонента будет изменяться стиль отображения надписи.

``` warning_md
Обратите внимание, что имя слушателя для события **value-changed** задано в кавычках. Если этого не сделать, то в коде будет ошибка, так как имя со знаком дефис является невалидным JS-идентификатором.
```

Событие **«имя-свойства-changed»** генерируется только тогда, когда задан его обработчик или слушатель внутри данного компонента. После обработки события его дальнейшее всплытие останавливается, поэтому будет невозможно продолжить его обработку во внешнем компоненте.

```javascript _run_edit_console_[color-name.js]_{my-color-input.js}
ODA({
    is: 'color-name',
    template: `
        <my-color-input ref="lastName" :label="'Фамилия'" @value-changed="onChanged"></my-color-input>
        <my-color-input ref="firstName" :label="'Имя'" @value-changed="onChanged"></my-color-input>
        <div>Полное имя {{fullName}}</div>
    `,
    props: {
        fullName: "Иванов Иван"
    },
    onChanged(e) {
        let names = this.fullName.split(' ');
        this.fullName = e.target.label==='Имя' ? names[0] + " " + e.detail.value : e.detail.value + " " + names[1];
    },
    listeners: {
        'value-changed'() {
            this.fullName="Петр Петров";
        }
    }
});
```

В данном компоненте слушатель для события **value-changed** не будет выполнен никогда, так как событие **value-changed** уже обработано.

``` info_md
Такое поведение является естественным. У внешнего компонента может быть задано свое свойство с таким же именем, что и у вложенного компонента. В этом случае при генерации события **value-changed** именно оно должно обрабатываться внешним компонентом, а не то свойство, которое появилось бы в процессе всплытия от вложенного компонента.
```
