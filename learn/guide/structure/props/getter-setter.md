Геттер и сеттер можно задавать у любого свойства одновременно.

Однако с их помощью нельзя осуществлять доступ к данным самого свойства. При такой попытке будет возникать бесконечная рекурсия, так как и геттер и сеттер будут вызывать сами себя до бесконечности.

Например:

```javascript _run_edit_console_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <input :value="fullName">
        <div>{{fullName}}</div>
    `,
    props: {
        fullName: {
            default: 'Иванов Николай',
            get() {
                return this.fullName;
            },
            set(n) {
                this.fullName = n;
            }
        }
    }
});
```

В этом примере ввод любого значения приведет к переполнению стека из-за возникновения бесконечной рекурсии. В этом можно убедиться, открыв консоль в инструментах разработчика браузера. В результате этого свойство **fullName** изменяться не будет, и текст в элементе **div** не появится.

Однако данные можно хранить в одних свойствах, а формировать их ввод и вывод в геттерах и сеттерах других свойств.

```javascript _run_edit_[my-component.js]
 ODA({
    is: 'my-component',
    template: `
        <input ::value="fullName">
        <div>Фамилия {{lastName}}</div>
        <div>Имя {{firstName}}</div>
    `,
    props: {
        firstName: 'Николай',
        lastName: 'Иванов',
        fullName: {
            get() {
                return this.lastName + ' ' + this.firstName;
            },
            set(n) {
                if (n) {
                    let names = n.split(' ');
                    this.lastName = names[0];
                    this.firstName = names[names.length - 1];
                }
            }
        }
    }
});
```

Как видно из этого примера, геттер и сеттер свойства **fullName** обращаются только к свойствам **firstName** и **lastName**, которые хранят непосредственно данные. Само свойство **fullName** данные не хранит, а только формирует их. При вводе сеттер будет сохранять значение в свойствах **firstName** и **lastName**, а при выводе — геттер будет формировать из них полное имя. Сами геттер и сеттер к своему свойству не обращаются. В результате никаких ошибок не возникает. Значения всех свойств будут изменяться динамически.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/fxk6FzfX1D4?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
