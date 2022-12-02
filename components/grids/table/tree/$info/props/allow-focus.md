Свойство **allowFocus** разрешает или запрещает узлам дерева получать фокус при их выделении.

Если это свойство установлено в значение **true**, то при щелчке мыши по узлу дерева он сможет получить фокус. При этом выбранный узел будет выделен особым образом и записан в свойство **focusedNode**, из которого можно узнать какой узел дерева находится в фокусе на данный момент.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=140_
import '/components/grids/tree/tree.js';
ODA({
    is: 'my-component',
    template: `
        <label>Разрешение фокуса<input type="checkbox" ::value="allowFocus" ></label> <br>
        <span>Узел в фокусе: {{focusedNode.name}}</span>
        <oda-tree :data-set ::focused-node ::allow-focus></oda-tree>
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
        allowFocus: false,
        focusedNode: {name: 'Щелкните по элементу'}
    }
});
```

По умолчанию свойство **allowFocus** установлено в значение **false**. Поэтому узлы дерева изначально не могут получить фокус.
