Команда **ODA.pushError** позволяет отправлять уведомления об ошибках пользователю.

Она вызывается следующим образом:

```javascript
 ODA.pushError(error, context);
```

Ей передаются два параметра:

1. **error** — тело уведомления.
1. **context** — объект, у которого есть свойство **displayLabel**, на основе которого формируются уникальный идентификатор и заголовок уведомления.

Например,

```javascript run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <input ::value='context.displayLabel'> <br>
        <input ::value='error'> <br>
        <button @tap="onTap">Нажми на меня</button>
    `,
    props: {
        context: {
            displayLabel: 'Заголовок уведомления'
        },
        error: 'Тело уведомления',
    },
    onTap() {
        ODA.pushError(this.error, this.context);
    }
});
```

Если в качестве первого параметра указать объект ошибки с типом класса **Error** или одного из его наследников, то в качестве тела уведомления будет использоваться стек вызовов, содержащий трассировку вызываемых функций с указанием источника возникновения ошибки, номера строки и столбца в нем.

Например,

```javascript run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <input ::value='context.displayLabel'> <br>
        <button @tap="onTap">Нажми на меня</button>
    `,
    props: {
         context: {
            displayLabel: 'Заголовок уведомления'
        },
    },
    onTap() {
        ODA.pushError(new Error("Ошибка"), this.context);
    }
});
```

Если второй параметр **context** явно не указывать, то уведомление в качестве заголовка и уникального идентификатора будет использовать значение по умолчанию **«Error»**.

Например,

```javascript run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <button @tap="onTap">Нажми на меня</button>
    `,
    onTap() {
        ODA.pushError(new Error("Ошибка"));
    }
});
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/ZYGeACl-AcY?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
