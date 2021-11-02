Свойство **allowFocus** разрешает или запрещает получать фокус строкам таблицы при их выделении.

Если это свойство установлено в значение **true**, то при щелчке мыши по строке таблицы она сможет получить фокус. При этом выбранная строка будет особо выделена и записана в свойство **focusedRow**, из которого можно узнать, какая строка таблицы на данный момент находится в фокусе.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=160_
import '/components/grids/table/table.js';
ODA({
    is: 'my-component',
    template: `
        <label>Разрешение фокуса<input type="checkbox" ::value="allowFocus" ></label> <br>
        <span>Строка в фокусе: {{focusedRow.col1}}</span>
        <oda-table :data-set ::focused-row ::allow-focus></oda-table>
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
        allowFocus: false,
        focusedRow: {name: 'Щелкните по элементу'}
    }
});
```

По умолчанию свойство **allowFocus** установлено в значение **false**. Поэтому узлы дерева фокус изначально получить не могут.
