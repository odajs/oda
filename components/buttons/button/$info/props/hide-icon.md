Свойство **hideIcon** указывает на отсутствие или наличие иконки у компонента.

Если у кнопки не задана иконка, т.е. свойство **icon** является пустой строкой, то свойство **hideIcon** будет иметь значение **true**. В противном случае, когда иконка задана, свойство **hideIcon** будет иметь значение **false**.

Например,

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/button/button.js';
ODA({
    is: 'my-component',
        template: `
            <label><input type="checkbox" ::checked="hideIcon"><label>
            <oda-button ::hide-icon :icon :label @tap="onTap"></oda-button>
            <span>Свойство hideIcon = {{hideIcon}}</span>
        `,
        props: {
            hideIcon: false,
            icon: "icons:android",
            label: "Иконка показана"
        },
        onTap() {
            this.icon = this.icon ? "" : "icons:android";
        },
        observers: [
            function myObserver(hideIcon) {
                this.label = this.hideIcon ? "Иконка скрыта" : "Иконка показана";
            }
        ]
});
```

В данном примере при нажатии на кнопку поочередно задается или очищается значение свойства **icon**.
Это приводит к автоматическому изменению внешнего свойства **hideIcon**, в обозревателе которого изменяется надпись кнопку. Одновременно с этим изменяется значение свойства **checked**, устанавливая или убирая флажок у элемента **checkbox**.

Однако свойство **hideIcon** имеет режим только для чтения. Изменение его значения не приводит к изменение состояния иконки. Оно определяется автоматически наличием у компонента не пустого свойства **icon**, т.е. изменяя стояние **checkbox** спрятать заданную иконку не удастся.
