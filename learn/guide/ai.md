Искусственный интеллект «**Artificial Intelligence**» – это свойство интеллектуальных систем выполнять творческие функции, которые традиционно считаются прерогативой человека.

Продемонстрируем эти свойства на примере игры динозавр «T-Rex», научив компьютер автоматически принимать решение о необходимости прыжка динозавра через кактус.

Для этого добавим к обычной игре js-модуль «**neural-net**», в котором объявим класс «**NeuralNetwork**» для представления нейронной сети.

```javascript
export class NeuralNetwork
{
    constructor (topology, clone)
    {
        this.theTopology = topology;
        this.sections = new Array(this.theTopology.length - 1);
        if (clone) return;
        for (let i = 0; i < this.sections.length; i++) {
            this.sections[i] = new NeuralSection(this.theTopology[i], this.theTopology[i + 1]);
        }
    }
    clone() {
        const clone = new NeuralNetwork(this.theTopology, true);
        for (let i = 0; i < this.sections.length; i++) {
              clone.sections[i] = this.sections[i].clone();
        }
        return clone;
    }
    feedForward(input)
    {
        let output = input;
        for (let i = 0; i < this.sections.length; i++) {
            output = this.sections[i].feedForward(output);
        }
        return output;
    }
    mutate (mutationProbability = 0.05, mutationAmount = 1.0) {
        for (let i = 0; i < this.sections.length; i++) {
            this.sections[i].mutate(mutationProbability, mutationAmount);
        )
    }
    cost = 0;
}
```

В данном классе задается топология сети. Ее архитектура передается конструктору класса в виде массива с именем «**topology**» в списке параметров.

```javascript
constructor (topology, clone)
```

Длина этого массива определяет количество слоев нейросети, а значение каждого элемента этого массива определяет количество нейронов на каждом из этих слоев.

Переданное значение этой топологии сохраняется в свойстве «**theTopology**» данного класса для использования в других методах.

```javascript
this.theTopology = topology;
```

Второй параметр «**clone**» предусматривает досрочный выход из конструктора без инициализации созданных слоев сети при условии, что он будет иметь значение «**true**».

```javascript
if (clone) return;
```

В противном случае каждый слой создается отдельно с помощью конструктора специального класса «**NeuralSection**».

```javascript
 for (let i = 0; i < this.sections.length; i++) {
    this.sections[i] = new NeuralSection(this.theTopology[i], this.theTopology[i + 1]);
}
```

Метод «**clone**» позволяет создать клон текущей нейросети. Для этого в нем создается новая сеть с помощью предыдущего конструктора, но веса нейронов на каждом слое задаются такими же, как и веса нейронов текущей сети.

```javascript
clone() {
    const clone = new NeuralNetwork(this.theTopology, true);
    for (let i = 0; i < this.sections.length; i++) {
            clone.sections[i] = this.sections[i].clone();
    }
    return clone;
}
```

Метод «**feedForward**» позволяет найти значение на выходе сети, используя переданное ему значение на ее входе. Для этого он последовательное передает входные значения на каждом слое и получает его выходные значения, передавая их в качестве входных значений следующим слоям пока не получит окончательный результат на последнем слое.

```javascript
feedForward(input)
{
    let output = input;
    for (let i = 0; i < this.sections.length; i++) {
        output = this.sections[i].feedForward(output);
    }
    return output;
}
```

Метод  «**mutate**» позволяет изменить веса сети с заданной вероятностью. По умолчанию в нем вероятность мутаций задается равной 0.05 и передается для мутации весов на всех слоях.

```javascript
mutate (mutationProbability = 0.05, mutationAmount = 1.0) {
    for (let i = 0; i < this.sections.length; i++) {
        this.sections[i].mutate(mutationProbability, mutationAmount);
    )
}
```

Для выбора лучшей сети в классе «**NeuralNetwork**» предусмотрено свойство «**cost**», которое изначально задается равным нулю.

Каждый слой нейронов представляет собой объект класса «**NeuralSection**», который объявляется в том же самом модуле, что и класс «**NeuralNetwork**» следующим образом:

