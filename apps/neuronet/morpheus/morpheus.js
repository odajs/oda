class Morph2vec extends ROCKS({
    wordTokenize(word){
        const result = this.vocabulary[word];
        if (result)
            return result.split('-');
        return wordTokenize('<'+word+'>');
    },
    // vocabulary: {},
    train(tokenizer){
        const tree = tokenizer.morphTree;
        let tokens = this.data.tokens;
        for (let token in tree){
            const items = tree[token];
            let item = tokens[token] ??= {id: Object.keys(tokens).length+1
                ,token,
                links: {},
                embedding:  this.vectorTemplate.map(i=>{
                    return (Math.random() - .5); // 100;
                }),
                context:  this.vectorTemplate.map(i=>{
                    return 0; //(Math.random() - .5);//10;
                }),
            }
            for (let i in items){
                item.links[i] = item.links[i]  || 0;
                item.links[i] += items[i];
            }
            // tree[token] = item;
        }
        this.items = undefined;
        const size = this.items.length;
        const trainItem = (token)=>{
            let item = tokens[token];
            const embedding = item.embedding;
            let contexts = []
            const targets = [];
            const links = Object.keys(item.links);
            for (token of links){
                contexts.push(token);
                targets.push(1);
                let cnt = size;
                let neg = this.negativeSize;
                while (cnt--){
                    let idx = Math.floor(Math.random() * size);
                    item = this.items[idx];
                    if (!links.includes(item.token) && !contexts.includes(item.token)){
                        contexts.push(item.token);
                        targets.push(0);
                        if (!neg--)
                            break;
                    }
                }
            }
            contexts = contexts.map(token=>{
                return tokens[token].context;
            })
            let predict, sum, error, correct;
            const corrects = contexts.reduce((vector, context, index)=>{
                sum = embedding.reduce((res, emb, idx)=>{
                    return res += emb * context[idx];
                }, 0);
                predict = 1/(1 + Math.exp(-sum));
                error = targets[index] - predict;
                correct = error * predict * (1 - predict)// * .1;
                for (let i = 0; i<context.length; i++){
                    vector[i] += correct * context[i];
                    context[i] += correct * embedding[i];
                }
                return vector;
            }, new Array(this.vectorSize).fill(0));
            for (let i = 0; i<embedding.length; i++){
                embedding[i] += corrects[i];
            }
        }
        for (let token in tree){
            trainItem(token);
        }
        this.fire('update')
    },
    get items(){
        return Object.values(this.data.tokens);
    },
    calcError() {
        const tokens = this.data.tokens;
        let block, token, item, embedding, context;
        let error = 0;
        let count = 0;
        for (let token in tokens){
            block = tokens[token];
            embedding = block.embedding;
            for (token in block.links){
                item = tokens[token];
                context = item.context;
                let sum = 0;
                for (let i = 0; i < embedding.length; i++) {
                    sum += embedding[i] * context[i];
                }
                const predict = 1 / (1 + Math.exp(-sum));
                error += 1 - predict;
                count++;
            }
        }
        this.error = error / count;
    },
    get tests(){
        return this.data.tests ??= [];
    },
    addTest(test = {}){
        this.tests.push(test);
        this.isChanged = true;
    },
    deleteTest(test){
        this.tests.remove(test);
        this.isChanged = true;
    },
    get values(){
        return Object.values(this.data.tokens);
    },
    $public:{
        windowSize: {
            $type: Number,
            get(){
                return this.data.windowSize || 2;
            },
            set(n){
                this.data.windowSize = n
                this.isChanged = true;
            }
        },
        negativeSize: {
            $type: Number,
            get() {
                return this.data.negativeSize || 5;
            },
            set(n) {
                this.data.negativeSize = n;
                this.isChanged = true;
            },
        }
    },
    progress: 0,
    get vectorSize(){
        return this.data.vectorSize;
    },
    set isChanged(n){
        if (n){
            this.async(()=>{
                this.fire('changed');
            })
        }
    },
    data: {},
    similarTokens(t1, t2){
        const a = this.tokens[t1];
        const b = this.tokens[t2];
        return cosSimilar(a?.embedding, b?.embedding);
    },
    similarWords(w1, w2){
        return cosSimilar(this.getWordVector(w1), this.getWordVector(w2));
    },
    similar(t1, t2){
        return cosSimilar(this.calcVector(t1), this.calcVector(t2));
    },
    calcVector(text){
        text.match(textRegExp);
    },
    getTokenVector(t){
        return this.tokens[t];
    },
    getWordTokens(word){
        if (word === undefined) return []
        word.toLowerCase().trim();
        return this.wordTokenize(word);
    },
    getWordVector(word){
        const tokens = this.wordTokenize(word);
        const vectors = tokens.map(t=>{
            return this.data.tokens[t]?.embedding || [];
        })
        const result = [...vectors[0]];
        for(let v = 1; v < vectors.length; v++){
            for(let i = 0; i < result.length; i++){
                result[i] = (result[i] + vectors[v][i]) / 2;
            }
        }
        return result;
    },
    get size(){
        return this.items.length;
    },
    get name(){
        return this.data?.name || 'no name';
    },
    get label(){
        return this.name + ' [ '+this.size+' ]';
    },
    get vectorTemplate(){ //Vector Array Template
        return (new Array(this.vectorSize)).fill(0);
    },
    get error(){
        return this.data.error || 1;
    },
    set error(n){
        this.data.error = n;
        this.isChanged = true;
    },
    getSimilarRating(word, limit = 50){
        word = word?.trim();
        if (!word) return;
        word = word.toLowerCase();
        const vector = this.getWordVector(word);
        let tokens = this.wordTokenize(word);
        let token = tokens[tokens.length-1];
        if (!token) return;
        tokens = this.data.tokens;

        const tree  = {}
        const getNextVectors = (next, path = '')=>{
            const main = tokens[next];
            const prev_embedding = tree[path];
            for (let token in (main?.links || {})){
                const freq = main?.links[token];
                const item = tokens[token];
                let next = (path?path+'-':'')+token;
                if (tree[next]) continue;
                const embedding = item.embedding;
                if (token[0] === '<'){
                    tree[next] = embedding;
                }
                else if (prev_embedding){
                    tree[next] = prev_embedding.map((val, i)=>{
                        return (embedding[i] + val) / 2; // todo надо поэкспериментировать с разными способами слияния
                    })
                }
                if (token.endsWith('>')){
                    if (Object.keys(tree).length>limit) return;
                    next = ''
                }
                getNextVectors(token, next);
            }
        }

        getNextVectors(token);
        console.log('tree', tree);
        const res = Object.keys(tree).filter(i=>{
            return i.endsWith('>')
        }).map(word=>{
            const percent = Math.round(cosSimilar(tree[word], vector)*10000)/100;
           // word = word.replace(/[-<>]/g, '');
            return {word, percent};
        }).sort((a, b)=>{
            return a.percent<b.percent?1:-1

        })
        console.log('res', res);
        return res;
    }
})
{
    constructor (data = {}){
        super();
        data.tokens ??= {};
        data.sources ??= []
        this.data = data;
        fetch('./s8.json').then(async file=>{
            this.vocabulary = await file.json();
        })
    }
}
let part = '\\wа-яё'
const textRegExp = new RegExp(`([^${part}\\s])\\1+|[^${part}\\s]|[${part}]+`, 'gmi');
//Выделение морфем из слов
part = 'aeiouyаеёиоуыэюя';
const morphRegExp = new RegExp(`[^${part}ьъ\s]*[${part}]?(?:[^${part}]*$|(?:[^${part}][ъь]?(?=[^${part}])))?`, 'gmi')

