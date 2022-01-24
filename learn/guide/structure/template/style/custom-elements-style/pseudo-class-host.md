**:host** — это псевдокласс CSS, который используется для стилизиции владельца теневого дерева компонента.

```info_md
В соответствии со спецификацией [CSS Scoping Module](https://drafts.csswg.org/css-scoping/#host-selector) псевдокласс **:host** не имеет никакого значения вне контекста теневого дерева.
```

```xml_css_edit_[my-component.css]
<style>
    :host {
        background-color: red;
        color: yellow;
    }
</style>
```

```javascript_run_edit_[my-component.js]_{my-component.css}
ODA({
    is: 'my-component',
    template: `
        <span>{{text}}</span>
    `,
    props: {
        text: 'Hello, host!'
    }
});
```

В контексте теневого дерева псевдокласс **:host** позволяет задавать CSS-стили, которые будут применятся к хосту компонента, и следовательно, ко всем элементам хоста, расположенным внутри его теневого дерева.

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            :host {
                background-color: red;
                color: yellow;
            }
        </style>
        <span>{{text}}</span>
    `,
    props: {
        text: 'Hello, host!'
    }
});
```

После имени псевдокласса **:host** можно указать любой селектор для стилизации определенных элементов внутри теневого дерева.

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            :host span {
                background-color: green;
                color: yellow;
            }
        </style>
        <div>{{text}}</div>
        <span>{{text}}</span>
    `,
    props: {
        text: 'Hello, host!'
    }
});
```

В данном случае будет стилизован только один элемент **span**, так как указанный селектор подходит только для него.

Также в псевдоклассе **:host** можно указать сразу несколько [селекторов](https://drafts.csswg.org/selectors-4/#typedef-compound-selector-list).

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            :host span, div {
                background-color: blue;
                color: yellow;
            }
        </style>
        <div>{{text}}</div>
        <span>{{text}}</span>
    `,
    props: {
        text: 'Hello, host!'
    }
});
```

В этом примере будут стилизованы как элемент **span**, так и элемент **div**.

Псевдокласс **:host** имеет вторую форму представления — функциональную, в которой можно указать дополнительные параметры в круглых скобках.

```_run_edit_line
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>WELCOME</title>
        <script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda-framework/oda.js"></script>
        <style>
            .my-style {
                border: 4px solid red;
                border-radius: 4px;
                box-shadow: inset 0 1px 1px rgba(0, 0, 0, .05);
            }
        </style>
    </head>
    <body>
        <my-component class="my-style"></my-component>
        <my-component></my-component>
        <script type="module">
            ODA({
                is: 'my-component',
                template: `
                    <style>
                        :host(.my-style) {
                            background-color: yellow;
                            color:  blue;
                        }
                        :host {
                            background-color: blue;
                            color: yellow;
                        }
                    </style>
                    <div>Div</div>
                    <span>{{text}}</span>
                `,
                props: {
                    text: 'Hello, host!'
                }
            });
        </script>
    </body>
</html>
```

В этом примере в качестве параметра указан класс стилей **my-style**. В результате этого соответствующие CSS-правила будут применены только к тому компоненту, у которого в атрибуте **class** будет записан тот же самый класс **my-style**.

Кроме этого, существует функциональный псевдокласс [**:host-context()**](https://drafts.csswg.org/css-scoping/#selectordef-host-context), который позволяет применять CSS-стили к теневому дереву хоста при условии, что сам хост или хотя бы один из его родителей удовлетворяет условию, указанному в качестве параметра в круглых скобках. В противном случае этот псевдокласс ничего возвращать не будет.

```_run_edit_line
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>WELCOME</title>
        <script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda-framework/oda.js"></script>
        <style>
            .my-style {
                border: 4px solid red;
                border-radius: 4px;
                box-shadow: inset 0 1px 1px rgba(0, 0, 0, .05);
            }
        </style>
    </head>
    <body>
        <my-component class="my-style"></my-component>
        <my-component></my-component>
        <div>
            <my-component></my-component>
        </div>
        <script type="module">
            ODA({
                is: 'my-component',
                template: `
                    <style>
                        :host-context(.my-style) {
                            background-color: yellow;
                            color:  blue;
                        }
                        :host {
                            background-color: blue;
                            color: yellow;
                        }
                        :host-context(div) {
                            background-color: yellow;
                            color: green;
                        }
                    </style>
                    <div>Div</div>
                    <span>{{text}}</span>
                `,
                props: {
                    text: 'Hello, host!'
                }
            });
        </script>
    </body>
</html>
```

В этом примере первый стиль будет применен к первому компоненту **my-component**, так как у него задан CSS-класс **my-style**. Второй стиль будет применен к компоненту без каких-либо дополнительных селекторов. Третий стиль будет применен к хосту третьего компонента ввиду того, что его родителем является элемент **div**.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/kXtjakXxmuE?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
