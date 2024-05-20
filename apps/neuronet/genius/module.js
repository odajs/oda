import {tensor} from "./torus.js";
export class Module{
    constructor(params = {}, label) {
        this.__params__ = params;
        for (let n in params){
            this[n] = params[n];
        }
        this.__init__();
        const fwd = (...args)=>{
            const out = this.forward(...args);
            out._label(out.label + ' ['+this.label+']');
            return out;
        }
        fwd.module = this;
        fwd.toString = this.toString.bind(this);
        return fwd
    }
    forward(x){
        return x;
    }
    back(g){
        return g;
    }
    get label(){
        return this.constructor.name;
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
}
export class Linear extends Module{
    __init__() {
        this.W = tensor.rand([this.d_in, this.d_out]);
        this.W._label(this.W.label + '/linear weights');
        this.W = tensor.param(this.W);
        if(this.bias){
            this.bias = tensor.rand(this.d_out);
            this.bias._label(this.bias._label + '/linear bias');
            this.bias = tensor.param(this.bias);
        }

    }
    forward(x){
        let axis = ''
        if (x.shape.length>1){
            axis = Array(x.shape.length-1).fill(65).map((v,i)=>String.fromCharCode(v+i)).join('')
        }
        x = tensor.einsum(`${axis}i, io -> ${axis}o`, [x, this.W]);
        if (this.bias)
            x = x.plus(this.bias);
        return x;
    }
    get label(){
        return this.constructor.name + ` (${this.W.shape}, ${!!this.bias})`
    }
}
export class RMSNorm extends Module {
    __init__(dim) {
        this.W = tensor.param(tensor.rand(dim));
        this.W.label = 'RMSNorm - W'
        this.bias = tensor.param(tensor.rand(dim));
        this.bias.label = 'RMSNorm - bias'
        this.eps = 1e-5;
    }
    forward(x) {
        let p = x.pow(2);
        let m = p.mean();
        let eps = m.plus(this.eps);
        let sqrt = eps.func('_rsqrt');
        let mul = this.W.mul(sqrt);
        let out = mul.mul(x);
        out = out.plus(this.bias)
        return out;
    }
    get label(){
        return this.constructor.name + ` (${this.W.shape})`
    }
}