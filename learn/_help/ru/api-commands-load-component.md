Команда **loadComponent** позволяет динамически и асинхронно создавать любой компонент, автоматически подключая модуль с его кодом.

Данная команда имеет следующий синтаксис:

```javascript
ODA.loadComponent = async(id, props = {}, folder = 'components')
```

Ей передаются 3 параметра:

1. **id** — имя компонента в виде строки. Например, **'oda-icon'**.
1. **props** — свойства компонента, который будет создан. Например, **{icon: 'icons:android', iconSize: 50}**.
1. **folder** — начальный путь, по которому расположена папка с модулем компонента. Например, **'components/buttons'**.

Для загрузки модуля компонента данный метод использует тот факт, что имена модуля и папки, в которой он располагается, по умолчанию совпадают с именем самого компонента (только без префикса **oda**). Поэтому методу **loadComponent** достаточно передать только имя компонента и начальный путь, по которому располагаются все папки компонентов. Используя эту информацию, метод автоматически создает компонент, подключая необходимый для него модуль.

Например,

```javascript run_edit_[my-component.js]_h=100_
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
        ODA.loadComponent('oda-icon', {icon: 'icons:android', iconSize: 50}, 'components/buttons').then(el =>this.$refs.android.append(el));
    }
});
```

В этом примере для создания компонента **oda-icon** необходимо подключить модуль, который находится в папке **/components/buttons/icon/** и имеет имя **icon.js**. Имя этого файла без расширения и последняя папка в пути к нему совпадают с именем компонента **oda-icon** без префикса **oda**, а начальный путь имеет значение **/components/buttons**. Однако методу **loadComponent** достаточно передать только начальный путь, полное имя модуля он вычислит автоматически и подключит его перед созданием соответствующего компонента.

Следует отметить, что метод **loadComponent** является асинхронным. Он возвращает промис, а создаваемый компонент будет добавлен в документ только тогда, когда полностью будет загружен его модуль.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/RhFPBKrLBJg?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
