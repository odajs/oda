**Директива ~for** используется для отрисовки списка элементов на основе массива данных или свойств объекта.

**Для массивов** в этой директиве обязательно должно быть указано имя самого массива данных и ссылка на его текущий элемент.

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~for="item in items">Элемент: {{item}} </div>
    `,
    props: {
        items: [
            'A', 'B', 'C'
        ]
    }
});
```

В этом примере для каждого элемента в массиве **items** будет создан свой собственный HTML-элемент **div**, в котором будет выведено значение элемента массива, доступное через указатель на него **item**.

В расширенной форме записи, кроме ссылки на текущий элемент можно указать ссылку и на его индекс.

Например:

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~for="item, index in items">Элемент[{{index}}]: {{item}}</div>
    `,
    props: {
        items: [
            'A', 'B', 'C'
        ]
    }
});
```

В этом случае кроме значения элемента массива будет выводится его текущий индекс, используя ссылку на него **index**, записанную после имени элемента через запятую.

```info_md
Кроме структуры цикла for...in, можно использовать структуру for...of.
```

Например:

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~for="item, index of items">Элемент[{{index}}]: {{item}}</div>
    `,
    props: {
        items: [
            'A', 'B', 'C'
        ]
    }
});
```

Выполнение этого примера будет абсолютно одинаковым с предыдущим.

**Для объектов** в директиве ~for обязательно должно быть указано имя самого объекта и ссылка на значение его текущего свойства.

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~for="value in object">Свойство: {{value}} </div>
    `,
    props: {
        object: {
            key1: 'A',
            key2: 'B',
            key3: 'C',
        }
    }
});
```

В расширенной форме записи, кроме значения текущего свойства объекта можно указать имя самого свойства, используя ссылку на него. Это ссылка должна быть записана после ссылки на значения самого свойства через запятую.

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~for="value, name in object">{{name}}: {{value}} </div>
    `,
    props: {
        object: {
            key1: 'A',
            key2: 'B',
            key3: 'C',
        }
    }
});

В полной форме, кроме ссылки на значение и имя текущего свойства можно указать еще и индекс на это свойство через запятую.

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~for="value, name, index in object">{{index}}. {{name}}: {{value}} </div>
    `,
    props: {
        object: {
            key1: 'A',
            key2: 'B',
            key3: 'C',
        }
    }
});

```info_md
Кроме структуры цикла for...in при обращении к свойствам объектам можно использовать структуру for...of.
```

Например:

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~for="value, name of object">{{index}}. {{name}}: {{value}} </div>
    `,
    props: {
        object: {
            key1: 'A',
            key2: 'B',
            key3: 'C',
        }
    }
});

