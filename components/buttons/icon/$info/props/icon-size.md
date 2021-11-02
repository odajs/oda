Свойство **iconSize** задает размер картинки в пикселях.

Это свойство фактически определяет высоту всего компонента.

```javascript _run_line_edit_loadoda_[my-component.js]_h=40_
import '/components/buttons/icon/icon.js';
ODA({
    is: 'my-component',
    template: `
        <label>Размер иконки: <input type="number" ::value="iconSize"></label><br>
        <oda-icon :icon-size icon="icons:android" ref="icon"></oda-icon>
        <span>Высота компонента: {{$refs.icon.clientHeight}} </span>
    `,
    props: {
        iconSize: 24
    }
});
```

 По умолчанию свойство **iconSize** имеет значение 24, т.е. размер компонента будет изначально равен 32 пикселям, так как у компонента установлен еще внешний отступ по 4 пикселя сверху и снизу.
