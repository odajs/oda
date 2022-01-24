По умолчанию реактивность у вычисляемых свойств, зависящих от одного или нескольких элементов какого-либо массива, отключена для повышения эффективности работы с массивами. Модификатор **reactive** позволяет включить эту зависимость, если в ней есть такая необходимость.

Например,

```javascript _run_edit_console_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div>Число {{text}} число</div>
        <button @tap="onTap">Нажми на меня</button>
    `,
    props: {
        items: [1, 2, 3],
        text: {
            get() {
                return this.items[0] + (this.items[0] & 1 ?  " — нечетное" : " — четное");
            }
        }
    },
    onTap() {
        this.items[0]++;
    }
});
```

В этом примере при каждом нажатии на кнопку **button** значение нулевого элемента массива будет увеличиваться на единицу. Эти изменения должны автоматически передаваться геттеру вычисляемого свойства **text** и отображаться с помощью интерполяционной подстановки **{{Mustache}}** в элементе **div**. Однако этого не происходит, так как реактивность для такого свойства по умолчанию отключена.

Для того чтобы её включить, необходимо при объявлении этого свойства указать специальный модификатор **reactive** со значением **true**.

Например,

```javascript _run_edit_console_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div>Число {{text}} число</div>
        <button @tap="onTap">Нажми на меня</button>
    `,
    props: {
        items: [1, 2, 3],
        text: {
            reactive: true,
            get() {
                return this.items[0] + (this.items[0] & 1 ?  " — нечетное" : " — четное");
            }
        }
    },
    onTap() {
        this.items[0]++;
    }
});
```

В этом случае механизм реактивности начнет работать, и при изменении элемента массива геттер вычисляемого свойства **text** начнет вызываться автоматически.

Если вычисляемое свойство не зависит от элементов массива, то использовать директиву **reactive** нет необходимости — механизм реактивности для такого свойства будет работать изначально.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/wQA1eKdR6VY?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
