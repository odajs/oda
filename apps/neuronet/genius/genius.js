//HYPER PARAMETERS
import * as nn from  '../neuro/neuro.js';

const MODEL_DIM = 16;           // Размерность входного и выходного слоев
const LAYER_COUNT = 1;          // Количество слоев
const HEAD_COUNT = 1;            // Количество селекторов (голов) в слое
const SIGNS = ',()[]{}:;';
const SPLITTERS = ' \n\t';
const TERMINATES = '.!?…';
const BINS = Array(32).fill(0).map((v, i)=>(2. ** -i));
const CONV_DIM = 4;
const CONV_BIAS = true;
const BIAS = false;
export class Genius extends nn.Module{
    __init__() {
        this.encoder = new genEncoder(MODEL_DIM);
        // this.decoder = new genDecoder(MODEL_DIM);
    }
    forward(x){
        x = tensor(x, 'INPUT');
        let res = this.encoder(x);
        // res = this.decoder(res);
        // res = res._relu();
        // res = res._sigmoid();
        return res;
    }
}
export class genEncoder extends nn.Module{
    __init__(d_in) {
        this.layers = Array(LAYER_COUNT).fill(0).map((_, i)=>{
            let dim = d_in * HEAD_COUNT ** i ;
            return new genLayer(dim, dim * HEAD_COUNT, HEAD_COUNT);
        })
    }
    forward(x){
        for(let layer of this.layers)
            x = layer(x);
        return x;
    }
}
export class genDecoder extends nn.Module{
    __init__(d_in) {
        this.head_count = 1
        this.layers = Array(LAYER_COUNT).fill(0).map((_, i)=>{
            let dim = d_in * HEAD_COUNT ** i;
            return new genLayer(dim * HEAD_COUNT, dim);
        }).reverse();
    }
    forward(x){
        for(let layer of this.layers)
            x = layer(x);
        return x;
    }
}

export class genLayer extends nn.Module{
    __init__(d_in, d_out, head_count = 1) {
        // this.norm = nn.rsmNorm(d_in);
        // this.heads = Array(head_count).fill().map(()=>new genHead(d_in));
        this.W0 = nn.linear(d_in * head_count, d_out, true); // Матрица сборки выходов голов
    }
    forward(x){
        let y = x//this.norm(x);
        // let head_res = n/n.Tensor.stack(this.heads.map(h=>h(y)));
        // y = head_res._concat();
        y = this.W0(y);
        return y;
    }
}
export class genHead extends nn.Module{
    __init__(d) {
        this.d = d;
        this.dH = d * 1.5;
        this.in_proj = nn.linear(d, d * 2, false);
        this.x_proj = nn.linear(d, this.dH * 2 + this.delta_rank, false);
        this.dt_proj = nn.linear(this.delta_rank, this.dH, true);
        this.A = nn.Parameter(nn.Tensor.hippo([this.dH, d], -1));
        this.H = nn.Tensor.zeros([this.dH, d]);
        this.D = nn.Parameter(nn.Tensor.ones([d]));
        this.out_proj = nn.linear(d, d, BIAS);
        this.norm = nn.rsmNorm(d);
        this.conv1d = (x)=>{
            return x;
        }
    }
    forward(x){
        let x_and_res = this.in_proj(x);
        let [x1, x2] = x_and_res._slice([this.d, this.d]);
        x1 = this.conv1d(x1);
        x1 = x1._silu();
        let y = this.ssm(x1)
        x2 = x2._silu();
        y = y._mul(x2);
        y = this.out_proj(y);
        y = this.norm(y);
        return y;
    }
    ssm(x){
        let A = this.A;
        A = A._exp();
        // A = A._mul(-1);
        let x_dbl = this.x_proj(x);
        let [delta, B, C] = x_dbl._slice([this.delta_rank, this.dH, this.dH]);
        delta = this.dt_proj(delta);
        delta = delta._softplus();
        x = this.select(x, delta, A, B, C);
        return x;
    }
    select(u, delta, A, B, C){
        // let y = u;
        let deltaA = delta._mul(A);
        deltaA = deltaA._exp();
        let deltaB_u =  delta._mul(B);
        deltaA = deltaA._mul(this.H);
        deltaB_u = deltaB_u._mm(u);
        this.H = deltaA._add(deltaB_u);
        let y = C._mm(this.H);
        u = u._mul(this.D);
        y = y._add(u);
        return y;
    }
    get delta_rank(){
        return Math.ceil(this.dH / MODEL_DIM);
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
        for (let i = 0; i < word.length; i++){
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

export class WordEncoderLog10 {
    constructor(dim = MODEL_DIM) {
        this.dim = dim;
        return this.encode.bind(this);
    }
    encode(word){
        const emb = Array(this.dim).fill(0.0);
        for (let i = 0; i < word.length; i++){
            const del = Math.log10(2 ** i);
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


export class WordDecoderNet extends nn.Module{
    __init__(d, bias = false) {
        this.proj = nn.linear(d, d, bias);
    }
    forward(x){
        x = this.proj(x);
        return x;
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
        result = String.fromCharCode(...result);
        return result;
    }
}

export class WordDecoderLog10 {
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
        result = String.fromCharCode(...result);
        return result;
    }
}

function tensor(...args){
    if(args[0] instanceof nn.Tensor)
        return args[0];
    return new nn.Tensor(...args);
}
