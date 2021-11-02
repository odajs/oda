Свойство **allowDrag** разрешает или запрещает перетаскивать строки таблицы левой кнопкой мыши.

Если это свойство установлено в значение **true**, то перетаскивание строк разрешено. В противном случае строки таблицы перетаскивать будет нельзя.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=160_
import '/components/grids/table/table.js';
ODA({
    is: 'my-component',
    template: `
        <label>Разрешить перетаскивание <input type="checkbox" ::value="allowDrag" ></label>
        <span>Сортировать</span>
        <select ::value="orderBy">
            <option value="none">none</option>
            <option value="simple">simple</option>
            <option value="extended">extended</option>
        </select>
        <label>Разрешить вставку <input type="checkbox" ::value="allowDrop" ></label>
        <oda-table :data-set :allow-drag :allow-drop show-header></oda-table>
    `,
    props: {
        columns: [
            {name: 'col1', label: 'Столбец 1'},
            {name: 'col2', label: 'Столбец 2'}
        ],
        dataSet: [
            {col1: "1 Строка", col2: "1"},
            {col1: "2 Строка", col2: "2"},
            {col1: "3 Строка", col2: "3"}
        ],
        allowDrag: false,
        allowDrop: 'none'
    }
});
```

Для того чтобы строку можно было вставлять при перетаскивании, свойство **allowDrop** необходимо установить в значение **true**.

По умолчанию свойство **allowDrag** установлено в значение **false**. Поэтому перетаскивать строки дерева изначально запрещено.
