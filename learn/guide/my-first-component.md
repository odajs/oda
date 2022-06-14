Немногие знают, что в браузере «**Google Chrome**» есть оригинальная игра про динозавра, которая становится доступной пользователю при потере соединения с сетью Интернет.

![Потеря соединения](learn\images\my-first-component\my-first-component1.png "Потеря соединения")

Эту игру можно запустить и в online режиме, указав в адресной строке браузера служебную ссылку «**chrome://dino**».

![Онлайн запуск игры](learn\images\my-first-component\my-first-component2.png "Запуск игры в режиме online")

Кодовое название этой игры — «**Project Bolan**», что является отсылкой к Марку Болану, покойному ныне солисту рок-группы 70-х годов «**T-Rex**».

![Солист группы T-Rex](learn\images\my-first-component\MarkBolan.jpeg "Марк Болан")

Его творчество оказало большое влияние на множество музыкантов того времени и даже на целые музыкальные направления, такие как панк-рок и брит-поп. Даже Виктор Цой написал песню под названием «**Посвящение Марку Болану**» в честь этого музыканта.

По словам дизайнера браузера «**Chrome**» Себастьяна Габриэля, это игра возвращает пользователей в «**доисторические времена**», когда еще не было повсеместного доступа к сети Интернет, а про сети WI-FI и мобильный Интернет тогда вообще никто ничего еще не слышал.

Сама по себе игра представляет собой одинокого тираннозавра, который оказался посреди пустыни, по которой он бежит, преодолевая различные препятствия в виде кактусов и птеродактилей.

![Геймплей игры](learn\images\my-first-component\my-first-component3.png "Геймплей игры")

Цель игры — набрать как можно больше очков, справляясь с увеличивающейся скоростью движения кактусов.
Элементы управления игры достаточно просты: если нажать клавишу «Пробел» или «Стрелка вверх», то динозавр прыгает через препятствие.

Давайте попробуем реализовать эту игру с использованием графических примитивов SVG-графики и возможностей фреймворка «**ODA**» для управления ими.

Для этого сначала создадим индексный файл с именем «**index.html**», указав в его теле только один тэг «**oda-game**», который и будет хостом будущего ODA-компонента.

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Component</title>
    <link rel="stylesheet" href="css/style.css">
    <script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/oda.js"></script>
    <script type="module" src="js/oda-game.js"></script>
</head>
<body>
    <oda-game></oda-game>
