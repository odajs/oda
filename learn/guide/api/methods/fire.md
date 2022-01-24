**fire** — это метод, который позволяет генерировать пользовательские события.

Он объявляется внутри компонента следующим образом:

```javascript
fire(event, detail)
```

Ему передаются 2 параметра:

1. **event** — имя пользовательского события. Например, **'my-event'**.
1. **detail** — необязательный параметр, предназначенный для передачи генерируемому событию дополнительной информации.

Источником события выступает сам компонент, от имени которого вызывается метод **fire**.

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
        this.count++;
        this.fire("my-event");
    },
    listeners: {
        'my-event'(){
            this.label = "Произошло событие my-event №" + this.count;
        }
    },
});
```

Параметр **detail** можно использовать только тогда, когда необходимо передать дополнительную информацию в событии.

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
        this.count++;
        this.fire("my-event", "Произошло событие my-event №" + this.count);
    },
    listeners: {
        'my-event'(e){
            this.label = e.detail.value;
        }
    }
});
```

 Получить доступ к этой дополнительной информации можно через свойство **detail** объекта события. В нем оно сохраняется в поле под именем **value**.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/2fbP12hEBjE?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
