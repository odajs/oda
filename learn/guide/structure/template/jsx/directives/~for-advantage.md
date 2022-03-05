Директива **~for** используется для создания последовательности HTML-элементов на основе массива данных.

По сравнению с классическим подходом, использование этой директивы значительно облегчает создание однотипных HTML-элементов, уменьшает объем кода и потенциальную возможность ошибок.

Покажем это на примере создания трех элементов **div** содержащих случайные числа.

Код классического подхода будет иметь вид:

```html run_edit
<button onClick='threeNewDigits();'>Get Three Digits</button>
<script>
    threeNewDigits();
    function threeNewDigits() {
        var digits=[];
        for( var i=0 ; i<3 ; ++i )
            digits[i] = Math.floor( Math.random() * 10 );
        digits.forEach( (item,index)=>{
            var div = document.getElementById( "div" + index );
            if( div == null ) {
                div = document.createElement( "div" );
                div.id = "div" + index;
                document.body.append(div);
            }
            div.innerText = "Случайная цифра[" + index + "]: " + item;
        })
    }
</script>
```

Как видно из примера, помимо получения самих случайных чисел программисту необходимо написать код для организации перебора массива случайных чисел, код создания элементов **div** для визуализации чисел и код для их обновления на странице.

Сравним с примером, использующим директиву **~for**:

```javascript _run_edit_[my-component.js]
ODA({
    is:'my-component',
    template: `
        <button @Click='threeNewDigits'>Get Three Digits</button>
        <div ~for="digits">Случайная цифра[{{index}}]: {{item}}</div>
    `,
    props: {
        digits: []
    },
    ready() {
        this.threeNewDigits();
    },
    threeNewDigits() {
        for( var i=0 ; i<3 ; ++i )
            this.digits[i] = Math.floor( Math.random() * 10 );
    }
});
```

Как видно из примера программисту необходимо написать JS-код только для получения случайных чисел. Для перебора и визуализации чисел требуется **один** HTML-тег  **div** с директивой **~for**. За отображением обновленных чисел следит фреймворк без участия программиста.

Еще раз сравним объем кода требуемого для решения данной задачи классическим способом:

```javascript
function threeNewDigits() {
    var digits=[];
    for( var i=0 ; i<3 ; ++i )
        digits[i] = Math.floor( Math.random() * 10 );
    digits.forEach( (item,index)=>{
        var div = document.getElementById( "div" + index );
        if( div == null ) {
            div = document.createElement( "div" );
            div.id = "div" + index;
            document.body.append(div);
        }
        div.innerText = "Случайная цифра[" + index + "]: " + item;
    })
}
```

и с помощью директивы **~for**:

```html
<div ~for="digits">Случайная цифра[{{index}}]: {{item}}</div>
threeNewDigits() {
    for( var i=0 ; i<3 ; ++i )
        this.digits[i] = Math.floor( Math.random() * 10 );
}
```

На лицо кардинальное уменьшение и упрощение кода. 5 строк вместо 14. Кроме того, использование для визуализации HTML-тега вместо «голого» JS-кода значительно облегчает оценку программистом ожидаемого результата.
