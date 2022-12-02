Свойство **allowDrop** позволяет вставлять узлы дерева при их перетаскивании левой кнопкой мыши.

Это свойство может принимать одно из трех значений:

1. **none** — вставка узлов при перетаскивании запрещена.
1. **simple** — простая вставка.
1. **extended** — вставка с развертыванием вложенных узлов.

Вставлять узлы в новую позицию можно только при условии, что их перетаскивание разрешено в свойстве **allowDrag**.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=140_
import '/components/grids/tree/tree.js';
ODA({
    is: 'my-component',
    template: `
        <label>Разрешить перетаскивать узлы <input type="checkbox" checked ::value="allowDrag" ></label> <br>
        <span>Способ вставки</span>
        <select ::value="allowDrop">
            <option value="none" default>none</option>
            <option value="simple">simple</option>
            <option value="extended">extended</option>
        </select>
        <oda-tree :data-set :allow-drop :allow-drag></oda-tree>
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
        allowDrag: true,
        allowDrop: 'none'
    }
});
```

По умолчанию свойство **allowDrop** установлено в значение **none**. Поэтому вставлять узлы дерева в новую позицию изначально запрещено, даже если их разрешено перетаскивать.
