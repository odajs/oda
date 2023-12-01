export class gptModel extends ROCKS({
    $public:{
        tokens: [],
        vectorSize: 8,
        negativeSize: 5,
        scanWindow: 2,
        trainCount: 0,
    },
    get size(){
        return this.tokens.length;
    },
    progress: 0,
    similarWords(t1, t2){
        if (!this.size) return 0;
        t1 = this.join(t1);
        t2 = this.join(t2);
        return cosSimilar(t1, t2);
    },
    join(word){
        if (!this.size) return [];
        this.scan(word);
        const result = [];
        for (let t = 0; t < word.length; t++){
            const token = word.substr(t, this.scanWindow);
            if (token.length<2) continue;
            const emb = this.getTokenItem(token).emb;
            for(let i = 0; i < emb.length; i++){
                if (result[i] === undefined)
                    result[i] = emb[i];
                else
                    result[i] = (result[i] + emb[i])/2;
            }
        }
        return result;
    },
    getTokenItem(token){
        let nextItem = tokenMap[token] ??= this.tokens.find(i=>i.id === token)
        if (!nextItem){
            nextItem = tokenMap[token] = Object.create(null);
            nextItem.id = token;
            const array = [...Array(this.vectorSize)];
            const hArray = [...Array(this.vectorSize/2)];
            nextItem.emb = array.map(i=>(Math.random() - .5));
            nextItem.cnt = array.map(i=>(Math.random() - .5));
            nextItem.layers = [array.map(i=>{
                return hArray.map(i=>(Math.random() - .5));
            }),
            hArray.map(i=>{
                return array.map(i=>(Math.random() - .5));
            })]
            nextItem.next = Object.create(null);
            nextItem.error = 1;
            this.tokens.push(nextItem);
        }
        return nextItem;
    },
    async scan(text){
        if (!text) return;
        let current = '';
        let input = [...Array(this.vectorSize)];
        let updateStep = text.length/10;
        let i = 0;
        const scan = ()=>{
            return new Promise((resolve) => {
                let count = 0;
                for (i; i < text.length - this.scanWindow; i++){
                    let next = text.substr(i, this.scanWindow);
                    let nextItem = this.getTokenItem(next);

                    if (current){
                        let curItem = tokenMap[current];
                        curItem.next[next] = (curItem.next[next] || 0) + 1;
                        const trainData = [{curItem, nextItem, target: 1, sum: 0}];

                        for (let n = 0; n < this.negativeSize; n++){ // поиск негативных токенов
                            if (negativePos >= this.size)
                                negativePos = 0;
                            while(++negativePos < tokenMap.length){
                                const neg = tokenList[negativePos];
                                if (!curItem.next[neg.id]){
                                    trainData.push({curItem, target: 0, sum: 0});
                                    break;
                                }
                            }
                        }

                        trainData.push(...this.getNegatives(current).map(nextItem =>{
                            return {nextItem, target: 0, sum: 0}
                        }));
                        this.train(trainData, input);
                    }
                    current = next;
                    count++;
                    if (count > updateStep){
                        this.progress = Math.round(i / text.length * 100);
                        this.async(async ()=>{
                            await scan();
                            resolve();
                        }, 10)
                        return;
                    }
                }
                resolve();
            })
        }
        await scan();
        this.progress = 0;
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
    train(data, input){
        if (data.length < 2)
            return;
        this.trainCount++;
        let emb = data[0].curItem.emb;
        for (let d of data){
            d.cnt ??= d.nextItem.cnt;
        }
        for (let i = 0; i <emb.length; i++) {
            const e = emb[i];
            for (let d of data){
                d.sum += d.cnt[i] * e;
            }
        }
        let error = 1;
        for (let d of data){
            d.predicate = 1 / (1 + Math.exp(-d.sum));
            d.loss = d.target - d.predicate;
            error = (error + Math.abs(d.loss))/2;
            d.sigma = d.loss * d.predicate * (1 - d.predicate)
        }
        data[0].curItem.error = error;
        for (let i = 0; i <emb.length; i++) {
            const e = emb[i];
            let sum = 0;
            for (let d of data){
                const c = d.cnt[i];
                sum += c * d.sigma;
                d.cnt[i] +=  d.sigma * e * .1;
            }
            emb[i] += sum *  .1;
            input[i] ??= emb[i];
            input[i] = (input[i] + emb[i])/2;

        }
        const predicate = this.predicate(input, data[0].curItem.layers);
        error = this.back(predicate, data[0].curItem.layers, data[0].nextItem.emb);
    },
    predicate(input, layers){
        const output = [];
        for(let l = 0; l<layers.length; l++){
            const layer = layers[l];
            for(let i = 0; i<layer.length; i++){
                const inVal = input[i];
                const weights = layer[i];
                for(let out = 0; out<weights.length; out++){
                    output[out] = (output[out] || 0) + inVal * weights[out];
                }
            }
            input = [];
            for(let out = 0; out<output.length; out++){
                input[out] = 1/(1+Math.exp(output[out]));
            }
        }
        return output;
    },
    back(output, layers, targets){
        let error = [];
        for(let l = layers.length-1; l>=0; l--){
            const layer = layers[l];
            for(let out = 0; out<layer.length; out++){
                const input = layer[out];
                const target = targets[out];
                const predicate = output[out];
                const loss = target - predicate;
                for(let i = 0; i<input.length; i++){
                    error[i] = target - predicate;
                }
            }

        }
    },
}){}
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