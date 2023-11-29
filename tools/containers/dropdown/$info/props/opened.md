Свойство **opened** предназначено для управления отображением выпадающего окна.

Установка свойства в значение **true** отображает выпадающее окно на веб-странице, значение **false** — закрывает окно.

При отображении выпадающее окно располагается поверх основного содержимого веб-страницы, закрывая его. Закрыть окно можно щелкнув мышкой за его пределами или нажав клавишу **Escape**, при этом свойство **opened** автоматически сбросится в значение **false**.

```javascript _run_line_edit_loadoda_[my-component.js]_h=160_
import '/components/layouts/dropdown/dropdown.js';
ODA({
    is: 'my-component',
    template: `
        <button @tap="myOpened= !myOpened" ref="button">Открыть | Закрыть</button>
        <span><b>opened</b>={{myOpened}}</span>
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
Обратите внимание на управление свойством **opened** компонента **oda-dropdown**. В примере выше использовался двунаправленный биндинг **::** для связывания со свойством **myOpened** родительского компонента.
А в примере ниже используется однонаправленное связывание **:**. Теперь окно нельзя закрыть, щелкнув мышкой за его пределами или нажав клавишу **Escape**. Это происходит потому, что свойство **opened** удерживается в значении **true** свойством **myOpened** родительского компонента. Эта особенность позволяет родительскому компоненту полностью управлять отображением выпадающего окна.
```

```javascript _run_line_edit_loadoda_[my-component.js]_h=160_
import '/components/layouts/dropdown/dropdown.js';
ODA({
    is: 'my-component',
    template: `
        <button @tap="myOpened= !myOpened" ref="button">Открыть | Закрыть</button>
        <oda-dropdown :opened="myOpened" :parent="$refs.button">
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

