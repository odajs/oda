import {randomInteger} from './utils.js';
import {settings} from './settings.js';
import {isIntersect} from './utils.js';
import {createPolygon} from './utils.js';

let gameOver=false;
let gameStart=false;

let cloudDistance = 0;
let nextCloudDistance = 0;

let cactusDistance = 0;
let nextCactusDistance = 0;

let groundDistance = 0;
let nextGroundDistance = 0;

function initGame() {
    fetch("images/cactus.svg")
    .then(response => response.text())
    .then(svg => {
        const gameSpace = document.getElementById('game-space');
        const newTemplate = document.createElement('template');
        newTemplate.setAttribute('id', 'big-cactus');
        newTemplate.innerHTML = svg;
        gameSpace.append(newTemplate);
        createPolygon(newTemplate.content.querySelector('svg'), 'path', '', 'big-cactus');
    });
    fetch("images/cloud.svg")
    .then(response => response.text())
    .then(svg => {
        const gameSpace = document.getElementById('game-space');
        const newTemplate = document.createElement('template');
        newTemplate.setAttribute('id', 'cloud');
        newTemplate.innerHTML = svg;
        gameSpace.append(newTemplate);

    });
    fetch("images/ground.svg")
    .then(response => response.text())
    .then(svg => {
        const gameSpace = document.getElementById('game-space');
        const newTemplate = document.createElement('template');
        newTemplate.setAttribute('id', 'ground');
        newTemplate.innerHTML = svg;
        gameSpace.append(newTemplate);
    });

    fetch("images/dino.svg")
    .then(response => response.text())
    .then(svg => {
        const gameSpace = document.getElementById('game-space');
        gameSpace.insertAdjacentHTML('beforeend', svg);
        createPolygon(dino, '', 'body', 'dino-body');
        createPolygon(dino, '', 'first-leg', 'dino-first-leg');
        createPolygon(dino, '', 'second-leg', 'dino-second-leg');
        createPolygon(dino, '', 'third-leg', 'dino-third-leg');
        createPolygon(dino, '', 'fourth-leg', 'dino-fourth-leg');

        // createPolygon(dino, '', 'incline', 'dino-incline');
        // createPolygon(dino, '', 'first-leg-incline', 'dino-first-leg-incline');
        // createPolygon(dino, '', 'second-leg-incline', 'dino-second-leg-incline');
        // createPolygon(dino, '', 'third-leg-incline', 'dino-third-leg-incline');
        // createPolygon(dino, '', 'fourth-leg-incline', 'dino-fourth-leg-incline');
    });
}

initGame();

let scoreID;

function dinoJump() {
    if (!gameStart) {
        gameStart = true;

        scoreID = setInterval(() => {
            let score = document.getElementById('score').textContent;
            score =+score + 1;
            document.getElementById('score').textContent = score;
        }, 100);
        requestAnimationFrame(checkDino);
    }
    else if (gameOver) {
        gameOver = false;

        dino.getElementById('big-eye').setAttribute('visibility', 'hidden');
        dino.getElementById('small-eye').setAttribute('visibility', 'visible');
        dino.getElementById('month').setAttribute('visibility', 'hidden');

        // dino.getElementById('incline-eye').setAttribute('visibility', 'hidden');

        // dino.getElementById('incline').setAttribute('visibility', 'hidden');
        // dino.getElementById('first-leg-incline').setAttribute('visibility', 'hidden');
        // dino.getElementById('second-leg-incline').setAttribute('visibility', 'hidden');
        // dino.getElementById('third-leg-incline').setAttribute('visibility', 'hidden');
        // dino.getElementById('fourth-leg-incline').setAttribute('visibility', 'hidden');

        dino.unpauseAnimations();
        dino.style.animationPlayState="running";

        let clouds = document.querySelectorAll('.clouds');
        clouds.forEach(cloud => cloud.style.animationPlayState="running");

        let grounds = document.querySelectorAll('.grounds');
        grounds.forEach(ground => ground.style.animationPlayState="running");

        let cactusesAll = document.querySelectorAll('.cactuses');
        cactusesAll.forEach(cactus => cactus.remove());

        document.getElementById('score').textContent = '0';
        scoreID = setInterval(() => {
            let score = document.getElementById('score').textContent;
            score =+score + 1;
            document.getElementById('score').textContent = score;
        }, 100);
        requestAnimationFrame(checkDino);
    }
    else {
        dino.classList.add("dino-jump");
        dino.pauseAnimations();
        dino.getAnimations().forEach((anim, i, arr) => {
            anim.onfinish = () => {
                dino.classList.remove("dino-jump");
                dino.unpauseAnimations();
            }
        });
    }
}

