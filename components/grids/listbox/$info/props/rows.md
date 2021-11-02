Свойство **rows** определяет список элементов находящихся в контейнере в данный момент.

Это свойство представляет собой обычный массив, в котором размещаются все элементы исходного списка **items**, удовлетворяющие условию фильтрации, указанному в свойстве **filter**.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=160_
import '/components/grids/listbox/listbox.js';
ODA({
    is: 'my-component',
    template: `
        <div> Последний элемент контейнера: {{$refs.listbox.visibleRows[$refs.listbox.visibleRows.length - 1].label}}</div>
        <oda-list-box ref="listbox" :items :filter style="max-height: 120px"></oda-list-box>
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
        filter: "1 2 3 4 5"
    }
});
```

Как видно из примера в массиве **rows** размещаются все элементы, удовлетворяющие условию фильтрации, и находящиеся как в видимой, так и в скрытой области контейнера.

Если фильтрация не задана, то массив **rows** полностью совпадает со списком всех элементов **items**.
