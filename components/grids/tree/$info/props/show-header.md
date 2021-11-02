Свойство **showHeader** позволяет отобразить заголовок столбца, в котором отображаются узлы дерева.

Если это свойство уставлено в значение **true**, то заголовок отображается. На нем выводится название столбца **name** или его метка **label**, которые заданы в массиве столбов **columns**.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=220_
import '/components/grids/tree/tree.js';
ODA({
    is: 'my-component',
    template: `
        <label>Показать заголовок <input type="checkbox" ::value="showHeader" ></label>
        <oda-tree ref="tree" :data-set :columns :show-header></oda-tree>
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
            {name:"3 строка"},
        ],
        showHeader: false
    }
});
```

По умолчанию свойство **showHeader** установлено в значение **false**. Поэтому заголовок у столбца дерева изначально не отображается.

Если массив **columns** не задан, то надпись в заголовке не отображается.
