Свойство **hideIcons** позволяет определить отсутствие иконок у всех элементов списка.

При обращении к этому свойству оно вернет значение **true**, если ни у одного элемента списка не будет существовать свойства с именем **icon**. В противном случае свойство **hideIcons** вернет значение **false**.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=160_
import '/components/grids/listbox/listbox.js';
ODA({
    is: 'my-component',
    template: `
        <button @tap="onTap">{{text}}</button><br>
        <label>Отсутствие иконок: <input type="checkbox" ::checked="$refs.listbox.hideIcons"></label>
        <oda-list-box ref="listbox" :items :order-by></oda-list-box>
    `,
    props: {
        items: [
            {label: 'Элемент 1', icon: 'icons:star'},
            {label: 'Элемент 2'},
            {label: 'Элемент 3'},
        ],
        text: 'Удалить иконку',
        hideIcons: false
    },
    onTap() {
        this.hideIcons = !this.hideIcons;
        this.text = (this.hideIcons ? 'Добавить' : 'Удалить') + ' иконку';
        this.hideIcons ? delete this.items[0].icon : this.items[0].icon = 'icons:star';
    }
});
```

В данном примере при нажатии на кнопку **button** удаляется или добавляется свойство **icon** у первого объекта в массиве **items**. При обращении к свойству **hideIcons** проверяется отсутствие иконок, и если их нет у всех элементов списка, то возвращает значение **true**. В противном случае — значение **false**.

``` info_md
Изменение свойства **hideIcons** в ручном режиме не приводит ни к каким результатам, так как его значение пересчитывается автоматически при каждом обращении к нему.
```
