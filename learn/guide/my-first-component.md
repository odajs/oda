Немногие знают, что в браузере «**Google Chrome**» есть оригинальная игра про динозавра, которая становится доступной пользователю при потере соединения с сетью Интернет.

![Потеря соединения] (learn\images\my-first-component\my-first-component1.png "Потеря соединения")

Эту игру можно запустить и в online режиме, указав в строке адреса браузера служебную ссылку **chrome://dino**.

![Онлайн запуск игры] (learn\images\my-first-component\my-first-component2.png "Запуск игры в режиме online")

Эта игра имеет кодовое название «**Project Bolan**», что само по себе является отсылкой к Марку Болану, покойному солисту рок-группы 70-х годов «**T-Rex**».

![Солист группы T-Rex] (learn\images\my-first-component\MarkBolan.jpeg "Марк Болан")

Его творчество оказало большое влияние на множество музыкантов и даже на целые музыкальные направления, такие как панк-рок и брит-поп. Даже Виктор Цой написал песню под названием «**Посвящение Марку Болану**» в честь этого  музыканта.

По словам дизайнера браузера Chrome Себастьяна Габриэля, это игра возвращает пользователей в «**доисторические времена**», когда еще не было повсеместного доступа к сети Интернет, а про сети WI-FI и мобильный Интернет тогда еще никто ничего не слышал.

Сама по себе игра представляет собой одинокого тираннозавра, который оказался посреди пустыни. Он бежит, преодолевая препятствия в виде кактусов и птеродактилей.

![Геймплей игры] (learn\images\my-first-component\my-first-component3.png "Геймплей игры")

Цель игры – набрать как можно больше очков, справляясь с увеличивающейся скоростью движения кактусов.
Элементы управления игры достаточно просты. Если нажать клавишу «Пробел» или «Стрелка вверх», то динозавр прыгает через препятствие.

Давайте попробуем реализовать эту игру, используя графические примитивы SVG-графики и функциональные возможности фреймворка ODA.js для управления ими.

Для этого будет использовать образы четырех основных элементов игры:

1. Тиранозавра.
2. Кактуса.
3. Облака.
4. Птеродактиля.

Графический примитив тиранозавра состоит из его тела, глаза, рта и двух пар задних ног.

![Расположение задних ног] (learn\images\my-first-component\dino1.png "Первое расположение задних ног")

Вторая пара задних ног имеет несколько иное расположение по сравнению с первой.

![Расположение ног] (learn\images\my-first-component\dino2.png "Второе расположение задних ног")

Использование двух пар задних ног позволяет создать анимационный эффект бега тиранозавра. Для этого достаточно к тегу каждой ноги добавить специальный элемент **animate**, которые будет поочередно скрывать или отображать определенную ногу динозавра через заданный временной интервал.

```javascript
<!--Первая нога-->
<path d="M32 111, v26, h13, v-6, h-6, v-7, h6, v-6, h6, v-7, z" id="first-leg" visibility="hidden" >
    <animate attributeName="visibility" values="visible;hidden" dur="0.3s" repeatCount="indefinite"/>
</path>

<!--Вторая нога-->
<path d="M58 111,v7,h6,v19,h13,v-6,h-6,v-20,z" id="second-leg" visibility="hidden">
    <animate attributeName="visibility" values="hidden;visible" dur="0.3s" repeatCount="indefinite"/>
</path>
```

Кроме этого, к файлу примитива динозавра можно добавить большой глаз и рот, которые будут появляться в момент его столкновения с каким-либо кактусом.

![Тиранозавр со большим глазом и закрытым ртом] (learn\images\my-first-component\dino3.png "Большой глаз и рот тиранозавра")

Графический примитив кактуса имеет следующий вид.

![Графический примитив кактуса] (learn\images\my-first-component\cactus.png "Кактус")

Он задается SVG-элементов с одним тегом «**path**».

```javascript
<svg version="1.1" baseProfile="full" width="74" height="147" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 41, h3,v-3, h10, v3, h3, v42, h10, v-80, h3, v-3, h16, v3, h3, v80, h10, v-48, h3, v-3, h10, v3, h3, v48, h-3, v3, h-4, v3, h-3, v4, h-3, v3, h-13, v51, h-22, v-48, h-16, v-3, h-3, v-3, h-4, v-4, h-3, z"/>
</svg>
```

Аналогично задается графический примитив облака.

![Графический примитив облака] (learn\images\my-first-component\cloud.png "Облако")

Графический приметив птеродактиля содержит его тело и два крыла.

Первое крыло поднято вверх.

