import {Tensor} from "./tor.js";
import {EO} from "./einops.js";
import {Linear, Module} from "./module.js";

const EXPAND = 2;               // Коэффициент расширения вектора слов
const LAYER_COUNT = 1;          // Количество слоев
const HEAD_COUNT = 1;           // Количество селекторов (голов) в слое
const SIGNS = ',()[]{}:;';
const SPLITTERS = ' \n\t';
const TERMINATES = '.!?…';
const DT_RANK = 2;
const BIAS = false;

export class Genius extends Module{
    error = 0;
    constructor(params = {tokenizer: undefined, expand: 2, deep: 1}) {
        super(params);
    }
    get d(){
        return this.tokenizer.d;
    }
    get head_count(){
        return this.tokenizer.head_count;
    }
    __init__() {
        this.layers = Array(this.head_count).fill().map(l=>new GeniusLayer({d_in: this.d, expand: this.expand, deep: this.deep - 1}));
    }
    reset(){
        this.layers.forEach(layer=>layer.module.reset());
    }
    forward(token, target){
        // x = Tensor.from(x, `INPUT`);
        const result = this.layers.map((layer, i)=>{
            let x = Tensor.from(token.emb[i], `INPUT`);
            return layer(x);
        });


        // расширение входа
        // let y = EO.einsum('x, xy -> y', x,  this.W);
        // разделение входа на вектора B, C и Δ
        // let fork_x = this.fork_proj(x);
        //
        // let [B, C, delta] = fork_x.slice([this.d, this.d/*, DT_RANK*/]);
        // let xB = EO.einsum('x, B -> xB', x, B);
        //
        // let y = EO.einsum('xB, C -> C', xB, C);
        // let Wt =  EO.einsum('xy -> yx', this.W);
        // y = EO.einsum('y, yx -> y', y, Wt);
        // delta = this.dt_proj(delta);
        // delta = delta.softplus();
        // let A = this.A.exp().mul(-1);
        // let sum = EO.einsum('d, dn -> dn', delta, A);
        // let deltaA = sum.exp();
        // let deltaB_u = EO.einsum('d, n, d -> dn', delta, B, x)
        // // let H = Tensor.from()
        // let da = deltaA.mul(this.H.array);
        // this.H = da.add(deltaB_u);
        // let y = EO.einsum('dn, n -> d', this.H, C);
        // y =  y.add(x.mul(this.D));
        this.error
        if (target){
            this.error.back();
        }
        return y;
    }
}
export class GeniusLayer extends Module{
    get d(){
        return this.d_in * this.expand;
    }
    __init__() {
        this.W = Tensor.param(Tensor.random([this.d_in, this.d]));
        this.fork_proj = new Linear({d_in: this.d, d_out: this.d * 2/* + DT_RANK*/, bias: false});
        // this.dt_proj = new Linear(DT_RANK, this.d, true);
        // this.A = Tensor.param(Tensor.hippo(this.d));
        // this.H = Tensor.zeros([this.d, this.d], 'H');
        // this.D = Tensor.param(Tensor.ones(this.d));

        if (this.deep)
            this.layers = Array(this.head_count).map(l=>new GeniusLayer(this.d, this.expand, this.deep - 1));
    }
    reset(){
        this.H = Tensor.zeros([this.d, this.d], 'H');
    }
    forward(x){
        // расширение входа
        let xe = EO.einsum('x, xy -> y', x, this.W);
        // разделение входа на вектора B, C и Δ
        let fork_x = this.fork_proj(xe);
        let [B, C] = fork_x.slice([this.d, this.d/*, DT_RANK*/]);
        let xB = EO.einsum('x, B -> xB', xe, B);
        //
        let y = EO.einsum('xB, C -> C', xB, C);
        let Wt =  EO.einsum('xy -> yx', this.W);
        y = EO.einsum('y, yx -> y', y, Wt);
        return y;
    }
}