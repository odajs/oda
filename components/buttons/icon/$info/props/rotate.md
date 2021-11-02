Свойство **rotate** задает угол поворота иконки в градусах.

Например,

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/icon/icon.js';
ODA({
    is: 'my-component',
    template: `
        <label>Угол поворота: <input type="number" ::value="rotate"></label><br>
        <oda-icon :rotate icon="icons:android"></oda-icon>
    `,
    props: {
        rotate: 0
    }

});
```

В общем случае угол поворота задается вещественным числом. Если это число положительное, то поворот осуществляется по часовой стрелке. Если оно отрицательное, то — против часовой стрелки. Если число по модулю больше 360, то берется остаток от деления заданной величины на 360.

``` info_md
Кроме свойства **rotate** угол поворота можно задать в свойстве **icon**, указав его после имени иконки через двоеточия. В этом случае угол поворота определяется суммой углов, указанных в обоих свойствах.
```

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
