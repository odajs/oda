Свойство **evenOdd** позволяет отображать четные и нечетные строки разным стилем.

Если это свойство установлено в значение **true**, то четные и нечетные строки таблицы будут внешне отличаться друг от друга.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=160_
import '/components/grids/table/table.js';
ODA({
    is: 'my-component',
    template: `
       <label>Чередовать стиль строк<input type="checkbox" ::value="evenOdd" ></label>
        <oda-table :data-set :even-odd show-header col-lines auto-width></oda-table>
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
         evenOdd: false,
    }
});
```

По умолчанию свойство **evenOdd** установлено в значение **false**. Поэтому все строки таблицы изначально будут выглядеть одинаково.
