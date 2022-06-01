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
            #score {
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
        </style>

        <h1>Счет игры</h1>
        <h1 id="score">{{score || '0'}}</h1>
        <div id="game-space" ref="game-space">
            <h1 id="message" ~show="showMessage">{{message}}</h1>
            <oda-dino ~for="showDinos"></oda-dino>
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
        populationCount: 10,
        showDinos: [false, false, false, false, false, false, false, false, false, false],
    },
    get dino() {
        return this.$refs.dino;
    },
    get gameSpace() {
        return this.$refs["game-space"];
    },
    ready() {
        this.bestBrain = new NeuralNetwork(this.topology);
        this.listen('keyup', 'startGame', {target: document});
    },
    changeBestBrain(dinoBrain) {
        if (dinoBrain.cost > this.bestBrain.cost) {
            this.bestBrain.cost = dinoBrain.cost
            this.bestBrain.clone(dinoBrain);
        }
    },
    createPopulation() {
        for (let i = 0; i < this.populationCount; i++) {
            const newDino = document.createElement('oda-dino');
            newDino.dinoBrain = this.bestBrain.clone();
            newDino.dinoBrain.cost = 0;
            if ( Math.random() < 0.75 ) {
                newDino.dinoBrain.mutate();
            }
            this.gameSpace.append(newDino);
        }
    },
    startGame(e) {
        this.showMessage = false;
        this.timerID = setInterval(() => {
            this.score++;
        }, 100);
        this.createPopulation();
        requestAnimationFrame(this.checkDino.bind(this));
    },
    newGame() {
        let cactuses = this.gameSpace.querySelectorAll('oda-cactus');
        cactuses.forEach((cactus) =>
            cactus.remove()
        )
        this.createPopulation();
        this.score = 0;
        requestAnimationFrame(this.checkDino.bind(this));
    },
    checkDino() {
        this.createCloud();
        this.createCactus();
        this.createPterodactyl();
        let cactuses = this.gameSpace.querySelectorAll('oda-cactus');
        let dinos = this.gameSpace.querySelectorAll('oda-dino');
        let removeCount = 0;
        dinos.forEach( dino => {
            for (var i = 0; i < cactuses.length; ++i) {
                if (dino.isIntersection && dino.isIntersection(cactuses[i])) {
                    dino.dinoBrain.cost = this.score;
                    this.changeBestBrain(dino.dinoBrain);
                    dino.remove();
                    removeCount--;
                    break;
                }
            }
            if (dinos.length === removeCount) {
                this.newGame();
            }
            else {
                dino.jump();
            }
        })
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