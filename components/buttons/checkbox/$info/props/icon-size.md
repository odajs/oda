Свойство **iconSize** задает размер иконки, которая используется для отображения текущего состояния флажка.

Этот размер задается в пикселях и однозначно определяет высоту самого компонента.

Например,

```javascript _run_line_edit_loadoda_[my-component.js]_h=80_
import '/components/buttons/checkbox/checkbox.js';
ODA({
    is: 'my-component',
    template: `
        <label>Размер иконки: <input type="number" ::value="iconSize"><label>
        <oda-checkbox ref="id" :icon-size></oda-checkbox>
        <span>Высота флажка: {{$refs.id.clientHeight}}</span>
    `,
    props: {
        iconSize: 24,
    }
});
```

 По умолчанию свойство **iconSize** имеет значение 24, т.е. размер флажка изначально будет равен 24 пикселям.
