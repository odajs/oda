import {NeuralNetwork} from './neuro-net.js';
import {settings} from './settings.js';

export let bestRaccoonBrain;

bestRaccoonBrain = new NeuralNetwork(settings.topology);
bestRaccoonBrain.cost = -Infinity;


export function changeBestRaccoonBrain(raccoonBrain) {
    if (raccoonBrain.cost > bestRaccoonBrain.cost) {
        bestRaccoonBrain = raccoonBrain.clone(raccoonBrain);
        bestRaccoonBrain.cost = raccoonBrain.cost;
    }
}