Свойство **allowClose** добавляет на компонент значок закрытия компонента.

Свойство имеет логический тип и доступно только по чтению. Отсутствию значка закрытия соответствует значение **true**, наличию — **false**.

```javascript _run_line_edit_loadoda_[my-component.js]_h=75_
import '/components/layouts/title/title.js';
ODA({
    is: 'my-component',
    template: `
        <oda-title icon="odant:class" title="Заголовок 1"></oda-title>
        <oda-title icon="odant:class" title="Заголовок 2" allow-close="true"></oda-title>
    `
});
```
