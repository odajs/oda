**SPA-роутинг** — это механизм, который позволяет организовать навигацию по содержимому одностраничных Web-приложений и сайтов.

Одностраничное Web-приложение (***Single-Page Application***) содержит только одну Web-страницу, содержимое которой формируется динамически в зависимости от действий пользователя. Такое поведение отличается от поведения обычного многостраничного Web-приложения (***Multi-Page Application***), когда с Web-сервера каждый раз загружаются разные страницы с новыми данными.

В SPA-приложениях вся необходимая информация либо извлекается браузером при загрузке одной страницы, либо соответствующие данные загружаются динамически в ответ на действия пользователя и добавляются на исходную страницу по мере необходимости. Исходная страница в этом случае никогда не перезагружается целиком, и ее URL-адрес не изменяется. В результате этого становится невозможно осуществлять навигацию по страницам, используя стандартный механизм навигации браузера.

ODA-фреймворк содержит специальный объект **ODA.router**, который позволяет имитировать работу многостраничного приложения и перемещаться в пределах одной страницы при помощи кнопок «**Вперед**» и «**Назад**» в истории сессий браузера, точно так же, как и при переходе на разные страницы при использовании многостраничных сайтов.

Объект **ODA.router** объявлен в библиотеке **router.js**, которую необходимо подключить как JavaScript-модуль следующим образом:

```javascript
import '/tools/router/router.js';
```

