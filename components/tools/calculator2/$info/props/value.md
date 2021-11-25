Свойство **value** предназначено для хранения выбранного цвета или правила градиентной заливки.

Если свойство **gradientMode** установлено в значение **true**, то в свойство **value** сохраняется правило градиентной заливки. В противном случае оно возвращает выбранный пользователем цвет.

Например,

```javascript _run_line_edit_loadoda_[my-component.js]_h=260_
import '/components/colors/palette/palette.js';
ODA({
    is: 'my-component',
    template: `
        <label>Задать градиент <input type="checkbox" ::value="gradientMode"><label>
        <oda-palette :gradient-mode ::value></oda-palette>
        <div>Результат: {{value}}</div>
    `,
    props: {
        value: '',
        gradientMode: false
    }
});
```

Выбранный цвет или правило градиентной заливки хранятся в свойстве **value** в виде строкового представления CSS-функций **rgb()** или **linear-gradient()** с указанными пользователем параметрами цвета или градиента.

По умолчанию свойство **value** задано пустой строкой, которая заполняется только тогда, когда пользователь выберет какой-либо цвет. При этом генерируется событие **value-changed**, которое можно отловить в слушателе компонента и выполнить необходимо действие после выбора пользователем цвета.

Например,

```javascript _run_line_edit_loadoda_[my-component.js]_h=260_
import '/components/colors/palette/palette.js';
ODA({
    is: 'my-component',
    template: `
        <label>Задать градиент <input type="checkbox" :value="gradientMode"><label>
        <oda-palette :gradient-mode></oda-palette>
        <div ~style="{background: \`\${color}\`}">Выбранный цвет</div>
    `,
    props: {
        color: 'white',
        gradientMode: false
    },
    listeners: {
        valueChanged(e) {
            this.color = e.details.value;
        }
    }
});
```
