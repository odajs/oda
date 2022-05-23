import "./oda-dino.js";
import "./oda-cactus.js";
import "./oda-cloud.js";
import "./oda-pterodactyl.js";

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
            #game-over {
                position: relative;
                top: 35%;
            }
            #score {
                font-size: 50px;
                margin-top: 0px;
            }
            oda-dino {
                position: absolute;
                top: var(--dino-top);
                left: 72px;
                z-index: 300;
            }
            .horizon {
                position: absolute;
                top: 435px;
                width: 100%;
                height: 3px;
                background-color: var(--horizon-color);
            }
        </style>

        <h1>Счет игры</h1>
        <h1 id="score" ref="score">0.0</h1>
        <div id="game-space" ref="game-space">
            <h1 id="game-over">Для начала игры нажмите пробел</h1>
            <oda-dino ref="dino"></oda-dino>
            <div class="horizon"></div>
        </div>
    `,
    props: {
        scoreID: 1,
    },
    get dino() {
        return this.$refs.dino;
    },
    get gameOver() {
        return this.$refs["game-over"];
    },
    get score() {
        return this.$refs["score"];
    },
    ready() {
        this.listen('keydown', 'startGame', {target: document});
    },
    dinoJump() {
        this.dino.jump();
    },
    startGame(e) {
        if (e.code !== 'Space') {
            return;
        }

        //const gameOver = document.querySelector('#game-over');

        this.gameOver.style.display = "none";
        this.gameOver.innerText = "Game Over";


        this.scoreID = setInterval(() => {
            this.score.textContent = +this.score.textContent + 1;
        }, 100);

        this.unlisten('keydown', 'startGame', {target: document});

        this.listen('keydown', 'dinoJump', {target: document});

        //requestAnimationFrame(checkDino);

        this.unlisten('keydown', 'startGame', {target: document});
    }
})