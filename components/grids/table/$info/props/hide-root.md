Свойство **hideRoot** позволяет спрятать корневые узлы дерева.

Данное свойство работает только со столбцами таблицы, которые находятся в режиме отображения данных в виде деревьев, указанному с помощью свойства **treeMode**.

Если это свойство установлено в значение **true**, то все узлы деревьев, находящиеся на первом уровне во всех столбцах таблицы, компонентом отображаться не будут.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=160_
import '/components/grids/table/table.js';
ODA({
    is: 'my-component',
    template: `
        <label>Спрятать корневые узлы<input type="checkbox" ::value="hideRoot" ></label> <br>
        <oda-table :data-set :columns :hide-root show-header col-lines auto-width></oda-table>
    `,
    props: {
        columns: [
            {name: 'col1', label: 'Столбец 1'},
            {name: 'col2', label: 'Столбец 2', treeMode: true}
        ],
        dataSet: [
            {col1: "1 строка", col2:"1 узел"},
            {col1: "2 строка", col2:"2 узел",
                items:[
                    {col2: "2.1 узел"},
                    {col2: "2.2 узел",
                    items:[
                        {col2:"2.2.1 узел"},
                        {col2:"2.2.2 узел"},
                        {col2:"2.2.3 узел"},
                    ]},
                    {col2:"2.3 узел"}
                ]},
        ],
        hideRoot: false
    }
});
```

По умолчанию свойство **hideRoot** установлено в значение **false**. Поэтому корневые узлы деревьев изначально не отображаются.
