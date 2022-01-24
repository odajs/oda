**effects** — это группа CSS-стилей, предназначенных для стилизации различных состояний HTML-элементов.

Она использует псевдокласс **:root** и включает стилизацию следующих эффектов:

1. **--dark** — затенение.
1. **--active** — активность.
1. **--selected** — выбор.
1. **--focused** — получение фокуса.
1. **--disabled** — отключение.

В нее входят следующие CSS-свойства и миксины:

```css
<style scope="oda" group="effects">
    :root{
        --focused-color: blue;
        --selected-color: navy;
        --selected-background: silver;
        --dark-color: white;
        --dark-background: gray;
        --dark: {
            color: var(--dark-color) !important;
            background-color: var(--dark-background) !important;
        };
        --active: {
            color: var(--selected-color) !important;
            background-color: var(--selected-background) !important;
        };
        --selected: {
            /*filter: brightness(90%);*/
            color: var(--selected-color) !important;
            filter: brightness(0.8) contrast(1.2);
            /*background-color: var(--selected-background) !important;*/
            /* background: linear-gradient(var(--selected-background), var(--content-background), var(--selected-background))  !important; */
        };
        --focused:{
            background-color: whitesmoke !important;
            color: var(--focused-color, red) !important;
            text-decoration: underline;
            /*border-bottom: 1px solid var(--focused-color) !important;*/
        };
        --disabled: {
            cursor: default !important;
            opacity: 0.4;
            user-focus: none;
            user-focus-key: none;
            user-select: none;
            user-input: none;
            pointer-events: none;
            filter: grayscale(80%);
        };
    }
</style>
```

Например,

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <style>
            input:focus:active {
                @apply --active;
            }
            input:disabled {
                @apply --disabled;
            }
            input:focus{
                @apply --focused;
            }
        </style>
        <label>Деактивировать <input type="checkbox" ::value></label> <br/>
        <label>{{label}} <input ref="inp" placeholder="Щелкни по мне" @mousedown="onDown"></label><br/>
        <label>Я в фокусе <input class="focused" value="--focused"></label><br/>
        <label>Я затенен <input class="dark" value="--dark"></label><br/>
        <label>Я выбран <input class="selected" value="--selected"></label><br/>
    `,
    props: {
        value: {
            default: false,
            set(n) {
                this.$refs.inp.disabled = n;
                this.label = n ? 'Я деактивирован' : 'Я активен';
                this.$refs.inp.value = n ? '--disabled' : '';
            }
        },
        label: 'Я активен'
    },
    onDown() {
        this.$refs.inp.value = "--active";
        this.listen('mouseup', 'onUp', {target: document});
    },
    onUp() {
        this.$refs.inp.value = "";
        this.unlisten('mouseup', 'onUp', {target: document});
    }
});
```

В этом примере:
а) при отмеченном чекбоксе первый input деактивируется и активируется при снятии отметки;
б) при нажатой левой кнопки мыши на первом input "Я активен" изменяется его стиль, а также текстовое значение на "--active";
в) нажатая левая кнопка мыши на каждом из остальных input изменится его стиль на соответствующий.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/pJ1TCwMwbi0?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
