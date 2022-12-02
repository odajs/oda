Свойство **headerHeight** позволяет определить высоту заголовка дерева.

Это свойство имеет режим доступа только для чтения. Его нельзя изменять.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=120_
import '/components/grids/tree/tree.js';
ODA({
    is: 'my-component',
    template: `
        <label>Показать заголовок: <input type="checkbox" ::value="showHeader" ></label>
        <span>Высота заголовка: {{$refs.tree.headerHeight}}</span>
        <oda-tree ref="tree" :data-set :show-header :columns></oda-tree>
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

По умолчанию свойство **showHeader** установлено в значение **false**. Поэтому заголовок изначально не отображается. В этом случае его высота принимается равной нулю.
