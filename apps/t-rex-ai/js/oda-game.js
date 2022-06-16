import "./oda-dino.js";
import "./oda-cactus.js";
import "./oda-cloud.js";
import "./oda-pterodactyl.js";
import {NeuralNetwork} from './neural-net.js';

ODA({ is: 'oda-game',
    template: `
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
    `,
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
    get dino() {
        return this.$refs.dino;
    },
    get gameSpace() {
        return this.$refs["game-space"];
    },
    ready() {
        this.showDinos = Array(this.populationSize).fill(true)
        this.bestBrain = new NeuralNetwork(this.topology);
        this.listen('keyup', 'startGame', {target: document});
    },
    changeBestBrain(dinoBrain) {
        if (dinoBrain.cost > this.bestBrain.cost) {
            this.bestCost = this.bestBrain.cost = dinoBrain.cost
            this.bestBrain.clone(dinoBrain);
        }
    },
    createPopulation() {
        for (let i = 0; i < this.populationSize; i++) {
            const dino = this.$refs[i][0];
            dino.dinoBrain = this.bestBrain.clone();
            dino.dinoBrain.cost = 0;
            if ( Math.random() < 0.75 ) {
                dino.dinoBrain.mutate();
            }
        }
    },
    newPopulation() {
        this.populationCount++;
        let cactuses = this.gameSpace.querySelectorAll('oda-cactus');
        cactuses.forEach((cactus) => cactus.remove());
        this.showDinos.fill(true);
        this.createPopulation();
    },
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




        // let dinos = this.gameSpace.querySelectorAll('oda-dino');
        // let removeCount = 0;
        // dinos.forEach( dino => {
        //     for (var i = 0; i < cactuses.length; ++i) {
        //         if (dino.isIntersection && dino.isIntersection(cactuses[i])) {
        //             dino.dinoBrain.cost = this.score;
        //             this.changeBestBrain(dino.dinoBrain);
        //             dino.remove();
        //             removeCount--;
        //             break;
        //         }
        //     }
        //     if (dinos.length === removeCount) {
        //         this.newGame();
        //     }
        //     else {
        //         dino.jump();
        //     }
        // })
        requestAnimationFrame(this.checkDino.bind(this));
    },
    createCloud() {
        if (this.nextCloud === 0) {
            this.gameSpace.append(document.createElement('oda-cloud'));
            this.nextCloud = Math.floor(20 + Math.random() * (150 + 1 - 20));
        }
        this.nextCloud--;
    },
    createCactus() {
        if (this.nextCactus === 0) {
            this.gameSpace.append(document.createElement('oda-cactus'));
            this.nextCactus = Math.floor(100 + Math.random() * (150 + 1 - 100));
        }
        this.nextCactus--;
    },
    createPterodactyl() {
        if (this.nextPterodactyl === 0) {
            this.gameSpace.append(document.createElement('oda-pterodactyl'));
            this.nextPterodactyl = Math.floor(150 + Math.random() * (200 + 1 - 150));
        }
        this.nextPterodactyl--;
    }
})