Искусственный интеллект «**Artificial Intelligence**» — это свойство интеллектуальных систем выполнять творческие функции, которые традиционно считаются прерогативой человека.

Продемонстрируем это свойство на примере игры «**Динозавр T-Rex**», научив компьютер самостоятельно принимать решение о необходимости преодоления динозавром препятствий в виде кактусов.

Для этого к обычной игре «**Динозавр T-Rex**» добавим модуль «**neural-net**», в котором зададим класс нейронной сети «**NeuralNetwork**» следующим образом:

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
    mutate (mutationProbability = 0.2, mutationAmount = 1.0) {
        for (let i = 0; i < this.sections.length; i++) {
            this.sections[i].mutate(mutationProbability, mutationAmount);
        )
    }
    cost = 0;
}
```

Нейросеть в этом классе создается с помощью конструктора.

```javascript
constructor (topology, clone)
```

Этому конструктору передаются два параметра:

1. **«topology»** — это массив, элементы которого определяют архитектуру нейросети, задавая какое количество нейронов должно быть на каждом ее слое.

Для использования это массива в дальнейшем он сохраняется здесь в специально предусмотренном для этого свойстве «**theTopology**».

```javascript
this.theTopology = topology;
```

2. Параметр «**clone**» предусматривает возможность создания нейросети без инициализации ее слоев.

Если он будет иметь значение «**true**», то дальнейшее выполнение конструктора будет прервано.

```javascript
if (clone) return;
```

Это позволяет немного оптимизировать процесс клонировании нейросети, когда веса ее нейронов должны быть заданы не случайно, а на основе нейронов другой уже существующей сети.

Если параметр «**clone**» будет иметь значение «**false**», то все нейроны новой сети будут создаваться с помощью специально предусмотренного для этого класса «**NeuralSection**».

```javascript
for (let i = 0; i < this.sections.length; i++) {
    this.sections[i] = new NeuralSection(this.theTopology[i], this.theTopology[i + 1]);
}
```

Здесь каждый слой сети задается в виде отдельного объекта с типом «**NeuralSection**». При его создании указывается, какое количество входных и выходных нейронов должно быть на этом слое. В результате этого будут созданы все веса, соединяющие входные и выходные нейроны друг с другом. Эти веса будут иметь случайные значения в диапазоне от «-0.5» до «0.5».

Метод «**clone**» класса «**NeuralNetwork**» позволяет создать копию текущей нейросети. Для этого в нем создается новая сеть, но с той же самой архитектурой и с теми же весами нейронов, что и у текущей сети. Именно здесь конструктору передается параметр «**clone**» со значением «**true**», в результате чего нейроны в нем не будут инициализироваться случайными значениями.

```javascript
clone() {
    const clone = new NeuralNetwork(this.theTopology, true);
    for (let i = 0; i < this.sections.length; i++) {
            clone.sections[i] = this.sections[i].clone();
    }
    return clone;
}
```

Сам процесс клонирования осуществляется вызовом метода «**clone**», специально предусмотренного для этого в классе слоев «**NeuralSection**».

Метод «**feedForward**» позволяет найти значение на выходе нейросети в зависимости от значения на ее входе.

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

Для этого ему передается входное значение в виде параметра «**input**». С его помощью находится сигнал на выходе первого слоя, значение которого затем передается на вход следующего слоя, и так далее, пока не будет получено значение на выходе самого последнего слоя. Это значение и будет выходным значением всей нейросети.

Метод  «**mutate**» позволяет изменить веса нейронов текущей сети с заданной вероятностью. По умолчанию мутация нейронов в нем происходит с вероятностью 20 процентов.

```javascript
mutate (mutationProbability = 0.2, mutationAmount = 1.0) {
    for (let i = 0; i < this.sections.length; i++) {
        this.sections[i].mutate(mutationProbability, mutationAmount);
    )
}
```

Для выбора лучшей сети в классе «**NeuralNetwork**» предусмотрено отдельное свойство «**cost**», значение которого изначально равно нулю.

Каждый слой нейросети представляет собой объект класса «**NeuralSection**». Этот класс нужно объявить в том же самом модуле, что и класс «**NeuralNetwork**», следующим образом:

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

Конструктору этого класса передаются два параметра:

1. «**inputCount**» — количество нейронов на входе слоя.
1. «**outputCount**» — количество нейронов на выходе слоя.

На основе этой информации для каждого входного нейрона создается отдельный массив весов, который будет связывать этот нейрон со всеми выходными нейронами этого слоя.

```javascript
this.weights = new Array(inputCount + 1);
```

Размер этого массива задается на единицу больше количества входных нейронов для того, чтобы можно было бы задать дополнительный нейрон смещения. На вход этого фиктивного нейрона будет всегда подаваться единичный входной сигнал, чтобы избежать потери реакции сети на выходе при появления нулевых значений одновременно на всех ее входах. Кроме этого, нейрон смещения позволяет изменять целевую функции на выходе сети, давая возможность найти ей правильное решение.

Затем для каждого входного нейрона формируется массив весов, который будет связывать его со всеми выходными нейронами данного слоя.

```javascript
for (let i = 0; i < this.weights.length; i++) {
    this.weights[i] = new Array(outputCount);
}
```

После этого веса всех нейронов задаются случайными значениями в диапазоне от -0.5 до 0.5.

```javascript
    for (let i = 0; i < this.weights.length; i++)
        for (let j = 0; j < this.weights[i].length; j++)
            this.weights[i][j] = Math.random() - 0.5;
}
```

Для клонирования лучшей нейросети в классе «**NeuralSection**» нужно предусмотреть метод «**clone**».

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

В нем создается новый слой, веса которого формируются не случайно, а на основе весов текущего слоя.

Метод «**feedForward**» позволяет найти значение на выходе всех нейронов текущего слоя.

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

В нем выходные значения рассчитываются как сумма произведений входных сигналов на веса соответствующих нейронов. Здесь считается, что на нейрон смещения всегда подается единичный входной сигнал, поэтому его вес ни на что не умножается.

Окончательно выходной сигнал каждого нейрона нормализуется с помощью специальной функции активации «**ReLU**».

```javascript
function ReLU(x) {
    if (x >= 0)
        return x;
    else
        return x / 20;
}
```

Она фактически имеет линейную зависимость, уменьшая влияние отрицательные выходных сигналов в двадцать раз.

Для изменения весов каждого слоя предусмотрен метод «**mutate**».

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

В этом методе веса изменяются в диапазоне от «**-mutationAmount**» до «**+mutationAmount**» с заданной вероятностью «**mutationProbability**». Этот метод будет вызываться в одноименном методе «**mutate**» класса «**NeuralNetwork**», позволяя изменять некоторые веса нейронов случайным образом для того, что нейросеть смогла бы найти лучшее решение.

Для обучения этой нейросети будем использовать игру «**Динозавр T-Rex**» из урока «**Мой первый компонент**».

С этой целью модифицируем основной файл игры «**oda-game.js**» следующим образом:

Сначала подключим к нему класс нейросети «**NeuralNetwork**».

```javascript
import {NeuralNetwork} from './neural-net.js';
```

В шаблоне компонента игры «**oda-game**» зададим не одного, а целую популяцию динозавров.

```javascript
    <h1>Счет игры</h1>
    <h1 class="score">{{score || '0'}}</h1>
    <div id="game-space" ref="game-space">
        <h1 id="message" ~show="showMessage">{{message}}</h1>
        <oda-dino ~for="showDinos" ~show="item" ~ref="index || '0'">{{index || "0"}}</oda-dino>
        <div id="horizon"></div>
    </div>