</body>
</html>
```

В заголовочной части этого HTML-документа подключим три файла:

1. «**style.css**» – файл с глобальными css-переменными для стилизации всех элементов игры.

Этот файл необходимо разместить в папке «**css**» и задать в нем следующие css-переменные.

```css
:root {
    --base-color: #e2e2e2;
    --dino-color: var(--base-color);
    --cloud-color: var(--base-color);
    --pterodactyl-color: var(--base-color);
    --horizon-color: var(--base-color);

    --dark-color: #121212 !important;
    --background-color: var(--dark-color);
    --dino-eyes-color: var(--dark-color);

    --header-color: honeydew !important;
    --header-background-color: grey;
    --cactus-color: grey;
    --dino-top: 314px;
    --dino-max-top: 20px;
}
```

Здесь предусмотрено, что кактусы и фон игры будут отображаться серым цветом «**grey**», а непосредственная область игры будет темной («**--dark-color: #121212**»). Динозавр, облака и птеродактили в этой темной области будут отображаться более светлым цветом («**--base-color: #e2e2e2**»).

Все эти переменные можно будет использовать для стилизации элементов внутри теневого дерева всех остальных компонентов, задавая общий визуальный дизайн игры.

2. «**oda.js**» — файл c библиотекой самого фреймворка **ODA**.

```javascript
<script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/oda.js"></script>
```

3. «**oda-game.js**» — файл с js-кодом самого компонента игры «**oda-game**».

Если отобразить этот файл в браузере, то его окно останется пустым, так как сам компонент «**oda-game**» еще не определен, и браузер не знает, как отображать тэг «**\<oda-game>\</oda-game>**».

![Пустое окно игры](learn\images\my-first-component\empty-window.png "Пустое окно игры")

Для отображения этого тэга создадим папку «**js**» и поместим в него файл «**oda-game.js**» с кодом нашего первого компонента.

```javascript
ODA({ is: 'oda-game',
    template: `
        <style>
            :host {
                height: 100%;
                width: 100%;
                position: absolute;
                background-color: var(--header-background-color);
            }
            #game-space {
                position: absolute;
                top: 200px;
                width: 100%;
                height: 500px;
                overflow: hidden;
                background-color: var(--background-color) !important;
            }
            h1 {
                margin-bottom: 0px;
                text-align: center;
                font-family: "Comic Sans MS", Arial, sans-serif;
                color: var(--header-color);
            }
            #score {
                font-size: 50px;
                margin-top: 0px;
            }
            #message {
                position: relative;
                top: 35%;
            }
            oda-dino {
                position: absolute;
                top: var(--dino-top);
                left: 72px;
                z-index: 300;
            }
            #horizon {
                position: absolute;
                top: 435px;
                width: 100%;
                height: 3px;
                background-color: var(--horizon-color);
            }
        </style>

        <h1>Счет игры</h1>
        <h1 id="score">{{score || '0'}}</h1>
        <div id="game-space" ref="game-space">
            <h1 id="message" ~show="showMessage">{{message}}</h1>
            <oda-dino ref="dino"></oda-dino>
            <div id="horizon"></div>
        </div>
    `,
})
```

В его разделе «**template**» определяются:

1. Заголовок с надписью «**Счет игры**».

```html
<h1>Счет игры</h1>
```

2. Элемент вывода текущего счета игры с идентификатором «**id="score"**».

```html
<h1 id="score">{{score || '0'}}</h1>
```

В нем используется интерполяционная подстановка «**Mustache**», которая будет автоматически изменять текст в этом элементе при любом изменении счета игры «**score**».

3. Рабочая область игры («**id="game-space"**»), в которой динамически будут создаваться все остальные элементы игры.

```html
<div id="game-space" ref="game-space">
```

 Для доступа к этой области создается ссылка не нее с помощью директивы **ref**, а для ее стилизации предусмотрен одноименный идентификатор «**id**».

4. Сообщение о начале или об окончании игры («**id="message"**»).

```html
<h1 id="message" ~show="showMessage">{{message}}</h1>
```

С помощью этого элемента будет отображаться сообщение пользователю о начале или об окончании игры.

Текст этого сообщения будет располагаться в свойстве «**message**» компонента и отображаться с помощью интерполяционной подстановки «**Mustache**» только тогда, когда сопутствующее свойство «**showMessage**» будет иметь значение «**true**». В противном случае это сообщение будет автоматически скрыто директивой фреймворка «**~show**».

5. Сам динозавр, который задается в виде компонента «**oda-dino**».

```html
<oda-dino ref="dino"></oda-dino>
```

Для быстрого доступа к этому элементу предусмотрена ссылка на него, заданная также с помощью директивы «**ref**».

6. Элемент «**div**» с идентификатором «**horizon**».

```html
<div id="horizon"></div>
```

С его помощью будет схематично отображаться линия горизонта.

В результате этого начальное окно игры будет выглядеть следующим образом:

![Начальное окно игры](learn\images\my-first-component\no-score-window.png "Начальное окно игры")

Для стилизации всех его элементов в разделе «**style**» шаблона компонента были заданы следующие css-правила:

1. «**:host**» — стиль отображения самого компонента.

```css
 :host {
    height: 100%;
    width: 100%;
    position: absolute;
    background-color: var(--header-background-color);
}
```

Это правило задает серую область, которая занимает все тело документа полностью.

2. «**#game-space**» — стиль рабочей области игры.

```css
#game-space {
    position: absolute;
    top: 200px;
    width: 100%;
    height: 500px;
    overflow: hidden;
    background-color: var(--background-color) !important;
}
```

Эта область будет иметь темный цвет, который задается с помощью css-переменной «**--background-color**».

3. Заголовочный стиль «**h1**» определяет базовый шрифт, его цвет и расположение заголовочных надписей игры.

```css
h1 {
    margin-bottom: 0px;
    text-align: center;
    font-family: "Comic Sans MS", Arial, sans-serif;
    color: var(--header-color);
}
```

4. Стиль надписи с количеством набранных очков «**#score**» задает размер шрифта и величину верхнего отступа, которые отличаются от стандартного стиля отображения заголовков, задаваемого общим css-правилом «**h1**».

```css
#score{
    font-size: 50px;
    margin-top: 0px;
}
```

5. Стиль отображения сообщения о начале или об окончании игры «**#message**».

```css
#message {
    position: relative;
    top: 35%;
}
```

Он определяет позицию расположения надписи с сообщением относительно рабочей области игры.

6. Стиль отображения динозавра **oda-dino**.

```css
oda-dino {
    position: absolute;
    top: var(--dino-top);
    left: 72px;
    z-index: 300;
}
```

Он задает начальное расположение динозавра с помощью сss-переменной «**--dino-top**», которая имеет значение 314 пикселей. Именно на эту величину будет смещена начальная позиция динозавра относительно рабочей области игры.

7. Стиль отображения горизонта «#horizon» определяет расположение и цвет линии горизонта в игре.

```css
#horizon {
    position: absolute;
    top: 435px;
    width: 100%;
    height: 3px;
    background-color: var(--horizon-color);
}
```

Для отображения значения счетчика набранных очков и надписи о начале игры в компоненте «**oda-game**» необходимо предусмотреть раздел  «**props**» со следующими свойствами:

```javascript
props: {
    score: 0,
    message: 'Для начала игры нажмите пробел',
    showMessage: true,
},
```

Эти свойства имеют следующее назначение:

1. «**score**» — свойство для хранения текущего количества набранных очков.
1. «**message**» — свойство с текстом сообщения пользователю.
1. «**showMessage**» — флаг, определяющий необходимость отображения текста сообщения.

В результате этого надпись и начальное нулевое количество набранных очков будут автоматически отображаться в области игры благодаря использованию для этого подстановки «**{{Mustache}}**».

![Окно игры с надписью и очками](learn\images\my-first-component\score-window.png "Окно игры с надписью и очками")

Некоторые вспомогательные свойства компонента можно задать с помощью геттеров. К таким свойствам относятся:

1. «**dino**» — ссылка на компонент динозавра «**oda-dino**».

```javascript
get dino() {
    return this.$refs.dino;
},
```

2. «**gameSpace**» — ссылка на рабочую область игры, в которую будут добавляться все остальные элементы игры.

```javascript
get gameSpace() {
    return this.$refs["game-space"];
},
```
Для того, чтобы в области игры отобразить динозавра, создадим в папке «**js**» файл «**oda-dino.js**» с компонентом «**oda-dino**» следующим образом:

```javascript
ODA({ is: 'oda-dino',
    template: `
        <style>
            path {
                fill: var(--dino-color);
            }
            #small-eye {
                fill: var(--dino-eyes-color);
            }
            #big-eye {
                stroke: var(--dino-eyes-color);
            }
        </style>

        <svg version="1.1" baseProfile="full" width="128" height="137" xmlns="http://www.w3.org/2000/svg">

            <!-- Тело -->
            <path d=" M0 48, h7, v12, h6, v7, h6, v6, h13, v-6, h7, v-7, h9, v-6, h10, v-6, h6, v-42, h7, v-6, h51, v6, h6, v29, h-32, v6, h19, v7, h-25, v12, h13, v13, h-7, v-6, h-6, v22, h-7, v10, h-6, v6, h-6, v7, h-45, v-7, h-7, v-6, h-6, v-7, h-6, v-6, h-7, z " stroke="transparent" id="body"/>

            <!--Глаз маленький-->
            <rect x="77" y="9" fill="white" height="7" width="6" id="small-eye"/>

            <!--Глаз большой-->
            <rect x="78.5" y="10.5" fill="transparent" stroke-width="3" stroke="white" height="10" width="10" id="big-eye" visibility="hidden"/>

            <!--Рот-->
            <path d=" M95 34, v8, h20, v-1, h13, v-7, z " id="month" visibility="hidden"/>

            <!--Первая нога поднята вверх-->
            <path d=" M32 111, v7, h7, v6, h12, v-6, h-6, v-7, z " visibility="hidden" id="first-leg-up">
                <animate attributeName="visibility" values="hidden;visible" dur="0.3s" repeatCount="indefinite"/>
            </path>

            <!--Первая нога опущена вниз-->
            <path d="M32 111, v26, h13, v-6, h-6, v-7, h6, v-6, h6, v-7, z" id="first-leg-down" visibility="hidden" >
                <animate attributeName="visibility" values="visible;hidden" dur="0.3s" repeatCount="indefinite"/>
            </path>

            <!-- Вторая нога поднята вверх -->
            <path d="M64 111, v7, h16, v-6, h-9, v-1, z" visibility="hidden" id="second-leg-up">
                <animate attributeName="visibility" values="visible;hidden" dur="0.3s" repeatCount="indefinite"/>
            </path>

            <!--Вторая нога опущена вниз-->
            <path d="M58 111,v7,h6,v19,h13,v-6,h-6,v-20,z" id="second-leg-down" visibility="hidden">
                <animate attributeName="visibility" values="hidden;visible" dur="0.3s" repeatCount="indefinite"/>
            </path>
        </svg>
    `,
})
```

Пока в этом компоненте находится лишь один раздел шаблона «**template**» с SVG-примитивом динозавра и с css-стилями его отображения.

Графический примитив динозавра включает в себя:

1. Тело.

```html
<svg version="1.1" baseProfile="full" width="128" height="137" xmlns="http://www.w3.org/2000/svg">
    <!-- Тело -->
    <path d=" M0 48, h7, v12, h6, v7, h6, v6, h13, v-6, h7, v-7, h9, v-6, h10, v-6, h6, v-42, h7, v-6, h51, v6, h6, v29, h-32, v6, h19, v7, h-25, v12, h13, v13, h-7, v-6, h-6, v22, h-7, v10, h-6, v6, h-6, v7, h-45, v-7, h-7, v-6, h-6, v-7, h-6, v-6, h-7, z " stroke="transparent" id="body"/>
</svg>
```

2. Глаз.

```html
<!--Глаз маленький-->
<rect x="77" y="9" fill="white" height="7" width="6" id="small-eye"/>
```

3. Рот и две пары ног, каждая из которых может находиться в одном из двух положений.

![Расположение ног](learn\images\my-first-component\dino1.png "Первое расположение ног динозавра")

В первом положении одна нога поднята вверх, а вторая опущена вниз.

![Расположение ног](learn\images\my-first-component\dino2.png "Второе расположение ног динозавра")

Во втором положении первая нога опущена вниз, а вторая поднята вверх.

Использование двух положений ног позволяет задать анимационный эффект бега динозавра. Для этого достаточно к тэгу каждой ноги добавить специальный элемент «**animate**». Парная работа элементов «**animate**» позволяет поочередно скрывать или отображать определенную ногу динозавра через заданный временной интервал.

```html
<!--Первая нога поднята вверх-->
<path d=" M32 111, v7, h7, v6, h12, v-6, h-6, v-7, z " visibility="hidden" id="first-leg-up">
    <animate attributeName="visibility" values="hidden;visible" dur="0.3s" repeatCount="indefinite"/>
