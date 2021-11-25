Свойство **_hues** содержит массив тонов, отображаемых в палитры цветов, в градусах цветовой модели [**HSL**](https://www.w3.org/wiki/CSS3/Color/HSL).

Размер этого массив определяется количеством заданных тонов в свойстве **colors**.

Например,

```javascript _run_line_edit_loadoda_[my-component.js]_h=260_
import '/components/colors/palette/palette.js';
ODA({

    is: 'my-component',
    extends: "oda-palette",
    template: `
        <style>
            :host {
                @apply --vertical;
            }
        </style>
        <label>Количество тонов: <input type="number" ::value="colors"></label>
        <div ~for="_hues" style="text-indent:10px;">_hues[{{index}}]: {{item}}&deg;</div>
    `,
    props: {
        colors: 5,
        gradients: 3,
    }
});
```

Данный массив доступен в режиме только для чтения. Текущий выбранный цвет или градиент пользователем сохраняется в свойстве **value**. Поэтому явно использовать данный массив не следует, о чем свидетельствует знак подчеркивания в его имени.
