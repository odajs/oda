**listen** — это метод, который позволяет зарегистрировать определенный обработчик для одного или нескольких событий.

Он объявляется внутри компонента следующим образом:

```javascript
listen(event='', callback, props = {target: this, once: false, useCapture: false})
```

Ему передаются 3 параметра:

1. **event** — список типов событий, для которых назначается обработчик. Если указывается сразу несколько событий, то в списке они должны разделятся запятыми. Например, **'click, contextmenu'**.
1. **callback** — обработчик, который будет выполняться при возникновении указанного события. Например, **()=>{console.log('Обработчик события')}**.
1. **props** — объект с дополнительными параметрами, управляющий регистрацией обработчика события. Его можно не указывать, тогда в этом случае будут использованы параметры по умолчанию **{target: this, once: false, useCapture: false}**.
    1. **target** — определяет HTML-элемент, для которого назначается обработчик. Если ссылка на HTML-элемент не указана, то обработчик будет зарегистрирован для всего компонента.
    1. **once** — значение **true** указывает, что обработчик должен быть вызван не более одного раза, т.е. обработчик будет автоматически удален после первого же вызова.
    1. **useCapture** — определяет, для какой фазы распространения события будет зарегистрирован обработчик. Значение **true** регистрирует обработчик для фазы погружения (перехвата), **false** — для фазы всплытия.

Например,

```javascript _run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <button ref='btn'>{{label}}</button>
    `,
    props: {
        label: 'Нажми на меня'
    },
    onTap() {
        this.label = this.label === 'Ты нажал на меня' ? 'Нажми на меня' : 'Ты нажал на меня';
    },
    ready() {
        this.listen('tap', 'onTap', {target: this.$refs.btn});
    }
});
```

Обратите внимание, что имя регистрируемого обработчика **onTap** передается методу **listen** в виде строки, а не в виде ссылки на функцию. В этом случае метод **listen** с помощью метода **bind** создает специальную связанную функцию для обработчика, которая сохраняет указатель на контекст компонента, т.е. указатель **this** внутри обработчика будет всегда ссылаться на сам компонент.

Если методу **listen** передать не имя, а ссылку на обработчик, то этот обработчик будет вызван в несвязанном с компонентом контексте.

Например,

```javascript _run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <button ref='btn'>{{label}}</button>
    `,
    props: {
        label: 'Кто я?'
    },
    onTap() {
        this._target.$domHost.label=this.constructor.name;
    },
    ready() {
        this.listen('tap', this.onTap, {target: this.$refs.btn});
    }
});
```

В данном примере указатель **this** будет ссылаться на объект класса **odaEventTap**, от имени которого будет вызываться обработчик события **tap**.

У этого объекта есть скрытый параметр **_target**, через который можно получить доступ к самому компоненту. Но такая возможность является недокументированной и использовать ее в реальных проектах не рекомендуется. В будущем это свойство может быть изменено или даже удалено по решению разработчиков.

С помощью  метода **bind** к обработчику можно привязать контент.

Например,

```javascript _run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <button ref='btn'>{{label}}</button>
    `,
    props: {
        label: 'Кто я?'
    },
    onTap() {
        this.label=this.constructor.name;
    },
    ready() {
        this.listen('tap', this.onTap.bind(this), {target: this.$refs.btn});
    }
});
```

Однако в этом случае будет создана анонимная обёрточная функция, в теле которой будет вызываться метод **onTap**. В результате этого будет уже невозможно отменить регистрацию этого обработчика методом **unlisten**.

Если использовать стрелочную функцию в качестве обработчика события, то контекст внутри нее будет всегда связан с самим компонентом.

Например,

```javascript _run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <button ref='btn'>{{label}}</button>
    `,
    props: {
        label: 'Чей я?'
    },
    ready() {
        this.listen('tap', ()=>{this.label = this.constructor.name}, {target: this.$refs.btn});
    }
});
```

Если в качестве обработчика использовать анонимную функцию, то указатель **this** будет ссылаться уже не на сам компонент, а на специальный объект события, в контексте которого будет вызываться данная функция.

Например,

```javascript _run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <button ref='btn'>{{label}}</button>
    `,
    props: {
        label: 'Кто я?'
    },
    ready() {
        this.listen('tap',function () {this._target.$domHost.label=this.constructor.name}, {target: this.$refs.btn});
    }
});
```

К анонимной функции, как и к методу, с помощью метода **bind** можно привязать контекст компонента.  Однако отменить такой обработчик методом **unlisten** будет уже невозможно.

Например,

```javascript _run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <button ref='btn'>{{label}}</button>
    `,
    props: {
        label: 'Кто я?'
    },
    ready() {
        this.listen('tap', (function () {this.label=this.constructor.name}).bind(this), {target: this.$refs.btn});
    }
});
```

