Многие знают, что в браузере «**Google Chrome**» есть оригинальная игра про динозавра, которая становится доступной пользователю при потере соединения с сетью Интернет.

![Потеря соединения] (learn\images\my-first-component\my-first-component1.png "Потеря соединения")

Эту игру можно запустить и online, указав в строке адреса браузера ссылку chrome://dino.

![Солист группы T-Rex] (learn\images\my-first-component\my-first-component2.png "Потеря соединения")

Эта игра имеет кодовое название «**Project Bolan**», что само по себе является отсылкой к Марку Болану, покойному солисту рок-группы 70-х годов «**T-Rex**».

![Солист группы T-Rex] (learn\images\my-first-component\MarkBolan.jpeg "Марк Болан")

По словам дизайнера браузера Chrome Себастьяна Габриэля [1], это игра возвращает пользователей в «доисторические времена», когда еще не было повсеместного доступа к сети Интернет, а про сети WI-FI и мобильный Интернет тогда еще никто ничего не слышал.

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