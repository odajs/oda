
Немногие знают, что в браузере «**Google Chrome**» есть оригинальная игра про динозавра, которая становится доступной пользователю при потере соединения с сетью Интернет.

![Потеря соединения](learn\images\my-first-component\my-first-component1.png "Потеря соединения")

Эту игру можно запустить и в online режиме, указав в строке адреса браузера служебную ссылку **chrome://dino**.

![Онлайн запуск игры](learn\images\my-first-component\my-first-component2.png "Запуск игры в режиме online")

Эта игра имеет кодовое название «**Project Bolan**», что само по себе является отсылкой к Марку Болану, покойному солисту рок-группы 70-х годов «**T-Rex**».

![Солист группы T-Rex](learn\images\my-first-component\MarkBolan.jpeg "Марк Болан")

Его творчество оказало большое влияние на множество музыкантов и даже на целые музыкальные направления, такие как панк-рок и брит-поп. Даже Виктор Цой написал песню под названием «**Посвящение Марку Болану**» в честь этого  музыканта.

По словам дизайнера браузера Chrome Себастьяна Габриэля, это игра возвращает пользователей в «**доисторические времена**», когда еще не было повсеместного доступа к сети Интернет, а про сети WI-FI и мобильный Интернет тогда еще никто ничего не слышал.

Сама по себе игра представляет собой одинокого тираннозавра, который оказался посреди пустыни. Он бежит, преодолевая препятствия в виде кактусов и птеродактилей.

![Геймплей игры](learn\images\my-first-component\my-first-component3.png "Геймплей игры")

Цель игры – набрать как можно больше очков, справляясь с увеличивающейся скоростью движения кактусов.
Элементы управления игры достаточно просты. Если нажать клавишу «Пробел» или «Стрелка вверх», то динозавр прыгает через препятствие.

Давайте попробуем реализовать эту игру, с использованием графических примитивы SVG-графики и возможностей фреймворка «**ODA**» для управления ими.

Для этого сначала создадим индексный файл с именем «**index.html**», указав в его теле только один тэг «**oda-game**», который и будет хостом будущего компонента.


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

Этот файл необходимо разместить в папке «css» и задать в нем следующие css-переменные.

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

