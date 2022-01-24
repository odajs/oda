Перенацеливание (**retargeting**) — это изменение источника возникновения события при переходе через теневое дерево компонента.

При возникновении события внутри компонента его целевым источником (**target**) изначально считается элемент, который был инициатором события.

Например:

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <span>Счетчик: {{count + ' '}}</span>
        <button @tap="_onTap">{{text}}</button>
        <div>Внутренний источник: {{innerTarget}}</div>
    `,
    props: {
        count: 0,
        text: 'Кнопка',
        innerTarget: ''
    },
    _onTap(e) {
        this.count++;
        this.innerTarget = e.target.localName;
    }
});
```

Изначально в этом примере источником возникновения события **tap** будет элемент **button**.

Однако в процессе всплытия целевой источник события автоматически изменится при переходе через теневое дерево — новым источником события станет сам компонент независимо от того, какой элемент был инициатором события внутри него.

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <span>Счетчик: {{count + ' '}}</span>
        <button @tap="_onTap">{{text}}</button>
        <div>Внутренний источник: {{innerTarget}}</div>
        <div>Внешний источник: {{outerTarget}}</div>
    `,
    props: {
        count: 0,
        text: 'Кнопка',
        innerTarget: '',
        outerTarget: ''
    },
    _onTap(e) {
        this.count++;
        this.innerTarget = e.target.localName;
    },
    listeners: {
        tap(e) {
            this.outerTarget = e.target.localName;
        }
    }
});
```

Такое поведение события (**retargeting**) определяется самим браузером и позволяет скрывать внутреннюю детализацию компонента.

В результате этого невозможно узнать какой элемент стал источником возникновения события за границами теневого дерева. В качестве него всегда будет выступать сам компонент.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/HKN9EnQQquA?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
