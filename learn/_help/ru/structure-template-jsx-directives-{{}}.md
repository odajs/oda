template — это свойство прототипа, в котором указвается JSX-шаблон компонента.

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <span>${Math.sqrt(2) + 1}</span>
        <span>{{text + "!!"}}</span>
        <button @tap='onTap'>Кнопка</button>
    `,
    $public: {
        text: 'Hello, template!'
    },
    onTap() {
        if (this.text === 'Hello, template!') {
            this.text = 'Hello, reactivity!';
        } else {
            this.text = 'Hello, template!';
        }
    }
});
```

```info
По своей структуре свойство **template** является шаблонным литералом, и записывается в обратных кавычках (backticks), называемых грависами (grave accent) или обратными апострофами.
```

Шаблонные литералы позволяют использовать многострочные литералы и строковую интерполяцию. В результате этого шаблон компонента можно записывать на разных строках текста не заботясь о символах переноса на новую строку, а также использовать возможность вставки различных переменных или выражений JS внутри шаблона.

В качестве строковой интерполяции можно использовать следующие подстановки:

1. Фигурные скобки со знаком доллара.

    ```javascript
    ${ }
    ```

   В фигурных скобках можно использовать все возможности языка JS, но элементы самого компонента в них будут не доступны, так как сам компонент еще не создан.

1. Двойные фигурные скобки (Mustache-нотацию).

    ```javascript
    {{ }}
    ```

    В двойных фигурных скобках можно использовать и все возможности языка JS и все элементы компонента с учетом их реактивности. При этом обращаться к элементам компонента можно без использования ключевого слова this, так как контент в двойных фигурных скобках рассматривается по умолчанию относительно самого компонента.

В данном примере в двойных фигурных скобках указано выражение, использующее имя свойства компонента **text**.  При парсинге шаблона, при помощи функции ParseJSX, значение свойства  **text** будет подставлено в это выражение. Это значение будет автоматически обновляться при любом изменении свойства **text** в дальнейшем, реализуя механизм реактивности компонента.