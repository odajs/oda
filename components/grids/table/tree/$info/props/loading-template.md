Свойство **loadingTemplate** задает имя компонента, который будет использоваться для отображения узла дерева при развертывании достаточно большого списка дочерних узлов.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=140_
import '/components/grids/tree/tree.js';
ODA({
    is: 'my-component',
    template: `
        <oda-tree :data-set></oda-tree>
    `,
    props: {
        dataSet: [
            {name: "1 строка", template: 'oda-table-loading'},
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
    }
});
```

По умолчанию свойство **loadingTemplate** имеет значение **oda-table-loading**. Поэтому строки с таким шаблоном отображаются в виде надписи **loading...** с иконкой вращающего круга, как задано в одноименном компоненте.

``` javascript
ODA({
    is: "oda-table-loading",
    extends: "oda-icon, oda-table-cell-base",
    template:`
        <oda-icon :icon="icon" :size="iconSize"></oda-icon>
        <label class="label flex">loading...</label>
    `,
    props: {
        icon: 'loaders:spinning-circles'
    }
});
```

Данный способ отображения включается автоматически при развертывании узла дерева, у которого есть список дочерних узлов, так как этот процесс носит асинхронный характер. До тех пор пока весь список дочерних узлов не будет загружен в контейнер, родительский узел будет отображаться с помощью компонента, имя которого указано в свойстве **loadingTemplate**.

Кроме этого, он срабатывает при вставке дочерних узлов в режиме перетаскивания с использованием технологии **«Drag and Drop»**.
