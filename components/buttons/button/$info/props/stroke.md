Свойство **stroke** задает цвет контура у иконок кнопки в формате SVG.

Например,

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/button/button.js';
ODA({
    is: 'my-component',
    template: `
        <label>Выберите цвет: <input type="color" ::value="fill"> </label>
        <oda-button icon="icons:android" label="Моя кнопка"></oda-button>
        <oda-button :stroke="fill" icon="icons:android" label="Моя кнопка"></oda-button>
        <oda-button :stroke="fill" icon="https://odajs.org/icons/png/admin.png" label="Моя кнопка"></oda-button>
    `,
    props: {
        fill: '#00ff00'
    }
});
```

По умолчанию цвет контура у иконки совпадает с цветом фона, поэтому изначально контур у иконки в формате SVG будет зрительно отсутствовать.

``` info_md
У иконок других форматов цвет контура не изменяется.
```
