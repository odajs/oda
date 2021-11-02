Свойство **icon** возвращает название иконки, которая используется для отображения текущего состояния флажка.

Например,

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/checkbox/checkbox.js';
ODA({
    is: 'my-component',
    template: `
        <label>Режим трех состояний <input type="checkbox" ::value="threeStates"></label>
        <oda-checkbox ::icon :three-states></oda-checkbox>
        <span>Текущее изображение: {{icon}}</span>
    `,
    props: {
        icon: '',
        threeStates: false
    }
});
```

По умолчанию для отображения трех возможных состояний флажка используются иконки из предопределенного набора **icons** со следующими именами:

1. **check-box-outline-blank** — для неотмеченного состояния.
2. **icons:check-box** — для отмеченного состояния.
3. **check-box-indeterminate** — для неопределенного состояния.

``` _info_md
Данное свойство имеет режим доступа только для чтения. Изменение его значения не приводит к замене текущего изображения флажка. Для этого необходимо использовать другое свойство — **icons**.
```
