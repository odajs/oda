Свойство **«iconSize»** задает размер иконки в пикселях.
По умолчанию ее размер равен 24 пикселям.

```javascript _run_line_edit_loadoda_[my-component.js]_h=175_
import '/components/layouts/title/title.js';
ODA({
    is: 'my-component',
    template: `
        <oda-title icon="odant:class" title="Стоковая иконка"></oda-title>
        <oda-title icon="https://news.nashbryansk.ru/v2/uploads/news/images/2019/May/3d279791-7042-4933-94cb-fde7250dff0f.jpg" title="Grumpy Cat" icon-size="50"></oda-title>
        <oda-title icon="https://webstockreview.net/images/face-clipart-leopard-18.gif" title="Ninja Turtle" icon-size="75"></oda-title>
    `
});
```
