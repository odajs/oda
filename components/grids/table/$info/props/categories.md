Свойство **categories** содержит дополнительные настройки, которые используются в процессе группировки строк таблицы.

По свой структуре данное свойство является объектом. В нем задано свойство **allowSort**, которое разрешает или запрещает сортировку строк группировки по возрастанию их значений.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=160_
import '/components/grids/table/table.js';
ODA({
    is: 'my-component',
    template: `
        <label>Разрешить сортировку строк группировки <input type="checkbox" ::value="allowSort" ></label>
        <oda-table :data-set :columns :categories.allow-sort="allowSort" show-header show-grouping-panel></oda-table>
    `,
    props: {
        columns: [
            {col1: 'name', label: 'Столбец 1'},
            {col2: 'name', label: 'Столбец 2'}
        ],
        dataSet: [
            {col1: "1 Строка", col2: "2"},
            {col1: "2 Строка", col2: "2"},
            {col1: "1 Строка", col2: "3"}
        ],
        allowSort: false
    }
});
```

Если свойство **allowSort** установлено в значение **true**, то группировочные строки будут дополнительно отсортированы по возрастанию. В противном случае они будут идти в том порядке, в котором были обнаружены в исходном наборе данных **dataSet**.

``` info_md
Сортировка группировочных строк по убыванию пока не предусмотрена.
```

Изначально свойство **allowSort** имеет значение **false**. Поэтому по умолчанию группировочные строки не сортируются.
