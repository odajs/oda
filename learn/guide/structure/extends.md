Признак **extends** используется для указания списка родительских компонентов, элементы которых будут унаследованы текущим компонентом.

Для организации списка сначала необходимо объявить родительские компоненты.

```javascript run_edit_console_[base-component-1.js]
ODA({
    is: 'base-component-1',
    template: `
        <div>Родитель 1</div>
    `
});
```

Фреймворк поддерживает множественное наследование, т.е. у одного и того же компонента может быть несколько родителей.

```javascript run_edit_console_[base-component-2.js]
ODA({
    is: 'base-component-2',
    template: `
        <div>Родитель 2</div>
    `
});
```

В списке **extends** родители указываются через запятую.

```javascript _run_edit_console_[my-component.js]_{base-component-1.js_base-component-2.js}
ODA({
    is: 'my-component',
    extends: 'base-component-1, base-component-2',
    template: `
        <div>Наследник</div>
    `
});
```

Порядок следования родителей в списке можно менять.

```javascript _run_edit_console_[my-component.js]_{base-component-1.js_base-component-2.js}
ODA({
    is: 'my-component',
    extends: 'base-component-2, base-component-1',
    template: `
        <div>Наследник</div>
    `
});
```

В этом случае измениться приоритет наследования их элементов.

Элементы самого наследника добавляются по умолчанию только после всех его родителей. Это правило можно изменить, указав в списке **extends** ключевое слово **this**, определяющее порядок следования именно его элементов.

```javascript _run_edit_console_[my-component.js]_{base-component-1.js_base-component-2.js}
ODA({
    is: 'my-component',
    extends: 'base-component-1, this, base-component-2',
    template: `
        <div>Наследник</div>
    `
});
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/zCwMK7TGCD8?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
