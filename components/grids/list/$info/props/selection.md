Свойство **selected** предназначено для хранения списка выбранных элементов.

По своей структуре оно является массивом, и в данном компоненте не используется, так как в нем можно выбрать только один элемент, значение которого сохраняется в свойстве **focusedItem**.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=150_
import '/components/grids/list/list.js';
ODA({
    is: 'my-component',
    template: `
        <div>Фокусный элемент: {{focusedItem}}</div>
        <div>Выбранный элемент: {{selected[0]}}</div>
        <oda-list ref="list" :items ::selected ::focused-item></oda-list>
    `,
    props: {
        items: ["Элемент 1", "Элемент 2", "Элемент 3", "Элемент 4", "Элемент 5"],
        focusedItem: 'Щелкни по элементу',
        selected: []
    }
});
```

Это свойство предназначено для использования в компонентах наследниках.
