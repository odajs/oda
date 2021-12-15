Свойство **intersect** определяет, будет ли выпадающее окно перекрывать изображение элемента-владельца.

Если свойство имеет значение **true**, то выпадающее окно перекрывает изображение владельца. Если значение **false** — не перекрывает. Значение **false** используется по умолчанию.

```javascript _run_line_edit_loadoda_[my-component.js]_h=160_
import '/components/layouts/dropdown/dropdown.js';
ODA({
    is: 'my-component',
    template: `
        <button @tap="myOpened= !myOpened" ref="button">Открыть | Закрыть</button>
        <label><input type="checkbox" ::value="myIntersect">Перекрывать владельца</label>
        <oda-dropdown ::opened="myOpened" :parent="$refs.button" :intersect="myIntersect" >
            <div>Here must be some Dropdown content</div>
            <div>Here must be some Dropdown content</div>
            <div>Here must be some Dropdown content</div>
        </oda-dropdown>
    `,
    props: {
        myOpened: false,
        myIntersect: false
    }
});
```

