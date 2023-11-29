Свойство **minWidth** задает минимальную ширину выпадающего окна. Ширина указывается в пикселях.

При значении свойства **maxWidth** меньшем или равным нулю, свойство **minWidth** игнорируется, и в качестве минимальной ширины окна используется ширина родительского элемента. Если значение свойства **maxWidth>0**, то минимальная ширина окна определяется значением свойства **minWidth**. Если значение свойства **minWidth** больше, чем значение свойства **maxWidth**, то окно будет иметь фиксированную ширину, равную значению свойства **minWidth**.

```javascript _run_line_edit_loadoda_[my-component.js]_h=160_
import '/components/layouts/dropdown/dropdown.js';
ODA({
    is: 'my-component',
    template: `
        <button @tap="myOpened = !myOpened" ref="button">Открыть | Закрыть</button>
        <button @tap="myMinWidth += myMinWidth<450 ? 150: -450"> minWidth + 150</button>
        <span>minWidth={{myMinWidth}}</span>
        <button @tap="myMaxWidth += myMaxWidth<450 ? 150: -450">maxWidth + 150</button>
        <span>maxWidth={{myMaxWidth}}</span>
        <oda-dropdown ::opened="myOpened" :parent="$refs.button" :min-width='myMinWidth' :max-width='myMaxWidth'>
        <div ~for='4'>Some content</div>
        </oda-dropdown>
    `,
    props: {
        myOpened: false,
        myMinWidth: 0,
        myMaxWidth: 0
    }
});
```

```warning_md
Если у свойства **parent** отсутствует значение, то свойство **minWidth** определяет минимальную ширину окна независимо от значения свойства **maxWidth**.
Если у свойства **parent** задано значение, которое не является ссылкой на реальный элемент, то свойство **minWidth** игнорируется.
```

