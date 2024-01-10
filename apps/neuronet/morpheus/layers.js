class Layer extends ROCKS({
    get batch_size(){
        return this.inputs.length;
    },
    get in_size(){
        return this.inputs[0].length - (this.use_bias?1:0);
    },
    $freeze:{
        set inputs(n){
            if(!Array.isArray(n[0])){
                this.simple_batch = true;
                this['#inputs'] = [n];
            }
        },
        set outputs(n){
            if(this.simple_batch){
                this['#outputs'] = n[0];
            }
        }
    },
    correctWeights(corrects){
        const alpha = this.alpha / this.batch_size;
        corrects.map((batch, b)=>{
            const neuron = this.weights[b];
            return batch.map((correct, i)=>{
                return (neuron[i] - correct * alpha);
            })
        })
        return this.weights;
    },
    get model(){
        return this.owner?.model;
    },
    get alpha(){
        return this.model.trainKoef;
    }
}){
    constructor(owner) {
        super();
        this.owner = owner;
    }
}
export class Dense extends Layer.ROCKS({
    fwd(inputs){
        if(this.use_bias){
            inputs = inputs.map(batch=>{
                batch.push(1)
                return batch;
            });
        }
        this.inputs = inputs;
        let outputs = multiplyMM(this.inputs, this.weights);
        if(this.activation)
            outputs = this.activation.fwd(outputs);
        this.outputs = outputs;
        return this.outputs;
    },
    back(gradients){
        let losses = this.activation?this.activation.back(gradients):this.losses;
        const corrects = multiplyMM(transposeMatrix(this.inputs), losses);
        gradients = multiplyMT(losses, this.weights)
        this.correctWeights(corrects);
        return gradients;
    },
    get activation(){
        if (this.act_name)
            return new Activation(this, this.act_name);
        return null;
    },
    $public:{
        $freeze: true,
        get weights(){
            return Array(this.in_size + (this.use_bias?1:0)).fill(0).map( i=> Array(this.out_size).fill(0).map(j => (Math.random() - .5)));
        }
    },
    get losses(){
        return this.targets.map((batch, b)=>{
            const output = this.outputs[b];
            return batch.map((t, i)=>{
                return Math.pow(t - output[i],2);
            })
        })
    },
    loss(targets){
        if (this.activation)
            return this.activation.loss(targets);
        return this.losses;
    }
}){
    constructor(owner, out_size  = 64, activation = '', use_bias = false) {
        super(owner);
        this.out_size = out_size;
        this.use_bias = use_bias;
        this.act_name = activation;
    }
}
const EPSILON = 1e-5;
export class LayerNormalization extends Layer.ROCKS({
    fwd(input){
        this.inputs = input;
        this.outputs = this.inputs.map(vec => {
            const size = vec.length;
            const mu = vec.reduce((r, x) => (r + x)) / size;
            if(mu){
                const sigma = Math.sqrt(vec.reduce((r, x) => (r + Math.pow((x - mu),2))) / size + EPSILON);
                vec = vec.map(x => ((x - mu) / sigma));
            }
            return vec;
        });
        return this.outputs;
    },
    back(gradients){
        gradients = this.inputs.map((vec, v) => {
            const input = gradients[v];
            const output = this.outputs[v];
            const size = vec.length;
            const mu = vec.reduce((r, x) => (r + x)) / size;
            if(mu){
                let n_inv = 1 / size;
                const sigma2 = vec.reduce((r, x) => (r + Math.pow((x - mu),2))) * n_inv + EPSILON;
                let sigma2_inv = 1 / sigma2;
                let sigma = Math.sqrt(sigma2);
                let sigma_inv = 1 / sigma;

                let data = this.model.array(size);
                for (let i = 0; i<size; i++) {
                    let a = vec[i];
                    let sum = 0;
                    for (let j = 0; j < size; j++) {
                        let b = vec[j];
                        sum += ((i === j) ? (((1 - n_inv) * sigma - Math.pow((a - mu),2) * sigma_inv * n_inv) * sigma2_inv):
                                ((-n_inv * sigma - (b - mu) * (a - mu) * sigma_inv * n_inv) * sigma2_inv))
                            * input[j] * output[j];
                    }
                    data[i] = sum;
                }
                return data;
            }
            return vec;
        });
        return gradients;
    }
}){}
export class Softmax extends Layer.ROCKS({
    fwd(inputs){
        this.inputs = inputs;
        this.outputs = this.inputs.map((batch, i)=>{
            const maxLogit = batch.reduce((r, b) => Math.max(r, b), -Infinity);
            const scores = batch.map((l) => Math.exp(l - maxLogit));
            const denom = scores.reduce((r, b) => r + b);
            return scores.map((s) => s / denom);
        })
        return this.outputs;
    },
    back(gradients){
        const outputs = this.outputs.map((batch, b)=>{
            const target = this.targets[b];
            const grad = gradients[b]
            return batch.map((out, i)=>{
                return (out - target[i]);
            })
        });
        return outputs;
    },
    crossEntropy(targets){
        this.targets = targets;
        return this.outputs.map((batch, b)=>{
            const target = targets[b];
            const v = -batch.reduce((r, O, i)=>{
                const t = target[i];
                return t?(r + Math.log(O)):r
            }, 0)
            return v;
        });
    },
    loss(targets){
        return this.crossEntropy(targets);
    }
}){}
export class Relu extends Layer.ROCKS({
    fwd(inputs){
        this.inputs = inputs;
        this.outputs = this.inputs.map((batch, b)=>{
            return batch.map(x=>{
                return (x < 0) ? reluK * x: x;
            })
        })
        return this.outputs;
    },
    back(gradients){
        return this.outputs.map((batch, b)=>{
            const grad = gradients[b];
            return batch.map((x, i)=>{
                return ((x < 0) ? reluK: 1) * grad[i];
            })
        });
    },
}){}
export class Activation extends Layer.ROCKS({
    get activation(){
        switch (this.func){
            case 'softmax':
                return new Softmax(this);
            case 'relu':
                return new Relu(this);
        }
    },
    fwd(inputs){
        return this.activation.fwd(inputs);
    },
    back(targets){
        return this.activation.back(targets);
    },
    loss(target){
        return this.activation.loss(target)
    }
}){
    constructor(owner, func = 'relu') {
        super(owner);
        this.func = func;
    }
}


function multiplyMM(A, B){
    if(A[0].length !== B.length)
        throw new Error(`ШМАТРИЦА! ${A[0].length}, ${B.length}`)
    return A.map((row, i) => B[0].map((_, j) => row.reduce((r, _, n) => r + (A[i][n] * B[n][j]))))
}

function multiplyMT(M, T) {
    return M.map(x=>T.map(y=>dotProduct(x, y)));
}
function dotProduct(v1, v2) {
    return v1.map((a, i) => (a * v2[i])).reduce((r, n) => (r + n));
}

function transposeMatrix(m) {
    return m[0].map((x,i) =>(m.map(y => y[i])));
}
const reluK = .01;