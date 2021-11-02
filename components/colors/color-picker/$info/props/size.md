Свойство **size** задает размер иконки в пикселях. Значение по умолчанию — 24 пикселя.

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/button/button.js';
ODA({
    is: 'my-component',
    template: `
        <oda-button size="16" icon="icons:android"></oda-button>
        <oda-button           icon="icons:android"></oda-button>
        <oda-button size="320e-1" icon="icons:android"></oda-button>
    `
});
```
