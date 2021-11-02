Свойство **comboMode** определяет отображение дополнительных кнопок множественного выбора **CheckBox** с левой стороны от элементов списка.

Если это свойство уставлено в значение **true**, то кнопки множественного выбора отображаются, в противном случае — нет.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=140_
import '/components/grids/listbox/listbox.js';
ODA({
    is: 'my-component',
    template: `
        <label>{{text}} <input type="checkbox" ::checked="comboMode"></label>
        <oda-list-box :items :combo-mode></oda-list-box>
    `,
    props: {
        items: [
            {label: "Элемент 1", icon: 'icons:favorite'},
            {label: "Элемент 2", icon: 'icons:face'},
            {label: "Элемент 3", icon: 'icons:star'}
        ],
        text: 'Показать кнопки выбора',
        comboMode: {
            defaults: false,
            set(n) {
                this.text = (n ? 'Показать': 'Скрыть') + ' кнопки выбора';
            }
        }
    }
});
```

Изначально свойство **comboMode** установлено в значение **false**. Поэтому дополнительные кнопки множественного выбора по умолчанию не отображаются.
