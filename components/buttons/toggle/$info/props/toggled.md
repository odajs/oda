Свойство **toggled** управляет состоянием тумблера.

Если это свойство установить в значение **true**, то тумблер перейдет в нажатое состояние. В противном случае тумблер будет выключен.

Например,

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/toggle/toggle.js';
ODA({
    is: 'my-component',
    template: `
        <label>{{toggled ? 'Отключить' : 'Включить'}} <input type="checkbox" ::checked="toggled"> </label>
        <oda-toggle ::toggled></oda-toggle>
        <span>{{'Текущее состояние: ' + toggled}}</span>
    `,
    props: {
        toggled: false
    }
});
```

Свойство **toggled** автоматически изменяет свое значение при изменении состояния тумблера пользователем. Это позволяет узнать текущее состояние переключателя.

По умолчанию тумблер находится в выключенном состоянии, т.е. свойство **toggled** изначально установлено в значение **false**.
