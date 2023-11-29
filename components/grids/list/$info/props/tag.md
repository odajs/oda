Свойство **tag** хранит текущее название тэга списка элементов.

Это свойство может принимать только два значения:

1. **ul** — маркированный список.
1. **ol** — нумерованный список.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=140_
import '/components/grids/list/list.js';
ODA({
    is: 'my-component',
    template: `
        <label>Тэг: {{text}} <input type="checkbox" @change="onChange"></label>
        <oda-list ref="list" :items ::numerable marker></oda-list>
    `,
    props: {
        items: ["Элемент 1", "Элемент 2", "Элемент 3", "Элемент 4", "Элемент 5"],
        numerable: false,
        text: 'ul'
    },
    hostAttributes: {
        id: 'my'
    },
    onChange() {
        this.numerable = !this.numerable;
        setTimeout(() => my.text = my.$refs.list.tag, 0);
    }
});
```

По умолчанию свойство **numerable** у компонента установлено в значение **false**. Поэтому свойство **tag** у списка изначально имеет значение **ul**.

Вызов функции **setTimeout** в данном примере связан с тем, что тэг списка изменяется только после выполнения обработчика **onChange**. В теле обработчика тэг списка еще имеет предыдущее значение, которое противоположно новому установленному значению.
