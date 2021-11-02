При изменении выделенного элемента в списке автоматически генерируется событие **focused-item-changed**, которое можно обработать во внешнем компоненте.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=140_
import '/components/grids/list/list.js';
ODA({
    is: 'my-component',
    template: `
        <div>{{text}}</div>
        <oda-list :items @focused-item-changed="onFocused"></oda-list>
    `,
    props: {
        items: ["Элемент 1", "Элемент 2", "Элемент 3", "Элемент 4", "Элемент 5"],
        text: 'Элемент не выделен'
    },
    onFocused(e) {
        this.text = 'Выделен элемент: ' + e.detail.value;
    }
});
```

Какой элемент был выбран из списка можно узнать из свойства **detail** указателя на объект этого события под именем **value**.
