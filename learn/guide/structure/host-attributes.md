**hostAttributes** – свойство прототипа компонента, с помощью которого задаются начальные значения его атрибутов.

По своей структуре свойство **hostAttributes** является объектом, в котором перечисляются атрибуты, автоматически добавляемые в корневой тэг компонента.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <span>Атрибуты хоста</span>
    `,
    hostAttributes: {
        style: "color: green; background: lime; padding: 10px",
        attr: "value"
    }
});
```

В данном примере свойство **style** будет добавлено в хост компонента. В результате этого у него будет изменен стиль отображения, так как в его тэге появится атрибут с именем **style**.

```warning_md
Имена атрибутов автоматически преобразовываются из camel-нотации в kebab-нотацию из-за того, что в браузере эти атрибуты используются регистро**не**зависимым языком HTML, в то время как язык JavaScript, наоборот, является регистрозависимым, и, в соответствии со стандартом, в нем нельзя использовать знак дефиса в именах свойств объектов [ECMAScript 2015](https://ecma-international.org/ecma-262/6.0/#sec-object-initializer "ECMA 6.0").
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/VCiIP5uuBdM?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
