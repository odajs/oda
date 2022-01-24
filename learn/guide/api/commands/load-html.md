Команда **ODA.loadHTML** позволяет загрузить ресурс с указанного URL-адреса в формате HTML.

Она имеет вызывается следующим образом:

```javascript
ODA.loadHTML(url);
```

Ей передается один параметр **url** — URL-адрес загружаемого ресурса.

В результате выполнения этой команды возвращается промис с полученным результатом запроса, представленным в виде DOM-объекта с типом **HTMLDocument**.

Например,

```javascript run_edit_[my-component.js]_h=150_
ODA({
    is: 'my-component',
    template: `
        <label>URL-адрес: <input type="url" ::value style="width: 45%"></label><br>
        <textarea ::value="text" style="height: 100px; width: 25%" placeholder="Результат запроса"></textarea>
        <iframe ref="frame" width="25%" height="100"> </iframe><br>
        <button @tap="onTap">Загрузить</button>
    `,
    props: {
        value: 'https://odajs.org/learn/guide/api/commands/example.html',
        text: ''
    },
    async onTap() {
        let result = await ODA.loadHTML(this.value);
        this.text = '<!DOCTYPE html>' + result.documentElement.outerHTML;
        var doc = this.$refs.frame.contentWindow.document;
        doc.open();
        doc.write(this.text);
        doc.close();
    }
});
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/idYh8p8KOlU?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
