Свойство **loadingTemplate** задает имя компонента, который будет использоваться для отображения узла дерева при развертывании достаточно большого списка его дочерних узлов.

Данное свойство работает только со столбцами таблицы, которые находятся в режиме **treeMode**, т.е. отображения данных в виде деревьев.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=140_
import '/components/grids/table/table.js';
ODA({
    is: 'my-component',
    template: `
        <oda-table :data-set :columns show-header col-lines auto-width></oda-table>
    `,
    props: {
        columns: [
            {name: 'col1', label: 'Столбец 1'},
            {name: 'col2', label: 'Столбец 2', treeMode: true}
        ],
        dataSet: [
            {col1: "1 строка", col2:"1 узел"},
            {col1: "2 строка", col2:"2 узел", template: 'oda-table-loading',
                items:[
                    {col2: "2.1 узел"},
                    {col2: "2.2 узел",
                    items:[
                        {col2:"2.2.1 узел"},
                        {col2:"2.2.2 узел"},
                        {col2:"2.2.3 узел"},
                    ]},
                    {col2:"2.3 узел"}
                ]},
        ],
    }
});
```

По умолчанию свойство **loadingTemplate** имеет значение **oda-table-loading**. Поэтому все ячейки строк с таким шаблоном отображаются в виде надписи **loading...** с иконкой вращающего круга, как задано в одноименном компоненте.

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

Данный способ отображения включается автоматически при развертывании узла дерева, у которого есть список дочерних узлов, так как этот процесс носит асинхронный характер. До тех пор, пока весь список дочерних узлов не будет загружен в контейнер, родительский узел будет отображаться с помощью компонента, имя которого указано в свойстве **loadingTemplate**.

Кроме этого, он данный механизм срабатывает при вставки дочерних узлов в режиме перетаскивания с использованием технологии **«Drag and Drop»**.
