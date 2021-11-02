Свойство **defaultHeader** задает имя компонента, с помощью которого отображаются заголовки столбцов таблицы по умолчанию.

Это свойство изначально имеет значение **oda-table-header**, т.е. именно этот компонент используется для отображения заголовков таблицы, если для этого не предусмотреть другой пользовательский компонент.

Этот компонент позволяет:

1. Выводить название или метку столбца таблицы.
1. Отображать строку фильтрации.
1. Задавать порядок сортировки строк.
1. Прорисовывать вложенные столбцы с возможность их свертывания и развертывания.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=220_
import '/components/grids/table/table.js';
ODA({
    is: 'my-component',
    template: `
        <label>Показать заголовки <input type="checkbox" ::value="showHeader" ></label><br>
        <label>Показать фильтр <input type="checkbox" ::value="showFilter" ></label><br>
        <label>Разрешить сортировку <input type="checkbox" ::value="allowSort" ></label>
        <div>Шаблон заголовка: {{table.defaultHeader}}</div>
        <oda-table ref="table" :data-set :columns :show-header :show-filter :allow-sort col-lines></oda-table>
    `,
    props: {
        columns: [
            {name: 'col1', label: 'Столбец 1'},
            {name: 'col2', label: 'Столбец 2', $expanded: true,
                items: [
                    {name: 'col21', label: 'Столбец 2.1'},
                    {name: 'col22', label: 'Столбец 2.2'}
                ]
            }
        ],
        dataSet: [
            {col1: "1 Строка", col21: "1", col22: "1.0"},
            {col1: "2 Строка", col21: "2", col22: "2.0"},
            {col1: "3 Строка", col21: "3", col22: "3.0"}
        ],
        showHeader: false,
        showFilter: false,
        allowSort: false
    }
});
```
