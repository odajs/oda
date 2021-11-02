Свойство **rotate** задает угол поворота иконки у кнопки в градусах.

Например,

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/button/button.js';
ODA({
    is: 'my-component',
    template: `
        <label>Угол поворота: <input type="number" ::value="rotate" step="15"></label><br>
        <oda-button :rotate icon="icons:android" label="Моя кнопка"></oda-button>
    `,
    props: {
        rotate: 0
    }

});
```

В общем случае угол поворота задается вещественным числом. Если это число положительное, то поворот осуществляется по часовой стрелке. Если оно отрицательное, то — против часовой стрелки. Если число по модулю больше 360, то берется остаток от деления заданной величины на 360.

``` info_md
Кроме свойства **rotate** угол поворота можно задать в свойстве **icon**, указав его после имени иконки через двоеточия. В этом случае угол поворота определяется суммой углов, указанных в обоих свойствах: **icon** и **rotate**.
```

Например,

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/button/button.js';
ODA({
    is: 'my-component',
    template: `
        <label>Угол поворота: <input type="number" ::value="rotate" step="15"></label> <br>
        <oda-button :rotate icon="icons:android:90"></oda-button>
        <oda-button :rotate icon="icons:android:180"></oda-button>
    `,
    props: {
        rotate: 0
    }
});
```
