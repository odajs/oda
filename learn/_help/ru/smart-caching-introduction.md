﻿Фреймворк имеет встроенные механизмы кэширования результатов выполнения геттеров. Это позволяет снизить требования к вычислительным ресурсам и повысить отзывчивость web-страницы.

Совокупность значений свойств компонента, используемых в коде геттера, образует контекст выполнения геттера. Кеширование геттера основано на принципе, что если его контекст не изменился, то и результат выполнения геттера не изменится.

Механизм кэширования работает следующим образом:

1. На этапе создания компонента фреймворк анализирует от каких свойств компонента зависит геттер.

1. При первом обращении к геттеру, он вычисляется, и возвращенное значение запоминается в кэше.

1. При последующих вызовах геттера проверяется наличие изменений в контексте геттера. Если изменений не произошло, то геттер не выполняется, а значение берется из кэша. Если изменения произошли, расчет выполняется заново и новое значение опять запоминается в кэше.

```info_md
Каждый геттер имеет свой кэш, независимый от других геттеров.
```

Рассмотрим пример:

```javascript_run_edit_[my-component.js]_h=60_
ODA({
    is: 'my-component',
    template: `
        <input ::value="change">
        <div>Время из геттера: {{getterTime}}</div>
        <div>Время из метода: {{methodTime()}}</div>
    `,
    $public: {
        change: "Измени меня",
        getterTime: {
            get() {
                var d = new Date();
                return d.toLocaleTimeString() + '.' + d.getMilliseconds();
            }
        }
    },
    methodTime() {
        var d = new Date();
        return d.toLocaleTimeString() + '.' + d.getMilliseconds();
    }
});
```

В примере на экран должно выводиться текущее время с точностью до миллисекунд. Для получения времени используются геттер **getterTime** и метод **methodTime**. Но на экран время выводится только при загрузке страницы и больше не обновляется. Это происходит потому, что компонент не меняет своего состояния (не изменяются значения свойств) и, следовательно, рендеринг компонента не осуществляется.

Измените значение в строке ввода. За счет механизма двойного биндинга, при вводе или удалении каждого символа осуществляется изменение свойства **change** компонента, что приводит к рендерингу компонента. При этом текущее время обновляется, но только для значений, получаемых из метода. Значение же геттера не изменяется, т.к. в его коде нет обращения к свойству **change**.

```warning_md
Обратите внимание, если код геттера не содержит обращений к свойствам компонента, то у него отсутствует контекст, поэтому такой геттер вычисляется один раз и превращается в константу.
```

Добавим в геттер **getterTime** обращение к свойству **change**:

```javascript_run_edit_[my-component.js]_h=60_
ODA({
    is: 'my-component',
    template: `
        <input ::value="change">
        <div>Время из геттера: {{getterTime}}</div>
        <div>Время из метода: {{methodTime()}}</div>
    `,
    $public: {
        change: "Измени меня",
        getterTime: {
            get() {
                this.change;
                var d = new Date();
                return d.toLocaleTimeString() + '.' + d.getMilliseconds();
            }
        }
    },
    methodTime() {
        var d = new Date();
        return d.toLocaleTimeString() + '.' + d.getMilliseconds();
    }
});
```

Измените значение в строке ввода. Теперь и геттер и метод обновляют время на экране при каждом добавлении или удалении символа. Обратите внимание, что в коде геттера свойство **change** просто упоминается, никаких операций с ним не производится. То есть для сброса кэша геттера и его выполнения достаточно изменить значение используемого в нем свойства компонента.

В контекст геттера также включаются отдельные свойства объектов.

Например:

```javascript_run_edit_[my-component.js]_h=40_
ODA({
    is: 'my-component',
    template: `
        <input ::value="change.a">
        <div>Время: {{getterTime}}</div>
    `,
    $public: {
        change: {a: "Измени свойство объекта"},
        getterTime: {
            get() {
                this.change.a;
                var d = new Date();
                return d.toLocaleTimeString() + '.' + d.getMilliseconds();
            }
        }
    }
});
```

В примере при изменении в строке ввода значения свойства объекта **change.a** будет сбрасываться кэш геттера и обновляться текущее время на странице.

В контекст геттера также включаются отдельные элементы массивов.

Например:

```javascript_run_edit_[my-component.js]_h=40_
ODA({
    is: 'my-component',
    template: `
        <input ::value="change[0]">
        <div>Время: {{getterTime}}</div>
    `,
    $public: {
        change: ["Измени элемент массива"],
        getterTime: {
            get() {
                this.change[0];
                var d = new Date();
                return d.toLocaleTimeString() + '.' + d.getMilliseconds();
            }
        }
    }
});
```

В примере при изменении в строке ввода значения элемента массива **change[0]** будет сбрасываться кэш геттера и обновляться текущее время на странице.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/uOGqAEWWQ3c?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>