</path>

<!--Первая нога опущена вниз-->
<path d="M32 111, v26, h13, v-6, h-6, v-7, h6, v-6, h6, v-7, z" id="first-leg-down" visibility="hidden" >
    <animate attributeName="visibility" values="visible;hidden" dur="0.3s" repeatCount="indefinite"/>
</path>

<!-- Вторая нога поднята вверх -->
<path d="M64 111, v7, h16, v-6, h-9, v-1, z" visibility="hidden" id="second-leg-up">
    <animate attributeName="visibility" values="visible;hidden" dur="0.3s" repeatCount="indefinite"/>
</path>

<!--Вторая нога опущена вниз-->
<path d="M58 111,v7,h6,v19,h13,v-6,h-6,v-20,z" id="second-leg-down" visibility="hidden">
    <animate attributeName="visibility" values="hidden;visible" dur="0.3s" repeatCount="indefinite"/>
</path>
```

Кроме этого, к SVG-примитиву динозавра можно добавить большой глаз и рот.

```html
<!--Глаз большой-->
<rect x="78.5" y="10.5" fill="transparent" stroke-width="3" stroke="white" height="10" width="10" id="big-eye" visibility="hidden"/>

<!--Рот-->
<path d=" M95 34, v8, h20, v-1, h13, v-7, z " id="month" visibility="hidden"/>
```

Изначально они не будут отображаться потому, что у их свойства «**visibility**» установлено значение «**hidden**».

Рот и большой глаз будут появляться только в момент столкновения динозавра с кактусом, как иллюстрация спектра непередаваемых ощущений, испытываемых динозавром от близкого контакта 6-ой степени по шкале Хайнека с колючками, результатом которого является получение травм различной тяжести.

![Динозавр с большим глазом и закрытым ртом](learn\images\my-first-component\dino3.png "Динозавр с большим глазом и закрытым ртом")

Для отображения динозавра его модуль «**oda-dino**» нужно обязательно подключить к файлу игры «**oda-game.js**» следующим образом:

```javascript
import "./oda-dino.js";
```

В результате этого в рабочей области игры отобразится SVG-образ динозавра с анимацией движения его ног.

![Окно с динозавром](learn\images\my-first-component\dino-window.png "Окно с динозавром")

Однако на данном этапе игра не будет реагировать ни на какие действия пользователя. Для ее начала необходимо зарегистрировать слушателя события нажатия клавиши клавиатуры «**keyup**». Это можно сделать в хуке «**ready**» компонента игры «**oda-game**» с помощью предопределенного метода «**listen**» следующим образом:

```javascript
ready() {
    this.listen('keyup', 'startGame', {target: document});
},
```

Здесь в качестве обработчика события регистрируется метод «**startGame**», который первоначально должен быть объявлен в компоненте игры.

```javascript
startGame(e) {
    if (e.code !== 'Space') {
        return;
    }
    this.showMessage = false;
    this.message = "Game Over";

    this.timerID = setInterval(() => {
        this.score++;
    }, 100);

    this.unlisten('keyup', 'startGame', {target: document});

    this.listen('keydown', 'dinoJump', {target: document});
},
```

В этом методе проверяется, какую клавишу нажал и отпустил пользователь.

Если была нажата клавиша пробела, то при ее отпускании будут выполняться следующие действия:

 1. Будет скрываться надпись «**Для начала игры нажмите пробел**» присвоением свойству «**showMessage**» значения «**false**»

 ```javascript
    this.showMessage = false;
```

 2. Текст надписи будет заменяться сообщением «**Game Over**», которое должно появляться при столкновении динозавра с кактусом.

```javascript
    this.message = "Game Over";
