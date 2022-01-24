Модификатор **list** используется для указания списка предопределенных значений свойства.

По своей структуре список **list** является массивом, каждый элемент которого рассматривается как одно из возможных значений свойства компонента, в котором этот модификатор указан.

Например:

```javascript _run_edit_console_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <div ~style="{textAlign: \`\${textAlign}\`}">{{text}}</div>
    `,
    props: {
        text: "Привет, list!",
        textAlign: {
            default: 'left',
            list: ['center', 'justify', 'left',  'right']
        }
    }
});
```

В данном примере задается стиль выравнивания текста в элементе **div** c помощью атрибута **text-align**. Для изменения его значения предусмотрено свойство **textAlign**, которое задает список предопределенных значений этого атрибута с помощью модификатора **list**.

Этот список будет отображаться в инспекторе свойств компонента **property-grid** при нажатии на кнопку со стрелкой вниз с правой стороны от значения соответствующего свойства.

```javascript _run_edit_console_[my-view.js]_{my-component.js}_h=170_
import 'https://odajs.org/tools/tester/tester.js';
 ODA({
    is: 'my-view',
    template: `
        <oda-tester :left.opened="true">
            <my-component></my-component>
        </oda-tester>
    `
});
```

Выравнивание текста в элементе **div** будет осуществляться динамически при выборе любого значения из этого списка.

Однако в этом свойстве можно указывать также и другие значения, и не обязательно только те,  предусмотренные списком значений.

Например, если записать значения **start** или **end** в ручном режиме, то текст в элементе **div** будет выравниваться по левому или по правому краю в зависимости от его направления.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/NRh19dpFaio?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>

