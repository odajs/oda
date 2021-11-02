Свойство **multiple** определяет, можно ли из списка одновременно выбрать несколько элементов или нельзя.

Если это свойство уставлено в значение **true**, то множественный выбор разрешен, в противном случае из списка  можно будет выбрать только один элемент.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=160_
import '/components/grids/listbox/listbox.js';
ODA({
    is: 'my-component',
    template: `
        <label>{{text}} <input type="checkbox" ::checked="multiple"></label>
        <oda-list-box :items :multiple></oda-list-box>
    `,
    props: {
        items: [
            {label: "Элемент 1", icon: 'icons:favorite'},
            {label: "Элемент 2", icon: 'icons:face'},
            {label: "Элемент 3", icon: 'icons:star'}
        ],
        text: 'Множественные выбор',
        multiple: {
            default: true,
            set(n) {
                this.text = (n ? 'Множественные': 'Единичный') + ' выбор';
            }
        }
    },
});
```

Для выбора последующих элементов необходимо придерживать клавиши: Shift, Ctrl или Shift + Ctrl.

Изначально свойство **multiple** установлено в значение **true**. Поэтому из списка  можно выбрать по умолчанию несколько элементов.
