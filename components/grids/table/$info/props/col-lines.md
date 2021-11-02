Свойство **colLines** позволяет отобразить вертикальные линии сетки в конце каждого столбца таблицы.

Если это свойство установлено в значение **true**, то в конце каждого столбца отображаются вертикальные линии, отделяющие один столбец от другого.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=160_
import '/components/grids/table/table.js';
ODA({
    is: 'my-component',
    template: `
        <label>Линии столбца<input type="checkbox" ::value="colLines" ></label> <br>
        <label>Привязка по ширине <input type="checkbox" ::value="autoWidth"></label> <br>
        <oda-table :data-set :col-lines :auto-width show-header></oda-table>
    `,
    props: {
        columns: [
            {col1: 'name', label: 'Столбец 1'},
            {col2: 'name', label: 'Столбец 2'}
        ],
        dataSet: [
            {col1: "1 Строка", col2: "1"},
            {col1: "2 Строка", col2: "2"},
            {col1: "3 Строка", col2: "3"}
        ],
        colLines: false,
        autoWidth: true
    }
});
```

Свойство **colLines** по умолчанию установлено в значение **false**. Поэтому вертикальные линии в конце каждой столбца изначально не отображаются.
