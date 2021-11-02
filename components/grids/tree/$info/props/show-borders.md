Свойство **showBorders** позволяет отобразить дополнительную рамку по периметру всего компонента.

Если это свойство уставить в значение **true**, то по периметру компонента появится дополнительная рамка толщиной в 1 пиксель, в противном случае ее не будет.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=140_
import '/components/grids/tree/tree.js';
ODA({
    is: 'my-component',
    template: `
        <label>Показать рамку <input type="checkbox" ::value="showBorders" ></label> <br>
        <oda-tree :data-set :show-borders></oda-tree>
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
        showBorders: false
    }
});
```

По умолчанию свойство **showBorders** установлено в значение **false**, т.е. дополнительная рамка изначально не отображается.
