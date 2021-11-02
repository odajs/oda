Свойство **rotate** задает угол поворота иконки на поверхности компонента.

Угол поворота указывается в градусах. Величина угла задается вещественным числом. Если число положительное, то поворот осуществляется по часовой стрелке, если отрицательное, то против часовой стрелки. Если число по модулю больше 360, то берется остаток от деления заданной величины на 360.

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/button/button.js';
ODA({
    is: 'my-component',
    template: `
        <oda-button rotate="450" icon="icons:android"></oda-button>
        <oda-button rotate="-450" icon="icons:android"></oda-button>
        <oda-button rotate="-450e-1" icon="icons:android"></oda-button>
    `
});
```

``` info_md
Кроме свойства **rotate** угол поворота иконки может быть указан в свойстве **icon**. В этом случае угол поворота определяется суммой углов, указанных в обоих свойствах.
```
