Свойство **table** содержит ссылку на сам компонент, в котором размещается таблица.

Фактически значение этого свойства совпадает с указателем **this**.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=160_
import '/components/grids/table/table.js';
ODA({
    is: 'my-component',
    template: `
        <span>Table это this? {{this===this.table ? 'Да':'Нет'}}</span>
        <oda-table ref="table" :data-set :columns show-header row-lines col-lines auto-width></oda-table>
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
    }
});
```
