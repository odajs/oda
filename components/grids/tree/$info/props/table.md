Свойство **table** содержит ссылку на сам компонент, в котором размещается дерево.

Фактически значение этого свойства совпадает с указателем **this**.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=140_
import '/components/grids/tree/tree.js';
ODA({
    is: 'my-component',
    template: `
        <span>Table это this: {{this===this.table ? 'Да':'Нет'}}></span>
        <oda-tree ref="tree" :data-set></oda-tree>
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
        ]
    }
});
```
