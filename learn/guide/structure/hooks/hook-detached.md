Хук **detached** предусмотрен в конце колбэка **disconnectedCallback** класса компонента.

Этот колбэк вызывается автоматически во время удаления узла компонента из дерева документа.

Диаграмма жизненного цикла компонента с начала момента его удаления имеет следующий вид:

![Диаграмма для хука detached](./learn/images/hook-detached.svg "Хук удаления detached")

В соответствии с этой диаграммой перед вызовом хука **detached** будут удалены все ранее зарегистрированные слушатели компонента.

Например:

```javascript _run_edit_console_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div>{{text}}</div>
        <button @tap='_onTap'>Удали меня</button>
    `,
    props: {
        text: {
            default: "Привет, хук detached!",
            reflectToAttribute: true
        }
    },
    _onTap() {
        this.remove();
    },
    listeners: {
        detached() {
            console.log('Слушатель задан')
        }
    },
    detached() {
        console.log('Хук detached сработал');
        console.log('Слушатель уже удален');
        console.log(this.getAttribute('text'));
    }
});
```

Фактически в этом хуке компонент уже удален из DOM, но его ссылки с родителем еще не обновлены.

Здесь можно предусмотреть пользовательские действия, которые необходимо выполнить перед удалением компонента. Например, сообщить другим, что компонент удаляется, или освободить ранее выделенные для него пользовательские ресурсы в хуках: **created**, **ready** или **attached**.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/5MdGLwZtjxc?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
