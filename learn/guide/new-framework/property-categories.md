Любые свойства объявленные внутри другого свойства в новом фреймворке будет принадлежать одной и той же категории.

Например,

```javascript
class myFirstClass extends ROCKS({
        my_category: {
            x: { $def: 10 },
            y: { $def: 20 }
        },
        next_category: {
            z: { $def: 30 }
        }
    }) {
        constructor(name) {
            super();
            this.name = name;
        }
    }
```

В этом примере свойства **x** и **y** будут принадлежать категории «**my_category**», а свойство **z** будет принадлежать категории «**next_category**».