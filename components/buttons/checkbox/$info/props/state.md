Свойство **state** определяет текущее состояние флажка.

В общем случае флажок может находиться в одном из трех возможных состояний:

1. Неотмеченное — **unchecked**.
1. Отмеченное —**checked**.
1. Неопределенное — **indeterminate**.

Третье состояние включается только тогда, когда у компонента установлен режим трех состояний с помощью свойства **threeStates**.

Например,

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/checkbox/checkbox.js';
ODA({
    is: 'my-component',
    template: `
        <label>Режим трех состояний <input type="checkbox" ::value="threeStates"></label>
        <oda-checkbox :three-states ::state></oda-checkbox>
        <span>Текущее состояние: {{state}}</span>
    `,
    props: {
        threeStates: false,
        state: 'unchecked',
    }
});
```

 По умолчанию свойство **state** установлено в значение **unchecked**, т.е изначально флажок будет находится в неотмеченном состоянии.
