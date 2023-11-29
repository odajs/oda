Свойство **maxHeight** задает ограничение высоты выпадающего окна. Высота указывается в пикселях. Значение по умолчанию 0 (ограничение по высоте отсутствует).

Если высота элементов, размещенных в компоненте, больше значения свойства **maxHeight**, то высота окна определяется свойством **maxHeight**, при этом, в случае необходимости, в окно добавляется полоса вертикальной прокрутки. Если высота элементов меньше значения свойства **maxHeight**, то высота окна определяется, размещенными в нем элементами.

```javascript _run_line_edit_loadoda_[my-component.js]_h=160_
import '/components/layouts/dropdown/dropdown.js';
ODA({
    is: 'my-component',
    template: `
        <button @tap="myOpened = !myOpened" ref="button">Открыть | Закрыть</button>
        <button @tap="myMaxHeight += myMaxHeight<120 ? 40: -120">maxHeight + 40</button>
        <span>maxHeight={{myMaxHeight}}</span>
        <oda-dropdown ::opened="myOpened" :parent="$refs.button" :max-height="myMaxHeight">
            <div ~for='4'>Here must be some Dropdown content</div>
        </oda-dropdown>
    `,
    props: {
        myOpened: false,
        myMaxHeight: 0
    }
});
```

```warning_md
Если у свойства **parent** отсутствует значение или задано значение, которое не является ссылкой на реальный элемент, то свойство **maxHeight** игнорируется.
```
