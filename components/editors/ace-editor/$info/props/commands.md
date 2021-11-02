Свойство **lightness** является массивом, который содержит значения светлоты в процентах в цветовой модели [**HSL**](https://www.w3.org/wiki/CSS3/Color/HSL).

Размер массива равен количеству градиентов светлоты, используемых в палитре, и определяется значением свойства **gradients**.

Массив доступен только по чтению и пересчитывается при каждом изменени свойства **gradients**.

```javascript _run_line_edit_loadoda_[my-component.js]_h=260_
import '/components/colors/dropdown/dropdown.js';
ODA({
    is: 'my-component',
    extends: "oda-palette-dropdown",
    template: `
        <div ~for="item, index in lightness" style="text-indent:25px;">lightness[{{index}}]: {{item}}</div>
    `,
    props: {
        gradients: 4
    }
});
```
