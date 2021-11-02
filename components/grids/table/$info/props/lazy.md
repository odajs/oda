Свойство **lazy** позволяет оптимизировать обработку строк таблицы.

Если это свойство установлено в значение **true**, то в таблице будут обрабатываться только те строки, которые находятся в видимой области контейнера.
Эти строки будут храниться в массиве **rows**. Если «ленивый» режим выключен, то в массив **rows** будут помещены все строки из массива **items**, находящийся как в видимой области контейнера, так и за ее пределами.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=220_
import '/components/grids/table/table.js';
ODA({
    is: 'my-component',
    template: `
        <label>Ленивая обработка <input type="checkbox" ::value="lazy" ></label>
        <div>Количество строк в контейнере: {{$refs.table.items.length}}</div>
        <div>Количество обрабатываемых строк: {{$refs.table.rows.length}}</div>
        <oda-table ref="table" :data-set :columns :lazy show-header row-lines col-lines auto-width style="max-height: 140px" show-footer></oda-table>
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
        lazy: false
    }
});
```

Изначально свойство **lazy** установлено в значение **false**, т.е. по умолчанию будут обрабатываться все строки контейнера, за исключением неразвернутых узлов деревьев, которые в массив **items** не попадают.
