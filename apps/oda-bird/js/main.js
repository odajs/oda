import { BirdFactory } from "./bird.js";
import { regBird } from "./reg-bird.js";

let request;

let stepX = 10;
let stepY = 10;
let generationCount = 0;

const performAnimation = () => {
    //console.log("Hello, Bird");


    // const rect = bird.getBoundingClientRect();

    // if (rect.x + stepX + rect.width > bird.parentNode.offsetWidth && stepX > 0 ||
    //     rect.x + stepX < bird.parentNode.offsetLeft && stepX < 0) {
    //     stepX=-stepX;
    // }

    // if (rect.y + stepY + rect.height > bird.parentNode.offsetHeight && stepY > 0 ||
    //      rect.y + stepY < bird.parentNode.offsetTop && stepY) {
    //     stepY=-stepY;
    // }

    // bird.style.transform = `translate(${rect.x+stepX}px, ${rect.y + stepY}px)`;
    // bird.style.transform += (stepX < 0) ? ' scaleX(-1)' : "";

    const birds = document.querySelectorAll('neuro-bird');

    birds.forEach( (bird) =>
        bird.move()
    )

    if ( birds.length === 0)
    {
        createPopulation();
        generationCount++;
        document.title = generationCount;
    }

    request = requestAnimationFrame(performAnimation);
};

request = requestAnimationFrame(performAnimation);

const birdPopulationCount = 100;



function createPopulation() {
    for (let i = 0; i < birdPopulationCount; i++) {
        const newBird = document.createElement('neuro-bird');
        // const el = BirdFactory();
        my.append(newBird);
        // document.body.append(div);
    }
}

// createPopulation();
