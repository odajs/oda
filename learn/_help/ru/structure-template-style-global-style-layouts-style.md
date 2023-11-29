**layouts** — это группа CSS-стилей, предназначенных для стилизации по умолчанию HTML-страницы и оконных компонентов.

Это группа задает CSS-стили четырех селекторов:

1. Псевдокласса **:root**.
1. Селектора тэга **html**.
1. Селектора тэга **body**.
1. Псевдоэлемента **::part**.

Псевдокласс **:root** содержит элементы, которые задаются либо как CSS-переменные, либо как CSS-миксины.

CSS-переменные можно использовать как в **inline**-стилях, так и во внутренних CSS-стилях, задаваемых в тэге **style** компонента.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            div {
                font-family: var(--font-family);
            }
        </style>
        <div>
            Контейнер элементов:
            <div style="color: var(--content-color);">Элемент 1</div>
            <div>Элемент 2</div>
        </div>
    `,
});
```

Миксины можно использовать только при внутренней стилизации компонента в тэге **style**.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            div {
                font-family: var(--font-family);
                @apply --bold;

            }
        </style>
        <div>
            Контейнер элементов:
            <div style="color: var(--content-color); @apply --font-150;">Элемент 1</div>
            <div>Элемент 2</div>
        </div>
    `,
});
```

В данном примере шрифт у всех элементов **div** станет жирным (bold), но размер шрифта у текста «**Элемент 1**» не изменится, так как в **inline**-стилях миксины не будут работать — фреймворк не обрабатывает миксины автоматически, а браузеры не поддерживают их по умолчанию.

Если перенести миксин **--font-150** во внутренний раздел стилей, то шрифт у всех элементов **div** станет в 1,5 раза больше исходного размера.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            div {
                font-family: var(--font-family);
                @apply --bold;
                @apply --font-150;
            }
        </style>
        <div>
            Контейнер элементов:
            <div style="color: var(--content-color);">Элемент 1</div>
            <div>Элемент 2</div>
        </div>
    `,
});
```

Остальные CSS-переменные и CSS-миксины псевдокласса **root** заданы следующим образом:

```css
:root {
    --font-family: Roboto, Noto, sans-serif;
    --bar-background: white;
    --stroke-color: transparent;
    --content-background: white;
    --content-color: black;
    --header-color: black;
    --border-color: darkslategray;
    --border-radius: 0px;
    --body-background: transparent;
    --body-color: #555555;
    --header-background: lightgrey;
    --section-background: lightgrey;
    --section-color: black;
    --layout-background: whitesmoke;
    --layout-color: black;
    --content: {
        background-color: var(--content-background, white);
        color: var(--content-color, black);
    };
    --font-150: {
        font-size: 150%;
    };
    --horizontal: {
        display: flex;
        flex-direction: row;
    };
    --horizontal-center: {
        @apply --horizontal;
        align-items: center;
    };
    --h:{
        @apply --horizontal;
    };
    --horizontal-end: {
        @apply --horizontal;
        justify-content: flex-end;
    };
    --bold: {
        font-weight: bold;
    };
    --between:{
        justify-content: space-between;
    };
    --flex: {
        flex: 1;
        flex-basis: auto;
    };
    --no-flex: {
        flex-grow: 0;
        flex-shrink: 0;
        flex-basis: auto;
    };
    --bar: {
        @apply --horizontal;
    };
    --center: {
        justify-content: center;
        align-self: center;
        align-content: center;
    };
    --vertical: {
        display: flex;
        flex-direction: column;
    };
    --border: {
        border: 1px solid;
    };
    --toolbar: {
        @apply --horizontal;
        align-items: center;
    };
    --header: {
        background: var(--header-background);
        color: var(--header-color);
        fill: var(--header-color);
    };
    --layout: {
        background: var(--layout-background);
        color: var(--layout-color);
        fill: var(--layout-color);
    };
    --footer: {
        @apply --header;
    };
    --border: {
        border: 1px solid var(--border-color, darkslategray);
        border-radius: var(--border-radius);
    };
    --border-left: {
        border-left: 1px solid var(--border-color, darkslategray);
    };
    --border-top: {
        border-top: 1px solid var(--border-color, darkslategray);
    };
    --border-right: {
        border-right: 1px solid var(--border-color, darkslategray);
    };
    --border-bottom: {
        border-bottom: 1px solid var(--border-color, darkslategray);
    };
    --label: {
        white-space: nowrap;
        align-content: center;
        text-overflow: ellipsis;
        font-family: var(--font-family);
        overflow: hidden;
        padding: 0px 4px;
    };
    --cover: {
        position: fixed;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.1);
        z-index: 1000;
    };
    --user-select: {
        user-select: text !important;
    }
};
```

С их помощью, например, можно изменить способ расположения HTML-элементов.

```javascript _run_edit_[my-component.js]_h=60_
ODA({
    is: 'my-component',
    template: `
        <style>
            div {
                @apply --horizontal;
            }
        </style>
        <div>
            Контейнер элементов:
            <div>Элемент 1</div>
            <div>Элемент 2</div>
        </div>
    `,
});
```

Здесь использование миксина **--horizontal** заставляет элементы **div** отображаться по горизонтали.

Глобальная стилизация задает значение высоты у всех HTML-элементов по умолчанию равной 100% от высоты родительского элемента.

```css
html {
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    height: 100%;
    --my-variable: 100px;
}
```

Кроме этого, она определяет стилизацию по умолчанию раздела **body**.

```css
body {
    display: flex;
    flex: 1;
    animation: fadeIn .5s;
    flex-direction: column;
    font-family: var(--font-family);
    user-select: none;
    margin: 0px;
    padding: 0px;
    height: 100%;
    background: var(--body-background);
    color: var(--body-color, #555555);
    fill: var(--body-color, #555555);
    stroke: var(--stroke-color, transparent);
}
```

Все элементы здесь изначально отображаются при помощи технологии **Flexbox**.

Для стилизации теневого дерева компонента минимальная ширина элементов задана размером 0 пикселей.

```css
::part {
    min-width: 0px;
}
```

Здесь же заданы правила для стилизации ошибок, возникающих внутри компонентов.

```css
::part(error) {
    position: relative;
    overflow: visible;
    min-height: 20px;
    min-width: 20px;
}
```

```css
::part(error):before {
    content: '';
    position: absolute;
    top: 0px;
    left: 0px;
    width: 0px;
    height: 0px;
    border: 4px solid transparent;
    border-left: 4px solid red;
    border-top: 4px solid red;
}
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/6PMdJWAi168?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
