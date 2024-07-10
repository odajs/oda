Механизм сохранения данных компонента в Web-хранилище браузера реализован на базе объекта [**window.localStorage**](https://developer.mozilla.org/ru/docs/Web/API/Window/localStorage).

```warning_md
Не рекомендуется напрямую использовать объект [**window.localStorage**](https://developer.mozilla.org/ru/docs/Web/API/Window/localStorage) для работы с Web-хранилищем. Обход механизмов фреймворка может привести к непредсказуемым результатам.
```

Фреймворк сохраняет данные в виде пары ключ/значение. В общем случае ключ состоит из двух частей, соединенных символом прямого слеша (**/**).

В качестве первой части ключа фреймворк использует имя компонента, в котором находятся сохраняемые свойства. Вторая часть ключа берется из директивы [**~save-key**](./index.html#structure-template-jsx-directives-~save-key.md), если она присутствует в теге компонента. Если директива отсутствует или её значением является пустая строка, то вторая часть у ключа отсутствует, также отсутствует соединяющий части прямой слеш (**/**).

В общем случае ключ имеет вид: `имяКомпонента/значениеИз~save-key`

Например,

```javascript _run_edit_[test-save.js]
ODA({
    is: 'test-save',
    template: `
        <input ::value>
        <button @tap="clear">Очистить</button>
    `,
    value: {
        $def: 'Пример для $save',
        $save: true
    },
    clear() {
        this.$resetSettings();
        window.location.reload(true);
    }
});
```

В данном примере ключом для сохранения данных будет имя компонента **test-save**. Чтобы в этом убедиться, измените в строке ввода значение, заданное по умолчанию, например на текст **«тест ключа»**. Затем откройте окно инструментов разработчика и на закладке **Application** и в разделе **Storage** в списке **Local storage** выберите сервер, с которого Вы читаете эту документацию (в нашем примере ***https://odajs.org***). Убедитесь, что в списке сохраненных значений есть запись с ключом **test-save**. В данном примере не использовалась директива [**~save-key**](./index.html#structure-template-jsx-directives-~save-key.md), поэтому ключ состоит только из имени компонента.

![Запись в Web-хранилище](learn/_help/ru/_images/structure-props-modifiers-$save-additional-1.png "Запись в Web-хранилище")


---




Реальный ключ, которым оперирует свойство **window.localStorage**, гораздо длиннее ключа, указанного в директиве **~save-key**. Полный ключ состоит из имени компонента, и ключа, указанного в директиве **~save-key**. Имя компонента и ключ соединяются точкой. Полный ключ однозначно определяет экземпляр компонента, которому принадлежат сохраненные данные.

Пример 1

```javascript _edit_[my-input-component.js]
ODA({
    is: 'my-input-component',
    template: `
        <input ::value="value1">
        <input ::value="value2">
        <button @tap="_clear">Очистить хранилище</button>
    `,
    $public: {
        value1: {
            $def: 'Введите текст 1',
            $save: true
        },
        value2: {
            $def: 'Введите текст 2',
            $save: true
        }
    },
    _clear() {
        this.clearSaves();
        window.location.reload(true);
    }
});
```

```javascript _run_edit_[my-component.js]_{my-input-component.js}
ODA({
    is: 'my-component',
    template:`
        <my-input-component ~save-key="'key4'"></my-input-component>
        <div>В хранилище: {{window.localStorage.getItem("my-input-component.key4")}}</div>
    `
});
```

В данном примере полный ключ имеет вид:

**my-input-component.key4**.

---


```javascript _run_edit_[my-component.js]_{my-input-component.js}

ODA({
    is: 'my-new-component',
    template:`
        <my-input-component ~save-key="'key44'"></my-input-component>
    `
});



ODA({
    is: 'my-component',
    template:`
        <my-new-component ~save-key="'key55'"></my-new-component>
        <my-new-component ~save-key="'key66'"></my-new-component>
        <div>В хранилище: {{window.localStorage.getItem("my-input-component/key4")}}</div>
    `
});
```




---

```info_md
Если директива **~save-key** не используется, то полный ключ состоит только из имени компонента.
```

Значение всех свойств компонента хранится в единой строке в JSON-формате в виде множества пар **имя_свойства:значение**.

Если в примере в поля ввода ввести значения "текст 1" и "текст 2", то сохраненная строка будет иметь вид:

**{"value1":"текст 1","value2":"текст 2"}**

```info_md
Если в процессе работы одно из свойств компонента вновь примет значение по умолчанию, то оно будет удалено из сохраненной строки.
```

Так, если в нашем примере в первой строке ввода ввести текст **Введите текст 1**, соответствующий тексту по умолчанию, то значение для свойства **value1** будет удалено из хранилища, и сохраненная строка примет вид:

**{"value2":"текст 2"}**

```info_md
Если компонент создан в режиме наследования, и сохраняемые свойства объявлены в родительском компоненте, то в первой части полного ключа будет использоваться имя дочернего компонента.
```

Пример 2

```javascript _run_edit_[my-component.js]_{my-input-component.js}
ODA({
    is: 'my-derived-component',
    extends: 'my-input-component',
    template:``
});
ODA({
    is: 'my-component',
    template:`
        <my-derived-component ~save-key="'key5'"></my-derived-component>
        <div>В хранилище: {{window.localStorage.getItem("my-derived-component.key5")}}</div>
    `
});
```

В данном примере сохраняемые свойства объявлены в компоненте **my-input-component**, но в полном ключе используется имя дочернего компонента **my-derived-component**.
