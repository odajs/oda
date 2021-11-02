Свойство **showFooter** позволяет отобразить нижний колонтитул («подвал») в виде итоговой строки с дополнительной информацией об узлах дерева.

Если это свойство уставлено в значение **true**, то нижний колонтитул будет отображен. На нем будет выводиться информация об общем количестве узлов, расположенных в видимой области контейнера, с уточнением номера первого и последнего узла в квадратных скобках.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=220_
import '/components/grids/tree/tree.js';
ODA({
    is: 'my-component',
    template: `
        <label>Показывать подвал <input type="checkbox" ::value="showFooter" ></label>
        <div>Количество строк в видимой области: {{$refs.tree.screen.length}}</div>
        <div>Номер первой строки в видимой области: {{$refs.tree.screen.from}}</div>
        <div>Номер последней строки в видимой области: {{$refs.tree.screen.from + $refs.tree.screen.length-1}}</div>
        <div>Последней строка в видимой области: {{$refs.tree.rows[$refs.tree.screen.from + $refs.tree.screen.length-1]}}</div>
        <oda-tree ref="tree" :data-set style="max-height: 120px" :show-footer></oda-tree>
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

По умолчанию свойство **showFooter** установлено в значение **false**. Поэтому нижний колонтитул изначально не будет отображен.