![Графический примитив птеродактиля] (learn\images\my-first-component\pterodactyl1.png "Птеродактиль")

Второе крыло опущено вниз.

![Графический примитив птеродактиля] (learn\images\my-first-component\pterodactyl2.png "Птеродактиль")

Для создания эффекта взмахов крыльев к ним можно добавить тег **animate**, который будет поочередно скрывать и отображать крылья через определенный временной интервал равный 0.3 секунды.

```html
 <!--Верхнее крыло-->
<path d=" M36 32, v-19, h-5, v-13, h5, v4, h5, v5, h4, v4, h5, v5, h4, v4, h5, v5, h4, v5, z " id="top-wing" visibility="visible">
    <animate attributeName="visibility" values="visible;hidden" dur="0.3s" repeatCount="indefinite"/>
</path>

<!--Нижнее крыло-->
<path d=" M36 47, h18, v18, h-5, v5, h-4, v9, h-5, v5, h-4, z " id="bottom-wing" visibility="visible">
    <animate attributeName="visibility" values = "hidden;visible" dur="0.3s" repeatCount="indefinite"></animate>
</path>
```

Для каждого из этих SVG-элементов создадим пользовательские компоненты, использую фреймворк «ODA».

1. Компонент тиранозавра («oda-dino»).

```javascript
ODA({ is: 'oda-dino',
    template: `
        <style>
            svg path {
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

            <!--Первая нога-->
            <path d="M32 111, v26, h13, v-6, h-6, v-7, h6, v-6, h6, v-7, z" id="first-leg" visibility="hidden" >
                <animate attributeName="visibility" values="visible;hidden" dur="0.3s" repeatCount="indefinite"/>
            </path>

            <!--Вторая нога-->
            <path d="M58 111,v7,h6,v19,h13,v-6,h-6,v-20,z" id="second-leg" visibility="hidden">
                <animate attributeName="visibility" values="hidden;visible" dur="0.3s" repeatCount="indefinite"/>
            </path>

            <!-- Третья нога -->
            <path d="M64 111, v7, h16, v-6, h-9, v-1, z" visibility="hidden" id="third-leg">
                <animate attributeName="visibility" values="visible;hidden" dur="0.3s" repeatCount="indefinite"/>
            </path>

            <!--Четвертая нога-->
            <path d=" M32 111, v7, h7, v6, h12, v-6, h-6, v-7, z " visibility="hidden" id="fourth-leg">
                <animate attributeName="visibility" values="hidden;visible" dur="0.3s" repeatCount="indefinite"/>
            </path>
        </svg>
    `,
    props: {
        svg: {}
    },
    attached() {
        this.svg = this.$core.root.querySelector("svg");
    }
})
```

Для быстрого доступа к **svg** части динозавра предусмотрено одноименное свойство в разделе **props**. Значение этого свойства формируется в хуке **attached** во время добавления компонента в DOM документа.

2. Компонент кактуса («oda-cactus»).

```javascript
ODA({ is: 'oda-cactus',
    template: `
        <style>
            svg path {
                fill: var(--cactus-color);
            }
        </style>

        <svg version="1.1" baseProfile="full" width="74" height="147" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 41, h3,v-3, h10, v3, h3, v42, h10, v-80, h3, v-3, h16, v3, h3, v80, h10, v-48, h3, v-3, h10, v3, h3, v48, h-3, v3, h-4, v3, h-3, v4, h-3, v3, h-13, v51, h-22, v-48, h-16, v-3, h-3, v-3, h-4, v-4, h-3, z"/>
        </svg>
    `
})
```

3. Компонент облака («oda-cloud»).

```javascript
ODA({ is: 'oda-cloud',
    template: `
        <style>
            .hidden {
                display: none;
            }
            svg.clouds path {
                fill: var(--cloud-color);
            }
        </style>
        <svg version="1.1" baseProfile="full" width="150" height="51" xmlns="http://www.w3.org/2000/svg" class="clouds">
            <path d = "M0 38, v3, h7, v-3, h3, v-3, h-6, v3, z"/>
            <path d = "M13 35, h3, v-6, h4, v-4, h22, v-3, h3, v-3, h10, v-10, h6, v-3, h3, v-3, h16, v-3, h13, v3, h7, v3, h3, v7, h9, v3, h16, v6, h10, v7, h6, v6, h-3, v-3, h-6, v-7, h-10, v-6, h-16, v-3, h-6, v3, h-3, v-10, h-4, v-3, h-6, v-3, h-6, v3, h-16, v3, h-4, v4, h-6, v9, h-10, v3, h-3, v4, h-22, v3, h-3, v6, h-7, z"/>
            <path d = "M32 38, h112, v-3, h4, v6, h-116, z"/>
            <rect x="29" y="35" height="3" width="3" />
            <rect x="96" y="19" height="3" width="4" />
        </svg>
    `,
    gameOver(){
        this.style.animationPlayState="paused";
    },
    gameStart(){
        if (this.style.animationPlayState === "paused") {
            this.style.animationPlayState="running";
        }
    }

})
```

4. Компонент птеродактиля («oda-pterodactyl»).

```javascript
ODA({ is: 'oda-pterodactyl',
    template: `
        <style>
            svg path {
                fill: var(--dark-pterodactyl-color);
            }
        </style>
        <svg version="1.1" baseProfile="full" width="95" height="84" xmlns="http://www.w3.org/2000/svg" class="pterodactyls">
            <!--Тело птеродактиля-->
            <path d=" M0 31, h4, v-4, h5, v-5, h4, v-4, h5, v-5, h9, v9, h4, v9, h32, v4, h5, v5, h27, v4, h-14, v5, h9, v4, h-13, v5, h-32, v-5, h-4, v-4, h-5, v-5, h-5, v-4, h-4, v-5, h-27, z " stroke="transparent" id="pterodactyl"/>

            <!--Верхнее крыло-->
            <path d=" M36 32, v-19, h-5, v-13, h5, v4, h5, v5, h4, v4, h5, v5, h4, v4, h5, v5, h4, v5, z " id="top-wing" visibility="visible">
                <animate attributeName="visibility" values="visible;hidden" dur="0.3s" repeatCount="indefinite"/>
            </path>

            <!--Нижнее крыло-->
            <path d=" M36 47, h18, v18, h-5, v5, h-4, v9, h-5, v5, h-4, z " id="bottom-wing" visibility="visible">
                <animate attributeName="visibility" values = "hidden;visible" dur="0.3s" repeatCount="indefinite"></animate>
            </path>
        </svg>
    `
})
```

Основной файл HTML зададим в следующем виде:

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Component</title>
    <link rel="stylesheet" href="css/style.css">
    <script type="module" src="../../../oda.js"></script>
    <script type="module" src="./oda-dino-game.js"></script>
</head>
<body>
    <div id="wrapper">
        <h1 id ="title">Счет игры</h1>
        <h1 id ="score">0.0</h1>
        <div id="game-space" class="dark">
            <h1 id="game-over">Для начала игры нажмите пробел</h1>
            <oda-dino id="dino"></oda-dino>
        </div>
    </div>
</body>

</html>
```

Здесь задается стандартная HTML-страница с заголовком «**My First Component**».

В заголовочном части этого документа подключаются:

1. Файл со стилями отображения элементов игры **style.css**.
1. Файл **oda.js** c библиотекой самого фреймворка **ODA**.
1. Файл **oda-dino-game.js** c javascript кодом работы самой игры.

 тся файл **style.css**, в котором заданы css-переменные и классы для стилизации элементов игры:

1. Набор css-переменных

```css
:root {
    --dino-top: 314px;
    --dino-max-top: 20px;
    --base-color: grey;
    --cloud-color: #e2e2e2;
    --moon-color: #e2e2e2;
    --day-color: blue;
    --pterodactyl-color: var(--base-color);
    --star-color: #e2e2e2;
    --ground-color: var(--base-color);
    --horizon-color: var(--base-color);
    --bump-color: var(--base-color);
    --dino-color: var(--dark-base-color);
    --cactus-color: var(--base-color);
    /* --dino-eyes-color: white; */

    /* --day-color: white; */
    --dino-eyes-color: #121212;
    --night-body: #121212;
    --night-background-color: #121212;

    --header-color: honeydew;
    --header-background-color: grey;
    --background-color: white;

    /* --form-border-color: #888; */
    --form-color: #444;
    --form-border-color: #ddd;
    --form-header-border-color: #ddd;
    --form-outline-color: #999;

    --button-color: #04aa6d;
    --tab-color: #999;
    --tab-selected-color: #666;
    --tab-select-border-color: #4cc8f1;

    --cancel-button-color: #f44336;

    --form-background-color: #fefefe;

    /* --form-header-background-color: #fcfcfc; */
    --form-header-background-color: #f1f1f1;
    --form-header-color: #f1f1f1;

    --dark-background-color: #121212;


    --dark-color: white;
    --dark-header-color: #252525;
    --dark-input-background-color: #3b3b3b;
    --dark-input-border-color: #ccc;
    --dark-input-color: white;

    --dark-tab-color: #b5b5b5;
    --dark-tab-hover-color: white;
    --dark-tab-focus-color: #b5b5b5;
    --dark-tab-selected-color: white;
    --dark-tab-border-color: #b5b5b5;


    --dark-base: #808080;
    --dark-base-color: #e2e2e2;
    --dark-cactus-body: #878787;
    --dark-small-cactus-body: #878787;
    --dark-cactus-border: #4c4c4c;
    --dark-cloud-color: var(--dark-base-color);
    --dark-moon-color: var(--dark-base-color);
    --dark-pterodactyl-color: var(--dark-base-color);
    --dark-star-color: var(--dark-base-color);
    --dark-ground-color: var(--dark-base-color);
    --dark-horizon-color: var(--dark-base-color);
    --dark-bump-color: var(--dark-base-color);
    --dark-dino-color: var(--base-color);
    --dark-cactus-color: var(--dark-base-color);

}
```

2. Стиль тела документа

```css
body {
    margin: 0px;
    font-family: Arial, Helvetica, sans-serif;
}
```

3. Стиль внешней обертки

```css
#wrapper {
    height: 100%;
    width: 100%;
    position: absolute;
    background-color: var(--header-background-color);
}
```

4. Стиль непосредственной области игры

```css
#game-space {
    height: 500px;
    width: 100%;
    top: 200px;
    left: 0px;
    position: absolute;
    background-color: var(--background-color);
    overflow: hidden;
}
```

5. Стиль заголовка игры

```css
h1{
    text-align: center;
    color: honeydew;
    margin-bottom: 0px;
    font-family: "Comic Sans MS";
}
```

6. Стиль надписи завершения игры.

```css
#game-over{
    position: relative;
    top: 35%;
}
```

1. Стиль надписи с количеством набранных очков.

```css
#score{
    font-size: 50px;
    margin-top: 0px;
}
```


oda-dino {
    position: absolute;
    left: 72px;
    top: 314px;
    z-index: 300;
}

oda-cloud {
    position: absolute;
    animation-name: cloud-move;
    animation-duration: 6s;
    animation-iteration-count: 1;
    animation-timing-function: linear;
    z-index: 100;
}

@keyframes cloud-move {
    from {
        left: 100%;
    }
    to {
        left: -150px;
    }
}

oda-cactus {
    position: absolute;
    top: 301px;
    animation-name: cactus-move;
    animation-duration: 3s;
    animation-iteration-count: 1;
    animation-timing-function: linear;
    z-index: 200;
}

@keyframes cactus-move {
    from {
        left: 100%;
    }
    to {
        left: -136px;
    }
}

oda-pterodactyl {
    position: absolute;
    animation-name: pterodactyl-move;
    animation-duration: 3s;
    animation-iteration-count: 1;
    animation-timing-function: linear;
    z-index: 200;
}

@keyframes pterodactyl-move {
    from {
        left: 100%;
    }
    to {
        left: -136px;
    }
}

oda-moon {
    position: absolute;
    left: 100%;
    top: 70px;
    animation-name: moon-move;
    animation-duration: 5s;
    animation-iteration-count: 1;
    animation-timing-function: linear;
    z-index: 100;
}

@keyframes moon-move {
    from {
        left: 100%;
    }
    to {
        left: -64px;
    }
}

oda-star1 {
    position: absolute;
    animation-name: star1-move;
    animation-duration: 6s;
    animation-iteration-count: 1;
    animation-timing-function: linear;
    z-index: 100;
}

oda-star2 {
    position: absolute;
    left: 50%;
    animation-name: star2-move;
    animation-duration: 6s;
    animation-iteration-count: 1;
    animation-timing-function: linear;
    z-index: 100;
}

@keyframes star1-move {
    from {
        left: 100%;
    }
    to {
        left: -25px;
    }
}

@keyframes star2-move {
    from {
        left: 100%;
    }
    to {
        left: -25px;
    }
}

.horizon {
    position: absolute;
    top: 435px;
    width: 100%;
    height: 3px;
    background-color: var(--horizon-color);
}

.dino-jump {
    animation-name: dino-jump;
    animation-duration: 1s;
    animation-iteration-count: 1;
    animation-timing-function: ease-out;
}

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

В теле документа создана обертка «wrapper», внутри которой располагаются:

1. Заголовок «Счет игры».
1. Элемент счет игры (id="**score**").
1. Непосредственная область игры (id="**game-space**").
1. Сообщение начала или окончания игры (id="**game-over**").
1. Сам динозавра в виде пользовательского компонента «**oda-dino**»

В результате этого окно игры в начальном состоянии будет иметь следующий вид:

(learn\images\my-first-component\game-window.png "Начальное окно игры")
