import {NeuralNetwork} from './neuro-net.js';

import {currentTopology} from './config.js';

export let bestNeuroBrain = new NeuralNetwork(currentTopology);

bestNeuroBrain.cost = -Infinity
// export let bestBrainCost = -Infinity;
