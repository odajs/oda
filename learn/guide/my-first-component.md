Немногие знают, что в браузере «**Google Chrome**» есть оригинальная игра про динозавра, которая становится доступной пользователю при потере соединения с сетью Интернет.

![Потеря соединения] (learn\images\my-first-component\my-first-component1.png "Потеря соединения")

Эту игру можно запустить и в online режиме, указав в строке адреса браузера служебную ссылку **chrome://dino**.

![Онлайн запуск игры] (learn\images\my-first-component\my-first-component2.png "Запуск игры в режиме online")

Эта игра имеет кодовое название «**Project Bolan**», что само по себе является отсылкой к Марку Болану, покойному солисту рок-группы 70-х годов «**T-Rex**», творчество которого оказал большое влияние на множество музыкантов и на целые музыкальные направления, такие как панк-рок и брит-поп. Даже у Виктора Цоя есть песня под названием «Посвящение Марку Болану».

![Солист группы T-Rex] (learn\images\my-first-component\MarkBolan.jpeg "Марк Болан")

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

Вторая пара задних ног имеет несколько иное расположение по сравнению с первой парой.

![Расположение ног] (learn\images\my-first-component\dino2.png "Второе расположение задних ног")

Это позволяет создать анимационный эффект бега тиранозавра. Для этого достаточно к SVG-файлу добавить теги **animate**, которые будет поочередно менять расположение ног через определенный временной интервал, равный 3 десятым секунды.

```text
<animate href="#first-leg" attributeName="visibility" values="visible;hidden" dur="0.3s" repeatCount="indefinite" id="first-leg-anim"/>

<animate href = "#fourth-leg" attributeName="visibility" values = "hidden;visible" dur="0.3s" repeatCount="indefinite"/>

<animate href="#second-leg" attributeName="visibility" values="hidden;visible" dur="0.3s" repeatCount="indefinite" id="second-leg-anim"/>

<animate href = "#third-leg" attributeName = "visibility" values = "visible;hidden" dur="0.3s" repeatCount = "indefinite"/>
```

Кроме этого, к файлу примитива динозавра можно добавить большой глаз и рот, которые будут появляться в момент его столкновения с кактусами.

![Тиранозавр со большим глазом и закрытым ртом] (learn\images\my-first-component\dino3.png "Большой глаз и рот тиранозавра")

Графический примитив кактуса содержит только его изображение, выполненного с помощью SVG-элемента «**path**».

![Графический примитив кактуса] (learn\images\my-first-component\cactus.png "Кактус")

Аналогично задается графический примитив облака.

![Графический примитив облака] (learn\images\my-first-component\cloud.png "Облако")

Графический приметив птеродактиля содержит его тело и два крыла.

Первое крыло поднято вверх.

![Графический примитив птеродактиля] (learn\images\my-first-component\pterodactyl1.png "Птеродактиль")

Второе крыло опущено вниз.

![Графический примитив птеродактиля] (learn\images\my-first-component\pterodactyl2.png "Птеродактиль")

Для создания эффекта взмахов крыльев к ним необходимо добавить тег **animate**, который поочередно будет скрывать и отображать их с определенным периодом в 0.3 секунды, как это было сделано для эффекта смены ног у тиранозавра.

```text
<animate attributeName="visibility" values="hidden;visible" dur="0.3s" repeatCount="indefinite"></animate>
<animate attributeName="visibility" values="visible;hidden" dur="0.3s" repeatCount="indefinite"></animate>
```

Для каждого из этих элементов создадим пользовательский компоненты следующим образом:

1. Компонента тиранозавра.

