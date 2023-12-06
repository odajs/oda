Фреймворк объединяет все свойства и методы наследника и родителей в один объект и присваивает ссылку на него указателям **this** наследника и родителей.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'base-component',
    template: `
        <div>{{parent1}}</div>
    `,
    get thisInParent() {
        return this;
    }
});

ODA({
    is: 'my-component',
    extends: 'base-component',
    template: `
        <div>Сравнение указателей: {{this == thisInParent}}</div>
    `
});
```

В результате наследник и родители получают прямой доступ к свойствам и методам друг друга.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'base-component-1',
    template: `
        <div>Я родитель 1. Имею доступ к геттеру {{parent2}} и методу {{successor()}}</div>
    `,
    parent1: "родителя 1"
});

ODA({
    is: 'base-component-2',
    template: `
        <div>Я родитель 2. Имею доступ к свойству {{parent1}} и методу {{successor()}}</div>
    `,
    get parent2() { return "родителя 2" }
});

ODA({
    is: 'my-component',
    extends: 'base-component-1, base-component-2',
    template: `
        <div>Я наследник. Имею доступ к свойству {{parent1}} и геттеру {{parent2}}</div>
    `,
    successor() { return "наследника" }
});
```

Имена свойств в родителях могут совпадать. В этом случае в компоненте используется свойство, объявленное в родителе, находящемся ближе к концу списка **extends**.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'base-component-1',
    template: `
        <div>{{name}}</div>
    `,
    name: "Родитель 1"
});

ODA({
    is: 'base-component-2',
    template: `
        <div>{{name}}</div>
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

В этом примере свойство **name** является общим для обоих родителей и инициализируется значением из компонента **base-component-2**, т.к. он расположен последним в списке **extends**.

Если наследник имеет одноименные свойства с родителями, то они также будут общими. Они всегда будут инициализироваться значениями, заданными в наследнике, независимо от положения указателя **this** в списке родителей.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'base-component-1',
    template: `
        <div>{{name}}</div>
    `,
    name: "Родитель 1"
});

ODA({
    is: 'base-component-2',
    template: `
        <div>{{name}}</div>
    `,
    name: "Родитель 2"
});

ODA({
    is: 'my-component',
    extends: 'this, base-component-1, base-component-2',
    template: `
        <div>{{name}}</div>
    `,
    name: "Наследник"
});
```

В этом примере свойство **name** является общим и для родителей и для наследника. Оно инициализировано значением из наследника, не смотря на то, что ключевое слово **this** расположено первым в списке **extends**.

Одноименные свойства в наследнике и родителях могут иметь модификаторы, изменяющие их функционирование. В процессе объединения таких свойств в одно, фреймворк добавляет все примененные модификаторы в результирующее свойство.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'base-component-1',
    template: `
        <div>{{name}}</div>
    `,
    name: {
        $def: "Родитель 1",
        $readOnly: true
    }
});

ODA({
    is: 'base-component-2',
    template: `
        <div>{{name}}</div>
    `,
    name: "Родитель 2"
});

ODA({
    is: 'my-component',
    extends: 'base-component-1, base-component-2',
    template: `
        <button @tap="assign">Присвоить значение</button>
        <span>{{message}}</span>
    `,
    message: "",
    assign() {
        try {
            this.name = "Наследник";
        } catch(e) {
            this.message = `${e.name}: ${e.message}`
        }
    }
});
```

В данном примере свойство **name** в родителе **base-component-1** имеет модификатор **$readOnly**, превращающий его в константу. В родителе **base-component-2** объявлено одноименное свойство, но уже без этого модификатора. Нажмите на кнопку, чтобы присвоить ему новое значение. Возникнет исключение, и инструкция **try…catch** выведет сообщение, что свойство **name** доступно только для чтения. На экране видно, что значение свойства было взято из второго родителя, а модификатор **$readOnly** - из первого.

Если одноименные свойства имеют одноименные модификаторы, то значение модификатора берется из родителя, находящегося ближе к концу списка **extends**. Если такой модификатор имеется у свойства в наследнике, то его значение берется из наследника.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'base-component-1',
    template: `
        <div>{{name}}</div>
    `,
    name: {
        $def: "Родитель 1",
        $readOnly: true
    }
});

ODA({
    is: 'base-component-2',
    template: `
        <div>{{name}}</div>
    `,
    name: {
        $def: "Родитель 2",
        $readOnly: false
    }
});

ODA({
    is: 'my-component',
    extends: 'base-component-1, base-component-2',
    template: `
        <button @tap="assign">Присвоить значение</button>
        <span>{{message}}</span>
    `,
    message: "",
    assign() {
        try {
            this.name = "Наследник";
        } catch(e) {
            this.message = `${e.name}: ${e.message}`
        }
    }
});
```

Данный пример аналогичен предыдущему, только свойство **name** во втором родителе объявлено с модификатором **$readOnly**, имеющим значение **false**. Поскольку этот родитель находится последним в списке **extends**, действие модификатора **$readOnly** будет отменено, и свойство **name** будет доступно по записи. В этом можно убедиться нажав на кнопку.

Аналогичным образом объединяются геттеры и сеттеры одноименных свойств.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'base-component-1',
    template: `
        <div>{{date}}</div>
    `,
    get date() {
        return this._date;
    }
});