Механизм SPA-роутинга достаточно простой. Каждому состоянию страницы соответствует уникальное имя, которое сохраняется при навигации по странице вместе с другими параметрами в объекте истории переходов браузера [**window.history**](https://developer.mozilla.org/en-US/docs/Web/API/Window/history). Каждому имени ставится в соответствие функция, преобразующая страницу к требуемому состоянию. Правила, связывающие имена состояний и функции, хранятся в объекте **ODA.router**. Также этот объект регистрирует обработчик события [**popstate**](https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event). В процессе навигации обработчик извлекает из свойств события [**popstate**](https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event) имя состояния страницы, к которому осуществляется переход, и вызывает функцию, преобразующую страницу к этому состоянию.

Объект **ODA.router** имеет следующие методы:

<span>1.</span> **create(rule, callback)** — регистрирует новое правило маршрутизации и связывает его с обработчиком перехода к состоянию, которое удовлетворяет данному правилу.

Методу передаются два параметра:

* **rule** — правило маршрутизации. В процессе навигации правило сравнивается с именем состояния, в которое переходит страница. Если имя состояния соответствует правилу, то вызывается связанный с правилом обработчик. В простейшем случае правило совпадает с одним из имен состояний, но также может быть маской для группы имен.
* **callback** — функция-обработчик перевода страницы в состояние, которое соответствует указанному правилу. При вызове обработчику передается имя состояния.

<span>2.</span> **go(path, idx=0)** — записывает в объект истории переходов браузера [**window.history**](https://developer.mozilla.org/en-US/docs/Web/API/Window/history) состояние страницы, к которому необходимо перейти, и сразу же вызывает обработчик для перехода.

Методу передаются два параметра:

* **path** — имя создаваемого состояния, к которому необходимо перейти, например, **'#spa'**. Это имя также используется как хеш-составляющая URL-адреса, отображаемого в адресной строке браузера.
* **idx** — указывает количество дополнительных частей в хеш-составляющей URL-адреса. Это позволяет имитировать мультихешевую адресацию.

<span>3.</span> **forward()** — осуществляет переход к следующему состоянию страницы.

<span>4.</span> **back()** — осуществляет переход к предыдущему состоянию страницы.

Например,

```javascript run_edit_[my-component.js]
import '/tools/router/router.js';
ODA({
    is: 'my-component',
    template: `
        <div>Текущее состояние: {{note}}</div>
        <button @tap="onPrev" :disabled="window.location.hash=='#state1'">&#9668;</button>
        <button @tap="onNext" :disabled="window.location.hash=='#state2'">&#9658;</button>
        <div>URL-адрес: {{window.location.href}}</div>
        <button @tap="init()">RESET</button>
    `,
    props: {
        note: ''
    },
    ready() {
        ODA.router.create('#state1', ()=>{this.note='Страница 1'});
        ODA.router.create('#state2', ()=>{this.note='Страница 2'});
        window.history.pushState({path: '#state1'}, '', '#state1');
        window.history.pushState({path: '#state2'}, '', '#state2');
    },
    onNext() {
        ODA.router.forward();
    },
    onPrev() {
        ODA.router.back();
    },
    init() {
        this.note = '';
        window.history.pushState({path: '#state1'}, '', '#state1');
        window.history.pushState({path: '#state2'}, '', '#state2');
    }
});
```

В данном примере страница имеет два состояния **#state1** и **#state2**. В хуке **ready** настраивается переход между этими состояниями. Во-первых, эти состояния регистрируются в истории переходов с помощью метода [**window.history.pushState**](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState). Во-вторых, с помощью метода **ODA.router.create** регистрируются две функции для перевода страницы в эти состояния. Эти функции выводят сообщения *Страница 1* и *Страница 2*, имитируя переход по истории открытых страниц.

```warning_md
Примеры в данном разделе используют один и тот же объект [**window.history**](https://developer.mozilla.org/en-US/docs/Web/API/Window/history). Вследствие этого, выполнение одних примеров влияет на результаты других примеров. Поэтому все примеры содержат кнопку **RESET** для инициализации начального состояния.
```

```info_md
При выполнении примеров, после создания нескольких состояний страницы, можно использовать кнопки «**Вперед**» и «**Назад**» на панели инструментов браузера.
```

Особенности использования метода [**window.history.pushState**](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState):

1. Синтаксис метода:

```javascript
window.history.pushState(state, title [, url]);
```

2. Метод только добавляет новую информацию в историю, при этом состояние текущей страницы не изменяется. Поэтому в предыдущем примере сразу после загрузки страницы в строке *Текущее состояние* отсутствует значение.

3. Последний (третий) параметр метода устанавливает новый адрес страницы. Его можно не использовать в SPA-роутинге. Однако для имитации смены адреса страницы в адресной строке браузера в этом параметре рекомендуется указывать хеш-составляющую URL-адреса, которая будет ассоциироваться у пользователя с новым состоянием страницы.

4. В первом параметре метода передается объект, который сохраняется в истории переходов браузера. Для работы SPA-роутинга необходимо, чтобы этот объект содержал свойство **path**. В этом свойстве необходимо указать имя сохраняемого состояния страницы. Это имя будет использовано для выбора правила перехода к требуемому состоянию.

```info_md
Хотя в качестве имени состояния можно использовать любую текстовую строку, рекомендуется в свойстве **path** использовать хеш-составляющую URL-адреса, для совместимости с методом **ODA.router.go**. Например:
**window.history.pushState( {path: '#spa'}, '', '#spa').**
```

Вместо метода [**window.history.pushState**](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState) рекомендуется использовать метод **ODA.router.go**, который не только записывает новое состояние в историю переходов, но и сразу же вызывает обработчик для перехода в это состояние.

Для записи состояния в историю переходов, **ODA.router.go** вызывает метод [**window.history.pushState**](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState) и передает ему свой первый параметр в качестве имени состояния и хеш-составляющей URL-адреса.

Например: **ODA.router.go('#hash-part')** вызовет метод **window.history.pushState({path: '#hash-part'}, '', '#hash-part')**

Пример использования метода **ODA.router.go**:

```javascript run_edit_[my-component.js]
import '/tools/router/router.js';
ODA({
    is: 'my-component',
    template: `
        <div>Текущее состояние: {{note}}</div>
        <button @tap="onPrev" :disabled="window.location.hash=='#state1'">&#9668;</button>
        <button @tap="onNext">&#9658;</button>
        <div>URL-адрес: {{window.location.href}}</div>
        <button @tap="init()">RESET</button>
    `,
    props: {
        note: 'Страница 1',
        maxState: '#state1'
    },
    ready() {
        ODA.router.create('#state1', ()=>{this.note='Страница 1'});
        window.history.replaceState({path:'#state1'}, '', '#state1');
    },
    onNext() {
        if( window.location.hash == this.maxState ) {
            this.maxState = '#state' + (Number(this.maxState.substr(6)) + 1);
            ODA.router.create(this.maxState, ()=>{this.note='Страница ' + window.location.hash.substr(6)});
            ODA.router.go(this.maxState);
        }
        else
            ODA.router.forward();
    },
    onPrev() {
        ODA.router.back();
    },
    init() {
        this.note = 'Страница 1';
        this.maxState = '#state1';
        window.history.replaceState({path:'#state1'}, '', '#state1');
    }
});
```

В данном примере регистрируется отдельное правило для перевода страницы в каждое состояние.

```info_md
В этом примере и во всех следующих примерах новое состояние создается, если при переходе «вперед» по истории состояний достигнут конец истории.
```

Метод **ODA.router.create** позволяет регистрировать групповые правила, применимые сразу к нескольким состояниям страницы. Для этого в правиле могут использоваться символы подстановки:

**\*** — заменяет любую последовательность символов до конца строки. Например, правило **'#*'** применимо к любому состоянию, имя которого начинается с символа **#**.

**?** — заменяет любой символ. Например, правило **'#???'** применимо к состоянию, имя которого начинается с символа **#** и содержит еще три любых символа.

```warning_md
При использовании групповых правил необходимо явно указывать обработчику, какое состояние страницы ему необходимо сформировать. Имя требуемого состояния передается обработчику через его единственный параметр.
```

Используя символы подстановки можно создать одно правило для всех состояний страницы из предыдущего примера:

```javascript run_edit_[my-component.js]
import '/tools/router/router.js';
ODA({
    is: 'my-component',
    template: `
        <div>Текущее состояние: {{note}}</div>
        <button @tap="onPrev" :disabled="window.location.hash=='#state1'">&#9668;</button>
        <button @tap="onNext">&#9658;</button>
        <div>URL-адрес: {{window.location.href}}</div>
        <button @tap="init()">RESET</button>
    `,
    props: {
        note: 'Страница 1',
        maxState: '#state1'
    },
    ready() {
        ODA.router.create('#state*', (state)=>{this.note='Страница ' + state.substr(6)});
        window.history.replaceState({path:'#state1'}, '', '#state1');
    },
    onNext() {
        if( window.location.hash == this.maxState ) {
            this.maxState = '#state' + (Number(this.maxState.substr(6)) + 1);
            ODA.router.go(this.maxState);
        }
        else
            ODA.router.forward();
    },
    onPrev() {
        ODA.router.back();
    },
    init() {
        this.note = 'Страница 1';
        this.maxState = '#state1';
        window.history.replaceState({path:'#state1'}, '', '#state1');
    }
});
```

В данном примере в хуке **ready** с помощью символа подстановки **\*** создается единое правило **'#state*'** для всех состояний страницы. Для определения требуемого состояния страницы обработчик анализирует имя состояния, переданное ему в параметре **state**.

В первом параметре метода **ODA.router.create** можно указать несколько правил разделив их запятыми. Например, **'#state1,#state2,#state3'**. Тогда указанный обработчик будет зарегистрирован для каждого правила из списка.

```warning_md
Обратите внимание, что в список правил нельзя вставлять пробелы после запятых, иначе они будут восприниматься как часть правила.
```

Например,

```javascript run_edit_[my-component.js]
import '/tools/router/router.js';
ODA({
    is: 'my-component',
    template: `
        <div>Текущее состояние: {{note}}</div>
        <button @tap="onPrev" :disabled="window.location.hash=='#state1'">&#9668;</button>
        <button @tap="onNext">&#9658;</button>
        <div>URL-адрес: {{window.location.href}}</div>
        <button @tap="init()">RESET</button>
    `,
    props: {
        note: 'Страница 1',
        maxState: '#state1'
    },
    ready() {
        ODA.router.create('#state1,#state2,#state3', (state)=>{this.note='Страница ' + state.substr(6)});
        window.history.replaceState({path:'#state1'}, '', '#state1');
    },
    onNext() {
        if( window.location.hash == this.maxState ) {
            this.maxState = '#state' + (Number(this.maxState.substr(6)) + 1);
            ODA.router.go(this.maxState);
        }
        else
            ODA.router.forward();
    },
    onPrev() {
        ODA.router.back();
    },
    init() {
        this.note = 'Страница 1';
        this.maxState = '#state1';
        window.history.replaceState({path:'#state1'}, '', '#state1');
    }
});
```

В данном примере обработчик зарегистрирован только для первых трех состояний страницы **'#state1,#state2,#state3'**. При переходе на следующие состояния, вид страницы изменяться не будет, так как для этих состояний не заданы правила.

```warning_md
Если список правил содержит шаблоны правил, перекрывающие друг друга, то обработчик будет вызван соответствующее число раз.
```

Например,

```javascript run_edit_[my-component.js]
import '/tools/router/router.js';
ODA({
    is: 'my-component',
    template: `
        <div>Текущее состояние: {{note}} -- Счетчик: {{count}}</div>
        <button @tap="onPrev" :disabled="window.location.hash=='#state1'">&#9668;</button>
        <button @tap="onNext">&#9658;</button>
        <div>URL-адрес: {{window.location.href}}</div>
        <button @tap="init()">RESET</button>
    `,
    props: {
        note: 'Страница 1',
        maxState: '#state1',
        count: 0
    },
    ready() {
        ODA.router.create('#state*,#*', (state)=>{this.note='Страница ' + state.substr(6); ++this.count});
        window.history.replaceState({path:'#state1'}, '', '#state1');
    },
    onNext() {
        if( window.location.hash == this.maxState ) {
            this.maxState = '#state' + (Number(this.maxState.substr(6)) + 1);
            ODA.router.go(this.maxState);
        }
        else
            ODA.router.forward();
    },
    onPrev() {
        ODA.router.back();
    },
    init() {
        this.note = 'Страница 1';
        this.maxState = '#state1';
        this.count = 0;
        window.history.replaceState({path:'#state1'}, '', '#state1');
    }
});
```

В данном примере правила **#state\*** и **#\***'соответствуют одним и тем же состояниям, поэтому при каждом переходе по истории состояний свойство **count** инкрементируется два раза.

С помощью метода **ODA.router.create** на одно правило можно зарегистрировать несколько функций. Для этого метод **ODA.router.create** необходимо вызвать несколько раз с одним и тем же правилом, меняя только обработчик.

```warning_md
Обратите внимание, что повторная регистрация правила методом **ODA.router.create** не отменяет предыдущую регистрацию, а добавляет еще один обработчик к существующему правилу.
```

Например,

```javascript run_edit_[my-component.js]
import '/tools/router/router.js';
ODA({
    is: 'my-component',
    template: `
        <div>Текущее состояние: {{note}}</div>
        <div>Это пишет второй обработчик: {{note2}}</div>
        <button @tap="onPrev" :disabled="window.location.hash=='#state1'">&#9668;</button>
        <button @tap="onNext">&#9658;</button>
        <div>URL-адрес: {{window.location.href}}</div>
        <button @tap="init()">RESET</button>
    `,
    props: {
        note: 'Страница 1',
        note2: 'Состояние 1',
        maxState: '#state1'
    },
    ready() {
        ODA.router.create('#state*', (state)=>{this.note='Страница ' + state.substr(6)});
        ODA.router.create('#state*', (state)=>{this.note2='Состояние ' + state.substr(6)});
        window.history.replaceState({path:'#state1'}, '', '#state1');
    },
    onNext() {
        if( window.location.hash == this.maxState ) {
            this.maxState = '#state' + (Number(this.maxState.substr(6)) + 1);
            ODA.router.go(this.maxState);
        }
        else
            ODA.router.forward();
    },
    onPrev() {
        ODA.router.back();
    },
    init() {
        this.note = 'Страница 1';
        this.note2 = 'Состояние 1';
        this.maxState = '#state1';
        window.history.replaceState({path:'#state1'}, '', '#state1');
    }
});
```

В данном примере первый обработчик изменяет в компоненте свойство **note**, а второй обработчик изменяет свойство **note2**.

Механизм SPA-роутинга позволяет имитировать вложенность страниц. По умолчанию уровень вложенности равен 0, что соответствует корневой странице. Для имитации необходимо во втором параметре метода **ODA.router.go** указать уровень вложенности и учитывать его в обработчике состояния страницы.

Например,

```javascript run_edit_[my-component.js]
import '/tools/router/router.js';
ODA({
    is: 'my-component',
    template: `
        <div>Текущее состояние: {{note}}</div>
        <button @tap="onPrev" :disabled="window.location.hash=='#state1'">&#9668;</button>
        <button @tap="onNext">&#9658;</button>
        <div>URL-адрес: {{window.location.href}}</div>
        <button @tap="level=0" :disabled="level==0">Уменьшить вложенность</button>
        <button @tap="level=1" :disabled="level==1">Увеличить вложенность</button>
        <span>Уровень вложенности: {{level}}</span><br>
        <button @tap="init()">RESET</button>
    `,
    props: {
        note: 'Страница 1',
        maxState: '#state1',
        level: 0
    },
    ready() {
        ODA.router.create('#state*', this.callback.bind(this));
        window.history.replaceState({path:'#state1'}, '', '#state1');
    },
    onNext() {
        if( window.location.hash != this.maxState ) {
            ODA.router.forward();
            return;
        }
        var x;
        var hash = window.location.hash.split('#');
        if( this.level == 0 ) {  //Меняется номер страницы
            x = Number(hash[1].substr(5)) + 1;
            this.maxState = '#state' + x;
        }
        else {  //Меняется номер секции
            if( hash.length == 2 )
                x = 1;
            else
                x = Number(hash[2].substr(5)) + 1;
            this.maxState = '#' + hash[1] + '#state' + x;
        }
        ODA.router.go('#state' + x, this.level);
    },
    onPrev() {
        ODA.router.back();
    },
    callback(state) {
        this.note = 'Страница ' + state.split('#')[1].substr(5);
        if( state.split('#').length == 3 )
            this.note += ' Секция ' + state.split('#')[2].substr(5);
    },
    init() {
        this.note = 'Страница 1';
        this.maxState = '#state1';
        this.level = 0;
        window.history.replaceState({path:'#state1'}, '', '#state1');
    }
});
```

Для простоты данный пример обеспечивает только один уровень вложенности. Для перевода страницы в соответствующее состояние метод **callback** анализирует обе части хеш-составляющей URL-адреса.

Механизм SPA-роутинга позволяет передавать ссылки на конкретное состояние страницы.

Например,

```javascript run_edit_[my-component.js]
import '/tools/router/router.js';
ODA({
    is: 'my-component',
    template: `
        <div>Текущее состояние: {{note}}</div>
        <button @tap="onPrev" :disabled="window.location.hash==startState">&#9668;</button>
        <button @tap="onNext">&#9658;</button><br>
        Нажмите для перехода URL-адрес: <a :href="window.location.href" target="_blank">{{window.location.href}}</a><br>
        <button @tap="init()">RESET</button>
    `,
    props: {
        note: 'Страница 1',
        maxState: '#state1',
        startState: '#state1'
    },
    ready() {
        ODA.router.create('#state*', this.callback.bind(this));
        var hash = window.location.hash;
        if( hash == '' ) {
            this.note = 'Страница 1';
            this.startState = this.maxState = '#state1';
            window.history.replaceState({path:'#state1'}, '', '#state1');
        }
        else {
            this.startState = this.maxState = hash;
            window.history.replaceState({path: hash}, '', hash);
            this.callback(hash);
        }
    },
    onNext() {
        if( window.location.hash == this.maxState ) {
            this.maxState = '#state' + (Number(this.maxState.substr(6)) + 1);
            ODA.router.go(this.maxState);
        }
        else
            ODA.router.forward();
    },
    onPrev() {
        ODA.router.back();
    },
    callback(state) {
        this.note = 'Страница ' + state.substr(6)
    },
    init() {
        this.note = 'Страница 1';
        this.maxState = '#state1';
        this.startState = '#state1';
        window.history.replaceState({path:'#state1'}, '', '#state1');
    }
});
```

В данном примере, при нажатии на ссылку, в браузере открывается новая вкладка, повторяющая состояние страницы, с которой осуществлен переход.