В данном примере указатель **this** будет ссылаться на сам компонент, а не на объект класса **odaEventTap**.

Обработчику можно передать объект события в списке параметров.

Например,

```javascript _run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <button ref='btn'>{{label}}</button>
    `,
    props: {
        label: 'Нажми на меня'
    },
    onTap(e) {
        this.label = e.constructor.name;
    },
    ready() {
        this.listen('tap', 'onTap', {target: this.$refs.btn});
    }
});
```

В этом примере через параметр **e** обработчика **onTap** можно узнать имя класса объекта события. В данном случае — это **odaCustomEvent**.

Для того чтобы событие было обработано только один раз, необходимо в третьем параметре метода **listen** указать дополнительное свойство **once** со значением **true**.

Например,

```javascript _run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <button ref='btn'>{{label}}</button>
    `,
    props: {
        label: 'Я слушаю тебя'
    },
    onTap() {
        this.label = this.label === 'Я слушаю тебя' ? 'Я уже не слышу тебя' : 'Я слушаю тебя';
    },
    ready() {
        this.listen('tap','onTap', {target: this.$refs.btn, once:true});
    }
});
```

В этом случае обработчик после первого вызова будет автоматически удален, и все последующие нажатия на кнопку **button** ни к каким действиям приводить уже не будут.

Если необходимо назначить один и тот же обработчик для разных событий, то в первом параметре метода **listen** можно перечислить типы событий через запятую.

Например,

```javascript _run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <button ref='btn'>{{label}}</button>
    `,
    props: {
        label: 'Нажми на меня правой или левой кнопкой мыши'
    },
    onTap(e) {
        switch(e.type) {
            case 'tap': this.label = 'Нажат левая кнопка мыши'; break;
            case 'contextmenu': this.label = 'Нажат правая кнопка мыши'; break;
        }
    },
    ready() {
        this.listen('tap, contextmenu','onTap',{target: this.$refs.btn});
    }
});
```

В данном примере один и тот же обработчик будет срабатывать при нажатии как левой кнопки мыши, так и правой.

Если в объекте не указать дополнительные параметры **target** и **useCapture**, то они будут заданы по умолчанию, т.е. для компонента будет зарегистрирован слушатель (**target**=**this**), а событие будет обрабатываться при «всплытии» (**useCapture**=**false**).

Например,

```javascript _run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <button>Нажми на меня: {{target}}</button>
    `,
    props: {
        target: ""
    },
    onTap(e) {
        this.target=e.target.constructor.name;
    },
    ready() {
        this.listen('tap','onTap');
    }
});
```

В данном примере нажатие мышкой на кнопку **button** будет приводить к вызову обработчика **onTap** в фазе всплытия события **tap**, при этом свойство **target** по умолчанию будет ссылаться на сам компонент.

Метод **listen** позволяет задать любой целевой источник обработки события, а не только сам компонент.

```javascript _run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <span>Щелкните в окне примера, чтобы показать или скрыть флаг</span>
        <div style="width:100px; border:solid 1px" ~show="show">
            <div style="width:100px; background:white; color:white">.</div>
            <div style="width:100px; background:blue; color:blue">.</div>
            <div style="width:100px; background:red; color:red">.</div>
        </div>
    `,
    props: {
        show: true
    },
    onClick() {
        this.show = !this.show;
    },
    ready() {
        this.listen('click', 'onClick', {target: window});
    }
});
```

В этом примере обработка нажатия левой кнопки мыши будет происходит как при щелчке на самом компоненте с изображением флага, так и при щелчке по области, лежащей за его пределами. Это происходит благодаря тому, что обработчик события **click** задан не для самого компонента, а для глобального объекта **window**.

Кроме этого, метод **listen** позволяет для одного и того же события задать несколько разных обработчиков.

```javascript _run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <button ref="btn">Добавить единицу</button>
        <div>Счетчик 1={{count1}}</div>
        <div>Счетчик 2={{count2}}</div>
    `,
    props: {
        count1: 0,
        count2: 0
    },
    onTap1() {
        this.count1++;
    },
    onTap2() {
        this.count2++;
    },
    ready() {
        this.listen('tap', 'onTap1', {target: this.$refs.btn});
        this.listen('tap', 'onTap2', {target: this.$refs.btn});
    }
});
```

В данном примере метод **listen** вызывается несколько раз для одного и того же события **tap**: первый — для задания обработчика **onTap1**, а второй — для задания обработчика **onTap2**. При возникновении этого события будут срабатывать оба обработчика, каждый из которых будет изменять значение своего собственного счетчика.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/uGq1lTUq1c0?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
