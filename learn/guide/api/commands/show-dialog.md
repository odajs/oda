Команда **showDialog** позволяет выводить любой компонент в отдельном диалоговом окне.

Она имеет следующий синтаксис:

```javascript
ODA.showDialog(component, props = {}, hostProps = {})
```

Ей передаются 3 параметра:

1. **component** — определяет компонент, который будет отображаться в диалоговом окне. Например, **'oda-icon'**.
1. **props** — определяет свойства компонента, который будет отображаться в диалоговом окне. Например, **{icon: 'icons:android', iconSize: 50}**.
1. **hostProps** — определяет свойства самого диалогового окна. Например, **{title: 'Диалоговое окно', titleMode: 'auto'}**.

Например,

```javascript run_edit_[my-component.js]_h=200_
import '/components/buttons/icon/icon.js';
 ODA({
    is: 'my-component',
    template: `
        <button @tap="onTap">Нажми на меня</button>
    `,
    onTap() {
        ODA.showDialog('oda-icon', {icon: 'icons:android', iconSize: 50}, {title: 'Диалоговое окно', titleMode: 'auto'});
        }
});
```

Здесь отображается диалоговое окно, которое можно закрыть нажатием не разные кнопки.

Для того, чтобы узнать какая кнопка была нажата команда **showDialog** возвращает промис. Его исполнитель вызывает либо функцию **resolve**, либо функцию **reject** в зависимости от того, каким способом было закрыто окно.

Например,

```javascript run_edit_[my-component.js]_h=200_
import '/components/buttons/icon/icon.js';
 ODA({
    is: 'my-component',
    template: `
        <button @tap="onTap">Нажми на меня</button>
        <div>Вы нажали на кнопку: {{res}}</div>
    `,
    props: {
        res: ''
    },
    onTap() {
        ODA.showDialog('oda-icon', {icon: 'icons:android', iconSize: 50}, {title: 'Диалоговое окно', titleMode: 'auto'}).then(() => this.res = 'Ok', () => this.res = 'Cancel');
    }
});
```

Если пользователь нажмет на кнопку «**Ok**», то будет вызвана функция **resolve**. Ее обработчик передается первым параметром методу **then** и в данном примере выводит слово «**Ok**». Если будет нажата кнопка «**Cancel**» или диалоговое окно будет закрыто любым другим способом, то будет вызвана функция **reject**. В ее обработчике, который указывается вторым параметром методу **then**, уже будет выводится слово «**Cancel**».

В обработчике функции **resolve** можно указать дополнительный параметр, через которой передается ссылка на компонент, который отображался в диалогом окне. Через этот параметр можно узнать какие действия выполнял пользователь с этим компонентом, какие изменения с ним произошли.

Например,

```javascript run_edit_[my-component.js]_h=250_
import '/components/colors/palette/palette.js';
 ODA({
    is: 'my-component',
    template: `
        <button @tap="onTap">Нажми на меня</button>
        <div>Возвращаемый результат: {{res}}</div>
    `,
    props: {
        res: ''
    },
    onTap() {
        ODA.showDialog('oda-palette', {colors: 5, gradients: 5}, {title: 'Палитра цветов', titleMode: 'auto'}).then(palette => this.res = palette.color, () => this.res =  'Не предусмотрено');
    }
});
```

Здесь если закрыть диалоговое окно нажатием на кнопку выбора цвета компонента **palette**, то в обработчике функции **resolve** можно узнать, какой цвет выбрал пользователь.

Если закрыть диалоговое окно любым другим способом, например, нажатием на кнопку «**Cancel**», то будет вызван обработчик функции **reject**. Ему никакой дополнительный параметр не передается. В этом нет никакой необходимости.

Если в качестве отображаемого компонента функции **showDialog** передать уже созданный компонент, то он будет копироваться в диалоговое окно со всеми параметрами, не создаваясь повторно.

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
        ODA.showDialog(this.$refs.btn, {icon: 'icons:android', iconSize: 50}, {title: 'Диалоговое окно', titleMode: 'auto'});
    }
});
```

В этом случае свойства компонента, передаваемые команде **showDialog** вторым параметром, ему не присваиваются. Считается, что они у него уже были заданы.

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
        ODA.showDialog(this.$refs.btn, undefined, {title: 'Диалоговое окно', titleMode: 'auto'});
    }
});
```

В результате этого данный пример будет работать абсолютно так же, как и предыдущий.

У самого диалогового окна существуют следующие свойства:

1. **title** — задает текст надписи в заголовке окна.
1. **titleMode** — задает режим отображения заголовка окна.
    Оно может принимать следующие значения:
    1. **none** — заголовок окна не отображается.
    1. **auto** — заголовок отображается в области с содержимым окна.
    1. **full** — заголовок отображается по ширине всего окна.

Например,

```javascript run_edit_[my-component.js]_h=200_
import '/components/buttons/icon/icon.js';
ODA({
    is: 'my-component',
    template: `
        <label> Режим отображения заголовка диалогового окна
            <select ::value>
                <option value="placeholder">Выберите вид отображения</option>
                <option value="none">none</option>
                <option value="auto">auto</option>
                <option value="full">full</option>
            </select>
        </label>
    `,
    props: {
        value: {
            default: 'placeholder',
            set() {
                ODA.showDialog('oda-icon', {icon: 'icons:android', iconSize: 50}, {title: this.value, titleMode: this.value});
            }
        }
    }
});
```

По умолчанию свойство **titleMode** имеет значение **none**. В этом случае строка заголовка не будет отображаться ни у диалогового окна, ни в области, в которой располагается его содержимое.

Если выбрать значение **auto**, то заголовок у окна будет отображаться в области с его содержимым, а при значении **full** — у всего окна в целом.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/npTN4AgCj2Q?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
