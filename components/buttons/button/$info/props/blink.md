Свойство **blink** задает период эффекта мерцания изображения на кнопке в миллисекундах.

Например,

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/button/button.js';
ODA({
    is: 'my-component',
    template: `
        <label>Период мерцания: <input type="number" ::value="blink" step="100"> </label> <br>
        <oda-button :blink icon="icons:android" label="Кнопка"></oda-button>
        <oda-button blink="1000" icon="icons:favorite" label="Кнопка"></oda-button >
        <oda-button blink="3000" icon="admin.png" label="Кнопка"></oda-button  >
    `,
    props: {
        blink: 0,
    }
});
```

По умолчанию период мерцания равен нулю, что соответствует отсутствию мерцания. Отрицательные значения этого свойства также не приводят к появлению эффекта мерцания.

``` info_md
Свойство **blink** используется только для изображений в формате SVG.
```

По этой причине другие типы иконок мерцать не будут, как изображение в формате **png** в данном примере.
