Свойство **defaultGroupTemplate** задает имя компонента, с помощью которого будет отображаться панель группировки узлов дерева по умолчанию.

Это свойство изначально имеет значение **oda-table-cell-group**, т.е. именно этот компонент используется для отображения специальной панели, на которую перетаскивается столбец для группировки узлов дерева.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=220_
import '/components/grids/tree/tree.js';
ODA({
    is: 'my-component',
    template: `
        <label>Показать панель группировки <input type="checkbox" ::value="showGroupingPanel" ></label>
        <div>Шаблон группировочной панели: {{tree.defaultGroupTemplate}}</div>
        <oda-tree ref="tree" :data-set :columns show-header :show-grouping-panel></oda-tree>
    `,
    props: {
        columns: [
            {name: 'name', label: 'Мой столбец', treeMode: true}
        ],
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
            {name:"1 строка"},
        ],
        showGroupingPanel: false
    }
});
```
