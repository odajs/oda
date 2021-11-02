Свойство **icons** содержит список названий изображений, которые используются для отображения всех возможных состояний флажка.

По своей структуре данное свойство является объектом, у которого заданы три свойства с именами, совпадающими с названиями состояний компонента:

1. **unchecked** — неотмеченное состояние.
1. **checked** — отмеченное состояние
1. **indeterminate** — неопределенное состояние.

Значение каждого из этих свойств задает имя изображения, которое будет использоваться для отображения соответствующего состояния.

Например,

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/checkbox/checkbox.js';
ODA({
    is: 'my-component',
    template: `
        <label>Режим трех состояний <input type="checkbox" ::value="threeStates"></label>
        <oda-checkbox ref="checkbox" :three-states></oda-checkbox>
        <oda-checkbox :icons :three-states></oda-checkbox>
        <span>Объект с изображениями: {{JSON.stringify($refs.checkbox.icons)}}</span>
    `,
    props: {
        icons: {unchecked: 'icons:check-box-outline-blank', checked: 'icons:star', indeterminate: 'icons:favorite'},
        threeStates: false

    }
});
```

По умолчанию эти свойства имеют следующие значения:

1. **icons:check-box-outline-blank** — для отображения неотмеченного состояния **unchecked**.
1. **icons:check-box** — для отображения отмеченного состояния **checked**.
1. **check-box-indeterminate** — для отображения неопределенного состояния **indeterminate**.

При необходимости можно изменить любое из этих свойств, как это показано в данном примере.
