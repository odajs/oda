Свойство **icon** предназначено для указания полного имени иконки.

В этом свойстве можно использовать иконки, входящие как в состав фреймворка, так и иконки, расположенные на внешних ресурсах.

Если иконка расположена на внешнем ресурсе, то необходимо указать ее полный URL-адрес.

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/icon/icon.js';
ODA({
    is: 'my-component',
    template: `
        <oda-icon icon="https://odajs.org/icons/png/admin.png"></oda-icon>
    `
});
```

Если файл с изображением иконки располагается на локальном ресурсе, то вместо абсолютного пути можно использовать относительный путь.

Например,

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/icon/icon.js';
ODA({
    is: 'my-component',
    template: `
        <oda-icon icon="/icons/png/admin.png"></oda-icon>
    `
});
```

В качестве иконки можно использоваться изображение в любом формате. Фреймворк поддерживает все наиболее распространенные графически форматы, включая GIF-анимацию.

```javascript _run_line_edit_loadoda_[my-component.js]_h=55_
import '/components/buttons/icon/icon.js';
ODA({
    is: 'my-component',
    template: `
        <oda-icon icon="https://webstockreview.net/images/face-clipart-leopard-18.gif" icon-size="50"></oda-icon>
    `
});
```

Следует отметить, что в настоящее время загрузка изображений в формате SVG с внешних ресурсов не поддерживается.

```javascript error_run_line_edit_loadoda_[my-component.js]
import '/components/buttons/icon/icon.js';
ODA({
    is: 'my-component',
    template: `
        <oda-icon icon="https://ru.wikipedia.org/wiki/SVG#/media/file:SVG_logo.svg" icon-size="50"></oda-icon>
    `
});
```

Фреймворк содержит две предопределенных коллекции иконок в форматах PNG и SVG. Эти коллекции располагаются в папках **/icons/png/** и **/icons/svg/** соответственно. Если изображения берутся из этих папок, то указывать относительный путь к ним нет необходимости.

Например,

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/icon/icon.js';
ODA({
    is: 'my-component',
    template: `
        <oda-icon icon="admin.png"></oda-icon>
        <oda-icon icon="icons:favorite"></oda-icon>
    `
});
```

При отображении иконок в формате PNG их расширение **png** можно не указывать. В этом случае оно будет подставлено к имени иконки автоматически.

Например,

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/icon/icon.js';
ODA({
    is: 'my-component',
    template: `
        <oda-icon icon="globe.png"></oda-icon>
        <oda-icon icon="globe"></oda-icon>
    `
});
```

Для доступа к иконкам из коллекции в формате SVG необходимо перед их именем указать их категорию через символ двоеточия. Это имя определяет имя файла с расширением **html**, в котором эта коллекция хранится в папке /icons/svg.

Например,

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/icon/icon.js';
ODA({
    is: 'my-component',
    template: `
        <oda-icon icon="icons:favorite"></oda-icon>
        <oda-icon icon="device:usb"></oda-icon>
        <oda-icon icon="odant:class"></oda-icon>
    `
});
```

В свойстве **icon** можно указать угол поворота картинки. Для этого необходимо после имени иконки указать величину угла поворота в градусах через двоеточие.

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/icon/icon.js';
ODA({
    is: 'my-component',
    template: `
        <oda-icon icon="icons:android:90"></oda-icon>
        <oda-icon icon="icons:android:180"></oda-icon>
        <oda-icon icon="icons:android:270"></oda-icon>
        <oda-icon icon="icons:android:360"></oda-icon>
    `
});
```

Поворот изображения происходит по часовой стрелке. Величина угла должна быть положительным целым числом. Отрицательные и дробные числа игнорируются. Угол поворота определяется как остаток от деления заданной величины на 360.

Например,

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/icon/icon.js';
ODA({
    is: 'my-component',
    template: `
        <label>Угол поворота: <input type="number" step="45" ::value="angle"></label><br>
        <oda-icon :icon="'icons:android:'+angle"></oda-icon>
    `,
    props: {
        angle: 0
    }
});
```

``` info_md
Кроме свойства **icon** угол поворота картинки может быть указан в свойстве **rotate**.
```

 В этом случае общий угол поворота будет определяется суммой углов поворота указанного в имени иконки и в свойстве **rotate**.

Например,

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/icon/icon.js';
ODA({
    is: 'my-component',
    template: `
        <label>Угол поворота: <input type="number" step="45" ::value="rotate"></label> <br>
        <oda-icon :rotate icon="icons:android:90"></oda-icon>
        <oda-icon :rotate icon="icons:android:180"></oda-icon>
    `,
    props: {
        rotate: 0
    }
});
```
