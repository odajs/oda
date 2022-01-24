Атрибут **keyBindings** используется для назначения обработчиков нажатия определенных клавиш клавиатуры.

По своей структуре атрибут **keyBindings** является объектом, у которого в качестве свойств указываются обработчики нажатия определенных, а не любых, клавиш клавиатуры.

Эти обработчики вызываются автоматически при возникновении события **keydown** у компонента только в случае, если была нажата именно та клавиша, для обработки которой они и назначались.

Пример 1:

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <input placeholder="Набери abba">
        <div>Нажата клавиша: {{keyPressed}}</div>
    `,
    keyBindings: {
        a: '_keyA',
        b: '_keyB'
    },
    _keyA() {
        this.keyPressed = 'a';
    },
    _keyB() {
        this.keyPressed = 'b';
    },
    props: {
        keyPressed: ''
    }
});
```

Заданные обработчики предотвращают явную обработку события **keydown** по умолчанию, вызывая метод **preventDefault()** интерфейса **Event**. По этой причине обрабатываемые буквы в элементе **input** появляться не будут.

Регистр символов для алфавитных клавиш значения не имеют. Строчные и прописные буквы на любой раскладке клавиатуры будут восприниматься одинаково.

Пример 2:
```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <input placeholder="Набери abBA или Фифа">
        <div>Нажата клавиша: {{keyPressed}}</div>
    `,
    keyBindings: {
        a: '_keyA',
        b: '_keyB'
    },
    _keyA(e) {
        this.keyPressed =e.key;
    },
    _keyB(e) {
        this.keyPressed = e.key;
    },
    props: {
        keyPressed: ''
    }
});
```

Узнать какая клавиша нажата можно через указатель на объект события **KeyboardEvent**, который передается в списке параметров обработчика.

Алфавитные клавиши нельзя задать буквами с использованием любой локализации. В следующем примере нажатые клавиши "a/ф" и "b/и"  сработают только при условии, что раскладка клавиатуры переключена на кириллицу.

Пример 3:
```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <input placeholder="Набери abBA или Фифа">
        <div>Нажата клавиша: {{keyPressed}}</div>
    `,
    keyBindings: {
        ф: '_keyA',
        и: '_keyB'
    },
    _keyA(e) {
        this.keyPressed = e.key;
    },
    _keyB(e) {
        this.keyPressed = e.key;
    },
    props: {
        keyPressed: ''
    }
});
```

Результат работы этого примера будет абсолютно аналогичен предыдущему, хотя символы клавиш указаны на русской раскладке.

Если нескольким клавишам необходимо одновременно назначить один и тот же обработчик, то их имена нужно записать в виде строкового литерала через запятую.

Пример 4:
```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <input placeholder="Набери Фифа и abBA">
        <div>Нажата клавиша: {{keyPressed}} </div>
    `,
    keyBindings: {
        'а, b': '_keyPress',
    },
    _keyPress(e) {
        this.keyPressed = e.key;
    },
    props: {
        keyPressed: ""
    }
});
```

Имя каждого свойства может содержать список названий клавиш клавиатуры с учетом или без учета их модификаторов: **Ctrl**, **Alt** и **Shift**.

Модификаторы указываются перед или после названия клавиши через знак **плюс**. Имя свойства в этом случае обязательно должно записываться в одинарных или двойных кавычках.

Пример 5:
```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <input placeholder="Нажми сочетание Ctrl+A">
        <div>Нажата клавиша: {{keyPressed}}</div>
    `,
    keyBindings: {
        'Ctrl+A, B+Ctrl+Shift, Alt+Ctrl+Shift+C': '_keyPress'
    },
    _keyPress(e) {
        this.keyPressed = e.key;
        if (e.shiftKey)
            this.keyPressed = 'Shift+' + this.keyPressed;
        if (e.ctrlKey)
            this.keyPressed = 'Ctrl+' + this.keyPressed;
        if (e.altKey)
            this.keyPressed = 'Alt+' + this.keyPressed;
    },
    props: {
        keyPressed: ''
    }
});
```

Отсутствие зависимости от регистра и локализации позволяет предотвратить ошибку, когда вместо сочетания клавиш **Ctrl+A** будет фактически нажато любое из сочетаний: **Ctrl+a**, **Ctrl+Ф** или **Ctrl+ф**.

``` info_md
Для специальных клавиш необходимо использовать их алфавитные обозначения предусмотренные в рекомендации W3C [UI Events KeyboardEvent](https://www.w3.org/TR/uievents-key/#key-attribute-value "UI Events KeyboardEvent key Values").
```

Пример 6:
```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <input placeholder="Нажми стрелку вверх, вниз или пробел"></input>
        <div>Нажата клавиша: {{keyPressed}} </div>
    `,
    keyBindings: {
        'ArrowUp, ArrowDown': '_keyPress',
        Space: '_keyPress',
    },
    _keyPress(e) {
        this.keyPressed = e.key;
    },
    props: {
        keyPressed: ''
    }
});
```

Кроме этого, вместо названия клавиш можно использовать их [коды](https://www.w3.org/TR/uievents-code/#keyboard-key-codes "UI Events KeyboardEvent code Values"), которые уже не зависят от используемых устройств и раскладок клавиатуры.

Пример 7:
```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <input placeholder="Набери Фифа">
        <div>Нажата клавиша: {{keyPressed}} </div>
    `,
    keyBindings: {
        ArrowUp: '_keyPress',
        KeyA: '_keyPress',
    },
    _keyPress(e) {
        this.keyPressed = e.code;
    },
    props: {
        keyPressed: ''
    }
});
```

В упрощенной форме записи вместо свойства у объекта **keyBindings** можно указать только метод обработчика события. В этом случае его имя должно совпадать с именем клавиши или ее кодом.

Пример 8:
```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <input placeholder="Нажми стрелку вверх или набери Фифа">
        <div>Нажата клавиша: {{keyPressed}} </div>
    `,
    keyBindings: {
        ArrowUp(e) {
            this.keyPressed = e.code;
        },
        KeyA(e) {
            this.keyPressed = e.key;
        },
        b(e) {
            this.keyPressed = e.keyCode;
        }
    },
    props: {
        keyPressed: ''
    }
});
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/ZiiCxJ6MAIE?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