```

3. Будет создан таймер, который каждые 100 миллисекунд будет увеличивать на единицу счетчик набранных очков.

```javascript
this.timerID = setInterval(() => {
    this.score++;
}, 100);
```

Для остановки этого таймера в момент окончания игры его идентификатор необходимо сохранить. Для этого в компоненте «**oda-game**» необходимо предусмотреть специальное свойство «**timerID**».

```javascript
props: {
    timerID: 0,
    score: 0,
    message: 'Для начала игры нажмите пробел',
    showMessage: true,
},
```

4. Удаляется обработчик начала игры «**startGame**» с помощью предопределенного метода «**unlisten**».

```javascript
this.unlisten('keyup', 'startGame', {target: document});
```

5. Регистрируется обработчик нажатия клавиш «**keydown**» для выполнения прыжка динозавра с помощью предопределенного метода «**listen**».

```javascript
this.listen('keydown', 'dinoJump', {target: document});
```

Сам обработчик нужно будет добавить в компонент «**oda-dino**» в виде метода «**dinoJump**».

```javascript
dinoJump(e) {
    if (e.code === 'Space') {
        this.dino.jump();
    }
},
```

Этот метод вызывает метод «**jump**» компонента «**oda-dino**» только при условии, что пользователь нажал клавишу пробела «**Space**».

Для создания эффекта прыжка в раздел «**style**» компонента «**oda-dino**» необходимо добавить следующий анимационный кадр:

```css
@keyframes dino-jump{
    from {
      top: var(--dino-top);
      animation-timing-function: ease-out;
    }
    50% {
       top: var(--dino-max-top);
       animation-timing-function: ease-in;
    }
    to {
        top: var(--dino-top);
        animation-timing-function: ease-in;
    }
}
```

Здесь используются css-переменные, которые определяют координаты расположения динозавра по высоте на разных фазах прыжка:

1. Начальное положение («**--dino-top: 314px**»).

1. Промежуточное положение («**--dino-max-top: 20px**»).

1. Конечное положение («**--dino-top: 314px**»).

Сама анимация прыжка задается с помощью css-класса «**dino-jump**».

Для его использования в раздел «**style**» компонента «**oda-dino**» нужно добавить специальную css-функцию-псевдокласс «**:host()**».

```css
:host(.dino-jump) {
    animation-name: dino-jump;
    animation-duration: 1s;
    animation-iteration-count: 1;
    animation-timing-function: ease-out;
}
```
В этой css-функции используется предыдущий ключевой кадр «**dino-jump**» и указывается продолжительность однократного прыжка в 1 секунду.

Это функция будет применяться к компоненту динозавра лишь тогда, когда у него будет задан css-класс с именем «**dino-jump**». Добавить этот класс к этому компоненту можно с помощью метода «**jump**», который задается следующим образом:

```javascript
jump() {
    this.classList.add("dino-jump");
    this.svg.pauseAnimations();
    this.getAnimations().forEach((anim, i, arr) => {
        anim.onfinish = () => {
            this.classList.remove("dino-jump");
            this.offsetHeight; // reflow
            this.svg.unpauseAnimations();
        }
    });
},
```

В нем, кроме добавления css-класса с анимацией прыжка, будет также приостанавливаться анимация движения его ног. Для этого используется специальный метод «**pauseAnimations**» его SVG-элемента.

После окончания анимации прыжка предусмотрена функция обратного вызова «**onfinish**», при срабатывании которой у тэга компонента удаляется ранее добавленный css-класс «**dino-jump**» и возобновляется действие анимации движения его ног с помощью метода «**unpauseAnimations**».

Для более быстрого обращения к SVG-примитиву динозавра в его компоненте можно предусмотреть вспомогательное свойство «**svg**» и проинициализировать его в хуке «**attached**» следующим образом:

```javascript
props: {
    svg: {},
},
attached() {
    this.svg = this.$core.root.querySelector("svg");
},
```

В результате этого при первом нажатии и отпускании клавиши пробела надпись с сообщением о начале игры исчезнет, при этом запустится счетчик набранных очков.

![Начало игры](learn\images\my-first-component\start-game-window.png "Начало игры")

При следующих нажатиях клавиши пробела динозавр будет просто подпрыгивать вверх.

![Прыжок динозавра](learn\images\my-first-component\jump-dino-window.png "Прыжок динозавра")

Для отображения в игре модели кактуса добавим к ней новый компонент «**oda-cactus**». Для этого создадим в папке «**js**» файл с именем «**oda-cactus.js**» и запишем в него следующий код:

```javascript
ODA({ is: 'oda-cactus',
    template: `
        <style>
            path {
                fill: var(--cactus-color);
            }
            :host {
                position: absolute;
                top: 301px;
                z-index: 200;
                animation-name: move;
                animation-duration: 3s;
                animation-iteration-count: 1;
                animation-timing-function: linear;
            }
            @keyframes move {
                from {
                    left: 100%;
                }
                to {
                    left: -136px;
                }
            }
        </style>

        <svg version="1.1" baseProfile="full" width="74" height="147" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 41, h3,v-3, h10, v3, h3, v42, h10, v-80, h3, v-3, h16, v3, h3, v80, h10, v-48, h3, v-3, h10, v3, h3, v48, h-3, v3, h-4, v3, h-3, v4, h-3, v3, h-13, v51, h-22, v-48, h-16, v-3, h-3, v-3, h-4, v-4, h-3, z"/>
        </svg>
    `,
})
```

Этот компонент содержит графический примитив кактуса, который отображается следующий образом:

![Графический примитив кактуса](learn\images\my-first-component\cactus.png "Кактус")

Он задается следующим SVG-элементом:

```html
<svg version="1.1" baseProfile="full" width="74" height="147" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 41, h3,v-3, h10, v3, h3, v42, h10, v-80, h3, v-3, h16, v3, h3, v80, h10, v-48, h3, v-3, h10, v3, h3, v48, h-3, v3, h-4, v3, h-3, v4, h-3, v3, h-13, v51, h-22, v-48, h-16, v-3, h-3, v-3, h-4, v-4, h-3, z"/>
</svg>
```

Анимация движения кактуса от правой границы игры до левой определяется следующим ключевым кадром:

```javascript
@keyframes move {
    from {
        left: 100%;
    }
    to {
        left: -136px;
    }
}
```

Отрицательное значение левой координаты в нем задается для того, чтобы все тело кактуса могло зайти за левую границу рабочей области игры.

Данный ключевой кадр нужно указать в псевдоклассе «**:host**», который будет применяться к хосту компонента кактуса сразу после его создания.

```css
:host {
    position: absolute;
    top: 301px;
    z-index: 200;
    animation-name: move;
    animation-duration: 3s;
    animation-iteration-count: 1;
    animation-timing-function: linear;
}
```

В этом css-правиле продолжительность анимации движения задается равной 3 секундам.

Для отображения кактуса в области игры необходимо первоначально подключить его модуль к файлу игры «**oda-game.js**» следующим образом:

```javascript
import "./oda-dino.js";
import "./oda-cactus.js";
```

Также в раздел «**template**» компонента «**oda-game**» необходимо добавить тэг «**oda-cactus**» слудующим образом:

```html
<h1>Счет игры</h1>
<h1 id="score">{{score || '0'}}</h1>
<div id="game-space" ref="game-space">
    <h1 id="message" ~show="showMessage">{{message}}</h1>
    <oda-dino ref="dino"></oda-dino>
    <oda-cactus></oda-cactus>
    <div id="horizon"></div>
</div>
```

Теперь кактус появится в игре и начнет двигаться справа-налево до полного выхода за левую границу рабочей области игры.

![Движущийся кактус](learn\images\my-first-component\cactus-move-window.png "Движущийся кактус")

Однако после окончания анимации кактус снова появится рядом с ней.

![Повторное появления кактуса](learn\images\my-first-component\cactus-stop-move-window.png "Повторное появления кактуса")

Для того, чтобы после выхода за эту границу кактус больше не появлялся, его нужно удалить.

С этой целью можно воспользоваться специальной функцией обратного вызова «**onfinish**», которая будет выполняться сразу в момент окончания движения. Для этого в хуке «**attached**» компонента «**oda-cactus**» нужно записать следующий код:

```javascript
attached() {
    this.getAnimations().forEach((anim, i, arr) => {
        anim.onfinish = () => {
            this.remove();
        };
    });
},
```

В нем предусмотрено удаление кактуса сразу после завершения анимации движения стандартным js-методом «**remove**».

В результате этого кактус больше не будет появляться в области игры после выхода за левую границу.

![Удаление кактуса](learn\images\my-first-component\dino-window.png "Удаление кактуса")

Аналогично отображаются и другие элементы игры: облака и птеродактили.

Для представления облаков добавим в папку «**js**» файл «**oda-cloud.js**» и определим в нем код компонента «**oda-cloud**».

```javascript
ODA({ is: 'oda-cloud',
    template: `
        <style>
            path,
            rect {
                fill: var(--cloud-color);
            }
            :host {
                position: absolute;
                z-index: 100;
                animation-name: move;
                animation-duration: 6s;
                animation-iteration-count: 1;
                animation-timing-function: linear;
            }
            @keyframes move {
                from {
                    left: 100%;
                }
                to {
                    left: -150px;
                }
            }
        </style>
        <svg version="1.1" baseProfile="full" width="150" height="51" xmlns="http://www.w3.org/2000/svg">
            <path d = "M0 38, v3, h7, v-3, h3, v-3, h-6, v3, z"/>
            <path d = "M13 35, h3, v-6, h4, v-4, h22, v-3, h3, v-3, h10, v-10, h6, v-3, h3, v-3, h16, v-3, h13, v3, h7, v3, h3, v7, h9, v3, h16, v6, h10, v7, h6, v6, h-3, v-3, h-6, v-7, h-10, v-6, h-16, v-3, h-6, v3, h-3, v-10, h-4, v-3, h-6, v-3, h-6, v3, h-16, v3, h-4, v4, h-6, v9, h-10, v3, h-3, v4, h-22, v3, h-3, v6, h-7, z"/>
            <path d = "M32 38, h112, v-3, h4, v6, h-116, z"/>
            <rect x="29" y="35" height="3" width="3" />
            <rect x="96" y="19" height="3" width="4" />
        </svg>
    `,
    attached() {
        this.setPosition(20, 150);
        this.getAnimations().forEach((anim, i, arr) => {
            anim.onfinish = () => {
                this.remove();
            };
        });
    },
    setPosition(min, max) {
        this.style.top = Math.floor(min + Math.random() * (max + 1 - min)) + 'px';
    },
})
```

В этом компоненте задается SVG-примитив облака.

![Графический примитив облака](learn\images\my-first-component\cloud.png "Графический примитив облака")

В отличие от кактусов облака должны появляться в игре на разной высоте. Для этого при их создании вызывается специальный метод «**setPosition**», который генерирует случайную высоту их появления в диапазоне от 20 до 150 пикселей относительное верхней границы рабочей области игры.

Для отображения облаков необходимо подключить их модуль «**oda-cloud.js**» к компоненту игры следующим образом:

```javascript
import "./oda-dino.js";
import "./oda-cactus.js";
import "./oda-cloud.js";
```

Чтобы протестировать этот компонент, необходимо в компоненте «**oda-game**» задать тэг «**oda-cloud**» следующим образом:

```html
<h1>Счет игры</h1>
<h1 id="score">{{score || '0'}}</h1>
<div id="game-space" ref="game-space">
    <h1 id="message" ~show="showMessage">{{message}}</h1>
    <oda-dino ref="dino"></oda-dino>
    <oda-cactus></oda-cactus>
    <oda-cloud></oda-cloud>
    <div id="horizon"></div>
