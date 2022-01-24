Жизненный цикл компонента начинается с момента вызова для него функции ODA.

Она создает новый компонент на основе его прототипа, указанного в списке ее параметров.

![Диаграмма жизненного цикла для хука created](./learn/images/hook-created.svg "Хук создания created")

Сам компонент представляет собой объект с типом пользовательского класса **odaComponent**, который является наследником класса **HTMLElement** языка JavaScript. В результате этого он наследует все его [элементы](https://html.spec.whatwg.org/multipage/dom.html#htmlelement "Interface класса HTMLElement").

На основе информации о прототипе компонента в конструкторе его класса будут:

1. Заданы свойства компонента из раздела **props** с их начальными значениями.
2. Осуществлена регистрация учета реактивности для любых значений с помощью метода **makeReactive**.
3. Создано теневое дерево в закрытом режиме методом **attachShadow**, который возвращает указатель на его корень.

После этого с помощью хука будет вызыван одноименный метод **created**, если он был задан в компоненте.

Например:

```javascript _run_edit_console_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div>{{text}}</div>
    `,
    props: {
        text: "Привет, Хук created!"
    },
    created() {
        console.log('created');
        console.log(this.text);
        console.log(this.$core.shadowRoot);
        console.log(JSON.stringify(this.$core.shadowRoot));
    }
});
```

В этом методе значения свойств компонента уже определены с учетом их реактивности, а также создано теневое дерево. Однако оно все еще является пустым, так как шаблон компонента еще не разобран. Кроме этого, атрибуты, слушатели и обозреватели компонента еще не заданы.

Фактически этот хук можно использовать только для модификации значений свойств компонента.

После этого хука тело конструктора продолжит выполняться.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/L6CK0Re29Dc?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
