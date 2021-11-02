Свойство **treeStep** задает дополнительный отступ с левой стороны у  перетаскиваемого узла дерева.

По умолчанию это свойство имеет числовое значение 24, которое говорит о том, что при использовании технологии **drag and drop** перетаскиваемый узел будет смещаться относительно текущего уровня узлов на 24 пикселя для того, чтобы он визуально отличался от других узлов дерева.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=140_
import '/components/grids/tree/tree.js';
ODA({
    is: 'my-component',
    template: `
     <label> Размер отступа: <input type="number" min="0" max="100" ::value="treeStep">px</label>
        <span>Способ вставки</span>
        <select ::value="allowDrop">
            <option value="none" default>none</option>
            <option value="simple">simple</option>
            <option value="extended">extended</option>
        </select>
        <oda-tree :data-set :tree-step :allow-drop allow-drag allow-select allow-focus></oda-tree>
    `,
    props: {
        dataSet: [
            {name: "1 строка", drop: true},
            {name:"2 строка", drag: true,
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
        treeStep: 24,
        allowDrop: 'none'
    }
});
```

Для того чтобы это свойство работало, необходимо разрешить использовать механизм **drag and drop**.
