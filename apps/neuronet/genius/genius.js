//HYPER PARAMETERS
import {Parameter, Tensor} from "./ten.js";
import * as nn from  './module.js';


const MODEL_DIM = 32;           // Размерность входного и выходного слоев
const EXPAND = 2;               // Коэффициент расширения вектора слов
const LAYER_COUNT = 1;          // Количество слоев
const HEAD_COUNT = 1;           // Количество селекторов (голов) в слое
const SIGNS = ',()[]{}:;';
const SPLITTERS = ' \n\t';
const TERMINATES = '.!?…';
const BINS = Array(32).fill(0).map((v, i)=>(2. ** -i));
const BIAS = false;

export class Genius extends nn.Module{
    __init__() {
        const d = MODEL_DIM// * EXPAND;
        this.W = Parameter(Tensor.random([MODEL_DIM, d]));
        this.Wo = Tensor.random([MODEL_DIM, MODEL_DIM/*d*/]);
        this.encoder = new genEncoder(d);
        this.decoder = new genDecoder(d);
    }
    forward(x){
        x = Tensor.einsum('out, out in -> in', x, this.W);
        // res = Tensor.einsum('out, out in -> in', res, this.Wo);
        // let res = this.encoder(w);
        // res = this.decoder(res);
        // res = res._relu();
        // res = res._sigmoid();
        // const wT = Tensor.einsum('i j -> j i', this.W);
        // let res = Tensor.einsum('x, x w -> w', x, wT);
        // x = Tensor.einsum('w x, x -> x', this.Wo, x);
        x = Tensor.einsum('w, w x -> x', x, this.Wo);

        return x;
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
        this.norm = nn.rsmNorm(d_in);
        this.heads = Array(head_count).fill().map(()=>new genHead(d_in));
        this.W0 = nn.linear(d_in * head_count, d_out, true); // Матрица сборки выходов голов
    }
    forward(x){
        let y = x;
        // let y = this.norm(x);
        let head_res = Tensor.stack(this.heads.map(h=>h(y)));
        y = head_res._concat();
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
        this.dt_proj = nn.linear(this.delta_rank, this.d, true);
        this.A = Tensor.hippo([this.dH, d], -1)._log();
        this.H = Tensor.zeros([this.dH, d]);
        this.D = Parameter(Tensor.ones([d]));
        this.out_proj = nn.linear(d, d, BIAS);
        this.norm = nn.rsmNorm(d);
        // this.conv1d = (x)=>{
        //     return x;
        // }
    }
    forward(x){
        let x_and_res = this.in_proj(x);
        let [x1, x2] = x_and_res._slice([this.d, this.d]);
        // x1 = this.conv1d(x1);
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
        // A = A._exp();
        // A = A._mul(-1);
        let x_dbl = this.x_proj(x);
        let [delta, B, C] = x_dbl._slice([this.delta_rank, this.dH, this.dH]);
        delta = this.dt_proj(delta);
        delta = delta._softplus();
        x = this.select(x, delta, A, B, C);
        return x;
    }
    select(u, delta, A, B, C){

        const ss = Tensor.einsum('i->', [1,2,3,4,5])
        const sum = Tensor.einsum('d_in, d_in n -> d_in n', delta, A);
        // let y = u;
        // let deltaA = delta._mul(A);
        // deltaA = deltaA._exp();
        let deltaB_u = Tensor.einsum('d_in, n, d_in -> d_in n', delta, B, u);

        // deltaA = deltaA._mul(this.H);
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
        let arr = Array(this.dim).fill((2 ** -this.dim));
        const emb = (word).split('').reduce((r, v, i) => {
            v.charCodeAt(0).toString(2).padStart(this.dim, '0').split('').map((n, j) => arr[j] += (+n * 2 ** -i));
            return r;
        }, arr);
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
        result = String.fromCharCode(...result);
        return result;
    }
}


function tensor(...args){
    if(args[0] instanceof Tensor)
        return args[0];
    return new Tensor(...args);
}
