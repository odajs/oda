﻿Свойство компонента можно задать в расширенной форме, в которой значение свойства записывается в виде объекта со специальными модификаторами.

Например,
```javascript _run_edit_console_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <input ::value="num">
        <div>Введено число: {{num}}</div>
    `,
    $public: {
        num: {
            $type: Number
        }
    }
}); 
```

В примере использован модификатор **type**, явно указывающий тип **Number** для свойства **num**. В результате любая вводимая строка автоматически преобразуется в число.

Модификаторы свойства определяют его поведение. Их имена строго определены и представлены в следующей таблице вместе с их функциональным назначением.

| Имя модификатора   | Назначение |
| :----------------  | :-------------------------------------------------------------------------------------------------------------------- |
| default            | Начальное значение свойства |
| type               | Тип или возможные типы свойства |
| reflectToAttribute | Определяет будет ли имя свойства и его значение продублированы в качестве одноименного атрибута HTML-элемента самого компонента |
| notify             | Если установлено значение true, то при изменении свойства будет сгенерировано событие «имя-свойства-changed», передаваемое родительскому компоненту |
| label              | Надпись (метка), которая будет отображаться в инспекторе свойств компонента вместо имени свойства |
| list               | Перечень возможных значений свойства, появляющихся в выпадающем списке, из которого можно выбрать только одно из них |
| category           | Категория свойства, определяющая метод группировки свойств в инспекторе свойств компонента |
| save               | Указывает на необходимость сохранения текущего значения свойства и его восстановления в следующем сеансе работы |

