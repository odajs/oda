//HYPER PARAMETERS
import {Parameter, tensor, Tensor, EO} from "./tor.js";
import * as nn from  './module.js';
import {Linear} from "./module.js";

const MODEL_DIM = 32;           // Размерность входного и выходного слоев
const EXPAND = 2;               // Коэффициент расширения вектора слов
const LAYER_COUNT = 1;          // Количество слоев
const HEAD_COUNT = 1;           // Количество селекторов (голов) в слое
const SIGNS = ',()[]{}:;';
const SPLITTERS = ' \n\t';
const TERMINATES = '.!?…';
const BIAS = false;

export class Genius extends nn.Module{
    __init__() {
        this.d = MODEL_DIM;// * EXPAND;
        this.W = Parameter(Tensor.random([MODEL_DIM, this.d], 'in/out'));
        this.fork_proj = new Linear(this.d, this.d * 2, false);
        // this.H = Tensor.zeros([this.d, this.d], 'H'); //todo Parameter
    }
    resetH(){
        this.H = undefined
        // this.encoder.module.resetH();
    }
    forward(x){
        x = tensor(x, 'INPUT');



        // расширение входа
        let y = EO.einsum('x, xy -> y', x,  this.W);

        // разделение входа на вектора B и C
        // let fork_x = this.fork_proj(x);

        // let [B, C] = fork_x.slice([this.d, this.d]);

        // получение матрицы A
        // let A = EO.einsum('x, y -> xy', x, B);

        //
        // // сложение матрицы A со скрытым слоем
        // if (!this.H)
        //     this.H = A;
        // else
        //     this.H =  A.add(this.H.data)//.div(2);
        //
        //
        //
        //
        // // получение смещений вложения
        // let delta = EO.einsum('xy, y -> y', this.H, C);
        //
        // let sum =  x.add(delta);
        //
        // // Добавление ко входному токену смещения для получения выходного (следубщего) токена
        // let y = sum//.div(2);

        // const Wt = EO.einsum('xy -> yx', this.W);
        // y = EO.einsum('x, xy -> y', y, Wt);
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