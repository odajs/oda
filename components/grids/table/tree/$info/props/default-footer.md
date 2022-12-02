Свойство **defaultFooter** задает имя компонента, который будет использоваться для отображения нижнего колонтитула дерева.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=220_
import '/components/grids/tree/tree.js';
ODA({
    is: 'my-component',
    template: `
        <label>Показывать подвал <input type="checkbox" ::value="showFooter" ></label>
        <oda-tree ref="tree" :data-set :show-footer></oda-tree>
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
        showFooter: false
    }
});
```

По умолчанию свойство **defaultFooter** имеет значение **oda-table-footer**. Поэтому строка колонтитула отображается как обычная строка, но другим стилем, как это задано в одноименном компоненте.

``` javascript
ODA({
    is: "oda-table-footer",
    extends: 'oda-table-cell',
    template:`
        <style>
        :host{
            justify-content: flex-end;
            padding: 4px;
            @apply --dark;
            text-align: right;
            font-size: smaller;
        }
    </style>`
});
```
