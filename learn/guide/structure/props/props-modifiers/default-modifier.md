Модификатор **default** используется для указания начального значения свойства.

Например:

```javascript _run_edit_console_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button  @tap="_onTap">Счетчик: {{_counter}}</button>
    `,
    props: {
        _counter: {
            default: 0
        }
    },
    _onTap() {
        this._counter++;
    }
});
```

Модификатор **default** задает только начальное значение свойства. Текущее значение свойства, включая начальное, доступно только по имени свойства, как это указано в обработчике нажатия кнопки и в директиве интерполяционной подстановки **{{}}** для свойства **_counter**.

```warning_md
Если по ошибке указать несколько модификаторов **default**, то начальное значение свойства будет определяться только последним из них.
```


```javascript _run_edit_console_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button  @tap="_onTap">Счетчик: {{_counter}}</button>
    `,
    props: {
        _counter: {
            default: 0,
            default: 1,
            default: 2
        }
    },
    _onTap() {
        this._counter++;
    }
});
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/K-VHpqc4Hwc?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
