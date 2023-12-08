// import './gpu-browser.min.js';
// const gpu = new GPU.GPU();
export class gptModel{
    tokens = [];
    vectorSize = 16;
    negativeSize = 5;
    trainCount = 0;
    trainKoef = .1;
    sampleKoef = .8;
    progress = 0;
    size = 0;
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
                const predict = this.forward(item.layers, input);
                next = next.sort((a,b)=>{
                    return item.next[a]>item.next[b]?-1:1;
                })
                next = next.map(t=>{
                    const nextItem = this.getTokenItem(t);
                    const s = cosSimilar(predict, nextItem.emb);
                    return {t, s};
                });
                next = next.sort((a,b)=>{
                    return a.s>b.s?-1:1;
                })
                next = next.map(i=>i.t);

            }
            current = next[0];
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
            input[i] = input[i] * this.sampleKoef + code[i];
        }
    }
    similarWords(t1, t2){
        t1 = this.join(t1);
        t2 = this.join(t2);
        return cosSimilar(t1, t2);
    }
    join(word){
        const result = this.array(this.vectorSize).map(i=>0.0);
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
    array(size){
        return this._array[size] ??= [...Array(size)];
    }
    initWeight(){
        return Math.random() - .5;
    }
    getTokenItem(token){
        let item = tokenMap[token] ??= this.tokens.find(i=>i.id === token)
        if (!item){
            item = tokenMap[token] = Object.create(null);
            item.id = token;
            item.code = this.array(this.vectorSize).map(i=>0);
            item.emb = this.array(this.vectorSize).map(i=>this.initWeight());
            item.cnt = this.array(this.vectorSize).map(i=>this.initWeight());
            item.layers = [];
            item.layers.push(this.array(this.vectorSize).map(i=>{
                return this.array(this.vectorSize /2).map(i=>this.initWeight());
            }));
            item.layers.push(this.array(this.vectorSize /2).map(i=>{
                return this.array(this.vectorSize).map(i=>this.initWeight());
            }));
            // item.layers.push(this.array(this.vectorSize - 8).map(i=>{
            //     return this.array(this.vectorSize - 4).map(i=>this.initWeight());
            // }));
            // item.layers.push(this.array(this.vectorSize - 4).map(i=>{
            //     return this.array(this.vectorSize).map(i=>this.initWeight());
            // }));

            item.next = Object.create(null);
            item.tokenError = 1;
            item.count = 0;
            item.predicateError = 0;
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
        let input = this.array(this.vectorSize).map(i=>0.0);
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
                        this.train(trainData, input);
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
        const code = main.curItem.code;
        this.updateInput(main.curItem.code, input);
        const layers = main.curItem.layers;
        const targets = main.nextItem.emb;
        let cache = [];
        let outputs = this.forward(layers, input, cache, 1 - main.curItem.predicateError);
        let similar = cosSimilar(outputs, targets);
        if(similar<main.curItem.predicateError){
            let next = 0
            while(similar > next){
                outputs = this.forward(layers, input, cache, 1 - similar);
                next = cosSimilar(outputs, targets);
            }
            similar = next;
        }
        main.curItem.predicateError = similar;
    }
    forward(layers, inputs, cache, step){
        let outputs;
        for(let l = 0; l<layers.length; l++){
            outputs = [];
            const layer = layers[l];
            if(cache){
                const old = cache[l];
                if(old){
                    layer[old.l][old.w] = old.v;
                }
                const rndL = Math.floor(Math.random() * layer.length);
                const rndW = Math.floor(Math.random() * layer[0].length);
                cache[l] = {l: rndL, w: rndW, v: layer[rndL][rndW]};
                layer[rndL][rndW] = layer[rndL][rndW] + (Math.random() - .5) * step * 2;
            }
            for(let i = 0; i<layer.length; i++){
                const inVal = inputs[i];
                const weights = layer[i];
                for(let w = 0; w<weights.length; w++){
                    outputs[w] = (outputs[w] || 0) + inVal * weights[w];
                }
            }
            inputs = [];
            if(l === layers.length - 1) continue;
            for(let out = 0; out<outputs.length; out++){
                const x = outputs[out];
                inputs[out] = 1 / (1 + Math.exp(-x));
            }
        }
        return outputs;
    }
}
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
