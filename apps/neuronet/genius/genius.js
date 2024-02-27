//HYPER PARAMETERS

const MODEL_DIM = 16;           // Размерность входного и выходного слоев
const MAX_DIM = 256;
const LAYER_COUNT = 3;          // Количество слоев
const HEAD_COUNT = 2;            // Количество селекторов (голов) в слое
const SIGNS = ',()[]{}:;';
const SPLITTERS = ' \n\t';
const TERMINATES = '.!?…';
const BINS = Array(32).fill(0).map((v, i)=>(2. ** -i));
class Module{
    // dim = MODEL_DIM;
    constructor(owner, ...args) {
        this.owner = owner;
        this.__init__(...args);
        return this.forward.bind(this);
    }
    __init__(){

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
    get dim(){
        return this['#dim'] || this.owner?.dim || MODEL_DIM;
    }
    set dim(n){
        this['#dim'] = n;
    }
}
export class Genius extends Module{
    __init__() {
        this.encoder = new GeniusEncoder(this);
        this.decoder = new GeniusDecoder(this);
    }
    forward(x){
        x =  toGrad(x);
        x = this.encoder(x);
        x = this.decoder(x);
        x = x._softplus();
        return x;
    }
    initPhrase(){

    }
}
export class GeniusEncoder extends Module{
    __init__() {
        this.layers = Array(LAYER_COUNT).fill(0).map((_, i)=>{
            let dim = this.dim * HEAD_COUNT**i ;
            return new GeniusLayer(this, dim, dim * HEAD_COUNT);
        })
    }
    forward(x){
        for(let layer of this.layers)
            x = layer(x);
        return x;
    }
}
export class GeniusDecoder extends Module{
    __init__() {
        this.layers = Array(LAYER_COUNT).fill(0).map((_, i)=>{
            let dim = this.dim * HEAD_COUNT**i;
            return new GeniusLayer(this, dim * HEAD_COUNT, dim);
        }).reverse();
    }
    forward(x){
        for(let layer of this.layers)
            x = layer(x);
        return x;
    }
}

export class GeniusLayer extends Module{
    __init__(dim, out_dim) {
        this.dim = dim;
        this.heads = Array(HEAD_COUNT).fill().map(i=>new GeniusHead(this));
        this.W0 = nn.Linear(this, dim * HEAD_COUNT, out_dim); // Матрица сборки выходов голов
        this.norm = new genRMSNorm(this);
    }
    forward(x){
        x = this.norm(x);
        let head_res = new Grad(this.heads.map(h=>h(x)));
        x = head_res._concat();
        x = this.W0(x);
        return x;
    }
}
export class GeniusHead extends Module{
    __init__() {
        this.in_proj = nn.Linear(this, this.dim, this.dim * 2 + this.delta_rank, true);
        this.dt_proj = nn.Linear(this, this.delta_rank, this.dim, true);
        this.A = toGrad(Array(this.dim).fill('').map(()=>Array(this.dim).fill('').map((_,i)=>Math.log(i+1))));
        this.H = toGrad(Array(this.dim).fill('').map(()=>Array(this.dim).fill(0)));
        this.D = toGrad(Array(this.dim).fill(1));
        this.ssm = new GeniusSSM(this);
    }
    forward(x){
        let x_dbl = this.in_proj(x);
        let [delta, B, C] = x_dbl._slice([this.delta_rank, this.dim, this.dim]);
        delta = this.dt_proj(delta);
        delta = delta._softplus();
        x = this.selective_scan(x, delta, B, C);
        return x;
    }
    selective_scan(x, delta, B, C){
        let A = this.A._exp();
        A = A._mul(-1);
        let deltaA = delta._mul(A);
        deltaA = deltaA._exp();
        let deltaBx = x._mat_mul(B);
        let deltaB = delta._mat_mul(B);
        deltaBx = deltaBx._mul(deltaB);
        this.H = this.H._mul(deltaA);
        this.H = this.H._add(deltaBx);
        let y = C._mat_mul(this.H);
        x = x._mul(this.D);
        y = y._add(x);
        return y;
    }
    get delta_rank(){
        return this.dim / MODEL_DIM;
    }
}
export class GeniusSSM extends Module{

