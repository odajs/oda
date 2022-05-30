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

            <div id="horizon"></div>
        </div>
    `,
    props: {
        timerID: 1,
        score: 0,
        message: 'Для начала игры нажмите пробел',
        showMessage: true,
        nextCloud: 0,
        nextCactus: 0,
        nextPterodactyl: 50,
        topology: [1,2],
        populationCount: 10,
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
    changeBestDinoBrain(dinoBrain) {
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
    dinoJump(e) {
        if (e.code === 'Space') {
            this.dino.jump();
        }
    },
    startGame(e) {
        if (e.code !== 'Space') {
            return;
        }
        this.showMessage = false;
        this.message = "Game Over";

         this.timerID = setInterval(() => {
             this.score++;
         }, 100);

        this.unlisten('keyup', 'startGame', {target: document});

        this.listen('keydown', 'dinoJump', {target: document});

        this.createPopulation();

        requestAnimationFrame(this.checkDino.bind(this));
    },
    checkDino() {
        this.createCloud();
        this.createCactus();
        this.createPterodactyl();
        let cactuses = this.gameSpace.querySelectorAll('oda-cactus');
        // for (var i = 0; i < cactuses.length; ++i) {
        //     if (this.dino.isIntersection && this.dino.isIntersection(cactuses[i])) {
        //         this.gameOver();
        //         return;
        //     }
        // }
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