</div>
```

В результате этого в области игры появится облако, которое будет двигаться от правой границы до левой, а после захода за левую границу оно автоматически удалится.

![Движение облака](learn\images\my-first-component\cloud-move-window2.png "Движение облака")

Кроме этого, при многократной загрузке игры облако будет появляться на разной высоте.

![Разная высота облака](learn\images\my-first-component\cloud-move-window.png "Разная высота облака")

Аналогично задается компонент птеродактиля «**oda-pterodactyl**». Для этого нужно создать в папке «**js**» новый файл «**oda-pterodactyl.js**» и добавить в него следующий код:

```javascript
ODA({ is: 'oda-pterodactyl',
    template: `
        <style>
            path {
                fill: var(--pterodactyl-color);
            }
            :host {
                position: absolute;
                z-index: 200;
                animation-name: move;
                animation-duration: 3s;
                animation-iteration-count: 1;
                animation-timing-function: linear;
            }
            @keyframes move {
                from {
                    left: 100%;
                }
                to {
                    left: -136px;
                }
            }
        </style>
        <svg version="1.1" baseProfile="full" width="95" height="84" xmlns="http://www.w3.org/2000/svg">
            <!--Тело птеродактиля-->
            <path d=" M0 31, h4, v-4, h5, v-5, h4, v-4, h5, v-5, h9, v9, h4, v9, h32, v4, h5, v5, h27, v4, h-14, v5, h9, v4, h-13, v5, h-32, v-5, h-4, v-4, h-5, v-5, h-5, v-4, h-4, v-5, h-27, z " stroke="transparent" id="pterodactyl"/>

            <!--Крыло поднято вверх-->
            <path d=" M36 32, v-19, h-5, v-13, h5, v4, h5, v5, h4, v4, h5, v5, h4, v4, h5, v5, h4, v5, z ">
                <animate attributeName="visibility" values="visible;hidden" dur="0.3s" repeatCount="indefinite"/>
            </path>

            <!--Крыло опущено вниз-->
            <path d=" M36 47, h18, v18, h-5, v5, h-4, v9, h-5, v5, h-4, z ">
                <animate attributeName="visibility" values = "hidden;visible" dur="0.3s" repeatCount="indefinite"></animate>
            </path>
        </svg>
    `,
    attached() {
        this.setPosition(10,100);
        this.getAnimations().forEach((anim, i, arr) => {
            anim.onfinish = () => {
                this.remove();
            };
        });
    },
    setPosition(min, max) {
        this.style.top = Math.floor(min + Math.random() * (max + 1 - min)) + 'px';
    },
})
```

В нем задается графический примитив, который включает в себя тело птеродактиля и две позиции его крыла.

Первая позиция — крыло поднято вверх,

![Графический примитив птеродактиля](learn\images\my-first-component\pterodactyl1.png "Птеродактиль")

а вторая позиция — опущено вниз.

![Графический примитив птеродактиля](learn\images\my-first-component\pterodactyl2.png "Птеродактиль")

Для создания эффекта взмахов крыльев к ним можно добавить тэг «**animate**», который будет поочередно скрывать и отображать то или иное состояние крыла птеродактиля через заданный временной интервал.

```html
<!--Крыло поднято вверх-->
<path d=" M36 32, v-19, h-5, v-13, h5, v4, h5, v5, h4, v4, h5, v5, h4, v4, h5, v5, h4, v5, z ">
    <animate attributeName="visibility" values="visible;hidden" dur="0.3s" repeatCount="indefinite"/>
</path>

<!--Крыло опущено вниз-->
<path d=" M36 47, h18, v18, h-5, v5, h-4, v9, h-5, v5, h-4, z ">
    <animate attributeName="visibility" values = "hidden;visible" dur="0.3s" repeatCount="indefinite"></animate>
</path>
```

В отличие от облаков птеродактили будут появляться на случайной высоте в диапазоне от 10 до 100 пикселей так, чтобы не задевать своими крыльями бегущего динозавра.

```javascript
this.setPosition(10,100);
```

Для отображения тэга «**oda-pterodactyl**» не забудьте подключить модуль птеродактиля к компоненту игры.

```javascript
import "./oda-dino.js";
import "./oda-cactus.js";
import "./oda-cloud.js";
import "./oda-pterodactyl.js";
```

И добавьте тэг «**oda-pterodactyl**» в компонент «**oda-game**» следующим образом:

```html
<h1>Счет игры</h1>
<h1 id="score">{{score || '0'}}</h1>
<div id="game-space" ref="game-space">
    <h1 id="message" ~show="showMessage">{{message}}</h1>
    <oda-dino ref="dino"></oda-dino>
    <oda-cactus></oda-cactus>
    <oda-cloud></oda-cloud>
    <oda-pterodactyl></oda-pterodactyl>
    <div id="horizon"></div>
</div>
```

![Передвижение птеродактиля](learn\images\my-first-component\pterodactyl-move-window.png "Передвижение птеродактиля")

Во всех предыдущих примерах кактусы, облака и птеродактили задавались в компоненте игры только с целью их тестирования.

В общем случае они должны создаваться динамически, а тело игры должно содержать только один компонент динозавра.

```html
<h1>Счет игры</h1>
<h1 id="score">{{score || '0'}}</h1>
<div id="game-space" ref="game-space">
    <h1 id="message" ~show="showMessage">{{message}}</h1>
    <oda-dino ref="dino"></oda-dino>
    <div id="horizon"></div>
