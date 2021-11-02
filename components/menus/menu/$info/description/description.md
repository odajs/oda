Компонент **Menu** генерирует кликабельное меню из неограниченного количества пунктов.

Для использования компонента необходимо подключить JS-модуль **menu.js** и добавить в HTML-код пользовательский тэг **oda-menu**.

```javascript _run_line_edit_loadoda_[my-component.js]_h=250_
import '/components/menus/menu/menu.js';
ODA({
    is: 'my-component',
    template: `
       <oda-menu label="i'm menu" items="10"></oda-menu>
    `
});
```
