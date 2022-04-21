Немногие знают, что в браузере «**Google Chrome**» есть оригинальная игра про динозавра, которая становится доступной пользователю при потере соединения с сетью Интернет.

![Потеря соединения] (learn\images\my-first-component\my-first-component1.png "Потеря соединения")

Эту игру можно запустить и в online режиме, указав в строке адреса браузера служебную ссылку **chrome://dino**.

![Онлайн запуск игры] (learn\images\my-first-component\my-first-component2.png "Запуск игры в режиме online")

Эта игра имеет кодовое название «**Project Bolan**», что само по себе является отсылкой к Марку Болану, покойному солисту рок-группы 70-х годов «**T-Rex**», творчество которого оказал большое влияние на множество музыкантов и на целые музыкальные направления, такие как панк-рок и брит-поп. Даже у Виктора Цоя есть песня под названием «Посвящение Марку Болану».

![Солист группы T-Rex] (learn\images\my-first-component\MarkBolan.jpeg "Марк Болан")

По словам дизайнера браузера Chrome Себастьяна Габриэля, это игра возвращает пользователей в «**доисторические времена**», когда еще не было повсеместного доступа к сети Интернет, а про сети WI-FI и мобильный Интернет тогда никто ничего еще не слышал.

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

Графических примитив кактуса содержит только его изображение, выполненного с помощью SVG-элемента «**path**».

![Графический примитив кактуса] (learn\images\my-first-component\cactus.png "Кактус")

Аналогично задается графических примитив облака.

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



![Солист группы T-Rex] (learn\images\my-first-component\MarkBolan.jpeg "Марк Болан")



Создадим первый компонент **Hello, World!**

```html run_edit
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>WELCOME</title>
        <script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda-framework/oda.js"></script>  <!--[1]-->
        <style>
            @-webkit-keyframes rotation {
		from {
				-webkit-transform: rotate(0deg);
		}
		to {
				-webkit-transform: rotate(359deg);
		}x
}
@-webkit-keyframes travelGalaxy {
    0% {background-position: right bottom;}
    100% {background-position: left top;}
}
@-moz-keyframes travelGalaxy {
    0% {background-position: right bottom;}
    100% {background-position: left top;}
}

        </style>
    </head>
    <body>
        <welcome-component></welcome-component>                                                       <!--[2]-->
        <script type="module">
            ODA({ //                                                                                  <!--[3]-->
                is: 'welcome-component',
                template: `
                <style>
                h1 {
    font-family: 'Comfortaa', cursive;
    font-size: 200px;
    font-weight: bold;
    text-align: center;
}

.mask-galaxy {
	 background: url(http://i.dailymail.co.uk/i/pix/2016/04/15/13/2591F30000000578-3541631-image-a-4_1460721669000.jpg) center center;
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    -webkit-animation: travelGalaxy 10s linear infinite;
    -moz-animation: travelGalaxy 10s linear infinite;
    -moz-text-fill-color: transparent;
    -moz-background-clip: text;
    -moz-animation: travelGalaxy 10s linear infinite;
    -o-text-fill-color: transparent;
    -o-background-clip: text;
    -o-animation: travelGalaxy 10s linear infinite;
}



/*  FOLLOW*/
.Follow {	  background:url("https://pbs.twimg.com/profile_images/959092900708544512/v4Db9QRv_bigger.jpg")no-repeat center / contain;
	width: 50px;
	height: 50px;
	bottom: 9px;
	right: 20px;
	display:block;
	position:fixed;
	border-radius:50%;
	z-index:999;
	animation:  rotation 10s infinite linear;
	}

                </style>
                    <article class="mask-galaxy">
                        <h1>ODANT</h1>
                    </article>
                    <span>{{text}}</span>
                `,
                props:{
                    text: 'Hello, world!'
                }
            });

    </body>
</html>
```

Давайте подробнее разберем этот код:

1. В разделе [1] кода осуществляется подключение фреймворка.
1. В разделе [2] кода объявляется пользовательский компонент.
1. В разделе [3] кода вызывается функция ODA.

Функции ODA передается прототип будущего компонента, в котором достаточно указать только его имя в свойстве **is** и HTML-шаблон в свойстве **template**.

На основе этой информации функция ODA сама создаст и зарегистрирует Ваш компонент на HTML-странице, а браузер получит возможность отображать кастомный тег компонента как нативный HTML-элемент.

```info
В данном примере был использован полный формат HTML5. В дальнейшем, для компактности будет использована сокращенная нотация.
```