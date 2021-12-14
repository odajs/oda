```info_md
Кеш методов сбрасывается при перехвате событий элементов компонента директивой **@**.
```

НапримерЖ

```javascript_run_line_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <span @tap>Щелкни по мне:</span>
        <div>Время из метода: {{methodTime()}}</div>
    `,
    methodTime() {
        var d = new Date();
        return d.toLocaleTimeString() + '.' + d.getMilliseconds();
    }
});
```

В примере в элемент **span** директивой **@tap** добавлена реакция на событие нажатия. Теперь текущее время обновляется при щелчке мышью по надписи **"Щелкни по мне"**. Это происходит потому, что попытка перехвата события внутри отдельных элементов компонента сбрасывает кэш методов. Обратите внимание, что в директиве **@tap** не указано никакого обработчика события, то есть важен сам факт попытки перехвата.

Однако, перехват события для всего компонента с помощью атрибута **listeners** не будет сбрасывать кэш методов:

```javascript_run_line_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ref="div">Нажми на меня левой или правой кнопкой мыши</div>
        <div>Время из метода: {{methodTime()}}</div>
    `,
    methodTime() {
        var d = new Date();
        return d.toLocaleTimeString() + '.' + d.getMilliseconds();
    },
    listeners: {
        tap() {
            this.$refs.div.textContent = "Нажата левая кнопка";
        },
        contextmenu() {
            this.$refs.div.textContent = "Нажата правая кнопка";
        }
    }
});
```

В примере вызов обработчиков нажатий клавиш мыши не сбрасывает кэш методов. Сами обработчики не изменяют состояние компонента, записывая выводимый текст непосредственно в элемент **div**. Поэтому текущее время выводится только при загрузке страницы и больше не обновляется.

Аналогично, перехват событий нажатия клавиш с помощью атрибута **keyBindings** не будет сбрасывать кэш методов:

```javascript_run_line_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ref="div">Нет нажатых клавиш</div>
        <input placeholder='нажмите клавиши "a" и "b"'>
        <div>Время из метода: {{methodTime()}}</div>
    `,
    methodTime() {
        var d = new Date();
        return d.toLocaleTimeString() + '.' + d.getMilliseconds();
    },
    keyBindings: {
        a: '_keyA',
        b: '_keyB'
    },
    _keyA() {
        this.$refs.div.textContent = 'Нажата клавиша "a"';
    },
    _keyB() {
        this.$refs.div.textContent = 'Нажата клавиша "b"';
    }
});
```

В примере вызов обработчиков нажатий клавиш "a" и "b" не сбрасывает кэш методов. Сами обработчики не изменяют состояние компонента, записывая выводимый текст непосредственно в элемент **div**. Поэтому текущее время выводится только при загрузке страницы и больше не обновляется.

Аналогично, перехват событий с помощью метода **listen** не будет сбрасывать кэш методов:

```javascript_run_line_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ref="div">Нажми на меня левой или правой кнопкой мыши</div>
        <div>Время из метода: {{methodTime()}}</div>
    `,
    methodTime() {
        var d = new Date();
        return d.toLocaleTimeString() + '.' + d.getMilliseconds();
    },
    ready() {
        this.listen('tap', 'onTap');
        this.listen('contextmenu', 'onContextmenu');
    },
    onTap() {
        this.$refs.div.textContent = "Нажата левая кнопка";
    },
    onContextmenu() {
        this.$refs.div.textContent = "Нажата правая кнопка";
    }
});
```

В примере вызов обработчиков нажатий левой клавиши мыши не сбрасывает кэш методов. Сами обработчики не изменяют состояние компонента, записывая выводимый текст непосредственно в элемент **div**. Поэтому текущее время выводится только при загрузке страницы и больше не обновляется.

