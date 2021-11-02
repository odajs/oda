Свойства **minWidth** и **minHeight** ограничивают минимальный размер окна формы. По умолчанию эти значения установлены в 300 пикселей. 
Заметьте — значения **width** и **height** нельзя установить меньше значений свойств **minWidth** и **minHeight**

```html _run_line_edit_[demo.html]_h=300_
<meta charset="UTF-8">
<script type="module" src="/components/layouts/form-layout/form-layout.js"></script>
<oda-form-layout modal pos.width="450" pos.height="100"></oda-form-layout>
<oda-form-layout modal pos.width="450" pos.height="100" min-width="100" min.height="75" ></oda-form-layout>
```
