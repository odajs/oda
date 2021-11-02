Свойство **marker** определяет вид маркера у маркированного списка или наличие счетчика у нумерованного списка.

У этого свойства существуют 4 предопределенных значения:

1. **none** — маркер или счетчик отсутствует.
1. **disc** — маркер отображается в виде круга.
1. **circle** — маркер отображается в виде окружности.
1. **square** — маркер отображается в виде квадрата.

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=140_
import '/components/grids/list/list.js';
ODA({
    is: 'my-component',
    template: `
        <label>{{text}} <input type="checkbox" @change="onChangeNum" :numerable ></label>
        <select @change="onChangeMark">
            <option ~for="markers" :value="item" ~text="item"></option>
        </select>
        <oda-list ref="list" :items :numerable></oda-list>
    `,
    props: {
        items: ["Элемент 1", "Элемент 2", "Элемент 3", "Элемент 4", "Элемент 5"],
        markers: ['none', 'disc', 'circle', 'square', 'other'],
        numerable: false,
        text: 'Маркированный список: '
    },
    onChangeNum() {
        this.numerable = !this.numerable;
        this.text = (this.numerable ? 'Нумерованный': 'Маркированный') + ' список: ';
    },
    onChangeMark(e) {
        this.$refs.list.marker = e.target.value;
    }
});
```

По умолчанию свойство **marker** у компонента установлено в значение **none**. В этом случае счетчик для нумерованного списка и маркер для маркированного списка отображаться не будут.

``` info_md
Обратите внимание, что если использовать не предопределенное значение, то маркер для маркированного списка будет задан по умолчанию в виде круга **disc**, а для нумерованного — в виде счетчика.
```
