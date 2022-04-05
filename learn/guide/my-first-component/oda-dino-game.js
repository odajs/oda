function createCloud(){
    const gameSpace = document.getElementById('game-space');
    gameSpace.append('oda-cloud');
    newCloud = gameSpace.lastChild;
    newCloud.style.top = randomInteger(settings.cloud.distance.min,
        settings.cloud.distance.max) + 'px';
    newCloud.getAnimations().forEach((anim, i, arr) => {
        anim.onfinish = () => {
            newCloud.remove();
        };
    });
}
