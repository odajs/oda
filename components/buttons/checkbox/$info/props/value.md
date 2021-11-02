Свойство **value** позволяет задать или узнать текущее состояние флажка в логическом формате.

При значение **true**, состояние флажка устанавливается в значение **checked**. В противном случает флажок будет находится в неотмеченном состоянии **unchecked**.

Например,

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/checkbox/checkbox.js';
ODA({
    is: 'my-component',
    template: `
        <label>Изменить состояние <input type="checkbox" ::value></label><br>
        <label>Режим трех состояний <input type="checkbox" ::value="threeStates"></label> <br>
        <oda-checkbox :three-states ::state ::value></oda-checkbox>
        <div>Текущее состояние: {{state}}</div>
        <div>Текущее значение: {{value}}</div>
    `,
    props: {
        threeStates: false,
        state: 'unchecked',
        value: false,
    }
});
```

Если включен режим трех состояний, то изменение свойства **value** не будет приводить к изменению  состояния флажка. Однако третье неопределенное состояние **indeterminate** будет воспринимается этим свойством как значение **false**.

 По умолчанию свойство **state** установлено в значение **unchecked**. Поэтому свойство **value** будет возвращать изначально значение **false**, которое соответствует этому состоянию.
