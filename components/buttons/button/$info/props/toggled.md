Свойство **toggled** определяет состояние и режим работы кнопки совместно со свойством **allowToggle**.

Если свойство **allowToggle** имеет значение **false**, то компонент будет работать как обычная кнопка, но в двух возможных режимах:

1. Режим с автоматическим возвратом в не нажатое состояние.
    В этом режиме свойство **toggled** имеет значение **false**, что позволяет кнопке автоматически возвращаться в не нажатое состояние после щелчка по ней пользователем.

1. Режим с фиксацией нажатого состояния.

    В этом режиме свойство **toggled** устанавливается в значение **true**, что запрещает пользователю нажимать на кнопку до тех пор, пока она опять не перейдет в состояние с автоматическим возвратом. Для этого необходимо программно присвоить свойству **toggled** значение **false**.

Например,

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/button/button.js';
ODA({
    is: 'my-component',
    template: `
        <label>Зафиксировать:<input type="checkbox" ::checked="toggled"></label>
        <oda-button allow-toggle="false" :toggled icon="icons:android" :label></oda-button>
    `,
    props: {
        toggled: {
            default: false,
            set(n) {
                this.label = n ? "Не беспокоить, я занят" : "Я свободен, жми на меня";
            }
        },
        label: "Я свободен, жми на меня"
    }
});
```

В фиксированном состоянии кнопка не реагирует ни на какие действия пользователя.

Если свойство **allowToggle**, установлено в значение **true**, то компонент будет работать как кнопка с фиксацией нажатого состояния.

В этом режиме свойство **toggled** позволяет узнать или изменить текущее состоянии кнопки. Если оно имеет значение **true**, то кнопка будет нажата. В противном случае, при значении **false**, кнопка будет отжата.

Например,

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/button/button.js';
ODA({
    is: 'my-component',
    template: `
        <label>{{label}}:<input type="checkbox" ::checked="toggled"></label>
        <oda-button allow-toggle="true" ::toggled icon="icons:android" :label></oda-button>
    `,
    props: {
        toggled: {
            default: false,
            set(n) {
                this.label = n ? "Я нажата" : "Я отжата";
            }
        },
        label: "Я отжата"
    }
});
```

В этом режиме нельзя зафиксировать кнопку как в предыдущем примере.
