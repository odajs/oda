Свойство **allowCheck** позволяет отобразить дополнительные кнопки множественного выбора **checkBox** с левой стороны от надписи у узлов дерева.

Если это свойство уставлено в значение **true**, то кнопки множественного выбора будут отображены, в противном случае — нет.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=140_
import '/components/grids/tree/tree.js';
ODA({
    is: 'my-component',
    template: `
        <label>Показать кнопки выбора <input type="checkbox" ::value="allowCheck" ></label> <br>
        <div>Выбранный узел: {{checkNode}}</div>
        <oda-tree :data-set :allow-check></oda-tree>
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
        allowCheck: false,
        checkNode: ''
    },
    listeners: {
        checked(e) {
            this.checkNode = e.detail.value.name;
        }
    }
});
```

При выборе любой кнопки ее состояние, которое сохраняется в свойстве  **checked** соответствующего узла, будет изменено. Кроме этого, будет сгенерировано событие с именем **checked**, которому в качестве параметра **value** будут передан тот узел, который в данный момент был выбран.

По умолчанию свойство **allowCheck** установлено в значение **false**. Поэтому дополнительные кнопки множественного выбора изначально не отображены.
