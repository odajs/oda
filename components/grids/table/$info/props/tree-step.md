Свойство **treeStep** задает дополнительный отступ с левой стороны у  перетаскиваемой строки таблицы.

По умолчанию это свойство имеет значение 24, которое говорит о том, что при использовании технологии **drag and drop** перетаскиваемая строка таблицы будет смещаться относительно текущего уровня узлов на 24 пикселя для того, чтобы она визуально отличалась от других строк.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=200_
import '/components/grids/table/table.js';
ODA({
    is: 'my-component',
    template: `
        <label> Размер отступа: <input type="number" min="0" max="100" ::value="treeStep">px</label> <br>
        <span>Способ вставки</span>
        <select ::value="allowDrop">
            <option value="none" default>none</option>
            <option value="simple">simple</option>
            <option value="extended">extended</option>
        </select>
        <oda-table :tree-step :data-set :columns :allow-drop allow-drag allow-select allow-focus show-header row-lines col-lines auto-width></oda-table>
    `,
    props: {
        columns: [
            {name: 'col1', label: 'Столбец 1'},
            {name: 'col2', label: 'Столбец 2'}
        ],
        dataSet: [
            {col1: "1 Строка", col2: "1"},
            {col1: "2 Строка", col2: "2"},
            {col1: "3 Строка", col2: "3"}
        ],
        treeStep: 24,
        allowDrop: 'none'
    }
});
```

Для того чтобы это свойство работало, необходимо разрешить использовать механизм **drag and drop**.
