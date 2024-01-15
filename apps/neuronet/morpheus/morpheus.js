import './gpu-browser.min.js';
import * as layers from './layers.js';
export class gptModel extends ROCKS({
    get model(){
        return this;
    },
    $public:{
        blockSize: 8,
        tokens: {
            $type: Array,
            $freeze: true,
            get(){
                const start = {idx: 0, id: '<', char: '<', emb: [...this.getPositionalVector(0)], next:{}, cnt:this.array(), out: this.array(this.dim).map(i=>this.initWeight())};
                const end = {idx: 1, id: '>', char: '>', emb: this.getPositionalVector(0).reverse(), next:{}, cnt:this.array(), out: this.array(this.dim).map(i=>this.initWeight())};
                return [start, end];
            }
        },
        dim: 64,
        negativeSize: 5,
        feedLayerK: 2,
        step: 2,
        topK: 1,
        deep: 1,
        headCount: 1,
        get outLayer(){
            return new layers.Dense(this, this.tokens.length);
        },
    },
    losses: [],
    init(){
        return this.model.array().map(row=>{
            return  this.model.array(this.model.div).map(i=>this.model.initWeight());
        })
    },
    get WO(){
        return this.model.array(this.model.div).map(row=>{
            return  this.model.array().map(i=>this.model.initWeight());
        })
    },
    loss: 0,
    div: 7,
    positional: {
        $freeze: true,
        $def: []
    },
    get feedLayerSize(){
        return this.dim * this.feedLayerK;
    },
    get trainKoef(){
        return  1/Math.sqrt(this.dim);
    },
    progress: 0,
    get size(){
        return this.tokens.length;
    },
    get attDim(){
        return 7//Math.round(this.dim / this.headCount);
    },
    get attDiv(){
        return Math.sqrt(this.attDim);
    },
    async prepareSec(text){
        console.time('PREPARE');
        text = text.trim() + ' ';
        const tokens = await this.tokenize(text, true);
        let pos = 0;
        let word = '';
        let emb = this.array();
        const thread = [];
        for (let i = 0; i<tokens.length; i++){
            const token = tokens[i];
            if (token.isDelimeter){
                thread.push({word, emb});
                word = '';
                emb = this.array();
                pos = 0;
            }
            else{
                word += token.char;
                emb = addVectors(emb, token.emb);//, this.getPositionalVector(pos));
                pos++;
            }
        }
        if (pos)
            thread.push({word, emb});
        let sequence = thread.map((word, pos)=>addVectors(word.emb, this.getPositionalVector(pos)));
        console.timeEnd('PREPARE');
        return sequence;
    },
    async train(text){
        const tokens = await this.tokenize(text, true);
        let pos = 0;
        let word = '';
        let emb = this.array();
        const words = [];
        let sequence = [];
        for (let i = 0; i<tokens.length; i++){
            const token = tokens[i];
            if (token.isDelimeter){
                words.push({word, emb, tokens:sequence});
                sequence = [];
                word = '';
                emb = this.array();
                pos = 0;
            }
            else{
                word += token.char;
                sequence.push(token);
                emb = addVectors(emb, addVectors(token.emb, this.getPositionalVector(pos)));
                pos++;
            }
        }
        if (pos)
            words.push({word, emb, tokens:sequence});
        words.forEach(w=>{
            this.trainWord(w);
        })
    },
    trainWord(wordObj){
        let word = wordObj.emb;
        let input = wordObj.tokens.map((token, i)=>{
            return addVectors(token.emb, this.getPositionalVector(i));
        })
        input.unshift([...this.tokens[0].emb]);
        // let hidden;

        // for (let encoder of this.encoders){
        //     hidden = encoder.fwd(hidden, [word]);
        // }


        wordObj.tokens.push(this.tokens[1]);
        // for (let decoder of this.decoders){
        //     input = decoder.fwd(input, [word]);
        // }

        let output = this.outLayer.fwd(input);
        const softmax = new layers.Softmax(this);
        output = softmax.fwd(output);
        // const targets = wordObj.tokens.map((token, i) => {
        //     let logit = Array(this.tokens.length).fill(0);
        //     logit[token.idx] = 1;
        //     return logit;
        // })
        const targets = wordObj.tokens.map(token => token.idx);
        const ce = new layers.CrossEntropy(this);
        let losses = ce.fwd(output, targets);
        this.loss = losses.reduce((r,x)=>r+x)/losses.length;
        this.losses.push(this.loss);

        let grad = ce.back(this.loss);
        // grad = softmax.back(grad);

        output = output.map(logit=> {
            let idx = -1;
            let v = 0;
            for (let i = 0; i < logit.length; i++) {
                if (logit[i] > v) {
                    idx = i;
                    v = logit[i];
                }
            }
            return idx;
        })
        console.log('output', output)
        console.log('targets', targets)
        console.log('grad', grad)
        grad = this.outLayer.back(grad);

        // for (let decoder of this.decoders){
        //     input = decoder.fwd(input, [word]);
        // }

        output.forEach(i=>{
            this.fire('predicate', this.tokens[i].id);
        });
    },
    async transform(text){
        const tokens = await this.tokenize(text, true);
        let sequence = await this.prepareSec(text);
        console.time('ENCODE');
        for (let encoder of this.encoders){
            sequence = encoder.fwd(sequence);
        }
        console.timeEnd('ENCODE');
        // return
        console.time('DECODE');
        let output = [this.getPositionalVector(0)];
        let step = 0;
        while(step < tokens.length){
            let input = output;
            for (let decoder of this.decoders){
                input = decoder.fwd(input, sequence);
            }
            output = input;
            let next = await new Promise((resolve, reject)=>{
                this.async(()=>{
                    resolve(this.restoreWord(output.last));
                })
            })
            if (!next.length) break;
            next = addVectors(next, this.getPositionalVector(step++));
            input.push(next);
        }
        console.timeEnd('DECODE');
    },
    restoreWord(pred){
        let logits = this.fwd(pred);
        logits = softmax(logits);
        let idx = -1;
        let v = 0 ;
        for(let i = 0; i < logits.length; i++){
            if(logits[i] > v){
                idx = i;
                v = logits[i];
            }
        }
        const token = this.tokens[idx];
        this.fire('predicate', token.id);
        return token.emb;
    },
    get encoders(){
        return this.array(this.deep).map(i=>{
            return new gptEncoder(this);
        })
    },
    get decoders(){
        return this.array(this.deep).map(i=>{
            return new gptDecoder(this);
        })
    },
    get predicateError(){
        if (!this.size)
            return 1;
        const sum = this.tokens.reduce((res,i)=>{
            res += i.predicateError;
            return res;
        }, 0);
        return sum/this.size;
    },
    get tokenError(){
        if (!this.size)
            return 1;
        const tokens = this.tokens.filter(i=>i.count);
        const sum = tokens.reduce((res,i)=>{
            res += i.tokenError;
            return res;
        }, 0);
        return sum/tokens.length;
    },
    getPositionalVector(pos = 0){
        return this.positional[pos] ??= getPositionalVector(this.dim, pos);
    },
    similar(a1, a2){
        return cosSimilar(a1, a2);
    },
    async similarWords(t1, t2){
        t1 = await this.join(t1);
        t2 = await this.join(t2);
        return this.similar(t1, t2);
    },
    async join(word){
        word = word.trim() + ' ';
        const corpus = await this.tokenize(word, true);
        let result = this.array();
        for (let t = 0; t < corpus.length; t++){
            const token = corpus[t];
            const emb = token.emb;
            result = addAndNormalize(result, addVectors(emb,  this.getPositionalVector(t)));
        }
        return result;
    },
    array(size = this.dim){
        return Array(size).fill(0);
    },
    initWeight(){
        return Math.random() - .5
    },
    getTokenItem(token){
        let item = tokenMap[token];
        if (!item){
            item = tokenMap[token] = this.tokens.find(i=>i.id === token)
            if (!item){
                item = tokenMap[token] = Object.create(null);
                item.idx = this.tokens.length;
                item.id = token;
                item.char = token[0];
                if(TERMINATES.includes(item.char))
                    item.isTerminal = true;
                //todo еще надо выделять цифры
                if(item.char.toUpperCase() === item.char.toLowerCase())
                    item.isDelimeter = true;
                item.emb = this.array().map(i=>this.initWeight());
                item.cnt = this.array();
                item.out = this.array(this.dim).map(i=>this.initWeight());
                item.next = Object.create(null);
                item.tokenError = 1;
                item.count = 0;
                item.predicateError = 1;
                this.tokens.push(item);
                this.size = this.tokens.length;
            }
        }
        return item;
    },
    async tokenize(text, prompt){
        text = text.trim() + ' ';
        const corpus = [];
        const step = this.step;
        const size = text.length;
        const limit = Math.ceil(size / 10);
        for (let i = 0; i < size; i++){
            let token = text.substr(i, step);
            if (token.length < step) break;
            let item = this.getTokenItem(token);
            corpus.push(item);
            if(prompt) continue;
            item.count++;
            let prev = corpus[i - 1];
            if (!prev) continue;
            prev.next[token] ??= 0;
            prev.next[token]++;
            if (i && i%limit === 0){
                await new Promise(resolve => {
                    setTimeout(()=>{
                        this.onScan(i/size);
                        resolve();
                    });

                })
            }
        }
        this.onScan(0);
        return corpus;
    },
    async scan(corpus= [], thread = {pos: 0, plast: 1, word: '', w: 0, emb: this.array(), input: this.array(), words: []}){
        const size = corpus.length;
        const alpha = this.trainKoef;
        let samples, current, next, emb, losses, err, sum, pred, loss, correct, target, error = 0;
        const limit = Math.ceil(size / 10);
        for (let i = 0; i<size; i++){
            current = corpus[i];
            next = corpus[i + 1];
            // prepare samples
            samples = [];
            if(next)
                samples.push({cnt: next.cnt, t: 1});
            // prepare negative samples
            let n = this.negativeSize;
            while (n){
                const idx = Math.floor(Math.random() * size);
                let neg = corpus[idx];
                if (neg === current) continue;
                if (current.next[neg.id]) continue;
                samples.add({cnt: neg.cnt, t: 0});
                n--;
            }
            // train
            emb = current.emb;
            losses = this.array();
            err = 0;
            for (let s = 0; s<samples.length; s++){
                const sample = samples[s];
                const cnt = sample.cnt;
                sum = 0;
                for (let i = 0; i <emb.length; i++) {
                    sum += emb[i] * cnt[i];
                }
                pred = sigmoid(sum);
                loss = sample.t - pred;
                if (loss === 0) continue;
                err += Math.abs(loss);
                loss = loss * alpha  * thread.plast;
                for (let i = 0; i <emb.length; i++) {
                    losses[i] += loss * cnt[i];
                    cnt[i] = cnt[i] + loss * emb[i];
                }
            }
            if (err){
                for(let i = 0; i<this.dim; i++){
                    emb[i] = emb[i] + losses[i];
                }
            }
            error += current.tokenError = (err /= samples.length);
            if (i && i%limit === 0){
                await new Promise(resolve => {
                    setTimeout(()=>{
                        this.onScan(i/size, error/i);
                        resolve();
                    });

                })
            }
        }
        error /= size;
        this.onScan(0);
        return error;
    }
}){}

