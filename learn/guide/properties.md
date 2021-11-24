Свойства компонента объявлются в разделе **props** прототипа компонента.
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Property</title>
        <script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda-framework/oda.js"></script>
    </head>
    <body>
        <welcome-component></welcome-component>
        <script type="module">
            ODA({
                is: 'welcome-component',
                template: `
                    <span>{{text}}</span>
                `,
                props:{
                    text: {
                        default: "Hello, property!",
                        type: String,
                    }
                }
            });
        </script>
    </body>
</html>

Каждое свойство имеет расширенную форму записи, при которой задаются дополнительные параметры свойства в виде отдельного объекта.

Этот объект может содержать

* Строка 1. default - значение свойства по умолчанию
* Строка 2. type - тип свойства

Подробнее о параметрах свойств можно узнать [здесь](.\property.md).
