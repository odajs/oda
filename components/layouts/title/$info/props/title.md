Свойство **title** задает текст заголовка, который будет выводиться на поверхности компонента.

```javascript _run_line_edit_loadoda_[my-component.js]_h=75_
import '/components/layouts/title/title.js';
ODA({
    is: 'my-component',
    template: `
        <oda-title icon="odant:class" title="Заголовок 1"></oda-title>
        <oda-title icon="odant:class" title="Заголовок 2"></oda-title>
    `
});
```
