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
        this.inputs = inputs
        // return this.outputs = transposeMatrix(multiplyMT(this.weights, inputs))
        return this.outputs = multiplyMM(inputs, this.weights);
    },
    back(gradients){
        const corrects = multiplyMM(transposeMatrix(this.inputs), gradients);
        gradients = multiplyMM(gradients, this.weights)
        this.correctWeights(corrects);
        return gradients;
    },
    $public:{
        $freeze: true,
        get weights(){
            return Array(this.in_size + (this.use_bias?1:0)).fill(0).map( i=> Array(this.out_size).fill(0).map(j => (Math.random() - .5)));
        }
    },
    correctWeights(corrects){
        const alpha = this.alpha / this.batch_size;
        this.weights = this.weights.map((neuron, n)=>{
            const correct = corrects[n];
            return correct.map((delta, i)=>{
                return (neuron[i] - delta * alpha);
            })
        })
        return this.weights;
    }
}){
    constructor(owner, out_size  = 64, use_bias = false) {
        super(owner);
        this.out_size = out_size;
        this.use_bias = use_bias;
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
        gradients = this.outputs.map((batch, b)=>{
            const grad = gradients[b]
            return batch.map((out, i)=>{
                let sum = 0;
                for (let j = 0; j < this.in_size; j++){
                    sum += ((i === j)?(out * (1 - out)):(-out * batch[j])) * grad[j];
                }
                return sum;
            })
        });
        return gradients;
    }
}){}
export class CrossEntropy extends Layer.ROCKS({
    fwd(inputs, targets){
        this.targets = targets;
        this.inputs = inputs;
        this.exp_outputs = this.inputs.map((batch, b)=>{
            return batch.map((v)=>Math.exp(v))
        })
        this.outputs = this.exp_outputs.map((o_exps, b)=>{
            const input = this.inputs[b]
            const tarIdx = targets[b];
            let sum = o_exps.reduce((r,v)=>r+v);
            let loss = Math.log(sum) - input[tarIdx];
            return loss;
        })



        // this.outputs = this.inputs.map((batch, b)=>{
        //     const tarIdx = targets[b];
        //     return -Math.log(batch[tarIdx]);
        // })

        return this.outputs;
    },
    back(gradients){
        gradients = this.exp_outputs.map((o_exps, b)=>{
            let sum = o_exps.reduce((r,v)=>r+v);
            let sum_inv = 1 / sum;
            const tarIdx = this.targets[b];
            const g = gradients[b];
            let grad = o_exps.map((val,i)=>{
                return (tarIdx === i)?(val * sum_inv - 1):(val * sum_inv) * g;
            })
            return grad;
        })



        // gradients = this.inputs.map((batch, b)=>{
        //     const tarIdx = this.targets[b];
        //     const grad = gradients[b]
        //     return batch.map((out, i)=>{
        //         return ((i === tarIdx)?(out - 1):out) * grad;
        //     })
        // });
        return gradients;
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
    var rowsA = A.length,
        colsA = A[0].length,
        rowsB = B.length,
        colsB = B[0].length,
        C = [];
    if (colsA != rowsB) return false;
    for (var i = 0; i < rowsA; i++) C[i] = [];
    for (var k = 0; k < colsB; k++) {
        for (var i = 0; i < rowsA; i++) {
            var t = 0;
            for (var j = 0; j < rowsB; j++) t += A[i][j] * B[j][k];
            C[i][k] = t;
        }
    }
    return C;

    //
    // const H1 = A.length;
    // const W1 = A[0].length;
    // const H2 = B.length;
    // const W2 = B[0].length;
    // if(W1 !== H2)
    //     throw new Error(`ШМАТРИЦА! ${W1}, ${H2}`);
    // // for (let i = 0; i < H1; ++i)
    // // {
    // //     for (let j = 0; W2 < N; ++j)
    // //     {
    // //         C[i*W2 + j] = 0;
    // //         for (let k = 0; k < K; ++k)
    // //         C[i*W2 + j] += A[i*K + k] * B[k*N + j];
    // //     }
    // // }
    //
    // // return A.map(x=>transposeMatrix(B).map(y=>dotProduct(x, y)));
    // return A.map((row, i) => B[0].map((_, j) => row.reduce((r, _, n) => r + (A[i][n] * B[j][n]))))
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