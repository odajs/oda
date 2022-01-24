**ODA.telemetry** — это объект, который содержит информацию обо всех используемых компонентах и их модулях.

Он объявляется следующим образом:

```javascript
ODA.telemetry = {proxy: 0,  modules: {}, imports:{}, components: {count: 0}, clear: ()=>{...}};
```

В нем заданы 4 свойства и один метод:

1. **proxy** — устаревшее свойство, которое сейчас нигде не используется.
1. **modules** — содержит все загруженные модули с их компонентами.
1. **imports** — устаревшее свойство, которое сейчас дублирует свойство modules.
1. **components** — содержит все созданные компоненты на странице.
1. **clear** — предопределенная стрелочная функция, которая обнуляет все числовые свойства объекта телеметрии.

С помощью объекта телеметрии можно, например, получить список все компонентов, созданных на HTML-странице.

```javascript run_edit_[my-component.js]
import '/components/buttons/button/button.js';
 ODA({
    is: 'my-component',
    template: `
        <div> Количество созданных компонентов: {{count}}</div>
        <ol>
            <li ~for="components">{{item}}</li>
        <ol>
        <oda-button label="Нажми на меня" icon="icons:android" @tap="onTap"></oda-button>
    `,
    props: {
        components: ['Пустой массив'],
        count: 0
    },
    onTap() {
        this.components.length = 0;
        this.count = ODA.telemetry.components.count;
        for(const i in ODA.telemetry.components)
            if (i !=="count")
                this.components.push(JSON.stringify(ODA.telemetry.components[i]));
    }
});
```

Первое свойство **count** объекта **components** хранит количество экземпляров компонентов, созданным на странице, а остальные свойства ссылаются на объекты с описанием этих компонентов.

Количество описаний в общем случае не совпадает с общим количеством созданных компонентов, так как при создании одного компонента с ним в телеметрию добавляются все вспомогательные компоненты, находящиеся в его модуле и необходимые для его полноценной работы.

Каждое из таких свойств с описанием компонента является объектом, в котором заданы три свойства:

1. **prototype** — прототип компонента, на основе которого он был создан.
1. **count** — количество компонентов, созданных по данному прототипу.
1. **render** — количество прорисовок этих компонентов.

Например,

```javascript run_edit_[my-component.js]
import '/components/buttons/button/button.js';
 ODA({
    is: 'my-component',
    template: `
        <div>
            Компонент: {{name}}
            <div> Prototype: {{component.prototype}} </div>
            <div> Count: {{component.count}} </div>
            <div> Render: {{component.render}} </div>
        </div>
        <oda-button ref="btn" label="Нажми на меня" icon="icons:android" @tap="onTap"></oda-button>
    `,
    props: {
        name: '',
        component: {
            type: Object,
            default: {
                prototype: '',
                count: 0,
                render: 0,
            }
        }
    },
    onTap() {
        this.name = this.localName;
        let component = ODA.telemetry.components[this.name];
        this.component.prototype = JSON.stringify(component.prototype);
        this.component.count = component.count;
        this.component.name = component.render;
    }
});
```

Кроме компонентов, в свойстве **modules** объекта телеметрии хранятся все ссылки на файлы с модулями, в которых находится код этих компонентов.

Например,

```javascript run_edit_[my-component.js]
import '/components/buttons/button/button.js';
 ODA({
    is: 'my-component',
    template: `
        <div> Количество модулей: {{count}}</div>
        <ol>
            <li ~for="modules">{{item}}</li>
        <ol>
        <oda-button label="Нажми на меня" icon="icons:android" @tap="onTap"></oda-button>
    `,
    props: {
        modules: ['Пустой массив'],
        count: 0,
    },
    onTap() {
        this.modules.length = 0;
        this.count = 0;
        for(const i in ODA.telemetry.modules) {
            this.count++;
            this.modules.push(i+": " + JSON.stringify(ODA.telemetry.modules[i]));
        }
    }
});
```

Свойство **modules** по своей структуре является объектом, каждое свойство которого совпадает с URL-адресом, по которому располагается модуль с кодом компонента. Значения этих свойств являются массивом, в котором перечисляются имена всех компонентов, объявленных внутри соответствующего модуля.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/7_qTxhmDwlg?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
