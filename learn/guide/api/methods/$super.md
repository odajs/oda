**$super** — это метод, который позволяет вызывать родительские методы относительно контекста текущего компонента.

Данный метод объявляется следующим образом:

```javascript
$super (parentName, name, ...args) {...}
```

Ему передаются 3 параметра:

1. **parentName** — имя родительского класса. Например, 'my-parent'.
1. **name** — имя вызываемого метода. Например, 'myMethod'.
1. **...args** — параметры вызываемого метода.

При наследовании компонент по умолчанию приобретает все методы своих родителей и вызывает их автоматически относительно своего контекста. Однако если в наследнике задать метод с тем же самым именем, что и у родительского компонента, то будет уже невозможно вызвать родительский метод. Для это придется использовать метод **$super**, так как это показано в следующем примере.

```javascript run_edit_[my-component.js]
 ODA({
    is: 'my-parent',
    template: `
        <span>{{label}}</span><br>
    `,
    props: {
        label: 'Результат вызова'
    },
    myMethod() {
        this.label = 'Родительский метод';
    }
});

ODA({
    is: 'my-component',
    extends: 'my-parent',
    template: `
        <button @tap="myMethod">Нажми меня</button>
    `,
    myMethod() {
        this.$super('my-parent', 'myMethod');
        this.label += ' вызван из метода наследника';
    }
});
```

Если родительскому методу необходимо передать параметры, то это можно сделать через дополнительный параметр **...args** метода **$super**.

Например,

```javascript run_edit_[my-component.js]
 ODA({
    is: 'my-parent',
    template: `
        <span>{{label}}</span><br>
    `,
    props: {
        label: 'Результат вызова'
    },
    myMethod(name, method) {
        this.label = name + ' ' + method;
    }
});

ODA({
    is: 'my-component',
    extends: 'my-parent',
    template: `
        <button @tap="myMethod">Нажми меня</button>
    `,
    myMethod() {
        this.$super('my-parent', 'myMethod', 'Родительский', 'метод');
        this.label += ' вызван из метода наследника';
    }
});
```

В данном пример метод **$super** вызывает родительский метод и через параметр **...arg** передает ему два необходимых параметра **name** и **method**.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/AiVIn0OK2y8?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