ODA({
    is: 'base-component-2',
    template: `
        <div>{{date}}</div>
    `,
    set date( val ) { 
        this._date = val;
    }
});

ODA({
    is: 'my-component',
    extends: 'base-component-1, base-component-2',
    template: `
        <button @tap="date=new Date()">Текущая дата</button>
    `,
    _date: new Date(0)
});
```

В данном примере в родителе 1 объявлен геттер **date**, а в родителе 2 объявлен сеттер **date**. По результатам работы программы видно, что фреймворк объединил геттер и сеттер в одно свойство.

Аналогичным образом замещаются одноименные методы в дочернем и родительских компонентах. При этом необходимо учитывать, что методы, реализующие хуки жизненного цикла, имеют предопределенные имена и неизбежно будут перекрываться как все одноименные методы.

Например,

```javascript _run_error_edit_[my-component.js]
ODA({
    is: 'base-component-1',
    template: `
        <div>{{message1}}</div>
    `,
    message1: "Родитель №1 не инициализирован",
    ready() {
        this.message1 = "Родитель №1 инициализирован";
    }
});

ODA({
    is: 'base-component-2',
    template: `
        <div>{{message2}}</div>
    `,
    message2: "Родитель №2 не инициализирован",
    ready() {
        this.message2 = "Родитель №2 инициализирован";
    }
});

ODA({
    is: 'my-component',
    extends: 'base-component-1, base-component-2',
    template: `
        <div>{{message3}}</div>
    `,
    message3: "Наследник не инициализирован",
    ready() {
        this.message3 = "Наследник инициализирован успешно";
    }
});
```

В данном примере видно, что из трех объявленных хуков **ready** остался только тот, который был определен в наследнике. В результате действия по инициализации свойств, унаследованных от родителей, выполнены не были.

```info_md
Во фреймворке используются псевдообъекты *$listeners*, *$observers*, *$keyBindings* и *$innerEvents*. Они служат только для регистрации методов специального назначения, поэтому при наследовании эти объекты не замещают друг друга, а объединяют свое содержимое.
```

Порядок наследования одноименных методов, являющихся обозревателями свойств, зависит от способа их объявления. Если одноименные методы объявлены внутри псевдообъекта **$observers**, то будет использоваться метод, объявленный в родителе, находящемся ближе к началу списка **extends**. Если одноименные методы объявлены за пределами псевдообъекта **$observers**, то будет использоваться метод, объявленный в родителе, находящемся ближе к концу списка **extends**. В любом случае, если одноименный обозреватель объявлен в наследнике, то используется именно он.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'base-component-1',
    template: `
        <div>{{message1}}</div>
    `,
    message1: "",
    $observers: {
        observer1( counter ) {
            this.message1 = "Родитель №1 счетчик: " + counter;
        },
        observer2: "date"
    },
    observer2( date ) {
        this.message2 = "Родитель №1 дата: " + date;
    }
});

ODA({
    is: 'base-component-2',
    template: `
        <div>{{message2}}</div>
    `,
    message2: "",
    $observers: {
        observer1( counter ) {
            this.message1 = "Родитель №2 счетчик: " + counter;
        },
        observer2: "date"
    },
    observer2( date ) {
        this.message2 = "Родитель №2 дата: " + date;
    }
});

ODA({
    is: 'my-component',
    extends: 'base-component-1, base-component-2',
    template: `
        <button @tap="++counter; date=new Date()">Increment</button>
    `,
    counter: 0,
    date: new Date(0)
});
```

В данном примере видно, что метод обозревателя **observer1**, объявленный внутри псевдообъекта **$observers**, берется из родителя №1, который находится ближе к началу списка **extends**. А метод обозревателя **observer2**, объявленный за пределами псевдообъекта, берется из родителя №2, потому что он находится ближе к концу списка **extends**.

Порядок наследования одноименных методов, являющихся слушателями событий, также зависит от способа их объявления. Если одноименные методы объявлены внутри псевдообъекта **$listeners**, то будет использоваться метод, объявленный в родителе, находящемся ближе к началу списка **extends**. Если одноименные методы объявлены за пределами псевдообъекта **$listeners**, то будет использоваться метод, объявленный в родителе, находящемся ближе к концу списка **extends**. В любом случае, если одноименный слушатель объявлен в наследнике, то используется именно он.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'base-component-1',
    $listeners: {
        tap() {
            this.message = "Родитель №1: Нажата левая кнопка";
        },
        contextmenu: 'cMenu'
    },
    cMenu() {
        this.message = "Родитель №1: Нажата правая кнопка";
    }
});

ODA({
    is: 'base-component-2',
    $listeners: {
        tap() {
            this.message = "Родитель №2: Нажата левая кнопка";
        },
        contextmenu: 'cMenu'
    },
    cMenu() {
        this.message = "Родитель №2: Нажата правая кнопка";
    }
});

ODA({
    is: 'my-component',
    extends: 'base-component-1, base-component-2',
    template: `
        <button>{{message}}</button>
    `,
    message: "Нажми на меня левой или правой кнопкой мыши"
});
```

В данном примере видно, что метод слушателя для события **tap**, объявленный внутри псевдообъекта **$listeners**, берется из родителя №1, который находится ближе к началу списка **extends**. А метод слушателя для события **contextmenu**, объявленный за пределами псевдообъекта, берется из родителя №2, потому что он находится ближе к концу списка **extends**.

