Свойство **showCount** позволяет отобразить специальную панель в конце списка, на которой выводится текущее количество элементов.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=180_
import '/components/grids/listbox/listbox.js';
ODA({
    is: 'my-component',
    template: `
        <label>{{text}} <input type="checkbox" ::checked="showCount" ></label>
        <oda-list-box :items :show-count></oda-list-box>
    `,
    props: {
        items: [
            {label: "Элемент 1", icon: 'icons:favorite'},
            {label: "Элемент 2", icon: 'icons:face'},
            {label: "Элемент 3", icon: 'icons:star'}
        ],
        text: 'Показать панель',
        showCount: {
            default: false,
            set(n) {
                this.text = (n ? 'Скрыть': 'Показать') + ' панель';
            }
        }
    }
});
```

Изначально свойство **showCount** установлено в значение **false**. Поэтому по умолчанию эта панель не отображается.
