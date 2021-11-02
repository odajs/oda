Раздел свойств **pos** задает ряд параметров компонента **form-layout**.
Свойства **x** и **y** управляют положением компонента по принципу координат относительно левого-верхнего угла окна основной зоны формы. По-умолчанию значения установлены в [0;0].

```html _run_line_edit_[demo.html]_h=300_
<meta charset="UTF-8">
<script type="module" src="/components/layouts/form-layout/form-layout.js"></script>
<oda-form-layout modal></oda-form-layout>
<oda-form-layout modal pos.x="20" pos.y="20"></oda-form-layout>
```

Свойства **width** и **height** управляют размерами окна формы. Значения задаются в пикселях. Заметьте — значения **width** и **height** нельзя установить меньше значений свойств **minWidth** и **minHeight**, которые по умолчанию равны 300 пикселям. Также это станет заметно при попытке изменить размеры формы вручную при помощи мыши — окно формы нельзя будет уменьшить меньше размеров, указанных в **minWidth** и **minHeight**.

```html _run_line_edit_[demo.html]_h=300_
<meta charset="UTF-8">
<script type="module" src="/components/layouts/form-layout/form-layout.js"></script>
<oda-form-layout modal pos.width="450" pos.height="100"></oda-form-layout>
<oda-form-layout modal pos.width="450" pos.height="100" min-width="100" min.height="75" ></oda-form-layout>
```
