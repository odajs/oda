### Showdown's Wiki pages 
[Окрыть showdown wiki](https://github.com/showdownjs/showdown/wiki)


# Markdown Cheat Sheet

Thanks for visiting [The Markdown Guide](https://www.markdownguide.org)!

This Markdown cheat sheet provides a quick overview of all the Markdown syntax elements. It can’t cover every edge case, so if you need more information about any of these elements, refer to the reference guides for [basic syntax](https://www.markdownguide.org/basic-syntax) and [extended syntax](https://www.markdownguide.org/extended-syntax).

## Basic Syntax

These are the elements outlined in John Gruber’s original design document. All Markdown applications support these elements.

### Heading

# H1
## H2
### H3
#### H4
##### H5
###### H6

Heading level 1
===============
Heading level 2
---------------

### Bold

**bold text**

### Italic

*italicized text*

### Line Breaks
To create a line break or new line \<br>, end a line with two or more spaces, and then type return.   
This is the first line.  
And this is the second line.

### Blockquote

* This is the first list item.
* Here's the second list item.

    > A blockquote would look great below the second list item.

* And here's the third list item.

### Nested Blockquotes
Blockquotes can be nested. Add a >> in front of the paragraph you want to nest.

> Dorothy followed her through many of the beautiful rooms in her castle.
>
>> The Witch bade her clean the pots and kettles and sweep the floor and keep the fire fed with wood.

### Ordered List

1. First item
2. Second item
3. Third item
    - Indented item
    - Indented item
4. Fourth item

### Unordered List

- First item
- Second item
- Third item

### Code

`code`

### Horizontal Rule

***

---

___

<hr>

### Link

[Markdown Guide](https://www.markdownguide.org)

### Image

![alt text](https://www.markdownguide.org/assets/images/tux.png)

## Extended Syntax

These elements extend the basic syntax by adding additional features. Not all Markdown applications support these elements.

### Table

| Syntax | Description |
| ----------- | ----------- |
| Header | Title |
| Paragraph | Text |

### Alignment

You can align text in the columns to the left, right, or center by adding a colon (:) to the left, right, or on both side of the hyphens within the header row.

| Syntax      | Description | Test Text     |
| :---        |    :----:   |          ---: |
| Header      | Title       | Here's this   |
| Paragraph   | Text        | And more      |

### Fenced Code Block

```
{
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
```

### Strikethrough

<del>The world is flat.</del>

### Task List

- <input type="checkbox"> Write the press release
- <input type="checkbox" checked> Update the website
- <input type="checkbox" checked> Contact the media

### Emoji

That is so funny! :joy:

(See also [Copying and Pasting Emoji](https://www.markdownguide.org/extended-syntax/#copying-and-pasting-emoji))

### Highlight

I need to highlight these <mark>very important words</mark>.

### Subscript

H<sub>2</sub>O

### Superscript

X<sup>2</sup>


***
***
***
***

CDN
~~~html _hideGutter_
<script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda-framework@master/oda.js"></script>
~~~
~~~html _hideGutter_
<script type="module" src="https://unpkg.com/browse/oda-framework@0.0.1/oda.json"></script>
~~~

NPM

~~~info_hideGutter_
 npm i oda-framework
~~~

~~~error_hideGutter_hideicon_
 npm i oda-framework
~~~

Текст `let a = "Программный код"` в одну строку

1.  level 1
    1.  Level 2
        *   Level 3
    2.  level 2
        1.  Level 3
1.  Level 1


this is a \:smile\: => :smile: emoji   

``` info_hideGutter_md
**Имя** компонента обязательно должно содержать хотя бы один дефис в соответствии с требованиями [стандарта HTML](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name)   
```

```javascript _run_line_edit_loadoda_console_[my-component.js]_

import '/components/buttons/icon/icon.js';

ODA({
    is: 'my-component',
    template: `
        <div ~for="items" ~is="$for.item.tag" ~props="$for.item"></div>
        <button @tap="_log">Console log</button>
    `,
    $public:{
        items:[
            {tag: 'oda-icon', icon: 'tools:magnify', iconSize: 96},
            {tag: 'oda-icon', icon: 'icons:android', iconSize: 64, fill: 'green'},
            {tag: 'oda-icon', icon: 'icons:alarm', iconSize: 32, fill: 'orange'}
        ]
    },
    ready() {
        alert('ready ... ')
    },
    attached() {
        alert('attached ... ')
        setTimeout(() => {
            console.log('iframe-log')
        }, 500);
    },
    _log() {
        alert('log ... ')
        console.log(new Date());
    }
});

```

Для примера в шаблоне данного компонента задана кнопка, в обработчике нажатия **\_onTap** которой значение 
счетчика **\_count** увеличивается на единицу. В свойстве **text** объявлен метод с именем **get**, который и является геттером. Этот метод будет вызываться не только при обращение к свойству для чтения, как это указано в шаблоне компонента с помощью директивы **{{ }}**, но и при любом изменении связанного с ним свойства из-за механизма реактивности.

Начальное значение свойства **text**, указанное в параметре **default**, будет присвоено свойству только при создании компонента. После этого значение свойства будет формироваться уже геттером. При этом его начальное значение будет потеряно в любом случае, так как при первом обращении к свойству оно будет переписано геттером.

Значение выражения в двойных фигурных скобках подставляется как простой текст, а не как HTML-код. 
Если необходимо, чтобы вместо текста выводился сырой HTML-код необходимо использовать специальную директиву **~html**.

```xml _[welcome-component.css]_line_edit_
<style>
    * { 
        color: orange;
    }
</style>
```

```html run_line_copy_info_edit_{welcome-component.css}
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Template</title>
        <script type="module" src="/oda.js"></script>
    </head>
    <body>
        <my-component></my-component>
        <script type="module">
            ODA({
                is: 'my-component',
                template: `
                    <p>{{text}}</p>
                    <p ~html="text"></p>
                `,
                $public: {
                    text: '<span style="color: red"> Текст должен быть красным</span>'
                }

            });
        </script>
    </body>
</html>
```

Содержимое второго тега **p** в данном примере будет заменено значением свойства **text**, интерпретированного как обычный HTML. В первом теге **p** свойство **text** интерпретируется как обычный текст.

Важно помнить html-коде все внутренние привязки игнорируются.

``` info_nocopy_md
Директиву **HTML** нельзя использовать для ~~вложения~~ шаблонов друг в друга. Вместо этого нужно использовать компоненты, позволяющие объединять и повторно использовать элементы UI.
```

``` warning_nocopy_md
Динамическая отрисовка произвольного HTML-кода на сайте крайне опасна, так как может легко привести к XSS-уязвимостям. Используйте интерполяцию HTML только для доверенного кода, и никогда не подставляйте туда содержимое, создаваемое пользователями.
```


``` warning_nocopy_md
This is WARNING message ...
This is WARNING message ...
This is WARNING message ...
This is WARNING message ...
```

``` error_nocopy_md
This is ERROR message ...
```

``` success_nocopy_md
This is SUCCESS message ...
```

``` info_nocopy_md
This is INFO message ...
```

``` help_nocopy_md
This is HELP message ...
```

``` like_nocopy_md
This is LIKE message ...
```

``` faq_nocopy_md
This is FAQ message ...
```

### Demo Highlighting <span style="color:orange">ODA framework</span> code on Markdown

Создадим первый компонент **Hello, World!**

```html run_line_edit_copy_[welcome-component.html]
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>WELCOME</title>
        <script type="module" src="/oda.js"></script>
    </head>
    <body>
        <welcome-component></welcome-component>
        <script type="module">
          ODA({
              is: 'welcome-component',
              template:`<span>{{text}}</span>`,
              $public: {
                    text: 'Hello, World !!!'
              }
          });
        </script>
    </body>
</html>
```

```javascript _edit_line_run_copy_[welcome-component.js]
ODA({
    is: 'welcome-component',
    template:`<span>{{text}}</span>`,
    $public: {
        text: 'Hello, World !!!'
    }
});
```

```javascript _edit_line_copy_[base-component1.js]
ODA({
    is: 'base-component1',
    template: `
        <div>Parent 1</div>
    `
});
```

```javascript _edit_line_copy_[base-component2.js]
ODA({
    is: 'base-component2',
    template: `
        <div>Parent 2</div>
    `
});
```

```javascript _edit_line_run_copy_[derived-component.js]_{base-component1.js_base-component2.js_welcome-component.css}
ODA({
    is: 'derived-component',
    extends: 'base-component1, base-component2',
    template: `
        <div>Descendant</div>
    `
})
```

```html _edit_line_run_copy_{welcome-component.js_welcome-component.css}
<welcome-component></welcome-component>
```