```text
ODA({ is: 'oda-dino',
    template: `
        <style>
            /* Раздел стилей */
        </style>

        <svg version="1.1" baseProfile="full" width="128" height="137" xmlns="http://www.w3.org/2000/svg" class="dinos">

            <!-- Тело -->
            <path d=" M0 48, h7, v12, h6, v7, h6, v6, h13, v-6, h7, v-7, h9, v-6, h10, v-6, h6, v-42, h7, v-6, h51, v6, h6, v29, h-32, v6, h19, v7, h-25, v12, h13, v13, h-7, v-6, h-6, v22, h-7, v10, h-6, v6, h-6, v7, h-45, v-7, h-7, v-6, h-6, v-7, h-6, v-6, h-7, z " stroke="transparent" id="body" visibility="visible"/>

            <!--Глаз маленький-->
            <rect x="77" y="9" fill="white" height="7" width="6" id="small-eye" class="eyes"/>

            <!--Глаз большой-->
            <rect x="78.5" y="10.5" fill="transparent" stroke-width="3" stroke="white" height="10" width="10" id="big-eye" visibility="hidden"/>

            <!--Рот-->
            <path d=" M95 34, v8, h20, v-1, h13, v-7, z " id="month" visibility="hidden"/>

            <!-- Тело наклон-->
            <path d=" M0 53, h6, v6, h13, v7, h26, v-7, h54, v7, h13, v-3, h6, v-7, h52, v7, h6, v28, h-32, v7, h19, v6, h-45, v-6, h-12, v9, h-7, v7, h7, v6, h-13, v-13, h-16, v4, h-39, v-7, h-6, v-6, h-6, v-7, h-7, v-6, h-6, v-6, h-7, v-7, h-6, z " id="body-bow" visibility="visible" class="hidden"/>

            <!--Глаз маленький наклон-->
            <rect x="125" y="66" fill="white" height="6" width="6" id="small-eye-bow" visibility="visible" class="hidden"/>

            <!--Глаз большой наклон-->
            <rect x="126.5" y="67.5" fill="transparent" stroke-width="3" stroke="white" height="10" width="10" id="big-eye-bow" visibility="hidden"/>

            <!--Рот наклон-->
            <path d="M143 90,v9,h20,v-1,h7,v-8,z" fill="grey" id="month-bow" visibility="hidden"/>

            <!--Первая нога-->
            <path d=" M32 111, v26, h13, v-6, h-6, v-7, h6, v-6, h6, v-7, z " id="first-leg" visibility="hidden"/>

            <!--Вторая нога-->
            <path d="M58 111,v7,h6,v19,h13,v-6,h-6,v-20,z" id="second-leg" visibility="hidden"/>

            <!-- Третья нога -->
            <path d="M64 111, v7, h16, v-6, h-9, v-1, z" visibility="hidden" id="third-leg"/>

            <!--Четвертая нога-->
            <path d=" M32 111, v7, h7, v6, h12, v-6, h-6, v-7, z " visibility="hidden" id="fourth-leg"/>

            <!--Первая нога наклон-->
            <path d=" M35 111, v25, h13, v-6, h-6, v-7, h6, v-6, h6, v-7, h-16, v1, z " id="first-leg-bow" visibility="hidden" class="hidden"/>

            <!--Вторая нога наклон-->
            <path d="M54 110, v26, h13, v-6, h-6, v-7, h6, v-6, h7, v-7, z " id="second-leg-bow" visibility="hidden" class="hidden"/>

            <!--Третья нога наклон-->
            <path d=" M67 110, v7, h16, v-6, h-6, v-1, z " id="third-leg-bow" visibility="hidden" class="hidden"/>

            <!-- Четвертая нога наклон -->
            <path d=" M35 111, v12, h13, v-6, h-6, v-7, h-4, v1, z " visibility="hidden" id="fourth-leg-bow" class="hidden"/>

            <animate href="#first-leg" attributeName="visibility" values="visible;hidden" dur="0.3s" repeatCount="indefinite" id="first-leg-anim"/>
            <animate href="#fourth-leg" attributeName="visibility" values = "hidden;visible" dur="0.3s" repeatCount="indefinite"/>
            <animate href="#second-leg" attributeName="visibility" values="hidden;visible" dur="0.3s" repeatCount="indefinite" id="second-leg-anim"/>
            <animate href="#third-leg" attributeName = "visibility" values = "visible;hidden" dur="0.3s" repeatCount = "indefinite"/>
            <animate href="#first-leg-bow" attributeName="visibility" values="visible;hidden" dur="0.3s" repeatCount="indefinite" id="first-leg-bow-anim"/>
            <animate href="#fourth-leg-bow" attributeName="visibility" values = "hidden;visible" dur="0.3s" repeatCount="indefinite"/>
            <animate href="#second-leg-bow" attributeName="visibility" values="hidden;visible" dur="0.3s" repeatCount="indefinite" id="second-leg-bow-anim"/>
            <animate href="#third-leg-bow" attributeName = "visibility" values = "visible;hidden" dur="0.3s" repeatCount = "indefinite"/>
        </svg>
    `,
    props: {
        svg: {}
    },
    attached() {
        this.polygons = new Map();
        this.svg = this.$core.root.querySelector("svg");
        this.polygons.set('dino-body', createPolygon(this.svg,'#body'));
        this.polygons.set('dino-first-leg', createPolygon(this.svg,'#first-leg'));
        this.polygons.set('dino-second-leg', createPolygon(this.svg,'#second-leg'));
        this.polygons.set('dino-third-leg', createPolygon(this.svg,'#third-leg'));
        this.polygons.set('dino-fourth-leg', createPolygon(this.svg,'#fourth-leg'));
    },
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
    gameOver(){
        this.style.animationPlayState="paused";
        this.svg.pauseAnimations();
        this.svg.getElementById('big-eye').setAttribute('visibility', 'visible');
        this.svg.getElementById('small-eye').setAttribute('visibility', 'hidden');
        this.svg.getElementById('month').setAttribute('visibility', 'visible');
    },
    gameStart(){
        if (this.style.animationPlayState === "paused") {
            this.classList.remove("dino-jump");
            this.svg.unpauseAnimations();
            this.style.animationPlayState=null;
            this.svg.getElementById('big-eye').setAttribute('visibility', 'hidden');
            this.svg.getElementById('small-eye').setAttribute('visibility', 'visible');
            this.svg.getElementById('month').setAttribute('visibility', 'hidden');
        }
    },
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

        // const bow = dino.getElementById('body').classList.contains("hidden") ? "-bow" : "";

        return intersectPolygonPolygon(this.polygons.get('dino-body'), cactus.polygons.get('cactus'), dinoCoords, cactusCoords)
         || (getComputedStyle(this.svg.getElementById('first-leg')).visibility === 'visible' ?
                 intersectPolygonPolygon(this.polygons.get('dino-first-leg'), cactus.polygons.get('cactus'), dinoCoords, cactusCoords) :
                 intersectPolygonPolygon(this.polygons.get('dino-fourth-leg'), cactus.polygons.get('cactus'), dinoCoords, cactusCoords)) ||
             (getComputedStyle(this.svg.getElementById('second-leg')).visibility === 'visible' ?
                 intersectPolygonPolygon(this.polygons.get('dino-second-leg'), cactus.polygons.get('cactus'), dinoCoords, cactusCoords) :
                 intersectPolygonPolygon(this.polygons.get('dino-third-leg'), cactus.polygons.get('cactus'), dinoCoords, cactusCoords));
    }
})
```
