import {Tensor} from "./tor.js";
import {EO} from "./einops.js";
import {Linear, Module} from "./module.js";
export class Genius extends Module{
    error = 0;
    constructor(params = {tokenizer: null, expand: 2, deep: 1, head_count: 1}) {
        super(params);
    }
    get d(){
        return this.tokenizer.dim / this.head_count;
    }
    __init__() {
        this.heads = Array(this.head_count).fill().map(l=>new GeniusLayer({d_in: this.d, expand: this.expand, deep: this.deep - 1}));
        this.W = Tensor.param(Tensor.random([this.d, this.d * 2]));
    }
    reset(){
        this.heads.forEach(h=>h.module.reset());
    }
    async forward(token, target){
        let x = Tensor.from(token);

        let result = EO.einsum('x, xy->y', x, this.W);
        let WT = EO.einsum('xy->yx', this.W);
        result = EO.einsum('y, yx->x', result, WT);
        // result = result.sigmoid();
        result = result.MSE(target);
        result.back();
        //
        // let result = this.heads.map(async (head, i)=>{
        //     let x = token.emb[i];
        //     return head(x);
        // });
        // result =  await Promise.all(result)
        // result = Tensor.stack(result);
        // result = this.tokenizer.findToken(result, target);
        return result;
    }
}
export class GeniusLayer extends Module{
    get d(){
        return Math.floor(this.d_in * this.expand);
    }
    get dh(){
        return this.d;//Math.floor(this.d * this.expand);
    }
    __init__() {
        this.d_A = this.d * this.dh;
        this.W = Tensor.param(Tensor.random([this.d_in, this.d]));
        this.fork_proj = new Linear({d_in: this.d, d_out: this.dh * 2/* + DT_RANK*/, bias: false});
        this.A = Tensor.param(Tensor.random([this.d_A, this.d_A]));
        this.H = Tensor.zeros([this.d, this.dh]);
        if (this.deep)
            this.subLayer = new GeniusLayer({d_in: this.d, expand: this.expand, deep: this.deep - 1});
    }
    reset(){
        // this.H = Tensor.zeros([this.d, this.dh]);
        this.subLayer?.reset?.();
    }
    forward(x){
        // расширение входа
        let xe = EO.einsum('x, xy -> y', x, this.W);
        // разделение входа на вектора B, C и Δ
        let fork_x = this.fork_proj(xe);
        let [B, C] = fork_x.slice([this.dh, this.dh/*, DT_RANK*/]);
        let xB = EO.einsum('x, B -> xB', xe, B);
        xB.reshape(this.d_A);
        let A = EO.einsum('x, xy -> y', xB, this.A);
        A.reshape([this.d, this.dh]);
        this.H = A.add(this.H.array);
        let y = EO.einsum('xy, y -> x', this.H, C);
        y = xe.add(y);
        if (this.subLayer)
            y = this.subLayer(y);
        y = EO.einsum('y, xy -> x', y, this.W);
        return y;
    }
}