Метод **$** осуществляет поиск в компоненте HTML-элемента, удовлетворяющего селектору поиска. Он возвращает ссылку на первый найденный элемент или пустую ссылку, если элемент не найден. В целом метод **$** работает аналогично методу **querySelector** языка JavaScript.

Метод **$$** осуществляет поиск в компоненте всех HTML-элементов, удовлетворяющих селектору поиска. Он возвращает массив ссылок на найденные элементы или пустой массив, если ни один элемент не найден. В целом метод **$$** работает аналогично методу **querySelectorAll** языка JavaScript.

Методы объявляются внутри компонента следующим образом:

```javascript
$(CSS-selector)
$$(CSS-selector)
```

Единственным параметром методов является CSS-селектор искомых элементов.

Например,

```javascript run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <span id="id1">Тип 1-го элемента: {{label1}}</span>
        <div id="id2">Тип 2-го элемента: {{label2}}</div>
        <button @tap="onTap">Найди меня</button>
    `,
    label1: '--',
    label2: '--',
    onTap() {
        this.label1 = this.$('#id1').localName;
        this.label2 = this.$$('#id2')[0].localName;
    }
});
```

В данном примере элемент **span** был найден по своему идентификатору **«id1»** методом **$**. А элемент **div** найден по идентификатору **«id2»** методом **$$**.

В зону поиска методов попадают также HTML-элементы из родительских компонентов.

Например,

```javascript run_edit_[my-component.js]
ODA({
    is: 'parent-component',
    template: `
        <div id='parent2'>
            <span id='parent1'>Родительский компонент</span>
        </div>
    `
});
ODA({
    is: 'my-component',
    extends: 'parent-component',
    template: `
        <div>Тип 1-го элемента: {{label1}}</div>
        <div>Тип 2-го элемента: {{label2}}</div>
        <button @tap="onTap">Найди меня</button>
    `,
    label1: '--',
    label2: '--',
    onTap() {
        this.label1 = this.$('#parent1').localName;
        this.label2 = this.$$('#parent2')[0].localName;
    }
});
```

В данном примере элементы **span** и **div** из родительского компонента были найдены методами **$** и **$$** по идентификаторам **«parent1»** и **«parent2»**.

Методы не осуществляют поиск HTML-элементов во вложенных компонентах.

Например,

```javascript run_edit_[my-component.js]
ODA({
    is: 'embedded-component',
    template: `
        <div id='embedded2'>
            <span id='embedded1'>Вложенный компонент</span>
        </div>
    `
});
ODA({
    is: 'my-component',
    template: `
        <embedded-component></embedded-component>
        <div>Ссылка на 1-й элемент: {{label1}}</div>
        <div>Ссылка на 2-й элемент: {{label2}}</div>
        <button @tap="onTap">Найди меня</button>
    `,
    label1: '--',
    label2: '--',
    onTap() {
        this.label1 = '' + this.$('#embedded1');
        this.label2 = '' + this.$$('#embedded2')[0];
    }
});
```

В данном примере оба метода не смогли найти HTML-элементы с идентификаторами **embedded1** и **embedded2** во вложенном компоненте **embedded-component**.




В отличие от методов **querySelector** и **querySelectorAll**, методы **$** и **$$** корректно выполняются и не генерируют исключение, если в параметре в качестве селектора указана пустая строка.

Например,

```javascript run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div>Результат метода $(""): {{print("$")}}</div>
        <div>Результат метода $$(""): [{{print("$$")}}]</div>
        <div>Результат метода querySelector(""): {{print("querySelector")}}</div>
        <div>Результат метода querySelectorAll(""): {{print("querySelectorAll")}}</div>
    `,
    print(method) {
        try {
            return this[method]("");
        } catch(event) {
            return event.message;
        }
    }
});
```

Данный пример показывает, что при использовании пустой строки в качестве селектора, методы **$** и **$$** корректно отрабатывают не находя соответствующего элемента. В тоже время выполнение методов **querySelector** и **querySelectorAll** приводит к возникновению исключения.
