Свойство **size** задает размер ячейки палитры цветов в пикселях.

Например,

```javascript _run_line_edit_loadoda_[my-component.js]_h=200_
import '/components/colors/palette/palette.js';
ODA({
    is: 'my-component',
    template: `
        <label>Размер ячейки <input type="number" ::value="size"><label>
        <oda-palette :size></oda-palette>
    `,
    props: {
        size: 20
    }
});
```

Размер ячейки палитры по умолчанию равен двадцати пикселям.
