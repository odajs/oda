Для создания справочных материалов используется облегченный язык разметки «**Markdown**», который позволяет форматировать электронные документы так, чтобы их исходный текст оставался максимально читаемым человеком после его разметки.

Подробно ознакомиться с полным синтаксисом этой разметки можно в нашем кратком [руководстве по «**Markdown**»](https://odajs.org/#learn/guide/doc-principles/help-for-help.md "Руководство по Markdown").

Все файлы, размеченные в этом формате, должны иметь стандартное расширение «**.md**».

Их можно располагать в разных папках. Иерархическая структура папок и методика динамического формирования оглавления на их основе подробно изложена в учебном материале [«**Формирование оглавления**»](https://odajs.org/#learn/guide/doc-principles/content-for-help.md "Формирование оглавления").

Применительно к справочной системе стандартный синтаксис разметки блока подсветки кода «**Markdown**» был расширен специальными элементами оповещения.

Например, элемент оповещения «**Информация**».

```info md
Информация
```

Полный перечень всех элементов оповещения и синтаксис их задания приведен в материале [«**Элементы оповещения**»](https://odajs.org/#learn/guide/doc-principles/alert-elements.md "Элементы оповещения").

Кроме этого, стандартный синтаксис блока подсветки кода «**Markdown**» был расширен специальными модификаторами, которые позволяют существенно увеличить его функциональные возможности.

Например, модификатор «**run**» позволяет не только подсвечивать код, но и выполнять его.

```javascript run
    let newElement = document.createElement('div');
    newElement.innerHTML = '<input placeholder="Модификатор run">';
    document.body.append(newElement);
```

Ознакомится со всеми этими модификаторами можно подробно в учебном материале [«**Модификаторы редактора кода**»](https://odajs.org/#learn/guide/doc-principles/code-modifiers.md "Модификаторы редактора кода").

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/snRnJfQzysI?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>