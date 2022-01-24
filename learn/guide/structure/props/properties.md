Свойства компонента объявляются в разделе **props**.

По своей структуре этот раздел является объектом. Свойства в нем задаются в виде пары **«ключ: значение»**, где **ключ** выступает в качестве имени свойства, а второй параметр задает начальное значение свойства.

Например:

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <span>{{text}}</span>
    `,
    props: {
        text: 'Hello, property!'
    }
});
```

```warning_md
Имя свойства должно удовлетворять требования спецификации [ECMAScript](https://ecma-international.org/ecma-262/6.0/#sec-object-initializer), т.е. быть валидным JS-идентификатором.
```

Если у компонента необходимо объявить сразу несколько свойств, то они должны быть перечислены в разделе **props** через запятую.

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <span>{{myProp1}}</span>
        <div>{{myProp2}}</div>
    `,
    props: {
        myProp1: 'Первое свойство',
        myProp2: 'Второе свойство'
    }
});
```

Для имени свойства предпочтительнее использовать camel-нотацию. В этом случае она будет корректно преобразовываться в kebab-нотацию при ее отображении в атрибутах хоста. Такую возможность дает специальный модификатор свойства **reflectToAttribute**, речь о котором пойдет позже.

Если имя свойства не является валидным [JS-идентификатором](https://ecma-international.org/ecma-262/6.0/#sec-object-initializer), то его необходимо записывать в одинарных или двойных кавычках.

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div>{{this['my-prop']}}</div>
    `,
    props: {
        'my-prop': 'Невалидное JS-имя свойства'
    }
});
```

Такой подход является не самым лучшим решением, так как при его использовании к свойству придется обращаться не с помощью обычного оператора доступа **точка**, а с помощью оператора квадратных скобок **[ ]**.

```javascript
this['my-prop'];
this.myProp;
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/S87eQFzFefU?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
