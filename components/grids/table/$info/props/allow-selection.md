Свойство **allowSelection** разрешает или запрещает выбирать строки таблицы.

Если это свойство установлено в значение **true**, то выбор строк таблицы разрешен. В противном случае строки выбраться будет нельзя.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=160_
import '/components/grids/table/table.js';
ODA({
    is: 'my-component',
    template: `
        <label>Разрешить выбор строк <input type="checkbox" ::value="allowSelection" ></label>
        <oda-table :data-set :allow-selection></oda-table>
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
        allowSelection: false
    }
});
```

Для выбора одновременно нескольких строк необходимо придерживать клавишу **Ctrl**.

По умолчанию свойство **allowSelection** установлено в значение **false**. Поэтому выбрать строки таблицы изначально будет нельзя.
