// import './gpu-browser.min.js';
// const gpu = new GPU.GPU();

export class gptModel{
    tokens = [];
    vectorSize = 32;
    negativeSize = 5;
    trainCount = 0;
    trainKoef = .1;
    sampleKoef = .8;
    progress = 0;
    size = 0;
    quant = 1000;
    _array = [];
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
        const sum = this.tokens.reduce((res,i)=>{
            res += i.tokenError;
            return res;
        }, 0);
        return sum/this.size;
    }
    constructor(tokens = []) {
        this.tokens = tokens;
        this.size = this.tokens.length;
    }
    async prompt(text, plastic = .1){
        const scan = this.scan(text, plastic);
        if (!scan?.then)
            return '';
        let {input, current} = await scan;
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
            this.updateInput(item.code, input);
            next = Object.keys(item.next);
        }
        return output.trim();
    }
    updateInput(code, input){
        for (let i = 0; i <code.length; i++) {
            input[i] = input[i] * this.sampleKoef +  code[i];
        }
    }

    similarWords(t1, t2){
        t1 = this.join(t1);
        t2 = this.join(t2);
        return cosSimilar(t1, t2);
    }
    join(word){
        const result = this.array().map(i=>0.0);
        for (let t = 0; t < word.length - 1; t++){
            const token = word.substr(t, 2);
            const emb = this.getTokenItem(token).emb;
            if (emb){
                for(let i = 0; i < emb.length; i++){
                    result[i] = result[i] * this.sampleKoef + emb[i];
                }
            }
        }
        return result;
    }
    array(size = this.vectorSize){
        return this._array[size] ??= [...Array(size)];
    }
    initWeight(){
        return Math.round((Math.random() - .5)  * this.quant);
    }
    getTokenItem(token){
        let item = tokenMap[token] ??= this.tokens.find(i=>i.id === token)
        if (!item){
            item = tokenMap[token] = Object.create(null);
            item.id = token;
            item.code = this.array().map(i=>0);
            item.emb = this.array().map(i=>this.initWeight());
            item.cnt = this.array().map(i=>this.initWeight());
            item.layers = [];
            item.layers.push(this.array(this.vectorSize).map(i=>{
                return this.array(this.vectorSize - 2).map(i=>this.initWeight());
            }));
            item.layers.push(this.array(this.vectorSize - 2).map(i=>{
                return this.array(this.vectorSize - 4).map(i=>this.initWeight());
            }));
            item.layers.push(this.array(this.vectorSize - 4).map(i=>{
                return this.array(this.vectorSize - 2).map(i=>this.initWeight());
            }));
            item.layers.push(this.array(this.vectorSize - 2).map(i=>{
                return this.array(this.vectorSize).map(i=>this.initWeight());
            }));

            item.next = Object.create(null);
            item.tokenError = 1;
            item.count = 0;
            item.predicateError = 1;
            this.tokens.push(item);
            this.size = this.tokens.length;
            const code = (this.size + 256).toString(2);
            for(let i = 0; i<code.length; i++){
                item.code[i] = +code[i];
            }
        }
        return item;
    }
    getNegatives(token){
        const negatives = [];
        const curItem = this.getTokenItem(token);
        const size = this.size;
        for (let i = 0; i < size; i++){
            const nextItem = this.tokens[Math.floor(Math.random() * size)];
            if (curItem.next[nextItem.id]) continue;
            negatives.add(nextItem);
            if (negatives.length === this.negativeSize) break;
        }
        return negatives;
    }
    scan(text = '', plastic = 1){
        if (text.length<2) return;
        let current = '';
        let input = this.array().map(i=>0.0);
        let i = 0;
        let trainData;
        const limit = Math.round(text.length/20);
        return new Promise((resolve)=>{
            const scanner = ()=>{
                for (i; i < text.length-1; i++){
                    let next = text.substr(i, 2);
                    let nextItem = this.getTokenItem(next);
                    if (current){
                        let curItem = tokenMap[current];
                        curItem.count++;
                        curItem.next[next] ??= 0;
                        curItem.next[next]++;
                        trainData = next.length>1?[{curItem, nextItem, t: 1}]:[];
                        // const neg = this.getNegatives(current);
                        // trainData.push(...neg.map(nextItem =>{
                        //     return {curItem, nextItem, t: 0}
                        // }));
                        this.train(trainData, input, plastic);
                    }
                    current = next;
                    if (i && i%limit === 0) break;
                }
                i++;
                if (i < text.length - 1){
                    setTimeout(()=> {
                        this.progress = (Math.round(i/text.length * 100));
                        scanner();
                    }, 10)
                }
                else{
                    let curItem = tokenMap[current];
                    // const neg = this.getNegatives(current);
                    // trainData = neg.map(nextItem =>{
                    //     return {curItem, nextItem, t: 0}
                    // });
                    // trainData = next.length>1?[{curItem, null, t: 1}]:[];
                    this.train(trainData, input, plastic);
                    this.progress = 0;
                    resolve({input, current});
                }
            }
            scanner();
        })
    }
    train(data, input, plastic = 1){
        this.trainCount++;
        const main = data[0];
        let emb = main.curItem.emb;
        let eVal;
        const losses = this.array().map(i=>0)
        for (let d of data){
            const cnt = d.nextItem.cnt;
            let sum = 0;
            for (let i = 0; i <emb.length; i++) {
                sum += emb[i] * cnt[i] / this.quant / this.quant;
            }
            const p = sum < 0 ? sum * .01 : sum;
            const loss = d.t - p;
            const correct = loss * (sum < 0 ? .01 : 1);
            for (let i = 0; i <emb.length; i++) {
                losses[i] += correct * cnt[i];
                cnt[i] += correct * emb[i];
            }
            main.curItem.tokenError = (main.curItem.tokenError + Math.abs(loss)) / 2;
        }
        for(let i = 0; i<this.vectorSize; i++){
            emb[i] += losses[i] * emb[i];
        }
        return;
        this.updateInput(main.curItem.code, input)
        const layers = main.curItem.layers;
        const targets = main.nextItem.emb;
        const {error} =  this.forward(layers, input, targets, plastic);
        main.curItem.predicateError = error;
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
// const NEURONS = Symbol('n');
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