class gptItem extends ROCKS({
    get model(){
        return this.owner.model;
    },
    owner: Object,
}){
    constructor(owner, data = {}) {
        super();
        this.owner = owner;
        for(let n in data){
            this[n] = data[n];
        }
    }
}
class layFeed extends gptItem.ROCKS({
    fwd(inputs){
        this.inputs = inputs;
        this.outputs = multiplyMM(inputs, this.weights);
        if(this.activation)
            return this.activation.fwd(this.outputs);
        return this.outputs;
    },
    back(losses){
        if(this.activation)
            losses = this.activation.back(losses);
        losses = multiplyMM(losses, this.weights);
        return losses;
    }
}){
    constructor(weights, activation) {
        super();
        this.weights = weights;
        this.activation = activation && new activation(this);
        
    }
}
class LayerFull extends gptItem.ROCKS({
    fwd(inputs){
        this.inputs = inputs;
        this.outputs = multiplyMT(inputs, this.weights);
        this.outputs = this.outputs.map(vector => vector.map((val, i) => val + this.bias[i]));
        return this.outputs;
    },
    back(losses){
        const corrects = multiplyMM(transposeMatrix(losses), this.inputs);
        losses = multiplyMM(losses, this.weights);
        return losses;
    },
    get inSize(){
        return this.inputs[0].length;
    },
    $public:{
        $freeze: true,
        get weights(){
            return Array(this.outSize).fill(0).map( i=> Array(this.inSize).fill(0).map(j => (Math.random() - .5)));
        },
        get bias(){
            return Array(this.outSize).fill(0).map(i => Math.random() - .5);
        }
    }

}){
    constructor(outSize) {
        super();
        this.outSize = outSize;
    }
}
// class CrossEntropy extends gptItem.ROCKS({
//     fwd(inputs, targets){
//         this.inputs = inputs;
//         this.targets = targets;
//         return this.outputs = inputs.map((out, i)=>{
//             const target = targets[i];
//             return -out.reduce((r, y, j)=>{
//                 const t = target[j];
//                 return t?(r + t * Math.log(y)):r
//             })
//         })
//     },
//     back(losses){
//        return this.inputs.map((input, i)=>{
//            const sum = 1 / input.reduce((r,v)=>r+v);
//            return input.map((o, k)=>{
//                let s = 0;
//                for(let j=0; j<input.length; j++){
//                    s += ((k === j)?(o * (1 - o)): -o * input[j]);
//                }
//                return s * losses[i];
//            })
//        })
//     }
// }){}
class actSoftmax extends gptItem.ROCKS({
    fwd(inputs){
        return this.output = (this.inputs = inputs).map((logits, i)=>{
            const maxLogit = logits.reduce((a, b) => Math.max(a, b), -Infinity);
            const scores = logits.map((l) => Math.exp(l - maxLogit));
            const denom = scores.reduce((a, b) => a + b);
            return scores.map((s) => s / denom);
        })

    },
    back(losses, targets){
        const size = this.output[0].length;
        let output =  this.output.map((outs, o)=>{
            const target = targets[o];
            const loss = losses[o];
            return outs.map((out, i)=>{
                return (out - target[i]) * loss;
                // let sum = 0;
                // for(let j = 0; j<size; j++){
                //     let outj = outs[j];
                //     sum += ((i === j) ? (outi * (1 - outi)) : (-outi * outj));
                // }
                // return sum * loss;
            })
        });
        let output1 =  this.output.map((outs, o)=>{
            const target = targets[o];
            const loss = losses[o];
            return outs.map((out, i)=>{
                let sum = 0;
                for(let j = 0; j<size; j++){
                    if(i === j)
                        sum = sum + (out * (1 - out));
                    else
                        sum = sum + (-out * outs[j]);
                }
                sum *= loss;
                return sum;
            })
        });
        return output;
    },
    // back(losses){
    //     const size = this.output[0].length;
    //     return this.output.map((out, o)=>{
    //         const loss = losses[o];
    //         return out.map((si, i)=>{
    //             let sum = 0;
    //             for(let j = 0; j<size; j++){
    //                 let sj = loss[j];
    //                 sum += ((i === j) ? (si * (1 - si)) : (-si * sj )) * out[j];
    //             }
    //             return sum;
    //         })
    //     });
    // },
    crossEntropy(targets){
        this.targets = targets;
        return this.output.map((out, i)=>{
            const target = targets[i];
            return -out.reduce((r, y, j)=>{
                const t = target[j];
                return t?(r + t * Math.log(y)):r
            })
        })
    }
}){}
class gptTokenizer extends gptItem.ROCKS({

}){}
class gptHeadAttention extends gptItem.ROCKS({
    $public:{
        $freeze: true,
        get QUERY(){return this.init()},
        get KEY(){return this.init()},
        get VALUE(){return this.init()},
        get WO(){
            return this.model.array(this.model.attDim).map(row=>{
                return  this.model.array().map(i=>this.model.initWeight());
            })
        }
    },
    init(){
        return this.model.array().map(row=>{
            return  this.model.array(this.model.attDim).map(i=>this.model.initWeight());
        })
    },
    get softmaxLayer(){
        return new actSoftmax(this);
    },
    fwd(input, encoded = input){
        this.input = input;
        this.encoded = encoded;
        this.query = multiplyMM(input, this.QUERY);
        this.key = multiplyMM(encoded, this.KEY);
        this.value = multiplyMM(encoded, this.VALUE);
        // const keyT = transposeMatrix(key);
        this.scores = multiplyMT(this.query, this.key);
        let scores = this.scores.map(x=>x.map(y=>(y/this.model.attDiv)));
        if (encoded !== input)
            scores = scores.map((y, i)=>y.map((x,j)=>(j>i)?-Infinity:x)); //mask
        this.softmax = this.softmaxLayer.fwd(scores);
        this.output = multiplyMM(this.softmax, this.value);
        return this.output;
    },
    back(losses){
        let value = multiplyMM(transposeMatrix(this.softmax), losses);
        let softmax = multiplyMM(losses, transposeMatrix(this.value));
        let scores =  this.softmaxLayer.back(softmax);
        if (this.input !== this.encoded)
            scores = scores.map((y, i)=>y.map((x,j)=>(j>i)?-Infinity:x)); //mask
        scores = scores.map(x=>x.map(y=>(y/this.model.attDiv)));
        let key = multiplyMM(transposeMatrix(scores), this.query);
        let query = multiplyMM(scores, this.key);
        let input = multiplyMT(query, this.QUERY);

        this.input.forEach((step, s)=>{
            const loss = input[s];
            const lossQuery = query[s];
            step.forEach((x, i)=>{
                const weights = this.QUERY[i];
                lossQuery.forEach((sigma, w)=>{
                    weights[w] += sigma * x * this.model.trainKoef;
                })
            })
        })

        let encodedKey = multiplyMT(key, this.KEY);
        let encodedValue = multiplyMT(value, this.VALUE);
        let encoded = addMatrix(encodedKey, encodedValue);

        this.encoded.forEach((step, s)=>{
            const loss = encoded[s];
            const lossKey = key[s];
            const lossVal = value[s];
            step.forEach((x, i)=>{
                const weightsKey = this.KEY[i];
                const weightsVal = this.VALUE[i];
                const correct = x * this.model.trainKoef;
                lossKey.forEach((sigma, w)=>{
                    weightsKey[w] += sigma * correct;
                })
                lossVal.forEach((sigma, w)=>{
                    weightsVal[w] += sigma * correct;
                })
            })
        })
        return {input, encoded};
    }
}){}
class gptAttention extends gptItem.ROCKS({
    $public:{
        $freeze: true,
        get WO(){
            return this.heads.map(head=>head.WO).flat();
        }
    },
    get heads(){
        return Array(this.model.headCount).fill().map(i=>{
            return new gptHeadAttention(this);
        })
    },
    get layerNormalization(){
        return new layers.LayerNormalization(this);
    },
    fwd(input, encoded){
        let output = this.heads.map(head => head.fwd(input, encoded));
        this.input = output.reduce((r,h)=>r.map((w, i)=>w.concat(h[i])), input.map(i=>[])) //concat
        output = multiplyMM(this.input, this.WO);
        output = addMatrix(input, output);
        output = this.layerNormalization.fwd(output);
        return output;
    },
    back(losses){
        losses = this.layerNormalization.back(losses);
        let back = multiplyMM(losses, transposeMatrix(this.WO));
        this.input.forEach((step, s)=>{
            const loss = losses[s];
            step.forEach((x, i)=>{
                const weights = this.WO[i];
                loss.forEach((sigma, w)=>{
                    weights[w] += sigma * x * this.model.trainKoef;
                })
            })
        })
        back = this.heads.reduce((r, head) => {
            const losses = head.back(back);
            if (!r)
                r = losses;
            else{
                r.input = losses.input.map((step, s)=>{
                    let input = r.input[s];
                    return step.map((v ,i)=>{
                        return input[i]+v;
                    })
                })
                r.encoded = losses.encoded.map((step, s)=>{
                    let encoded = r.encoded[s];
                    return step.map((v ,i)=>{
                        return encoded[i]+v;
                    })
                })
            }
            return r
        }, undefined); //todo костыль
        return back;
    }
}){}
class gptFeedLayers extends gptItem.ROCKS({
    $public:{
        $freeze: true,
        get feedLayer1(){
            return new layers.Dense(this,  this.model.feedLayerSize, 'relu');
        },
        get feedLayer2(){
            return new layers.Dense(this,  this.model.dim);
        },
        get layerNormalization(){
            return new layers.LayerNormalization(this);
        },
    },
    fwd(input){
        input = this.feedLayer1.fwd(input);
        input = this.feedLayer2.fwd(input);
        return this.layerNormalization.fwd(input);
    },
    back(losses){
        losses = this.layerNormalization.back(losses);
        losses = this.feedLayer2.back(losses);
        losses = this.feedLayer1.back(losses);
        return losses;
    }
}){}
class gptLayer extends gptItem.ROCKS({
    fwd(input){

    },
    back(loss){

    }
}){}
class gptEncoder extends gptItem.ROCKS({
    get selfAttention(){
        return new gptAttention(this);
    },
    get feed(){
        return new gptFeedLayers(this);
    },
    fwd(input){
        let output = this.selfAttention.fwd(input);
        output = this.feed.fwd(output);
        return output;
    }
}){}
class gptDecoder extends gptEncoder.ROCKS({
    get mixAttention(){
        return new gptAttention(this);
    },
    fwd(input, encoded){
        let output = this.selfAttention.fwd(input);
        output = this.mixAttention.fwd(output, encoded);
        output = this.feed.fwd(output);
        return output;
    },
    back(losses){
        losses = this.feed.back(losses);
        losses = this.mixAttention.back(losses);
        losses = this.selfAttention.back(losses);
        return losses;
    }
}){}
const TERMINATES = '.!?…';
// const DELIMETERS = TERMINATES + ' \n\r,:;-– «»(){}[]+=';
const EXP_TABLE_SIZE = 1000;
const MAX_EXP = 6;
const DEEP = EXP_TABLE_SIZE * EXP_TABLE_SIZE;
const expTable = (()=>{
    const tab = [];
    for (let i = 0; i<=EXP_TABLE_SIZE; i++){
        const x =  (i / EXP_TABLE_SIZE * 2 - 1) * MAX_EXP;
        tab[i] = Math.exp(x);
        tab[i] = Math.round(tab[i] / (tab[i] + 1) * DEEP)/DEEP;
    }
    return tab;
})()
const tokenMap = Object.create(null);
function cosSimilar(A, B) {
    if (A && B) {
        let scalar = 0;
        let avgA = 0;
        let avgB = 0;
        let a, b
        for (let i = 0; i < A.length; i++){
            a = A[i];
            b = B[i];
            scalar += a * b;
            avgA += a * a;
            avgB += b * b;
        }
        if(scalar){
            avgA = Math.sqrt(avgA);
            avgB = Math.sqrt(avgB);
            scalar /= avgA * avgB;
            return Math.abs(scalar);
        }
    }
    return 0;
}
function EXP(x){
    return expTable[Math.round((x + MAX_EXP) * (EXP_TABLE_SIZE / MAX_EXP / 2))];
}
function sigmoid(x){
    if (x > MAX_EXP)
        return  1;
    if (x < -MAX_EXP)
        return  0;
    return EXP(x);
}
function sigmoidD(x, f){
    f ??= sigmoid(x);
    return f * (1-f);
}

