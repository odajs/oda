**slot** — это HTML-элемент, который  может автоматически заполняться содержимым как из «светлого», так и из теневого дерева документа.

По умолчанию у всех компонентов теневое дерево создается в закрытом режиме. В результате этого ссылка **shadowRoot** на теневое дерево будет всегда возвращать значение **null**. Из-за этого становится фактически невозможно получить доступ к внутреннему содержимому компонента извне. Однако, задав в теневом дереве компонента специальный HTML-элемент с именем **slot**, можно предусмотреть возможность добавления внешних элементов в этот компонент.

Например,

```javascript _edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <slot name="mySlot"></slot>
    `,
});
```

У элемента **slot** существует атрибут с именем **name**, в котором можно указать имя слота — в этом случае слот будет называться именованным.

Сам по себе элемент слот не будет отображаться браузером, но его можно использовать для отображения других HTML-элементов, которые могут находиться как в «светлом» дереве документа, так и в теневом дереве этого или иного компонента.

Чтобы внешний HTML-элемент поместить в соответствующий слот, в него необходимо добавить атрибут **slot** со значением, совпадающим с именем соответствующего слота.

Например,

```javascript _run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <slot name="mySlot"></slot>
        <div slot="mySlot">Мой слот</div>
    `,
});
```

В результате этого HTML-элемент будет отображаться внутри теневого дерева компонента именно в том месте, где был указан соответствующий слот. Если открыть консоль браузера, то можно увидеть «развёрнутое» (**flattened**) DOM-дерево. В нем элемент **div** будет как бы вставлен в слот с именем **mySlot**, который был указан в его атрибуте **slot**.

```html line
<my-component>
    #shadow-toot(closed)
        <slot name="mySlot">
            &#8618; <div> reveal
        </slot>
        <!--19-- div (slot: "mySlot") -->
        <div slot="mySlot">Мой слот</div>
</my-component>
```

Развернутое DOM-дерево на самом деле является «виртуальным» и используется только для целей отображения и обработки событий. Фактически, расположение узлов в документе не меняется, но их место отмечается комментариями, а в слот добавляется ссылка **reveal**, при щелчке по которой будет осуществлен переход к реальному расположению узла, отображающегося на месте этой ссылки.

Если в компоненте будут находиться сразу несколько элементов с именем одного и того же слота, то они будут добавляться в слот последовательно друг за другом в том порядке, в котором они располагаются в обычном DOM.

Например,

```javascript _run_edit_[my-component.js]_h=120_
 ODA({
    is: 'my-component',
    template: `
        <div slot="mySlot">Мой слот 1</div>
        <div>
            <div slot="mySlot">Мой слот 2</div>
                <div style="border: 2px solid red;">
                    <slot name="mySlot">
                        <div slot="mySlot">Мой слот 3</div>
                    </slot>
                </div>
            <div slot="mySlot">Мой слот 4</div>
        </div>
        <div slot="mySlot">Мой слот 5</div>
    `,
});
```

Элемент, у которого в атрибуте **slot** указано имя несуществующего слота, не будет отображаться, так как он не сможет попасть ни в один слот.

Например,

```javascript _run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <slot name="mySlot1"></slot>
        <div slot="mySlot">Мой слот</div>
    `,
});
```

Если у слота не задать атрибут **name**, то такой слот станет слотом по умолчанию. Он собирает в себя только HTML-элементы, расположенные за пределами его родного компонента и не имеющие атрибута **slot**.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'base-component',
    template: `
        <div style="border: 2px solid red;">
            <slot>Место для Вашей рекламы</slot>
        </div>
    `
});
ODA({
    is: 'my-component',
    template: `
        <base-component>
            <span ~if="show" style="background-color:pink">Да здравствует ODANT!!!</span>
        </base-component>
        <button @tap="onTap">{{text}}</button>
    `,
    props: {
        show: false,
        text: "Показать"
    },
    onTap() {
        this.show = !this.show;
        this.text = this.show ? "Скрыть рекламу" : "Показать рекламу";
    }
});
```

Обратите внимание, что в слот по умолчанию попали только HTML-элементы, записанные между открывающимся и закрывающимся тегами компонента **base-component**, в котором расположен слот.


=====================================================================



