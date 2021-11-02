Компонент **oda-dropdown** является контейнером, в котором можно разместить компоненты и HTML-элементы. Компонент отображается на web-странице в виде выпадающего окна.

Компонент позволяет строить каскады из взаимосвязанных выпадающих окон, что позволяет создавать разветвленное выпадающее меню.

При отображении выпадающее окно располагается поверх основного содержимого веб-страницы, закрывая его. Закрыть окно можно щелкнув мышкой за его пределами или нажав клавишу **Escape**.

Обычно выпадающее окно привязывается к какому-либо элементу для расширения его функциональности или предоставления дополнительной информации.

Для использования компонента необходимо подключить JS-модуль **dropdown.js** и добавить в HTML-код пользовательский тэг **oda-dropdown**. Все элементы, размещенные между открывающим и закрывающим тегами компонента **oda-dropdown**, будут помещены в выпадающее окно.

```javascript _run_line_edit_loadoda_[my-component.js]_h=160_
import '/components/layouts/dropdown/dropdown.js';
ODA({
    is: 'my-component',
    template: `
        <button @tap="myOpened = !myOpened" ref="button">Открыть | Закрыть</button>
        <oda-dropdown ::opened="myOpened" :parent="$refs.button">
            <div>Here must be some Dropdown content</div>
            <div>Here must be some Dropdown content</div>
            <div>Here must be some Dropdown content</div>
        </oda-dropdown>
    `,
    props: {
        myOpened: false
    }
});
```
Обратите внимание, если щелкнуть мышкой по пустому месту на линии, на которой расположена кнопка, то окно не закроется. Это связано с тем, что всю эту линию занимает компонент, в котором объявлено выпадающее окно.

Чтобы убрать нечувствительную зону справа от кнопки, достаточно добавить в компонент стиль, ограничивающий его ширину.

```javascript _run_line_edit_loadoda_[my-component.js]_h=160_
import '/components/layouts/dropdown/dropdown.js';
ODA({
    is: 'my-component',
    template: `
        <style>
            :host { width: 135px; }
        </style>
        <button @tap="myOpened = !myOpened" ref="button">Открыть | Закрыть</button>
        <oda-dropdown ::opened="myOpened" :parent="$refs.button">
            <div>Here must be some Dropdown content</div>
            <div>Here must be some Dropdown content</div>
            <div>Here must be some Dropdown content</div>
        </oda-dropdown>
    `,
    props: {
        myOpened: false
    }
});
```


```info_md
Для связывания элемента-владельца и выпадающего окна желательно создавать отдельный компонент. Не следует включать в этот компонент другие визуальные элементы, используемые в проекте. Они могу увеличить размер области нечувствительной к щелчкам мыши, которыми пользователь будет пытаться закрыть окно.
```
Поясним на примерах.
Ниже приведены два примера визуально формирующие одну и туже web-страницу. В обоих примерах элементы **div** формируют желтую и розовую полосы вокруг элемента-владельца выпадающего окна.

В первом примере элементы **div** располагаются за пределами компонента, использующего выпадающее окно. В этом примере, чтобы закрыть окно, достаточно щелкнуть мышкой за пределами окна.

```html run_line_edit_loadoda_[my-component.html]_h=200_
<meta charset="UTF-8">
<div style="height: 70px; background: yellow"></div>
<my-component></my-component>
<div style="height: 80px; background: pink"></div>
<script type="module" src="/components/layouts/dropdown/dropdown.js"></script>
<script type="module">
    ODA({
        is: 'my-component',
        template: `
        <style>
            :host { width: 135px; }
        </style>
            <button @tap="myOpened= !myOpened" ref="button">Открыть | Закрыть</button>
            <oda-dropdown ::opened="myOpened" :parent="$refs.button">
                <div ~for="3">There is some Dropdown content</div>
            </oda-dropdown>
        `,
        props: {
            myOpened: false
        }
    });
</script>
```

Во втором примере элементы **div** располагаются внутри компонента, использующего выпадающее окно. Теперь, чтобы закрыть окно, необходимо щелкнуть мышкой не просто за пределами окна, а за пределами желтой и розовой полос.

```javascript _run_line_edit_loadoda_[my-component.js]_h=200_
    import '/components/layouts/dropdown/dropdown.js';
    ODA({
        is: 'my-component',
        template: `
            <div style="height: 70px; background: yellow"></div>
            <button @tap="myOpened= !myOpened" ref="button">Открыть | Закрыть</button>
            <oda-dropdown ::opened="myOpened" :parent="$refs.button">
                <div ~for="3">There is some Dropdown content</div>
            </oda-dropdown>
            <div style="height: 80px; background: pink"></div>
        `,
        props: {
            myOpened: false
        }
    });
```
