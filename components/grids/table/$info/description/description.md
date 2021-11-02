Компонент **Table** предназначен для вывода таблицы. Пользователь также может организовать существование вложенных строк.

Для использования этого компонента необходимо подключить модуль «**table.js**» и добавить в HTML-код пользовательский тэг \<**oda-table**>.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=120_
import '/components/grids/table/table.js';
ODA({
    is: 'my-component',
    template: `
        <oda-table :items></oda-table>
    `,
    props: {
        items: [
            {col1:"1 строка", drag: true, number: 3748.578},
            {col1:"2 строка", drag: true, number: 3726.008}
        ]
    }
});
```
