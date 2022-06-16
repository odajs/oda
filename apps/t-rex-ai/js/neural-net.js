export class NeuralNetwork
{
    constructor (topology, clone)
    {
        // Validation Checks
        if (topology.length < 2)
            throw Error("A Neural Network cannot contain less than 2 Layers.", "Topology");

        for (let i = 0; i < topology.length; i++) {
            if(topology[i] < 1)
                throw Error ("A single layer of neurons must contain, at least, one neuron.", "Topology");
        }

        // Set topology
        this.theTopology = topology; //new List<uint>(topology).AsReadOnly();

        // Initialize Sections
        this.sections = new Array(this.theTopology.length - 1);

        if (clone) return;

        // Set the Sections
        for (let i = 0; i < this.sections.length; i++) {
            this.sections[i] = new NeuralSection(this.theTopology[i], this.theTopology[i + 1]);
        }
    }

    cost = 0;

    clone(){
        const clone = new NeuralNetwork(this.theTopology, true);

        // Set the Sections
        for (let i = 0; i < this.sections.length; i++) {
              clone.sections[i] = this.sections[i].clone();
        }
        return clone;
    }

    change(neuralNet){
        // Set the Sections
        for (let i = 0; i < this.sections.length; i++) {
            this.sections[i] = neuralNet.sections[i].clone();
            this.cost = neuralNet.cost;
        }
    }

    get topology(){ // Returns the topology in the form of an array
        const res = new Array(this.theTopology.length);
        res.fill(0)
        // this.theTopology.CopyTo(res, 0);
        return res;
    }

    feedForward(input)
    {
        // Validation Checks
        if (input === null)
            throw Error("The input array cannot be set to null.", "input");
        else if (input.length !== this.theTopology[0])
            throw Error("The input array's length does not match the number of neurons in the input layer.", "Input");

        let output = input;

        // Feed values through all sections
        for (let i = 0; i < this.sections.length; i++) {
            output = this.sections[i].feedForward(output);
        }
        return output;
    }

    mutate (mutationProbability = 0.2, mutationAmount = 1.0) {
        // Mutate each section
        for (let i = 0; i < this.sections.length; i++)
        {
            this.sections[i].mutate(mutationProbability, mutationAmount);
        }
    }
}

export class NeuralSection
{
    constructor (inputCount=0, outputCount)
    {
        // Validation Checks
        if (inputCount === 0)
            return;
            // throw Error("You cannot create a Neural Layer with no input neurons.", "InputCount");
        else if (outputCount === 0)
            throw Error("You cannot create a Neural Layer with no output neurons.", "outputCount");

        // Initialize the weights array
        this.weights = new Array(inputCount + 1); // +1 for the Bias Neuron

        for (let i = 0; i < this.weights.length; i++) {
            this.weights[i] = new Array(outputCount);
        }

        // Set random weights
        for (let i = 0; i < this.weights.length; i++)
            for (let j = 0; j < this.weights[i].length; j++)
                this.weights[i][j] = Math.random() - 0.5;
    }

    clone() {
        const clone = new NeuralSection();
        clone.weights = new Array(this.weights.length);

        for (let i = 0; i < this.weights.length; i++) {
            clone.weights[i] = new Array(this.weights[i].length);
        }

        // Set weights
        for (let i = 0; i < this.weights.length; i++) {
            for (let j = 0; j < this.weights[i].length; j++) {
                    clone.weights[i][j] = this.weights[i][j];
            }
        }

        return clone;
    }

    feedForward(input) {
        // Validation Checks
        if (input === null)
            throw Error("The input array cannot be set to null.", "Input");
        else if (input.length !== this.weights.length - 1)
            throw Error("The input array's length does not match the number of neurons in the input layer.", "Input");

        // Initialize output Array
        let output = new Array(this.weights[0].length);
        output.fill(0);

        // Calculate Value
        for (let i = 0; i < this.weights.length; i++) {
            for (let j = 0; j < this.weights[i].length; j++) {
                if (i === this.weights.length - 1) // If is Bias Neuron
                    output[j] += this.weights[i][j]; // Then, the value of the neuron is equal to one
                else
                    output[j] += this.weights[i][j] * input[i];
            }
        }

        // Apply Activation Function
        for (let i = 0; i < output.length; i++)
            output[i] = ReLU(output[i]);

        return output;
    }

    mutate (mutationProbability, mutationAmount) {
        for (let i = 0; i < this.weights.length; i++) {
            for (let j = 0; j < this.weights[i].length; j++) {
                if (Math.random() < mutationProbability)
                    this.weights[i][j] = (Math.random()) * (mutationAmount * 2) - mutationAmount;
            }
        }
    }
}

function ReLU(x) {
    if (x >= 0)
        return x;
    else
        return x / 20;
}