Свойство **allowSelection** разрешает или запрещает выбирать узлы дерева.

Если это свойство установлено в значение **true**, то выбор узлов дерева разрешен. В противном случае узлы дерева выбрать будет нельзя.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=140_
import '/components/grids/tree/tree.js';
ODA({
    is: 'my-component',
    template: `
        <label>Разрешить выбор <input type="checkbox" ::value="allowSelection" ></label>
        <oda-tree :data-set :allow-selection></oda-tree>
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
        allowSelection: false
    }
});
```

Для выбора одновременно нескольких узлов необходимо удерживать зажатой клавишу **Ctrl**.

По умолчанию свойство **allowSelection** установлено в значение **false**. Поэтому выбрать узлы дерева изначально невозможно.
