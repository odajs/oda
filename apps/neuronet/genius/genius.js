import {tensor} from "./torus.js";
import {Linear, Module} from "./module.js";
export class Genius extends Module{
    error = 0;
    constructor(tokenizer, expand = 2, deep = 1, head_count = 1) {
        super(arguments);
    }
    get d(){
        return this.tokenizer.dim // this.head_count;
    }
    __init__() {
        this.heads = Array(this.head_count).fill().map(l=>new GeniusLayer(this.d, this.expand, this.deep - 1));
        // this.W = tensor.param(tensor.rand(this.d, this.d));
    }
    reset(){
        this.heads.forEach(h=>h.module.reset());
    }
    forward(input){
        let result = this.heads.map((head, i)=>{
            return head(input);
        });
        // result = Promise.all(result)
        result = result[0];//tensor.stack(result);
        result = this.tokenizer.findToken(result, target);
        return result;
    }
}
export class GeniusLayer extends Module{
    constructor(d_in, expand = 2, deep = 1) {
        super(arguments);
    }
    get d_layer(){
        return Math.floor(this.d_in * this.expand);
    }
    get d_inner(){
        return Math.floor(this.d_layer * this.expand);
    }
    get dt(){
        return 1;
    }
    __init__() {
        this.W = tensor.param(tensor.random([this.d_in, this.d_layer]).minus_(.5).mul_(.1));
        this.in_proj = new Linear({d_in: this.d_layer, d_out: this.d_inner * 2, bias: false});


        this.x_proj = new Linear({d_in: this.d_inner, d_out: this.d_inner * 2 + this.dt, bias: false});
        this.dt_proj = new Linear({d_in: this.dt, d_out: this.d_inner, bias: true});
        this.Alog = tensor.param(tensor.hippo(this.d));
        this.H = tensor.zeros([this.d, this.d]);
        if (this.deep)
            this.subLayer = new GeniusLayer({d_in: this.d, expand: this.expand, deep: this.deep - 1});
        this.D = tensor.param(tensor.ones(1));
    }
    reset(){
        this.H = tensor.zeros(this.d, this.d);
        this.subLayer?.reset?.();
    }
    forward(input){
        // расширение входа
        let xe = tensor.einsum('Lx, xy -> Ly', [input, this.W]);
        // разделение входа на 2 потока
        let x_res = this.in_proj(xe);
        let [x, res] = x_res.split([this.d, this.d], -1);
        // x  = this.conv1D(x);
        x = x.silu();
        let fork_x = this.x_proj(x)
        let [B, C, delta] = fork_x.split([this.d_inner, this.d_inner, this.dt], -1);
        delta = this.dt_proj(delta);
        delta = delta.softplus();


        // let xB = tensor.einsum('x, B -> xB', [xe, B]);
        let A = this.Alog.exp().invert();
        let sum = tensor.einsum('Ld, dn -> Ldn', [delta, A])
        let deltaA = sum.exp();
        let deltaB_x = tensor.einsum('Ld, Lb, Ld -> Ldb', [delta, B, x]);
        let h = tensor.from(this.H.data)._shape(this.H)

        let da = tensor.einsum('ab, ab->ab', [deltaA, h]);

        // tensor.einsum('xy, xy -> xy', [xB, A]);
        this.H = da.plus(deltaB_x);
        let y = tensor.einsum('xy, y -> x', [this.H, C]);
        // let xee = tensor.einsum('x, d -> x', [xe, this.D]);
        y = y.plus(xe);
        res = res.silu();
        y = tensor.einsum('y, y -> y', [y, res]);
        // y =  y.plus(xe);
        if (this.subLayer)
            y = this.subLayer(y);
        y = tensor.einsum('y, xy -> x', [y, this.W]);
        y = y.plus(input);
        return y;
    }
}