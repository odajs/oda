Свойство **selection** предназначено для хранения списка выбранных элементов.

По своей структуре оно является массивом. В нем сохраняются все выделенные элементы списка.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=150_
import '/components/grids/listbox/listbox.js';
ODA({
    is: 'my-component',
    template: `
        <div>Фокусный элемент: {{focusedItem}}</div>
        <div>Выбранные элементы:
        <oda-list-box :items="selection"></oda-list-box>
        </div>
        <oda-list-box :items ::selection ::focused-item></oda-list-box>
    `,
    props: {
        items: ["Элемент 1", "Элемент 2", "Элемент 3"],
        focusedItem: 'Щелкните по элементу',
        selection: []
    }
});
```

 При щелчке левой или правой кнопки мыши по элементу он заносится и в свойство **focusedItem** и в свойство **selection**. Если щелкать по элементам списка после этого, придерживая клавишу **Shift** или **Ctrl**, то все следующие выделенные элементы будут добавляться в массив **selection**, при этом фокусный элемент изменяться не будет.

Если снять выделение с элемента, то он автоматически будет удален из массива **selection**.
