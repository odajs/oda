import {Parameter, Tensor} from "./tor.js";
export class Module{
    constructor(...args) {
        this.__args__ = ''
        if (args.length){
            let s = this.constructor.toString();
            s = s.substr(s.indexOf('(')+1);
            s = s.substr(0, s.indexOf(')'));
            s = s.split(',');
            this.__args__= s.map((n, i)=>{
                n = n.split('=').shift().trim();
                return n +'='+ args[i];
            }).join(', ')
        }
        this.__init__(...args);
        const fwd = (...args)=>{
            const out = this.forward(...args);
            out.label += '/'+this.label;
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
        let s = `${this.label} (${this.__args__})\r\n`;
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
    __init__(in_size, out_size, bias = false) {
        this.W = Tensor.random([in_size, out_size]);
        this.W.label += '/weights';
        this.W = Parameter(this.W);
        if(bias){
            this.bias = Tensor.random([out_size]);
            this.bias.label +='/bias';
            this.bias = Parameter(this.bias);
        }

    }
    forward(x){
        x = Tensor.einsum('in, in out -> out', x, this.W);
        if (this.bias)
            x.add(this.bias);
        return x;
    }
    get label(){
        return this.constructor.name + ` (${this.W.shape}, ${!!this.bias})`
    }
}
export function linear(...args){
    return new Linear(...args)
}
export class RMSNorm extends Module {
    __init__(dim) {
        this.W = Parameter(Tensor.random(dim));
        this.W.label = 'RMSNorm - W'
        this.bias = Parameter(Tensor.random(dim));
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
export function rmsNorm(...args){
    return new RMSNorm(...args)
}

