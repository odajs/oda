import {tensor} from "./torus.js";
import {Linear, Module} from "./module.js";
export class Genius extends Module{
    error = 0;
    constructor(params = {tokenizer: null, expand: 2, deep: 1, head_count: 1}) {
        super(params);
    }
    get d(){
        return this.tokenizer.dim // this.head_count;
    }
    __init__() {
        this.heads = Array(this.head_count).fill().map(l=>new GeniusLayer({d_in: this.d, expand: this.expand, deep: this.deep - 1}));
        // this.W = tensor.param(tensor.rand(this.d, this.d));
    }
    reset(){
        this.heads.forEach(h=>h.module.reset());
    }
    async forward(token, target){
        let x = tensor.from(token);
        let result = this.heads[0](x)
        // let result = this.heads.map(async (head, i)=>{
        //     return head(x);
        // });
        // result =  await Promise.all(result)
        // result = tensor.stack(result);
        result = this.tokenizer.findToken(result, target);
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
        // this.d_A = this.d * this.dh;
        this.W = tensor.param(tensor.rand(this.d_in, this.d));
        this.fork_proj = new Linear({d_in: this.d, d_out: this.dh * 2/* + DT_RANK*/, bias: false});
        this.Alog = tensor.param(tensor.hippo(this.d));
        this.H = tensor.zeros(this.d, this.d);
        if (this.deep)
            this.subLayer = new GeniusLayer({d_in: this.d, expand: this.expand, deep: this.deep - 1});
    }
    reset(){
        this.H = tensor.zeros(this.d, this.d);
        this.subLayer?.reset?.();
    }
    forward(x){
        // расширение входа
        let xe = tensor.einsum('x, xy -> y', [x, this.W]);
        // разделение входа на вектора B, C и Δ
        let fork_x = this.fork_proj(xe);
        let [B, C] = fork_x.slice([this.dh, this.dh/*, DT_RANK*/]);
        let xB = tensor.einsum('x, B -> xB', [xe, B]);
        let A = this.Alog.exp().invert();
        A = tensor.einsum('xy, xy -> xy', [xB, A]);
        this.H.data = A.plus(this.H).data;
        let y = tensor.einsum('xy, y -> x', [this.H, C]);
        y = xe.plus(y);
        if (this.subLayer)
            y = this.subLayer(y);
        y = tensor.einsum('y, xy -> x', [y, this.W]);
        return y;
    }
}