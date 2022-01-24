Пользовательские CSS-свойства — это каскадные переменные, которые задаются с помощью нотации custom property и доступны в CSS-объявлениях через функцию **var()**.

CSS-свойства позволяют задавать значения, которые можно неоднократно использовать в любых CSS-правилах для определения общего стиля отображения различных элементов внутри компонента.

```info_md
Регламент использования CSS-свойств определяется проектом спецификации [CSS Custom Properties](https://drafts.csswg.org/css-variables/ "CSS Custom Properties for Cascading Variables Module").
```

 В соответствие с этим регламентом имя пользовательского свойства обязательно должно начинаться с двух дефисов **--**, после которых должен идти валидный [CSS-идентификатор](https://drafts.csswg.org/css-syntax-3/#identifier "CSS Syntax Module").

```javascript_run_edit_h=120[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            :host {
                --my-color: yellow;
            }
            span {
                background-color: var(--my-color);
            }
            div {
                background-color: var(--my-color);
            }
        </style>
        <span>Span</span>
        <div>Div</div>
    `
});
```

В этом примере объявлено CSS-свойство с именем **--my-color** и со значением цвета **yellow**. Эта переменная используется для задания цвета фона одновременно у двух элементов: **span** и **div**.

Если изменить значение переменной **--my-color** с **yellow** на **red**, то цвет изменится во всех CSS-объявлениях, где эта переменная использовалась.

```javascript_run_edit_line[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            :host {
                --my-color: red;
            }
            span {
                background-color: var(--my-color);
            }
            div {
                background-color: var(--my-color);
            }
        </style>
        <span>Span</span>
        <div>Div</div>
    `
});
```

По умолчанию теневое дерево компонента является изолированным от внешних стилей, т.е. внешние стили не будут применяться к элементам теневого дерева.

```html_error_run_edit_line
    <head>
        <script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda-framework/oda.js"></script>
        <style>
            span {
                 background-color: yellow;
            }
        </style>
    </head>
    <body>
        <span>Светлый span</span>
        <my-component></my-component>
        <script type="module">
            ODA({
                is: 'my-component',
                template: `
                    <span>Теневой span</span>
                `
            });
        </script>
    </body>
```

Однако CSS-свойства из внешнего дерева могут использоваться в CSS-объявлениях теневого дерева. Это позволяет задать глобальную стилизацию для всех однотипных элементов вне зависимости от того, где они находятся: в светлом или в теневом DOM.

```html_run_edit_line
    <head>
        <script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda-framework/oda.js"></script>
        <style>
            :root {
                --my-color: yellow;
            }
            span {
                 background-color: var(--my-color);
            }
        </style>
    </head>
    <body>
        <span>Светлый span</span>
        <my-component></my-component>
        <script type="module">
            ODA({
                is: 'my-component',
                template: `
                    <style>
                        span {
                            background-color: var(--my-color);
                        }

                    </style>
                    <span>Теневой span</span>
                `
            });
        </script>
    </body>
```

Имена CSS-свойств являются регистрозависимыми. Это означает, что CSS-свойства с одним и тем же именем, но отличающимся только регистром хотя бы в одном символе, будут считаться различными свойствами.

```html_run_edit_line
    <head>
        <script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda-framework/oda.js"></script>
        <style>
            :root {
                --mycolor: yellow;
                --myСolor: blue;
            }
            span {
                 background-color: var(--mycolor);
                 color: var(--myColor);
            }
        </style>
    </head>
    <body>
        <span>--my-color</span>
        <my-component></my-component>
        <script type="module">
            ODA({
                is: 'my-component',
                template: `
                    <style>
                        span {
                            background-color: var(--myСolor);
                            color: var(--mycolor);
                        }
                    </style>
                    <span>--myСolor</span>
                `
            });
        </script>
    </body>
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/jMZqU-lbmV0?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
