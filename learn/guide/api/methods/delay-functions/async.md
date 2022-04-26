**async** — это метод, который позволяет вызвать другой метод или функцию с заданной временной задержкой.

Он объявляется внутри компонента следующим образом:

```javascript
async (handler, delay = 0)
```

Ему передаются 2 параметра:

1. **handler** — вызываемая функция или метод.
1. **delay** — время задержки вызова метода или функции в миллисекундах.

Например,

```javascript _run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <button @tap="onTap">{{label}}</button>
    `,
    props: {
        label: 'Нажмите меня'
    },
    onTap() {
        this.async(() => {this.label='Я выполняюсь только через секунду'}, 1000);
        this.async(() => {this.label='Нажми на меня'}, 2000);
    }
});
```

В данном примере вызываются стрелочные функции через одну и две секунды соответственно. Указатель **this** у них привязан к контексту текущего компонента **my-component**, так как они объявляются в его методе **onTap**. По этой причине они имеют доступ к свойству компонента **label** через указатель **this**.

При передаче метода в списке параметров необходимо явно привязать к его контексту указатель на компонент с помощью метода **bind**. Если этого не сделать, то указатель **this** внутри метода будет ссылаться уже не на сам компонент, а на глобальный объект **window**, а при нулевой временной задержки может иметь неопределенное значение **undefined**.

Например,

```javascript _run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <button @tap="onTap">{{label}}</button>
    `,
    props: {
        label: 'Нажмите меня'
    },
    up() {
        this.label = 'Я выполняюсь только через секунду';
    },
    down() {
        this.label = 'Нажми на меня';
    },
    onTap() {
        this.async(this.up.bind(this), 1000);
        this.async(this.down.bind(this), 2000);
    }
});
```

Для того, чтобы явно не привязывать контекст компонента к методам, их имена можно указать в виде строки.

Например,

```javascript _run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <button @tap="onTap">{{label}}</button>
    `,
    props: {
        label: 'Нажмите меня'
    },
    up() {
        this.label = 'Я выполняюсь только через секунду';
    },
    down() {
        this.label = 'Нажми на меня';
    },
    onTap() {
        this.$next('up', 1000);
        this.$next('down', 2000);
    }
});
```

В этом случае метод **async** преобразует переданное ему имя метода в его вызов, присоединив к нему контекст текущего компонента автоматически.

Например, строка **'up'** будет заменена на вызов **this.up.bind(this)**, а строка **'down'** — на вызов **this.down.bind(this)**.

При не нулевой задержке метод **async** вызывает её с помощью метода **setTimeout**, внутри которого указатель **this** всегда ссылается на глобальный объект **window**. Если задержка не нулевая, то используется метод **requestAnimationFrame**. В этом случае указатель **this** будет иметь неопределенное значение **undefined**, т.к. используется строгий режим **'use strict'**. В результате этого при вызове анонимных функций контекст компонента придется к ним всегда привязывать явно с помощью метода **bind**.

Например,

```javascript _run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <button @tap="onTap">{{label}}</button>
    `,
    props: {
        label: 'Нажмите меня',
        count: 0
    },
    onTap() {
        this.async(function() {this.label="Я выполняюсь только через секунду"}.bind(this), 1000);
        this.async(function() {this.label="Нажми на меня"}.bind(this), 2000);
    }
});
```

Если этого не сделать, то указатель **this** внутри анонимных функций не будет ссылаться на текущей компонент. В результате этого следующий пример будет работать неправильно.

Например,

```javascript error_run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <button @tap="onTap">{{label}}</button>
    `,
    props: {
        label: 'Нажмите меня',
        count: 0
    },
    onTap() {
        this.async(function() {this.label="Объект window"}, 1000);
        this.async(function() {this.label=window.label}.bind(this), 2000);
    }
});
```

Здесь свойство **label** в первой функции будет изменяться у глобального объект **window**, а не у текущего компонента. Вторая функция будет работать правильно.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/aPL3cwOJOCs?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
