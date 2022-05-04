**interval** — это метод, который позволяет вызывать другой метод или функцию с заданной временной задержкой и с ограниченной частотой вызовов.

Он объявляется внутри компонента следующим образом:

```javascript
interval (key, handler, delay = 0)
```

Ему передаются 3 параметра:

1. **key** — уникальный идентификатор, под которым регистрируется вызываемая функция.
1. **handler** — указатель на функцию, которую необходимо вызвать.
1. **delay** — временная задержка вызова функции.

При использовании этого метода, передаваемая функция **handler** будет вызываться только по истечении заданной временной задержки. Если до окончания этой задержки метод **interval** будет вызван повторно с тем же самым уникальным идентификатором **key**, то по истечении указанной задержки будет вызвана та функция, которая передавалась методу **interval** последней.

Таким образом, метод **interval** гарантирует, что по истечении первоначальной задержки обязательно будет выполнена та функция, которая указывалась в нем последней. Вызов всех предыдущих функции, указанных с тем же самый ключом **key**, фактически будет отменен.

Например,

```javascript _run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <label>Нажми любую клавишу <input @keydown="onKeyDown" ref="input"> </label> <button @tap="onTap">Очистить</button><br>
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
        this.$refs.input.focus();
    },
    onKeyDown() {
        this.countEvent++;
        this.interval('my-keydown', ()=>this.count++, this.delay);
    }
});
```

Если в данном примере нажать и не отпускать любую клавишу клавиатуры внутри первого элемента **input**, то событие **keydown** будет происходить довольно часто, и каждый раз оно будет обрабатываться в методе **onKeyDown**. Однако, если увеличить задержку, то, начиная с небольшого значения (20-30 мc), его обработка методом **interval** будет происходить строго через определенный интервал. Все нажатия клавиш, которые будут происходить внутри этого интервала, кроме самого последнего нажатия, будут пропущены.

Если в качестве задержки указать значение 0 (ноль), то обработка события произойдет не мгновенно, а только тогда, когда браузер обновит страницу в следующий раз, так как метод **interval** в этом случае будет выполнять указанную функцию или метод в контексте метода **requestAnimationFrame**, который вызывается браузером примерно 60 раз в секунду при стандартной частоте обновления кадров 60 fps. При большей загрузке браузера эта частота может уменьшаться.

Например,

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
        this.interval('my-mousemove', ()=>this.count++, this.delay);
    }
});
```

Использование метода **interval** позволяет ограничить частоту вызова заданной функции и повысить производительность работы браузера, предотвратив многократную обработку событий в течении указанной задержки. Однако, в отличие от метода **debounce**, метод **interval** не блокирует обработку предыдущих событий полностью. Он будет выполнять последнюю переданную ему функцию каждый раз по истечению указанной задержки.

Если с задержкой необходимо вызвать какой-либо метод компонента, то к нему обязательно нужно привязать контекст компонента с помощью метода **bind**.

Например,

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
    counter() {
        this.count++;
    },
    onMouseMove() {
        this.countEvent++;
        this.interval('my-mousemove', this.counter.bind(this), this.delay);
    }
});
```

Для того, чтобы этого не делать можно вместо указателя на метод записать его имя в виде строки.

Например,

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
    counter() {
        this.count++;
    },
    onMouseMove() {
        this.countEvent++;
        this.interval('my-mousemove', 'counter', this.delay);
    }
});
```

В этом случае контекст компонента будет привязан к методу **counter** автоматически. Фактически метод **interval** заменит строку **'counter'** внутри себя на вызов одноименного метода **this.counter.bind(this)**.

Если этого не сделать, то при вызове метода **counter** возникнет ошибка.

```javascript error_run_edit_[my-component.js]
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
    counter() {
        this.count++;
    },
    onMouseMove() {
        this.countEvent++;
        this.interval('my-mousemove', this.counter, this.delay);
    }
});
```

В этом примере контекст компонента к методу **counter** привязан не будет и при его вызове возникнет ошибка, так как указатель **this** внутри него будет иметь неопределенное значение **undefined**. Из-за этого счетчик вызовов будет всегда оставаться нулевым.

<div style="position: relative; padding-bottom: 48%; margin: 10px">
    <iframe src="https://www.youtube.com/embed/tGBizM7TcOg?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    style="position:absolute;width:100%;height:100%;"></iframe>
</div>
