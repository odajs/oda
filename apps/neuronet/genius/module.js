import {torus} from "./torus.js";
export class Module{
    constructor(params = {}) {
        this.__params__ = params;
        for (let n in params){
            this[n] = params[n];
        }
        this.__init__();
        const fwd = (...args)=>{
            const out = this.forward(...args);
            out.label = this.label;
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
            else if (prop.value instanceof Tensor){
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
        this.W = torus.rands(this.d_in, this.d_out);
        this.W.label += '/weights';
        this.W = torus.param(this.W);
        if(this.bias){
            this.bias = torus.rands(this.d_out);
            this.bias.label +='/bias';
            this.bias = torus.param(this.bias);
        }

    }
    forward(x){
        x = torus.einsum('i, io -> o', [x, this.W]);
        if (this.bias)
            x = x.add(this.bias);
        return x;
    }
    get label(){
        return this.constructor.name + ` (${this.W.shape}, ${!!this.bias})`
    }
}
export class RMSNorm extends Module {
    __init__(dim) {
        this.W = torus.param(torus.random(dim));
        this.W.label = 'RMSNorm - W'
        this.bias = torus.param(torus.random(dim));
        this.bias.label = 'RMSNorm - bias'
        this.eps = 1e-5;
    }
    forward(x) {
        let p = x.pow(2);
        let m = p.mean();
        let eps = m.add(this.eps);
        let sqrt = eps.func('_rsqrt');
        let mul = this.W.mul(sqrt);
        let out = mul.mul(x);
        out = out.add(this.bias)
        return out;
    }
    get label(){
        return this.constructor.name + ` (${this.W.shape})`
    }
}