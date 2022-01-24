Сохранение данных в фреймворке реализовано на базе свойства [**window.localStorage**](https://developer.mozilla.org/ru/docs/Web/API/Window/localStorage).

```warning_md
Не рекомендуется напрямую использовать свойство **window.localStorage** для работы с Web-хранилищем. Обход механизмов фреймворка может привести к непредсказуемым результатам.
```

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
    props: {
        value1: {
            default: 'Введите текст 1',
            save: true
        },
        value2: {
            default: 'Введите текст 2',
            save: true
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
