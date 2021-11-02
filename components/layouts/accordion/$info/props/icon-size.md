Свойство **«icon-size»** задает размер картинки на плашке **accordeon** в пикселях. Значение по умолчанию — 100 пикселей.

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/icon/icon.js';
ODA({
    is: 'my-component',
    template: `
        <oda-accordion-item icon="odant:class" label="Список 1-10">
                <div slot="accordion-item-bar">раскрыть список</div>
                <oda-accordion-panel>1 2 3 4 5 6 7 8 9 10</oda-accordion-panel>
        </oda-accordion-item>
        <oda-accordion-item icon="odant:class" icon-size="50" label="Список 11-20">
                <div slot="accordion-item-bar">раскрыть список</div>
                <oda-accordion-panel>11 12 13 14 15 16 17 18 19 20</oda-accordion-panel>
        </oda-accordion-item>
        <oda-accordion-item icon="odant:class" icon-size="150" label="Список 21-30">
                <div slot="accordion-item-bar">раскрыть список</div>
                <oda-accordion-panel>21 22 23 24 25 26 27 28 29 30</oda-accordion-panel>
        </oda-accordion-item>
    `
});
```
