//Пример для статьи Imports.

var div = document.createElement( "div" );
div.innerText = "Загружен модуль 1" ;
document.body.append( div );

ODA({
    is: "my-component",
    imports: './module2.js',
    template: `
        <input value='Это мой компонент'></input>
    `,
});
