```info_md
Директивы **~if**, **~else-if** и **~else** не создают и не уничтожают DOM-объекты HTML-элементов, а только включают и отключают их от DOM компонента. Таким образом, включение-выключение HTML-элементов не приводит к потере данных внесенных в них пользователем.
```

Например,

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button @tap="onTap">Показать / Скрыть</button>
        <input type="range" ~if="showMe">
    `,
    showMe: true,
    onTap() {
        this.showMe = !this.showMe;
    }
});
```

В данном примере кнопка с помощью директивы **~if** управляет отображением ползунка. Измените положение ползунка. Затем с помощью кнопки скройте и отобразите его заново. Можете убедиться, что заданное положение ползунка сохранилось.

```info_md
Ссылку на HTML-элемент с директивами **~if**, **~else-if** и **~else** можно получить с помощью методов **$** и **$$**, только когда элемент включен в DOM компонента. Если его нет в DOM компонента, то и ссылку на него получить нельзя.
```

Например,

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button @tap="onTap">Показать / Скрыть</button>
        <span>Элемент найден? {{answer}}</span>
        <strong ~if="showMe">Найди меня</strong>
    `,
    showMe: true,
    answer: "",
    onTap() {
        this.showMe = !this.showMe;
        requestAnimationFrame( ()=>{this.answer = this.$("strong")===null ? "Нет " : "Да "} );
    }
});
```

В данном примере по нажатию кнопки происходит добавление и удаление элемента **strong** в/из DOM компонента. В обработчике нажатия кнопки с помощью метода **$("strong")** производится поиск этого элемента. Можно видеть, что когда элемент отключен, то метод не может его найти.

```faq_md
Если заранее получить и сохранить ссылку на HTML-элемент, пока он подключен к DOM компонента, то после исключения элемент из DOM компонента можно продолжать работать с его DOM-объектом. Все внесенные изменения сохранятся и отобразятся при последующем подключении к компоненту.
```

Например,

```javascript_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button @tap="onTap">Показать / Скрыть</button>
        <button @tap="increment">Инкремент</button>
        <input type="number" ~if="showMe">
    `,
    showMe: true,
    pointer: {},
    attached(){ 
        this.pointer = this.$("input");
    },
    onTap() {
        this.showMe = !this.showMe;
    },
    increment() {
        this.pointer.value++;
        
    }
});
```

В данном примере во время выполнения хука **attached** в свойстве **pointer** запоминается указатель на элемент **input**. Кнопкой «Инкремент» можно увеличить значение элемента **input**. Скройте элемент кнопкой «Показать/Скрыть» и несколько раз нажмите на кнопку «Инкремент». Заново отобразите элемент кнопкой «Показать/Скрыть» и убедитесь, что его значение увеличилось на количество нажатий.

```info_md
При каждом встраивании директивами **~if**, **~else-if** или **~else** вложенного компонента в DOM охватывающего компонента вызывается хук **attached** вложенного компонента.
```

Например,

```javascript_run_edit_[my-component.js]_h=100_
ODA({
    is: 'my-icon',
    imports: '@oda/icon',
    template: `
        <oda-icon icon="icons:android" :icon-size="size" :fill="color"></oda-icon>
        <button @tap="onTap1">Изменить цвет</button>
        <button @tap="onTap2">Изменить размер</button>
    `,
    color: '',
    size: 56,
    attached() {
        this.color = 'lime';
    },
    onTap1() {
        this.color = this.color == 'orange' ? 'magenta' : 'orange';
    },
    onTap2() {
        if( this.size <= 24 )
            this.size = 56;
        else
            this.size -= 8;
    }
});

ODA({
    is: 'my-component',
    template: `
        <button @tap="onTap">Показать / Скрыть</button>
        <my-icon ~if="showMe"></my-icon>
    `,
    showMe: true,
    onTap() {
        this.showMe = !this.showMe;
    }
});
```

В данном примере компонент **my-icon** вложен в компонент **my-component**. Тег компонента **my-icon** содержит директиву **~if**, а сам компонент содержит хук **attached**, в котором для иконки устанавливается начальный цвет **lime**. Кнопками «Изменить цвет» и «Изменить размер» измените цвет и размер иконки. Затем дважды нажмите на кнопку «Показать/Скрыть», чтобы удалить и заново вставить элемент **my-icon** в DOM компонента **my-component**. Можно видеть, что установленный размер иконки сохраняется, а цвет возвращается к начальному цвету **lime**, который устанавливается при выполнении хука **attached**.

```info_md
При каждом встраивании директивами **~if**, **~else-if** или **~else** вложенного компонента в DOM охватывающего компонента срабатывают директивы биндинга в теге вложенного компонента, даже если их значение не изменилось. Т.е. в таких ситуациях директивы биндинга в тегах компонентов срабатывают независимо от механизма реактивности.
```

Например,

```javascript_run_edit_[my-component.js]_h=100_
ODA({
    is: 'my-icon',
    imports: '@oda/icon',
    template: `
        <oda-icon icon="icons:android" :icon-size="size" :fill="color"></oda-icon>
        <button @tap="onTap1">Изменить цвет</button>
        <button @tap="onTap2">Изменить размер</button>
    `,
    color: '',
    size: 56,
    onTap1() {
        this.color = this.color == 'orange' ? 'magenta' : 'orange';
    },
    onTap2() {
        if( this.size <= 24 )
            this.size = 56;
        else
            this.size -= 8;
    }
});

ODA({
    is: 'my-component',
    template: `
        <button @tap="onTap">Показать / Скрыть</button>
        <my-icon ~if="showMe" :color="'lime'"></my-icon>
    `,
    showMe: true,
    onTap() {
        this.showMe = !this.showMe;
    }
});
```

Данный пример аналогичен предыдущему, только из компонента **my-icon** убран хук **attached**, а восстановление исходного цвета для иконки осуществляется с помощью директивы биндинга **:color**, которая имеет константное значение **'lime'**.

```warning_md
В отличие от компонентов, в тегах нативных HTML-элементов, при их встраивании директивами **~if**, **~else-if** или **~else** в DOM компонента, директивы биндинга не срабатывают повторно, если их значение не изменилось.
```

Например,

```javascript_run_edit_error_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <button @tap="onTap">Показать / Скрыть</button>
        <input type="range" ~if="showMe" :value="0">
    `,
    showMe: true,
    onTap() {
        this.showMe = !this.showMe;
    }
});
```

В данном примере в теге элемента **input** используется директива биндинга **:value** с константным значением **0**. С ее помощью начальное положение ползунка устанавливается в крайнее левое положение. Измените положение ползунка. Затем с помощью кнопки скройте и отобразите его заново. Можете убедиться, что заданное положение ползунка сохранилось, т.е. директива биндига не выполнились и не вернула его в начальное положение.

