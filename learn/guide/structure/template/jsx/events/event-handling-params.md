Обработчикам событий автоматически передаются два значения:

1. **$event** — указатель на объект события.
1. **$detail** — пользовательские данные события.

Для обращения к этим значениям в обработчиках необходимо предусмотреть соответствующие параметры.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div>Источник: {{innerTarget}}</div>
        <div>Нажатия: {{clickCount}}</div>
        <button @click="_onClick">Нажми на меня</button>
    `,
    props: {
        innerTarget: '',
        clickCount: ''
    },
    _onClick(e, d) {
        this.innerTarget = e.target.localName;
        this.clickCount = d;
    }
});
```

Имена этих параметров могут быть любыми, но чем короче они будут, тем проще их записывать в тело метода.

Однако в inline-выражениях к этим значениям придется обращаться, используя только предопределенные имена: **$event** и **$detail** соответственно.

Например:

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div>Источник: {{innerTarget}}</div>
        <div>Нажатия: {{clickCount}}</div>
        <button @click="innerTarget = $event.target.localName; clickCount= $detail;">Нажми на меня</button>
    `,
    props: {
        innerTarget: '',
        clickCount: ''
    }
});
```

Эти значения можно передавать методам явно, когда те вызываются в контексте inline-выражения.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div>Источник: {{innerTarget}}</div>
        <div>Нажатия: {{clickCount}}</div>
        <button @click="_onClick($event, $detail)">Нажми на меня</button>
    `,
    props: {
        innerTarget: '',
        clickCount: ''
    },
    _onClick(e, d) {
        this.innerTarget = e.target.localName;
        this.clickCount = d;
    }
});
```

Если во втором значение **$detail** нет необходимости, то параметр для него в методе можно не предусматривать.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div>Источник: {{innerTarget}}</div>
        <button @click="_onClick">Нажми на меня</button>
    `,
    props: {
        innerTarget: ''
    },
    _onClick(e) {
        this.innerTarget = e.target.localName;
    }
});
```

Если оба значения **$event** и **$detail** не используются в теле метода, то и параметры для них не нужны.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div>Источник: {{innerTarget}}</div>
        <button @click="_onClick">Нажми на меня</button>
    `,
    props: {
        innerTarget: ''
    },
    _onClick() {
        this.innerTarget = 'button';
    }
});
```

Однако если требуется только одно значение **$detail**, то в методе все же придется указать оба параметра, так как первый из них всегда используется для значения **$event**.

Например:

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div>Нажатия: {{clickCount}}</div>
        <button @click="_onClick">Нажми на меня</button>
    `,
    props: {
        innerTarget: '',
        clickCount: ''
    },
    _onClick(e, d) {
        this.clickCount = d;
    }
});
```

Для некоторых типов событий второй параметр **detail** может иметь другое назначение. В нем, например, в свойстве **sourceEvent** может храниться исходное событие.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/2LCTb4EZJzk?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
