import {Parameter, tensor, Tensor} from "./tor.js";
import {EO} from "./einops.js";
import {Linear, Module} from "./module.js";

export const MODEL_DIM = 16;           // Размерность входного и выходного слоев
const EXPAND = 2;               // Коэффициент расширения вектора слов
const LAYER_COUNT = 1;          // Количество слоев
const HEAD_COUNT = 1;           // Количество селекторов (голов) в слое
const SIGNS = ',()[]{}:;';
const SPLITTERS = ' \n\t';
const TERMINATES = '.!?…';
const BIAS = false;

export class Genius extends Module{
    __init__() {
        this.d = MODEL_DIM;// * EXPAND;
        this.W = Parameter(Tensor.random([MODEL_DIM, this.d]));
        this.fork_proj = new Linear(this.d, this.d * 2, false);
        this.A = Parameter(Tensor.hippo(this.d));
        // this.H = Tensor.zeros([this.d, this.d], 'H'); //todo Parameter
    }
    resetH(){
        this.H = undefined
        // this.encoder.module.resetH();
    }
    forward(x){
        x = tensor(x, `INPUT`);
        // расширение входа
        // let y = EO.einsum('x, xy -> y', x,  this.W);

        // разделение входа на вектора B и C
        let fork_x = this.fork_proj(x);

        let [B, C] = fork_x.slice([this.d, this.d]);

        // получение матрицы A
        let A = EO.einsum('x, y, xy -> xy', x, B, this.A);

        //
        // // сложение матрицы A со скрытым слоем
        if (!this.H)
            this.H = A;
        else
            this.H =  A.add(this.H.data)//.div(2);
        //
        //
        //
        //
        // // получение смещений вложения
        let delta = EO.einsum('xy, y -> y', this.H, C);
        //
        let sum =  x.add(delta);
        //
        // // Добавление ко входному токену смещения для получения выходного (следубщего) токена
        let y = sum//.div(2);

        // const Wt = EO.einsum('xy -> yx', this.W);
        // y = EO.einsum('x, xy -> y', y, Wt);
        return y;
    }
}