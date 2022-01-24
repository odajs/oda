Хук **ready** вызывает одноименный метод в конце конструктора класса компонента.

Диаграмма жизненного цикла компонента до этого момента имеет следующий вид:

![Диаграмма для хука ready](./learn/images/hook-ready.svg "Хук готовности ready")

В отличие от хука **created**, здесь:

1. Прототип компонента регистрируется внутри специального свойства **telemetry**.
1. Все элементы из раздела **hostAttributes** добавляются в атрибуты хоста компонента.
1. Осуществляется рендеринг JSX-шаблона компонента **template**.

Например:

```javascript _run_edit_console_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div>{{text}}</div>
    `,
    props: {
        text: "Привет, хук ready!"
    },
    hostAttributes: {
        attr: "Атрибут хоста"
    },
    ready() {
        console.log('ready');
        console.log(ODA.telemetry.components['my-component'].prototype.is);
        console.log(this.$core.shadowRoot.innerHTML);
        console.log(this.getAttribute('attr'));
    }
});
```

Фактически в этом месте компонент уже создан. Метод **window.customElements.define** интерфейса **CustomElementRegistry** зарегистрировал его на странице в браузере, а конструктор изменил прототип у узла с именем компонента в документе. Однако колбэк этого события **connectedCallback** еще не был вызван, а сам компонент в окне браузера пока что не прорисован.

В этом месте:

1. Еще не заданы атрибуты компонента, формируемые на основе его свойств с модификатором **reflectToAttribute**.
1. Обозреватели и слушатели компонента не зарегистрированы.

Эти элементы здесь еще можно изменить, если в этом есть необходимость.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/Vo-5L6SSZfE?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