```javascript
export class NeuralSection
{
    constructor (inputCount=0, outputCount)
    {
        this.weights = new Array(inputCount + 1); // +1 для нейрона смещения
        for (let i = 0; i < this.weights.length; i++) {
            this.weights[i] = new Array(outputCount);
        }
        for (let i = 0; i < this.weights.length; i++)
            for (let j = 0; j < this.weights[i].length; j++)
                this.weights[i][j] = Math.random() - 0.5;
    }

    clone() {
        const clone = new NeuralSection();
        clone.weights = new Array(this.weights.length);

        for (let i = 0; i < this.weights.length; i++) {
            clone.weights[i] = new Array(this.weights[i].length);
        }

        for (let i = 0; i < this.weights.length; i++) {
            for (let j = 0; j < this.weights[i].length; j++) {
                    clone.weights[i][j] = this.weights[i][j];
            }
        }
        return clone;
    }

    feedForward(input) {
        let output = new Array(this.weights[0].length);
        output.fill(0);
        for (let i = 0; i < this.weights.length; i++) {
            for (let j = 0; j < this.weights[i].length; j++) {
                if (i === this.weights.length - 1)
                    output[j] += this.weights[i][j];
                else
                    output[j] += this.weights[i][j] * input[i];
            }
        }

        for (let i = 0; i < output.length; i++)
            output[i] = ReLU(output[i]);
        return output;
    }

    mutate (mutationProbability, mutationAmount) {
        for (let i = 0; i < this.weights.length; i++) {
            for (let j = 0; j < this.weights[i].length; j++) {
                if (Math.random() < mutationProbability)
                    this.weights[i][j] = (Math.random()) * (mutationAmount * 2) - mutationAmount;
            }
        }
    }
}

```

В этом классе конструктору передаются два параметра:

```javascript
constructor (inputCount=0, outputCount)
```

1. «**inputCount**» – количество входных нейронов.
1. «**outputCount**» – количество выходных нейронов.

Для каждого входного нейрона создается массив весов, которые связывают его со всеми выходными нейронами.

```javascript
this.weights = new Array(inputCount + 1);
```

Массив весов задается на единицу больше количества входных нейронов из-за необходимо задания нейрона смещения. На вход этого нейрона всегда подается входной сигнал равный единицы во избежании отсутствия реакции нейросети на изменение весов при нулевых входных сигналах.

Для каждого входного нейрона формируется массив весов, который будет связывать входной нейрон со всеми выходными нейронами.

```javascript
for (let i = 0; i < this.weights.length; i++) {
    this.weights[i] = new Array(outputCount);
}
```

Все веса по умолчанию задаются случайными значениями в диапазоне от -0.5 до 0.5.

```javascript
    for (let i = 0; i < this.weights.length; i++)
        for (let j = 0; j < this.weights[i].length; j++)
            this.weights[i][j] = Math.random() - 0.5;
}
```

Для клонирования лучшей нейросети в классе «**NeuralSection**» предусмотрим метод «**clone**».

```javascript
 clone() {
    const clone = new NeuralSection();
    clone.weights = new Array(this.weights.length);

    for (let i = 0; i < this.weights.length; i++) {
        clone.weights[i] = new Array(this.weights[i].length);
    }

    for (let i = 0; i < this.weights.length; i++) {
        for (let j = 0; j < this.weights[i].length; j++) {
                clone.weights[i][j] = this.weights[i][j];
        }
    }
    return clone;
}
```

В нем создается новый слой, весам которого присваиваются на случайные значения, а значения весов текущего слоя, в отличие от предыдущего конструктора.

Метод «**feedForward**» позволяет найти выходное значение, которое должно быть на всех нейронах текущего слоя.

```javascript
feedForward(input) {
    let output = new Array(this.weights[0].length);
    output.fill(0);
    for (let i = 0; i < this.weights.length; i++) {
        for (let j = 0; j < this.weights[i].length; j++) {
            if (i === this.weights.length - 1)
                output[j] += this.weights[i][j];
            else
                output[j] += this.weights[i][j] * input[i];
        }
    }

    for (let i = 0; i < output.length; i++)
        output[i] = ReLU(output[i]);
    return output;
}
```

Для этого выходные значения находятся как сумма произведений весов соответствующих нейронов на их входные сигналы. Здесь считается, что на нейрон смещения всегда подается единичные сигнал, поэтому его веса ни на что не умножаются.

Окончательно выходной сигнал каждого нейрона преобразуется с помощью функции активации «**ReLU**». Она задает нормированную форму выходного сигнала. Существуют разные способы ее задания. В нашем случае ее можно задать следующим образом:

```javascript
function ReLU(x) {
    if (x >= 0)
        return x;
    else
        return x / 20;
}
```

Фактически это обычная линейная зависимость, которая уменьшает влияние отрицательных выходных значений в двадцать раз.

Для изменения весов нейросети предусмотрен метод «**mutate**».

