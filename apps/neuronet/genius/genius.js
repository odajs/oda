//HYPER PARAMETERS
import * as nn from  './tensor.js';
const MODEL_DIM = 16;           // Размерность входного и выходного слоев
const MAX_DIM = 256;
const LAYER_COUNT = 2;          // Количество слоев
const HEAD_COUNT = 2;            // Количество селекторов (голов) в слое
const SIGNS = ',()[]{}:;';
const SPLITTERS = ' \n\t';
const TERMINATES = '.!?…';
const BINS = Array(32).fill(0).map((v, i)=>(2. ** -i));
export class Genius extends nn.Module{
    __init__() {
        this.encoder = new genEncoder(this);
        this.decoder = new genDecoder(this);
    }
    forward(x){
        x =  tensor(x);
        x = this.encoder(x);
        x = this.decoder(x);
        x = x._sigmoid();
        x = x._mul(2.0);
        return x;
    }
}
export class genEncoder extends nn.Module{
    __init__() {
        this.layers = Array(LAYER_COUNT).fill(0).map((_, i)=>{
            let dim = this.dim * HEAD_COUNT**i ;
            return new genLayer(this, i, dim, dim * HEAD_COUNT);
        })
    }
    forward(x){
        for(let layer of this.layers)
            x = layer(x);
        return x;
    }
}
export class genDecoder extends nn.Module{
    __init__() {
        this.layers = Array(LAYER_COUNT).fill(0).map((_, i)=>{
            let dim = this.dim * HEAD_COUNT**i;
            return new genLayer(this, LAYER_COUNT * i, dim * HEAD_COUNT, dim);
        }).reverse();
    }
    forward(x){
        for(let layer of this.layers)
            x = layer(x);
        return x;
    }
}

export class genLayer extends nn.Module{
    __init__(index, dim, out_dim) {
        this.dim = dim;
        this.index = index;
        this.heads = Array(HEAD_COUNT).fill().map(i=>new genHead(this));
        this.W0 = nn.Linear(this, dim * HEAD_COUNT, out_dim); // Матрица сборки выходов голов
        this.norm = new nnRMSNorm(this);
    }
    forward(x){
        x = this.norm(x);
        let head_res = tensor(this.heads.map(h=>h(x)));
        x = head_res._concat();
        x = this.W0(x);
        return x;
    }
}
export class genHead extends nn.Module{
    __init__() {
        this.in_proj = nn.linear(this, this.dim, this.dim * 2 + this.delta_rank, true);
        this.dt_proj = nn.linear(this, this.delta_rank, this.dim, true);
        this.A = tensor(Array(this.dim).fill('').map(()=>Array(this.dim).fill('').map((_,i)=>Math.log(i+1))));
        this.H = tensor(Array(this.dim).fill('').map(()=>Array(this.dim).fill(0)));
        this.D = tensor(Array(this.dim).fill(1));
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

export class nnRMSNorm extends nn.Module {
     __init__() {
         this.weight = tensor(Array(this.dim).fill(1));
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

function tensor(data){
    if(data instanceof nn.Tensor)
        return data;
    return new nn.Tensor(data);
}
