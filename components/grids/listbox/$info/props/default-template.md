Свойство **defaultTemplate** задает имя компонента, с помощью которого отображаются все элементы списка по умолчанию.

Изначально это свойство имеет значение **oda-list-box-item**, т.е. все элементы списка отображаются с помощью этого компонента.

Однако можно создать свой собственный компонент и использовать его для отображения элементов списка, указав его имя в свойстве **defaultTemplate** вместо имени компонента **oda-list-box-item**.

Например:

```javascript _run_line_edit_loadoda_[my-item.js]
ODA({
    is: 'my-item',
    template: `
        <span class="label" ~text="label"></span>`,
    props: {
        item: {
            type: [Object, String],
            set(n, o) {
                if (o) {
                    this.label = '';
                }
                if (n) {
                    this.label = n.label || n;

                }
            }
        },
        label: '',
        focused: {
            type: Boolean,
            reflectToAttribute: true
        },
        selected: {
            type: Boolean,
            reflectToAttribute: true
        },
    },
});
```

В простейшем случае у пользовательского компонента должно быть одно свойство **item**, в которое компонент **oda-list-box** передает объект, необходимый для отображения.

```javascript _run_line_edit_loadoda_[my-component.js]_{my-item.js}_h=160_
import '/components/grids/listbox/listbox.js';
ODA({
    is: 'my-component',
    template: `
        <label> Размер иконки: <input type="number" min="0" max="100" ::value="iconSize">px</label>
        <oda-list-box :items defaultTemplate="my-item" :icon-size></oda-list-box>
    `,
    props: {
        items: [
            {label: 'Элемент 1', icon: 'icons:favorite'},
            {label: 'Элемент 2', icon: 'icons:face'},
            {label: 'Элемент 3', icon: 'icons:star'},
        ],
        iconSize: 24
    }
});
```
