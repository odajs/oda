Многие события хранят дополнительную информацию о себе, и структура этой информации зависит от типа события.

События мыши, например, хранят координаты указателя мыши, которые были в момент возникновения события. События нажатия клавиш хранят коды нажатых клавиш и т.п.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button @mousemove="_onMove">Подвигай по мне</button>
        <div>Координата X: {{offsetX}}</div>
        <div>Координата Y: {{offsetY}}</div>
    `,
    props: {
        offsetX: '',
        offsetY: ''
    },
    _onMove(e) {
        this.offsetX = e.offsetX;
        this.offsetY = e.offsetY;
    }
});
```

Некоторые типы событий автоматически преобразуются фреймворком в пользовательские события с типом **odaCustomEvent**. К таким событиям относятся:

1. tap
1. up
1. down
1. track

Из-за этого преобразования в них не получится явно узнать какую-то часть информации об исходном событии.

В обработчике **tap**, например, нельзя непосредственно узнать координаты щелчка мыши у самого события.

```javascript error_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button @tap="_onTap">Нажми на меня</button>
        <div>Координата X: {{offsetX}}</div>
        <div>Координата Y: {{offsetY}}</div>
    `,
    props: {
        offsetX: '',
        offsetY: ''
    },
    _onTap(e) {
        this.offsetX = e.offsetX;
        this.offsetY = e.offsetY;
    }
});
```

Для доступа к этой информации нужно использовать свойство **detail** пользовательского события, в котором исходное событие сохраняется под именем **sourceEvent**.

Получить доступ к этому свойству можно через второй параметр обработчика, в котором передается значение **$detail**.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button @tap="_onTap">Нажми на меня</button>
        <div>Координата X: {{offsetX}}</div>
        <div>Координата Y: {{offsetY}}</div>
    `,
    props: {
        offsetX: '',
        offsetY: ''
    },
    _onTap(e,d) {
        this.offsetX = d.sourceEvent.offsetX;
        this.offsetY = d.sourceEvent.offsetY;
    }
});
```

Свойство **sourceEvent** есть у самого объекта события, и обратиться к нему можно через указатель, передаваемый обработчику первым параметром в списке параметров.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <label>Координаты относительно кнопки </label>
        <button @tap="_onTap">Нажми на меня</button>
        <div>Координата X: {{offsetX}}</div>
        <div>Координата Y: {{offsetY}}</div>
    `,
    props: {
        offsetX: '',
        offsetY: ''
    },
    _onTap(e) {
        this.offsetX = e.sourceEvent.offsetX;
        this.offsetY = e.sourceEvent.offsetY;
    }
});
```

В этом случае не нужно указывать второй параметр для значения **$detail**.

``` info_md
Обратите внимание, что свойство **sourceEvent** будет изменяться при переходе через теневое дерево.
```

Например:

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <label>Координаты относительно компонента</label>
        <button>Нажми на меня</button>
        <div>Координата X: {{offsetX}}</div>
        <div>Координата Y: {{offsetY}}</div>
    `,
    props: {
        offsetX: '',
        offsetY: ''
    },
    listeners: {
        tap(e) {
            this.offsetX = e.sourceEvent.offsetX;
            this.offsetY = e.sourceEvent.offsetY;
        }
    }
});
```

В этом примере координаты щелчка мыши будут автоматически пересчитаны относительно компонента, а не выведены относительно положения курсора мыши на кнопке, как в исходном событии. В результате этого будет невозможно узнать внутренний источник события. Информационная безопасность компонента будет сохранена.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/8NpTWyaK-Uo?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>

