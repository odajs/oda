//HYPER PARAMETERS
import {Parameter, tensor, Tensor} from "./tor.js";
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
        this.W = Parameter(Tensor.random([MODEL_DIM, d], 'weights'));
        this.encoder = new genEncoder(d);
        this.decoder = new genDecoder(d);
        this.out_proj = nn.linear(d * HEAD_COUNT * LAYER_COUNT, d, true);
        this.B = Parameter(Tensor.random([d], 'B'));
        this.С = Parameter(Tensor.random([d], 'C'));
        this.D = Parameter(Tensor.random(1, 'D'));
        this.A = Parameter(Tensor.random([d, d], 'А'));
        this.H = Tensor.zeros([d, d], 'H'); //todo Parameter
        // let A = Tensor.arange(1, d + 1, d);
        // this.A = Parameter(A.log());
    }
    resetH(){
        const d = MODEL_DIM * EXPAND;
        this.H = Tensor.zeros([d, d], 'H'); //todo Parameter
        // this.encoder.module.resetH();
    }
    forward(x){
        x = tensor(x, 'INPUT');
        let y = Tensor.einsum('x, x y -> y', x, this.W);
/*        let bb = Tensor.einsum('x, y -> x y', x, this.B);
        // let expA = this.A.exp().mul(-1);
        // let ba = Tensor.einsum('x y, x y -> x y', bb, this.A);
        // this.H = ba.add(this.H.data)
        let y = Tensor.einsum('x y, y -> x', bb, this.С);
        let xd =  x.mul(this.D);
        y = y.add(xd);*/
        // const Wt = Tensor.einsum('x y -> y x', this.W);
        // y = Tensor.einsum('x, x y -> y', y, Wt);
        return y;
    }
}
export class genEncoder extends nn.Module{
    __init__(d) {
        this.layers = Array(LAYER_COUNT).fill(0).map((_, i)=>{
            let dim = d * HEAD_COUNT ** i ;
            return new genLayer(dim, dim * HEAD_COUNT, HEAD_COUNT);
        })
    }
    resetH(){
        for(let layer of this.layers)
            layer.module.resetH();
    }
    forward(x){
        for(let layer of this.layers)
            x = layer(x);
        return x;
    }
    get label(){
        return this.constructor.name + ` (${this.layers.length} layers)`;
    }
}
export class genDecoder extends nn.Module{
    __init__(d_in) {
        this.d_in = d_in;
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
    get label(){
        return this.constructor.name + ` (${this.layers.length} layers)`;
    }
}

export class genLayer extends nn.Module{
    __init__(d_in, d_out, head_count = 1) {
        this.d_in = d_in;
        this.d_out = d_out;
        this.head_count = head_count;
        this.norm = nn.rmsNorm(d_in);
        this.heads = Array(head_count).fill().map(()=>new genHead(d_in));
        this.proj_out = nn.linear(d_in * head_count, d_out, true); // Матрица сборки выходов голов
    }
    resetH(){
        for(let head of this.heads)
            head.module.resetH();
    }
    forward(x){
        let y = x;//this.norm(x);
        let heads_res = this.heads.map(h=>{
            let res = h(y);
            // res = res.add(x);
            return res;
        });
        y = Tensor.concat(...heads_res);
        y = this.proj_out(y);
        return y;
    }
    get label(){
        return this.constructor.name + ` (${this.d_in}, ${this.d_out}, ${this.head_count})`;
    }
}
export class genHead extends nn.Module{
    __init__(d) {
        this.d = d;
        this.dH = d * 2;
        this.in_proj = nn.linear(d, this.dH * 2, false);
        this.x_proj = nn.linear(this.dH, this.dH * 2 + this.delta_rank, false);
        this.dt_proj = nn.linear(this.delta_rank, this.dH, true);
        let A = Tensor.arange(1, this.dH + 1, this.dH);
        this.A_log = Parameter(A.log());
        this.H = Tensor.zeros([this.dH, this.dH]);
        this.D = Parameter(Tensor.ones([this.dH]));
        this.out_proj = nn.linear(this.dH, d, BIAS);
    }
    resetH(){
        this.H = Tensor.zeros([this.dH, this.dH]);
    }
    forward(x){
        let x_and_res = this.in_proj(x);
        let [x1, x2] = x_and_res.slice([this.dH, this.dH]);
        x1 = x1.active('silu');
        x1 = this.ssm(x1)
        x2 = x2.active('silu');
        x1 = x1.mul(x2);
        x1 = this.out_proj(x1);
        return x1;
    }
    ssm(x){
        const A = this.A_log.exp().mul(-1)
        let x_dbl = this.x_proj(x);
        let [delta, B, C] = x_dbl.slice([this.delta_rank, this.dH, this.dH]);
        delta = this.dt_proj(delta);
        delta = delta.active('softplus');
        x = this.select(x, delta, A, B, C);
        return x;
    }
    select(u, delta, A, B, C){
        let deltaB_u = Tensor.einsum('d_in, n, d_in -> d_in n', delta, B, u);
        const sum = Tensor.einsum('d_in, d_in n -> d_in n', delta, A);
        let deltaA = sum.exp();
        deltaA = Tensor.einsum('n d_in, n d_in -> n d_in', deltaA, this.H.data); // поэлементное умножение без распространения градиента в H

        this.H = deltaA.add(deltaB_u);
        let y = Tensor.einsum('d_in n, n -> n', this.H, C);
        u = u.mul(this.D);
        y = u.add(y);
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