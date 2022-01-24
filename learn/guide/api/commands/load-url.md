Команда **ODA.loadURL** позволяет загрузить любой ресурс c указанного URL-адреса.

Она вызывается следующим образом:

```javascript
ODA.loadURL(url);
```

Ей передается один параметр **url** — адрес загружаемого ресурса.

В результате выполнения этой команды возвращается промис с полученным результатом запроса по указанному адресу.

Например,

```javascript run_edit_[my-component.js]_h=100_
import '/components/buttons/icon/icon.js';
ODA({
    is: 'my-component',
    template: `
        <label>URL-адрес: <input type="url" ::value></label><br>
        <textarea ::value="text" style="height: 100px; width: 300px" placeholder="Результат запроса"></textarea><br>
        <button @tap="onTap">Загрузить</button>
    `,
    props: {
        value: 'https://odajs.org/oda.js',
        text: ''
    },
    async onTap() {
        let response = await ODA.loadURL(this.value);
        this.text = await response.text();
    }
});
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/8dyq6X9Bh_M?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
