Свойство **showHeader** позволяет отображать заголовки столбцов таблицы.

Если это свойство уставлено в значение **true**, то вверху таблицы отображается дополнительная строка, на которой выводятся название столбцов **name** или их надписи **label**, указанные в массиве **columns**.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=160_
import '/components/grids/table/table.js';
ODA({
    is: 'my-component',
    template: `
        <label>Показать заголовок <input type="checkbox" ::value="showHeader" ></label>
        <oda-table ref="table" :show-header :data-set :columns row-lines col-lines auto-width></oda-table>
    `,
    props: {
        columns: [
            {name: 'col1'},
            {name: 'col2', label: 'Столбец 2'}
        ],
        dataSet: [
            {col1: "1 Строка", col2: "1"},
            {col1: "2 Строка", col2: "2"},
            {col1: "3 Строка", col2: "3"}
        ],
        showHeader: false
    }
});
```

Если в массиве **columns** надпись для столбца **label** не задана, то в заголовке будет отображаться название столбца, указанное в свойстве **name**.

По умолчанию свойство **showHeader** установлено в значение **false**. Поэтому заголовки у столбцов таблицы изначально не отображают.
