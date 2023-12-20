// import './gpu-browser.min.js';
// const gpu = new GPU.GPU();
export class gptModel{
    tokens = [];
    positional = [];
    vectorSize = 64;
    negativeSize = 5;
    trainKoef = 1/Math.sqrt(this.vectorSize);
    progress = 0;
    size = 0;
    attantionSize = 16;
    attantionDivider = Math.sqrt(this.attantionSize);
    _array = [];
    step = 2;
    QUERY = [];
    KEY = [];
    VALUE = [];
    topK = 1;
    discrete = 100;
    get discreteX(){
        return this._dx ??= this.discrete * this.discrete;
    }
    get predicateError(){
        if (!this.size)
            return 1;
        const sum = this.tokens.reduce((res,i)=>{
            res += i.predicateError;
            return res;
        }, 0);
        return sum/this.size;
    }
    get tokenError(){
        if (!this.size)
            return 1;
        const tokens = this.tokens.filter(i=>i.count);
        const sum = tokens.reduce((res,i)=>{
            res += i.tokenError;
            return res;
        }, 0);
        return sum/tokens.length;
    }
    constructor(tokens = []) {
        this.tokens = tokens;
        this.size = this.tokens.length;
        for(let i = 0; i<this.attantionSize; i++){
            this.QUERY[i] = this.array().map(i=>this.initWeight());
            this.KEY[i] = this.array().map(i=>this.initWeight());
            this.VALUE[i] = this.array().map(i=>this.initWeight());

        }
    }
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
                const {outputs} = this.forward(prev, item, null, thread);
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
    }
    genPositional(pos = 0){
        return this.positional[pos] ??= genPositional(this.vectorSize, pos, this.discrete);
    }
    async similarWords(t1, t2){
        t1 = await this.join(t1);
        t2 = await this.join(t2);
        return cosSimilar(t1, t2);
    }
    async join(word){
        const corpus = await this.tokenize(word, true);
        const result = this.array();
        for (let t = 0; t < corpus.length; t++){
            const token = corpus[t];
            if (!token) break;
            const emb = token.emb;
            for(let i = 0; i < emb.length; i++){
                result[i] += emb[i];
            }
        }
        return result;
    }
    array(size = this.vectorSize){
        return Array(size).fill(0);
    }
    initWeight(){
        return Math.round((Math.random() - .5) * this.discrete * this.trainKoef) ;
    }
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
                item.cnt = this.array().map(i=>this.initWeight());
                item.net = [];
                item.net.push(this.array(this.vectorSize).map(i=>{
                    return this.array(this.vectorSize).map(i=>this.initWeight());
                }));
                // item.net.push(this.array(this.vectorSize / 2).map(i=>{
                //     return this.array(this.vectorSize).map(i=>this.initWeight());
                // }));
                // item.net.push(this.array(this.vectorSize).map(i=>{
                //     return this.array(this.vectorSize).map(i=>this.initWeight());
                // }));
                item.next = Object.create(null);
                item.tokenError = 1;
                item.count = 0;
                item.predicateError = 1;
                this.tokens.push(item);
                this.size = this.tokens.length;
            }
        }
        return item;
    }
    async tokenize(text, prompt){
        const corpus = [];
        const step = this.step;
        const size = text.length;
        const limit = Math.ceil(size / 100);
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
    }
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
                    sum += multiply(emb[i], cnt[i]);
                }
                sum /= this.discreteX;
                pred = this.activate(sum);
                loss = sample.t - pred;
                if (loss === 0) continue;
                err += Math.abs(loss);
                loss = loss * alpha  * thread.plast;
                for (let i = 0; i <emb.length; i++) {
                    losses[i] += loss * cnt[i];
                    cnt[i] = Math.round(cnt[i] + loss * emb[i]) || 1;
                }
            }
            if (err){
                for(let i = 0; i<this.vectorSize; i++){
                    emb[i] = Math.round(emb[i] + losses[i]) || 1;
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
    async train(corpus= [], thread = {pos: 0, plast: 1, word: '', w: 0, emb: this.array(), input: this.array(), words: []}){
        let input;
        const size = corpus.length;
        let error = 0;
        let res;
        let current, prev;
        let step = this.step;
        const limit = Math.ceil(size / 100);
        for (let i = 0; i<size; i++){
            current = corpus[i];
            let target = corpus[i + 1];

            res = this.forward(prev, current, target?.emb || this.array().map(i=>1), thread);
            error += res.error;
            if (i && i%limit === 0){
                await new Promise(resolve => {
                    setTimeout(()=>{
                        this.onScan(i/size, undefined, error/i);
                        resolve();
                    });
                })
            }
            prev = current;
        }
        this.onScan(0);
        error /= size;
        return {error, current};
    }

    activate(x){
        return sigmoid(x);
        // return leakyReLU(x);
    }
    derivative(x, f){
        return sigmoidD(x, f);
        // return leakyReLUD(x);
    }
    calcQuery(emb){

    }
    forward(prev, current, targets, thread){
        let inputs = this.genPositional(thread.pos);

        if(current.isDelimeter){
            if(thread.word){
                thread.words.push({
                    w:thread.word,
                    e:thread.emb,
                    Q:multiplyA2M(thread.emb, this.QUERY, this.discrete),
                    K:multiplyA2M(thread.emb, this.KEY, this.discrete),
                    V:multiplyA2M(thread.emb, this.VALUE, this.discrete),
                    Z:this.array(this.attantionSize)
                })
            }

            thread.word = '';
            thread.emb = this.array();
        }
        else
            thread.word += current.id[0];

        if(current.isTerminal){
            thread.pos = 0;
            const wSize = thread.words.length;
            for(let i = 0; i<wSize; i++){
                const target = thread.words[i];
                let scores = [];
                for(let j = 0; j<wSize; j++) {
                    const word = thread.words[j];
                    scores[j] = Math.abs(dotProduct(target.Q, word.K) / this.attantionDivider / this.discreteX);
                }
                scores = softmax(scores);
                for(let j = 0; j<wSize; j++) {
                    const word = thread.words[j];
                    const score = scores[j];
                    for(let v = 0; v<word.V.length; v++){
                        target.Z[v] += word.V[v] * score;
                    }
                }
                console.log(target.Z);
            }
            thread.words = [];
        }
        else{
            thread.pos++
        }

        const layers = current.net;
        const alpha = this.trainKoef;
        let outputs;
        const emb = current.emb;
        const eprev = prev?.emb || this.array();
        let predicate = [];
        for(let i = 0; i< inputs.length; i++){
            const embPos = emb[i] + inputs[i] //+ thread.input[i] / 2;
            // thread.input[i] += emb[i];
            thread.emb[i] += embPos;
            predicate[i] = /*this.activate(*/embPos / this.discrete/*);*/
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
        let error = 0;
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
                        weights[w] = Math.round(weights[w] + this.discrete * losses[w] * input * alpha * thread.plast) || 1;
                    }
                    errors[n] = summary * this.derivative(0, input) / this.discrete ;
                }
                losses = errors;
            }
        }
        return {outputs, error};
    }
}
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
function genPositional(dim, pos = 0, discrete = 0){
    const vector = [];
    for(let i = 0; i < dim; i++){
        const v = 1/Math.pow(10000, 2 * i/dim) * pos;
        vector[i] = Math.round(((i%2)?Math.cos(v):Math.sin(v)) * discrete);
    }
    return vector;
}
function multiplyA2M(array, matrix, discrete = 1) {
    const res = Array(matrix.length).fill(0);
    let i, j, k;
    for (i = 0; i < matrix.length; i++) {
        let arr = matrix[i];
        const inVal = array[i];
        for (j = 0; j < arr.length; j++) {
            res[i] += multiply(arr[j], inVal) / discrete;
        }
    }
    return res;
}
function multiply(x,y){
    return x * y;
}
function softmax(arr) {
    return arr.map(function(value,index) {
        return Math.exp(value) / arr.map( function(y /*value*/){ return Math.exp(y) } ).reduce( function(a,b){ return a+b })
    })
}
function dotProduct (a, b) {
    return a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);
}