Создадим первый компонент **Hello, World!**

```html run_edit
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>WELCOME</title>
        <script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda-framework/oda.js"></script>  <!--[1]-->
    </head>
    <body>
        <welcome-component></welcome-component>                                                       <!--[2]-->
        <script type="module">
            ODA({ //                                                                                  <!--[3]-->
                is: 'welcome-component',
                template: `
                    <span>{{text}}</span>
                `,
                props:{
                    text: 'Hello, world!'
                }
            });
        </script>
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
