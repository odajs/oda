Свойство **selectAll** позволяет выбрать все узлы дерева.

Если это свойство установить в значение **true**, то из списка будут выбраны все узлы при условии, что такой выбор разрешен в свойстве **allowSelection**.

Если выбор узлов дерева запрещен, то свойство **selectAll** никаких действий выполнять не будет. Однако если свойство **selectAll** установлено в значение **true**, то при разрешении выбора все узлы сразу станут выбранными.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=140_
import '/components/grids/tree/tree.js';
ODA({
    is: 'my-component',
    template: `
        <label>Разрешить выбор <input type="checkbox" ::value="allowSelection" ></label> <br>
        <label>Выбрать все элементы <input type="checkbox" ::value="selectAll" ></label>
        <oda-tree :data-set :allow-selection :select-all ></oda-tree>
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
        allowSelection: false,
        selectAll: false
    }
});
```

По умолчанию свойство **selectAll** установлено в значение **false**. Поэтому  все элементы из списка изначально не будут выделяться, даже если это разрешено в свойстве **allowSelection**.
