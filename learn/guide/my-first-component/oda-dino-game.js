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
    const min = 10;
    const max = 100;
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
    scoreID = setInterval(() => {
        let score = document.getElementById('score').textContent;
        score =+score + 1;
        document.getElementById('score').textContent = score;
    }, 100);
    requestAnimationFrame(checkDino);
}

startGame();

function checkDino() {
    requestAnimationFrame(checkDino);
}