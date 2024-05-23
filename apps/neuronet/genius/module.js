import {tensor} from "./torus.js";
export class Module{
    #params = Object.create(null);
    constructor(argumetns) {


        let expr = this.constructor.toString();

        expr = expr.replace(/\/\/.*/g, '').replace(/\/\*[^\*\/]*\*\//g, '');

        const names = expr.match(/(?<=\()(.|(\r?\n))*?(?=\))/g)[0].split(',')/*.map(name => {
            return name.split('=')[0].trim();
        });*/

        for (let i = 0; i<names.length; i++){
            let name = names[i]
            let [n, d] = name.split('=').map(i=>i.trim());
            this[n] = this.#params[n] = argumetns[i] ?? (new Function("return "+d))();
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
        if (in_channels%groups)
            throw new Error('out_channels must be divisible by groups');
        if (out_channels%groups)
            throw new Error('out_channels must be divisible by groups');
        super(arguments);
    }
    __init__() {
        this.kernel = tensor.param(tensor.rand([this.kernel_size]).minus_(.5));
    }
    forward(x) {
        let k_size = this.kernel_size;
        if ((x.getDim(-2) || 1) !== this.in_channels)
            throw new Error(`Given groups=${this.groups}, weight of size [${this.out_channels}, ${this.in_channels / this.groups}, ${k_size}], expected input[${x.shape}] to have ${this.in_channels} channels, but got ${(x.getDim(-2) || 1)} channels instead`);
        let stride = this.stride;
        let dilation = this.dilation;
        let x_data = x.data;
        let k_data = this.kernel.data;
        const getPos = (step) => {
            return step * stride + (k_size - 1) * dilation + 1;
        }
        let data = [];
        let s = 0;
        let padding = this.padding;
        let padded_size = x.getDim(-1) + padding * 2;
        let rpad = padded_size - padding;
        while (getPos(s) <= padded_size) {
            let v = 0;

            for (let i = 0; i < k_size; i++) {
                v += k_data[i] * ((s < padding)?0:((s > rpad)?0:x_data[s * stride + i * dilation]));
            }

            data[s] = v;
            s += 1;
        }
        let dim_out = (padded_size - dilation *  (k_size - 1) - 1);


        const out = tensor.from(data)._src(x, this.kernel)._label(this.label);//._shape(x)

        // let max = data.reduce((r, v) => Math.max(r, Math.abs(v)), 0);
        // data = data.map(d => d / max)
        // data = data.slice(0, step + 1);
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