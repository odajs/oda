import {tensor} from "./torus.js";
import {nn, Module} from "./module.js";
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
    constructor(dim_x, expand = 2, deep = 1) {
        super(arguments);
    }
    get dim_inner(){
        return Math.floor(this.dim_x * this.expand);
    }
    get dt(){
        return 1;
    }
    __init__() {
        // this.W = tensor.param(tensor.rand([this.d_in, this.d_x]).minus_(.5).mul_(.1));
        this.in_proj = nn.linear(this.dim_x, this.dim_inner * 2, false);
        this.x_proj = nn.linear(this.dim_inner, this.dim_inner * 2 + this.dt, false);
        this.dt_proj = nn.linear(this.dt, this.dim_inner, true);
        this.Alog = tensor.param(tensor.hippo(this.dim_inner));
        // this.H = tensor.zeros([this.d_inner, this.d_inner]);
        if (this.deep)
            this.subLayer = new GeniusLayer({d_in: this.dim_inner, expand: this.expand, deep: this.deep - 1});
        this.D = tensor.param(tensor.ones(1));
        this.silu1 = tensor.param(tensor.from());
        this.silu2 = tensor.param(tensor.from());
        this.softplus = tensor.param(tensor.from());
        this.conv1d = nn.Conv1d(this.dim_inner, this.dim_inner, 4, undefined, 3, undefined, undefined, this.dim_inner);
    }
    forward(input){
        // расширение входа
        // let xe = tensor.einsum('Lx, xy -> Ly', [input, this.W]);
        // разделение входа на 2 потока
        let x_res = this.in_proj(input);
        let [x, res] = x_res.split([this.dim_inner, this.dim_inner], -1);
        x = tensor.einsum('ld -> dl', [x]);
        x  = this.conv1d(x);
        x = tensor.einsum('dl -> ld', [x]);
        x = x.silu(this.silu1);
        let fork_x = this.x_proj(x)
        let [B, C, delta] = fork_x.split([this.dim_inner, this.dim_inner, this.dt], -1);
        delta = this.dt_proj(delta);
        delta = delta.softplus(this.softplus);


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
        res = res.silu(this.silu2);
        y = tensor.einsum('y, y -> y', [y, res]);
        // y =  y.plus(xe);
        if (this.subLayer)
            y = this.subLayer(y);
        y = tensor.einsum('y, xy -> x', [y, this.W]);
        y = y.plus(input);
        return y;
    }
}