```

Для этого будем использовать директиву «**~for**» фреймворка «**ODA**». В ней укажем имя массива «**showDinos**», который будет задавать необходимость отображения соответствующего динозавра. Этот массив нужно задать в виде отдельного свойства компонента «**oda-game**» в его разделе «**props**».

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
    populationSize: 10,
    showDinos: [],
    populationCount: 1,
    bestCost: 0,
},
```

Сам массив «**showDinos**» инициализируется в хуке «**ready**» следующим образом:

```javascript
ready() {
    this.showDinos = Array(this.populationSize).fill(true)
    this.bestBrain = new NeuralNetwork(this.topology);
    this.listen('keyup', 'startGame', {target: document});
},
```

Все элементы этого массива будут изначально иметь значение «**true**». В результате этого все динозавры в популяции будут отображаться в начале игры одновременно. Если какому-либо элементу этого массива присвоить значение «**false**», то директива «**~show**» автоматические установит у соответствующего динозавра css-стиль «**display: none**», т.е. этот динозавр отображаться в области игры уже не будет.

В хуке «**ready**» также задается свойство «**bestBrain**», в котором будет храниться лучшая нейросеть среди всех остальных.

Для доступа к каждому отдельному динозавру создается уникальная ссылка не него с помощью директивы «**~ref**». Благодаря этому, к каждому динозавру можно будет обратиться по его индексу в массиве «**showDinos**».

