К рендерингу компонента приводят не только изменения значений свойств, но и выполнение геттеров.

Например:

```javascript_run_edit_console_[my-component.js]_h=60_
ODA({
    is: 'my-component',
    template: `
        <input ::value="change">
        <div>Время из геттера: {{getterTime}}</div>
        <div>Время из метода: {{methodTime()}}</div>
    `,
    props: {
        change: "Измени меня",
        getterTime: {
            get() {
                this.change;
                var d = new Date();
                console.log('getterTime: ' + d.toLocaleTimeString() + '.' + d.getMilliseconds());
                return d.toLocaleTimeString() + '.' + d.getMilliseconds();
            }
        }
    },
    methodTime() {
        var d = new Date();
        console.log('methodTime: ' + d.toLocaleTimeString() + '.' + d.getMilliseconds());
        return d.toLocaleTimeString() + '.' + d.getMilliseconds();
    }
});
```

В примере при каждом изменении значения в строке ввода геттер **getterTime** и метод **methodTime** обновляют время на странице. Кроме того геттер и метод для контроля записывают метки времени в консоль.

![Метки времени в консоли](learn/images/smart-rendering-features-001.png "Метки времени в консоли")

Эти метки показывают, что при изменении значения свойства **change** геттер выполняется один раз, а метод выполняется два раза. Это означает, что рендеринг компонента происходит два раза при одном изменении свойства.

При первом рендеринге метод выполняется почти одновременно с геттером, т.к. изменение свойства **change** через механизм реактивности одновременно запускает рендеринг и сбрасывает кэш геттера, вызывая его выполнение.

Второй рендеринг является реакцией фреймворка на вызов геттера. Так как в примере геттер не изменяет состояния компонента, это значит, что сам факт вызова геттера приводит к рендерингу компонента.

```faq_md
Содержимое консоли можно посмотреть в браузере в **Инструментах разработчика** или открыть непосредственно под примером нажав на кнопку &sum; в правом верхнем углу редактора с текстом примера.
```

```info_md
Рендеринг запускается при перехвате событий элементами компонента с помощью директивы **@**.
```

Например:

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <span @tap>Щелкни по мне:</span>
        <div>Время: {{methodTime()}}</div>
    `,
    methodTime() {
        var d = new Date();
        return d.toLocaleTimeString() + '.' + d.getMilliseconds();
    }
});
```

В примере в элемент **span** директивой **@tap** добавлена реакция на событие нажатия. Теперь текущее время обновляется при щелчке мышью по надписи **"Щелкни по мне"**. Это происходит потому, что попытка перехвата события внутри отдельных элементов компонента вызывает рендеринг. Обратите внимание, что в директиве **@tap** не указано никакого обработчика события, то есть важен сам факт попытки перехвата.

Однако, перехват события для всего компонента с помощью атрибута **listeners** не вызывает рендеринга:

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ref="div">Нажми на меня левой или правой кнопкой мыши</div>
        <div>Время: {{methodTime()}}</div>
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

В примере обработчики нажатий клавиш мыши **tap** и **contextmenu**, заданные в атрибуте **listeners**, не изменяют состояние компонента, записывая выводимый текст непосредственно в элемент **div**. Их вызов также не приводит к рендерингу компонента, поэтому текущее время выводится только при загрузке страницы и больше не обновляется.

Аналогично, перехват событий нажатия клавиш с помощью атрибута **keyBindings** не приводит к рендерингу компонента:

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ref="div">Нет нажатых клавиш</div>
        <input placeholder='нажмите клавиши "a" и "b"'>
        <div>Время: {{methodTime()}}</div>
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

В примере обработчики нажатий клавиш "a" и "b", заданные в атрибуте **keyBindings**, не изменяют состояние компонента, записывая выводимый текст непосредственно в элемент **div**. Их вызов также не приводит к рендерингу компонента, поэтому текущее время выводится только при загрузке страницы и больше не обновляется.

Аналогично, перехват событий с помощью метода **listen** не приводит к рендерингу компонента:

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ref="div">Нажми на меня левой или правой кнопкой мыши</div>
        <div>Время: {{methodTime()}}</div>
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

В примере обработчики нажатий клавиш мыши **onTap** и **onContextmenu**, заданные с помощью метода **listen**, не изменяют состояние компонента, записывая выводимый текст непосредственно в элемент **div**. Их вызов также не приводит к рендерингу компонента, поэтому текущее время выводится только при загрузке страницы и больше не обновляется.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/Rild5juXnd8?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>