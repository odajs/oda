//Пример для статьи Imports.

document.body.append( document.createTextNode("- Загружен модуль module1.js -") );

ODA({
    is: "demo-component",
    imports: './module2.js',
    template: `
        <input value='Это мой компонент'>
    `,
});
