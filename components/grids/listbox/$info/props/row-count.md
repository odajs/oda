Свойство **rowCount** определяет количество строк, отображаемых в видимой области контейнера.

Это свойство имеет режим доступа для чтения. Его значение определяется автоматически по высоте видимой области контейнера и по высоте строки, отводимой для каждого элемента списка.

```javascript _run_line_edit_loadoda_[my-component.js]_h=160_
import '/components/grids/listbox/listbox.js';
ODA({
    is: 'my-component',
    template: `
        <label> Размер иконки: <input type="number" min="0" max="100" ::value="iconSize">px</label>
        <div>Количество строк: {{$refs.listbox.rowCount}}</div>
        <oda-list-box ref="listbox" :items :icon-size style="max-height: 120px"></oda-list-box>
    `,
    props: {
        items: [
            {label: "Элемент 1", icon: 'icons:favorite'},
            {label: "Элемент 2", icon: 'icons:face'},
            {label: "Элемент 3", icon: 'icons:star'},
            {label: "Элемент 4", icon: 'icons:android'}
        ],
        iconSize: 24,
    }
});
```

Фактически количество строк, умещающихся в видимой области контейнера, определяется по высоте этой области, деленной на высоту строки каждого элемента с учетом округления до наименьшего целого значения.
