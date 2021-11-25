import {randomInteger} from './utils.js';
import {settings} from './settings.js';
import {isIntersect} from './utils.js';
import {createPolygon} from './utils.js';
import { DinoFactory } from "./neuro-dino.js";
import { regDino } from "./reg-dino.js";

import {changeBestDinoBrain} from './dino-brain.js'

let gameOver=false;
let gameStart=false;

let cloudDistance = 0;
let nextCloudDistance = 0;

let cactusDistance = 0;
let nextCactusDistance = 0;

function initDinoSchool() {
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
    fetch("images/dino.svg")
    .then(response => response.text())
    .then(svg => {
        const gameSpace = document.getElementById('game-space');
        const newTemplate = document.createElement('template');
        newTemplate.setAttribute('id', 'dino');
        newTemplate.innerHTML = svg;
        gameSpace.append(newTemplate);
        createPolygon(newTemplate.content.querySelector('svg'), '', 'body', 'dino-body');
        createPolygon(newTemplate.content.querySelector('svg'), '', 'first-leg', 'dino-first-leg');
        createPolygon(newTemplate.content.querySelector('svg'), '', 'second-leg', 'dino-second-leg');
        createPolygon(newTemplate.content.querySelector('svg'), '', 'third-leg', 'dino-third-leg');
        createPolygon(newTemplate.content.querySelector('svg'), '', 'fourth-leg', 'dino-fourth-leg');
        regDino();
        createPopulation();
        scoreID = setInterval(() => {
            let score = document.getElementById('score').textContent;
            score =+score + 1;
            document.getElementById('score').textContent = score;
        }, 100);
        requestAnimationFrame(checkDinos);
    });
}

initDinoSchool();

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
        dino.unpauseAnimations();
        dino.style.animationPlayState="running";

        let clouds = document.querySelectorAll('.clouds');
        clouds.forEach(cloud => cloud.style.animationPlayState="running");

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

function checkDinos(){

    cloudDistance++;
    if (cloudDistance > nextCloudDistance) {
        cloudDistance = 0;
        createCloud();
        nextCloudDistance = randomInteger(settings.cloud.distance.min, settings.cloud.distance.max);
    }


    cactusDistance++;
    if (cactusDistance > nextCactusDistance) {
        cactusDistance = 0;
        createCactus();
        nextCactusDistance = randomInteger(settings.cactus.distance.min, settings.cactus.distance.max);
    }

    let cactuses = document.querySelectorAll('.cactuses');
    if ( cactuses.length !== 0 ) {
        let dinos = document.querySelectorAll('neuro-dino');
        let cactus;
        let index = 0;
        if (dinos.length !== 0) {
            let dinoCoords = dinos[0].getBoundingClientRect();
            index = 0;
            let cactusCoords;
            do {
                cactus = cactuses[index];
                cactusCoords = cactus.getBoundingClientRect();
                index++;
            } while ( cactusCoords.x + cactusCoords.width < dinoCoords.x )
            dinos.forEach( dino => {
                if ( dino.check(cactus, cactusCoords) ) {
                    dino.dinoBrain.cost = +document.getElementById('score').textContent;
                    changeBestDinoBrain(dino.dinoBrain);
                    dino.remove();
                }
                else {
                    dino.jump(cactus, cactusCoords);
                }
            })
            dinos = document.querySelectorAll('neuro-dino');
            if ( dinos.length === 0 ) {
                cactus.remove();
            }
        }
        if ( dinos.length === 0 )
        {
            createPopulation();

        }
    }

    //         cactusesAll.forEach(cactus => {
    //             cactus.style.animationPlayState="paused";

    //         });
    requestAnimationFrame(checkDinos);
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

// let request;

// let stepX = 10;
// let stepY = 10;

// const performAnimation = () => {
//     const dinos = document.querySelectorAll('neuro-dino');

//     dinos.forEach( (bird) =>
//         dinos.move()
//     )

//     if ( dinos.length === 0 )
//     {
//         createPopulation();
//     }

//     request = requestAnimationFrame(performAnimation);
// };

// request = requestAnimationFrame(performAnimation);

function createPopulation() {
    document.getElementById('score').textContent = '0';
    for (let i = 0; i < settings.dinoPopulationCount; i++) {
        const newDino = document.createElement('neuro-dino');
        window['game-space'].append(newDino);
    }
    scoreID = 0;
}

// createPopulation();
