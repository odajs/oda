Команда **ODA.showModal** позволяет выводить любой компонент в отдельном модальном окне.

Она имеет следующий синтаксис:

```javascript
ODA.showModal(component, props = {}, hostProps = {})
```

Ей передаются 3 параметра:

1. **component** — определяет компонент, который будет отображаться в диалоговом окне. Например, **'oda-icon'**.
1. **props** — определяет свойства компонента, который будет отображаться в диалоговом окне. Например, **{icon: 'icons:android', iconSize: 50}**.
1. **hostProps** — определяет свойства самого модального окна. Например, **{title: 'Модальное окно', titleMode: 'full'}**.

Например,

```javascript run_edit_[my-component.js]_h=200_
import '/components/buttons/icon/icon.js';
 ODA({
    is: 'my-component',
    template: `
        <button @tap="onTap">Нажми на меня</button>
    `,
    onTap() {
        ODA.showModal('oda-icon', {icon: 'icons:android', iconSize: 50}, {title: 'Модальное окно', titleMode: 'full'});
    }
});
```

Модальное окно закрывается автоматически при нажатии на кнопку закрытия окна с изображением крестика в правом верхнем углу заголовка окна или при нажатии левой кнопкой мыши в любой области, лежащей за границами контента, отображаемого в окне.

```warning_md
Следует отметить, что перед использованием этой функции необходимо подключить JavaScript-модуль того компонента, который вы хотите отобразить в модальном окне. В противном случае браузер его не покажет.
```

Если в качестве отображаемого компонента передать уже созданный компонент, то он будет копироваться в модальное окно со всеми параметрами, повторно не создаваясь.

Например,

```javascript run_edit_[my-component.js]_h=200_
import '/components/buttons/button/button.js';
 ODA({
    is: 'my-component',
    template: `
        <oda-button ref="btn" @tap="onTap" icon="icons:favorite" icon-size="50">Нажми на меня</oda-button>
    `,
    onTap() {
        ODA.showModal(this.$refs.btn, {icon: 'icons:android', iconSize: 100}, {title: 'Модальное окно', titleMode: 'full'});
    }
});
```

В этом случае значение второго параметра может быть любым, например, неопределенным (**undefined**), так как метод **showModal** его использовать не будет. У отображаемого компонента свойства всегда будут оставаться такими же, какими они были заданы изначально.

Например,

```javascript run_edit_[my-component.js]_h=200_
import '/components/buttons/button/button.js';
 ODA({
    is: 'my-component',
    template: `
        <oda-button ref="btn" @tap="onTap" icon="icons:favorite" icon-size="50">Нажми на меня</oda-button>
    `,
    onTap() {
        ODA.showModal(this.$refs.btn, undefined, {title: 'Модальное окно', titleMode: 'full'});
    }
});
```

В этом случае этот пример будет работать так же, как и предыдущий.

У самого модального окна существуют следующие свойства:

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
        <label> Режим отображения заголовка модального окна
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
                ODA.showModal('oda-icon', {icon: 'icons:android', iconSize: 50}, {title: this.value, titleMode: this.value});
            }
        }
    }
});
```

По умолчанию свойство **titleMode** имеет значение **none**. В этом случае строка заголовка не будет отображаться ни у модального окна, ни в области, в которой располагается его содержимое.

Если выбрать значение **auto**, то заголовок у окна будет отображаться в области с его содержимым, а при значении **full** — у всего окна в целом.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/hwJbxg3obyQ?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
