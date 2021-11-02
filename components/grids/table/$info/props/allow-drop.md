Свойство **allowDrop** позволяет вставлять строки таблицы при их перетаскивании левой кнопкой мыши.

Это свойство может принимать одно из трех значений:

1. **none** — вставка узлов при перетаскивании запрещена.
1. **simple** — простая вставка.
1. **extended** — вставка с развертыванием вложенных узлов.

Вставлять строки в новую позицию можно только при условии, что их перетаскивание разрешено в свойстве **allowDrag**.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=160_
import '/components/grids/table/table.js';
ODA({
    is: 'my-component',
    template: `
        <label>Разрешить перетаскивать узлы <input type="checkbox" checked ::value="allowDrag" ></label> <br>
        <span>Способ вставки</span>
        <select ::value="allowDrop">
            <option value="none" default>none</option>
            <option value="simple">simple</option>
            <option value="extended">extended</option>
        </select>
        <oda-table :data-set :allow-drop :allow-drag></oda-table>
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
        allowDrag: true,
        allowDrop: 'none'
    }
});
```

По умолчанию свойство **allowDrop** установлено в значение **none**. Поэтому вставлять строки дерева в новую позицию изначально запрещено, даже если их  перетаскивание разрешено.