Здесь предусмотрено, что кактусы и фон игры будут отображаться серым цветом «**grey**», а непосредственная область игры будет темной («**--dark-color: #121212**»). Динозавр, облака и птеродактили на этой темной области будут отображаться более светлым цветом («**--base-color: #e2e2e2**»).

Все эти переменные можно будет использовать для стилизации элементов внутри теневого дерева всех остальных компонентов, задавая общий дизайн игры.

2. «**oda.js**» – файл c библиотекой самого фреймворка **ODA**.

```javascript
<script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/oda.js"></script>
```

3. «**oda-game.js**» – файл с js-кодом самого компонента «**oda-game**».

Если отобразить этот файл в браузере, то его окно останется пустым, так как сам компонента «**oda-game**» еще не определен, и браузер не знает, как отображать тэг <oda-game></oda-game>.

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
<h1 id="score">{{score || '0'}}</h1>
```

2. Элемент вывода текущего счета игры с идентификатором «**id="score"**».

```html
<h1 id="score">{{score || '0'}}</h1>
```

В нем используется интерполяционная подстановка «**Mustache**», которая будет автоматически изменять текст в этом элементе при любом изменении счета игра «**score**».

3. Рабочая область игры («**id="game-space"**»), в которой будет В ней динамически создаваться все остальные элементы игры.

```html
<div id="game-space" ref="game-space">
```

 Для доступа к этой области создается ссылка не нее с помощью директивы **ref**, а для ее стилизации предусмотрен одноименный идентификатор «**id**».

4. Сообщение о начале или об окончании игры («**id="message"**»).

```html
<h1 id="message" ~show="showMessage">{{message}}</h1>
```

С помощью  этого элемента будет отображаться сообщение пользователю о начале или об окончании игры.

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

В результате этого начальное окно игры будет иметь следующий вид:

![Начальное окно игры](learn\images\my-first-component\game-window.png "Начальное окно игры")

Для стилизации всех элементов игры в разделе «**style**» шаблона компонента «**oda-game**» были заданы следующие css-правила:

1. «**host**» – стиль самого компонента.

```css
 :host {
    height: 100%;
    width: 100%;
    position: absolute;
    background-color: var(--header-background-color);
}
```

Это правило задает серую область, которая занимает полностью все тело документа.

2. «**#game-space**» – стиль рабочей области игры.

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

Он задает начальное расположение динозавра с помощью сss-переменной «**--dino-top**», которая имеет значение 314 пикселей. Именно на эту величину будут смещена начальная позиция динозавра относительно рабочей области игры.

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

С использованием этих стилей начальное окно игры будет отображаться следующим образом:

![Промежуточное окно игры](learn\images\my-first-component\no-score-window.png "Промежуточное окно игры")

Для отображения значения счетчика набранных очков и надписи о начале игры в компоненте «**oda-game**» необходимо предусмотреть раздел  «**props**» со следующими свойствами:

```javascript
props: {
    score: 0,
    message: 'Для начала игры нажмите пробел',
    showMessage: true,
},
```

Эти свойства имеют следующее назначение:

1. «**score**» – свойство для хранения текущего количества набранных очков.
1. «**message**» – свойство с текстом сообщения пользователю.
1. «**showMessage**» – флаг, определяющий необходимость отображения текста сообщения.

В результате этого надпись и начальное нулевое количество набранных очков будет автоматически отображаться в области игры благодаря использованию для этого подстановки «**{{Mustache}}**».

![Окно игры с надписью и очками](learn\images\my-first-component\no-score-window.png "Окно игры с надписью и очками")

Некоторые вспомогательные свойства компонента можно задать с помощью геттеров. К таким свойствам относятся:

1. «**dino**» – ссылка на компонент динозавра «**oda-dino**».

```javascript
get dino() {
    return this.$refs.dino;
},
```

2. «**gameSpace**» – ссылка на рабочую область игры, в которую будут добавляться все остальные элементы игры.

```javascript
get gameSpace() {
    return this.$refs["game-space"];
},
```
Для того, чтобы в области игры отобразить динозавра создадим в папке «**js**» файл «**oda-dino.js**» с компонентом «**oda-dino**».

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

Пока в этом компоненте находится лишь один раздел шаблона «**template**» с  SVG-примитивом динозавра и с css-стилями его отображения.

Графический примитив динозавра состоит из его тела,

```html
<svg version="1.1" baseProfile="full" width="128" height="137" xmlns="http://www.w3.org/2000/svg">
    <!-- Тело -->
    <path d=" M0 48, h7, v12, h6, v7, h6, v6, h13, v-6, h7, v-7, h9, v-6, h10, v-6, h6, v-42, h7, v-6, h51, v6, h6, v29, h-32, v6, h19, v7, h-25, v12, h13, v13, h-7, v-6, h-6, v22, h-7, v10, h-6, v6, h-6, v7, h-45, v-7, h-7, v-6, h-6, v-7, h-6, v-6, h-7, z " stroke="transparent" id="body"/>
</svg>
```

глаза,

```html
<!--Глаз маленький-->
<rect x="77" y="9" fill="white" height="7" width="6" id="small-eye"/>
```

рта и двух пар ног, каждая из которых может находится в одном из двух положений.

![Расположение ног](learn\images\my-first-component\dino1.png "Первое расположение ног динозавра")

В первом положении одна нога поднята вверх, а вторая опущена вниз.

![Расположение ног](learn\images\my-first-component\dino2.png "Второе расположение ног динозавра")

Во втором положении первая нога опущена вниз, а вторая поднята вверх.

Использование двух положений ног позволяет задать анимационный эффект бега динозавра. Для этого достаточно к тегу каждой ноги добавить специальный элемент **animate**, которые будет поочередно скрывать или отображать определенную ногу динозавра через заданный временной интервал.

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

Изначально они отображаться не будут из-за того, что у них свойство «**visibility**» установлено в значение «**hidden**».

Рот и большой глаз будут появляться только в момент столкновения динозавра с кактусом, создавая эффект удивления или испуга на его лице.

![Динозавр с большим глазом и закрытым ртом](learn\images\my-first-component\dino3.png "Динозавр с большим глазом и закрытым ртом")

Для того, чтобы компонент динозавра отобразился в области игры необходимо подключить файл с его модулем к файлу с кодом игры «**oda-game.js**» следующим образом:

```javascript
import "./oda-dino.js";
```

В результате этого в рабочей области отобразиться SVG-образ динозавра с анимацией движения его ног.

![Окно с динозавром](learn\images\my-first-component\dino-window.png "Окно с динозавром")

Однако игра на данном этапе не будет реагировать ни на какие действия пользователя. Для ее начала добавим в хуке «**ready**» компонента «**oda-game**» слушателя события отпускания клавиши клавиатуры с помощью предопределенного метода «**listen**».

```javascript
ready() {
    this.listen('keyup', 'startGame', {target: document});
},
```

В нем в качестве обработчика события «**keyup**» регистрируется метод компонента «**startGame**», который можно задать следующим образом:

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

Данный метод проверяет, какую клавишу нажал и отпустил пользователь в данный момент.

Если была нажата любая клавиша кроме пробела, то будет происходить сразу выход из этого метода.

Если же была нажата клавиша пробела, то при ее отпускании будут выполняться следующие действия:

 1. Скрывается надпись «**Для начала игры нажмите пробел**» присвоением свойству «**showMessage**» значения «**false**»

 ```javascript
    this.showMessage = false;
```

 2. Текст надписи заменяется сообщением «**Game Over**», которое будет появляться при столкновении динозавра с кактусом.

```javascript
    this.message = "Game Over";
```

3. Создается таймер, который будет каждые 100 миллисекунд увеличивать счетчик набранных очков на единицу.

```javascript
this.timerID = setInterval(() => {
    this.score++;
}, 100);
```

Для остановки этого таймера в момент окончания игры его идентификатор первоначально необходимо сохранить. Для этого в компоненте «**oda-game**» предусмотрим специальное свойство «**timerID**».

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

5. Регистрируется обработчик нажатия клавиш для выполнения прыжка динозавра с помощью предопределенного метода «**listen**».

```javascript
this.listen('keydown', 'dinoJump', {target: document});
```

Сам обработчик нужно добавить в компонент «**oda-dino**» в виде метода «**dinoJump**».

```javascript
dinoJump(e) {
    if (e.code === 'Space') {
        this.dino.jump();
    }
},
```

Этот метод вызывается лишь метод «**jump**» компонента «**oda-dino**» при условии того, что пользователь нажал клавишу пробела «**Space**».

Для создании эффекта прыжка в разделе «**style**» компонента «**oda-dino**» необходимо добавить следующий анимационный кадр:

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

1. Начальные положение («**--dino-top: 314px**»).

1. Промежуточное положение («**--dino-max-top: 20px**»).

1. Конечное положение («**--dino-top: 314px**»).

Сама анимация прыжка задается с помощью css-класса «**dino-jump**».

Для его использования в компоненте «**oda-dino**» нужно определить функция-псевдокласс «**:host()**», которую нужно добавить в раздел «**style**» вместе с предыдущим ключевым кадром.

```css
:host(.dino-jump) {
    animation-name: dino-jump;
    animation-duration: 1s;
    animation-iteration-count: 1;
    animation-timing-function: ease-out;
}
```
В этой css-функции указывается  сам ключевой кадр прыжка «**dino-jump**» и определяется его продолжительность в 1 секунду.

Это функция будет применяться к компоненту лишь в том случае, когда у него будет задан css-класс с именем «**dino-jump**». Это можно сделать в отдельном методе «**jump**» компонента «**oda-dino**».

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

В нем, кроме добавления css-класса с анимацией прыжка дополнительно приостанавливается анимация движения его ног. Для этого используется специальный метод «**pauseAnimations**» элемента SVG-графики.

После окончания анимации прыжка предусмотрена функция обратного вызова «**onfinish**», при срабатывании которой у тэга компонента удаляется ранее добавленный css-класс «**dino-jump**» и возобновляется анимация движения его ног с помощью метода «**unpauseAnimations**».

Для более быстрого обращения к SVG-примитиву динозавра в его компоненте можно предусмотреть вспомогательное свойство «**svg**» и проинициализировать его в хуке «**attached**» следующим образом:

```javascript
props: {
    svg: {},
},
attached() {
    this.svg = this.$core.root.querySelector("svg");
},
```

В результате этого при первом нажатии и отпускании клавиши пробела исчезнет надпись с сообщением о начале игры и запуститься счетчик набранных очков.

![Начало игры](learn\images\my-first-component\start-game-window.png "Начало игры")

При следующих нажатиях клавиши пробела на клавиатуре динозавр будет подпрыгивать вверх.

![Прыжок динозавра](learn\images\my-first-component\jump-dino-window.png "Прыжок динозавра")

Для отображения в игре модели кактуса добавим к ней новый компонент «**oda-cactus**». Для этого создадим в папке «**js**» файл с именем«**oda-cactus.js**» и поместим в него следующий код:

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

Данный компонент содержит графический примитив кактуса, который имеет следующий вид:

![Графический примитив кактуса](learn\images\my-first-component\cactus.png "Кактус")

Он задается SVG-элементом с использованием только одного тэга «**path**».

```html
<svg version="1.1" baseProfile="full" width="74" height="147" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 41, h3,v-3, h10, v3, h3, v42, h10, v-80, h3, v-3, h16, v3, h3, v80, h10, v-48, h3, v-3, h10, v3, h3, v48, h-3, v3, h-4, v3, h-3, v4, h-3, v3, h-13, v51, h-22, v-48, h-16, v-3, h-3, v-3, h-4, v-4, h-3, z"/>
</svg>
```

Анимация движения кактуса от правой границы игры до левой задает с помощью следующего ключевого кадра.

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

Данный ключевой кадр нужно указать в псевдоклассе «**:host**», который будет применяться к хосту компонента сразу же после его создания.

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

В этом css-правиле продолжительность анимации движения кактуса задается равной 3 секундам.

Для отображения кактуса в области игры нужно первначально подключить его модуль к файлу компонента «**oda-game**» следующим образом:

```javascript
import "./oda-dino.js";
import "./oda-cactus.js";
```

Без этого браузер не будет знать как отображать тэг «**oda-cactus**».

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

При подключении этого модуля и указании тега «**oda-cactus**» в индексном файле игры кактус появится и начнет двигаться справа налево до полного выхода за левую границу игры.

![Графический примитив кактуса](learn\images\my-first-component\cactus-move-window.png "Кактус")

Однако после окончания анимации он появится у левой границы опять.

Для того, чтобы после выхода за границу кактус удалялся бы автоматически в его компоненте нужно предусмотреть специальную функцию обратного вызова, которая будет выполняться сразу в момент окончания анимации. Для этого в хуке «**attached**» компонента «**oda-cactus**» нужно записать следующий код:

```javascript
attached() {
    this.getAnimations().forEach((anim, i, arr) => {
        anim.onfinish = () => {
            this.remove();
        };
    });
},
```

В нем предусмотрено удаление кактуса сразу же после завершения его анимации предопределенным js-методом «**remove**».

В результате этого кактус после выхода за левую границу больше появляться не будет.

![Удаление кактуса](learn\images\my-first-component\dino-window.png "Кактус")

Аналогично отображаются и другие элементы игры, такие как облака и птеродактили.

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

Для отображения облаков к компоненту «**oda-game**» необходимо подключить js-модуль «**oda-cloud**» следующим образом:

```javascript
import "./oda-dino.js";
import "./oda-cactus.js";
import "./oda-cloud.js";
```

Чтобы протестировать этот компонент, можно в компоненте «**oda-game**» задать тэг «**oda-cloud**».

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

В результате этого в области игры должно появиться облако, которое будет двигаться от правой границы до левой, а после захода за левую границу оно должно удалятся автоматически.

![Движение облака](learn\images\my-first-component\cloud-move-window2.png "Движение облака")

Кроме этого, при многократной загрузке игры облако будет появляться на разной высоте.

![Разная высота облака](learn\images\my-first-component\cloud-move-window.png "Разная высота облака")

Аналогично задается компонент птеродактиля «**oda-pterodactyl**». Для этого нужно создать в папку «**js**» новый файл «**oda-pterodactyl.js**» и добавить к в него следующий код:

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

В нем задается графический примитив, который включает в себя тело птеродактиля и два крыла, первое из которых поднято вверх

![Графический примитив птеродактиля](learn\images\my-first-component\pterodactyl1.png "Птеродактиль")

, а второе опущено вниз.

![Графический примитив птеродактиля](learn\images\my-first-component\pterodactyl2.png "Птеродактиль")

Для создания эффекта взмахов крыльев к ним был добавлен тег **animate**, который будет поочередно скрывать и отображать определенное крыло через заданный временной интервал.

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

В отличие от облаков птеродактили будет появляться на случайной высоте в диапазоне от 10 до 100 пикселей, чтобы не задевать своими крыльями динозавра.

```javascript
this.setPosition(10,100);
```

![Перемещение птеродактиля](learn\images\my-first-component\pterodactyl-move-window.png.png "Перемещение птеродактиля")

Не забудьте подключить модуль этого компонента к файлу «**oda-game**».

```javascript
import "./oda-dino.js";
import "./oda-cactus.js";
import "./oda-cloud.js";
import "./oda-pterodactyl.js";
```
6. Запускается метода «**checkDino**» со приходом следующего кадра анимации, в котором динамически будут создаваться все остальные элементы игры и определяться факт столкновения динозавра с кактусом.

```javascript
 requestAnimationFrame(this.checkDino.bind(this));
```

Для привязки к этому метод контекста текущего компонента необходимо обязательно использовать метод «**bind**». В противном случае указатель «**this**» внутри метода «**checkDino**» будет иметь неопределенное значение «**undefined**».


Для этого будет использовать образы четырех основных элементов игры:

1. Тиранозавра.
2. Кактуса.
3. Облака.
4. Птеродактиля.

Графический примитив динозавра состоит из его тела,

```html
<svg version="1.1" baseProfile="full" width="128" height="137" xmlns="http://www.w3.org/2000/svg">
    <!-- Тело -->
    <path d=" M0 48, h7, v12, h6, v7, h6, v6, h13, v-6, h7, v-7, h9, v-6, h10, v-6, h6, v-42, h7, v-6, h51, v6, h6, v29, h-32, v6, h19, v7, h-25, v12, h13, v13, h-7, v-6, h-6, v22, h-7, v10, h-6, v6, h-6, v7, h-45, v-7, h-7, v-6, h-6, v-7, h-6, v-6, h-7, z " stroke="transparent" id="body"/>
</svg>
```

глаза,

```html
<!--Глаз маленький-->
<rect x="77" y="9" fill="white" height="7" width="6" id="small-eye"/>
```

рта и двух пар ног, каждая из которых может находится в одном из двух положений.

![Расположение ног](learn\images\my-first-component\dino1.png "Первое расположение ног динозавра")

В первом положении одна нога поднята вверх, а вторая опущена вниз.

![Расположение ног](learn\images\my-first-component\dino2.png "Второе расположение ног динозавра")

Во втором положении первая нога опущена вниз, а вторая поднята вверх.

Использование двух положений ног позволяет задать анимационный эффект бега динозавра. Для этого достаточно к тегу каждой ноги добавить специальный элемент **animate**, которые будет поочередно скрывать или отображать определенную ногу динозавра через заданный временной интервал.

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

Изначально они отображаться не будут. Для у них свойство **visibility** установлено в значение **hidden**.

Они будет появляться только в момент столкновения динозавра с кактусом, создавая эффект испуга на его лице.

![Динозавр с большим глазом и закрытым ртом](learn\images\my-first-component\dino3.png "Динозавр с большим глазом и закрытым ртом")

Графический примитив кактуса имеет следующий вид:

![Графический примитив кактуса](learn\images\my-first-component\cactus.png "Кактус")

Он задается SVG-элементом с использованием только одного тега «**path**».

```html
<svg version="1.1" baseProfile="full" width="74" height="147" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 41, h3,v-3, h10, v3, h3, v42, h10, v-80, h3, v-3, h16, v3, h3, v80, h10, v-48, h3, v-3, h10, v3, h3, v48, h-3, v3, h-4, v3, h-3, v4, h-3, v3, h-13, v51, h-22, v-48, h-16, v-3, h-3, v-3, h-4, v-4, h-3, z"/>
</svg>
```

Аналогично задается графический примитив облака.

![Графический примитив облака](learn\images\my-first-component\cloud.png "Графический примитив облака")

Графический примитив птеродактиля содержит его тело
и два крыла, первое из которых поднято вверх

![Графический примитив птеродактиля](learn\images\my-first-component\pterodactyl1.png "Птеродактиль")

, а второе опущено вниз.

![Графический примитив птеродактиля](learn\images\my-first-component\pterodactyl2.png "Птеродактиль")

Для создания эффекта взмахов крыльев к ним можно добавить тег **animate**, который будет поочередно скрывать и отображать определенное крыло через заданный временной интервал.

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

Для управления всеми этими SVG-примитивами создадим пользовательские компоненты, использую фреймворк «ODA».

1. Компонент «oda-dino» будет управлять графическим примитивом динозавра.

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

Пока в этом компоненте находится лишь один раздел шаблона **template** с  SVG-примитивом динозавра, с css-стилями отображения его элементов, заданными в подразделе **style**.

Этот компонент динозавра можно записать в файл **oda-dino.js**, и расположить его в папке с именем **js**, в которую будут помещаться все остальные файлы с js-кодом игры в дальнейшем.

2. Компонент кактуса («oda-cactus») содержит только его SVG-примитив и стиль его отображения.

```javascript
ODA({ is: 'oda-cactus',
    template: `
        <style>
            path {
                fill: var(--cactus-color);
            }
        </style>
        <svg version="1.1" baseProfile="full" width="74" height="147" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 41, h3,v-3, h10, v3, h3, v42, h10, v-80, h3, v-3, h16, v3, h3, v80, h10, v-48, h3, v-3, h10, v3, h3, v48, h-3, v3, h-4, v3, h-3, v4, h-3, v3, h-13, v51, h-22, v-48, h-16, v-3, h-3, v-3, h-4, v-4, h-3, z"/>
        </svg>
    `,
})
```

3. Компонент облака «**oda-cloud**» реализован аналогично компоненту кактуса. У него пока тоже задан только SVG-примитив и стиль его отображения.

```javascript
ODA({ is: 'oda-cloud',
    template: `
        <style>
            path,
            rect {
                fill: var(--cloud-color);
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
})
```

4. Компонент птеродактиля «**oda-pterodactyl**» кроме SVG-примитива его тела содержит крылья с эффектом анимации.

```javascript
ODA({ is: 'oda-pterodactyl',
    template: `
        <style>
            path {
                fill: var(--pterodactyl-color);
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
})
```

Для общей стилизации всех этих компонентов в файле **style.css**, расположенном в папке **css**, зададим глобальные css-переменные.

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

Все эти переменные можно будет использовать внутри теневого дерева любого компонента, задавая таким образом общий дизайн игры.

Здесь предусмотрено, что кактусы и фон игры будут отображаться серым цветом, а непосредственная область игры будет темной. Динозавр, облака и птеродактили на этой темной области будут отображаться более светлым цветом.

Все элементы игры будем задавать в общем компоненте с именем «**oda-game**».

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
2. Элемент вывода текущего счета игры с идентификатором id="**score**".

```html
<h1 id="score">{{score || '0'}}</h1>
```

В нем используется интерполяционная подстановка **Mustache**, которая будет автоматически изменять текст в этом элементе при любом изменении счета игра **score**.

3. Рабочая область игры (id="**game-space**").

В ней будут динамически создаваться все остальные элементы игры.

```html
<div id="game-space" ref="game-space">
```

Для доступа к этой области предусмотрена ссылка на нее, которая задается с помощью директивы **ref**.

4. Сообщение о начале или об окончании игры (id="**message**").

```html
<h1 id="message" ~show="showMessage">{{message}}</h1>
```

С помощью  этого элемента будет отображаться сообщение пользователю о начале или об окончании игры.

Текст этого сообщения будет располагаться в свойстве **message** компонента и отображаться с помощью интерполяционной подстановки **Mustache** только тогда, когда сопутствующее свойство **showMessage** будет иметь значение **true**. В противном случае это сообщение будет автоматически  скрыто директивой фреймворка **~show**.

5. Сам динозавр в виде компонента «**oda-dino**»

```html
<oda-dino ref="dino"></oda-dino>
```

Для доступа к этому элементу задается ссылка на него с помощью директивы **ref**.

6. Элемент div с идентификатором «**horizon**».

```html
<div id="horizon"></div>
```

С его помощью будет схематично отображаться горизонт.

В результате этого начальное окно игры будет иметь следующий вид:

![Начальное окно игры](learn\images\my-first-component\game-window.png "Начальное окно игры")

Для стилизации всех элементов игры в разделе **style** шаблона компонента «**oda-game**» заданы следующие css-правила:

1. «**host**» – стиль самого компонента.

```css
 :host {
    height: 100%;
    width: 100%;
    position: absolute;
    background-color: var(--header-background-color);
}
```

Это правило задает серую область, которая занимает полностью все тело документа.

2. «**#game-space**» – стиль рабочей области игры.

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

Он задает начальное расположение динозавра с помощью сss-переменной «**--dino-top**», которая имеет значение 314 пикселей. Именно на эту величину будут смещен изначально динозавр относительно рабочей области игры.

7. Стиль отображения горизонта «#horizon».

```css
#horizon {
    position: absolute;
    top: 435px;
    width: 100%;
    height: 3px;
    background-color: var(--horizon-color);
}
```

Он определяет расположение и цвет горизонта в области игры.

Для отображения всех этих элементов достаточно создать файл с именем «**index.html**», указав в его теле только один тег «**oda-game**», который и будет хостом этого компонента.

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

Однако к  этому HTML-документу необходимо будет подключить следующие файлы:

1. «**style.css**» – файл со глобальными css-переменными для стилизации всех элементов игры.
1. «**oda.js**» – файл c библиотекой самого фреймворка **ODA** с помощью on-line ссылки не него.
1. «**oda-game.js**» – файл с js-кодом самого компонента «**oda-game**».

При открытии этого файла в браузере Вы увидите начальное окно игры.

![Начальное окно игры](learn\images\my-first-component\game-window.png "Начальное окно игры")

Элементы нашего первого компонента в этом окне не будет выполнять никаких действий. Чтобы начала игру придется существенно расширить их функциональные возможности.

Для этого в разделе «**props**» компонента «**oda-game**» зададим следующие свойства:

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

Здесь,

1. «**timerID**» – свойство, предназначенное для хранения уникального идентификатора счетчика очков игры.
1. «**score**» – свойство для хранения текущего количества набранных очков.
1. «**message**» – свойство с сообщением для пользователя.
1. «**showMessage**» – флаг, определяющий отображение предыдущего свойства.
1. «**nextCloud**» счетчик кадров анимаций до появления следующего облака.
1. «**nextCactus**» счетчик кадров анимаций до появления следующего кактуса.
1. «**nextPterodactyl**» счетчик кадров анимаций до появления следующего птеродактиля.

Счетчики появления кактусов и облаков имеют начальные нулевые значения, в результате чего эти элементы появятся сразу после начала игры. А счетчик появления птеродактиля задан равным 50. В результате этого он появится первый раз с небольшой задержкой.

Некоторые свойства компонента выполнены с помощью геттеров. К таким свойствам относятся:

1. «**dino**» – ссылка на компонент динозавра «**oda-dino**».

```javascript
get dino() {
    return this.$refs.dino;
}
```

2. «**gameSpace**» – ссылка на рабочую область игры, в которой будет находиться все остальные компоненты.

```javascript
get gameSpace() {
    return this.$refs["game-space"];
},
```

Для начала игры необходимо зарегистрировать обработчик, который будет срабатывать при отпускании пользователем любой клавиши клавиатуры. Для этого в хуке «**ready**» компонента «**oda-game**» вызовем предопределенный метод «**listen**».

```javascript
ready() {
    this.listen('keyup', 'startGame', {target: document});
}
```

В нем в качестве обработчика события регистрируется метод компонента «**startGame**», который и будет полнятся при наступлении события «**keyup**».

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

Данный метод проверяет, какую клавишу нажал и отпустил пользователь в данный момент.

Если была нажат не пробел, то сразу же происходит выход из этого метода.

 В противном случае выполняются следующие действия:

 1. Скрывается надпись «**Для начала игры нажмите пробел**» присвоением свойству «**showMessage**» значения «**false**»

 2. Текст надписи заменяется сообщением «**Game Over**», которое будет появляться при столкновении динозавра с кактусом.

```javascript
    this.showMessage = false;
    this.message = "Game Over";
```

3. Создается таймер, который будет каждые 100 миллисекунд увеличивать счетчик набранных очков на единицу.

```javascript
this.timerID = setInterval(() => {
    this.score++;
}, 100);
```

Для остановки таймера в дальнейшем его идентификатор сохраняется в свойстве «**timerID**» нашего компонента.

4. Удаляется обработчик начала игры **startGame** с помощью предопределенного метода «**unlisten**».

```javascript
this.unlisten('keyup', 'startGame', {target: document});
```

5. Регистрируется обработчик нажатия клавиш для выполнения прыжка динозавра «**dinoJump**» с помощью предопределенного метода «**listen**».

```javascript
this.listen('keydown', 'dinoJump', {target: document});
```

Обработчик нажатия «**dinoJump**» вызывает метод «**jump**» компонента «**oda-dino**» только если была нажата клавиша пробела «**Space**».

```javascript
    dinoJump(e) {
        if (e.code === 'Space') {
            this.dino.jump();
        }
    },
```

6. Запускается метода «**checkDino**» со приходом следующего кадра анимации, в котором динамически будут создаваться все остальные элементы игры и определяться факт столкновения динозавра с кактусом.

```javascript
 requestAnimationFrame(this.checkDino.bind(this));
```

Для привязки к этому метод контекста текущего компонента необходимо обязательно использовать метод «**bind**». В противном случае указатель «**this**» внутри метода «**checkDino**» будет иметь неопределенное значение «**undefined**».

Метод «**checkDino**» в компоненте «**oda-game**» можно задать следующим образом:

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
}
```

В нем создаются:

1. **Облака** с помощью метода «**createCloud**».

```javascript
createCloud() {
    if (this.nextCloud === 0) {
        this.gameSpace.append(document.createElement('oda-cloud'));
        this.nextCloud = Math.floor(20 + Math.random() * (150 + 1 - 20));
    }
    this.nextCloud--;
},
```

2. **Кактусы** с помощью метода «**createCactus**».

```javascript
    createCactus() {
        if (this.nextCactus === 0) {
            this.gameSpace.append(document.createElement('oda-cactus'));
            this.nextCactus = Math.floor(100 + Math.random() * (150 + 1 - 100));
        }
        this.nextCactus--;
    },
```

3. **Птеродактили** с помощью метода «**createCactus**».

```javascript
createPterodactyl() {
    if (this.nextPterodactyl === 0) {
        this.gameSpace.append(document.createElement('oda-pterodactyl'));
        this.nextPterodactyl = Math.floor(150 + Math.random() * (200 + 1 - 150));
    }
    this.nextPterodactyl--;
}
```

Все эти методы нужно добавить в компонент «**oda-game**».

В каждом из них соответствующие элементы создаются через определенный интервал с небольшой случайной составляющей. Для этого каждый такт анимации счетчики «**nextCloud**», «**nextCactus**» и «**nextPterodactyl**» уменьшаются на 1. Как только они достигнут нулевого значения, то запуститься механизм создания нового элемента (облака, кактуса или птеродактиль) и будет сгенерировано следующее случайное значение, через которое они должны будут появиться в следующий раз. В результате этого все элементы в игре будет создаваться через небольшой интервал друг после друга.

В конце метода «**checkDino**» проверяется пересечение динозавра со всеми кактусами с помощью метода «**isIntersection**» класса «**oda-dino**».

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
}
```

В нем находятся текущие координаты кактуса и динозавра с помощью метода «**getBoundingClientRect**», а затем определяется фак пересечения полигонов тела динозавра «**dino-body**» и его ног с полигоном кактуса.

Для этого первоначально все элементы «**path**» SVG-примитива динозавра и кактуса преобразуются в полигоны внутри их классов с помощью хука **attached**, который вызывается автоматически при присоединении компонента к DOM документа.

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

В этом хуке к компоненту динозавра добавляется свойство «**polygons**», в котором записываются полигоны его тела и всех ног под уникальными именами, так чтобы их было быстрее найти в дальнейшем.

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

В этих хуках для преобразования SVG-элементов «**path**» в прямолинейные полигоны используются функции «**createPolygon**», которая задается отдельно в js-модуле «**utils.js**».

```javascript
export function createPolygon(svg, selector) {
    return pathToPolygon(svg.querySelector(selector));
}
```

Она находит соответствующий элемент у переданного SVG-примитива и вызывает функцию преобразования **pathToPolygon**, которая задается в том же модуле следующим образом:

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

Эта функция используют для преобразования специальный класс точек «**Point**».

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

фактически функция «**pathToPolygon**» преобразует последовательность относительных точек, в последовательность абсолютных точек каждого элемента SVG-пути «path».

Для нахождения пересечения двух полигонов используется функция «**intersectPolygonPolygon**»

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

Она использует функцию «**intersectionLinePolygon**», которая находит пересечение полигона с одной линией, заданной с помощью двух точек начала и конца.

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

Эта функция в свою очередь использует функцию «**intersectionLineLine**», для нахождения пересечения линии с линией.

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

Именно эта функции в итоге и определяет пересекается ли динозавр с кактусом или нет.

Если пересечение будет найдено, то будет вызван метод «**gameOver**» компонента «**oda-game**». В противном случае проверка пересечения динозавра с кактусом продолжится на следующем кадре анимации.

В методе «**gameOver**» выполняются следующие действия:

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

1. Останавливается таймер счетчика набранных очков с использованием ранее сохраненного идентификатора в свойстве компонента **timerID**.

1. Останавливается анимация динозавра вызовом метода «**stopMove**» компонента «**oda-dino**» заданием у свойства **animationPlayState** значения **paused**.

```javascript
stopMove(){
    this.style.animationPlayState="paused";
    this.svg.pauseAnimations();
    this.svg.getElementById('big-eye').setAttribute('visibility', 'visible');
    this.svg.getElementById('small-eye').setAttribute('visibility', 'hidden');
    this.svg.getElementById('month').setAttribute('visibility', 'visible');
}
```

 Кроме этого, приостанавливается анимация движения ног динозавра с помощью метода **pauseAnimations** элемента **svg**, а также прячется маленький глаз и отображаются рот и его большой глаз  с помощью свойства «**visibility**».

У птеродактиля во время завершения игры отключается только эффект движения и взмахи крыльев.

```javascript
stopMove(){
    this.style.animationPlayState="paused";
    const svg = this.$core.root.querySelector("svg");
    svg.pauseAnimations();
},
```

У кактусов и облаков отключается только анимация эффекта движения.

```javascript
stopMove(){
    this.style.animationPlayState="paused";
}
```

Движение у всех этих элементов задается помощью ключевых кадров. Для этого, их необходимо задать в разделе «**style**» шаблона каждого компонента.

Анимационный кадр прыжка динозавра задается следующим образом:

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

Здесь используются css-переменные, которые задают координаты расположения динозавра по высоте:

1. Начальные (**--dino-top: 314px**).

1. Промежуточное (**--dino-max-top: 20px**).

1. Конечные (**--dino-top: 314px**).

Сама анимация прыжка задается с помощью css-класса **dino-jump**.

```css
:host(.dino-jump) {
    animation-name: dino-jump;
    animation-duration: 1s;
    animation-iteration-count: 1;
    animation-timing-function: ease-out;
}
```

В нем используется ключевой кадр «**dino-jump**» и указывается время прыжка в 1 секунду.

Данный класс нужно добавить к хосту компонента «**oda-dino**» в момент прыжка. Для этого нужно задать в классе динозавра метод «**jump**».

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

В нем, кроме добавления css-класса «**dino-jump**», во время прыжка приостанавливается анимация ног динозавра.

После окончания прыжка удаляется css-класс «**dino-jump**» и у динозавра возобновляется анимация ног. Все это предусмотрено в колбэке «**onfinish**».

Аналогично задается анимация движения кактусов, облаков и птеродактилей.

Для этого ключевые кадры задают изменение позиции элементов не по высоте, а по левой координате. Например, для облаков ключевой кадр будет объявлен следующим образом:

```javascript
@keyframes move {
    from {
        left: 100%;
    }
    to {
        left: -150px;
    }
}
```
Ключевые кадры движения кактусов и птеродактилей будут одинаковыми.

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

Отрицательные значения левой координаты при завершении движения определяется тем, что тело всех элементов должно зайти за левую границу области игры, и только после этого эти элементы должны быть удалены.

Для начала движения у всех этих элементов задается псевдо-класс «**host**», который запускает анимацию сразу же после их создания
,
Например, движение облаков облаков начнется справа налево и будет продолжаться 6 секунд.

```javascript
:host {
    position: absolute;
    z-index: 100;
    animation-name: move;
    animation-duration: 6s;
    animation-iteration-count: 1;
    animation-timing-function: linear;
}
```

Анимация птеродактилей будет длиться 3 секунды.

```javascript
:host {
    position: absolute;
    z-index: 200;
    animation-name: move;
    animation-duration: 3s;
    animation-iteration-count: 1;
    animation-timing-function: linear;
}
```

Кроме этого, птеродактили будут располагаться перед облаками, так как у них CSS-свойство «**z-index**» задается с большим значением.

В отличие от птеродактилей у кактусов высота расположения будет всегда оставаться постоянной. Поэтому она сразу задается в псевдо-классе «**host**» компонента «**oda-cactus**» равной 301 пикселю.

```javascript
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

