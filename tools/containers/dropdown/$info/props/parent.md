Свойство **parent** хранит указатель на элемент, к которому привязано выпадающее окно. Указатель на элемент создается директивой [**~ref**](https://odajs.org/#learn/docs#learn/docs/guide/structure/template/jsx/directives/~ref.md).

```javascript _run_line_edit_loadoda_[my-component.js]_h=160_
import '/components/layouts/dropdown/dropdown.js';
ODA({
    is: 'my-component',
    template: `
        <button @tap="myOpened= !myOpened; myParent=$refs.button1" ref="button1">Это моё окно</button>
        <button @tap="myOpened= !myOpened; myParent=$refs.button2" ref="button2">Нет это моё окно</button>
        <oda-dropdown ::opened="myOpened" :parent="myParent">
            <div>Here must be some Dropdown content</div>
            <div>Here must be some Dropdown content</div>
            <div>Here must be some Dropdown content</div>
        </oda-dropdown>
    `,
    props: {
        myOpened: false,
        myParent: null
    }
});
```

Если свойство **parent** не инициализировано, то выпадающее окно открывается в текущей позиции курсора мыши.

```javascript _run_line_edit_loadoda_[my-component.js]_h=160_
import '/components/layouts/dropdown/dropdown.js';
ODA({
    is: 'my-component',
    template: `
        <span>Откройте окно и щелкните мышкой по пустому полю</span>
        <button @tap="myOpened= !myOpened">Открыть | Закрыть</button>
        <oda-dropdown :opened="myOpened" >
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

Если свойству **parent** присвоить значение, не являющееся ссылкой на HTML-элемент, то выпадающее окно открывается в левом верхнем углу свободной части экрана.

```javascript _run_line_edit_loadoda_[my-component.js]_h=160_
import '/components/layouts/dropdown/dropdown.js';
ODA({
    is: 'my-component',
    template: `
        <button @tap="myOpened= !myOpened">Открыть | Закрыть</button>
        <div style="height: 75px; background-color: yellow">Резервируем место</div>
        <oda-dropdown ::opened="myOpened" :parent="'строка'">
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

