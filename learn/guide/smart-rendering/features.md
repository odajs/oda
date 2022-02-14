```warning_md
Если свойство не объявлено явно в прототипе компонента, а создается динамически в процессе работы, то изменения его значения не контролируются фреймворком, поэтому не считаются изменениями состояния компонента и не приводят к его рендерингу.
```

Например:

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <input ::value="change">
        <div>Время: {{methodTime()}}</div>
    `,
    methodTime() {
        var d = new Date();
        return d.toLocaleTimeString() + '.' + d.getMilliseconds();
    },
    created() {
        this.change = this.change || "Измени меня";
    }
});
```

В примере изменение значения свойства **change** в строке ввода не приводит к обновлению времени на странице. Т.к. это свойство не объявлено в прототипе компонента, а создается в хуке **created**, то его изменение не приводит к рендерингу компонента.

```warning_md
С осторожностью изменяйте значения свойств компонента в методе, вызываемом при рендеринге компонента. Такие изменения будут запускать повторный рендеринг, что увеличит нагрузку на вычислительные ресурсы.
```

Например:

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div>Значение счетчика: {{methodCount()}}</div>
    `,
    props: {
        count: 0,
    },
    methodCount() {
        return ++this.count;
    }
});
```

В примере значение счетчика непрерывно увеличивается, т.к. при рендеринге происходит вызов метода **methodCount** и инкремент свойства **count**, что в свою очередь вызывает рендеринг компонента, и процесс зацикливается.

```info_md
Изменение состояния одного независимого компонента не влияет на рендеринг другого независимого компонента.
```

Например:

```html run_edit
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Welcome to ODA.js</title>
        <script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda-framework/oda.js"></script>
    </head>
    <body>
        <my-count></my-count>
        <my-time></my-time>
        <script type="module">
            ODA({
                is: 'my-time',
                template: `
                    <div>Время: {{methodTime()}}</div>
                `,
                methodTime() {
                    var d = new Date();
                    return d.toLocaleTimeString() + '.' + d.getMilliseconds();
                }
            });

            ODA({
                is: 'my-count',
                template: `
                    <button @tap="++count">Счетчик: {{count}}</button>
                `,
                count: 0
            });
        </script>
    </body>
</html>
```

В примере время, выводимое компонентом **my-component**, не обновляется при нажатии на кнопку **Счетчик**, создаваемую компонентом **my-count**. Т.к. оба компонента взаимно независимые, то зменение состояния компонента **my-count** не влияет на рендеринг компонента **my-component**.

Если объединить несколько компонентов в одном компоненте, то изменение состояния любого из объединенных компонентов вызывает рендеринг всех остальных компонентов.

Например:

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <my-change></my-change>
        <my-time></my-time>
    `
});

ODA({
    is: 'my-time',
    template: `
        <div>Время: {{methodTime()}}</div>
    `,
    methodTime() {
        var d = new Date();
        return d.toLocaleTimeString() + '.' + d.getMilliseconds();
    }
});

ODA({
    is: 'my-change',
    template: `
        <input ::value="change">
    `,
    change: "Измени меня"
});
```

В примере изменение текста в строке ввода в компоненте **my-change** изменяет состояние всего компонента **my-component**, поэтому происходит рендеринг компонента **my-time**, и время на странице обновляется.

Включение одного компонента в состав другого приводит к одновременному рендерингу обоих компонентов.

Например:

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <my-change></my-change>
        <div>Время: {{methodTime()}}</div>
    `,
    methodTime() {
        var d = new Date();
        return d.toLocaleTimeString() + '.' + d.getMilliseconds();
    }
});

ODA({
    is: 'my-change',
    template: `
        <input ::value="change">
    `,
    change: "Измени меня"
});
```

В примере изменение текста в строке ввода в подчиненном компоненте **my-change** изменяет состояние всего компонента **my-component**, поэтому время на странице обновляется.

В случае наследования компонентов рендеринг также происходит одновременно в обоих компонентах.

Например:

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    extends: 'my-change',
    template: `
        <div>Время: {{methodTime()}}</div>
    `,
    methodTime() {
        var d = new Date();
        return d.toLocaleTimeString() + '.' + d.getMilliseconds();
    }
});

ODA({
    is: 'my-change',
    template: `
        <input ::value="change">
    `,
    change: "Измени меня"
});
```

В примере изменение текста в строке ввода в родительском компоненте **my-change** изменяет состояние всего компонента **my-component**, поэтому время на странице обновляется.

```info_md
Обратите внимание, что рендеринг запускается одновременно для всех компонентов, объединенных в одном компоненте, независимо от метода объединения.
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/a7TpcKYebLY?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>