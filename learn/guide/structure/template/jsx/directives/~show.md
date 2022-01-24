Директива **~show** используется для отображения HTML-элемента по условию.

```javascript_run_edit_console_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <span ~show="_show">Меня видно</span>
        <button @tap="_onTap">Кнопка</button>
    `,
    props: {
        _show: true
    },
    _onTap() {
    	console.log('Кнопка нажата');
        this._show = !this._show;
        console.log('this._show = ' + this._show);
    }
});
```

HTML-элемент, в котором указана директива **~show**, будет отображаться только в том случае, когда значение директивы можно привести к значению **true**.

Фактически, если значение директива **~show** можно привести к значению **false**, то в параметры CSS HTML-элемента будет добавлено свойство **display** со значением **none**.

В отличие от директивы **~if** HTML-элемент с директивой **~show** будет всегда оставаться в DOM, а изменяться будет лишь свойство **display** в его параметрах **CSS**.

```faq_md
Данную директиву можно использовать, если необходимо часто и быстро скрывать и отображать какой-то элемент внутри компонента при выполнении какого-то условия.
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/V13DE79qlB0?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
