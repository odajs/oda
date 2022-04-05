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

createPterodactyl();

createCloud();

createCactus();
