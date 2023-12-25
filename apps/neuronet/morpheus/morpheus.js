import './gpu-browser.min.js';
const gpu = new GPU.GPU();
export class gptModel extends ROCKS({
    get model(){
        return this;
    },
    blockSize: 8,
    tokens: [],
    positional: [],
    dim: 16,
    negativeSize: 5,
    feedLayerK: 4,
    get feedLayerSize(){
        return this.dim * this.feedLayerK;
    },
    get trainKoef(){
        return 1/Math.sqrt(this.dim);
    },
    progress: 0,
    get size(){
        return this.tokens.length;
    },
    get attDim(){
        return this.dim/this.headCount;
    },
    get attDiv(){
        return Math.sqrt(this.attDim);
    },
    step: 2,
    topK: 1,
    encoderSize: 1,
    decoderSize: 1,
    headCount: 1,
    async transform(text){
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
                word += token.id[0];
                const e = addVectors(token.emb, this.getPositionalVector(pos));
                emb = addAndNormalize(emb, e);
                pos++;
            }
        }
        if (pos)
            thread.push({word, emb});
        console.log(thread);
        let sequence = thread.map((word, pos)=>addVectors(word.emb, this.getPositionalVector(pos))).flat();
        for (let encoder of this.encoders){
            sequence = encoder.fwd(sequence);
        }
        console.log(sequence);
        let pred = this.array().fill(0);
        let step = 0;
        while(pred && step<8){
            const pos = this.getPositionalVector(step++);
            pred = addVectors(pred, pos);
            for (let decoder of this.decoders){
                pred = decoder.fwd(pred, sequence);
            }
            sequence.push(...pred);
            // pred = this.restoreWord(pred);
        }
    },
    restoreWord(pred){
        //todo restore word by tokens
        // return true;
    },
    get encoders(){
        return this.array(this.encoderSize).map(i=>{
            return new gptEncoder(this);
        })
    },
    get decoders(){
        return this.array(this.decoderSize).map(i=>{
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
    async prompt(text){
        const thread = {pos:0, plast: .1, word: '', w: 0, emb: this.array(), input: this.array(), words: []};
        const tokens = await this.tokenize(text, true);
        let {current} = await this.train(tokens, thread);
        let prev = tokens[tokens.length - 2];
        let item = current;
        let output = '';
        let inputs;
        let next = Object.keys(item.next);
        let count = tokens.length;
        while (count++ < 1000 && next.length){
            if(next.length > 1) {
                const {outputs} = this.fwd(prev, item, null, thread);
                next = next.map((t, i)=>{
                    const nextItem = this.getTokenItem(t);
                    const s = cosSimilar(outputs, nextItem.emb);
                    return {t, s, w: s * nextItem.count};
                });
                next = next.sort((a,b)=>{
                    return a.s>b.s?-1:1;
                })
                if(this.topK<2)
                    next = [next[0].t];
                else{
                    let sum = 0;
                    for(let i = 0; i<this.topK; i++){
                        sum += next[i]?.s || 0;
                    }
                    sum = Math.random() * sum;
                    let result;
                    for(let i of next){
                        if(sum<0){
                            result = i;
                            break;
                        }
                        sum -= i.s;
                        if(sum<0){
                            result = i;
                            break;
                        }
                    }
                    next = [result.t];
                }
            }
            current = next[0];
            if(!current) break;
            const cn = current[this.step-1];
            if(!cn) break;
            output += cn;
            prev = item;
            item = this.getTokenItem(current);
            next = Object.keys(item.next);
        }
        return output.trim();
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
            result = addAndNormalize(result, addAndNormalize(emb,  this.getPositionalVector(t)));
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
                item.id = token;
                const ch = token[0];
                if(TERMINATES.includes(ch))
                    item.isTerminal = true;

                //todo еще надо выделять цифры
                if(ch.toUpperCase() === ch.toLowerCase())
                    item.isDelimeter = true;
                item.emb = this.array().map(i=>this.initWeight());
                item.cnt = this.array();
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
                pred = this.activate(sum);
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
    },
    async train(corpus= [], thread = {pos: 0, plast: 1, word: '', w: 0, emb: this.array(), input: this.array(), words: []}){
        let input;
        const size = corpus.length;
        let error = 0;
        let res;
        let current, prev;
        let step = this.step;
        const limit = Math.ceil(size / 10);
        for (let i = 0; i<size; i++){
            current = corpus[i];
            let target = corpus[i + 1];

            res = this.fwd(prev, current, target?.emb || this.array().map(i=>1), thread);
            // error += res.error;
            // if (i && i%limit === 0){
            //     await new Promise(resolve => {
            //         setTimeout(()=>{
            //             this.onScan(i/size, undefined, error/i);
            //             resolve();
            //         });
            //     })
            // }
            prev = current;
        }
        this.onScan(0);
        error /= size;
        return {error, current};
    },
    activate(x){
        return sigmoid(x);
        // return leakyReLU(x);
    },
    derivative(x, f){
        return sigmoidD(x, f);
        // return leakyReLUD(x);
    },
    fwd(prev, current, targets, thread){
        let inputs = this.getPositionalVector(thread.pos);



        if(current.isTerminal){
            thread.pos = 0;
            // this.calcAttention(thread);
            thread.words = [];
            thread.word = '';
            thread.emb = this.array();
        }
        else{
            thread.pos++
        }

        if(current.isDelimeter){
            if(thread.word){
                thread.words.push({
                    w:thread.word,
                    e:thread.emb,
                })
            }

            thread.word = '';
            thread.emb = this.array();
        }
        else{
            thread.word += current.id[0];
            for (let i = 0; i<this.dim; i++){
                thread.emb[i] += current.emb[i];
            }
        }

        return
        //
        const layers = current.net;
        const alpha = this.trainKoef;
        let outputs;
        let error = 0;
        const emb = current.emb;
        const eprev = prev?.emb || this.array();
        let predicate = [];
        for(let i = 0; i< inputs.length; i++){
            const embPos = emb[i] + inputs[i] //+ thread.input[i] / 2;
            // thread.input[i] += emb[i];
            thread.emb[i] += embPos;
            predicate[i] = this.activate(embPos / this.discrete);
        }
        let predicates = [predicate];
        for(let l = 0; l<layers.length; l++){
            const neurons = layers[l];
            outputs = this.array(neurons[0].length);
            for (let n = 0; n<neurons.length; n++){
                const weights = neurons[n];
                const input = predicate[n];
                for(let w = 0; w<weights.length; w++){
                    outputs[w] += weights[w] * input;
                }
            }
            predicate = predicates[l+1] = [];
            for(let out = 0; out<outputs.length; out++){
                predicate[out] = this.activate(outputs[out] / this.discrete);
            }
        }

        if(targets){
            let losses = targets.map((target, i)=>{
                target = this.activate(target / this.discrete);
                let pred = predicate[i];
                let loss = (target - pred);
                error += Math.abs(loss);
                loss = loss * this.derivative(0, pred);
                return loss;
            });
            current.predicateError = (error /= losses.length);
            for(let l = layers.length-1; l>=0; l--){
                const layer = layers[l];
                predicate = predicates[l];
                let errors = this.array(layer.length);
                for(let n = 0; n<layer.length; n++){
                    const weights = layer[n];
                    const input = predicate[n];
                    let summary = 0;
                    for(let w = 0; w<weights.length; w++){
                        summary += losses[w] * weights[w];
                        const v = weights[w] + this.discrete * losses[w] * input * alpha * thread.plast
                        weights[w] = Math.round(v) || Math.sign(v);
                    }
                    errors[n] = summary * this.derivative(0, input) / this.discrete ;
                }
                losses = errors;
            }
        }
        return {outputs, error};
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
class gptTokenizer extends gptItem.ROCKS({

}){}
class gptHeadAttention extends gptItem.ROCKS({
    $public:{
        get QUERY(){return this.init()},
        get KEY(){return this.init()},
        get VALUE(){return this.init()},
        get WO(){return this.init()}
    },
    init(){
        return this.model.array(this.model.dim * this.model.attDim).map(i=>this.model.initWeight());
    },
    fwd(input, encoded){
        let length = input.length / this.model.dim;
        const query = multiplyMatrix(input, this.QUERY, this.model.dim, this.model.attDim, length);
        if (encoded){
            input = [...encoded, ...input];
            length = input.length / this.model.dim;
        }
        const key = multiplyMatrix(input, this.KEY, this.model.dim, this.model.attDim, length);
        const value = multiplyMatrix(input, this.VALUE, this.model.dim, this.model.attDim, length);
        const keyT = transposeMatrix(key, this.model.dim);
        let scores = multiplyMatrix(keyT, query, length, this.model.attDim).map(i=>Math.abs(i / this.model.attDiv));
        scores = softmaxMatrix(scores, length);
        let output = multiplyMatrix(scores, value, length, this.model.attDim);
        return output;
    }
}){}
class gptAttention extends gptItem.ROCKS({
    get heads(){
        return Array(this.model.headCount).fill().map(i=>{
            return new gptHeadAttention(this);
        })
    },
    get WO(){
        return this.heads.map(head=>head.WO).flat();
    },
    fwd(input, encoded){
        let output = this.heads.map(head => head.fwd(input, encoded)).flat();
        output = multiplyMatrix(output, this.WO, this.model.attDim, this.model.dim);
        output = addAndNormalize(input, output);
        return output
    }
}){}
class gptFeedLayers extends gptItem.ROCKS({
    get bias1(){
        return this.model.array(this.model.feedLayerSize).map(i=>this.model.initWeight());
    },
    get bias2(){
        return this.model.array(this.model.dim).map(i=>this.model.initWeight());
    },
    get feedLayer1(){
        return this.model.array(this.model.feedLayerSize * this.model.dim).map(i=>this.model.initWeight());
    },
    get feedLayer2(){
        return this.model.array(this.model.feedLayerSize * this.model.dim).map(i=>this.model.initWeight());
    },
    fwd(input){
        let output = multiplyMatrix(input, this.feedLayer1, this.model.dim, this.model.feedLayerSize);
        output = leakyReLUMatrix(output);
        output = multiplyMatrix(output, this.feedLayer2, this.model.feedLayerSize, this.model.dim);
        output = addAndNormalize(input, output);
        return output;
    },
}){}
class gptEncoder extends gptItem.ROCKS({
    get selfAttention(){
        return new gptAttention(this);
    },
    get selfFeed(){
        return new gptFeedLayers(this);
    },
    fwd(input){
        let output = this.selfAttention.fwd(input);
        output = this.selfFeed.fwd(output);
        return output;
    }
}){}
class gptDecoder extends gptEncoder.ROCKS({
    get mixAttention(){
        return new gptAttention(this);
    },
    get mixFeed(){
        return new gptFeedLayers(this);
    },
    fwd(input, encoded){
        input = this.$super('fwd', input);
        let output = this.mixAttention.fwd(input, encoded);
        output = this.mixFeed.fwd(output);
        return output;
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
const reluK = .01;
function leakyReLU(x){
    if (x < 0)
        return reluK * x;
    return x;
}
function leakyReLUMatrix(arr){
    return arr.map(x=>leakyReLU(x));
}
function leakyReLUD(x){
    if (x < 0)
        return reluK;
    return 1;
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
function multiplyMatrix(m1, m2, width, out, height = (m1.length / width)){
    const res = Array(height * out).fill(0);
    for (let h = 0; h < height; h ++) {
        for (let o = 0; o < out; o++){
            for (let w = 0; w < width; w ++){
                res[h * out + o] = m1[h * width + w] * m2[w * out + o];
            }
        }
    }
    return res;
}
function softmax(v) {
    return v.map(a =>EXP(a) / v.map(a => EXP(a)).reduce((r, b)=>(r + b)))
}
function softmaxMatrix(m, step) {
    const res = [];
    for(let i = 0; i<step; i ++){
        res.push(...softmax(m.slice(i * step, i * step + step)))
    }
    return res.flat();
}
function dotProduct (v1, v2) {
    return v1.map((a, i) => a * v2[i]).reduce((r, n) => (r + n));
}
function addVectors(v1, v2){
    return v1.map((a, i) => v2[i] + a);
}
function addAndNormalize(a, b){
    return layerNormalization(addVectors(a, b));
}
function layerNormalization(v, size = v.length){
    const mu = v.reduce((r, a) => (r + a)) / size;
    if(mu){
        const sigma = Math.sqrt(v.reduce((r, a) => (r + Math.pow((mu - a),2))) / size);
        v = v.map(a => ((a - mu) / sigma));
    }
    return v;
}
function transposeMatrix(m, width, height = m.length / width){
    const res = Array(m.length);
    for (let w = 0; w<width; w++){
        for (let h = 0; h<height; h++){
            res[w * height + h] = m[h * width + w];
        }
    }
    return res;
}