Свойство **numerable** определяет каким будет список: маркированный или нумерованный.

Это свойство имеет логический тип. Если его значение равно **true**, то список будет нумерованным, в противном случае — маркированным.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=140_
import '/components/grids/list/list.js';
ODA({
    is: 'my-component',
    template: `
        <label>{{text}} <input type="checkbox" @change="onChange"></label>
        <oda-list :items ::numerable marker></oda-list>
    `,
    props: {
        items: ["Элемент 1", "Элемент 2", "Элемент 3", "Элемент 4", "Элемент 5"],
        numerable: false,
        text: 'Маркированный список: '
    },
    onChange() {
        this.numerable = !this.numerable;
        this.text = (this.numerable ? 'Нумерованный': 'Маркированный') + ' список: ';
    }
});
```

По умолчанию свойство **numerable** равно значению **false**. Поэтому, если его не изменить, то список будет маркированным, как это было изначально в этом примере.
