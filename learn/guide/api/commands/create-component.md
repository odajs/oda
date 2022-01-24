Команда **createComponent** позволяет динамически создавать любой компонент.

Она имеет следующий синтаксис:

```javascript
ODA.createComponent(id, props = {})
```

Ей передаются 2 параметра:

1. **id** — имя компонента в виде строки. Например, **'oda-icon'**.
1. **props** — свойства компонента, который будет создан. Например, **{icon: 'icons:android', iconSize: 50}**.

В результате выполнения функции **createComponent** будет возвращен созданный компонент. Однако перед использованием этой функции необходимо подключить JavaScript-модуль, в котором находится код самого компонента. В противном случае браузер не сможет его отобразить.

Например,

```javascript run_edit_[my-component.js]_h=100_
import '/components/buttons/icon/icon.js';
ODA({
    is: 'my-component',
    template: `
        <style>
            div {
                @apply --horizontal;
            }
        </style>
        <button @tap="onTap">Нажми на меня</button>
        <div ref="android"></div>
    `,
    onTap() {
        let el = ODA.createComponent('oda-icon', {icon: 'icons:android', iconSize: 50});
        this.$refs.android.append(el);
    }
});
```

После создания компонента он не будет автоматически удаляться, поэтому каждое последующее нажатие на кнопку в этом примере будет приводить к созданию все новых и новых однотипных компонентов.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/YqyCzlwPlwE?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
