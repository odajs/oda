**$dirInfo** — это свойство, которое возвращает информацию о папке, в которой располагается файл с кодом компонента.

Эта информация должна храниться внутри папки в виде файла с именем «**_.info**» в формате **JSON**. Фактически, свойство **$dirInfo** вызывает глобальный метод **ODA.getDirInfo**, который и считывает содержимое этого файла.

Например,

```javascript run_edit_[my-component.js]
import '/components/buttons/button/button.js';
 ODA({
    is: 'my-component',
    template: `
        <oda-button ref="btn" label="Нажми на меня" icon="icons:favorite" @tap="onTap"></oda-button>
        <span>{{info}}</span>
    `,
    props: {
        info: 'Информация о папке'
    },
    onTap() {
        this.$refs.btn.$dirInfo.then(text => this.info = JSON.stringify(text));
    }
});
```

Информация о файле возвращается в виде промиса, при успешном выполнение которого в методе **then** можно предусмотреть выполнение необходимых действий.

Если в папке отсутствует файл «**_.info**», то свойство **$dirInfo** будет возвращать пустой объект.

Например,

```javascript run_edit_[my-component.js]
import '/components/buttons/button/button.js';
 ODA({
    is: 'my-component',
    template: `
        <oda-button label="Нажми на меня" icon="icons:android" @tap="onTap"></oda-button>
        <span>{{info}}</span>
    `,
    props: {
        info: 'Информация о папке'
    },
    onTap() {
        this.$dirInfo.then(text => this.info = JSON.stringify(text));
    }
});
```

Пустой объект также возвращается, когда компонент создается динамически, так как в этом случае у него отсутствует корневая папка, и найти в ней файл «**_.info**» не удастся.

Например,

```javascript run_edit_[my-component.js]
import '/components/buttons/button/button.js';
 ODA({
    is: 'my-component',
    template: `
        <oda-button ref="btn" label="Нажми на меня" icon="icons:star" @tap="onTap"></oda-button>
         <span>{{info}}</span>
    `,
    props: {
        info: 'Информация о папке'
    },
    onTap() {
        this.$dirInfo.then(text => this.info = JSON.stringify(text));
    }
});
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/AFUXR_SlnYU?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