```javascript
mutate (mutationProbability, mutationAmount) {
    for (let i = 0; i < this.weights.length; i++) {
        for (let j = 0; j < this.weights[i].length; j++) {
            if (Math.random() < mutationProbability)
                this.weights[i][j] = (Math.random()) * (mutationAmount * 2) - mutationAmount;
        }
    }
}
```

В нем веса изменяются в диапазоне от -mutationAmount до +mutationAmount с заданной вероятностью «**mutationProbability**». Все эти значения передаются в списке параметров и задаются в одноименном методе «**mutate**» класса «**NeuralNetwork**». В результате этого некоторые веса нейронов данного слоя будет задаваться заново в указанном диапазоне, позволяя нейросети найти лучшее решение.

Для обучения этой нейросети используем игру «**Динозавр T-Rex**», которая была создана в уроке «**Мой первый компонента**».

С этой целью модифицируем основной файл игры «**oda-game.js**».

Сначала подключим к нему класс нейросети «**NeuralNetwork**».

```javascript
import {NeuralNetwork} from './neural-net.js';
```

В шаблоне компонента игры «**oda-game**» зададим не одного, а целую популяцию динозавров.

```javascript
<h1>Счет игры</h1>
<h1 id="score">{{score || '0'}}</h1>
<div id="game-space" ref="game-space">
    <h1 id="message" ~show="showMessage">{{message}}</h1>
    <oda-dino ~for="showDinos" ~show="item" ~ref="index || '0'">{{index || "0"}}</oda-dino>
    <div id="horizon"></div>
</div>
```

Для этого будет использовать директиву «**~for**» фреймворка «**ODA**». В этой директиве указывается массив «**showDinos**», который определяет как и количество динозавров в каждой популяции, так и необходимость их отображения.
Этот массив задается в виде отдельного свойства в разделе «**props**» компонента «**oda-game**».

```javascript
props: {
    timerID: 1,
    score: 0,
    message: 'Для начала обучения нажмите пробел',
    showMessage: true,
    nextCloud: 0,
    nextCactus: 0,
    nextPterodactyl: 50,
    topology: [1,2],
    populationCount: 10,
    showDinos: [],
},
```

Количество динозавров в популяции задается свойством «**populationCount**» со значением по умолчанию равным 10.

Сам массив «**showDinos**» инициализируется в хуке «**ready**» следующим образом:

```javascript
ready() {
    this.showDinos = Array(this.populationCount).fill(true)
    this.bestBrain = new NeuralNetwork(this.topology);
    this.listen('keyup', 'startGame', {target: document});
},
```

Все элементы этого массива будут иметь значение «**true**», которое говорит, что всех динозавров в популяции нужно изначально отображать. В противном случае директива «**~show**» не отображала бы их в компоненте.

В хуке «**ready**» также задается свойство «**bestBrain**», в котором будет храниться лучшая нейросеть среди всех динозавров.

Для доступа к каждому отдельному динозавру создается уникальная ссылка не него с помощью директивы «**~ref**». Благодаря этому к каждому динозавру можно будет обратиться по его индексу в массиве «**showDinos**».

Для задание нейросети у каждого динозавра в их компоненте «**oda-dino**» нужно предусмотреть свойство «**dinoBrain**» в разделе «**props**».

```javascript
    props: {
        svg: {},
        audio: {},
        dinoBrain: {},
    },
```

В результате этого при создании популяции динозавров, основанной на лучшей нейронной сети, каждому динозавру можно задать свой собственный мозг. Это можно сделать с помощью специального метода «**createPopulation**» компонента «**oda-game**»

```javascript
createPopulation() {
    for (let i = 0; i < this.populationCount; i++) {
        const dino = this.$refs[i][0];
        dino.dinoBrain = this.bestBrain.clone();
        dino.dinoBrain.cost = 0;
    }
},
```

При создании новой сети ее начальная стоимость обнуляется, а веса лучшей сети мутируют в методе «**clone**».

Создание популяции осуществляется и при создании игры и при гибели всех динозавров.

Для этого в методе «**startGame**» добавлен вызов метода «**createPopulation**».

```javascript
startGame() {
    this.createPopulation();
    this.showMessage = false;
    this.timerID = setInterval(() => {
        this.score++;
    }, 100);
    requestAnimationFrame(this.checkDino.bind(this));
},
```

Кроме этого:

1. Прячется надпись о необходимости нажатия пробела для начала обучения нейросети.

```javascript
this.showMessage = false;
```
2. Запускается таймер набранных очков.

```javascript
this.timerID = setInterval(() => {
    this.score++;
}, 100);
```
3. Вызывается метод определения столкновения динозавров с кактусами «**checkDino**».


