Свойство **icon** предназначено для указания полного имени иконки, размещаемой на поверхности кнопки.

В этом свойстве можно использовать иконки, входящие как в состав фреймворка, так и иконки, расположенные на внешних ресурсах.

Если иконка расположена на внешнем ресурсе, то необходимо указать ее полный URL-адрес.

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/button/button.js';
ODA({
    is: 'my-component',
    template: `
        <oda-button icon="https://odajs.org/icons/png/admin.png" label="Моя кнопка"></oda-button>
    `
});
```

Если файл с изображением иконки располагается на локальном ресурсе, то вместо абсолютного пути можно использовать относительный путь.

Например,

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/button/button.js';
ODA({
    is: 'my-component',
    template: `
        <oda-button icon="/icons/png/admin.png" label="Моя кнопка"></oda-button>
    `
});
```

В качестве иконки можно использоваться изображение в любом формате. Фреймворк поддерживает все наиболее распространенные графически форматы, включая GIF-анимацию.

```javascript _run_line_edit_loadoda_[my-component.js]_h=60_
import '/components/buttons/button/button.js';
ODA({
    is: 'my-component',
    template: `
        <oda-button icon="https://webstockreview.net/images/face-clipart-leopard-18.gif" icon-size="50" label="Леонардо"></oda-button>
    `
});
```

При использовании иконки в формате PNG их расширение можно не указывать. В этом случае оно будет подставлено к имени иконки автоматически через точку.

Например,

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/button/button.js';
ODA({
    is: 'my-component',
    template: `
        <oda-button icon="globe.png" label="Моя кнопка"></oda-button>
        <oda-button icon="globe" label="Моя кнопка"></oda-button>
    `
});
```

Для доступа к иконкам из коллекции в формате SVG необходимо перед их именем указать категорию, к которой они относятся, через символ двоеточия. Эта категория определяет имя файла с расширением **html**, в котором данная коллекция находится в папке /icons/svg.

Например,

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/button/button.js';
ODA({
    is: 'my-component',
    template: `
        <oda-button icon="icons:favorite" label="Моя кнопка"></oda-button>
        <oda-button icon="device:usb" label="Моя кнопка"></oda-button>
        <oda-button icon="odant:class" label="Моя кнопка"></oda-button>
    `
});
```

В свойстве **icon** можно указать угол поворота картинки. Для этого необходимо после имени иконки указать величину угла в градусах через двоеточие.

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/button/button.js';
ODA({
    is: 'my-component',
    template: `
        <oda-button icon="icons:android:90" label="Моя кнопка"></oda-button>
        <oda-button icon="icons:android:180" label="Моя кнопка"></oda-button>
        <oda-button icon="icons:android:270" label="Моя кнопка"></oda-button>
        <oda-button icon="icons:android:360" label="Моя кнопка"></oda-button>
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
        <oda-button :icon="'icons:android:'+angle" label="Моя кнопка"></oda-button>
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
import '/components/buttons/button/button.js';
ODA({
    is: 'my-component',
    template: `
        <label>Угол поворота: <input type="number" step="45" ::value="rotate"></label> <br>
        <oda-button :rotate icon="icons:android:90" label="Моя кнопка"></oda-button>
        <oda-button :rotate icon="icons:android:180" label="Моя кнопка"></oda-button>
    `,
    props: {
        rotate: 0
    }
});
```
