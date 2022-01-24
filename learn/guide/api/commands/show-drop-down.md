Команда **ODA.showDropdown** позволяет выводить любой компонент в отдельном выпадающем окне.

Она имеет следующий синтаксис:

```javascript
ODA.showDropdown(component, props = {}, hostProps = {})
```

Ей передаются 3 параметра:

1. **component** — определяет компонент, который будет отображаться в выпадающем окне. Например, **'oda-icon'**.
1. **props** — определяет свойства компонента, который будет отображаться в выпадающем окне. Например, **{icon: 'icons:android', iconSize: 50}**.
1. **hostProps** — определяет свойства самого выпадающего окна. Например, **{minWidth: 50}**.

Например,

```javascript run_edit_[my-component.js]_h=80_
import '/components/buttons/icon/icon.js';
 ODA({
    is: 'my-component',
    template: `
        <button @tap="onTap">Нажми на меня</button>
    `,
    onTap() {
        ODA.showDropdown('oda-icon', {icon: 'icons:android', iconSize: 50}, {minWidth: 50});
    }
});
```

Данная команда возвращает промис, исполнитель которого вызывает при закрытии окна либо функцию **resolve**, либо функцию **reject**. Если окно закрывается щелчком мыши по области самого окна, то вызывается функция **resolve**. При щелчке по любой другой области окно все равно будет закрыто, но будет вызвана функция **reject**. В обработчиках вызова этих функций можно предусмотреть необходимые действия, которые должны выполняться в том или в ином случае.

Например,

```javascript run_edit_[my-component.js]_h=80_
import '/components/buttons/icon/icon.js';
 ODA({
    is: 'my-component',
    template: `
        <button @tap="onTap">Нажми на меня</button>
        <span>Вы щелкнули {{res}} окна</span>
    `,
    props: {
        res: 'по неизвестно какой области'
    },
    onTap() {
        ODA.showDropdown('oda-icon', {icon: 'icons:android', iconSize: 50}, {minWidth: 50}).then( () => this.res = 'внутри', () => this.res = 'снаружи');
    }
});
```

При нажатии на область внутри выпадающего окна срабатывает обработчик функции **resolve**, в качестве параметра которого передается компонент, отображавшийся в окне. Через этот параметр можно обратиться к нему и узнать какие действия с ним выполнял пользователь.

Например,

```javascript run_edit_[my-component.js]_h=150_
import '/components/colors/palette/palette.js';
 ODA({
    is: 'my-component',
    template: `
        <button @tap="onTap">Нажми на меня</button>
        <span>Возвращаемый результат: {{res}}</span>
    `,
    props: {
        res: ''
    },
    onTap() {
        ODA.showDropdown('oda-palette', {colors: 5, gradients: 5}, {minWidth: 50}).then(palette => this.res = palette.color, () => this.res = 'Не предусмотрено');
    }
});
```

Если пользователь щелкнул по области лежащей вне границ окна, то при закрытии выпадающего окна будет вызван обработчик функции **reject**. Никакой дополнительный параметр ему не передается. В этом нет никакой необходимости.

Если в качестве отображаемого компонента функции **showDropdown** передать уже созданный компонент, то он будет копироваться в выпадающее окно со всеми параметрами, повторно не создаваясь.

Например,

```javascript run_edit_[my-component.js]_h=200_
import '/components/buttons/button/button.js';
 ODA({
    is: 'my-component',
    template: `
        <oda-button ref="btn" label="Нажми на меня" icon="icons:favorite" icon-size="50" @tap="onTap" blink="1000"></oda-button>
    `,
    props: {
        value: ''
    },
    onTap() {
        ODA.showDropdown(this.$refs.btn, {icon: 'icons:android', iconSize: 50}, {minWidth: 50});
    }
});
```

В этом случае свойства компонента, передаваемые команде **showDropdown** вторым параметром, ему не присваиваются. Считается, что они у него уже заданы.

Например, в предыдущим примере во втором параметре можно указать неопределенное (**undefined**) или пустое (**null**) значение.

```javascript run_edit_[my-component.js]_h=200_
import '/components/buttons/button/button.js';
 ODA({
    is: 'my-component',
    template: `
        <oda-button ref="btn" label="Нажми на меня" icon="icons:favorite" icon-size="50" @tap="onTap" blink="1000"></oda-button>
    `,
    props: {
        value: ''
    },
    onTap() {
        ODA.showDropdown(this.$refs.btn, undefined, {minWidth: 50});
    }
});
```

В результате этого данный пример будет работать абсолютно также, как и предыдущий.

У самого выпадающего окна существуют следующие свойства:

1. **parent** — указатель на родителя окна.
1. **minWidth** — минимальная ширина окна. Значение по умолчанию: **100** пикселей.
1. **maxWidth** — максимальная ширина окна. Значение по умолчанию: **0** пикселей.
1. **maxHeight** — максимальная высота окна. Значение по умолчанию: **0** пикселей.
1. **intersect** — разрешает перекрывать область родителя. Значение по умолчанию: **false**.

Например,

```javascript run_edit_[my-component.js]_h=150_
import '/components/buttons/icon/icon.js';
 ODA({
    is: 'my-component',
    template: `
        <label>Минимальная ширина <input type="number" ::value="minWidth" step="50"></label><br>
        <button @tap="onTap">Нажми на меня</button>
    `,
    props: {
        minWidth: '100'
    },
    onTap() {
        ODA.showDropdown('oda-icon', {icon: 'icons:android', iconSize: 50}, {minWidth: this.minWidth});
    }
});
```

В этом примере при увеличении значения свойства **minWidth** ширина выпадающего окна будет увеличиваться, так как она не может стать меньше указанного значения.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/S2xbCmqItY8?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
