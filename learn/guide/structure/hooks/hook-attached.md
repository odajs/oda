Хук **attached** предусмотрен в конце колбэка **connectedCallback** класса компонента.

Этот колбэк вызывается автоматически после выполнения конструктора, когда изменяется прототип узла с именем пользовательского компонента внутри документа.

Диаграмма жизненного цикла компонента до этого момента имеет следующий вид:

![Диаграмма для хука attached](./learn/images/hook-attached.svg "Хук присоединения attached")

В отличие от хука **ready**, здесь:

1. К хосту компонента будут добавлены атрибуты на основе свойств, у которых задан модификатор **reflectToAttribute**.
1. Будут выполнены обозреватели.
1. Будут зарегистрированы слушатели компонента.

Например:

```javascript_run_edit_console_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div>{{text}}</div>
    `,
    props: {
        text: {
            default: "Привет, хук attached!",
            reflectToAttribute: true
        }
    },
    listeners: {
        attached() {
            console.log('Слушатель задан')
        }
    },
    observers: [
        function observer(text) {
            console.log('Обозреватель выполнен');
        }
    ],
    attached() {
        console.log('Хук attached сработал');
        console.log(this.getAttribute('text'));
        console.log('Атрибуты добавлены');
    }
});
```

Фактически в этом месте компонент полностью создан, однако он еще не прорисован на странице в браузере.

В этом хуке чаще всего задаются пользовательские действия, которые необходимо выполнить до первого использования компонента. В нем, например, можно сообщить другим, что компонент был создан, загрузить дополнительные данные для него и т.д.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/DEuK558YTpQ?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
