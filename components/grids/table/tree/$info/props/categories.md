Свойство **categories** содержит дополнительные настройки, которые используются в процессе группировки узлов дерева.

По свой структуре данное свойство является объектом. В нем задано свойство **allowSort**, которое разрешает или запрещает сортировку группировочных узлов по возрастанию их значений.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=220_
import '/components/grids/tree/tree.js';
ODA({
    is: 'my-component',
    template: `
        <label>Разрешить сортировку группировочных узлов <input type="checkbox" ::value="allowSort" ></label>
        <oda-tree ref="tree" :data-set :columns :categories.allow-sort="allowSort" show-header show-grouping-panel></oda-tree>
    `,
    props: {
        columns: [
            {name: 'name', label: 'Мой столбец', treeMode: true}
        ],
        dataSet: [
            {name: "2 строка"},
            {name:"1 строка",
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
            {name:"2 строка"},
        ],
        allowSort: false
    }
});
```

Если свойство **allowSort** установлено в значение **true**, то группировочные узлы будут дополнительно отсортированы по возрастанию. В противном случае они будут идти в том порядке, в котором были обнаружены в исходном наборе данных **dataSet**.

``` info_md
Сортировка группировочных узлов по убыванию пока не предусмотрена.
```

Изначально свойство **allowSort** имеет значение **false**. Поэтому по умолчанию группировочные узлы не сортируются.
