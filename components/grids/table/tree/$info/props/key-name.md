Свойство **«keyName»** задает имя свойства, которое будет использоваться в качестве надписи узлов дерева при отображении объектов из массива **dataSet**.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=140_
import '/components/grids/tree/tree.js';
ODA({
    is: 'my-component',
    template: `
        <span>Надпись</span>
        <select ::value="keyName">
            <option selected value="col1">col1</option>
            <option value="name">name</option>
            <option value="col3">col3</option>
        </select>
        <oda-tree :data-set :key-name></oda-tree>
    `,
    props: {
        dataSet: [
            {col1: "1 строка", name: "Cтрока 1"},
            {col1: "2 строка", name: "Cтрока 2",
                items:[
                    {col1:"2.1 строка", name: "Cтрока 2.1"},
                    {col1:"2.2 строка", name: "Cтрока 2.2",
                    items:[
                        {col1:"2.2.1 строка", name: "Cтрока 2.2.1"},
                        {col1:"2.2.2 строка", name: "Cтрока 2.2.2"},
                        {col1:"2.2.3 строка", name: "Cтрока 2.2.3"},
                    ]},
                    {col1:"2.3 строка", name: "Cтрока 2.3"}
                ]
            },
            {col1: "3 строка", name: "Cтрока 3",},
        ],
        keyName: "name",
    }
});
```

По умолчанию это свойство имеет значение **name**. Если для надписи узлов дерева необходимо использовать другое свойство объекта, то его имя необходимо указывать в **keyName** явно. В противном случае узлы дерева будут отображаться без надписей.
