Свойство **gradients** задает количество градаций светлости в палитре.

По умолчанию в палитре 10 градаций светлости.

```javascript _run_line_edit_loadoda_[my-component.js]_h=260_
import '/components/colors/dropdown/dropdown.js';
ODA({
    is: 'my-component',
    template: `
        <oda-palette-dropdown gradients="6"></oda-palette-dropdown>
    `
});
```