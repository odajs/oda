Свойство **threeStates** включает у флажка режим работы трех состояний.

По умолчанию флажок может находиться только в двух состояниях:

1. Неотмеченное  — **unchecked**.
1. Отмеченное  — **checked**.

Если свойство **threeStates** установить в значение **true**, то флажок сможет переходить в третье неопределенное состояние **indeterminate**.

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

Текущее состояние флажка определяется значением свойства **state**. Если режим трех состояний не включен, то флажок в третье неопределенное состояние переходить не будет.

По умолчанию свойство **threeStates** установлено в значение **false**, т.е. режим трех состояний изначально работать не будет.
