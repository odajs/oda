import "./oda-dino.js";
import "./oda-cactus.js";
import "./oda-cloud.js";
import "./oda-pterodactyl.js";
import "./oda-moon.js";
import "./oda-stars.js";

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

function createMoon(){
    const gameSpace = document.getElementById('game-space');
    gameSpace.append(document.createElement('oda-moon'));
    const newMoon = gameSpace.lastChild;
    const min = 10;
    const max = 100;
    newMoon.style.top = Math.floor(min + Math.random() * (max + 1 - min)) + 'px';
    newMoon.getAnimations().forEach((anim, i, arr) => {
        anim.onfinish = () => {
            newMoon.remove();
        };
    });
}

function createStar(starName) {
    const gameSpace = document.getElementById('game-space');
    gameSpace.append(document.createElement(starName));
    const newStar = gameSpace.lastChild;
    const min = 10;
    const max = 100;
    newStar.style.top = Math.floor(min + Math.random() * (max + 1 - min)) + 'px';
    newStar.getAnimations().forEach((anim, i, arr) => {
        anim.onfinish = () => {
            newStar.remove();
        };
    });
    return newStar;
}

function nightBegin() {
    createMoon();
    createStar('oda-star1');
    createStar('oda-star2');
}

function nightEnd() {
    let moons = document.querySelectorAll('oda-moon');
    moons.forEach(moon => moon.remove());

    let stars1 = document.querySelectorAll('oda-star1');
    star1.forEach(star => star.remove());

    stars2 = document.querySelectorAll('oda-star2');
    stars2.forEach(star => star.remove());
}


function createGround(){
    const gameSpace = document.getElementById('game-space');

    gameSpace.append(document.createElement('oda-ground'));
    newGround = gameSpace.lastChild;
    newGround.select(Math.floor(Math.random() * 7));
    const min = 442;
    const max = 451;
    newGround.style.top = Math.floor(min + Math.random() * (max + 1 - min)) + 'px';
    newGround.getAnimations().forEach((anim, i, arr) => {
        anim.onfinish = () => {
            newGround.remove();
        };
    });
}

function createHorizon() {
    const gameSpace = document.getElementById('game-space');
    const newHorizon = document.createElement('div');
    newHorizon.classList.add('horizon');
    gameSpace.append(newHorizon);
}

let scoreID;

function startGame() {
    createHorizon();
    document.addEventListener('keydown', dinoKeyDown);
    scoreID = setInterval(() => {
        let score = document.getElementById('score').textContent;
        score =+score + 1;
        document.getElementById('score').textContent = score;
    }, 100);
    requestAnimationFrame(checkDino);
}

function dinoKeyDown(e){
    //e.code === 'Space' && (!dino.getElementById('body').classList.contains("hidden") || gameOver)) {
    if (e.code === 'Space') {
        dino.jump();
    }
}

startGame();

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
        if (dino.intersection(cactuses[i])) {
            gameOver();
        }
    }

    requestAnimationFrame(checkDino);
}

function gameOver() {
    alert("Game Over. Для продолжения нажмите пробел");
}