Свойство **counterHeight** задает высоту панели, на которой отображается общее количество элементов списка.

Для отображения панели необходимо установить свойство  **showCount** в значение **true**.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=180_
import '/components/grids/listbox/listbox.js';
ODA({
    is: 'my-component',
    template: `
        <label>Отступ снизу <input type="number" ::value="counterHeight"> px</label>
        <oda-list-box :items show-count :counter-height></oda-list-box>
    `,
    props: {
        items: [
            {label: "Элемент 1", icon: 'icons:favorite'},
            {label: "Элемент 2", icon: 'icons:face'},
            {label: "Элемент 3", icon: 'icons:star'}
        ],
        counterHeight: 24
    }
});
```

Изначально свойство **counterHeight** установлено в значение **24**. Поэтому панель с количеством элементов по умолчанию имеет высоту 24 пикселя.
