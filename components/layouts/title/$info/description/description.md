Компонент **«Title»** предназначен для создания плашки с заголовком/наименованием.

Для его использования необходимо подключить JS-модуль «**title.js**» и добавить в HTML-код пользовательский тэг «**oda-title**».

Например:

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/layouts/title/title.js';
ODA({
    is: 'my-component',
    template: `
        <oda-title label="Мой заголовок" title="Мой заголовок"></oda-title>
    `
});
```
