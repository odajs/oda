Компонент «**icon**» предназначен для вывода изображения в виде иконки.

Этот компонент добавляется в код с помощью пользовательского тэга «**oda-icon**» следующим образом:

```javascript _loadoda_run_line_edit_console_[my-component.js]
import 'https://odajs.org/components/buttons/icon/icon.js'
 ODA({
    is: 'my-component',
    template: `
        <oda-icon icon="icons:android" fill="green"></oda-icon>
    `
});
```

Для первичного использования компонента необходимо подключить файл [«../components/button/icon/icon.js»](../components/button/icon/icon.js "Код ), в котором располагается код компонента.

```javascript
  is: 'oda-icon', template: `
    <style>
        :host {
            min-width: {{size}}px;
            min-height: {{size}}px;
        }
    </style>
    <svg :show="_icon" :style="_style" :stroke="stroke" :fill="fill" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" :view-box="\`0 0 \${_svgSize} \${_svgSize}\`">
        <defs v-if="blink">
            <g is="style" type="text/css">
                @keyframes blinker { 100% { opacity: 0; } }
                g { animation: {{blink}}ms ease blinker infinite; }
            </g>
        </defs>
        <g v-html="_icon && _icon.body"></g>
    </svg>`,
```

При изучении этого кода можно сказать, что компонент представляет собой пользовательский HTML-элемент, предназначенный для вывода изображения в формате «**svg**», у которого предусмотрены следующие свойства:

| Имя свойства      | Назначение | Значение по умолчанию |
| :----------------  | :-------------------------------------------------------------------------------------------------------------------- | :----------- |
| blink | Указывает время мерцания в миллисекундах | нет |
| default | не используется | нет |
| fill | цвет фона | нет |
| hideIcon | Определяет будет ли отображаться иконка или нет | false |
| icon | Название или URL иконки | Любая строка |
| rotation | Угол поворота иконки в градусах | нет |
| size | Размер иконки в пикселях | 128 |
| stroke | Цвет контура | нет |
| subIcon | Связанная иконка, размер которой будет в два раза меньше исходной иконки
нет |

```javascript _loadoda_run_line_edit_console_[my-component.js]
import 'https://odajs.org/components/buttons/icon/icon.js'
 ODA({
    is: 'my-component',
    template: `
        <oda-icon icon:favorite></oda-icon>
    `
});
```

Любое из этих свойств можно задать либо в атрибутах компонента, либо программным способом.

Например:

```javascript _loadoda_run_line_edit_console_h=120_[my-component.js]
import 'https://odajs.org/components/buttons/icon/icon.js'
 ODA({
    is: 'my-component',
    template: `
        <oda-tester>
            <oda-icon size="100" icon="icons:favorite" fill="red"></oda-icon>
        </oda-tester>
    `
});
```

Коллекция предопределенных иконок находятся в папке «**icons**».

В подпапке «**svg**» иконки хранятся в формате масштабируемой векторной графики внутри отдельных файлов с расширением **html**.

Например, в файле **icons.html** находится коллекция иконок, выполненная в виде шаблона, с набором svg-изображений. Каждое изображение имеет уникальное имя, которое можно использовать в свойстве «**icon**» компонента «**Icons**»

```html
<template name="icons" size="24" icon="perm-media">
    <!-- ---- -->
    <g id="face"><path d="M9 11.75c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zm6 0c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-1.05 4.23-2.98 5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09 2.25-.26.21.71.33 1.47.33 2.26 0 4.41-3.59 8-8 8z"></path></g>
    <g id="favorite"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></g>
    <!-- ---- -->
</template>
```

По умолчанию путь к этим файлам указывать не нужно. Сам файл из коллекции и путь к нему подключается автоматически. Достаточно в свойстве «**icon**» указать лишь имя файла из папки «**icons/svg**» и идентификатор svg-изображения внутри него через двоеточие.

```javascript _loadoda_run_line_edit_console_h=120_[my-component.js]
import 'https://odajs.org/components/buttons/icon/icon.js'
 ODA({
    is: 'my-component',
    template: `
        <oda-icon size="100" icon="icons:face" fill="orange"></oda-icon>
    `
});
```
