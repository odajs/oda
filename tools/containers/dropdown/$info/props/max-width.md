Свойство **maxWidth** задает ограничение ширины выпадающего окна. Ширина указывается в пикселях. Значение по умолчанию 0 (ограничение по ширине отсутствует).

Если ширина элементов, размещенных в компоненте, больше значения свойства **maxWidth**, то ширина окна определяется свойством **maxWidth**, при этом, в случае необходимости, в окно добавляется полоса горизонтальной прокрутки. Если ширина элементов меньше значения свойства **maxWidth**, то ширина окна определяется, размещенными в нем элементами и свойством **minWidth**. Если значение свойства **maxWidth** меньше, чем значение свойства **minWidth**, то окно будет иметь фиксированную ширину, равную значению свойства **minWidth**.

```javascript _run_line_edit_loadoda_[my-component.js]_h=200_
import '/components/layouts/dropdown/dropdown.js';
ODA({
    is: 'my-component',
    template: `
        <button @tap="myOpened = !myOpened" ref="button">Открыть | Закрыть</button>
        <button @tap="myMaxWidth += myMaxWidth<450 ? 150: -450">maxWidth + 150</button>
        <span>maxWidth={{myMaxWidth}}</span>
        <oda-dropdown ::opened="myOpened" :parent="$refs.button" :max-width="myMaxWidth">
            <pre><div ~for='4'>Here must be some Dropdown content</div></pre>
        </oda-dropdown>
    `,
    props: {
        myOpened: false,
        myMaxWidth: 0
    }
});
```

```warning_md
Если у свойства **parent** отсутствует значение или задано значение, которое не является ссылкой на реальный элемент, то свойство **maxWidth** игнорируется.
```
