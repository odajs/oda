import {NeuralNetwork} from './neuro-net.js';

import {settings} from './settings.js';

export let bestDinoBrain = new NeuralNetwork(settings.currentTopology);

bestDinoBrain.cost = -Infinity;

export function changeBestDinoBrain(dinoBrain) {
    if (dinoBrain.cost > bestDinoBrain.cost) {
        bestDinoBrain.cost = dinoBrain.cost
        bestDinoBrain.clone(dinoBrain);
    }
}
