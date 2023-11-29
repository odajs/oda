Признак **extends** используется для указания списка родительских компонентов, элементы которых будут унаследованы текущим компонентом.

Для организации списка сначала необходимо объявить родительские компоненты.

```javascript run_edit_[base-component-1.js]
ODA({
    is: 'base-component-1',
    template: `
        <div>Родитель 1</div>
    `
});
```

Фреймворк поддерживает множественное наследование, т.е. у одного и того же компонента может быть несколько родителей.

```javascript run_edit_[base-component-2.js]
ODA({
    is: 'base-component-2',
    template: `
        <div>Родитель 2</div>
    `
});
```

В списке **extends** родители указываются через запятую.

```javascript _run_edit_[my-component.js]_{base-component-1.js_base-component-2.js}
ODA({
    is: 'my-component',
    extends: 'base-component-1, base-component-2',
    template: `
        <div>Наследник</div>
    `
});
```

Порядок следования родителей в списке можно менять. В этом случае изменится порядок наследования их элементов.

```javascript _run_edit_[my-component.js]_{base-component-1.js_base-component-2.js}
ODA({
    is: 'my-component',
    extends: 'base-component-2, base-component-1',
    template: `
        <div>Наследник</div>
    `
});
```

Элементы самого наследника добавляются по умолчанию только после всех его родителей. Это правило можно изменить, указав в списке **extends** ключевое слово **this**, определяющее порядок следования именно его элементов.

```javascript _run_edit_[my-component.js]_{base-component-1.js_base-component-2.js}
ODA({
    is: 'my-component',
    extends: 'base-component-1, this, base-component-2',
    template: `
        <div>Наследник</div>
    `
});
```

Наследник получает прямой доступ к свойствам родителей.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'base-component-1',
    template: `
        <div>{{parent1}}</div>
    `,
    parent1: "Родитель 1"
});

ODA({
    is: 'base-component-2',
    template: `
        <div>{{parent2}}</div>
    `,
    parent2: "Родитель 2"
});

ODA({
    is: 'my-component',
    extends: 'base-component-1, base-component-2',
    template: `
        <div>Наследник = {{parent1}} + {{parent2}}</div>
    `
});
```

```info_md
Примечание — Родители, объединенные в одном компоненте, также получают прямой доступ к свойствам друг друга и к свойствам наследника.
```

Имена свойств в родителях могут совпадать. В этом случае одноименные свойства становятся общими для родителей. Т.е. через одноименные свойства родители будут влиять друг на друга.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'base-component-1',
    template: `
        <div>
            <button @click="name='Родитель 1'">Родитель 1</button>
            <span>{{name}}</span>
        </div>
    `,
    name: "Родитель 1"
});

ODA({
    is: 'base-component-2',
    template: `
        <div>
            <button @click="name='Родитель 2'">Родитель 2</button>
            <span>{{name}}</span>
        </div>
    `,
    name: "Родитель 2"
});

ODA({
    is: 'my-component',
    extends: 'base-component-1, base-component-2',
    template: `
        <div>Наследник</div>
    `
});
```

Пощелкайте по кнопкам и убедитесь, что изменение свойства **name** в одном из родителей сразу передается другому родителю.

Обратите внимание, что при создании компонента одноименные свойства инициализируются значениями, заданными в родителе, который указан последним в списке.

Если наследник имеет одноименные свойства с родителями, то они также будут общими. Они всегда будут инициализироваться значениями, заданными в наследнике, независимо от положения указателя **this** в списке родителей.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'base-component-1',
    template: `
        <div>
            <button @click="name='Родитель 1'">Родитель 1</button>
            <span>{{name}}</span>
        </div>
    `,
    name: "Родитель 1"
});

ODA({
    is: 'base-component-2',
    template: `
        <div>
            <button @click="name='Родитель 2'">Родитель 2</button>
            <span>{{name}}</span>
        </div>
    `,
    name: "Родитель 2"
});

ODA({
    is: 'my-component',
    extends: 'this, base-component-1, base-component-2',
    template: `
        <div>
            <span>{{name}}</span>
        </div>
    `,
    name: "Наследник"
});
```

Пощелкайте по кнопкам и убедитесь, что изменение свойства **name** в одном из родителей сразу передается другому родителю и наследнику.

Наследник получает прямой доступ к методам родителей.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'base-component-1',
    template: `
        <div>{{parent1()}}</div>
    `,
    parent1() { return "Родитель 1" }
});

ODA({
    is: 'base-component-2',
    template: `
        <div>{{parent2()}}</div>
    `,
    parent2() { return "Родитель 2" }
});

ODA({
    is: 'my-component',
    extends: 'base-component-1, base-component-2',
    template: `
        <div>Наследник = {{parent1()}} + {{parent2()}}</div>
    `
});
```

```info_md
Примечание — Родители, объединенные в одном компоненте, также получают прямой доступ к методам друг друга и к методам наследника.
```

Имена методов в родителях могут совпадать. В этом случае одноименные методы становятся общими для родителей.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'base-component-1',
    template: `
        <div>
            <span>{{name()}}</span>
        </div>
    `,
    name() { return "Родитель 1" }
});

ODA({
    is: 'base-component-2',
    template: `
        <div>
            <span>{{name()}}</span>
        </div>
    `,
    name() { return "Родитель 2" }
});

ODA({
    is: 'my-component',
    extends: 'base-component-1, base-component-2',
    template: `
        <div>Наследник</div>
    `
});
```

Обратите внимание, что одноименные методы из родителя, который указан последним в списке, перекрывают методы предшествующих родителей.












<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/zCwMK7TGCD8?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
