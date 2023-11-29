Идентификатор **is** используется для указания уникального имени компонента.

Под этим именем компонент регистрируется в браузере на HTML-странице.

```warning_md
Имя компонента обязательно должно начинаться со строчной латинской буквы и должно содержать по крайней мере хотя бы один знак дефиса в соответствии с требованиями [стандарта HTML](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name).
```

Например:

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <span>is = {{localName}}</span>
    `,
});
```

В этом примере JS-функция **ODA** автоматически создает компонент с указанным именем. В результате этого в браузере регистрируется пользовательский элемент, теневое дерево которого прикрепляется к одноименному тэгу **my-component**.

```html _line
<my-component>
    #shadow-root (closed)
       <span>is = my-component</span>
</my-component>
```

Этот тэг и становится хостом (хозяином) данного компонента, к которому можно обращаться внутри компонента через указатель **this**.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <span>is = {{this.localName}}</span>
    `,
});
```

Этот указатель в директивах и в интерполяционной подстановке **{{}}** можно не использовать. В них он задается автоматически с помощью инструкции **with**. Тем не менее если указать ключевое слово **this**, то никакой ошибки не будет. Однако такая запись станет более сложной и менее наглядной.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/IhVmjfUGEJ4?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
