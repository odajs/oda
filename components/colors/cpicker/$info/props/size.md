Свойство **size** задает размер компонента. Значение по умолчанию — 24 пикселя.

```javascript _run_line_edit_loadoda_[my-component.js]_h=300_
import '/components/colors/cpicker/cpicker.js';
ODA({
    is: 'my-component',
    template: `
        <oda-color-cpicker color="hsla(300, 90%, 50%, 0.90)"></oda-color-cpicker>
        <oda-color-cpicker size="16" color="hsla(200, 90%, 50%, 0.90)"></oda-color-cpicker>
        <oda-color-cpicker size="50" color="hsla(100, 90%, 50%, 0.90)"></oda-color-cpicker>
    `
});
```
