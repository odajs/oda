import {torus} from "./torus.js";
// import {EO} from "./einops.js";
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
        this.W = torus.param(torus.random([this.d, this.d * 2]));
    }
    reset(){
        this.heads.forEach(h=>h.module.reset());
    }
    async forward(token, target){
        let x = torus.from(token);

        let result = torus.einsum('x, xy->y', x, this.W);
        let WT = torus.einsum('xy->yx', this.W);
        result = torus.einsum('y, yx->x', result, WT);
        // result = result.sigmoid();
        result = result.MSE(target);
        result.back();
        //
        // let result = this.heads.map(async (head, i)=>{
        //     let x = token.emb[i];
        //     return head(x);
        // });
        // result =  await Promise.all(result)
        // result = torus.stack(result);
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
        this.W = torus.param(torus.random([this.d_in, this.d]));
        this.fork_proj = new Linear({d_in: this.d, d_out: this.dh * 2/* + DT_RANK*/, bias: false});
        this.A = torus.param(torus.random([this.d_A, this.d_A]));
        this.H = torus.zeros([this.d, this.dh]);
        if (this.deep)
            this.subLayer = new GeniusLayer({d_in: this.d, expand: this.expand, deep: this.deep - 1});
    }
    reset(){
        // this.H = torus.zeros([this.d, this.dh]);
        this.subLayer?.reset?.();
    }
    forward(x){
        // расширение входа
        let xe = torus.einsum('x, xy -> y', x, this.W);
        // разделение входа на вектора B, C и Δ
        let fork_x = this.fork_proj(xe);
        let [B, C] = fork_x.slice([this.dh, this.dh/*, DT_RANK*/]);
        let xB = torus.einsum('x, B -> xB', xe, B);
        xB.reshape(this.d_A);
        let A = torus.einsum('x, xy -> y', xB, this.A);
        A.reshape([this.d, this.dh]);
        this.H = A.add(this.H.array);
        let y = torus.einsum('xy, y -> x', this.H, C);
        y = xe.add(y);
        if (this.subLayer)
            y = this.subLayer(y);
        y = torus.einsum('y, xy -> x', y, this.W);
        return y;
    }
}