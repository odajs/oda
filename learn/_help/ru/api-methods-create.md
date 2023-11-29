**create** — это метод, который позволяет динамически создать HTML-элементы внутри компонента.

Он объявляется следующим образом:

```javascript
create(tagName, props={}, inner)
```

Ему передаются 3 параметра:

1. **tagName** — имя создаваемого HTML-элемента. Например, **'ul'**.
1. **props** — свойства создаваемого элемента.
1. **inner** — дочерний HTML-элемент.

Например,

```javascript _run_edit_[my-component.js]_h=120_
 ODA({
    is: 'my-component',
    template: `
        <ol ref="ol">
            <li>Пункт</li>
        </ol>
        <button @tap="onTap">Добавить пункт</button>
    `,
    onTap() {
        let li = this.create('li', {innerText: 'Новый пункт'});
        this.$refs.ol.append(li);
    }
});
```

В качестве третьего параметра можно передать HTML-элемент, который станет дочерним от создаваемого элемента.

Например,

```javascript _run_edit_[my-component.js]_h=120_
 ODA({
    is: 'my-component',
    template: `
        <ol ref="ol">
            <li>Пункт</li>
        </ol>
        <button @tap="onTap">Добавить пункт</button>
    `,
    onTap() {
        let li = this.create('li', {innerText: 'Новый вложенный список'});
        let ul = this.create('ul', {}, li);
        this.$refs.ol.append(ul);
    }
});
```

В этом примере при каждом нажатии на кнопку будет создаваться новый вложенный маркированный список, в котором будет только один пункт, так как в параметре **inner** метода **create** можно указать только один дочерний элемент для вновь создаваемого элемента.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/vKjJISZI4Yw?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
