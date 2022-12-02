Свойство **selection** предназначено для хранения списка выбранных узлов дерева.

По своей структуре это свойство является массивом. В нем сохраняются все выбранные узлы дерева при условии, что их выбор разрешен в свойстве **allowSelection**.

Если выбор узлов запрещен, то массив **selection** будет оставаться пустым.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=160_
import '/components/grids/tree/tree.js';
import '/components/grids/listbox/listbox.js';
ODA({
    is: 'my-component',
    template: `
        <label>Разрешить выбор <input type="checkbox" ::value="allowSelection" ></label> <br>
        <span>Количество выбранных узлов: {{selection.length}}</span> <br>
        <label>Выбрать все узлы <input type="checkbox" ::value="selectAll" ></label> <br>
        <span>Последний выбранный узел: {{ selection.length ? selection[selection.length - 1].name : 'Нет'}}</span>
        <oda-tree :data-set :allow-selection ::selection></oda-tree>
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
        allowSelection: false,
        selection: []
    }
});
```

Для выбора последующих узлов необходимо придерживать клавишу **Ctrl**.

Если выбрать все узлы дерева при условии, что до этого уже были выбраны некоторые из них, то ранее выбранные узлы будут исключены из выделения.

По умолчанию свойство **allowSelection** установлено в значение **false**. Поэтому выбор узлов дерева изначально запрещен, и массив **selection** при создании дерева остается пустым.
