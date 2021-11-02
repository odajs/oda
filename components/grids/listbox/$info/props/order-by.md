Свойство **«orderBy»** определяет вид сортировки элементов списка.

Оно может принимать одно из трех предопределенных значений:

1. «**none**» — сортировка отсутствует.
1. «**ascending**» — сортировка по возрастанию.
1. «**descending**» — сортировка по убыванию.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=140_
import '/components/grids/listbox/listbox.js';
ODA({
    is: 'my-component',
    template: `
        <span>Сортировать</span>
        <select ::value="orderBy">
            <option value="none">Без сортировки</option>
            <option value="ascending">По возрастанию</option>
            <option value="descending">По убыванию</option>
        </select>
        <oda-list-box :items :order-by></oda-list-box>
    `,
    props: {
        items: [
            {label: "Элемент 2", icon: 'icons:face'},
            {label: "Элемент 1", icon: 'icons:favorite'},
            {label: "Элемент 3", icon: 'icons:star'}
        ],
        orderBy: 'none'
    }
});
```

По умолчанию свойство **orderBy** установлено в значение **none**. Поэтому элементы списка изначально не сортируются, т.е. они отображаются в том порядке, в котором были указаны в массиве **items**.
