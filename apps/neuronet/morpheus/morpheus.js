// import './gpu-browser.min.js';
// const gpu = new GPU.GPU();

export class gptModel{
    tokens = [];
    vectorSize = 256;
    negativeSize = 5;
    trainCount = 0;
    trainKoef = .1;
    progress = 0;
    size = 0;
    lookBack = 2;
    _array = [];
    step = 3;
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
    }
    async prompt(text){
        const tokens = this.tokenize(text, true);
        let {inputs, current} = this.trainLinks(tokens, .1);
        let item = current;
        let output = '';
        let next = Object.keys(item.next);
        let count = 1000;
        while (count-- && next.length){
            if(next.length > 1) {
                const {outputs} = this.forward(item, inputs, null, .1);
                next = next.map(t=>{
                    const nextItem = this.getTokenItem(t);
                    const s = cosSimilar(outputs, nextItem.emb);
                    return {t, s};
                });
                // next = next.filter(i => i.s >.5);
                // if(!next.length){
                //     next = this.tokens.map(t=>{
                //         const s = cosSimilar(output, t.emb);
                //         return {t:t.id, s};
                //     })
                //     next = next.filter(i => i.s >.5);
                // }
                next = next.sort((a,b)=>{
                    return a.s>b.s?-1:1;
                })
                next = next.map(i=>i.t);

            }
            current = next[0];
            if(!current) break;
            const character = current[1];
            output += character;
            if (character === '.')
                break;
            item = this.getTokenItem(current);
            this.updateInput(item.emb, inputs);
            next = Object.keys(item.next);
        }
        return output.trim();
    }
    updateInput(emb, input){
         // todo брать сигмоиду
        for(let i = 0; i<input.length; i++){
            input[i] = input[i] * .8 +  emb[i];
        }
        // input.splice(0, this.vectorSize);
        // // for (let i = 0; i<input.length; i++) {
        // //     input[i] /= 2;
        // // }
        // input.push(...emb);
        return input;
    }

    similarWords(t1, t2){
        t1 = this.join(t1);
        t2 = this.join(t2);
        return cosSimilar(t1, t2);
    }
    join(word){
        const result = this.array().map(i=>0.0);
        for (let t = 0; t < word.length; t++){
            const token = word.substr(t, this.step);
            if (token.length <this.step) break;
            const emb = this.getTokenItem(token).emb;
            if (emb){
                for(let i = 0; i < emb.length; i++){
                    result[i] += emb[i];
                }
            }
        }
        return result;
    }
    array(size = this.vectorSize){
        return this._array[size] ??= [...Array(size)];
    }
    initWeight(){
        return (Math.random() - .5) ;
    }
    getTokenItem(token){
        let item = tokenMap[token] ??= this.tokens.find(i=>i.id === token)
        if (!item){
            item = tokenMap[token] = Object.create(null);
            item.id = token;
            item.emb = this.array().map(i=>this.initWeight());
            item.cnt = this.array().map(i=>this.initWeight());
            item.net = [];
            item.net.push(this.array(this.vectorSize).map(i=>{
                return this.array(this.vectorSize).map(i=>this.initWeight());
            }));
            item.net.push(this.array(this.vectorSize).map(i=>{
                return this.array(this.vectorSize).map(i=>this.initWeight());
            }));
            item.net.push(this.array(this.vectorSize).map(i=>{
                return this.array(this.vectorSize).map(i=>this.initWeight());
            }));


            item.next = Object.create(null);
            item.tokenError = 1;
            item.count = 0;
            item.predicateError = 1;
            this.tokens.push(item);
            this.size = this.tokens.length;
        }
        return item;
    }
    tokenize(text, prompt){
        const corpus = [];
        let prev;
        const step = this.step;
        for (let i = 0; i < text.length; i++){
            let token = text.substr(i, step);
            if (token.length < step) break;
            let tokenItem = this.getTokenItem(token);
            corpus.push(token);
            if(prompt)
                continue;
            tokenItem.count++;
            if (prev){
                let prevItem = tokenMap[prev];
                prevItem.next[token] ??= 0;
                prevItem.next[token]++;
            }
            prev = token;
        }
        return corpus;
    }
    scan(corpus= [], plastic){
        let sample, current, next;
        const size = corpus.length;
        let error = 0;
        for (let i = 0; i<size; i++){
            let current = corpus[i];
            current = this.getTokenItem(current);
            let next = corpus[i + 1];
            const sample = [];
            if(next){
                next = this.getTokenItem(next);
                sample.push({cnt: next.cnt, target: 1});
            }
            let n = this.negativeSize;
            while (n){
                const idx = Math.floor(Math.random() * size);
                let neg = corpus[idx];
                if (neg === current) continue;
                if (current.next[neg]) continue;
                neg = this.getTokenItem(neg);
                sample.add({cnt: neg.cnt, target: 0});
                n--;
            }
            error += this.trainEmb(current, sample, plastic);
        }
        this.onScan();
        error /= size;
        return error;
    }
    trainLinks(corpus= [], plastic){
        const inputs = this.array(this.vectorSize).map(i=>1);
        const size = corpus.length;
        let error = 0;
        let res;
        let current;
        for (let i = 0; i<size; i++){
            current = corpus[i];
            current = this.getTokenItem(current);
            let target = corpus[i + 1];
            target = target && this.getTokenItem(target);
            res = this.forward(current, inputs, target?.emb || this.array().map(i=>1), plastic);
            error += res.error;
            this.updateInput(current.emb, inputs);
        }
        this.onScan();
        error /= size;
        const outputs = res.outputs;
        return {error, current, inputs};
    }
    trainEmb(current, sample, plastic=1){
        this.trainCount++;
        let emb = current.emb;
        const losses = this.array().map(i=>0)
        let err = 0;
        const alpha = this.trainKoef;
        let loss, target, sum, pred;
        for (let s = 0; s<sample.length; s++){
            const cnt = sample[s].cnt;
            target = sample[s].target;
            sum = 0;
            for (let i = 0; i <emb.length; i++) {
                sum += emb[i] * cnt[i];
            }
            pred = this.sigm(sum);
            loss = target - pred;
            if (loss === 0) continue;
            err += Math.abs(loss);
            loss *=  alpha * plastic;
            for (let i = 0; i <emb.length; i++) {
                losses[i] += loss * cnt[i];
                cnt[i] += loss * emb[i];
            }
        }
        current.tokenError = (err /= sample.length);
        if (current.tokenError){
            for(let i = 0; i<this.vectorSize; i++){
                emb[i] += losses[i];
            }
        }
        return err;
    }
    sigm(x){
        if (x > MAX_EXP)
            return  1;
        if (x < -MAX_EXP)
            return  0;
        return expTable[parseInt((x + MAX_EXP) * (EXP_TABLE_SIZE / MAX_EXP / 2))];
    }
    forward(current, inputs, targets, plastic= 1){
        const layers = current.net;
        const alpha = this.trainKoef;
        let outputs;
        let predicate = inputs/*.map(x=>{
            return this.sigm(x);
        });*/
        let predicates = [predicate];

        for(let l = 0; l<layers.length; l++){
            const layer = layers[l];
            outputs = this.array(layer[0].length).map(i=>0);
            for(let n = 0; n<layer.length; n++){
                const inVal = predicate[n];
                const weights = layer[n];
                for(let w = 0; w<weights.length; w++){
                    outputs[w] += inVal * weights[w];
                }
            }
            predicate = predicates[l+1] = [];
            for(let out = 0; out<outputs.length; out++){
                predicate[out] = this.sigm(outputs[out]);
            }
        }
        let error = 0;
        if(targets){
            let losses = targets.map((target, i)=>{
                // let loss = target - outputs[i];
                // loss = this.sigm(loss);
                target = this.sigm(target);
                let pred = predicate[i];
                let loss = target - pred;
                error += Math.abs(loss);
                loss = loss * pred * (1 - pred);
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
                    errors[n] = sum * pred * (1 - pred);
                    for(let w = 0; w<weights.length; w++){
                        weights[w] += losses[w] * pred * alpha * plastic;
                    }
                }
                losses = errors;
            }
        }
        return {outputs, error};
    }
}
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
function cosSimilar(A, B) { //На входе 2 вектора
    if (!A || !B) return 0;
    const m = A?.length || 0;
    let scalar = 0;
    let avgA = 0;
    let avgB = 0;
    for (let i = 0; i < m; i++){
        let a = A[i];
        let b = B[i];
        scalar += a * b;
        avgA += a * a;
        avgB += b * b;
    }
    return Math.abs((scalar && scalar / (Math.sqrt(avgA) * Math.sqrt(avgB))) || 0) ;
}
