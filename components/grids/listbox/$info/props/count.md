Свойство **count** возвращает количество элеметов в списке.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=140_
import '/components/grids/listbox/listbox.js';
ODA({
    is: 'my-component',
    template: `
        <span>Количество элементов: {{$refs.listbox.count}}</span>
        <oda-list-box ref="listbox" :items></oda-list-box>
    `,
    props: {
        items: [
            {label: "Элемент 1", icon: 'icons:favorite'},
            {label: "Элемент 2", icon: 'icons:face'},
            {label: "Элемент 3", icon: 'icons:star'}
        ]
    }
});
```

Это свойство имеет режим доступа только для чтения, т.е. изменение его значения не приводит к изменению количества элементов в списке. Оно лишь возвращает текущее количество, не изменяя его.