Кроме этого, в разделе «**props**» задаются дополнительные свойства:

1. «**populationSize**» — размер популяции динозавров.
1. «**populationCount**» — номер текущей популяции.
1. «**bestCost**» — стоимость лучшей нейросети.

Для отображения номера текущей популяции и лучшей стоимости нейросети в шаблоне компоненте «**oda-game**» нужно предусмотреть соответствующие HTML-элементы.

```javascript
<h1>Счет игры</h1>
<h1 class="score">{{score || '0'}}</h1>
<div id="population">
    <h1>Популяция</h1>
    <h1 class="score">{{populationCount || "0"}}</h1>
</div>
<div id="best-cost">
    <h1>Лучший</h1>
    <h1 class="score">{{bestCost || "0"}}</h1>
</div>
<div id="game-space" ref="game-space">
    <h1 id="message" ~show="showMessage">{{message}}</h1>
    <oda-dino ~for="showDinos" ~show="item" ~ref="index || '0'">{{index || "0"}}</oda-dino>
    <div id="horizon"></div>
</div>
```

Для этого добавляются два элемента «**div**» с уникальными идентификаторами «**population**» и «**best-cost**».

В первом элементе «**div**» будет выводиться номер текущей популяции с помощью шаблонной подстановки «**{{Mustache}}**», а во второй будет выводить количество очков, набранное лучшим динозавром.

Первый элемент «**div**» будет позиционировать с левого края заголовочной области игры, а второй — с правого. Для этого в раздел «**style**» шаблона компонента «**oda-game**» нужно добавить два дополнительных стиля «**#population**» и «**#best-cost**».

```javascript
<style>
:host {
    height: 100%;
    width: 100%;
    position: absolute;
    background-color: var(--header-background-color);
}
#game-space {
    position: absolute;
    top: 200px;
    width: 100%;
    height: 500px;
    overflow: hidden;
    background-color: var(--background-color) !important;
}
h1 {
    margin-bottom: 0px;
    text-align: center;
    font-family: "Comic Sans MS", Arial, sans-serif;
    color: var(--header-color);
}
.score {
    font-size: 50px;
    margin-top: 0px;
}
#message {
    position: relative;
    top: 35%;
}

oda-dino {
    position: absolute;
    top: var(--dino-top);
    left: 72px;
    z-index: 300;
}
#horizon {
    position: absolute;
    top: 435px;
    width: 100%;
    height: 3px;
    background-color: var(--horizon-color);
}
#population {
    position: absolute;
    top: 0px;
    margin-left: 10px;
}
#best-cost {
    position: absolute;
    top: 0px;
    right: 0px;
    margin-right: 10px;
}
</style>
```

Кроме этого, нужно изменить селектор стиля элемента «#score» на селектор класса «.**score**» так, чтобы стиль отображения был одинаковым и для количества набранных очков и для номера текущей популяции и для стоимости лучшей нейросети.

```javascript
.score {
    font-size: 50px;
    margin-top: 0px;
}
```

Для задание нейросети у каждого динозавра в их компоненте «**oda-dino**» нужно предусмотреть свойство «**dinoBrain**».

