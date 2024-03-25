import {Parameter, Tensor} from "./ten.js";
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
            return this.forward(...args)
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
        this.W = Parameter(Tensor.random([in_size, out_size]));
        this.bias = bias?Parameter(Tensor.random([out_size])):null;
    }
    forward(x){
        if (this.bias)
            x = Tensor.einsum('in, out, in out -> out', x, this.bias, this.W);
        else
            x = Tensor.einsum('in, in out -> out', x, this.W);
        return x;
    }
}
export function linear(...args){
    return new Linear(...args)
}
export class RMSNorm extends Module {
    __init__(dim) {
        this.V = Parameter(Tensor.ones(dim));
        this.eps = 1e-5;
    }
    forward(x) {
        let v = x._pow(2);
        v = v._mean();
        v = v._add(this.eps);
        v = v._rsqrt();
        v = Tensor.einsum('v, w -> w', v, this.V);
        x = Tensor.einsum('x, x -> x', x, v);
        return x;
    }
}
export function rmsNorm(...args){
    return new RMSNorm(...args)
}

