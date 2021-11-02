Свойство **pagesCount** позволяет узнать количество видимый областей, которые необходимы, чтобы последовательно отобразить все элементы, находящиеся в контейнере.

Это свойство имеет режим доступа только для чтения. Фактически оно рассчитывается как отношения общего количества строк в контейнере к числу строк, умещающихся в его видимой части, с учетом округления.

```javascript _run_line_edit_loadoda_[my-component.js]_h=160_
import '/components/grids/listbox/listbox.js';
ODA({
    is: 'my-component',
    template: `
        <label> Размер иконки: <input type="number" min="0" max="100" ::value="iconSize">px</label>
        <div>Количество областей: {{$refs.listbox.pagesCount}}</div>
        <oda-list-box ref="listbox" :items :icon-size style="max-height: 120px"></oda-list-box>
    `,
    props: {
        items: [
            {label: "Элемент 1", icon: 'icons:favorite'},
            {label: "Элемент 2", icon: 'icons:face'},
            {label: "Элемент 3", icon: 'icons:star'},
            {label: "Элемент 4", icon: 'icons:android'},
            {label: "Элемент 5", icon: 'odant:class'},
            {label: "Элемент 6", icon: 'icons:alarm'},
        ],
        iconSize: 24
    }
});
```

Очевидно, что значение этого свойства зависит от общего количества строк в контейнере, размера его видимой области и высоты каждой строки.