const ELU_alpha = 1;
function ELU(x){
    if (x < 0)
        return ELU_alpha * (EXP(x) - 1);
    return x;
}
function ELUD(x){
    if (x < 0)
        return ELU(x) + ELU_alpha;
    return 1;
}
function tanh(x){
    return sigmoidD(2 * x) * 2 - 1;
}
function tanhD(x, th){
    return  1 - th * th * x;
}
function getPositionalVector(d, pos = 0){
    const vector = [];
    for(let i = 0; i < d; i++){
        const v = 1/Math.pow(10000, 2 * i/d) * pos;
        vector[i] = (i%2)?Math.cos(v):Math.sin(v)
    }
    return vector;
}

function softmax(arr) {
    return arr.map(function(value,index) {
        return Math.exp(value) / arr.map( function(y /*value*/){ return Math.exp(y) } ).reduce( function(a,b){ return a+b })
    })
}
//
// function softmaxMatrix(m) {
//     return m.map(i=>softmax(i))
// }
// function addMatrix(m1, m2){
//     return m1.map((m, i) => addVectors(m, m2[i]));
// }
function addVectors(v1, v2){
    return v1.map((a, i) => v2[i] + a);
}
//
// const gpu = new GPU.GPU();
//
// const gpumultiplyMM = gpu.createKernel(function (a, b){
//     let sum = 0;
//     for (let i = 0; i < 512; i++) {
//         sum += a[this.thread.y][i] * b[i][this.thread.x];
//     }
//     return sum;
// }).setOutput([512, 512])
//
// function multiplyMM(A, B){
//     if(A[0].length !== B.length)
//         throw new Error(`ШМАТРИЦА! ${A[0].length}, ${B.length}`)
//     return A.map((row, i) => B[0].map((_, j) => row.reduce((r, _, n) => r + (A[i][n] * B[n][j]))))
// }
//
// function multiplyMT(M, T) {
//     return M.map(x=>T.map(y=>dotProduct(x, y)));
// }
// function dotProduct(v1, v2) {
//     return v1.map((a, i) => (a * v2[i])).reduce((r, n) => (r + n));
// }
//
// function transposeMatrix(m) {
//     return m[0].map((x,i) =>(m.map(y => y[i])));
// }
// function crossEntropyMatrix(outs, targets){
//     return outs.map((out, i)=>{
//         const target = targets[i];
//         return crossEntropy(out, target);
//     })
// }
// function crossEntropy(out, target){
//     const loss = -out.reduce((r, o, i)=>{
//         return r + target[i] * Math.log(o);
//     })
//     return loss;
// }
