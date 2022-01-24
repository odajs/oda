Директива **~is** используется для динамического изменения имени тега HTML-элемента, в котором она указана.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
         <button ~is="myTag" @tap="changeTag">Нажми на меня</button>
    `,
    props: {
        myTag: 'button'
    },
    changeTag()
    {
        this.myTag = this.myTag === 'button' ? 'span' : 'button';
    }
});
```

В данном примере при нажатии на кнопку **Нажми на меня** будет изменяться свойство **myTag**, значение которого связано с тэгом соответствующего элемента через директиву **~is**. В результате этого его тег будет меняться динамически со значения **button** на **span**, и наоборот, как это определено в теле метода **changeTag**.

``` info_md
В качестве значения директивы **~is** можно использовать любое **inline**-выражение, а не только название свойства компонента или его метода.
```

Например:

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <span ~for="myTag in myTags" ~is="myTag">{{myTag}}</span>
    `,
    props: {
        myTags: ['span', 'div', 'button']
    }
});
```

В этом примере все три HTML-элемента будут иметь разные теги, имена которых указаны в массиве **myTags**. В этом легко убедиться, открыв инструменты разработчика в браузере, и посмотрев содержимое элемента **my-component**.

```html
<my-component>
    #shadow-root (closed)
        <span>span</span>
        <div>div</div>
        <button>button</button>
</my-component>
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/JF3Ugvs_6I0?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
