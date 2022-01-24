Слоты фактически являются обычными HTML-элементами, к которым можно применить любые правила CSS-форматирования.

Однако по умолчанию слоты имеют тип отображения **contents**, который задается свойством **display**. Браузеры такие элементы не отображают, выводя только их внутреннее содержимое. В результате этого к слотам хоть и применяются CSS-правила, но увидеть это на HTML-странице невозможно. Для этого необходимо изменить тип отображения слотов.

Например,

```javascript run_edit_[my-component.js]_h=60_
ODA({
    is: 'my-component',
    template: `
        <style>
            slot {
                border: 2px solid grey;
                background: lightgrey;
                padding: 2px;
            }
        </style>
        <button @tap="onTap">Стилизовать слот</button>
        <slot>Значение по умолчанию</slot>
    `,
    onTap() {
        const slot = this.$core.shadowRoot.querySelector('slot');
        slot.style.display = slot.style.display === 'block' ? 'contents' : 'block';
    }
});
```

В этом примере элементы слота должны выводиться в серой рамке на светло-сером фоне так, как это задано в CSS-правиле с селектором **slot**. Однако по умолчанию этого не происходит. Если же изменить стиль отображения слота с **contents** на **block**, то слот будет стилизован уже так, как это и ожидалось.

Следует отметить, что CSS-стили применяются только к самим слотам, а не к расположенным в них элементам.

Например,

```javascript run_edit_[my-component.js]_h=100_
ODA({
    is: 'my-component',
    template: `
        <style>
            slot {
                border: 2px solid grey;
                background: lightgrey;
                padding: 2px;
                display: flex;
                flex-direction: column;
            }
        </style>
        <button @tap="onTap"> Нажми на меня</button>
        <slot>Значение по умолчанию</slot>
    `,
    onTap() {
        const div = document.createElement('div');
        div.textContent = 'Я в слоте';
        this.append(div);
    }
});
```

В этом примере при каждом нажатии на кнопку элементы **div** будут добавляться в слот, но серая рамка будет отображаться только у самого слота, а не у каждого добавленного в него элемента.

Для стилизации элементов, попавших в слот, необходимо использованием псевдоэлемент CSS **::slotted**.

Например,

```javascript run_edit_[my-component.js]_h=100_
ODA({
    is: 'my-component',
    template: `
        <style>
            slot {
                border: 3px solid grey;
                background: lightgrey;
                padding: 2px;
                display: flex;
                flex-direction: column;
            }
            ::slotted(*) {
                border: 2px solid grey;
                margin: 2px;
            }
        </style>
        <button @tap="onTap"> Нажми на меня</button>
        <slot>Значение по умолчанию</slot>
    `,
    onTap() {
        const div = document.createElement('div');
        div.textContent = 'Я в слоте';
        this.append(div);
    }
});
```

Если в качестве CSS-класса у слота указать один из предопределенных миксинов глобальной стилизации без префикса **--**, то CSS-правила этого миксина будут применены как к самому слоту, так и ко всем вложенным в него элементам, при условии, что у них указан тот же самый CSS-класс.

Например,

```javascript run_edit_[my-component.js]_h=100_
ODA({
    is: 'my-component',
    template: `
        <style>
            slot {
                border: 2px solid grey;
                background: lightgrey;
                padding: 2px;
                display: flex;
                flex-direction: column;
            }
            div {
                margin: 2px;
            }
        </style>
        <button @tap="onTap"> Нажми на меня</button>
        <slot class="horizontal">
            <div ref="classdiv" class="horizontal">Div со стилем</div>
            <div ref="noclassdiv">Div без стиля</div>
        </slot>
    `,
    onTap() {
        let div = document.createElement('div');
        div.textContent = 'Я в слоте';
        this.$refs.classdiv.append(div);
        div = document.createElement('div');
        div.textContent = 'Я тоже в слоте';
        this.$refs.noclassdiv.append(div);
    }
});
```

В данном примере к элементу **div**, с указанным CSS-классом **horizontal**, будет применено CSS-правило, заданное в миксине **--horizontal**, который объявляется следующим образом:

```html
<style>
--horizontal: {
    display: flex;
    flex-direction: row;
};
</style>

```

В результате этого все дочерние элементы будут выводиться в строку в этот **div**, в котором, в отличии от обычного **div**, не был указан класс **horizontal**.

Это происходит из-за того, что в раздел **style** компонента **my-component** с помощью псевдоэлемента **slotted** были автоматически добавлены CSS-правила миксина как для самого слота, так и для всех вложенных в него элементов.

Например, CSS-правило **horizontal** компонента, представленного в предыдущем примере, будет выглядеть следующим образом:

```html
<style>
    .horizontal, ::slotted(.horizontal) {
    display: flex;
        flex-direction: row;
    }
</style>
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/oXVEqgfv7Ds?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
