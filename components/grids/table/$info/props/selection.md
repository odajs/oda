Свойство **selection** предназначено для хранения списка выбранных строк таблицы.

По своей структуре это свойство является массивом. В нем сохраняются все выбранные строки таблицы при условии, что их выбор разрешен в свойстве **allowSelection**.

Если выбор строк запрещен, то массив **selection** будет оставаться пустым.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=200_
import '/components/grids/table/table.js';
import '/components/grids/listbox/listbox.js';
ODA({
    is: 'my-component',
    template: `
        <label>Разрешить выбор <input type="checkbox" ::value="allowSelection" ></label> <br>
        <span>Количество выбранных строк: {{selection.length}}</span> <br>
        <span>Последняя выбранная строка: {{ selection.length ? selection[selection.length - 1].col1 : 'Нет'}}</span>
        <oda-table ref="table" :data-set :allow-selection ::selection :columns show-header row-lines col-lines auto-width></oda-table>
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
        allowSelection: false,
        selection: []
    }
});
```

Для выбора последующих узлов необходимо придерживать клавишу **Ctrl**.

Если выбрать все узлы дерева при условии, что до этого уже были выбраны некоторое из них, то ранее выбранные узлы из выделения будут исключены.

По умолчанию свойство **allowSelection** установлено в значение **false**. Поэтому выбор узлов дерева изначально запрещен и массив **selection** при создании дерева остается пустым.
