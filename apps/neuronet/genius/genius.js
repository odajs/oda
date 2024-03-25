//HYPER PARAMETERS
import {Parameter, Tensor} from "./ten.js";
import * as nn from  './module.js';
import {rmsNorm} from "./module.js";

const WORD_DEEP = 32;
const TOKEN_SIZE = 8;
const MODEL_DIM = 8;           // Размерность входного и выходного слоев
const EXPAND = 1;               // Коэффициент расширения вектора слов
const LAYER_COUNT = 1;          // Количество слоев
const HEAD_COUNT = 1;           // Количество селекторов (голов) в слое
const SIGNS = ',()[]{}:;';
const SPLITTERS = ' \n\t';
const TERMINATES = '.!?…';
const BINS = Array(WORD_DEEP).fill(0).map((v, i)=>(2. ** -i));
const BIAS = false;

export class Genius extends nn.Module{
    __init__() {
        const d = MODEL_DIM * EXPAND;
        this.W = Parameter(Tensor.random([MODEL_DIM, d]));
        this.encoder = new genEncoder(d);
        this.decoder = new genDecoder(d);
    }
    forward(x){
        x = Tensor.einsum('out, out in -> in', x, this.W);
        x = this.encoder(x);
        // x = this.decoder(x);
        const wT = Tensor.einsum('i j -> j i', this.W);
        x = Tensor.einsum('x, x w -> w', x, wT);

        return x;
    }
}
export class genEncoder extends nn.Module{
    __init__(d) {
        this.layers = Array(LAYER_COUNT).fill(0).map((_, i)=>{
            let dim = d * HEAD_COUNT ** i ;
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
        this.norm = nn.rmsNorm(d_in);
        this.heads = Array(head_count).fill().map(()=>new genHead(d_in));
        this.W0 = nn.linear(d_in * head_count, d_out, true); // Матрица сборки выходов голов
    }
    forward(x){
        let y = this.norm(x);
        let heads_res = this.heads.map(h=>h(y));
        y = Tensor.concat(...heads_res);//heads_res._concat();
        y = this.W0(y);
        return y;
    }
}
export class genHead extends nn.Module{
    __init__(d) {
        this.d = d;
        this.dH = d;
        this.in_proj = nn.linear(d, d * 2, false);
        this.x_proj = nn.linear(d, d * 2 + this.delta_rank, false);
        this.dt_proj = nn.linear(this.delta_rank, this.dH, true);
        this.A = Parameter(Tensor.hippo([this.dH, d], -1)/*._log()*/);
        this.H = Tensor.zeros([this.dH, d]);
        this.D = Parameter(Tensor.ones([d]));
        this.out_proj = nn.linear(d, d, BIAS);
        this.norm = nn.rmsNorm(d);
    }
    forward(x){
        let x_and_res = this.in_proj(x);
        let [x1, x2] = x_and_res._slice([this.d, this.d]);
        x1 = x1._silu();
        let y = this.ssm(x1)
        x2 = x2._silu();
        y = Tensor.einsum('n, n -> n', y, x2);
        y = this.out_proj(y);
        y = this.norm(y);
        return y;
    }
    ssm(x){
        let x_dbl = this.x_proj(x);
        let [delta, B, C] = x_dbl._slice([this.delta_rank, this.d, this.d]);
        delta = this.dt_proj(delta);
        delta = delta._softplus();
        x = this.select(x, delta, B, C);
        return x;
    }
    select(u, delta, B, C){
        let deltaB_u = Tensor.einsum('d_in, n, d_in -> d_in n', delta, B, u);
        const sum = Tensor.einsum('d_in, d_in n -> d_in n', delta, this.A);
        let deltaA = sum._exp();
        deltaA = Tensor.einsum('n d_in, n d_in -> n d_in', deltaA, this.H.data); // поэлементное умножение без распространения градиента в H

        this.H = Tensor.einsum('n d_in, n d_in -> n d_in : _add', deltaA, deltaB_u);
        let y = Tensor.einsum('n, n d_in -> n', C, this.H);
        u = Tensor.einsum('n, n -> n', u, this.D);
        y = Tensor.einsum('n, n -> n : _add', u, y);
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
        const tokens = []
        for (let i = 0; i<text.length; i += TOKEN_SIZE)
            tokens.push(text.slice(i, i + TOKEN_SIZE));
        return  tokens;
    }
}
export class WordEncoder {
    textEncoder = new TextEncoder();
    constructor() {
        return this.encode.bind(this);
    }
    encode(word){
        const buf = this.textEncoder.encode(word);
        const emb = BINS.reduce((r, b, i) => {
            let v = (buf[i] || 0);
            v = v.toString(2);
            v = v.padStart(8, '0');
            v.split('').map((n, j) => r[j] += (+n * b));
            return r;
        }, Array(8).fill(2 ** -WORD_DEEP));
        return emb;
    }
}

export class WordDecoder {
    textDecoder = new TextDecoder();
    constructor() {
        return this.decode.bind(this);
    }
    decode(vector){
        vector = vector.toReversed();
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
        result = new Int8Array(result)
        result = this.textDecoder.decode(result);
        return result;
    }
}

function tensor(...args){
    if(args[0] instanceof Tensor)
        return args[0];
    return new Tensor(...args);
}
