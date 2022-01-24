**special** — это группа CSS-стилей, предназначенных для стилизации диалоговых компонентов, выводящих различные сообщения.

Эта группа использует псевдокласс **:root** и применяется к корневому элементу HTML-страницы.

В нее входят CSS-переменные и миксины, которые условно можно разделить на 4 группы:

1. **invert** — обратный стиль по отношению к обычному отображению элементов.
1. **error** — стилизация сообщений об ошибках.
1. **success** — стилизация сообщений об успешно выполненных действиях.
1. **warning** — стилизация сообщений с предупреждениями о возможных ошибках.

Эти стили объявлены следующим образом:

```css
<style scope="oda" group="special">
    :root {
        --success-color: green;
        --error-color: red;
        --info-color: blueviolet;
        --warning-color: orange;
        --invert:{
            color: var(--layout-background) !important;
            border-color: var(--layout-background) !important;
            fill: var(--layout-background) !important;
            background: var(--layout-color) !important;
        };
        --error: {
            color: var(--error-color) !important;
            border-color: var(--error-color) !important;
            fill: var(--error-color) !important;
        };
        --error-invert: {
            @apply --invert;
            background: var(--error-color) !important;
        };
        --success: {
            color: var(--success-color) !important;
            fill: var(--success-color) !important;
            border-color: var(--success-color) !important;
        };
        --success-invert: {
            @apply --invert;
            background: var(--success-color) !important;
        };
        --info: {
            color: var(--info-color) !important;
            fill: var(--info-color) !important;
            border-color: var(--info-color) !important;
        };
        --info-invert: {
            @apply --invert;
            background: var(--info-color) !important;
        };
        --warning: {
            color: var(--warning-color)  !important;
            fill: var(--warning-color) !important;
            border-color: var(--warning-color) !important;
        };
        --warning-invert: {
            @apply --invert;
            background: var(--warning-color) !important;
        };
    }
</style>
```

Например,

```javascript _run_edit_[my-component.js]_h=150_
ODA({
    is: 'my-component',
    template: `
        <style>
            div {
                border: solid;
                margin: 5px;
            }
            div.error {
                @apply --error;
            }
            div.success {
                @apply --success;
            }
            div.info {
                @apply --info;
            }
            div.warning {
                @apply --warning;
            }
        </style>
        <div>
            Обычный стиль
        </div>
        <div class="error">
            Ошибка --error
        </div>
        <div class="success">
            Успешное выполнение --success
        </div>
        <div class="info">
            Информация --info
        </div>
        <div class="warning">
            Предупреждение --warning
        </div>
    `,
});
```

Группы **error**, **info**, **success**, **warning** имеют обратное отображение. Имена миксинов для них заканчиваются суффиксом **-invert**.

Например,

```javascript _run_edit_[my-component.js]_h=150_
ODA({
    is: 'my-component',
    template: `
        <style>
            div {
                border: solid;
                margin: 5px;
            }
            div.invert {
                @apply --invert;
            }
            div.error-invert {
                @apply --error-invert;
            }
            div.success-invert {
                @apply --success-invert;
            }
            div.info-invert {
                @apply --info-invert;
            }
            div.warning-invert {
                @apply --warning-invert;
            }
        </style>
        <div class="invert">
            Обратный стиль
        </div>
        <div class="error-invert">
            Ошибка --error-invert
        </div>
        <div class="success-invert">
            Успешное выполнение --success-invert
        </div>
        <div class="info-invert">
            Информация --info-invert
        </div>
        <div class="warning-invert">
            Предупреждение --warning-invert
        </div>
    `,
});
```

В них происходит инверсия цветов — цвет рамки и шрифта, заданный в обычных стилях, становится цветом фона. А цвет рамки и шрифта во всех обратных стилях задается с помощью CSS-свойства **--layout-background**, которое объявляется в группе глобальных стилей **layout** следующим образом:

```css
 --layout-background: whitesmoke;
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/W4ZWaqGVDqE?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
