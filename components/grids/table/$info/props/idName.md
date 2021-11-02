Свойство **idName** работает неправильно.

Фактически оно проверяет **undefined** c **undefined** и отмечает, что все строки находятся в фокусе или выбраны.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=140_
import '/components/grids/table/table.js';
ODA({
    is: 'my-component',
    template: `
        <label>Разрешение фокуса<input type="checkbox" ::value="allowFocus" ></label> <br>
        <label>Разрешение выбора<input type="checkbox" ::value="allowSelection" ></label> <br>
        <span>Узел в фокусе: {{focusedRow.name}}</span>
        <oda-table :data-set :columns :focused-row ::allow-selection show-header col-lines auto-width id-name="my"></oda-table>
    `,
    props: {
        columns: [
            {name: 'col1', label: 'Столбец 1'},
            {name: 'col2', label: 'Столбец 2'}
        ],
        dataSet: [
            {col1: "1 Строка", col2: "1", id: "my"},
            {col1: "2 Строка", col2: "2"},
            {col1: "3 Строка", col2: "3", id: "my"}
        ],
        allowFocus: false,
        allowSelection: false,
        focusedRow: {name: 'Щелкните по элементу'}
    }
});
```
