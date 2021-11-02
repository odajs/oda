Компонент **«Accordion»** предназначен для создания списка объектов, где каждый пункт может раскрываться по клику мыши.

Для его использования необходимо подключить JS-модуль «**accordion.js**» и добавить в HTML-код пользовательский тэг «**oda-accordion**».

Например:

```html _run_line_edit_[demo.html]_h=300_
<meta charset="UTF-8">
<script type="module" src="../../../oda.js"></script>
<script type="module" src="/components/layouts/accordion/accordion.js"></script>
<oda-accordion>
        <oda-accordion-item icon="odant:class" label="Список 1-10">
                <div slot="accordion-item-bar">раскрыть список</div>
                <oda-accordion-panel>1 2 3 4 5 6 7 8 9 10</oda-accordion-panel>
        </oda-accordion-item>
        <oda-accordion-item icon="android" label="список 11-20">
                <div>11 12 13 14 15 16 17 18 19 20</div>
        </oda-accordion-item>
</oda-accordion>
```
