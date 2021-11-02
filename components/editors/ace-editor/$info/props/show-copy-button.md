Свойство **hues** является массивом, который содержит значения тонов в градусах в цветовой модели [**HSL**](https://www.w3.org/wiki/CSS3/Color/HSL).

Размер массива равен количеству хроматических тонов, используемых в палитре, и определяется по формуле: **значение свойства colors - 1**.

Массив доступен только по чтению и пересчитывается при каждом изменени свойства **colors**.


```javascript _run_line_edit_loadoda_[my-component.js]_h=260_
import '/components/colors/dropdown/dropdown.js';
ODA({
    is: 'my-component',
    extends: "oda-palette-dropdown",
    template: `
        <div ~for="item, index in hues" style="text-indent:25px;">hues[{{index}}]: {{item}}</div>
    `,
    props: {
        colors: 5
    }
});
```