</div>
```

Для динамического создания остальных элементов игры предусмотрим в ее компоненте следующие методы:

1. «**createCloud**» — метод создания облаков.

```javascript
createCloud() {
    if (this.nextCloud === 0) {
        this.gameSpace.append(document.createElement('oda-cloud'));
        this.nextCloud = Math.floor(20 + Math.random() * (150 + 1 - 20));
    }
    this.nextCloud--;
},
```

2. «**createCactus**» — метод создания кактусов.

```javascript
createCactus() {
    if (this.nextCactus === 0) {
        this.gameSpace.append(document.createElement('oda-cactus'));
        this.nextCactus = Math.floor(100 + Math.random() * (150 + 1 - 100));
    }
    this.nextCactus--;
},
```

3. «**createPterodactyl**» — метод создания птеродактилей.

```javascript
createPterodactyl() {
    if (this.nextPterodactyl === 0) {
        this.gameSpace.append(document.createElement('oda-pterodactyl'));
        this.nextPterodactyl = Math.floor(150 + Math.random() * (200 + 1 - 150));
    }
    this.nextPterodactyl--;
},
```

Во всех этим методах компоненты создаются с помощью метода «**createElement**» и добавляются в компонент игры с помощью метода «**append**».

Эти компоненты будут создаваться циклически через опредленный временной интервал. Для этого заданы специальные счетчики их создания «**nextCloud**», «**nextCactus**» и «**nextPterodactyl**». Эти счетчики инициализируются случайным значением и уменьшаются на единицу с каждым следующим тактом анимации. Как только какой-либо счетчик уменьшится до нуля, то будет создан следующий компонент.

Первоначально эти счетчики нужно задать в виде свойств компонента «**oda-game**» и присвоить им следующие начальные значения:

```javascript
props: {
    timerID: 0,
    score: 0,
    message: 'Для начала игры нажмите пробел',
    showMessage: true,
    nextCloud: 0,
    nextCactus: 0,
    nextPterodactyl: 50,
},
```

Счетчики появления облаков и кактусов изначально устанавливаются в ноль, а счетчик появления птеродактиля задан равным 50. В результате этого первое облако и кактус появятся сразу после начала игры, а первый птеродактиль будет создан после этого с небольшим временным интервалом.

Для неоднократного создания всех этих элементов нужно предусмотреть специальный метод «**checkDino**» в компоненте игры.

```javascript
 checkDino() {
    this.createCloud();
    this.createCactus();
    this.createPterodactyl();
    requestAnimationFrame(this.checkDino.bind(this));
},
```

В конце этого метода предусмотрен его циклический вызов с каждым последующим кадром анимации. Для этого используется стандартная функция языка Javascript «**requestAnimationFrame**».

В ней к методу «**checkDino**» обязательно необходимо привязать контекст компонента игры с помощью метода «**bind**». В противном случае указатель «**this**» внутри этого метода будет иметь неопределенное значение «**undefined**», в таком случае обратиться к элементам игры в теле метода «**checkDino**» будет невозможно.

Метод «**checkDino**» нужно вызвать и в методе начала игры «**startGame**».

```javascript
startGame(e) {
    if (e.code !== 'Space') {
        return;
    }
    this.showMessage = false;
    this.message = "Game Over";

    this.timerID = setInterval(() => {
        this.score++;
    }, 100);

    this.unlisten('keyup', 'startGame', {target: document});

    this.listen('keydown', 'dinoJump', {target: document});

    requestAnimationFrame(this.checkDino.bind(this));
},
```

В результате этого кактусы, облака и птеродактили начнут появляться в игре автоматически, как только пользователь запустит ее первый нажатием на клавишу пробела.

![Автоматическое создание элементов игры](learn\images\my-first-component\create-elements-window.png "Автоматическое создание элементов игры")

Кроме создания этих элементов, в методе «**checkDino**» необходимо предусмотреть определение момента столкновения динозавра с кактусом.

```javascript
let cactuses = this.gameSpace.querySelectorAll('oda-cactus');
for (var i = 0; i < cactuses.length; ++i) {
    if (this.dino.isIntersection && this.dino.isIntersection(cactuses[i])) {
        this.gameOver();
        return;
    }
}
```

Теперь код метода «**checkDino**» примет вид:

```javascript
checkDino() {
    this.createCloud();
    this.createCactus();
    this.createPterodactyl();
    let cactuses = this.gameSpace.querySelectorAll('oda-cactus');
    for (var i = 0; i < cactuses.length; ++i) {
        if (this.dino.isIntersection && this.dino.isIntersection(cactuses[i])) {
            this.gameOver();
            return;
        }
    }
    requestAnimationFrame(this.checkDino.bind(this));
},
```

Для это формируется список всех активных кактусов в области игры «**cactuses**» и для каждого из них проверяется факт пересечение его с SVG-образом динозавра c помощью его метода «**isIntersection**».

```javascript
isIntersection(cactus) {
    let dinoCoords = this.getBoundingClientRect();
    let cactusCoords = cactus.getBoundingClientRect();

    if ((cactusCoords.left+cactusCoords.width < dinoCoords.left ||
        dinoCoords.left+dinoCoords.width < cactusCoords.left ||
        dinoCoords.top + dinoCoords.height < cactusCoords.top ||
        cactusCoords.top + cactusCoords.height < dinoCoords.top))
    {
        return false;
    }

    return intersectPolygonPolygon(this.polygons.get('dino-body'), cactus.polygons.get('cactus'), dinoCoords, cactusCoords)
        || (getComputedStyle(this.svg.getElementById('first-leg-up')).visibility === 'visible' ?
                intersectPolygonPolygon(this.polygons.get('dino-first-leg-up'), cactus.polygons.get('cactus'), dinoCoords, cactusCoords) :
                intersectPolygonPolygon(this.polygons.get('dino-first-leg-down'), cactus.polygons.get('cactus'), dinoCoords, cactusCoords)) ||
            (getComputedStyle(this.svg.getElementById('second-leg-up')).visibility === 'visible' ?
                intersectPolygonPolygon(this.polygons.get('dino-second-leg-up'), cactus.polygons.get('cactus'), dinoCoords, cactusCoords) :
                intersectPolygonPolygon(this.polygons.get('dino-second-leg-down'), cactus.polygons.get('cactus'), dinoCoords, cactusCoords));
},
```

В этом методе находятся координаты текущего кактуса и динозавра с помощью стандартного метода «**getBoundingClientRect**», а затем определяется факт пересечения полигонов тела динозавра и его ног с полигоном кактуса.

Для этого необходимо сначала преобразовать в полигоны все элементы «**path**» SVG-примитивов динозавра и кактуса, у которых будут уже не относительные, а абсолютные координаты. Это можно сделать в хуке **attached**, соответствующих компонентов.

Например, в компоненте «**oda-dino**» это можно сделать следующим образом:

```javascript
attached() {
    this.polygons = new Map();
    this.svg = this.$core.root.querySelector("svg");
    this.polygons.set('dino-body', createPolygon(this.svg,'#body'));
    this.polygons.set('dino-first-leg-up', createPolygon(this.svg,'#first-leg-up'));
    this.polygons.set('dino-first-leg-down', createPolygon(this.svg,'#first-leg-down'));
    this.polygons.set('dino-second-leg-up', createPolygon(this.svg,'#second-leg-up'));
    this.polygons.set('dino-second-leg-down', createPolygon(this.svg,'#second-leg-down'));
},
```

В этом хуке к компоненту динозавра добавляется свойство «**polygons**», в котором записываются полигоны его тела и всех ног под уникальными именами так, чтобы их можно было бы в дальнейшем найти быстрее.

Аналогично формируется хук «**attached**» у компонента кактуса «**oda-cactus**».

```javascript
attached() {
    const svg = this.$core.root.querySelector("svg");
    this.polygons = new Map();
    this.polygons.set('cactus', createPolygon(svg,'path'));
    this.getAnimations().forEach((anim, i, arr) => {
        anim.onfinish = () => {
            this.remove();
        };
    });
},
```

В этих хуках для преобразования относительных координат SVG-элементов в линейные полигоны используется функция «**createPolygon**», которая задается отдельно.

Для этого нужно добавить в папку игры «**js**» файл «**utils.js**» следующего содержания:

```javascript
export function createPolygon(svg, selector) {
    return pathToPolygon(svg.querySelector(selector));
}
```

Эту функцию необходимо подключить к модулю компонента кактуса следующим образом:

```javascript
import {createPolygon} from "./utils.js"
```

Она находит соответствующий элемент у переданного SVG-примитива и вызывает функцию преобразования элемента «**path**»  в полигон **pathToPolygon**. Эта функция задается в модуле «**utils**» следующим образом:

```javascript
function pathToPolygon(path) {
    const points = path.getAttribute('d').split(',');
    let polygon = [];
    let lastPoint = new Point(0,0);
    points.forEach(point => {
        point = point.trim();
        switch (point[0]) {
            case 'M':
                point = point.slice(1).split(' ');
                lastPoint.x += +point[0];
                lastPoint.y += +point[1];
                polygon.push(lastPoint.clone());
                break;
            case 'h':
                lastPoint.x += +point.slice(1);
                polygon.push(lastPoint.clone());
                break;
            case 'v':
                lastPoint.y += +point.slice(1);
                polygon.push(lastPoint.clone());
                break;
        }
    })
    return polygon;
}
```

В своем теле эта функция использует вспомогательный класс точек «**Point**», который тоже нужно задать в файле «**utils.js**» следующим образом:

```javascript
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    clone() {
        return new Point(this.x,this.y);
    }
    moveTo(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
}
```

Фактически функция «**pathToPolygon**» преобразует последовательность относительных точек SVG-пути в последовательность их абсолютных координат.

Для нахождения пересечения двух полигонов в js-модуле «**utils**» нужно использовать функцию «**intersectPolygonPolygon**».

```javascript
export function intersectPolygonPolygon(polygon1, polygon2, dinoCoords, svgCoords) {
    var length = polygon1.length;
    for ( let i = 0; i < length; i++ ) {
        const result = intersectionLinePolygon(polygon1[i], polygon1[(i+1) % length], polygon2, dinoCoords, svgCoords);
        if (result)
            return true;
    }
    return false;
}
```

Эта функция для нахождения пересечения двух полигонов использует особую функцию «**intersectionLinePolygon**», которая позволяет найти пересечение одного полигона только с одной из линий другого полигона.

```javascript
function intersectionLinePolygon(point1, point2, polygon, dinoCoords , svgCoords) {
    const length = polygon.length;

    for ( let i = 0; i < length; i++ ) {
        if ( intersectionLineLine(point1.clone(), point2.clone(), polygon[i].clone(), polygon[(i+1) % length].clone(), dinoCoords, svgCoords) )
            return true;
    }

    return false;
}
```

Эта функция в свою очередь использует функцию «**intersectionLineLine**» для нахождения пересечения двух линий друг с другом.

```javascript
function intersectionLineLine(a1, b1, a2, b2, dinoCoords, svgCoords) {

    a1.moveTo(dinoCoords.x, dinoCoords.y);
    b1.moveTo(dinoCoords.x, dinoCoords.y);
    a2.moveTo(svgCoords.x, svgCoords.y);
    b2.moveTo(svgCoords.x, svgCoords.y);

    let maxA = {
        x: Math.max(a1.x, b1.x),
        y: Math.max(a1.y, b1.y),
    }

    let minA = {
        x: Math.min(a1.x, b1.x),
        y: Math.min(a1.y, b1.y),
    }

    let maxB = {
        x: Math.max(a2.x, b2.x),
        y: Math.max(a2.y, b2.y),
    }

    let minB = {
        x: Math.min(a2.x, b2.x),
        y: Math.min(a2.y, b2.y),
    }

    return minA.x <= minB.x && minB.x <= maxA.x && minA.y >= minB.y && minA.y <= maxB.y ||
        minA.x <= maxB.x && maxB.x <= maxA.x && maxA.y >= minB.y && maxA.y <= maxB.y ||
        minB.x <= minA.x && minA.x <= maxB.x && minB.y >= minA.y && minB.y <= maxA.y ||
        minB.x <= maxA.x && maxA.x <= maxB.x && maxB.y >= minA.y && maxB.y <= maxA.y;
}
```

Именно в этой функции окончательно определяется будет ли SVG-примитив динозавра пересекаться с SVG-примитивом кактусом.

Для использования этих функций в компоненте динозавра их нужно подключить к его модулю следующим образом:

```javascript
import {createPolygon, intersectPolygonPolygon} from "./utils.js"
```

Если столкновение динозавра ни с каким кактусом не будет найдено, то эта же проверка продолжится на следующем кадре анимации, когда кактусы изменят свою позицию.

В противном случае игра будет остановлена с помощью метода «**gameOver**».

В этом методе выполняются следующие действия:

```javascript
gameOver() {
    this.showMessage = true;

    clearInterval(this.timerID);

    this.dino.stopMove();

    const clouds = this.gameSpace.querySelectorAll('oda-cloud');
    clouds.forEach(cloud => {
        cloud.stopMove();
    });

    const cactuses = this.gameSpace.querySelectorAll('oda-cactus');
    cactuses.forEach(cactus => {
        cactus.stopMove();
    });

    const pterodactyls = this.gameSpace.querySelectorAll('oda-pterodactyl');
    pterodactyls.forEach(pterodactyl => {
        pterodactyl.stopMove();
    });

    this.unlisten('keydown', 'dinoJump', {target: document});

    this.listen('keyup', 'continueGame', {target: document});
}
```

1. Отображается сообщение об окончании игры «**Game Over**».

```javascript
this.showMessage = true;
```

2. Останавливается таймер счетчика набранных очков с использованием его уникального идентификатора, который ранее был сохранен в свойстве «**timerID**» компонента игры.

```javascript
  clearInterval(this.timerID);
