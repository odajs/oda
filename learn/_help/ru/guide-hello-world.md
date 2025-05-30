Для понимания того, что представляет собой ODA-фреймворк, давайте создадим простейший компонент **Hello, World!**

```html run_edit
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Welcome to ODA.js</title>
        <script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda/oda.js"></script>
    </head>
    <body>
        <my-component></my-component>
        <script type="module">
            ODA({
                is: 'my-component',
                template: `
                    <span>{{text}}</span>
                `,
                text: 'Hello, world!'
            });
        </script>
    </body>
</html>
```

В этом примере сначала подключается библиотека фреймворка, используя механизм CDN и технологию JavaScript модулей. Для этого обязательным условием является использование в теге **script** атрибута **type** со значением **module**.

В теле HTML-страницы задается пользовательский тег <my-component>, который, однако, не будет по умолчанию отображаться браузером, так как он не является его нативным HTML-элементом.

Для того, чтобы отобразить этот тег необходимо зарегистрировать в браузере пользовательский компонент с таким же именем с помощью функции **ODA** нашего фреймворка.

Давайте подробнее разберем код самого компонента, который передается этой функции в списке параметров в виде объекта с определенными свойствами:

1. Свойство **is** этого объекта определяет имя будущего компонента, под которым он будет зарегистрирован в браузере.

1. Свойство **template** задает шаблон будущего компонента, при написании которого используется формат JSX.

1. Свойство **text** возвращает значение, которое будет автоматически подставлено в содержимое элемента **span**, с возможностью динамического изменения его значения.

На основе этой информации функция ODA сама создаст и зарегистрирует пользовательский компонент, а браузер получит возможность отображать его, используя кастомный тег компонента «my-component» как нативный HTML-элемент.

```info_md
В данном примере был использован полный формат разметки HTML-документа. В дальнейшем можно использовать сокращенную запись для компактности получаемого кода.
```

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/GpyzBM5bKQ8?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    style="position:absolute;width:100%;height:100%;"></iframe>
</div>
