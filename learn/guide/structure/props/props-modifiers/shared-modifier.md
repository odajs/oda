Модификатор **shared** используется для включение механизма сквозного биндинга.

Если у свойства задать этот модификатор со значением **true**, то любое изменение этого свойства внутри компонента будет приводить к автоматическому изменению значений одноименных свойств у всех вложенных в него компонентов.

Например:

```javascript _run_edit_console_[my-component.js]_h=230_
ODA({
    is: 'my-component',
    template: `
        <label>Задайте размер фигуры <input type="range" max="100" min="20" style="width: 25vw" ::value="size">{{size}}</label>
        <my-square></my-square>
        <my-circle></my-circle>
    `,
    props: {
        size: {
            default: 50,
            shared: true,
        }
    }
});

ODA({
    is: 'my-square',
    template: `
        <div ~style="{width: \`\${size}px\`, height: \`\${size}px\`, background: 'burlywood'}"></div>
    `,
    props: {
        size: 50
    }
});


ODA({
    is: 'my-circle',
    template: `
        <style>
            div {
                border-radius: 50%;
                background: bisque;
            }
        </style>
        <div ~style="{width: \`\${size}px\`, height: \`\${size}px\`}"></div>
    `,
    props: {
        size: 50
    }
});
```

В данном примере изменение свойства **size** у компонента **my-component** автоматически приведет к изменению одноименных свойств у компонентов, отображающих круг и квадрат. В этом случае директиву обычного биндинга можно не использовать. Фактически модификатор сквозного биндинга является ее синтаксическим упрощением.

Механизм сквозного биндинга действует только на один уровень вложенности вниз, т.е. если у вложенного компонента есть другой вложенный компонент, то изменение свойства его прародителя не окажет на него никакого воздействия. Для того чтобы механизм сквозного биндинга воздействовал на пранаследников, родительские компоненты должны разрешить это делать, указав модификатор **shared** со значением **true** в своих свойствах. Только после этого изменение свойства на самом верхнем уровне будет приводить к изменению одноименных свойств на всех нижележащих уровнях.

Например,

```javascript _run_edit_console_[my-component.js]_h=230_
ODA({
    is: 'my-component',
    template: `
        <label>Задайте размер фигуры <input type="range" max="200" min="50" style="width: 25vw" ::value="size"> </label>
        <my-square></my-square>
    `,
    props: {
        size: {
            default: 100,
            shared: true,
        },
        isShared: true,
    }
});

ODA({
    is: 'my-square',
    template: `
        <div ~style="{width: \`\${size}px\`, height: \`\${size}px\`, background: 'burlywood'}">
            <my-circle></my-circle>
        </div>
    `,
    props: {
        size: {
            default: 100,
            shared: true,
        }
    }
});

ODA({
    is: 'my-circle',
    template: `
        <style>
            div {
                border-radius: 50%;
                background: bisque;
                position: relative;
            }
        </style>
        <div ~style="{width: \`\${size}px\`, height: \`\${size}px\`}"></div>
    `,
    props: {
        size: 100

    }
});
```

В этом примере размер круга синхронно изменяется с размером квадрата, так как компонент **my-square** явно разрешил передавать изменение своего свойства **size** вложенным в него компонентам. Если модификатор  **shared** у этого свойства установить в значение **false**, то круг изменять свои размеры перестанет.

Механизм сквозного биндинга динамически отключить невозможно. Он задается изначально при создании компонента. Дальнейшие изменения этого модификатора ни к каким результатам не приведет.

Например,

```javascript _run_edit_console_[my-component.js]_h=230_
ODA({
    is: 'my-component',
    template: `
        <label>Разрешить сквозной биндинг <input type="checkbox" ::value="properties.size.shared"></label>
        <label>Задайте размер фигуры <input type="range" max="200" min="50" style="width: 25vw" ::value="size"> </label>
        <my-square></my-square>
    `,
    props: {
        size: {
            default: 100,
            shared: true,
        }
    }
});

ODA({
    is: 'my-square',
    template: `
        <div ~style="{width: \`\${size}px\`, height: \`\${size}px\`, background: 'burlywood'}">
            <my-circle></my-circle>
        </div>
    `,
    props: {
        size: {
            default: 100,
            shared: true,
        }
    }
});

ODA({
    is: 'my-circle',
    template: `
        <style>
            div {
                border-radius: 50%;
                background: bisque;
                position: relative;
            }
        </style>
        <div ~style="{width: \`\${size}px\`, height: \`\${size}px\`}"></div>
    `,
    props: {
        size: 100

    }
});
```

Изначально модификатор **shared** не включен, поэтому по умолчанию механизм сквозного биндинга ни у каких свойств работать не будет.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/u_XcFE-K8bM?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>

