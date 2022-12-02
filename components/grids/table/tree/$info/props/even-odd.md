Свойство **evenOdd** позволяет отображать четные и нечетные строки дерева в разных стилях.

Если это свойство установлено в значение **true**, то четные и нечетные строки дерева будут внешне отличаться друг от друга.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=140_
import '/components/grids/tree/tree.js';
ODA({
    is: 'my-component',
    template: `
        <label>Чередовать стиль строк<input type="checkbox" ::value="evenOdd" ></label>
        <oda-tree :data-set :even-odd></oda-tree>
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
        evenOdd: false,
    }
});
```

По умолчанию свойство **evenOdd** установлено в значение **false**. Поэтому все строки дерева изначально отображены в одном и том же стиле.
