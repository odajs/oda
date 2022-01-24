**oda** — это группа CSS-стилей, которые задают ключевые кадры, используемые для анимации HTML-элементов.

Эти кадры позволяют задать следующие анимационные эффекты:

1. **blinker** — мерцание.
1. **zoom-in** — приближение.
1. **zoom-out** — отдаление.
1. **fadeIn** — появление.
1. **fadeOut** — исчезновение.

Они объявлены следующим образом:

```css
<style scope="oda">
    @keyframes blinker {
        100% {
            opacity: 0;
        }
    }
    @-webkit-keyframes blinker {
        100% {
            opacity: 0;
        }
    }
    @keyframes zoom-in {
        from {transform:scale(0)}
        to {transform:scale(1)}
    }
    @keyframes zoom-out {
        from {transform:scale(1)}
        to {transform:scale(0)}
    }
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    @-moz-keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    @-moz-keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
</style>
```

Ключевой кадр **blinker** используется для создания эффекта мерцания элемента.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            :host {
                animation: blinker 1s infinite;
            }
        </style>
        <span>Я мерцаю, я в раю</span>
    `
});
```

Ключевые кадры **zoom-in** and **zoom-out** позволяют задать анимацию процесса приближения или удаления элемента.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            :host {
                animation: zoom-in 3s ease-out infinite;
            }
        </style>
        <span>Я приближаюсь!</span>
    `
});
```

Для анимации процесса отдаления элемента достаточно изменить имя ключевого кадра с **zoom-in** на **zoom-out**.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            :host {
                animation: zoom-out 3s ease-in infinite;
            }
        </style>
        <span>Я отдаляюсь!</span>
    `
});
```

Ключевые кадры **fadeIn** and **fadeOut** позволяют задать анимацию процесса появления или исчезновения элемента.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            :host {
                animation: fadeIn 2s ease-in infinite;
            }
        </style>
        <span>Я появляюсь</span>
    `
});
```

Для анимации процесса исчезновения объекта достаточно изменить имя ключевого кадра с **fadeIn** на **fadeOut**.

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            :host {
                animation: fadeOut 2s ease-out infinite;
            }
        </style>
        <span>Я исчезаю</span>
    `
});
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/MVR-4Y4TrN4?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
