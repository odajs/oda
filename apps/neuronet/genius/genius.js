//HYPER PARAMETERS
import * as nn from  '../neuro/neuro.js';

const MODEL_DIM = 16;           // Размерность входного и выходного слоев
const MAX_DIM = 256;
const LAYER_COUNT = 4;          // Количество слоев
const HEAD_COUNT = 2;            // Количество селекторов (голов) в слое
const SIGNS = ',()[]{}:;';
const SPLITTERS = ' \n\t';
const TERMINATES = '.!?…';
const BINS = Array(32).fill(0).map((v, i)=>(2. ** -i));
const CONV_DIM = 4;
const CONV_BIAS = true;
const BIAS = false;
class genModule extends nn.Module{
    get dim(){
        return this['#dim'] || this.owner?.dim || MODEL_DIM;
    }
    set dim(n){
        this['#dim'] = n;
    }
    get label(){
        return this.constructor.name + ` [${this.dim}]`
    }
}
export class Genius extends genModule{
    __init__() {
        this.encoder = new genEncoder(this);
        this.decoder = new genDecoder(this);
    }
    forward(x){
        x =  tensor(x);
        x = this.encoder(x);
        x = this.decoder(x);
        x = x._relu();
        // x = x._sigmoid();
        return x;
    }
}
export class genEncoder extends genModule{

    __init__(owner) {
        this.head_count = HEAD_COUNT;
        this.owner = owner;
        this.layers = Array(LAYER_COUNT).fill(0).map((_, i)=>{
            let dim = this.dim * HEAD_COUNT ** i ;
            return new genLayer(this, i, dim, dim * HEAD_COUNT);
        })
    }
    forward(x){
        for(let layer of this.layers)
            x = layer(x);
        return x;
    }
}
export class genDecoder extends genModule{
    __init__(owner) {
        this.head_count = 1
        this.owner = owner;
        this.layers = Array(LAYER_COUNT).fill(0).map((_, i)=>{
            let dim = this.dim * HEAD_COUNT ** i;
            return new genLayer(this, LAYER_COUNT * i, dim * HEAD_COUNT, dim);
        }).reverse();
    }
    forward(x){
        for(let layer of this.layers)
            x = layer(x);
        return x;
    }
}

export class genLayer extends genModule{
    __init__(owner, index, dim, out_dim) {
        this.owner = owner;
        this.out_dim = out_dim;
        this.dim = dim;
        this.index = index;
        this.heads = Array(this.owner.head_count).fill().map((_,i)=>new genHead(this, i));
        this.W0 = nn.linear(dim * this.owner.head_count, out_dim); // Матрица сборки выходов голов
        this.norm = nn.rsmNorm(dim);
    }
    forward(x){
        let y = this.norm(x);
        let head_res = tensor(this.heads.map(h=>h(y)));
        y = head_res._concat();
        y = this.W0(y);
        console.log('norm', this.label, this.index,  '=', y.data[0])
        return y;
    }
}
export class genHead extends genModule{
    __init__(owner, index) {
        this.owner = owner;
        this.index = index;
        this.in_proj = nn.linear(this.dim, this.dim * 2, false);
        this.x_proj = nn.linear(this.dim, this.dim * 2 + this.delta_rank, false);
        this.dt_proj = nn.linear(this.delta_rank, this.dim, true);
        this.A = nn.Parameter(nn.Tensor.hippo(this.dim, -1));
        this.H = nn.Tensor.zeros([this.dim, this.dim]);
        this.D = nn.Parameter(nn.Tensor.ones([this.dim]));
        this.out_proj = nn.linear(this.dim, this.dim, BIAS);
        this.norm = nn.rsmNorm(this.dim);
    }
    forward(x){
        let x_and_res = this.in_proj(x);
        let [xx, res] = x_and_res._slice([this.dim, this.dim]);
        xx = xx._silu();
        let y = this.ssm(xx);
        res = res._silu();
        y = y._mul(res);
        y = this.out_proj(y);
        y = this.norm(y);
        return y;
    }
    ssm(x){
        let A = this.A;
        // let A = this.A._exp();
        // A = A._mul(-1);
        let x_dbl = this.x_proj(x)
        let [delta, B, C] = x_dbl._slice([this.delta_rank, this.dim, this.dim]);
        delta = this.dt_proj(delta);
        delta = delta._softplus();
        x = this.select(x, delta, A, B, C);
        return x;
    }
    select(u, delta, A, B, C){
        let deltaA = delta._mul(A);
        deltaA = deltaA._exp();
        let deltaB_u =  delta._mul(B);
        deltaB_u = u._mat_mul(deltaB_u);
        deltaA = deltaA._mul(this.H);
        this.H = deltaA._add(deltaB_u);
        let y = C._mat_mul(this.H._t());
        u = u._mul(this.D);
        y = y._add(u);
        return y;
    }
    get delta_rank(){
        return this.dim / MODEL_DIM;
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
        if (s)
            words.push(s);
        if (words.length)
            list.push(words);
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

function tensor(...args){
    if(args[0] instanceof nn.Tensor)
        return args[0];
    return new nn.Tensor(...args);
}