function dinoKeyDown(e){
    if (e.code === 'Space') {
        dinoJump();
    }
}

function dinoArrowDown(e){
    if (e.code === '40') {
        gameStart = true;
        
        dino.getElementById('incline').setAttribute('visibility', 'visible');
        dino.getElementById('first-leg-incline').setAttribute('visibility', 'visible');
        dino.getElementById('second-leg-incline').setAttribute('visibility', 'visible');
        dino.getElementById('third-leg-incline').setAttribute('visibility', 'visible');
        dino.getElementById('fourth-leg-incline').setAttribute('visibility', 'visible');
        dino.getElementById('incline-eye').setAttribute('visibility', 'visible');

        dino.unpauseAnimations();
        dino.style.animationPlayState="running";

        requestAnimationFrame(checkDino);
    }
    
    
}

function dinoMouseJump(){
    dinoJump();
}

document.addEventListener('keydown', dinoKeyDown);
document.addEventListener('onkeydown', dinoArrowDown);
document.querySelector('#game-space').addEventListener('click', dinoJump);

function checkDino(){
    if(gameOver) return;
    cloudDistance++;
    if (cloudDistance > nextCloudDistance) {
        cloudDistance = 0;
        createCloud();
        nextCloudDistance = randomInteger(settings.cloud.distance.min, settings.cloud.distance.max);
    }

     groundDistance++;
     if (groundDistance > nextGroundDistance) {
         groundDistance = 0;
         createGround();
         nextGroundDistance = randomInteger(settings.ground.distance.min, settings.ground.distance.max);
     }

    if(!gameStart) return;

    cactusDistance++;
    if (cactusDistance > nextCactusDistance) {
        cactusDistance = 0;
        createCactus();
        nextCactusDistance = randomInteger(settings.cactus.distance.min, settings.cactus.distance.max);
    }

    let cactuses = document.querySelectorAll('.cactuses');
    cactuses.forEach(cactus => {
        let cactusCoords = cactus.getBoundingClientRect();
        if (isIntersect(dino, cactus, 'big-cactus'))
        {
            gameOver = true;
            clearInterval(scoreID);

            const clouds = document.querySelectorAll('.clouds');
            clouds.forEach(cloud => {
                cloud.style.animationPlayState="paused";
            });
            const cactusesAll = document.querySelectorAll('.cactuses');
            cactusesAll.forEach(cactus => {
                cactus.style.animationPlayState="paused";

            });

            const grounds = document.querySelectorAll('.grounds');
            grounds.forEach(ground => {
                ground.style.animationPlayState="paused";

            });

            dino.style.animationPlayState="paused";
            dino.pauseAnimations();
            dino.getElementById('big-eye').setAttribute('visibility', 'visible');
            dino.getElementById('small-eye').setAttribute('visibility', 'hidden');
            dino.getElementById('month').setAttribute('visibility', 'visible');
        }
    })
    requestAnimationFrame(checkDino);
}

function createCloud(){
    let cloudTemp = document.querySelector('#cloud');
    let newCloud = cloudTemp.content.cloneNode(true);
    const gameSpace = document.getElementById('game-space');
    gameSpace.append(newCloud);
    newCloud = gameSpace.lastChild;
    newCloud.style.top = randomInteger(settings.cloud.distance.min, settings.cloud.distance.max) + 'px';
    newCloud.getAnimations().forEach((anim, i, arr) => {
        anim.onfinish = () => {
            newCloud.remove();
        };
    });
}

function createCactus(){
    let dist = randomInteger(settings.cactus.distance.min, settings.cactus.distance.max);
    const gameSpace = document.getElementById('game-space');
    let topSet = document.querySelector('#big-cactus');
    let newCactus = topSet.content.cloneNode(true);
    //newCactus.querySelector('svg').style.top = '200px';

    gameSpace.append(newCactus);

    newCactus = gameSpace.lastChild;
    newCactus.getAnimations().forEach((anim, i, arr) => {
        anim.onfinish = () => {
            newCactus.remove();
        };
    });
}

export function createGround(){
    let groundTemp = document.querySelector('#ground');
    let newGround = groundTemp.content.cloneNode(true);
    const gameSpace = document.getElementById('game-space');
    const groundPaths = newGround.querySelectorAll('path');
    groundPaths[randomInteger(0, groundPaths.length - 1)].setAttribute('visibility', 'visible');
    gameSpace.append(newGround);
    newGround = gameSpace.lastChild;
    newGround.style.top = randomInteger(settings.ground.height.min, settings.ground.height.max) + 'px';
    newGround.getAnimations().forEach((anim, i, arr) => {
        anim.onfinish = () => {
            newGround.remove();
        };
    });
}