Если у слота не задать атрибут **name**, то такой слот станет слотом по умолчанию. В него будут собираться все HTML-элементы компонента, у которых не был указан атрибут **slot**. Однако внутри одного и того же компонента HTML-элементы без атрибута **slot** не будут попадать в слот по умолчанию. Они считаются простыми HTML-элементами самого компонента и отображаются в обычном режиме.

Например,

```javascript _run_edit_[my-component.js]_h=100_
 ODA({
    is: 'my-component',
    template: `
        <div>Мой слот 1</div>
        <div>
            <div>Мой слот 2</div>
                <div style="border: 4px solid red;">
                    <slot></slot>
                </div>
            <div slot="mySlot">Мой слот 3</div>
        </div>
        <div>Мой слот 4</div>
    `,
});
```
======================================================================

Чтобы слот не оставался пустым, в нем можно предусмотреть вывод содержимого по умолчанию, которое будет отображаться когда в слот не попадает ни один другой элемент.

Например,

```javascript _run_edit_[my-component.js]_h=100_
 ODA({
    is: 'my-component',
    template: `
        <div>Мой слот 1</div>
        <div>
            <div>Мой слот 2</div>
                <div style="border: 2px solid red;">
                    <slot>Значение по умолчанию</slot>
                </div>
            <div slot="mySlot">Мой слот 3</div>
        </div>
        <div>Мой слот 4</div>
    `,
});
```

Относительно «светлого» дерева механизм работы слотов изменяется. В нем:

1. В именованные слоты и в слоты по умолчанию соответствующие элементы не добавляются.
1. Не попавшие в слоты элементы с атрибутом **slot** отображаются как обычные HTML-элементы.
1. Если в слоте задано значение по умолчанию, то оно будет отображаться в том месте, где был расположен слот.

Например,

```html run_edit
<!DOCTYPE html>
<html lang="en">
    <body>
        <div slot="mySlot">Мой слот 1</div>
        <div style="border: 4px solid black">
            <slot name="mySlot">Именованный слот</slot>
        </div>

        <div>Мой слот 2</div>
        <div style="border: 4px solid gray">
            <slot>Слот по умолчанию</slot>
        </div>
    </body>
</html>
```

В данном примере слоты выделены рамками разных цветов, внутри которых отображаются только значения по умолчанию, так как другие элементы не попали в эти слоты, хотя имена слотов у них совпадали. Эти элементы отображаются в документе сами по себе.

Для того чтобы элементы светлого дерева попали в слот теневого дерева, необходимо записать их внутри тэга пользовательского компонента.

Например,

```html run_edit
<!DOCTYPE html>
<html lang="en">
    <head>
        <script type="module" src="oda.js"></script>
    </head>
    <body>
        <my-component>
             <div slot="mySlot">Мой именованный слот</div>
             <div>Мой слот по умолчанию</div>
        </my-component>
        <script type="module">
            ODA({
                is: 'my-component',
                template: `
                    <slot name="mySlot">Именованный слот</slot>
                    <slot>Слот по умолчанию</slot>
                `,
            });
        </script>
    </body>
</html>
```

Элементы находящиеся за пределами тэга компонента не будут попадать в теневое дерево из «светлого». Они будут просто отображаться в «светлом» дереве, а слоты будут выводить значения по умолчанию.

Например,

```html run_edit
<!DOCTYPE html>
<html lang="en">
    <head>
        <script type="module" src="oda.js"></script>
    </head>
    <body>
        <div slot="mySlot">Мой именованный слот</div>
        <div>Мой слот по умолчанию</div>
        <my-component></my-component>
        <script type="module">
            ODA({
                is: 'my-component',
                template: `
                    <slot name="mySlot">Именованный слот по умолчанию</slot>
                    <slot>Слот по умолчанию</slot>
                `,
            });
        </script>
    </body>
</html>
```

Относительно теневого дерева механизм заполнения слотов изменяется.

Если один компонент не вложен в другой, то механизм связывания слотов не будет работать, т.е. HTML-элементы из несвязанных теневых деревьев не будут добавляться в слоты.

Например,

```javascript _run_edit_[my-component1.js]_h=100_

ODA({
    is: 'my-component1',
    template: `
        <div style="border: 2px solid red;">
            <slot name="mySlot">Слот пуст</slot>
        </div>
    `,
});

ODA({
    is: 'my-component2',
    template: `
        <div slot="mySlot">Мой компонент 2</div>
    `,
});
```

