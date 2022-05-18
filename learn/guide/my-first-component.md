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

Графический примитив самого кактуса имеет следующий вид:

![Графический примитив кактуса] (learn\images\my-first-component\cactus.png "Кактус")

Он задается SVG-элементом с использованием только одного тега «**path**».

```javascript
<svg version="1.1" baseProfile="full" width="74" height="147" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 41, h3,v-3, h10, v3, h3, v42, h10, v-80, h3, v-3, h16, v3, h3, v80, h10, v-48, h3, v-3, h10, v3, h3, v48, h-3, v3, h-4, v3, h-3, v4, h-3, v3, h-13, v51, h-22, v-48, h-16, v-3, h-3, v-3, h-4, v-4, h-3, z"/>
</svg>
```

Аналогично задается графический примитив облака.

![Графический примитив облака] (learn\images\my-first-component\cloud.png "Облако")

Графический примитив птеродактиля содержит его тело и два крыла.

Первое крыло поднято вверх.

![Графический примитив птеродактиля] (learn\images\my-first-component\pterodactyl1.png "Птеродактиль")

Второе крыло опущено вниз.

![Графический примитив птеродактиля] (learn\images\my-first-component\pterodactyl2.png "Птеродактиль")

Для создания эффекта взмахов крыльев к ним можно добавить тег **animate**, который будет поочередно скрывать и отображать определенное крыло через заданный временной интервал.

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

Для управления этими SVG-элементами для каждого из них создадим пользовательский компонент, использую фреймворк «ODA».

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

Для быстрого доступа к SVG-примитиву динозавра предусмотрим свойство **svg** в разделе **props**. Значение этого свойства инициализируем в хуке **attached**, который будет вызываться перед непосредственным добавлением компонента в DOM документа.

2. Компонент кактуса («oda-cactus») содержит только его SVG-примитив и стиль его отображения.

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

3. Компонент облака («oda-cloud») реализован аналогично компоненту кактуса. Он содержит SVG-примитив и стиль его отображения.

```javascript
ODA({ is: 'oda-cloud',
    template: `
        <style>
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
})
```

4. Компонент птеродактиля («oda-pterodactyl») кроме SVG-примитива его тела содержит крылья с эффектом анимации.

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

Все эти компоненты можно отобразить на веб-странице, которую можно задать с помощью следующего индексного файла с именем «index.html»:

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
        <h1>Счет игры</h1>
        <h1 id ="score">0.0</h1>
        <div id="game-space" class="dark">
            <h1 id="game-over">Для начала игры нажмите пробел</h1>
            <oda-dino id="dino"></oda-dino>
        </div>
    </div>
</body>

</html>
```

Здесь создается HTML-документ с заголовком «**My First Component**».

В заголовочном части этого документа подключаются следующие файлы:

1. **style.css** – файл со стилями отображения элементов игры.
1. **oda.js** – файл c библиотекой самого фреймворка **ODA**.
1. **oda-dino-game.js** – файл c javascript кодом работы самой игры.

В теле документа задается внешняя обертка «**wrapper**», внутри которой располагаются:

1. Заголовок для вывода текста «Счет игры».
1. Элемент для вывода текущего счет игры (id="**score**").
1. Непосредственная область игры (id="**game-space**").
1. Сообщение начала или окончания игры (id="**game-over**").
1. Сам динозавра в виде пользовательского компонента «**oda-dino**»

В результате этого окно игры в начальном состоянии будет иметь следующий вид:

(learn\images\my-first-component\game-window.png "Начальное окно игры")

Для стилизации элементов игры в файле **style.css** заданы следующие css-правила:

1. Набор css-переменных

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

Здесь переменная **--base-color** задает базовый цвет динозавра, облаков, птеродактиля и горизонта. Переменная **dark-color** определяет цвет основной области игры и цвет глаз динозавра, а переменная **header-color** задает цвет текста заголовков. Фон игры и кактуса задается обычным серым цветом **grey**.

2. Стиль тела документа задает нулевые отступы и базовый набор шрифтов, отображения элементов.

```css
body {
    margin: 0px;
    font-family: Arial, Helvetica, sans-serif;
}
```

3. Стиль внешней обертки **wrapper** задает цвет и размеры внешней области игры.

```css
#wrapper {
    height: 100%;
    width: 100%;
    position: relative;
    background-color: var(--header-background-color);
}
```

4. Стиль непосредственной области игры **game-space** задает область, в которой будет отображаться все основные элементы игры.

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

5. Заголовочный стиль **h1** определяет шрифт и цвет заголовочных надписей в области игры, а также их расположение.

```css
h1 {
    text-align: center;
    color: --header-color;
    margin-bottom: 0px;
    font-family: "Comic Sans MS";
}
```

6. Стиль для надписи с количеством набранных очков **score** задает отличный от стандартного стиля отображения заголовков размер шрифта и верхнего отступа.

```css
#score{
    font-size: 50px;
    margin-top: 0px;
}
```

7. Стиль отображения надписи начала или окончания игры **game-over** определяет позицию расположения надписи относительно основной области игры.

```css
#game-over{
    position: relative;
    top: 35%;
}
```

8. Стиль отображения тиранозавра **oda-dino** задает его начальное расположение в области игры.

```css
oda-dino {
    position: absolute;
    left: 72px;
    top: var(--dino-top);
    z-index: 300;
}
```

9. Стиль отображения горизонта определяет его начальное расположение и цвет.

```css
.horizon {
    position: absolute;
    top: 435px;
    width: 100%;
    height: 3px;
    background-color: var(--horizon-color);
}
```

Для начала игры необходимо задать обработчик нажатия клавиш в основном файле **oda-dino-game** следующим образом:

```javascript
function startGameKeyUp(e) {
    if (e.code === 'Space') {
        startGame();
    }
}
```

В этом обработчике при нажатие на клавишу пробела (**Space**) проверяется не началась ли на данный момент игра, и если не началась, то вызывается метод **startGame**, который запускает ее на выполнение.

Данный метод привязывается к событию отпускания клавиш клавиатуры **keyup** на уровне документа.

```javascript
document.addEventListener('keyup', dinoKeyUp);
```

В методе начала игры **startGame** создаются все необходимые для нее элементы.

```javascript
function startGame() {
    const gameOver = document.querySelector('#game-over');

    gameOver.style.display = "none";
    gameOver.innerText = "Game Over";

    const audio = document.querySelector('audio');
    audio.play();

    const cactuses = document.querySelectorAll('oda-cactus');
    cactuses.forEach(cactus => {
        cactus.remove();
    });

    cactusDistance = 0;
    nextCactusDistance = 0;

    const dino = document.querySelector('oda-dino');
    dino.gameStart();

    const clouds = document.querySelectorAll('oda-cloud');
    clouds.forEach(cloud => {
        cloud.gameStart();
    });

    const pterodactyls = document.querySelectorAll('oda-pterodactyl');
    pterodactyls.forEach(pterodactyl => {
        pterodactyl.gameStart();
    });

    let score = document.getElementById('score');

    score.textContent = 0;



    scoreID = setInterval(() => {
        score.textContent = +score.textContent + 1;
    }, 100);
    requestAnimationFrame(checkDino);
}
```
