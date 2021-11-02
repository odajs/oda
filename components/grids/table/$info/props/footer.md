Свойство **footer** позволяет узнать содержимое нижнего колонтитула таблицы.

По своей структуре данного свойство является объектом, у которого задано свойство совпадающее с именем столбца, в котором отображаются ячейки таблицы. В этом свойстве и хранится содержимое, которое выводится в колонтитуле.

Само содержимое рассчитывается автоматически в зависимости от свойства **summary**, заданного при описании столбца в массиве **columns**.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=200_
import '/components/grids/table/table.js';
ODA({
    is: 'my-component',
    template: `
        <div>Показать подвал <input type="checkbox" ::value="showFooter"></div>
        <div>Значение свойства: {{JSON.stringify($refs.table.footer)}}</div>
        <oda-table ref="table" :data-set :show-footer :columns show-header col-lines auto-width></oda-table>
    `,
    props: {
        columns: [
            {name: 'col1', label: 'Столбец 1', summary: 'count'},
            {name: 'col2', label: 'Столбец 2', summary: 'sum'}
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

По умолчанию в нижнем колонтитуле выводится информация об общем количестве узлов, расположенных в видимой области контейнера, с уточнением номера первого и последнего узла из них в квадратных скобках.