    forward(x){

        return x;
    }
}
export class GeniusLinear extends Module{
    __init__(in_size, out_size, bias = false) {
        this.bias = bias;
        this.W = new Grad(Array(in_size).fill(0).map(i=>Array(out_size).fill(0).map(j=>Math.random()-.5)));
    }
    forward(x){
        x = x._mat_mul(this.W);
        return x;
    }
}
export class genRMSNorm extends Module {
     __init__() {
         this.weight = toGrad(Array(this.dim).fill(1));
         this.eps = 1e-5;

     }
     forward(x) {
         let v = x._pow(2);
         v = v._mean();
         v = v._add(this.eps);
         v = v._sqrt();
         v = v._mul(.1);
         v = v._mul(this.weight);
         x = x._mul(v);
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
    get dim(){
        return this.shape.length;
    }
    _concat(){
        let result = this.data.map(i=>{
            return i.data || i;
        }).flat();
        let out = new Grad(result, 'concat', [this]);
        return out;
    }
    _mat_mul(other){
        other = toGrad(other);
        let data = this.data;
        let o_data = other.data;
        if(this.dim === other.dim){
            switch (this.dim){
                case 1:{
                    o_data = [o_data];
                    data = this._t().data;

                }
            }
        }
        else {
            if(this.dim === 1){
                data = [data];
            }
            if(other.dim === 1){
                o_data = [o_data];
            }
        }

        let result = MultiplyMatrix(data, o_data);
        if(this.dim === 1 && other.dim !== 1)
            result = result[0];
        let out = new Grad(result, '_mat_mul', [this, other]);

        return out;
    }
    _mul(other){
        other = toGrad(other);
        const res = element_wise((x, y)=>{
            return element_wise((a, b)=>(a * b), y, x);
        }, this.data, other.data);

        let out = new Grad(res, '_mul', [this, other]);
        return out;
    }
    _add(other){
        other = toGrad(other);
        const res = element_wise((x, y)=>(x + y), this.data, other.data);

        let out = new Grad(res, '_add', [this, other]);
        return out;
    }
    _pow(rate=1){
        const res = element_wise((x)=>Math.pow(x, rate), this.data);

        let out = new Grad(res, `_pow(${rate})`, [this]);
        return out;
    }
    _mean(){
        let res = 0;
        let cnt = 0;
        element_wise((x)=> {
            cnt++;
            res += x;
        }, this.data);
        res /= cnt
        let out = new Grad(res, `_mean`, [this]);
        return out;
    }
    _sqrt(){
        const res = element_wise((x)=>Math.sqrt(x), this.data);
        let out = new Grad(res, `_sqrt`, [this]);
        return out;
    }
    _t(){
        const res = transpose(this.data);
        let out = new Grad(res, '_t', [this]);
        return out;
    }
    _slice(parts = []){
        let start = 0;
        const result = []
        for (let size of parts){
            let end = start + size;
            result.push(new Grad(this.data.slice(start,  end), `slice: ${start}-${end}`, [this]))
            start = end;
        }
        return result;
    }
    _softplus(){
        const res = element_wise((x) => Math.log(1 + Math.exp(x)), this.data)
        let out = new Grad(res, '_softplus', [this]);
        return out;
    }
    _exp(){
        const res = element_wise((x) => Math.exp(x), this.data)
        let out = new Grad(res, '_exp', [this]);
        return out;
    }
    reverse(){
        this.data.reverse()
    }
}
function element_wise(fn, data, other){
    return data?.map?.((d, i)=>{
        const o = other?.[i] ?? other;
        return element_wise(fn, d, o)
    }) || fn(data, other);
}
function toGrad(data){
    if(data instanceof Grad)
        return data;
    return new Grad(data);
}
const nn = {
    Linear(...args){
        return new GeniusLinear(...args)
    }
}

function MultiplyMatrix(A,B) {
    const rowsA = A.length;
    const colsA = A[0].length;
    const rowsB = B.length;
    const colsB = B[0].length;
    const C = [];
    if (colsA !== rowsB) throw new Error('Size mismatch');
    for (let i = 0; i < rowsA; i++)
        C[i] = [];
    for (var k = 0; k < colsB; k++) {
        for (let i = 0; i < rowsA; i++) {
            let t = 0;
            for (let j = 0; j < rowsB; j++)
                t += A[i][j]*B[j][k];
            C[i][k] = t;
        }
    }
    return C;
}
function transpose(m, axis = 0) {
    return m[0]?.map?.((x,i) =>(m.map(y => y[i]))) || m.map(y => [y]);
}