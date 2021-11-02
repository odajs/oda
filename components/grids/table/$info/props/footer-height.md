Свойство **footerHeight** позволяет определить высоту нижнего колонтитула таблицы.

Это свойство имеет режим доступа только для чтения. Его нельзя изменять.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=220_
import '/components/grids/table/table.js';
ODA({
    is: 'my-component',
    template: `
        <label>Показать подвал: <input type="checkbox" ::value="showFooter" ></label>
        <label>Высота колонтитула: {{$refs.table.footerHeight}}</label>
        <oda-table ref="table" :data-set :columns :show-footer show-header col-lines auto-width></oda-table>
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
        showFooter: false
    }
});
```

По умолчанию свойство **showFooter** установлено в значение **false**. Поэтому нижний колонтитул изначально не отображается. В этом случае его высота принимается равной нулю.
