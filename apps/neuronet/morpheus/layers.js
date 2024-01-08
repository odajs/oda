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
        const alpha = this.alpha;
        return this.weights = corrects.map((batch, b)=>{
            const neuron = this.weights[b];
            return batch.map((correct, i)=>{
                return neuron[i] - correct * alpha;
            })
        })
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
                return [...batch, 1];
            });
        }
        this.inputs = inputs;
        let outputs = multiplyMT(this.inputs, this.weights);
        if(this.activation)
            outputs = this.activation.fwd(outputs);
        this.outputs = outputs;
        return this.outputs;
    },
    back(losses){
        if(this.activation)
            losses = this.activation.back(losses);
        const corrects = multiplyMM(transposeMatrix(losses), this.inputs);
        losses = multiplyMM(losses, this.weights);
        this.correctWeights(corrects);
        return losses;
    },
    get activation(){
        if (this.act_name)
            return new Activation(this, this.act_name);
        return null;
    },
    $public:{
        $freeze: true,
        get weights(){
            return Array(this.out_size).fill(0).map( i=> Array(this.in_size + (this.use_bias?1:0)).fill(0).map(j => (Math.random() - .5)));
        }
    }
}){
    constructor(owner, out_size  = 64, activation = '', use_bias = true) {
        super(owner);
        this.out_size = out_size;
        this.use_bias = use_bias;
        this.act_name = activation;
    }
}
export class LayerNormalization extends Layer.ROCKS({
    fwd(input){
        this.input = input;
        this.output = this.input.map(vec => {
            const size = vec.length;
            const mu = vec.reduce((r, x) => (r + x)) / size;
            if(mu){
                const sigma = Math.sqrt(vec.reduce((r, x) => (r + Math.pow((x - mu),2))) / size + EPSILON);
                vec = vec.map(x => ((x - mu) / sigma));
            }
            return vec;
        });
        return this.output;
    },
    back(losses){
        losses = this.input.map((vec, v) => {
            const input = losses[v];
            const output = this.output[v];
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
        return losses;
    }
}){}
export class Softmax extends Layer.ROCKS({
    fwd(inputs){
        this.inputs = inputs;
        this.output = this.inputs.map((logits, i)=>{
            const maxLogit = logits.reduce((a, b) => Math.max(a, b), -Infinity);
            const scores = logits.map((l) => Math.exp(l - maxLogit));
            const denom = scores.reduce((a, b) => a + b);
            return scores.map((s) => s / denom);
        })
        return this.output;
    },
    back(targets){
        let output =  this.output.map((batch, b)=>{
            const target = targets[b];
            return batch.map((out, i)=>{
                return out - target[i];
            })
        });
        return output;
    },
}){}
export class Activation extends Layer.ROCKS({

}){
    constructor(func = 'relu') {
        super();
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