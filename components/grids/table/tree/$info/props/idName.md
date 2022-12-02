Свойство **idName** работает неправильно.

Фактически оно проверяет **undefined** c **undefined** и отмечает, что все строки находятся в фокусе или выбраны.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=140_
import '/components/grids/tree/tree.js';
ODA({
    is: 'my-component',
    template: `
        <label>Разрешение фокуса<input type="checkbox" ::value="allowFocus" ></label> <br>
        <label>Разрешение выбора<input type="checkbox" ::value="allowSelection" ></label> <br>
        <span>Узел в фокусе: {{focusedNode.name}}</span>
        <oda-tree :data-set ::focused-node ::allow-focus ::allow-selection id-name="123"></oda-tree>
    `,
    props: {
        dataSet: [
            {name: "1 строка", idName: 123},
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
        allowFocus: false,
        allowSelection: false,
        focusedNode: {name: 'Щелкните по элементу'}
    }
});
```
