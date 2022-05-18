import "./oda-dino.js";
import "./oda-cactus.js";
import "./oda-cloud.js";
import "./oda-pterodactyl.js";

function createCloud(){
    const gameSpace = document.getElementById('game-space');
    gameSpace.append(document.createElement('oda-cloud'));
    const newCloud = gameSpace.lastChild;
    const min = 20;
    const max = 150;
    newCloud.style.top = Math.floor(min + Math.random() * (max + 1 - min)) + 'px';
    newCloud.getAnimations().forEach((anim, i, arr) => {
        anim.onfinish = () => {
            newCloud.remove();
        };
    });
}

function createCactus(){
    const gameSpace = document.getElementById('game-space');
    gameSpace.append(document.createElement('oda-cactus'));
    const newCactus = gameSpace.lastChild;
    newCactus.getAnimations().forEach((anim, i, arr) => {
        anim.onfinish = () => {
            newCactus.remove();
        };
    });
}

function createPterodactyl(){
    const gameSpace = document.getElementById('game-space');
    gameSpace.append(document.createElement('oda-pterodactyl'));
    const newPterodactyl = gameSpace.lastChild;
    const min = 10;
    const max = 100;
    newPterodactyl.style.top = Math.floor(min + Math.random() * (max + 1 - min)) + 'px';
    newPterodactyl.getAnimations().forEach((anim, i, arr) => {
        anim.onfinish = () => {
            newPterodactyl.remove();
        };
    });
}



let scoreID;

function startGame() {
    const gameOver = document.querySelector('#game-over');

    gameOver.style.display = "none";
    gameOver.innerText = "Game Over";

    const audio = document.querySelector('audio');
    audio.play();

    scoreID = setInterval(() => {
        score.textContent = +score.textContent + 1;
    }, 100);

    document.removeEventListener('keyup', startGameKeyUp);

    document.addEventListener('keydown', dinoKeyDown);

    requestAnimationFrame(checkDino);
}

function continueGame() {

    const gameOver = document.querySelector('#game-over');
    gameOver.style.display = "none";

    document.removeEventListener('keyup', continueGameKeyUp);

    const audio = document.querySelector('audio');
    audio.play();

    const cactuses = document.querySelectorAll('oda-cactus');
    cactuses.forEach(cactus => {
        cactus.remove();
    });

    cactusDistance = 0;
    nextCactusDistance = 0;

    const dino = document.querySelector('oda-dino');
    dino.continueMove();

    const clouds = document.querySelectorAll('oda-cloud');
    clouds.forEach(cloud => {
        cloud.continueMove();
    });

    const pterodactyls = document.querySelectorAll('oda-pterodactyl');
    pterodactyls.forEach(pterodactyl => {
        pterodactyl.continueMove();
    });

    const score = document.getElementById('score');
    score.textContent = 0;
    scoreID = setInterval(() => {
        score.textContent = +score.textContent + 1;
    }, 100);

    document.addEventListener('keydown', dinoKeyDown);

    requestAnimationFrame(checkDino);
}

function startGameKeyUp(e) {
    if (e.code === 'Space') {
        startGame();
    }
}

function dinoKeyDown(e) {
    if (e.code === 'Space') {
        dino.jump();
    }
}

function continueGameKeyUp(e) {
    if (e.code === 'Space') {
        continueGame();
    }
}

document.addEventListener('keyup', startGameKeyUp);

let cloudDistance = 0;
let nextCloudDistance = 0;

let cactusDistance = 0;
let nextCactusDistance = 0;

let pterodactylDistance = 0;
let nextPterodactylDistance = 0;

function checkDino() {
    cloudDistance++;
    if (cloudDistance > nextCloudDistance) {
        cloudDistance = 0;
        createCloud();
        nextCloudDistance = Math.floor(20 + Math.random() * (150 + 1 - 20));
    }

    cactusDistance++;
    if (cactusDistance > nextCactusDistance) {
        cactusDistance = 0;
        createCactus();
        nextCactusDistance = Math.floor(100 + Math.random() * (150 + 1 - 100));
    }

    pterodactylDistance++;
    if (pterodactylDistance > nextPterodactylDistance) {
        pterodactylDistance = 0;
        createPterodactyl();
        nextPterodactylDistance = Math.floor(150 + Math.random() * (200 + 1 - 150));
    }

    let cactuses = document.querySelectorAll('oda-cactus');

    for (var i = 0; i < cactuses.length; ++i) {
        if (dino.isIntersection && dino.isIntersection(cactuses[i])) {
            gameOver();
            return;
        }
    }

    requestAnimationFrame(checkDino);
}

function gameOver() {

    document.querySelector('#game-over').style.display = "";

    clearInterval(scoreID);

    const dino = document.querySelector('oda-dino');
    dino.stopMove();

    const clouds = document.querySelectorAll('oda-cloud');
    clouds.forEach(cloud => {
        cloud.stopMove();
    });

    const cactuses = document.querySelectorAll('oda-cactus');
    cactuses.forEach(cactus => {
        cactus.stopMove();
    });

    const pterodactyls = document.querySelectorAll('oda-pterodactyl');
    pterodactyls.forEach(pterodactyl => {
        pterodactyl.stopMove();
    });

    const audio = document.querySelector('audio');
    audio.currentTime = 0;
    audio.pause();

    document.removeEventListener('keydown', dinoKeyDown);

    document.addEventListener('keyup', continueGameKeyUp);
}