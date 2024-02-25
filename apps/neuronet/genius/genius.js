//HYPER PARAMETERS

const MODEL_DIM = 12;           // Размерность входного и выходного слоев
const LAYER_COUNT = 2;          // Количество слоев
const HEAD_COUNT = 2;            // Количество селекторов (голов) в слое
const SIGNS = ',()[]{}:;';
const SPLITTERS = ' \n\t';
const TERMINATES = '.!?…';
const BINS = Array(32).fill(0).map((v, i)=>(2. ** -i));
class Model{
    constructor() {
        this.forward = this.forward.bind(this);
    }
    forward(x){
        return x;
    }
    back(g){
        return g;
    }
    get model(){
        return this['#model'] ??= this.owner || this;
    }
}
export class Genius extends Model{
    constructor() {
        super();
        this.forward.initPhrase = this.initPhrase;
        this.layers = Array(LAYER_COUNT).fill(0).map(i=>new GeniusLayer(this));
        return this.forward;
    }
    forward(x){
        for(let layer of this.layers)
            x = layer(x);
        return x;
    }
    initPhrase(){

    }
}
function fnGard(data){
    if(data instanceof Grad)
        return data;
    return new Grad(data);
}
export class GeniusLayer extends Model{
    constructor(owner) {
        super();
        this.owner = owner;
        this.heads = Array(HEAD_COUNT).fill().map(i=>new GeniusHead(this));
        this.W0 = new GeniusLinear(this, MODEL_DIM * HEAD_COUNT, MODEL_DIM); // Матрица сборки выходов голов
        return this.forward;
    }
    forward(x){
        let head_res = new Grad(this.heads.map(h=>h(x)));
        x = head_res._concat();
        x = this.W0(x);
        return x;
    }
}
export class GeniusHead extends Model{
    constructor(owner) {
        super();
        this.owner = owner;
        this.ssm = new GeniusSSM(this);
        return this.forward;
    }
    forward(x){

        return x;
    }
}
export class GeniusSSM extends Model{
    constructor(owner) {
        super();
        this.owner = owner;
        return this.forward;
    }
    forward(x){

        return x;
    }
}
export class GeniusLinear extends Model{
    constructor(owner, in_size, out_size) {
        super();
        this.owner = owner;
        this.W = new Grad(Array(in_size).fill(0).map(i=>Array(out_size).fill(0).map(j=>Math.random()-.5)));
        return this.forward;
    }
    forward(x){
        x = x._mat_mul(this.W);
        return x;
    }
}
export class Tokenizer {
    constructor() {
        return this.tokenize.bind(this);
    }
    tokenize(text){
        let s = '';
        let words = [];
        const list = [];
        for (let ch of text){
            if (ch === '.' && s.length === 1){
                s += ch;
                words.push(s);
                s = ''
            }
            else if (TERMINATES.includes(ch)){
                if (s)
                    words.push(s);
                s = '';
                words.push(ch.toString());
                list.push(words);
                words = [];
            }
            else if (SPLITTERS.includes(ch)){
                if (s)
                    words.push(s);
                s = '';
            }
            else if (SIGNS.includes(ch)){
                if (s)
                    words.push(s);
                s = '';
                words.push(ch.toString());
            }
            else{
                s += ch;
            }
        }
        if (s){
            words.push(s);
            list.push(words);
        }
        return list;
    }
}
export class WordEncoder {
    constructor(dim = MODEL_DIM) {
        this.dim = dim;
        return this.encode.bind(this);
    }
    encode(word){
        const emb = Array(this.dim).fill(0.0);
        for (let i = 0; i<word.length; i++){
            const del = 2 ** -i;
            let code = word.charCodeAt(i);
            console.log(code);
            code = code.toString(2);
            code = code.padStart(this.dim, "0");
            code.split('').forEach((v, i)=>{
                emb[i]+=((+v) * del)
            });
        }
        return emb;
    }
}
export class WordDecoder {
    constructor() {
        return this.decode.bind(this);
    }
    decode(vector){
        vector.reverse()
        let result = [];
        for(let i = 0; i<BINS.length; i++){
            let p = BINS[i];
            let l = vector.reduce((r, t, i)=>{
                if (t >= p){
                    r += 2 ** i;
                    vector[i] = t - p;
                }
                return r;
            }, 0.0);
            if(!l) break;
            result.push(l);
        }
        result = String.fromCharCode(...result)
        return result;
    }
}

class Grad{
    _back = () => {};
    constructor(data, label, children= [], error) {
        this.data = data;
        this.label = label;
        this.children = children;
        this.error = error;
    }
    valueOf(){
        return this.data;
    }
    toString(){
        return JSON.stringify(this.data) + JSON.stringify({id: this.label, shape: this.shape})
    }
    get shape(){
        return this['#shape'] ??= (()=>{
            let d = this.data;
            let v = [];
            while(Array.isArray(d) && d.length){
                v.push(d.length);
                d = d[0];
            }
            return v;
        })()
    }
    _concat(){
        let result = this.data.flat();
        let out = new Grad(result, 'concat', [this]);
        return out;
    }
    _mat_mul(other){
        let result = [];
    }
    reverse(){
        this.data.reverse()
    }
}
