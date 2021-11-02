Свойство **footerHeight** позволяет определить высоту нижнего колонтитула дерева.

Это свойство имеет режим доступа только для чтения. Его нельзя изменять.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=220_
import '/components/grids/tree/tree.js';
ODA({
    is: 'my-component',
    template: `
        <label>Показать подвал: <input type="checkbox" ::value="showFooter" ></label>
        <label>Высота колонтитула: {{$refs.tree.footerHeight}}</label>
        <oda-tree ref="tree" :data-set :show-footer></oda-tree>
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

По умолчанию свойство **showFooter** установлено в значение **false**. Поэтому нижний колонтитул изначально не отображается. В этом случае его высота принимается равной нулю.
