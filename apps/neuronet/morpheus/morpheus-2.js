// import './gpu-browser.min.js';
// const gpu = new GPU.GPU();
export class gptModel{
    tokens = [];
    vectorSize = 16;
    negativeSize = 4;
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
        let {back, current} = await scan;
        let item = this.getTokenItem(current);
        let output = '';
        let next = Object.keys(item.next);
        let count = 1000;
        while (count-- && next.length){
            if(next.length > 1) {
                const predict = this.forward(item.layers, this.back2input(back));
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
            this.updateBack(back, item);
            next = Object.keys(item.next);
        }
        return output.trim();
    }
    back2input(back){
        const input =  back.reduce((res, item)=>{
            const emb = item.emb;
            for(let i=0;i<this.vectorSize; i++){
                res[i] += emb[i];
            }
            return res;
        }, [...this.array(this.vectorSize).map(i=>0.0)]);
        // const s = back.length;
        // if(s){
        //     for(let i = 0;i>this.vectorSize; i++){
        //         input[i] /= s
        //     }
        // }

        return input;
    }
    updateBack(back, item){
        back.push(item);
        if(back.length>2)
            back.shift();
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
                return this.array(this.vectorSize - 2).map(i=>this.initWeight());
            }));
            // item.layers.push(this.array(this.vectorSize - 2).map(i=>{
            //     return this.array(this.vectorSize - 4).map(i=>this.initWeight());
            // }));
            // item.layers.push(this.array(this.vectorSize - 4).map(i=>{
            //     return this.array(this.vectorSize - 2).map(i=>this.initWeight());
            // }));
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
        // let input = this.array(this.vectorSize).map(i=>0.0);
        const back = [];
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
                        const neg = this.getNegatives(current);
                        trainData.push(...neg.map(nextItem =>{
                            return {curItem, nextItem, t: 0}
                        }));

                        this.train(trainData, back, plastic);
                        this.updateBack(back, curItem)

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
                    const neg = this.getNegatives(current);
                    trainData = neg.map(nextItem =>{
                        return {curItem, nextItem, t: 0}
                    });
                    this.train(trainData, back, plastic);
                    this.progress = 0;
                    resolve({back, current});
                }
            }
            scanner();
        })
    }
    train(data, back, plastic = 1){
        this.trainCount++;
        const main = data[0];
        let emb = main.curItem.emb;

        let eVal;
        for (let d of data){
            const cnt = d.nextItem.cnt;
            let sum = 0;
            for (let i = 0; i <emb.length; i++) {
                sum += emb[i] * cnt[i];
            }
            const p = sum < 0 ? sum * .01 : sum;// 1 / (1 + Math.exp(-sum));
            const loss = d.t - p;
            const correct = loss * pred * (1 - pred)// * plastic;// * this.trainKoef;
            for (let i = 0; i <emb.length; i++) {
                eVal = emb[i];
                emb[i] += correct * cnt[i];
                cnt[i] += correct * eVal;
            }
            main.curItem.tokenError = (main.curItem.tokenError + Math.abs(loss)) / 2;
        }
        return;

        const code = main.curItem.code;
        const input = this.back2input(back);
        const layers = main.curItem.layers;
        const outputs = this.forward(layers, input);
        const targets = main.nextItem.emb;
        let neurons = layers[layers.length-1][NEURONS];
        let error = 0;
        for (let i = 0; i<targets.length; i++){
            // const x = 1 / (1 + Math.exp(-outputs[i]));
            const y =  1 / (1 + Math.exp(-targets[i]));
            const loss = (y - outputs[i]);
            error += Math.abs(loss);
            neurons[i] = loss;
        }
        error /= targets.length;
        main.curItem.predicateError = (main.curItem.predicateError + error) / 2;
        this.back(layers, input, plastic);
    }
    forward(layers, inputs){
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
    }
    back(layers, inputs, plastic){
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
                    weights[i] += neuron[i] * y * this.trainKoef * plastic;
                }
                l && (prev[out] = error *= y * (1 - y))
            }
        }
    }
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
