Свойство **defaultHeader** задает имя компонента, с помощью которого будет отображаться строка заголовка дерева по умолчанию.

Это свойство изначально имеет значение **oda-table-header**, т.е. именно этот компонент используется для отображения строки заголовка дерева по умолчанию.

С его помощью:

1. Выводится название или метка столбца.
1. Отображается строка фильтрации.
1. Задается кнопка сортировки узлов.
1. Прорисовываются вложенные столбцы с возможностью их свертывания и развертывания.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=220_
import '/components/grids/tree/tree.js';
ODA({
    is: 'my-component',
    template: `
        <label>Показать заголовок <input type="checkbox" ::value="showHeader" ></label>
        <label>Показать фильтр <input type="checkbox" ::value="showFilter" ></label>
        <label>Разрешить сортировку <input type="checkbox" ::value="allowSort" ></label>
        <div>Шаблон заголовка: {{tree.defaultHeader}}</div>
        <oda-tree ref="tree" :data-set :columns :show-header :show-filter :allow-sort ></oda-tree>
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

Это свойство изначально имеет значение **oda-table-header**, т.е. именно этот компонент используется для отображения строки заголовка дерева по умолчанию.
