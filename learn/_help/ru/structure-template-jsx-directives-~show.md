Директива **~show** используется для отображения HTML-элемента по условию.

```javascript_run_edit_console_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button @tap="onTap">
            <span ~show="showMe">Нажми меня</span>
            <span ~show="!showMe">Нажми еще раз</span>
        </button>
    `,
    showMe: true,
    onTap() {
        this.showMe = !this.showMe;
    }
});
```

В данном примере с помощью директивы реализована смена надписи на кнопке.

HTML-элемент, в котором указана директива **~show**, будет отображаться только в том случае, когда значение директивы можно привести к значению **true**.

Если значение директивы **~show** можно привести к значению **false**, то в параметры CSS HTML-элемента будет добавлено свойство **display** со значением **none**, и браузер перестанет его отображать.

В отличие от директивы **~if** HTML-элемент с директивой **~show** будет всегда оставаться в DOM компонента, а изменяться будет лишь свойство **display** в его параметрах **CSS**.

```faq_md
Данную директиву удобно использовать, если необходимо часто и быстро скрывать и отображать какой-то элемент внутри компонента при выполнении какого-то условия.
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/V13DE79qlB0?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
