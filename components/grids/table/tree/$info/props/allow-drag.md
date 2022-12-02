Свойство **allowDrag** разрешает или запрещает перетаскивать узлы дерева левой кнопкой мыши.

Если это свойство установлено в значение **true**, то перетаскивание узлов дерева разрешено. В противном случае узлы дерева перетаскивать будет нельзя.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=140_
import '/components/grids/tree/tree.js';
ODA({
    is: 'my-component',
    template: `
        <label>Разрешить перетаскивание <input type="checkbox" ::value="allowDrag" ></label>
        <span>Сортировать</span>
        <select ::value="orderBy">
            <option value="none">none</option>
            <option value="simple">simple</option>
            <option value="extended">extended</option>
        </select>
        <label>Разрешить вставку <input type="checkbox" ::value="allowDrop" ></label>
        <oda-tree :data-set :allow-drag :allow-drop></oda-tree>
    `,
    props: {
        dataSet: [
            {name: "1 строка", drag: true},
            {name:"2 строка",
                items:[
                    {name:"2.1 строка", drag: true},
                    {name:"2.2 строка", drop: true,
                    items:[
                        {name:"2.2.1 строка"},
                        {name:"2.2.2 строка"},
                        {name:"2.2.3 строка"},
                    ]},
                    {name:"2.3 строка"}
                ]
            },
            {name:"3 строка", drop: true},
        ],
        allowDrag: false,
        allowDrop: 'none'
    }
});
```

Для того чтобы узел можно было вставлять при перетаскивании, свойство **allowDrop** необходимо установить в значение **true**.

По умолчанию свойство **allowDrag** установлено в значение **false**. Поэтому перетаскивать узлы дерева изначально запрещено.
