Модификаторы позволяют изменять характер обработки соответствующих событий.

Они указываются в директиве **@** после имени события через точку.

В настоящее время используется только два таких модификатора:

1. **stop** — останавливает дальнейшее всплытие события.
2. **prevent** — запрещает обработку события по умолчанию.

Модификатор **stop** указывает, что в обработчике события необходимо вызвать метод **stopPropagation**, который запретит дальнейшее всплытие события в браузере.

Например:

```javascript _run_edit_console_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <label>Меня нажали {{count}} раз</label>
        <input type="checkbox" @tap="_onTap">
    `,
    props: {
        count: 0
    },
    _onTap(e) {
        this.count++;
    },
    listeners: {
        tap(e) {
           this.count++;
        }
    }
});
```

В этом примере при каждом щелчке по элементу **checkbox** счетчик будет увеличен на единицу дважды: первый раз при обработке события на самом элементе **checkbox**, а второй раз — при обработке в слушателе компонента в процессе всплытия.

Однако если у события указать модификатор **stop**, то при каждом щелчке мыши счетчик будет увеличиваться на единицу только один раз из-за того, что событие всплывать больше не будет, и соответствующий слушатель никогда больше не выполнится.

```javascript _run_edit_console_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <label>Меня нажали {{count}} раз</label>
        <input type="checkbox" @tap.stop="_onTap">
    `,
    props: {
        count: 0
    },
    _onTap(e) {
        this.count++;
    },
    listeners: {
        tap(e) {
           this.count++;
        }
    }
});
```

Модификатор **prevent** отменяет нативную обработку события, если она задана у HTML-элемента по умолчанию. Фактически этот модификатор приводит к вызову метода **preventDefault** у события.

Например, если этот модификатор указать у элемента **checkbox**, то обработка события щелчка мыши по умолчанию на нем будет отменена. В результате этого галочка устанавливаться и убираться автоматически у него уже не будет.

```javascript _run_edit_console_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <label>Меня нажали {{count}} раз</label>
        <input type="checkbox" @tap.prevent="_onTap">
    `,
    props: {
        count: 0
    },
    _onTap(e) {
        this.count++;
    },
    listeners: {
        tap(e) {
           this.count++;
        }
    }
});
```

Если у события нужно указать оба модификатора, то их имена следует записать последовательно друг за другом через точку в любом порядке.

Например:

```javascript _run_edit_console_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <label>Меня нажали {{count}} раз</label>
        <input type="checkbox" @tap.stop.prevent="_onTap">
    `,
    props: {
        count: 0
    },
    _onTap(e) {
        this.count++;
    },
    listeners: {
        tap(e) {
           this.count++;
        }
    }
});
```

В этом случае будут отменены как выполнение события по умолчанию, так и процесс всплытия исходного события. Т.е. счетчик будет увеличиваться на единицу только один раз, а галочка появляться не будет.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/c05qvFibTBM?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
