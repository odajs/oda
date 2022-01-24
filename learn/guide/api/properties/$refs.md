**$refs** — это свойство, возвращающее объект со ссылками на все HTML-элементы компонента, у которых с помощью директивы **~ref** был задан уникальный идентификатор.

По умолчанию теневое дерево у всех компонентов будет создаваться в закрытом режиме. В результате этот ссылка **shadowRoot**, указывающая на теневое дерево, всегда будет возвращать значение **null**, т.е. будет невозможно получить c ее помощью доступ ко всем внутренним элементам компонента.

Например,

```javascript run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <span id="spn">{{label}}</span> <br>
        <button @tap="onTap">Найди меня</button>
    `,
    props: {
        label: 'Теневое дерево'
    },
    onTap() {
        this.label = String(this.shadowRoot);
    }
});
```

Кроме этого, метод **querySelector** всегда возвращает значение **null** при попытке поиска любого элемента компонента из светлого дерева.

Например,

```javascript run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <span id="spn">{{label}}</span> <br>
        <button @tap="onTap">Найди меня</button>
    `,
    props: {
        label: 'querySelector'
    },
    onTap() {
        this.label = String(this.querySelector('#spn'));
    }
});
```

В этом примере сам хост компонента, доступный через указатель **this**, находится в светлом дереве HTML-документа, и через него нельзя будет найти элемент с идентификатором **spn** внутри теневого дерева.

Также элементы теневого дерева не будут регистрироваться в глобальном объекте **window** при указании у них уникального идентификатора с помощью атрибута **id**.

Например,

```javascript run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <span id="spn">{{label}}</span> <br>
        <button @tap="onTap">Найди меня</button>
    `,
    props: {
        label: 'Глобальный объект window'
    },
    onTap() {
        this.label = String(window.spn);
    }
});
```

В данном примере невозможно обратиться к элементу **span** по его уникальному идентификатору **spn**, так как этот элемент находится в теневом дереве, и ссылка на него не будет по умолчанию добавляться в глобальный объект **window**.

Для решения этой проблемы с помощью директивы **~ref** у любого элемента компонента можно задать внутренний идентификатор. В результате этого ссылка на такой элемент будет добавлена в специальный объект **$refs**, используя который можно обратиться к соответствующему элементу компонента по имени его идентификатора.

Например,

```javascript run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <span ref="spn">{{label}}</span> <br>
        <button @tap="onTap">Найди меня</button>
    `,
    props: {
        label: 'Внутренний идентификатор'
    },
    onTap() {
        this.label = this.$refs.spn.localName;
    }
});
```

Обратите внимание, что директиву **~ref** можно использовать в литеральной форме — без указания символа **~**. В этом случае значение директивы будет восприниматься как строковый литерал, а не как JavaScript-выражение. В противном случае имя идентификатора необходимо указывать в апострофах для того, чтобы оно воспринималось строкой, а не командой языка JavaScript.

Например,

```javascript run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <span ~ref="'spn'">{{label}}</span> <br>
        <button @tap="onTap">Найди меня</button>
    `,
    props: {
        label: 'JavaScript-выражение'
    },
    onTap() {
        this.label = this.$refs.spn.localName;
    }
});
```

Если имя идентификатора не соответствует требованиям стандарта ECMAScript, то его необходимо указывать у объекта **$refs** внутри квадратных скобок в любых кавычках.

Например,

```javascript run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <span ~ref="'my-spn'">{{label}}</span> <br>
        <button @tap="onTap">Найди меня</button>
    `,
    props: {
        label: 'У меня сложное имя'
    },
    onTap() {
        this.label = this.$refs['my-spn'].localName;
    }
});
```

У метода **$refs** есть также псевдоним **$**, который можно использовать для упрощения записи.

Например,

```javascript run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <span ref="spn">{{label}}</span> <br>
        <button @tap="onTap">Найди меня</button>
    `,
    props: {
        label: 'У меня есть псевдоним'
    },
    onTap() {
        this.label = this.$.spn.localName;
    }
});
```

По сути методы **$** и **$refs** являются геттерами одноименных свойств и возвращают объект, хранящийся в ядре компонента **$core** под именем **refs**. Однако обращение к этому объекту напрямую может привести к возникновению ошибки, так как его значение формируется геттером **$refs**, и его объект **refs** будет оставаться пустым до первого вызова.

Например,

```javascript run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <span ref="spn">{{label}}</span> <br>
        <button @tap="onTap">Найди меня</button>
    `,
    props: {
        label: 'Найди меня'
    },
    onTap() {
        this.label = !this.$core.refs ? String(this.$core.refs) : this.$core.refs.spn.localName;
        this.$refs;
    }
});
```

В данном примере при первом нажатии на кнопку будет возвращено значение **null**, так как объект **refs**, находящийся в ядре компонента **$core**, еще не был задан геттером **$refs**. При втором нажатии на кнопку, он уже существует и с его помощью можно получить ссылку на внутренний элемент с идентификатором **spn** — точно так же, как и с помощью геттера **$refs**.

Из двух вариантов только последний является правильным. Поэтому всегда используйте геттер **$refs** для доступа к элементам компонента при обращении к ним по идентификатору.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/0bs64UjGgIM?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
