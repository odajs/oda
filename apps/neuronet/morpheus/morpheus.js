// import './gpu-browser.min.js';
// const gpu = new GPU.GPU();

export class gptModel{
    tokens = [];
    positional = [];
    vectorSize = 256;
    negativeSize = 5;
    trainCount = 0;
    trainKoef = 1/Math.sqrt(this.vectorSize);
    progress = 0;
    size = 0;
    attantionSize = 16;
    _array = [];
    step = 2;
    QUERY = [];
    KEY = [];
    VALUE = [];
    topK = 1;
    discrete = 1000;
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
        // multiplyA2M(array, matrix)
    }
    async prompt(text){
        const thread = {pos:0, plast: .1, word: '', w: 0, emb: this.array(), input: this.array()};
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
                // item.net.push(this.array(this.vectorSize/2).map(i=>{
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
        const limit = 10000;
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
    async scan(corpus= [], thread = {pos: 0, plast: 1, word: '', w: 0, emb: this.array(), input: this.array()}){
        const size = corpus.length;
        const alpha = this.trainKoef;
        let sample, current, next, emb, losses, err, sum, pred, loss, correct, target, error = 0;
        const limit = Math.ceil(size / 10);
        for (let i = 0; i<size; i++){
            current = corpus[i];
            next = corpus[i + 1];
            // prepare samples
            sample = [];
            if(next)
                sample.push({cnt: next.cnt, target: 1});
            // prepare negative samples
            let n = this.negativeSize;
            while (n){
                const idx = Math.floor(Math.random() * size);
                let neg = corpus[idx];
                if (neg === current) continue;
                if (current.next[neg.id]) continue;
                sample.add({cnt: neg.cnt, target: 0});
                n--;
            }
            // train
            this.trainCount++;
            emb = current.emb;
            losses = this.array()
            err = 0;
            for (let s = 0; s<sample.length; s++){
                const cnt = sample[s].cnt;
                target = sample[s].target;
                sum = 0;
                for (let i = 0; i <emb.length; i++) {
                    sum += emb[i] * cnt[i];
                }
                sum /= this.discreteX;
                pred = this.activate(sum);
                loss = target - pred;
                if (loss === 0) continue;
                if (isNaN(loss)) {
                    console.log(sum, target, pred);
                    throw 'isNaN'
                }
                err += Math.abs(loss);
                loss = loss * alpha  * thread.plast;
                for (let i = 0; i <emb.length; i++) {
                    losses[i] = losses[i] + loss * cnt[i];
                    cnt[i] = Math.round(cnt[i] + loss * emb[i]);
                }
            }
            if (current.tokenError){
                for(let i = 0; i<this.vectorSize; i++){
                    emb[i] = Math.round(emb[i] + losses[i]);
                }
            }
            error += current.tokenError = (err /= sample.length);
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
    async train(corpus= [], thread = {pos: 0, plast: 1, word: '', w: 0, emb: this.array(), input: this.array()}){
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
    forward(prev, current, targets, thread){
        const inputs = this.genPositional(thread.pos);///thread.input;//this.genPositional(thread.pos);

        if(current.isDelimeter){
            thread.word = '';
            thread.emb = this.array();
        }
        else
            thread.word += current.id[0];

        if(current.isTerminal){
            thread.pos = 0;
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
            thread.emb[i] += emb[i];
            predicate[i] = this.activate(emb[i] + inputs[i]);
        }
        let predicates = [predicate];

        for(let l = 0; l<layers.length; l++){
            const layer = layers[l];
            outputs = this.array(layer[0].length);
            for(let n = 0; n<layer.length; n++){
                const inVal = predicate[n];
                const weights = layer[n];
                for(let w = 0; w<weights.length; w++){
                    outputs[w] += inVal * weights[w];
                }
            }
            predicate = predicates[l+1] = [];
            for(let out = 0; out<outputs.length; out++){
                predicate[out] = this.activate(outputs[out]);
            }
        }
        let error = 0;
        if(targets){
            let losses = targets.map((target, i)=>{
                target = this.activate(target);
                let pred = predicate[i];
                let loss = target - pred;
                error += Math.abs(loss);
                loss = loss * this.derivative(0, pred);
                return loss;
            });
            current.predicateError = (error /= losses.length);
            for(let l = layers.length-1; l>=0; l--){
                predicate = predicates[l];
                const layer = layers[l];
                const errors = [];
                for(let n = 0; n<layer.length; n++){
                    const weights = layer[n];
                    let sum = 0;
                    for(let w = 0; w<weights.length; w++){
                        sum += losses[w] * weights[w];
                    }
                    let pred = predicate[n]
                    errors[n] = sum * this.derivative(0, pred);
                    for(let w = 0; w<weights.length; w++){
                        weights[w] += losses[w] * pred * alpha * thread.plast;
                    }
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
    for (let i = 0; i<EXP_TABLE_SIZE; i++){
        tab[i] = Math.exp((i / EXP_TABLE_SIZE * 2 - 1) * MAX_EXP);
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
        vector[i] = Math.round((i%2)?Math.cos(v):Math.sin(v) * discrete);
    }
    return vector;
}
function multiplyA2M(array, matrix) {
    const res = [];
    let i, j, k;
    for (i = 0; i < matrix.length; i++) {
        let arr = matrix[i];
        let m = 0;
        for (j = 0; j < array.length; j++) {
            m += arr[j] * array[j];
        }
        res[i] = m;
    }
    return res;
}
