Директива **~is** используется для динамического изменения имени тега HTML-элемента, в котором она указана.

Например:

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
         <button ~is="myTag" @tap="changeTag">Нажми на меня</button>
    `,
    myTag: 'button',
    changeTag()
    {
        this.myTag = this.myTag === 'button' ? 'span' : 'button';
    }
});
```

В данном примере при нажатии на кнопку будет изменяться свойство **myTag**, значение которого связано с тэгом HTML-элемента через директиву **~is**. В результате этого его тег будет меняться динамически со значения **button** на **span**, и наоборот, как это определено в теле метода **changeTag**.

``` info_md
В качестве значения директивы **~is** можно использовать любое **inline**-выражение, а не только название свойства компонента или его метода.
```

Например:

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~for="myTags" ~is="$for.key">{{$for.item}}</div>
    `,
    myTags: {
        b:'Жирный текст ',
        i:'Курсив ',
        u:'Подчеркнутый текст'
    }
});
```

В этом примере выводятся три сообщения из объекта **myTags**. Ключ каждого сообщения определяет его стиль форматирования и совпадает с именем соответствующего HTML-тега. С помощью директивы **~is** имя ключа становится именем тега, в котором выводится сообщение. В результате каждое сообщение получает требуемый стиль.

Если открыть инструмент разработчика в браузере, то можно убедиться, что форматирование осуществлено именно с помощью HTML-тегов, а не с помощью CSS-стилей.

```html
<my-component>
    #shadow-root (closed)
        <b>Жирный текст </b>
        <i>Курсив </i>
        <u>Подчеркнутый текст</u>
</my-component>
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/JF3Ugvs_6I0?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>

