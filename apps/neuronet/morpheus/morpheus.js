// import './gpu-browser.min.js';
// const gpu = new GPU.GPU();

export class gptModel{
    tokens = [];
    vectorSize = 32;
    negativeSize = 5;
    trainCount = 0;
    trainKoef = 0.1;
    sampleKoef = .9;
    progress = 0;
    size = 0;
    quant = 1;
    _array = [];
    step = 2;
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
    async prompt(text, plastic = .1){
        let {input, current} = this.scan(text, plastic);
        let item = this.getTokenItem(current);
        let output = '';
        let next = Object.keys(item.next);
        let count = 1000;
        while (count-- && next.length){
            if(next.length > 1) {
                const {output} = this.forward(item.layers, input);
                next = next.sort((a,b)=>{
                    return item.next[a]>item.next[b]?-1:1;
                })
                next = next.map(t=>{
                    const nextItem = this.getTokenItem(t);
                    const s = cosSimilar(output, nextItem.emb);
                    return {t, s};
                });
                next = next.filter(i => i.s >.5);
                if(!next.length){
                    next = this.tokens.map(t=>{
                        const s = cosSimilar(output, t.emb);
                        return {t:t.id, s};
                    })
                    next = next.filter(i => i.s >.5);
                }
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
            this.updateInput(item.emb, input);
            next = Object.keys(item.next);
        }
        return output.trim();
    }
    updateInput(emb, input){
        for (let i = 0; i <emb.length; i++) {
            input[i] = input[i] * this.sampleKoef  +  emb[i];
        }
    }

    similarWords(t1, t2){
        t1 = this.join(t1);
        t2 = this.join(t2);
        return cosSimilar(t1, t2);
    }
    join(word){
        const result = this.array().map(i=>0.0);
        let cnt = 0;
        for (let t = 0; t < word.length; t++){
            const token = word.substr(t, this.step);
            if (token.length <this.step) break;
            const emb = this.getTokenItem(token).emb;
            if (emb){
                for(let i = 0; i < emb.length; i++){
                    result[i] += emb[i];
                }
            }
            cnt++;
        }
        // if (cnt){
        //     for(let i = 0; i < result.length; i++){
        //         result[i] /=cnt;
        //     }
        // }
        return result;
    }
    array(size = this.vectorSize){
        return this._array[size] ??= [...Array(size)];
    }
    initWeight(){
        return (Math.random() - .5)  * 10;
    }
    getTokenItem(token){
        let item = tokenMap[token] ??= this.tokens.find(i=>i.id === token)
        if (!item){
            item = tokenMap[token] = Object.create(null);
            item.id = token;
            // item.code = this.array().map(i=>0);
            item.emb = this.array().map(i=>this.initWeight());
            item.cnt = this.array().map(i=>this.initWeight());
            item.net = this.array(this.vectorSize * 2 * this.vectorSize).map(i=>this.initWeight());
            // item.layers.push(this.array(this.vectorSize * 2).map(i=>{
            //     return this.array(this.vectorSize).map(i=>this.initWeight());
            // }));
            // item.layers.push(this.array(this.vectorSize - 2).map(i=>{
            //     return this.array(this.vectorSize - 4).map(i=>this.initWeight());
            // }));
            // item.layers.push(this.array(this.vectorSize - 4).map(i=>{
            //     return this.array(this.vectorSize - 2).map(i=>this.initWeight());
            // }));
            // item.layers.push(this.array(this.vectorSize - 2).map(i=>{
            //     return this.array(this.vectorSize).map(i=>this.initWeight());
            // }));

            item.next = Object.create(null);
            item.tokenError = 1;
            item.count = 0;
            item.predicateError = 1;
            this.tokens.push(item);
            this.size = this.tokens.length;
            // const code = (this.size + 256).toString(2);
            // for(let i = 0; i<code.length; i++){
            //     item.code[i] = +code[i];
            // }
        }
        return item;
    }
    tokenize(text){
        const corpus = [];
        let prev;
        const step = this.step;
        for (let i = 0; i < text.length; i++){
            let token = text.substr(i, step);
            if (token.length < step) break;
            let tokenItem = this.getTokenItem(token);
            tokenItem.count++;
            corpus.push(token);
            if (prev){
                let prevItem = tokenMap[prev];
                prevItem.next[token] ??= 0;
                prevItem.next[token]++;
            }
            prev = token;
        }
        return corpus;
    }
    scan(corpus= []){
        let prev, idx, neg, sample, n, token, current, next;
        const size = corpus.length;
        let error = 0;
        const inputs = [this.array().map(i=>0), this.array().map(i=>0)];
        for (let i = 0; i<size; i++){
            current = corpus[i];
            current = this.getTokenItem(current);
            next = corpus[i + 1];
            if (!next)
                sample = [current.emb];
            else{
                next = this.getTokenItem(next);
                sample = [next.cnt];
            }
            n = this.negativeSize;
            while (n){
                idx = Math.floor(Math.random() * size);
                neg = corpus[idx];
                if (neg === current) continue;
                if (current.next[neg]) continue;
                neg = this.getTokenItem(neg);
                sample.push(neg.cnt);
                n--;
            }
            error += this.trainEmb(current, sample);
            this.trainLink(current, next, inputs);
            inputs[1] = inputs[0];
            inputs[0] = current.emb;
            prev = current;
        }
        this.onScan();
        return {current, error};
    }
    trainLink(current, targets, inputs){
        const first = inputs[0];
        const second = inputs[1];
        const net = current.net;
        const size = this.vectorSize;
        const sizeX = size * size;
        const outputs = this.array().map(i=>0);
        let loss, sum, target;
        let err = 0;
        let pred;
        for(let i = 0, j = 0; i < sizeX; i += size){
            sum = 0;
            for(let w = 0; w<size; w++){
                sum += first[w] * net[i + w];
                sum += second[w] * net[i + sizeX + w];
            }
            target = expTable[parseInt((targets[i] + MAX_EXP) * (EXP_TABLE_SIZE / MAX_EXP / 2))];
            if (sum > MAX_EXP)
                pred = 1;
            else if (sum < -MAX_EXP)
                pred = 0;
            else
                pred = expTable[parseInt((sum + MAX_EXP) * (EXP_TABLE_SIZE / MAX_EXP / 2))];
            loss = target - pred;
            outputs[j] = pred;
            err += Math.abs(loss);
            j++;
        }

        //todo доделать обратный проход;

    }
    trainEmb(current, sample){
        this.trainCount++;
        let emb = current.emb;
        const losses = this.array().map(i=>0)
        let err = 0;
        const alpha = this.trainKoef;
        let loss, target, sum;
        for (let s = 0; s<sample.length; s++){
            const cnt = sample[s];
            sum = 0;
            for (let i = 0; i <emb.length; i++) {
                sum += emb[i] * cnt[i];
            }
            target = +!s;

            if (sum > MAX_EXP)
                loss = target - 1;
            else if (sum < -MAX_EXP)
                loss = target - 0;
            else
                loss = target - expTable[parseInt((sum + MAX_EXP) * (EXP_TABLE_SIZE / MAX_EXP / 2))];
            if (!loss) continue;
            err += Math.abs(loss);
            loss *= alpha;
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
        // this.updateInput(emb, input)
        // const layers = main.curItem.layers;
        // const targets = main.nextItem.emb;
        // const {error} =  this.forward(layers, input, targets, plastic);
        // main.curItem.predicateError = error;

    }
    forward(layers, inputs, targets, plastic){
        let outputs = [];
        let predicates = [];
        let predicate;
        for(let l = 0; l<layers.length; l++){
            const layer = layers[l];
            const sum = outputs[l] = this.array(layer[0].length).map(i=>0);
            for(let n = 0; n<layer.length; n++){
                const inVal = inputs[n];
                const weights = layer[n];
                for(let w = 0; w<weights.length; w++){
                    sum[w] += inVal * weights[w];
                }
            }
            predicate = predicates[l] = [];
            for(let out = 0; out<sum.length; out++){
                const x = sum[out];
                predicate[out] = 1 / (1 + Math.exp(-x));
            }
            inputs = predicate;
        }
        let error = 0;
        if(targets){
            let loss = targets.map((t, i)=>{
                t = 1 / (1 + Math.exp(-t));
                const e = t - predicate[i];
                error += Math.abs(e);
                return e
            });
            error /= loss.length;
            for(let l = layers.length-1; l>=0; l--){
                const corrects = loss.map((loss,i)=>{
                    return loss * predicate[i] * (1-predicate[i]);
                })
                predicate = predicates[l - 1] || inputs;
                const layer = layers[l];
                loss = this.array(layer.length).map(i=>0);
                for(let n = 0; n<layer.length; n++){
                    const weights = layer[n];
                    for(let w = 0; w<weights.length; w++){
                        loss[n] += weights[w] * corrects[w];
                        weights[w] += predicate[n] * corrects[w] * this.trainKoef * plastic;
                    }
                }
            }
        }
        return {output: outputs.last, predicate: predicates.last, error};
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