Если один компонент вложен в другой, то сначала будут заполняться слоты вложенного компонента, расположенные на один уровень ниже компонента, в котором объявлены HTML-элементы для них.

Например,

```javascript _run_edit_[base-component.js]_h=100_
ODA({
    is: 'base-component',
    template: `
        <div slot="mySlot">Родительский элемент</div>
        <div style="border: 4px solid red; padding: 2px; margin: 2px">
            <slot name="mySlot">Родительский слот пуст</slot>
        </div>
        <my-component></my-component>
    `,
});

ODA({
    is: 'my-component',
    template: `
        <div slot="mySlot">Текущий элемент</div>
        <div style="border: 4px solid green; padding: 2px; margin: 2px">
            <slot name="mySlot">Текущий слот пуст</slot>
        </div>
        <child-component></child-component>
    `,
});

ODA({
    is: 'child-component',
    template: `
        <div style="border: 4px solid blue; padding: 2px; margin: 2px">
            <slot name="mySlot">Дочерний слот пуст</slot>
        </div>
    `,
});
```

В данном примере в слот первого компонента не будут добавляться его элементы, так как они попадают в слот компонента **my-component**, расположенного на один уровень ниже. В слот компонента **child-component** будут добавляться элементы его непосредственного родителя — компонента **my-component**, но элементы прародителя в его слот не попадут, так как прародитель находится на два уровня выше компонента **child-component**.

Данный механизм не зависит от того, где расположены HTML-элементы: внутри тега компонента или нет.

```javascript _run_edit_[base-component.js]_h=100_

ODA({
    is: 'base-component',
    template: `
        <div style="border: 4px solid red; padding: 2px; margin: 2px">
            <slot name="mySlot">Родительский слот пуст</slot>
        </div>
        <my-component>
            <div slot="mySlot">Родительский элемент</div>
        </my-component>
    `,
});

ODA({
    is: 'my-component',
    template: `
        <div style="border: 4px solid green; padding: 2px; margin: 2px">
            <slot name="mySlot">Текущий слот пуст</slot>
        </div>
        <child-component>
            <div slot="mySlot">Текущий элемент</div>
        </child-component>
    `,
});

ODA({
    is: 'child-component',
    template: `
        <div style="border: 4px solid blue; padding: 2px; margin: 2px">
            <slot name="mySlot">Дочерний слот пуст</slot>
        </div>
    `,
});
```

Результат данного примера останется таким же, как и у предыдущего примера.

Если у вложенных компонентов нет подходящих слотов на одном уровне ниже, то элементы будут вставляться в слот текущего компонента.

```javascript _run_edit_[base-component.js]_h=100_
ODA({
    is: 'base-component',
    template: `
        <div slot="mySlot">Родительский элемент</div>
        <div style="border: 4px solid red; padding: 2px; margin: 2px">
            <slot name="mySlot">Родительский слот пуст</slot>
        </div>
        <my-component></my-component>
    `,
});

ODA({
    is: 'my-component',
    template: `
        <div slot="mySlot1">Текущий элемент</div>
        <div style="border: 4px solid green; padding: 2px; margin: 2px">
            <slot name="mySlot1">Текущий слот пуст</slot>
        </div>
        <child-component></child-component>
    `,
});

ODA({
    is: 'child-component',
    template: `
        <div slot="mySlot">Вложенный элемент</div>
        <div style="border: 4px solid blue; padding: 2px; margin: 2px">
            <slot name="mySlot">Дочерний слот пуст</slot>
        </div>
    `,
});
```

Если у самого компонента и у вложенных компонентов нет подходящих слотов на одном уровне ниже, то HTML-элементы будут вставляться в слот родительского компонента не зависимо от уровня его расположения.

```javascript _run_edit_[base-component.js]_h=100_
ODA({
    is: 'base-component',
    template: `
        <div slot="mySlot">Родительский элемент</div>
        <div style="border: 4px solid red; padding: 2px; margin: 2px">
            <slot name="mySlot">Родительский слот пуст</slot>
        </div>
        <my-component></my-component>
    `,
});

ODA({
    is: 'my-component',
    template: `
        <div slot="mySlot">Текущий элемент</div>
        <child-component></child-component>
    `,
});

ODA({
    is: 'child-component',
    template: `
        <div slot="mySlot">Вложенный элемент</div>
    `,
});
```

