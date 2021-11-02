Свойство **showBorders** позволяет отобразить дополнительную рамку по периметру всей таблицы.

Если это свойство уставить в значение **true**, то по периметру таблицы появится дополнительная рамка толщиной в 1 пиксел, в противном случае она отображаться не будет.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=160_
import '/components/grids/table/table.js';
ODA({
    is: 'my-component',
    template: `
        <label>Показать рамку <input type="checkbox" ::value="showBorders" ></label> <br>
        <oda-table ref="table" :show-borders :data-set :columns show-header row-lines col-lines auto-width></oda-table>
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
        showBorders: false
    }
});
```

Изначально свойство **showBorders** установлено в значение **false**, т.е. по умолчанию дополнительная рамка не отображается.
