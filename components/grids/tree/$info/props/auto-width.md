Свойство **autoWidth** позволяет автоматически привязать ширину столбца к ширине всего контейнера, в котором отображаются узлы дерева.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=160_
import '/components/grids/tree/tree.js';
ODA({
    is: 'my-component',
    template: `
        <label>Привязка по ширине <input type="checkbox" ::value="autoWidth" checked></label> <br>
        <label>Ширина контейнера <input style="width: 25vw;" type="range" max="150" ::value="boxWidth">{{boxWidth}}</label>
        <oda-tree :data-set :auto-width :style="{width: \`\${boxWidth}px\`}"></oda-tree>
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
        autoWidth: true,
        boxWidth: 100,
    }
});
```

По умолчанию свойство **autoWidth** установлено в значение **true**. Если при этом надписи узлов не будут умещаться в контейнере, то они будут автоматически обрезаны с добавлением многоточия в конце их текста.

В противном случае, когда свойство **autoWidth** установлено в значение **false**, внизу контейнера появится горизонтальная полоса прокрутки, которая позволит просмотреть содержимое всего дерева, при условии, что оно полностью не помещается в видимую область компонента.
