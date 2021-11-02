Свойство **icon** предназначено для хранения пути к иконке, размещаемой на поверхности компонента слева от **title**.

Можно использовать как иконки, входящие в состав фреймворка, так и иконки, расположенные на внешних ресурсах.

Если иконка расположена на внешнем ресурсе, то необходимо указать ее полный URL-адрес. В качестве иконки может использоваться любая картинка. Фреймворк поддерживает все наиболее распространенные графически форматы, включая GIF-анимации.

```javascript _run_line_edit_loadoda_[my-component.js]_h=100_
import '/components/layouts/title/title.js';
ODA({
    is: 'my-component',
    template: `
        <oda-title icon="odant:class" title="Стоковая иконка"></oda-title>
        <oda-title icon="https://news.nashbryansk.ru/v2/uploads/news/images/2019/May/3d279791-7042-4933-94cb-fde7250dff0f.jpg" title="Grumpy Cat"></oda-title>
        <oda-title icon="https://webstockreview.net/images/face-clipart-leopard-18.gif" title="Ninja Turtle"></oda-title>
    `
});
```

``` warning_md
В текущей версии фреймворка не поддерживается загрузка иконок в формате SVG с внешнего ресурса.
```

Фреймворк содержит коллекцию иконок в двух форматах PNG и SVG. Иконки хранятся соответственно в папках **/icons/png/** и **/icons/svg/**.

Для доступа к иконкам в формате SVG необходимо указать наименование категории иконок и через двоеточие указать имя конкретной иконки.

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/layouts/title/title.js';
ODA({
    is: 'my-component',
    template: `
        <oda-title icon="device:usb" title="Мой заголовок"></oda-title>
    `
});
```

Для доступа к иконкам в формате PNG необходимо указать имя конкретной иконки. Если иконка имеет расширение **png**, то его можно опустить.

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/layouts/title/title.js';
ODA({
    is: 'my-component',
    template: `
        <oda-title icon="admin.png" title="Мой заголовок - 1"></oda-title>
        <oda-title icon="admin" title="Мой заголовок - 2"></oda-title>
    `
});
```

Если вы хотите использовать иконку из ресурсов вашего проекта, то необходимо указать к ней абсолютный или относительный путь.

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/layouts/title/title.js';
ODA({
    is: 'my-component',
    template: `
        <oda-title icon="https://odajs.org/components/colors/palette/icon.png" title="Мой заголовок - 1"></oda-title>
        <oda-title icon="/components/colors/palette/icon.png" title="Мой заголовок - 2"></oda-title>
    `
});
```

В свойстве **icon** можно указать угол поворота иконки на поверхности компонента. Для этого необходимо после пути к иконке через двоеточие указать величину угла поворота в градусах. Поворот происходит по часовой стрелке. Величина угла должна быть положительным целым числом. Отрицательные и дробные числа игнорируются. Угол поворота определяется как остаток от деления заданной величины на 360.

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/layouts/title/title.js';
ODA({
    is: 'my-component',
    template: `
        <oda-title icon="https://odajs.org/icons/png/admin.png:90" title="Мой заголовок - 1"></oda-title>
        <oda-title icon="admin:270" title="Мой заголовок - 2"></oda-title>
        <oda-title icon="device:usb:495" title="Мой заголовок - 3"></oda-title>
    `
});
```
