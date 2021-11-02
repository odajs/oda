Свойство **size** задает высоту тумблера в пикселях без учета внешних отступов.

Например,

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/toggle/toggle.js';
ODA({
    is: 'my-component',
    template: `
        <label>Высота тумблера: <input type="number" ::size></label>
        <oda-toggle :size></oda-toggle>
    `,
    props: {
        size: 24,
    }
});
```

Изначально свойство **size** задано равным 24, т.е. по умолчанию размер тумблера будут 30 пикселей: 24 пикселя отводится на высоту внутреннего элемента **input**, который используется для графического представления тумблера, и по 3 пикселя задаются внешние отступы сверху и снизу от него.