// Выделение только слов
const wordRegExp = new RegExp(`[\\wa-яё]+`, 'gmi');
export function wordTokenize(word){
    return word?.match(morphRegExp).filter(i=>i);
}
class Tokenizer extends ROCKS({
    get windowSize(){
        return this.model.windowSize;
    },
    get checksum() {
        let chk = 0x12345678;
        const s = this.text;
        const len = s.length;
        for (let i = 0, ii = 1; i < len; i += ii) {
            ii *= 2;
            chk += (s.charCodeAt(i) * (i + 1));
        }
        return (chk & 0xFFFFFFFF).toString(16).toUpperCase();
    },
    get words(){
        return this.text.match(textRegExp);
    },
    get wordTree(){
        const ws = this.windowSize;
        const words = this.words;
        return words.map((word, idx)=>{
            if (stops.includes(word) || ignores.includes(word)) return;
            const items = [];
            let back = true;
            let fwd = true;
            for (let i = 1; i <= ws; i++){
                if (back){
                    back = words[idx-i];
                    if (stops.includes(back)){
                        back = undefined;
                    }
                    if (back && !ignores.includes(back)){
                        items.add(back);
                    }
                }
                if (fwd){
                    fwd = words[idx+i];
                    if (stops.includes(fwd)){
                        fwd = undefined;
                    }
                    if (fwd && !ignores.includes(fwd)){
                        items.add(fwd);
                    }
                }
            }
            return {word, items};
        }).filter(i=>i)
    },
    get morphTree(){
        const tree = {};
        const words = this.wordTree;
        let word, token, node, item, morphs;
        for (item of words){
            let word = item.word;
            morphs = this.model.wordTokenize(word);
            for (token of morphs){
                if (node){
                    node[token] = node[token]  || 0;
                    node[token]++;
                }
                node = tree[token] ??= {};
            }
            for (word of item.items){
                morphs = this.model.wordTokenize(word);
                if (node){
                    token = morphs[0];
                    node[token] = node[token]  || 0;
                    node[token]++;
                }
            }
        }
        return tree;
    }
}){
    constructor(text, model){
        super()
        this.text = text.toLowerCase();
        this.model = model;
    }
}
const stops = ['.', '!', '?', '...', '\r', '\n', '\r\n'];
const ignores = [',', ':', ';', '-'];
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

export {Morph2vec, Tokenizer};