```javascript
    props: {
        svg: {},
        audio: {},
        dinoBrain: {},
    },
```

В результате этого у каждого динозавра будет храниться своя собственная нейросеть, которую можно создать клонированием лучшей нейросети в специально предусмотренном для этого методе «**createPopulation**» компонента «**oda-game**».

```javascript
createPopulation() {
    for (let i = 0; i < this.populationSize; i++) {
        const dino = this.$refs[i][0];
        dino.dinoBrain = this.bestBrain.clone();
        dino.dinoBrain.cost = 0;
    }
},
```

В этом методе веса лучшей нейросети мутируют в методе «**clone**» так, чтобы новая сеть могла попытаться найти лучшее решение.

Чтобы создать начальную популяцию динозавров, в методе «**startGame**» нужно вызвать метод «**createPopulation**».

```javascript
startGame(e) {
    if (e.code !== 'Space') {
        return;
    }
    this.showMessage = false;
    this.createPopulation();
    this.timerID = setInterval(() => {
        this.score++;
    }, 100);
    this.unlisten('keyup', 'startGame', {target: document});
    requestAnimationFrame(this.checkDino.bind(this));
},
```

Кроме этого, здесь:

1. Прячется надпись о необходимости нажатия на клавишу пробела для начала обучения нейросети.

```javascript
this.showMessage = false;
```
2. Запускается таймер набранных очков.

```javascript
this.timerID = setInterval(() => {
    this.score++;
}, 100);
```

3. Отменяется обработчик нажатия каких-либо клавиш клавиатуры.

```javascript
this.unlisten('keyup', 'startGame', {target: document});
```

4. Вызывается метод определения столкновения динозавров с кактусами «**checkDino**» со следующим кадром анимации.

Этот метод нужно задать в компоненте «**oda-game**» следующим образом:

```javascript
checkDino() {
    if (this.showDinos.every((value) => !value)) {
        this.score = 0;
        this.newPopulation();
        this.nextCactus = 0;
    }
    this.createCloud();
    this.createCactus();
    this.createPterodactyl();
    let cactuses = this.gameSpace.querySelectorAll('oda-cactus');
    for (let i = 0; i < this.populationSize; i++) {
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
    this.populationCount++;
    let cactuses = this.gameSpace.querySelectorAll('oda-cactus');
    cactuses.forEach((cactus) => cactus.remove());
    this.showDinos.fill(true);
    this.createPopulation();
},
```

В нем:

1. Удаляются все кактусы, которые были созданы до этого.
1. Отображаются заново все скрытые динозавры присвоением всем элементам массива «**showDinos**» значения «**true**» с помощью метода «**fill**».
1. Вызывается метод «**createPopulation**», в котором у каждого динозавра задается новая нейросеть на основе лучшей нейросети, хранящейся в свойстве «**bestBrain**» компонента «**oda-game**».

Если не все динозавры столкнулись с кактусами, то метод «**checkDino**» продолжает проверку наличие их пересечения друг с другом.

