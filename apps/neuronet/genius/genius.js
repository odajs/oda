import {Tensor} from "./tor.js";
import {EO} from "./einops.js";
import {Linear, Module} from "./module.js";

export const MODEL_DIM = 8;           // Размерность входного и выходного слоев
const EXPAND = 2;               // Коэффициент расширения вектора слов
const LAYER_COUNT = 1;          // Количество слоев
const HEAD_COUNT = 1;           // Количество селекторов (голов) в слое
const SIGNS = ',()[]{}:;';
const SPLITTERS = ' \n\t';
const TERMINATES = '.!?…';
const DT_RANK = 2;
const BIAS = false;

export class Genius extends Module{
    __init__() {
        this.d = MODEL_DIM;// * EXPAND;
        this.W = Tensor.param(Tensor.random([MODEL_DIM, this.d]));
        this.fork_proj = new Linear(this.d, this.d * 2 + DT_RANK, false);
        this.dt_proj = new Linear(DT_RANK, this.d, true);
        this.A = Tensor.param(Tensor.hippo(this.d));
        this.H = Tensor.zeros([this.d, this.d], 'H');
        this.D = Tensor.param(Tensor.ones(this.d));
    }
    resetH(){
        this.H = Tensor.zeros([this.d, this.d], 'H');
    }
    forward(x){
        x = Tensor.from(x, `INPUT`);
        // расширение входа
        // let y = EO.einsum('x, xy -> y', x,  this.W);
        // разделение входа на вектора B, C и Δ
        let fork_x = this.fork_proj(x);

        let [B, C, delta] = fork_x.slice([this.d, this.d, DT_RANK]);
        delta = this.dt_proj(delta);
        delta = delta.softplus();
        let A = this.A.exp().mul(-1);
        let sum = EO.einsum('d, dn -> dn', delta, A);
        let deltaA = sum.exp();
        let deltaB_u = EO.einsum('d, n, d -> dn', delta, B, x)
        let da = deltaA.mul(this.H.data);
        this.H = da.add(deltaB_u);
        let y = EO.einsum('dn, n -> d', this.H, C);
        y =  y.add(x.mul(this.D));
        return y;
    }
}