Свойство **blink** задает период мерцания иконки в миллисекундах.

Например,

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/icon/icon.js';
ODA({
    is: 'my-component',
    template: `
        <label>Период мерцания: <input type="number" ::value="blink" step="100"> </label> <br>
        <oda-icon :blink icon="icons:android"></oda-icon>
        <oda-icon blink="1000" icon="icons:favorite"></oda-icon>
        <oda-icon blink="3000" icon="admin.png"></oda-icon>
    `,
    props: {
        blink: 0,
    }
});
```

По умолчанию период мерцания равен нулю, что соответствует отсутствию мерцания.

``` info_md
Свойство **blink** используется только для изображений в формате SVG.
```

По этой причине другие типы иконок мерцать не будут, как изображение в формате **png** в данном примере.
