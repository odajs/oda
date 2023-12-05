import './gpu-browser.min.js';
const gpu = new GPU.GPU();

export class gptModel extends ROCKS({
    $public:{
        tokens: {
            $def: [],
            $freeze: true,
        },
        vectorSize: 16,
        negativeSize: 5,
        trainCount: 0,
        trainKoef: .1
    },
    get size(){
        return this.tokens.length;
    },
    progress: 0,
    similarWords(t1, t2){
        t1 = this.join(t1);
        t2 = this.join(t2);
        return cosSimilar(t1, t2);
    },
    join(word){
        const result = this.array.map(i=>0.0);
        for (let t = 0; t < word.length - 1; t++){
            const token = word.substr(t, 2);
            const emb = this.getTokenItem(token).emb;
            if (emb){
                for(let i = 0; i < emb.length; i++){
                    result[i] = result[i] * .9 + emb[i];
                }
            }
        }
        return result;
    },
    get array(){
        return [...Array(this.vectorSize)];
    },
    get halfArray(){
        return  [...Array(this.vectorSize/2)];
    },
    initWeight(){
        return Math.random() - .5;
    },
    getTokenItem(token){
        let item = tokenMap[token] ??= this.tokens.find(i=>i.id === token)
        if (!item){
            item = tokenMap[token] = Object.create(null);
            item.id = token;
            item.emb = this.array.map(i=>this.initWeight());
            item.cnt = this.array.map(i=>this.initWeight());
            item.layers = [this.array.map(i=>{
                return this.halfArray.map(i=>this.initWeight());
            }), this.halfArray.map(i=>{
                return this.array.map(i=>this.initWeight());
            })]
            item.next = Object.create(null);
            item.tokenError = 1;
            item.count = 0;
            item.predicateError = 1;
            this.tokens.push(item);
            this.size = undefined;
        }
        return item;
    },

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
    },
    scan(text){
        if (!text) return;
        let current = '';
        let input = this.array.map(i=>0.0);
        let i = 0;
        let trainData;
        const limit = 10000;
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
                        const neg = this.getNegatives(current);
                        trainData.push(...neg.map(nextItem =>{
                            return {curItem, nextItem, t: 0}
                        }));
                        this.train(trainData, input);
                    }
                    current = next;
                    if (i && i%limit === 0) break;
                }
                i++;
                if (i < text.length - 1){
                    this.async(()=> {
                        this.progress = (Math.round(i/text.length * 100));
                        scanner();
                    })
                }
                else{
                    let curItem = tokenMap[current];
                    const neg = this.getNegatives(current);
                    trainData = neg.map(nextItem =>{
                        return {curItem, nextItem, t: 0}
                    });
                    this.train(trainData, input);
                    this.progress = 0;
                    resolve();
                }
            }
            scanner();
        })
    },
    fns: {},
    train(data, input){
        this.trainCount++;
        const main = data[0];
        let emb = main.curItem.emb;
        for (let d of data){
            const cnt = d.nextItem.cnt;
            let sum = 0;
            for (let i = 0; i <emb.length; i++) {
                sum += emb[i] * cnt[i];
            }
            const pred = 1 / (1 + Math.exp(-sum));
            const loss = d.t - pred;
            const correct = loss * pred * (1 - pred) * this.trainKoef;
            for (let i = 0; i <emb.length; i++) {
                emb[i] += correct * cnt[i];
                cnt[i] += correct * emb[i];
            }
            main.curItem.tokenError = (main.curItem.tokenError + Math.abs(loss)) / 2;
        }
        // const cnts = data.map(i=>{
        //     return i.nextItem.cnt;
        // })
        // const func = this.fns[cnts.length] ??= gpu.createKernel(function(emb, cnts, size) {
        //     let sum = 0;
        //     for(let i = 0; i<size; i++)
        //         sum += cnts[this.thread.x][i] * emb[i];
        //     // }
        //     return sum;
        // }).setOutput([cnts.length]);
        // const res = func(emb, cnts, this.vectorSize);
        // let eVal;
        // for(let c = 0; c<cnts.length; c++){
        //     const cnt = cnts[c];
        //     const pred = 1 / (1 + Math.exp(-res[c]));
        //     const loss = data[c].t - pred;
        //     const correct = loss * pred * (1 - pred) * this.trainKoef;
        //     for (let i = 0; i <emb.length; i++) {
        //         eVal = emb[i];
        //         emb[i] += correct * cnt[i];
        //         cnt[i] += correct * eVal;
        //     }
        //     main.curItem.tokenError = (main.curItem.tokenError + Math.abs(loss)) / 2;
        // }

        if (data.length<2)
            return;

        for (let i = 0; i <emb.length; i++) {
            input[i] = input[i] * .9 + emb[i];
        }

        let error = 0;
        const layers = main.curItem.layers;
        const outputs = this.predicate(layers, input);
        const targets = main.nextItem.emb;
        let neurons = layers[layers.length-1][NEURONS];
        for (let i = 0; i<targets.length; i++){
            const x = outputs[i] ;
            const y =  1 / (1 + Math.exp(-targets[i]));
            const loss = (y - x);
            error += Math.abs(loss);
            neurons[i] = loss;
        }
        error /= targets.length;
        main.curItem.predicateError = (main.curItem.predicateError + error) / 2;
        this.back(layers, input);
    },
    predicate(layers, inputs){
        let outputs;
        for(let l = 0; l<layers.length; l++){
            outputs = [];
            const layer = layers[l];

            for(let i = 0; i<layer.length; i++){
                const inVal = inputs[i];
                const weights = layer[i];

                for(let out = 0; out<weights.length; out++){
                    outputs[out] = (outputs[out] || 0) + inVal * weights[out];
                }
            }
            const neurons = layer[NEURONS] ??= [];
            inputs = [];
            for(let out = 0; out<outputs.length; out++){
                const x = outputs[out];
                neurons[out] = inputs[out] = 1 / (1 + Math.exp(-x));
            }
            outputs = neurons;
        }
        return outputs;
    },
    back(layers, inputs){
        for(let l = layers.length-1; l>=0; l--){
            const layer = layers[l];
            const neuron = layer[NEURONS];
            const prev = layers[l-1]?.[NEURONS] || inputs;
            for(let out = 0; out<layer.length; out++){
                const weights = layer[out];
                let error = 0;
                const y = prev[out];
                for(let i = 0; i<weights.length; i++){
                    error +=  neuron[i] * weights[i];
                    weights[i] += neuron[i] * y * this.trainKoef;
                }
                l && (prev[out] = error *= y * (1 - y))
            }
        }
    }
}){

}
const NEURONS = Symbol('n');
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
