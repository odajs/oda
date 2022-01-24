**unlisten** — это метод, который позволяет удалить ранее зарегистрированный слушатель события.

Он объявляется внутри компонента следующим образом:

```javascript
unlisten(event='', callback, props = {target: this, useCapture: false})
```

Ему передаются 3 параметра:

1. **event** — список типов событий, для которых слушатель должен быть удален. События в этом списке должны разделяться запятыми. Например, **'tap, contextMenu'**.
1. **callback** — обработчик, который ранее был зарегистрирован для слушателя события. Например, "**'onTap'**". Этот параметр является обязательным.
1. **props** — объект с дополнительными параметрами ранее зарегистрированных слушателей. Например, **{target: this, useCapture: false}**.
    1. **target** — определяет HTML-элемент, для которого был зарегистрирован удаляемый обработчик событий.
    1. **useCapture** — определяет для какой фазы распространения события будет удаляться обработчик.

Например,

```javascript _run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <label>{{label}} <input type="checkbox" ::value></label>
        <button ref="btn">Щелкни по мне: {{count}}</button>
    `,
    props: {
        count: 0,
        label: 'Добавить слушателя',
        value: {
            default: false,
            set(n) {
                if(n) {
                    this.label = "Удалить слушателя";
                    this.listen('tap', 'onTap', {target: this.$refs.btn});
                }
                else {
                    this.label = "Добавить слушателя";
                    this.unlisten('tap', 'onTap', {target: this.$refs.btn});
                }
            }
        }
    },
    onTap() {
        this.count++;
    }
});
 ```

Обратите внимание, что при удалении слушателя обязательно должны совпадать:

1. Имя события.
1. Имя обработчика и способ его передачи.
1. Объект, для которого был зарегистрирован обработчик.
1. Фаза распространения события.

Если в качестве обработчика используется анонимная или стрелочная функция, то удалить слушатель будет невозможно.

Например,

```javascript _run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <label>{{label}} <input type="checkbox" ::value></label>
        <button ref="btn">Щелкни по мне: {{count}} </button>
    `,
    props: {
        count: 0,
        label: 'Добавить слушателя',
        value: {
            default: false,
            set(n) {
                if(n) {
                    this.label = "Удалить слушателя";
                    this.listen('tap', function () {this._target.$domHost.count++}, {target: this.$refs.btn});
                }
                else {
                    this.label = "Добавить слушателя";
                    this.unlisten('tap', function () {this._target.$domHost.count++}, {target: this.$refs.btn});
                }
            }
        }
    }
});
```

Если добавить слушатель, а затем его удалить, то обработчик нажатия кнопки будет продолжать работать, так как указанные функции обработки в методах **listen** и **unlisten** фактически будут отличаться друг от друга.

Аналогичная ситуация будет наблюдаться, когда в качестве обработчика будет использована стрелочная функция.

Например,

```javascript _run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <label>{{label}} <input type="checkbox" ::value></label>
        <button ref="btn">Щелкни по мне: {{count}} </button>
    `,
    props: {
        count: 0,
        label: 'Добавить слушателя',
        value: {
            default: false,
            set(n) {
                if(n) {
                    this.label = "Удалить слушателя";
                    this.listen('tap', () => {this.count++}, {target: this.$refs.btn});
                }
                else {
                    this.label = "Добавить слушателя";
                    this.unlisten('tap', () => {this.count++}, {target: this.$refs.btn});
                }
            }
        }
    }
});
```

Если в качестве обработчика использовался указатель на метод, то отписаться от слушателя будет возможно, так как этот указатель остается одним и тем же.

Например,

```javascript _run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <label>{{label}} <input type="checkbox" ::value></label>
        <button ref="btn">Щелкни по мне: {{count}} </button>
    `,
    props: {
        count: 0,
        label: 'Добавить слушателя',
        value: {
            default: false,
            set(n) {
                if (n) {
                    this.label = "Удалить слушателя";
                    this.listen('tap', this.onTap, {target: this.$refs.btn});
                }
                else {
                    this.label = "Добавить слушателя";
                    this.unlisten('tap', this.onTap, {target: this.$refs.btn});
                }
            }
        }
    },
    onTap() {
        this._target.$domHost.count++;
    }
});
```

При удалении обработчика необходимо учитывать для какой фазы распространения события он был зарегистрирован.

Например,

```javascript error_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <label>{{label}} <input type="checkbox" ::value></label>
        <button ref="btn">Щелкни по мне: {{count}} </button>
    `,
    props: {
        count: 0,
        label: 'Добавить слушателя',
        value: {
            default: false,
            set(n) {
                if(n) {
                    this.label = "Удалить слушателя";
                    this.listen('click', 'onClick', {target: this.$refs.btn, useCapture: true});
                }
                else {
                    this.label = "Добавить слушателя";
                    this.unlisten('click', 'onClick', {target: this.$refs.btn});
                }
            }
        }
    },
    onClick() {
        this.count++;
    }
});
```

В данном примере слушатель события **click** не будет удален, так как в методе **listen** обработчик был зарегистрирован для фазы погружения (**useCapture: true**), а его пытаются удалить для фазы всплытия, так как в методе **unlisten** значение **useCapture** вообще не было указано. В этом случае оно принимается равным значению **false**.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/rKUpOHvGhls?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
