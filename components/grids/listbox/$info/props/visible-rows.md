Свойство **visibleRows** содержит список строк, отображаемых в видимой области контейнера.

Это свойство представляет собой массив, в котором хранятся все элементы списка, находящиеся в видимой области контейнера на данный момент.

```javascript _run_line_edit_loadoda_[my-component.js]_h=160_
import '/components/grids/listbox/listbox.js';
ODA({
    is: 'my-component',
    template: `
        <div>Первый видимый элемент: {{$refs.listbox.visibleRows[0].label}}</div>
        <oda-list-box ref="listbox" :items style="max-height: 120px"></oda-list-box>
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
    }
});
```

В представленном примере выводится только первый элемент массива **visibleRows**, который отображается в контейнере. При любом изменении контейнера массив **visibleRows** автоматически обновляется.
