Свойство **fill** задает цвет заливки изображения иконки у кнопки.

Например,

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/button/button.js';
ODA({
    is: 'my-component',
    template: `
        <label>Выберите цвет заливки: <input type="color" ::value="fill"> </label>
        <oda-button :fill icon="icons:star" label="Иконка с фоном"></oda-button>
        <oda-button fill="blue" icon="symbols:d0" label="Иконка без фона"></oda-button>
    `,
    props: {
        fill: '#ff0000'
    }
});
```

``` info_md
Свойство **fill** применяется только к иконкам в формате SVG, у которых явно не указан цвет заливки.
```

В примере у иконки последней кнопки изменить цвет заливки будет невозможно, так как он задан внутри самой иконки **symbols** статически.

```html
    <g id="d0">
        <circle cx="8" cy="8" r="8" fill="red" stroke="white"></circle>
        <text font-size="11" y="12" x="5" fill="white">0</text>
    </g>
```
