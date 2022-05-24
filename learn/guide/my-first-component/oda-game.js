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
            #message {
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
        <h1 id="score">{{score || '0'}}</h1>
        <div id="game-space" ref="game-space">
            <h1 id="message" ~show="showMessage">{{message}}</h1>
            <oda-dino ref="dino"></oda-dino>
            <div class="horizon"></div>
        </div>
    `,
    props: {
        scoreID: 1,
        score: 0,
        showMessage: true,
        message: 'Для начала игры нажмите пробел',
        cloudDistance: 0,
        nextCloudDistance: 0,
        cactusDistance: 0,
        nextCactusDistance: 0,
        pterodactylDistance: 0,
        nextPterodactylDistance: 0,
    },
    get dino() {
        return this.$refs.dino;
    },
    get gameSpace() {
        return this.$refs["game-space"];
    },
    ready() {
        this.listen('keyup', 'startGame', {target: document});
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

         this.scoreID = setInterval(() => {
             this.score++;
         }, 100);

        this.unlisten('keyup', 'startGame', {target: document});

        this.listen('keydown', 'dinoJump', {target: document});

        requestAnimationFrame(this.checkDino.bind(this));
    },
    checkDino() {
        this.createCloud();
        this.createCactus();
        this.createPterodactyl();
        let cactuses = this.gameSpace.querySelectorAll('oda-cactus');
        for (var i = 0; i < cactuses.length; ++i) {
            if (this.dino.isIntersection && this.dino.isIntersection(cactuses[i])) {
                this.gameOver();
                return;
            }
        }
        requestAnimationFrame(this.checkDino.bind(this));
    },
    continueGame() {
        this.showMessage = false;

        const cactuses = this.gameSpace.querySelectorAll('oda-cactus');
        cactuses.forEach(cactus => {
            cactus.remove();
        });

        this.cactusDistance = 0;
        this.nextCactusDistance = 0;


        this.dino.continueMove();

        const clouds = this.gameSpace.querySelectorAll('oda-cloud');
        clouds.forEach(cloud => {
            cloud.continueMove();
        });

        const pterodactyls = this.gameSpace.querySelectorAll('oda-pterodactyl');
        pterodactyls.forEach(pterodactyl => {
            pterodactyl.continueMove();
        });

        this.score = 0;

        this.scoreID = setInterval(() => {
            this.score++;
        }, 100);

        this.unlisten('keyup', 'continueGame', {target: document});

        this.listen('keydown', 'dinoJump', {target: document});

        requestAnimationFrame(this.checkDino.bind(this));
    },
    gameOver() {
        this.showMessage = true;

        clearInterval(this.scoreID);

        this.dino.stopMove();

        const clouds = this.gameSpace.querySelectorAll('oda-cloud');
        clouds.forEach(cloud => {
            cloud.stopMove();
        });

        const cactuses = this.gameSpace.querySelectorAll('oda-cactus');
        cactuses.forEach(cactus => {
            cactus.stopMove();
        });

        const pterodactyls = this.gameSpace.querySelectorAll('oda-pterodactyl');
        pterodactyls.forEach(pterodactyl => {
            pterodactyl.stopMove();
        });

        this.unlisten('keydown', 'dinoJump', {target: document});

        this.listen('keyup', 'continueGame', {target: document});
    },
    createCloud() {
        this.cloudDistance++;
        if (this.cloudDistance > this.nextCloudDistance) {
            this.cloudDistance = 0;
            this.gameSpace.append(document.createElement('oda-cloud'));
            this.nextCloudDistance = Math.floor(20 + Math.random() * (150 + 1 - 20));
        }
    },
    createCactus() {
        this.cactusDistance++;
        if (this.cactusDistance > this.nextCactusDistance) {
            this.cactusDistance = 0;
            this.gameSpace.append(document.createElement('oda-cactus'));
            this.nextCactusDistance = Math.floor(100 + Math.random() * (150 + 1 - 100));
        }
    },
    createPterodactyl() {
        this.pterodactylDistance++;
        if (this.pterodactylDistance > this.nextPterodactylDistance) {
            this.pterodactylDistance = 0;
            this.gameSpace.append(document.createElement('oda-pterodactyl'));
            this.nextPterodactylDistance = Math.floor(150 + Math.random() * (200 + 1 - 150));
        }
    }
})