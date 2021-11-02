Свойство **defaultFooter** задает имя компонента, который используется для отображения нижнего колонтитула таблицы.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=200_
import '/components/grids/table/table.js';
ODA({
    is: 'my-component',
    template: `
        <label>Показать нижний колонтитул <input type="checkbox" ::value="showFooter"></label>
        <oda-table ref="table" :data-set show-header :columns :show-footer col-lines></oda-table>
    `,
    props: {
        columns: [
            {name: 'col1', label: 'Столбец 1', summary: 'count'},
            {name: 'col2', label: 'Столбец 2', summary: 'sum'}
        ],
        dataSet: [
            {col1: "1 Строка", col2: "2"},
            {col1: "2 Строка", col2: "2"},
            {col1: "1 Строка", col2: "3"}
        ],
        showFooter: false
    }
});
```

По умолчанию свойство **defaultFooter** имеет значение **oda-table-footer**. Поэтому строка колонтитула отображается как обычная строка, но другим стилем, как это задано в одноименном компоненте.

``` javascript
ODA({
    is: "oda-table-footer",
    extends: 'oda-table-cell',
    template:`
        <style>
        :host{
            justify-content: flex-end;
            padding: 4px;
            @apply --dark;
            text-align: right;
            font-size: smaller;
        }
    </style>`
});
```
