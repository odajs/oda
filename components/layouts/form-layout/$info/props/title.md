Раздел свойств **title** задает ряд параметров компонента **form-layout**.
Свойство **show** управляет отображением шапки компонента. По-умолчанию значение установлено в true.
```html _run_line_edit_[demo.html]_h=300_
<meta charset="UTF-8">
<script type="module" src="/components/layouts/form-layout/form-layout.js"></script>
<oda-form-layout modal></oda-form-layout>
<oda-form-layout modal title.show="false"></oda-form-layout>
```

Свойство **icon** управляет иконкой, расположенной в шапке компонента. Иконка по умолчанию — av:web с размером 32 пикселя. Изменять размер иконки можно через свойство **iconSize**. Размер шапки будет автоматически подстраиваться под высоту иконки.

```html _run_line_edit_[demo.html]_h=300_
<meta charset="UTF-8">
<script type="module" src="/components/layouts/form-layout/form-layout.js"></script>
<oda-form-layout modal></oda-form-layout>
<oda-form-layout modal title.icon="odant:class"></oda-form-layout>
```

Свойство **title** управляет надписью в шапке компонента. По умолчанию надпись отсутствует.

```html _run_line_edit_[demo.html]_h=300_
<meta charset="UTF-8">
<script type="module" src="/components/layouts/form-layout/form-layout.js"></script>
<oda-form-layout modal></oda-form-layout>
<oda-form-layout modal title.title="Окно формы"></oda-form-layout>
```
