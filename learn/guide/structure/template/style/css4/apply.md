Миксин (Mixin) — это пользовательский набор CSS-объявлений, который можно неоднократно подключать к любым CSS-правилам с помощью директивы **@apply**.

Миксины позволяют объединить несколько CSS-объявлений в один набор, который затем можно использовать одновременно в нескольких CSS-правилах.

```info_md
Использование миксинов определяется неофициальным предложением [CSS @apply Rule](http://tabatkins.github.io/specs/css-apply-rule/ "CSS @apply Rule").
```

```warning_md
На данный момент это предложение полностью отклонено по ряду причин, с которыми подробно можно ознакомиться [здесь](https://www.xanthir.com/b4o00 "Why I Abandoned @apply"). Поэтому миксины и директиву **@apply** в дальнейшем желательно не использовать. Браузеры их поддерживают только в экспериментальном режиме. Однако фреймворк их поддерживает в рамках глобальных стилей.
```

Миксин объявляется как пользовательское CSS-свойство со значением, указанным после двоеточия, обернутым в фигурные скобки.

Имена миксинов обязательно должны начинаться с двух дефисов **--**, после которых должен идти валидный [CSS-идентификатор](https://drafts.csswg.org/css-syntax-3/#identifier "CSS Syntax Module").

```javascript_run_edit_[my-component.js]_h=120_
ODA({
    is: 'my-component',
    template: `
        <style>
            :host {
                --my-mixin: {
                    background-color: yellow;
                    color: blue;
                }
            }
            span {
                @apply --my-mixin;
            }
            div {
                @apply --my-mixin;
            }
        </style>
        <span>Привет, миксин!</span>
        <div>Я используюсь неоднократно</div>
    `
});
```

В этом примере объявлен миксин с именем **--my-mixin**, в котором заданы два CSS-объявления: цвет шрифта **color** и цвет фона **background-color**. Этот миксин применен к CSS-правилам элементов **span** и **div** с помощью директивы **@apply**. Это позволяет задать у них одновременно и цвет фона и цвет шрифта.

Если изменить любое CSS-объявление внутри миксина, то эти изменения будут автоматически применены ко всем CSS-правилам, в которых это миксин был подключен директивой **@apply**.

```javascript_run_edit_line[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            :host {
                --my-mixin: {
                    background-color: blue;
                    color: yellow;
                }
            }
            span {
                @apply --my-mixin;
            }
            div {
                @apply --my-mixin;
            }
        </style>
        <span>Span</span>
        <div>Div</div>
    `
});
```

Миксины, объявленные во внешнем дереве, доступны также и в теневом дереве любого пользовательского компонента, так же, как и CSS-свойства. Это позволяет задать определенный набор CSS-правил, который будет использоваться для стилизации однотипных элементов вне зависимости от того, где они находятся: в светлом или в теневом DOM.

```html_run_edit_line
    <head>
        <script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda-framework/oda.js"></script>
        <style>
            :root {
                --my-mixin: {
                    background-color: blue;
                    color: yellow;
                }
            }
            span {
                @apply --my-mixin;
            }
        </style>
    </head>
    <body>
        <span>Привет из светлого дерева</span>
        <my-component></my-component>
        <script type="module">
            ODA({
                is: 'my-component',
                template: `
                    <style>
                       span {
                            @apply --my-mixin;
                        }
                    </style>
                <span>Привет из теневого дерева</span>
                `
            });
        </script>
    </body>
```

Такой подход не нарушает изоляцию теневого дерева компонента от внешней таблицы стилей, так как миксин внутри компонента можно подключить только из теневого, а не из внешнего дерева.

```warning_md
Миксины не поддерживают механизм каскадирования. Это приводит к тому, что CSS-объявления внутри миксинов будут переопределяться полностью, а не каскадно, как это делают CSS-правила при возникновении коллизий.
```

Миксины не поддерживаются браузерами. По этой причине все предыдущие примеры работать не будут. Однако миксины заданы в глобальной стилизации фреймворка и их можно использовать в пользовательских компонентах.

```javascript_run_edit_line[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            span {
                @apply --dark;
            }
            div {
                @apply --dark;
            }
        </style>
        <span>Span</span>
        <div>Div</div>
    `
});
```

Задать пользовательский миксин фреймворк пока не позволяет.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/dDXTbCqGZYU?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
