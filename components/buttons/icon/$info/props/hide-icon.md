Свойство **hideIcon** позволяет скрывать иконку.

Если это свойство установлено в значение **true**, то компонент не будет отображаться в браузере. В противном случае, когда установлено значение **false**, иконка будет видна.

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/icon/icon.js';
ODA({
    is: 'my-component',
        template: `
            <label>{{(hideIcon? 'Отображать' : 'Не отображать') + ' иконку:'}} <input type="checkbox" ::value="hideIcon"></label><br>
            <oda-icon ::hide-icon icon="icons:star"></oda-icon>
        `,
        props: {
            hideIcon: false
        }
});
```

Фактически данное свойство изменяет значение атрибута **display** стиля компонента, не отображая его, когда свойство **hideIcon** установлено в значение **true**.

По умолчанию свойство **hideIcon** установлено в значение **false**, т.е. изначально иконка будет отображаться.
