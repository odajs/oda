Свойство **lazy** позволяет оптимизировать обработку узлов дерева.

Если это свойство установлено в значение **true**, то в массив обрабатываемых строк **rows** попадут только те строки, которые располагаются в видимой области контейнера. В противном случае в массив **rows** будут помещены все строки из массива **items**, находящиеся как видимой области контейнера, так и за ее пределами.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=140_
import '/components/grids/tree/tree.js';
ODA({
    is: 'my-component',
    template: `
        <label>Ленивая обработка <input type="checkbox" ::value="lazy" ></label>
        <div>Количество узлов в контейнере: {{$refs.tree.items.length}}</div>
        <div>Количество обрабатываемых узлов: {{$refs.tree.rows.length}}</div>
        <oda-tree ref="tree" :data-set :lazy style="max-height: 120px"></oda-tree>
    `,
    props: {
        dataSet: [
            {name: "1 строка"},
            {name:"2 строка",
                items:[
                    {name:"2.1 строка"},
                    {name:"2.2 строка",
                    items:[
                        {name:"2.2.1 строка"},
                        {name:"2.2.2 строка"},
                        {name:"2.2.3 строка"},
                    ]},
                    {name:"2.3 строка"}
                ]
            },
            {name:"3 строка"},
        ],
        lazy: false
    }
});
```

По умолчанию свойство **lazy** установлено в значение **false**, т.е. изначально обрабатываться будут все строки контейнера.