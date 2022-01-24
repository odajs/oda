Модификатор **reflectToAttribute** используется для отражения значения свойства в атрибутах хоста компонента.

Если значение этого модификатора можно привести к значению **true**, то в хост компонента будет добавлен атрибут с именем и значением соответствующего свойства. Эту дополнительную информацию можно использовать, например, для стилизации компонента.

Например:

```javascript _run_edit_[my-button.js]
ODA({
    is: 'my-button',
    template: `
        <span @tap="_onTap">{{text}}</span>
    `,
    props: {
        pressed: {
            default: false,
            reflectToAttribute: true
        },
        text: {
            default: 'Нажми на меня'
        }
    },
    _onTap() {
        this.pressed = !this.pressed;
        this.text = this.pressed ? "Я нажат" : "Я отжат";
    }
});
```

В этом компоненте задано свойство **pressed**, значение которого меняется при нажатии на элемент **span**. При изменении значения свойства с **false** на **true** в хост компонента будет добавлен атрибут **pressed**.

```javascript _line
<my-button pressed>
    #shadow-root (closed)
       <span>Я нажат</span>
</my-button>
```

А наоборот — при изменении значения свойства  c **true** на **false** атрибут будет удален из хоста компонента.

```javascript _line
<my-button>
    #shadow-root (closed)
       <span>Я отжат</span>
</my-button>
```

``` info_md
Такое поведение атрибута характерно только для свойств логического типа. При любом другом типе атрибут из хоста удаляться не будет, а будет изменяться только его значение.
```

Информацию о появившемся атрибуте можно использовать для стилизации вложенного компонента. Например, во внешнем компоненте можно задать CSS-правила с селектором по атрибуту вложенного компонента.

```javascript _run_edit_console_[my-component.js]_{my-button.js}
ODA({
    is: 'my-component',
    template: `
        <style>
            my-button {
                background-color: yellow;
                color: green;
            }
            my-button[pressed] {
                background-color: green;
                color: yellow;
            }
        </style>
        <my-button>Кнопка</my-button>
    `
});
```

При нажатии на элемент **span** у компонента **my-button** появляется атрибут **pressed**. В результате этого изменяется CSS-правило, применяемое к компоненту. При этом наследуемые CSS-объявления будут передаваться внутренним элементам компонента, изменяя стиль их отображения.

``` warning_md
CSS-объявления применяются только к самому компоненту, а не к его внутренним элементам. Если CSS-объявления не наследуются, то стиль внутренних элементов может не измениться.
```

Для ненаследуемых CSS-объявлений стилизацию внутренних элементов можно организовать с помощью псевдокласса **:host**, связанного с хостом самого компонента.

```javascript _run_edit_console_[my-button.js]
ODA({
    is: 'my-button',
    template: `
        <style>
            :host > button {
                display: block;
                background-color: yellow;
                color: green;
             }
            :host([pressed]) > button {
                display: block;
                background-color: green;
                color: yellow;
            }
        </style>
        <button @tap="_onTap">{{text}}</button>
    `,
    props: {
        pressed: {
            default: false,
            reflectToAttribute: true
        },
        text: {
            default: 'Нажми на меня'
        }
    },
    _onTap() {
        this.pressed = !this.pressed;
        this.text = this.pressed ? "Я нажата" : "Я отжата";
    }
});
```

В этом пример стиль задается внутри теневого дерева компонента с помощью псевдокласса **:host** с указанием комбинатора дочерних элементов **>** на элемент **button**. В результате этого кнопка будет изменять стиль отображения при каждом нажатии на нее.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/vM9AMqLOfyc?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