Этот метод нужно задать у компонента «**oda-game**» следующим образом:

```javascript
 checkDino() {
    if (this.showDinos.every((value) => !value)) {
        this.score = 0;
        this.nextCactus = 0;
        this.newPopulation();
    }
    this.createCloud();
    this.createCactus();
    this.createPterodactyl();
    let cactuses = this.gameSpace.querySelectorAll('oda-cactus');
    for (let i = 0; i < this.populationCount; i++) {
        if (this.showDinos[i]) {
            const dino = this.$refs[i][0];
            for (let j = 0; j < cactuses.length; j++) {
                let cactusCoords = cactuses[j].getBoundingClientRect();
                let dinoCoords = dino.getBoundingClientRect();
                if (cactusCoords.x + cactusCoords.width < dinoCoords.x )
                    continue;
                if (dino.isIntersection && dino.isIntersection(cactuses[j])) {
                    dino.dinoBrain.cost = this.score;
                    this.changeBestBrain(dino.dinoBrain);
                    dino.stopJump();
                    this.showDinos[i] = false;
                    break;
                }
                else {
                    dino.jump2(cactuses[j])
                }
            }
        }
    }
   requestAnimationFrame(this.checkDino.bind(this));
},
```

В нем проверяется не удалены ли все динозавры в результате их столкновения с кактусами с помощью метода «**every**» массива «**showDinos**». Если они будут все удалены, то тогда:

1. Обнуляется счетчик очков.
1. Обнуляется время появления следующего кактуса.
1. Создается новая популяции динозавров с помощью метода «**newPopulation**».

Метод «**newPopulation**» необходимо добавить к компоненту «**oda-game**» следующим образом:

```javascript
newPopulation() {
    let cactuses = this.gameSpace.querySelectorAll('oda-cactus');
    cactuses.forEach((cactus) => cactus.remove());
    this.showDinos.fill(true);
    this.createPopulation();
},
```

В нем:

1. Удаляются все кактусы, которые были созданы до этого.
1. Отображаются заново все скрытые динозавры присвоением всем элементам массива «**showDinos**» значения «**true**» с помощью метод «**fill**».
1. Вызывается метод «**createPopulation**», в котором у каждого динозавра задается новая нейросеть на основе лучшей нейросети, хранящейся в свойстве «**bestBrain**» компонента «**oda-game**».

Если не все динозавры столкнулись с кактусами, то метод «**checkDino**» продолжает проверку это факта.

```javascript
let cactuses = this.gameSpace.querySelectorAll('oda-cactus');
for (let i = 0; i < this.populationCount; i++) {
    if (this.showDinos[i]) {
        const dino = this.$refs[i][0];
        for (let j = 0; j < cactuses.length; j++) {
            let cactusCoords = cactuses[j].getBoundingClientRect();
            let dinoCoords = dino.getBoundingClientRect();
            if (cactusCoords.x + cactusCoords.width < dinoCoords.x )
                continue;
            if (dino.isIntersection && dino.isIntersection(cactuses[j])) {
                dino.dinoBrain.cost = this.score;
                if (dino.dinoBrain.cost > this.bestBrain.cost) {
                    this.bestBrain.cost = dino.dinoBrain.cost
                    this.bestBrain.clone(dino.dinoBrain);
                }
                dino.stopJump();
                this.showDinos[i] = false;
                break;
            }
            else {
                dino.jump2(cactuses[j])
            }
        }
    }
}
```

Для этого он получает список всех кактусов и для каждого из них проверяет не пересекаются ли их координаты с координатами очередного еще отображаемого динозавра. Если координаты пересекаются, то

1. Фиксируется у текущего динозавра количество набранных его нейросетью очков.

```javascript
dino.dinoBrain.cost = this.score;
```

2. Проверяется не стала ли стоимость текущей сети больше стоимости лучшей сети.

```javascript
if (dino.dinoBrain.cost > this.bestBrain.cost) {
    this.bestBrain.cost = dino.dinoBrain.cost
    this.bestBrain.clone(dino.dinoBrain);
}
```

Если стала, то текущая нейросеть становится лучшей.

3. Останавливается анимация прыжка этого динозавра с помощью метода «**stopJump**».

Этот метод нужно определить в компоненте «**oda-dino**» следующим образом:

```javascript
stopJump(){
    this.classList.remove("dino-jump");
    this.offsetHeight; // reflow
    this.svg.unpauseAnimations();
},
```

4. Скрывается текущий динозавр, заданием для него в массиве «**showDinos**» значения «**false**».

