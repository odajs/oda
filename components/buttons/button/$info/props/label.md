Свойство **label** задает текст, который выводится на поверхности кнопки.

Например,

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/buttons/button/button.js';
ODA({
    is: 'my-component',
    template: `
        <oda-button :label="value" @tap="onTap"></oda-button>
    `,
    props: {
        value: "Нажми на меня"
    },
    onTap () {
        this.value = this.value==='Моя кнопка'? 'Нажми на меня': 'Моя кнопка';
    }
});
```

По умолчанию свойство **label** задано в виде пустой строкой, т.е. если явно не указать его значение, то текст на поверхности кнопки выводиться не будет.
