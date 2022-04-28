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

Вторая пара задних ног имеет несколько иное расположение по сравнению с первой.

![Расположение ног] (learn\images\my-first-component\dino2.png "Второе расположение задних ног")

Это позволяет создать анимационный эффект бега тиранозавра. Для этого достаточно к SVG-файлу добавить теги **animate**, которые будет поочередно менять расположение ног через определенный временной интервал, заданный равным 3 десятым секунды.

```text
<animate href="#first-leg" attributeName="visibility" values="visible;hidden" dur="0.3s" repeatCount="indefinite"/>

<animate href="#fourth-leg" attributeName="visibility" values="hidden;visible" dur="0.3s" repeatCount="indefinite"/>

<animate href="#second-leg" attributeName="visibility" values="hidden;visible" dur="0.3s" repeatCount="indefinite"/>

<animate href="#third-leg" attributeName="visibility" values="visible;hidden" dur="0.3s" repeatCount="indefinite"/>
```

Кроме этого, к файлу примитива динозавра можно добавить большой глаз и рот, которые будут появляться в момент его столкновения с каким-либо кактусом.

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

1. Компонент тиранозавра («oda-dino»).

    ```text
    ODA({ is: 'oda-dino',
        template: `
            <style>
                /* Раздел стилей */
            </style>

            <svg version="1.1" baseProfile="full" width="128" height="137" xmlns="http://www.w3.org/2000/svg">

                <!-- Тело -->
                <path d="M0 48, h7, v12, h6, v7, h6, v6, h13, v-6, h7, v-7, h9, v-6, h10, v-6, h6, v-42, h7, v-6, h51, v6, h6, v29, h-32, v6, h19, v7, h-25, v12, h13, v13, h-7, v-6, h-6, v22, h-7, v10, h-6, v6, h-6, v7, h-45, v-7, h-7, v-6, h-6, v-7, h-6, v-6, h-7, z " stroke="transparent" id="body" visibility="visible"/>

                <!--Глаз маленький-->
                <rect x="77" y="9" fill="white" height="7" width="6" id="small-eye" class="eyes"/>

                <!--Глаз большой-->
                <rect x="78.5" y="10.5" fill="transparent" stroke-width="3" stroke="white" height="10" width="10" id="big-eye" visibility="hidden"/>

                <!--Рот-->
                <path d=" M95 34, v8, h20, v-1, h13, v-7, z " id="month" visibility="hidden"/>

                <!--Первая нога-->
                <path d=" M32 111, v26, h13, v-6, h-6, v-7, h6, v-6, h6, v-7, z " id="first-leg" visibility="hidden"/>

                <!--Вторая нога-->
                <path d="M58 111,v7,h6,v19,h13,v-6,h-6,v-20,z" id="second-leg" visibility="hidden"/>

                <!-- Третья нога -->
                <path d="M64 111, v7, h16, v-6, h-9, v-1, z" visibility="hidden" id="third-leg"/>

                <!--Четвертая нога-->
                <path d=" M32 111, v7, h7, v6, h12, v-6, h-6, v-7, z " visibility="hidden" id="fourth-leg"/>

                <animate href="#first-leg" attributeName="visibility" values="visible;hidden" dur="0.3s" repeatCount="indefinite"/>
                <animate href="#fourth-leg" attributeName="visibility" values="hidden;visible" dur="0.3s" repeatCount="indefinite"/>
                <animate href="#second-leg" attributeName="visibility" values="hidden;visible" dur="0.3s" repeatCount="indefinite"/>
                <animate href="#third-leg" attributeName="visibility" values="visible;hidden" dur="0.3s" repeatCount = "indefinite"/>
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

    Для более быстрого доступа к svg части динозавра предусмотрено одноименное свойство, которое задается в разделе **props**. Значение этого свойства формируется в хуке **attached** во время добавления компонента в DOM документа.

1. Компонент кактуса («oda-cactus»).