```

3. Останавливается анимация движения динозавра вызовом метода «**stopMove**», который необходимо добавить к компоненту «**oda-dino**» следующим образом:

```javascript
stopMove() {
    this.style.animationPlayState="paused";
    this.svg.pauseAnimations();
    this.svg.getElementById('big-eye').setAttribute('visibility', 'visible');
    this.svg.getElementById('small-eye').setAttribute('visibility', 'hidden');
    this.svg.getElementById('month').setAttribute('visibility', 'visible');
},
```

Здесь анимация прыжка динозавра останавливается заданием у его компонента css-стиля «**animationPlayState**» со значением  «**paused**», а анимация движения ног останавливается вызовом метода **pauseAnimations** его SVG-элемента. Кроме этого, у динозавра скрывается маленький глаз и вместо него отображается большой глаз и закрывается рот. Эти действия достигаются изменением у этих элементов значения свойства «**visibility**».

4. Останавливается движение облаков.

```javascript
const clouds = this.gameSpace.querySelectorAll('oda-cloud');
clouds.forEach(cloud => {
    cloud.stopMove();
});
```

Для этого в компоненте «**oda-cloud**» нужно задать метод «**stopMove**» следующим образом:

```javascript
stopMove(){
    this.style.animationPlayState="paused";
}
```

5. Аналогично останавливается движение всех кактусов.

```javascript
const cactuses = this.gameSpace.querySelectorAll('oda-cactus');
cactuses.forEach(cactus => {
    cactus.stopMove();
});
```

Для этого используется такой же метод «**stopMove**», но уже заданный в компоненте «**oda-cactus**».

```javascript
stopMove(){
    this.style.animationPlayState="paused";
}
```

6. Останавливается движение всех птеродактилей.

```javascript
const pterodactyls = this.gameSpace.querySelectorAll('oda-pterodactyl');
pterodactyls.forEach(pterodactyl => {
    pterodactyl.stopMove();
});
```

Для этого в их компоненте задается метод «**stopMove**» следующий образом:

```javascript
stopMove(){
    this.style.animationPlayState="paused";
    const svg = this.$core.root.querySelector("svg");
    svg.pauseAnimations();
},
```

В нем, помимо приостановки движения самого птеродактиля, также приостанавливается и анимация взмахов его крыльев.

7. Удаляется слушатель нажатия на клавишу пробела для предотвращение последующих прыжков динозавра, налетевшего на кактус.

```javascript
 this.unlisten('keydown', 'dinoJump', {target: document});
