Свойство **rowSize** позволяет узнать высоту строки, отведенную каждому элементу списка.

Это свойство имеет режим доступа только для чтении. Его значение определяется автоматически по размеру иконки, указанному в свойстве **iconSize**.

```javascript _run_line_edit_loadoda_[my-component.js]_h=160_
import '/components/grids/listbox/listbox.js';
ODA({
    is: 'my-component',
    template: `
        <label> Размер иконки: <input type="number" min="0" max="100" ::value="iconSize">px</label>
        <div>Высота строки {{this.$refs.listbox.rowSize}}</div>
        <oda-list-box ref="listbox" :items :icon-size></oda-list-box>
    `,
    props: {
        items: [
            {label: "Элемент 1", icon: 'icons:favorite'},
            {label: "Элемент 2", icon: 'icons:face'},
            {label: "Элемент 3", icon: 'icons:star'},
        ],
        iconSize: 24,
        rowSize: 40
    }
});
```

Фактически высота строки для каждого элемента определяется как размер иконки + отступ сверху и снизу в 8 пикселей.
