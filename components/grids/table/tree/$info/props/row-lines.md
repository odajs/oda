Свойство **rowLines** определяет наличие или отсутствие линий, отделяющих одну строку от другой в структуре дерева.

Если это свойство установлено в значение **true**, то строки с узлами дерева будут отделяться друг от друга горизонтальными линиями.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=140_
import '/components/grids/tree/tree.js';
ODA({
    is: 'my-component',
    template: `
        <label>Линии строк<input type="checkbox" ::value="rowLines" ></label>
        <oda-tree :data-set :row-lines></oda-tree>
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
        rowLines: false
    }
});
```

Свойство **rowLines** по умолчанию установлено в значение **false**. Поэтому линии, отделяющие строки, изначально не отображаются.