Позиция появления птеродактиля определяется случайным образом в диапазоне от 10 до 100 пикселей в момент его создания в хуке «**attached**» с помощью метода «**setPosition**».

```javascript
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
```

Кроме этого, в колбэке окончания анимации  «**onfinish**» предусмотрено автоматическое удаление птеродактиля,  когда его тело полностью выйдет за левую границу игры.

Аналогично в хуке «**attached**» предусмотрен создание облаков, вертикальная позиция расположения которых то же определяется случайным образом но в несколько другом диапазоне от 20 до 150 пикселей.

```javascript
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
```

После захода за левую границу области игры облака так же, как и птеродактили с кактусами должны быть удалены. Для этого в этом хуке тоже предусмотрен колбэк  «**onfinish**».

Если пользователь захочет продолжить игру после столкновения динозавра с кактусом, то он может повторно нажать на клавишу пробела.

Для этого в методе «**GaveOver**» добавлен слушатель

```javascript
this.listen('keyup', 'continueGame', {target: document});
```

, который при отпускание любой клавиши вызывает метод продолжения игры «**continueGame**».

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
}
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

4. Возобновляется анимация движения ног динозавра методом **continueMove**.

```javascript
this.dino.continueMove();
```

5. Возобновляется анимация движения облаков.

```javascript
const clouds = this.gameSpace.querySelectorAll('oda-cloud');
clouds.forEach(cloud => {
    cloud.continueMove();
});

Для этого используется метод «**continueMove**» компонента «**oda-cloud**», который задается следующим образом:

```javascript
continueMove(){
    this.style.animationPlayState="running";
},
```

В нем просто возобновляется приостановленная анимация движения облака.

6. Возобновляется анимация движения птеродактилей.

```javascript
const pterodactyls = this.gameSpace.querySelectorAll('oda-pterodactyl');
pterodactyls.forEach(pterodactyl => {
    pterodactyl.continueMove();
});
```

Для этого также используется метод «**continueMove**», но уже компонента «**oda-pterodactyl**».

```javascript
continueMove(){
    this.style.animationPlayState="running";
    const svg = this.$core.root.querySelector("svg");
    svg.unpauseAnimations();
},
```
Кроме анимации движения птеродактилей в этом методе возобновляется и анимация взмахов их крыльев.

7. Очищается предыдущее значение счетчика очков **score**, и запускается новый таймер для их увелечения на единицу через каждые 100 миллисекунд.

```javascript
this.score = 0;
this.timerID = setInterval(() => {
    this.score++;
}, 100);
```

8. Удаляется обработчик нажатия клавиш продолжения игры «**continueGameKeyUp**».

```javascript
this.unlisten('keyup', 'continueGame', {target: document});
```

9. Регистрируется обработчик нажатия клавиш для выполнения прыжка тиранозавром «**dinoJumpKeyDown**».

```javascript
this.listen('keydown', 'dinoJump', {target: document});
```

10. Запускается метод проверки столкновения тиранозавра с кактусами «**checkDino**» на следующем кадре анимации с помощью метода «**requestAnimationFrame**».

```javascript
 requestAnimationFrame(this.checkDino.bind(this));
```

В результате это пользователь сможет заново начать новую игру, стараясь улучшить свой предыдущий результат.

Во время начала игры и во время ее возобновления можно добавить проигрывание музыкальной композиции группы T-Rex «**Get It On**».

Для этого первоначально нужно поместить музыкальный файл в папку «**audio**». Пусть этот файл будет иметь имя «**t-rex-get-it-on.mp3**».

На втором этапе к компоненту «**oda-dino**» нужно добавить свойство «**audio**» и проинициализировать его в хуке «**ready**» следующим образом:

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
}
```

В момент столкновения динозавра с кактусом проигрывание этой музыкальной композиции нужно приостановить методом «**pause**».

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

А при возобновления игры можно продолжить ее проигрывание с помощью метода «**play**», добавленного в метод «**continueMove**» компонента «**oda-dino**».

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

В результате этого пользователь, играя в игру, сможет насладиться легендарным хитом группы «T-Rex» «**Get It On**».

![Давай займемся любовью](learn\images\my-first-component\get-it-on.jpg "Давай займемся любовью")