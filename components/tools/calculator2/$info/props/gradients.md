Свойство **gradients** задает количество градации каждого тона по характеристике светлости.

Градация каждого тона отображается в столбцах палитры.

Например,

```javascript _run_line_edit_loadoda_[my-component.js]_h=260_
import '/components/colors/palette/palette.js';
ODA({
    is: 'my-component',
    template: `
        <label>Количество градаций тона: <input type="number" ::value="gradients" ></label>
        <oda-palette :gradients></oda-palette>
    `,
    props: {
        gradients: 10,
    }
});
```

По умолчанию свойство **gradients** имеет значение 10, т.е. то в каждом столбце изначально будет отображаться 10 градаций одного и того же тона.

При значении этого свойства меньше единицы цвета в палитре выводится перестанут.
