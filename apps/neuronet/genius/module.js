import {tensor} from "./torus.js";
export class Module{
    #params = Object.create(null);
    constructor(argumetns) {
        let expr = this.constructor.toString();
        expr = expr.replace(/\/\/.*/g, '').replace(/\/\*[^\*\/]*\*\//g, '');
        const names = expr.match(/(?<=\()(.|(\r?\n))*?(?=\))/g)[0].split(',');
        if (argumetns.length === 1 && argumetns[0].constructor === Object){
            argumetns = argumetns[0];
            for (let n in argumetns){
                this[n] = this.#params[n] = argumetns[n];
            }

        }
        for (let i = 0; i<names.length; i++){
            let name = names[i]
            let [n, d] = name.split('=').map(i=>i.trim());
            this[n] = this.#params[n] ??= argumetns[i] ?? (new Function("return "+d))();
        }
        this.__init__();
        const fwd = (...args)=>{
            return this.forward(...args);
        }
        fwd.module = this;
        fwd.toString = this.toString.bind(this);
        return fwd
    }
    get params(){
        return this.#params;
    }
    forward(x){
        return x;
    }
    back(g){
        return g;
    }
    get __children__(){
        let ch = Object.getOwnPropertyDescriptors(this);
        const result = []
        for (let n in ch){
            const prop = ch[n]
            if (prop.value?.module){
                result.push({[n]:prop.value.module})
            }
            else if (prop.value instanceof tensor){
                result.push({[n]:prop.value})
            }
            else if (Array.isArray(prop.value) && prop.value[0]?.module){
                result.push({[n]:prop.value.map(i=>i.module)})
            }
        }
        return result;
    }
    toString(){
        return this.toStringTree()
    }
    toStringTree(step = 0){
        const add = 3;
        const tab = (' ').repeat(step + add);
        let s = `${this.label} (${this.__params__})\r\n`;
        s += this.__children__.map(obj => {
            const key = Object.keys(obj)[0];
            const prop = obj[key];
            if(Array.isArray(prop)){
                return tab + key + `[${prop.length}]:\r\n` +prop.map((m, i)=>(' ').repeat(step + add * 2)+i+': '+m.toString(step + add * 2)).join('')
            }
            return tab + key+': ' + (prop.toStringTree?.(step + add) || prop.toString());
        }).join('');
        return s;
    }
    get label(){
        return `${this.constructor.name} (${Object.keys(this.#params).map(k=>k+'='+this.#params[k])})`;
    }
}
class Linear extends Module{
    constructor(d_in, d_out, bias = false) {
        super(arguments);
    }
    __init__() {
        this.W = tensor.param(tensor.rand([this.d_in, this.d_out]).minus_(.5));
        this.W._label(this.W.label + '/linear weights');
        if(this.bias){
            this.B = tensor.param(tensor.rand(this.d_out).minus_(.5));
            this.B._label(this.bias._label + '/linear bias');
        }

    }
    forward(x){
        let axis = ''
        if (x.shape.length>1){
            axis = Array(x.shape.length-1).fill(65).map((v,i)=>String.fromCharCode(v+i)).join('')
        }
        x = tensor.einsum(`${axis}i, io -> ${axis}o`, [x, this.W]);
        if (this.bias)
            x = x.plus(this.B);
        return x;
    }
}
class conv1D extends Module {
    constructor(in_channels,
                out_channels,
                kernel_size = 4,
                stride = 1,
                padding = 0,
                padding_mode = 'zeros', // options('zeros', 'reflect', 'replicate', 'circular')
                dilation = 1,
                groups = 1,
                bias = true) {
        super(arguments);
    }
    __init__() {
        if (this.in_channels%this.groups)
            throw new Error('in_channels must be divisible by groups');
        if (this.out_channels%this.groups)
            throw new Error('out_channels must be divisible by groups');
        let k = Math.sqrt(this.groups / (this.in_channels * this.kernel_size))
        this.weight_shape = [this.out_channels, this.in_channels / this.groups, this.kernel_size];
        this.weights = tensor.param(tensor.rand(this.weight_shape).minus_(.5).mul_(2 * k));
        if (this.bias)
            this.bias_weights = tensor.param(tensor.rand([this.out_channels]).minus_(.5).mul_(2 * k));
        this.pads = Array(this.padding).fill(0);
    }
    forward(x) {
        let k_size = this.kernel_size;
        if (x.dim>3)
            throw new Error(`Expected 2D (unbatched) or 3D (batched) input to conv1d, but got input of size: [${x.shape}]`);
        if ((x.getDim(-2) || 1) !== this.in_channels)
            throw new Error(`Given groups=${this.groups}, weight of size [${this.weight_shape}], expected input[${x.shape}] to have ${this.in_channels} channels, but got ${(x.getDim(-2) || 1)} channels instead`);
        let stride = this.stride;
        let dilation = this.dilation;
        let x_data = x.data;
        let k_data = this.weights.data;
        let padding = this.padding;
        let L_in = x.getDim(-1);
        let padded_size = L_in + padding * 2;
        let batches = x.dim === 2?1:x.getDim(-3);
        let dim_out = (padded_size - dilation * (k_size - 1) - 1) / stride + 1;
        const out_shape = [this.out_channels, dim_out];
        if (x.dim > 2)
            out_shape.unshift(batches)
        const out_size = out_shape.reduce((r, v) => r * v, 1);
        let data = new Float32Array(out_size);

        let outs = this.out_channels;
        let links = this.in_channels / this.groups;
        let ins = this.in_channels;
        let groups = this.groups;
        let in_idx = 0;
        let in_step = x.getDim(-1) * this.groups;
        const kernels = [];
        let idx = -1;
        for (let b = 0; b < batches; b++){
            let batch_data = x.dim === 3?x._slice(b):x.data;

            for (let o = 0; o < outs; o++) {
                let out_idx = dim_out * (o + b * outs);
                let kernel = kernels[o] ??= this.weights._slice(o);
                let src_idx = 0;
                let k_idx = 0;
                for (let l = 0; l<links; l++){
                    let src = new Float32Array(L_in);
                    for (let g = 0; g < groups; g++){
                        const src_grp = batch_data.slice(src_idx, src_idx += L_in);
                        src = src.map((v, i)=>{
                            return v + src_grp[i];
                        })
                    }
                    let src_data =  [...this.pads, ...src, ...this.pads];

                    let k = kernel.slice(k_idx, k_idx += k_size);
                    for (let step = 0; step < dim_out; step++){
                        data[++idx] = k.reduce((r, k_val, i)=>{
                            let idx = step * stride + i * dilation;
                            return r + k_val * src_data[idx];
                        }, 0)
                    }
                }
            }
        }
        const out = tensor.from(data)._src(x, this.kernel)._label(this.label)._shape(out_shape)

        return out;
    }

}
class RMSNorm extends Module {
    constructor(dim, bias = false) {
        super(arguments);
    }
    __init__() {
        this.W = tensor.param(tensor.rand(this.dim))._label('RMSNorm - W');
        if (this.bias)
            this.B = tensor.param(tensor.rand(this.dim))._label('RMSNorm - bias');
        this.eps = 1e-5;
    }
    forward(x) {
        let p = x.pow(2);
        let m = p.mean();
        let eps = m.plus(this.eps);
        let sqrt = eps.func('_rsqrt');
        let mul = this.W.mul(sqrt);
        let out = mul.mul(x);
        if (this.bias)
            out = out.plus(this.B)
        return out;
    }
}
export const nn = {
    linear(...args){
        return new Linear(...args);
    },
    Conv1d(...args){
        return new conv1D(...args);
    },
    RMSNorm(...args){
        return new RMSNorm(...args);
    }
}