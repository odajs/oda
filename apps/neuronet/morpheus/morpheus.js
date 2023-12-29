import './gpu-browser.min.js';

export class gptModel extends ROCKS({
    get model(){
        return this;
    },
    $public:{
        blockSize: 8,
        tokens: {
            $type: Array,
            get(){
                return [{idx: 0, id: '<', char: '<', emb: this.getPositionalVector(0), next:{}, cnt:this.array(), out: this.array().map(i=>this.initWeight()) },
                    {idx: 1, id: '>', char: '>', emb: this.getPositionalVector(0).reverse(), next:{}, cnt:this.array(), out: this.array().map(i=>this.initWeight()) },
                ];
            }
        },
        dim: 32,
        negativeSize: 5,
        feedLayerK: 2,
        step: 2,
        topK: 1,
        deep: 1,
        headCount: 1,
    },
    outLayer:{
        $freeze: true,
        get (){
            return this.tokens.map(token=>{
                return token.out;
            })
        }
    },
    get QUERY(){return this.init()},
    get KEY(){return this.init()},
    get VALUE(){return this.init()},
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
    div: 7,
    fwd(input){
        console.log('gptModel.fwd');
        let output = multiplyMatrix([input], this.outLayer);
        return output[0];
    },
    positional: {
        $freeze: true,
        $def: []
    },
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
        input.unshift(this.tokens[0].emb);
        wordObj.tokens.push(this.tokens[1]);
        for (let decoder of this.decoders){
            input = decoder.fwd(input, [word]);
        }
        let output = input;
        let linear = transposeAndMultiplyMatrix(output, this.outLayer);
        const softmax = softmaxMatrix(linear);
        output = softmax.map(logit=>{
            let idx = -1;
            let v = 0 ;
            for(let i = 0; i < logit.length; i++){
                if(logit[i] > v){
                    idx = i;
                    v = logit[i];
                }
            }
            return idx;

        const E = softmax.map((logit, t)=>{
            const idx = output[t];
            return logit.map((y, i)=>{
                return (idx === i)?1:0 - y;
            })
        });
        let back = multiplyMatrix(E, this.outLayer);
        const corrects = multiplyMatrix(transposeMatrix(E), input);
        this.outLayer.forEach((t, i)=>{
            const correct = corrects[i];
            for(let j = 0; j < t.length; j++){
                t[j] += correct[j];
            }
        })

        for (let i = this.decoders.length-1; i>=0; i--) {
            const decoder = this.decoders[i];
            back = decoder.back(back);
        }
        })
        output.forEach(i=>{
            this.fire('predicate', this.tokens[i].id);
            // return this.tokens[i].char
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
        while(step < 10){
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
                item.out = this.array().map(i=>this.initWeight());
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
    fwd(input){
        const query = multiplyMatrix(input, this.QUERY);
        const key = multiplyMatrix(input, this.KEY);
        const value = multiplyMatrix(input, this.VALUE);
        // const keyT = transposeMatrix(key);
        let scores = transposeAndMultiplyMatrix(query, key);
        scores = scores.map(x=>x.map(y=>(y/this.model.attDiv)));
        scores = softmaxMatrix(scores);
        return multiplyMatrix(scores, value);
    }
}){}
class gptHeadAttentionDecode extends gptHeadAttention.ROCKS({
    fwd(input, encoded = input){
        const query = multiplyMatrix(input, this.QUERY);
        const key = multiplyMatrix(encoded, this.KEY);
        const value = multiplyMatrix(encoded, this.VALUE);
        // const keyT = transposeMatrix(key);
        let scores = transposeAndMultiplyMatrix(query, key);
        scores = scores.map(x=>x.map(y=>(y/this.model.attDiv)));
        scores = scores.map((y, i)=>y.map((x,j)=>(j>i)?-Infinity:x)); //mask
        scores = softmaxMatrix(scores);
        return multiplyMatrix(scores, value);
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
            return new this.headItemClass(this);
        })
    },
    get headItemClass(){
        return (this.owner instanceof gptDecoder)?gptHeadAttentionDecode:gptHeadAttention;
    },
    fwd(input, encoded){
        let output = this.heads.map(head => head.fwd(input, encoded));
        output = output.reduce((r,h)=>r.map((w, i)=>w.concat(h[i])), input.map(i=>[])) //concat
        output = multiplyMatrix(output, this.WO);
        return addAndNormalizeMatrix(input, output);
    }
}){}
class gptFeedLayers extends gptItem.ROCKS({
    $public:{
        $freeze: true,
        get bias1(){
            return this.model.array(this.model.feedLayerSize).map(i=>this.model.initWeight());
        },
        get bias2(){
            return this.model.array(this.model.dim).map(i=>this.model.initWeight());
        },
        get feedLayer1(){
            return this.model.array().map(i=>this.model.array(this.model.feedLayerSize).map(i=>this.model.initWeight()));
        },
        get feedLayer2(){
            return this.model.array(this.model.feedLayerSize).map(i=>this.model.array().map(i=>this.model.initWeight()));
        }
    },
    fwd(input){
        console.log('gptFeedLayers.fwd');
        let output = multiplyMatrix(input, this.feedLayer1);
        output = leakyReLUMatrix(output);
        output = multiplyMatrix(output, this.feedLayer2);
        output = addAndNormalizeMatrix(input, output);
        return output;
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
        return output;
    },
    back(losses){
        losses = losses.reduce((r,x)=>{
            for(let i = 0; i<r.length; i++){
                r[i] += x[i];
            }
            return r;
        }, this.model.array())
        console.log(losses)
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
function leakyReLUMatrix(m){
    return m.map(a=>a.map(x=>leakyReLU(x)));
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

function softmax(arr) {
    return arr.map(function(value,index) {
        return Math.exp(value) / arr.map( function(y /*value*/){ return Math.exp(y) } ).reduce( function(a,b){ return a+b })
    })
}
function softmaxMatrix(m) {
    return m.map(i=>softmax(i))
}
function addMatrix(m1, m2){
    return m1.map((m, i) => addVectors(m, m2[i]));
}
function addVectors(v1, v2){
    return v1.map((a, i) => v2[i] + a);
}
function addAndNormalizeMatrix(m1, m2){
    return addMatrix(m1, m2).map(v=>layerNormalization(v));
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
const gpu = new GPU.GPU();

const gpuMultiplyMatrix = gpu.createKernel(function (a, b){
    let sum = 0;
    for (let i = 0; i < 512; i++) {
        sum += a[this.thread.y][i] * b[i][this.thread.x];
    }
    return sum;
}).setOutput([512, 512])

function multiplyMatrix(A, B){
    return A.map((row, i) =>
        B[0].map((_, j) =>
            row.reduce((acc, _, n) =>
                acc + A[i][n] * B[n][j], 0
            )
        )
    )
}

function transposeAndMultiplyMatrix(m1, m2) {
    return m1.map(x=>m2.map(y=>dotProduct(x, y)));
}
function dotProduct(v1, v2) {
    return v1.map((a, i) => (a * v2[i])).reduce((r, n) => (r + n));
}

function transposeMatrix(m) {
    return m[0].map((x,i) =>(m.map(y => y[i])));
}