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
    const gameOver = document.querySelector('#game-over');
    gameOver.style.display = "none";
    gameOver.innerText = "Game Over";

    const audio = document.querySelector('audio');
    audio.play();

    const cactuses = document.querySelectorAll('oda-cactus');
    cactuses.forEach(cactus => {
        cactus.remove();
    });

    cactusDistance = 0;
    nextCactusDistance = 0;

    const dino = document.querySelector('oda-dino');
    dino.gameStart();

    const clouds = document.querySelectorAll('oda-cloud');
    clouds.forEach(cloud => {
        cloud.gameStart();
    });

    const pterodactyls = document.querySelectorAll('oda-pterodactyl');
    pterodactyls.forEach(pterodactyl => {
        pterodactyl.gameStart();
    });

    let score = document.getElementById('score');//.textContent;
    score.textContent = 0;
    //document.getElementById('score').textContent = score;

    
    scoreID = setInterval(() => {
        //let score = document.getElementById('score').textContent;
        //score =+score + 1;
        //document.getElementById('score').textContent = score;
        score.textContent = +score.textContent + 1;
    }, 100);
    requestAnimationFrame(checkDino);
}

function dinoKeyDown(e){
    //e.code === 'Space' && (!dino.getElementById('body').classList.contains("hidden") || gameOver)) {

    if (e.code === 'Space') {
        if (!isGameOver) {
            dino.jump();
        }
    }
}

function dinoKeyUp(e){
    //e.code === 'Space' && (!dino.getElementById('body').classList.contains("hidden") || gameOver)) {

    if (e.code === 'Space') {
        if (isGameOver) {
            isGameOver = false;
            startGame();
        }
    }
}

createHorizon();

document.addEventListener('keydown', dinoKeyDown);
document.addEventListener('keyup', dinoKeyUp);

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

let isGameOver = true;

function gameOver() {
    isGameOver = true;
    document.querySelector('#game-over').style.display = "";


    clearInterval(scoreID);

    const dino = document.querySelector('oda-dino');
    dino.gameOver();

    const clouds = document.querySelectorAll('oda-cloud');
    clouds.forEach(cloud => {
        cloud.gameOver();
    });

    const cactuses = document.querySelectorAll('oda-cactus');
    cactuses.forEach(cactus => {
        cactus.gameOver();
    });

    // const grounds = document.querySelectorAll('.grounds');
    // grounds.forEach(ground => {
    //     ground.style.animationPlayState="paused";
    // });

    // const bumps = document.querySelectorAll('.bumps');
    // bumps.forEach(bump => {
    //     bump.style.animationPlayState="paused";
    // });

    const pterodactyls = document.querySelectorAll('oda-pterodactyl');
    pterodactyls.forEach(pterodactyl => {
        pterodactyl.gameOver();
    });

    const audio = document.querySelector('audio');
    audio.currentTime = 0;
    audio.pause();
    // const moon = document.querySelectorAll('.moon');
    // moon.forEach(moon => {
    //     moon.style.animationPlayState="paused";
    // });

    // let star = document.querySelectorAll('.star1');
    // star.forEach(star => {
    //     star.style.animationPlayState="paused";
    // });

    // star = document.querySelectorAll('.star2');
    // star.forEach(star => {
    //     star.style.animationPlayState="paused";
    // });

    // dino.style.animationPlayState="paused";
    // dino.pauseAnimations();
    //alert("Game Over. Для продолжения нажмите пробел");
}