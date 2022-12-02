Свойство **hideRoot** позволяет спрятать корневые узлы дерева.

Если это свойство установлено в значение **true**, то все узлы дерева, находящиеся на первом уровне, не будут отображаться компонентом.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=140_
import '/components/grids/tree/tree.js';
ODA({
    is: 'my-component',
    template: `
        <label>Спрятать корневые узлы<input type="checkbox" ::value="hideRoot" ></label> <br>
        <oda-tree :data-set key-name="name" :hide-root ></oda-tree>
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
        hideRoot: false
    }
});
```

По умолчанию свойство **hideRoot** установлено в значение **false**. Поэтому корневые узлы изначально отображены.
