Свойство **iconPos** задает расположение иконки относительно текста на поверхности кнопки.

Это свойство может принимать одно из четырех возможных значений:

1. «**left**» — иконка располагается слева от надписи (используется по умолчанию).
1. «**right**» — иконка располагается справа от надписи.
1. «**top**» — иконка располагается сверху от надписи.
1. «**bottom**» — иконка располагается снизу от надписи.

Например,

```javascript _run_line_edit_loadoda_[my-component.js]_h=160_
import '/components/buttons/button/button.js';
ODA({
    is: 'my-component',
    template: `
        <oda-button label="Положение по умолчанию" icon="icons:favorite"></oda-button>
        <oda-button icon-pos="left" label="Иконка слева" icon="icons:favorite"></oda-button>
        <oda-button icon-pos="right" label="Иконка справа" icon="icons:favorite"></oda-button>
        <oda-button icon-pos="top" label="Иконка сверху" icon="icons:favorite"></oda-button>
        <oda-button icon-pos="bottom" label="Иконка снизу" icon="icons:favorite"></oda-button>
    `
});
```
