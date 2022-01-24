Директива биндинга **:** задается символом двоеточия и используется для динамического связывания значения атрибута или свойства HTML-элемента с указанным JS-выражением.

При любом изменении значения JS-выражения связанное с ним свойство или атрибут элемента, в котором указана директива биндинга, будет автоматически изменяться. Имя связанного свойства или атрибута записывается в ней непосредственно перед JS-выражением через символ **=**.

Пример 1
```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <input :value="text">
        <button @tap="_onTap">Bind</button>
    `,
    props: {
        text: 'Привет, binding!'
    },
    _onTap() {
        this.text = this.text==='Привет, binding!' ?  'Я на связи' : 'Привет, binding!';
    }
});
```

В данном примере свойство **value** нативного HTML-элемента **input** связывается со свойством **text** пользовательского компонента. Любое изменение свойства **text** приведет к изменению JS-выражения, которое динамически изменит связанное с ним свойство **value** элемента **input**.

``` like_md
Для директивы биндинга можно использовать сокращенную форму, в которой указывается только двоеточие и имя свойства элемента, а знак равенства и JS-выражение опускаются. В этом случае фреймворк автоматически связывает указанное свойство с одноименным свойством пользовательского компонента, если оно существует.
```

Пример 2
```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <input :value>
        <button @tap="_onTap">Bind</button>
    `,
    props: {
        value: 'Привет, binding!'
    },
    _onTap() {
        this.value = this.value==='Привет, binding!' ?  'Я на связи' : 'Привет, binding!';
    }
});
```

В этом примере имя свойства компонента **value** совпадает с именем свойства элемента **input**, поэтому в директиве биндинга знак равно и JS-выражение, идущее после него, не указано. Фактически эта запись является синтаксическим упрощением (т.н. "сахаром"), позволяющим дважды не указывать одно и тоже имя **value** как для свойства элемента **input**, так и для свойства пользовательского компонента.

``` like_md
Связывать можно не только свойства, но и атрибуты элемента.
```

Пример 3
```javascript _run_edit_[my-component.js]_h=100_
ODA({
    is: 'my-component',
    template: `
        <a :href="myUrl">Привет, атрибут</a>
    `,
    props: {
        myUrl: 'https://odajs.org/#learn'   //'http://htmlbook.ru/example/knob.html'
    }
});
```

В этом примере атрибут **href** HTML-элемента **a** будет связан со свойством компонента **myUrl**. Любое изменение этого свойства будет приводить к изменению атрибута **href**.

Аналогичным образом можно связывать свойства вложенного и родительского компонентов.

Пример 4
```javascript _edit_[second-component.js]
ODA({
    is: 'second-component',
    template: `
        <span>{{secondText}}</span>
    `,
    props: {
        secondText: {
            default: "Второй компонент"
         }
    }
});
```

```javascript _run_edit_blob_[first-component.js]_{second-component.js}
ODA({
    is: 'first-component',
    template: `
        <button @tap="_onTap">Изменить текст</button>
        <second-component :second-text="firstText"></second-component>
    `,
    props: {
        firstText: {
            default: "Первый компонент"
        }
    },
    _onTap() {
        this.firstText = this.firstText==='Первый компонент' ? 'Второй компонент' : 'Первый компонент';
    }
});
```

Обратите внимание на использование в примере имени свойства вложенного компонента. В прототипе компонента имя свойства задано в camelCase **secondText**, а в директиве оно указано в kebab-case **second-text**.

```info_md
С точки зрения HTML, директива биндинга представляет собой атрибут тега и, соответственно, должна строго следовать требованиям, предъявляемым к синтаксису атрибута. HTML является регистронезависимым языком, поэтому нельзя напрямую использовать в левой части директивы биндинга имена свойств, написанных в camelCase, необходимо преобразовать имена свойств в kebab-case.
```

Директивой биндинга можно привязать к вложенному компоненту не только свойства родительского компонента, но и его методы.

Пример 5
```javascript _edit_[second-component2.js]
ODA({
    is: 'second-component',
    template: `
        <span>{{method}}</span>
    `,
    props: {
        method: {
            type: Function
        }
    }
});
```

```javascript _run_edit_blob_[first-component.js]_{second-component2.js}
ODA({
    is: 'first-component',
    template: `
        <second-component :method="myMethod"></second-component>
    `,
    props: {
        myText: "Текст для вложенного компонента"
    },
    myMethod() {
        return this.myText;
    }
});
```

```info_md
Несмотря на то, что метод вызывается вложенным компонентом, его контент остается связанным с родительским компонентом, т.е. указатель **this** внутри метода будет ссылаться на родительский компонент, а не на вложенный.
```

Пример 6 показывает особенности биндинга объектов:

```javascript _edit_[second-component3.js]
ODA({
    is: 'second-component',
    template: `
        <button @tap="++secondObject.counter">Инкремент</button>
        <span>Счетчик во вложенном компоненте {{secondObject.counter}}</span>
    `,
    props: {
        secondObject: {
            counter: 0
         }
    }
});
```

```javascript _run_edit_blob_[first-component.js]_{second-component3.js}
ODA({
    is: 'first-component',
    template: `
        <second-component :second-object="firstObject"></second-component>
        <br><button @tap="--firstObject.counter">Декремент</button>
        <span>Счетчик в родительском компоненте {{firstObject.counter}}</span>
    `,
    props: {
        firstObject: {
            counter: 0
         }
    }
});
```

В данном примере можно видеть, что инкремент счетчика в объекте вложенного компонента изменяет счетчик в объекте родительского компонента, хотя используется директива однонаправленного биндинга.

Это происходит потому, что при биндинге объектов во вложенный компонент передаются не данные из объекта, принадлежащего родительскому компоненту, а ссылка на объект. В результате получается, что свойства **secondObject** и **firstObject** ссылаются на один и тот же объект, и данные в указанных свойствах являются общими.

Аналогичным образом при связывании массивов передаются не данные, а ссылка на массив, принадлежащий родительскому компоненту. Данные в обоих массивах также становятся общими.

Пример 7
```javascript _edit_[second-component4.js]
ODA({
    is: 'second-component',
    template: `
        <button @tap="++secondArray[0]">Инкремент</button>
        <span>Элемент массива во вложенном компоненте {{secondArray[0]}}</span>
    `,
    props: {
        secondArray: [0]
    }
});
```

```javascript _run_edit_blob_[first-component.js]_{second-component4.js}
ODA({
    is: 'first-component',
    template: `
        <second-component :second-array="firstArray"></second-component>
        <br><button @tap="--firstArray[0]">Декремент</button>
        <span>Элемент массива в родительском компоненте {{firstArray[0]}}</span>
    `,
    props: {
        firstArray: [0]
    }
});
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/y7rQcLsUARk?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
