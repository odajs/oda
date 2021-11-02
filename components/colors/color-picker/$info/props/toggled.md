Свойство **toggled** управляет состоянием компонента. Оно используется совместно со свойством **allowToggle**. Оба свойства имеют логический тип.

Если **allowToggle=false**, то компонент работает как обычная кнопка с автоматическим возвратом в отжатое состояние. В этом режиме свойство **toggled** выполняет управляющую функцию. Если свойство **toggled** установить в значение **true**, то компонент перейдет в нажатое состояние и перестанет реагировать на событие **tap**. Функционирование компонента восстанавливается после сброса свойства **toggled** в значение **false**.

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/button/button.js';
ODA({
    is: 'my-component',
    template: `
        <oda-button allow-toggle="false" :toggled="myToggled" icon="icons:android" :label="myLabel"></oda-button>
        <button @tap="toggle">{{buttonText}}</button>
    `,
    props: {
        myToggled: false,
        myLabel: "Жми меня, я свободен",
        buttonText: "Зафиксировать"
    },
    toggle() {
        this.buttonText === "Зафиксировать" ? this.buttonText="Отпустить" : this.buttonText="Зафиксировать";
        this.myToggled = ! this.myToggled;
        this.myLabel === "Жми меня, я свободен" ? this.myLabel="Не трогай меня, я зафиксирован" : this.myLabel="Жми меня, я свободен";
    } 
});
```

Если **allowToggle=false**, то компонент работает как кнопка с фиксацией нажатого/отжатого состояния. В этом режиме свойство **toggled** является индикатором текущего состояния компонента. Значение **true** соответствует нажатому состоянию, **false** — отжатому.

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/button/button.js';
ODA({
    is: 'my-component',
    template: `
        <oda-button allow-toggle="true" ::toggled="myToggled" icon="icons:android" :label="myLabel"></oda-button>
    `,
    props: {
        myToggled: false,
        myLabel: "Свойство toggled = false"
    },
    observers: [
        function myObserver(myToggled) {
            this.myLabel = this.myToggled? "Свойство toggled = true" : "Свойство toggled = false";
        }
    ]
});
```

