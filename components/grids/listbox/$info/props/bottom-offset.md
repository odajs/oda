Свойство **bottomOffset** задает дополнительный отступ от конца списка элементов до нижнего границы контейнера.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=180_
import '/components/grids/listbox/listbox.js';
ODA({
    is: 'my-component',
    template: `
        <label>Отступ снизу <input type="number" ::value="bottomOffset"> px</label>
        <oda-list-box :items :bottom-offset></oda-list-box>
    `,
    props: {
        items: [
            {label: "Элемент 1", icon: 'icons:favorite'},
            {label: "Элемент 2", icon: 'icons:face'},
            {label: "Элемент 3", icon: 'icons:star'}
        ],
        bottomOffset: 0
    }
});
```

Изначально свойство **bottomOffset** установлено в значение **0**. Поэтому  дополнительный отступ списка элементов от нижней границы контейнера по умолчанию отсутствует.
