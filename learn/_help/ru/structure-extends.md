Во фреймворке реализовано полноценное множественное наследование компонентов. Дочерний компонент наследует от родительских компонентов HTML-шаблоны, свойства и методы.

Атрибут **extends** используется для указания списка родительских компонентов, элементы которых будут унаследованы текущим компонентом.

Для демонстрации технологии наследования объявим родительский компонент **base-component-1**.

```javascript run_edit_[base-component-1.js]
ODA({
    is: 'base-component-1',
    template: `
        <div>Родитель 1</div>
    `
});
```

Т.к. фреймворк поддерживает множественное наследование, то сразу объявим второй родительский компонент **base-component-2**.

```javascript run_edit_[base-component-2.js]
ODA({
    is: 'base-component-2',
    template: `
        <div>Родитель 2</div>
    `
});
```

Список **extends** представляет собой строку, в которой родительские компоненты указываются через запятую.

Например,

```javascript _run_edit_[my-component.js]_{base-component-1.js_base-component-2.js}
ODA({
    is: 'my-component',
    extends: 'base-component-1, base-component-2',
    template: `
        <div>Наследник</div>
    `
});
```

Порядок следования родителей в списке можно менять. В этом случае изменится порядок наследования их элементов.

Например,

```javascript _run_edit_[my-component.js]_{base-component-1.js_base-component-2.js}
ODA({
    is: 'my-component',
    extends: 'base-component-2, base-component-1',
    template: `
        <div>Наследник</div>
    `
});
```

Элементы самого наследника добавляются по умолчанию только после всех его родителей. Это правило можно изменить, указав в списке **extends** ключевое слово **this**, определяющее порядок следования именно его элементов.

Например,

```javascript _run_edit_[my-component.js]_{base-component-1.js_base-component-2.js}
ODA({
    is: 'my-component',
    extends: 'base-component-1, this, base-component-2',
    template: `
        <div>Наследник</div>
    `
});
```

Список **extends** можно представить в виде массива строк с именами родителей.

Например,

```javascript _run_edit_[my-component.js]_{base-component-1.js_base-component-2.js}
ODA({
    is: 'my-component',
    extends: ['base-component-1', 'base-component-2'],
    template: `
        <div>Наследник</div>
    `
});
```

Если в массиве необходимо указать ключевое слово **this**, то его заключают в кавычки.

Например,

```javascript _run_edit_[my-component.js]_{base-component-1.js_base-component-2.js}
ODA({
    is: 'my-component',
    extends: ['base-component-1', 'this', 'base-component-2'],
    template: `
        <div>Наследник</div>
    `
});
```

Во всех приведенных выше примерах порядок наследования HTML-шаблонов определялся порядком перечисления родителей и ключевого слова **this** в списке **extends**. Однако используя технологию слотов (тег **&lt;slot&gt;**), можно вставлять HTML-шаблоны родителей в требуемое место HTML-шаблона наследника.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'base-component',
    template: `
        <div slot="place">Родитель</div>
    `
});

ODA({
    is: 'my-component',
    extends: 'base-component',
    template: `
        <div>Наследник</div>
        <slot name="place"></slot>
        <div>Наследник</div>
    `
});
```

В данном примере в шаблоне родительского компонента **base-component** объявлен HTML-элемент **&lt;div&gt;** с атрибутом **slot**, имеющим значение **place**. А в шаблоне наследника находится HTML-элемент **&lt;slot&gt;** с именем **place**. В результате работы механизма заполнения слотов элемент **&lt;div&gt;** из шаблона родителя вставляется в центр шаблона наследника.

Механизм заполнения слотов работает и в обратном направлении. HTML-шаблон наследника можно вставить в требуемое место шаблона родителя.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'base-component',
    template: `
        <div>Родитель</div>
        <slot name="place"></slot>
        <div>Родитель</div>
    `
});

ODA({
    is: 'my-component',
    extends: 'base-component',
    template: `
        <div slot="place">Наследник</div>
    `
});
```

Данный пример аналогичен предыдущему, только слот для заполнения размещен в шаблоне родителя, а заполняющий элемент **&lt;div&gt;** размещен в шаблоне наследника.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/zCwMK7TGCD8?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>

