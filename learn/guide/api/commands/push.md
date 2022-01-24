Команда **ODA.push** позволяет отправлять уведомления пользователю.

Она имеет следующий синтаксис:

```javascript
ODA.push(title = 'Warning!', {tag = 'message', body, icon = '/web/res/icons/warning.png', image}={})
```

Ей передаются два параметра, второй из которых подвергается деструктуризации. В результате этого у этой команды фактически будет пять параметров:

1. **title** — заголовок уведомления.
1. **tag** — уникальный идентификатор уведомления, с помощь которого его можно заменить или удалить.
1. **body** — основной текст уведомления.
1. **icon** — URL небольшого изображения, которое будет показано в уведомлении.
1. **image** — URL большого изображения, которое будет показано в уведомлении.

При первом посещении HTML-страницы пользователь должен разрешить отображение уведомлений для данного сайта, нажав на соответствующую кнопку в диалогом окне.

![Разрешение отображать уведомления](learn/guide/api/commands/images/requestNotification.png "Разрешить уведомления")

Если диалоговое окно будет закрыто или будет нажата кнопка **«Блокировать»**, то механизм отображения уведомлений для данного сайта будет заблокирован. Включить этот механизм снова можно будет только в настройках параметров безопасности сайта в браузере.

![Отключение блокировки уведомлений](learn/guide/api/commands/images/SiteSetting.png "Отключение блокировки уведомлений").

Например,

```javascript run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <input ::value='title'> <br>
        <input ::value='body'> <br>
        <label>Уникальный номер</label> <input ::value='tag'> <br>
        <label>Иконка</label> <input ::value='icon'> <br>
        <button @tap="onTap">Нажми на меня</button>
    `,
    props: {
        title: 'Заголовок сообщения',
        body: 'Тело сообщения',
        tag: 'MyMessage 1',
        icon: 'https://odajs.org/learn/guide/api/commands/images/icon.png',
        image: 'https://odajs.org/learn/guide/api/commands/images/odajs.png',
    },
    onTap() {
        ODA.push(this.title, {tag: this.tag, body: this.body, icon: this.icon, image: this.image});
    }
});
```

Если при получении уведомления поместить его в центр уведомлений, то любые другие уведомления с тем же самым уникальным идентификатором **tag** отображаться пользователю уже не будут. Они будут помещаться в центр уведомлений под тем же самым номером, заменяя содержимое предыдущего уведомления.

Если закрыть уведомление, не помещая его в центр уведомлений, то, при отправке другого уведомления с тем же самым идентификатором, оно будет отображаться пользователю уже как новое.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/58xle_2d5Oo?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
