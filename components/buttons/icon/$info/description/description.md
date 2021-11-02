Компонент **«Icon»** предназначен для вывода различных изображения в виде иконки.

Для его использования необходимо подключить модуль «**icon.js**» и добавить в HTML-код пользовательский тэг «**oda-icon**».

Например,

```javascript _run_line_edit_loadoda_[my-component.js]_h=50_
import '/components/buttons/icon/icon.js';
ODA({
    is: 'my-component',
    template: `
        <oda-icon icon="icons:favorite" icon-size="50" fill="red" stroke="orange" blink="1000" ></oda-icon>
    `
});
```

В качестве изображения иконки можно использовать картинку практически любого типа. Фреймворк поддерживает все наиболее распространенные графически форматы.
