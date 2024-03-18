Директива **~show** используется для отображения HTML-элемента по условию.

HTML-элемент, в котором указана директива **~show**, будет отображаться только в том случае, когда значение директивы можно привести к значению **true**.

Если значение директивы **~show** можно привести к значению **false**, то в CSS-параметры HTML-элемента будет добавлено свойство **display** со значением **none**, и браузер перестанет его отображать.

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button @tap="onTap">
            <span ~show="showMe" style="color: green">Нажми меня</span>
            <span ~show="!showMe" style="color: red">Нажми еще раз</span>
        </button>
    `,
    showMe: true,
    onTap() {
        this.showMe = !this.showMe;
    }
});
```

В данном примере нажатие на кнопку изменяет значение свойства **showMe** с **true** на **false**, и наоборот. При этом будет отображаться только тот элемент **span**, в котором директива примет значение **true**. Таким образом, с помощью директивы реализована смена надписи на кнопке.

Посмотреть какие изменения происходят в DOM кнопки при срабатывании директивы **~show** можно в браузере в *Инструментах разработчика* на вкладке *Elements*. Можно видеть, что CSS-объявление **display: none** переходит из атрибута **style** одного элемента **span** в другой в зависимости от того в каком элементе директива **~show** принимает значение *ложно*.

DOM кнопки с надписью «Нажми меня»:

```html_hideGutter
<button>
    <span style="color: green">Нажми меня</span>
    <span style="color: red; display: none;">Нажми еще раз</span>
</button>
```

DOM кнопки с надписью «Нажми еще раз»:

```html_hideGutter
<button>
    <span style="color: green; display: none;">Нажми меня</span>
    <span style="color: red;">Нажми еще раз</span>
</button>
```

В отличие от директивы **~if** HTML-элемент с директивой **~show** будет всегда оставаться в DOM компонента, а изменяться будет лишь свойство **display** в его параметрах **CSS**.

```faq_md
Данную директиву удобно использовать, если необходимо часто и быстро скрывать и отображать какой-то элемент внутри компонента при выполнении какого-то условия.
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/V13DE79qlB0?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
