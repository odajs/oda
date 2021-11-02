Свойство **defaultGroupTemplate** задает имя компонента, с помощью которого отображается панель группировки строк таблицы по умолчанию.

Это свойство изначально имеет значение **oda-table-cell-group**, т.е. именно этот компонент используется для отображения специальной панели, на которую перетаскивается столбец для группировки строк таблицы.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=220_
import '/components/grids/table/table.js';
ODA({
    is: 'my-component',
    template: `
        <label>Показать панель группировки <input type="checkbox" ::value="showGroupingPanel" ></label>
        <div>Шаблон группировочной панели: {{table.defaultGroupTemplate}}</div>
        <oda-table ref="tree" :data-set :columns show-header :show-grouping-panel col-lines></oda-table>
    `,

    props: {
        columns: [
            {name: 'col1', label: 'Столбец 1'},
            {name: 'col2', label: 'Столбец 2'}
        ],
        dataSet: [
            {col1: "1 Строка", col2: "2"},
            {col1: "2 Строка", col2: "1"},
            {col1: "1 Строка", col2: "1"}
        ],
        showGroupingPanel: false
    }
});
```