```javascript
let cactuses = this.gameSpace.querySelectorAll('oda-cactus');
for (let i = 0; i < this.populationSize; i++) {
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

Для этого он получает список всех кактусов и для каждого из них проверяет не пересекаются ли их координаты с координатами очередного динозавра, который еще отображается. Если координаты пересекаются, то

1. Фиксируется количество набранных очков текущим динозавром.

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

3. Останавливается анимация прыжка динозавра с помощью метода «**stopJump**», который должен быть задан в компоненте «**oda-dino**» следующим образом:

```javascript
stopJump(){
    this.classList.remove("dino-jump");
    this.offsetHeight; // reflow
    this.svg.unpauseAnimations();
},
```

4. Скрывается текущий динозавр, заданием для его элемента в массиве «**showDinos**» значения «**false**».

```javascript
this.showDinos[i] = false;
```

5. Прекращается дальнейшая проверка столкновения этого динозавра с другими кактусами вызовом директивы «**break**».

Если столкновения динозавра с кактусами не было, то с помощью нейросети решается вопрос о необходимости совершения им очередного прыжка. Для этого используется метод «**jump**», который нужно определить в компоненте «**oda-dino**» следующим образом:

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

Прыжок динозавра задается добавлением к его компоненту CSS-класса «**dino-jump**». Если этот класс уже был добавлен, то сразу происходит выход из метода. В противном случае находятся координаты кактуса и динозавра, на основе которых определяется расстояние между ними по следующей формуле:

```javascript
cactusCoords.x - dinoCoords.x - dinoCoords.width
```

Это расстояние имеет абсолютное значение, которое теоретически может быть любым. Для его нормирования используется специальный метод «**map**», который задается следующим образом:

```javascript
map (n, start1, stop1, start2, stop2) {
    return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
},
```

Он преобразует заданный на вход сигнал «**n**» в диапазоне от «**start1**» до «**stop1**» в тот же самый сигнал, но уже в диапазоне от «**start2**» до «**stop2**».

В результате этого расстояние между динозавром и кактусами будет всегда находится в диапазоне от 0 до 1, вне зависимости от ширины области игры.

После этого, нужно получить сигнал на выходе нейросети с помощью метода «**feedForward**» класса «**NeuralNetwork**».

Если сигнал на втором выходном нейроне окажется больше чем сигнал на первом нейроне, то можно считать, что динозавр должен совершить прыжок через кактус. В противном случае прыжка быть не должно и из метода «**jump**» нужно выйти.

Если же решение о прыжке было принято, то

1. К компоненту динозавра нужно добавить CSS-класс прыжка «**dino-jump**».

```javascript
this.classList.add("dino-jump");
```

2. Остановить анимацию движения его ног.

```javascript
this.svg.pauseAnimations();
```

3. Задать функцию обратного вызова «**onfinish**», которая будет автоматически выполняться после завершения анимации прыжка.

```javascript
this.getAnimations().forEach((anim, i, arr) => {
    anim.onfinish = () => {
        this.classList.remove("dino-jump")
        this.offsetHeight; // не удаляй reflow
        this.svg.unpauseAnimations();
    }
});
```

В этой функции удаляется CSS-класс «**dino-jump**», задающий анимацию прыжка, и возобновляется анимация движения ног динозавра вызовом метода «**unpauseAnimations**» его SVG-образа.

После всего этого нужно запустить игру в браузере и подождать некоторое время, пока динозавр не научится автоматически перепрыгивать через кактусы методом множества проб и ошибок.

Для начала процесса обучения в игре необходимо нажать на клавишу пробела.

[![Начало игры](https://img.youtube.com/vi/QSZdWDoyork/0.jpg)](https://www.youtube.com/watch?v=QSZdWDoyork)

На первых этапах игры все динозавры будут разбиваться о кактусы, не совершая никаких прыжков.

[![Без прыжков](https://img.youtube.com/vi/w9Ih1AET3nA/0.jpg)](https://www.youtube.com/watch?v=w9Ih1AET3nA)

Затем начнут появляться динозавры, которые будут хаотично прыгать, иногда случайно преодолевая кактусы.

[![Случайные прыжки](https://img.youtube.com/vi/AECvdc8-xYI/0.jpg)](https://www.youtube.com/watch?v=AECvdc8-xYI)

После этого, могут появится «читеры», которые будут постоянно прыгать, найдя более или менее приемлемое решение данной задачи.

[![Читеры](https://img.youtube.com/vi/_NO7O_uoWDs/0.jpg)](https://www.youtube.com/watch?v=_NO7O_uoWDs)

Однако и они в конце концов тоже разобьются о какой-нибудь кактус.

Через некоторое время нейросеть все же найдет правильное решение, когда динозавр не будет прыгать хаотично, а будет подбегать поближе к кактусу и только тогда совершать осмысленный прыжок через него.

[![Читеры](https://img.youtube.com/vi/N6BuB8FTY7Y/0.jpg)](https://www.youtube.com/watch?v=N6BuB8FTY7Y)

В результате этого динозавр «**T-Rex**» будет прыгать через кактусы до бесконечности, рекламируя работу замечательного фреймворка «**ODA**».