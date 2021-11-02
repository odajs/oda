Свойство **selectAll** позволяет выбрать все строки таблицы.

Если это свойство установить в значение **true**, то в таблице будут выбраны все строки при условии, что такой выбор разрешен в свойстве **allowSelection**.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=180_
import '/components/grids/table/table.js';
ODA({
    is: 'my-component',
    template: `
        <label>Разрешить выбор <input type="checkbox" ::value="allowSelection" ></label> <br>
        <label>Выбрать все строки <input type="checkbox" ::value="selectAll" ></label>
        <oda-table ref="table" :data-set :allow-selection :select-all :columns :lazy show-header row-lines col-lines auto-width ></oda-table>
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
        selectAll: false
    }
});
```

Если выбор строк запрещен, то свойство **selectAll** никаких действий выполнять не будет. Однако если свойство **selectAll** сначала установить в **true**, а только затем разрешить выбор в свойстве **allowSelection**, то при разрешении выбора все строки сразу станут выбранными.

По умолчанию свойство **selectAll** установлено в значение **false**. Поэтому  все строки таблицы изначально не выделяются, даже если их выбор разрешен в свойстве **allowSelection**.