```

В результате этих действий все элементы игры будут приостановлены.

![Game over](learn\images\my-first-component\game-over-window.png "Game over")

Если пользователь захочет продолжить игру без перезагрузки страницы, то для этого можно предусмотреть добавление в конец метода «**GameOver**» специального слушателя.

```javascript
this.listen('keyup', 'continueGame', {target: document});
```

Он будет срабатывать при отпускании любой кнопки и вызывать метод «**continueGame**», который нужно добавить к компоненту игры.

```javascript
continueGame() {
    this.showMessage = false;

    const cactuses = this.gameSpace.querySelectorAll('oda-cactus');
    cactuses.forEach(cactus => {
        cactus.remove();
    });

    this.nextCactus = 0;

    this.dino.continueMove();

    const clouds = this.gameSpace.querySelectorAll('oda-cloud');
    clouds.forEach(cloud => {
        cloud.continueMove();
    });

    const pterodactyls = this.gameSpace.querySelectorAll('oda-pterodactyl');
    pterodactyls.forEach(pterodactyl => {
        pterodactyl.continueMove();
    });

    this.score = 0;

    this.timerID = setInterval(() => {
        this.score++;
    }, 100);

    this.unlisten('keyup', 'continueGame', {target: document});

    this.listen('keydown', 'dinoJump', {target: document});

    requestAnimationFrame(this.checkDino.bind(this));
},
```

В этом методе выполняются следующие действия:

1. Скрывается надпись об окончании игры «**GameOver**».

```javascript
this.showMessage = false;
```
2. Удаляются все кактусы.

```javascript
const cactuses = this.gameSpace.querySelectorAll('oda-cactus');
cactuses.forEach(cactus => {
    cactus.remove();
});
```

3. Обнуляется счетчик появления следующего кактуса.

```javascript
this.nextCactus = 0;
```

4. Возобновляется анимация движения ног динозавра методом «**continueMove**».

```javascript
this.dino.continueMove();
```

Для этого в его компонент нужно добавить метод «**continueMove**» со следующим кодом:

```javascript
continueMove() {
    this.classList.remove("dino-jump");
    this.svg.unpauseAnimations();
    this.style.animationPlayState=null;
    this.svg.getElementById('big-eye').setAttribute('visibility', 'hidden');
    this.svg.getElementById('small-eye').setAttribute('visibility', 'visible');
    this.svg.getElementById('month').setAttribute('visibility', 'hidden');
},
```

В этом методе удаляется класс анимации прыжка динозавра «**dino-jump**» и возобновляется анимация движения его ног с помощью вызова метода «**unpauseAnimations**». Кроме этого, удаляется in-line стиль «**animationPlayState**», который приостанавливал анимацию прыжка динозавра. Также скрывается большой глаз и рот динозавра, а вместо них отображается его глаз маленького размера.

5. Возобновляется анимация движения облаков.

```javascript
const clouds = this.gameSpace.querySelectorAll('oda-cloud');
clouds.forEach(cloud => {
    cloud.continueMove();
});
```

Для этого в класс «**oda-cloud**» нужно добавить метод «**continueMove**».

```javascript
continueMove(){
    this.style.animationPlayState="running";
},
```

В нем просто продолжается анимация движения облаков, которая была приостановлена ранее.

6. Возобновляется анимация движения птеродактилей.

```javascript
const pterodactyls = this.gameSpace.querySelectorAll('oda-pterodactyl');
pterodactyls.forEach(pterodactyl => {
    pterodactyl.continueMove();
});
```

Для этого в компонент «**oda-pterodactyl**» нужно добавить метод «**continueMove**», но немного другого содержания.

```javascript
continueMove(){
    this.style.animationPlayState="running";
    const svg = this.$core.root.querySelector("svg");
    svg.unpauseAnimations();
},
```

В нем, помимо анимации движения птеродактиля, возобновляется также и анимация взмахов его крыльев с помощью метода «**unpauseAnimations**».

7. Очищается предыдущее значение счетчика очков «**score**», и запускается новый таймер для их увелечения на единицу через каждые 100 миллисекунд.

```javascript
this.score = 0;
this.timerID = setInterval(() => {
    this.score++;
}, 100);
```

8. Удаляется обработчик нажатия клавиш продолжения игры.

```javascript
this.unlisten('keyup', 'continueGame', {target: document});
```

9. Вновь регистрируется обработчик «**dinoJump**» для возможности выполнения прыжков динозавром при нажатии на клавишу пробела.

```javascript
this.listen('keydown', 'dinoJump', {target: document});
```

10. Запускается метод проверки столкновения динозавра с кактусами «**checkDino**» на следующем кадре анимации с помощью функции «**requestAnimationFrame**».

```javascript
 requestAnimationFrame(this.checkDino.bind(this));
```

В результате это пользователь получает возможность заново начать игру и улучшить свой предыдущий результат.

![![Продолжение игры](learn\images\my-first-component\continue-game-window.png "Продолжение игры")

Какой же бег по пустыне, полной опасных кактусов и птеродактелей, да без музыки?

Во время игры можно предусмотреть проигрывание музыкальной композиции группы T-Rex «**Get It On**».

Для этого нужно создать папку «**audio**» и поместить в нее музыкальный файл в формате «**mp3**» с именем «**t-rex-get-it-on.mp3**».

Для его проигрывания к компоненту «**oda-dino**» следует добавить свойство «**audio**» и проинициализировать его в хуке «**ready**» следующим образом:

```javascript
props: {
    svg: {},
    audio: {},
},
ready() {
    this.audio = new Audio('./audio/t-rex-get-it-on.mp3');
    this.audio.volume = .8;
    this.audio.loop = true;
    this.audio.play();
},
```

В результате этого музыкальная композиция начнет сразу звучать после загрузки игры.

В момент столкновения динозавра с кактусом ее проигрывание нужно приостановить. Для этого в методе «**stopMove**» компонента «**oda-dino**» достаточно вызвать метод «**pause**» у объекта «**audio**».

```javascript
stopMove() {
    this.audio.pause();
    this.style.animationPlayState="paused";
    this.svg.pauseAnimations();
    this.svg.getElementById('big-eye').setAttribute('visibility', 'visible');
    this.svg.getElementById('small-eye').setAttribute('visibility', 'hidden');
    this.svg.getElementById('month').setAttribute('visibility', 'visible');
},
```

Чтобы продолжить проигрывать эту композицию с возобновлением игры, в методе «**continueMove**» динозавра у объекта «**audio**» нужно опять вызвать метод «**play**».

```javascript
continueMove() {
    this.audio.play();
    this.classList.remove("dino-jump");
    this.svg.unpauseAnimations();
    this.style.animationPlayState=null;
    this.svg.getElementById('big-eye').setAttribute('visibility', 'hidden');
    this.svg.getElementById('small-eye').setAttribute('visibility', 'visible');
    this.svg.getElementById('month').setAttribute('visibility', 'hidden');
}
```

В результате этого пользователь, играя в игру, сможет насладиться легендарным хитом группы «**T-Rex**» «**Get It On**».

![Давай займемся любовью](learn\images\my-first-component\get-it-on.jpg "Давай займемся любовью")
