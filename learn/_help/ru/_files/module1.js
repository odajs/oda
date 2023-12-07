//Пример для статьи Imports.

document.body.append( document.createTextNode("- Загружен модуль 1 -") );

ODA({
    is: "demo-component",
    imports: './module2.js',
    template: `
        <span style="border:dashed">Это DEMO-компонент</span>
    `,
});
