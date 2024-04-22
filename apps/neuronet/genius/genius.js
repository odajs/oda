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
        let result = this.layers.map((layer, i)=>{
            let x = Tensor.from(token.emb[i], `INPUT`);
            return layer(x);
        });
        result = this.tokenizer.findToken(result, target);
        return result;
    }
}
export class GeniusLayer extends Module{
    get d(){
        return Math.floor(this.d_in * this.expand);
    }
    __init__() {
        this.d_A = this.d * this.d;
        this.W = Tensor.param(Tensor.random([this.d_in, this.d]));
        this.fork_proj = new Linear({d_in: this.d, d_out: this.d * 2/* + DT_RANK*/, bias: false});
        this.A = Tensor.param(Tensor.hippo(this.d_A));
        this.H = Tensor.zeros([this.d, this.d]);
        if (this.deep)
            this.subLayer = new GeniusLayer({d_in: this.d, expand: this.expand, deep: this.deep - 1});
    }
    reset(){
        // this.H = Tensor.hippo(this.d);
        this.H = Tensor.zeros([this.d, this.d]);
    }
    forward(x){
        // расширение входа
        let xe = EO.einsum('x, xy -> y', x, this.W);
        // разделение входа на вектора B, C и Δ
        let fork_x = this.fork_proj(xe);
        let [B, C] = fork_x.slice([this.d, this.d/*, DT_RANK*/]);
        let xB = EO.einsum('x, B -> xB', xe, B);
        xB.reshape(this.d_A);
        let A = EO.einsum('x, xy -> y', xB, this.A);
        A.reshape([this.d, this.d]);
        this.H = A.add(this.H.array);
        let y = EO.einsum('xy, y -> y', this.H, C);
        y = xe.add(y);
        if (this.subLayer)
            y = this.subLayer(y);
        y = EO.einsum('y, xy -> x', y, this.W);
        return y;
    }
}