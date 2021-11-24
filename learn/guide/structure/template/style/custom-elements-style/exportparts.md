Атрибут **exportparts** используется для стилизации элементов вложенного теневого дерева в родительском теневом дереве с помощью внешней таблицы стилей.

По умолчанию элементы, у которых задан атрибут **part**, экспортируются для стилизации только на один уровень выше своего теневого дерева. Это означает то, что если одно теневое дерево будет вложено в другое, то элементы вложенного дерева не будут стилизоваться с помощью внешней таблицы стилей даже при условии, что значение их атрибута **part** будет совпадать с именем псевдоэлемента **:part** внешней таблицы.

```html _error_run_edit_line
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>WELCOME</title>
        <script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda-framework/oda.js"></script>
        <style>
            my-component::part(my-style) {
                background-color: red;
                color: yellow;
            }
        </style>
    </head>
    <body>
        <my-component></my-component>
        <script type="module">
            ODA({
                is: 'my-component',
                template: `
                    <span part="my-style">{{text}}</span>
                    <my-inner-component></my-inner-component>
                `,
                props:{
                    text: 'Мой внешний компонент'
                }
            });
            ODA({
                is: 'my-inner-component',
                template: `
                    <span part="my-span my-style">{{text}}</span>
                `,
                props:{
                    text: 'Мой внутренний компонент'
                }
            });
        </script>
    </body>
</html>
```

Используя атрибут **exportparts**, внешний компонент может разрешить проведение стилизации внутренних элементов вложенного компонента через свое теневое дерево во внешней таблице стилей.

```html _run_edit_line
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>WELCOME</title>
        <script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda-framework/oda.js"></script>
        <style>
            my-component::part(my-style) {
                background-color: red;
                color: yellow;
            }
        </style>
    </head>
    <body>
        <my-component></my-component>
        <script type="module">
            ODA({
                is: 'my-component',
                template: `
                    <span part="my-style">{{text}}</span>
                    <my-inner-component exportparts="my-style: my-style"></my-inner-component>
                `,
                props:{
                    text: 'Внешний компонент'
                }
            });
            ODA({
                is: 'my-inner-component',
                template: `
                    <span part="my-span my-style">{{text}}</span>
                `,
                props:{
                    text: 'Внутренний компонент'
                }
            });
        </script>
    </body>
</html>
```

Значение атрибута **part** внутри вложенного компонента может не совпадать с именем внешней части таблицы стилей. В этом случае с помощью атрибута **exportparts** можно связать внутреннее имя с внешним, указав его через двоеточие.

Например:

```html _run_edit_line
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>WELCOME</title>
        <script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda-framework/oda.js"></script>
        <style>
            my-component::part(my-style) {
                background-color: green;
                color: yellow;
            }
        </style>
    </head>
    <body>
        <my-component></my-component>
        <script type="module">
            ODA({
                is: 'my-component',
                template: `
                    <span part="my-style">{{text}}</span>
                    <my-inner-component exportparts="my-inner-style: my-style"></my-inner-component>
                `,
                props:{
                    text: 'Внешний компонент'
                }
            });
            ODA({
                is: 'my-inner-component',
                template: `
                    <span part="my-inner-style">{{text}}</span>
                `,
                props:{
                    text: 'Внутренний компонент'
                }
            });
        </script>
    </body>
</html>
```

Если имена внешних и внутренних CSS-частей совпадают, то для упрощения записи внешнее имя в директиве **exportparts** можно не указывать. В соответствии со значением своего внутреннего имени, оно будет автоматически подставляться через двоеточие.

```html _run_edit_line
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>WELCOME</title>
        <script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda-framework/oda.js"></script>
        <style>
            my-component::part(my-style) {
                background-color: red;
                color: yellow;
            }
        </style>
    </head>
    <body>
        <my-component></my-component>
        <script type="module">
            ODA({
                is: 'my-component',
                template: `
                    <span part="my-style">{{text}}</span>
                    <my-inner-component exportparts="my-style"></my-inner-component>
                `,
                props:{
                    text: 'Внешний компонент'
                }
            });
            ODA({
                is: 'my-inner-component',
                template: `
                    <span part="my-style">{{text}}</span>
                `,
                props:{
                    text: 'Внутренний компонент'
                }
            });
        </script>
    </body>
</html>
```

Если требуется одновременно экспортировать сразу несколько CSS-частей, то их имена в директиве **exportparts** нужно указать последовательно, разделяя запятыми.

```html _run_edit_line
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>WELCOME</title>
        <script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda-framework/oda.js"></script>
        <style>
            my-component::part(my-style) {
                background-color: blue;
            }
            my-component::part(my-span) {
                color: white;
            }
        </style>
    </head>
    <body>
        <my-component></my-component>
        <script type="module">
            ODA({
                is: 'my-component',
                template: `
                    <span part="my-style my-span">{{text}}</span>
                    <my-inner-component exportparts="my-inner-style: my-style, my-inner-span: my-span"></my-inner-component>
                `,
                props:{
                    text: 'Внешний компонент'
                }
            });
            ODA({
                is: 'my-inner-component',
                template: `
                    <span part="my-inner-style my-inner-span">{{text}}</span>
                `,
                props:{
                    text: 'Внутренний компонент'
                }
            });
        </script>
    </body>
</html>
```

```info _md_line
Если сразу несколько компонентов будут вложены друг в друга, то процедуру экспорта CSS-частей с помощью атрибута **exportparts** нужно будет проводить на каждом уровне вложенности.
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/6Y8pdjRsQrg?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen 
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
