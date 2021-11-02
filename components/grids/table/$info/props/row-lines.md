Свойство **rowLines** определяет наличие или отсутствие линий, отделяющих одну строку таблицы от другой.

Если это свойство установлено в значение **true**, то строки таблицы будут отделяться друг от друга горизонтальными линиями, идущими в конце каждой строки.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=140_
import '/components/grids/tree/tree.js';
ODA({
    is: 'my-component',
    template: `
        <label>Показать линии строк<input type="checkbox" ::value="rowLines" ></label>
        <oda-table ref="table" :data-set show-header :columns :row-lines col-lines auto-width></oda-table>
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
        rowLines: false
    }
});
```

Свойство **rowLines** по умолчанию установлено в значение **false**. Поэтому линии, отделяющие строки, у таблицы изначально не отображаются.
