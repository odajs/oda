Команда **ODA.loadJSON** позволяет загрузить ресурс с указанного URL-адреса в формате JSON.

Она вызывается следующим образом:

```javascript
ODA.loadJSON(url);
```

Ей передается один параметр **url** — URL-адрес загружаемого ресурса.

В результате выполнения этой команды возвращается промис с полученным результатом запроса по указанному адресу в формате **JSON**.

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
        value: 'https://odajs.org/tools/languages/dictionaries/ru.json',
        text: ''
    },
    async onTap() {
        let result = await ODA.loadJSON(this.value);
        this.text = JSON.stringify(result);
    }
});
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/ieQBxpYWCpI?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
