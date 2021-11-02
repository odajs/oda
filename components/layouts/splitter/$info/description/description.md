Компонент «**splitter**» позволяет создавать визуальный элемент плашки разделителя, которая позволяет динамически изменять размеры панелей на layout.

Для его использования необходимо подключить JS-модуль «**splitter.js**» и добавить в HTML-код пользовательский тэг «**oda-splitter**».

Например:

```html _run_line_edit_[demo.html]_h=300_
<meta charset="UTF-8">
<script type="module" src="../../../oda.js"></script>
<script type="module" src="//components/layouts/app-layout/app-layout.js"></script>
<oda-app-layout>
        <div slot="top">TOP</div>
        <div slot="main">MAIN</div>
        <div slot="bottom">BOTTOM</div>
        <div slot="left-drawer">LEFT</div>
        <div slot="right-drawer">RIGHT</div>
</oda-app-layout>
```
