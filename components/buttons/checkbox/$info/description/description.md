Компонент **«CheckBox»** предназначен для вывода независимой кнопки-переключателя, которая называется флажком.

Для его использования необходимо подключить JavaScript-модуль «**checkbox.js**» и добавить в HTML-код пользовательский тэг **oda-checkbox**.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/checkbox/checkbox.js';
ODA({
    is: 'my-component',
    template: `
        <oda-checkbox ::value></oda-checkbox>
        <span>{{'Флажок ' + label}}</span>
    `,
    props: {
        value: {
            default: false,
            set(n) {
                this.label = n ? 'выбран' : 'не выбран';
            }
        },
        label: 'не выбран'
    }
});
```

При щелчке кнопкой мыши по данному компоненту будет автоматически изменятся его состояние, узнать о котором можно с помощью свойства **state** или **value**.

Кроме этого, изменение состояния флажка можно отловить в слушателях событий **value-changed** или **state-changed**, если не использовать механизм двойного биндинга.
