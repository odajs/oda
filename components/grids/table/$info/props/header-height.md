Свойство **headerHeight** позволяет определить высоту заголовка таблицы.

Это свойство имеет режим доступа только для чтения. Его нельзя изменять.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=160_
import '/components/grids/table/table.js';
ODA({
    is: 'my-component',
    template: `
        <label>Показать заголовок: <input type="checkbox" ::value="showHeader" ></label>
        <span>Высота заголовка: {{$refs.table.headerHeight}}</span>
        <oda-table ref="table" :data-set :show-header :columns col-lines auto-width></oda-table>
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
        showHeader: false
    }
});
```

Изначально свойство **showHeader** установлено в значение **false**. Поэтому по умолчанию заголовок таблицы не отображается. В этом случае его высота принимается равной нулю.
