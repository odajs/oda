export class gptModel extends ROCKS({
    $public:{
        tokens: {
            $def: [],
            $freeze: true,
        },
        vectorSize: 16,
        negativeSize: 2,
        scanWindow: 2,
        trainCount: 0,
        trainKoef: .33,
        reLuKoef: .01,
        updateStep: 20000,
        quant: 1000
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
        const result = [];
        let count = 0;
        for (let t = 0; t < word.length; t++){
            const token = word.substr(t, this.scanWindow);
            if (token.length<2) continue;
            const emb = tokenMap[token]?.emb;
            if (emb){
                for(let i = 0; i < emb.length; i++){
                    result[i] = (result[i] || 0) + emb[i];
                }
                count++;
            }
        }
        if (count){
            for(let i = 0; i < result.length; i++){
                result[i] /= count;
            }
        }
        return result;
    },
    get array(){
        return [...Array(this.vectorSize)];
    },
    get hArray(){
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

            item.emb = this.array.map(i=>this.initWeiht());
            item.cnt = this.array.map(i=>this.initWeiht());
            item.layers = [this.array.map(i=>{
                return this.hArray.map(i=>this.initWeiht());
            }), this.hArray.map(i=>{
                return this.array.map(i=>this.initWeiht());
            })]
            item.next = Object.create(null);
            item.tokenError = 1;
            item.predicateError = 1;
            this.tokens.push(item);
            this.size = undefined;
            item.emb[PREV] ??= this.array.map(i=>0);
            item.cnt[PREV] ??= this.array.map(i=>0);
        }
        return item;
    },
    scan(text){
        if (!text) return;
        let current = '';
        let input = [...Array(this.vectorSize)];
        let i = 0;
        let trainData;
        const limit = 10000;
        return new Promise((resolve)=>{
            const scanner = ()=>{
                for (i; i < text.length - 1; i++){
                    let next = text.substr(i, this.scanWindow);
                    let nextItem = this.getTokenItem(next);
                    if (current){
                        let curItem = tokenMap[current];
                        curItem.next[next] = (curItem.next[next] || 0) + 1;
                        trainData = [{curItem, nextItem, target: 1, sum: 0}];
                        const neg = this.getNegatives(current);
                        trainData.push(...neg.map(nextItem =>{
                            return {nextItem, target: 0, sum: 0}
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
                    this.progress = 0;
                    resolve();
                }
            }
            scanner();
        })
    },
    getNegatives(token){
        const negatives = [];
        const curItem = tokenMap[token];
        for (let i = negativePos; i < this.size; i++){
            negativePos++;
            const next = this.tokens[i];
            if (curItem.next[next.id]) continue;
            negatives.add(next);
            if (negatives.length === this.negativeSize) break;
        }
        if (negativePos === this.size){
            negativePos = 0;
        }
        return negatives;
    },
    initWeiht(){
        return Math.random() -.5;
    },
    train(data, input){
        if (data.length < 2)
            return;
        this.trainCount++;
        const main = data[0];
        let emb = main.curItem.emb;
        let error = 0;
        for (let d of data){
            const cnt = d.nextItem.cnt;
            let sum = 0;
            for (let i = 0; i <emb.length; i++) {
                sum += emb[i] * cnt[i];
            }
            const pred = 1 / (1 + Math.exp(-sum));
            const loss = d.target - pred;
            const correct = loss * pred * (1 - pred) * this.trainKoef;
            for (let i = 0; i <emb.length; i++) {
                emb[i] += correct * cnt[i];
                cnt[i] += correct * emb[i];
            }

            if (d.target)
                main.curItem.tokenError = (main.curItem.tokenError + loss) / 2
        }

        //
        // for (let i = 0; i <emb.length; i++) {
        //     const e = emb[i];
        //     for (let d of data){
        //         d.sum += d.nextItem.cnt[i] * e;
        //     }
        // }
        //
        // for (let d of data){
        //     d.pred = 1 / (1 + Math.exp(-d.sum));/*x >= 0 ? x : x * this.reLuKoef;*/
        //     d.loss = d.target - d.pred;
        //     // error +=  d.loss * d.loss;
        //     d.sigma = d.loss * d.pred * (1 - d.pred) //(x>=0 ? 1 : this.reLuKoef);
        //     main.curItem.tokenError = (main.curItem.tokenError + d.loss * d.loss) / 2
        // }
        //
        // // main.curItem.tokenError = (main.curItem.tokenError + error / data.length) / 2;
        // let delta;
        // for (let i = 0; i <emb.length; i++) {
        //     const e = emb[i];
        //     let sum = 0;
        //     for (let d of data){
        //         const c = d.nextItem.cnt[i];
        //         sum += c * d.sigma;
        //         delta = d.sigma * e * this.trainKoef + d.nextItem.cnt[PREV][i];
        //         d.nextItem.cnt[PREV][i] = delta * this.trainKoef;
        //         d.nextItem.cnt[i] += delta;
        //     }
        //     delta = sum * this.trainKoef + emb[PREV][i];
        //     emb[PREV][i] = delta * this.trainKoef;
        //     emb[i] += delta;
        //     input[i] ??= emb[i];
        //     input[i] = (input[i] + emb[i])/2;
        //
        // }
        // error = 1;
        // const layers = main.curItem.layers;
        // const outputs = this.predicate(layers, input);
        // const targets = [...main.nextItem.emb];
        // let neurons = layers[layers.length-1][NEURONS];
        // for (let i = 0; i<targets.length; i++){
        //     const x = outputs[i];
        //     const y = targets[i] ;
        //     const loss = (y - x);
        //     error += Math.abs(loss);
        //     neurons[i] =  loss;
        // }
        // error /= targets.length;
        // main.curItem.predicateError = error;
        // this.back(layers, input);
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
                neurons[out] = inputs[out] = 1 / (1 + Math.exp(-x));//x >= 0 ? x: x * this.reLuKoef;
            }
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
                l && (prev[out] = error *= y * (1 - y))////(y>=0 ? 1 : this.reLuKoef));
            }
        }
    }
}){}
const PREV = Symbol('p');
const NEURONS = Symbol('n');
const tokenMap = Object.create(null);
let negativePos = 0;
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
