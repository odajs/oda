﻿Чтобы у свойства, добавленного с помощью функции **ROCKS**, появилась дополнительная функциональность, необходимо при объявлении свойства указать соответствующие модификаторы. При этом формат объявления свойства принимает вид:

```javascript_md
имяСвойства: {
      имяМодификатора-1: значениеМодификатора-1,
      имяМодификатора-2: значениеМодификатора-2,
      ………
}
```

Создаваемый класс может содержать большое количество свойств с одними и теми же модификаторами. В этом случае можно объединить свойства в группу, указав модификатор в качестве имени группы. Синтаксис объявления такой группы имеет вид:

```javascript_md
имяМодификатора-1: {
      имяСвойства-1: {
            имяМодификатора-2: значениеМодификатора-2,
            имяМодификатора-3: значениеМодификатора-3,
            ………
      },
      имяСвойства-2: {
            имяМодификатора-2: значениеМодификатора-2,
            имяМодификатора-3: значениеМодификатора-3,
            ………
      },
      ………
}
```

Такие группы можно вкладывать друг в друга:

```javascript_md
имяМодификатора-1: {
      имяМодификатора-2: {
            имяСвойства-1: {
                  имяМодификатора-4: значениеМодификатора-4,
                  ………
            },
            имяСвойства-2: {
                  имяМодификатора-4: значениеМодификатора-4,
                  ………
            },
            ………
      },
      имяМодификатора-3: {
            имяСвойства-3: {
                  имяМодификатора-4: значениеМодификатора-4,
                  ………
            },
            имяСвойства-4: {
                  имяМодификатора-4: значениеМодификатора-4,
                  ………
            },
            ………
      },
      ………
}
```

Например,

```javascript_hideGutter
$final: {
    $freeze: {
        prop1: "У меня нет реактивности",
        prop2: "У меня отключена реактивность"
    },
    $readOnly: {
        prop3: "Я доступен только по чтению",
        prop4: "Меня нельзя изменить"
    }
}
```

В данном примере в группе с общим модификатором **$final** объявлены четыре свойства, которые запрещено переопределять в наследниках. Свойства **prop1** и **prop2** дополнительно объединены в подгруппу с модификатором **$freeze**, отключающим у них реактивность. А свойства **prop3** и **prop4** объединены в подгруппу с модификатором **$readOnly**, и поэтому доступны только по чтению.

```warning_md
Обратите внимание, что для группировки можно использовать только модификаторы, имеющие единственное значение **«true»**.
```

Функция **ROCKS** поддерживает следующие модификаторы:

| Имя модификатора | *  | Назначение |
| :--------------- |:--:| :--------- |
| $def         | | Начальное значение свойства |
| $type        | | Тип свойства |
| get          | | Геттер свойства |
| set          | | Сеттер свойства |
| $freeze      | | Отключает реактивность у свойства |
| $readOnly    | | Указывает, что свойство является константой и его первоначальное значение изменять нельзя |
| $final       | | Указывает, что свойство нельзя переопределять в наследниках |
| $public      | | Указывает, что свойство является доступным за пределами компонента |
| $description | | Краткое описание свойства. Используется как всплывающая подсказка в инспекторе свойств компонента. Также используется для автоматической генерации раздела описания свойств в документации на компонент |
| $save        | | Указывает на необходимость сохранения текущего значения свойства и его восстановления в следующем сеансе работы |
| $label    | * | Надпись (метка), которая будет отображаться в инспекторе свойств компонента вместо имени свойства |
| $group | * | Имя группы, в которой будет отображаться свойство в инспекторе свойств компонента |
| $list     | * | Перечень возможных значений свойства, появляющийся в выпадающем списке в инспекторе свойств компонента. Если не указан модификатор **$multiSelect**, то из списка можно выбрать только одно значение. Если указан, то в списке можно выделить и выбрать несколько значений. |
| $multiSelect | * | Используется совместно с модификатором **$list**. Позволяет выделить в списке несколько значений |
| $attr | * | Определяет будет ли имя свойства и его значение продублированы в качестве одноименного атрибута HTML-элемента самого компонента |
| $pdp | * | Указывает, что свойство напрямую доступно вложенным компонентам |
| $editor | * | Путь к компоненту, который является редактором значения свойства в инспекторе свойств компонента |
| $hidden | * | Запрещает отображать свойство в инспекторе свойств компонента |

```faq_md_hideicon
Примечание – Дополнительная функциональность свойств, добавляемая модификаторами, помеченными знаком «*****» (звездочка), доступна только при применении фреймворка **ROCKS** в составе фреймворка **ODA**.
```

Обратите внимание, что имена модификаторов начинаются с символа **$** (символ доллара). Это облегчает чтение кода, т.к. позволяет визуально отделить модификаторы от вложенных свойств.

Также в классе можно объявить специальное свойство **$observers**, которое представляет собой массив функций. Эти функции автоматически вызываются при изменении значений зарегистрированных в них свойств класса.
