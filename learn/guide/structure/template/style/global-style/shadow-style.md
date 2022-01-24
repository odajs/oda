**shadow** — это группа CSS-стилей, предназначенных для стилизации теней у HTML-элементов и текста.

Это группа использует псевдокласс **:root** и применяется к корневому элементу HTML-страницы.

В нее входят следующие CSS-свойства и миксины:

```css
<style scope="oda" group="shadow">
    :root {
        --box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.2);
        --shadow: {
            box-shadow: var(--box-shadow);
            border-color: red;
        };
        --shadow-transition: {
            transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1);
        };
        --text-shadow: {
            text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75);
        };
        --text-shadow-black: {
            text-shadow: 0 1px 1px black;
        };
        --raised:{
            box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        };
    }
    body[context-menu-show] *:not(oda-context-menu){
        pointer-events: none;
    }
</style>
```

CSS-свойство **--box-shadow** задает разделенный запятыми список теней, которые будут применяться к соответствующему CSS-объявлению. Миксин **--shadow** задает само CSS-объявление тени на основе предыдущего CSS-свойства, окрашивая рамку элемента в красный цвет при условии, что она у него уже была задана. Вспомогательный миксин **--shadow-transition** позволяет задать анимацию при появлении и исчезновении заданной тени.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            div {
                @apply --shadow-transition;
                width: 50%;
                border: 2px solid;
            }
            div:hover {
                @apply --shadow;
            }
        </style>
        <div>
            Наведи на меня курсор мыши
        </div>
    `,
});
```

В этом примере при наведении курсора мыши на элемент **div** будет появляться тень с непродолжительным эффектом анимации, а также будет изменяться цвет рамки на заданный в миксине красный цвет.

Миксин **--raised** позволяет задать тень несколько меньшего размера, чем создает миксин **--shadow**, без изменения цвета рамки. Миксины **--text-shadow** и **--text-shadow-black** определяют параметры тени у текста элемента.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            div {
                @apply --text-shadow-black;
                width: 50%;
                border: 1px solid;
                background-color: lightgrey;
                color: grey;
            }
            div:hover {
                @apply --raised;
                @apply --text-shadow;
            }
        </style>
        <div>
            Наведи на меня курсор мыши
        </div>
    `,
});
```

В группе стилей **shadow** задается CSS-правило **pointer-events**.

```css
    body[context-menu-show] *:not(oda-context-menu){
        pointer-events: none;
    }
```

Оно запрещает обработку событий всеми элементами, находящимися над отображенным контекстным меню.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/CsxXcqJrTkM?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>

