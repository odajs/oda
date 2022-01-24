Директива **@** используется для назначения обработчиков событиям, возникающим во внутренних элементах компонента.

Имя обрабатываемого события указывается непосредственно после директивы **@**, а его обработчик записывается после имени события через знак равенства в одинарных или двойных кавычках.

При возникновении указанного события его обработчик вызывается автоматически, благодаря чему компонент получает возможность реагировать на действия пользователя.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <span>Счетчик: {{count+" "}}</span>
        <button @tap="_onTap">Кнопка</button>
    `,
    props: {
        count: 0
    },
    _onTap() {
        this.count++;
    }
});
```

В данном примере счетчик **count** будет увеличиваться на единицу при каждом нажатии на кнопку, так как в обработчике события **tap** задана операция его инкремента.

Помимо [стандартных событий](https://www.w3.org/TR/uievents/#event-types) в директиве **@** можно также использовать и добавленные во фреймворк события: **tap**,**up**, **down** и **track**.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/aRW3Eg4lvMM?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