Для элементов по умолчанию сохраняются те же самые правила, что и для именованных слотов, но они должны быть обязательно указаны внутри тегов компонентов.

```javascript _run_edit_[base-component.js]_h=100_

ODA({
    is: 'base-component',
    template: `
        <div style="border: 4px solid red; padding: 2px; margin: 2px">
            <slot>Родительский слот по умолчанию пуст</slot>
        </div>
        <my-component>
            <div>Родительский элемент</div>
        </my-component>
    `,
});

ODA({
    is: 'my-component',
    template: `
        <div style="border: 4px solid green; padding: 2px; margin: 2px">
            <slot>Текущий слот по умолчанию пуст</slot>
        </div>
        <child-component>
            <div>Текущий элемент</div>
        </child-component>
    `,
});

ODA({
    is: 'child-component',
    template: `
        <div style="border: 4px solid blue; padding: 2px; margin: 2px">
            <slot>Дочерний слот по умолчанию пуст</slot>
        </div>
    `,
});
```

Если элементы по умолчанию указать вне тегов компонента, то они будут рассматриваться как элементы самого компонента и не будут добавляться в слоты по умолчанию.

```javascript _run_edit_[base-component.js]_h=100_
ODA({
    is: 'base-component',
    template: `
        <div style="border: 4px solid red; padding: 2px; margin: 2px">
            <slot>Родительский слот по умолчанию пуст</slot>
        </div>
        <div>Родительский элемент</div>
        <my-component></my-component>
    `,
});

ODA({
    is: 'my-component',
    template: `
        <div style="border: 4px solid green; padding: 2px; margin: 2px">
            <slot>Текущий слот по умолчанию пуст</slot>
        </div>
        <div>Текущий элемент</div>
        <child-component></child-component>
    `,
});

ODA({
    is: 'child-component',
    template: `
        <div style="border: 4px solid blue; padding: 2px; margin: 2px">
            <slot>Дочерний слот по умолчанию пуст</slot>
        </div>
        <div>Дочерний элемент</div>
    `,
});
```

Если в родительском компоненте будут указаны сразу несколько вложенных компонентов, у каждого из которых есть слот с одним и тем же именем, то родительские HTML-элементы будут добавляться только в слот того компонента, который был указан у родителя первым.

```javascript _run_edit_[base-component.js]_h=100_
ODA({
    is: 'base-component',
    template: `
        <div slot="mySlot">Родительский элемент</div>
        <my-component1></my-component1>
        <my-component2></my-component2>
    `,
});

ODA({
    is: 'my-component1',
    template: `
        <div style="border: 4px solid lime; padding: 2px; margin: 2px">
            <slot name="mySlot">Слот 1 пустой</slot>
        </div>
    `,
});

ODA({
    is: 'my-component2',
    template: `
        <div style="border: 4px solid green; padding: 2px; margin: 2px">
            <slot name="mySlot">Слот 2 пустой</slot>
        </div>
    `,
});
```

Если у нескольких вложенных компонентов есть элементы с именем родительского слота, то все они будут добавлены в слот родительского компонента.

```javascript _run_edit_[base-component.js]_h=100_
ODA({
    is: 'base-component',
    template: `
        <div style="border: 4px solid red; padding: 2px; margin: 2px">
            <slot name="mySlot">Родительский слот пустой</slot>
        </div>
        <my-component1></my-component1>
        <my-component2></my-component2>
    `,
});

ODA({
    is: 'my-component1',
    template: `
        <div slot="mySlot">Вложенный элемент 1</div>
    `,
});

ODA({
    is: 'my-component2',
    template: `
        <div slot="mySlot">Вложенный элемент 2</div>
    `,
});
```

При изменении внешнего HTML-элемента, содержимое слота будет автоматически изменяться.

Например,

```javascript _run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <label>Введите содержимое слота <input type="text" ::value></label>
        <span slot="mySlot">{{value}}</span>
        <my-component2></my-component2>
    `,
    props: {
        value: 'Мой слот'
    }
});

ODA({
    is: 'my-component2',
    template: `
        <slot name="mySlot"></slot>
    `,
});
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/AVo1Umu9dTE?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
