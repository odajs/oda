Свойство **rows** содержит список всех обработываемых строк в видимой области контейнера таблицы.

Данное свойство включает в себя:

1. Все строки с развернутыми узлам дерева, расположенные в видимой области контейнера.
1. Родительские узлы деревьев, которые сами не попали в видимую область контейнера, но их наследники находятся в ней.
1. Группировочные строки, которые сами не попали в видимую область контейнера, но их вложенные узлы находятся в ней.

Список узлов дерева в массиве **rows** отличается от списка развернутых узлов дерева **items** только тогда, когда включен режим ленивой обработки данных с помощью свойства **lazy**. В противном случае массивы **items** и **rows** будут абсолютно одинаковыми.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=220_
import '/components/grids/table/table.js';
ODA({
    is: 'my-component',
    template: `
        <label>Ленивая обработка <input type="checkbox" ::value="lazy" ></label>
        <div>Количество строк в видимой области: {{$refs.table.screen.length}}</div>
        <div>Общее количество развернутых строк: {{$refs.table.items.length}}</div>
        <div>Общее количество обрабатываемых строк: {{$refs.table.rows.length}}</div>
        <div>Первый узел в списке: {{$refs.table.rows.length ? $refs.table.rows[0].name: 'Нет' }}</div>
        <div>Последний узел в списке: {{$refs.table.rows.length ? $refs.table.rows[$refs.table.rows.length - 1].name: 'Нет'}}</div>
        <oda-table ref="table" :data-set :columns :lazy show-header row-lines col-lines auto-width style="max-height: 140px" show-footer></oda-table>
    `,
    props: {
        columns: [
            {name: 'col1', label: 'Столбец 1'},
            {name: 'col2', label: 'Столбец 2', tableMode: true}
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
        lazy: false
    }
});
```

По умолчанию свойство **lazy** установлено в значение **false**, т.е. изначально обрабатываются все строки контейнера из массива **items** и свойство **rows** от него ничем не отличается.
