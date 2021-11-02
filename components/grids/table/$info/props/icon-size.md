Свойство **iconSize** предназначено для указания размера иконки, отображаемой у надписи в ячейках таблицы.

Это свойство фактически определяет высоту всех строк таблицы, так как между ними существует прямая функциональная зависимость.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=200_
import '/components/grids/tree/tree.js';
ODA({
    is: 'my-component',
    template: `
       <label> Размер иконки: <input type="number" min="0" max="100" ::value="iconSize">px</label>
        <oda-table :data-set :columns :icon-size show-header show-footer col-lines auto-width></oda-table>
    `,
    props: {
        columns: [
            {name: 'col1', label: 'Столбец 1'},
            {name: 'col2', label: 'Столбец 2', treeMode: true}
        ],
        dataSet: [
            {col1: "1 строка", col2:"1 узел", template: 'my-template'},
            {col1: "2 строка", col2:"2 узел", icon: 'icons:face', template: 'my-template',
                items:[
                    {col2: "2.1 узел", icon: 'icons:favorite'},
                    {col2: "2.2 узел",
                    items:[
                        {col2:"2.2.1 узел", icon: 'icons:android', template: 'my-template'},
                        {col2:"2.2.2 узел"},
                        {col2:"2.2.3 узел"},
                    ]},
                    {col2:"2.3 узел"}
                ]
            },
        ],
        iconSize: 32
    }
});

ODA({
    is: 'my-template',
    template:`
        <style>
            :host{
                @apply --horizontal;
                align-items: center;
            }
        </style>
        <oda-icon :icon="item.icon ? item.icon : 'icons:star'"></oda-icon>
        <span>{{item[column.name]}}</span>`,
    props: {
        column:{},
        item:{}
    }
});
```

Как видно из примера, изменение свойства **iconSize** автоматически приводит к изменению высоты всех строк таблицы, включая строку заголовка и нижний колонтитул.

Для отображения у ячеек таблицы иконок необходимо задать пользовательский компонент, в котором требуется предусмотреть такую возможность. Для строк, ячейки которых должны отображаться с помощью этого компонента, необходимо указать свойство **template** с именем этого компонента. В данном примере это компонент **my-template**. Только в этом случае у узла дерева будет отображаться иконка, ссылка на которую предусмотрена в свойстве **icon**. Если у узла такого свойства не будет, но будет использоваться пользовательский шаблон, то у него отобразиться иконка по умолчанию. В данном примере это иконка с именем **icons:star**, предусмотренная в компоненте **my-template**.

Если для отображения ячеек таблицы использовать компонент по умолчанию **oda-table-cell**, то иконки в нем отображаться не будут, даже если они были заданы в описании строк в наборе данных **dataSet**, так как такая возможность в нем не предусмотрена.
