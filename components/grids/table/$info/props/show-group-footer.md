Свойство **showGroupFooter** позволяет отображать нижний колонтитул внизу каждой группы объединенных строк таблицы.

Если это свойство уставлено в значение **true**, то в конце каждой группы будет отображаться дополнительная строка, на которой будет выводится информация об общем количестве строк, которые были объединены друг с другом в результате группировки.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=240_
import '/components/grids/table/table.js';
ODA({
    is: 'my-component',
    template: `
        <label>Показать нижний колонтитул у групп<input type="checkbox" ::value="showGroupingPanel" ></label>
        <oda-table ref="table" :show-group-footer show-grouping-panel show-grouping-panel :data-set :columns show-header row-lines col-lines auto-width></oda-table>
    `,
    props: {
        columns: [
            {name: 'col1', label: 'Столбец 1', summary: 'count'},
            {name: 'col2', label: 'Столбец 2', summary: 'sum'}
        ],
        dataSet: [
            {col1: "1 Строка", col2: "1"},
            {col1: "2 Строка", col2: "2"},
            {col1: "1 Строка", col2: "2"}
        ],
        showGroupFooter: false
    }
});
```

Для осуществления группировки необходимо отобразить группировочную панель, установив свойство **show-grouping-panel** в значение **true**, и перетащить на нее столбец, расположенный в строке заголовка таблицы, первоначально отобразив ее с помощью свойства **showHeader**.

По умолчанию свойство **showGroupFooter** установлено в значение **false**. Поэтому нижний колонтитул в конце каждой группы изначально не отображается.

Если массив **columns** не задан, то перетащить столбец на панель группировки будет нельзя.
