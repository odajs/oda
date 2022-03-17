Псевдоэлемент **::part** позволяет стилизовать элементы компонента, находящиеся в его теневом дереве, используя внешнюю таблицу стилей.

В соответствии со спецификацией [CSS Shadow Parts](https://drafts.csswg.org/css-shadow-parts) у псевдоэлемента **::part** необходимо указать уникальное имя в круглых скобках. Это имя будет использоваться в атрибуте **part** HTML-элемента, которого необходимо стилизовать внутри теневого дерева с помощью внешней таблицы стилей.

```warning_md
Имя CSS-части является [CSS-идентификатором](https://drafts.csswg.org/css-values-4/#typedef-ident). Оно обязательно должно указываться без кавычек. В противном случае оно будет восприниматься как строка, и использовать его в качестве имени CSS-части будет нельзя.
```

Например:

```html_run_edit_line
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
                `,
                props:{
                    text: 'Hello, part!'
                }
            });
        </script>
    </body>
</html>
```

Все элементы компонента, у которых значение атрибута **part** совпадает с именем CSS-части, будут стилизованы с использованием соответствующего стиля внешней таблицы CSS. Такой подход не нарушает концепцию изоляции теневого дерева компонента от внешних стилей, потому что только сам разработчик может указать внешнее имя CSS-части в атрибуте **part** внутри своего компонента.

Имя тэга элемента в теневом дереве не имеет никакого значения. Все определяется именем CSS-части, указанным в его атрибуте **part**.

```html_run_edit_line
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
                    <div part="my-style">{{text}}</div>
                `,
                props:{
                    text: 'Hello, part!'
                }
            });
        </script>
    </body>
</html>
```

У псевдоэлемента **::part** можно указывать другие псевдоклассы или псевдоэлементы.

```html_run_edit_line
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>WELCOME</title>
        <script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda-framework/oda.js"></script>
        <style>
            my-component::part(my-style):hover {
                background-color: red;
                color: yellow;
            }
            my-component::part(my-input)::placeholder {
                background-color: green;
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
                    <span part="my-style">{{text}}</span>
                    <div part="my-style">{{text}}</div>
                    <input part="my-input" placeholder="Введите текст">
                `,
                props:{
                    text: 'Hello, part!'
                }
            });
        </script>
    </body>
</html>
```

```error_md
Структурные псевдоклассы, вложенные селекторы или другие псевдоэлементы **part** указывать в **::part** нельзя.
```

```html_error_run_edit_line
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>WELCOME</title>
        <script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda-framework/oda.js"></script>
        <style>
            my-component::part(my-div) span {
                background-color: red;
                color: yellow;
            }

            my-component::part(my-div)::part(my-style) {
                background-color: green;
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
                    <div part="my-div">
                        <span part="my-style">{{text}}</span>
                    </div>
                `,
                props:{
                    text: 'Ошибка. Стиль не применен!'
                }
            });
        </script>
    </body>
</html>
```

У одного и того же HTML-элемента можно указывать сразу несколько CSS-частей. В этом случае их имена в списке разделяются пробелами.

```html_run_edit_line
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>WELCOME</title>
        <script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda-framework/oda.js"></script>
        <style>
            my-component::part(my-span){
                background-color: blue;
            }
            my-component::part(my-style) {
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
                    <span part="my-span my-style">{{text}}</span>
                `,
                props:{
                    text: 'Hello, part!'
                }
            });
        </script>
    </body>
</html>
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/IGBja7TURUY?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
