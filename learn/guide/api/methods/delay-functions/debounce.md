**debounce** — это метод, который ограничивает частоту вызова другого метода или функции.

Он объявляется внутри компонента следующим образом:

```javascript
debounce (key, handler, delay = 0)
```

Ему передаются 3 параметра:

1. **key** — уникальный идентификатор, под которым регистрируется вызываемая функция.
1. **handler** — указатель на функцию, которую необходимо вызвать.
1. **delay** — время, ограничивающее вызов функции.

Фактически передаваемая функция **handler** будет вызываться только по истечении указанного времени **delay** после ее последнего вызова. Если произойдет ее повторный вызов до истечения этого времени, то предыдущий вызов будет отменен, а отсчет задержки времени нового вызова начнется заново.

Такой подход позволяет ограничить частоту вызова функции и повысить производительность работы браузера, предотвратив многократную обработку событий, вызванных пользователем при ряде действий: изменении размера окна, скроллинге страницы, нажатии клавиш клавиатуры, перемещении указателя мыши и так далее.

Например,

```javascript _run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <label>Нажми любую клавишу <input @keydown="onKeyDown" ref="typewriter"> </label> <button @tap="onTap">Очистить</button><br>
        <label>Временная задержка <input type="number" ::value="delay" step="10">, мс</label>
        <div>Количество событий нажатия: {{countEvent}}</div>
        <div>Количество обработок нажатия: {{count}}</div>
    `,
    props: {
        count: 0,
        countEvent: 0,
        delay: 0
    },
    onTap() {
        this.count=0;
        this.countEvent=0;
        this.$refs.typewriter.value = '';
        this.$refs.typewriter.focus();
    },
    onKeyDown() {
        this.countEvent++;
        this.debounce('my-keydown', ()=>this.count++, this.delay);
    }
});
```

Если в данном примере нажать и не отпускать любую клавишу клавиатуры внутри первого элемента **input**, то событие **keydown** будет происходить довольно часто, и каждый раз оно будет обрабатываться в методе **onKeyDown**. Однако если увеличить задержку, то, начиная с небольшого значения (20-30 мc), его обработка методом **debounce** будет происходить не всегда, а только когда после последнего нажатия на клавишу пройдет достаточное время, чтобы метод **debounce** смог запустить его обработку. Если времени пройдет меньше чем задано в параметре **delay**, то обработка события не начнется, а таймер его ожидания заново обнулится.

Если в качестве задержки указать значение 0 (ноль), то обработка события произойдет не мгновенно, а только тогда, когда браузер обновит страницу в следующий раз, так как метод **debounce** в этом случае выполняет указанную функцию или метод в контексте метода **requestAnimationFrame**, который вызывается браузером примерно 60 раз в секунду при стандартной частоте обновления кадров 60 fps. При большей загрузке браузера эта частота может уменьшаться.

```javascript _run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <label>Подвигай мышью <input @mousemove="onMouseMove" ref="input"> </label> <button @tap="onTap">Очистить</button><br>
        <label>Временная задержка <input type="number" ::value="delay" step="10">, мс</label>
        <div>Количество событий нажатия: {{countEvent}}</div>
        <div>Количество обработок нажатия: {{count}}</div>
    `,
    props: {
        count: 0,
        countEvent: 0,
        delay: 0
    },
    onTap() {
        this.count=0;
        this.countEvent=0;
        this.$refs.input.value = '';
    },
    onMouseMove() {
        this.countEvent++;
        this.debounce('my-mousemove', ()=>this.count++, this.delay);
    }
});
```

Если с задержкой необходимо вызвать какой-либо метод компонента, то к нему обязательно нужно привязать контекст компонента с помощью метода **bind**.

```javascript _run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <label>Нажми любую клавишу <input @keydown="onKeyDown" ref="typewriter"> </label> <button @tap="onTap">Очистить</button><br>
        <label>Временная задержка <input type="number" ::value="delay" step="10">, мс</label>
        <div>Количество событий нажатия: {{countEvent}}</div>
        <div>Количество обработок нажатия: {{count}}</div>
    `,
    props: {
        count: 0,
        countEvent: 0,
        delay: 0
    },
    onTap() {
        this.count=0;
        this.countEvent=0;
        this.$refs.typewriter.value = '';
        this.$refs.typewriter.focus();
    },
    counter() {
        this.count++;
    },
    onKeyDown() {
        this.countEvent++;
        this.debounce('my-keydown', this.counter.bind(this), this.delay);
    }
});
```

Если этого не сделать, то при вызове метода **debounce** произойдет ошибка.

```javascript error_run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <label>Нажми любую клавишу <input @keydown="onKeyDown" ref="typewriter"> </label> <button @tap="onTap">Очистить</button><br>
        <label>Временная задержка <input type="number" ::value="delay" step="10">, мс</label>
        <div>Количество событий нажатия: {{countEvent}}</div>
        <div>Количество обработок нажатия: {{count}}</div>
    `,
    props: {
        count: 0,
        countEvent: 0,
        delay: 0
    },
    onTap() {
        this.count=0;
        this.countEvent=0;
        this.$refs.typewriter.value = '';
        this.$refs.typewriter.focus();
    },
    counter() {
        this.count++;
    },
    onKeyDown() {
        this.countEvent++;
        this.debounce('my-keydown', this.counter, this.delay);
    }
});
```

В этом примере счетчик вызова метода **counter** будет всегда оставаться нулевым, несмотря на то, что обработчик **onKeyDown** будет выполняться при каждом нажатии клавиши клавиатуры. Это происходите из-за того, что при вызове метода **counter** указатель **this** внутри него будет всегда оставаться неопределенным, т.е. иметь значение **undefined**. Это и будет причиной возникновения ошибки в нем.

Для того, чтобы каждый раз явно не привязывать контекст компонента к вызываемому методу в методе **debounce** можно вместо указателя на метод записать его имя в виде обычной строки.

Например,

```javascript _run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <label>Нажми любую клавишу <input @keydown="onKeyDown" ref="typewriter"> </label> <button @tap="onTap">Очистить</button><br>
        <label>Временная задержка <input type="number" ::value="delay" step="10">, мс</label>
        <div>Количество событий нажатия: {{countEvent}}</div>
        <div>Количество обработок нажатия: {{count}}</div>
    `,
    props: {
        count: 0,
        countEvent: 0,
        delay: 0
    },
    onTap() {
        this.count=0;
        this.countEvent=0;
        this.$refs.typewriter.value = '';
        this.$refs.typewriter.focus();
    },
    counter() {
        this.count++;
    },
    onKeyDown() {
        this.countEvent++;
        this.debounce('my-keydown', 'counter', this.delay);
    }
});
```

В этом случае контекст компонента будет привязан к методу **counter** автоматически и никакой ошибки при его вызове происходить не будет. Фактически метод **debounce** внутри себя заменяет строку **'counter'** на вызов одноименного метода **this.counter.bind(this)**.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/RHud4EO_exo?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    style="position:absolute;width:100%;height:100%;"></iframe>
</div>