```javascript
this.showDinos[i] = false;
```

5. Прекращается дальнейшая проверка столкновения этого динозавра с другими кактусами с помощью директивы «**break**».

Если пересечений динозавра с кактусами не было, то проверяется с помощью нейросети необходимость совершения прыжка динозавром. Для этого используется метод «**jump**», который нужно задать в компоненте «**oda-dino**» следующим образом:

```javascript
jump(cactus) {
    if (this.classList.contains("dino-jump"))
        return;
    const cactusCoords = cactus.getBoundingClientRect();
    const dinoCoords = this.getBoundingClientRect();
    const inputs = [[this.map( cactusCoords.x - dinoCoords.x - dinoCoords.width, this.parentNode.offsetLeft + dinoCoords.x + dinoCoords.width, this.parentNode.offsetLeft + this.parentNode.offsetWidth - dinoCoords.x - dinoCoords.width , 0, 1)]];
    const result = this.dinoBrain.feedForward(inputs[0]);
    if (result[1]  > result[0]) {
        this.classList.add("dino-jump");
        this.svg.pauseAnimations();
        this.getAnimations().forEach((anim, i, arr) => {
            anim.onfinish = () => {
                this.classList.remove("dino-jump")
                this.offsetHeight; // не удаляй reflow
                this.svg.unpauseAnimations();
            }
        });
    }
},
```

Прыжок динозавра задается добавлением к его компоненту «**oda-dino**» CSS-класса «**dino-jump**». Если этот класс уже был добавлен, то никаких действий этот метод не осуществляет и сразу происходит выход из него.
В противном случае находятся координаты кактуса и динозавра, по которым определяется текущее расстояние между ними по следующей формуле:

```javascript
cactusCoords.x - dinoCoords.x - dinoCoords.width
```

Для нормирования уровня входного сигнала в компоненте «**oda-dino**» нужно определить специальный метод «**map**» следующим образом:

```javascript
map (n, start1, stop1, start2, stop2) {
    return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
},
```

Он преобразует заданный вход сигнал «**n**» в диапазоне от «**start1**» до «**stop1**» в тот же самый сигнал, но уже в диапазоне от «**start2**» до «**stop2**».

В результате этого расстояние между кактусами можно нормировать так, чтобы оно всегда было в пределах от 0 до 1, как это и сделано в методе «**jump**».

После этого, получают сигнал на выходных нейронах сети с помощью метода «**feedForward**» класса «**NeuralNetwork**».

Если сигнал на втором выходном нейроне окажется больше чем сигнал первого нейрона, то принимается решение о необходимо прыжка динозавра через кактус. В противном случае метод «**jump**» никаких действий больше выполнять не будет. Если же решение о прыжке было принято, то

 this.classList.add("dino-jump");
        this.svg.pauseAnimations();
        this.getAnimations().forEach((anim, i, arr) => {
            anim.onfinish = () => {
                this.classList.remove("dino-jump")
                this.offsetHeight; // не удаляй reflow
                this.svg.unpauseAnimations();
            }
        });
1. К компоненту динозавра добавляется CSS-класс прыжка «**dino-jump**».

```javascript
this.classList.add("dino-jump");
```

2. Останавливается анимация движения ног динозавра.

```javascript
this.svg.pauseAnimations();
```

3. Задается функция обратного вызова «**onfinish**», которая будет выполняться после окончания прыжка динозавра.

```javascript
this.getAnimations().forEach((anim, i, arr) => {
    anim.onfinish = () => {
        this.classList.remove("dino-jump")
        this.offsetHeight; // не удаляй reflow
        this.svg.unpauseAnimations();
    }
});
```

В ней удаляется CSS-класс «**dino-jump**», задающий анимацию прыжка динозавра, и возобновляется анимация движения ног динозавра методом «**unpauseAnimations**».

После всего этого нужно запустить игру в браузере и подождать некоторое время, пока динозавр не научится автоматически перепрыгивать через кактусы на своих собственных ошибках.

На первых этапах игры все динозавры разбиваются об кактусы, не совершая каких-либо прыжков. Затем появляются динозавры, которые начинают хаотически прыгать, иногда случайно перепрыгивая через кактусы. После этого, могут появится читеры, которые постоянно прыгают, найдя более или менее приемлемое решение данной задачи. Однако потом и они разбиваются об какой-то кактус. На основе таких попыток нейросеть в конце концов находится действительно правильное решение, когда динозавр не прыгает хаотично, а подбегая поближе к кактусу совершает осмысленный прыжок через него.

